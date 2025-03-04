/**
 * DRY_CONTACT Device Configuration
 * Defines the properties and form configuration for Dry Contact devices
 */

const DRY_TYPE = {
  TOGGLE: 0,     // Toggle mode
  MOMENT_1S: 1,  // Momentary 1 second
  MOMENT_6S: 6,  // Momentary 6 seconds
  MOMENT_9S: 9   // Momentary 9 seconds
};

const DRY_CONTACT_CONFIG = {
  // Device attributes configuration
  attributes: {
    power: { 
      type: 'select', 
      label: 'Power', 
      options: [0, 1],
      optionLabels: ['Off', 'On'],
      description: 'Power state (0=Off, 1=On)'
    },
    dryType: {
      type: 'select',
      label: 'Type',
      options: [0, 1, 6, 9],
      optionLabels: ['Toggle', 'Momentary 1s', 'Momentary 6s', 'Momentary 9s'],
      description: 'Contact type (0=Toggle, 1/6/9=Momentary duration in seconds)'
    },
    isConfig: {
      type: 'select',
      label: 'Configured',
      options: [0, 1],
      optionLabels: ['No', 'Yes'],
      description: 'Configuration status'
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
  description: 'Dry contact device with configurable contact types',

  // Device icon
  icon: 'DRY_CONTACT.png',

  // Device category
  category: 'switch',

  // Helper functions for dry contact state display
  helpers: {
    getPowerStateText: (state) => {
      switch (Number(state)) {
        case 0: return 'Off';
        case 1: return 'On';
        default: return '-';
      }
    },
    getDryTypeText: (type) => {
      const numType = Number(type);
      switch (numType) {
        case DRY_TYPE.TOGGLE:
          return 'Toggle';
        case DRY_TYPE.MOMENT_1S:
          return 'Momentary 1s';
        case DRY_TYPE.MOMENT_6S:
          return 'Momentary 6s';
        case DRY_TYPE.MOMENT_9S:
          return 'Momentary 9s';
        default:
          return '-';
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
    }
  }
};

export default DRY_CONTACT_CONFIG; 