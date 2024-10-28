// 定义常量
const VALID_ACTIONS = ['NORMAL', '1SEC', '6SEC', '9SEC', 'REVERS'];
const MAX_TERMINALS = 4;

// 检查名称前缀
function checkNamePrefix(line, errors) {
    if (!line.startsWith("NAME:")) {
        errors.push(
            `VIRTUAL DRY CONTACT: The line '${line}' is missing a colon after 'NAME'. It should be formatted as 'NAME:'.`
        );
        return false;
    }
    return true;
}

// 验证虚拟干接点名称
function validateVirtualContactName(contactName, errors, deviceNameToType, registeredDeviceNames, registeredContactNames) {
    if (!contactName) {
        errors.push(
            `VIRTUAL DRY CONTACT: The line with 'NAME:' is missing a device name. Please enter a valid device name.`
        );
        return false;
    }

    // 检查名称是否已被使用
    if (registeredContactNames.has(contactName)) {
        errors.push(
            `VIRTUAL DRY CONTACT: The device name '${contactName}' has already been used. Each virtual contact must have a unique name.`
        );
        return false;
    }

    if (!registeredDeviceNames.has(contactName)) {
        errors.push(
            `VIRTUAL DRY CONTACT: The device name '${contactName}' does not exist.`
        );
        return false;
    }

    const deviceType = deviceNameToType[contactName];
    if (deviceType !== "4 Output Module") {
        errors.push(
            `VIRTUAL DRY CONTACT: The device '${contactName}' is of type '${deviceType}', which is not supported. Only '4 Output Module' type is allowed.`
        );
        return false;
    }

    // 如果验证通过，将名称添加到已注册集合中
    registeredContactNames.add(contactName);
    return true;
}

// 检查命令格式
function checkCommandFormat(line, errors, currentContactName) {
    // 匹配格式：数字: Terminal_名称 [- ACTION]
    // 例如：1: Terminal_1 - NORMAL 或 1: Terminal_1
    const match = line.match(/^(\d+):\s*(.*)$/);
    
    if (!match) {
        errors.push(
            `Virtual Contact '${currentContactName}': The command '${line}' is invalid. It should follow the format 'terminal: Terminal_NAME' or 'terminal: Terminal_NAME - ACTION'.`
        );
        return false;
    }

    // 检查终端号是否在有效范围内（1-4）
    const terminalNumber = parseInt(match[1], 10);
    if (!Number.isInteger(terminalNumber) || terminalNumber < 1 || terminalNumber > MAX_TERMINALS) {
        errors.push(
            `Virtual Contact '${currentContactName}': The terminal number '${terminalNumber}' in '${line}' is invalid. It should be an integer between 1 and ${MAX_TERMINALS}.`
        );
        return false;
    }

    // 检查命令部分是否以 Terminal_ 开头
    const command = match[2].trim();

    // 如果有动作部分，检查格式
    if (command.includes(' - ')) {
        const parts = command.split(' - ');
        if (parts.length !== 2) {
            errors.push(
                `Virtual Contact '${currentContactName}': Invalid format in '${line}'. If using an action, format should be 'terminal: Terminal_NAME - ACTION'.`
            );
            return false;
        }
    }

    return match;
}

// 验证终端命令
function validateTerminalCommand(command, errors, currentContactName) {
    // 如果命令中包含动作，验证格式
    if (command.includes(' - ')) {
        const commandMatch = command.match(/^(\S+)\s+-\s+(\S+)$/);
        if (!commandMatch) {
            errors.push(
                `VIRTUAL DRY CONTACT: The command '${command}' in '${currentContactName}' is not valid. Expected format: 'TERMINAL_NAME - ACTION'.`
            );
            return false;
        }

        const terminalName = commandMatch[1];
        const action = commandMatch[2];

        // 验证终端名称格式（只允许字母、数字和下划线）
        if (/[^a-zA-Z0-9_]/.test(terminalName)) {
            errors.push(
                `VIRTUAL DRY CONTACT: The terminal name '${terminalName}' in '${currentContactName}' contains special characters. Only letters, numbers, and underscores are allowed.`
            );
            return false;
        }

        // 验证动作类型
        if (!VALID_ACTIONS.includes(action)) {
            errors.push(
                `VIRTUAL DRY CONTACT: The action '${action}' in '${currentContactName}' is invalid. Expected one of: ${VALID_ACTIONS.join(', ')}.`
            );
            return false;
        }
    } else {
        // 如果命令中没有动作，只验证终端名称
        if (/[^a-zA-Z0-9_]/.test(command)) {
            errors.push(
                `VIRTUAL DRY CONTACT: The terminal name '${command}' in '${currentContactName}' contains special characters. Only letters, numbers, and underscores are allowed.`
            );
            return false;
        }
    }

    return true;
}

// 主验证函数
export function validateVirtualContacts(virtualContactsDataArray, deviceNameToType, registeredDeviceNames) {
    const errors = [];
    const registeredContactNames = new Set();  // 添加跟踪已注册的虚拟干接点名称
    let currentContactName = null;
    const usedChannels = new Map(); // 用于跟踪每个虚拟干接点已使用的通道

    virtualContactsDataArray.forEach((line) => {
        line = line.trim();

        if (line.startsWith("NAME")) {
            if (!checkNamePrefix(line, errors)) return;
            
            currentContactName = line.substring(5).trim();
            usedChannels.set(currentContactName, new Set()); // 初始化当前干接点的通道跟踪
            
            if (!validateVirtualContactName(
                currentContactName, 
                errors, 
                deviceNameToType, 
                registeredDeviceNames,
                registeredContactNames
            )) {
                currentContactName = null;
                return;
            }
        } else if (currentContactName) {
            const match = checkCommandFormat(line, errors, currentContactName);
            if (!match) return;

            // 检查通道是否已被使用
            const channelNumber = match[1];
            const currentChannels = usedChannels.get(currentContactName);
            
            if (currentChannels.has(channelNumber)) {
                errors.push(
                    `VIRTUAL DRY CONTACT: In virtual contact '${currentContactName}', channel ${channelNumber} is already in use. Each channel can only be used once per virtual contact.`
                );
                return;
            }
            
            currentChannels.add(channelNumber);
            const command = match[2].trim();
            validateTerminalCommand(command, errors, currentContactName);
        }
    });
    return errors;
}
