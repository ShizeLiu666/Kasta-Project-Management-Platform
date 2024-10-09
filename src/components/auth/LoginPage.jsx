import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import { Form, FormGroup, Input, Button, Label } from "reactstrap";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./LoginPage.css";
import kastaLogo from "../../assets/images/logos/kasta_logo.png";
import CreateAccountModal from "./CreateAccountModal";
import ForgotPasswordModal from "./ForgotPasswordModal";
import { setToken, saveUsername, saveUserDetails } from './auth';
import axiosInstance from '../../config';  // 路径可能需要调整

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [alert, setAlert] = useState({
    severity: "",
    message: "",
    open: false,
  });
  const [isCreatingAccount, setIsCreatingAccount] = useState(false); // Toggle Create Account form
  const [isForgotPassword, setIsForgotPassword] = useState(false); // Toggle Forgot Password form
  const usernameInputRef = useRef(null);
  const passwordInputRef = useRef(null);

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

  const attemptLogin = async (attemptedUsername) => {
    try {
      const response = await axiosInstance.post('/users/login', {
        username: attemptedUsername,
        password,
      });

      if (response.data && response.data.success) {
        // Login success handling logic
        const { token, username: loggedInUsername } = response.data.data;

        setToken(token, rememberMe);
        saveUsername(loggedInUsername, rememberMe);

        // 设置 axios 实例的默认 headers
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // 获取用户详情
        try {
          const userDetailResponse = await axiosInstance.get('/users/detail');
          if (userDetailResponse.data && userDetailResponse.data.success) {
            saveUserDetails(userDetailResponse.data.data);
          }
        } catch (detailError) {
          console.error("Error fetching user details:", detailError);
          // 即使获取用户详情失败，我们仍然认为登录是成功的
        }

        if (rememberMe) {
          localStorage.setItem('rememberedUsername', username);
          localStorage.setItem('rememberedPassword', password);
        } else {
          localStorage.removeItem('rememberedUsername');
          localStorage.removeItem('rememberedPassword');
        }

        setAlert({
          severity: "success",
          message: "Login successful! Redirecting...",
          open: true,
        });

        setTimeout(() => {
          setAlert({ open: false });
          navigate("/admin/projects");
        }, 1000);
        return { success: true };
      }
      return { success: false, error: response.data.errorMsg || "Login failed" };
    } catch (error) {
      console.error("Login error:", error);
      if (error.response) {
        if (error.response.status === 500 || error.response.status === 502) {
          return { 
            success: false, 
            error: "Server issue detected. Please wait while we resolve it.", 
            isServerError: true 
          };
        }
      }
      return { success: false, error: "An error occurred during login" };
    }
  };

  const handleLogin = async () => {
    if (!username.trim()) {
      showAlert("error", "Please enter a username");
      return;
    }

    if (!password.trim()) {
      showAlert("error", "Please enter a password");
      return;
    }

    let loginResult = await attemptLogin(username);

    if (!loginResult.success) {
      // 尝试更改第一个字母的大小写
      const alteredUsername = username.charAt(0) === username.charAt(0).toLowerCase()
        ? username.charAt(0).toUpperCase() + username.slice(1)
        : username.charAt(0).toLowerCase() + username.slice(1);

      loginResult = await attemptLogin(alteredUsername);
    }

    if (!loginResult.success) {
      if (loginResult.isServerError) {
        setAlert({
          severity: "error",
          message: loginResult.error,
          open: true,
        });
      } else {
        setAlert({
          severity: "error",
          message: "Incorrect username or password. Please check your credentials.",
          open: true,
        });
      }
    }

    setTimeout(() => {
      setAlert({ open: false });
    }, 3000);
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

  const showAlert = (severity, message) => {
    setAlert({
      severity,
      message,
      open: true,
    });

    setTimeout(() => {
      setAlert(prevAlert => ({ ...prevAlert, open: false }));
    }, 3000);
  };

  return (
    <>
      <section className="h-100 gradient-form">
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
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                onKeyDown={handleUsernameKeyDown}
                                autoComplete="off"
                                // required
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
                                // required
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
                                onClick={handleForgotPasswordClick} // Switch to Forgot Password modal
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
                                }}
                                type="submit"
                                onClick={handleLogin}
                              >
                                Log in
                              </Button>
                            </div>

                            <div className="d-flex justify-content-center align-items-center mb-1">
                              <p className="mb-0">New Member?</p>
                              <button
                                type="button" // 添加 type="button" 以防止表单提交
                                className="text-primary btn btn-link p-0"
                                style={{
                                  display: "inline-block",
                                  textDecoration: "none",
                                  fontSize: "1rem",
                                  border: "none",
                                  background: "transparent",
                                  marginLeft: "10px",
                                }}
                                onClick={handleCreateAccountClick} // Switch to Create Account modal
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
                        enhancing lifestyles with tailored applications
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