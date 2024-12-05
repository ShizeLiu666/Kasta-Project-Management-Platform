import React, { useState, useImperativeHandle, forwardRef } from "react";
import { Input, FormText, Button } from "reactstrap";
import * as XLSX from "xlsx"; // Import xlsx library
import exampleFile from "../../../../assets/excel/example.xlsx"; // Import example file
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
// import TreeView from './TreeView/TreeView';  // Import new TreeView component
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

// 新增函数：检查必需的 DEVICE 关键词
function hasRequiredDeviceKeyword(sheetData) {
  return sheetData.some(line => {
    const trimmedLine = line.trim();
    return splitKeywords.devices.some(keyword => trimmedLine === keyword);
  });
}

const splitKeywords = {
  devices: ["KASTA DEVICE", "DEVICE"],
  groups: ["KASTA GROUP", "GROUP"],
  scenes: ["KASTA SCENE", "SCENE"],
  remoteControls: ["REMOTE CONTROL LINK", "REMOTE CONTROL"],
  remoteParameters: ["REMOTE CONTROL PARAMETER"],
  outputs: ["OUTPUT MODULE"],
  inputs: ["INPUT MODULE"],
  dryContacts: ["DRY CONTACT", "DRY CONTACT MODULE"],
};

function splitJsonFile(content) {
  const splitData = { 
    devices: [], 
    groups: [], 
    scenes: [], 
    remoteControls: [],
    outputs: [],
    remoteParameters: [],
    dryContacts: [],
    inputs: []
  };
  
  let currentKey = null;
  let hasRemoteControl = false;

  // First pass: check if REMOTE CONTROL LINK exists
  content.forEach((line) => {
    if (splitKeywords.remoteControls.some(keyword => line.includes(keyword))) {
      hasRemoteControl = true;
    }
  });

  // Second pass: process all content
  content.forEach((line) => {
    line = line.trim();

    if (line.toUpperCase().includes('CONTROL CONTENT')) {
      return;
    }

    // Check for REMOTE CONTROL PARAMETER
    if (splitKeywords.remoteParameters.some(keyword => line.includes(keyword))) {
      if (!hasRemoteControl) {
        console.warn("REMOTE CONTROL PARAMETER found but no REMOTE CONTROL LINK exists. This parameter will be ignored.");
        return;
      }
    }

    // Modify keyword check logic
    for (const [key, keywords] of Object.entries(splitKeywords)) {
      if (keywords.includes(line)) {
        // Skip REMOTE CONTROL PARAMETER if no REMOTE CONTROL LINK exists
        if (key === 'remoteParameters' && !hasRemoteControl) {
          return;
        }
        currentKey = key;
        return;
      }
    }

    if (currentKey) {
      splitData[currentKey].push(line);
    }
  });

  return splitData;
}

// 新增函数：检查关键词重复
function checkDuplicateKeywords(sheetData) {
  const keywordCounts = {};
  const duplicates = [];

  // 初始化计数器
  Object.values(splitKeywords).forEach(keywordArray => {
    keywordArray.forEach(keyword => {
      keywordCounts[keyword] = 0;
    });
  });

  // 计算每个关键词出现的次数
  sheetData.forEach(line => {
    const trimmedLine = line.trim();
    Object.values(splitKeywords).forEach(keywordArray => {
      keywordArray.forEach(keyword => {
        if (trimmedLine === keyword) {
          keywordCounts[keyword]++;
        }
      });
    });
  });

  // 检查重复
  Object.entries(keywordCounts).forEach(([keyword, count]) => {
    if (count > 1) {
      duplicates.push(keyword);
    }
  });

  return duplicates;
}

