import React from 'react';
import DeviceTable from './ConfigTables/DeviceTable';
import InputModuleTable from './ConfigTables/InputModuleTable';
import OutputModuleTable from './ConfigTables/OutputModuleTable';
import DryContactTable from './ConfigTables/DryContactTable';
import GroupTable from './ConfigTables/GroupTable';
import SceneTable from './ConfigTables/SceneTable';
import RemoteControlParameterTable from './ConfigTables/RemoteControlParameterTable';
import RemoteControlTable from './ConfigTables/RemoteControlTable';
import { Table } from 'reactstrap';

const captionStyle = {
  captionSide: 'top',
  fontWeight: 'bold',
  fontSize: '1.2em',
  marginBottom: '10px',
  color: '#333'
};

export const renderConfigTables = (configData, options = {}) => {
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
      <DeviceTable 
        devices={configData.devices} 
        onDeviceRename={options.onDeviceRename}
        onDownloadUpdatedConfig={options.onDownloadUpdatedConfig}
      />
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

export const renderGroupsTable = (groups) => {
  if (!groups || groups.length === 0) {
    return <p>No groups available.</p>;
  }
  
  return (
    <Table>
      <caption style={captionStyle}>Groups</caption>
      <thead>
        <tr>
          <th>Group Name</th>
          <th>Devices</th>
        </tr>
      </thead>
      <tbody>
        {groups.map((group, index) => (
          <tr key={index}>
            <td>{group.groupName}</td>
            <td>
              {group.devices.map((device, deviceIndex) => (
                <div key={deviceIndex}>
                  {device.deviceName} ({device.appearanceShortname})
                </div>
              ))}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export const renderScenesTable = (scenes) => (
  <Table>
    <caption style={captionStyle}>Scenes</caption>
    <thead>
      <tr>
        <th>Scene Name</th>
        <th>Devices</th>
      </tr>
    </thead>
    <tbody>
      {scenes.map((scene, index) => (
        <tr key={index}>
          <td>{scene.sceneName}</td>
          <td>
            {scene.contents && scene.contents.map((content, contentIndex) => (
              <div key={contentIndex}>
                {content.name}: {renderDeviceStatus(content)}
              </div>
            ))}
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
);

const renderDeviceStatus = (content) => {
  if (content.statusConditions) {
    if (content.statusConditions.leftPowerOnOff !== undefined) {
      // 双路插座
      return `Left: ${content.statusConditions.leftPowerOnOff ? 'ON' : 'OFF'}, Right: ${content.statusConditions.rightPowerOnOff ? 'ON' : 'OFF'}`;
    } else if (content.statusConditions.rightPowerOnOff !== undefined) {
      // 单路插座
      return `Power: ${content.statusConditions.rightPowerOnOff ? 'ON' : 'OFF'}`;
    } else if (content.statusConditions.level !== undefined) {
      // 调光器
      return `Level: ${content.statusConditions.level}`;
    } else if (content.statusConditions.speed !== undefined) {
      // 风扇
      return `Speed: ${content.statusConditions.speed}, Relay: ${content.statusConditions.relay ? 'ON' : 'OFF'}`;
    } else if (content.statusConditions.position !== undefined) {
      // 窗帘
      return `Position: ${content.statusConditions.position}`;
    }
  }
  
  if (content.status !== undefined) {
    // 普通设备（如继电器）
    return content.status ? 'ON' : 'OFF';
  }
  
  // 未知类型
  return 'Unknown status';
};

export const renderRemoteControlsTable = (remoteControls) => (
  <Table>
    <caption style={captionStyle}>Remote Controls</caption>
    <thead>
      <tr>
        <th>Remote Name</th>
        <th>Links</th>
      </tr>
    </thead>
    <tbody>
      {remoteControls.map((remote, index) => (
        <tr key={index}>
          <td>{remote.remoteName}</td>
          <td>
            {remote.links.length === 0 ? '(None)' : (
              remote.links.map((link, i) => (
                <div key={i}>
                  {i + 1}. {link.linkName}:
                    Type: {link.linkType}; RC Index: {link.rc_index}
                    {link.action !== null && <li>Action: {link.action}</li>}
                </div>
              ))
            )}
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
);

export default renderConfigTables;
