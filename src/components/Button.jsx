function Button({
    onClick,
    variant = 'primary',
    children,
    disabled = false,
    className = '',
}) {
    const getVariantClasses = () => {
        if (disabled) {
            return 'bg-gray-600 cursor-not-allowed';
        }

        switch (variant) {
            case 'primary':
                return 'bg-[#95C623] hover:bg-[#85B613]';
            case 'danger':
                return 'bg-red-500 hover:bg-red-600';
            case 'secondary':
                return 'bg-gray-500 hover:bg-gray-600';
            default:
                return 'bg-[#95C623] hover:bg-[#85B613]';
        }
    };

    return (
        <button
            className={`w-20 h-10 rounded transition-all ${getVariantClasses()} ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
}

export default Button;