// Use forwardRef to expose isValidated method
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

        const programmingDetailsSheet = workbook.SheetNames.find(sheetName => 
          sheetName.toLowerCase().includes("programming details")
        );

        if (programmingDetailsSheet) {
          const sheet = workbook.Sheets[programmingDetailsSheet];
          const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          const flattenedData = sheetData.flat().map(item => item?.toString()?.trim() || '');
          
          // 检查必需的 DEVICE 关键词
          if (!hasRequiredDeviceKeyword(flattenedData)) {
            setFile(selectedFile);
            setIsValidFile(true);
            setHasProgrammingDetails(false);
            setErrorMessage(`Excel file is missing the required keyword: DEVICE or KASTA DEVICE (must be on a separate line)`);
            setFileContent(null);
            return;
          }

          // 检查关键词重复
          const duplicateKeywords = checkDuplicateKeywords(flattenedData);
          if (duplicateKeywords.length > 0) {
            setFile(selectedFile);
            setIsValidFile(true);
            setHasProgrammingDetails(false);
            setErrorMessage(`Found duplicate keywords: ${duplicateKeywords.join(", ")}. Each keyword should only appear once.`);
            setFileContent(null);
            return;
          }

          const sheetText = flattenedData.join(" ").toLowerCase();
          
          // Check for REMOTE CONTROL PARAMETER without REMOTE CONTROL LINK
          const hasRemoteControl = sheetText.includes("remote control link");
          const hasRemoteParameter = sheetText.includes("remote control parameter");
          
          if (hasRemoteParameter && !hasRemoteControl) {
            setFile(selectedFile);
            setIsValidFile(true);
            setHasProgrammingDetails(false);
            setErrorMessage("REMOTE CONTROL PARAMETER cannot be used without REMOTE CONTROL LINK");
            setFileContent(null);
            return;
          }

          const requiredKeywords = ["kasta device", "device"];
          const optionalKeywords = [
            ["kasta group", "group"],
            ["kasta scene", "scene"],
            ["remote control link"],
            ["virtual dry contact"]
          ];
          
          if (!requiredKeywords.some(keyword => sheetText.includes(keyword))) {
            setFile(selectedFile);
            setIsValidFile(true);
            setHasProgrammingDetails(false);
            setErrorMessage(`Excel file is missing the required keyword: KASTA DEVICE or DEVICE`);
            setFileContent(null);
          } else {
            const hasOptionalKeyword = optionalKeywords.some(keywordGroup => 
              keywordGroup.some(keyword => sheetText.includes(keyword))
            );
            
            if (!hasOptionalKeyword) {
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
              {/* Display error message or success message */}
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
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ marginBottom: '10px' }}>
                    <span style={{ color: "red" }}>* </span>
                    Only Excel files are accepted
                  </div>
                  
                  <div style={{ marginBottom: '10px' }}>
                    <span style={{ color: "red" }}>* </span>
                    Must contain a "Programming Details" sheet
                  </div>

                  <div style={{ marginBottom: '10px' }}>
                    <span style={{ color: "red" }}>* </span>
                    Required keyword:
                    <ul style={{ margin: "5px 0 5px 20px", padding: 0 }}>
                      <li style={{ marginLeft: "20px" }}>
                        <em><strong>DEVICE</strong></em>
                      </li>
                    </ul>
                  </div>

                  <div style={{ marginBottom: '10px' }}>
                    <span style={{ color: "red" }}>* </span>
                    Optional keywords (at least one required):
                    <ul style={{ margin: "5px 0 5px 20px", padding: 0 }}>
                      <li style={{ marginLeft: "20px" }}><em><strong>GROUP</strong></em></li>
                      <li style={{ marginLeft: "20px" }}><em><strong>SCENE</strong></em></li>
                      <li style={{ marginLeft: "20px" }}><em><strong>REMOTE CONTROL LINK</strong></em></li>
                    </ul>
                  </div>

                  <div style={{ marginBottom: '10px' }}>
                    <span style={{ color: "blue" }}>† </span>
                    Additional configuration keywords:
                    <ul style={{ margin: "5px 0 5px 20px", padding: 0 }}>
                      <li style={{ marginLeft: "20px" }}>
                        <em><strong>REMOTE CONTROL PARAMETER</strong></em> (Available only when <em><strong>REMOTE CONTROL LINK</strong></em> exists, used for setting global remote control parameters)
                      </li>
                      <li style={{ marginLeft: "20px" }}>
                        <em><strong>OUTPUT MODULE</strong></em> (Detailed configuration for devices with output modules)
                      </li>
                      <li style={{ marginLeft: "20px" }}>
                        <em><strong>INPUT MODULE</strong></em> (Detailed configuration for devices with input modules)
                      </li>
                      <li style={{ marginLeft: "20px" }}>
                        <em><strong>DRY CONTACT MODULE</strong></em> (Detailed configuration for devices with dry contact modules)
                      </li>
                    </ul>
                  </div>

                  <div>
                    Please refer to the{" "}
                    <a href={exampleFile} download="Example_Configuration_Details.xlsx">
                      Example of Configuration Details
                    </a>
                  </div>
                </div>
              </FormText>
            </div>
            {/* Use new TreeView component */}
            <DevicesTreeView />

        
          </form>
        </div>
      </div>
    </div>
  );
});

export default Step1;
