/* ============================================
   FISH-CAPABILITY.JS — Detecta se o navegador suporta Fish.audio
   Expõe window.__fishCapabilityOk = boolean
   Dispara evento 'fish-capability' no window
   ============================================ */

(function () {
    'use strict';

    const cap = {
        mediaRecorder: typeof MediaRecorder !== 'undefined',
        opusWebm: false,
        opusOgg: false,
        mp4: false,
        getUserMedia: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
        audioContext: !!(window.AudioContext || window.webkitAudioContext)
    };

    if (cap.mediaRecorder) {
        try {
            cap.opusWebm = MediaRecorder.isTypeSupported('audio/webm;codecs=opus');
            cap.opusOgg = MediaRecorder.isTypeSupported('audio/ogg;codecs=opus');
            cap.mp4 = MediaRecorder.isTypeSupported('audio/mp4');
        } catch (e) {
            console.warn('[FishCapability] isTypeSupported falhou:', e);
        }
    }

    const ok = cap.mediaRecorder
        && (cap.opusWebm || cap.opusOgg || cap.mp4)
        && cap.getUserMedia
        && cap.audioContext;

    window.__fishCapability = cap;
    window.__fishCapabilityOk = ok;

    console.log('[FishCapability] Detalhes:', cap);
    console.log('[FishCapability] Resultado:', ok ? 'OK' : 'UNSUPPORTED');

    window.dispatchEvent(new CustomEvent('fish-capability', { detail: { ok, capabilities: cap } }));
})();
