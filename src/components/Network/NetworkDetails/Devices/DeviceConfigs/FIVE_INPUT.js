/**
 * FIVE_INPUT Device Configuration
 * Defines the properties and form configuration for FIVE_INPUT devices
 */

const FIVE_INPUT_CONFIG = {
  fields: [
    {
      name: 'isConfig',
      type: 'select',
      label: 'Configuration Status',
      options: [0, 1],
      optionLabels: ['Not Configured', 'Configured']
    },
    {
      name: 'remoteBind',
      type: 'custom',
      component: 'RemoteBindEditor',
      config: {
        template: [
          {
            inputType: 0,
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
          inputType: { 
            label: 'Input Type', 
            type: 'select',
            options: [0, 1],
            optionLabels: ['Toggle', 'Momentary']
          },
          bindType: { 
            label: 'Binding Type', 
            type: 'number'
          },
          bindId: { 
            label: 'Binding ID (did)', 
            type: 'number'
          },
          hour: { 
            label: 'Hour (0-23)', 
            type: 'number', 
            min: 0, 
            max: 23
          },
          min: { 
            label: 'Minute (0-59)', 
            type: 'number', 
            min: 0, 
            max: 59
          },
          state: { 
            label: 'State', 
            type: 'select', 
            options: [0, 1], 
            optionLabels: ['Off', 'On']
          },
          enable: { 
            label: 'Enable Status', 
            type: 'select', 
            options: [0, 1], 
            optionLabels: ['Disabled', 'Enabled']
          },
          hasTimer: { 
            label: 'Timer', 
            type: 'select', 
            options: [0, 1],
            optionLabels: ['Disabled', 'Enabled']
          },
          hole: { 
            label: 'Input Position (1-5)', 
            type: 'select', 
            options: [1, 2, 3, 4, 5], 
            optionLabels: ['Input 1', 'Input 2', 'Input 3', 'Input 4', 'Input 5']
          },
          bindChannel: { 
            label: 'Binding Channel', 
            type: 'select', 
            options: [0, 1], 
            optionLabels: ['Left Channel', 'Right Channel']
          }
        }
      }
    }
  ],
  
  // Device description
  description: 'Five-input device with multiple binding and timer functions',
  
  // Device icon
  icon: 'FIVE_INPUT.png',
  
  // Device category
  category: 'input'
};

export default FIVE_INPUT_CONFIG;
