import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Form, FormGroup, Input, Button, Label } from "reactstrap";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./LoginPage.css";
import kastaLogo from "../../assets/images/logos/kasta_logo.png";
import CreateAccountModal from "./CreateAccountModal";
import ForgotPasswordModal from "./ForgotPasswordModal";
import { setToken, saveUsername, saveUserDetails } from '../auth/auth';
import axiosInstance from '../../config'; 
import CustomAlert from '../CustomComponents/CustomAlert';
import { motion, AnimatePresence } from 'framer-motion';

const DEFAULT_ALERT_DURATION = 3000;

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [alert, setAlert] = useState({
    isOpen: false,
    message: "",
    severity: "info",
    duration: DEFAULT_ALERT_DURATION
  });
  const [isCreatingAccount, setIsCreatingAccount] = useState(false); // Toggle Create Account form
  const [isForgotPassword, setIsForgotPassword] = useState(false); // Toggle Forgot Password form
  const usernameInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setUsername("");
    setPassword("");
    const { savedUsername, savedPassword } = getSavedCredentials();
    if (savedUsername && savedPassword) {
      setUsername(savedUsername);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);


  const getSavedCredentials = () => {
    const savedUsername = localStorage.getItem('rememberedUsername');
    const savedPassword = localStorage.getItem('rememberedPassword');
    return { savedUsername, savedPassword };
  };

  const attemptLogin = async (attemptedUsername, isSecondAttempt = false) => {
    try {
      const response = await axiosInstance.post('/users/login', {
        username: attemptedUsername,
        password,
      });

      if (response.data && response.data.success) {
        const { token, username: loggedInUsername } = response.data.data;

        // 获取用户详情
        try {
          const userDetailResponse = await axiosInstance.get('/users/detail', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (userDetailResponse.data && userDetailResponse.data.success) {
            const userDetails = userDetailResponse.data.data;
            
            // 直接允许所有用户登录，移除用户类型检查
            setToken(token, rememberMe);
            saveUsername(loggedInUsername, rememberMe);
            saveUserDetails(userDetails);
            
            // 设置 axios 默认 headers
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            if (rememberMe) {
              localStorage.setItem('rememberedUsername', username);
              localStorage.setItem('rememberedPassword', password);
            } else {
              localStorage.removeItem('rememberedUsername');
              localStorage.removeItem('rememberedPassword');
            }

            showAlert("Login successful! Redirecting...", "success");
            setTimeout(() => {
              navigate("/admin/dashboard");
            }, 1800);
          }
        } catch (detailError) {
          console.error("Error fetching user details:", detailError);
          showAlert("An error occurred while fetching user details. Please try again.", "error");
        }

        return { success: true };
      } else {
        // 登录失败处理
        return { 
          success: false, 
          error: response.data.errorMsg // 直接使用后端返回的错误信息
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response && (error.response.status === 500 || error.response.status === 502)) {
        showAlert("Server error, please wait for maintenance", "error");
        return { success: false, error: "Server error", isServerError: true };
      } else if (isSecondAttempt) {
        if (error.response) {
          showAlert("An error occurred during login", "error");
        } else {
          showAlert("Network error, please check your connection", "error");
        }
      }
      return { success: false, error: "An error occurred during login" };
    }
  };

  const handleLogin = async () => {
    if (isLoading) return;
    
    if (!username.trim()) {
      showAlert("Please enter a username", "error");
      return;
    }

    if (!password.trim()) {
      showAlert("Please enter a password", "error");
      return;
    }

    setIsLoading(true);
    try {
      const loginResult = await attemptLogin(username, true);
      
      if (loginResult.success) {
        setLoginSuccess(true); // 触发成功动画
      } else {
        showAlert(loginResult.error || "Login failed", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // 阻止表单默认提交行为
    handleLogin();
  };

  const handleUsernameKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      passwordInputRef.current.focus();
    }
  };

  const handlePasswordKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleLogin();
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleCreateAccountClick = () => {
    setIsCreatingAccount(true);
    setIsForgotPassword(false); // Ensure Forgot Password is hidden
  };

  const handleForgotPasswordClick = () => {
    setIsForgotPassword(true); // Show Forgot Password modal
    setIsCreatingAccount(false); // Ensure Create Account is hidden
  };

  const handleBackToLogin = () => {
    setIsCreatingAccount(false);
    setIsForgotPassword(false); // Show Login Form
  };

  const showAlert = (message, severity, duration = DEFAULT_ALERT_DURATION) => {
    setAlert({ isOpen: true, message, severity, duration });
  };

  return (
    <>
      <section className="h-100 gradient-form">
        <div className="star-layer"></div>
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-xl-10">
              <div className="card rounded-3 text-black">
                <div className="row g-0">
                  {/* Left Panel */}
                  <div className="col-lg-6">
                    <div className="card-body p-md-5 mx-md-4">
                      <div className="text-center">
                        <img
                          src={kastaLogo}
                          className="logo-margin-bottom"
                          style={{ width: "150px" }}
                          alt="logo"
                        />
                        <h4 className="mt-1 mb-4 pb-1 custom-title">
                          Project Management Platform
                        </h4>
                      </div>

                      {alert.isOpen && (
                        <CustomAlert
                          isOpen={alert.isOpen}
                          onClose={() => setAlert(prev => ({ ...prev, isOpen: false }))}
                          message={alert.message}
                          severity={alert.severity}
                          autoHideDuration={alert.duration}
                        />
                      )}

                      {/* Conditionally Render: Login, Create Account, or Forgot Password */}
                      {isCreatingAccount ? (
                        <CreateAccountModal
                          handleBackToLogin={handleBackToLogin}
                        />
                      ) : isForgotPassword ? (
                        <ForgotPasswordModal
                          handleBackToLogin={handleBackToLogin}
                        />
                      ) : (
                        <div className="form-container">
                          <Form onSubmit={handleSubmit}>
                            <FormGroup className="mb-4">
                              <Input
                                type="text"
                                id="username"
                                name="username"
                                placeholder="Email / Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                onKeyDown={handleUsernameKeyDown}
                                autoComplete="off"
                                ref={usernameInputRef}
                              />
                            </FormGroup>

                            <FormGroup
                              className="mb-4"
                              style={{ position: "relative" }}
                            >
                              <Input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={handlePasswordKeyDown}
                                autoComplete="new-password"
                                ref={passwordInputRef}
                              />
                              <span
                                onClick={togglePasswordVisibility}
                                style={{
                                  position: "absolute",
                                  right: "10px",
                                  top: "50%",
                                  transform: "translateY(-50%)",
                                  cursor: "pointer",
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={showPassword ? faEyeSlash : faEye}
                                  style={{ color: "#68696a" }}
                                />
                              </span>
                            </FormGroup>

                            <FormGroup className="d-flex justify-content-between align-items-center mb-4">
                              <Label check className="text-dark">
                                <Input
                                  type="checkbox"
                                  checked={rememberMe}
                                  onChange={() => setRememberMe(!rememberMe)}
                                  style={{
                                    backgroundColor: rememberMe
                                      ? "#fbcd0b"
                                      : "white",
                                    border: "none",
                                  }}
                                />{" "}
                                Remember Me
                              </Label>
                              <button
                                className="text-primary btn btn-link p-0"
                                style={{
                                  display: "inline-block",
                                  textDecoration: "none",
                                  fontSize: "0.9rem",
                                  border: "none",
                                  background: "transparent",
                                }}
                                onClick={handleForgotPasswordClick}
                              >
                                Forgot Password?
                              </button>
                            </FormGroup>

                            <div className="text-center pt-1 mb-1 pb-0 move-down">
                              <Button
                                className="btn-block fa-lg mb-2 login-button"
                                style={{
                                  backgroundColor: "#fbcd0b",
                                  borderColor: "#fbcd0b",
                                  fontWeight: "bold",
                                  opacity: isLoading ? 0.7 : 1,
                                }}
                                type="submit"
                                onClick={handleLogin}
                                disabled={isLoading}
                              >
                                {isLoading ? "Logging in..." : "Log in"}
                              </Button>
                            </div>

                            <div className="d-flex justify-content-center align-items-center mb-1">
                              <p className="mb-0">New Member?</p>
                              <button
                                type="button"
                                className="text-primary btn btn-link p-0"
                                style={{
                                  display: "inline-block",
                                  textDecoration: "none",
                                  fontSize: "1rem",
                                  border: "none",
                                  background: "transparent",
                                  marginLeft: "10px",
                                }}
                                onClick={handleCreateAccountClick}
                              >
                                Create an account
                              </button>
                            </div>
                          </Form>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Panel */}
                  <div className="col-lg-6 d-flex align-items-center gradient-custom-2">
                    <div className="text-gradient">
                      <h4 className="mb-4">Living Enhanced</h4>
                      <p className="small mb-0">
                        KASTA offers smart control solutions with products
                        designed in Australia. Our seamless integration and
                        modular form ensure connectivity and scalability,
                        enhancing lifestyles with tailored applications.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LoginPage;
