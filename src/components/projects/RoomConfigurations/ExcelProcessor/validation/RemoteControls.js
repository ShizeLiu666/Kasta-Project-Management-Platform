/**
 * 遥控器验证模块 (RemoteControls.js)
 * 
 * 验证逻辑概述：
 * 1. 遥控器型号验证：
 *    - 验证遥控器名称是否在已注册设备中存在
 *    - 根据设备型号确定可用按键数量
 *    - 支持多种遥控器类型（1-6按键面板、输入模块、输出模块）
 * 2. 按键绑定验证：
 *    - 验证按键编号格式（如 "1: target_name"）
 *    - 检查按键编号是否在有效范围内
 *    - 确保按键编号不重复
 * 3. 目标验证：
 *    - 验证绑定目标是否存在（设备、组、场景）
 *    - 检查目标类型的操作兼容性
 *    - 验证特殊设备的操作参数
 * 4. 操作参数验证：
 *    - 风扇类型：支持FAN、LAMP、WHOLE操作
 *    - 窗帘类型：支持OPEN、CLOSE、WHOLE操作
 *    - 双路插座：支持LEFT、RIGHT、WHOLE操作
 *    - 输出模块：支持FIRST、SECOND、THIRD、FOURTH、WHOLE操作
 * 5. 特殊限制检查：
 *    - 输入模块不能作为遥控器绑定目标
 *    - 组和场景不支持操作参数
 *    - 继电器和调光器不支持特殊操作
 * 
 * 输入格式：
 * NAME: 遥控器设备名称
 * LINK
 * 1: 目标名称 [- 操作参数]
 * 2: 目标名称 [- 操作参数]
 * ...
 * 
 * 支持的绑定格式示例：
 * - 设备绑定：1: Light1
 * - 组绑定：2: LivingRoomLights
 * - 场景绑定：3: MovieTime
 * - 特殊操作：4: Fan1 - FAN
 * - 输出模块：5: OutputModule1 - FIRST
 * 
 * 输出：
 * - errors: 验证错误数组
 */

// 设备型号到按键数量的映射表
const deviceModelToKeyCount = {
    "1 Push Panel": 1,
    "2 Push Panel": 2,
    "3 Push Panel": 3,
    "4 Push Panel": 4,
    "5 Push Panel": 5,
    "6 Push Panel": 6,
    "5 Input Module": 5,
};

// 输入模块类型和动作定义（暂未使用）
// const INPUT_MODULE_TYPES = ["5 Input Module", "6 Input Module"];
// const INPUT_MODULE_ACTIONS = ["TOGGLE", "MOMENTARY"];

// 检查行是否以 NAME: 开头
function checkNamePrefix(line, errors) {
    if (!line.startsWith("NAME:")) {
        errors.push(
            `KASTA REMOTE CONTROL: The line '${line}' is missing a colon after 'NAME'. It should be formatted as 'NAME:'.`
        );
        return false;
    }
    return true;
}

// 验证遥控器名称有效性
function validateRemoteControlName(remoteControlName, errors, registeredRemoteControlNames) {
    if (!remoteControlName) {
        errors.push(
            `KASTA REMOTE CONTROL: The line with 'NAME:' is missing a device name. Please enter a valid device name.`
        );
        return false;
    }

    if (/[^a-zA-Z0-9_ ]/.test(remoteControlName)) {
        errors.push(
            `KASTA REMOTE CONTROL: The device name '${remoteControlName}' contains special characters. Only letters, numbers, underscores, and spaces are allowed.`
        );
        return false;
    }

    registeredRemoteControlNames.add(remoteControlName);
    return true;
}

// 根据设备名称获取按键数量
function getKeyCountFromDeviceName(deviceName, deviceNameToType) {
    const deviceType = deviceNameToType[deviceName];
    if (!deviceType) {
        return null;
    }

    if (deviceType.includes("Remote Control")) {
        const modelMatch = deviceType.match(/\((.*?)\)/);
        if (modelMatch && modelMatch[1]) {
            const model = modelMatch[1];
            return deviceModelToKeyCount[model] || null;
        }
    } else if (deviceType === "5 Input Module" || deviceType === "6 Input Module" || deviceType === "4 Output Module") {
        return deviceModelToKeyCount[deviceType];
    }

    return null;
}

