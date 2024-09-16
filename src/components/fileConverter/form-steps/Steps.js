import React, { useRef, useState } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import StepZilla from "react-stepzilla";
import "./steps.scss";
import ComponentCard from "./ComponentCard"; // 假设这是您自定义的组件

const Steps = () => {
  const step1Ref = useRef(null); // 创建 Step1 的引用
  const [fileContent, setFileContent] = useState(null); // 新增: 用于存储文件内容

  const handleStep1Validation = (isValid, fileContent) => {
    // 如果 Step1 验证通过，保存文件内容
    console.log("Step 1 is valid:", isValid);
    if (isValid) {
      setFileContent(fileContent); // 保存文件内容
    }
  };

  // 在前往下一步之前调用，用于校验
  const handleNextStep = (currentStep) => {
    if (currentStep === 0) {
      // 如果当前是 Step1，调用 Step1 的 isValidated 方法
      return step1Ref.current.isValidated();
    }
    return true; // 对于其他步骤，直接返回 true 继续
  };

  const steps = [
    {
      name: "1. Upload Excel File",
      component: <Step1 ref={step1Ref} onValidate={handleStep1Validation} />, // 使用引用传递给 Step1
    },
    { 
      name: "Step 2", 
      component: <Step2 fileContent={fileContent} /> // 通过 props 传递文件内容给 Step2
    },
    { name: "Step 3", component: <Step3 /> },
    { name: "Step 4", component: <Step4 /> },
  ];

  return (
    <ComponentCard>
      <div className="example">
        <div className="step-progress">
          <StepZilla
            steps={steps}
            nextTextOnFinalActionStep="Save"
            nextStepCallback={handleNextStep} // 使用 handleNextStep 进行校验
          />
        </div>
      </div>
    </ComponentCard>
  );
};

export default Steps;