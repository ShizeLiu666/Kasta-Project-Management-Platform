/**
 * 输入模块验证模块 (InputModules.js)
 * 
 * 验证逻辑概述：
 * 1. 模块名称验证：
 *    - 验证模块名称是否在已注册设备中存在
 *    - 确保模块名称唯一性（不能重复使用）
 *    - 检查设备类型是否为"5 Input Module"类型
 * 2. 通道配置验证：
 *    - 验证通道编号格式（如 "1: ACTION"）
 *    - 检查通道编号是否在有效范围内（1-5）
 *    - 确保同一模块内通道编号不重复
 * 3. 动作类型验证：
 *    - 验证动作是否在预定义列表中（TOGGLE、MOMENTARY）
 *    - 确保每个通道都配置了正确的动作类型
 * 4. 格式完整性验证：
 *    - 检查模块定义格式（NAME: 模块名）
 *    - 验证通道配置格式（通道号: 动作类型）
 *    - 确保配置顺序正确（先定义模块，再配置通道）
 * 
 * 输入格式：
 * NAME: 输入模块名称
 * 1: 动作类型 (TOGGLE/MOMENTARY)
 * 2: 动作类型
 * ...
 * 5: 动作类型
 * 
 * 动作类型说明：
 * - TOGGLE: 切换模式（按下切换状态）
 * - MOMENTARY: 瞬时模式（按下时激活，松开时恢复）
 * 
 * 输出：
 * - errors: 验证错误数组
 */

// 定义有效动作类型常量
const VALID_ACTIONS = ['TOGGLE', 'MOMENTARY'];
// 最大通道数（只支持5 Input Module）
const MAX_CHANNELS = 5;

// 检查名称前缀格式
function checkNamePrefix(line, errors) {
    if (!line.startsWith("NAME:")) {
        errors.push(
            `INPUT MODULE: The line '${line}' is missing a colon after 'NAME'. It should be formatted as 'NAME:'.`
        );
        return false;
    }
    return true;
}

// 验证输入模块名称
function validateInputModuleName(moduleName, errors, deviceNameToType, registeredDeviceNames, registeredModuleNames) {
    if (!moduleName) {
        errors.push(
            `INPUT MODULE: The line with 'NAME:' is missing a device name. Please enter a valid device name.`
        );
        return false;
    }

    if (registeredModuleNames.has(moduleName)) {
        errors.push(
            `INPUT MODULE: The device name '${moduleName}' has already been used. Each input module must have a unique name.`
        );
        return false;
    }

    if (!registeredDeviceNames.has(moduleName)) {
        errors.push(
            `INPUT MODULE: The device name '${moduleName}' does not exist.`
        );
        return false;
    }

    const deviceType = deviceNameToType[moduleName];
    if (deviceType !== "5 Input Module") {
        errors.push(
            `INPUT MODULE: The device '${moduleName}' is of type '${deviceType}', which is not supported. Only '5 Input Module' type is allowed.`
        );
        return false;
    }

    registeredModuleNames.add(moduleName);
    return true;
}

// 检查通道配置命令格式
function checkCommandFormat(line, errors, currentModuleName) {
    const match = line.match(/^(\d+):\s*(\w+)$/);
    
    if (!match) {
        errors.push(
            `Input Module '${currentModuleName}': The command '${line}' is invalid. It should follow the format 'channel: ACTION' where ACTION is TOGGLE or MOMENTARY.`
        );
        return false;
    }

    const channelNumber = parseInt(match[1], 10);
    if (!Number.isInteger(channelNumber) || channelNumber < 1 || channelNumber > MAX_CHANNELS) {
        errors.push(
            `Input Module '${currentModuleName}': The channel number '${channelNumber}' in '${line}' is invalid. It should be an integer between 1 and ${MAX_CHANNELS}.`
        );
        return false;
    }

    const action = match[2].trim().toUpperCase();
    if (!VALID_ACTIONS.includes(action)) {
        errors.push(
            `Input Module '${currentModuleName}': The action '${action}' is invalid. Expected one of: ${VALID_ACTIONS.join(', ')}.`
        );
        return false;
    }

    return match;
}

// 主验证函数
export function validateInputModules(inputsDataArray, deviceNameToType, registeredDeviceNames) {
    const errors = [];
    const registeredModuleNames = new Set();
    let currentModuleName = null;
    const usedChannels = new Map();

    inputsDataArray.forEach((line, index) => {
        line = line.trim();

        // 检查第一行是否以数字开头（直接配置通道）
        if (index === 0 && /^\d+:/.test(line)) {
            errors.push(
                `INPUT MODULE: Please define the input module name using 'NAME:' before configuring channels.`
            );
            return;
        }

        if (line.startsWith("NAME")) {
            if (!checkNamePrefix(line, errors)) return;
            
            currentModuleName = line.substring(5).trim();
            usedChannels.set(currentModuleName, new Set());
            
            if (!validateInputModuleName(
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
                    `INPUT MODULE: Cannot configure channel '${line}' without first defining a module name using 'NAME:'.`
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
                    `INPUT MODULE: In input module '${currentModuleName}', channel ${channelNumber} is already in use. Each channel can only be used once per input module.`
                );
                return;
            }
            
            currentChannels.add(channelNumber);
        }
    });
    return errors;
}