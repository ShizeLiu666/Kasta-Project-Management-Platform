import React, { useState, useEffect } from "react";
import { Form, FormGroup, Label, Input } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import CustomModal from '../../CustomModal';

const PasswordModal = ({ isOpen, toggle, projectName, onSubmit }) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordEmpty, setIsPasswordEmpty] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setPassword(""); // 当 modal 关闭时，重置密码
      setIsPasswordEmpty(true);
      setError("");
    }
  }, [isOpen]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setIsPasswordEmpty(newPassword.trim() === "");
  };

  const handleSubmit = () => {
    if (isPasswordEmpty) {
      setError("Please enter a password.");
      return;
    }
    onSubmit(password);
    setPassword("");
  };

  return (
    <CustomModal
      isOpen={isOpen}
      toggle={toggle}
      title={`Enter Password for ${projectName}`}
      onSubmit={handleSubmit}
      submitText="Submit"
      error={error}
      isSubmitting={false}
    >
      <Form>
        <FormGroup>
          <Label for="password">Password</Label>
          <div style={{ position: "relative" }}>
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              required
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
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} style={{ color: "#68696a" }} />
            </span>
          </div>
        </FormGroup>
      </Form>
    </CustomModal>
  );
};

export default PasswordModal;