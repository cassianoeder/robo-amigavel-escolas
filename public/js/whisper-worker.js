/**
 * whisper-worker.js
 * Web Worker dedicado à inferência do Whisper via Transformers.js.
 *
 * Roda completamente fora da thread UI — não bloqueia o robô.
 * O modelo é baixado 1x e cacheado pelo browser no IndexedDB.
 *
 * Mensagens recebidas (do main thread):
 *   { type: 'load' }                       → inicia carregamento do modelo
 *   { type: 'audio_chunk', chunk: Float32Array } → transcreve chunk de áudio
 *
 * Mensagens enviadas (para o main thread):
 *   { type: 'loading_progress', progress }  → progresso do download (0-100)
 *   { type: 'ready' }                       → modelo carregado, pronto para transcrever
 *   { type: 'transcript', text: string }    → resultado da transcrição
 *   { type: 'error', message: string }      → erro fatal
 */

// Importa Transformers.js via CDN (funciona em Web Worker, sem import maps necessários)
importScripts('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.5.2/dist/transformers.min.js');

const { pipeline, env } = transformers;

// Configurações do ambiente Transformers.js
// Usa o backend WASM (funciona em todos os browsers) com WebGPU como acelerador opcional
env.allowLocalModels = false; // sempre da HuggingFace Hub (cacheado no IndexedDB)
env.useBrowserCache = true;   // cache no IndexedDB do browser — download único
env.backends.onnx.wasm.numThreads = 1; // Previne crash/OOM em mobile reduzindo paralelismo do WASM

let transcriber = null;
let isReady = false;

/**
 * Carrega o pipeline Whisper.
 * whisper-tiny: ~75MB, suporte multilingual (PT-BR incluído), roda em mobile.
 */
async function loadModel() {
    try {
        self.postMessage({ type: 'loading_progress', progress: 0, message: 'Iniciando download do modelo...' });

        transcriber = await pipeline(
            'automatic-speech-recognition',
            'openai/whisper-tiny',
            {
                // Callback de progresso durante download
                progress_callback: (progressInfo) => {
                    if (progressInfo.status === 'progress') {
                        const progress = Math.round((progressInfo.loaded / progressInfo.total) * 100);
                        self.postMessage({
                            type: 'loading_progress',
                            progress,
                            message: `Baixando modelo: ${progress}%`
                        });
                    } else if (progressInfo.status === 'done') {
                        self.postMessage({
                            type: 'loading_progress',
                            progress: 100,
                            message: 'Modelo carregado!'
                        });
                    }
                },
                // Forçar WASM para garantir compatibilidade máxima no Android
                device: 'wasm',
                dtype: 'q8', // quantização 8-bit: menor tamanho, boa precisão
            }
        );

        isReady = true;
        self.postMessage({ type: 'ready' });
        console.log('[WhisperWorker] Modelo pronto!');
    } catch (error) {
        console.error('[WhisperWorker] Falha ao carregar modelo:', error);
        self.postMessage({ type: 'error', message: error.message });
    }
}

/**
 * Transcreve um chunk de áudio (Float32Array, 16kHz, mono).
 */
async function transcribe(chunk) {
    if (!isReady || !transcriber) {
        console.warn('[WhisperWorker] Modelo não pronto, ignorando chunk.');
        return;
    }

    try {
        // Whisper espera: Float32Array, 16kHz, mono
        const result = await transcriber(chunk, {
            language: 'portuguese',
            task: 'transcribe',
            // Sem timestamps — apenas texto
            return_timestamps: false,
        });

        const text = (result?.text || '').trim();
        if (text && text.length > 1) { // filtra resultados com 1 char (ruído)
            self.postMessage({ type: 'transcript', text });
        }
    } catch (error) {
        console.error('[WhisperWorker] Erro na transcrição:', error);
        // Não envia erro para não quebrar o fluxo — apenas loga
    }
}

// Ouvinte de mensagens do main thread
self.addEventListener('message', async (event) => {
    const { type, chunk } = event.data;

    switch (type) {
        case 'load':
            await loadModel();
            break;
        case 'audio_chunk':
            await transcribe(chunk);
            break;
        default:
            console.warn('[WhisperWorker] Mensagem desconhecida:', type);
    }
});
