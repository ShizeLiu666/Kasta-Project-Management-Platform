import React, { useState, useEffect } from 'react';
import { Alert, AlertTitle } from '@mui/material';
import { validateDevices } from '../../projects/RoomConfigurations/ExcelProcessor/validation/Devices';
import * as XLSX from 'xlsx';

// Helper function: Extract text from sheet
function extractTextFromSheet(sheet) {
  const textList = [];
  sheet.forEach(row => {
    row.forEach(cellValue => {
      if (cellValue && typeof cellValue === 'string') {
        let value = cellValue.replace(/（/g, '(').replace(/）/g, ')').replace(/：/g, ':');
        value = value.replace(/\(.*?\)/g, ''); // Remove text inside parentheses
        value.split('\n').forEach(text => {
          if (text.trim()) textList.push(text.trim()); // Split by new lines and trim
        });
      }
    });
  });
  return textList;
}

// Helper function: Process Excel to JSON
function processExcelToJson(fileContent) {
  const workbook = XLSX.read(fileContent, { type: 'array' });
  const allTextData = {};

  workbook.SheetNames.forEach(sheetName => {
    if (sheetName.includes("Programming Details")) {
      const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
      allTextData["programming details"] = extractTextFromSheet(sheet);
    }
  });

  return Object.keys(allTextData).length ? allTextData : null;
}

// Helper function: Split JSON file content into categories
function splitJsonFile(content) {
  const splitKeywords = {
    devices: "KASTA DEVICE",
    groups: "KASTA GROUP",
    scenes: "KASTA SCENE",
    remoteControls: "REMOTE CONTROL LINK"
  };

  const splitData = { devices: [], groups: [], scenes: [], remoteControls: [] };
  let currentKey = null;

  content.forEach(line => {
    line = line.trim(); // Ensure no leading/trailing spaces

    if (Object.values(splitKeywords).includes(line)) {
      currentKey = Object.keys(splitKeywords).find(key => splitKeywords[key] === line);
      return;
    }

    if (currentKey) {
      splitData[currentKey].push(line);
    }
  });

  return splitData;
}

// Step2 function component
const Step2 = (props) => {
  const [deviceErrors, setDeviceErrors] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // 确保 fileContent 是通过 React Router 的 state 传递的
    const { state } = props.location || {}; // 从 location.state 获取
    const { fileContent } = state || {}; // 读取传递的 fileContent

    if (fileContent) {
      // 处理 Excel 文件
      const allTextData = processExcelToJson(fileContent);

      if (allTextData) {
        const splitData = splitJsonFile(allTextData["programming details"]);

        // 验证设备数据
        const { errors: deviceErrors } = validateDevices(splitData.devices);

        // 设置错误或成功状态
        if (deviceErrors.length > 0) {
          setDeviceErrors(deviceErrors);
          setSuccess(false);
        } else {
          setSuccess(true);
        }
      } else {
        setDeviceErrors(['No valid data found in the Excel file']);
        setSuccess(false);
      }
    } else {
      // 如果没有传递 fileContent，显示错误
      setDeviceErrors(['No file content provided']);
      setSuccess(false);
    }
  }, [props.location]); // 依赖 props.location

  return (
    <div className="step step2 mt-5">
      <div className="row justify-content-md-center">
        <div className="col-lg-8">
          {/* 如果有错误信息，显示错误 Alert */}
          {deviceErrors && (
            <Alert severity="error" style={{ marginTop: "10px" }}>
              <AlertTitle>Error</AlertTitle>
              {deviceErrors.join('\n')} {/* 将所有错误信息显示出来 */}
            </Alert>
          )}

          {/* 如果成功，显示成功 Alert */}
          {success && (
            <Alert severity="success" style={{ marginTop: "10px" }}>
              <AlertTitle>Success</AlertTitle>
              The file passed all tests!
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step2;