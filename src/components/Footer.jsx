import PropTypes from 'prop-types';
import { ClockIcon, MicrophoneIcon } from '@heroicons/react/24/outline';
import SettingsDrawer from './SettingsDrawer';

const Footer = ({ currentMode, onModeChange }) => {
    const handleModeChange = (mode) => {
        onModeChange(mode);
    };

    return (
        <footer className="flex justify-around items-center py-4 px-4 bg-[--khaki-dark]">
            <button
                onClick={() => handleModeChange('parTime')}
                className={`flex flex-col items-center gap-1 transition-colors ${
                    currentMode === 'parTime'
                        ? 'text-[--green]'
                        : 'text-gray-400'
                }`}
            >
                <ClockIcon className="w-6 h-6" />
                <span className="text-xs">Par Time</span>
            </button>

            <button
                onClick={() => handleModeChange('shotRecording')}
                className={`flex flex-col items-center gap-1 transition-colors ${
                    currentMode === 'shotRecording'
                        ? 'text-[--green]'
                        : 'text-gray-400'
                }`}
            >
                <MicrophoneIcon className="w-6 h-6" />
                <span className="text-xs">Recording</span>
            </button>

            <SettingsDrawer />
        </footer>
    );
};

Footer.propTypes = {
    currentMode: PropTypes.string.isRequired,
    onModeChange: PropTypes.func.isRequired,
};

export default Footer;
