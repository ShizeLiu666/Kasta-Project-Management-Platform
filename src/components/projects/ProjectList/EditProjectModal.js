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
    
    // 检查每个字段是否有实际变更，同时处理可能的undefined值
    const hasNameChange = formData.name.trim() !== (project.name || '').trim();
    const hasAddressChange = formData.address.trim() !== (project.address || '').trim();
    const hasDesChange = formData.des.trim() !== (project.des || '').trim();
    
    return hasNameChange || hasAddressChange || hasDesChange;
  };

  const handleSubmit = async () => {
    if (!project) {
      setError("Project information is missing. Please try again.");
      return;
    }

    if (!isFormValid()) {
      setError("No changes detected. Please modify at least one field.");
      return;
    }

    const token = getToken();
    if (!token) {
      setError("Authentication token not found, please log in again");
      return;
    }

    const attributes = {};
    // 安全地处理可能为undefined的值
    const currentName = (project.name || '').trim();
    const currentAddress = (project.address || '').trim();
    const currentDes = (project.des || '').trim();

    const newName = formData.name.trim();
    const newAddress = formData.address.trim();
    const newDes = formData.des.trim();

    if (newName !== currentName) {
      attributes.name = newName;
    }
    if (newAddress !== currentAddress) {
      attributes.address = newAddress;
    }
    if (newDes !== currentDes) {
      attributes.des = newDes;
    }

    if (Object.keys(attributes).length === 0) {
      setError("No changes detected. Please modify at least one field.");
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
