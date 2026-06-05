/* ============================================
   SPEECH.JS — STT + TTS via Web Speech API
   ============================================ */

const Speech = (() => {
    // Mobile detection
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);
    let ttsUnlocked = false;

    // Speech Recognition (STT)
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = null;
    let isListening = false;
    let micEnabled = true;

    // Speech Synthesis (TTS)
    const synth = window.speechSynthesis;
    let ttsKeepAliveTimer = null;

    // Callbacks
    let onTranscript = null;     // (text) => void
    let onSpeechStart = null;    // () => void
    let onSpeechEnd = null;      // () => void
    let onListeningStart = null; // () => void
    let onListeningStop = null;  // () => void

    // Dynamic Volume Gating
    let currentSpeechMaxVolume = 0;

    // ===== STT (Speech-to-Text) =====

    function initRecognition() {
        if (!SpeechRecognition) {
            console.error('SpeechRecognition não suportado neste navegador.');
            return false;
        }

        recognition = new SpeechRecognition();
        // Android breaks with continuous=true (stops silently after each phrase)
        // Use false on mobile and rely on auto-restart via onend
        recognition.continuous = !isMobile;
        recognition.interimResults = false;
        recognition.lang = 'pt-BR';
        recognition.maxAlternatives = 1;

        recognition.onresult = (event) => {
            const lastResult = event.results[event.results.length - 1];
            if (lastResult.isFinal) {
                const transcript = lastResult[0].transcript.trim();
                if (transcript && onTranscript) {
                    // Noise floor via 25th-percentile — voice peaks don't inflate the baseline
                    let noiseFloor = 0;
                    if (noiseSamples.length >= 8) {
                        const sorted = [...noiseSamples].sort((a, b) => a - b);
                        noiseFloor = sorted[Math.floor(sorted.length * 0.25)];
                    }

                    // Gating threshold logic:
                    // Use ratio-based threshold so it scales with ambient noise.
                    // Safety valve: very loud peaks (>55) always pass — someone is
                    // clearly speaking close to the microphone.
                    let minRequiredVolume = 0;
                    const isNoisy = noiseFloor > 25;

                    if (isNoisy && currentSpeechMaxVolume <= 55) {
                        // Voice must be 30% louder than the ambient noise floor
                        minRequiredVolume = noiseFloor * 1.3;
                    }

                    console.log(`[Voz Gate] Max Volume = ${currentSpeechMaxVolume.toFixed(1)}, Piso (P25) = ${noiseFloor.toFixed(1)}, Mínimo Requerido = ${minRequiredVolume.toFixed(1)}`);

                    if (currentSpeechMaxVolume >= minRequiredVolume) {
                        onTranscript(transcript);
                    } else {
                        console.warn(`[Voz Gate] Transcrição descartada (muito baixa, provável ruído de fundo): "${transcript}"`);
                    }

                    // Reset max volume for next utterance
                    currentSpeechMaxVolume = 0;
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
            currentSpeechMaxVolume = 0; // Reset at start of listening cycle
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

    function detectEffect(text) {
        if (!text) return null;
        const lower = text.toLowerCase();
        // Check for keywords
        if (/(amor|afeto|carinho|te amo|apaixonad|lindo)/.test(lower)) return 'love';
        if (/(quente|calor|fogo|suar|suando|queimando)/.test(lower)) return 'hot';
        if (/(frio|congelando|gelo|neve|azul|gelad)/.test(lower)) return 'cold';
        return null;
    }

    // Unlock TTS on mobile — MUST be called inside a user gesture (click/tap)
    function unlockTTS() {
        if (ttsUnlocked) return;
        console.log('[Robô TTS] Desbloqueando síntese de voz (user gesture)...');
        const dummy = new SpeechSynthesisUtterance('');
        dummy.volume = 0;
        dummy.lang = 'pt-BR';
        synth.speak(dummy);
        ttsUnlocked = true;
    }

    // Chrome Android bug: utterances >~15s are silently cancelled.
    // Workaround: periodically pause+resume to keep the engine alive.
    function startTTSKeepAlive() {
        stopTTSKeepAlive();
        if (!isAndroid) return;
        ttsKeepAliveTimer = setInterval(() => {
            if (synth.speaking && !synth.paused) {
                synth.pause();
                synth.resume();
            }
        }, 10000); // every 10s
    }

    function stopTTSKeepAlive() {
        if (ttsKeepAliveTimer) {
            clearInterval(ttsKeepAliveTimer);
            ttsKeepAliveTimer = null;
        }
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

            utterance.volume = (Config && Config.current && Config.current.volumeRobo !== undefined ? Config.current.volumeRobo : 100) / 100;
// Set voice
            const voices = synth.getVoices();
            if (voices.length > 0 && voices[voiceIndex]) {
                utterance.voice = voices[voiceIndex];
            } else if (voices.length > 0) {
                // Fallback: try to find any pt-BR voice
                const ptVoice = voices.find(v => v.lang && v.lang.startsWith('pt'));
                if (ptVoice) utterance.voice = ptVoice;
            }

            utterance.onstart = () => {
                startTTSKeepAlive();
                if (onSpeechStart) onSpeechStart();
            };

            utterance.onend = () => {
                stopTTSKeepAlive();
                if (onSpeechEnd) onSpeechEnd();
                resolve();
            };

            utterance.onerror = (e) => {
                stopTTSKeepAlive();
                console.warn('Erro na síntese de voz:', e);
                if (onSpeechEnd) onSpeechEnd();
                resolve();
            };

            synth.speak(utterance);

            // Android safety net: if onstart never fires after 3s, the utterance was silently blocked
            if (isMobile) {
                setTimeout(() => {
                    if (!synth.speaking) {
                        console.warn('[Robô TTS] Utterance bloqueada pelo navegador mobile.');
                        stopTTSKeepAlive();
                        if (onSpeechEnd) onSpeechEnd();
                        resolve();
                    }
                }, 3000);
            }
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
                    currentSpeechMaxVolume = 0;
                    return;
                }

                // Track max volume during active listening
                if (average > currentSpeechMaxVolume) {
                    currentSpeechMaxVolume = average;
                }

                noiseSamples.push(average);
                if (noiseSamples.length > 50) { // ~2.5 seconds of history
                    noiseSamples.shift();
                }

                // Use 25th-percentile as noise floor (consistent with gating logic)
                const sorted = [...noiseSamples].sort((a, b) => a - b);
                const noiseFloor = sorted[Math.floor(sorted.length * 0.25)];
                // Threshold 30 indicates constant background noise (loud environment)
                const isNoisy = noiseFloor > 30 && noiseSamples.length >= 40;

                if (onNoiseLevelChangeCallback) {
                    onNoiseLevelChangeCallback(isNoisy, noiseFloor);
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
        unlockTTS,

        // Expose the AudioContext so other modules can reuse it
        // (avoids browsers blocking audio created outside user gesture)
        getAudioContext() { return audioContext; },
        get isMobile() { return isMobile; },

        // Callbacks
        onTranscript(cb) { onTranscript = cb; },
        onSpeechStart(cb) { onSpeechStart = cb; },
        onSpeechEnd(cb) { onSpeechEnd = cb; },
        onListeningStart(cb) { onListeningStart = cb; },
        onListeningStop: (cb) => onListeningStop = cb,
        cleanTextForTTS,
        detectEffect,
        onNoiseLevelChange(cb) { onNoiseLevelChangeCallback = cb; }
    };
})();
