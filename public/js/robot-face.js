/* ============================================
   ROBOT-FACE.JS — SVG Face Rendering & States
   ============================================ */

const RobotFace = (() => {
    let yawnTimeout = null;
    let snoreInterval = null;
    let activeSnoreNodes = [];
    // SVG elements
    const face = document.getElementById('robot-face');
    const faceWrapper = document.querySelector('.robot-face-wrapper');
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
        yawn:     'M 340 360 Q 400 440 460 360',
        happy:    'M 300 360 Q 400 440 500 360',
        confused: 'M 330 390 Q 400 360 470 400',
        surprised: 'M 370 380 a 30 30 0 1 0 60 0 a 30 30 0 1 0 -60 0'
    };

    let reactionTimeout = null;

    let currentState = 'idle';
    let blinkInterval = null;
    let speakingInterval = null;
    let sleepyInterval = null;
    let idleLookInterval = null;

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

    function applyEyeTransform(dx, dy) {
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

        // Rotate the entire head based on horizontal eye direction
        if (faceWrapper) {
            const maxTiltY = 12; // degrees for 3D turn
            const maxSlideX = 30; // pixels to slide horizontally
            
            const tiltY = dx * maxTiltY;
            const slideX = dx * maxSlideX;
            
            faceWrapper.style.transform = `translateX(${slideX}px) rotateY(${tiltY}deg)`;
        }
    }

    // Move eyes to direction (dx: -1 to 1, dy: -1 to 1)
    function lookAt(dx, dy) {
        stopIdleLook();
        applyEyeTransform(dx, dy);
    }

    function startIdleLook() {
        if (idleLookInterval || currentState === 'sleepy') return;
        
        const doIdleLook = () => {
            if (currentState === 'sleepy' || currentState === 'speaking') return;
            
            // Random direction, smaller movements for idle
            const dx = (Math.random() * 2 - 1) * 0.4; 
            const dy = (Math.random() * 2 - 1) * 0.4; 
            
            applyEyeTransform(dx, dy);

            // Schedule next look (between 1.5s and 4.5s)
            const delay = 1500 + Math.random() * 3000;
            idleLookInterval = setTimeout(doIdleLook, delay);
        };
        
        doIdleLook();
    }

    function stopIdleLook() {
        if (idleLookInterval) {
            clearTimeout(idleLookInterval);
            idleLookInterval = null;
        }
    }

    // Reset eye position
    function lookCenter() {
        lookAt(0, 0);
    }

    // Reaction helpers
    function clearReaction() {
        if (reactionTimeout) {
            clearTimeout(reactionTimeout);
            reactionTimeout = null;
        }
        if (face) {
            face.classList.remove('confused', 'surprised', 'happy');
        }
        if (leftEye && rightEye) {
            leftEye.classList.remove('happy');
            rightEye.classList.remove('happy');
        }
    }

    function restoreStateAesthetics() {
        if (currentState === 'idle') {
            setIdle();
        } else if (currentState === 'listening') {
            setListening();
        } else if (currentState === 'thinking') {
            setThinking();
        } else if (currentState === 'speaking') {
            setSpeaking();
        } else if (currentState === 'sleepy') {
            setSleepy();
        }
    }

    function setHappy(duration = 4000) {
        clearReaction();
        if (face) face.classList.add('happy');
        leftEye.classList.add('happy');
        rightEye.classList.add('happy');
        setMouth(mouthPaths.happy);

        if (duration > 0) {
            reactionTimeout = setTimeout(() => {
                clearReaction();
                restoreStateAesthetics();
            }, duration);
        }
    }

    function setConfused(duration = 4000) {
        clearReaction();
        face.classList.add('confused');
        setMouth(mouthPaths.confused);
        lookAt(-0.3, 0.15); // Look confusedly to the side

        if (duration > 0) {
            reactionTimeout = setTimeout(() => {
                clearReaction();
                restoreStateAesthetics();
            }, duration);
        }
    }

    function setSurprised(duration = 3000) {
        clearReaction();
        face.classList.add('surprised');
        setMouth(mouthPaths.surprised);
        lookCenter();

        if (duration > 0) {
            reactionTimeout = setTimeout(() => {
                clearReaction();
                restoreStateAesthetics();
            }, duration);
        }
    }

    // ==========================================
    // Contextual Visual Effects (Love, Hot, Cold)
    // ==========================================
    let activeEffect = null;
    let heartInterval = null;

    function startEffect(effect) {
        stopEffect(); // clear any previous
        if (!effect) return;

        activeEffect = effect;
        faceWrapper.classList.add(`effect-${effect}`);

        if (effect === 'love') {
            const heartsContainer = document.getElementById('floating-hearts');
            if (heartsContainer) {
                // Spawn a heart every 300ms
                heartInterval = setInterval(() => {
                    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
                    const heart = document.createElementNS("http://www.w3.org/2000/svg", "path");
                    
                    // Simple SVG heart path
                    heart.setAttribute('d', 'M 10 30 A 20 20 0 0 1 50 30 A 20 20 0 0 1 90 30 Q 90 60 50 90 Q 10 60 10 30 Z');
                    heart.setAttribute('fill', '#ff4b4b');
                    heart.setAttribute('class', 'floating-heart');
                    heart.style.transformOrigin = "50px 50px";
                    
                    // Randomize position
                    const randomX = 150 + Math.random() * 500;
                    const randomY = 300 + Math.random() * 100;
                    
                    // Set position on the wrapper group so CSS animation on the heart doesn't overwrite it
                    g.setAttribute('transform', `translate(${randomX}, ${randomY})`);
                    
                    g.appendChild(heart);
                    heartsContainer.appendChild(g);

                    // Remove after animation completes
                    setTimeout(() => {
                        if (g.parentNode) g.parentNode.removeChild(g);
                    }, 2000);

                }, 400);
            }
        }
    }

    function stopEffect() {
        if (activeEffect) {
            faceWrapper.classList.remove(`effect-${activeEffect}`);
            activeEffect = null;
        }
        if (heartInterval) {
            clearInterval(heartInterval);
            heartInterval = null;
        }
    }

    // Set mouth path
    function setMouth(pathStr) {
        mouth.setAttribute('d', pathStr);
    }

    // STATE: Idle (default smile, natural blink)
    function setIdle() {
        clearReaction();
        currentState = 'idle';
        if (face) face.classList.remove('speaking', 'sleepy');
        stopSpeaking();
        stopSleepy();
        stopIdleLook();

        leftEye.setAttribute('class', 'eye');
        rightEye.setAttribute('class', 'eye');
        mouth.classList.remove('yawning', 'speaking');
        questionMarks.classList.remove('visible');
        questionMarks.classList.add('hidden');

        setMouth(mouthPaths.smile);
        lookCenter();
        startBlinking();
    }

    // STATE: Listening (attentive eyes, neutral mouth)
    function setListening() {
        clearReaction();
        currentState = 'listening';
        if (face) face.classList.remove('speaking', 'sleepy');
        stopSpeaking();
        stopSleepy();
        stopIdleLook();

        leftEye.setAttribute('class', 'eye');
        rightEye.setAttribute('class', 'eye');
        mouth.classList.remove('yawning', 'speaking');
        questionMarks.classList.remove('visible');
        questionMarks.classList.add('hidden');

        setMouth(mouthPaths.neutral);
        startBlinking();
    }

    // STATE: Thinking (mouth corner up, question marks)
    function setThinking() {
        clearReaction();
        currentState = 'thinking';
        if (face) face.classList.remove('speaking', 'sleepy');
        stopSpeaking();
        stopSleepy();
        stopIdleLook();

        leftEye.setAttribute('class', 'eye');
        rightEye.setAttribute('class', 'eye');
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
        clearReaction();
        currentState = 'speaking';
        if (face) {
            face.classList.remove('sleepy');
            face.classList.add('speaking');
        }
        stopSleepy();
        stopIdleLook();

        leftEye.setAttribute('class', 'eye');
        rightEye.setAttribute('class', 'eye');
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
        if (face) {
            face.classList.remove('speaking');
        }
    }

    // STATE: Sleepy
    function setSleepy() {
        clearReaction();
        currentState = 'sleepy';
        if (face) {
            face.classList.remove('speaking');
            face.classList.add('sleepy');
        }
        stopSpeaking();
        stopBlinking();

        questionMarks.classList.remove('visible');
        questionMarks.classList.add('hidden');
        mouth.classList.remove('speaking');

        // Half-closed eyes
        leftEye.setAttribute('class', 'eye sleepy');
        rightEye.setAttribute('class', 'eye sleepy');
        setMouth(mouthPaths.sleepy);
        lookCenter();
        startSnoring();

        // Show sleep Z's
        const sleepZsContainer = document.getElementById('sleep-zs');
        if (sleepZsContainer) {
            sleepZsContainer.classList.remove('hidden');
            // Spawn Z's periodically
            let zCount = 0;
            const zInterval = setInterval(() => {
                if (currentState !== 'sleepy') {
                    clearInterval(zInterval);
                    return;
                }
                
                const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
                text.setAttribute('class', 'sleep-z');
                text.textContent = 'z';
                
                // Randomize position near the head
                const randomX = 100 + Math.random() * 600;
                const randomY = 100 + Math.random() * 50;
                
                text.setAttribute('x', randomX);
                text.setAttribute('y', randomY);
                
                sleepZsContainer.appendChild(text);
                
                // Remove after animation completes
                setTimeout(() => {
                    if (text.parentNode) text.parentNode.removeChild(text);
                }, 3000);
                
                zCount++;
                if (zCount >= 3) {
                    clearInterval(zInterval);
                    zCount = 0;
                    setTimeout(() => {
                        if (currentState === 'sleepy') {
                            // Start spawning Z's again
                            setSleepy();
                        }
                    }, 2000);
                }
            }, 800);
        }

        // Periodic yawns and peeks
        stopSleepy();
        let cycle = 0;
        sleepyInterval = setInterval(() => {
            cycle++;
            if (cycle % 4 === 0) {
                // Yawn: close eyes fully, animate mouth open/close via JS
                leftEye.setAttribute('class', 'eye closed');
                rightEye.setAttribute('class', 'eye closed');
                doYawnMouth();

                setTimeout(() => {
                    if (currentState === 'sleepy') {
                        leftEye.setAttribute('class', 'eye sleepy');
                        rightEye.setAttribute('class', 'eye sleepy');
                        setMouth(mouthPaths.sleepy);
                    }
                }, 3000);
            } else if (cycle % 2 === 0) {
                // Peek: open eyes slightly more then close again
                leftEye.setAttribute('class', 'eye sleepy-peek');
                rightEye.setAttribute('class', 'eye sleepy-peek');

                setTimeout(() => {
                    if (currentState === 'sleepy') {
                        leftEye.setAttribute('class', 'eye sleepy');
                        rightEye.setAttribute('class', 'eye sleepy');
                    }
                }, 2000);
            }
        }, 5000);
    }

    function stopSleepy() {
        stopSnoring();
        if (sleepyInterval) {
            clearInterval(sleepyInterval);
            sleepyInterval = null;
        }
        if (yawnTimeout) {
            clearTimeout(yawnTimeout);
            yawnTimeout = null;
        }
        // Hide sleep Z's
        const sleepZsContainer = document.getElementById('sleep-zs');
        if (sleepZsContainer) {
            sleepZsContainer.classList.add('hidden');
            sleepZsContainer.innerHTML = '';
        }
    }

    let audioCtx = null;

    // Allow injecting an already-authorized AudioContext from outside
    // (avoids autoplay policy issues since speech.js already asks for mic permission)
    function setAudioContext(ctx) {
        audioCtx = ctx;
    }

    function getAudioContext() {
        if (!audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                audioCtx = new AudioContextClass();
            }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume().catch(e => console.warn('Falha ao resumir AudioContext:', e));
        }
        return audioCtx;
    }

    function startSnoring() {
        stopSnoring();

        const ctx = getAudioContext();
        if (!ctx) {
            console.warn('[Robô] AudioContext indisponível para ronco.');
            return;
        }

        const playSnoreCycle = () => {
            if (currentState !== 'sleepy') {
                stopSnoring();
                return;
            }

            try {
                const now = ctx.currentTime;

                // --- IN-BREATH (Low Mechanical Snore) ---
                const oscIn = ctx.createOscillator();
                const gainIn = ctx.createGain();

                oscIn.type = 'sawtooth';
                oscIn.frequency.setValueAtTime(110, now);
                oscIn.frequency.linearRampToValueAtTime(130, now + 1.8);

                gainIn.gain.setValueAtTime(0, now);
                gainIn.gain.linearRampToValueAtTime(0.45, now + 0.4);
                gainIn.gain.linearRampToValueAtTime(0.45, now + 1.4);
                gainIn.gain.linearRampToValueAtTime(0, now + 1.8);

                oscIn.connect(gainIn);
                gainIn.connect(ctx.destination);

                oscIn.start(now);
                oscIn.stop(now + 1.8);

                activeSnoreNodes.push(oscIn, gainIn);

                // --- OUT-BREATH (Soft Whistle Sigh) ---
                const oscOut = ctx.createOscillator();
                const gainOut = ctx.createGain();

                oscOut.type = 'sine';
                oscOut.frequency.setValueAtTime(320, now + 2.2);
                oscOut.frequency.exponentialRampToValueAtTime(220, now + 3.7);

                gainOut.gain.setValueAtTime(0, now + 2.2);
                gainOut.gain.linearRampToValueAtTime(0.25, now + 2.5);
                gainOut.gain.linearRampToValueAtTime(0, now + 3.7);

                oscOut.connect(gainOut);
                gainOut.connect(ctx.destination);

                oscOut.start(now + 2.2);
                oscOut.stop(now + 3.7);

                activeSnoreNodes.push(oscOut, gainOut);

                // Clean up finished nodes
                setTimeout(() => {
                    activeSnoreNodes = activeSnoreNodes.filter(n => n !== oscIn && n !== gainIn && n !== oscOut && n !== gainOut);
                }, 4000);

            } catch (e) {
                console.warn('Erro ao reproduzir som de ronco:', e);
            }
        };

        const doStart = () => {
            playSnoreCycle();
            snoreInterval = setInterval(playSnoreCycle, 4500);
        };

        if (ctx.state === 'suspended') {
            ctx.resume().then(doStart).catch(e => console.warn('Erro ao resumir ctx:', e));
        } else {
            doStart();
        }
    }

    function stopSnoring() {
        if (snoreInterval) {
            clearInterval(snoreInterval);
            snoreInterval = null;
        }
        activeSnoreNodes.forEach(node => {
            try {
                if (typeof node.stop === 'function') {
                    node.stop();
                } else if (typeof node.disconnect === 'function') {
                    node.disconnect();
                }
            } catch (e) {
                // Node already stopped
            }
        });
        activeSnoreNodes = [];
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

        leftEye.setAttribute('class', 'eye');
        rightEye.setAttribute('class', 'eye');

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
        startIdleLook,
        stopIdleLook,
        setHappy,
        setConfused,
        setSurprised,
        startEffect,
        stopEffect,
        setAudioContext,
        get state() { return currentState; },
        init() {
            setIdle();
        }
    };
})();
