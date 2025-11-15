class AudioContextManager {
    constructor() {
        this.audioContext = null;
    }

    getContext() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext ||
                window.webkitAudioContext)();
        }
        return this.audioContext;
    }

    async resume() {
        const ctx = this.getContext();
        if (ctx.state === 'suspended') {
            await ctx.resume();
        }
    }
}

export default new AudioContextManager();
