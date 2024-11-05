import React, { useState, useEffect } from "react";
import { Form, FormGroup, Label, Input } from "reactstrap";
import { getToken } from '../../auth';
import axiosInstance from '../../../config'; 
import CustomModal from '../../CustomModal';

const EditNetworkModal = ({ isOpen, toggle, onSuccess, network }) => {
  const [formData, setFormData] = useState({
    meshName: "",
    // passphrase: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (network) {
      setFormData({
        meshName: network.meshName || "",
        // passphrase: network.passphrase || "",
      });
    }
  }, [network]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isFormValid = () => {
    if (!network) return false;
    const { meshName } = formData;
    return meshName !== network.meshName;
  };

  const handleSubmit = async () => {
    if (!network) {
      setError("Network information is missing. Please try again.");
      return;
    }

    if (!isFormValid()) {
      setError("Please make at least one change.");
      return;
    }

    const token = getToken();
    if (!token) {
      setError("Authentication token not found, please log in again");
      return;
    }

    setIsSubmitting(true);
    try {
      if (formData.meshName !== network.meshName) {
        const meshNameResponse = await axiosInstance.put(
          `/networks/mesh-name/${network.networkId}`,
          { meshName: formData.meshName },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!meshNameResponse.data.success) {
          throw new Error(meshNameResponse.data.errorMsg || "Failed to update network name");
        }
      }

    //   if (formData.passphrase !== network.passphrase) {
    //     const passphraseResponse = await axiosInstance.put(
    //       `/networks/passphrase/${network.networkId}`,
    //       { passphrase: formData.passphrase },
    //       {
    //         headers: { Authorization: `Bearer ${token}` },
    //       }
    //     );
    //     if (!passphraseResponse.data.success) {
    //       throw new Error(passphraseResponse.data.errorMsg || "Failed to update passphrase");
    //     }
    //   }

      onSuccess("Network updated successfully");
      toggle();
    } catch (err) {
      console.error("Error details:", err.response ? err.response.data : err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!network) {
    return null;
  }

  return (
    <CustomModal
      isOpen={isOpen}
      toggle={toggle}
      title="Edit Network"
      onSubmit={handleSubmit}
      submitText="Update"
      error={error}
      isSubmitting={isSubmitting}
      submitButtonColor="#007bff"
      disabled={!isFormValid()}
    >
      <Form>
        <FormGroup>
          <Label for="meshName">Network Name</Label>
          <Input
            type="text"
            name="meshName"
            id="meshName"
            value={formData.meshName}
            onChange={handleChange}
            placeholder="Enter network name"
          />
        </FormGroup>
        {/* <FormGroup>
          <Label for="passphrase">Passphrase</Label>
          <Input
            type="text"
            name="passphrase"
            id="passphrase"
            value={formData.passphrase}
            onChange={handleChange}
            placeholder="Enter passphrase"
          />
        </FormGroup> */}
      </Form>
    </CustomModal>
  );
};

export default EditNetworkModal;
