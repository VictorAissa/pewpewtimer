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
    const [isAudioInitialized, setIsAudioInitialized] = useState(false);

    const handleInitialUnlock = useCallback(async () => {
        try {
            await audioStreamService.initStream();
            setIsAudioInitialized(true);
        } catch (e) {
            console.warn(
                "Impossible d'initialiser le flux audio, l'application peut continuer mais sans sons."
            );
            setIsAudioInitialized(true); // Continuer l'application même sans audio
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

        document.addEventListener('click', enableNoSleep, { once: true });

        return () => {
            disableNoSleep();
            document.removeEventListener('click', enableNoSleep);
            audioStreamService.cleanup();
        };
    }, []);

    if (!isAudioInitialized) {
        return (
            <Provider store={store}>
                <div className="h-full w-full flex justify-center items-center text-gray-50 bg-gray-500 relative">
                    <div className="p-8 text-center bg-[--khaki-dark] md:rounded-md w-full md:w-9/12 lg:w-1/3">
                        <h2 className="text-2xl font-bold mb-4">
                            Autorisation Audio Requise
                        </h2>

                        <button onClick={handleInitialUnlock}>
                            Démarrer l Application
                        </button>
                    </div>
                </div>
            </Provider>
        );
    }

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
