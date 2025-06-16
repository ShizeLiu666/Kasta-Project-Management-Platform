import React, { useEffect, useState, useCallback } from "react";
import RoomElement from "./RoomElement";
import EditRoomTypeModal from "./EditRoomTypeModal";
import DeleteRoomTypeModal from "./DeleteRoomTypeModal";
import CreateRoomTypeModal from "./CreateRoomTypeModal";
import { CircularProgress, Box, Typography, TablePagination } from "@mui/material";
import FolderIcon from '@mui/icons-material/Folder';
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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
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
    const filtered = roomTypes.filter((roomType) =>
      roomType.name.toLowerCase().includes(searchValue.toLowerCase())
    );
    setPage(0); // 重置到第一页
    return filtered;
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // 获取当前页的数据
  const getCurrentPageData = () => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredRoomTypes.slice(startIndex, endIndex);
  };

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="300px"
        flexDirection="column"
        gap={2}
      >
        <CircularProgress size={40} />
        <Typography variant="body2" color="text.secondary">
          Loading room types...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: '0 4px' }}>
      <CustomAlert
        isOpen={alert.isOpen}
        onClose={() => setAlert(prev => ({ ...prev, isOpen: false }))}
        message={alert.message}
        severity={alert.severity}
        autoHideDuration={alert.duration}
      />
      
      <Box sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        marginBottom: "24px",
        padding: "16px 20px",
        backgroundColor: "#fafafa",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
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
      </Box>

      {filteredRoomTypes.length === 0 ? (
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          justifyContent="center"
          minHeight="300px"
          padding={4}
          sx={{
            backgroundColor: "#fafafa",
            borderRadius: "12px",
            border: "2px dashed #e0e0e0"
          }}
        >
          <FolderIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No room types found
          </Typography>
          <Typography variant="body2" color="text.disabled" textAlign="center">
            {searchTerm ? 'Try adjusting your search criteria' : 'Create your first room type to get started'}
          </Typography>
        </Box>
      ) : (
        <>
          <Box sx={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            minHeight: "400px" // 保证分页器位置稳定
          }}>
            {getCurrentPageData().map((roomType) => (
              <RoomElement
                key={roomType.projectRoomId}
                roomType={roomType}
                onDelete={() => handleDeleteClick(roomType)}
                onEdit={() => handleEditRoomType(roomType)}
                onClick={() => handleRoomTypeClick(roomType)}
                userRole={userRole}
              />
            ))}
          </Box>
          
          {/* 分页器 */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            mt: 3,
            backgroundColor: "#fafafa",
            borderRadius: "8px",
            border: "1px solid #e0e0e0"
          }}>
            <TablePagination
              component="div"
              count={filteredRoomTypes.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10]}
              labelRowsPerPage="Items per page"
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} of ${count}`
              }
              sx={{
                '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                  margin: 0,
                },
                '& .MuiButtonBase-root': {
                  '& .MuiTouchRipple-root': {
                    display: 'none'
                  }
                }
              }}
            />
          </Box>
        </>
      )}
      
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
    </Box>
  );
};

export default RoomTypeList;
