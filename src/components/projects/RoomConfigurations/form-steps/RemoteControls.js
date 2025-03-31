import React, { useState, useEffect, useImperativeHandle, forwardRef, useRef, useCallback } from "react";
import { Alert, AlertTitle } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import { validateRemoteControls } from "../ExcelProcessor/validation/RemoteControls";
import { validateRemoteParameters } from "../ExcelProcessor/validation/RemoteParameters";
import "./steps.scss"

import RemoteControlTreeView from './TreeView/RemoteControlsTreeView';
import RemoteParameters from './RemoteParameters';
import RemoteParametersTreeView from './TreeView/RemoteParametersTreeView';
import ReturnToUploadButton from "../../../CustomComponents/ReturnToUploadButton";

const formatErrors = (errors) => {
  if (typeof errors === 'string') {
    return errors.split('Remote Control')
      .filter(error => error.trim())
      .map(error => 'Remote Control' + error.trim())
      .sort();
  }
  return errors.sort();
};

const RemoteControls = forwardRef(({ 
  splitData, 
  deviceNameToType, 
  registeredDeviceNames, 
  registeredGroupNames, 
  registeredSceneNames, 
  onValidate,
  onReturnToInitialStep, 
  jumpToStep
}, ref) => {
  const [remoteControlErrors, setRemoteControlErrors] = useState(null);
  const [parameterErrors, setParameterErrors] = useState(null);
  const [success, setSuccess] = useState(false);
  const [remoteControlData, setRemoteControlData] = useState({});
  const [parameterData, setParameterData] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const hasValidated = useRef(false);
  const [remoteControlSuccess, setRemoteControlSuccess] = useState(false);
  const [parameterSuccess, setParameterSuccess] = useState(false);
  const [unconfiguredDevices, setUnconfiguredDevices] = useState([]);

  useEffect(() => {
    if (!splitData || !splitData.remoteControls || !deviceNameToType || hasValidated.current) {
      return;
    }

    const rcErrors = validateRemoteControls(splitData.remoteControls, deviceNameToType, registeredDeviceNames, registeredGroupNames, registeredSceneNames);
    const { errors: pErrors, parameters } = validateRemoteParameters(splitData.remoteParameters || []);

    setRemoteControlErrors(rcErrors.length > 0 ? formatErrors(rcErrors) : null);
    setParameterErrors(pErrors.length > 0 ? pErrors : null);

    const rcSuccess = rcErrors.length === 0;
    const pSuccess = pErrors.length === 0;
    
    setRemoteControlSuccess(rcSuccess);
    setParameterSuccess(pSuccess);
    setSuccess(rcSuccess && pSuccess);

    let newRemoteControlData = {};

    if (rcSuccess) {
      newRemoteControlData = {};
      let currentRemoteControl = null;

      splitData.remoteControls.forEach(line => {
        if (line.startsWith('NAME:')) {
          currentRemoteControl = line.substring(5).trim();
          newRemoteControlData[currentRemoteControl] = [];
        } else if (currentRemoteControl && /^\d+:/.test(line)) {
          newRemoteControlData[currentRemoteControl].push(line.trim());
        }
      });

      setRemoteControlData(newRemoteControlData);
    }

    if (pSuccess) {
      setParameterData({ parameters });
    }

    if (rcSuccess && pSuccess) {
      onValidate(true, { remoteControlData: newRemoteControlData, parameters });
    } else {
      onValidate(false, { remoteControlErrors: rcErrors, parameterErrors: pErrors });
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

  // 将 getMaxKeyCount 函数用 useCallback 包装
  const getMaxKeyCount = useCallback((deviceName, deviceNameToType) => {
    const deviceType = deviceNameToType[deviceName];
    if (!deviceType) return null;

    // 处理 Input Module 类型
    if (deviceType === "5 Input Module") {
      return 5;
    }

    // 处理 Remote Control 类型
    if (deviceType.includes("Remote Control")) {
      const modelMatch = deviceType.match(/\((.*?)\)/);
      if (modelMatch && modelMatch[1]) {
        const model = modelMatch[1];
        return parseInt(model.match(/\d+/)[0]);
      }
    }
    return null;
  }, []); // 由于这个函数不依赖任何外部变量，依赖数组为空

  // 修改 determineTargetType 函数
  const determineTargetType = (content, registeredDeviceNames, registeredGroupNames, registeredSceneNames) => {
    // 先获取目标名称并移除前缀
    const targetName = content
      .split(' - ')[0]
      .trim()
      .replace(/^(DEVICE|GROUP|SCENE)\s+/, '')  // 移除前缀
      .trim();

    // 然后检查目标类型
    if (registeredDeviceNames.has(targetName)) return 'DEVICE';
    if (registeredGroupNames.has(targetName)) return 'GROUP';
    if (registeredSceneNames.has(targetName)) return 'SCENE';
    return 'UNKNOWN';
  };

  // 添加颜色常量
  const TYPE_COLORS = {
    DEVICE: '#fbcd0b',   // 设备 - 黄色
    GROUP: '#009688',    // 组 - 绿色
    SCENE: '#9C27B0',    // 场景 - 紫色
    UNKNOWN: '#95A5A6',  // 未知 - 灰色
    UNCONFIGURED: '#E0E0E0'  // 未配置 - 浅灰色
  };

  // 将 checkUnconfiguredDevices 移到 useEffect 外部
  const checkUnconfiguredDevices = React.useCallback((remoteControlData, deviceNameToType) => {
    const unconfigured = [];
    
    Object.entries(remoteControlData).forEach(([deviceName, controls]) => {
      const maxKeyCount = getMaxKeyCount(deviceName, deviceNameToType);
      const configuredKeys = new Set(controls.map(control => parseInt(control.split(':')[0])));
      
      if (configuredKeys.size < maxKeyCount) {
        const deviceType = deviceNameToType[deviceName];
        unconfigured.push({
          name: deviceName,
          type: deviceType,
          configured: configuredKeys.size,
          total: maxKeyCount
        });
      }
    });
    
    return unconfigured;
  }, [getMaxKeyCount]);

  // 修改 useEffect，添加 checkUnconfiguredDevices 到依赖数组
  useEffect(() => {
    if (remoteControlSuccess && remoteControlData) {
      const unconfigured = checkUnconfiguredDevices(remoteControlData, deviceNameToType);
      setUnconfiguredDevices(unconfigured);
    }
  }, [remoteControlData, deviceNameToType, remoteControlSuccess, checkUnconfiguredDevices]);

  // 修改 isValidated 函数
  useImperativeHandle(ref, () => ({
    isValidated: () => {
      if (!success) return false;
      return true;
    },
    resetValidation
  }));

  return (
    <div className="step step5 mt-5">
      <div className="row justify-content-md-center">
        <div className="col-lg-8" style={{ marginBottom: "20px" }}>
          {(remoteControlErrors || parameterErrors) && (
            <>
              <Alert severity="error" style={{ marginTop: "10px" }}>
                <AlertTitle>Error</AlertTitle>
                {remoteControlErrors && (
                  <div>
                    <strong>Remote Control Errors:</strong>
                    <ul>
                      {remoteControlErrors.map((error, index) => (
                        <li key={`rc-${index}`}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {parameterErrors && (
                  <div>
                    <strong>Parameter Errors:</strong>
                    <ul>
                      {parameterErrors.map((error, index) => (
                        <li key={`p-${index}`}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </Alert>

              <ReturnToUploadButton 
                onReturnToInitialStep={onReturnToInitialStep}
                jumpToStep={jumpToStep}
              />
            </>
          )}

          {remoteControlSuccess && (
            <>
              <Alert 
                severity={unconfiguredDevices.length > 0 ? "warning" : "success"} 
                style={{ marginTop: "10px" }}
              >
                <AlertTitle>
                  {unconfiguredDevices.length > 0 
                    ? "Remote Controls Configuration Status" 
                    : "The following remote controls have been identified:"}
                </AlertTitle>
                {unconfiguredDevices.length > 0 && (
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ marginBottom: '8px' }}>
                      The following remote controls have unconfigured buttons:
                    </div>
                    {unconfiguredDevices.map((device, index) => (
                      <div 
                        key={index} 
                        style={{ 
                          marginBottom: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <span>•</span>
                        <span style={{ fontWeight: 'bold' }}>{device.name}</span>
                        <span style={{ color: '#666' }}>
                          ({device.configured} of {device.total} buttons configured)
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </Alert>

              <TableContainer component={Paper} style={{ marginTop: "20px" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Remote Control Name</strong></TableCell>
                      <TableCell><strong>Button</strong></TableCell>
                      <TableCell><strong>Type</strong></TableCell>
                      <TableCell><strong>Control Content</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(remoteControlData)
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map(([remoteControlName, controls]) => {
                        const maxKeyCount = getMaxKeyCount(remoteControlName, deviceNameToType);
                        const configuredKeys = new Set(controls.map(control => parseInt(control.split(':')[0])));
                        
                        // 创建所有按键的行
                        const allRows = [];
                        
                        // 添加已配置的按键
                        controls.forEach((control, index) => {
                          const [button, content] = control.split(':').map(part => part.trim());
                          const targetType = determineTargetType(
                            content, 
                            registeredDeviceNames, 
                            registeredGroupNames, 
                            registeredSceneNames
                          );
                          
                          allRows.push(
                            <TableRow key={`${remoteControlName}-${index}`}>
                              {index === 0 && (
                                <TableCell rowSpan={maxKeyCount}>
                                  <div>
                                    {remoteControlName}
                                    <div style={{ 
                                      fontSize: '0.8rem', 
                                      color: '#666',
                                      marginTop: '4px' 
                                    }}>
                                      Configured: {configuredKeys.size}/{maxKeyCount} buttons
                                    </div>
                                  </div>
                                </TableCell>
                              )}
                              <TableCell>{button}</TableCell>
                              <TableCell>
                                <span style={{
                                  padding: '4px 8px',
                                  borderRadius: '4px',
                                  backgroundColor: TYPE_COLORS[targetType] || '#95A5A6',
                                  color: 'white',
                                  fontWeight: 'bold',
                                  fontSize: '0.8rem'
                                }}>
                                  {targetType}
                                </span>
                              </TableCell>
                              <TableCell>{content}</TableCell>
                            </TableRow>
                          );
                        });

                        // 添加未配置的按键
                        for (let i = 1; i <= maxKeyCount; i++) {
                          if (!configuredKeys.has(i)) {
                            allRows.push(
                              <TableRow key={`${remoteControlName}-unconfigured-${i}`}>
                                <TableCell>{i}</TableCell>
                                <TableCell>
                                  <span style={{
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    backgroundColor: TYPE_COLORS.UNCONFIGURED,
                                    color: '#666',
                                    fontWeight: 'bold',
                                    fontSize: '0.8rem'
                                  }}>
                                    UNCONFIGURED
                                  </span>
                                </TableCell>
                                <TableCell style={{ color: '#999', fontStyle: 'italic' }}>
                                  Not configured
                                </TableCell>
                              </TableRow>
                            );
                          }
                        }

                        return allRows;
                      })}
                  </TableBody>
                </Table>

                <TablePagination
                  component="div"
                  count={Object.keys(remoteControlData).length}
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
            <RemoteControlTreeView />
          </div>

          <RemoteParameters 
            parameterErrors={parameterErrors}
            parameterData={parameterData}
            success={parameterSuccess}
          />

          <div style={{ marginTop: "20px" }}>
            <RemoteParametersTreeView />
          </div>
        </div>
      </div>
    </div>
  );
});

export default RemoteControls;