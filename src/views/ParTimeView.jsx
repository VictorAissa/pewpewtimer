import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import audioService from '../services/AudioService';
import shotDetectionService from '../services/ShotDetectionService';
import audioContextManager from '../services/AudioContextManager';
import { updateValue, tick, reset, reload } from '../features/timer';
import { TypeEnum } from '../utils/enums';
import Button from '../components/Button';
import RandomizeButton from '../components/RandomizeButton';
import TimeDisplay from '../components/TimeDisplay';
import { useTimerTick } from '../hooks/useTimer';

function ParTimeView() {
    const values = useSelector((state) => state.timer);
    const dispatch = useDispatch();
    const [controller, setController] = useState(null);
    const [isRandomized, setIsRandomized] = useState(false);
    const { tickDelay } = useTimerTick();
    const isIOS =
        /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        ('ontouchend' in document && /Mac/.test(navigator.userAgent));
    const [needsAudioUnlock, setNeedsAudioUnlock] = useState(
        isIOS && !shotDetectionService.getStatus().initialized
    );

    /* UTILS */
    const playBeepStart = () => audioService.playSound('beepStart');
    const playBeepEnd = () => audioService.playSound('beepEnd');

    /* DOMAIN */
    const tickParTime = async (signal) => {
        dispatch(
            updateValue({
                type: TypeEnum.isPar,
                value: true,
            })
        );
        playBeepStart();

        for (let index = 0; index < values.parTime.actual; index++) {
            if (signal.aborted) return;
            await new Promise((resolve) => {
                setTimeout(() => {
                    if (!signal.aborted) {
                        dispatch(tick(TypeEnum.parTime));
                    }
                    resolve();
                }, 100);
            });
        }

        !signal.aborted && playBeepEnd();
        dispatch(reload(TypeEnum.parTime));
    };

    const start = async () => {
        if (values.isRunning) return;

        await audioService.init();

        dispatch(
            updateValue({
                type: TypeEnum.isRunning,
                value: true,
            })
        );

        const newController = new AbortController();
        setController(newController);
        const signal = newController.signal;

        for (let index = 0; index < values.reps.actual; index++) {
            if (signal.aborted) break;
            await tickDelay(signal, isRandomized);
            if (signal.aborted) break;
            await tickParTime(signal);
            !signal.aborted && dispatch(tick(TypeEnum.reps));
        }

        dispatch(
            updateValue({
                type: TypeEnum.isRunning,
                value: false,
            })
        );
        dispatch(reset());
    };

    const stop = () => {
        if (controller) {
            controller.abort();
            dispatch(reset());
        }
    };

    const unlockAudio = async () => {
        try {
            await shotDetectionService.init();
            setNeedsAudioUnlock(false);
        } catch (error) {
            console.error('Error init micro:', error);
        }
    };

    /* EVENTS */
    const handleChange = (event) => {
        dispatch(
            updateValue({
                type: TypeEnum[event.target.id],
                value: event.target.valueAsNumber,
            })
        );
    };

    useEffect(() => {
        const loadAudio = async () => {
            await audioService.init();
            await audioService.preloadSounds();
        };

        loadAudio();
    }, []);

    return (
        <div className={`flex-1 ${values.isPar ? 'isPar' : 'isDelay'}`}>
            <form className="flex justify-between p-6 text-xl gap-2">
                <div className="flex flex-col text-xl gap-4 w-36">
                    <div className="flex justify-between gap-2">
                        <label htmlFor="parTime">ParTime :</label>
                        <input
                            className="rounded-sm h-8 text-gray-700 w-12 text-center"
                            type="number"
                            id="parTime"
                            value={values.parTime.displayed}
                            onChange={handleChange}
                            disabled={values.isRunning}
                        />
                    </div>
                    <div className="flex justify-between gap-2">
                        <label htmlFor="delay">Delay :</label>
                        <input
                            type="number"
                            id="delay"
                            className="rounded-sm h-8 text-gray-700 w-12 text-center"
                            value={values.delay.displayed}
                            onChange={handleChange}
                            disabled={values.isRunning}
                        />
                    </div>
                </div>
                <div className="flex flex-col text-xl gap-3 w-36">
                    <div className="flex justify-between gap-2 w-28">
                        <label htmlFor="reps">Reps :</label>
                        <input
                            type="number"
                            id="reps"
                            className="rounded-sm w-12 h-8 text-gray-700 text-center"
                            value={values.reps.displayed}
                            onChange={handleChange}
                            step="1"
                            pattern="[0-100]*"
                            disabled={values.isRunning}
                            onKeyDown={(e) => {
                                if (e.key === '.' || e.key === ',') {
                                    e.preventDefault();
                                }
                            }}
                        />
                    </div>
                    <RandomizeButton
                        isRandomized={isRandomized}
                        onToggle={() => setIsRandomized(!isRandomized)}
                    />
                </div>
            </form>

            <div className="flex flex-col items-center gap-2 text-xl p-6">
                <div
                    className={
                        values.isRunning
                            ? values.isPar
                                ? 'isPar_text'
                                : 'isDelay_text'
                            : 'isReady_text'
                    }
                >
                    {values.isRunning
                        ? values.isPar
                            ? 'SHOOT !'
                            : 'WAIT'
                        : 'READY'}
                </div>
                <TimeDisplay
                    value={
                        values.isPar
                            ? values.parTime.actual
                            : values.delay.actual
                    }
                    isPar={values.isPar}
                />
                <div>
                    {isNaN(values.reps.actual)
                        ? '0'
                        : `Round ${values.reps.actual}`}
                </div>
            </div>

            <div className="flex justify-center gap-6 p-6">
                <Button
                    onClick={start}
                    variant="primary"
                    disabled={values.isRunning}
                >
                    Start
                </Button>
                <Button onClick={stop} variant="danger">
                    Stop
                </Button>
            </div>

            {needsAudioUnlock && (
                <button
                    onClick={unlockAudio}
                    className="bg-white text-black px-6 py-3 rounded-lg text-xl font-semibold"
                >
                    Enable Audio (Required for iOS)
                </button>
            )}
        </div>
    );
}

export default ParTimeView;
