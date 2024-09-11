import React, { useState, useEffect } from "react";
import { Button, Modal, ModalHeader, ModalBody, Form, Input } from "reactstrap";
import "./VerifyCodeModal.css"; // 如果您有其他样式可以保留，如果不需要可以删除

const VerifyCodeModal = ({
  isOpen,
  toggle,
  email,
  onSubmit,
  sendVerificationCode,
}) => {
  const [code, setCode] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [canRequestAgain, setCanRequestAgain] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCode(""); // 每次打开 modal 时清空输入
      setCountdown(60); // 每次打开 modal 重置倒计时
      setCanRequestAgain(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!canRequestAgain && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer); // 清理定时器
    } else {
      setCanRequestAgain(true);
    }
  }, [countdown, canRequestAgain]);

  const handleChange = (e) => {
    const value = e.target.value;
    if (value.length <= 6 && /^[0-9]*$/.test(value)) {
      setCode(value); // 只允许输入 6 位数字
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code.length === 6) {
      onSubmit(code); // 只有在 6 位数字输入完成时才允许提交
    }
  };

  const handleRequestAgain = async () => {
    setCountdown(60); // 重置倒计时
    setCanRequestAgain(false);

    // 直接调用传递过来的简化发送验证码逻辑
    await sendVerificationCode(email);
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>Email Verification</ModalHeader>
      <ModalBody>
        <p className="text-center">
          Your code was sent to <b>{email}</b>
        </p>
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            maxLength="6"
            value={code}
            onChange={handleChange}
            placeholder="Enter 6-digit code"
            className="text-center"
            style={{
              width: "50%",
              height: "45px",
              textAlign: "center",
              fontSize: "18px",
              borderRadius: "6px",
              border: "1px solid #ddd",
              display: "block", // 让按钮成为块级元素
              margin: "0 auto", // 让按钮水平居中
              marginBottom: "20px",
            }}
          />

          <Button
            color="primary"
            type="submit"
            style={{
              backgroundColor: "#fbcd0b",
              borderColor: "#fbcd0b",
              fontWeight: "bold",
              display: "block", // 让按钮成为块级元素
              margin: "0 auto", // 让按钮水平居中
            }}
            className="btn-block"
            disabled={code.length !== 6} // 只有在输入满 6 位时才能点击
          >
            Verify
          </Button>
          
          <p className="text-muted text-center mt-3">
            Didn't receive the code?{" "}
            <button
              className="text-primary btn btn-link p-0"
              style={{
                display: "inline-block",
                textDecoration: "none",
                fontSize: "0.9rem",
                border: "none",
                background: "transparent",
                marginBottom: "3px",
              }}
              onClick={handleRequestAgain} // 调用请求重新发送验证码的逻辑
              disabled={!canRequestAgain} // 如果不能请求重新发送，禁用按钮
            >
              {canRequestAgain
                ? "Request again"
                : `Request again in ${countdown}s`}
            </button>
          </p>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default VerifyCodeModal;
