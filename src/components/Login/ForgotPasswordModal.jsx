import React, { useState, useEffect, useCallback } from "react";
import { Form, FormGroup, Input, Button, Label, Row, Col } from "reactstrap";
import CircularProgress from "@mui/material/CircularProgress";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import rotateLockIcon from "../../assets/icons/rotate-lock.png";
import axiosInstance from '../../config'; 
import CustomAlert from '../CustomComponents/CustomAlert';

const ForgotPasswordModal = ({ handleBackToLogin }) => {
  const [email, setEmail] = useState("");
  const [newPassword, setnewPassword] = useState("");
  const [code, setCode] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isValidForm, setIsValidForm] = useState(false);
  const [alert, setAlert] = useState({
    isOpen: false,
    message: "",
    severity: "info",
    duration: 3000
  });
  const [countdown, setCountdown] = useState(60);
  const [canRequestAgain, setCanRequestAgain] = useState(true);
  const [loading, setLoading] = useState(false);

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // New password validation
  const validateNewPassword = (newPassword) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(newPassword);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (value === "") {
      setEmailError("");
    } else if (!validateEmail(value)) {
      setEmailError("* Invalid email format");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setnewPassword(value);
    if (value === "") {
      setPasswordError("");
    } else if (!validateNewPassword(value)) {
      setPasswordError(
        "* Password must be at least 8 characters long and include both letters and numbers"
      );
    } else {
      setPasswordError("");
    }
  };

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  // Reusable function to display alert with timeout
  const showAlertWithTimeout = (message, severity, duration = 3000) => {
    setAlert({ isOpen: true, message, severity, duration });
  };

  // Function to check form validity
  const isFormValid = useCallback(() => {
    return (
      validateEmail(email) &&
      validateNewPassword(newPassword)
    );
  }, [email, newPassword]);

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
    if (!validateEmail(email)) return;

    setLoading(true);

    try {
      const response = await axiosInstance.post(
        `/users/send-verification-code?email=${encodeURIComponent(email)}`
      );

      if (response.data.success) {
        setCanRequestAgain(false);
        setCountdown(60);
        showAlertWithTimeout("Verification code sent!", "success");
      } else {
        showAlertWithTimeout(
          response.data.errorMsg || "Failed to send verification code.",
          "error"
        );
      }
    } catch (error) {
      showAlertWithTimeout(
        "Failed to send verification code. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    const userData = {
      username: email,
      password: newPassword,
      verificationCode: code,
    };
  
    // console.log("Reset Password Data to be submitted:", userData);
  
    setLoading(true);
  
    try {
      const response = await axiosInstance.post("/users/modify/pwd", userData);
  
      if (response.data.success) {
        showAlertWithTimeout("Password reset successful!", "success");
        setTimeout(() => {
          handleBackToLogin();
        }, 2000);
      } else {
        showAlertWithTimeout(response.data.errorMsg || "Password reset failed.", "error");
      }
    } catch (error) {
      // console.error("Error during password reset:", error);
      showAlertWithTimeout("An error occurred during password reset. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };   

  return (
    <div className="form-container">
      <CustomAlert
        isOpen={alert.isOpen}
        onClose={() => setAlert(prev => ({ ...prev, isOpen: false }))}
        message={alert.message}
        severity={alert.severity}
        autoHideDuration={alert.duration}
      />
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
                autoComplete="new-password"
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
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onClick={handleSendVerificationCode}
                disabled={!validateEmail(email) || !canRequestAgain || loading}
              >
                {loading ? (
                  <CircularProgress size={15} style={{ color: "#fff" }} />
                ) : canRequestAgain ? (
                  "Send Code"
                ) : (
                  `${countdown}s`
                )}
              </Button>
            </Col>
          </Row>
        </FormGroup>

        <FormGroup className="mb-3">
          <Label for="password">New Password</Label>
          <Input
            type="password"
            id="password"
            placeholder=""
            value={newPassword}
            onChange={handlePasswordChange}
            autoComplete="new-password"
          />
          {passwordError && <p className="error-message">{passwordError}</p>}
        </FormGroup>

        <FormGroup className="mb-3">
          <Label for="code">Email Validation</Label>
          <Input
            type="text"
            maxLength="6"
            value={code}
            onChange={handleCodeChange}
            placeholder="Enter 6-digit code"
            className="text-left"
            autoComplete="off"
          />
        </FormGroup>

        <div className="row align-items-center" style={{ marginTop: "20px" }}>
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

          <div className="col d-flex justify-content-end">
            <Button
              style={{
                backgroundColor: "#fbcd0b",
                borderColor: "#fbcd0b",
                fontWeight: "bold",
              }}
              onClick={handleResetPassword}
              disabled={!isValidForm || code.length !== 6}
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