// 检查按键绑定命令格式
function checkCommandFormat(line, errors, currentRemoteControlName, maxKeyCount) {
    const match = line.match(/^(\d+):\s+(.+)$/);
    if (!match) {
        errors.push(
            `Remote Control '${currentRemoteControlName}': The command '${line}' is invalid. It should follow the format 'key: target_name' (e.g., '1: LightA').`
        );
        return false;
    }

    const keyNumber = parseInt(match[1], 10);
    if (isNaN(keyNumber) || keyNumber < 1 || keyNumber > maxKeyCount) {
        errors.push(
            `Remote Control '${currentRemoteControlName}': The key number '${keyNumber}' in '${line}' is invalid. It should be between 1 and ${maxKeyCount}.`
        );
        return false;
    }

    return match;
}

// 已注释的设备命令验证函数（保留用于参考）
// function validateDeviceCommand(command, errors, currentRemoteControlName, registeredDeviceNames, deviceNameToType) {
//     const deviceMatch = command.match(/^DEVICE\s+(\S+)(?:\s+-\s+(\S+))?$/);
//     if (!deviceMatch) {
//         errors.push(
//             `KASTA REMOTE CONTROL: The DEVICE command '${command}' in '${currentRemoteControlName}' is not valid. Expected format: 'DEVICE <device_name>' with an optional operation after ' - '.`
//         );
//         return false;
//     }

//     const [, deviceName, operation] = deviceMatch;

//     if (!registeredDeviceNames.has(deviceName)) {
//         errors.push(
//             `KASTA REMOTE CONTROL: The DEVICE name '${deviceName}' in '${currentRemoteControlName}' does not exist.`
//         );
//         return false;
//     }

//     const deviceType = deviceNameToType[deviceName];
//     if (!deviceType) {
//         errors.push(
//             `KASTA REMOTE CONTROL: The device type for '${deviceName}' in '${currentRemoteControlName}' is undefined.`
//         );
//         return false;
//     }

//     if (operation) {
//         if (deviceType.includes("Fan Type")) {
//             if (!['FAN', 'LAMP', 'WHOLE'].includes(operation.toUpperCase())) {
//                 errors.push(
//                     `KASTA REMOTE CONTROL: The operation '${operation}' for Fan Type device '${deviceName}' in '${currentRemoteControlName}' is invalid. Expected 'FAN', 'LAMP', or 'WHOLE'.`
//                 );
//                 return false;
//             }
//         } else if (deviceType.includes("Curtain Type")) {
//             if (!['OPEN', 'CLOSE', 'WHOLE'].includes(operation.toUpperCase())) {
//                 errors.push(
//                     `KASTA REMOTE CONTROL: The operation '${operation}' for Curtain Type device '${deviceName}' in '${currentRemoteControlName}' is invalid. Expected 'OPEN', 'CLOSE', or 'WHOLE'.`
//                 );
//                 return false;
//             }
//         } else if (deviceType === "PowerPoint Type (Two-Way)") {
//             if (!['LEFT', 'RIGHT', 'WHOLE'].includes(operation.toUpperCase())) {
//                 errors.push(
//                     `KASTA REMOTE CONTROL: The operation '${operation}' for PowerPoint Type (Two-Way) device '${deviceName}' in '${currentRemoteControlName}' is invalid. Expected 'LEFT', 'RIGHT', or 'WHOLE'.`
//                 );
//                 return false;
//             }
//         }
//     }

//     return true;
// }

