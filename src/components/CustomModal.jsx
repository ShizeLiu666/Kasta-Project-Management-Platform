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

    useEffect(() => {
        if (!isOpen) {
            setShowSuccessAlert(false);
            setShowErrorAlert(false);
        }
    }, [isOpen]);

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

    const handleToggle = () => {
        setShowSuccessAlert(false);
        setShowErrorAlert(false);
        toggle();
    };

    useEffect(() => {
        if (isOpen) {
            setShowSuccessAlert(false);
            setShowErrorAlert(false);
        }
    }, [isOpen]);

    useEffect(() => {
        setShowSuccessAlert(!!successAlert);
    }, [successAlert]);

    useEffect(() => {
        setShowErrorAlert(!!error);
    }, [error]);

    const handleCloseSuccessAlert = () => {
        setShowSuccessAlert(false);
    };

    const handleCloseErrorAlert = () => {
        setShowErrorAlert(false);
    };

    return (
        <>
            <Modal 
                isOpen={isOpen} 
                toggle={handleToggle}
                centered
                scrollable
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
                isOpen={showSuccessAlert}
                onClose={handleCloseSuccessAlert}
                message={successAlert}
                severity="success"
                autoHideDuration={3000}
            />
            <CustomAlert
                isOpen={showErrorAlert}
                onClose={handleCloseErrorAlert}
                message={error}
                severity="error"
                autoHideDuration={3000}
            />
        </>
    );
};

export default CustomModal;
