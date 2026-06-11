/**
 * audio-processor.worklet.js
 * AudioWorkletProcessor — roda em thread de áudio dedicada (não a UI thread).
 *
 * Responsabilidades:
 *  1. Receber frames de áudio do microfone (float32, sample rate nativo do dispositivo)
 *  2. Fazer downsampling para 16kHz (requerido pelo Whisper)
 *  3. Acumular amostras em um buffer de ~3s e enviar para o Worker de inferência
 */

const TARGET_SAMPLE_RATE = 16000;
const CHUNK_DURATION_S = 3; // segundos por chunk enviado ao Whisper

class AudioProcessor extends AudioWorkletProcessor {
    constructor(options) {
        super();
        this._inputSampleRate = options.processorOptions?.inputSampleRate || 44100;
        this._ratio = this._inputSampleRate / TARGET_SAMPLE_RATE;
        this._buffer = [];
        this._targetChunkSize = TARGET_SAMPLE_RATE * CHUNK_DURATION_S;
    }

    /**
     * Downsampling linear simples: pega 1 sample a cada `ratio` samples.
     * Funciona para qualquer sample rate nativo (44100, 48000, etc.)
     */
    _downsample(inputData) {
        const outputLength = Math.floor(inputData.length / this._ratio);
        const output = new Float32Array(outputLength);
        for (let i = 0; i < outputLength; i++) {
            output[i] = inputData[Math.floor(i * this._ratio)];
        }
        return output;
    }

    process(inputs) {
        const input = inputs[0];
        if (!input || input.length === 0) return true;

        // Pega canal 0 (mono)
        const channelData = input[0];
        if (!channelData || channelData.length === 0) return true;

        const downsampled = this._downsample(channelData);

        // Acumula no buffer
        for (let i = 0; i < downsampled.length; i++) {
            this._buffer.push(downsampled[i]);
        }

        // Quando tiver chunk suficiente, envia para o worker de inferência
        if (this._buffer.length >= this._targetChunkSize) {
            const chunk = new Float32Array(this._buffer.splice(0, this._targetChunkSize));
            this.port.postMessage({ type: 'audio_chunk', chunk }, [chunk.buffer]);
        }

        return true; // mantém o processor vivo
    }
}

registerProcessor('audio-processor', AudioProcessor);
