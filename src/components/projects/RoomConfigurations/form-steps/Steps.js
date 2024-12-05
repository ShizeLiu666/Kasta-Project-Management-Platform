import React, { useRef, useState } from "react";
import InitialStep from "./InitialStep";
import Devices from "./Devices";          
import ModuleConfigurations from "./ModuleConfigurations";
import Groups from "./Groups";           
import Scenes from "./Scenes";           
import RemoteControls from "./RemoteControls";   
import FinalStep from "./FinalStep";
import StepZilla from "react-stepzilla";
import "./steps.scss";

const Steps = ({ projectRoomId, submitJson }) => {
  const initialStepRef = useRef(null);
  const devicesRef = useRef(null);
  const outputModulesRef = useRef(null);
  const groupsRef = useRef(null);
  const scenesRef = useRef(null);
  const remoteControlsRef = useRef(null);
  const finalStepRef = useRef(null);
  const [deviceData, setDeviceData] = useState(null);
  const [groupData, setGroupData] = useState(null);
  const [sceneData, setSceneData] = useState(null);
  const [remoteControlData, setRemoteControlData] = useState(null);
  const [remoteParameterData, setRemoteParameterData] = useState(null);
  const [splitData, setSplitData] = useState(null);
  const [registeredDeviceNames, setRegisteredDeviceNames] = useState(new Set());
  const [registeredGroupNames, setRegisteredGroupNames] = useState(new Set());
  const [registeredSceneNames, setRegisteredSceneNames] = useState(new Set());
  const [outputModuleData, setOutputModuleData] = useState(null);
  const [dryContactSpecialActions, setDryContactSpecialActions] = useState(new Map());

  const handleStep1Validation = (isValid, data) => {
    if (isValid) {
      setSplitData(data);
    }
  };

  const handleStep2Validation = (isValid, data) => {
    if (isValid) {
      setDeviceData(data.deviceNameToType);  // 处理设备数据
      setRegisteredDeviceNames(new Set(Object.keys(data.deviceNameToType)));
    }
  };

  const handleStep3Validation = (isValid, data) => {
    if (isValid) {
      setOutputModuleData(data.outputModuleData);  // 处理虚拟干接点数据
      setDryContactSpecialActions(data.specialActionDevices);
    }
  };

  const handleStep4Validation = (isValid, data) => {
    if (isValid) {
      setGroupData(data.groupData);
      setRegisteredGroupNames(new Set(Object.keys(data.groupData)));
    }
  };

  const handleStep5Validation = (isValid, data) => {
    if (isValid) {
      setSceneData(data.sceneData);
      setRegisteredSceneNames(new Set(Object.keys(data.sceneData)));
    }
  };

  const handleStep6Validation = (isValid, data) => {
    if (isValid) {
      setRemoteControlData(data.remoteControlData);
      setRemoteParameterData(data.parameters);
    }
  };

  const handleNextStep = (currentStep) => {
    if (currentStep === 0) {
      return initialStepRef.current.isValidated();
    }
    if (currentStep === 1) {
      return devicesRef.current.isValidated();
    }
    if (currentStep === 2) {
      return outputModulesRef.current.isValidated();
    }
    if (currentStep === 3) {
      return groupsRef.current.isValidated();
    }
    if (currentStep === 4) {
      return scenesRef.current.isValidated();
    }
    if (currentStep === 5) {
      return remoteControlsRef.current.isValidated();
    }
    if (currentStep === 6) {
      return finalStepRef.current.isValidated();
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
      setOutputModuleData(null);
    }
    if (currentStep === 4) {
      setGroupData(null);
      setRegisteredGroupNames(new Set());
    }
    if (currentStep === 5) {
      setSceneData(null);
      setRegisteredSceneNames(new Set());
    }
    if (currentStep === 6) {
      setRemoteControlData(null);
      setRemoteParameterData(null);
    }
  };

  const handleReturnToInitialStep = () => {
    setSplitData(null);
    setDeviceData(null);
    setGroupData(null);
    setSceneData(null);
    setRemoteControlData(null);
    setRemoteParameterData(null);
    setRegisteredDeviceNames(new Set());
    setRegisteredGroupNames(new Set());
    setRegisteredSceneNames(new Set());
    setOutputModuleData(null);
    setDryContactSpecialActions(new Map());

    initialStepRef.current?.resetValidation();
    devicesRef.current?.resetValidation();
    outputModulesRef.current?.resetValidation();
    groupsRef.current?.resetValidation();
    scenesRef.current?.resetValidation();
    remoteControlsRef.current?.resetValidation();
    finalStepRef.current?.resetValidation();
  };

  const steps = [
    { name: "Upload", component: <InitialStep ref={initialStepRef} onValidate={handleStep1Validation} /> },
    { 
      name: "Devices", 
      component: <Devices 
        ref={devicesRef}
        splitData={splitData}
        onValidate={handleStep2Validation}
        onReturnToInitialStep={handleReturnToInitialStep}
      /> 
    },
    { 
      name: "Module Configurations", 
      component: <ModuleConfigurations 
        ref={outputModulesRef}
        splitData={splitData}
        deviceNameToType={deviceData}
        registeredDeviceNames={registeredDeviceNames}
        onValidate={handleStep3Validation}
        onReturnToInitialStep={handleReturnToInitialStep}
      /> 
    },
    { 
      name: "Groups", 
      component: <Groups 
        ref={groupsRef} 
        splitData={splitData} 
        deviceNameToType={deviceData} 
        onValidate={handleStep4Validation}
        onReturnToInitialStep={handleReturnToInitialStep}
      /> 
    },
    { 
      name: "Scenes", 
      component: <Scenes 
        ref={scenesRef} 
        splitData={splitData} 
        deviceNameToType={deviceData} 
        registeredDeviceNames={registeredDeviceNames}
        registeredGroupNames={registeredGroupNames}
        dryContactSpecialActions={dryContactSpecialActions}
        onValidate={handleStep5Validation} 
      /> 
    },
    { 
      name: "Remote Controls", 
      component: <RemoteControls 
        ref={remoteControlsRef}
        splitData={splitData}
        deviceNameToType={deviceData}
        registeredDeviceNames={registeredDeviceNames}
        registeredGroupNames={registeredGroupNames}
        registeredSceneNames={registeredSceneNames}
        onValidate={handleStep6Validation}
        onReturnToInitialStep={handleReturnToInitialStep}
      /> 
    },
    { 
      name: "Final",
      component: <FinalStep 
        ref={finalStepRef}
        splitData={splitData}
        deviceData={deviceData}
        groupData={groupData}
        sceneData={sceneData}
        remoteControlData={remoteControlData}
        remoteParameterData={remoteParameterData}
        outputModuleData={outputModuleData}
        submitJson={submitJson}
        projectRoomId={projectRoomId}
      /> 
    },
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
