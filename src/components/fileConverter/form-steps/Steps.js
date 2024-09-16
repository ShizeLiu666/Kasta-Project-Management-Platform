import React, { Component } from 'react';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import StepZilla from "react-stepzilla";
import "./steps.scss";
import ComponentCard from "./ComponentCard"; // 假设这是您自定义的组件

class Steps extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.step1Ref = React.createRef();  // 引用以访问Step1组件的方法
  }

  // 在前往下一步之前调用，用于校验
  handleNextStep = (currentStep) => {
    if (currentStep === 0) {  // Step1的索引
      // 在前往下一步前调用Step1的isValidated方法进行验证
      return this.step1Ref.current.isValidated();
    }
    return true;  // 对于其他步骤，直接返回true以继续
  };

  render() {
    const steps = [
      { name: "1. Upload Excel File", component: <Step1 ref={this.step1Ref} /> },
      { name: "Step 2", component: <Step2 /> },
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
              nextStepCallback={this.handleNextStep}
            />
          </div>
        </div>
      </ComponentCard>
    );
  }
}

export default Steps;