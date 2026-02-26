import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SideInfo.css';

const SideInfo = () => {
    const navigate = useNavigate();

    return (
        <div className="side-info">
            <div className="side-card top-card" onClick={() => navigate('/menu')}>
                <div className="overlay">
                    <h4>Sundays</h4>
                    <h2>2 <span>FOR</span> 1</h2>
                </div>
            </div>
            <div className="side-card bottom-card" onClick={() => navigate('/menu')}>
                <div className="overlay">
                    <h4>Every Friday</h4>
                    <h2>FAMILY DAY</h2>
                </div>
            </div>
        </div>
    );
};

export default SideInfo;
