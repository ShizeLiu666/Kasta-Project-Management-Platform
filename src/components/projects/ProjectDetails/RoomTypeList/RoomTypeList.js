import React, { useEffect, useState, useCallback } from "react";
import RoomElement from "./RoomElement";
import EditRoomTypeModal from "./EditRoomTypeModal";
import DeleteRoomTypeModal from "./DeleteRoomTypeModal";
import CreateRoomTypeModal from "./CreateRoomTypeModal";
import { CircularProgress } from "@mui/material";
import CustomSearchBar from '../../../CustomComponents/CustomSearchBar';
import { getToken } from '../../../auth';
import axiosInstance from '../../../../config'; 
import CustomButton from '../../../CustomComponents/CustomButton';

const RoomTypeList = ({ projectId, projectName, onNavigate, userRole }) => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRoomTypes, setFilteredRoomTypes] = useState([]);

  const fetchRoomTypes = useCallback(async () => {
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
        setFilteredRoomTypes(response.data.data);
        console.log(response.data.data);
      } else {
        console.error("Error fetching room types:", response.data.errorMsg);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching room types:", error);
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchRoomTypes();
  }, [fetchRoomTypes]);

  const filterRoomTypes = (searchValue) => {
    return roomTypes.filter((roomType) =>
      roomType.name.toLowerCase().includes(searchValue.toLowerCase())
    );
  };

  const handleRoomTypeCreated = async (newRoomType) => {
    await fetchRoomTypes();
    setCreateModalOpen(false);
  };

  const handleRoomTypeDeleted = async (deletedRoomTypeId) => {
    await fetchRoomTypes();
    setDeleteModalOpen(false);
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
      ["Project List", "Project Details", "Room Configurations"],
      roomType.projectRoomId,
      roomType.name,
      userRole,
      roomType.projectRoomId
    );
  };

  const handleRoomTypeUpdated = async (updatedRoomType) => {
    await fetchRoomTypes();
    setEditModalOpen(false);
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
        <CustomSearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholder="Search Room Types..."
          filterKey="name"
          onFilter={(value) => {
            const filtered = filterRoomTypes(value);
            setFilteredRoomTypes(filtered);
          }}
        />
        <CustomButton
          type="create"
          onClick={() => setCreateModalOpen(true)}
          allowedRoles={['OWNER']}
          userRole={userRole}
        >
          Create Room Type
        </CustomButton>
      </div>

      {filteredRoomTypes.map((roomType) => (
        <RoomElement
          key={roomType.projectRoomId}
          roomType={roomType}
          onDelete={() => handleDeleteClick(roomType)}
          onEdit={() => handleEditRoomType(roomType)}
          onClick={() => handleRoomTypeClick(roomType)}
          userRole={userRole}
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
