/**
 * DIMMER Device Configuration
 * Defines the properties and form configuration for Dimmer devices
 */

const DIMMER_CONFIG = {
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
      label: 'Dimming Level', 
      min: 0, 
      max: 255,
      description: 'Dimming level (0-255, 1 byte)'
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
  description: 'Dimmer device for controlling light brightness',
  
  // Device icon
  icon: 'DIMMER.png',
  
  // Device category
  category: 'lighting',
  
  // Helper functions for dimmer state display
  helpers: {
    getPowerStateText: (state) => {
      switch (Number(state)) {
        case 0: return 'Off';
        case 1: return 'On';
        default: return '-';
      }
    },
    getDimmingPercentage: (level) => {
      if (level === undefined || level === null) return '-';
      return `${Math.round((level / 255) * 100)}%`;
    }
  }
};

export default DIMMER_CONFIG; 