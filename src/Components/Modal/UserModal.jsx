import React from 'react';
import './UserModal.css';

const UserModal = ({ correctCount, wrongCount, onClose, onLogout }) => {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>X</button>
                <div className="modal-content">
                    <p>Total Correct Answers: {correctCount}</p>
                    <p>Total Wrong Answers: {wrongCount}</p>
                    <button className='general' onClick={onLogout}>Logout</button>
                </div>
            </div>
        </div>
    );
};

export default UserModal;