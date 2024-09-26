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
import { validateDevices } from "../ExcelProcessor/validation/Devices";
import "./steps.scss"

// 导入设备类型格式图片
import deviceTypesFormatImage from '../../../../assets/excel/device_format/device_types.png';

// 格式化错误信息的函数
const formatErrors = (errors) => {
  if (typeof errors === 'string') {
    return errors.split('KASTA DEVICE:')
      .filter(error => error.trim())
      .map(error => error.trim().replace(/^:\s*/, '')); // 去掉可能残留的冒号和空格
  }
  return errors;
};

// Step2 function component
const Step2 = forwardRef(({ splitData, onValidate }, ref) => {
  const [deviceErrors, setDeviceErrors] = useState(null);
  const [success, setSuccess] = useState(false);
  const [deviceNameToType, setDeviceNameToType] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showFormatImage, setShowFormatImage] = useState(false);
  const hasValidated = useRef(false);

  useEffect(() => {
    if (!splitData || !splitData.devices || hasValidated.current) {
      return;
    }

    const { errors: deviceErrors, deviceNameToType } = validateDevices(splitData.devices);

    if (deviceErrors.length > 0) {
      setDeviceErrors(formatErrors(deviceErrors));
      setSuccess(false);
      onValidate(false, deviceErrors);
      setShowFormatImage(true);
    } else {
      setDeviceNameToType(deviceNameToType);
      setSuccess(true);
      onValidate(true, { deviceNameToType, groupData: splitData.groups });
      setShowFormatImage(false);
    }

    hasValidated.current = true;
  }, [splitData, onValidate]);

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
    <div className="step step2 mt-5">
      <div className="row justify-content-md-center">
        <div className="col-lg-8" style={{ marginBottom: "20px" }}>
          {deviceErrors && (
            <Alert severity="error" style={{ marginTop: "10px" }}>
              <AlertTitle>Error</AlertTitle>
              <ul>
                {deviceErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
              <Button onClick={() => setShowFormatImage(!showFormatImage)} variant="outlined" size="sm" sx={{ mt: 1 }}>
                {showFormatImage ? "Hide Device List" : "Show Supported Device List"}
              </Button>
              {showFormatImage && (
                <div style={{ marginTop: "20px" }}>
                  <h5>Currently Supported Device Types and Models:</h5>
                  <img src={deviceTypesFormatImage} alt="Supported device types and models" style={{ maxWidth: "100%" }} />
                </div>
              )}
            </Alert>
          )}

          {success && (
            <>
              <Alert severity="success" style={{ marginTop: "10px" }}>
                <AlertTitle>The following devices have been identified:</AlertTitle>
              </Alert>

              <TableContainer component={Paper} style={{ marginTop: "20px" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>Device Name</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Device Type</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(deviceNameToType)
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map(([deviceName, deviceType]) => (
                        <TableRow key={deviceName}>
                          <TableCell>{deviceName}</TableCell>
                          <TableCell>{deviceType}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>

                <TablePagination
                  component="div"
                  count={Object.keys(deviceNameToType).length}
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

export default Step2;