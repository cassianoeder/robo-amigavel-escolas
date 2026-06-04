/* ============================================
   MOTION.JS — Motion Detection via Camera
   ============================================ */

const Motion = (() => {
    const video = document.getElementById('camera-feed');
    const canvas = document.getElementById('motion-canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    const DETECTION_WIDTH = 160;
    const DETECTION_HEIGHT = 120;
    const MOTION_THRESHOLD = 30;       // Pixel difference threshold
    const MOTION_PIXEL_PERCENT = 2;    // % of pixels changed to count as motion
    const CHECK_INTERVAL = 200;        // ms between checks

    let previousFrame = null;
    let detecting = false;
    let animFrameId = null;
    let checkTimer = null;
    let cameraStream = null;

    // Callbacks
    let onMotionDetected = null;    // (direction: {dx, dy}) => void
    let onNoMotion = null;          // () => void

    // Request camera permission and start stream
    async function requestCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 320, height: 240, facingMode: 'user' },
                audio: false
            });
            video.srcObject = stream;
            cameraStream = stream;
            canvas.width = DETECTION_WIDTH;
            canvas.height = DETECTION_HEIGHT;
            await video.play();
            return true;
        } catch (e) {
            console.error('Permissão de câmera negada:', e);
            return false;
        }
    }

    // Capture current frame as grayscale pixel data
    function captureFrame() {
        ctx.drawImage(video, 0, 0, DETECTION_WIDTH, DETECTION_HEIGHT);
        return ctx.getImageData(0, 0, DETECTION_WIDTH, DETECTION_HEIGHT);
    }

    // Compare two frames and detect motion + direction
    function detectMotion(currentFrame, prevFrame) {
        const curr = currentFrame.data;
        const prev = prevFrame.data;
        const len = curr.length;
        const totalPixels = DETECTION_WIDTH * DETECTION_HEIGHT;

        let changedPixels = 0;
        let sumX = 0;
        let sumY = 0;

        for (let i = 0; i < len; i += 4) {
            // Grayscale difference
            const rDiff = Math.abs(curr[i] - prev[i]);
            const gDiff = Math.abs(curr[i + 1] - prev[i + 1]);
            const bDiff = Math.abs(curr[i + 2] - prev[i + 2]);
            const diff = (rDiff + gDiff + bDiff) / 3;

            if (diff > MOTION_THRESHOLD) {
                changedPixels++;
                // Calculate pixel position
                const pixelIndex = i / 4;
                const x = pixelIndex % DETECTION_WIDTH;
                const y = Math.floor(pixelIndex / DETECTION_WIDTH);
                sumX += x;
                sumY += y;
            }
        }

        const percent = (changedPixels / totalPixels) * 100;
        const hasMotion = percent > MOTION_PIXEL_PERCENT;

        let direction = { dx: 0, dy: 0 };
        if (hasMotion && changedPixels > 0) {
            const avgX = sumX / changedPixels;
            const avgY = sumY / changedPixels;
            // Normalize to -1..1 range (mirror X because camera is mirrored)
            direction.dx = -((avgX / DETECTION_WIDTH) * 2 - 1);
            direction.dy = (avgY / DETECTION_HEIGHT) * 2 - 1;
        }

        return { hasMotion, direction, percent };
    }

    // Main detection loop
    function startDetection() {
        if (detecting) return;
        detecting = true;
        previousFrame = null;

        checkTimer = setInterval(() => {
            if (!video.videoWidth) return;

            const currentFrame = captureFrame();

            if (previousFrame) {
                const result = detectMotion(currentFrame, previousFrame);
                if (result.hasMotion) {
                    if (onMotionDetected) onMotionDetected(result.direction);
                } else {
                    if (onNoMotion) onNoMotion();
                }
            }

            previousFrame = currentFrame;
        }, CHECK_INTERVAL);
    }

    function stopDetection() {
        detecting = false;
        if (checkTimer) {
            clearInterval(checkTimer);
            checkTimer = null;
        }
        previousFrame = null;
    }

    function stopCamera() {
        stopDetection();
        if (cameraStream) {
            cameraStream.getTracks().forEach(t => t.stop());
            cameraStream = null;
        }
    }

    // Public API
    return {
        requestCamera,
        startDetection,
        stopDetection,
        stopCamera,
        get isDetecting() { return detecting; },

        onMotionDetected(cb) { onMotionDetected = cb; },
        onNoMotion(cb) { onNoMotion = cb; }
    };
})();
