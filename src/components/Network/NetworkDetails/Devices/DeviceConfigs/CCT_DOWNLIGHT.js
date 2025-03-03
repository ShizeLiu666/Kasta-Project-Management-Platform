/**
 * CCT_DOWNLIGHT Device Configuration
 * Defines the properties and form configuration for CCT_DOWNLIGHT devices
 * Updated according to KSTCsrMeshLightDevModel parameter specifications
 */
// productTypeAttributesMap.put(ProductTypeEnum.CCT_DOWNLIGHT.getPid(), new HashSet<>(Arrays.asList("power", "level", "colorTemperature", "delay")));
const CCT_DOWNLIGHT_CONFIG = {
  // Device attributes configuration
  attributes: {
    power: { 
      type: 'select', 
      label: 'Power', 
      options: [0, 1],
      description: 'Power state (0=Off, 1=On)'
    },
    level: { 
      type: 'number', 
      label: 'level', 
      min: 0, 
      max: 255,
      description: 'level (0-255, 1 byte, displays as 0-100%)'
    },
    warm: { 
      type: 'number', 
      label: 'Warm Light', 
      min: 0, 
      max: 65535,
      description: 'Warm light value for CCT (0-65535, 2 bytes)'
    },
    colorTemperature: { 
      type: 'number', 
      label: 'Color Temp', 
      min: 0, 
      max: 65535,
      description: 'Color temperature raw value (0-65535)'
    },
    delay: { 
      type: 'number', 
      label: 'Delay', 
      min: 0, 
      max: 59,
      description: 'Delay time in minutes (0-59)',
      isInternal: true // 标记为内部使用，表格中不显示
    },
    sensorID: {
      type: 'string',
      label: 'Sensor Binding ID',
      description: 'ID of daylight sensor bound to this device (if applicable)',
      isInternal: true // 标记为内部使用，表格中不显示
    }
  },
  // Device icon
  icon: 'CCT_DOWNLIGHT.png',
  
  // Device category
  category: 'lighting',
  
  // Helper functions for CCT_DOWNLIGHT state display
  helpers: {
    getPowerStateText: (state) => {
      switch (Number(state)) {
        case 0: return 'Off';
        case 1: return 'On';
        default: return '-';
      }
    },
    getBrightnessPercentage: (level) => {
      if (level === undefined || level === null) return '-';
      return `${Math.round((level / 255) * 100)}%`;
    },
    getColorTemperatureValue: (value) => {
      if (value === undefined || value === null) return '-';
      return value.toString();
    },
    getDelayMinutes: (delay) => {
      if (delay === undefined || delay === null) return '-';
      return `${delay} min`;
    }
  }
};

export default CCT_DOWNLIGHT_CONFIG; 