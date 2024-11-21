import React, { useState, useEffect } from 'react';
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from 'reactstrap';
import CustomButton from './CustomButton';
import CustomAlert from './CustomAlert';

const CustomModal = ({ 
    isOpen, 
    toggle, 
    title, 
    children, 
    onSubmit, 
    submitText = "Submit",
    cancelText = "Cancel",
    successAlert,
    error,
    isSubmitting,
    submitButtonColor = "#fbcd0b",  
    cancelButtonColor = "#6c757d",  
    disabled = false,
    submitButtonType,
    cancelButtonType
}) => {
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [currentError, setCurrentError] = useState('');
    const [currentSuccess, setCurrentSuccess] = useState('');

    const clearAlerts = () => {
        setShowSuccessAlert(false);
        setShowErrorAlert(false);
        setCurrentError('');
        setCurrentSuccess('');
    };

    useEffect(() => {
        if (!isOpen) {
            clearAlerts();
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            if (error) {
                setShowErrorAlert(true);
                setCurrentError(error);
                const timer = setTimeout(() => {
                    setShowErrorAlert(false);
                    setCurrentError('');
                }, 1000);
                return () => clearTimeout(timer);
            } else {
                setShowErrorAlert(false);
                setCurrentError('');
            }
        }
    }, [error, isOpen]);

    useEffect(() => {
        if (isOpen) {
            if (successAlert) {
                setShowSuccessAlert(true);
                setCurrentSuccess(successAlert);
                const timer = setTimeout(() => {
                    setShowSuccessAlert(false);
                    setCurrentSuccess('');
                }, 1000);
                return () => clearTimeout(timer);
            } else {
                setShowSuccessAlert(false);
                setCurrentSuccess('');
            }
        }
    }, [successAlert, isOpen]);

    const handleToggle = () => {
        clearAlerts();
        toggle();
    };

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'Enter' && isOpen && !disabled && !isSubmitting) {
                event.preventDefault();
                onSubmit();
            }
        };

        if (isOpen) {
            document.addEventListener('keypress', handleKeyPress);
        }

        return () => {
            document.removeEventListener('keypress', handleKeyPress);
        };
    }, [isOpen, onSubmit, disabled, isSubmitting]);

    return (
        <>
            <Modal 
                isOpen={isOpen} 
                toggle={handleToggle}
                centered
                scrollable
                onClosed={clearAlerts}
            >
                <ModalHeader toggle={handleToggle}>{title}</ModalHeader>
                <ModalBody>
                    {children}
                </ModalBody>
                <ModalFooter>
                    <CustomButton
                        type={submitButtonType}
                        color={submitButtonColor}
                        onClick={onSubmit}
                        disabled={isSubmitting || disabled}
                        style={{marginRight: '10px'}}
                    >
                        {isSubmitting ? 'Submitting...' : submitText}
                    </CustomButton>
                    <CustomButton 
                        type={cancelButtonType}
                        color={cancelButtonColor}
                        onClick={handleToggle}
                    >
                        {cancelText}
                    </CustomButton>
                </ModalFooter>
            </Modal>
            <CustomAlert
                isOpen={showErrorAlert && isOpen}
                onClose={() => setShowErrorAlert(false)}
                message={currentError}
                severity="error"
                autoHideDuration={1000}
            />
            <CustomAlert
                isOpen={showSuccessAlert && isOpen}
                onClose={() => setShowSuccessAlert(false)}
                message={currentSuccess}
                severity="success"
                autoHideDuration={1000}
            />
        </>
    );
};

export default CustomModal;
