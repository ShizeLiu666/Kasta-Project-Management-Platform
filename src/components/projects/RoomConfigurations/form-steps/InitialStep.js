import React, { useState, useImperativeHandle, forwardRef } from "react";
import { Input, FormText, Button } from "reactstrap";
import * as XLSX from "xlsx"; // 导入 xlsx 库
import exampleFile from "../../../../assets/excel/example.xlsx"; // 导入示例文件
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
// import TreeView from './TreeView/TreeView';  // 导入新的 TreeView 组件
import DevicesTreeView from './TreeView/DevicesTreeView';

// Helper functions moved from Step2
function extractTextFromSheet(sheet) {
  const textList = [];
  sheet.forEach((row) => {
    row.forEach((cellValue) => {
      if (cellValue && typeof cellValue === "string") {
        let value = cellValue
          .replace(/（/g, "(")
          .replace(/）/g, ")")
          .replace(/：/g, ":");
        value = value.replace(/\(.*?\)/g, "");
        value.split("\n").forEach((text) => {
          if (text.trim()) textList.push(text.trim());
        });
      }
    });
  });
  return textList;
}

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

function splitJsonFile(content) {
  const splitKeywords = {
    devices: "KASTA DEVICE",
    groups: "KASTA GROUP",
    scenes: "KASTA SCENE",
    remoteControls: "REMOTE CONTROL LINK",
    outputs: "VIRTUAL DRY CONTACT"  // 改为 outputs
  };

  const splitData = { 
    devices: [], 
    groups: [], 
    scenes: [], 
    remoteControls: [],
    outputs: []  // 改为 outputs
  };
  
  let currentKey = null;

  content.forEach((line) => {
    line = line.trim();

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

// 使用 forwardRef 来暴露 isValidated 方法
const Step1 = forwardRef(({ onValidate }, ref) => {
  const [file, setFile] = useState(null);
  const [isValidFile, setIsValidFile] = useState(false);
  const [hasProgrammingDetails, setHasProgrammingDetails] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isNextClicked, setIsNextClicked] = useState(false);
  const [fileContent, setFileContent] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) {
      clearSelectedFile();
      return;
    }

    const fileType = selectedFile?.type;

    if (
      fileType !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
      fileType !== "application/vnd.ms-excel"
    ) {
      setFile(null);
      setIsValidFile(false);
      setHasProgrammingDetails(false);
      setErrorMessage("Only Excel files are accepted");
      document.getElementById("excelFile").value = null;
      onValidate(false, null);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        // 查找包含 "Programming Details" 的工作表
        const programmingDetailsSheet = workbook.SheetNames.find(sheetName => 
          sheetName.toLowerCase().includes("programming details")
        );

        if (programmingDetailsSheet) {
          const sheet = workbook.Sheets[programmingDetailsSheet];
          const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          const sheetText = sheetData.flat().join(" ").toLowerCase();
          
          const requiredKeyword = "kasta device";
          const optionalKeywords = [
            "kasta group", 
            "kasta scene", 
            "remote control link",
            "virtual dry contact"  // 添加新的可选关键词
          ];
          
          if (!sheetText.includes(requiredKeyword)) {
            setFile(selectedFile);
            setIsValidFile(true);
            setHasProgrammingDetails(false);
            setErrorMessage(`Excel file is missing the required keyword: KASTA DEVICE`);
            setFileContent(null);
          } else {
            const presentOptionalKeywords = optionalKeywords.filter(keyword => 
              sheetText.includes(keyword)
            );
            
            if (presentOptionalKeywords.length === 0) {
              setFile(selectedFile);
              setIsValidFile(true);
              setHasProgrammingDetails(false);
              setErrorMessage(
                `Excel file must contain at least one of: KASTA GROUP, KASTA SCENE, REMOTE CONTROL LINK, or VIRTUAL DRY CONTACT`
              );
              setFileContent(null);
            } else {
              setFile(selectedFile);
              setIsValidFile(true);
              setHasProgrammingDetails(true);
              setErrorMessage("");
              setFileContent(e.target.result);
            }
          }
        } else {
          setFile(selectedFile);
          setIsValidFile(true);
          setHasProgrammingDetails(false);
          setErrorMessage("Excel file must contain a sheet with 'Programming Details' in its name");
          setFileContent(null);
        }
      };
      reader.readAsArrayBuffer(selectedFile);
    }
  };

  const clearSelectedFile = () => {
    setFile(null);
    setIsValidFile(false);
    setHasProgrammingDetails(false);
    setErrorMessage("No file selected");
    setFileContent(null);
    document.getElementById("excelFile").value = null;
    onValidate(false, null);
  };

  const isValidated = () => {
    setIsNextClicked(true);

    if (!file || !isValidFile || !hasProgrammingDetails || !fileContent) {
      setErrorMessage(
        !file
          ? "No file selected"
          : !isValidFile
            ? "Only Excel files are accepted"
            : !hasProgrammingDetails
              ? "Excel file must contain a 'Programming Details' sheet with all required keywords"
              : "Failed to process Excel file"
      );
      onValidate(false, null);
      return false;
    }

    const allTextData = processExcelToJson(fileContent);
    if (!allTextData) {
      setErrorMessage("Failed to process Excel file");
      onValidate(false, null);
      return false;
    }

    const splitData = splitJsonFile(allTextData["programming details"]);
    // console.log("Outputs data:", splitData.outputs);
    onValidate(true, splitData);
    return true;
  };

  useImperativeHandle(ref, () => ({
    isValidated,
  }));

  return (
    <div className="step step1 mt-5">
      <div className="row justify-content-md-center">
        <div className="col col-lg-6">
          <form id="Form" className="form-horizontal mt-2">
            <div className="form-group content form-block-holder">
              {/* 显示错误信息或成功信息 */}
            {(isNextClicked || file) && (
              errorMessage ? (
                <Alert severity="error" style={{ marginTop: "10px" }}>
                  <AlertTitle>Error</AlertTitle>
                  {errorMessage}
                </Alert>
              ) : (
                file && (
                  <Alert severity="success" style={{ marginTop: "10px" }}>
                    <AlertTitle>Success</AlertTitle>
                  </Alert>
                )
              )
            )}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "15px",
                  marginTop: "20px",
                }}
              >
                <Input
                  id="excelFile"  
                  name="file"
                  type="file"
                  onChange={handleFileChange}
                  style={{ flexGrow: 1 }}
                />
                {file && (
                  <Button
                    onClick={clearSelectedFile}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      marginLeft: "10px",
                    }}
                  >
                    Remove
                  </Button>
                )}
              </div>
              <FormText>
                <span style={{ color: "red" }}>* </span>
                Only Excel files are accepted
                <br />
                <span style={{ color: "red" }}>* </span>
                Must contain a "Programming Details" sheet
                <br />
                <span style={{ color: "red" }}>* </span>
                The "Programming Details" sheet must include the following required keyword:
                <ul style={{ margin: "5px 0 5px 20px", padding: 0 }}>
                  <li style={{ marginLeft: "20px" }}>KASTA DEVICE</li>
                </ul>
                <span style={{ color: "red" }}>* </span>
                And at least one of the following optional keywords:
                <ul style={{ margin: "5px 0 5px 20px", padding: 0 }}>
                  <li style={{ marginLeft: "20px" }}>KASTA GROUP</li>
                  <li style={{ marginLeft: "20px" }}>KASTA SCENE</li>
                  <li style={{ marginLeft: "20px" }}>REMOTE CONTROL LINK</li>
                  <li style={{ marginLeft: "20px" }}>VIRTUAL DRY CONTACT</li>
                </ul>
                ( Please refer to the{" "}
                <a
                  href={exampleFile}
                  download="Example_Configuration_Details.xlsx"
                >
                  Example of Configuration Details
                </a>{" "}
                )
              </FormText>
            </div>
            {/* 使用新的 TreeView 组件 */}
            <DevicesTreeView />

        
          </form>
        </div>
      </div>
    </div>
  );
});

export default Step1;
