import React from 'react';
import { FaMoon, FaSun, FaBolt } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    const getIcon = () => {
        if (theme === 'light') return <FaSun />;
        if (theme === 'dark') return <FaMoon />;
        return <FaBolt />; // For Neon mode
    };

    return (
        <button
            className={`theme-toggle theme-${theme}`}
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={`Hozirgi mavzu: ${theme}`}
        >
            <div className="toggle-icon">
                {getIcon()}
            </div>
        </button>
    );
};

export default ThemeToggle;
