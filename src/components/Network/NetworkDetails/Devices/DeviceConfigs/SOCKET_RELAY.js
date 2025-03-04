/**
 * SOCKET_RELAY Device Configuration
 * Defines the properties and form configuration for Socket Relay devices
 */
// productTypeAttributesMap.put(ProductTypeEnum.SOCKET_RELAY.getPid(), new HashSet<>(Arrays.asList("power", "delay", "socketErrors", "pValue")));

// Error type constants (integer values)
const ERROR_TYPES = {
  ERR_LOW: 0,       // Low energy level (0x00)
  ERR_THRESHOLD: 1, // Energy below threshold (0x01)
  ERR_CONFIG: 80,   // Energy threshold configuration (0x50)
  ERR_ENABLED: 81,  // Energy alert enabled (0x51)
  ERR_DISABLED: 82  // Energy alert disabled (0x52)
};

// Channel constants
const CHANNELS = {
  LEFT: 0,
  RIGHT: 1
};

// Valid error type values
const VALID_ERROR_TYPES = new Set([
  ERROR_TYPES.ERR_LOW,      // 0
  ERROR_TYPES.ERR_THRESHOLD, // 1
  ERROR_TYPES.ERR_CONFIG,    // 80 (0x50)
  ERROR_TYPES.ERR_ENABLED,   // 81 (0x51)
  ERROR_TYPES.ERR_DISABLED   // 82 (0x52)
]);

const SOCKET_RELAY_CONFIG = {
  // Device attributes configuration
  attributes: {
    power: { 
      type: 'select', 
      label: 'Power', 
      options: [0, 1],
      optionLabels: ['Off', 'On'],
      description: 'Power state (0=Off, 1=On)'
    },
    delay: { 
      type: 'number', 
      label: 'Delay', 
      min: 0, 
      max: 59,
      description: 'Delay time in minutes (0-59)'
    },
    pValue: {
      type: 'number',
      label: 'Power Value',
      description: 'Current power consumption value',
      isReadOnly: true
    },
    socketErrors: {
      type: 'array',
      label: 'Error Logs',
      description: 'Socket error logs',
      isReadOnly: true,
      isInternal: true,
      fields: {
        errorType: {
          type: 'number',
          description: 'Error type: 0=Low Energy, 1=Threshold Warning, 80(0x50)=Config Error, 81(0x51)=Alert Enabled, 82(0x52)=Alert Disabled',
          validate: (value) => VALID_ERROR_TYPES.has(Number(value))
        },
        value: {
          type: 'number',
          description: 'Error value'
        },
        channel: {
          type: 'number',
          description: 'Product channel (0=Left, 1=Right)'
        }
      }
    }
  },
  
  // Device description
  description: 'Socket relay device with power monitoring capabilities',
  
  // Device icon
  icon: 'SOCKET_RELAY.png',
  
  // Device category
  category: 'switch',
  
  // Helper functions for socket relay state display
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
    },
    getErrorTypeText: (errorType) => {
      const type = Number(errorType);
      if (!VALID_ERROR_TYPES.has(type)) {
        return `Invalid Error Type (${type})`;
      }
      switch (type) {
        case ERROR_TYPES.ERR_LOW:
          return 'Low Energy (0x00)';
        case ERROR_TYPES.ERR_THRESHOLD:
          return 'Threshold Warning (0x01)';
        case ERROR_TYPES.ERR_CONFIG:
          return 'Config Error (0x50)';
        case ERROR_TYPES.ERR_ENABLED:
          return 'Alert Enabled (0x51)';
        case ERROR_TYPES.ERR_DISABLED:
          return 'Alert Disabled (0x52)';
        default:
          return `Unknown (${type})`;
      }
    },
    getErrorDescription: (errorType) => {
      const type = Number(errorType);
      if (!VALID_ERROR_TYPES.has(type)) {
        return 'Invalid error type';
      }
      switch (type) {
        case ERROR_TYPES.ERR_LOW:
          return 'Energy level reached minimum (0x00)';
        case ERROR_TYPES.ERR_THRESHOLD:
          return 'Energy below threshold level (0x01)';
        case ERROR_TYPES.ERR_CONFIG:
          return 'Energy threshold configuration (0x50)';
        case ERROR_TYPES.ERR_ENABLED:
          return 'Energy alert system enabled (0x51)';
        case ERROR_TYPES.ERR_DISABLED:
          return 'Energy alert system disabled (0x52)';
        default:
          return 'Unknown error type';
      }
    },
    getChannelText: (channel) => {
      switch (Number(channel)) {
        case CHANNELS.LEFT: return 'Left';
        case CHANNELS.RIGHT: return 'Right';
        default: return `Channel ${channel}`;
      }
    },
    // Get summary of errors for display in table
    getErrorSummary: (errors) => {
      if (!errors || !Array.isArray(errors) || errors.length === 0) {
        return { hasErrors: false, summary: 'No Errors' };
      }
      
      // Count errors by channel
      const channelCounts = {};
      errors.forEach(error => {
        const channelKey = error.channel.toString();
        if (!channelCounts[channelKey]) {
          channelCounts[channelKey] = 0;
        }
        channelCounts[channelKey]++;
      });
      
      // Create summary text
      const channelSummaries = Object.keys(channelCounts).map(channel => {
        const channelText = Number(channel) === CHANNELS.LEFT ? 'Left' : 
                           Number(channel) === CHANNELS.RIGHT ? 'Right' : 
                           `Channel ${channel}`;
        return `${channelText}: ${channelCounts[channel]}`;
      });
      
      return { 
        hasErrors: true, 
        count: errors.length,
        channelCounts,
        summary: channelSummaries.join(', '),
        latestError: errors[errors.length - 1]
      };
    }
  }
};

export default SOCKET_RELAY_CONFIG; 