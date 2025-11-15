import { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import NoSleep from '@uriopass/nosleep.js';
import ParTimeView from './views/ParTimeView';
import ShotRecordingView from './views/ShotRecordingView';
import Footer from './components/Footer.jsx';

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
