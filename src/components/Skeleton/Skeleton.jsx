import React from 'react';
import './Skeleton.css';

const Skeleton = ({ width, height, borderRadius, margin }) => {
    const style = {
        width: width || '100%',
        height: height || '20px',
        borderRadius: borderRadius || '4px',
        margin: margin || '0 0 10px 0'
    };

    return <div className="skeleton-box" style={style}></div>;
};

export default Skeleton;
