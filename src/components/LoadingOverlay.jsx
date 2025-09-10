import React from 'react';
import './LoadingOverlay.css';

const LoadingOverlay = ({ isVisible }) => {
    if (!isVisible) return null;

    return (
        <div className="loading-overlay">
            <div className="loading-content">
                <img 
                    src="/favicon.png" 
                    alt="Loading..." 
                    className="loading-favicon"
                />
                <div className="loading-text">Loading...</div>
            </div>
        </div>
    );
};

export default LoadingOverlay;