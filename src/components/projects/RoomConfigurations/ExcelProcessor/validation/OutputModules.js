/**
 * 输出模块验证模块 (OutputModules.js)
 * 
 * 验证逻辑概述：
 * 1. 模块名称验证：
 *    - 验证模块名称是否在已注册设备中存在
 *    - 确保模块名称唯一性（不能重复使用）
 *    - 检查设备类型是否为"4 Output Module"类型
 * 2. 通道配置验证：
 *    - 验证通道编号格式（如 "1: OUTPUT_NAME" 或 "1: OUTPUT_NAME - ACTION"）
 *    - 检查通道编号是否在有效范围内（1-4）
 *    - 确保同一模块内通道编号不重复
 * 3. 输出名称验证：
 *    - 验证输出名称不包含空格
 *    - 确保输出名称格式正确
 * 4. 动作类型验证：
 *    - 验证动作是否在预定义列表中（NORMAL、1SEC、6SEC、9SEC、REVERSE）
 *    - 支持可选的动作参数配置
 * 5. 格式完整性验证：
 *    - 检查模块定义格式（NAME: 模块名）
 *    - 验证通道配置格式（通道号: 输出名称 [- 动作]）
 *    - 确保配置顺序正确（先定义模块，再配置通道）
 * 
 * 输入格式：
 * NAME: 输出模块名称
 * 1: 输出名称 [- 动作类型]
 * 2: 输出名称 [- 动作类型]
 * ...
 * 4: 输出名称 [- 动作类型]
 * 
 * 动作类型说明：
 * - NORMAL: 标准输出（默认）
 * - 1SEC: 1秒延时输出
 * - 6SEC: 6秒延时输出
 * - 9SEC: 9秒延时输出
 * - REVERSE: 反向输出
 * 
 * 输出：
 * - errors: 验证错误数组
 */

// 定义有效动作类型常量
const VALID_ACTIONS = ['NORMAL', '1SEC', '6SEC', '9SEC', 'REVERSE'];
// 最大通道数（4 Output Module）
const MAX_CHANNELS = 4;

// 检查名称前缀格式
function checkNamePrefix(line, errors) {
    if (!line.startsWith("NAME:")) {
        errors.push(
            `OUTPUT MODULE: The line '${line}' is missing a colon after 'NAME'. It should be formatted as 'NAME:'.`
        );
        return false;
    }
    return true;
}

// 验证输出模块名称
function validateOutputModuleName(moduleName, errors, deviceNameToType, registeredDeviceNames, registeredModuleNames) {
    if (!moduleName) {
        errors.push(
            `OUTPUT MODULE: The line with 'NAME:' is missing a device name. Please enter a valid device name.`
        );
        return false;
    }

    if (registeredModuleNames.has(moduleName)) {
        errors.push(
            `OUTPUT MODULE: The device name '${moduleName}' has already been used. Each output module must have a unique name.`
        );
        return false;
    }

    if (!registeredDeviceNames.has(moduleName)) {
        errors.push(
            `OUTPUT MODULE: The device name '${moduleName}' does not exist.`
        );
        return false;
    }

    const deviceType = deviceNameToType[moduleName];
    if (deviceType !== "4 Output Module") {
        errors.push(
            `OUTPUT MODULE: The device '${moduleName}' is of type '${deviceType}', which is not supported. Only '4 Output Module' type is allowed.`
        );
        return false;
    }

    registeredModuleNames.add(moduleName);
    return true;
}

