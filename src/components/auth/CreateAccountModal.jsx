import React, { useEffect, useState } from "react";
import { Form, FormGroup, Input, Button, Label } from "reactstrap";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos"; // 导入箭头图标

const CreateAccountModal = ({ handleBackToLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  }, []); 

  const handleSendVerificationCode = (e) => {
    e.preventDefault();
    console.log("Sending verification code to:", email);
  };

  return (
    <div className="form-container">
      <Form autoComplete="off">
        <FormGroup className="mb-3">
          <Label for="email">Email Address</Label>
          <Input
            type="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
            name="new-email" // 设置一个非标准的 name 属性值
          />
        </FormGroup>

        <FormGroup className="mb-3">
          <Label for="password">Password</Label>
          <Input
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="off"
            name="new-password" // 设置非标准的 name 属性值
          />
        </FormGroup>

        <FormGroup className="mb-3">
          <Label for="confirmPassword">Confirm Password</Label>
          <Input
            type="password"
            id="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="off"
            name="confirm-new-password" // 设置非标准的 name 属性值
          />
        </FormGroup>

        <div
          className="text-center d-flex justify-content-center align-items-center"
          style={{ marginTop: "40px" }}
        >
          {/* 返回登录按钮 */}
          <Button
            className="text-primary"
            style={{
              backgroundColor: "transparent",
              border: "none",
              color: "black",
              display: "inline-flex", // 使用 inline-flex 让图标和文本对齐
              alignItems: "center", // 对齐图标和文本
            }}
            onClick={handleBackToLogin} // 点击回到登录界面
          >
            <ArrowBackIosIcon/>{" "}
            {/* 图标与文本之间增加间距 */}
            Back to Login
          </Button>

          {/* 用 margin-right 增加两个按钮之间的距离 */}
          <div style={{ marginRight: "50px" }}></div>

          {/* 发送验证码按钮 */}
          <Button
            style={{
              backgroundColor: "#fbcd0b",
              borderColor: "#fbcd0b",
              fontWeight: "bold",
            }}
            className="btn-block"
            onClick={handleSendVerificationCode} // 点击发送验证码
          >
            Send Verification Code
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CreateAccountModal;
