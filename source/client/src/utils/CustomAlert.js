import React, { useEffect, useState } from 'react';
import '../style/CustomAlert.css'; // Import stylesheet
import data from "../messageCode.json";

const CustomAlert = ({ show, messageCode, onClose, success }) => {
    console.log("CustomAlert ", data[messageCode]);

    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    const alertClassName = `custom-alert ${show ? 'show' : ''} ${success ? 'success' : 'error'}`;
    return (
        <div className={alertClassName}>
            <div className="custom-alert-content">
                <p>{data[messageCode] || messageCode}</p>
            </div>
        </div>
    );
};

export default CustomAlert;
