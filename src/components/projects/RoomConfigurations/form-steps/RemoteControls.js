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
import { validateRemoteControls } from "../ExcelProcessor/validation/RemoteControls";
import "./steps.scss"

import RemoteControlTreeView from './TreeView/RemoteControlsTreeView';

// Format error messages function
const formatErrors = (errors) => {
  if (typeof errors === 'string') {
    return errors.split('Remote Control')
      .filter(error => error.trim())
      .map(error => 'Remote Control' + error.trim())
      .sort();
  }
  return errors.sort();
};

// Step5 function component
const RemoteControls = forwardRef(({ splitData, deviceNameToType, registeredDeviceNames, registeredGroupNames, registeredSceneNames, onValidate }, ref) => {
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
              <div style={{ marginTop: "10px" }}>
                Please refer to the <strong>Supported Remote Control Formats</strong> below for the correct format.
              </div>
            </Alert>
          )}

          {success && (
            <>
              <Alert severity="success" style={{ marginTop: "10px" }}>
                <AlertTitle>The following remote controls have been identified:</AlertTitle>
              </Alert>

              <TableContainer component={Paper} style={{ marginTop: "20px" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Remote Control Name</strong></TableCell>
                      <TableCell><strong>Button</strong></TableCell>
                      <TableCell><strong>Control Content</strong></TableCell>
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
                  count={Object.keys(remoteControlData).length}  // 改为只计算 Remote Control Name 的数量
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[5, 10]}
                  style={{
                    alignItems: "center",
                    display: "flex",
                    margin: "10px 0",
                  }}
                />
              </TableContainer>
            </>
          )}

          {/* 添加新的 RemoteControlTreeView 组件 */}
          <div style={{ marginTop: "20px" }}>
            <RemoteControlTreeView />
          </div>
        </div>
      </div>
    </div>
  );
});

export default RemoteControls;
