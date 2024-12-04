//! Check for 'NAME' without a colon
function checkNamePrefix(line, errors) {
    if (!line.startsWith('NAME:')) {
        errors.push(`KASTA GROUP: The line '${line}' is missing a colon after 'NAME'. It should be formatted as 'NAME:'.`);
        return false;
    }
    return true;
}

function validateGroupName(groupName, errors, deviceNameToGroup, registeredGroupNames) {
    //! Check for 'NAME' without a colon
    if (!groupName) {
        errors.push(`KASTA GROUP: The line with 'NAME:' is missing a group name. Please enter a valid group name.`);
        return false;
    }

    //! Check for disallowed special characters in the group name, allowing spaces
    if (/[^a-zA-Z0-9_ ]/.test(groupName)) {
        errors.push(`KASTA GROUP: The group name '${groupName}' contains special characters. Only letters, numbers, underscores, and spaces are allowed.`);
        return false;
    }

    // 检查重复的 Group Name
    if (registeredGroupNames.has(groupName)) {
        errors.push(`KASTA GROUP: The group name '${groupName}' is duplicated. Each group name must be unique.`);
        return false;
    }

    if (!deviceNameToGroup[groupName]) {
        deviceNameToGroup[groupName] = new Set(); // Initialize a new Set for this group
    }

    registeredGroupNames.add(groupName);
    return true;
}

function validateDeviceNameInGroup(deviceName, errors, deviceNameToType, deviceNameToGroup, currentGroupName) {
    if (!currentGroupName || !deviceNameToGroup[currentGroupName]) {
        errors.push(`KASTA GROUP: There was an error processing the group '${currentGroupName}'.`);
        return false;
    }

    //! Check if the device name contains any spaces
    if (/\s/.test(deviceName)) {
        errors.push(`KASTA GROUP: The device name '${deviceName}' in group '${currentGroupName}' contains spaces. Please check the device name.`);
        return false;
    }

    //! Check for disallowed special characters in the device name
    if (/[^a-zA-Z0-9_]/.test(deviceName)) {
        errors.push(`KASTA GROUP: The device name '${deviceName}' in group '${currentGroupName}' contains special characters. Only letters, numbers, and underscores are allowed.`);
        return false;
    }

    //! Check if the device name is not recognized
    if (!deviceNameToType[deviceName]) {
        errors.push(`KASTA GROUP: The device name '${deviceName}' in group '${currentGroupName}' is not recognized. It should match one of the devices already added.`);
        return false;
    }

    //! Check if the device name is already in the group (duplicate device name)
    if (deviceNameToGroup[currentGroupName].has(deviceName)) {
        errors.push(`KASTA GROUP: The device name '${deviceName}' is duplicated in the group '${currentGroupName}'. Each device name within a group must be unique.`);
        return false;
    }

    // Add the device name to the group
    deviceNameToGroup[currentGroupName].add(deviceName);

    return true;
}

export function validateGroups(groupDataArray, deviceNameToType) {
    const errors = [];
    const deviceNameToGroup = {};
    const registeredGroupNames = new Set();
    let currentGroupName = null;

    groupDataArray.forEach((line, index) => {
        line = line.trim();

        // 新增：检查第一行是否直接输入设备
        if (index === 0 && line && !line.startsWith('NAME:') && !line.startsWith("CONTROL CONTENT")) {
            errors.push(`KASTA GROUP: Please define a group name using 'NAME:' before adding devices.`);
            return;
        }

        if (line.startsWith("CONTROL CONTENT")) {
            return;
        }

        if (line.startsWith('NAME')) {
            // 修改：检查前一个组是否为空（添加安全检查）
            if (currentGroupName && deviceNameToGroup[currentGroupName] && 
                deviceNameToGroup[currentGroupName].size === 0) {
                errors.push(`KASTA GROUP: The group '${currentGroupName}' has no devices. Please add at least one device.`);
            }

            if (!checkNamePrefix(line, errors)) return;
            currentGroupName = line.substring(5).trim();
            if (!validateGroupName(currentGroupName, errors, deviceNameToGroup, registeredGroupNames)) return;
        } else if (currentGroupName && line) {
            // 确保当前组的 Set 已初始化
            if (!deviceNameToGroup[currentGroupName]) {
                deviceNameToGroup[currentGroupName] = new Set();
            }

            // 移除所有关键词
            line = line.replace(/CONTROL CONTENT:|DEVICE CONTENT:|DEVICE CONTROL:/g, '').trim();
            
            // 新增：检查空行
            if (!line) {
                errors.push(`KASTA GROUP: Empty line detected in group '${currentGroupName}'.`);
                return;
            }

            const deviceNames = line.split(',')
                .map(name => name.trim())
                .filter(name => name);

            deviceNames.forEach(deviceName => {
                validateDeviceNameInGroup(deviceName, errors, deviceNameToType, deviceNameToGroup, currentGroupName);
            });
        } else if (line && !line.startsWith('NAME:')) {
            // 新增：处理没有组名时的设备输入
            errors.push(`KASTA GROUP: Cannot add device '${line}' without first defining a group name using 'NAME:'.`);
        }
    });

    // 修改：检查最后一个组是否为空（添加安全检查）
    if (currentGroupName && deviceNameToGroup[currentGroupName] && 
        deviceNameToGroup[currentGroupName].size === 0) {
        errors.push(`KASTA GROUP: The group '${currentGroupName}' has no devices. Please add at least one device.`);
    }

    return { errors, registeredGroupNames, deviceNameToGroup };
}
