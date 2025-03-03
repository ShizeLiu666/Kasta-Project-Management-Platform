/**
 * CURTAIN Device Configuration
 * Defines the properties and form configuration for CURTAIN devices
 */
// productTypeAttributesMap.put(ProductTypeEnum.CURTAIN.getPid(), new HashSet<>(Arrays.asList("power", "curtainAction", "isConfig", "delay", "isDirection")));= 
const CURTAIN_CONFIG = {
  // Device attributes configuration
  attributes: {
    power: { 
      type: 'select', 
      label: 'Power', 
      options: [0, 1],
      description: 'Power state (0=Off, 1=On)'
    },
    isConfig: { 
      type: 'select', 
      label: 'Is Config', 
      options: [0, 1],
      optionLabels: ['No', 'Yes'],
      description: 'Configuration status (0=No, 1=Yes)'
    },
    delay: { 
      type: 'number', 
      label: 'Delay', 
      min: 0, 
      max: 59,
      description: 'Delay time in minutes (0-59)'
    },
    isDirection: { 
      type: 'select', 
      label: 'Direction', 
      options: [0, 1],
      optionLabels: ['Forward', 'Reverse'],
      description: 'Direction setting (0=Forward, 1=Reverse)'
    }
  },
  
  // Device description
  description: 'Curtain controller, supports open, close, and stop operations',
  
  // Device icon
  icon: 'CURTAIN.png',
  
  // Device category
  category: 'curtain',
  
  // Helper functions for CURTAIN state display
  helpers: {
    getPowerStateText: (state) => {
      switch (Number(state)) {
        case 0: return 'Off';
        case 1: return 'On';
        default: return '-';
      }
    },
    getConfigStatusText: (status) => {
      switch (Number(status)) {
        case 0: return 'No';
        case 1: return 'Yes';
        default: return '-';
      }
    },
    getDelayMinutes: (delay) => {
      if (delay === undefined || delay === null) return '-';
      return `${delay} min`;
    },
    getDirectionText: (direction) => {
      switch (Number(direction)) {
        case 0: return 'Forward';
        case 1: return 'Reverse';
        default: return '-';
      }
    }
  }
};

export default CURTAIN_CONFIG; 