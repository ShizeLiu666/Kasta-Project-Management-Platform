import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  Row,
  Col,
  CardTitle,
  CardBody,
  Button
} from "reactstrap";
import { Alert } from "@mui/material";
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
import axiosInstance from '../../config';  // 添加这行

const RoomConfigList = ({ roomTypeName, projectRoomId }) => {
  const [config, setConfig] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    severity: "",
    message: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  const fetchRoomDetail = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) {
        console.error("No token found, please log in again.");
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
        console.error(`Error fetching room details: ${data.errorMsg}`);
      }
    } catch (error) {
      console.error("Error fetching room details:", error);
    }
  }, [projectRoomId]);

  const submitJson = async (jsonResult, isReplace = false) => {
    if (!jsonResult) {
      setAlert({
        severity: "error",
        message: "JSON content is empty",
        open: true,
      });
      return;
    }
    try {
      const token = getToken();
      if (!token) {
        setAlert({
          severity: "error",
          message: "No token found, please log in again.",
          open: true,
        });
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

        setAlert({
          severity: "success",
          message: isReplace
            ? "Configuration replaced successfully."
            : "JSON configuration submitted successfully.",
          open: true,
        });

        fetchRoomDetail();
      } else {
        setAlert({
          severity: "error",
          message: `Failed to submit JSON configuration: ${data.errorMsg}`,
          open: true,
        });
      }

      setTimeout(() => {
        setAlert({ open: false });
      }, 3000);
    } catch (error) {
      setAlert({
        severity: "error",
        message: "An error occurred while submitting JSON",
        open: true,
      });
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
        setAlert({
          severity: "error",
          message: "No token found, please log in again.",
          open: true,
        });
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
        setAlert({
          severity: "success",
          message: "Room configuration deleted successfully.",
          open: true,
        });
        if (document.getElementById("exampleFile")) {
          document.getElementById("exampleFile").value = null;
        }
      } else {
        setAlert({
          severity: "error",
          message: `Error deleting room configuration: ${data.errorMsg}`,
          open: true,
        });
      }

      setTimeout(() => {
        setAlert({ open: false });
      }, 3000);
    } catch (error) {
      setAlert({
        severity: "error",
        message: "An error occurred while deleting the room configuration.",
        open: true,
      });
      setTimeout(() => {
        setAlert({ open: false });
      }, 3000);
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
    <Row>
      {alert.open && (
        <Alert
          severity={alert.severity}
          style={{
            position: "fixed",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
          }}
        >
          {alert.message}
        </Alert>
      )}

      <Col>
        <Card>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            className="border-bottom p-3 mb-0"
          >
            <Box display="flex" alignItems="center">
              <CardTitle tag="h5" style={{ marginBottom: 0, marginRight: "10px" }}>
                {roomTypeName}
              </CardTitle>
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

          <CardBody>
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
          </CardBody>
        </Card>

        <DeleteRoomConfigModal
          isOpen={deleteModalOpen}
          toggle={() => setDeleteModalOpen(!deleteModalOpen)}
          onDelete={handleDeleteConfig}
        />
      </Col>
    </Row>
  );
};

export default RoomConfigList;