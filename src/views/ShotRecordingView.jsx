import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTimerTick } from '../hooks/useTimer';
import { TypeEnum } from '../utils/enums';
import { formatShotData } from '../utils/shotFormatters';
import audioService from '../services/AudioService';
import shotDetectionService from '../services/ShotDetectionService';
import { updateValue, reset } from '../features/timer';
import {
    addShot,
    updateAudioLevel,
    startRecording,
    resetSession,
    stopRecording as stopRecordingAction,
} from '../features/shotRecording';
import Button from '../components/Button';
import AudioLevelIndicator from '../components/AudioLevelIndicator';
import RandomizeButton from '../components/RandomizeButton';
import TimeDisplay from '../components/TimeDisplay';

function ShotRecordingView() {
    const dispatch = useDispatch();
    const timerValues = useSelector((state) => state.timer);

    const [isRandomized, setIsRandomized] = useState(false);
    const { audioThreshold, audioLevel } = useSelector(
        (state) => state.shotRecording
    );
    const shotRecording = useSelector((state) => state.shotRecording);
    const isRecording = shotRecording.isRecording;
    const { tickDelay } = useTimerTick();
    const formattedShots = formatShotData(shotRecording);
    const [controller, setController] = useState(null);
    const [error, setError] = useState(null);

    const playBeepStart = () => audioService.playSound('beepStart');

    const handleDelayChange = (event) => {
        dispatch(
            updateValue({
                type: TypeEnum.delay,
                value: event.target.valueAsNumber,
            })
        );
    };

    const start = async () => {
        if (timerValues.isRunning) return;

        dispatch(resetSession());

        await audioService.init();

        // Force round length to 1
        dispatch(updateValue({ type: TypeEnum.reps, value: 1 }));

        dispatch(updateValue({ type: TypeEnum.isRunning, value: true }));

        const newController = new AbortController();
        setController(newController);
        const signal = newController.signal;

        await tickDelay(signal, isRandomized);

        if (!signal.aborted) {
            dispatch(updateValue({ type: TypeEnum.isPar, value: true }));
            playBeepStart();

            const startTime = Date.now();
            dispatch(startRecording(startTime));

            shotDetectionService.startListening(
                (timestamp) => {
                    if (
                        formattedShots.length <
                        parseInt(import.meta.env.VITE_MAX_SHOTS || 50)
                    ) {
                        dispatch(addShot(timestamp));
                    }
                },
                (level) => {
                    dispatch(updateAudioLevel(level));
                },
                audioThreshold
            );
        }
    };

    const stop = () => {
        if (controller) {
            controller.abort();
        }

        shotDetectionService.stopListening();

        dispatch(stopRecordingAction());

        dispatch(reset());
        dispatch(updateValue({ type: TypeEnum.isRunning, value: false }));
    };

    useEffect(() => {
        const initMic = async () => {
            setError(null);

            if (!shotDetectionService.isSupported()) {
                setError('Shots detection is not supported by this browser.');
                return;
            }

            try {
                await shotDetectionService.init();
            } catch (error) {
                console.error('Error init micro:', error);
                setError('Micro non initialized, check permissions.');
            }
        };

        initMic();

        return () => {
            shotDetectionService.cleanup();
        };
    }, []);

    /**
     * Retry init if error
     */
    useEffect(() => {
        if (!error) return;

        const intervalId = setInterval(async () => {
            try {
                await shotDetectionService.init();
                setError(null);
            } catch (e) {
                console.error('Error retrying to init micro:', e);
            }
        }, 2000);

        return () => clearInterval(intervalId);
    }, [error]);

    if (error) {
        return (
            <div
                className="fixed inset-0 flex justify-center items-center bg-black/40 backdrop-blur-sm z-50"
                onClick={() => setError(null)}
            >
                <div className="px-8 py-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl text-center text-gray-100 max-w-md w-11/12">
                    <h2 className="text-2xl font-bold">{error}</h2>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex-1 ${timerValues.isPar ? 'isPar' : 'isDelay'}`}>
            <form className="flex justify-center p-6 text-xl gap-2">
                <div className="flex flex-col text-xl gap-4">
                    <div className="flex justify-between gap-2">
                        <label htmlFor="delay">Delay :</label>
                        <input
                            type="number"
                            id="delay"
                            className="rounded-sm h-8 text-gray-700 w-12 text-center"
                            value={timerValues.delay.displayed}
                            onChange={handleDelayChange}
                            disabled={isRecording}
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
                        isRecording
                            ? timerValues.isPar
                                ? 'isPar_text'
                                : 'isDelay_text'
                            : 'isReady_text'
                    }
                >
                    {isRecording
                        ? timerValues.isPar
                            ? 'RECORDING'
                            : 'WAIT'
                        : 'READY'}
                </div>
                <TimeDisplay
                    value={timerValues.delay.actual}
                    isRandomized={isRandomized}
                />
                {isRecording && (
                    <AudioLevelIndicator
                        level={audioLevel}
                        threshold={audioThreshold}
                    />
                )}
            </div>

            <div className="flex justify-center gap-6 p-6">
                <Button
                    onClick={start}
                    variant="primary"
                    disabled={isRecording}
                >
                    Start
                </Button>
                <Button onClick={stop} variant="danger">
                    Stop
                </Button>
            </div>

            {/* Shots display zone*/}
            <div className="p-6">
                <h3 className="text-lg font-semibold mb-2">Shots:</h3>
                <div className="bg-gray-700 rounded p-4 min-h-[100px] max-h-[200px] overflow-y-auto">
                    {formattedShots.length === 0 ? (
                        <p className="text-gray-400">
                            No shots recorded yet...
                        </p>
                    ) : (
                        <ul className="space-y-1">
                            {formattedShots.map((shot, index) => (
                                <li key={index} className="text-sm">
                                    {shot.type === 'first'
                                        ? `1. First: ${shot.time}s`
                                        : `${shot.number}. Split: ${shot.split}s (${shot.total}s)`}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                {formattedShots.length > 0 && !isRecording && (
                    <div className="mt-2 text-sm text-gray-300 font-semibold">
                        Total: {shotRecording.totalTime}s |{' '}
                        {formattedShots.length} shots
                    </div>
                )}
            </div>
        </div>
    );
}

export default ShotRecordingView;
