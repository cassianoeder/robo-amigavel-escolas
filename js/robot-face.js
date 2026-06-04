/* ============================================
   ROBOT-FACE.JS — SVG Face Rendering & States
   ============================================ */

const RobotFace = (() => {
    let yawnTimeout = null;
    // SVG elements
    const face = document.getElementById('robot-face');
    const leftEye = document.getElementById('left-eye');
    const rightEye = document.getElementById('right-eye');
    const mouth = document.getElementById('robot-mouth');
    const questionMarks = document.getElementById('question-marks');

    // Eye components
    const eyes = {
        left: {
            iris: leftEye.querySelector('.eye-iris'),
            pupil: leftEye.querySelector('.eye-pupil'),
            shine: leftEye.querySelector('.eye-shine'),
            baseCx: 270, baseCy: 210
        },
        right: {
            iris: rightEye.querySelector('.eye-iris'),
            pupil: rightEye.querySelector('.eye-pupil'),
            shine: rightEye.querySelector('.eye-shine'),
            baseCx: 530, baseCy: 210
        }
    };

    // Mouth paths for different states
    const mouthPaths = {
        smile:    'M 300 370 Q 400 420 500 370',
        neutral:  'M 300 375 Q 400 395 500 375',
        thinking: 'M 300 375 Q 370 380 420 370 Q 470 360 500 350',
        speaking: {
            open:  'M 310 365 Q 400 430 490 365',
            mid:   'M 320 370 Q 400 410 480 370',
            close: 'M 310 370 Q 400 395 490 370'
        },
        sleepy:   'M 320 380 Q 400 400 480 380',
        yawn:     'M 340 360 Q 400 440 460 360'
    };

    let currentState = 'idle';
    let blinkInterval = null;
    let speakingInterval = null;
    let sleepyInterval = null;

    // Natural blink
    function startBlinking() {
        stopBlinking();
        const doBlink = () => {
            if (currentState === 'sleepy') return;
            leftEye.classList.add('blink');
            rightEye.classList.add('blink');
            setTimeout(() => {
                leftEye.classList.remove('blink');
                rightEye.classList.remove('blink');
            }, 250);
        };

        // Random blink interval between 2-6 seconds
        const scheduleNext = () => {
            const delay = 2000 + Math.random() * 4000;
            blinkInterval = setTimeout(() => {
                doBlink();
                scheduleNext();
            }, delay);
        };
        scheduleNext();
    }

    function stopBlinking() {
        if (blinkInterval) {
            clearTimeout(blinkInterval);
            blinkInterval = null;
        }
    }

    // Move eyes to direction (dx: -1 to 1, dy: -1 to 1)
    function lookAt(dx, dy) {
        const maxOffsetX = 22;
        const maxOffsetY = 15;

        const ox = dx * maxOffsetX;
        const oy = dy * maxOffsetY;

        Object.values(eyes).forEach(eye => {
            const ix = eye.baseCx + ox;
            const iy = eye.baseCy + oy;
            eye.iris.setAttribute('cx', ix);
            eye.pupil.setAttribute('cx', ix);
            eye.shine.setAttribute('cx', ix - 18);

            eye.iris.setAttribute('cy', iy);
            eye.pupil.setAttribute('cy', iy);
            eye.shine.setAttribute('cy', iy - 20);
        });
    }

    // Reset eye position
    function lookCenter() {
        lookAt(0, 0);
    }

    // Set mouth path
    function setMouth(pathStr) {
        mouth.setAttribute('d', pathStr);
    }

    // STATE: Idle (default smile, natural blink)
    function setIdle() {
        currentState = 'idle';
        stopSpeaking();
        stopSleepy();

        leftEye.className = 'eye';
        rightEye.className = 'eye';
        mouth.classList.remove('yawning', 'speaking');
        questionMarks.classList.remove('visible');
        questionMarks.classList.add('hidden');

        setMouth(mouthPaths.smile);
        lookCenter();
        startBlinking();
    }

    // STATE: Listening (attentive eyes, neutral mouth)
    function setListening() {
        currentState = 'listening';
        stopSpeaking();
        stopSleepy();

        leftEye.className = 'eye';
        rightEye.className = 'eye';
        mouth.classList.remove('yawning', 'speaking');
        questionMarks.classList.remove('visible');
        questionMarks.classList.add('hidden');

        setMouth(mouthPaths.neutral);
        startBlinking();
    }

    // STATE: Thinking (mouth corner up, question marks)
    function setThinking() {
        currentState = 'thinking';
        stopSpeaking();
        stopSleepy();

        leftEye.className = 'eye';
        rightEye.className = 'eye';
        mouth.classList.remove('yawning', 'speaking');

        setMouth(mouthPaths.thinking);
        questionMarks.classList.remove('hidden');
        questionMarks.classList.add('visible');

        // Eyes look up slightly (thinking)
        lookAt(0.3, -0.4);
        startBlinking();
    }

    // STATE: Speaking (mouth animates open/close)
    function setSpeaking() {
        currentState = 'speaking';
        stopSleepy();

        leftEye.className = 'eye';
        rightEye.className = 'eye';
        questionMarks.classList.remove('visible');
        questionMarks.classList.add('hidden');
        mouth.classList.remove('yawning');

        lookCenter();
        startBlinking();

        // Animate mouth
        const frames = [
            mouthPaths.speaking.open,
            mouthPaths.speaking.mid,
            mouthPaths.speaking.close,
            mouthPaths.speaking.mid
        ];
        let frameIndex = 0;

        stopSpeaking();
        speakingInterval = setInterval(() => {
            setMouth(frames[frameIndex]);
            frameIndex = (frameIndex + 1) % frames.length;
        }, 180);
    }

    function stopSpeaking() {
        if (speakingInterval) {
            clearInterval(speakingInterval);
            speakingInterval = null;
        }
    }

    // STATE: Sleepy
    function setSleepy() {
        currentState = 'sleepy';
        stopSpeaking();
        stopBlinking();

        questionMarks.classList.remove('visible');
        questionMarks.classList.add('hidden');
        mouth.classList.remove('speaking');

        // Half-closed eyes
        leftEye.className = 'eye sleepy';
        rightEye.className = 'eye sleepy';
        setMouth(mouthPaths.sleepy);
        lookCenter();

        // Periodic yawns and peeks
        stopSleepy();
        let cycle = 0;
        sleepyInterval = setInterval(() => {
            cycle++;
            if (cycle % 4 === 0) {
                // Yawn: close eyes fully, animate mouth open/close via JS
                leftEye.className = 'eye closed';
                rightEye.className = 'eye closed';
                doYawnMouth();

                setTimeout(() => {
                    if (currentState === 'sleepy') {
                        leftEye.className = 'eye sleepy';
                        rightEye.className = 'eye sleepy';
                        setMouth(mouthPaths.sleepy);
                    }
                }, 3000);
            } else if (cycle % 2 === 0) {
                // Peek: open eyes slightly more then close again
                leftEye.className = 'eye sleepy-peek';
                rightEye.className = 'eye sleepy-peek';

                setTimeout(() => {
                    if (currentState === 'sleepy') {
                        leftEye.className = 'eye sleepy';
                        rightEye.className = 'eye sleepy';
                    }
                }, 2000);
            }
        }, 5000);
    }

    function stopSleepy() {
        if (sleepyInterval) {
            clearInterval(sleepyInterval);
            sleepyInterval = null;
        }
        if (yawnTimeout) {
            clearTimeout(yawnTimeout);
            yawnTimeout = null;
        }
    }

    // JS-based yawn mouth animation (cross-browser)
    function doYawnMouth() {
        // Phase 1: open wide
        setMouth(mouthPaths.yawn);
        yawnTimeout = setTimeout(() => {
            // Phase 2: mid-yawn
            setMouth('M 340 365 Q 400 435 460 365');
            yawnTimeout = setTimeout(() => {
                // Phase 3: closing
                setMouth(mouthPaths.sleepy);
            }, 1200);
        }, 1200);
    }

    // Wake up from sleepy with animation
    function wakeUp() {
        if (currentState !== 'sleepy') return;
        stopSleepy();

        leftEye.className = 'eye';
        rightEye.className = 'eye';

        setIdle();
    }

    // Public API
    return {
        setIdle,
        setListening,
        setThinking,
        setSpeaking,
        setSleepy,
        wakeUp,
        lookAt,
        lookCenter,
        get state() { return currentState; },
        init() {
            setIdle();
        }
    };
})();
