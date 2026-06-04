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
            console.warn('Erro no reconhecimento de voz:', event.error);
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

        // Callbacks
        onTranscript(cb) { onTranscript = cb; },
        onSpeechStart(cb) { onSpeechStart = cb; },
        onSpeechEnd(cb) { onSpeechEnd = cb; },
        onListeningStart(cb) { onListeningStart = cb; },
        onListeningStop(cb) { onListeningStop = cb; }
    };
})();
