/**
 * POWER_POINT Device Configuration
 * Defines the properties and form configuration for Power Point devices
 */

const POWER_POINT_CONFIG = {
  // Device attributes configuration
  attributes: {
    power: {
      type: 'select',
      label: 'Power',
      options: [0, 1],
      optionLabels: ['Off', 'On'],
      description: 'Main power state'
    },
    leftPower: {
      type: 'select',
      label: 'Left Power',
      options: [0, 1],
      optionLabels: ['Off', 'On'],
      description: 'Left socket power state'
    },
    rightPower: {
      type: 'select',
      label: 'Right Power',
      options: [0, 1],
      optionLabels: ['Off', 'On'],
      description: 'Right socket power state'
    },
    leftName: {
      type: 'text',
      label: 'Left Name',
      description: 'Name for left socket'
    },
    rightName: {
      type: 'text',
      label: 'Right Name',
      description: 'Name for right socket'
    },
    leftLock: {
      type: 'select',
      label: 'Left Lock',
      options: [0, 1],
      optionLabels: ['Lock', 'Unlock'],
      description: 'Lock state for left socket'
    },
    rightLock: {
      type: 'select',
      label: 'Right Lock',
      options: [0, 1],
      optionLabels: ['Lock', 'Unlock'],
      description: 'Lock state for right socket'
    },
    leftDelay: {
      type: 'number',
      label: 'Left Delay',
      min: 0,
      max: 59,
      description: 'Delay time in minutes for left socket'
    },
    rightDelay: {
      type: 'number',
      label: 'Right Delay',
      min: 0,
      max: 59,
      description: 'Delay time in minutes for right socket'
    },
    leftBackLight: {
      type: 'number',
      label: 'Left LED',
      min: 0,
      max: 30,
      description: 'Left LED brightness (0-5=Low, 6-15=Medium, 16-30=High)'
    },
    rightBackLight: {
      type: 'number',
      label: 'Right LED',
      min: 0,
      max: 30,
      description: 'Right LED brightness (0-5=Low, 6-15=Medium, 16-30=High)'
    }
  },

  // Device description
  description: 'Dual socket power point with individual control and LED indicators',

  // Device icon
  icon: 'POWER_POINT.png',

  // Device category
  category: 'power',

  // Helper functions for state display
  helpers: {
    getPowerStateText: (state) => {
      switch (Number(state)) {
        case 0: return 'Off';
        case 1: return 'On';
        default: return '-';
      }
    },
    getLockStateText: (state) => {
      switch (Number(state)) {
        case 0: return 'Lock';
        case 1: return 'Unlock';
        default: return '-';
      }
    },
    getDelayMinutes: (delay) => {
      if (delay === undefined || delay === null) return '-';
      return `${delay}min`;
    },
    getBackLightLevel: (value) => {
      if (value === undefined || value === null) return '-';
      if (value <= 5) return 'Low';
      if (value <= 15) return 'Medium';
      if (value <= 30) return 'High';
      return '-';
    }
  }
};

export default POWER_POINT_CONFIG; 