// 验证绑定目标（设备、组、场景）
function validateTarget(
    command, 
    errors, 
    currentRemoteControlName, 
    registeredDeviceNames, 
    registeredGroupNames, 
    registeredSceneNames,
    deviceNameToType
) {
    // 解析命令，支持可选的操作部分
    const parts = command.split(' - ');
    let targetName = parts[0].trim();
    const operation = parts[1]?.trim();

    // 移除可能存在的关键词前缀（只移除大写形式）
    targetName = targetName
        .replace(/^(DEVICE|GROUP|SCENE)\s+/, '')
        .trim();

    // 检查目标名称是否存在于任何一个集合中
    if (!registeredDeviceNames.has(targetName) && 
        !registeredGroupNames.has(targetName) && 
        !registeredSceneNames.has(targetName)) {
        errors.push(
            `Remote Control '${currentRemoteControlName}': The target '${targetName}' does not exist as a device, group, or scene.`
        );
        return false;
    }

    // 确定目标类型并验证相应的操作
    if (registeredDeviceNames.has(targetName)) {
        // 设备特殊验证
        const deviceType = deviceNameToType[targetName];
        if (!deviceType) {
            errors.push(
                `Remote Control '${currentRemoteControlName}': Cannot determine type for device '${targetName}'.`
            );
            return false;
        }

        // 检查是否是输入模块
        if (deviceType === "5 Input Module") {
            errors.push(
                `Remote Control '${currentRemoteControlName}': Cannot bind 5 Input Module '${targetName}' as a target device.`
            );
            return false;
        }

        // 如果有操作，验证操作是否合法
        if (operation) {
            // 根据设备类型验证操作
            switch (true) {
                case deviceType.includes("Fan Type"):
                    if (!['FAN', 'LAMP', 'WHOLE'].includes(operation.toUpperCase())) {
                        errors.push(
                            `Remote Control '${currentRemoteControlName}': Invalid operation '${operation}' for Fan Type device '${targetName}'. Expected 'FAN', 'LAMP', or 'WHOLE'.`
                        );
                        return false;
                    }
                    break;

                case deviceType.includes("Curtain Type"):
                    if (!['OPEN', 'CLOSE', 'WHOLE'].includes(operation.toUpperCase())) {
                        errors.push(
                            `Remote Control '${currentRemoteControlName}': Invalid operation '${operation}' for Curtain Type device '${targetName}'. Expected 'OPEN', 'CLOSE', or 'WHOLE'.`
                        );
                        return false;
                    }
                    break;

                case deviceType === "PowerPoint Type (Two-Way)":
                    if (!['LEFT', 'RIGHT', 'WHOLE'].includes(operation.toUpperCase())) {
                        errors.push(
                            `Remote Control '${currentRemoteControlName}': Invalid operation '${operation}' for PowerPoint Type (Two-Way) device '${targetName}'. Expected 'LEFT', 'RIGHT', or 'WHOLE'.`
                        );
                        return false;
                    }
                    break;

                case deviceType === "4 Output Module":
                    if (!['FIRST', 'SECOND', 'THIRD', 'FOURTH', 'WHOLE'].includes(operation.toUpperCase())) {
                        errors.push(
                            `Remote Control '${currentRemoteControlName}': Invalid operation '${operation}' for 4 Output Module device '${targetName}'. Expected 'FIRST', 'SECOND', 'THIRD', 'FOURTH', or 'WHOLE'.`
                        );
                        return false;
                    }
                    break;

                default:
                    if (deviceType.includes("Dimmer Type") || deviceType.includes("Relay Type")) {
                        // 调光器类型和继电器类型不支持特殊操作
                        errors.push(
                            `Remote Control '${currentRemoteControlName}': Device '${targetName}' of type '${deviceType}' does not support operations.`
                        );
                        return false;
                    }
            }
        }
        return 'DEVICE';
    } 
    
    // 组和场景的验证
    if (registeredGroupNames.has(targetName)) {
        if (operation) {
            errors.push(
                `Remote Control '${currentRemoteControlName}': Groups do not support operations. Invalid operation '${operation}' for group '${targetName}'.`
            );
            return false;
        }
        return 'GROUP';
    } 
    
    if (registeredSceneNames.has(targetName)) {
        if (operation) {
            errors.push(
                `Remote Control '${currentRemoteControlName}': Scenes do not support operations. Invalid operation '${operation}' for scene '${targetName}'.`
            );
            return false;
        }
        return 'SCENE';
    }
}

// 主验证函数
export function validateRemoteControls(
    remoteControlDataArray, 
    deviceNameToType, 
    registeredDeviceNames, 
    registeredGroupNames, 
    registeredSceneNames
) {
    const errors = [];
    const registeredRemoteControlNames = new Set();
    let currentRemoteControlName = null;
    let maxKeyCount = 0;

    remoteControlDataArray.forEach((line) => {
        line = line.trim();

        if (line.startsWith("LINK")) {
            return;
        }

        if (line.startsWith("NAME")) {
            if (!checkNamePrefix(line, errors)) return;
            
            currentRemoteControlName = line.substring(5).trim();
            if (!validateRemoteControlName(currentRemoteControlName, errors, registeredRemoteControlNames)) {
                currentRemoteControlName = null;
                return;
            }

            maxKeyCount = getKeyCountFromDeviceName(currentRemoteControlName, deviceNameToType);
            if (maxKeyCount === null || maxKeyCount === 0) {
                errors.push(
                    `Remote Control '${currentRemoteControlName}': Unable to determine the key count.`
                );
                currentRemoteControlName = null;
                return;
            }
        } else if (currentRemoteControlName) {
            const match = checkCommandFormat(line, errors, currentRemoteControlName, maxKeyCount);
            if (!match) return;
        
            const command = match[2].trim();
            const targetType = validateTarget(
                command,
                errors, 
                currentRemoteControlName,
                registeredDeviceNames,
                registeredGroupNames,
                registeredSceneNames,
                deviceNameToType
            );

            if (!targetType) return;
        }
    });

    return errors;
}
