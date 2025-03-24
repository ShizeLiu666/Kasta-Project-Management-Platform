/**
 * PANGU Device Configuration
 * Defines the properties and form configuration for PanGu Gateway devices
 */

// 连接状态位定义（同时提供十进制和十六进制参考）
// eslint-disable-next-line no-unused-vars
const CONNECTION_BITS = {
  WIFI: 0,        // 第0位: Wi-Fi连接状态 (0x1)
  ETHERNET: 1,    // 第1位: 以太网连接状态 (0x2)
  INTERNET: 2,    // 第2位: 互联网连接状态 (0x4)
  KASTA_CLOUD: 3  // 第3位: Kasta_Cloud连接状态 (0x8)
};

// 十六进制掩码常量
// eslint-disable-next-line no-unused-vars
const CONNECTION_MASKS = {
  WIFI: 0x1,        // 0001
  ETHERNET: 0x2,    // 0010
  INTERNET: 0x4,    // 0100
  KASTA_CLOUD: 0x8  // 1000
};

const PANGU_CONFIG = {
  // Device attributes configuration
  attributes: {
    connectState: { 
      type: 'number', 
      label: 'Connection State', 
      description: 'Connection state bitmap: bit 0=WiFi (0x1), bit 1=Ethernet (0x2), bit 2=Internet (0x4), bit 3=Kasta Cloud (0x8)',
      min: 0,
      max: 0xF  // 使用十六进制表示15
    },
    subDevices: { 
      type: 'array', 
      label: 'Sub Devices', 
      description: 'List of sub-devices connected to this gateway'
    }
  },

  // Device description
  description: 'PanGu Gateway device that manages sub-devices',

  // Device icon
  icon: 'PANGU.png',

  // Device category
  category: 'gateway',

  // Helper functions for PANGU state display
  helpers: {
    // 检查特定位是否设置
    isBitSet: (state, bitPosition) => {
      if (state === undefined || state === null) return false;
      return ((state >> bitPosition) & 1) === 1;
    },
    
    // 使用十六进制掩码检查位（替代方法）
    isBitSetHex: (state, mask) => {
      if (state === undefined || state === null) return false;
      return (state & mask) === mask;
    },
    
    // 获取连接状态文本
    getConnectionStateText: (state) => {
      if (state === undefined || state === null) return 'Unknown';
      
      // 使用十六进制掩码方式
      const wifiConnected = (state & CONNECTION_MASKS.WIFI) === CONNECTION_MASKS.WIFI;
      const ethernetConnected = (state & CONNECTION_MASKS.ETHERNET) === CONNECTION_MASKS.ETHERNET;
      const internetConnected = (state & CONNECTION_MASKS.INTERNET) === CONNECTION_MASKS.INTERNET;
      const kastaCloudConnected = (state & CONNECTION_MASKS.KASTA_CLOUD) === CONNECTION_MASKS.KASTA_CLOUD;
      
      const statuses = [];
      if (wifiConnected) statuses.push('WiFi');
      if (ethernetConnected) statuses.push('Ethernet');
      if (internetConnected) statuses.push('Internet');
      if (kastaCloudConnected) statuses.push('Kasta Cloud');
      
      if (statuses.length === 0) return 'Disconnected';
      return `Connected (${statuses.join(', ')})`;
    },
    
    // 获取连接状态详细信息
    getConnectionDetails: (state) => {
      if (state === undefined || state === null) return {};
      
      // 使用十六进制掩码
      return {
        wifi: (state & CONNECTION_MASKS.WIFI) === CONNECTION_MASKS.WIFI,
        ethernet: (state & CONNECTION_MASKS.ETHERNET) === CONNECTION_MASKS.ETHERNET,
        internet: (state & CONNECTION_MASKS.INTERNET) === CONNECTION_MASKS.INTERNET,
        kastaCloud: (state & CONNECTION_MASKS.KASTA_CLOUD) === CONNECTION_MASKS.KASTA_CLOUD
      };
    },
    
    // 格式化子设备列表
    formatSubDevices: (subDevices) => {
      if (!subDevices || !Array.isArray(subDevices) || subDevices.length === 0) {
        return 'No sub-devices';
      }
      
      return `${subDevices.length} device${subDevices.length > 1 ? 's' : ''}`;
    }
  }
};

export default PANGU_CONFIG; 