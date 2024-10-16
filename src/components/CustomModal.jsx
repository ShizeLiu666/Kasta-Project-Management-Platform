import React, { useState, useEffect } from 'react';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Alert
} from 'reactstrap';

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
    disabled = false
}) => {
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);

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
                <Button
                    color="primary"
                    onClick={onSubmit}
                    style={{
                        backgroundColor: submitButtonColor,
                        borderColor: submitButtonColor,
                        color: "#fff",
                        fontWeight: "bold",
                        textTransform: "none",
                    }}
                    disabled={isSubmitting || disabled}
                >
                    {isSubmitting ? 'Submitting...' : submitText}
                </Button>
                <Button 
                    color="secondary" 
                    onClick={toggle}
                    style={{
                        backgroundColor: cancelButtonColor,
                        borderColor: cancelButtonColor,
                        color: "#fff",
                    }}
                >
                    {cancelText}
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default CustomModal;
