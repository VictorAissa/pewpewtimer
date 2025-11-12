function AudioLevelIndicator({ level = 0, threshold = 0.3 }) {
    return (
        <div className="flex items-center gap-2 px-6">
            <span className="text-sm">🎤</span>
            <div className="flex-1 h-2 bg-gray-700 rounded-full relative">
                {/* Level bar */}
                <div
                    className={`h-full rounded-full transition-all duration-75 ${
                        level > threshold ? 'bg-green-500' : 'bg-gray-400'
                    }`}
                    style={{ width: `${level * 100}%` }}
                />
                {/* Treshold line */}
                <div
                    className="absolute top-0 h-full w-0.5 bg-red-400"
                    style={{ left: `${threshold * 100}%` }}
                />
            </div>
            <span className="text-xs text-gray-400">
                {(level * 100).toFixed(0)}%
            </span>
        </div>
    );
}

export default AudioLevelIndicator;
