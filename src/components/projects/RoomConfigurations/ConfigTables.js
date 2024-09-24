import React from 'react';
import { Table } from 'reactstrap';

const captionStyle = {
    captionSide: 'top',
    fontWeight: 'bold',
    fontSize: '1.2em',
    marginBottom: '10px',
    textAlign: 'left',
    color: '#007bff'
};

export const renderDevicesTable = (devices) => {
  if (!devices || (Array.isArray(devices) && devices.length === 0) || Object.keys(devices).length === 0) {
    return <p>No devices available.</p>;
  }
  
  const deviceArray = Array.isArray(devices) ? devices : Object.values(devices);
  
  return (
    <Table>
      <caption style={captionStyle}>Devices</caption>
      <thead>
        <tr>
          <th>Device Name</th>
          <th>Device Type</th>
          <th>Appearance Shortname</th>
        </tr>
      </thead>
      <tbody>
        {deviceArray.map((device, index) => (
          <tr key={index}>
            <td>{device.deviceName || 'N/A'}</td>
            <td>{device.deviceType || 'N/A'}</td>
            <td>{device.appearanceShortname || 'N/A'}</td>
          </tr>
        ))}
      </tbody>
    </Table>
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
                  <ul>
                    <li>Type: {link.linkType}</li>
                    <li>Index: {link.linkIndex}</li>
                    <li>RC Index: {link.rc_index}</li>
                    {link.action !== null && <li>Action: {link.action}</li>}
                  </ul>
                </div>
              ))
            )}
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
);