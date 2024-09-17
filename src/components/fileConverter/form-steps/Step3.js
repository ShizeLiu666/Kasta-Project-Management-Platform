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
import { validateGroups } from "../../projects/RoomConfigurations/ExcelProcessor/validation/Groups";
import "./steps.scss"

// 格式化错误信息的函数
const formatErrors = (errors) => {
  if (typeof errors === 'string') {
    return errors.split('KASTA GROUP:')
      .filter(error => error.trim())
      .map(error => error.trim().replace(/^:\s*/, '')); // 去掉可能残留的冒号和空格
  }
  return errors;
};

// Step3 function component
const Step3 = forwardRef(({ splitData, deviceNameToType, onValidate }, ref) => {
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

    const { errors, registeredGroupNames } = validateGroups(splitData.groups, deviceNameToType);

    if (errors.length > 0) {
      setGroupErrors(formatErrors(errors));
      setSuccess(false);
      onValidate(false, errors);
    } else {
      // 创建一个对象，键是组名，值是该组包含的设备列表
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
            <Alert severity="error" style={{ marginTop: "10px" }}>
              <AlertTitle>Error</AlertTitle>
              <ul>
                {groupErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </Alert>
          )}

          {success && (
            <>
              <Alert severity="success" style={{ marginTop: "10px" }}>
                <AlertTitle>以下组已被识别：</AlertTitle>
              </Alert>

              <TableContainer component={Paper} style={{ marginTop: "20px" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>组名</strong>
                      </TableCell>
                      <TableCell>
                        <strong>包含的设备</strong>
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
        </div>
      </div>
    </div>
  );
});

export default Step3;