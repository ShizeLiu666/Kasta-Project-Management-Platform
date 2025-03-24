/**
 * TOUCH_PANEL Device Configuration
 * Defines the properties and form configuration for Touch Panel devices
 */

const TOUCH_PANEL_CONFIG = {
  // Device attributes configuration
  attributes: {
    isHorizontal: { 
      type: 'select', 
      label: 'Orientation', 
      options: [0, 1], 
      optionLabels: ['Horizontal', 'Vertical'],
      description: 'Panel orientation (0=Horizontal, 1=Vertical)'
    },
    blColorId: { 
      type: 'number', 
      label: 'Backlight Color ID', 
      min: 0, 
      max: 255,
      description: 'Color ID for the backlight'
    },
    activeButtonIdx: { 
      type: 'number', 
      label: 'Active Button Index', 
      min: 1, 
      max: 5,
      description: 'Index of the currently active button'
    },
    backLightEnabled: { 
      type: 'select', 
      label: 'Backlight', 
      options: [0, 1], 
      optionLabels: ['Off', 'On'],
      description: 'Enable or disable the backlight'
    },
    sleepTimer: { 
      type: 'number', 
      label: 'Sleep Timer', 
      min: 0, 
      max: 60,
      description: 'Sleep timer in minutes'
    },
    remoteBind: { 
      type: 'array', 
      label: 'Remote Bindings', 
      description: 'Button bindings to other devices',
      isComplex: true
    }
  },
  
  // Device description
  description: 'Touch panel device with multiple buttons and backlight',
  
  // Device icon
  icon: 'TOUCH_PANEL.png',
  
  // Device category
  category: 'panel',
  
  // Helper functions for touch panel state display
  helpers: {
    // 获取方向文本 - 修正逻辑
    getOrientationText: (isHorizontal) => {
      if (isHorizontal === undefined || isHorizontal === null) return 'Unknown';
      return isHorizontal === 0 ? 'Horizontal' : 'Vertical';
    },
    
    // 获取背光状态文本
    getBacklightText: (enabled, colorId) => {
      if (enabled === undefined || enabled === null) return 'Unknown';
      return enabled === 1 ? `On (Color: ${colorId || 0})` : 'Off';
    },
    
    // 获取活动按钮文本
    getActiveButtonText: (buttonIdx, maxButtons) => {
      if (buttonIdx === undefined || buttonIdx === null) return 'None';
      return buttonIdx > 0 && buttonIdx <= maxButtons ? `Button ${buttonIdx}` : 'None';
    },
    
    // 获取绑定摘要
    getBindingSummary: (bindings) => {
      if (!bindings || !Array.isArray(bindings) || bindings.length === 0) {
        return { hasBindings: false, summary: 'No Bindings' };
      }
      
      // 按按钮分组
      const buttonBindings = {};
      bindings.forEach(binding => {
        const hole = binding.hole || 1;
        if (!buttonBindings[hole]) {
          buttonBindings[hole] = [];
        }
        buttonBindings[hole].push(binding);
      });
      
      return { 
        hasBindings: true, 
        count: bindings.length,
        buttonBindings,
        summary: `${bindings.length} binding(s) across ${Object.keys(buttonBindings).length} button(s)`
      };
    }
  }
};

export default TOUCH_PANEL_CONFIG; 