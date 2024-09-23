import React, { useState, useEffect, useImperativeHandle, forwardRef, useRef } from "react";
import { Alert, AlertTitle } from "@mui/material";
import { Button } from "reactstrap";
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

import controlDeviceImage from '../../../../assets/excel/remote_control_format/control_device.png';
import controlGroupImage from '../../../../assets/excel/remote_control_format/control_group.png';
import controlSceneImage from '../../../../assets/excel/remote_control_format/control_scene.png';
import withOperationImage from '../../../../assets/excel/remote_control_format/with_operation.png';

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
const Step5 = forwardRef(({ splitData, deviceNameToType, registeredDeviceNames, registeredGroupNames, registeredSceneNames, onValidate }, ref) => {
  const [remoteControlErrors, setRemoteControlErrors] = useState(null);
  const [success, setSuccess] = useState(false);
  const [remoteControlData, setRemoteControlData] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showFormatImages, setShowFormatImages] = useState(false);
  const hasValidated = useRef(false);

  const formatImages = {
    'Device Control': controlDeviceImage,
    'Group Control': controlGroupImage,
    'Scene Control': controlSceneImage,
    'With Operation': withOperationImage,
  };

  useEffect(() => {
    if (!splitData || !splitData.remoteControls || !deviceNameToType || hasValidated.current) {
      return;
    }

    const errors = validateRemoteControls(splitData.remoteControls, deviceNameToType, registeredDeviceNames, registeredGroupNames, registeredSceneNames);

    if (errors.length > 0) {
      setRemoteControlErrors(formatErrors(errors));
      setSuccess(false);
      onValidate(false, errors);
      setShowFormatImages(true);
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
      setShowFormatImages(false);
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
              <Button onClick={() => setShowFormatImages(!showFormatImages)} variant="outlined" size="sm" sx={{ mt: 1 }}>
                {showFormatImages ? "Hide Format Images" : "Show Format Images"}
              </Button>
              {showFormatImages && (
                <div style={{ marginTop: "20px" }}>
                  <h5>Correct remote control formats:</h5>
                  {Object.entries(formatImages).map(([controlType, imageSrc]) => (
                    <div key={controlType} style={{ marginBottom: "20px" }}>
                      <h6>{controlType}</h6>
                      <img src={imageSrc} alt={`${controlType} format`} style={{ maxWidth: "100%" }} />
                    </div>
                  ))}
                </div>
              )}
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