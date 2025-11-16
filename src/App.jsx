import { useState, useEffect, useCallback } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import NoSleep from '@uriopass/nosleep.js';
import ParTimeView from './views/ParTimeView';
import ShotRecordingView from './views/ShotRecordingView';
import Footer from './components/Footer.jsx';
import audioStreamService from './services/AudioStreamService';

function App() {
    const [currentMode, setCurrentMode] = useState('parTime');

    /**
     * Handle the initial unlock of audio on user interaction.
     * This is necessary for ios devices that block audio playback
     * unless it is explicitly triggered by a user action.
     */
    const handleInitialUnlock = useCallback(async () => {
        try {
            await audioStreamService.initStream();
        } catch (e) {
            console.warn('Error while initiating audio stream : ', e);
        }
    }, []);

    useEffect(() => {
        // no mobile screen lock handling
        const noSleep = new NoSleep();

        const enableNoSleep = () => {
            noSleep.enable();
        };

        const disableNoSleep = () => {
            noSleep.disable();
        };

        document.addEventListener(
            'click',
            () => {
                enableNoSleep();
                handleInitialUnlock();
            },
            { once: true }
        );

        return () => {
            disableNoSleep();
            document.removeEventListener('click', enableNoSleep);
            audioStreamService.cleanup();
        };
    }, [handleInitialUnlock]);

    return (
        <Provider store={store}>
            <div className="h-full w-full flex justify-center text-gray-50 bg-gray-500 md:py-6 relative">
                <div className="h-full md:h-auto min-h-[500px] w-full md:w-9/12 lg:w-1/3 flex flex-col bg-[--khaki-dark] md:rounded-md">
                    <header>
                        <h1 className="text-center text-3xl py-6">
                            Pew Pew Timer
                        </h1>
                    </header>

                    {currentMode === 'parTime' ? (
                        <ParTimeView />
                    ) : (
                        <ShotRecordingView />
                    )}

                    <Footer
                        currentMode={currentMode}
                        onModeChange={setCurrentMode}
                    />
                </div>
            </div>
        </Provider>
    );
}

export default App;
