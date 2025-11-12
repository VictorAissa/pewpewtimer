// services/ShotDetectionService.js
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
        try {
            // Créer ou réutiliser le contexte audio
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }

            // Demander l'accès au microphone
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    echoCancellation: false,
                    noiseSuppression: false,
                    autoGainControl: false
                } 
            });
            
            this.microphone = stream;
            
            // Créer l'analyseur
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 256;
            this.analyser.smoothingTimeConstant = 0.3;
            
            // Connecter le micro à l'analyseur
            this.source = this.audioContext.createMediaStreamSource(stream);
            this.source.connect(this.analyser);
            
            // Préparer le buffer pour l'analyse
            const bufferLength = this.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(bufferLength);
            
            return true;
        } catch (error) {
            console.error('Erreur lors de l\'initialisation du micro:', error);
            throw new Error('Impossible d\'accéder au microphone. Vérifiez les permissions.');
        }
    }

    startListening(shotCallback, levelCallback = null, threshold = 0.3) {
        if (!this.analyser) {
            throw new Error('Service non initialisé. Appelez init() d\'abord.');
        }

        this.isListening = true;
        this.shotCallback = shotCallback;
        this.levelCallback = levelCallback;
        
        const detectShots = () => {
            if (!this.isListening) return;

            // Récupérer les données audio
            this.analyser.getByteFrequencyData(this.dataArray);
            
            // Calculer le niveau moyen
            let sum = 0;
            for (let i = 0; i < this.dataArray.length; i++) {
                sum += this.dataArray[i];
            }
            const average = sum / this.dataArray.length;
            const normalizedLevel = average / 255; // Normaliser entre 0 et 1
            
            // Callback pour le niveau visuel
            if (this.levelCallback) {
                this.levelCallback(normalizedLevel);
            }
            
            // Détecter les pics au-dessus du seuil
            const now = Date.now();
            if (normalizedLevel > threshold && 
                (now - this.lastShotTime) > this.debounceTime) {
                
                this.lastShotTime = now;
                
                // Limiter le nombre de coups
                if (this.shotCallback) {
                    this.shotCallback(now);
                }
            }
            
            // Continuer l'analyse
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
        // Pour mise à jour dynamique du seuil si besoin
        return Math.min(1, Math.max(0, newThreshold));
    }

    cleanup() {
        this.stopListening();
        
        // Arrêter le microphone
        if (this.microphone) {
            this.microphone.getTracks().forEach(track => track.stop());
            this.microphone = null;
        }
        
        // Déconnecter les nœuds audio
        if (this.source) {
            this.source.disconnect();
            this.source = null;
        }
        
        // Fermer le contexte audio si possible
        if (this.audioContext && this.audioContext.state !== 'closed') {
            this.audioContext.close();
            this.audioContext = null;
        }
        
        this.analyser = null;
        this.dataArray = null;
    }

    // Méthode utilitaire pour vérifier si le navigateur supporte l'API
    static isSupported() {
        return !!(navigator.mediaDevices && 
                  navigator.mediaDevices.getUserMedia && 
                  (window.AudioContext || window.webkitAudioContext));
    }

    // Obtenir l'état actuel
    getStatus() {
        return {
            initialized: !!this.analyser,
            listening: this.isListening,
            microphoneActive: !!this.microphone,
            supported: ShotDetectionService.isSupported()
        };
    }
}

export default new ShotDetectionService();