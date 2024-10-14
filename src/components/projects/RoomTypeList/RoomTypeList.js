import React, { useEffect, useState } from "react";
import RoomElement from "./RoomElement";
import EditRoomTypeModal from "./EditRoomTypeModal";
import DeleteRoomTypeModal from "./DeleteRoomTypeModal";
import CreateRoomTypeModal from "./CreateRoomTypeModal";
import { Typography, CircularProgress } from "@mui/material";
import { Button } from "reactstrap";
import SearchComponent from "../ProjectList/SearchComponent";
import { getToken } from '../../auth/auth';
import axiosInstance from '../../../config'; 


const RoomTypeList = ({ projectId, projectName, onNavigate }) => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const token = getToken();
        if (!token) {
          alert("No token found, please log in again.");
          return;
        }

        const response = await axiosInstance.get(`/project-rooms/${projectId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setRoomTypes(response.data.data);
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

  const filteredRoomTypes = roomTypes.filter((roomType) =>
    roomType.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRoomTypeCreated = (newRoomType) => {
    setRoomTypes([...roomTypes, newRoomType]);
  };

  const handleRoomTypeDeleted = (deletedRoomTypeId) => {
    setRoomTypes(roomTypes.filter(roomType => roomType.projectRoomId !== deletedRoomTypeId));
  };

  const handleEditRoomType = (roomType) => {
    setSelectedRoomType(roomType);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (roomType) => {
    setSelectedRoomType(roomType);
    setDeleteModalOpen(true);
  };

  const handleRoomTypeClick = (roomType) => {
    onNavigate(
      ["Project List", "Room Types", "Room Configurations"],
      roomType.projectRoomId,
      roomType.name
    );
  };

  const handleRoomTypeUpdated = (updatedRoomType) => {
    setRoomTypes(roomTypes.map(roomType => 
      roomType.projectRoomId === updatedRoomType.projectRoomId ? updatedRoomType : roomType
    ));
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
          marginBottom: "10px",
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
          color="secondary"
          onClick={() => setCreateModalOpen(true)}
          style={{
            backgroundColor: "#fbcd0b",
            borderColor: "#fbcd0b",
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
          roomType={roomType}
          onDelete={() => handleDeleteClick(roomType)}
          onEdit={() => handleEditRoomType(roomType)}
          onClick={() => handleRoomTypeClick(roomType)}
        />
      ))}
      {selectedRoomType && (
        <>
          <EditRoomTypeModal
            isOpen={editModalOpen}
            toggle={() => setEditModalOpen(!editModalOpen)}
            roomType={selectedRoomType}
            onRoomTypeUpdated={handleRoomTypeUpdated}
          />
          <DeleteRoomTypeModal
            isOpen={deleteModalOpen}
            toggle={() => setDeleteModalOpen(!deleteModalOpen)}
            selectedRoomType={selectedRoomType}
            onRoomTypeDeleted={handleRoomTypeDeleted}
          />
        </>
      )}
      <CreateRoomTypeModal
        isOpen={createModalOpen}
        toggle={() => setCreateModalOpen(!createModalOpen)}
        projectId={projectId}
        onRoomTypeCreated={handleRoomTypeCreated}
      />
    </div>
  );
};

export default RoomTypeList;
