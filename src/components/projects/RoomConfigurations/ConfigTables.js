import React from 'react';
import DeviceTable from './ConfigTables/DeviceTable';
import InputModuleTable from './ConfigTables/InputModuleTable';
import OutputModuleTable from './ConfigTables/OutputModuleTable';
import GroupTable from './ConfigTables/GroupTable';
import SceneTable from './ConfigTables/SceneTable';
import RemoteControlParameterTable from './ConfigTables/RemoteControlParameterTable';
import RemoteControlTable from './ConfigTables/RemoteControlTable';

export const renderConfigTables = (configData) => {
  if (!configData) {
    return null;
  }

  const globalParameters = configData.remoteControls?.[0]?.parameters;

  return (
    <div>
      <DeviceTable devices={configData.devices} />
      <InputModuleTable inputs={configData.inputs} />
      <OutputModuleTable outputs={configData.outputs} />
      <GroupTable groups={configData.groups} />
      <SceneTable scenes={configData.scenes} />
      <RemoteControlTable remoteControls={configData.remoteControls} />
      <RemoteControlParameterTable parameters={globalParameters} />
    </div>
  );
};

export default renderConfigTables;
