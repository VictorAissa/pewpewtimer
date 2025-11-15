import audioContextManager from './AudioContextManager';

class AudioService {
    constructor() {
        this.audioContext = null;
        this.buffers = {};
        this.initialized = false;
    }

    async init() {
        if (this.initialized) return;

        this.audioContext = audioContextManager.getContext();
        await this.audioContext.resume();

        this.initialized = true;
    }

    async preloadSounds() {
        if (Object.keys(this.buffers).length > 0) return;

        const sounds = {
            beepStart: '/sound/smooth.mp3',
            beepEnd: '/sound/sharp.mp3',
        };

        for (const [key, url] of Object.entries(sounds)) {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            this.buffers[key] = await this.audioContext.decodeAudioData(
                arrayBuffer
            );
        }
    }

    playSound(soundKey) {
        if (!this.buffers[soundKey]) {
            return;
        }

        const source = this.audioContext.createBufferSource();
        source.buffer = this.buffers[soundKey];
        source.connect(this.audioContext.destination);
        source.start();
    }
}

export default new AudioService();
