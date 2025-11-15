import PropTypes from 'prop-types';

function AudioLevelIndicator({ level = 0, threshold = 0.3 }) {
    return (
        <div className="flex w-full max-w-[250px] justify-start items-center px-6 mt-4">
            <div className="flex-1 h-2 bg-gray-700 rounded-full relative">
                {/* Level bar */}
                <div
                    className={`h-full rounded-full transition-all duration-75 ${
                        level > threshold ? 'bg-[--red]' : 'bg-[--green]'
                    }`}
                    style={{ width: `${level * 100}%` }}
                />
                {/* Treshold line */}
                <div
                    className="absolute top-0 h-full w-0.5 bg-gray-300"
                    style={{ left: `${threshold * 100}%` }}
                />
            </div>
        </div>
    );
}

AudioLevelIndicator.propTypes = {
    level: PropTypes.number,
    threshold: PropTypes.number,
};

export default AudioLevelIndicator;
