/**
 * SOCKET_SWITCH Device Configuration
 * Defines the properties and form configuration for Socket Switch devices
 */
// productTypeAttributesMap.put(ProductTypeEnum.SWITCH.getPid(), new HashSet<>(Arrays.asList("power", "delay")));
const SOCKET_SWITCH_CONFIG = {
  // Device attributes configuration
  attributes: {
    power: { 
      type: 'select', 
      label: 'Power', 
      options: [0, 1],
      optionLabels: ['Off', 'On'],
      description: 'Power state (0=Off, 1=On)'
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
  description: 'Socket switch device for controlling power outlets',
  
  // Device icon
  icon: 'SOCKET_SWITCH.png',
  
  // Device category
  category: 'switch',
  
  // Helper functions for socket switch state display
  helpers: {
    getPowerStateText: (state) => {
      switch (Number(state)) {
        case 0: return 'Off';
        case 1: return 'On';
        default: return '-';
      }
    },
    getDelayMinutes: (delay) => {
      if (delay === undefined || delay === null) return '-';
      return `${delay} min`;
    }
  }
};

export default SOCKET_SWITCH_CONFIG; 