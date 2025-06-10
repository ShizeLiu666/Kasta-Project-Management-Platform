import React, { useState } from 'react';
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
    FormGroup,
    Label,
    FormFeedback
} from 'reactstrap';
import CustomButton from './CustomButton';
import CustomAlert from './CustomAlert';
import emailjs from '@emailjs/browser';

const SupportModal = ({ 
    isOpen, 
    toggle,
    onSubmit
}) => {
    const [supportRequest, setSupportRequest] = useState({
        issue_type: 'Dashboard Display',
        description: '',
        from_name: '',
        from_email: ''
    });
    
    const [touched, setTouched] = useState({
        description: false,
        from_name: false,
        from_email: false
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);

    // Form validation
    const validate = () => {
        const errors = {};
        if (!supportRequest.description.trim()) {
            errors.description = 'Please describe your issue';
        }
        if (!supportRequest.from_name.trim()) {
            errors.from_name = 'Name is required';
        }
        if (!supportRequest.from_email.trim()) {
            errors.from_email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(supportRequest.from_email)) {
            errors.from_email = 'Please enter a valid email address';
        }
        return errors;
    };

    const errors = validate();
    const isValid = Object.keys(errors).length === 0;

    const handleBlur = (field) => {
        setTouched({ ...touched, [field]: true });
    };

    const handleSubmit = async () => {
        if (!isValid) {
            setTouched({
                description: true,
                from_name: true,
                from_email: true
            });
            return;
        }

        setIsSubmitting(true);
        try {
            await emailjs.send(
                'service_eny7hxs',
                'template_7qkxwi8',
                {
                    feedback_title: `${supportRequest.issue_type} Issue`,
                    feedback_content: `Issue Type: ${supportRequest.issue_type}\n\nDescription:\n${supportRequest.description}`,
                    from_name: supportRequest.from_name,
                    from_email: supportRequest.from_email,
                    timestamp: new Date().toLocaleString()
                },
                'f2rwMdAOQ3bS3Jo6j'
            );

            onSubmit?.(supportRequest);
            setSupportRequest({ 
                issue_type: 'Dashboard Display',
                description: '', 
                from_name: '', 
                from_email: ''
            });
            setTouched({
                description: false,
                from_name: false,
                from_email: false
            });
            
            // Show success alert
            setShowSuccessAlert(true);
            
            // Close modal after a short delay
            setTimeout(() => {
                toggle();
            }, 1500);
            
        } catch (error) {
            console.error('Failed to send support request:', error);
            setShowErrorAlert(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Modal 
                isOpen={isOpen} 
                toggle={toggle}
                centered
                size="md"
            >
                <ModalHeader toggle={toggle}>
                    Get Support
                </ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Label for="issueType">Issue Type</Label>
                        <Input
                            id="issueType"
                            type="select"
                            value={supportRequest.issue_type}
                            onChange={(e) => setSupportRequest({...supportRequest, issue_type: e.target.value})}
                        >
                            <option value="Dashboard Display">Dashboard Display</option>
                            <option value="Network Display">Network Display</option>
                            <option value="Project">Project</option>
                            <option value="Personal Information">Personal Information</option>
                            <option value="Other">Other</option>
                        </Input>
                    </FormGroup>

                    <FormGroup>
                        <Label for="description">Describe Your Issue *</Label>
                        <Input
                            id="description"
                            type="textarea"
                            rows="4"
                            value={supportRequest.description}
                            onChange={(e) => setSupportRequest({...supportRequest, description: e.target.value})}
                            placeholder="Please provide as much detail as possible about your issue..."
                            onBlur={() => handleBlur('description')}
                            invalid={touched.description && !!errors.description}
                        />
                        {touched.description && errors.description && (
                            <FormFeedback>{errors.description}</FormFeedback>
                        )}
                    </FormGroup>

                    <FormGroup>
                        <Label for="supportName">Your Name *</Label>
                        <Input
                            id="supportName"
                            type="text"
                            value={supportRequest.from_name}
                            onChange={(e) => setSupportRequest({...supportRequest, from_name: e.target.value})}
                            placeholder="Enter your full name"
                            onBlur={() => handleBlur('from_name')}
                            invalid={touched.from_name && !!errors.from_name}
                        />
                        {touched.from_name && errors.from_name && (
                            <FormFeedback>{errors.from_name}</FormFeedback>
                        )}
                    </FormGroup>

                    <FormGroup>
                        <Label for="supportEmail">Your Email *</Label>
                        <Input
                            id="supportEmail"
                            type="email"
                            value={supportRequest.from_email}
                            onChange={(e) => setSupportRequest({...supportRequest, from_email: e.target.value})}
                            placeholder="Enter your email address"
                            onBlur={() => handleBlur('from_email')}
                            invalid={touched.from_email && !!errors.from_email}
                        />
                        {touched.from_email && errors.from_email && (
                            <FormFeedback>{errors.from_email}</FormFeedback>
                        )}
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <CustomButton
                        color="#fbcd0b"
                        onClick={handleSubmit}
                        style={{marginRight: '10px'}}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Sending...' : 'Send Support Request'}
                    </CustomButton>
                    <CustomButton 
                        color="#6c757d"
                        onClick={toggle}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </CustomButton>
                </ModalFooter>
            </Modal>

            {/* Custom Alerts */}
            <CustomAlert
                isOpen={showSuccessAlert}
                onClose={() => setShowSuccessAlert(false)}
                message="Your support request has been sent successfully! We will get back to you soon."
                severity="success"
                autoHideDuration={3000}
            />

            <CustomAlert
                isOpen={showErrorAlert}
                onClose={() => setShowErrorAlert(false)}
                message="Failed to send support request. Please try again or contact us directly."
                severity="error"
                autoHideDuration={3000}
            />
        </>
    );
};

export default SupportModal; 