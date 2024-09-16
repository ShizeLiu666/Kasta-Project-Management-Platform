import React, { Component } from "react";
import { Button, Input, FormText } from "reactstrap";
import * as XLSX from "xlsx"; // 导入 xlsx 库
import exampleFile from "../../../assets/excel/example.xlsx"; // 导入示例文件

export default class Step1 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      file: null, // 保存上传的文件
      isValidFile: false, // 文件是否为 Excel
      hasProgrammingDetails: false, // 是否包含 "Programming Details" 表
      errorMessage: "", // 错误信息
    };

    this.handleFileChange = this.handleFileChange.bind(this);
    this.clearSelectedFile = this.clearSelectedFile.bind(this);
    this.isValidated = this.isValidated.bind(this); // StepZilla要求的验证函数
  }

  // 处理文件更改，并在上传后触发文件验证
  handleFileChange(event) {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return; // 如果没有文件被选择，直接返回

    const fileType = selectedFile?.type;

    // 检查文件类型是否为 Excel
    if (
      fileType !==
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
      fileType !== "application/vnd.ms-excel"
    ) {
      this.setState({
        file: null,
        isValidFile: false,
        hasProgrammingDetails: false,
        errorMessage: "Only Excel files are accepted.",
      });
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
          this.setState({
            file: selectedFile,
            isValidFile: true,
            hasProgrammingDetails: true,
            errorMessage: "", // 没有错误信息
          });
        } else {
          this.setState({
            file: selectedFile,
            isValidFile: false,
            hasProgrammingDetails: false,
            errorMessage:
              "Excel file must contain a 'Programming Details' sheet.",
          });
        }
      };
      reader.readAsArrayBuffer(selectedFile);
    }
  }

  // 清除选中的文件
  clearSelectedFile() {
    this.setState({
      file: null,
      isValidFile: false,
      hasProgrammingDetails: false,
      errorMessage: "",
    });
    document.getElementById("excelFile").value = null; // 清除文件输入
  }

  // 验证文件是否有效，StepZilla 会调用此函数来决定是否启用下一步
  isValidated() {
    const { isValidFile, hasProgrammingDetails } = this.state;
    if (!isValidFile || !hasProgrammingDetails) {
      // 设置错误消息，确保用户看到反馈
      this.setState({
        errorMessage: isValidFile
          ? "Excel file must contain a 'Programming Details' sheet."
          : "Only Excel files are accepted.",
      });
      return false; // 阻止用户进入下一步
    }
    return true; // 允许进入下一步
  }

  render() {
    const { file } = this.state;

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
                    onChange={this.handleFileChange} // 文件更改时触发验证
                    style={{ flexGrow: 1 }}
                  />
                  {file && (
                    <Button
                      onClick={this.clearSelectedFile}
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
                  Only Excel files are accepted, and must contain a "Programming
                  Details" sheet.
                  <br />
                  <span style={{ color: "red" }}>*</span> Please refer to the{" "}
                  <a
                    href={exampleFile}
                    download="Example_Configuration_Details.xlsx"
                  >
                    Example of Configuration Details
                  </a>
                </FormText>
              </div>

              {/* 显示错误信息，如果存在 */}
              {this.state.errorMessage && (
                <div className="text-danger" style={{ marginTop: "10px" }}>
                  {this.state.errorMessage}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    );
  }
}
