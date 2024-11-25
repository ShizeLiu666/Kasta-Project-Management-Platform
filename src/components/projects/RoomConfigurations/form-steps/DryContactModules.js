import React, { useState, useEffect, forwardRef, useRef } from "react";
import {
  Alert,
  AlertTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination
} from "@mui/material";
import { validateDryContactModules } from "../ExcelProcessor/validation/DryContactModules";
import "./steps.scss";
import DryContactsTreeView from './TreeView/DryContactsTreeView';

const formatErrors = (errors) => {
  if (typeof errors === 'string') {
    return errors.split('DRY CONTACT MODULE')
      .filter(error => error.trim())
      .map(error => 'DRY CONTACT MODULE' + error.trim())
      .sort();
  }
  return errors.sort();
};

const DryContactModules = forwardRef(({
  splitData,
  deviceNameToType,
  registeredDeviceNames,
  onValidate
}, ref) => {
  const [dryContactErrors, setDryContactErrors] = useState(null);
  const [success, setSuccess] = useState(false);
  const [dryContactData, setDryContactData] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const hasValidated = useRef(false);

  useEffect(() => {
    if (!splitData || !splitData.dryContacts || !deviceNameToType || hasValidated.current) {
      return;
    }

    const errors = validateDryContactModules(splitData.dryContacts, deviceNameToType, registeredDeviceNames);

    if (errors.length > 0) {
      setDryContactErrors(formatErrors(errors));
      setSuccess(false);
      onValidate(false, null);
    } else {
      const dryContactData = {};
      let currentModule = null;

      splitData.dryContacts.forEach(line => {
        if (line.startsWith('NAME:')) {
          currentModule = line.substring(5).trim();
          dryContactData[currentModule] = null;
        } else if (currentModule) {
          dryContactData[currentModule] = line.trim();
        }
      });

      setDryContactData(dryContactData);
      setSuccess(true);
      onValidate(true, { dryContactData });
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
      {dryContactErrors && (
        <Alert severity="error" style={{ marginTop: "10px" }}>
          <AlertTitle>Error</AlertTitle>
          <ul>
            {dryContactErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
          <div style={{ marginTop: "10px" }}>
            Please refer to the <strong>Supported Dry Contact Module Formats</strong> below for the correct format.
          </div>
        </Alert>
      )}

      {success && (
        <>
          <Alert severity="success" style={{ marginTop: "10px" }}>
            <AlertTitle>The following dry contact modules have been identified:</AlertTitle>
          </Alert>

          <TableContainer component={Paper} style={{ marginTop: "20px" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Dry Contact Module Name</strong></TableCell>
                  <TableCell><strong>Action</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(dryContactData)
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(([moduleName, action]) => (
                    <TableRow key={moduleName}>
                      <TableCell>{moduleName}</TableCell>
                      <TableCell>{action}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>

            <TablePagination
              component="div"
              count={Object.keys(dryContactData).length}
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
        <DryContactsTreeView />
      </div>
    </>
  );
});

export default DryContactModules;