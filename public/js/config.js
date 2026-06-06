/* ============================================
   CONFIG.JS — Modal de Configuração + localStorage
   ============================================ */

const Config = (() => {
    const STORAGE_KEY = 'robo_amigavel_config';

    // Defaults
    const defaults = {
        webhookUrl: '',
        jwtToken: '',
        corDestaque: 'azul-escuro',
        vozIndex: 0,
        velocidadeFala: 1.0,
        timeoutSonolencia: 40,
        sessaoId: '',
        isKidsMode: false,
        topicDia: '',
        volumeRobo: 100, // Volume (0-130) percentage, default 100
        hatEnabled: false,      // Mostrar/ocultar boné
        hatColor: '#333333',   // Cor do boné (hex)
        hatLogo: '',            // Logo em base64 ou URL (PNG/SVG)
        robotName: 'Robô',      // Nome do robô (obrigatório)
        pais: '',               // País
        estado: '',             // Estado
        cidade: '',             // Cidade
        nomeEscola: '',         // Nome da escola
        salaLocal: '',          // Sala ou local físico
        codigoBNCC: '',         // Código BNCC (opcional)
        descricaoBNCC: ''       // Descrição do componente BNCC (opcional)
    };

    // Generate UUID v4
    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    // Load from localStorage
    function load() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                return { ...defaults, ...parsed };
            }
        } catch (e) {
            console.warn('Erro ao carregar config:', e);
        }
        return { ...defaults };
    }

    // Save to localStorage
    function save(config) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
        } catch (e) {
            console.warn('Erro ao salvar config:', e);
        }
    }

    // Current config
    let current = load();

    // Ensure session ID
    if (!current.sessaoId) {
        current.sessaoId = generateUUID();
        save(current);
    }

    // DOM elements
    const overlay = document.getElementById('config-overlay');
    const form = document.getElementById('config-form');
    const robotNameInput = document.getElementById('cfg-robot-name');
    const webhookInput = document.getElementById('cfg-webhook');
    const tokenInput = document.getElementById('cfg-token');
    const paisInput = document.getElementById('cfg-pais');
    const estadoInput = document.getElementById('cfg-estado');
    const cidadeInput = document.getElementById('cfg-cidade');
    const nomeEscolaInput = document.getElementById('cfg-nome-escola');
    const salaLocalInput = document.getElementById('cfg-sala-local');
    const colorBtns = document.querySelectorAll('.color-btn');
    const voiceSelect = document.getElementById('cfg-voice');
    const rateSlider = document.getElementById('cfg-rate');
    const rateValue = document.getElementById('rate-value');
    const sleepSelect = document.getElementById('cfg-sleep');
    const volumeSlider = document.getElementById('cfg-volume');
    const volumeValue = document.getElementById('volume-value');
    const hatEnabledCheckbox = document.getElementById('cfg-hat-enabled');
    const hatColorInput = document.getElementById('cfg-hat-color');
    const hatLogoInput = document.getElementById('cfg-hat-logo');
    const hatLogoPreview = document.getElementById('hat-logo-preview');
    const settingsBtn = document.getElementById('btn-settings');
    const kidsBtn = document.getElementById('btn-kids-mode');
    const topicBtn = document.getElementById('btn-daily-topic');
    const topicIndicator = document.getElementById('topic-active-indicator');
    const topicOverlay = document.getElementById('daily-topic-overlay');
    const topicForm = document.getElementById('daily-topic-form');
    const topicInput = document.getElementById('cfg-topic');
    const bnccCodigoInput = document.getElementById('cfg-bncc-codigo');
    const bnccDescricaoInput = document.getElementById('cfg-bncc-descricao');
    const clearTopicBtn = document.getElementById('btn-clear-topic');
    const testWebhookBtn = document.getElementById('btn-test-webhook');

    // Populate form with current config
    function populateForm() {
        robotNameInput.value = current.robotName || 'Robô';
        webhookInput.value = current.webhookUrl || '';
        tokenInput.value = current.jwtToken || '';
        paisInput.value = current.pais || '';
        estadoInput.value = current.estado || '';
        cidadeInput.value = current.cidade || '';
        nomeEscolaInput.value = current.nomeEscola || '';
        salaLocalInput.value = current.salaLocal || '';
        rateSlider.value = current.velocidadeFala;
        rateValue.textContent = current.velocidadeFala.toFixed(1);
        sleepSelect.value = current.timeoutSonolencia;
        volumeSlider.value = current.volumeRobo;
        volumeValue.textContent = current.volumeRobo;
        if (hatEnabledCheckbox) {
            hatEnabledCheckbox.checked = current.hatEnabled || false;
        }
        if (hatColorInput) {
            hatColorInput.value = current.hatColor || '#333333';
        }
        if (hatLogoPreview && current.hatLogo) {
            hatLogoPreview.src = current.hatLogo;
            hatLogoPreview.classList.remove('hidden');
        }
        // Enable/disable test button based on webhook
        if (testWebhookBtn) {
            testWebhookBtn.disabled = !webhookInput.value.trim();
        }
        // Update topic indicator visibility based on stored topic
        if (topicIndicator) {
            topicIndicator.classList.toggle('hidden', !current.topicDia || current.topicDia.trim().length === 0);
        }

        // Color selection
        colorBtns.forEach(btn => {
            btn.classList.toggle('selected', btn.dataset.color === current.corDestaque);
        });

        // Apply theme immediately
        document.body.setAttribute('data-theme', current.corDestaque);
    }

    // Load available voices
    function loadVoices() {
        const voices = speechSynthesis.getVoices();
        voiceSelect.innerHTML = '';

        if (voices.length === 0) {
            voiceSelect.innerHTML = '<option value="">Carregando vozes...</option>';
            return;
        }

        voices.forEach((voice, index) => {
            const opt = document.createElement('option');
            opt.value = index;
            opt.textContent = `${voice.name} (${voice.lang})`;
            if (index === current.vozIndex) opt.selected = true;
            voiceSelect.appendChild(opt);
        });
    }

    // Color button clicks
    colorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            colorBtns.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            document.body.setAttribute('data-theme', btn.dataset.color);
        });
    });

    // Rate slider
    rateSlider.addEventListener('input', () => {
        rateValue.textContent = parseFloat(rateSlider.value).toFixed(1);
    });

    // Webhook input listener to enable/disable test button
    webhookInput.addEventListener('input', () => {
        if (testWebhookBtn) {
            testWebhookBtn.disabled = !webhookInput.value.trim();
        }
    });

    // Volume slider
    volumeSlider.addEventListener('input', () => {
        volumeValue.textContent = parseInt(volumeSlider.value);
    });

    // Open modal
    function openModal() {
        populateForm();
        loadVoices();
        overlay.classList.add('active');
    }

    // Close modal
    function closeModal() {
        overlay.classList.remove('active');
    }

    // Open topic modal
    function openTopicModal() {
        if (topicInput) {
            topicInput.value = current.topicDia || '';
        }
        if (bnccCodigoInput) {
            bnccCodigoInput.value = current.codigoBNCC || '';
        }
        if (bnccDescricaoInput) {
            bnccDescricaoInput.value = current.descricaoBNCC || '';
        }
        if (topicOverlay) {
            topicOverlay.classList.add('active');
        }
    }

    // Close topic modal
    function closeTopicModal() {
        if (topicOverlay) {
            topicOverlay.classList.remove('active');
        }
    }

    // Settings button
    settingsBtn.addEventListener('click', openModal);

    // Voices loading (async in some browsers)
    speechSynthesis.addEventListener('voiceschanged', loadVoices);
    // Also try on load
    setTimeout(loadVoices, 200);

    // Form submission
    let onConfigReady = null;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const webhook = webhookInput.value.trim();
        if (!webhook) {
            webhookInput.focus();
            return;
        }

        // Gather config
        const selectedColor = document.querySelector('.color-btn.selected');
        current.robotName = robotNameInput.value.trim() || 'Robô';
        current.webhookUrl = webhook;
        current.jwtToken = tokenInput.value.trim();
        current.pais = paisInput.value.trim();
        current.estado = estadoInput.value.trim();
        current.cidade = cidadeInput.value.trim();
        current.nomeEscola = nomeEscolaInput.value.trim();
        current.salaLocal = salaLocalInput.value.trim();
        current.corDestaque = selectedColor ? selectedColor.dataset.color : 'azul-escuro';
        current.vozIndex = parseInt(voiceSelect.value) || 0;
        current.velocidadeFala = parseFloat(rateSlider.value) || 1.0;
        current.timeoutSonolencia = parseInt(sleepSelect.value) || 40;
        current.volumeRobo = parseInt(volumeSlider.value) || 100;
        current.hatEnabled = hatEnabledCheckbox ? hatEnabledCheckbox.checked : false;
        current.hatColor = hatColorInput ? hatColorInput.value : '#333333';
        current.hatLogo = hatLogoInput ? hatLogoInput.value : '';

        // Ensure session ID
        if (!current.sessaoId) {
            current.sessaoId = generateUUID();
        }

        save(current);
        document.body.setAttribute('data-theme', current.corDestaque);

        // CRITICAL FOR MOBILE: Unlock TTS inside user gesture (tap/click)
        // Android Chrome blocks speechSynthesis.speak() unless triggered from user gesture
        if (typeof Speech !== 'undefined' && Speech.unlockTTS) {
            Speech.unlockTTS();
        }

        closeModal();

        if (onConfigReady) {
            onConfigReady(current);
        }
    });

    // Public API
    return {
        get current() { return { ...current }; },
        get isConfigured() { return !!current.webhookUrl; },
        openModal,
        closeModal,
        onReady(callback) { onConfigReady = callback; },
        getTopic() { return current.topicDia; },
        regenerateSession() {
            current.sessaoId = generateUUID();
            save(current);
            return current.sessaoId;
        },
        init() {
            populateForm();
            loadVoices();

            // Set up Kids Mode button state and event listener
            if (kidsBtn) {
                kidsBtn.classList.toggle('active', !!current.isKidsMode);
                kidsBtn.addEventListener('click', () => {
                    current.isKidsMode = !current.isKidsMode;
                    kidsBtn.classList.toggle('active', current.isKidsMode);
                    save(current);
                    if (onConfigReady) {
                        onConfigReady(current);
                    }
                });
            }

            // Set up Fullscreen button
            const fullscreenBtn = document.getElementById('btn-fullscreen');
            if (fullscreenBtn) {
                const requestFS = document.documentElement.requestFullscreen ||
                                  document.documentElement.webkitRequestFullscreen ||
                                  document.documentElement.mozRequestFullScreen ||
                                  document.documentElement.msRequestFullscreen;

                const exitFS = document.exitFullscreen ||
                               document.webkitExitFullscreen ||
                               document.mozCancelFullScreen ||
                               document.msExitFullscreen;

                const getFSElement = () => document.fullscreenElement ||
                                           document.webkitFullscreenElement ||
                                           document.mozFullScreenElement ||
                                           document.msFullscreenElement;

                const toggleFullscreen = () => {
                    if (!getFSElement()) {
                        if (requestFS) {
                            requestFS.call(document.documentElement).catch(err => {
                                console.warn(`Erro ao ativar tela cheia: ${err.message}`);
                            });
                        }
                    } else {
                        if (exitFS) {
                            exitFS.call(document).catch(err => {
                                console.warn(`Erro ao sair da tela cheia: ${err.message}`);
                            });
                        }
                    }
                };

                fullscreenBtn.addEventListener('click', toggleFullscreen);

                const handleFSChange = () => {
                    if (getFSElement()) {
                        fullscreenBtn.textContent = '✕';
                        fullscreenBtn.title = 'Sair da Tela Cheia';
                    } else {
                        fullscreenBtn.textContent = '⛶';
                        fullscreenBtn.title = 'Tela Cheia';
                    }
                };

                document.addEventListener('fullscreenchange', handleFSChange);
                document.addEventListener('webkitfullscreenchange', handleFSChange);
                document.addEventListener('mozfullscreenchange', handleFSChange);
                document.addEventListener('MSFullscreenChange', handleFSChange);
            }

            // Hat logo upload handler
            if (hatLogoInput) {
                hatLogoInput.addEventListener('change', async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    
                    // Validate file size (500KB max)
                    if (file.size > 500 * 1024) {
                        alert('O logo deve ter no máximo 500KB.');
                        hatLogoInput.value = '';
                        return;
                    }
                    
                    // Validate file type
                    if (!file.type.match('image/(png|svg\\+xml)')) {
                        alert('Apenas arquivos PNG ou SVG são permitidos.');
                        hatLogoInput.value = '';
                        return;
                    }
                    
                    // Convert to base64
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const base64 = event.target.result;
                        hatLogoInput.value = base64;
                        
                        // Show preview
                        if (hatLogoPreview) {
                            hatLogoPreview.src = base64;
                            hatLogoPreview.classList.remove('hidden');
                        }
                        
                        // Show remove button
                        const removeBtn = document.getElementById('btn-remove-logo');
                        if (removeBtn) {
                            removeBtn.classList.remove('hidden');
                        }
                    };
                    reader.readAsDataURL(file);
                });
            }

            // Hat enabled/disabled toggle
            if (hatEnabledCheckbox) {
                hatEnabledCheckbox.addEventListener('change', (e) => {
                    const hatGroups = document.querySelectorAll('.hat-config-group');
                    hatGroups.forEach(group => {
                        group.classList.toggle('hidden', !e.target.checked);
                    });
                });
            }

            // Remove logo button
            const removeLogoBtn = document.getElementById('btn-remove-logo');
            if (removeLogoBtn) {
                removeLogoBtn.addEventListener('click', () => {
                    if (hatLogoInput) hatLogoInput.value = '';
                    if (hatLogoPreview) {
                        hatLogoPreview.src = '';
                        hatLogoPreview.classList.add('hidden');
                    }
                    removeLogoBtn.classList.add('hidden');
                });
            }

            // Test webhook button
            if (testWebhookBtn) {
                testWebhookBtn.addEventListener('click', async () => {
                    const webhook = webhookInput.value.trim();
                    if (!webhook) {
                        alert('Preencha a URL do webhook para testar.');
                        return;
                    }

                    // Create temporary config with current form values
                    const testConfig = {
                        webhookUrl: webhook,
                        jwtToken: tokenInput.value.trim(),
                        robotName: robotNameInput.value.trim() || 'Robô de Teste',
                        sessaoId: current.sessaoId || 'teste-' + Date.now(),
                        isKidsMode: current.isKidsMode || false,
                        topicDia: current.topicDia || '',
                        pais: paisInput.value.trim(),
                        estado: estadoInput.value.trim(),
                        cidade: cidadeInput.value.trim(),
                        nomeEscola: nomeEscolaInput.value.trim(),
                        salaLocal: salaLocalInput.value.trim()
                    };

                    testWebhookBtn.disabled = true;
                    testWebhookBtn.textContent = 'Enviando...';

                    try {
                        if (typeof Webhook !== 'undefined' && Webhook.enviarTeste) {
                            const response = await Webhook.enviarTeste(testConfig);
                            if (response) {
                                alert('✅ Teste enviado com sucesso!\n\nResposta do webhook:\n' + response);
                            } else {
                                alert('⚠️ Teste enviado, mas não houve resposta do webhook.');
                            }
                        } else {
                            alert('❌ Módulo Webhook não disponível.');
                        }
                    } catch (error) {
                        alert('❌ Erro ao enviar teste: ' + error.message);
                    } finally {
                        testWebhookBtn.disabled = false;
                        testWebhookBtn.innerHTML = '<span class="btn-icon">🧪</span> Testar Webhook';
                    }
                });
            }

            // Set up Daily Topic button
            if (topicBtn) {
                topicBtn.addEventListener('click', openTopicModal);
                // Show indicator if topic is set
                if (topicIndicator) {
                    topicIndicator.classList.toggle('hidden', !current.topicDia || current.topicDia.trim().length === 0);
                }
            }

            // Set up Daily Topic Form listeners
            if (topicForm) {
                topicForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const topic = topicInput ? topicInput.value.trim().substring(0, 70) : '';
                    current.topicDia = topic;
                    current.codigoBNCC = bnccCodigoInput ? bnccCodigoInput.value.trim() : '';
                    current.descricaoBNCC = bnccDescricaoInput ? bnccDescricaoInput.value.trim() : '';
                    save(current);
                    if (topicIndicator) {
                        topicIndicator.classList.toggle('hidden', !current.topicDia || current.topicDia.trim().length === 0);
                    }
                    closeTopicModal();
                    if (onConfigReady) {
                        onConfigReady(current);
                    }
                });
            }

            if (clearTopicBtn) {
                clearTopicBtn.addEventListener('click', () => {
                    if (topicInput) topicInput.value = '';
                    current.topicDia = '';
                    save(current);
                    if (topicIndicator) {
                        topicIndicator.classList.toggle('hidden', true);
                    }
                    closeTopicModal();
                    if (onConfigReady) {
                        onConfigReady(current);
                    }
                });
            }

            if (topicOverlay) {
                topicOverlay.addEventListener('click', (e) => {
                    if (e.target === topicOverlay) {
                        closeTopicModal();
                    }
                });
            }

            // If already configured, auto-close modal and notify
            if (current.webhookUrl) {
                closeModal();
                if (onConfigReady) {
                    setTimeout(() => onConfigReady(current), 300);
                }
            }
        }
    };
})();
