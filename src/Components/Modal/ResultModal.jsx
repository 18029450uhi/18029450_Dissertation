// src/Components/ResultModal/ResultModal.jsx
import React from 'react';
import './ResultModal.css';

const ResultModal = ({ show, message, onClose }) => {
    if (!show) return null;

    return (
        <div className='result-modal'>
            <div className='result-modal-content'>
                <p>{message}</p>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default ResultModal;