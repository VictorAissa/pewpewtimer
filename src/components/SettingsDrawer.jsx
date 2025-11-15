import { Drawer, DrawerContent, DrawerTrigger } from './ui/drawer';
import { useSelector, useDispatch } from 'react-redux';
import { updateRandomRatio } from '../features/timer';
import { updateAudioThreshold } from '../features/shotRecording';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';

function SettingsDrawer() {
    const dispatch = useDispatch();
    const audioThreshold = useSelector(
        (state) => state.shotRecording.audioThreshold
    );
    const randomRatio = useSelector((state) => state.timer.randomRatio);

    const handleAudioThresholdChange = (event) => {
        const value = event.target.valueAsNumber / 100;
        dispatch(updateAudioThreshold(value));
    };

    const handleRandomRatioChange = (event) => {
        const value = event.target.valueAsNumber / 100;
        dispatch(updateRandomRatio(value));
    };

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-[#95C623] transition-colors">
                    <Cog6ToothIcon className="w-6 h-6" />
                    <span className="text-xs">Settings</span>
                </button>
            </DrawerTrigger>
            <DrawerContent className="bg-gray-50 text-black">
                <div className="p-6 space-y-6">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="audioThreshold" className="text-lg">
                            Audio Threshold:{' '}
                            <span className="font-semibold">
                                {(audioThreshold * 100).toFixed(0)}%
                            </span>
                        </label>
                        <input
                            type="range"
                            id="audioThreshold"
                            min="0"
                            max="100"
                            value={audioThreshold * 100}
                            onChange={handleAudioThresholdChange}
                            className="w-full"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="randomRatio" className="text-lg">
                            Random Ratio:{' '}
                            <span className="font-semibold">
                                {(randomRatio * 100).toFixed(0)}%
                            </span>
                        </label>
                        <input
                            type="range"
                            id="randomRatio"
                            min="0"
                            max="100"
                            value={randomRatio * 100}
                            onChange={handleRandomRatioChange}
                            className="w-full"
                        />
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
}

export default SettingsDrawer;
