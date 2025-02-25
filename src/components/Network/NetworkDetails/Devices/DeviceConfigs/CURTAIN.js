/**
 * CURTAIN Device Configuration
 * Defines the properties and form configuration for CURTAIN devices
 */

const CURTAIN_CONFIG = {
  // Device attributes configuration
  attributes: {
    power: { 
      type: 'number', 
      label: 'Power', 
      min: 0, 
      max: 1,
      description: 'Power state (0=Off, 1=On)'
    },
    curtainAction: { 
      type: 'select', 
      label: 'Curtain Action', 
      options: [0, 1, 2],
      optionLabels: ['Stop', 'Open', 'Close'],
      description: 'Curtain action (0=Stop, 1=Open, 2=Close)'
    },
    isConfig: { 
      type: 'number', 
      label: 'Is Config', 
      min: 0, 
      max: 1,
      description: 'Configuration status (0=No, 1=Yes)'
    },
    delay: { 
      type: 'number', 
      label: 'Delay (ms)', 
      min: 0, 
      max: 10000,
      description: 'Delay time (milliseconds)'
    },
    isDirection: { 
      type: 'number', 
      label: 'Is Direction', 
      min: 0, 
      max: 1,
      description: 'Direction setting (0=Forward, 1=Reverse)'
    }
  },
  
  // Device description
  description: 'Curtain controller, supports open, close, and stop operations',
  
  // Device icon
  icon: 'CURTAIN.png',
  
  // Device category
  category: 'curtain'
};

export default CURTAIN_CONFIG; 