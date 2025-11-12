import { configureStore } from '@reduxjs/toolkit';
import timer from './features/timer';
import shotRecording from './features/shotRecording';

export const store = configureStore({
    reducer: {
        timer,
        shotRecording,
    },
});
