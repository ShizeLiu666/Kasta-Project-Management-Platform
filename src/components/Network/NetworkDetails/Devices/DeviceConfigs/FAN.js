/**
 * FAN Device Configuration
 * Defines the properties and form configuration for FAN devices
 */
// productTypeAttributesMap.put(ProductTypeEnum.FAN.getPid(), new HashSet<>(Arrays.asList("fanLightState", "fanState", "isHaveFanLight", "isConfigFanLight", "delay")));
const FAN_CONFIG = {
  // Device attributes configuration
  attributes: {
    fanLightState: { 
      type: 'select', 
      label: 'Light Status', 
      options: [0, 1],
      optionLabels: ['Off', 'On'],
      description: 'Fan light state (0=Off, 1=On)'
    },
    fanState: { 
      type: 'select', 
      label: 'Fan Status', 
      options: [0, 1, 2, 3],
      optionLabels: ['Close', 'Low', 'Medium', 'High'],
      description: 'Fan speed state (0=Close, 1=Low, 2=Medium, 3=High)'
    },
    isHaveFanLight: { 
      type: 'select', 
      label: 'Has Light', 
      options: [0, 1],
      optionLabels: ['No', 'Yes'],
      description: 'Whether the fan has a light (0=No, 1=Yes)'
    },
    isConfigFanLight: { 
      type: 'select', 
      label: 'Light Configured', 
      options: [0, 1],
      optionLabels: ['No', 'Yes'],
      description: 'Whether the fan light is configured (0=No, 1=Yes)'
    },
    delay: { 
      type: 'number', 
      label: 'Delay', 
      min: 0, 
      max: 59,
      description: 'Delay time in minutes (0-59)'
    }
  },
  
  // Device description
  description: 'Fan device with optional light control, supports multiple fan speeds',
  
  // Device icon
  icon: 'FAN.png',
  
  // Device category
  category: 'appliance',
  
  // Helper functions for fan state display
  helpers: {
    getFanStateText: (state) => {
      switch (Number(state)) {
        case 0: return 'Close';
        case 1: return 'Low';
        case 2: return 'Medium';
        case 3: return 'High';
        default: return '-';
      }
    },
    getLightStateText: (state) => {
      switch (Number(state)) {
        case 0: return 'Off';
        case 1: return 'On';
        default: return '-';
      }
    },
    getYesNoText: (value) => {
      switch (Number(value)) {
        case 0: return 'No';
        case 1: return 'Yes';
        default: return '-';
      }
    },
    getDelayMinutes: (delay) => {
      if (delay === undefined || delay === null) return '-';
      return `${delay} min`;
    }
  }
};

export default FAN_CONFIG; 