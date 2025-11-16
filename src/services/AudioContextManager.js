/**
 * Singleton class to manage the AudioContext for the application.
 */
class AudioContextManager {
    constructor() {
        this.audioContext = null;
    }

    /**
     * Provides the AudioContext instance, creating it if it doesn't exist.
     * @returns {AudioContext} The AudioContext instance.
     */
    getContext() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext ||
                window.webkitAudioContext)();
        }
        return this.audioContext;
    }

    /**
     * Resumes the AudioContext if it is in a suspended state.
     * @returns {Promise<void>} A promise that resolves when the context is resumed.
     */
    async resume() {
        const ctx = this.getContext();
        if (ctx.state === 'suspended') {
            await ctx.resume();
        }
    }
}

export default new AudioContextManager();
