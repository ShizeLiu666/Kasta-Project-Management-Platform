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
import {
  renderDevicesTable,
  renderGroupsTable,
  renderScenesTable,
  renderRemoteControlsTable
} from './ConfigTables';
import { getToken } from '../../auth/auth';
import axiosInstance from '../../../config';
import CustomAlert from '../../CustomAlert';
import ComponentCard from '../../AuthCodeManagement/ComponentCard';
import CustomButton from '../../CustomButton';

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
    if (config) {
      console.log('Config:', JSON.stringify(config, null, 2));
      if (config.devices) {
        console.log('Devices:', JSON.stringify(config.devices, null, 2));
      }
    }
  }, [config]);

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
                alignItems="center"
                className="room-config-title"
              >
                <Box display="flex" flexDirection="column">
                  <span style={{ fontSize: '18px', fontWeight: '500', marginRight: '10px' }}>
                    {roomTypeName}
                  </span>
                  {roomDetails && (
                    <span style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
                      Authorization Code: {roomDetails.authorizationCode} | Usage: {roomDetails.count}
                    </span>
                  )}
                </Box>

                <Box display="flex" alignItems="center" justifyContent="flex-end" width="50%">
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
                  <>
                    {config.devices && (
                      <div>
                        {console.log('Rendering devices:', JSON.stringify(config.devices, null, 2))}
                        {renderDevicesTable(processDevices(config.devices))}
                      </div>
                    )}
                    {config.groups && renderGroupsTable(config.groups)}
                    {config.scenes && renderScenesTable(config.scenes)}
                    {config.remoteControls && renderRemoteControlsTable(config.remoteControls)}
                  </>
                )}
              </>
            )}
          </ComponentCard>

          <DeleteRoomConfigModal
            isOpen={deleteModalOpen}
            toggle={() => setDeleteModalOpen(!deleteModalOpen)}
            onDelete={handleDeleteConfig}
          />
        </Col>
      </Row>
    </div>
  );
};

export default RoomConfigList;