// 检查通道配置命令格式
function checkCommandFormat(line, errors, currentModuleName) {
    const match = line.match(/^(\d+):\s*(.*)$/);
    
    if (!match) {
        errors.push(
            `Output Module '${currentModuleName}': The command '${line}' is invalid. It should follow the format 'channel: OUTPUT_NAME' or 'channel: OUTPUT_NAME - ACTION'.`
        );
        return false;
    }

    const channelNumber = parseInt(match[1], 10);
    if (!Number.isInteger(channelNumber) || channelNumber < 1 || channelNumber > MAX_CHANNELS) {
        errors.push(
            `Output Module '${currentModuleName}': The channel number '${channelNumber}' in '${line}' is invalid. It should be an integer between 1 and ${MAX_CHANNELS}.`
        );
        return false;
    }

    const command = match[2].trim();
    if (command.includes(' - ')) {
        const parts = command.split(' - ');
        if (parts.length !== 2) {
            errors.push(
                `Output Module '${currentModuleName}': Invalid format in '${line}'. If using an action, format should be 'channel: OUTPUT_NAME - ACTION'.`
            );
            return false;
        }
    }

    return match;
}

// 验证输出命令格式和内容
function validateOutputCommand(command, errors, currentModuleName) {
    if (command.includes(' - ')) {
        const commandMatch = command.match(/^([^\s]+)\s+-\s+(\S+)$/);
        if (!commandMatch) {
            errors.push(
                `OUTPUT MODULE: The command '${command}' in '${currentModuleName}' is not valid. Expected format: 'OUTPUT_NAME - ACTION'.`
            );
            return false;
        }

        const outputName = commandMatch[1];
        const action = commandMatch[2];

        // 检查输出名称是否包含空格
        if (outputName.includes(' ')) {
            errors.push(
                `OUTPUT MODULE: The output name '${outputName}' in '${currentModuleName}' contains spaces. Spaces are not allowed in output names.`
            );
            return false;
        }

        if (!VALID_ACTIONS.includes(action)) {
            errors.push(
                `OUTPUT MODULE: The action '${action}' in '${currentModuleName}' is invalid. Expected one of: ${VALID_ACTIONS.join(', ')}.`
            );
            return false;
        }
    } else {
        // 检查输出名称是否包含空格
        if (command.includes(' ')) {
            errors.push(
                `OUTPUT MODULE: The output name '${command}' in '${currentModuleName}' contains spaces. Spaces are not allowed in output names.`
            );
            return false;
        }
    }

    return true;
}

// 主验证函数
export function validateOutputModules(outputsDataArray, deviceNameToType, registeredDeviceNames) {
    const errors = [];
    const registeredModuleNames = new Set();
    let currentModuleName = null;
    const usedChannels = new Map();

    outputsDataArray.forEach((line, index) => {
        line = line.trim();

        // 检查第一行是否以数字开头（直接配置通道）
        if (index === 0 && /^\d+:/.test(line)) {
            errors.push(
                `OUTPUT MODULE: Please define the output module name using 'NAME:' before configuring channels.`
            );
            return;
        }

        if (line.startsWith("NAME")) {
            if (!checkNamePrefix(line, errors)) return;
            
            currentModuleName = line.substring(5).trim();
            usedChannels.set(currentModuleName, new Set());
            
            if (!validateOutputModuleName(
                currentModuleName, 
                errors, 
                deviceNameToType, 
                registeredDeviceNames,
                registeredModuleNames
            )) {
                currentModuleName = null;
                return;
            }
        } else if (!currentModuleName && line.trim()) {
            // 如果没有当前模块名但尝试配置通道
            if (/^\d+:/.test(line)) {
                errors.push(
                    `OUTPUT MODULE: Cannot configure channel '${line}' without first defining a module name using 'NAME:'.`
                );
            }
            return;
        } else if (currentModuleName) {
            const match = checkCommandFormat(line, errors, currentModuleName);
            if (!match) return;

            const channelNumber = match[1];
            const currentChannels = usedChannels.get(currentModuleName);
            
            if (currentChannels.has(channelNumber)) {
                errors.push(
                    `OUTPUT MODULE: In output module '${currentModuleName}', channel ${channelNumber} is already in use. Each channel can only be used once per output module.`
                );
                return;
            }
            
            currentChannels.add(channelNumber);
            const command = match[2].trim();
            validateOutputCommand(command, errors, currentModuleName);
        }
    });
    return errors;
} 