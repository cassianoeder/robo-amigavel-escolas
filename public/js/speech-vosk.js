/* ============================================
   SPEECH-VOSK.JS — Wrapper do Vosk-Browser (STT Offline)
   ============================================
   Esta é uma implementação BETA que permite reconhecimento de voz
   offline via WebAssembly. Funciona em Firefox e Android.

   O modelo é carregado sob demanda via CDN jsdelivr.
*/

const VoskSTT = (() => {
    // ===== State =====
    let model = null;
    let recognizer = null;
    let audioContext = null;
    let mediaStream = null;
    let recognizerNode = null;
    let sourceNode = null;
    let isListening = false;
    let isInitialized = false;
    let isInitializing = false;

    // Callbacks
    let onTranscriptCallback = null;
    let onErrorCallback = null;

    // Vosk library (loaded dynamically)
    let Vosk = null;

    // ===== Model Loading =====
    // CDN URLs for the Vosk library and Portuguese model
    const VOSK_LIB_URL = 'https://cdn.jsdelivr.net/npm/vosk-browser@0.0.5/dist/vosk.js';
    // Small Portuguese model (~50MB) hosted on jsdelivr
    const MODEL_URL = 'https://cdn.jsdelivr.net/npm/vosk-models@0.0.5/vosk-model-small-pt-0.3.tar.gz';

    // Load the Vosk WASM library dynamically
    async function loadVoskLibrary() {
        if (window.Vosk) {
            Vosk = window.Vosk;
            return;
        }

        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = VOSK_LIB_URL;
            script.async = true;
            script.onload = () => {
                Vosk = window.Vosk;
                if (Vosk) {
                    console.log('[Vosk] Biblioteca carregada');
                    resolve();
                } else {
                    reject(new Error('Vosk não foi exposto como window.Vosk'));
                }
            };
            script.onerror = () => reject(new Error('Falha ao carregar biblioteca Vosk'));
            document.head.appendChild(script);
        });
    }

    // ===== Initialization =====
    async function init() {
        if (isInitialized) return true;
        if (isInitializing) {
            // Wait for existing init to complete
            while (isInitializing) {
                await new Promise(r => setTimeout(r, 100));
            }
            return isInitialized;
        }

        isInitializing = true;

        try {
            // 1. Load the Vosk library
            console.log('[Vosk] Carregando biblioteca...');
            await loadVoskLibrary();

            // 2. Set log level (0 = no logs, -1 = errors only)
            if (Vosk.setLogLevel) {
                Vosk.setLogLevel(-1);
            }

            // 3. Load the model (this may take a while - ~50MB download)
            console.log('[Vosk] Baixando modelo de português (~50MB)...');
            console.log('[Vosk] Esta operação pode demorar alguns minutos na primeira vez.');

            // Create a wrapper to track download progress
            const channel = new MessageChannel();
            const progressCallback = (event) => {
                if (event.data && event.data.type === 'progress' && event.data.data) {
                    const { loaded, total } = event.data.data;
                    if (total) {
                        const percent = ((loaded / total) * 100).toFixed(1);
                        console.log(`[Vosk] Download: ${percent}% (${(loaded / 1024 / 1024).toFixed(1)}MB / ${(total / 1024 / 1024).toFixed(1)}MB)`);
                    }
                }
            };
            channel.port1.onmessage = progressCallback;

            // Try with progress callback first, fall back to simple
            try {
                model = await Vosk.createModel(MODEL_URL, undefined, channel.port2);
            } catch (e) {
                console.warn('[Vosk] Falha com callback de progresso, tentando simples...');
                model = await Vosk.createModel(MODEL_URL);
            }

            console.log('[Vosk] Modelo carregado com sucesso');

            // 4. Create a recognizer
            recognizer = new model.KaldiRecognizer(16000);
            recognizer.setWords(true);
            recognizer.on('result', (message) => {
                const text = (message && message.result && message.result.text) || '';
                if (text && text.trim().length > 0 && onTranscriptCallback) {
                    console.log('[Vosk] Resultado:', text);
                    onTranscriptCallback(text.trim());
                }
            });
            recognizer.on('partialresult', (message) => {
                const partial = (message && message.result && message.result.partial) || '';
                // Partial results could be exposed in the future if needed
                if (partial) {
                    console.log('[Vosk] Parcial:', partial);
                }
            });

            isInitialized = true;
            isInitializing = false;
            console.log('[Vosk] Inicialização completa');
            return true;
        } catch (e) {
            isInitializing = false;
            const errorMsg = `Falha ao inicializar Vosk: ${e.message || e}`;
            console.error('[Vosk]', errorMsg);
            if (onErrorCallback) onErrorCallback(errorMsg);
            throw e;
        }
    }

    // ===== Start/Stop Recognition =====
    async function start() {
        if (!isInitialized || !recognizer) {
            console.warn('[Vosk] Reconhecedor não inicializado');
            return;
        }
        if (isListening) return;

        try {
            // Get microphone stream
            mediaStream = await navigator.mediaDevices.getUserMedia({
                video: false,
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    channelCount: 1,
                    sampleRate: 16000
                }
            });

            // Create audio context
            audioContext = new (window.AudioContext || window.webkitAudioContext)({
                sampleRate: 16000
            });

            // Create script processor for feeding audio to Vosk
            recognizerNode = audioContext.createScriptProcessor(4096, 1, 1);
            recognizerNode.onaudioprocess = (event) => {
                try {
                    recognizer.acceptWaveform(event.inputBuffer);
                } catch (e) {
                    console.warn('[Vosk] acceptWaveform falhou:', e);
                }
            };

            // Connect nodes
            sourceNode = audioContext.createMediaStreamSource(mediaStream);
            sourceNode.connect(recognizerNode);
            recognizerNode.connect(audioContext.destination);

            isListening = true;
            console.log('[Vosk] Escuta iniciada');
        } catch (e) {
            const errorMsg = `Erro ao iniciar escuta Vosk: ${e.message || e}`;
            console.error('[Vosk]', errorMsg);
            if (onErrorCallback) onErrorCallback(errorMsg);
            // Cleanup on error
            stop();
        }
    }

    function stop() {
        if (!isListening) return;

        try {
            if (recognizerNode) {
                recognizerNode.disconnect();
                recognizerNode = null;
            }
            if (sourceNode) {
                sourceNode.disconnect();
                sourceNode = null;
            }
            if (mediaStream) {
                mediaStream.getTracks().forEach(t => t.stop());
                mediaStream = null;
            }
            if (audioContext && audioContext.state !== 'closed') {
                audioContext.close().catch(() => {});
                audioContext = null;
            }
        } catch (e) {
            console.warn('[Vosk] Erro ao parar:', e);
        }

        isListening = false;
        console.log('[Vosk] Escuta parada');
    }

    // ===== Public API =====
    return {
        get isListening() { return isListening; },
        get isInitialized() { return isInitialized; },

        init,
        start,
        stop,

        // Callbacks
        onTranscript(cb) { onTranscriptCallback = cb; },
        onError(cb) { onErrorCallback = cb; },

        // Check if Vosk library is available
        isAvailable() {
            return typeof window.Vosk !== 'undefined' || true; // Can be loaded on demand
        }
    };
})();
