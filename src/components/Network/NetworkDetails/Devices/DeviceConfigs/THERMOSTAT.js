/**
 * THERMOSTAT Device Configuration
 * Defines the properties and form configuration for Thermostat devices
 */

const MODE_TYPES = {
  COOL: 0,    // Cooling mode
  FAN: 1,     // Fan only mode
  HEAT: 2,    // Heating mode
  AUTO: 3     // Auto mode
};

const FAN_SPEEDS = {
  AUTO: 0,    // Auto speed
  SLOW: 1,    // Slow speed
  MEDIUM: 2,  // Medium speed
  FAST: 3     // Fast speed
};

const THERMOSTAT_CONFIG = {
  // Device attributes configuration
  attributes: {
    power: { 
      type: 'select', 
      label: 'Power', 
      options: [0, 1],
      optionLabels: ['Off', 'On'],
      description: 'Power state (0=Off, 1=On)'
    },
    mode: {
      type: 'select',
      label: 'Mode',
      options: [0, 1, 2, 3],
      optionLabels: ['Cool', 'Fan', 'Heat', 'Auto'],
      description: 'Operation mode (0=Cool, 1=Fan, 2=Heat, 3=Auto)'
    },
    setTemperature: {
      type: 'number',
      label: 'Set Temperature',
      min: 160,  // 16.0°C
      max: 320,  // 32.0°C
      description: 'Target temperature (value will be multiplied by 0.1)'
    },
    currentTemperature: {
      type: 'number',
      label: 'Current Temperature',
      isReadOnly: true,
      description: 'Current temperature (value will be multiplied by 0.1)'
    },
    fanSpeed: {
      type: 'select',
      label: 'Fan Speed',
      options: [0, 1, 2, 3],
      optionLabels: ['Auto', 'Slow', 'Medium', 'Fast'],
      description: 'Fan speed setting (0=Auto, 1=Slow, 2=Medium, 3=Fast)'
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
  description: 'Thermostat device with temperature control and fan speed settings',

  // Device icon
  icon: 'THERMOSTAT.png',

  // Device category
  category: 'climate',

  // Helper functions for thermostat state display
  helpers: {
    getPowerStateText: (state) => {
      switch (Number(state)) {
        case 0: return 'Off';
        case 1: return 'On';
        default: return '-';
      }
    },
    getModeText: (mode) => {
      switch (Number(mode)) {
        case MODE_TYPES.COOL: return 'Cool';
        case MODE_TYPES.FAN: return 'Fan';
        case MODE_TYPES.HEAT: return 'Heat';
        case MODE_TYPES.AUTO: return 'Auto';
        default: return '-';
      }
    },
    getTemperatureText: (temp) => {
      if (temp === undefined || temp === null) return '-';
      return `${(Number(temp) * 0.1).toFixed(1)}°C`;
    },
    getFanSpeedText: (speed) => {
      switch (Number(speed)) {
        case FAN_SPEEDS.AUTO: return 'Auto';
        case FAN_SPEEDS.SLOW: return 'Slow';
        case FAN_SPEEDS.MEDIUM: return 'Medium';
        case FAN_SPEEDS.FAST: return 'Fast';
        default: return '-';
      }
    },
    getDelayMinutes: (delay) => {
      if (delay === undefined || delay === null) return '-';
      return `${delay} min`;
    }
  }
};

export default THERMOSTAT_CONFIG; 