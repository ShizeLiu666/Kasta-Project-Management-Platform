/**
 * FIVE_BUTTON Device Configuration
 * Defines the properties and form configuration for FIVE_BUTTON devices
 */

const FIVE_BUTTON_CONFIG = {
  fields: [
    {
      name: 'checkTime',
      type: 'text',
      label: 'Check Time',
      placeholder: 'YYYY-MM-DD HH:MM:SS',
      description: 'Device check time'
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
            label: 'Enable Status (Whether timer is effective)', 
            type: 'select', 
            options: [0, 1], 
            optionLabels: ['Disabled', 'Enabled'], 
          },
          hasTimer: { 
            label: 'Timer (Has timer or not)', 
            type: 'select', 
            options: [0, 1], 
          },
          hole: { 
            label: 'Button Position (1-5)', 
            type: 'select', 
            options: [1, 2, 3, 4, 5], 
            optionLabels: ['Button 1', 'Button 2', 'Button 3', 'Button 4', 'Button 5'], 
          },
          bindChannel: { 
            label: 'Binding Channel (Left or right channel)', 
            type: 'select', 
            options: [0, 1], 
            optionLabels: ['Left Channel', 'Right Channel'], 
          }
        }
      }
    }
  ],
  
  // Device description
  description: 'Five-button remote control with multiple binding and timer functions',
  
  // Device icon
  icon: 'FIVE_BUTTON.png',
  
  // Device category
  category: 'remote'
};

export default FIVE_BUTTON_CONFIG; 