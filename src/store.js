import { configureStore } from '@reduxjs/toolkit';
import timer from './features/timer';

export const store = configureStore({
    reducer: {
        timer,
    },
});
