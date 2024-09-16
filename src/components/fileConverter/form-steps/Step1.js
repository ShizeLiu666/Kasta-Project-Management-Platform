import React, { useState, useImperativeHandle, forwardRef } from "react";
import { Input, FormText } from "reactstrap";
import * as XLSX from "xlsx"; // 导入 xlsx 库
import exampleFile from "../../../assets/excel/example.xlsx"; // 导入示例文件
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { Button } from "reactstrap";

// 使用 forwardRef 来暴露 isValidated 方法
const Step1 = forwardRef(({ onValidate }, ref) => {
  const [file, setFile] = useState(null); // 保存上传的文件
  const [isValidFile, setIsValidFile] = useState(false); // 文件是否为 Excel
  const [hasProgrammingDetails, setHasProgrammingDetails] = useState(false); // 是否包含 "Programming Details" 表
  const [errorMessage, setErrorMessage] = useState(""); // 错误信息
  const [isNextClicked, setIsNextClicked] = useState(false); // 记录是否点击了Next按钮

  // 处理文件更改，并在上传后触发文件验证
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) {
      clearSelectedFile();
      return;
    }

    const fileType = selectedFile?.type;

    // 检查文件类型是否为 Excel
    if (
      fileType !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
      fileType !== "application/vnd.ms-excel"
    ) {
      setFile(null);
      setIsValidFile(false);
      setHasProgrammingDetails(false);
      setErrorMessage("Only Excel files are accepted");
      document.getElementById("excelFile").value = null; // 清除文件输入
    } else {
      // 读取文件内容并检查是否包含 "Programming Details" 表
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        // 检查是否包含 "Programming Details" 表
        const hasProgrammingDetails = workbook.SheetNames.some((sheetName) =>
          sheetName.includes("Programming Details")
        );

        if (hasProgrammingDetails) {
          setFile(selectedFile);
          setIsValidFile(true);
          setHasProgrammingDetails(true);
          setErrorMessage(""); // 没有错误信息
        } else {
          setFile(selectedFile);
          setIsValidFile(true);
          setHasProgrammingDetails(false);
          setErrorMessage("Excel file must contain a 'Programming Details' sheet");
        }
      };
      reader.readAsArrayBuffer(selectedFile);
    }
  };

  // 清除选中的文件
  const clearSelectedFile = () => {
    setFile(null);
    setIsValidFile(false);
    setHasProgrammingDetails(false);
    setErrorMessage("No file selected");
    document.getElementById("excelFile").value = null; // 清除文件输入
  };

  // 验证文件是否有效
  const isValidated = () => {
    setIsNextClicked(true); // 点击Next按钮后设置为true

    // 如果没有文件或者文件不合法，阻止进入下一步并显示错误
    if (!file) {
      setErrorMessage("No file selected");
      onValidate && onValidate(false, null); // 将验证结果返回给父组件
      return false;
    }

    if (!isValidFile || !hasProgrammingDetails) {
      setErrorMessage(
        isValidFile
          ? "Excel file must contain a 'Programming Details' sheet"
          : "Only Excel files are accepted"
      );
      onValidate && onValidate(false, null); // 将验证结果返回给父组件
      return false;
    }

    // 文件验证成功，将文件内容传递回父组件
    const reader = new FileReader();
    reader.onload = (e) => {
      const fileContent = e.target.result; // 获取文件内容
      onValidate && onValidate(true, fileContent); // 将文件内容传递回父组件
    };
    reader.readAsArrayBuffer(file);

    return true;
  };

  // 使用 useImperativeHandle 将 isValidated 方法暴露给父组件
  useImperativeHandle(ref, () => ({
    isValidated,
  }));

  return (
    <div className="step step1 mt-5">
      <div className="row justify-content-md-center">
        <div className="col col-lg-6">
          <form id="Form" className="form-horizontal mt-2">
            <div className="form-group content form-block-holder">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "15px",
                }}
              >
                <Input
                  id="excelFile"
                  name="file"
                  type="file"
                  onChange={handleFileChange} // 文件更改时触发验证
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
                <br />( Please refer to the{" "}
                <a
                  href={exampleFile}
                  download="Example_Configuration_Details.xlsx"
                >
                  Example of Configuration Details
                </a>{" "}
                )
              </FormText>
            </div>

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
          </form>
        </div>
      </div>
    </div>
  );
});

export default Step1;