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
        volumeRobo: 100 // Volume (0-130) percentage, default 100
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
    const webhookInput = document.getElementById('cfg-webhook');
    const tokenInput = document.getElementById('cfg-token');
    const colorBtns = document.querySelectorAll('.color-btn');
    const voiceSelect = document.getElementById('cfg-voice');
    const rateSlider = document.getElementById('cfg-rate');
    const rateValue = document.getElementById('rate-value');
    const sleepSelect = document.getElementById('cfg-sleep');
    const volumeSlider = document.getElementById('cfg-volume');
    const volumeValue = document.getElementById('volume-value');
    const settingsBtn = document.getElementById('btn-settings');
    const kidsBtn = document.getElementById('btn-kids-mode');
    const topicBtn = document.getElementById('btn-daily-topic');
    const topicIndicator = document.getElementById('topic-active-indicator');
    const topicOverlay = document.getElementById('daily-topic-overlay');
    const topicForm = document.getElementById('daily-topic-form');
    const topicInput = document.getElementById('cfg-topic');
    const clearTopicBtn = document.getElementById('btn-clear-topic');

    // Populate form with current config
    function populateForm() {
        webhookInput.value = current.webhookUrl || '';
        tokenInput.value = current.jwtToken || '';
        rateSlider.value = current.velocidadeFala;
        rateValue.textContent = current.velocidadeFala.toFixed(1);
        sleepSelect.value = current.timeoutSonolencia;
        volumeSlider.value = current.volumeRobo;
        volumeValue.textContent = current.volumeRobo;
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
        current.webhookUrl = webhook;
        current.jwtToken = tokenInput.value.trim();
        current.corDestaque = selectedColor ? selectedColor.dataset.color : 'azul-escuro';
        current.vozIndex = parseInt(voiceSelect.value) || 0;
        current.velocidadeFala = parseFloat(rateSlider.value) || 1.0;
        current.timeoutSonolencia = parseInt(sleepSelect.value) || 40;
        current.volumeRobo = parseInt(volumeSlider.value) || 100;

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
                    const topic = topicInput ? topicInput.value.trim().substring(0, 50) : '';
                    current.topicDia = topic;
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
