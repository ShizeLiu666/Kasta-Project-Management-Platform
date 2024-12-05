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
import { validateGroups } from "../ExcelProcessor/validation/Groups";
import "./steps.scss"
import GroupsTreeView from './TreeView/GroupsTreeView';
import ReturnToUploadButton from "../../../CustomComponents/ReturnToUploadButton";

// Function to format error messages
const formatErrors = (errors) => {
  if (typeof errors === 'string') {
    return errors.split('KASTA GROUP:')
      .filter(error => error.trim())
      .map(error => error.trim().replace(/^:\s*/, '')); // Remove any remaining colon and spaces
  }
  return errors;
};

// Step3 function component
const Groups = forwardRef(({ 
  splitData, 
  deviceNameToType, 
  onValidate, 
  onReturnToInitialStep,
  jumpToStep  // 新增：接收 jumpToStep prop
}, ref) => {
  const [groupErrors, setGroupErrors] = useState(null);
  const [success, setSuccess] = useState(false);
  const [groupData, setGroupData] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const hasValidated = useRef(false);

  useEffect(() => {
    if (!splitData || !splitData.groups || !deviceNameToType || hasValidated.current) {
      return;
    }

    const { errors } = validateGroups(splitData.groups, deviceNameToType);

    if (errors.length > 0) {
      setGroupErrors(formatErrors(errors));
      setSuccess(false);
      onValidate(false, errors);
    } else {
      // Create an object with group names as keys and device lists as values
      const groupDevices = {};
      splitData.groups.forEach(line => {
        if (line.startsWith('NAME:')) {
          const groupName = line.substring(5).trim();
          groupDevices[groupName] = [];
        } else if (line && !line.startsWith('DEVICE CONTROL')) {
          const lastGroup = Object.keys(groupDevices).pop();
          if (lastGroup) {
            groupDevices[lastGroup].push(line.trim());
          }
        }
      });
      setGroupData(groupDevices);
      setSuccess(true);
      onValidate(true, { groupData: groupDevices });
    }

    hasValidated.current = true;
  }, [splitData, deviceNameToType, onValidate]);

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
    <div className="step step3 mt-5">
      <div className="row justify-content-md-center">
        <div className="col-lg-8" style={{ marginBottom: "20px" }}>
          {groupErrors && (
            <>
              <Alert severity="error" style={{ marginTop: "10px", marginBottom: "10px" }}>
                <AlertTitle>Error</AlertTitle>
                <ul>
                  {groupErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
                <div style={{ marginTop: "10px" }}>
                  Please refer to the <strong>Supported Group Control Formats</strong> below for the correct format.
                </div>
              </Alert>
              
              <ReturnToUploadButton 
                onReturnToInitialStep={onReturnToInitialStep}
                jumpToStep={jumpToStep}
              />
            </>
          )}

          {success && (
            <>
              <Alert severity="success" style={{ marginTop: "10px" }}>
                <AlertTitle>The following groups have been identified:</AlertTitle>
              </Alert>

              <TableContainer component={Paper} style={{ marginTop: "20px" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>Group Name</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Device Control</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(groupData)
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map(([groupName, devices]) => (
                        <TableRow key={groupName}>
                          <TableCell>{groupName}</TableCell>
                          <TableCell>{devices.join(", ")}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>

                <TablePagination
                  component="div"
                  count={Object.keys(groupData).length}
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

          <div style={{ marginTop: "20px" }}>
            <GroupsTreeView />
          </div>
        </div>
      </div>
    </div>
  );
});

export default Groups;
