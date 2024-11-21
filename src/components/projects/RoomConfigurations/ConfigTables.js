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

  const hasDevices = configData.devices && configData.devices.length > 0;
  const hasInputs = configData.inputs && configData.inputs.length > 0;
  const hasOutputs = configData.outputs && configData.outputs.length > 0;
  const hasDryContacts = configData.dryContacts && configData.dryContacts.length > 0;
  const hasGroups = configData.groups && configData.groups.length > 0;
  const hasScenes = configData.scenes && configData.scenes.length > 0;
  const hasRemoteControls = configData.remoteControls && configData.remoteControls.length > 0;
  const globalParameters = configData.remoteControls?.[0]?.parameters;

  return (
    <div>
      {hasDevices && <DeviceTable devices={configData.devices} />}
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
