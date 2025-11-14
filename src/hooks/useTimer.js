import { useSelector, useDispatch } from 'react-redux';
import {
    updateValue,
    tick,
    reload,
    applyRandomizedValue,
} from '../features/timer';
import { TypeEnum } from '../utils/enums';

//const randomizeRatio = import.meta.env.VITE_RANDOMIZE_RATIO || 0.5;

export const doRandomize = (value, randomizeRatio) => {
    const randomizedPart =
        value * (Math.random() * randomizeRatio * 2 - randomizeRatio);
    return Math.round(value + randomizedPart);
};

export const useTimerTick = () => {
    const dispatch = useDispatch();
    const values = useSelector((state) => state.timer);
    const randomizeRatio = useSelector((state) => state.timer.randomRatio);

    const tickDelay = async (signal, isRandomized) => {
        const actualDelayValue = isRandomized
            ? doRandomize(values.delay.actual, randomizeRatio)
            : values.delay.actual;

        dispatch(applyRandomizedValue(actualDelayValue));
        dispatch(updateValue({ type: TypeEnum.isPar, value: false }));

        for (let index = 0; index < actualDelayValue; index++) {
            if (signal.aborted) return;
            await new Promise((resolve) => {
                setTimeout(() => {
                    if (!signal.aborted) {
                        dispatch(tick(TypeEnum.delay));
                    }
                    resolve();
                }, 100);
            });
        }

        dispatch(reload(TypeEnum.delay));
    };

    return { tickDelay };
};
