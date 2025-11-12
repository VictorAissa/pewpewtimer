export const formatShotData = (shotRecording) => {
    const { shots, sessionStartTime, firstShot, splits } = shotRecording;

    return shots.map((shot, index) => {
        if (index === 0) {
            return {
                number: 1,
                type: 'first',
                time: firstShot,
                total: firstShot,
            };
        }

        return {
            number: index + 1,
            type: 'split',
            split: splits[index - 1],
            total: ((shot - sessionStartTime) / 1000).toFixed(2),
        };
    });
};
