import PropTypes from 'prop-types';

function RandomizeButton({ isRandomized, onToggle, className = '' }) {
    const handleClick = (event) => {
        event.preventDefault();
        onToggle();
    };

    return (
        <button
            className={`h-10 rounded transition-all px-3 ${
                isRandomized ? 'is-randomized' : 'is-derandomized'
            } ${className}`}
            onClick={handleClick}
        >
            {isRandomized ? 'Unrandomize' : 'Randomize'}
        </button>
    );
}

RandomizeButton.propTypes = {
    isRandomized: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
    className: PropTypes.string,
};

export default RandomizeButton;
