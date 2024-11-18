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
import { validateOutputModules } from "../ExcelProcessor/validation/OutputModules";
import "./steps.scss";
import OutputModulesTreeView from './TreeView/OutputModulesTreeView';

const formatErrors = (errors) => {
  if (typeof errors === 'string') {
    return errors.split('OUTPUT MODULE')
      .filter(error => error.trim())
      .map(error => 'OUTPUT MODULE' + error.trim())
      .sort();
  }
  return errors.sort();
};

const OutputModules = forwardRef(({
  splitData,
  deviceNameToType,
  registeredDeviceNames,
  onValidate
}, ref) => {
  const [outputModuleErrors, setOutputModuleErrors] = useState(null);
  const [success, setSuccess] = useState(false);
  const [outputModuleData, setOutputModuleData] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const hasValidated = useRef(false);

  useEffect(() => {
    if (!splitData || !splitData.outputs || !deviceNameToType || hasValidated.current) {
      return;
    }

    const errors = validateOutputModules(splitData.outputs, deviceNameToType, registeredDeviceNames);

    if (errors.length > 0) {
      setOutputModuleErrors(formatErrors(errors));
      setSuccess(false);
      onValidate(false, null);
    } else {
      const outputModuleData = {};
      let currentModule = null;

      splitData.outputs.forEach(line => {
        if (line.startsWith('NAME:')) {
          currentModule = line.substring(5).trim();
          outputModuleData[currentModule] = [];
        } else if (currentModule && /^\d+:/.test(line)) {
          outputModuleData[currentModule].push(line.trim());
        }
      });

      setOutputModuleData(outputModuleData);
      setSuccess(true);
      onValidate(true, { outputModuleData });
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

  const resetValidation = () => {
    hasValidated.current = false;
  };

  useImperativeHandle(ref, () => ({
    isValidated: () => success,
    resetValidation
  }));

  return (
    <div className="step outputModules mt-5">
      <div className="row justify-content-md-center">
        <div className="col-lg-8" style={{ marginBottom: "20px" }}>
          {outputModuleErrors && (
            <Alert severity="error" style={{ marginTop: "10px" }}>
              <AlertTitle>Error</AlertTitle>
              <ul>
                {outputModuleErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
              <div style={{ marginTop: "10px" }}>
                Please refer to the <strong>Supported Output Module Formats</strong> below for the correct format.
              </div>
            </Alert>
          )}

          {success && (
            <>
              <Alert severity="success" style={{ marginTop: "10px" }}>
                <AlertTitle>The following output modules have been identified:</AlertTitle>
              </Alert>

              <TableContainer component={Paper} style={{ marginTop: "20px" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Output Module Name</strong></TableCell>
                      <TableCell><strong>Channel</strong></TableCell>
                      <TableCell><strong>Output Name</strong></TableCell>
                      <TableCell><strong>Action</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(outputModuleData)
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map(([moduleName, channels]) => (
                        channels.map((channel, index) => {
                          const [channelNumber, config] = channel.split(':');
                          const [outputName, action] = config.trim().split(' - ');
                          
                          return (
                            <TableRow key={`${moduleName}-${index}`}>
                              {index === 0 && (
                                <TableCell rowSpan={channels.length}>
                                  {moduleName}
                                </TableCell>
                              )}
                              <TableCell>{channelNumber}</TableCell>
                              <TableCell>{outputName.trim()}</TableCell>
                              <TableCell>{action ? action.trim() : 'NORMAL'}</TableCell>
                            </TableRow>
                          );
                        })
                      ))}
                  </TableBody>
                </Table>

                <TablePagination
                  component="div"
                  count={Object.keys(outputModuleData).length}
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
            <OutputModulesTreeView />
          </div>
        </div>
      </div>
    </div>
  );
});

export default OutputModules;
