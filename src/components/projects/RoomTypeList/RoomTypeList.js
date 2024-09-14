import React, { useEffect, useState } from "react";
import axios from "axios";
import RoomElement from "./RoomElement";
import EditRoomTypeModal from "./EditRoomTypeModal";
import DeleteRoomTypeModal from "./DeleteRoomTypeModal";
import CreateRoomTypeModal from "./CreateRoomTypeModal";
import { Typography, CircularProgress, Button } from "@mui/material";
import SearchComponent from "../ProjectList/SearchComponent"; // Ensure to import the SearchComponent

const RoomTypeList = ({ projectId, projectName, onNavigate }) => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.error("No token found, please log in again.");
          return;
        }

        const response = await axios.get(`/api/project-rooms/${projectId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setRoomTypes(response.data.data); // Populate room types
        } else {
          console.error("Error fetching room types:", response.data.errorMsg);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching room types:", error);
        setLoading(false);
      }
    };

    fetchRoomTypes();
  }, [projectId]);

  // Filter room types by search term
  const filteredRoomTypes = roomTypes.filter((roomType) =>
    roomType.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateRoomType = async ({ name, typeCode, des, iconUrl }) => {
    const token = localStorage.getItem("authToken");

    console.log("Form data being sent to backend:", {
      projectId,
      name,
      typeCode,
      des,
      iconUrl,
    });

    try {
      const response = await axios.post(
        "/api/project-rooms",
        {
          projectId,
          name,
          typeCode,
          des,
          iconUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setRoomTypes([...roomTypes, response.data.data]); // Add new room type
      } else {
        console.error("Error creating room type:", response.data.errorMsg);
      }
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteRoomType = async () => {
    try {
      const token = localStorage.getItem("authToken");

      await axios.delete(
        `/api/project-rooms/${selectedRoomType.projectRoomId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRoomTypes((prevRoomTypes) =>
        prevRoomTypes.filter(
          (roomType) =>
            roomType.projectRoomId !== selectedRoomType.projectRoomId
        )
      );
      setDeleteModalOpen(false); // Close delete modal
    } catch (error) {
      console.error("Error deleting room type:", error);
    }
  };

  const handleEditRoomType = (roomType) => {
    setSelectedRoomType(roomType);
    setEditModalOpen(true); // Open edit modal
  };

  const handleSaveRoomType = async (newName) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.put(
        `/api/projects/${projectId}/roomTypes/${selectedRoomType._id}`,
        { name: newName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRoomTypes((prevRoomTypes) =>
        prevRoomTypes.map((roomType) =>
          roomType._id === selectedRoomType._id ? response.data : roomType
        )
      );
    } catch (error) {
      console.error("Error updating room type:", error);
    }
  };

  const handleDeleteClick = (roomType) => {
    setSelectedRoomType(roomType);
    setDeleteModalOpen(true); // Open delete modal
  };

  const handleRoomTypeClick = (roomType) => {
    onNavigate(
      ["Project List", "Room Types", "Room Configurations"],
      roomType.projectRoomId,
      roomType.name
    );
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          marginBottom: "10px", // 设置较大的底部外边距，根据需要调整数值
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <Typography variant="h5" gutterBottom>
            {projectName}
          </Typography>
          <SearchComponent
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder="Search Room Types..."
          />
        </div>
        <Button
          color="primary"
          onClick={() => setCreateModalOpen(true)}
          style={{
            backgroundColor: "#fbcd0b",
            color: "#fff",
            fontWeight: "bold",
            textTransform: "none",
          }}
        >
          Create Room Type
        </Button>
      </div>

      {filteredRoomTypes.map((roomType) => (
        <RoomElement
          key={roomType.projectRoomId}
          primaryText={`${roomType.typeCode}`}
          secondaryText={roomType.name}
          onDelete={() => handleDeleteClick(roomType)}
          onEdit={() => handleEditRoomType(roomType)}
          onClick={() => handleRoomTypeClick(roomType)} // Handle room type click event
        />
      ))}
      {selectedRoomType && (
        <>
          <EditRoomTypeModal
            isOpen={editModalOpen}
            toggle={() => setEditModalOpen(!editModalOpen)}
            currentName={selectedRoomType.name}
            onSave={handleSaveRoomType} // Call handleSaveRoomType
          />
          <DeleteRoomTypeModal
            isOpen={deleteModalOpen}
            toggle={() => setDeleteModalOpen(!deleteModalOpen)}
            onDelete={handleDeleteRoomType}
          />
        </>
      )}
      <CreateRoomTypeModal
        isOpen={createModalOpen}
        toggle={() => setCreateModalOpen(!createModalOpen)}
        onCreate={handleCreateRoomType}
      />
    </div>
  );
};

export default RoomTypeList;
