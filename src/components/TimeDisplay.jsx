import PropTypes from 'prop-types';

function TimeDisplay({ value, isRandomized }) {
    const getDecimalDisplay = (number) => {
        if (isNaN(number)) return '0 : 0';
        return `${Math.floor(number / 10)} : ${number % 10}`;
    };

    return (
        <div className="w-44 h-10 rounded-sm bg-white">
            <p
                className={`w-full h-full flex justify-center items-center text-gray-800 text-2xl ${
                    isRandomized ? 'blur' : ''
                }`}
            >
                {' '}
                {getDecimalDisplay(value)}
            </p>
        </div>
    );
}

TimeDisplay.propTypes = {
    value: PropTypes.number.isRequired,
    isRandomized: PropTypes.bool,
};

TimeDisplay.defaultProps = {
    isRandomized: false,
};

export default TimeDisplay;
