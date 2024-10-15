import React, { useState, useEffect, useCallback } from "react";
import { Form, FormGroup, Input, Button, Label, Row, Col } from "reactstrap";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import VerifyCodeModal from "./VerifyCodeModal";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import "./CreateAccountModal.css";
import CountryCodeSelect from "./CountryCodeSelect"; // 引入新的 CountryCodeSelect 组件
import axiosInstance from '../../config';  // 路径可能需要调整
import CustomAlert from '../CustomAlert';  // 确保正确导入

const CreateAccountModal = ({ handleBackToLogin }) => {
  const [username, setUsername] = useState(""); // 新增 User Name
  const [nickname, setNickname] = useState(""); // 新增 Nickname
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState(null); // State for country code
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [usernameError, setUsernameError] = useState(""); // 新增 User Name 错误
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [alert, setAlert] = useState({
    isOpen: false,
    message: "",
    severity: "info",
    duration: 3000
  });
  const [loading, setLoading] = useState(false); // 添加loading状态
  const [isValidForm, setIsValidForm] = useState(false); // State to track if the form is valid
  const [countdown, setCountdown] = useState(60); // 倒计时状态
  const [canRequestAgain, setCanRequestAgain] = useState(true); // 控制是否能再次请求发送验证码

  useEffect(() => {
    setUsername(""); // 初始化 User Name
    setCountryCode(null); // 初始化 Country Code
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setNickname(""); // 初始化 Nickname
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
  const validateUsername = (username) => {
    // Adjust the regex to allow spaces
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_ ]{3,19}$/; // Allows spaces, letters, numbers, and underscores
    return usernameRegex.test(username);
  };

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // Minimum 8 characters, with letters and numbers
    return passwordRegex.test(password);
  };

  // 将 isFormValid 函数移到 useCallback 中，这样它可以作为 useEffect 的依赖
  const isFormValid = useCallback(() => {
    return (
      validateUsername(username) &&
      validateEmail(email) &&
      validatePassword(password) &&
      password === confirmPassword &&
      countryCode
    );
  }, [username, email, password, confirmPassword, countryCode]);

  // 更新表单是否有效的状态
  useEffect(() => {
    setIsValidForm(isFormValid());
  }, [isFormValid]);

  // Real-time username validation
  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    if (value === "") {
      setUsernameError(""); // No error message if empty
    } else if (!validateUsername(value)) {
      setUsernameError(
        "* Username must be 4-20 characters long, start with a letter, and can only contain letters, numbers, spaces, and underscores"
      );
    } else {
      setUsernameError(""); // Clear error
    }
  };

  // Real-time email validation
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

  // Real-time password validation
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (value === "") {
      setPasswordError(""); // No error message if empty
    } else if (!validatePassword(value)) {
      setPasswordError(
        "* Password must be at least 8 characters long and include both letters and numbers"
      );
    } else {
      setPasswordError(""); // Clear error
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    if (value !== password) {
      setConfirmPasswordError("* Passwords do not match");
    } else {
      setConfirmPasswordError(""); // Clear error
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
    setUsernameError(""); // Clear username error
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    if (!isValidForm) return;

    await sendVerificationCodeWithFeedback(email);
  };

  const handleVerifyCodeSubmit = async (verificationCode) => {
    // 构建提交的表单数据
    const userData = {
      username,
      password,
      verificationCode,
      nickName: nickname,
      countryCode: countryCode?.code,
      userType: 0,
      email,
    };

    console.log("User Data to be submitted:", userData);

    setLoading(true);

    try {
      const response = await axiosInstance.post("/users/register", userData);

      if (response.data.success) {
        setShowVerifyModal(false);
        
        // 显示成功消息，持续时间为3秒
        showAlert("Registration successful!", "success", 3000);
        
        // 1秒后返回登录页面
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

  const handleBack = (e) => {
    e.preventDefault();
    handleBackToLogin();
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
      <Form autoComplete="off">
        <FormGroup className="mb-3">
          <Row className="g-2">
            <Col md={6}>
              <Label for="username">User Name</Label>
              <Input
                type="text"
                id="username"
                placeholder=""
                value={username}
                onChange={handleUsernameChange}
                autoComplete="off"
              />
            </Col>
            <Col md={6}>
              <Label for="nickname">Nickname</Label>
              <Input
                type="text"
                id="nickname"
                placeholder="(Optional)"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)} // Handle Nickname input
                autoComplete="off"
              />
            </Col>
            {usernameError && <p className="error-message">{usernameError}</p>}
          </Row>
        </FormGroup>

        <FormGroup className="mb-3">
          <Row className="g-2"></Row>
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
        sendVerificationCode={sendVerificationCodeWithoutFeedback} // 传递简化版的发送逻辑
      />
    </div>
  );
};

export default CreateAccountModal;
