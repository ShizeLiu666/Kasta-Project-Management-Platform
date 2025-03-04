/**
 * VCAL_SOCKET Device Configuration
 * Defines the properties and form configuration for VCAL Socket devices
 */

const BACKLIGHT_LEVELS = {
  LOW: 5,     // Low backlight level (0-5)
  MEDIUM: 15, // Medium backlight level (6-15)
  HIGH: 30    // High backlight level (16-30)
};

const VCAL_SOCKET_CONFIG = {
  // Device attributes configuration
  attributes: {
    power: { 
      type: 'select', 
      label: 'Power', 
      options: [0, 1],
      optionLabels: ['Off', 'On'],
      description: 'Power state (0=Off, 1=On)'
    },
    lockStatus: {
      type: 'select',
      label: 'Lock Status',
      options: [0, 1],
      optionLabels: ['Lock', 'Unlock'],
      description: 'Lock status (0=Lock, 1=Unlock)'
    },
    backLight: {
      type: 'number',
      label: 'Back Light',
      min: 0,
      max: 30,
      description: 'Backlight level (0-5=Low, 6-15=Medium, 16-30=High)'
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
  description: 'VCAL socket device with power, lock, and backlight control',

  // Device icon
  icon: 'VCAL_SOCKET.png',

  // Device category
  category: 'socket',

  // Helper functions for VCAL socket state display
  helpers: {
    getPowerStateText: (state) => {
      switch (Number(state)) {
        case 0: return 'Off';
        case 1: return 'On';
        default: return '-';
      }
    },
    getLockStatusText: (status) => {
      switch (Number(status)) {
        case 0: return 'Lock';
        case 1: return 'Unlock';
        default: return '-';
      }
    },
    getBackLightText: (level) => {
      if (level === undefined || level === null) return '-';
      const numLevel = Number(level);
      if (numLevel <= BACKLIGHT_LEVELS.LOW) return 'Low';
      if (numLevel <= BACKLIGHT_LEVELS.MEDIUM) return 'Medium';
      if (numLevel <= BACKLIGHT_LEVELS.HIGH) return 'High';
      return '-';
    },
    getDelayMinutes: (delay) => {
      if (delay === undefined || delay === null) return '-';
      return `${delay} min`;
    }
  }
};

export default VCAL_SOCKET_CONFIG; 