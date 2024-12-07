const deviceModelToKeyCount = {
    "1 Push Panel": 1,
    "2 Push Panel": 2,
    "3 Push Panel": 3,
    "4 Push Panel": 4,
    "5 Push Panel": 5,
    "6 Push Panel": 6,
    "5 Input Module": 5,
    "6 Input Module": 6,
    "4 Output Module": 4
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
    const match = line.match(/^(\d+):\s*(.*)$/);
    if (!match) {
        errors.push(
            `Remote Control '${currentRemoteControlName}': The command '${line}' is invalid. It should follow the format 'key: COMMAND' (e.g., '1: DEVICE LightA').`
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

    const command = match[2];
    if (!/^(DEVICE|GROUP|SCENE)\b/.test(command)) {
        errors.push(
            `Remote Control '${currentRemoteControlName}': The command '${command}' is invalid. It must start with 'DEVICE', 'GROUP', or 'SCENE'.`
        );
        return false;
    }        

    return match;
}

function validateDeviceCommand(command, errors, currentRemoteControlName, registeredDeviceNames, deviceNameToType) {
    const deviceMatch = command.match(/^DEVICE\s+(\S+)(?:\s+-\s+(\S+))?$/);
    if (!deviceMatch) {
        errors.push(
            `KASTA REMOTE CONTROL: The DEVICE command '${command}' in '${currentRemoteControlName}' is not valid. Expected format: 'DEVICE <device_name>' with an optional operation after ' - '.`
        );
        return false;
    }

    const [, deviceName, operation] = deviceMatch;

    if (!registeredDeviceNames.has(deviceName)) {
        errors.push(
            `KASTA REMOTE CONTROL: The DEVICE name '${deviceName}' in '${currentRemoteControlName}' does not exist.`
        );
        return false;
    }

    const deviceType = deviceNameToType[deviceName];
    if (!deviceType) {
        errors.push(
            `KASTA REMOTE CONTROL: The device type for '${deviceName}' in '${currentRemoteControlName}' is undefined.`
        );
        return false;
    }

    if (operation) {
        if (deviceType.includes("Fan Type")) {
            if (!['FAN', 'LAMP', 'WHOLE'].includes(operation.toUpperCase())) {
                errors.push(
                    `KASTA REMOTE CONTROL: The operation '${operation}' for Fan Type device '${deviceName}' in '${currentRemoteControlName}' is invalid. Expected 'FAN', 'LAMP', or 'WHOLE'.`
                );
                return false;
            }
        } else if (deviceType.includes("Curtain Type")) {
            if (!['OPEN', 'CLOSE', 'WHOLE'].includes(operation.toUpperCase())) {
                errors.push(
                    `KASTA REMOTE CONTROL: The operation '${operation}' for Curtain Type device '${deviceName}' in '${currentRemoteControlName}' is invalid. Expected 'OPEN', 'CLOSE', or 'WHOLE'.`
                );
                return false;
            }
        } else if (deviceType === "PowerPoint Type (Two-Way)") {
            if (!['LEFT', 'RIGHT', 'WHOLE'].includes(operation.toUpperCase())) {
                errors.push(
                    `KASTA REMOTE CONTROL: The operation '${operation}' for PowerPoint Type (Two-Way) device '${deviceName}' in '${currentRemoteControlName}' is invalid. Expected 'LEFT', 'RIGHT', or 'WHOLE'.`
                );
                return false;
            }
        }
    }

    return true;
}

function validateGroupCommand(command, errors, currentRemoteControlName, registeredGroupNames) {
    const groupMatch = command.match(/^GROUP\s+(.+?)$/);
    if (!groupMatch) {
        errors.push(
            `KASTA REMOTE CONTROL: The GROUP command '${command}' in '${currentRemoteControlName}' is not valid. Expected format: 'GROUP <group_name>'`
        );
        return false;
    }

    const groupName = groupMatch[1].trim();

    if (!registeredGroupNames.has(groupName)) {
        errors.push(
            `KASTA REMOTE CONTROL: The GROUP name '${groupName}' in '${currentRemoteControlName}' does not exist.`
        );
        return false;
    }

    return true;
}

function validateSceneCommand(command, errors, currentRemoteControlName, registeredSceneNames) {
    const sceneMatch = command.match(/^SCENE\s+(.+?)$/);
    if (!sceneMatch) {
        errors.push(
            `KASTA REMOTE CONTROL: The SCENE command '${command}' in '${currentRemoteControlName}' is not valid. Expected format: 'SCENE <scene_name>'`
        );
        return false;
    }

    const sceneName = sceneMatch[1].trim();

    if (!registeredSceneNames.has(sceneName)) {
        errors.push(
            `KASTA REMOTE CONTROL: The SCENE name '${sceneName}' in '${currentRemoteControlName}' does not exist.`
        );
        return false;
    }

    return true;
}

export function validateRemoteControls(remoteControlDataArray, deviceNameToType, registeredDeviceNames, registeredGroupNames, registeredSceneNames) {
    // console.log("deviceNameToType:");
    // console.log(JSON.stringify(deviceNameToType, null, 2));

    // console.log("registeredDeviceNames:");
    // console.log(JSON.stringify(Array.from(registeredDeviceNames), null, 2));

    // console.log("registeredGroupNames:");
    // console.log(JSON.stringify(Array.from(registeredGroupNames), null, 2));

    // console.log("registeredSceneNames:");
    // console.log(JSON.stringify(Array.from(registeredSceneNames), null, 2));

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

            if (!deviceNameToType[currentRemoteControlName]) {
                errors.push(
                    `KASTA REMOTE CONTROL: The device name '${currentRemoteControlName}' is not recognized.`
                );
                currentRemoteControlName = null;
                return;
            }

            const deviceType = deviceNameToType[currentRemoteControlName];

            if (
                !deviceType.includes("Remote Control") &&
                deviceType !== "5 Input Module" &&
                deviceType !== "6 Input Module" &&
                deviceType !== "4 Output Module"
            ) {
                errors.push(
                    `KASTA REMOTE CONTROL: The device '${currentRemoteControlName}' is of type '${deviceType}', which is not supported. Only Remote Control types, 5 Input Module, 6 Input Module are allowed.`
                );
                currentRemoteControlName = null;
                return;
            }

            maxKeyCount = getKeyCountFromDeviceName(currentRemoteControlName, deviceNameToType);

            if (maxKeyCount === null || maxKeyCount === 0) {
                errors.push(
                    `KASTA REMOTE CONTROL: Unable to determine the key count for device '${currentRemoteControlName}'.`
                );
                currentRemoteControlName = null;
                return;
            }
        } else if (currentRemoteControlName) {
            const match = checkCommandFormat(line, errors, currentRemoteControlName, maxKeyCount);
            if (!match) return;
        
            const command = match[2];
            if (command.startsWith("DEVICE")) {
                validateDeviceCommand(command, errors, currentRemoteControlName, registeredDeviceNames, deviceNameToType);
            } else if (command.startsWith("GROUP")) {
                validateGroupCommand(command, errors, currentRemoteControlName, registeredGroupNames);
            } else if (command.startsWith("SCENE")) {
                validateSceneCommand(command, errors, currentRemoteControlName, registeredSceneNames);
            }
        }
    });

    return errors;
}
