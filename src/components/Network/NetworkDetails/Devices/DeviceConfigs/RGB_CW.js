/**
 * RGB_CW Device Configuration
 * Defines the properties and form configuration for RGB+CW (RGB + Color White) devices
 */
// productTypeAttributesMap.put(ProductTypeEnum.RGB_CW.getPid(), new HashSet<>(Arrays.asList("power", "level", "colorTemperature", "red", "green", "blue", "blinkSpeed", "delay", "isRgb")));
const RGB_CW_CONFIG = {
  // Device attributes configuration
  attributes: {
    power: { 
      type: 'select', 
      label: 'Power', 
      options: [0, 1],
      optionLabels: ['Off', 'On'],
      description: 'Power state (0=Off, 1=On)'
    },
    level: { 
      type: 'number', 
      label: 'level', 
      min: 0, 
      max: 255,
      description: 'level (0-255, displays as 0-100%)'
    },
    colorTemperature: { 
      type: 'number', 
      label: 'Color Temp', 
      min: 0, 
      max: 65535,
      description: 'Color temperature raw value (0-65535)'
    },
    red: { 
      type: 'number', 
      label: 'Red', 
      min: 0, 
      max: 255,
      description: 'Red color component (0-255)'
    },
    green: { 
      type: 'number', 
      label: 'Green', 
      min: 0, 
      max: 255,
      description: 'Green color component (0-255)'
    },
    blue: { 
      type: 'number', 
      label: 'Blue', 
      min: 0, 
      max: 255,
      description: 'Blue color component (0-255)'
    },
    blinkSpeed: { 
      type: 'select', 
      label: 'Blink Speed', 
      options: [-1, 0, 1, 2],
      optionLabels: ['None', 'Slow', 'Medium', 'Fast'],
      description: 'Blinking speed (-1=None, 0=Slow, 1=Medium, 2=Fast)'
    },
    delay: { 
      type: 'number', 
      label: 'Delay', 
      min: 0, 
      max: 59,
      description: 'Delay time in minutes (0-59)'
    },
    isRgb: { 
      type: 'select', 
      label: 'Mode', 
      options: [0, 1],
      optionLabels: ['Color Temperature', 'RGB'],
      description: 'Device mode (0=Color Temperature, 1=RGB)'
    }
  },
  
  // Device description
  description: 'RGB+CW light, supports both RGB color and color temperature adjustment',
  
  // Device icon
  icon: 'RGB_CW.png',
  
  // Device category
  category: 'lighting',
  
  // Helper functions for RGB_CW state display
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
    getBlinkSpeedText: (speed) => {
      switch (Number(speed)) {
        case -1: return 'None';
        case 0: return 'Slow';
        case 1: return 'Medium';
        case 2: return 'Fast';
        default: return '-';
      }
    },
    getModeText: (isRgb) => {
      switch (Number(isRgb)) {
        case 0: return 'Color Temperature';
        case 1: return 'RGB';
        default: return '-';
      }
    },
    getDelayMinutes: (delay) => {
      if (delay === undefined || delay === null) return '-';
      return `${delay} min`;
    },
    // Convert RGB values to hex color code
    rgbToHex: (r, g, b) => {
      if (r === undefined || g === undefined || b === undefined) return '#000000';
      return `#${[r, g, b].map(x => {
        const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      }).join('')}`;
    }
  }
};

export default RGB_CW_CONFIG; 