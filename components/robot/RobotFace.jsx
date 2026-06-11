'use client';
import { useEffect, useRef, useState } from 'react';

export default function RobotFace({ expression = 'idle', isListening = false }) {
    const faceRef = useRef(null);
    const leftEyeRef = useRef(null);
    const rightEyeRef = useRef(null);
    const mouthRef = useRef(null);
    const [blink, setBlink] = useState(false);

    // Paths
    const mouthPaths = {
        idle: 'M 300 370 Q 400 420 500 370',
        listening: 'M 300 375 Q 400 395 500 375',
        speaking: 'M 310 365 Q 400 430 490 365'
    };

    // Blinking effect
    useEffect(() => {
        const interval = setInterval(() => {
            if (expression !== 'sleepy') {
                setBlink(true);
                setTimeout(() => setBlink(false), 250);
            }
        }, 3000 + Math.random() * 3000);
        return () => clearInterval(interval);
    }, [expression]);

    return (
        <div className={`robot-face-wrapper ${expression}`} ref={faceRef}>
            <svg id="robot-face" viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <clipPath id="left-eye-clip">
                        <ellipse cx="270" cy="210" rx="95" ry="100" />
                    </clipPath>
                    <clipPath id="right-eye-clip">
                        <ellipse cx="530" cy="210" rx="95" ry="100" />
                    </clipPath>
                    <clipPath id="head-clip">
                        <rect x="40" y="20" width="720" height="460" rx="80" ry="80" />
                    </clipPath>
                </defs>

                <rect id="face-bg" x="40" y="20" width="720" height="460" rx="80" ry="80" />

                <g clipPath="url(#head-clip)">
                    {/* Cheeks */}
                    <ellipse className="blush-cheek left" cx="200" cy="325" rx="35" ry="16" />
                    <ellipse className="blush-cheek right" cx="600" cy="325" rx="35" ry="16" />

                    {/* Left Eye */}
                    <g className={`eye ${blink ? 'blink' : ''}`} ref={leftEyeRef}>
                        <ellipse className="eye-white" cx="270" cy="210" rx="95" ry="100" />
                        <g clipPath="url(#left-eye-clip)">
                            <circle className="eye-iris" cx="270" cy="210" r="50" />
                            <circle className="eye-pupil" cx="270" cy="210" r="25" />
                            <ellipse className="eye-shine" cx="252" cy="190" rx="14" ry="18" />
                        </g>
                        <ellipse className="eyelid" cx="270" cy="210" rx="100" ry="105" fill="var(--eyelid-color, #1A1A1A)" />
                    </g>

                    {/* Right Eye */}
                    <g className={`eye ${blink ? 'blink' : ''}`} ref={rightEyeRef}>
                        <ellipse className="eye-white" cx="530" cy="210" rx="95" ry="100" />
                        <g clipPath="url(#right-eye-clip)">
                            <circle className="eye-iris" cx="530" cy="210" r="50" />
                            <circle className="eye-pupil" cx="530" cy="210" r="25" />
                            <ellipse className="eye-shine" cx="512" cy="190" rx="14" ry="18" />
                        </g>
                        <ellipse className="eyelid" cx="530" cy="210" rx="100" ry="105" fill="var(--eyelid-color, #1A1A1A)" />
                    </g>

                    {/* Eyebrows */}
                    <path className="eyebrow" d="M 190 80 Q 260 70 330 80" />
                    <path className="eyebrow" d="M 470 80 Q 540 70 610 80" />

                    {/* Mouth */}
                    <path className="mouth" ref={mouthRef} d={mouthPaths[expression] || mouthPaths.idle} />
                </g>
            </svg>
        </div>
    );
}
