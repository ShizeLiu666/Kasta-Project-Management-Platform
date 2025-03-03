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
      description: 'Fan light state (0=Off, 1=On)'
    },
    fanState: { 
      type: 'select', 
      label: 'Fan Status', 
      options: [0, 1, 2, 3],
      description: 'Fan speed state (0=Off, 1=Slow, 2=Medium, 3=Fast)'
    },
    isHaveFanLight: { 
      type: 'select', 
      label: 'Has Light', 
      options: [0, 1],
      description: 'Whether the fan has a light (0=No, 1=Yes)'
    },
    isConfigFanLight: { 
      type: 'select', 
      label: 'Light Configured', 
      options: [0, 1],
      description: 'Whether the fan light is configured (0=No, 1=Yes)'
    },
    delay: { 
      type: 'number', 
      label: 'Delay (ms)', 
      min: 0, 
      max: 10000,
      description: 'Delay time (milliseconds)'
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
        case 0: return 'Off';
        case 1: return 'Slow';
        case 2: return 'Medium';
        case 3: return 'Fast';
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
    }
  }
};

export default FAN_CONFIG; 