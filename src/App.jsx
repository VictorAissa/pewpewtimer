import { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import NoSleep from '@uriopass/nosleep.js';
import ModeSelector from './components/ModeSelector';
import ParTimeView from './views/ParTimeView';
import ShotRecordingView from './views/ShotRecordingView';
import SettingsDrawer from './components/SettingsDrawer';

function App() {
    const [currentMode, setCurrentMode] = useState('parTime');

    useEffect(() => {
        // no mobile screen lock handling
        const noSleep = new NoSleep();

        const enableNoSleep = () => {
            noSleep.enable();
        };

        const disableNoSleep = () => {
            noSleep.disable();
        };

        document.addEventListener('click', enableNoSleep, { once: true });

        return () => {
            disableNoSleep();
            document.removeEventListener('click', enableNoSleep);
        };
    }, []);

    return (
        <Provider store={store}>
            <div className="h-full w-full flex justify-center py-10 text-gray-50 bg-gray-500">
                <div className="h-auto min-h-[500px] w-11/12 md:w-9/12 lg:w-1/3 flex flex-col bg-[#353535] rounded-md">
                    <h1 className="text-center text-3xl py-6">Pew Pew Timer</h1>
                    <div className="flex flex-col sm:flex-row justify-evenly items-center pb-4">
                        <ModeSelector
                            currentMode={currentMode}
                            onModeChange={setCurrentMode}
                        />
                        <SettingsDrawer />
                    </div>

                    {currentMode === 'parTime' ? (
                        <ParTimeView />
                    ) : (
                        <ShotRecordingView />
                    )}
                </div>
            </div>
        </Provider>
    );
}

export default App;
