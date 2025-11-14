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

export default RandomizeButton;
