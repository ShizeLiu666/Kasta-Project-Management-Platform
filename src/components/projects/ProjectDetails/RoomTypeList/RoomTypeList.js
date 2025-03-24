import React, { useEffect, useState, useCallback } from "react";
import RoomElement from "./RoomElement";
import EditRoomTypeModal from "./EditRoomTypeModal";
import DeleteRoomTypeModal from "./DeleteRoomTypeModal";
import CreateRoomTypeModal from "./CreateRoomTypeModal";
import { CircularProgress } from "@mui/material";
import CustomSearchBar from '../../../CustomComponents/CustomSearchBar';
import { getToken } from '../../../auth/auth';
import axiosInstance from '../../../../config'; 
import CustomButton from '../../../CustomComponents/CustomButton';
import { fetchAuthCodes, getCurrentUserInfo } from './authCodeUtils';
import CustomAlert from '../../../CustomComponents/CustomAlert';

const RoomTypeList = ({ projectId, projectName, onNavigate, userRole }) => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRoomTypes, setFilteredRoomTypes] = useState([]);
  const [validAuthCodes, setValidAuthCodes] = useState([]);
  const [alert, setAlert] = useState({
    isOpen: false,
    message: "",
    severity: "info",
    duration: 3000
  });

  // 获取用户信息
  const { isSuperUser, currentUsername } = getCurrentUserInfo();

  const showAlert = (message, severity = "info", duration = 3000) => {
    setAlert({ isOpen: true, message, severity, duration });
  };

  // 获取授权码
  const loadAuthCodes = useCallback(async () => {
    const token = getToken();
    if (!token) {
      showAlert("No token found, please log in again.", "error");
      return;
    }

    try {
      await fetchAuthCodes({
        token,
        isSuperUser,
        currentUsername,
        onSuccess: (codes) => {
          const formattedCodes = codes.map(code => ({
            ...code,
            label: code.code,
            description: `(${10 - code.configUploadCount} uploads left)`,
            value: code.code
          }));
          // console.log('Auth codes loaded successfully:', formattedCodes);
          setValidAuthCodes(formattedCodes);
        },
        onError: (error) => {
          console.error('Error loading auth codes:', error);
          showAlert(error, "error")
        }
      });
    } catch (error) {
      console.error("Error in loadAuthCodes:", error);
    }
  }, [isSuperUser, currentUsername]);

  const fetchRoomTypes = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) {
        showAlert("No token found, please log in again.", "error");
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
      } else {
        showAlert(`Error fetching room types: ${response.data.errorMsg}`, "error");
      }
    } catch (error) {
      showAlert("Error fetching room types", "error");
      console.error("Error fetching room types:", error);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // 初始化加载
  useEffect(() => {
    fetchRoomTypes();
    loadAuthCodes();
  }, [fetchRoomTypes, loadAuthCodes]);

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
      <CustomAlert
        isOpen={alert.isOpen}
        onClose={() => setAlert(prev => ({ ...prev, isOpen: false }))}
        message={alert.message}
        severity={alert.severity}
        autoHideDuration={alert.duration}
      />
      
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        marginBottom: "10px",
      }}>
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
        validAuthCodes={validAuthCodes}
        refreshAuthCodes={loadAuthCodes}
        existingRoomTypes={roomTypes}
      />
    </div>
  );
};

export default RoomTypeList;
