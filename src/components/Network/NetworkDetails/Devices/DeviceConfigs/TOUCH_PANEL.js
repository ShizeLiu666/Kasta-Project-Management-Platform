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
      label: 'Sleep Timer (seconds)',
      min: 0,
      description: 'Sleep timer in seconds'
    },
    {
      name: 'remoteBind',
      type: 'custom',
      component: 'RemoteBindEditor',
      config: {
        template: [
          {
            bindType: 0,    // 0=device, 2=group
            bindId: 0,      // target device/group ID
            hole: 1,        // button position
            // bindChannel: 0  // 0=left, 1=right
          }
        ],
        fields: {
          bindType: { 
            label: 'Binding Type', 
            type: 'select',
            options: [0, 2],
            optionLabels: ['Device', 'Group'],
            description: 'Type of target to bind (Device or Group)'
          },
          bindId: { 
            label: 'Target ID', 
            type: 'number',
            description: 'ID of the target device or group'
          },
          hole: { 
            label: 'Button Position', 
            type: 'select', 
            options: [1, 2, 3, 4, 5, 6], 
            optionLabels: ['Button 1', 'Button 2', 'Button 3', 'Button 4', 'Button 5', 'Button 6'],
            description: 'Which button to bind'
          },
          // bindChannel: { 
          //   label: 'Target Channel', 
          //   type: 'select', 
          //   options: [0, 1], 
          //   optionLabels: ['Left Channel', 'Right Channel'],
          //   description: 'Which channel of the target to control'
          // }
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