import React, { forwardRef } from "react";
import "./steps.scss";
import OutputModules from './OutputModules';
import InputModules from './InputModules';
import DryContactModules from './DryContactModules';

const ModuleConfigurations = forwardRef(({
  splitData,
  deviceNameToType,
  registeredDeviceNames,
  onValidate
}, ref) => {

  const handleDryContactValidation = (isValid, data) => {
    if (isValid) {
      onValidate(true, {
        dryContactData: data.dryContactData,
        specialActionDevices: data.specialActionDevices
      });
    } else {
      onValidate(false, null);
    }
  };

  return (
    <div className="step step4 mt-5">
      <div className="row justify-content-md-center">
        <div className="col-lg-8" style={{ marginBottom: "20px" }}>
          <div>
            <OutputModules
              splitData={splitData}
              deviceNameToType={deviceNameToType}
              registeredDeviceNames={registeredDeviceNames}
              onValidate={onValidate}
              ref={ref}
            />
          </div>

          <div style={{ marginTop: "40px" }}>
            <InputModules
              splitData={splitData}
              deviceNameToType={deviceNameToType}
              registeredDeviceNames={registeredDeviceNames}
              onValidate={onValidate}
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