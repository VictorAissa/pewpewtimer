import audioContextManager from './AudioContextManager';

class AudioStreamService {
    constructor() {
        this.microphoneStream = null;
        this.isStreamActive = false;
        this.initPromise = null;
    }

    /**
     * Initialise le flux micro et maintient le flux actif pour l'ensemble de l'application.
     */
    async initStream() {
        if (this.initPromise) return this.initPromise;

        // Retrait du mot-clé 'async' ici
        this.initPromise = new Promise((resolve, reject) => {
            if (
                !navigator.mediaDevices ||
                !navigator.mediaDevices.getUserMedia
            ) {
                console.warn('getUserMedia non supporté.');
                this.isStreamActive = false;
                return resolve(false);
            }

            // Utilisation d'une IIFE asynchrone pour gérer les 'await' à l'intérieur
            (async () => {
                try {
                    // 1. Initialise l'AudioContext via le manager
                    audioContextManager.getContext();
                    await audioContextManager.resume();

                    // 2. Demande et capture du flux micro
                    const stream = await navigator.mediaDevices.getUserMedia({
                        audio: {
                            echoCancellation: false,
                            noiseSuppression: false,
                            autoGainControl: false,
                        },
                    });

                    this.microphoneStream = stream;
                    this.isStreamActive = true;

                    console.log('🔓 Flux audio global initialisé et actif.');
                    resolve(true); // Termine la promesse en succès
                } catch (error) {
                    console.error(
                        "Échec de l'initialisation du flux audio global:",
                        error
                    );
                    this.isStreamActive = false;
                    reject(error); // Termine la promesse en échec
                }
            })(); // Exécution immédiate de la fonction asynchrone
        });

        return this.initPromise;
    }

    /**
     * Nettoie et stoppe le micro lors du démontage de l'application.
     */
    cleanup() {
        if (this.microphoneStream) {
            this.microphoneStream.getTracks().forEach((track) => track.stop());
            this.microphoneStream = null;
        }
        this.isStreamActive = false;
        console.log('🔒 Flux micro global arrêté.');
    }

    /**
     * Fournit le flux pour les services consommateurs (ex: ShotDetectionService).
     */
    getStream() {
        return this.microphoneStream;
    }
}

export default new AudioStreamService();
