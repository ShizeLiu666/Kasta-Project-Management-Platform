/**
 * 干接点模块转换模块 (conversion/DryContactModules.js)
 * 
 * 支持的脉冲类型：
 * 1. NORMAL (正常脉冲): 0 - 标准的开关脉冲
 * 2. 1SEC (1秒脉冲): 1 - 持续1秒的控制脉冲
 * 3. 6SEC (6秒脉冲): 2 - 持续6秒的控制脉冲  
 * 4. 9SEC (9秒脉冲): 3 - 持续9秒的控制脉冲
 * 5. REVERSE (反向脉冲): 4 - 反向控制脉冲
 * 
 * 核心功能：
 * 1. 设备预处理：
 *    - 自动识别所有"Dry Contact"类型的设备
 *    - 为每个设备创建默认配置（NORMAL脉冲）
 *    - 确保所有干接点设备都有完整配置
 * 
 * 2. 配置解析：
 *    - 解析Excel中的模块名称和脉冲类型
 *    - 将脉冲类型文本转换为对应的数值
 *    - 验证设备是否为已注册的干接点设备
 * 
 * 3. 数据转换：
 *    - 生成标准化的干接点配置对象
 *    - 包含设备名称和脉冲类型配置
 *    - 输出为数组格式便于系统处理
 * 
 * 输入格式示例：
 * ```
 * NAME: 干接点模块1
 * 1SEC
 * 
 * NAME: 干接点模块2  
 * REVERSE
 * ```
 * 
 * 输出格式：
 * ```json
 * {
 *   "dryContacts": [
 *     {
 *       "deviceName": "干接点模块1",
 *       "pulse": 1
 *     },
 *     {
 *       "deviceName": "干接点模块2", 
 *       "pulse": 4
 *     }
 *   ]
 * }
 * ```
 * 
 */

import { 
    getDeviceNameToType,
    getRegisteredDevices 
} from './Devices';

/**
 * 脉冲类型映射表
 * 
 * 功能：将脉冲类型文本转换为对应的数值
 * 用途：系统内部使用数值进行脉冲控制
 */
const PULSE_MAPPING = {
    'NORMAL': 0,    // 正常脉冲（默认）
    '1SEC': 1,      // 1秒持续脉冲
    '6SEC': 2,      // 6秒持续脉冲
    '9SEC': 3,      // 9秒持续脉冲
    'REVERSE': 4    // 反向控制脉冲
};

/**
 * 主干接点模块处理函数
 * 
 * 功能：将Excel中的干接点模块配置转换为标准化的JSON格式
 * 依赖：Devices模块（设备类型映射和注册设备列表）
 * 
 * 处理流程：
 * 1. 预处理所有干接点类型设备，创建默认配置
 * 2. 解析Excel中的模块配置
 * 3. 更新指定设备的脉冲类型配置
 * 4. 生成最终的配置数组
 * 
 * @param {Array} dryContactsContent - 干接点模块内容数组
 * @returns {Object} 标准化的干接点配置对象
 */
export function processDryContactModules(dryContactsContent) {
    const registeredDeviceNames = getRegisteredDevices();
    const deviceNameToType = getDeviceNameToType();
    
    const dryContactsMap = new Map();
    let currentDevice = null;

    // 预处理所有干接点类型的设备
    registeredDeviceNames.forEach(deviceName => {
        if (deviceNameToType[deviceName] === "Dry Contact") {
            dryContactsMap.set(deviceName, {
                deviceName: deviceName,
                pulse: 0  // 默认为NORMAL脉冲
            });
        }
    });

    // 处理Excel配置数据
    (dryContactsContent || []).forEach(line => {
        line = line.trim();

        // 解析设备名称行
        if (line.startsWith("NAME:")) {
            currentDevice = line.replace("NAME:", "").trim();
            // 验证设备是否为已注册的干接点设备
            if (!dryContactsMap.has(currentDevice)) {
                console.warn(`Device ${currentDevice} is not a registered Dry Contact device`);
                currentDevice = null;
            }
        } 
        // 解析脉冲类型配置行
        else if (currentDevice && dryContactsMap.has(currentDevice)) {
            const action = line.trim();
            const deviceConfig = dryContactsMap.get(currentDevice);
            // 更新脉冲类型，如果无效则保持默认值0
            deviceConfig.pulse = PULSE_MAPPING[action] || 0;
        }
    });

    // 返回所有干接点设备的配置数组
    return { dryContacts: Array.from(dryContactsMap.values()) };
}