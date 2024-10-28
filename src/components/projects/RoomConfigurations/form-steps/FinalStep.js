import React, { useState, useImperativeHandle, forwardRef, useMemo } from "react";
import { Alert, AlertTitle, Box } from "@mui/material";
import { Input, FormGroup, Label } from "reactstrap";
import {
  processDevices,
  processGroups,
  processScenes,
  processRemoteControls,
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
  // onValidate,
  submitJson,
  projectRoomId
}, ref) => {
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const processedData = useMemo(() => {
    if (!splitData) return null;

    try {
      resetDeviceNameToType();
      const devicesResult = processDevices(splitData);
      const groupsResult = processGroups(splitData); 
      const scenesResult = processScenes(splitData);
      const remoteControlsResult = processRemoteControls(splitData);

      return {
        ...devicesResult,
        ...groupsResult,
        ...scenesResult,
        ...remoteControlsResult
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

  // useEffect(() => {
  //   if (processedData) {
  //     onValidate(true, processedData);
  //   } else if (error) {
  //     onValidate(false, error);
  //   }
  // }, [processedData, error, onValidate]);

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
        // 上传成功后，可以在这里添加一些成功提示
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
                  rows={20}
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
