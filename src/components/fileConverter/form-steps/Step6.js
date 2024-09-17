import React, { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { Alert, AlertTitle, Button, Box } from "@mui/material";
import { Input, FormGroup, Label } from "reactstrap";
import { splitJsonFile } from "../../projects/RoomConfigurations/ExcelProcessor/ExcelProcessor";

const Step6 = forwardRef(({ splitData, deviceData, groupData, sceneData, remoteControlData, onValidate }, ref) => {
  const [jsonResult, setJsonResult] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (splitData) {
      try {
        // 创建一个包含所有数据的对象
        const combinedData = {
          devices: splitData.devices,
          groups: splitData.groups,
          scenes: splitData.scenes,
          remoteControls: splitData.remoteControls,
          ...deviceData,
          ...groupData,
          ...sceneData,
          ...remoteControlData
        };

        // 使用 splitJsonFile 函数处理组合的数据
        const result = splitJsonFile(combinedData);
        const formattedResult = JSON.stringify(result, null, 2);
        setJsonResult(formattedResult);
        setSuccess(true);
        onValidate(true, result);
      } catch (err) {
        setError(err.message);
        setSuccess(false);
        onValidate(false, err.message);
      }
    }
  }, [splitData, deviceData, groupData, sceneData, remoteControlData, onValidate]);

  const handleDownloadJson = () => {
    if (jsonResult) {
      const blob = new Blob([jsonResult], { type: "application/json" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "room_configuration.json";
      link.click();
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
              <AlertTitle>错误</AlertTitle>
              {error}
            </Alert>
          )}

          {success && (
            <>
              <Alert severity="success" style={{ marginTop: "10px" }}>
                <AlertTitle>Excel 文件已成功转换为 JSON</AlertTitle>
              </Alert>

              <FormGroup>
                <Label for="jsonTextArea">JSON 结果</Label>
                <Input
                  id="jsonTextArea"
                  type="textarea"
                  value={jsonResult}
                  readOnly
                  rows={20}
                  style={{ fontFamily: "monospace" }}
                />
              </FormGroup>

              <Box mt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleDownloadJson}
                  disabled={!jsonResult}
                >
                  下载 JSON 文件
                </Button>
              </Box>
            </>
          )}
        </div>
      </div>
    </div>
  );
});

export default Step6;