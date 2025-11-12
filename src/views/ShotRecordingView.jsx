// views/ShotRecordingView.jsx
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from '../components/Button';
import AudioLevelIndicator from '../components/AudioLevelIndicator';
import RandomizeButton from '../components/RandomizeButton';
import TimeDisplay from '../components/TimeDisplay';
import {
    updateValue,
    tick,
    reset,
    reload,
    applyRandomizedValue,
} from '../features/timer';
import { TypeEnum } from '../utils/enums';
import shotDetectionService from '../services/ShotDetectionService';
import audioService from '../services/AudioService';
import {
    addShot,
    updateAudioLevel,
    startRecording,
    resetSession,
    stopRecording as stopRecordingAction,
} from '../features/shotRecording';
import { formatShotData } from '../utils/shotFormatters';

const randomizeRatio = import.meta.env.VITE_RANDOMIZE_RATIO || 0.2;

function ShotRecordingView() {
    const values = useSelector((state) => state.timer);
    const dispatch = useDispatch();
    const [isRandomized, setIsRandomized] = useState(false);
    const { audioThreshold, shots, audioLevel } = useSelector(
        (state) => state.shotRecording
    );
    const shotRecording = useSelector((state) => state.shotRecording);
    const formattedShots = formatShotData(shotRecording);
    const [controller, setController] = useState(null);
    const isRecording = shotRecording.isRecording;

    const playBeepStart = () => audioService.playSound('beepStart');

    // TODO export (idem autre view)
    const doRandomize = (value) => {
        const randomizedPart =
            value * (Math.random() * randomizeRatio * 2 - randomizeRatio);
        return Math.round(value + randomizedPart);
    };

    const handleDelayChange = (event) => {
        dispatch(
            updateValue({
                type: TypeEnum.delay,
                value: event.target.valueAsNumber,
            })
        );
    };

    //TODO export (idem autre view)
    const tickDelay = async (signal) => {
        const actualDelayValue = isRandomized
            ? doRandomize(values.delay.actual)
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

    const start = async () => {
        if (values.isRunning) return;

        // Reset session précédente
        dispatch(resetSession());

        // Initialiser l'audio
        await audioService.init();

        // Forcer reps à 1
        dispatch(updateValue({ type: TypeEnum.reps, value: 1 }));

        dispatch(updateValue({ type: TypeEnum.isRunning, value: true }));

        const newController = new AbortController();
        setController(newController);
        const signal = newController.signal;

        // Phase de delay
        await tickDelay(signal);

        if (!signal.aborted) {
            // Passage en mode recording
            dispatch(updateValue({ type: TypeEnum.isPar, value: true }));
            playBeepStart();

            // Démarrer l'enregistrement des coups
            const startTime = Date.now();
            dispatch(startRecording(startTime));

            // Démarrer l'écoute du micro
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
        // Arrêter le controller si existe
        if (controller) {
            controller.abort();
        }

        // Arrêter l'écoute
        shotDetectionService.stopListening();

        // Arrêter l'enregistrement dans Redux
        dispatch(stopRecordingAction());

        // Reset le timer
        dispatch(reset());
        dispatch(updateValue({ type: TypeEnum.isRunning, value: false }));
    };

    useEffect(() => {
        const initMic = async () => {
            try {
                await shotDetectionService.init();
                console.log('Microphone initialisé');
            } catch (error) {
                console.error('Erreur init micro:', error);
                // Gérer l'erreur dans l'UI
            }
        };

        //if (shotDetectionService.isSupported()) {
            initMic();
        //}

        // Cleanup au démontage
        return () => {
            shotDetectionService.cleanup();
        };
    }, []);

    return (
        <div className={`flex-1 ${values.isPar ? 'isPar' : 'isDelay'}`}>
            <form className="flex justify-center p-6 text-xl gap-2">
                <div className="flex flex-col text-xl gap-4">
                    <div className="flex justify-between gap-2">
                        <label htmlFor="delay">Delay :</label>
                        <input
                            type="number"
                            id="delay"
                            className="rounded-sm h-8 text-gray-700 w-12 text-center"
                            value={values.delay.displayed}
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
                            ? values.isPar
                                ? 'isPar_text'
                                : 'isDelay_text'
                            : 'isReady_text'
                    }
                >
                    {isRecording
                        ? values.isPar
                            ? 'RECORDING'
                            : 'WAIT'
                        : 'READY'}
                </div>
                <TimeDisplay value={values.delay.actual} isPar={false} />
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

            {/* Zone d'affichage des shots */}
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
