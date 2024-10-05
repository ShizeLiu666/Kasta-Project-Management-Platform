import React, { useRef, useState } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";
import Step6 from "./Step6";
import StepZilla from "react-stepzilla";
import "./steps.scss";

const Steps = ({ projectRoomId, submitJson }) => {
  const step1Ref = useRef(null);
  const step2Ref = useRef(null);
  const step3Ref = useRef(null);
  const step4Ref = useRef(null);
  const step5Ref = useRef(null);
  const step6Ref = useRef(null);
  const [deviceData, setDeviceData] = useState(null);
  const [groupData, setGroupData] = useState(null);
  const [sceneData, setSceneData] = useState(null);
  const [remoteControlData, setRemoteControlData] = useState(null);
  const [splitData, setSplitData] = useState(null);
  const [registeredDeviceNames, setRegisteredDeviceNames] = useState(new Set());
  const [registeredGroupNames, setRegisteredGroupNames] = useState(new Set());
  const [registeredSceneNames, setRegisteredSceneNames] = useState(new Set());
  // const [finalJsonData, setFinalJsonData] = useState(null);

  const handleStep1Validation = (isValid, data) => {
    if (isValid) {
      setSplitData(data);
    }
  };

  const handleStep2Validation = (isValid, data) => {
    if (isValid) {
      setDeviceData(data.deviceNameToType);
      setRegisteredDeviceNames(new Set(Object.keys(data.deviceNameToType)));
    }
  };

  const handleStep3Validation = (isValid, data) => {
    if (isValid) {
      setGroupData(data.groupData);
      setRegisteredGroupNames(new Set(Object.keys(data.groupData)));
    }
  };

  const handleStep4Validation = (isValid, data) => {
    if (isValid) {
      setSceneData(data.sceneData);
      setRegisteredSceneNames(new Set(Object.keys(data.sceneData)));
    }
  };

  const handleStep5Validation = (isValid, data) => {
    if (isValid) {
      setRemoteControlData(data.remoteControlData);
    }
  };

  // const handleStep6Validation = (isValid, data) => {
  //   if (isValid) {
  //     // setFinalJsonData(data);
  //   }
  // };

  const handleNextStep = (currentStep) => {
    if (currentStep === 0) {
      return step1Ref.current.isValidated();
    }
    if (currentStep === 1) {
      return step2Ref.current.isValidated();
    }
    if (currentStep === 2) {
      return step3Ref.current.isValidated();
    }
    if (currentStep === 3) {
      return step4Ref.current.isValidated();
    }
    if (currentStep === 4) {
      return step5Ref.current.isValidated();
    }
    if (currentStep === 5) {
      return step6Ref.current.isValidated();
    }
    return true;
  };

  const handlePrevStep = (currentStep) => {
    if (currentStep === 1) {
      setSplitData(null);
    }
    if (currentStep === 2) {
      setDeviceData(null);
      setRegisteredDeviceNames(new Set());
    }
    if (currentStep === 3) {
      setGroupData(null);
      setRegisteredGroupNames(new Set());
    }
    if (currentStep === 4) {
      setSceneData(null);
      setRegisteredSceneNames(new Set());
    }
    if (currentStep === 5) {
      setRemoteControlData(null);
    }
    // if (currentStep === 6) {
    //   setFinalJsonData(null);
    // }
  };

  const steps = [
    { name: "1. Upload", component: <Step1 ref={step1Ref} onValidate={handleStep1Validation} /> },
    { name: "2. Devices", component: <Step2 ref={step2Ref} splitData={splitData} onValidate={handleStep2Validation} /> },
    { name: "3. Groups", component: <Step3 ref={step3Ref} splitData={splitData} deviceNameToType={deviceData} onValidate={handleStep3Validation} /> },
    { name: "4. Scenes", component: <Step4 ref={step4Ref} splitData={splitData} deviceNameToType={deviceData} onValidate={handleStep4Validation} /> },
    { name: "5. Remote", component: <Step5 ref={step5Ref} splitData={splitData} deviceNameToType={deviceData} registeredDeviceNames={registeredDeviceNames} registeredGroupNames={registeredGroupNames} registeredSceneNames={registeredSceneNames} onValidate={handleStep5Validation} /> },
    { name: "6. Convert to JSON", component: <Step6 
      ref={step6Ref} 
      splitData={splitData}
      deviceData={deviceData}
      groupData={groupData}
      sceneData={sceneData}
      remoteControlData={remoteControlData}
      // onValidate={handleStep6Validation}
      submitJson={submitJson}
      projectRoomId={projectRoomId}
    /> },
  ];

  return (
    <div className="example">
      <div className="step-progress">
        <StepZilla
          steps={steps}
          nextButtonText="Next"
          backButtonText="Previous"
          nextButtonCls="custom-next-button"
          backButtonCls="custom-back-button"
          nextStepCallback={handleNextStep}
          prevStepCallback={handlePrevStep}
          stepsNavigation={false}
          showNavigation={true}
          prevBtnOnLastStep={true} 
          nextTextOnFinalActionStep="Next"
        />
      </div>
    </div>
  );
};

export default Steps;