import React from 'react';
import { Table } from 'reactstrap';
import ComponentCard from '../../CustomComponents/ComponentCard';
import { getDeviceNameToType } from './ExcelProcessor/conversion/Devices';
import DeviceTable from './ConfigTables/DeviceTable';

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

// 添加 Input Module 相关常量
const INPUT_MODULE_TYPES = ["5 Input Module", "6 Input Module"];
const INPUT_ACTION_DISPLAY = {
  0: 'MOMENTARY',
  1: 'TOGGLE'
};

// 添加 Input Module 相关常量
const INPUT_ACTION_MAPPING = {
  0: 'MOMENTARY',
  1: 'TOGGLE'
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
export const renderRemoteControlsTable = (remoteControls) => {
  if (!remoteControls || !Array.isArray(remoteControls) || remoteControls.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="component-card-title">Remote Controls</div>
      {remoteControls.map((remote, index) => {
        if (!remote || !remote.links) return null;
        
        return (
          <ComponentCard
            key={index}
            title={`${remote.remoteName} Configuration`}
            style={componentCardStyle}
          >
            <Table borderless responsive style={tableStyle}>
              <thead>
                <tr>
                  <th style={{ ...headerCellStyle, width: '20%' }}>Key</th>
                  <th style={{ ...headerCellStyle, width: '20%' }}>Type</th>
                  <th style={{ ...headerCellStyle, width: '60%' }}>Target</th>
                </tr>
              </thead>
              <tbody>
                {remote.links.map((link, linkIndex) => (
                  <tr key={linkIndex}>
                    <td style={cellStyle}>{link.linkIndex + 1}</td>
                    <td style={cellStyle}>
                      <span style={{
                        ...customBadgeStyle,
                        backgroundColor: getLinkTypeColor(link.linkType)
                      }}>
                        {getTypeString(link.linkType)}
                      </span>
                    </td>
                    <td style={cellStyle}>
                      {link.linkName}
                      {link.action && ` - ${link.action}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {remote.parameters && (
              <div style={{ marginTop: '20px' }}>
                <h6>Parameters</h6>
                <Table borderless responsive style={tableStyle}>
                  <tbody>
                    {Object.entries(remote.parameters).map(([key, value], paramIndex) => (
                      <tr key={paramIndex}>
                        <td style={{ ...cellStyle, width: '50%' }}>{key.toUpperCase()}</td>
                        <td style={{ ...cellStyle, width: '50%' }}>{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </ComponentCard>
        );
      })}
    </div>
  );
};

// 修改常量名称
const PULSE_MAPPING = {
  0: 'NORMAL',
  1: '1SEC',
  2: '6SEC',
  3: '9SEC',
  4: 'REVERS'
};

// 修改函数名和内部实现
export const renderOutputModulesTable = (outputs) => {
  // 检查 outputs 是否为有效数组
  if (!outputs || !Array.isArray(outputs) || outputs.length === 0) {
    return <p>No output modules available.</p>;
  }

  return (
    <div>
      <div className="component-card-title">Output Modules</div>
      {outputs.map((output, index) => {
        // 检查每个 output 对象的结构
        if (!output || !output.outputs || !Array.isArray(output.outputs)) {
          return null;
        }

        return (
          <ComponentCard
            key={index}
            title={output.deviceName || 'Unknown Device'}
            style={componentCardStyle}
          >
            <Table borderless responsive style={tableStyle}>
              <thead>
                <tr>
                  <th style={{ ...headerCellStyle, width: '15%' }}>Channel</th>
                  <th style={{ ...headerCellStyle, width: '45%' }}>Channel Name</th>
                  <th style={{ ...headerCellStyle, width: '40%' }}>Pulse Mode</th>
                </tr>
              </thead>
              <tbody>
                {output.outputs.map((outputChannel, channelIndex) => (
                  <tr key={channelIndex}>
                    <td style={cellStyle}>{(outputChannel?.channel ?? channelIndex) + 1}</td>
                    <td style={cellStyle}>
                      {outputChannel?.outputName || <span style={{ color: '#999' }}>-</span>}
                    </td>
                    <td style={cellStyle}>
                      {PULSE_MAPPING[outputChannel?.pulse ?? 0]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </ComponentCard>
        );
      })}
    </div>
  );
};

// 添加 Input Modules 渲染函数
export const renderInputModulesTable = (inputs) => {
  if (!inputs || inputs.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="component-card-title">Input Modules</div>
      {inputs.map((input, index) => (
        <ComponentCard
          key={index}
          title={`${input.deviceName} Configuration`}
          style={componentCardStyle}
        >
          <Table borderless responsive style={tableStyle}>
            <thead>
              <tr>
                <th style={{ ...headerCellStyle, width: '30%' }}>Channel</th>
                <th style={{ ...headerCellStyle, width: '70%' }}>Action Type</th>
              </tr>
            </thead>
            <tbody>
              {input.inputActions.map((action, channelIndex) => (
                <tr key={channelIndex}>
                  <td style={cellStyle}>{channelIndex + 1}</td>
                  <td style={cellStyle}>{INPUT_ACTION_MAPPING[action]}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </ComponentCard>
      ))}
    </div>
  );
};

// 添加 Remote Control Parameters 渲染函数
export const renderRemoteControlParametersTable = (parameters) => {
  if (!parameters || Object.keys(parameters).length === 0) {
    return null;
  }

  return (
    <div>
      <div className="component-card-title">Remote Control Parameters</div>
      <ComponentCard
        title="Global Parameters"
        style={componentCardStyle}
      >
        <Table borderless responsive style={tableStyle}>
          <thead>
            <tr>
              <th style={{ ...headerCellStyle, width: '50%' }}>Parameter</th>
              <th style={{ ...headerCellStyle, width: '50%' }}>Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(parameters).map(([key, value], index) => (
              <tr key={index}>
                <td style={cellStyle}>{key.toUpperCase()}</td>
                <td style={cellStyle}>{value}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </ComponentCard>
    </div>
  );
};

// 修改主渲染函数
export const renderConfigTables = (configData) => {
  return (
    <div>
      <DeviceTable devices={configData.devices} />
      {renderInputModulesTable(configData.inputs)}
      {renderOutputModulesTable(configData.outputs)}
      {renderGroupsTable(configData.groups)}
      {renderScenesTable(configData.scenes)}
      {renderRemoteControlParametersTable(configData.parameters)}
      {renderRemoteControlsTable(configData.remoteControls)}
    </div>
  );
};
