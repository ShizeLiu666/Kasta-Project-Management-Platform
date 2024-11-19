import React, { useState, useEffect } from "react";
import { Form, FormGroup, Label, Input } from "reactstrap";
import { getToken } from '../../auth';
import axiosInstance from '../../../config'; 
import CustomModal from '../../CustomComponents/CustomModal';

const EditProjectModal = ({ isOpen, toggle, fetchProjects, project }) => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    des: "",
    // 移除密码相关字段
    // currentPassword: "",
    // newPassword: "",
  });
  const [error, setError] = useState("");
  const [successAlert, setSuccessAlert] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || "",
        address: project.address || "",
        des: project.des || "",
        // 移除密码相关字段
        // currentPassword: "",
        // newPassword: "",
      });
    }
  }, [project]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isFormValid = () => {
    if (!project) return false;
    const { name, address, des } = formData;
    const isChanged = name !== project.name || 
                      address !== project.address || 
                      des !== project.des;
    return isChanged;
  };

  const handleSubmit = async () => {
    if (!project) {
      setError("Project information is missing. Please try again.");
      return;
    }

    if (!isFormValid()) {
      setError("Please make at least one change.");
      return;
    }

    // 移除密码验证
    // if (formData.currentPassword !== project.password) {
    //   setError("Current password is incorrect. Please try again.");
    //   setTimeout(() => setError(""), 3000);
    //   return;
    // }

    const token = getToken();
    if (!token) {
      setError("Authentication token not found, please log in again");
      return;
    }

    const attributes = {};
    if (formData.name !== project.name) attributes.name = formData.name;
    if (formData.address !== project.address) attributes.address = formData.address;
    if (formData.des !== project.des) attributes.des = formData.des;
    // 移除新密码设置
    // if (formData.newPassword !== "") attributes.password = formData.newPassword;

    if (Object.keys(attributes).length === 0) {
      setError("No changes detected. Please modify at least one field.");
      setTimeout(() => setError(""), 3000);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axiosInstance.put(
        `/projects/modify`,
        { 
          projectId: project.projectId,
          attributes
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setSuccessAlert("Project updated successfully");
        setTimeout(() => {
          setSuccessAlert("");
          toggle();
          fetchProjects();
        }, 1000);
      } else {
        setError(response.data.errorMsg || "Error updating project");
      }
    } catch (err) {
      console.error("Error details:", err.response ? err.response.data : err);
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
      title="Edit Project"
      onSubmit={handleSubmit}
      submitText="Update"
      successAlert={successAlert}
      error={error}
      isSubmitting={isSubmitting}
      submitButtonColor="#007bff"
      disabled={!isFormValid()}
    >
      <Form>
        <FormGroup>
          <Label for="name">Project Name:</Label>
          <Input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="address">Address:</Label>
          <Input
            type="text"
            name="address"
            id="address"
            value={formData.address}
            onChange={handleChange}
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
        {/* <FormGroup>
          <Label for="currentPassword">
            <span style={{ color: "red" }}>*</span> Current Password:
          </Label>
          <Input
            type="password"
            name="currentPassword"
            id="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="newPassword">New Password:</Label>
          <Input
            type="password"
            name="newPassword"
            id="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
          />
        </FormGroup> */}
      </Form>
    </CustomModal>
  );
};

export default EditProjectModal;
