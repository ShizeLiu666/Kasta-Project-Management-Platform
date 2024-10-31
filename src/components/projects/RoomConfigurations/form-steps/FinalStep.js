import React, { useState, useImperativeHandle, forwardRef, useMemo } from "react";
import { Alert, AlertTitle, Box } from "@mui/material";
import { Input, FormGroup, Label } from "reactstrap";
import {
  processDevices,
  processGroups,
  processScenes,
  processRemoteControls,
  processVirtualContacts,
  resetDeviceNameToType
} from "../ExcelProcessor/ExcelProcessor";
import CustomButton from '../../../CustomButton';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const Step6 = forwardRef(({
  splitData,
  deviceData,
  groupData,
  sceneData,
  remoteControlData,
  submitJson,
  projectRoomId
}, ref) => {
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const processedData = useMemo(() => {
    if (!splitData) return null;

    try {
      resetDeviceNameToType();
      const devicesResult = processDevices(splitData.devices);
      const groupsResult = processGroups(splitData.groups);
      const scenesResult = processScenes(splitData.scenes);
      const remoteControlsResult = processRemoteControls(
        splitData.remoteControls, 
        splitData.remoteParameters
      );
      const virtualContactsResult = processVirtualContacts(splitData.outputs);

      return {
        devices: devicesResult.devices,
        groups: groupsResult.groups,
        scenes: scenesResult.scenes,
        remoteControls: remoteControlsResult.remoteControls,
        outputs: virtualContactsResult.outputs
      };
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, [splitData]);

  const jsonResult = useMemo(() => {
    return processedData ? JSON.stringify(processedData, null, 2) : "";
  }, [processedData]);

  const success = Boolean(jsonResult);

  const handleDownloadJson = () => {
    if (jsonResult) {
      const blob = new Blob([jsonResult], { type: "application/json" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "room_configuration.json";
      link.click();
    }
  };

  const handleUploadConfig = async () => {
    if (jsonResult) {
      setIsUploading(true);
      try {
        await submitJson(jsonResult);
      } catch (err) {
        setError("Failed to upload configuration: " + err.message);
      } finally {
        setIsUploading(false);
      }
    } else {
      setError("No JSON content to upload");
    }
  };

  useImperativeHandle(ref, () => ({
    isValidated: () => success
  }));

  return (
    <div className="step step6 mt-5">
      <div className="row justify-content-md-center">
        <div className="col-lg-8" style={{ marginBottom: "20px" }}>
          {error && (
            <Alert severity="error" style={{ marginTop: "10px" }}>
              <AlertTitle>Error</AlertTitle>
              {error}
            </Alert>
          )}

          {success && (
            <>
              <FormGroup>
                <Label for="jsonTextArea">JSON Result</Label>
                <Input
                  id="jsonTextArea"
                  type="textarea"
                  value={jsonResult}
                  readOnly
                  rows={30}
                  style={{ fontFamily: "monospace" }}
                />
              </FormGroup>

              <Box mt={2} display="flex" justifyContent="space-between">
                <CustomButton
                  onClick={handleDownloadJson}
                  disabled={!jsonResult}
                  icon={<FileDownloadOutlinedIcon />}
                  color="#6c757d"
                >
                  Download JSON File
                </CustomButton>
                <CustomButton
                  onClick={handleUploadConfig}
                  disabled={isUploading}
                  icon={<CloudUploadIcon />}
                  color="#fbcd0b"
                >
                  Upload Configuration
                </CustomButton>
              </Box>
            </>
          )}
        </div>
      </div>
    </div>
  );
});

export default Step6;
