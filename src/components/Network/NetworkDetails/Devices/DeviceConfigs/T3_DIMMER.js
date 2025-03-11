/**
 * T3_DIMMER Device Configuration
 * Defines the properties and form configuration for T3 Dimmer devices
 */

const T3_DIMMER_CONFIG = {
  // Device attributes configuration
  attributes: {
    powerFirst: { 
      type: 'select', 
      label: 'Power 1', 
      options: [0, 1],
      optionLabels: ['Off', 'On'],
      description: 'Power state for dimmer 1'
    },
    powerSecond: { 
      type: 'select', 
      label: 'Power 2', 
      options: [0, 1],
      optionLabels: ['Off', 'On'],
      description: 'Power state for dimmer 2'
    },
    powerThird: { 
      type: 'select', 
      label: 'Power 3', 
      options: [0, 1],
      optionLabels: ['Off', 'On'],
      description: 'Power state for dimmer 3'
    },
    levelFirst: {
      type: 'number',
      label: 'Brightness 1',
      min: 0,
      max: 255,
      description: 'Brightness level for dimmer 1 (0-255, displayed as percentage)'
    },
    levelSecond: {
      type: 'number',
      label: 'Brightness 2',
      min: 0,
      max: 255,
      description: 'Brightness level for dimmer 2 (0-255, displayed as percentage)'
    },
    levelThird: {
      type: 'number',
      label: 'Brightness 3',
      min: 0,
      max: 255,
      description: 'Brightness level for dimmer 3 (0-255, displayed as percentage)'
    },
    delayFirst: {
      type: 'number',
      label: 'Delay 1',
      min: 0,
      max: 59,
      description: 'Delay time in minutes for dimmer 1'
    },
    delaySecond: {
      type: 'number',
      label: 'Delay 2',
      min: 0,
      max: 59,
      description: 'Delay time in minutes for dimmer 2'
    },
    delayThird: {
      type: 'number',
      label: 'Delay 3',
      min: 0,
      max: 59,
      description: 'Delay time in minutes for dimmer 3'
    }
  },

  // Device description
  description: 'Triple dimmer device with individual power, brightness and delay control',

  // Device icon
  icon: 'T3_DIMMER.png',

  // Device category
  category: 'dimmer',

  // Helper functions for T3 dimmer state display
  helpers: {
    getPowerStateText: (state) => {
      switch (Number(state)) {
        case 0: return 'Off';
        case 1: return 'On';
        default: return '-';
      }
    },
    getLevelPercentage: (level) => {
      if (level === undefined || level === null) return '-';
      const percentage = Math.round((level / 255) * 100);
      return `${percentage}%`;
    },
    getDelayMinutes: (delay) => {
      if (delay === undefined || delay === null) return '-';
      return `${delay} min`;
    }
  }
};

export default T3_DIMMER_CONFIG; 