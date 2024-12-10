const deviceModelToKeyCount = {
    "1 Push Panel": 1,
    "2 Push Panel": 2,
    "3 Push Panel": 3,
    "4 Push Panel": 4,
    "5 Push Panel": 5,
    "6 Push Panel": 6,
    "5 Input Module": 5,
};

// const INPUT_MODULE_TYPES = ["5 Input Module", "6 Input Module"];
// const INPUT_MODULE_ACTIONS = ["TOGGLE", "MOMENTARY"];

function checkNamePrefix(line, errors) {
    if (!line.startsWith("NAME:")) {
        errors.push(
            `KASTA REMOTE CONTROL: The line '${line}' is missing a colon after 'NAME'. It should be formatted as 'NAME:'.`
        );
        return false;
    }
    return true;
}

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

        // 检查是否是 Input Module
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
                        // Dimmer Type 和 Relay Type 不支持特殊操作
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
