import React, { useState, useEffect } from 'react';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import axiosInstance from '../../config';
import { getToken } from '../auth/auth';
import CustomModal from '../CustomModal';

const CreateAuthCodeModal = ({ isOpen, toggle, onCreateAuthCodes }) => {
    const [count, setCount] = useState('1');
    const [error, setError] = useState('');
    const [successAlert, setSuccessAlert] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setError("");
            setSuccessAlert("");
            setCount('1');
        }
    }, [isOpen]);

    const handleSubmit = async () => {
        const numCount = parseInt(count, 10);
        if (numCount < 1 || numCount > 10) {
            setError('Please enter a number between 1 and 10.');
            return;
        }

        const token = getToken();
        if (!token) {
            setError("Authentication token not found, please log in again");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await axiosInstance.post(
                '/authorization-codes/create',
                { num: numCount },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                setSuccessAlert("Authorization codes created successfully!");
                setTimeout(() => {
                    setSuccessAlert("");
                    onCreateAuthCodes(numCount);
                    toggle();
                }, 1000);
            } else {
                setError(response.data.errorMsg || "Error creating authorization codes.");
            }
        } catch (err) {
            setError("An unexpected error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <CustomModal
            isOpen={isOpen}
            toggle={toggle}
            title="Create Authorization Codes"
            onSubmit={handleSubmit}
            submitText="Create"
            successAlert={successAlert}
            error={error}
            isSubmitting={isSubmitting}
        >
            <Form>
                <FormGroup>
                    <Label for="codeCount">
                        <span style={{ color: "red" }}>*</span> Number of codes to create (1-10):
                    </Label>
                    <Input
                        type="number"
                        name="codeCount"
                        id="codeCount"
                        value={count}
                        onChange={(e) => setCount(e.target.value)}
                        min="1"
                        max="10"
                        required
                    />
                </FormGroup>
            </Form>
        </CustomModal>
    );
};

export default CreateAuthCodeModal;