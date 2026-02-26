import React, { useState, useEffect } from 'react';
import './CustomCursor.css';

const CustomCursor = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isPointer, setIsPointer] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const [isClicked, setIsClicked] = useState(false);

    useEffect(() => {
        const onMouseMove = (e) => {
            setPosition({ x: e.clientX, y: e.clientY });

            // Detect if hovering over a button, link, or clickable element
            const target = e.target;
            const computedStyle = window.getComputedStyle(target);
            setIsPointer(computedStyle.cursor === 'pointer');
        };

        const onMouseDown = () => setIsClicked(true);
        const onMouseUp = () => setIsClicked(false);
        const onMouseLeave = () => setIsHidden(true);
        const onMouseEnter = () => setIsHidden(false);

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mouseup', onMouseUp);
        document.addEventListener('mouseleave', onMouseLeave);
        document.addEventListener('mouseenter', onMouseEnter);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mouseup', onMouseUp);
            document.removeEventListener('mouseleave', onMouseLeave);
            document.removeEventListener('mouseenter', onMouseEnter);
        };
    }, []);

    return (
        <>
            <div
                className={`custom-cursor-dot ${isPointer ? 'active' : ''} ${isHidden ? 'hidden' : ''} ${isClicked ? 'clicked' : ''}`}
                style={{ left: `${position.x}px`, top: `${position.y}px` }}
            ></div>
            <div
                className={`custom-cursor-outline ${isPointer ? 'active' : ''} ${isHidden ? 'hidden' : ''} ${isClicked ? 'clicked' : ''}`}
                style={{ left: `${position.x}px`, top: `${position.y}px` }}
            ></div>
        </>
    );
};

export default CustomCursor;
