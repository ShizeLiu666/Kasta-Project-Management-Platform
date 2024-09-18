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
  if (!devices || devices.length === 0) {
    return <p>No devices available.</p>;
  }
  
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
        {devices.map((device, index) => (
          <tr key={index}>
            <td>{device.deviceName}</td>
            <td>{device.deviceType}</td>
            <td>{device.appearanceShortname}</td>
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
            <td>{group.devices}</td>
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
        <th>Contents</th>
      </tr>
    </thead>
    <tbody>
      {scenes.map((scene, index) => (
        <tr key={index}>
          <td>{scene.sceneName}</td>
          <td>
            {scene.contents.map((content, i) => (
              <div key={i}>
                {content.name}: {content.status ? 'On' : 'Off'}
                {content.statusConditions.level !== undefined && 
                  `, Level: ${content.statusConditions.level}`}
              </div>
            ))}
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
);

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
                  {i + 1}. {link.linkName}: Type {link.linkType}, Index {link.linkIndex}
                </div>
              ))
            )}
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
);