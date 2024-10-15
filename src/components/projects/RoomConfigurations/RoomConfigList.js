import React, { useState, useEffect, useCallback } from "react";
import {
  Row,
  Col,
  Button
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
import CustomAlert from '../../CustomAlert';  // 导入 CustomAlert
import ComponentCard from '../../AuthCodeManagement/ComponentCard';

const RoomConfigList = ({ roomTypeName, projectRoomId }) => {
  const [config, setConfig] = useState(null);
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
                <Box display="flex" alignItems="center">
                  <span style={{ fontSize: '18px', fontWeight: '500', marginRight: '10px' }}>
                    {roomTypeName}
                  </span>
                  {config && config !== "{}" && Object.keys(config).length > 0 && !isEditing && (
                    <Button
                      color="secondary"
                      onClick={handleDownloadJson}
                      size="sm"
                      style={{marginTop:"2px", marginLeft:"5px", display: "flex", alignItems: "center"}}
                    >
                      <CloudDownloadIcon style={{ marginRight: "8px" }} />
                      <span style={{ position: "relative", bottom: "1px"}}>Download JSON</span>
                    </Button>
                  )}
                </Box>

                <Box display="flex" alignItems="center">
                  {!isEditing ? (
                    <>
                      <Button
                        color="success"
                        onClick={handleCloudUploadClick}
                        size="sm"
                        style={{ marginRight: "10px", backgroundColor: "#007bff", borderColor: "#007bff" }}
                      >
                        <CloudUploadIcon style={{ marginRight: "8px" }} />
                        <span style={{ position: "relative", top: "1px"}}>Upload / Overwrite</span>
                      </Button>
                      {config && config !== "{}" && Object.keys(config).length > 0 && (
                        <Button
                          color="danger"
                          onClick={() => setDeleteModalOpen(true)}
                          size="sm"
                        >
                          <DeleteForeverIcon style={{ marginRight: "8px" }} />
                          <span style={{ position: "relative", top: "1px"}}>Delete</span>
                        </Button>
                      )}
                    </>
                  ) : (
                    <Button
                      color="secondary"
                      onClick={handleBackClick}
                      size="sm"
                      style={{ marginRight: "10px"}}
                    >
                      <ArrowBackIosIcon style={{ marginRight: "4px" }} />
                      <span style={{ position: "relative", top: "1px"}}>Back</span>
                    </Button>
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
