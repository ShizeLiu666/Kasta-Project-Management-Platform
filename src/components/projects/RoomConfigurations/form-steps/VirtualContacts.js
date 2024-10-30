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
import { validateVirtualContacts } from "../ExcelProcessor/validation/VirtualContacts";
import "./steps.scss";
import VirtualContactsTreeView from './TreeView/VirtualContactsTreeView';

// 格式化错误消息
const formatErrors = (errors) => {
  if (typeof errors === 'string') {
    return errors.split('VIRTUAL DRY CONTACT')
      .filter(error => error.trim())
      .map(error => 'VIRTUAL DRY CONTACT' + error.trim())
      .sort();
  }
  return errors.sort();
};

const VirtualContacts = forwardRef(({
  splitData,
  deviceNameToType,
  registeredDeviceNames,
  onValidate
}, ref) => {
  const [virtualContactErrors, setVirtualContactErrors] = useState(null);
  const [success, setSuccess] = useState(false);
  const [virtualContactData, setVirtualContactData] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const hasValidated = useRef(false);

  useEffect(() => {
    if (!splitData || !splitData.outputs || !deviceNameToType || hasValidated.current) {
      return;
    }

    const errors = validateVirtualContacts(splitData.outputs, deviceNameToType, registeredDeviceNames);

    if (errors.length > 0) {
      setVirtualContactErrors(formatErrors(errors));
      setSuccess(false);
      onValidate(false, null);
    } else {
      const virtualContactData = {};
      let currentContact = null;

      splitData.outputs.forEach(line => {
        if (line.startsWith('NAME:')) {
          currentContact = line.substring(5).trim();
          virtualContactData[currentContact] = [];
        } else if (currentContact && /^\d+:/.test(line)) {
          virtualContactData[currentContact].push(line.trim());
        }
      });

      setVirtualContactData(virtualContactData);
      setSuccess(true);
      onValidate(true, { virtualContactData });
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
    <div className="step virtualContacts mt-5">
      <div className="row justify-content-md-center">
        <div className="col-lg-8" style={{ marginBottom: "20px" }}>
          {virtualContactErrors && (
            <Alert severity="error" style={{ marginTop: "10px" }}>
              <AlertTitle>Error</AlertTitle>
              <ul>
                {virtualContactErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
              <div style={{ marginTop: "10px" }}>
                Please refer to the <strong>Supported Virtual Contact Formats</strong> below for the correct format.
              </div>
            </Alert>
          )}

          {success && (
            <>
              <Alert severity="success" style={{ marginTop: "10px" }}>
                <AlertTitle>The following virtual contacts have been identified:</AlertTitle>
              </Alert>

              <TableContainer component={Paper} style={{ marginTop: "20px" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Virtual Contact Name</strong></TableCell>
                      <TableCell><strong>Channel</strong></TableCell>
                      <TableCell><strong>Channel Name</strong></TableCell>
                      <TableCell><strong>Action</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(virtualContactData)
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map(([contactName, terminals]) => (
                        terminals.map((terminal, index) => {
                          const [terminalNumber, config] = terminal.split(':');
                          const [terminalName, action] = config.trim().split(' - ');
                          
                          return (
                            <TableRow key={`${contactName}-${index}`}>
                              {index === 0 && (
                                <TableCell rowSpan={terminals.length}>
                                  {contactName}
                                </TableCell>
                              )}
                              <TableCell>{terminalNumber}</TableCell>
                              <TableCell>{terminalName.trim()}</TableCell>
                              <TableCell>{action ? action.trim() : 'NORMAL'}</TableCell>
                            </TableRow>
                          );
                        })
                      ))}
                  </TableBody>
                </Table>

                <TablePagination
                  component="div"
                  count={Object.keys(virtualContactData).length}  // 只计算 contact name 的数量
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
            <VirtualContactsTreeView />
          </div>
        </div>
      </div>
    </div>
  );
});

export default VirtualContacts;
