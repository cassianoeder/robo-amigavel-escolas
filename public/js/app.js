/* ============================================
   APP.JS — Main Orchestrator
   ============================================ */

const App = (() => {
    const robotContainer = document.getElementById('robot-container');
    const micIndicator = document.getElementById('mic-indicator');
    const micLabel = document.getElementById('mic-label');

    let config = null;
    let isProcessing = false;
    let lastActivityTime = Date.now();
    let isSleepy = false;
    let motionSustainedStart = null;
    let inactivityTimer = null;
    let lastVoiceActivityTime = Date.now();
    let motionSentThisCycle = false; // Prevent spamming motion webhooks
    let isManuallyMuted = false; // Tracks if the user clicked to mute the mic
    let idleLookDelayTimer = null;

    // ===== State Management =====

    function setMicListening() {
        micIndicator.classList.remove('inactive');
        micIndicator.classList.add('listening');
        micLabel.textContent = 'Ouvindo...';
    }

    function setMicInactive(label = 'Processando...') {
        micIndicator.classList.remove('listening');
        micIndicator.classList.add('inactive');
        micLabel.textContent = label;
    }

    function recordActivity() {
        lastActivityTime = Date.now();
        lastVoiceActivityTime = Date.now();
        motionSentThisCycle = false;

        if (isSleepy) {
            isSleepy = false;
            RobotFace.wakeUp();
            if (!isManuallyMuted) {
                setMicListening();
            } else {
                setMicInactive('Microfone Mutado');
            }
        }

        resetInactivityTimer();
    }

    // ===== Inactivity / Sleepy Mode =====

    function resetInactivityTimer() {
        if (inactivityTimer) clearInterval(inactivityTimer);

        inactivityTimer = setInterval(() => {
            if (isProcessing) return;

            const elapsed = (Date.now() - lastActivityTime) / 1000;
            const timeout = config ? config.timeoutSonolencia : 40;

            if (elapsed >= timeout && !isSleepy) {
                isSleepy = true;
                RobotFace.setSleepy();
            }
        }, 2000);
    }

    // ===== Motion Detection Handling =====

    function handleMotion(direction) {
        if (idleLookDelayTimer) {
            clearTimeout(idleLookDelayTimer);
            idleLookDelayTimer = null;
        }

        // Move eyes toward motion direction
        RobotFace.lookAt(direction.dx * 0.8, direction.dy * 0.5);

        // Check if we should wake up from sleepy
        if (isSleepy) {
            if (!motionSustainedStart) {
                motionSustainedStart = Date.now();
            } else if (Date.now() - motionSustainedStart >= 2000) {
                // 2 seconds sustained motion -> wake up
                isSleepy = false;
                motionSustainedStart = null;
                RobotFace.wakeUp();
                lastActivityTime = Date.now();
                if (!isManuallyMuted) {
                    setMicListening();
                } else {
                    setMicInactive('Microfone Mutado');
                }
            }
        } else {
            // Keep the robot awake while there's continuous motion
            lastActivityTime = Date.now();
            motionSustainedStart = null;
        }

        // Send motion event if 50s without voice activity
        const timeSinceVoice = (Date.now() - lastVoiceActivityTime) / 1000;
        if (timeSinceVoice >= 50 && !motionSentThisCycle && !isProcessing) {
            motionSentThisCycle = true;
            sendMotionEvent();
        }
    }

    function handleNoMotion() {
        motionSustainedStart = null;
        
        if (!isProcessing && !isSleepy) {
            if (!idleLookDelayTimer) {
                idleLookDelayTimer = setTimeout(() => {
                    RobotFace.startIdleLook();
                }, 1500); // start looking around after 1.5s of no motion
            }
        }
    }

    async function sendMotionEvent() {
        if (!config || isManuallyMuted) return;
        console.log('[Robô] Enviando evento de movimento detectado');
        
        try {
            const response = await Webhook.enviarMovimento(config);
            if (response) {
                // n8n returned a greeting or something, speak it
                await speakResponse(response);
            }
        } catch (e) {
            console.error('Erro ao enviar movimento:', e);
            RobotFace.setConfused(4000);
        }
    }

    // ===== Speech Flow =====

    async function handleTranscript(text) {
        if (isProcessing || !config) return;

        console.log('[Robô] Texto transcrito:', text);
        recordActivity();

        // Switch to thinking state
        isProcessing = true;
        Speech.disableMic();
        setMicInactive('Pensando...');
        RobotFace.setThinking();

        try {
            // Send to n8n
            const response = await Webhook.enviarFala(config, text);

            if (response) {
                await speakResponse(response);
            } else {
                console.warn('[Robô] Webhook retornou resposta vazia');
                RobotFace.setConfused(4000);
                finishProcessing();
            }
        } catch (e) {
            console.error('Erro no fluxo de fala:', e);
            RobotFace.setConfused(4000);
            finishProcessing();
        }
    }

    async function speakResponse(text) {
        console.log('[Robô] Falando:', text);

        // Detect visual effects from keywords
        const effect = Speech.detectEffect(text);

        setMicInactive('Falando...');
        RobotFace.setSpeaking();
        RobotFace.setHappy(4000); // Show happy face/eyes during the first 4s of speech

        if (effect) {
            RobotFace.startEffect(effect);
        }

        await Speech.speak(text, config.vozIndex, config.velocidadeFala);

        if (effect) {
            RobotFace.stopEffect();
        }

        // Wait 1 second after finishing speech before re-enabling mic
        setTimeout(() => {
            finishProcessing();
        }, 1000);
    }

    function finishProcessing() {
        isProcessing = false;
        RobotFace.setIdle();
        
        if (!isManuallyMuted) {
            Speech.enableMic();
            setMicListening();
        } else {
            setMicInactive('Microfone Mutado');
        }
        
        recordActivity();
    }

    // ===== Initialization =====

    function applyHatConfig(cfg) {
        const hat = document.getElementById('robot-hat');
        const hatLogoContainer = document.getElementById('hat-logo-container');
        
        if (!hat) {
            console.warn('[Hat] Elemento robot-hat não encontrado');
            return;
        }
        
        console.log('[Hat] Aplicando config:', { hatEnabled: cfg.hatEnabled, hatColor: cfg.hatColor, hasLogo: !!cfg.hatLogo });
        
        // Show/hide hat
        if (cfg.hatEnabled) {
            hat.classList.remove('hidden');
            
            // Apply hat color
            hat.style.setProperty('--hat-color', cfg.hatColor || '#333333');
            
            // Apply logo - remove existing and recreate
            if (hatLogoContainer) {
                hatLogoContainer.innerHTML = '';
                
                if (cfg.hatLogo) {
                    const image = document.createElementNS("http://www.w3.org/2000/svg", "image");
                    image.setAttribute('id', 'hat-logo');
                    image.setAttributeNS('http://www.w3.org/1999/xlink', 'href', cfg.hatLogo);
                    image.setAttribute('x', '320');
                    image.setAttribute('y', '65');
                    image.setAttribute('width', '160');
                    image.setAttribute('height', '40');
                    hatLogoContainer.appendChild(image);
                    console.log('[Hat] Logo adicionado ao boné');
                } else {
                    console.log('[Hat] Nenhum logo especificado');
                }
            } else {
                console.warn('[Hat] Container de logo não encontrado');
            }
        } else {
            hat.classList.add('hidden');
            console.log('[Hat] Boné ocultado');
        }
        
        // Force browser to re-render the SVG
        if (hat && hat.parentNode) {
            const svgElement = hat.closest('svg');
            if (svgElement) {
                svgElement.style.display = 'none';
                svgElement.offsetHeight; // trigger reflow
                svgElement.style.display = '';
            }
        }
    }

    async function startRobot(cfg) {
        config = cfg;
        console.log('[Robô] Iniciando com config:', { webhook: cfg.webhookUrl, cor: cfg.corDestaque });

        // Show robot face
        robotContainer.classList.remove('hidden');

        // Apply hat configuration (with small delay to ensure SVG is rendered)
        setTimeout(() => {
            applyHatConfig(cfg);
        }, 100);

        // Request permissions
        const micOk = await Speech.requestMicPermission();
        const camOk = await Motion.requestCamera();

        if (!micOk) {
            alert('O robô precisa de permissão de microfone para funcionar!');
        }

        if (!camOk) {
            console.warn('Câmera não disponível. Detecção de movimento desativada.');
        }

        // Initialize speech recognition
        Speech.init();

        // Set up callbacks
        Speech.onTranscript(handleTranscript);
        Speech.onListeningStart(() => {
            if (!isProcessing && !isManuallyMuted) setMicListening();
        });
        Speech.onListeningStop(() => {
            if (!isProcessing) {
                if (isManuallyMuted) {
                    setMicInactive('Microfone Mutado');
                } else {
                    setMicInactive('Microfone pausado');
                }
            }
        });

        // Show/hide noise warning based on ambient loudness
        Speech.onNoiseLevelChange((isNoisy) => {
            const noiseWarning = document.getElementById('noise-warning');
            if (noiseWarning) {
                if (isNoisy && !isProcessing && !isSleepy) {
                    noiseWarning.classList.remove('hidden');
                } else {
                    noiseWarning.classList.add('hidden');
                }
            }
        });

        // Click to Mute Feature
        micIndicator.addEventListener('click', () => {
            if (!config || isProcessing) return; // Wait until ready or idle

            if (isManuallyMuted) {
                // Unmute
                isManuallyMuted = false;
                Speech.enableMic();
                setMicListening();
                
                // Wake up immediately when unmuting
                isSleepy = false;
                RobotFace.wakeUp();
                lastActivityTime = Date.now();
                lastVoiceActivityTime = Date.now();
            } else {
                // Mute
                isManuallyMuted = true;
                Speech.disableMic();
                setMicInactive('Microfone Mutado');

                // This click IS the user gesture — create/inject AudioContext now
                // so RobotFace.startSnoring() can play audio without being blocked
                const AudioContextClass = window.AudioContext || window.webkitAudioContext;
                if (AudioContextClass) {
                    const freshCtx = new AudioContextClass();
                    // Resume immediately (we're inside a click handler)
                    freshCtx.resume().then(() => {
                        RobotFace.setAudioContext(freshCtx);
                        // Force sleep mode after context is ready
                        isSleepy = true;
                        RobotFace.setSleepy();
                    });
                } else {
                    isSleepy = true;
                    RobotFace.setSleepy();
                }
            }
        });

        // Motion detection
        Motion.onMotionDetected(handleMotion);
        Motion.onNoMotion(handleNoMotion);

        // Start systems
        RobotFace.init();
        Speech.startListening();
        if (camOk) Motion.startDetection();

        // Start background microphone volume analysis for sound level reactions (shout/clap -> surprised)
        Speech.startVolumeAnalysis(() => {
            if (!isSleepy && !isProcessing) {
                console.log('[Robô] Som alto detectado! Reagindo com surpresa.');
                RobotFace.setSurprised(3000);
            }
        }).then(() => {
            // Share the authorized AudioContext with RobotFace so snoring works
            const ctx = Speech.getAudioContext();
            if (ctx) RobotFace.setAudioContext(ctx);
        }).catch(() => {
            // startVolumeAnalysis doesn't return a promise if audioContext already exists; try directly
            const ctx = Speech.getAudioContext();
            if (ctx) RobotFace.setAudioContext(ctx);
        });

        // Also inject immediately in case startVolumeAnalysis was already called before
        setTimeout(() => {
            const ctx = Speech.getAudioContext();
            if (ctx) RobotFace.setAudioContext(ctx);
        }, 1000);

        setMicListening();
        resetInactivityTimer();
        lastActivityTime = Date.now();
        lastVoiceActivityTime = Date.now();

        // MOBILE: If TTS wasn't unlocked yet (auto-start, no form tap),
        // listen for the FIRST user interaction to unlock it
        if (Speech.isMobile) {
            const unlockOnTouch = () => {
                Speech.unlockTTS();
                document.removeEventListener('touchstart', unlockOnTouch);
                document.removeEventListener('click', unlockOnTouch);
            };
            document.addEventListener('touchstart', unlockOnTouch, { once: true });
            document.addEventListener('click', unlockOnTouch, { once: true });
        }
    }

    // ===== Config ready handler =====

    Config.onReady((cfg) => {
        // Reload config in case it changed
        config = cfg;
        
        if (robotContainer.classList.contains('hidden')) {
            startRobot(cfg);
        } else {
            // Config updated while robot is running
            console.log('[Robô] Configuração atualizada');
            document.body.setAttribute('data-theme', cfg.corDestaque);
            // Apply hat configuration
            applyHatConfig(cfg);
        }
    });

    // Logout logic
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', async () => {
            try {
                await fetch('/api/auth/logout', { method: 'POST' });
                window.location.href = '/login';
            } catch (err) {
                console.error('Erro ao sair:', err);
                window.location.href = '/login';
            }
        });
    }

    // Boot
    Config.init();
})();
