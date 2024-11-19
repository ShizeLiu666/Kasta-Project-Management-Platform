// 定义常量
const VALID_ACTIONS = ['TOGGLE', 'MOMENTARY'];
const MAX_CHANNELS = 5;  // 只支持 5 Input Module

// 检查名称前缀
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

// 检查命令格式
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

    inputsDataArray.forEach((line) => {
        line = line.trim();

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