import React, { useState, useEffect, useCallback } from "react";
import { Form, FormGroup, Input, Button, Label, Row, Col } from "reactstrap";
import axios from "axios";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress"; // Import CircularProgress
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import rotateLockIcon from "../../assets/icons/rotate-lock.png";

const ForgotPasswordModal = ({ handleBackToLogin }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [newPassword, setnewPassword] = useState("");
  const [code, setCode] = useState("");
  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isValidForm, setIsValidForm] = useState(false);
  const [alert, setAlert] = useState({
    severity: "",
    message: "",
    open: false,
  });
  const [countdown, setCountdown] = useState(60);
  const [canRequestAgain, setCanRequestAgain] = useState(true);
  const [loading, setLoading] = useState(false); // Add loading state

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Username validation
  const validateUsername = (username) => {
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_ ]{3,19}$/; // Adjust the regex as needed
    return usernameRegex.test(username);
  };

  // New password validation
  const validateNewPassword = (newPassword) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // Minimum 8 characters, at least one letter and one number
    return passwordRegex.test(newPassword);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (value === "") {
      setEmailError(""); // No error message if empty
    } else if (!validateEmail(value)) {
      setEmailError("* Invalid email format");
    } else {
      setEmailError(""); // Clear error
    }
  };

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    if (value === "") {
      setEmailError(""); // No error message if empty
    } else if (!validateUsername(value)) {
      setUsernameError(
        "* Username must be 4-20 characters and can contain letters, numbers, and underscores"
      );
    } else {
      setUsernameError("");
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setnewPassword(value);
    if (value === "") {
      setPasswordError(""); // No error message if empty
    } else if (!validateNewPassword(value)) {
      setPasswordError(
        "* Password must be at least 8 characters long and include both letters and numbers"
      );
    } else {
      setPasswordError(""); // Clear error
    }
  };

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  // Reusable function to display alert with timeout
  const showAlertWithTimeout = (severity, message) => {
    setAlert({ severity, message, open: true });
    setTimeout(() => {
      setAlert({ severity: "", message: "", open: false });
    }, 1000); // Alert closes after 1 seconds
  };

  // Function to check form validity
  const isFormValid = useCallback(() => {
    return (
      validateEmail(email) &&
      validateUsername(username) &&
      validateNewPassword(newPassword)
    );
  }, [email, username, newPassword]);

  useEffect(() => {
    setIsValidForm(isFormValid());
  }, [isFormValid]);

  useEffect(() => {
    if (!canRequestAgain && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCanRequestAgain(true);
    }
  }, [countdown, canRequestAgain]);

  const handleSendVerificationCode = async () => {
    if (!isValidForm) return;

    setLoading(true); // Start loading

    try {
      const response = await axios.post(
        `/api/users/send-verification-code?email=${encodeURIComponent(email)}`
      );

      if (response.data.success) {
        setCanRequestAgain(false);
        setCountdown(60);
        showAlertWithTimeout("success", "Verification code sent!");
      } else {
        showAlertWithTimeout(
          "error",
          response.data.errorMsg || "Failed to send verification code."
        );
      }
    } catch (error) {
      showAlertWithTimeout(
        "error",
        "Failed to send verification code. Please try again."
      );
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleResetPassword = async () => {
    const userData = {
      username,
      password: newPassword, // Use the new password from the state
      verificationCode: code, // Verification code from the user input
    };
  
    console.log("Reset Password Data to be submitted:", userData);
  
    setLoading(true); // Set loading state to true while the request is being made
  
    try {
      // Send the POST request to the reset password endpoint
      const response = await axios.post("/api/users/modify/pwd", userData);
  
      // Check the 'success' field in the response
      if (response.data.success) {
        // Password reset was successful, show a success message
        showAlertWithTimeout("success", "Password reset successful!");
  
        // Wait for 3 seconds, then go back to the login interface
        setTimeout(() => {
          handleBackToLogin(); // Navigate back to login
        }, 3000);
      } else {
        // Password reset failed, show the error message from the response
        showAlertWithTimeout("error", response.data.errorMsg || "Password reset failed.");
      }
    } catch (error) {
      // Handle any errors that occur during the request (e.g., network issues)
      console.error("Error during password reset:", error);
      showAlertWithTimeout("error", "An error occurred during password reset. Please try again.");
    } finally {
      setLoading(false); // Reset loading state once the request completes
    }
  };   

  return (
    <div className="form-container">
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
      <div className="text-left">
        <p
          style={{
            fontSize: "18px",
            color: "#6c757d",
            display: "inline-flex",
            alignItems: "center",
          }}
        >
          <img
            src={rotateLockIcon}
            alt="rotate-lock"
            style={{
              width: "22px",
              height: "22px",
              marginRight: "6px",
              color: "#6c757d",
            }}
          />
          Reset the password
        </p>
      </div>

      <Form autoComplete="off">
        {/* Email input field with Send Verification Code button */}
        <FormGroup className="mb-2">
          <Row className="g-2">
            <Col md={8}>
              <Label for="email">Email Address</Label>
              <Input
                type="email"
                id="email"
                placeholder=""
                value={email}
                onChange={handleEmailChange}
                autoComplete="off"
              />
              {emailError && (
                <p className="error-message" style={{ marginBottom: "5px" }}>
                  {emailError}
                </p>
              )}
            </Col>
            <Col md={4}>
              <Button
                style={{
                  backgroundColor: "#fbcd0b",
                  border: "none",
                  marginTop: "32px",
                  width: "100%",
                  fontSize: "14px",
                  fontWeight: "bold",
                  height: "37px",
                  display: "flex", // Add flexbox
                  justifyContent: "center", // Center horizontally
                  alignItems: "center", // Center vertically
                }}
                onClick={handleSendVerificationCode}
                disabled={!isValidForm || !canRequestAgain || loading} // Disable if loading
              >
                {loading ? (
                  <CircularProgress size={15} style={{ color: "#fff" }} /> // Use size 15 and center
                ) : canRequestAgain ? (
                  "Send Code"
                ) : (
                  `${countdown}s`
                )}
              </Button>
            </Col>
          </Row>
        </FormGroup>

        {/* Username input field */}
        <FormGroup className="mb-3" style={{ marginTop: "0" }}>
          <Label for="username">User Name</Label>
          <Input
            type="text"
            id="username"
            placeholder=""
            value={username}
            onChange={handleUsernameChange}
            autoComplete="off"
          />
          {usernameError && <p className="error-message">{usernameError}</p>}
        </FormGroup>

        {/* Password input field */}
        <FormGroup className="mb-3">
          <Label for="password">New Password</Label>
          <Input
            type="password"
            id="password"
            placeholder=""
            value={newPassword}
            onChange={handlePasswordChange}
            autoComplete="off"
          />
          {passwordError && <p className="error-message">{passwordError}</p>}
        </FormGroup>

        {/* 6-digit code input field */}
        <FormGroup className="mb-3">
          <Label for="code">Email Validation</Label>
          <Input
            type="text"
            maxLength="6"
            value={code}
            onChange={handleCodeChange}
            placeholder="Enter 6-digit code"
            className="text-left"
          />
        </FormGroup>

        <div className="row align-items-center" style={{ marginTop: "20px" }}>
          {/* Back to Login Button aligned to the left */}
          <div className="col-auto" style={{ paddingLeft: 0 }}>
            <Button
              className="text-primary"
              style={{
                backgroundColor: "transparent",
                border: "none",
                color: "black",
                display: "inline-flex",
                alignItems: "center",
                paddingLeft: 0,
                marginLeft: "15px",
              }}
              onClick={handleBackToLogin}
            >
              <ArrowBackIosIcon /> Back to Login
            </Button>
          </div>

          {/* Reset Password Button aligned to the right */}
          <div className="col d-flex justify-content-end">
            <Button
              style={{
                backgroundColor: "#fbcd0b",
                borderColor: "#fbcd0b",
                fontWeight: "bold",
              }}
              onClick={handleResetPassword}
              disabled={
                !(
                  validateEmail(email) &&
                  validateUsername(username) &&
                  validateNewPassword(newPassword) &&
                  code.length === 6
                )
              } // Disable logic
            >
              Reset Password
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default ForgotPasswordModal;
