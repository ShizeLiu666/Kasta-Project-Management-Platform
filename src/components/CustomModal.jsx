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
            // 重置 alert 状态当模态框打开时
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
        <Modal isOpen={isOpen} toggle={toggle} centered>
            <ModalHeader toggle={toggle}>{title}</ModalHeader>
            <ModalBody style={{paddingBottom: '5px'}}>
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
                    onClick={onSubmit}
                    disabled={isSubmitting || disabled}
                    style={{marginRight: '10px'}}
                >
                    {isSubmitting ? 'Submitting...' : submitText}
                </CustomButton>
                <CustomButton 
                    type={cancelButtonType}
                    color={cancelButtonColor}
                    onClick={toggle}
                >
                    {cancelText}
                </CustomButton>
            </ModalFooter>
        </Modal>
    );
};

export default CustomModal;
