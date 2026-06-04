"use client";

export default function Page() {
    return (
        <>
            {/* ===== CONFIG MODAL ===== */}
            <div id="config-overlay" className="modal-overlay active">
                <div className="modal-card">
                    <div className="modal-header">
                        <div className="modal-icon">⚙️</div>
                        <h1 id="modal-title">Configurar Robô</h1>
                        <p className="modal-subtitle">Preencha a URL do webhook para ativar o robô</p>
                    </div>

                    <form id="config-form" className="modal-body" autoComplete="off">
                        {/* Webhook URL */}
                        <div className="field-group">
                            <label htmlFor="cfg-webhook">URL do Webhook n8n <span className="required">*</span></label>
                            <input type="url" id="cfg-webhook" placeholder="https://seu-n8n.com/webhook/..." required />
                        </div>

                        {/* JWT Token */}
                        <div className="field-group">
                            <label htmlFor="cfg-token">Token JWT Bearer <span className="optional">(opcional)</span></label>
                            <input type="text" id="cfg-token" placeholder="eyJhbGciOiJIUzI1NiIs..." />
                        </div>

                        {/* Accent Color */}
                        <div className="field-group">
                            <label>Cor de destaque do robô</label>
                            <div className="color-options" id="cfg-colors">
                                <button type="button" className="color-btn" data-color="rosa" style={{ '--swatch': '#FF69B4' }} title="Rosa">
                                    <span className="swatch"></span><span className="color-label">Rosa</span>
                                </button>
                                <button type="button" className="color-btn" data-color="verde-neon" style={{ '--swatch': '#39FF14' }} title="Verde Neon">
                                    <span className="swatch"></span><span className="color-label">Verde Neon</span>
                                </button>
                                <button type="button" className="color-btn selected" data-color="azul-escuro" style={{ '--swatch': '#1B3A6B' }} title="Azul Escuro">
                                    <span className="swatch"></span><span className="color-label">Azul Escuro</span>
                                </button>
                                <button type="button" className="color-btn" data-color="laranja" style={{ '--swatch': '#FF6B35' }} title="Laranja">
                                    <span className="swatch"></span><span className="color-label">Laranja</span>
                                </button>
                                <button type="button" className="color-btn" data-color="branco" style={{ '--swatch': '#FFFFFF' }} title="Branco">
                                    <span className="swatch"></span><span className="color-label">Branco</span>
                                </button>
                            </div>
                        </div>

                        {/* Voice */}
                        <div className="field-group">
                            <label htmlFor="cfg-voice">Voz</label>
                            <select id="cfg-voice">
                                <option value="">Carregando vozes...</option>
                            </select>
                        </div>

                        {/* Speech Rate */}
                        <div className="field-group">
                            <label htmlFor="cfg-rate">Velocidade da fala: <span id="rate-value">1.0</span>x</label>
                            <input type="range" id="cfg-rate" min="0.5" max="2" step="0.1" defaultValue="1.0" />
                        </div>

                        {/* Sleepiness Timeout */}
                        <div className="field-group">
                            <label htmlFor="cfg-sleep">Modo sonolência após inatividade</label>
                            <select id="cfg-sleep" defaultValue="40">
                                <option value="20">20 segundos</option>
                                <option value="40">40 segundos</option>
                                <option value="60">1 minuto</option>
                            </select>
                        </div>

                        <button type="submit" className="btn-primary" id="btn-save-config">
                            <span className="btn-icon">🤖</span> Ativar Robô
                        </button>
                    </form>
                </div>
            </div>

            {/* ===== SETTINGS GEAR BUTTON ===== */}
            <button id="btn-settings" className="settings-btn" title="Configurações" aria-label="Abrir configurações">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
            </button>

            {/* ===== ROBOT FACE CONTAINER ===== */}
            <main id="robot-container" className="robot-container hidden">
                {/* Hidden video for camera/motion detection */}
                <video id="camera-feed" autoPlay playsInline muted></video>
                <canvas id="motion-canvas"></canvas>

                {/* Robot Face SVG */}
                <div className="robot-face-wrapper">
                    <svg id="robot-face" viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg">
                        {/* Face background (rounded screen) */}
                        <rect id="face-bg" x="40" y="20" width="720" height="460" rx="80" ry="80" />

                        {/* Left Eye */}
                        <g id="left-eye" className="eye">
                            <ellipse className="eye-white" cx="270" cy="210" rx="95" ry="100" />
                            <circle className="eye-iris" cx="270" cy="210" r="50" />
                            <circle className="eye-pupil" cx="270" cy="210" r="25" />
                            <ellipse className="eye-shine" cx="252" cy="190" rx="14" ry="18" />
                            {/* Eyelid for blinking/sleepy */}
                            <ellipse className="eyelid" cx="270" cy="210" rx="100" ry="105" />
                        </g>

                        {/* Right Eye */}
                        <g id="right-eye" className="eye">
                            <ellipse className="eye-white" cx="530" cy="210" rx="95" ry="100" />
                            <circle className="eye-iris" cx="530" cy="210" r="50" />
                            <circle className="eye-pupil" cx="530" cy="210" r="25" />
                            <ellipse className="eye-shine" cx="512" cy="190" rx="14" ry="18" />
                            {/* Eyelid for blinking/sleepy */}
                            <ellipse className="eyelid" cx="530" cy="210" rx="100" ry="105" />
                        </g>

                        {/* Mouth */}
                        <path id="robot-mouth" className="mouth" d="M 300 370 Q 400 420 500 370" />

                        {/* Question marks (thinking state) */}
                        <g id="question-marks" className="question-marks hidden">
                            <text x="620" y="120" className="qmark q1">?</text>
                            <text x="660" y="80" className="qmark q2">?</text>
                            <text x="700" y="130" className="qmark q3">?</text>
                        </g>
                    </svg>
                </div>

                {/* Microphone indicator */}
                <div id="mic-indicator" className="mic-indicator">
                    <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor">
                        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                        <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                    </svg>
                    <span className="mic-label" id="mic-label">Ouvindo...</span>
                </div>
            </main>
        </>
    );
}
