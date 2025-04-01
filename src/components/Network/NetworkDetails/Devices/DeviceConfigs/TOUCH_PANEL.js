/**
 * TOUCH_PANEL Device Configuration
 * Defines the properties and form configuration for Touch Panel devices
 */

const TOUCH_PANEL_CONFIG = {
  fields: [
    {
      name: 'isHorizontal',
      type: 'select',
      label: 'Orientation',
      options: [0, 1],
      optionLabels: ['Vertical', 'Horizontal'],
      description: 'Panel orientation (0=Vertical, 1=Horizontal)'
    },
    {
      name: 'backLightEnabled',
      type: 'select',
      label: 'Backlight',
      options: [0, 1],
      optionLabels: ['Off', 'On'],
      description: 'Enable or disable the backlight'
    },
    {
      name: 'blColorId',
      type: 'number',
      label: 'Backlight Color ID',
      min: 0,
      max: 255,
      description: 'Color ID for the backlight (0-255)'
    },
    {
      name: 'sleepTimer',
      type: 'number',
      label: 'Sleep Timer',
      min: 0,
      max: 60,
      description: 'Sleep timer in minutes (0-60)'
    },
    {
      name: 'remoteBind',
      type: 'custom',
      component: 'RemoteBindEditor',
      config: {
        template: [
          {
            bindType: 0,
            bindId: 0,
            hour: 0,
            min: 0,
            state: 0,
            enable: 1,
            hasTimer: 0,
            hole: 1,
            bindChannel: 0
          }
        ],
        fields: {
          bindType: { label: 'Binding Type', type: 'number'},
          bindId: { label: 'Binding ID (did)', type: 'number'},
          hour: { label: 'Hour (0-23)', type: 'number', min: 0, max: 23},
          min: { label: 'Minute (0-59)', type: 'number', min: 0, max: 59},
          state: { 
            label: 'State (after timer)', 
            type: 'select', 
            options: [0, 1], 
            optionLabels: ['Off', 'On'],  
          },
          enable: { 
            label: 'Enable Status', 
            type: 'select', 
            options: [0, 1], 
            optionLabels: ['Disabled', 'Enabled'], 
          },
          hasTimer: { 
            label: 'Timer', 
            type: 'select', 
            options: [0, 1], 
            optionLabels: ['No Timer', 'Has Timer'],
          },
          hole: { 
            label: 'Button Position', 
            type: 'select', 
            options: [1, 2, 3, 4, 5, 6], 
            optionLabels: ['Button 1', 'Button 2', 'Button 3', 'Button 4', 'Button 5', 'Button 6'], 
          },
          bindChannel: { 
            label: 'Binding Channel', 
            type: 'select', 
            options: [0, 1], 
            optionLabels: ['Left Channel', 'Right Channel'], 
          }
        }
      }
    }
  ],
  
  // Device description
  description: 'Touch panel device with multiple buttons and backlight support',
  
  // Device category
  category: 'panel'
};

export default TOUCH_PANEL_CONFIG; 