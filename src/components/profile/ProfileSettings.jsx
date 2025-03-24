import React, { useState, useEffect, useCallback } from 'react';
import {
    Card,
    CardBody,
    CardTitle,
    Form,
    FormGroup,
    Label,
    Input,
    Row,
    Col,
} from 'reactstrap';
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import axiosInstance from '../../config';
import { getToken, saveUserDetails } from '../auth/auth';
import CustomButton from '../CustomComponents/CustomButton';
import DeleteAccountModal from './DeleteAccountModal';

const ProfileSettings = ({ userDetails: initialUserDetails }) => {
    const [userDetails, setUserDetails] = useState(initialUserDetails);
    const [username, setUsername] = useState("");
    const [nickname, setNickname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [alert, setAlert] = useState({
        severity: "",
        message: "",
        open: false,
    });
    const [loading, setLoading] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");
    const [countdown, setCountdown] = useState(60);
    const [canRequestAgain, setCanRequestAgain] = useState(true);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    useEffect(() => {
        if (userDetails) {
            setUsername(userDetails.username || "");
            setNickname(userDetails.nickName || "");
            setEmail(userDetails.email || "");
        }
    }, [userDetails]);

    const showAlert = (severity, message) => {
        setAlert({ severity, message, open: true });
        setTimeout(() => {
            setAlert((prevAlert) => ({ ...prevAlert, open: false }));
        }, 3000);
    };

    const handleSendVerificationCode = async () => {
        if (!email) return;

        setLoading(true);

        try {
            const token = getToken();
            const response = await axiosInstance.post(
                `/users/send-verification-code?email=${encodeURIComponent(email)}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                setCanRequestAgain(false);
                setCountdown(60);
                showAlert("success", "Verification code sent!");
            } else {
                showAlert(
                    "error",
                    response.data.errorMsg || "Failed to send verification code."
                );
            }
        } catch (error) {
            showAlert(
                "error",
                "Failed to send verification code. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!canRequestAgain && countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0) {
            setCanRequestAgain(true);
        }
    }, [countdown, canRequestAgain]);

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return passwordRegex.test(password);
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        if (value === "") {
            setPasswordError("");
        } else if (!validatePassword(value)) {
            setPasswordError(
                "* Password must be at least 8 characters long and include both letters and numbers"
            );
        } else {
            setPasswordError("");
        }
    };

    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setConfirmPassword(value);
        if (value !== password) {
            setConfirmPasswordError("Passwords do not match");
        } else {
            setConfirmPasswordError("");
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (password !== confirmPassword) {
            showAlert("error", "Passwords do not match.");
            setLoading(false);
            return;
        }

        try {
            const token = getToken();
            if (nickname !== userDetails.nickName) {
                await axiosInstance.post("/users/modify/nickname", {
                    nickName: nickname
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }

            if (password && verificationCode) {
                const userData = {
                    username,
                    password,
                    verificationCode
                };

                const response = await axiosInstance.post("/users/modify/pwd", userData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.data.success) {
                    showAlert("success", "Password updated successfully!");
                } else {
                    showAlert("error", response.data.errorMsg || "Failed to update password.");
                    setLoading(false);
                    return;
                }
            }

            // Update local user details
            const updatedUserDetails = {
                ...userDetails,
                nickName: nickname
            };
            setUserDetails(updatedUserDetails);
            saveUserDetails(updatedUserDetails);

            // Trigger update event
            const event = new CustomEvent('userDetailsUpdated', { detail: updatedUserDetails });
            window.dispatchEvent(event);

            // Update localStorage to trigger storage event
            localStorage.setItem('userDetailsUpdated', JSON.stringify(updatedUserDetails));

            showAlert("success", "Profile updated successfully!");
            setPassword("");
            setConfirmPassword("");
            setVerificationCode("");
        } catch (error) {
            console.error("Error during profile update:", error);
            showAlert("error", "An error occurred while updating the profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const readOnlyStyle = {
        backgroundColor: '#f8f9fa',
        cursor: 'not-allowed',
    };

    const isFormValid = useCallback(() => {
        return (
            (nickname !== userDetails.nickName) ||
            (password && confirmPassword && verificationCode && password === confirmPassword && !passwordError && verificationCode.length === 6)
        );
    }, [nickname, userDetails.nickName, password, confirmPassword, verificationCode, passwordError]);

    const errorMessageStyle = {
        color: 'red',
        fontSize: '14px',
        marginTop: '5px'
    };

    const handleDeleteAccount = () => {
        setDeleteModalOpen(true);
    };

    return (
        <Card className="h-100">
            <CardBody>
                <CardTitle tag="h4" className="mb-4">User Profile Settings</CardTitle>
                {alert.open && (
                    <Alert
                        severity={alert.severity}
                        style={{
                            position: "fixed",
                            top: 0,
                            left: "50%",
                            transform: "translateX(-50%)",
                            zIndex: 9999,
                        }}
                    >
                        {alert.message}
                    </Alert>
                )}
                <Form onSubmit={handleUpdateProfile}>
                    <Row>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="username">Username</Label>
                                <Input
                                    type="text"
                                    id="username"
                                    value={username}
                                    readOnly
                                    style={readOnlyStyle}
                                    autoComplete="username"
                                />
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="nickname">Nickname</Label>
                                <Input
                                    type="text"
                                    id="nickname"
                                    value={nickname}
                                    onChange={(e) => setNickname(e.target.value)}
                                    autoComplete="nickname"
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                    <FormGroup>
                        <Label for="email">Email</Label>
                        <Row>
                            <Col md={10}>
                                <Input
                                    type="email"
                                    id="email"
                                    value={email}
                                    readOnly
                                    style={readOnlyStyle}
                                    autoComplete="email"
                                />
                            </Col>
                            <Col md={2}>
                                <CustomButton
                                    onClick={handleSendVerificationCode}
                                    disabled={!canRequestAgain || loading}
                                    style={{
                                        width: "100%",
                                        fontSize: "14px",
                                        height: "37px",
                                    }}
                                >
                                    {loading ? (
                                        <CircularProgress size={15} style={{ color: "#fff" }} />
                                    ) : canRequestAgain ? (
                                        "Send Code"
                                    ) : (
                                        `${countdown}s`
                                    )}
                                </CustomButton>
                            </Col>
                        </Row>
                    </FormGroup>
                    <FormGroup>
                        <Label for="verificationCode">Verification Code</Label>
                        <Input
                            type="text"
                            id="verificationCode"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            maxLength="6"
                            placeholder="Enter 6-digit code"
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="password">New Password</Label>
                        <Input
                            type="password"
                            id="password"
                            value={password}
                            onChange={handlePasswordChange}
                            autoComplete="new-password"
                        />
                        {passwordError && <p style={errorMessageStyle}>{passwordError}</p>}
                    </FormGroup>
                    <FormGroup>
                        <Label for="confirmPassword">Confirm New Password</Label>
                        <Input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            autoComplete="new-password"
                        />
                        {confirmPasswordError && <p style={errorMessageStyle}>{confirmPasswordError}</p>}
                    </FormGroup>
                    <div className="d-flex justify-content-between align-items-center">
                        <CustomButton
                            onClick={handleDeleteAccount}
                            color="#dc3545"
                            style={{
                                fontWeight: "bold",
                            }}
                        >
                            Delete Account
                        </CustomButton>
                        <div>
                            {loading ? (
                                <Box sx={{ display: "flex" }}>
                                    <CircularProgress />
                                </Box>
                            ) : (
                                <CustomButton
                                    onClick={handleUpdateProfile}
                                    disabled={!isFormValid()}
                                    style={{
                                        fontWeight: "bold",
                                    }}
                                >
                                    Update Profile
                                </CustomButton>
                            )}
                        </div>
                    </div>
                </Form>
                <DeleteAccountModal
                    isOpen={deleteModalOpen}
                    toggle={() => setDeleteModalOpen(!deleteModalOpen)}
                />
            </CardBody>
        </Card>
    );
};

export default ProfileSettings;
