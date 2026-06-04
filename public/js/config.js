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
        isKidsMode: false
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
    const settingsBtn = document.getElementById('btn-settings');
    const kidsBtn = document.getElementById('btn-kids-mode');

    // Populate form with current config
    function populateForm() {
        webhookInput.value = current.webhookUrl || '';
        tokenInput.value = current.jwtToken || '';
        rateSlider.value = current.velocidadeFala;
        rateValue.textContent = current.velocidadeFala.toFixed(1);
        sleepSelect.value = current.timeoutSonolencia;

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
        get sessionId() { return current.sessaoId; },
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
