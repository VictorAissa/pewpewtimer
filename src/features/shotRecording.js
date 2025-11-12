import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    // État d'enregistrement
    shots: [],  // Array de timestamps absolus des coups détectés
    sessionStartTime: null,  // Timestamp du beep de départ
    isRecording: false,  // État d'enregistrement actif
    
    // Données calculées
    firstShot: null,  // Temps du premier coup depuis beep (en secondes)
    splits: [],  // Temps entre chaque coup (en secondes)
    totalTime: null,  // Temps total jusqu'au dernier coup (en secondes)
    
    // Configuration audio
    audioThreshold: parseFloat(import.meta.env.VITE_AUDIO_THRESHOLD || 0.3),  // Seuil de détection (0-1)
    audioLevel: 0,  // Niveau audio actuel pour feedback visuel (0-1)
};

export const shotRecording = createSlice({
    name: 'shotRecording',
    initialState,
    reducers: {
        startRecording: (state, action) => {
            state.sessionStartTime = action.payload; // Timestamp du début
            state.isRecording = true;
            state.shots = [];
            state.firstShot = null;
            state.splits = [];
            state.totalTime = null;
            state.audioLevel = 0;
        },
        
        stopRecording: (state) => {
            state.isRecording = false;
            // Calcul du temps total final
            if (state.shots.length > 0 && state.sessionStartTime) {
                state.totalTime = ((state.shots[state.shots.length - 1] - state.sessionStartTime) / 1000).toFixed(2);
            }
        },
        
        addShot: (state, action) => {
            const shotTimestamp = action.payload;
            state.shots.push(shotTimestamp);
            
            // Calcul du temps depuis le début
            const timeFromStart = (shotTimestamp - state.sessionStartTime) / 1000;
            
            // Premier coup
            if (state.shots.length === 1) {
                state.firstShot = timeFromStart.toFixed(2);
            }
            
            // Calcul du split (temps depuis le coup précédent)
            if (state.shots.length > 1) {
                const previousShot = state.shots[state.shots.length - 2];
                const split = ((shotTimestamp - previousShot) / 1000).toFixed(2);
                state.splits.push(split);
            }
            
            // Mise à jour du temps total
            state.totalTime = timeFromStart.toFixed(2);
        },
        
        updateAudioLevel: (state, action) => {
            state.audioLevel = Math.min(1, Math.max(0, action.payload));
        },
        
        updateAudioThreshold: (state, action) => {
            state.audioThreshold = Math.min(1, Math.max(0, action.payload));
        },
        
        resetSession: (state) => {
            state.shots = [];
            state.sessionStartTime = null;
            state.isRecording = false;
            state.firstShot = null;
            state.splits = [];
            state.totalTime = null;
            state.audioLevel = 0;
        },
    },
});

export const {
    startRecording,
    stopRecording,
    addShot,
    updateAudioLevel,
    updateAudioThreshold,
    resetSession,
} = shotRecording.actions;

export default shotRecording.reducer;