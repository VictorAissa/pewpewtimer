function TimeDisplay({ value, isPar }) {
    const getDecimalDisplay = (number) => {
        if (isNaN(number)) return '0 : 0';
        return `${Math.floor(number / 10)} : ${number % 10}`;
    };

    return (
        <div className="w-44 h-10 rounded-sm bg-white flex justify-center items-center text-gray-800 text-2xl">
            {getDecimalDisplay(value)}
        </div>
    );
}

export default TimeDisplay;
