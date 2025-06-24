/**
 * 遥控器参数转换模块 (conversion/RemoteParameters.js)
 * 
 * 支持的参数类型：
 * 1. BACKLIGHT (背光控制)：
 *    - ENABLED (启用): 1
 *    - DISABLED (禁用): 0
 * 
 * 2. BACKLIGHT_COLOR (背光颜色)：
 *    - WHITE (白色): 1
 *    - GREEN (绿色): 2  
 *    - BLUE (蓝色): 3
 * 
 * 3. BACKLIGHT_TIMEOUT (背光超时)：
 *    - 30S (30秒): 0
 *    - 1MIN (1分钟): 1
 *    - 2MIN (2分钟): 2
 *    - 3MIN (3分钟): 3
 *    - 5MIN (5分钟): 4
 *    - 10MIN (10分钟): 5
 *    - NEVER (永不): 6
 * 
 * 4. BEEP (蜂鸣器)：
 *    - ENABLED (启用): 1
 *    - DISABLED (禁用): 0
 * 
 * 5. NIGHT_LIGHT (夜灯)：
 *    - LOW (低亮度): 10
 *    - MEDIUM (中亮度): 15
 *    - HIGH (高亮度): 30
 *    - DISABLED (禁用): 0
 * 
 * 核心功能：
 * 1. 默认参数管理：提供标准的默认参数配置
 * 2. 参数值映射：文本值到数值的智能转换
 * 3. 参数验证：基于VALID_PARAMETERS进行参数有效性检查
 * 4. 格式标准化：统一的参数对象格式（text + value）
 * 
 * 输入格式示例：
 * ```
 * REMOTE CONTROL PARAMETER
 * BACKLIGHT: ENABLED
 * BACKLIGHT_COLOR: BLUE
 * BACKLIGHT_TIMEOUT: 2MIN
 * BEEP: DISABLED
 * NIGHT_LIGHT: HIGH
 * ```
 * 
 * 输出格式：
 * ```javascript
 * {
 *   parameters: Map([
 *     ['BACKLIGHT', { text: 'ENABLED', value: 1 }],
 *     ['BACKLIGHT_COLOR', { text: 'BLUE', value: 3 }],
 *     ['BACKLIGHT_TIMEOUT', { text: '2MIN', value: 2 }],
 *     ['BEEP', { text: 'DISABLED', value: 0 }],
 *     ['NIGHT_LIGHT', { text: 'HIGH', value: 30 }]
 *   ])
 * }
 * ```
 * 
 */

import { VALID_PARAMETERS } from '../validation/RemoteParameters';

/**
 * 默认参数配置表
 * 
 * 功能：定义遥控器的标准默认参数
 * 用途：确保所有遥控器都有完整的参数配置
 * 最佳实践：基于用户体验优化的默认值设置
 */
const DEFAULT_PARAMETERS = {
    BACKLIGHT: 'ENABLED',          // 背光默认启用，提升用户体验
    BACKLIGHT_COLOR: 'BLUE',       // 蓝色背光，现代化外观
    BACKLIGHT_TIMEOUT: '1MIN',     // 1分钟超时，平衡节能与便利
    BEEP: 'ENABLED',              // 蜂鸣器默认启用
    NIGHT_LIGHT: 'MEDIUM'         // 中等亮度夜灯，适中的照明效果
};

/**
 * 参数值映射表
 * 
 * 功能：将参数的文本值转换为对应的数值
 * 用途：系统内部使用数值进行参数设置和控制
 * 格式：{ 参数名: { 文本值: 数值 } }
 */
const PARAMETER_VALUES = {
    // 背光开关映射
    BACKLIGHT: {
        'ENABLED': 1,    // 启用背光
        'DISABLED': 0    // 禁用背光
    },
    // 背光颜色映射
    BACKLIGHT_COLOR: {
        'WHITE': 1,      // 白色背光
        'GREEN': 2,      // 绿色背光
        'BLUE': 3        // 蓝色背光
    },
    // 背光超时映射
    BACKLIGHT_TIMEOUT: {
        '30S': 0,        // 30秒后关闭
        '1MIN': 1,       // 1分钟后关闭
        '2MIN': 2,       // 2分钟后关闭
        '3MIN': 3,       // 3分钟后关闭
        '5MIN': 4,       // 5分钟后关闭
        '10MIN': 5,      // 10分钟后关闭
        'NEVER': 6       // 永不关闭
    },
    // 蜂鸣器开关映射
    BEEP: {
        'ENABLED': 1,    // 启用蜂鸣器
        'DISABLED': 0    // 禁用蜂鸣器
    },
    // 夜灯亮度映射
    NIGHT_LIGHT: {
        'LOW': 10,       // 低亮度（10%）
        'MEDIUM': 15,    // 中亮度（15%）
        'HIGH': 30,      // 高亮度（30%）
        'DISABLED': 0    // 禁用夜灯
    }
};

/**
 * 主遥控器参数处理函数
 * 
 * 功能：将Excel中的参数配置转换为标准化的Map格式
 * 处理流程：
 * 1. 初始化默认参数
 * 2. 解析用户自定义参数
 * 3. 验证参数有效性
 * 4. 生成标准化的参数对象
 * 
 * @param {Array} remoteParametersContent - 遥控器参数内容数组
 * @returns {Object} 包含parameters Map的对象
 */
export function processRemoteParameters(remoteParametersContent) {
    // 初始化默认参数：创建包含所有默认值的Map
    const parameters = new Map(
        Object.entries(DEFAULT_PARAMETERS).map(([key, value]) => [
            key,
            { text: value, value: PARAMETER_VALUES[key][value] }
        ])
    );

    // 如果没有参数内容或格式无效，返回默认参数
    if (!remoteParametersContent || !Array.isArray(remoteParametersContent)) {
        return { parameters };
    }

    // 解析用户自定义参数
    remoteParametersContent.forEach(line => {
        line = line.trim();
        
        // 跳过标题行
        if (line.startsWith("REMOTE CONTROL PARAMETER")) {
            return;
        }

        // 解析参数行（格式：参数名: 参数值）
        const [paramName, value] = line.split(':').map(part => part.trim().toUpperCase());
        
        // 验证参数名和参数值的有效性
        if (VALID_PARAMETERS[paramName] && VALID_PARAMETERS[paramName].includes(value)) {
            // 更新参数：覆盖默认值
            parameters.set(paramName, {
                text: value,                           // 保存文本格式
                value: PARAMETER_VALUES[paramName][value]  // 保存数值格式
            });
        }
    });

    return { parameters };
}