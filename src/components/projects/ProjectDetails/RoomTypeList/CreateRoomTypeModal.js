import React, { useState, useEffect, useCallback } from "react";
import { Form, FormGroup, Label, Input } from "reactstrap";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import axiosInstance from '../../../../config';
import { getToken } from '../../../auth';
import CustomModal from '../../../CustomModal';

const filter = createFilterOptions();

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
  const [currentUsername, setCurrentUsername] = useState('');

  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    if (userDetails) {
      setIsSuperUser(userDetails.userType === 99999);
      setCurrentUsername(userDetails.username);
    }
  }, []);

  const fetchValidAuthCodes = useCallback(async (token) => {
    try {
      const response = await axiosInstance.get('/authorization-codes', {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: 0, size: 1000 },
      });

      if (response.data.success) {
        const validCodes = response.data.data.content
          .filter(code => 
            code.usageCount < 10 && 
            (!code.usedBy || code.usedBy === currentUsername)
          )
          .map(code => ({
            code: code.code,
            label: `${code.code} (${10 - code.usageCount} uses left)`,
            usageCount: code.usageCount
          }));
        setValidAuthCodes(validCodes);
      } else {
        console.error('Failed to fetch auth codes:', response.data.errorMsg);
      }
    } catch (error) {
      console.error('Error fetching auth codes:', error);
    }
  }, [currentUsername]);

  const fetchProjectRoomCodes = useCallback(async (token) => {
    try {
      const initialResponse = await axiosInstance.get('/authorization-codes/project-room-code', {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: 0, size: 1 },
      });

      if (initialResponse.data.success) {
        const totalElements = initialResponse.data.data.totalElements;

        const fullResponse = await axiosInstance.get('/authorization-codes/project-room-code', {
          headers: { Authorization: `Bearer ${token}` },
          params: { page: 0, size: totalElements },
        });

        if (fullResponse.data.success) {
          const validCodes = fullResponse.data.data.content
            .filter(code => 
              code.usageCount < 10 && 
              (!code.usedBy || code.usedBy === currentUsername)
            )
            .map(code => ({
              code: code.code,
              label: `${code.code} (${10 - code.usageCount} uses left)`,
              usageCount: code.usageCount
            }));
          setValidAuthCodes(validCodes);
        } else {
          console.error('Failed to fetch project room codes:', fullResponse.data.errorMsg);
        }
      } else {
        console.error('Failed to fetch initial project room codes:', initialResponse.data.errorMsg);
      }
    } catch (error) {
      console.error('Error fetching project room codes:', error);
    }
  }, [currentUsername]);

  const fetchAuthCodes = useCallback(async () => {
    try {
      const token = getToken();
      if (isSuperUser) {
        await fetchValidAuthCodes(token);
      } else {
        await fetchProjectRoomCodes(token);
      }
    } catch (error) {
      console.error('Error fetching auth codes:', error);
    }
  }, [isSuperUser, fetchValidAuthCodes, fetchProjectRoomCodes]);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: "",
        typeCode: "",
        des: "",
        authorizationCode: ""
      });
      setError("");
      setSuccessAlert("");
      setIsTypeCodeManuallyEdited(false);
      fetchAuthCodes();
    }
  }, [isOpen, fetchAuthCodes]);

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
    if (typeof newValue === 'string') {
      // 用户输入了自定义的 Auth Code
      setFormData(prev => ({ ...prev, authorizationCode: newValue.trim() }));
    } else if (newValue && newValue.inputValue) {
      // 用户创建了新的 Auth Code
      setFormData(prev => ({ ...prev, authorizationCode: newValue.inputValue.trim() }));
    } else if (newValue && newValue.code) {
      // 用户选择了预设的 Auth Code
      setFormData(prev => ({ ...prev, authorizationCode: newValue.code.trim() }));
    } else {
      // 清空选择
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
          <Autocomplete
            id="auth-code-select"
            options={validAuthCodes}
            getOptionLabel={(option) => {
              if (typeof option === 'string') {
                return option;
              }
              if (option.inputValue) {
                return option.inputValue;
              }
              return option.label;
            }}
            filterOptions={(options, params) => {
              const filtered = filter(options, params);
              const { inputValue } = params;
              // 建议创建新值
              const isExisting = options.some((option) => inputValue === option.code);
              if (inputValue !== '' && !isExisting) {
                filtered.push({
                  inputValue,
                  label: `Use "${inputValue}"`,
                });
              }
              return filtered;
            }}
            renderOption={(props, option) => (
              <Box component="li" {...props} key={option.code || option.inputValue}>
                {option.label}
              </Box>
            )}
            freeSolo
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            value={formData.authorizationCode}
            onChange={handleAuthCodeChange}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder="Choose or enter an auth code"
                fullWidth
                className="custom-form-control"
                InputLabelProps={{ shrink: true }}
                autoComplete="off"
              />
            )}
            isOptionEqualToValue={(option, value) => option.code === value.code}
          />
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
