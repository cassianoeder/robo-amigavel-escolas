/* ============================================
   SPEECH.JS — STT + TTS via Web Speech API
   ============================================ */

const Speech = (() => {
    // Speech Recognition (STT)
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = null;
    let isListening = false;
    let micEnabled = true;

    // Speech Synthesis (TTS)
    const synth = window.speechSynthesis;

    // Callbacks
    let onTranscript = null;     // (text) => void
    let onSpeechStart = null;    // () => void
    let onSpeechEnd = null;      // () => void
    let onListeningStart = null; // () => void
    let onListeningStop = null;  // () => void

    // ===== STT (Speech-to-Text) =====

    function initRecognition() {
        if (!SpeechRecognition) {
            console.error('SpeechRecognition não suportado neste navegador.');
            return false;
        }

        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = 'pt-BR';
        recognition.maxAlternatives = 1;

        recognition.onresult = (event) => {
            const lastResult = event.results[event.results.length - 1];
            if (lastResult.isFinal) {
                const transcript = lastResult[0].transcript.trim();
                if (transcript && onTranscript) {
                    onTranscript(transcript);
                }
            }
        };

        recognition.onerror = (event) => {
            // Ignore no-speech silently, it's normal behavior when silent
            if (event.error !== 'no-speech') {
                console.warn('Erro no reconhecimento de voz:', event.error);
            }
            if (event.error === 'not-allowed') {
                console.error('Permissão de microfone negada.');
                return;
            }
            // Restart on recoverable errors
            if (micEnabled && event.error !== 'aborted') {
                setTimeout(() => startListening(), 500);
            }
        };

        recognition.onend = () => {
            isListening = false;
            // Auto-restart if mic should be enabled
            if (micEnabled) {
                setTimeout(() => startListening(), 300);
            }
        };

        recognition.onstart = () => {
            isListening = true;
            if (onListeningStart) onListeningStart();
        };

        return true;
    }

    function startListening() {
        if (!recognition || !micEnabled) return;
        if (isListening) return;

        try {
            recognition.start();
        } catch (e) {
            // Already started, ignore
            console.warn('Recognition already started:', e.message);
        }
    }

    function stopListening() {
        if (!recognition) return;
        try {
            recognition.stop();
        } catch (e) {
            // Not running, ignore
        }
        isListening = false;
        if (onListeningStop) onListeningStop();
    }

    function disableMic() {
        micEnabled = false;
        stopListening();
    }

    function enableMic() {
        micEnabled = true;
        startListening();
    }

    // ===== TTS (Text-to-Speech) =====

    function speak(text, voiceIndex = 0, rate = 1.0) {
        return new Promise((resolve) => {
            // Cancel any ongoing speech
            synth.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'pt-BR';
            utterance.rate = rate;
            utterance.pitch = 1.0;

            // Set voice
            const voices = synth.getVoices();
            if (voices[voiceIndex]) {
                utterance.voice = voices[voiceIndex];
            }

            utterance.onstart = () => {
                if (onSpeechStart) onSpeechStart();
            };

            utterance.onend = () => {
                if (onSpeechEnd) onSpeechEnd();
                resolve();
            };

            utterance.onerror = (e) => {
                console.warn('Erro na síntese de voz:', e);
                if (onSpeechEnd) onSpeechEnd();
                resolve();
            };

            synth.speak(utterance);
        });
    }

    function cancelSpeech() {
        synth.cancel();
    }

    // ===== Permissions =====

    async function requestMicPermission() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            // Stop the stream tracks — we only needed permission
            stream.getTracks().forEach(t => t.stop());
            return true;
        } catch (e) {
            console.error('Permissão de microfone negada:', e);
            return false;
        }
    }

    let audioContext = null;
    let analyser = null;
    let microphone = null;
    let javascriptNode = null;
    let onLoudSoundCallback = null;

    async function startVolumeAnalysis(onLoudSound) {
        onLoudSoundCallback = onLoudSound;
        if (audioContext) return; // already initialized

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            microphone = audioContext.createMediaStreamSource(stream);
            javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

            analyser.smoothingTimeConstant = 0.3;
            analyser.fftSize = 512;

            microphone.connect(analyser);
            analyser.connect(javascriptNode);
            javascriptNode.connect(audioContext.destination);

            let lastLoudTrigger = 0;

            javascriptNode.onaudioprocess = () => {
                const array = new Uint8Array(analyser.frequencyBinCount);
                analyser.getByteFrequencyData(array);
                let values = 0;
                const length = array.length;
                for (let i = 0; i < length; i++) {
                    values += array[i];
                }
                const average = values / length;

                // Threshold for "extremely loud sound"
                // Standard claps/screams hit > 70/80 on a scale of 0-255 average
                if (average > 75) {
                    const now = Date.now();
                    if (now - lastLoudTrigger > 4000) { // Throttle trigger to once every 4 seconds
                        lastLoudTrigger = now;
                        if (onLoudSoundCallback) onLoudSoundCallback();
                    }
                }
            };
        } catch (e) {
            console.warn('Erro ao iniciar análise de volume do microfone:', e);
        }
    }

    // ===== Public API =====

    return {
        get isListening() { return isListening; },
        get isMicEnabled() { return micEnabled; },

        init() {
            return initRecognition();
        },

        startListening,
        stopListening,
        disableMic,
        enableMic,
        speak,
        cancelSpeech,
        requestMicPermission,
        startVolumeAnalysis,

        // Callbacks
        onTranscript(cb) { onTranscript = cb; },
        onSpeechStart(cb) { onSpeechStart = cb; },
        onSpeechEnd(cb) { onSpeechEnd = cb; },
        onListeningStart(cb) { onListeningStart = cb; },
        onListeningStop(cb) { onListeningStop = cb; }
    };
})();
