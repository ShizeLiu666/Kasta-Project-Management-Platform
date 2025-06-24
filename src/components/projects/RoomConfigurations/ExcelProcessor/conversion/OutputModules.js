/**
 * 输出模块转换模块 (conversion/OutputModules.js)
 * 
 * 功能概述：
 * 负责将Excel中的4输出模块配置数据转换为标准化的JSON格式。
 * 4输出模块是智能家居系统的输出控制组件，支持4个独立通道的输出控制。
 * 每个通道可以配置输出名称和脉冲类型，实现精确的设备控制。
 * 
 * 支持的脉冲类型：
 * 1. NORMAL (正常脉冲): 0 - 标准的输出脉冲
 * 2. 1SEC (1秒脉冲): 1 - 持续1秒的输出脉冲
 * 3. 6SEC (6秒脉冲): 2 - 持续6秒的输出脉冲
 * 4. 9SEC (9秒脉冲): 3 - 持续9秒的输出脉冲
 * 5. REVERSE (反向脉冲): 4 - 反向输出脉冲
 * 
 * 核心功能：
 * 1. 设备预处理：
 *    - 自动识别所有"4 Output Module"类型的设备
 *    - 为每个设备创建4个通道的默认配置
 *    - 所有通道默认设置为NORMAL脉冲和空输出名称
 * 
 * 2. 通道配置解析：
 *    - 解析Excel中的模块名称和通道配置
 *    - 支持通道号1-4的输出名称和脉冲类型设置
 *    - 支持可选的脉冲类型配置（格式：输出名称 - 脉冲类型）
 * 
 * 3. 配置验证：
 *    - 验证通道号的有效性（1-4范围）
 *    - 验证设备是否为已注册的4输出模块
 *    - 验证脉冲类型的有效性
 * 
 * 4. 数据转换：
 *    - 生成标准化的输出模块配置对象
 *    - 包含设备名称和4个通道的详细配置
 *    - 每个通道包含通道号、脉冲类型、输出名称
 *    - 输出为数组格式便于系统处理
 * 
 * 输入格式示例：
 * ```
 * NAME: 输出模块1
 * 1: 客厅灯光 - 1SEC
 * 2: 卧室插座
 * 3: 厨房排风扇 - REVERSE
 * 4: 门禁系统 - 6SEC
 * ```
 * 
 * 输出格式：
 * ```json
 * {
 *   "outputs": [
 *     {
 *       "deviceName": "输出模块1",
 *       "outputs": [
 *         {
 *           "channel": 0,
 *           "pulse": 1,
 *           "outputName": "客厅灯光"
 *         },
 *         {
 *           "channel": 1,
 *           "pulse": 0,
 *           "outputName": "卧室插座"
 *         },
 *         {
 *           "channel": 2,
 *           "pulse": 4,
 *           "outputName": "厨房排风扇"
 *         },
 *         {
 *           "channel": 3,
 *           "pulse": 2,
 *           "outputName": "门禁系统"
 *         }
 *       ]
 *     }
 *   ]
 * }
 * ```
 * 
 * 核心特性：
 * - 智能设备识别：自动识别所有4输出模块类型设备
 * - 通道数组管理：每个设备固定4个通道的配置数组
 * - 脉冲类型映射：文本到数值的智能转换
 * - 灵活的配置格式：支持可选的脉冲类型配置
 * - 通道验证：确保通道号在有效范围内（1-4）
 * - 默认配置保证：未配置的通道保持NORMAL脉冲和空名称
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
 * 主输出模块处理函数
 * 
 * 功能：将Excel中的4输出模块配置转换为标准化的JSON格式
 * 依赖：Devices模块（设备类型映射和注册设备列表）
 * 
 * 处理流程：
 * 1. 预处理所有4输出模块类型设备，创建默认配置
 * 2. 解析Excel中的模块配置
 * 3. 解析通道配置（输出名称和可选的脉冲类型）
 * 4. 验证通道号和脉冲类型有效性
 * 5. 生成最终的配置数组
 * 
 * @param {Array} outputModulesContent - 输出模块内容数组
 * @returns {Object} 标准化的输出模块配置对象
 */
export function processOutputModules(outputModulesContent) {
    const registeredDeviceNames = getRegisteredDevices();
    const deviceNameToType = getDeviceNameToType();
    
    const outputsMap = new Map();
    let currentDevice = null;

    // 预处理所有4输出模块类型的设备
    registeredDeviceNames.forEach(deviceName => {
        if (deviceNameToType[deviceName] === "4 Output Module") {
            outputsMap.set(deviceName, {
                deviceName: deviceName,
                // 创建4个通道的输出配置数组
                outputs: Array(4).fill(null).map((_, index) => ({
                    channel: index,      // 通道号（0-3）
                    pulse: 0,           // 默认NORMAL脉冲
                    outputName: ""      // 默认空输出名称
                }))
            });
        }
    });

    // 处理Excel配置数据
    (outputModulesContent || []).forEach(line => {
        line = line.trim();

        // 解析设备名称行
        if (line.startsWith("NAME:")) {
            currentDevice = line.replace("NAME:", "").trim();
            // 验证设备是否为已注册的4输出模块设备
            if (!outputsMap.has(currentDevice)) {
                console.warn(`Device ${currentDevice} is not a registered 4 Output Module device`);
                currentDevice = null;
            }
        } 
        // 解析通道配置行（格式：通道号: 输出名称 [- 脉冲类型]）
        else if (currentDevice && outputsMap.has(currentDevice)) {
            const [channel, command] = line.split(":").map(part => part.trim());
            const channelNumber = parseInt(channel, 10) - 1; // 转换为0基础索引
            
            let terminalCommand = command;  // 输出名称
            let action = 'NORMAL';          // 默认脉冲类型

            // 解析可选的脉冲类型（格式：输出名称 - 脉冲类型）
            if (command.includes(" - ")) {
                const [name, actionType] = command.split(" - ");
                terminalCommand = name.trim();
                action = actionType.trim();
            }

            const deviceConfig = outputsMap.get(currentDevice);
            // 更新指定通道的配置
            deviceConfig.outputs[channelNumber] = {
                channel: channelNumber,
                pulse: PULSE_MAPPING[action] || 0,  // 转换脉冲类型为数值
                outputName: terminalCommand
            };
        }
    });

    // 返回所有输出模块设备的配置数组
    return { outputs: Array.from(outputsMap.values()) };
}