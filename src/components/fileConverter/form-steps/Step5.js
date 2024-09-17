import React, { useState, useEffect, useImperativeHandle, forwardRef, useRef } from "react";
import { Alert, AlertTitle } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import { validateRemoteControls } from "../../projects/RoomConfigurations/ExcelProcessor/validation/RemoteControls";
import "./steps.scss"

// 格式化错误信息的函数
const formatErrors = (errors) => {
  if (typeof errors === 'string') {
    return errors.split('KASTA REMOTE CONTROL:')
      .filter(error => error.trim())
      .map(error => error.trim().replace(/^:\s*/, '')); // 去掉可能残留的冒号和空格
  }
  return errors;
};

// Step5 function component
const Step5 = forwardRef(({ splitData, deviceNameToType, registeredDeviceNames, registeredGroupNames, registeredSceneNames, onValidate }, ref) => {
  const [remoteControlErrors, setRemoteControlErrors] = useState(null);
  const [success, setSuccess] = useState(false);
  const [remoteControlData, setRemoteControlData] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const hasValidated = useRef(false);

  useEffect(() => {
    if (!splitData || !splitData.remoteControls || !deviceNameToType || hasValidated.current) {
      return;
    }

    const errors = validateRemoteControls(splitData.remoteControls, deviceNameToType, registeredDeviceNames, registeredGroupNames, registeredSceneNames);

    if (errors.length > 0) {
      setRemoteControlErrors(formatErrors(errors));
      setSuccess(false);
      onValidate(false, errors);
    } else {
      const remoteControlData = {};
      let currentRemoteControl = null;

      splitData.remoteControls.forEach(line => {
        if (line.startsWith('NAME:')) {
          currentRemoteControl = line.substring(5).trim();
          remoteControlData[currentRemoteControl] = [];
        } else if (currentRemoteControl && /^\d+:/.test(line)) {
          remoteControlData[currentRemoteControl].push(line.trim());
        }
      });

      console.log("Generated remoteControlData:", remoteControlData);
      setRemoteControlData(remoteControlData);
      setSuccess(true);
      onValidate(true, { remoteControlData });
    }

    hasValidated.current = true;
  }, [splitData, deviceNameToType, registeredDeviceNames, registeredGroupNames, registeredSceneNames, onValidate]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const resetValidation = () => {
    hasValidated.current = false;
  };

  useImperativeHandle(ref, () => ({
    isValidated: () => success,
    resetValidation
  }));

  return (
    <div className="step step5 mt-5">
      <div className="row justify-content-md-center">
        <div className="col-lg-8" style={{ marginBottom: "20px" }}>
          {remoteControlErrors && (
            <Alert severity="error" style={{ marginTop: "10px" }}>
              <AlertTitle>Error</AlertTitle>
              <ul>
                {remoteControlErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </Alert>
          )}

          {success && (
            <>
              <Alert severity="success" style={{ marginTop: "10px" }}>
                <AlertTitle>以下遥控设备已被识别：</AlertTitle>
              </Alert>

              <TableContainer component={Paper} style={{ marginTop: "20px" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>遥控设备名称</strong></TableCell>
                      <TableCell><strong>按键</strong></TableCell>
                      <TableCell><strong>控制内容</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(remoteControlData)
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map(([remoteControlName, controls]) => (
                        controls.map((control, index) => (
                          <TableRow key={`${remoteControlName}-${index}`}>
                            {index === 0 && (
                              <TableCell rowSpan={controls.length}>
                                {remoteControlName}
                              </TableCell>
                            )}
                            <TableCell>{control.split(':')[0]}</TableCell>
                            <TableCell>{control.split(':')[1].trim()}</TableCell>
                          </TableRow>
                        ))
                      ))}
                  </TableBody>
                </Table>

                <TablePagination
                  component="div"
                  count={Object.values(remoteControlData).flat().length}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[5, 10, 25]}
                  style={{
                    alignItems: "center",
                    display: "flex",
                    margin: "10px 0",
                  }}
                />
              </TableContainer>
            </>
          )}
        </div>
      </div>
    </div>
  );
});

export default Step5;