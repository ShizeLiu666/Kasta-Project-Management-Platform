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
import CustomButton from '../components/CustomComponents/CustomButton';
import emailjs from '@emailjs/browser';

const FeedbackModal = ({ 
    isOpen, 
    toggle,
    onSubmit
}) => {
    const [feedback, setFeedback] = useState({
        title: '',
        content: '',
        from_name: '',
        from_email: ''
    });
    
    const [touched, setTouched] = useState({
        title: false,
        content: false,
        from_name: false,
        from_email: false
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    // 验证表单
    const validate = () => {
        const errors = {};
        if (!feedback.title.trim()) {
            errors.title = 'Title is required';
        }
        if (!feedback.content.trim()) {
            errors.content = 'Content is required';
        }
        if (!feedback.from_name.trim()) {
            errors.from_name = 'Name is required';
        }
        if (!feedback.from_email.trim()) {
            errors.from_email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(feedback.from_email)) {
            errors.from_email = 'Email is invalid';
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
                title: true,
                content: true,
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
                    feedback_title: feedback.title,
                    feedback_content: feedback.content,
                    from_name: feedback.from_name,
                    from_email: feedback.from_email,
                    timestamp: new Date().toLocaleString()
                },
                'f2rwMdAOQ3bS3Jo6j'
            );

            onSubmit(feedback);
            setFeedback({ 
                title: '', 
                content: '', 
                from_name: '', 
                from_email: '' 
            });
            setTouched({
                title: false,
                content: false,
                from_name: false,
                from_email: false
            });
            toggle();
        } catch (error) {
            console.error('Failed to send feedback:', error);
            alert('Failed to send feedback. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal 
            isOpen={isOpen} 
            toggle={toggle}
            centered
        >
            <ModalHeader toggle={toggle}>
                Send Feedback
            </ModalHeader>
            <ModalBody>
                <FormGroup>
                    <Label for="feedbackTitle">Title</Label>
                    <Input
                        id="feedbackTitle"
                        type="text"
                        value={feedback.title}
                        onChange={(e) => setFeedback({...feedback, title: e.target.value})}
                        placeholder="Enter feedback title"
                        onBlur={() => handleBlur('title')}
                        invalid={touched.title && !!errors.title}
                    />
                    {touched.title && errors.title && (
                        <FormFeedback>{errors.title}</FormFeedback>
                    )}
                </FormGroup>

                <FormGroup>
                    <Label for="feedbackContent">Content</Label>
                    <Input
                        id="feedbackContent"
                        type="textarea"
                        rows="5"
                        value={feedback.content}
                        onChange={(e) => setFeedback({...feedback, content: e.target.value})}
                        placeholder="Please describe the issue you encountered..."
                        onBlur={() => handleBlur('content')}
                        invalid={touched.content && !!errors.content}
                    />
                    {touched.content && errors.content && (
                        <FormFeedback>{errors.content}</FormFeedback>
                    )}
                </FormGroup>

                <FormGroup>
                    <Label for="fromName">Your Name</Label>
                    <Input
                        id="fromName"
                        type="text"
                        value={feedback.from_name}
                        onChange={(e) => setFeedback({...feedback, from_name: e.target.value})}
                        placeholder="Enter your name"
                        onBlur={() => handleBlur('from_name')}
                        invalid={touched.from_name && !!errors.from_name}
                    />
                    {touched.from_name && errors.from_name && (
                        <FormFeedback>{errors.from_name}</FormFeedback>
                    )}
                </FormGroup>

                <FormGroup>
                    <Label for="fromEmail">Your Email</Label>
                    <Input
                        id="fromEmail"
                        type="email"
                        value={feedback.from_email}
                        onChange={(e) => setFeedback({...feedback, from_email: e.target.value})}
                        placeholder="Enter your email"
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
                    {isSubmitting ? 'Submitting...' : 'Submit'}
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
    );
};

export default FeedbackModal;