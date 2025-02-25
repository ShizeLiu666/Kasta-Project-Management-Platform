/**
 * CCT_DOWNLIGHT Device Configuration
 * Defines the properties and form configuration for CCT_DOWNLIGHT devices
 */

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
      label: 'Brightness Level', 
      min: 0, 
      max: 100,
      description: 'Brightness level (0-100)'
    },
    colorTemperature: { 
      type: 'number', 
      label: 'Color Temperature', 
      min: 2700, 
      max: 6500,
      description: 'Color temperature (2700K-6500K)'
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
  description: 'CCT adjustable downlight, supports brightness and color temperature adjustment',
  
  // Device icon
  icon: 'CCT_DOWNLIGHT.png',
  
  // Device category
  category: 'lighting'
};

export default CCT_DOWNLIGHT_CONFIG; 