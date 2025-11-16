import audioContextManager from './AudioContextManager';

/**
 * Manage audio stream globally for the application.
 */
class AudioStreamService {
    constructor() {
        this.microphoneStream = null;
        this.isStreamActive = false;
        this.initPromise = null;
    }

    /**
     * Initializes the global audio stream.
     * @return {Promise<boolean>} Resolves to true if the stream is active, false otherwise
     */
    async initStream() {
        if (this.initPromise) return this.initPromise;

        this.initPromise = new Promise((resolve, reject) => {
            if (
                !navigator.mediaDevices ||
                !navigator.mediaDevices.getUserMedia
            ) {
                console.warn('getUserMedia non supported');
                this.isStreamActive = false;
                return resolve(false);
            }

            (async () => {
                try {
                    // 1. Initialise AudioContext
                    audioContextManager.getContext();
                    await audioContextManager.resume();

                    // 2. Ask for microphone access and store the stream
                    const stream = await navigator.mediaDevices.getUserMedia({
                        audio: {
                            echoCancellation: false,
                            noiseSuppression: false,
                            autoGainControl: false,
                        },
                    });

                    this.microphoneStream = stream;
                    this.isStreamActive = true;

                    resolve(true);
                } catch (error) {
                    console.error(
                        'Error while initiating global audio stream:',
                        error
                    );
                    this.isStreamActive = false;
                    reject(error);
                }
            })();
        });

        return this.initPromise;
    }

    /**
     * Clean up and stop the microphone when the application is unmounted.
     */
    cleanup() {
        if (this.microphoneStream) {
            this.microphoneStream.getTracks().forEach((track) => track.stop());
            this.microphoneStream = null;
        }
        this.isStreamActive = false;
    }

    /**
     * Give the stream to consumer services
     * @return {MediaStream|null} Microphone stream or null if not available
     */
    getStream() {
        return this.microphoneStream;
    }
}

export default new AudioStreamService();
