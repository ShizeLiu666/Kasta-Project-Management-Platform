import React, { useState, useEffect } from 'react';
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Alert
} from 'reactstrap';
import CustomButton from './CustomButton';

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
        if (isOpen) {
            setShowSuccessAlert(false);
            setShowErrorAlert(false);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
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

    const handleToggle = () => {
        toggle();
        setTimeout(() => {
            document.body.style.overflow = '';
        }, 300); // 等待模态框关闭动画完成
    };

    return (
        <Modal 
            isOpen={isOpen} 
            toggle={handleToggle} 
            centered
            scrollable
        >
            <ModalHeader toggle={handleToggle}>{title}</ModalHeader>
            <ModalBody>
                {showSuccessAlert && successAlert && (
                    <Alert color="success" toggle={handleCloseSuccessAlert}>
                        {successAlert}
                    </Alert>
                )}
                {showErrorAlert && error && (
                    <Alert color="danger" toggle={handleCloseErrorAlert}>
                        {error}
                    </Alert>
                )}
                {children}
            </ModalBody>
            <ModalFooter>
                <CustomButton
                    type={submitButtonType}
                    color={submitButtonColor}
                    onClick={() => {
                        onSubmit();
                        handleToggle();
                    }}
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
    );
};

export default CustomModal;
