import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
} from "reactstrap";
import axios from "axios";
import { getToken } from '../../auth/auth';

const CreateRoomTypeModal = ({ isOpen, toggle, projectId, onRoomTypeCreated }) => {
  const [name, setName] = useState("");
  const [typeCode, setTypeCode] = useState("");
  const [des, setDes] = useState("");
  // const [iconUrl, setIconUrl] = useState("");
  const [error, setError] = useState("");
  const [isTypeCodeManuallyEdited, setIsTypeCodeManuallyEdited] = useState(false);

  // Function to generate typeCode from room type name
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

  const handleCreateRoomType = async () => {
    const token = getToken();
    if (!token) {
      setError("No token found, please log in again.");
      return;
    }

    console.log("Form data being sent to backend:", {
      projectId,
      name,
      typeCode,
      des,
    });

    try {
      const response = await axios.post(
        "/project-rooms",
        {
          projectId,
          name,
          typeCode,
          des,
          // iconUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        onRoomTypeCreated(response.data.data);
        toggle();
      } else {
        setError("Error creating room type: " + response.data.errorMsg);
      }
    } catch (error) {
      setError("An unexpected error occurred.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleCreateRoomType();
  };

  // Automatically update typeCode when name changes, but only if it has not been manually edited
  useEffect(() => {
    if (!isTypeCodeManuallyEdited) {
      setTypeCode(generateTypeCode(name));
    }
  }, [name, isTypeCodeManuallyEdited]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Handle manual typeCode change
  const handleTypeCodeChange = (e) => {
    setTypeCode(e.target.value);
    setIsTypeCodeManuallyEdited(true);
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>Create New Room Type</ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          {error && <Alert color="danger">{error}</Alert>}
          <FormGroup>
            <Label for="name">
              <span style={{ color: "red" }}>*</span> Room Type Name:
            </Label>
            <Input
              type="text"
              name="name"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              value={typeCode}
              onChange={handleTypeCodeChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="des">Description:</Label>
            <Input
              type="text"
              name="des"
              id="des"
              value={des}
              onChange={(e) => setDes(e.target.value)}
            />
          </FormGroup>
          <Button
            color="primary"
            type="submit"
            style={{
              backgroundColor: "#fbcd0b",
              borderColor: "#fbcd0b",
              fontWeight: "bold",
            }}
          >
            Create
          </Button>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default CreateRoomTypeModal;