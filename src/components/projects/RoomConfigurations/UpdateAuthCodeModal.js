import React, { useState, useEffect, useCallback } from 'react';
import { Form, FormGroup, Label } from 'reactstrap';
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import CustomModal from '../../CustomComponents/CustomModal';
import { getToken } from '../../auth';
import axiosInstance from '../../../config';
import { fetchAuthCodes, getCurrentUserInfo } from '../ProjectDetails/RoomTypeList/authCodeUtils';

const filter = createFilterOptions();

const UpdateAuthCodeModal = ({ isOpen, toggle, projectRoomId, onSuccess }) => {
  const [formData, setFormData] = useState({
    authorizationCode: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successAlert, setSuccessAlert] = useState('');
  const [validAuthCodes, setValidAuthCodes] = useState([]);

  // 获取用户信息
  const { isSuperUser, currentUsername } = getCurrentUserInfo();

  const resetState = () => {
    setFormData({ authorizationCode: "" });
    setError('');
    setSuccessAlert('');
    setIsSubmitting(false);
  };

  const loadAuthCodes = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setError("No token found, please log in again.");
      return;
    }

    try {
      await fetchAuthCodes({
        token,
        isSuperUser,
        currentUsername,
        onSuccess: (codes) => {
          console.log('Auth codes loaded successfully:', codes);
          setValidAuthCodes(codes);
        },
        onError: (error) => {
          console.error('Error loading auth codes:', error);
          setError(error);
        }
      });
    } catch (error) {
      console.error("Error in loadAuthCodes:", error);
    }
  }, [isSuperUser, currentUsername]);

  useEffect(() => {
    if (isOpen) {
      resetState();
      loadAuthCodes();
    }
  }, [isOpen, loadAuthCodes]);

  const isFormValid = () => {
    const code = formData.authorizationCode.trim();
    return code && code.length > 0;
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

  const handleSubmit = async () => {
    if (!isFormValid()) {
      setError("Please enter a valid authorization code.");
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccessAlert('');

    try {
      const token = getToken();
      if (!token) {
        setError("No token found, please log in again.");
        return;
      }

      const response = await axiosInstance.put('/project-rooms/update-code', {
        projectRoomId,
        code: formData.authorizationCode.trim()
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;
      if (data.success) {
        setSuccessAlert("Authorization code updated successfully.");
        onSuccess();
        setTimeout(() => {
          resetState();
          toggle();
        }, 1000);
      } else {
        setError(data.errorMsg || "Failed to update authorization code.");
      }
    } catch (error) {
      setError("An error occurred while updating the authorization code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CustomModal
      isOpen={isOpen}
      toggle={toggle}
      title="Update Authorization Code"
      onSubmit={handleSubmit}
      submitText="Update"
      isSubmitting={isSubmitting}
      error={error}
      successAlert={successAlert}
      disabled={!isFormValid()}
    >
      <Form>
        <FormGroup>
          <Label for="authCode">New Authorization Code</Label>
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
              return `${option.code} ${option.description}`;  // 显示授权码和剩余次数
            }}
            filterOptions={(options, params) => {
              const filtered = filter(options, params);
              const { inputValue } = params;
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
                {option.inputValue ? option.label : `${option.code} (${10 - option.configUploadCount} uploads left)`}
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
      </Form>
    </CustomModal>
  );
};

export default UpdateAuthCodeModal;
