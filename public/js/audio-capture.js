/* ============================================
   AUDIO-CAPTURE.JS — Captura de áudio via MediaRecorder
   Usado pelo Fish STT como alternativa ao Web Speech API
   ============================================ */

const AudioCapture = (() => {
    'use strict';

    let recorder = null;
    let stream = null;
    let chunks = [];
    let audioContext = null;
    let analyser = null;
    let rafId = null;
    let silenceStart = 0;
    let isRecordingFlag = false;
    let mimeType = '';
    let maxDurationTimer = null;
    let calibStart = 0;

    const SILENCE_THRESHOLD = 15;
    const SILENCE_DURATION = 1500;
    const MAX_DURATION = 30000;
    const NOISE_FLOOR_CALIBRATION = 800;

    function pickMimeType() {
        const candidates = [
            'audio/webm;codecs=opus',
            'audio/ogg;codecs=opus',
            'audio/webm',
            'audio/mp4'
        ];
        for (const c of candidates) {
            if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(c)) {
                return c;
            }
        }
        return '';
    }

    async function start(onStopCallback) {
        if (isRecordingFlag) {
            console.warn('[AudioCapture] Já está gravando');
            return false;
        }
        if (typeof MediaRecorder === 'undefined') {
            console.error('[AudioCapture] MediaRecorder não suportado');
            return false;
        }

        mimeType = pickMimeType();
        if (!mimeType) {
            console.error('[AudioCapture] Nenhum MIME type suportado');
            return false;
        }

        try {
            stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            });
        } catch (e) {
            console.error('[AudioCapture] getUserMedia falhou:', e);
            cleanup();
            return false;
        }

        try {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            audioContext = new AudioContextClass();
            if (audioContext.state === 'suspended') {
                await audioContext.resume();
            }

            const source = audioContext.createMediaStreamSource(stream);
            analyser = audioContext.createAnalyser();
            analyser.fftSize = 512;
            analyser.smoothingTimeConstant = 0.3;
            source.connect(analyser);
        } catch (e) {
            console.error('[AudioCapture] AudioContext falhou:', e);
            cleanup();
            return false;
        }

        chunks = [];
        recorder = new MediaRecorder(stream, { mimeType });

        recorder.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) chunks.push(e.data);
        };

        recorder.onstop = () => {
            const blob = new Blob(chunks, { type: mimeType });
            chunks = [];
            cleanup();
            if (onStopCallback) onStopCallback(blob);
        };

        recorder.onerror = (e) => {
            console.error('[AudioCapture] Erro no recorder:', e);
            chunks = [];
            cleanup();
            if (onStopCallback) onStopCallback(null);
        };

        try {
            recorder.start(100);
        } catch (e) {
            console.error('[AudioCapture] start() falhou:', e);
            cleanup();
            return false;
        }

        isRecordingFlag = true;
        silenceStart = 0;
        calibStart = Date.now();

        const buf = new Uint8Array(analyser.frequencyBinCount);

        const tick = () => {
            if (!isRecordingFlag) return;
            analyser.getByteFrequencyData(buf);
            const avg = buf.reduce((a, b) => a + b, 0) / buf.length;

            if (Date.now() - calibStart < NOISE_FLOOR_CALIBRATION) {
                rafId = requestAnimationFrame(tick);
                return;
            }

            if (avg < SILENCE_THRESHOLD) {
                if (silenceStart === 0) silenceStart = Date.now();
                else if (Date.now() - silenceStart > SILENCE_DURATION) {
                    stop();
                    return;
                }
            } else {
                silenceStart = 0;
            }

            rafId = requestAnimationFrame(tick);
        };
        rafId = requestAnimationFrame(tick);

        maxDurationTimer = setTimeout(() => {
            console.warn('[AudioCapture] Tempo máximo atingido');
            stop();
        }, MAX_DURATION);

        console.log('[AudioCapture] Gravando em', mimeType);
        return true;
    }

    function stop() {
        if (!isRecordingFlag || !recorder) return;
        try {
            recorder.stop();
        } catch (e) {
            console.warn('[AudioCapture] Erro ao parar:', e);
            cleanup();
        }
    }

    function cancel() {
        if (!isRecordingFlag) {
            cleanup();
            return;
        }
        if (recorder) {
            recorder.onstop = null;
            try { recorder.stop(); } catch (e) { /* ignore */ }
        }
        cleanup();
    }

    function cleanup() {
        isRecordingFlag = false;
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
        if (maxDurationTimer) { clearTimeout(maxDurationTimer); maxDurationTimer = null; }
        if (stream) {
            stream.getTracks().forEach(t => {
                try { t.stop(); } catch (e) { /* ignore */ }
            });
            stream = null;
        }
        if (audioContext && audioContext.state !== 'closed') {
            audioContext.close().catch(() => { /* ignore */ });
        }
        audioContext = null;
        analyser = null;
        recorder = null;
        chunks = [];
    }

    function isRecording() { return isRecordingFlag; }
    function getMimeType() { return mimeType; }

    return { start, stop, cancel, isRecording, getMimeType };
})();
