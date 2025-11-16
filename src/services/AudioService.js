import audioContextManager from './AudioContextManager';

/**
 * Service to manage audio playback.
 */
class AudioService {
    constructor() {
        this.audioContext = null;
        this.buffers = {};
        this.initialized = false;
    }

    /**
     * Initialize the Audio Service.
     * @returns {void}
     */
    async init() {
        if (this.initialized) return;

        this.audioContext = audioContextManager.getContext();
        await this.audioContext.resume();

        this.initialized = true;
    }

    /**
     * Preload sound files into buffers.
     * @returns {void}
     */
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

    /**
     * Play a sound by its key.
     * @param {String} soundKey Key of the sound to play
     * @returns {void}
     */
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
