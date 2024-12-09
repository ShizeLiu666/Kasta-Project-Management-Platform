import React from 'react';
import DeviceTable from './ConfigTables/DeviceTable';
import InputModuleTable from './ConfigTables/InputModuleTable';
import OutputModuleTable from './ConfigTables/OutputModuleTable';
import DryContactTable from './ConfigTables/DryContactTable';
import GroupTable from './ConfigTables/GroupTable';
import SceneTable from './ConfigTables/SceneTable';
import RemoteControlParameterTable from './ConfigTables/RemoteControlParameterTable';
import RemoteControlTable from './ConfigTables/RemoteControlTable';

export const renderConfigTables = (configData) => {
  if (!configData) {
    return null;
  }

  // 既存在，又是数组，还有内容
  const hasDevices = configData.devices && Array.isArray(configData.devices) && configData.devices.length > 0;
  const hasInputs = configData.inputs && Array.isArray(configData.inputs) && configData.inputs.length > 0;
  const hasOutputs = configData.outputs && Array.isArray(configData.outputs) && configData.outputs.length > 0;
  const hasDryContacts = configData.dryContacts && Array.isArray(configData.dryContacts) && configData.dryContacts.length > 0;
  const hasGroups = configData.groups && Array.isArray(configData.groups) && configData.groups.length > 0;
  const hasScenes = configData.scenes && Array.isArray(configData.scenes) && configData.scenes.length > 0;
  const hasRemoteControls = configData.remoteControls && Array.isArray(configData.remoteControls) && configData.remoteControls.length > 0;
  const globalParameters = hasRemoteControls && configData.remoteControls[0]?.parameters;

  if (!hasDevices) {
    return <div>No device configuration found</div>;
  }

  return (
    <div>
      <DeviceTable devices={configData.devices} />
      {hasInputs && <InputModuleTable inputs={configData.inputs} />}
      {hasOutputs && <OutputModuleTable outputs={configData.outputs} />}
      {hasDryContacts && <DryContactTable dryContacts={configData.dryContacts} />}
      {hasGroups && <GroupTable groups={configData.groups} />}
      {hasScenes && <SceneTable scenes={configData.scenes} />}
      {hasRemoteControls && <RemoteControlTable remoteControls={configData.remoteControls} />}
      {globalParameters && <RemoteControlParameterTable parameters={globalParameters} />}
    </div>
  );
};

export default renderConfigTables;
