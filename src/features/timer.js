import { createSlice, current } from '@reduxjs/toolkit';
import { TypeEnum } from '../utils/enums';

const initialState = {
    parTime: {
        actual: 0,
        displayed: 0,
    },
    delay: {
        actual: 0,
        displayed: 0,
    },
    reps: {
        actual: 0,
        displayed: 0,
    },
    isRunning: false,
    isPar: false,
};

export const timer = createSlice({
    name: 'timer',
    initialState,
    reducers: {
        updateValue: (state, action) => {
            switch (action.payload.type) {
                case TypeEnum.parTime:
                    state.parTime.actual = action.payload.value * 10;
                    state.parTime.displayed = action.payload.value;
                    break;
                case TypeEnum.delay:
                    state.delay.actual = action.payload.value * 10;
                    state.delay.displayed = action.payload.value;
                    break;
                case TypeEnum.reps:
                    state.reps.actual = action.payload.value;
                    state.reps.displayed = action.payload.value;
                    break;
                case TypeEnum.isRunning:
                    state.isRunning = action.payload.value;
                    break;
                case TypeEnum.isPar:
                    state.isPar = action.payload.value;
                    break;
                case TypeEnum.intervalID:
                    state.intervalID = action.payload.value;
                    break;
                default:
                    console.error(
                        "Type d'action inconnu :",
                        action.payload.type
                    );
            }
        },
        tick: (state, action) => {
            switch (action.payload) {
                case TypeEnum.parTime:
                    state.parTime.actual > 0 && state.parTime.actual--;
                    break;
                case TypeEnum.delay:
                    state.delay.actual > 0 && state.delay.actual--;
                    break;
                case TypeEnum.reps:
                    state.reps.actual > 0 && state.reps.actual--;
                    break;
                default:
                    console.error(
                        "Type d'action inconnu :",
                        action.payload.type
                    );
            }
        },
        reset: (state) => {
            state.parTime.actual = state.parTime.displayed * 10;
            state.delay.actual = state.delay.displayed * 10;
            state.reps.actual = state.reps.displayed;
            state.isRunning = false;
            state.isPar = false;
        },
        reload: (state, action) => {
            switch (action.payload) {
                case TypeEnum.parTime:
                    state.parTime.actual = state.parTime.displayed * 10;
                    break;
                case TypeEnum.delay:
                    state.delay.actual = state.delay.displayed * 10;
                    break;
                case TypeEnum.reps:
                    state.reps.actual = state.reps.displayed;
                    break;
                default:
                    console.error(
                        "Type d'action inconnu :",
                        action.payload.type
                    );
            }
        },
    },
});

export const { updateValue, tick, reset, reload } = timer.actions;
export default timer.reducer;
