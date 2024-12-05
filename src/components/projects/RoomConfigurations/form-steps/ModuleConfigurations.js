import React, { forwardRef, useState } from "react";
import "./steps.scss";
import OutputModules from './OutputModules';
import InputModules from './InputModules';
import DryContactModules from './DryContactModules';
import ReturnToUploadButton from "../../../CustomComponents/ReturnToUploadButton";

const ModuleConfigurations = forwardRef(({
  splitData,
  deviceNameToType,
  registeredDeviceNames,
  onValidate,
  onReturnToInitialStep,
  jumpToStep
}, ref) => {

  const [outputErrors, setOutputErrors] = useState(null);
  const [inputErrors, setInputErrors] = useState(null);
  const [dryContactErrors, setDryContactErrors] = useState(null);

  const handleOutputValidation = (isValid, data) => {
    if (!isValid) {
      setOutputErrors(data);
    } else {
      setOutputErrors(null);
      onValidate(true, {
        outputModuleData: data.outputModuleData
      });
    }
  };

  const handleInputValidation = (isValid, data) => {
    if (!isValid) {
      setInputErrors(data);
    } else {
      setInputErrors(null);
      onValidate(true, {
        inputModuleData: data.inputModuleData
      });
    }
  };

  const handleDryContactValidation = (isValid, data) => {
    if (!isValid) {
      setDryContactErrors(data);
    } else {
      setDryContactErrors(null);
      onValidate(true, {
        dryContactData: data.dryContactData,
        specialActionDevices: data.specialActionDevices
      });
    }
  };

  const hasErrors = outputErrors || inputErrors || dryContactErrors;

  return (
    <div className="step step4 mt-5">
      <div className="row justify-content-md-center">
        <div className="col-lg-8" style={{ marginBottom: "20px" }}>
          {hasErrors && (
            <ReturnToUploadButton 
              onReturnToInitialStep={onReturnToInitialStep}
              jumpToStep={jumpToStep}
            />
          )}

          <div>
            <OutputModules
              splitData={splitData}
              deviceNameToType={deviceNameToType}
              registeredDeviceNames={registeredDeviceNames}
              onValidate={handleOutputValidation}
              ref={ref}
            />
          </div>

          <div style={{ marginTop: "40px" }}>
            <InputModules
              splitData={splitData}
              deviceNameToType={deviceNameToType}
              registeredDeviceNames={registeredDeviceNames}
              onValidate={handleInputValidation}
            />
          </div>

          <div style={{ marginTop: "40px" }}>
            <DryContactModules
              splitData={splitData}
              deviceNameToType={deviceNameToType}
              registeredDeviceNames={registeredDeviceNames}
              onValidate={handleDryContactValidation}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

export default ModuleConfigurations;