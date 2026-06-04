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
                finishProcessing();
            }
        } catch (e) {
            console.error('Erro no fluxo de fala:', e);
            finishProcessing();
        }
    }

    async function speakResponse(text) {
        console.log('[Robô] Falando:', text);

        setMicInactive('Falando...');
        RobotFace.setSpeaking();

        await Speech.speak(text, config.vozIndex, config.velocidadeFala);

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

    async function startRobot(cfg) {
        config = cfg;
        console.log('[Robô] Iniciando com config:', { webhook: cfg.webhookUrl, cor: cfg.corDestaque });

        // Show robot face
        robotContainer.classList.remove('hidden');

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

        // Click to Mute Feature
        micIndicator.addEventListener('click', () => {
            if (!config || isProcessing) return; // Wait until ready or idle

            if (isManuallyMuted) {
                // Unmute
                isManuallyMuted = false;
                Speech.enableMic();
                setMicListening();
            } else {
                // Mute
                isManuallyMuted = true;
                Speech.disableMic();
                setMicInactive('Microfone Mutado');
            }
        });

        // Motion detection
        Motion.onMotionDetected(handleMotion);
        Motion.onNoMotion(handleNoMotion);

        // Start systems
        RobotFace.init();
        Speech.startListening();
        if (camOk) Motion.startDetection();

        setMicListening();
        resetInactivityTimer();
        lastActivityTime = Date.now();
        lastVoiceActivityTime = Date.now();
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
        }
    });

    // Boot
    Config.init();
})();
