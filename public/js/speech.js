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

    // Clean text before sending to SpeechSynthesis to prevent reading markdown symbols or emojis weirdly
    function cleanTextForTTS(text) {
        if (typeof text !== 'string') return '';

        let cleaned = text;

        // 1. Remove emojis using Unicode Property Escapes (supported in modern browsers)
        cleaned = cleaned.replace(/\p{Extended_Pictographic}/gu, '');

        // 2. Remove markdown formatting characters: #, *, _, ~, `
        cleaned = cleaned.replace(/[#*_~`]/g, '');

        // 3. HYBRID VOWEL STRATEGY
        // Step 3a — Convert letter-based list markers to readable form before anything else.
        //   Matches patterns like:  "A) item", "B) item", "A - item", "A. item"
        //   (single uppercase letter at line start or after newline followed by ), -, .)
        //   We replace the punctuation with a colon so TTS reads it as "A: item"
        cleaned = cleaned.replace(/(?:^|(?<=\n))([A-Z])\s*[)\-\.]\s*/gm, '$1: ');

        // Step 3b — Expand STANDALONE UPPERCASE vowels that are isolated words.
        //   Only uppercase (A, E, I, O, U) surrounded by whitespace or start/end of string.
        //   Lowercase a / e / o are left alone — they are normal PT-BR articles/conjunctions.
        //   The map gives the most natural PT-BR spoken equivalent for each vowel:
        const vowelMap = { A: 'Ah', E: 'Eh', I: 'Ih', O: 'Oh', U: 'Uh' };
        cleaned = cleaned.replace(/(?<![A-Za-zÀ-ú])([AEIOU])(?![A-Za-zÀ-ú])/g, (match, vowel) => {
            return vowelMap[vowel] || vowel;
        });

        // 4. Replace newlines with periods so the TTS pauses naturally between paragraphs/lines
        cleaned = cleaned.replace(/\n+/g, ' . ');

        // 5. Normalize multiple spaces
        cleaned = cleaned.replace(/\s+/g, ' ').trim();

        return cleaned;
    }

    function speak(text, voiceIndex = 0, rate = 1.0) {
        return new Promise((resolve) => {
            // Cancel any ongoing speech
            synth.cancel();

            const cleanedText = cleanTextForTTS(text);
            console.log('[Robô TTS] Original:', text);
            console.log('[Robô TTS] Limpo:', cleanedText);

            const utterance = new SpeechSynthesisUtterance(cleanedText);
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
    let onNoiseLevelChangeCallback = null;
    let noiseSamples = [];

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

                // Ambient Noise Analysis
                // If synthesizer is speaking or microphone disabled/inactive, clear samples to avoid self-pickup
                if (synth.speaking || !micEnabled || !isListening) {
                    if (noiseSamples.length > 0) {
                        noiseSamples = [];
                        if (onNoiseLevelChangeCallback) onNoiseLevelChangeCallback(false, 0);
                    }
                    return;
                }

                noiseSamples.push(average);
                if (noiseSamples.length > 40) { // ~2 seconds of history
                    noiseSamples.shift();
                }

                const rollingAvg = noiseSamples.reduce((a, b) => a + b, 0) / noiseSamples.length;
                // Threshold 38 indicates constant background noise (loud environment)
                const isNoisy = rollingAvg > 38 && noiseSamples.length >= 40;

                if (onNoiseLevelChangeCallback) {
                    onNoiseLevelChangeCallback(isNoisy, rollingAvg);
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

        // Expose the AudioContext so other modules can reuse it
        // (avoids browsers blocking audio created outside user gesture)
        getAudioContext() { return audioContext; },

        // Callbacks
        onTranscript(cb) { onTranscript = cb; },
        onSpeechStart(cb) { onSpeechStart = cb; },
        onSpeechEnd(cb) { onSpeechEnd = cb; },
        onListeningStart(cb) { onListeningStart = cb; },
        onListeningStop(cb) { onListeningStop = cb; },
        onNoiseLevelChange(cb) { onNoiseLevelChangeCallback = cb; }
    };
})();
