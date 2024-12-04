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
import { validateScenes } from "../ExcelProcessor/validation/Scenes";
import "./steps.scss"

import ScenesTreeView from "./TreeView/ScenesTreeView";
import ReturnToUploadButton from "../../../CustomComponents/ReturnToUploadButton";

// Format error messages function
const formatErrors = (errors) => {
  if (typeof errors === 'string') {
    return errors.split('KASTA SCENE:')
      .filter(error => error.trim())
      .map(error => error.trim().replace(/^:\s*/, '')); // Remove any remaining colon and spaces
  }
  return errors;
};

// Scenes function component
const Scenes = forwardRef(({ 
  splitData, 
  deviceNameToType, 
  dryContactSpecialActions, 
  onValidate,
  onReturnToInitialStep,
  jumpToStep
}, ref) => {
  const [sceneErrors, setSceneErrors] = useState(null);
  const [success, setSuccess] = useState(false);
  const [sceneData, setSceneData] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const hasValidated = useRef(false);

  useEffect(() => {
    if (!splitData || !splitData.scenes || !deviceNameToType || hasValidated.current) {
      return;
    }

    const { errors } = validateScenes(
      splitData.scenes, 
      deviceNameToType,
      dryContactSpecialActions 
    );

    if (errors.length > 0) {
      setSceneErrors(formatErrors(errors));
      setSuccess(false);
      onValidate(false, errors);
    } else {
      // Create an object with scene names as keys and devices/actions as values
      const sceneDevices = {};
      let currentScene = null;
      splitData.scenes.forEach(line => {
        if (line.startsWith('NAME:')) {
          currentScene = line.substring(5).trim();
          sceneDevices[currentScene] = [];
        } else if (currentScene && line && !line.startsWith('CONTROL CONTENT')) {
          sceneDevices[currentScene].push(line.trim());
        }
      });
      setSceneData(sceneDevices);
      setSuccess(true);
      onValidate(true, { sceneData: sceneDevices });
    }

    hasValidated.current = true;
  }, [splitData, deviceNameToType, dryContactSpecialActions, onValidate]);

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
    <div className="step step4 mt-5">
      <div className="row justify-content-md-center">
        <div className="col-lg-8" style={{ marginBottom: "20px" }}>
          {sceneErrors && (
            <>
              <Alert severity="error" style={{ marginTop: "10px" }}>
                <AlertTitle>Error</AlertTitle>
                <ul>
                  {sceneErrors.map((error, index) => (
                    <li key={index}>
                      {Array.isArray(error) ? (
                        error.map((line, lineIndex) => (
                          <React.Fragment key={lineIndex}>
                            {line}
                            {lineIndex < error.length - 1 && <br />}
                          </React.Fragment>
                        ))
                      ) : (
                        error
                      )}
                    </li>
                  ))}
                </ul>
                <div style={{ marginTop: "10px" }}>
                  Please refer to the <strong>Supported Scene Control Formats</strong> below for the correct format.
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
                <AlertTitle>The following scenes have been identified:</AlertTitle>
              </Alert>

              <TableContainer component={Paper} style={{ marginTop: "20px" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>Scene Name</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Device Control and Actions</strong>
                      </TableCell>
                      {/* <TableCell>
                        <strong>Actions</strong>
                      </TableCell> */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(sceneData || {})
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map(([sceneName, devices]) => (
                        <TableRow key={sceneName}>
                          <TableCell>{sceneName}</TableCell>
                          <TableCell>
                            {devices?.map((device, index) => (
                              <div key={index}>{device}</div>
                            ))}
                          </TableCell>
                          <TableCell>
                            {/* 可以根据需要添加操作按钮 */}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>

                <TablePagination
                  component="div"
                  count={Object.keys(sceneData).length}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[2, 5, 10]}
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
            <ScenesTreeView />
          </div>
        </div>
      </div>
    </div>
  );
});

export default Scenes;
