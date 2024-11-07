import React, { useState, useEffect, useCallback } from "react";
import { Form, FormGroup, Input, Button, Label, Row, Col } from "reactstrap";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import VerifyCodeModal from "./VerifyCodeModal";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import "./CreateAccountModal.css";
import CountryCodeSelect from "./CountryCodeSelect";
import axiosInstance from '../../config';
import CustomAlert from '../CustomAlert';
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import EngineeringIcon from '@mui/icons-material/Engineering';
import PersonIcon from '@mui/icons-material/Person';

const CreateAccountModal = ({ handleBackToLogin }) => {
  // const [username, setUsername] = useState(""); // 注释掉 Username 状态
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  // const [usernameError, setUsernameError] = useState(""); // 注释掉 Username 错误状态
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [alert, setAlert] = useState({
    isOpen: false,
    message: "",
    severity: "info",
    duration: 3000
  });
  const [loading, setLoading] = useState(false);
  const [isValidForm, setIsValidForm] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canRequestAgain, setCanRequestAgain] = useState(true);
  const [userRole, setUserRole] = useState(null);

  const userRoleOptions = [
    { value: "project", label: "Project", icon: <EngineeringIcon fontSize="medium" /> },
    { value: "normal", label: "Normal", icon: <PersonIcon fontSize="medium" /> }
  ];

  useEffect(() => {
    // setUsername(""); // 注释掉 Username 初始化
    setCountryCode(null);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setNickname("");
  }, []);

  // 倒计时逻辑
  useEffect(() => {
    if (!canRequestAgain && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer); // 清理定时器
    } else if (countdown === 0) {
      setCanRequestAgain(true); // 倒计时结束后，可以再次请求发送验证码
    }
  }, [countdown, canRequestAgain]);

  // 统一管理Alert展示时间的函数
  const showAlert = (message, severity, duration = 3000) => {
    setAlert({ isOpen: true, message, severity, duration });
  };

  // User Name validation
  // const validateUsername = (username) => {
  //   // Adjust the regex to allow spaces
  //   const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_ ]{3,19}$/; // Allows spaces, letters, numbers, and underscores
  //   return usernameRegex.test(username);
  // };

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
  };

  const isFormValid = useCallback(() => {
    return (
      validateEmail(email) &&
      validatePassword(password) &&
      password === confirmPassword &&
      countryCode &&
      userRole
    );
  }, [email, password, confirmPassword, countryCode, userRole]);

  useEffect(() => {
    setIsValidForm(isFormValid());
  }, [isFormValid]);

  // const handleUsernameChange = (e) => {
  //   const value = e.target.value;
  //   setUsername(value);
  //   if (value === "") {
  //     setUsernameError("");
  //   } else if (!validateUsername(value)) {
  //     setUsernameError(
  //       "* Username must be 4-20 characters long, start with a letter, and can only contain letters, numbers, spaces, and underscores"
  //     );
  //   } else {
  //     setUsernameError("");
  //   }
  // };

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
      setConfirmPasswordError("* Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleVerifyCodeSubmit = async (verificationCode) => {
    const userData = {
      username: email, // 使用 email 作为 username
      password,
      verificationCode,
      nickName: nickname,
      countryCode: countryCode?.code,
      userType: userRole?.value === "project" ? 1 : 0, // project 1，normal 0
      email,
    };

    console.log("User Data to be submitted:", userData);

    setLoading(true);

    try {
      const response = await axiosInstance.post("/users/register", userData);

      if (response.data.success) {
        setShowVerifyModal(false);
        showAlert("Registration successful!", "success", 3000);
        setTimeout(() => {
          handleBackToLogin();
        }, 1000);
      } else {
        showAlert(response.data.errorMsg || "Registration failed.", "error");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      showAlert("An error occurred during registration.", "error");
    } finally {
      setLoading(false);
    }
  };

  const sendVerificationCodeWithFeedback = async (email) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(
        `/users/send-verification-code?email=${encodeURIComponent(email)}`
      );

      if (response.data.success) {
        setShowVerifyModal(true);
        showAlert("Verification code sent!", "success");
        setCountdown(60);
        setCanRequestAgain(false);
      } else {
        showAlert(
          response.data.errorMsg || "Error sending verification code",
          "error"
        );
      }
    } catch (error) {
      showAlert("Error sending verification code", "error");
    } finally {
      setLoading(false);
    }
  };

  const sendVerificationCodeWithoutFeedback = async (email) => {
    try {
      await axiosInstance.post(
        `/users/send-verification-code?email=${encodeURIComponent(email)}`
      );
    } catch (error) {
      console.log("Error sending verification code:", error);
    }
  };

  // Handle sending verification code
  const handleSendVerificationCode = async (e) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    if (!isValidForm) return;

    await sendVerificationCodeWithFeedback(email);
  };

  const handleBack = (e) => {
    e.preventDefault();
    handleBackToLogin();
  };

  // const handleRoleChange = (e) => {
  //   setUserRole(e.target.value);
  // };

  return (
    <div className="form-container">
      <CustomAlert
        isOpen={alert.isOpen}
        onClose={() => setAlert(prev => ({ ...prev, isOpen: false }))}
        message={alert.message}
        severity={alert.severity}
        autoHideDuration={alert.duration}
      />
      <Form autoComplete="off">
        <FormGroup className="mb-3">
          <Label for="email">Email Address</Label>
          <Input
            type="email"
            id="email"
            placeholder=""
            value={email}
            onChange={handleEmailChange}
            autoComplete="off"
          />
          {emailError && <p className="error-message">{emailError}</p>}
        </FormGroup>

        <FormGroup className="mb-3">
          <Row className="g-2">
            <Col md={6}>
              <Label for="nickname">Nickname</Label>
              <Input
                type="text"
                id="nickname"
                placeholder="(Optional)"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                autoComplete="off"
              />
            </Col>
            <Col md={6}>
              <Label for="userRole">User Role</Label>
              <Autocomplete
                id="user-role-select"
                options={userRoleOptions}
                getOptionLabel={(option) => option.label}
                renderOption={(props, option) => (
                  <Box component="li" {...props} key={option.value} style={{ opacity: option.disabled ? 0.5 : 1 }}>
                    {option.icon}
                    <span style={{ marginLeft: '8px' }}>{option.label}</span>
                  </Box>
                )}
                value={userRole}
                onChange={(event, newValue) => setUserRole(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    placeholder="Select a role"
                    fullWidth
                    className="custom-form-control"
                    InputLabelProps={{ shrink: true }}
                  />
                )}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                getOptionDisabled={(option) => option.disabled}
              />
            </Col>
          </Row>
        </FormGroup>

        <FormGroup className="mb-3">
          <CountryCodeSelect value={countryCode} onChange={setCountryCode} />
        </FormGroup>

        <FormGroup className="mb-3">
          <Label for="password">Password</Label>
          <Input
            type="password"
            id="password"
            placeholder=""
            value={password}
            onChange={handlePasswordChange}
            autoComplete="off"
          />
          {passwordError && <p className="error-message">{passwordError}</p>}
        </FormGroup>

        <FormGroup className="mb-3">
          <Label for="confirmPassword">Confirm Password</Label>
          <Input
            type="password"
            id="confirmPassword"
            placeholder=""
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            autoComplete="off"
          />
          {confirmPasswordError && (
            <p style={{ color: "red" }}>{confirmPasswordError}</p>
          )}
        </FormGroup>

        <div
          className="d-flex justify-content-between align-items-center"
          style={{ marginTop: "20px" }}
        >
          <div
            className="d-flex align-items-center"
            style={{ marginLeft: "0" }}
          >
            <Button
              className="text-primary"
              style={{
                backgroundColor: "transparent",
                border: "none",
                color: "black",
                display: "inline-flex",
                alignItems: "center",
                paddingLeft: "0", // Aligns the button to the left
                marginLeft: "0", // Matches the input's margin
              }}
              onClick={handleBack}
            >
              <ArrowBackIosIcon /> Back to Login
            </Button>
          </div>

          <div style={{ marginRight: "50px" }}></div>

          {loading ? (
            <Box sx={{ display: "flex" }}>
              <CircularProgress />
            </Box>
          ) : (
            <Button
              style={{
                backgroundColor: "#fbcd0b",
                borderColor: "#fbcd0b",
                fontWeight: "bold",
              }}
              className="btn-block"
              onClick={handleSendVerificationCode}
              disabled={!isValidForm || !canRequestAgain} // Button is disabled if form is not valid or countdown is running
            >
              {canRequestAgain
                ? "Send Verification Code"
                : `Request again in ${countdown}s`}
            </Button>
          )}
        </div>
      </Form>

      <VerifyCodeModal
        isOpen={showVerifyModal}
        toggle={() => setShowVerifyModal(false)}
        email={email}
        onSubmit={handleVerifyCodeSubmit}
        sendVerificationCode={sendVerificationCodeWithoutFeedback}
      />
    </div>
  );
};

export default CreateAccountModal;
