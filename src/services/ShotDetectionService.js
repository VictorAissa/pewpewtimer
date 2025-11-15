import audioContextManager from './AudioContextManager';

class ShotDetectionService {
    constructor() {
        this.audioContext = null;
        this.microphone = null;
        this.analyser = null;
        this.dataArray = null;
        this.source = null;
        this.animationId = null;
        this.isListening = false;
        this.lastShotTime = 0;
        this.debounceTime = parseInt(import.meta.env.VITE_DEBOUNCE_TIME || 100);
        this.maxShots = parseInt(import.meta.env.VITE_MAX_SHOTS || 50);
        this.shotCallback = null;
        this.levelCallback = null;
    }

    async init() {
        if (this.analyser) return true;

        try {
            this.audioContext = audioContextManager.getContext();
            await audioContextManager.resume();

            // Ask for microphone access
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: false,
                    noiseSuppression: false,
                    autoGainControl: false,
                },
            });

            this.microphone = stream;

            // Create analyser node
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 256;
            this.analyser.smoothingTimeConstant = 0.3;

            // Connect microphone to analyser
            this.source = this.audioContext.createMediaStreamSource(stream);
            this.source.connect(this.analyser);

            // Prepare buffer
            const bufferLength = this.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(bufferLength);

            return true;
        } catch (error) {
            console.error("Erreur lors de l'initialisation du micro:", error);
            throw new Error(
                "Impossible d'accéder au microphone. Vérifiez les permissions."
            );
        }
    }

    startListening(shotCallback, levelCallback = null, threshold = 0.3) {
        if (!this.analyser) {
            throw new Error("Service non initialisé. Appelez init() d'abord.");
        }

        this.isListening = true;
        this.shotCallback = shotCallback;
        this.levelCallback = levelCallback;

        const detectShots = () => {
            if (!this.isListening) return;

            // Get audio data
            this.analyser.getByteFrequencyData(this.dataArray);

            // Calculate average level
            let sum = 0;
            for (let i = 0; i < this.dataArray.length; i++) {
                sum += this.dataArray[i];
            }
            const average = sum / this.dataArray.length;
            const normalizedLevel = average / 255; // Normalize between 0 and 1

            if (this.levelCallback) {
                this.levelCallback(normalizedLevel);
            }

            // Detect shots
            const now = Date.now();
            if (
                normalizedLevel > threshold &&
                now - this.lastShotTime > this.debounceTime
            ) {
                this.lastShotTime = now;

                // Limit total shots
                if (this.shotCallback) {
                    this.shotCallback(now);
                }
            }

            // Continue analysis
            this.animationId = requestAnimationFrame(detectShots);
        };

        detectShots();
    }

    stopListening() {
        this.isListening = false;

        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }

        this.shotCallback = null;
        this.levelCallback = null;
    }

    updateThreshold(newThreshold) {
        return Math.min(1, Math.max(0, newThreshold));
    }

    cleanup() {
        this.stopListening();

        // Stop microphone
        if (this.microphone) {
            this.microphone.getTracks().forEach((track) => track.stop());
            this.microphone = null;
        }

        // Disconnect audio nodes
        if (this.source) {
            this.source.disconnect();
            this.source = null;
        }

        this.audioContext = null;
        this.analyser = null;
        this.dataArray = null;
    }

    isSupported() {
        return !!(
            navigator.mediaDevices &&
            navigator.mediaDevices.getUserMedia &&
            (window.AudioContext || window.webkitAudioContext)
        );
    }
}

export default new ShotDetectionService();
