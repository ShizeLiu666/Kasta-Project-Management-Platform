import React, { useState, useEffect, forwardRef, useRef } from "react";
import { Alert, AlertTitle } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import { validateInputModules } from "../ExcelProcessor/validation/InputModules";
import "./steps.scss";
import InputModulesTreeView from './TreeView/InputModulesTreeView';

const formatErrors = (errors) => {
  if (typeof errors === 'string') {
    return errors.split('INPUT MODULE')
      .filter(error => error.trim())
      .map(error => 'INPUT MODULE' + error.trim())
      .sort();
  }
  return errors.sort();
};

const InputModules = forwardRef(({
  splitData,
  deviceNameToType,
  registeredDeviceNames,
  onValidate
}, ref) => {
  const [inputModuleErrors, setInputModuleErrors] = useState(null);
  const [success, setSuccess] = useState(false);
  const [inputModuleData, setInputModuleData] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const hasValidated = useRef(false);

  useEffect(() => {
    if (!splitData || !splitData.inputs || !deviceNameToType || hasValidated.current) {
      return;
    }

    const errors = validateInputModules(splitData.inputs, deviceNameToType, registeredDeviceNames);

    if (errors.length > 0) {
      const formattedErrors = formatErrors(errors);
      setInputModuleErrors(formattedErrors);
      setSuccess(false);
      onValidate(false, formattedErrors);
    } else {
      const inputModuleData = {};
      let currentModule = null;

      splitData.inputs.forEach(line => {
        if (line.startsWith('NAME:')) {
          currentModule = line.substring(5).trim();
          inputModuleData[currentModule] = [];
        } else if (currentModule && /^\d+:/.test(line)) {
          inputModuleData[currentModule].push(line.trim());
        }
      });

      setInputModuleData(inputModuleData);
      setSuccess(true);
      onValidate(true, { inputModuleData });
    }

    hasValidated.current = true;
  }, [splitData, deviceNameToType, registeredDeviceNames, onValidate]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      {inputModuleErrors && (
        <Alert severity="error" style={{ marginTop: "10px" }}>
          <AlertTitle>Error</AlertTitle>
          <ul>
            {inputModuleErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
          <div style={{ marginTop: "10px" }}>
            Please refer to the <strong>Supported Input Module Formats</strong> below for the correct format.
          </div>
        </Alert>
      )}

      {success && (
        <>
          <Alert severity="success" style={{ marginTop: "10px" }}>
            <AlertTitle>The following input modules have been identified:</AlertTitle>
          </Alert>

          <TableContainer component={Paper} style={{ marginTop: "20px" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Input Module Name</strong></TableCell>
                  <TableCell><strong>Channel</strong></TableCell>
                  <TableCell><strong>Action</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(inputModuleData)
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(([moduleName, channels]) => (
                    channels.map((channel, index) => {
                      const [channelNumber, action] = channel.split(':').map(part => part.trim());
                      
                      return (
                        <TableRow key={`${moduleName}-${index}`}>
                          {index === 0 && (
                            <TableCell rowSpan={channels.length}>
                              {moduleName}
                            </TableCell>
                          )}
                          <TableCell>{channelNumber}</TableCell>
                          <TableCell>{action}</TableCell>
                        </TableRow>
                      );
                    })
                  ))}
              </TableBody>
            </Table>

            <TablePagination
              component="div"
              count={Object.keys(inputModuleData).length}
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

      <div style={{ marginTop: "20px" }}>
        <InputModulesTreeView />
      </div>
    </>
  );
});

export default InputModules;