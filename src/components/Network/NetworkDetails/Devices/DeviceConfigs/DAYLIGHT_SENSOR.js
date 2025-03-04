/**
 * DAYLIGHT_SENSOR Device Configuration
 * Defines the attributes and helper functions for daylight sensor devices
 */

// Configuration for DAYLIGHT_SENSOR device type
const DAYLIGHT_SENSOR_CONFIG = {
  // Define fields for the device
  fields: [
    {
      name: 'power',
      type: 'select',
      label: 'Power',
      options: [0, 1],
      optionLabels: ['Off', 'On']
    },
    {
      name: 'sensorBindID',
      type: 'number',
      label: 'Sensor Bind ID',
      description: 'ID of the device to bind with this sensor'
    }
  ],
  
  // Helper functions for formatting display values
  helpers: {
    // Format power state display
    getPowerStateText: (value) => {
      if (value === 1) return 'On';
      if (value === 0) return 'Off';
      return '-';
    },
    
    // Format sensor bind ID display
    getSensorBindIDText: (value) => {
      if (value === undefined || value === null) return '-';
      return value.toString();
    }
  }
};

export default DAYLIGHT_SENSOR_CONFIG; 