import React, { useState, useEffect, useCallback } from "react";
import {
  Row,
  Col,
} from "reactstrap";
import Box from "@mui/material/Box";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteRoomConfigModal from "./DeleteRoomConfigModal";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Steps from "./form-steps/Steps";
import { renderConfigTables } from './ConfigTables';
import { getToken } from '../../auth';
import axiosInstance from '../../../config';
import CustomAlert from '../../CustomComponents/CustomAlert';
import ComponentCard from '../../CustomComponents/ComponentCard';
import CustomButton from '../../CustomComponents/CustomButton';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import UpdateAuthCodeModal from './UpdateAuthCodeModal';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ConfigurationGuidelines from './guidelines/ConfigurationGuidelines';

const RoomConfigList = ({ roomTypeName, projectRoomId, userRole }) => {
  const [config, setConfig] = useState(null);
  const [roomDetails, setRoomDetails] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [alert, setAlert] = useState({
    isOpen: false,
    message: "",
    severity: "info",
    duration: 3000
  });
  const [isEditing, setIsEditing] = useState(false);
  const [updateAuthCodeModalOpen, setUpdateAuthCodeModalOpen] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(false);

  const showAlert = (message, severity, duration = 3000) => {
    setAlert({ isOpen: true, message, severity, duration });
  };

  const fetchRoomDetail = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) {
        showAlert("No token found, please log in again.", "error");
        return;
      }

      const response = await axiosInstance.get(`/project-rooms/detail/${projectRoomId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;

      if (data.success && data.data) {
        setRoomDetails(data.data);
        let parsedConfig;
        if (typeof data.data.config === 'string') {
          try {
            parsedConfig = JSON.parse(data.data.config);
          } catch (e) {
            parsedConfig = data.data.config;
          }
        } else {
          parsedConfig = data.data.config;
        }

        setConfig(parsedConfig);
      } else {
        showAlert(`Error fetching room details: ${data.errorMsg}`, "error");
      }
    } catch (error) {
      showAlert("Error fetching room details", "error");
      console.error("Error fetching room details:", error);
    }
  }, [projectRoomId]);

  const submitJson = async (jsonResult, isReplace = false) => {
    if (!jsonResult) {
      showAlert("JSON content is empty", "error");
      return;
    }
    try {
      const token = getToken();
      if (!token) {
        showAlert("No token found, please log in again.", "error");
        return;
      }

      const response = await axiosInstance.post(`/project-rooms/${projectRoomId}/config`, jsonResult, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;
      if (data.success) {
        setIsEditing(false);

        showAlert(
          isReplace
            ? "Configuration replaced successfully."
            : "JSON configuration submitted successfully.",
          "success"
        );

        fetchRoomDetail();
      } else {
        showAlert(`Failed to submit JSON configuration: ${data.errorMsg}`, "error");
      }
    } catch (error) {
      showAlert("An error occurred while submitting JSON", "error");
    }
  };

  useEffect(() => {
    fetchRoomDetail();
  }, [projectRoomId, fetchRoomDetail]);

  useEffect(() => {
    if (roomDetails && roomDetails.count === 9 && userRole === 'OWNER') {
      showAlert(
        "You have only one use remaining. Please prepare to update your authorization code.",
        "warning",
        null  // 设置为 null 使得警告不会自动消失
      );
    }
  }, [roomDetails, userRole]);

  // useEffect(() => {
  //   if (config) {
  //     console.log('Config:', JSON.stringify(config, null, 2));
  //     if (config.devices) {
  //       console.log('Devices:', JSON.stringify(config.devices, null, 2));
  //     }
  //   }
  // }, [config]);

  const processDevices = (devices) => {
    if (Array.isArray(devices)) {
      return devices;
    }
    if (typeof devices === 'object' && devices !== null) {
      return Object.entries(devices).map(([key, value]) => ({
        deviceName: key,
        ...value
      }));
    }
    return [];
  };

  const handleCloudUploadClick = () => {
    setIsEditing(true);
  };

  const handleBackClick = () => {
    setIsEditing(false);
  };

  const handleDeleteConfig = async () => {
    try {
      const token = getToken();
      if (!token) {
        showAlert("No token found, please log in again.", "error");
        return;
      }

      const response = await axiosInstance.post(`/project-rooms/clear-config/${projectRoomId}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;
      if (data.success) {
        setConfig(null);
        showAlert("Room configuration deleted successfully.", "success");
        if (document.getElementById("exampleFile")) {
          document.getElementById("exampleFile").value = null;
        }
      } else {
        showAlert(`Error deleting room configuration: ${data.errorMsg}`, "error");
      }
    } catch (error) {
      showAlert("An error occurred while deleting the room configuration.", "error");
    }

    setDeleteModalOpen(false);
  };

  const handleDownloadJson = () => {
    if (config) {
      const jsonString = JSON.stringify(config, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${roomTypeName}_configuration.json`;
      link.click();
    }
  };

  const handleUpdateAuthCode = () => {
    setUpdateAuthCodeModalOpen(true);
  };

  const handleUpdateAuthCodeSuccess = () => {
    fetchRoomDetail();
  };

  return (
    <div>
      <CustomAlert
        isOpen={alert.isOpen}
        onClose={() => setAlert(prev => ({ ...prev, isOpen: false }))}
        message={alert.message}
        severity={alert.severity}
        autoHideDuration={alert.duration}
      />
      <Row>
        <Col>
          <ComponentCard
            title={
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="flex-start"
                className="room-config-title"
              >
                <Box display="flex" flexDirection="column" style={{ flex: 1 }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between" style={{ width: '50%' }}>
                    <span style={{ fontSize: '18px', fontWeight: '500' }}>
                      {roomTypeName}
                    </span>
                  </Box>
                  {roomDetails && userRole === 'OWNER' && (
                    <Box display="flex" alignItems="center" style={{ marginTop: '5px' }}>
                      <span style={{ fontSize: '14px', color: '#666' }}>
                        Authorization Code: {roomDetails.authorizationCode} | Remaining Uses: {10 - roomDetails.count}
                      </span>
                      <Tooltip title="Configuration Guidelines">
                        <IconButton
                          onClick={() => setShowGuidelines(true)}
                          size="medium"
                          sx={{
                            color: '#fbcd0b',
                            ml: 1,
                            padding: '4px',
                            '&:hover': {
                              color: '#e3b900',
                            },
                          }}
                        >
                          <HelpOutlineIcon fontSize="medium"/>
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}
                </Box>

                <Box display="flex" alignItems="center">
                  {!isEditing ? (
                    <>
                      {config && config !== "{}" && Object.keys(config).length > 0 && (
                        <CustomButton
                          onClick={handleDownloadJson}
                          icon={<CloudDownloadIcon />}
                          color="#6c757d"
                          allowedRoles={['OWNER']}
                          userRole={userRole}
                          style={{ marginRight: "10px" }}
                        >
                          Download JSON
                        </CustomButton>
                      )}
                      {roomDetails && roomDetails.count < 10 && (
                        <CustomButton
                          onClick={handleCloudUploadClick}
                          icon={<CloudUploadIcon />}
                          color="#007bff"
                          style={{ marginRight: "10px" }}
                          allowedRoles={['OWNER']}
                          userRole={userRole}
                        >
                          Upload / Overwrite
                        </CustomButton>
                      )}
                      {roomDetails && roomDetails.count === 10 && (
                        <CustomButton
                          onClick={handleUpdateAuthCode}
                          icon={<UpgradeIcon />}
                          color="#fbcd0b"
                          style={{ marginRight: "10px" }}
                          allowedRoles={['OWNER']}
                          userRole={userRole}
                        >
                          Update Auth Code
                        </CustomButton>
                      )}
                      {config && config !== "{}" && Object.keys(config).length > 0 && (
                        <CustomButton
                          onClick={() => setDeleteModalOpen(true)}
                          icon={<DeleteForeverIcon />}
                          color="#dc3545"
                          allowedRoles={['OWNER']}
                          userRole={userRole}
                        >
                          Delete
                        </CustomButton>
                      )}
                    </>
                  ) : (
                    <CustomButton
                      onClick={handleBackClick}
                      icon={<ArrowBackIosIcon />}
                      color="#6c757d"
                    >
                      Back
                    </CustomButton>
                  )}
                </Box>
              </Box>
            }
          >
            {isEditing ? (
              <Steps
                projectRoomId={projectRoomId}
                submitJson={submitJson}
              />
            ) : (
              <>
                {config && config !== "{}" && (
                  renderConfigTables(config)
                )}
              </>
            )}
          </ComponentCard>

          <DeleteRoomConfigModal
            isOpen={deleteModalOpen}
            toggle={() => setDeleteModalOpen(!deleteModalOpen)}
            onDelete={handleDeleteConfig}
          />

          <UpdateAuthCodeModal
            isOpen={updateAuthCodeModalOpen}
            toggle={() => setUpdateAuthCodeModalOpen(false)}
            projectRoomId={projectRoomId}
            onSuccess={handleUpdateAuthCodeSuccess}
          />

          <ConfigurationGuidelines
            open={showGuidelines}
            onClose={() => setShowGuidelines(false)}
          />
        </Col>
      </Row>
    </div>
  );
};

export default RoomConfigList;
