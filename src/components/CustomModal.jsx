import React from 'react';
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
    return (
        <Modal isOpen={isOpen} toggle={toggle} centered>
            <ModalHeader toggle={toggle}>{title}</ModalHeader>
            <ModalBody style={{paddingBottom: '5px'}}>
                {successAlert && <Alert color="success">{successAlert}</Alert>}
                {error && <Alert color="danger">{error}</Alert>}
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
                    disabled={isSubmitting || disabled}  // 修改这一行
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