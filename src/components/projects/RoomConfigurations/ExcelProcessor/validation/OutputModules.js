// 定义常量
const VALID_ACTIONS = ['NORMAL', '1SEC', '6SEC', '9SEC', 'REVERS'];
const MAX_CHANNELS = 4;

// 检查名称前缀
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

// 检查命令格式
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

// 验证输出命令
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

    outputsDataArray.forEach((line) => {
        line = line.trim();

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