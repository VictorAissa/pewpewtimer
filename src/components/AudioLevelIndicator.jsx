function AudioLevelIndicator({ level = 0, threshold = 0.3 }) {
    return (
        <div className="flex w-full max-w-md justify-start items-center gap-2 px-6">
            <span className="text-xl">🎤</span>
            <div className="flex-1 h-2 bg-gray-700 rounded-full relative">
                {/* Level bar */}
                <div
                    className={`h-full rounded-full transition-all duration-75 ${
                        level > threshold ? 'bg-red-600' : 'bg-green-500'
                    }`}
                    style={{ width: `${level * 100}%` }}
                />
                {/* Treshold line */}
                <div
                    className="absolute top-0 h-full w-0.5 bg-gray-300"
                    style={{ left: `${threshold * 100}%` }}
                />
            </div>
            <span className="text-sm ">
                {(level * 100).toFixed(0)}%
            </span>
        </div>
    );
}

export default AudioLevelIndicator;
