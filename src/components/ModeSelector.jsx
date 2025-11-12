// components/ModeSelector.jsx
import { useState } from 'react';

function ModeSelector({ onModeChange, currentMode = 'parTime' }) {
    const [mode, setMode] = useState(currentMode);

    const handleToggle = () => {
        const newMode = mode === 'parTime' ? 'shotRecording' : 'parTime';
        setMode(newMode);
        onModeChange(newMode);
    };

    return (
        <div className="flex justify-center items-center gap-4 py-4">
            <span
                className={`text-lg ${
                    mode === 'parTime' ? 'text-[#95C623]' : 'text-gray-400'
                }`}
            >
                Par Time
            </span>
            <button
                onClick={handleToggle}
                className="relative inline-flex h-8 w-16 items-center rounded-full bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-[#95C623] focus:ring-offset-2 focus:ring-offset-gray-800"
            >
                <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                        mode === 'shotRecording'
                            ? 'translate-x-9'
                            : 'translate-x-1'
                    }`}
                />
            </button>
            <span
                className={`text-lg ${
                    mode === 'shotRecording'
                        ? 'text-[#95C623]'
                        : 'text-gray-400'
                }`}
            >
                Shot Recording
            </span>
        </div>
    );
}

export default ModeSelector;
