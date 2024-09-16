import React, { useState, useEffect } from "react";
import { Alert, AlertTitle } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination"; // 引入分页组件
import { validateDevices } from "../../projects/RoomConfigurations/ExcelProcessor/validation/Devices";
import * as XLSX from "xlsx";
import "./steps.scss"

// Helper function: Extract text from sheet
function extractTextFromSheet(sheet) {
  const textList = [];
  sheet.forEach((row) => {
    row.forEach((cellValue) => {
      if (cellValue && typeof cellValue === "string") {
        let value = cellValue
          .replace(/（/g, "(")
          .replace(/）/g, ")")
          .replace(/：/g, ":");
        value = value.replace(/\(.*?\)/g, ""); // Remove text inside parentheses
        value.split("\n").forEach((text) => {
          if (text.trim()) textList.push(text.trim()); // Split by new lines and trim
        });
      }
    });
  });
  return textList;
}

// Helper function: Process Excel to JSON
function processExcelToJson(fileContent) {
  const workbook = XLSX.read(fileContent, { type: "array" });
  const allTextData = {};

  workbook.SheetNames.forEach((sheetName) => {
    if (sheetName.includes("Programming Details")) {
      const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
        header: 1,
      });
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
    remoteControls: "REMOTE CONTROL LINK",
  };

  const splitData = { devices: [], groups: [], scenes: [], remoteControls: [] };
  let currentKey = null;

  content.forEach((line) => {
    line = line.trim(); // Ensure no leading/trailing spaces

    if (Object.values(splitKeywords).includes(line)) {
      currentKey = Object.keys(splitKeywords).find(
        (key) => splitKeywords[key] === line
      );
      return;
    }

    if (currentKey) {
      splitData[currentKey].push(line);
    }
  });

  return splitData;
}

// Step2 function component
const Step2 = ({ fileContent }) => {
  const [deviceErrors, setDeviceErrors] = useState(null);
  const [success, setSuccess] = useState(false);
  const [deviceNameToType, setDeviceNameToType] = useState({}); // 保存设备类型映射
  const [loading, setLoading] = useState(true); // 新增一个状态来追踪加载状态
  // 分页状态
  const [page, setPage] = useState(0); // 当前页
  const [rowsPerPage, setRowsPerPage] = useState(5); // 每页显示的行数

  useEffect(() => {
    if (!fileContent) {
      // setDeviceErrors(["No file content provided"]);
      setSuccess(false);
      setLoading(false);  // 明确设置加载结束
      return;  // 如果没有文件内容，直接返回
    }

    setLoading(true); // 开始处理数据
    const allTextData = processExcelToJson(fileContent);

    if (allTextData) {
      const splitData = splitJsonFile(allTextData["programming details"]);
      const { errors: deviceErrors, deviceNameToType } = validateDevices(splitData.devices);

      if (deviceErrors.length > 0) {
        setDeviceErrors(deviceErrors);
        setSuccess(false);
      } else {
        setDeviceNameToType(deviceNameToType);
        setSuccess(true);
      }
    } else {
      setDeviceErrors(["No valid data found in the Excel file"]);
      setSuccess(false);
    }
    setLoading(false); // 数据处理完成
  }, [fileContent]); // 依赖于 fileContent

  // 在数据加载期间显示加载状态
  if (loading) {
    return <div>Loading...</div>;
  }

  // 处理页码更改
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // 处理每页行数更改
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // 重置为第一页
  };

  return (
    <div className="step step2 mt-5">
      <div className="row justify-content-md-center">
        <div className="col-lg-8" style={{ marginBottom: "20px" }}>
          {/* 如果有错误信息，显示错误 Alert */}
          {deviceErrors && (
            <Alert severity="error" style={{ marginTop: "10px" }}>
              <AlertTitle>Error</AlertTitle>
              {deviceErrors.join("\n")} {/* 将所有错误信息显示出来 */}
            </Alert>
          )}

          {/* 如果成功，显示成功 Alert 和设备表格 */}
          {success && (
            <>
              <Alert severity="success" style={{ marginTop: "10px" }}>
                <AlertTitle>The following devices are recognized:</AlertTitle>
              </Alert>

              {/* 显示设备名与设备类型的表格 */}
              <TableContainer component={Paper} style={{ marginTop: "20px" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>Device Name</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Device Type</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(deviceNameToType)
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      ) // 分页逻辑
                      .map(([deviceName, deviceType]) => (
                        <TableRow key={deviceName}>
                          <TableCell>{deviceName}</TableCell>
                          <TableCell>{deviceType}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>

                {/* 分页控件 */}
                <TablePagination
                  component="div"
                  count={Object.keys(deviceNameToType).length}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[5, 10, 25]}
                  style={{
                    alignItems: "center", // 确保元素垂直居中
                    display: "flex", // 使用 flex 布局
                    margin: "10px 0", // 上下留白
                  }}
                />
              </TableContainer>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step2;
