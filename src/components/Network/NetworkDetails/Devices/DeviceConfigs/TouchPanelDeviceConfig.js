/**
 * Touch Panel Device Configuration
 */

// 设备系列配置
export const PANEL_SERIES = {
  BWS: {
    name: 'Standard Panel',
    hasBacklight: true,
    buttonCounts: [1, 2, 3, 4, 6],
    prefix: 'BWS'
  },
  T3: {
    name: 'T3 Version',
    hasBacklight: true,
    buttonCounts: [1, 2, 3, 4, 6],
    prefix: 'KT',
    suffix: 'RSB'
  },
  D8: {
    name: 'D8 Version',
    hasBacklight: true,
    buttonCounts: [1, 2, 3, 4, 6],
    prefix: 'KD',
    suffix: 'RSB'
  },
  EDGY: {
    name: 'Edgy Version',
    hasBacklight: true,
    buttonCounts: [1, 2, 3, 4, 5, 6],
    prefix: 'EDGY',
    suffix: 'RB'
  },
  INTEGRAL: {
    name: 'Push-button with backlight',
    hasBacklight: true,
    buttonCounts: [1, 2, 3, 4, 5, 6],
    prefix: 'INTEGRAL',
    suffix: 'RB'
  },
  HESPERUS: {
    name: 'Push-button no backlight',
    hasBacklight: false,
    buttonCounts: [1, 2, 3, 4, 6],
    prefix: 'HESPERUS',
    suffix: 'CSB'
  },
  P_VERSION: {
    name: 'P Version',
    hasBacklight: true,
    buttonCounts: [1, 2, 3, 4, 6],
    prefix: 'KD',
    suffix: 'RS'
  },
  CO_BASE: {
    name: 'Co Base Version',
    hasBacklight: true,
    buttonCounts: [1, 2, 3, 4, 5, 6],
    prefix: 'HS',
    suffix: 'RSCB'
  }
};

// 特殊面板配置
export const SPECIAL_PANELS = {
  CW_PANEL: {
    name: 'CCT Panel',
    buttonCount: 2,
    hasBacklight: true,
    type: 'CCT'
  },
  RGB_PANEL: {
    name: 'RGB Panel',
    buttonCount: 3,
    hasBacklight: true,
    type: 'RGB'
  },
  RGBCW_PANEL: {
    name: 'RGBCW Panel',
    buttonCount: 4,
    hasBacklight: true,
    type: 'RGBCW'
  }
};

// 默认属性值
export const DEFAULT_ATTRIBUTES = {
  isHorizontal: 0,          // 默认垂直
  blColorId: 0,            // 默认背光颜色
  backLightEnabled: 1,     // 默认开启背光
  sleepTimer: 0,           // 默认不休眠
  remoteBind: []           // 默认无绑定
};

// 属性验证规则
export const ATTRIBUTE_RULES = {
  isHorizontal: {
    type: 'select',
    options: [0, 1],
    labels: ['Vertical', 'Horizontal'],
    required: true
  },
  blColorId: {
    type: 'number',
    min: 0,
    max: 255,
    required: true
  },
  backLightEnabled: {
    type: 'select',
    options: [0, 1],
    labels: ['Off', 'On'],
    required: true
  },
  sleepTimer: {
    type: 'number',
    min: 0,
    max: 60,
    required: true
  },
  remoteBind: {
    type: 'array',
    required: true
  }
};

// 辅助函数
export const helpers = {
  // 获取设备按钮数量
  getButtonCount: (deviceType) => {
    if (SPECIAL_PANELS[deviceType]) {
      return SPECIAL_PANELS[deviceType].buttonCount;
    }
    return parseInt(deviceType.match(/\d/)?.[0]) || 1;
  },

  // 检查设备是否支持背光
  hasBacklight: (deviceType) => {
    if (SPECIAL_PANELS[deviceType]) {
      return SPECIAL_PANELS[deviceType].hasBacklight;
    }
    return !deviceType.includes('HESPERUS');
  },

  // 获取设备图标
  getDeviceIcon: (deviceType, isHorizontal) => {
    const buttonCount = helpers.getButtonCount(deviceType);
    const orientation = isHorizontal === 1 ? 'h' : 'v';
    return `TOUCH_PANEL_${buttonCount}_${orientation}.png`;
  },

  // 验证设备属性
  validateAttributes: (attributes) => {
    const errors = [];
    Object.entries(ATTRIBUTE_RULES).forEach(([key, rules]) => {
      const value = attributes[key];
      if (rules.required && (value === undefined || value === null)) {
        errors.push(`${key} is required`);
      }
      if (rules.type === 'number' && (value < rules.min || value > rules.max)) {
        errors.push(`${key} must be between ${rules.min} and ${rules.max}`);
      }
      if (rules.type === 'select' && !rules.options.includes(value)) {
        errors.push(`${key} must be one of ${rules.options.join(', ')}`);
      }
    });
    return errors;
  }
};

export default {
  PANEL_SERIES,
  SPECIAL_PANELS,
  DEFAULT_ATTRIBUTES,
  ATTRIBUTE_RULES,
  helpers
}; 