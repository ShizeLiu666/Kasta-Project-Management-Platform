import React from 'react';
import { Table } from 'reactstrap';
import ComponentCard from '../../AuthCodeManagement/ComponentCard';

// eslint-disable-next-line no-unused-vars
const captionStyle = {
  captionSide: 'top',
  fontWeight: 'bold',
  fontSize: '1.2em',
  marginBottom: '10px',
  textAlign: 'left',
  color: '#007bff'
};

const getTypeString = (type) => {
  switch (type) {
    case 0: return 'None';
    case 1: return 'Device';
    case 2: return 'Group';
    case 3: return 'Room';
    case 4: return 'Scene';
    default: return 'Unknown';
  }
};

const getLinkTypeColor = (type) => {
  switch (type) {
    case 1: return '#4A90E2';    // Device - 蓝色，代表技术和功能
    case 2: return '#50C878';    // Group - 绿色，代表组织和集合
    case 3: return '#F5A623';    // Room - 橙色，代表空间和温暖
    case 4: return '#9B59B6';    // Scene - 紫色，代表创意和多样性
    default: return '#95A5A6';   // 默认 - 灰色
  }
};

const customBadgeStyle = {
  display: 'inline-block',
  padding: '5px 10px',
  fontSize: '0.8em',
  fontWeight: 'bold',
  lineHeight: 1,
  textAlign: 'center',
  whiteSpace: 'nowrap',
  verticalAlign: 'baseline',
  borderRadius: '0.25rem',
  color: 'white'
};

const tableStyle = {
  borderCollapse: 'collapse',
  width: '100%',
  marginBottom: '0',
  border: 'none'  // 保持表格外边框为空
};

const cellStyle = {
  borderBottom: '1px solid #dee2e6',  // 添加底部边框
  padding: '10px'
};

const headerCellStyle = {
  ...cellStyle,
  backgroundColor: '#f8f9fa',
  fontWeight: 'bold'
};

const componentCardStyle = {
  marginBottom: '20px',
  boxShadow: 'none',
  border: 'none'
};

// eslint-disable-next-line no-unused-vars
const cardHeaderStyle = {
  backgroundColor: '#f1f1f1',
  color: 'black',
  padding: '5px 10px',
  fontSize: '1.2em'
};

