/**
 * 输入模块转换模块 (conversion/InputModules.js)
 * 
 * 支持的动作类型：
 * 1. MOMENTARY (瞬时动作): 0 - 按下时触发，松开时停止
 * 2. TOGGLE (切换动作): 1 - 每次按下时切换状态（开/关）
 * 
 * 核心功能：
 * 1. 设备预处理：
 *    - 自动识别所有"5 Input Module"类型的设备
 *    - 为每个设备创建5个通道的默认配置
 *    - 所有通道默认设置为MOMENTARY动作
 * 
 * 2. 通道配置解析：
 *    - 解析Excel中的模块名称和通道配置
 *    - 支持通道号1-5的动作类型设置
 *    - 将动作类型文本转换为对应的数值
 * 
 * 3. 配置验证：
 *    - 验证通道号的有效性（1-5范围）
 *    - 验证设备是否为已注册的5输入模块
 *    - 验证动作类型的有效性
 * 
 * 4. 数据转换：
 *    - 生成标准化的输入模块配置对象
 *    - 包含设备名称和5个通道的动作配置
 *    - 输出为数组格式便于系统处理
 * 
 * 输入格式示例：
 * ```
 * NAME: 输入模块1
 * 1: TOGGLE
 * 2: MOMENTARY
 * 3: TOGGLE
 * 4: MOMENTARY
 * 5: TOGGLE
 * ```
 * 
 * 输出格式：
 * ```json
 * {
 *   "inputs": [
 *     {
 *       "deviceName": "输入模块1",
 *       "inputActions": [1, 0, 1, 0, 1]
 *     }
 *   ]
 * }
 * ```
 */

import { 
    getDeviceNameToType,
    getRegisteredDevices 
} from './Devices';

/**
 * 动作类型映射表
 * 
 * 功能：将动作类型文本转换为对应的数值
 * 用途：系统内部使用数值进行动作控制
 */
const ACTION_MAPPING = {
    'MOMENTARY': 0,  // 瞬时动作（默认）
    'TOGGLE': 1      // 切换动作
};

/**
 * 主输入模块处理函数
 * 
 * 功能：将Excel中的5输入模块配置转换为标准化的JSON格式
 * 依赖：Devices模块（设备类型映射和注册设备列表）
 * 
 * 处理流程：
 * 1. 预处理所有5输入模块类型设备，创建默认配置
 * 2. 解析Excel中的模块配置
 * 3. 更新指定通道的动作类型配置
 * 4. 验证通道号和动作类型有效性
 * 5. 生成最终的配置数组
 * 
 * @param {Array} inputModulesContent - 输入模块内容数组
 * @returns {Object} 标准化的输入模块配置对象
 */
export function processInputModules(inputModulesContent) {
    const registeredDeviceNames = getRegisteredDevices();
    const deviceNameToType = getDeviceNameToType();
    
    const inputsMap = new Map();
    let currentDevice = null;

    // 预处理所有5输入模块类型的设备
    registeredDeviceNames.forEach(deviceName => {
        const deviceType = deviceNameToType[deviceName];
        if (deviceType === "5 Input Module") {
            inputsMap.set(deviceName, {
                deviceName: deviceName,
                // 创建5个通道的动作配置数组，默认为MOMENTARY(0)
                inputActions: Array(5).fill(0)
            });
        }
    });

    // 处理Excel配置数据
    (inputModulesContent || []).forEach(line => {
        line = line.trim();

        // 解析设备名称行
        if (line.startsWith("NAME:")) {
            currentDevice = line.replace("NAME:", "").trim();
            // 验证设备是否为已注册的5输入模块设备
            if (!inputsMap.has(currentDevice)) {
                console.warn(`Device ${currentDevice} is not a registered 5 Input Module device`);
                currentDevice = null;
            }
        } 
        // 解析通道配置行（格式：通道号: 动作类型）
        else if (currentDevice && inputsMap.has(currentDevice)) {
            const [channel, action] = line.split(":").map(part => part.trim());
            const channelNumber = parseInt(channel, 10) - 1; // 转换为0基础索引
            
            const deviceConfig = inputsMap.get(currentDevice);
            
            // 验证通道号有效性（1-5对应索引0-4）
            if (channelNumber >= 0 && channelNumber < 5) {
                const actionValue = ACTION_MAPPING[action.toUpperCase()];
                if (actionValue !== undefined) {
                    // 更新指定通道的动作类型
                    deviceConfig.inputActions[channelNumber] = actionValue;
                }
            } else {
                console.warn(`Invalid channel number ${channelNumber + 1} for device ${currentDevice}`);
            }
        }
    });

    // 返回所有输入模块设备的配置数组
    return { inputs: Array.from(inputsMap.values()) };
}
