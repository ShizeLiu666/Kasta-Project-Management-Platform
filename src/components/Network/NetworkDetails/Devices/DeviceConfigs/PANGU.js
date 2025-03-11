/**
 * PANGU Device Configuration
 * Defines the properties and form configuration for PanGu Gateway devices
 */

// 连接状态位定义
const CONNECTION_BITS = {
  WIFI: 0,        // 第0位: Wi-Fi连接状态
  ETHERNET: 1,    // 第1位: 以太网连接状态
  INTERNET: 2,    // 第2位: 互联网连接状态
  KASTA_CLOUD: 3  // 第3位: Kasta_Cloud连接状态
};

const PANGU_CONFIG = {
  // Device attributes configuration
  attributes: {
    connectState: { 
      type: 'number', 
      label: 'Connection State', 
      description: 'Connection state bitmap: bit 0=WiFi, bit 1=Ethernet, bit 2=Internet, bit 3=Kasta Cloud',
      min: 0,
      max: 15
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
    
    // 获取连接状态文本
    getConnectionStateText: (state) => {
      if (state === undefined || state === null) return 'Unknown';
      
      const wifiConnected = ((state >> CONNECTION_BITS.WIFI) & 1) === 1;
      const ethernetConnected = ((state >> CONNECTION_BITS.ETHERNET) & 1) === 1;
      const internetConnected = ((state >> CONNECTION_BITS.INTERNET) & 1) === 1;
      const kastaCloudConnected = ((state >> CONNECTION_BITS.KASTA_CLOUD) & 1) === 1;
      
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
      
      return {
        wifi: ((state >> CONNECTION_BITS.WIFI) & 1) === 1,
        ethernet: ((state >> CONNECTION_BITS.ETHERNET) & 1) === 1,
        internet: ((state >> CONNECTION_BITS.INTERNET) & 1) === 1,
        kastaCloud: ((state >> CONNECTION_BITS.KASTA_CLOUD) & 1) === 1
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