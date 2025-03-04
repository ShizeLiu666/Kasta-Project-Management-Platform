/**
 * T3_SWITCH Device Configuration
 * Defines the properties and form configuration for T3 Switch devices
 */

const T3_SWITCH_CONFIG = {
  // Device attributes configuration
  attributes: {
    powerFirst: { 
      type: 'select', 
      label: 'Power 1', 
      options: [0, 1],
      optionLabels: ['Off', 'On'],
      description: 'Power state for switch 1'
    },
    powerSecond: { 
      type: 'select', 
      label: 'Power 2', 
      options: [0, 1],
      optionLabels: ['Off', 'On'],
      description: 'Power state for switch 2'
    },
    powerThird: { 
      type: 'select', 
      label: 'Power 3', 
      options: [0, 1],
      optionLabels: ['Off', 'On'],
      description: 'Power state for switch 3'
    },
    delayFirst: {
      type: 'number',
      label: 'Delay 1',
      min: 0,
      max: 59,
      description: 'Delay time in minutes for switch 1'
    },
    delaySecond: {
      type: 'number',
      label: 'Delay 2',
      min: 0,
      max: 59,
      description: 'Delay time in minutes for switch 2'
    },
    delayThird: {
      type: 'number',
      label: 'Delay 3',
      min: 0,
      max: 59,
      description: 'Delay time in minutes for switch 3'
    }
  },

  // Device description
  description: 'Triple switch device with individual power and delay control',

  // Device icon
  icon: 'T3_SWITCH.png',

  // Device category
  category: 'switch',

  // Helper functions for T3 switch state display
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

export default T3_SWITCH_CONFIG; 