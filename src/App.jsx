import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import startSound from './assets/sound/smooth.mp3';
import endSound from './assets/sound/sharp.mp3';
import { updateValue, tick, reset, reload } from './features/timer';
import { TypeEnum } from './utils/enums';

function App() {
    const values = useSelector((state) => state.timer);
    const dispatch = useDispatch();
    const [controller, setController] = useState(null);

    const playSound = (file) => {
        const audio = new Audio(file);
        audio.play();
    };

    const handleChange = (event) => {
        dispatch(
            updateValue({
                type: TypeEnum[event.target.id],
                value: event.target.valueAsNumber,
            })
        );
    };

    const tickParTime = async (signal) => {
        dispatch(
            updateValue({
                type: TypeEnum.isPar,
                value: true,
            })
        );
        playSound(startSound);
        for (let index = 0; index < values.parTime.displayed; index++) {
            if (signal.aborted) return;
            await new Promise((resolve) => {
                setTimeout(() => {
                    if (!signal.aborted) {
                        dispatch(tick(TypeEnum.parTime));
                    }
                    resolve();
                }, 1000);
            });
        }
        !signal.aborted && playSound(endSound);
        dispatch(reload(TypeEnum.parTime));
    };

    const tickDelay = async (signal) => {
        dispatch(
            updateValue({
                type: TypeEnum.isPar,
                value: false,
            })
        );
        for (let index = 0; index < values.delay.displayed; index++) {
            if (signal.aborted) return;
            await new Promise((resolve) => {
                setTimeout(() => {
                    if (!signal.aborted) {
                        dispatch(tick(TypeEnum.delay));
                    }
                    resolve();
                }, 1000);
            });
        }
        dispatch(reload(TypeEnum.delay));
    };

    const start = async () => {
        const newController = new AbortController();
        setController(newController);
        const signal = newController.signal;

        dispatch(
            updateValue({
                type: TypeEnum.isRunning,
                value: true,
            })
        );

        for (let index = 0; index < values.reps.actual; index++) {
            if (signal.aborted) break;
            await tickDelay(signal);
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
        //dispatch(reload(TypeEnum.reps));
        dispatch(reset());
    };

    const stop = () => {
        controller.abort();
        dispatch(reset());
    };

    return (
        <div
            className={`h-full w-full flex justify-center py-10 text-gray-50 ${
                values.isPar ? 'isPar' : 'isDelay'
            }`}
        >
            <div className="h-[500px] w-11/12 md:w-9/12 lg:w-1/3 flex flex-col bg-[#353535] rounded-md">
                <h1 className="text-center text-3xl py-6 ">Pew Pew Timer</h1>
                <form className="flex justify-between p-6 text-xl gap-2">
                    <div className="flex flex-col text-xl gap-4 w-40">
                        <div className="flex justify-between gap-2">
                            <label htmlFor="par">ParTime :</label>
                            <input
                                className="rounded-sm h-8 text-gray-700 w-10 text-center"
                                type="number"
                                id="parTime"
                                value={values.parTime.displayed}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="flex justify-between gap-2">
                            <label htmlFor="delay">Delay :</label>
                            <input
                                type="number"
                                id="delay"
                                className="rounded-sm h-8 text-gray-700  w-10 text-center"
                                value={values.delay.displayed}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="flex justify-between gap-2 w-36">
                        <label htmlFor="reps">Reps :</label>
                        <input
                            type="number"
                            id="reps"
                            className="rounded-sm w-10 h-8 text-gray-700 text-center"
                            value={values.reps.displayed}
                            onChange={handleChange}
                        />
                    </div>
                </form>

                <div className="flex flex-col items-center gap-2 text-xl p-6">
                    <div
                        className={values.isPar ? 'isPar_text' : 'isDelay_text'}
                    >
                        {values.isRunning
                            ? values.isPar
                                ? 'SHOOT !'
                                : 'WAIT'
                            : 'PRET'}
                    </div>
                    <div className="w-44 h-10 rounded-sm bg-white flex justify-center items-center text-gray-800 text-2xl">
                        {values.isPar
                            ? values.parTime.actual
                            : values.delay.actual}
                    </div>
                    <div>{`#${values.reps.actual}`}</div>
                </div>

                <div className="flex justify-center gap-6 p-6">
                    <button
                        className="w-20 h-10 bg-[#95C623] rounded-sm"
                        onClick={start}
                    >
                        Start
                    </button>
                    <button
                        className="w-20 h-10 bg-red-500 rounded-sm"
                        onClick={stop}
                    >
                        Stop
                    </button>
                </div>
            </div>
        </div>
    );
}

export default App;