export const renderDevicesTable = (devices) => {
  if (!devices || (Array.isArray(devices) && devices.length === 0) || Object.keys(devices).length === 0) {
    return <p>No devices available.</p>;
  }

  const deviceArray = Array.isArray(devices) ? devices : Object.values(devices);

  return (
    <ComponentCard title="Devices" style={componentCardStyle}>
      <Table borderless responsive style={tableStyle}>
        <thead>
          <tr>
            <th style={{ ...headerCellStyle, width: '30%' }}>Device Name</th>
            <th style={{ ...headerCellStyle, width: '30%' }}>Device Type</th>
            <th style={{ ...headerCellStyle, width: '40%' }}>Appearance Shortname</th>
          </tr>
        </thead>
        <tbody>
          {deviceArray.map((device, index) => (
            <tr key={index}>
              <td style={cellStyle}>{device.deviceName || 'N/A'}</td>
              <td style={cellStyle}>{device.deviceType || 'N/A'}</td>
              <td style={cellStyle}>{device.appearanceShortname || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </ComponentCard>
  );
};

export const renderGroupsTable = (groups) => {
  if (!groups || groups.length === 0) {
    return <p>No groups available.</p>;
  }

  return (
    <ComponentCard title="Groups" style={componentCardStyle}>
      <Table borderless responsive style={tableStyle}>
        <thead>
          <tr>
            <th style={{ ...headerCellStyle, width: '30%' }}>Group Name</th>
            <th style={{ ...headerCellStyle, width: '70%' }}>Devices</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((group, index) => (
            <tr key={index}>
              <td style={cellStyle}>{group.groupName}</td>
              <td style={cellStyle}>
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
    </ComponentCard>
  );
};

export const renderScenesTable = (scenes) => (
  <ComponentCard title="Scenes" style={componentCardStyle}>
    <Table borderless responsive style={tableStyle}>
      <thead>
        <tr>
          <th style={{ ...headerCellStyle, width: '30%' }}>Scene Name</th>
          <th style={{ ...headerCellStyle, width: '70%' }}>Devices</th>
        </tr>
      </thead>
      <tbody>
        {scenes.map((scene, index) => (
          <tr key={index}>
            <td style={cellStyle}>{scene.sceneName}</td>
            <td style={cellStyle}>
              {scene.contents && scene.contents.map((content, contentIndex) => (
                <div key={contentIndex}>
                  {content.deviceName || content.name}: {renderDeviceStatus(content)}
                </div>
              ))}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  </ComponentCard>
);

const renderDeviceStatus = (content) => {
  // PowerPoint Type 处理
  if (content.deviceType && content.deviceType.includes("PowerPoint Type")) {
    if (content.deviceType.includes("Single-Way")) {
      return `Status: ${content.status}`;
    } else if (content.deviceType.includes("Two-Way")) {
      return `Right: ${content.rightStatus}, Left: ${content.leftStatus}`;
    }
  }

  // 原有的其他设备类型处理
  if (content.statusConditions) {
    if (content.statusConditions.leftPowerOnOff !== undefined) {
      return `Left: ${content.statusConditions.leftPowerOnOff ? 'ON' : 'OFF'}, Right: ${content.statusConditions.rightPowerOnOff ? 'ON' : 'OFF'}`;
    } else if (content.statusConditions.rightPowerOnOff !== undefined) {
      return `Power: ${content.statusConditions.rightPowerOnOff ? 'ON' : 'OFF'}`;
    } else if (content.statusConditions.level !== undefined) {
      return `Level: ${content.statusConditions.level}`;
    } else if (content.statusConditions.speed !== undefined) {
      return `Speed: ${content.statusConditions.speed}, Relay: ${content.statusConditions.relay ? 'ON' : 'OFF'}`;
    } else if (content.statusConditions.position !== undefined) {
      return `Position: ${content.statusConditions.position}`;
    }
  }

  if (content.status !== undefined) {
    return content.status ? 'ON' : 'OFF';
  }

  return 'Unknown status';
};

// 添加默认参数映射
const DEFAULT_PARAMETER_VALUES = {
  backlight: 1,          // ENABLED
  backlight_color: 3,    // BLUE
  backlight_timeout: 1,  // 1MIN
  beep: 1,              // ENABLED
  night_light: 15       // MEDIUM
};

// 添加参数值到显示文本的映射
const PARAMETER_DISPLAY = {
  backlight: {
    0: 'DISABLED',
    1: 'ENABLED'
  },
  backlight_color: {
    1: 'WHITE',
    2: 'GREEN',
    3: 'BLUE'
  },
  backlight_timeout: {
    0: '30S',
    1: '1MIN',
    2: '2MIN',
    3: '3MIN',
    4: '5MIN',
    5: '10MIN',
    6: 'NEVER'
  },
  beep: {
    0: 'DISABLED',
    1: 'ENABLED'
  },
  night_light: {
    0: 'DISABLED',
    10: 'LOW',
    15: 'MEDIUM',
    20: 'HIGH'
  }
};

// 修改远程控制表格渲染函数
export const renderRemoteControlsTable = (remoteControls) => (
  <div>
    <div className="component-card-title">Remote Controls</div>

    {/* 遥控器列表 */}
    {remoteControls.map((remote, index) => (
      <ComponentCard key={index} title={remote.remoteName} style={componentCardStyle}>
        <Table borderless responsive style={tableStyle}>
          <thead>
            <tr>
              <th style={{ ...headerCellStyle, width: '15%', textAlign: 'center' }}>Button</th>
              <th style={{ ...headerCellStyle, width: '15%', textAlign: 'center' }}>Type</th>
              <th style={{ ...headerCellStyle, width: '30%' }}>Name</th>
              <th style={{ ...headerCellStyle, width: '20%' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {remote.links.map((link, i) => (
              <tr key={i}>
                <td style={{ ...cellStyle, textAlign: 'center' }}>{link.linkIndex + 1}</td>
                <td style={{ ...cellStyle, textAlign: 'center' }}>
                  <span style={{
                    ...customBadgeStyle,
                    backgroundColor: getLinkTypeColor(link.linkType)
                  }}>
                    {getTypeString(link.linkType)}
                  </span>
                </td>
                <td style={cellStyle}>{link.linkName}</td>
                <td style={cellStyle}>{link.action || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </ComponentCard>
    ))}

<ComponentCard style={componentCardStyle} title="Remote Parameters">
      <Table borderless responsive style={tableStyle}>
        <thead>
          <tr>
            <th style={{ ...headerCellStyle, width: '20%', textAlign: 'center' }}>BACKLIGHT</th>
            <th style={{ ...headerCellStyle, width: '20%', textAlign: 'center' }}>BACKLIGHT COLOR</th>
            <th style={{ ...headerCellStyle, width: '20%', textAlign: 'center' }}>BACKLIGHT TIMEOUT</th>
            <th style={{ ...headerCellStyle, width: '20%', textAlign: 'center' }}>BEEP</th>
            <th style={{ ...headerCellStyle, width: '20%', textAlign: 'center' }}>NIGHT LIGHT</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ ...cellStyle, textAlign: 'center' }}>
              {PARAMETER_DISPLAY.backlight[remoteControls[0]?.parameters?.backlight ?? DEFAULT_PARAMETER_VALUES.backlight]}
            </td>
            <td style={{ ...cellStyle, textAlign: 'center' }}>
              {PARAMETER_DISPLAY.backlight_color[remoteControls[0]?.parameters?.backlight_color ?? DEFAULT_PARAMETER_VALUES.backlight_color]}
            </td>
            <td style={{ ...cellStyle, textAlign: 'center' }}>
              {PARAMETER_DISPLAY.backlight_timeout[remoteControls[0]?.parameters?.backlight_timeout ?? DEFAULT_PARAMETER_VALUES.backlight_timeout]}
            </td>
            <td style={{ ...cellStyle, textAlign: 'center' }}>
              {PARAMETER_DISPLAY.beep[remoteControls[0]?.parameters?.beep ?? DEFAULT_PARAMETER_VALUES.beep]}
            </td>
            <td style={{ ...cellStyle, textAlign: 'center' }}>
              {PARAMETER_DISPLAY.night_light[remoteControls[0]?.parameters?.night_light ?? DEFAULT_PARAMETER_VALUES.night_light]}
            </td>
          </tr>
        </tbody>
      </Table>
    </ComponentCard>
  </div>
);

// 首先添加一个新的常量来映射脉冲值到显示文本
const PULSE_MAPPING = {
  0: 'NORMAL',
  1: '1SEC',
  2: '6SEC',
  3: '9SEC',
  4: 'REVERS'
};

// 添加新的表格渲染函数
export const renderVirtualContactsTable = (outputs) => {
  if (!outputs || outputs.length === 0) {
    return <p>No virtual contacts available.</p>;
  }

  return (
    <div>
      <div className="component-card-title">Virtual Dry Contacts</div>
      {outputs.map((output, index) => (
        <ComponentCard 
          key={index} 
          title={output.deviceName} 
          style={componentCardStyle}
        >
          <Table borderless responsive style={tableStyle}>
            <thead>
              <tr>
                <th style={{ ...headerCellStyle, width: '15%' }}>Channel</th>
                <th style={{ ...headerCellStyle, width: '45%' }}>Virtual Name</th>
                <th style={{ ...headerCellStyle, width: '40%' }}>Pulse Mode</th>
              </tr>
            </thead>
            <tbody>
              {output.virtualDryContacts.map((contact, contactIndex) => (
                <tr key={contactIndex}>
                  <td style={cellStyle}>{contact.channel + 1}</td>
                  <td style={cellStyle}>
                    {contact.virtualName || <span style={{ color: '#999' }}>-</span>}
                  </td>
                  <td style={cellStyle}>
                    {PULSE_MAPPING[contact.pulse]}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </ComponentCard>
      ))}
    </div>
  );
};
