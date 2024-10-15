import React, { useState, useEffect } from "react";
import { Form, FormGroup, Label, Input } from "reactstrap";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import axiosInstance from '../../../config'; 
import { getToken } from '../../auth/auth';
import CustomModal from '../../CustomModal';

const CreateRoomTypeModal = ({ isOpen, toggle, projectId, onRoomTypeCreated }) => {
  const [formData, setFormData] = useState({
    name: "",
    typeCode: "",
    des: "",
    authorizationCode: ""
  });
  const [error, setError] = useState("");
  const [successAlert, setSuccessAlert] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTypeCodeManuallyEdited, setIsTypeCodeManuallyEdited] = useState(false);
  const [validAuthCodes, setValidAuthCodes] = useState([]);
  const [isSuperUser, setIsSuperUser] = useState(false);

  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    if (userDetails && userDetails.userType) {
      setIsSuperUser(userDetails.userType === 99999);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: "",
        typeCode: "",
        des: "",
        authorizationCode: ""  // 确保这里被重置
      });
      setError("");
      setSuccessAlert("");
      setIsTypeCodeManuallyEdited(false);
      if (isSuperUser) {
        fetchValidAuthCodes();
      }
    }
  }, [isOpen, isSuperUser]);

  const fetchValidAuthCodes = async () => {
    try {
      const token = getToken();
      const response = await axiosInstance.get('/authorization-codes', {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: 0, size: 1000 },
      });

      if (response.data.success) {
        const validCodes = response.data.data.content
          .filter(code => code.usageCount < 10)  // 修改这里：只选择使用次数小于10的授权码
          .map(code => ({
            code: code.code,
            label: `${code.code} (Used ${code.usageCount} ${code.usageCount === 1 ? 'time' : 'times'})`,
            usageCount: code.usageCount
          }));
        setValidAuthCodes(validCodes);
      } else {
        console.error('Failed to fetch auth codes:', response.data.errorMsg);
      }
    } catch (error) {
      console.error('Error fetching auth codes:', error);
    }
  };

  const generateTypeCode = (name) => {
    const words = name
      .split(" ")
      .filter((word) => word.toLowerCase() !== "room" && word.trim() !== "");
    const initials = words
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase() || "")
      .join("");
    return initials;
  };

  useEffect(() => {
    if (!isTypeCodeManuallyEdited) {
      setFormData(prev => ({ ...prev, typeCode: generateTypeCode(formData.name) }));
    }
  }, [formData.name, isTypeCodeManuallyEdited]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'typeCode') {
      setIsTypeCodeManuallyEdited(true);
    }
  };

  const handleAuthCodeChange = (event, newValue) => {
    if (newValue) {
      // 使用正则表达式移除括号及其中的内容
      const codeWithoutParentheses = newValue.code.replace(/\s*\([^)]*\)/, '').trim();
      setFormData(prev => ({ 
        ...prev, 
        authorizationCode: codeWithoutParentheses
      }));
    } else {
      setFormData(prev => ({ ...prev, authorizationCode: '' }));
    }
  };

  const isFormValid = () => {
    return formData.name && formData.typeCode && formData.authorizationCode;
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      setError("Please fill in all required fields.");
      return;
    }

    const token = getToken();
    if (!token) {
      setError("No token found, please log in again.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post(
        "/project-rooms",
        {
          projectId,
          ...formData
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setSuccessAlert("Room type created successfully!");
        setTimeout(() => {
          setSuccessAlert("");
          toggle();
          onRoomTypeCreated(response.data.data);
        }, 1000);
      } else {
        setError(response.data.errorMsg || "Error creating room type.");
      }
    } catch (error) {
      setError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CustomModal
      isOpen={isOpen}
      toggle={toggle}
      title="Create New Room Type"
      onSubmit={handleSubmit}
      submitText="Create"
      successAlert={successAlert}
      error={error}
      isSubmitting={isSubmitting}
      disabled={!isFormValid()}
      submitButtonColor="#fbcd0b"
    >
      <Form>
        <FormGroup>
          <Label for="authorizationCode">
            <span style={{ color: "red" }}>*</span> Auth Code:
          </Label>
          {isSuperUser ? (
            <Autocomplete
              id="auth-code-select"
              options={validAuthCodes}
              getOptionLabel={(option) => option.label}
              renderOption={(props, option) => (
                <Box component="li" {...props} key={option.code}>
                  {option.label}
                </Box>
              )}
              value={formData.authorizationCode ? { code: formData.authorizationCode, label: formData.authorizationCode } : null}
              onChange={handleAuthCodeChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder="Choose an auth code"
                  fullWidth
                  className="custom-form-control"
                  InputLabelProps={{ shrink: true }}
                  autoComplete="off"  // 添加这一行
                />
              )}
              isOptionEqualToValue={(option, value) => option.code.startsWith(value.code)}
            />
          ) : (
            <Input
              type="text"
              name="authorizationCode"
              id="authorizationCode"
              value={formData.authorizationCode}
              onChange={handleChange}
              required
            />
          )}
        </FormGroup>
        <FormGroup>
          <Label for="name">
            <span style={{ color: "red" }}>*</span> Room Type Name:
          </Label>
          <Input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="typeCode">
            <span style={{ color: "red" }}>*</span> Room Type Code:
          </Label>
          <Input
            type="text"
            name="typeCode"
            id="typeCode"
            value={formData.typeCode}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="des">Description:</Label>
          <Input
            type="text"
            name="des"
            id="des"
            value={formData.des}
            onChange={handleChange}
          />
        </FormGroup>
      </Form>
    </CustomModal>
  );
};

export default CreateRoomTypeModal;
