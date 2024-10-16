import React, { useState, useEffect } from "react";
// import { Form, FormGroup, Label, Input } from "reactstrap";
import { getToken } from '../../auth/auth';
import axiosInstance from '../../../config'; 
import CustomModal from '../../CustomModal';

const DeleteProjectModal = ({ isOpen, toggle, onDelete, project }) => {
  // const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successAlert, setSuccessAlert] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setError("");
      setSuccessAlert("");
      // setPassword("");
    }
  }, [isOpen]);

  const handleDelete = async () => {
    if (!project) {
      setError("Project information is missing. Please try again.");
      return;
    }

    // 移除密码验证
    // if (password !== project.password) {
    //   setError("Incorrect password. Please try again.");
    //   setTimeout(() => setError(""), 3000);
    //   return;
    // }

    const token = getToken();
    if (!token) {
      setError("Authentication token not found, please log in again");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axiosInstance.delete(`/projects/${project.projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setSuccessAlert("Project deleted successfully!");
        setTimeout(() => {
          setSuccessAlert("");
          toggle();
          onDelete();
        }, 1000);
      } else {
        setError(response.data.errorMsg || "Error deleting project.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!project) {
    return null;
  }

  return (
    <CustomModal
      isOpen={isOpen}
      toggle={toggle}
      title="Confirm Delete"
      onSubmit={handleDelete}
      submitText="Delete"
      successAlert={successAlert}
      error={error}
      isSubmitting={isSubmitting}
      submitButtonColor="#dc3545"  // 使用 Bootstrap 的 danger 颜色
      // disabled={!password}
    >
      <p>Are you sure you want to delete the project "{project.name}"?</p>
      {/* 移除密码输入框
      <Form>
        <FormGroup>
          <Label for="password">
            <span style={{ color: "red" }}>*</span> Enter project password to confirm:
          </Label>
          <Input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormGroup>
      </Form>
      */}
    </CustomModal>
  );
};

export default DeleteProjectModal;
