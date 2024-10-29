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
import { validateScenes } from "../ExcelProcessor/validation/Scenes";
import "./steps.scss"

import dimmerFormatImage from '../../../../assets/excel/scene_format/dimmer_type.png';
import relayFormatImage from '../../../../assets/excel/scene_format/relay_type.png';
import curtainFormatImage from '../../../../assets/excel/scene_format/curtain_type.png';
import fanFormatImage from '../../../../assets/excel/scene_format/fan_type.png';
import powerpointFormatImage from '../../../../assets/excel/scene_format/powerpoint_type.png';

import ScenesTreeView from "./TreeView/ScenesTreeView";

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
const Scenes = forwardRef(({ splitData, deviceNameToType, onValidate }, ref) => {
  const [sceneErrors, setSceneErrors] = useState(null);
  const [success, setSuccess] = useState(false);
  const [sceneData, setSceneData] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showFormatImages, setShowFormatImages] = useState(false);
  const hasValidated = useRef(false);

  const formatImages = {
    'Dimmer': dimmerFormatImage,
    'Relay': relayFormatImage,
    'Curtain': curtainFormatImage,
    'Fan': fanFormatImage,
    'PowerPoint': powerpointFormatImage,
  };

  useEffect(() => {
    if (!splitData || !splitData.scenes || !deviceNameToType || hasValidated.current) {
      return;
    }

    const { errors } = validateScenes(splitData.scenes, deviceNameToType);

    if (errors.length > 0) {
      setSceneErrors(formatErrors(errors));
      setSuccess(false);
      onValidate(false, errors);
      setShowFormatImages(true);
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
      setShowFormatImages(false);
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
    <div className="step step4 mt-5">
      <div className="row justify-content-md-center">
        <div className="col-lg-8" style={{ marginBottom: "20px" }}>
          {sceneErrors && (
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
              <Button onClick={() => setShowFormatImages(!showFormatImages)} variant="outlined" size="sm" sx={{ mt: 1 }}>
                {showFormatImages ? "Hide Format Images" : "Show Format Images"}
              </Button>
              {showFormatImages && (
                <div style={{ marginTop: "20px" }}>
                  <h5>Correct device type formats:</h5>
                  {Object.entries(formatImages).map(([deviceType, imageSrc]) => (
                    <div key={deviceType} style={{ marginBottom: "20px" }}>
                      <h6>{deviceType}</h6>
                      <img src={imageSrc} alt={`${deviceType} format`} style={{ maxWidth: "100%" }} />
                    </div>
                  ))}
                </div>
              )}
            </Alert>
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
            <ScenesTreeView />
          </div>
        </div>
      </div>
    </div>
  );
});

export default Scenes;
