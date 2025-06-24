/**
 * 组验证模块 (Groups.js)
 * 
 * 验证逻辑概述：
 * 1. 格式验证：检查组定义是否使用正确的 "NAME:" 前缀格式
 * 2. 组名验证：
 *    - 验证组名是否为空
 *    - 检查组名是否包含非法特殊字符（允许字母、数字、下划线、空格）
 *    - 确保组名唯一性（不能重复）
 * 3. 设备引用验证：
 *    - 验证组内引用的设备是否在设备列表中存在
 *    - 检查设备名称格式（不能包含空格和特殊字符）
 *    - 确保组内设备名称不重复
 * 4. 空组检查：确保每个定义的组至少包含一个设备
 * 5. 依赖关系验证：验证所有引用的设备都已在设备模块中定义
 * 
 * 输入格式：
 * NAME: 组名
 * 设备名称1, 设备名称2, 设备名称3
 * ...
 * 
 * 输出：
 * - errors: 验证错误数组
 * - registeredGroupNames: 已注册的组名称集合
 * - deviceNameToGroup: 设备名称到组的映射关系
 */

// 检查行是否以 NAME: 开头
function checkNamePrefix(line, errors) {
    if (!line.startsWith('NAME:')) {
        errors.push(`KASTA GROUP: The line '${line}' is missing a colon after 'NAME'. It should be formatted as 'NAME:'.`);
        return false;
    }
    return true;
}

// 验证组名有效性
function validateGroupName(groupName, errors, deviceNameToGroup, registeredGroupNames) {
    // 检查组名是否为空
    if (!groupName) {
        errors.push(`KASTA GROUP: The line with 'NAME:' is missing a group name. Please enter a valid group name.`);
        return false;
    }

    // 检查组名中的非法特殊字符，允许空格
    if (/[^a-zA-Z0-9_ ]/.test(groupName)) {
        errors.push(`KASTA GROUP: The group name '${groupName}' contains special characters. Only letters, numbers, underscores, and spaces are allowed.`);
        return false;
    }

    // 检查重复的组名
    if (registeredGroupNames.has(groupName)) {
        errors.push(`KASTA GROUP: The group name '${groupName}' is duplicated. Each group name must be unique.`);
        return false;
    }

    if (!deviceNameToGroup[groupName]) {
        deviceNameToGroup[groupName] = new Set(); // 为此组初始化一个新的Set
    }

    registeredGroupNames.add(groupName);
    return true;
}

// 验证组内设备名称有效性
function validateDeviceNameInGroup(deviceName, errors, deviceNameToType, deviceNameToGroup, currentGroupName) {
    if (!currentGroupName || !deviceNameToGroup[currentGroupName]) {
        errors.push(`KASTA GROUP: There was an error processing the group '${currentGroupName}'.`);
        return false;
    }

    // 检查设备名称是否包含空格
    if (/\s/.test(deviceName)) {
        errors.push(`KASTA GROUP: The device name '${deviceName}' in group '${currentGroupName}' contains spaces. Please check the device name.`);
        return false;
    }

    // 检查设备名称中的非法特殊字符
    if (/[^a-zA-Z0-9_]/.test(deviceName)) {
        errors.push(`KASTA GROUP: The device name '${deviceName}' in group '${currentGroupName}' contains special characters. Only letters, numbers, and underscores are allowed.`);
        return false;
    }

    // 检查设备名称是否已被识别
    if (!deviceNameToType[deviceName]) {
        errors.push(`KASTA GROUP: The device name '${deviceName}' in group '${currentGroupName}' is not recognized. It should match one of the devices already added.`);
        return false;
    }

    // 检查设备名称在组内是否重复
    if (deviceNameToGroup[currentGroupName].has(deviceName)) {
        errors.push(`KASTA GROUP: The device name '${deviceName}' is duplicated in the group '${currentGroupName}'. Each device name within a group must be unique.`);
        return false;
    }

    // 将设备名称添加到组中
    deviceNameToGroup[currentGroupName].add(deviceName);

    return true;
}

// 主验证函数
export function validateGroups(groupDataArray, deviceNameToType) {
    const errors = [];
    const deviceNameToGroup = {};
    const registeredGroupNames = new Set();
    let currentGroupName = null;

    groupDataArray.forEach((line, index) => {
        line = line.trim();

        // 检查第一行是否直接输入设备
        if (index === 0 && line && !line.startsWith('NAME:') && !line.startsWith("CONTROL CONTENT")) {
            errors.push(`KASTA GROUP: Please define a group name using 'NAME:' before adding devices.`);
            return;
        }

        if (line.startsWith("CONTROL CONTENT")) {
            return;
        }

        if (line.startsWith('NAME')) {
            // 检查前一个组是否为空（添加安全检查）
            if (currentGroupName && deviceNameToGroup[currentGroupName] && 
                deviceNameToGroup[currentGroupName].size === 0) {
                errors.push(`KASTA GROUP: The group '${currentGroupName}' has no devices. Please add at least one device.`);
            }

            if (!checkNamePrefix(line, errors)) return;
            currentGroupName = line.substring(5).trim();
            if (!validateGroupName(currentGroupName, errors, deviceNameToGroup, registeredGroupNames)) return;
        } else if (currentGroupName && line) {
            // 确保当前组的Set已初始化
            if (!deviceNameToGroup[currentGroupName]) {
                deviceNameToGroup[currentGroupName] = new Set();
            }

            // 移除所有关键词
            line = line.replace(/CONTROL CONTENT:|DEVICE CONTENT:|DEVICE CONTROL:/g, '').trim();
            
            // 检查空行
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
            // 处理没有组名时的设备输入
            errors.push(`KASTA GROUP: Cannot add device '${line}' without first defining a group name using 'NAME:'.`);
        }
    });

    // 检查最后一个组是否为空（添加安全检查）
    if (currentGroupName && deviceNameToGroup[currentGroupName] && 
        deviceNameToGroup[currentGroupName].size === 0) {
        errors.push(`KASTA GROUP: The group '${currentGroupName}' has no devices. Please add at least one device.`);
    }

    return { errors, registeredGroupNames, deviceNameToGroup };
}
