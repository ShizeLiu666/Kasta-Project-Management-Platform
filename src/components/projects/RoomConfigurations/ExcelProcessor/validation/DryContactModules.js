/**
 * 干接点模块验证模块 (DryContactModules.js)
 * 
 * 验证逻辑概述：
 * 1. 模块名称验证：
 *    - 验证模块名称是否在已注册设备中存在
 *    - 确保模块名称唯一性（不能重复使用）
 *    - 检查设备类型是否为"Dry Contact"类型
 * 2. 动作类型验证：
 *    - 验证动作是否在预定义列表中（NORMAL、1SEC、6SEC、9SEC、REVERSE）
 *    - 确保每个模块都配置了动作类型
 *    - 记录特殊动作设备用于后续模块使用
 * 3. 格式完整性验证：
 *    - 检查模块定义格式（NAME: 模块名）
 *    - 确保模块名后紧跟动作配置
 *    - 验证配置的完整性（无遗漏模块）
 * 4. 特殊动作追踪：
 *    - 识别并记录非NORMAL动作的设备
 *    - 为场景验证模块提供特殊动作设备映射
 * 
 * 输入格式：
 * NAME: 干接点模块名称
 * 动作类型 (NORMAL/1SEC/6SEC/9SEC/REVERSE)
 * NAME: 另一个模块名称
 * 动作类型
 * ...
 * 
 * 动作类型说明：
 * - NORMAL: 标准开关动作
 * - 1SEC: 1秒延时动作
 * - 6SEC: 6秒延时动作  
 * - 9SEC: 9秒延时动作
 * - REVERSE: 反向动作
 * 
 * 输出：
 * - errors: 验证错误数组
 * - specialActionDevices: 特殊动作设备映射（Map对象）
 */

// 定义有效动作类型常量
const VALID_ACTIONS = ['NORMAL', '1SEC', '6SEC', '9SEC', 'REVERSE'];

// 检查名称前缀格式
function checkNamePrefix(line, errors) {
    if (!line.startsWith("NAME:")) {
        errors.push(
            `DRY CONTACT MODULE: The line '${line}' is missing a colon after 'NAME'. It should be formatted as 'NAME:'.`
        );
        return false;
    }
    return true;
}

// 验证干接点模块名称
function validateDryContactName(moduleName, errors, deviceNameToType, registeredDeviceNames, registeredModuleNames) {
    if (!moduleName) {
        errors.push(
            `DRY CONTACT MODULE: The line with 'NAME:' is missing a device name. Please enter a valid device name.`
        );
        return false;
    }

    if (registeredModuleNames.has(moduleName)) {
        errors.push(
            `DRY CONTACT MODULE: The device name '${moduleName}' has already been used. Each dry contact module must have a unique name.`
        );
        return false;
    }

    if (!registeredDeviceNames.has(moduleName)) {
        errors.push(
            `DRY CONTACT MODULE: The device name '${moduleName}' does not exist.`
        );
        return false;
    }

    const deviceType = deviceNameToType[moduleName];
    if (deviceType !== "Dry Contact") {
        errors.push(
            `DRY CONTACT MODULE: The device '${moduleName}' is of type '${deviceType}', which is not supported. Only 'Dry Contact Module' type is allowed.`
        );
        return false;
    }

    registeredModuleNames.add(moduleName);
    return true;
}

// 验证动作类型有效性
function validateAction(action, errors, currentModuleName) {
    if (!VALID_ACTIONS.includes(action)) {
        errors.push(
            `DRY CONTACT MODULE: The action '${action}' for module '${currentModuleName}' is invalid. Expected one of: ${VALID_ACTIONS.join(', ')}.`
        );
        return false;
    }
    return true;
}

// 主验证函数
export function validateDryContactModules(dryContactsDataArray, deviceNameToType, registeredDeviceNames) {
    const errors = [];
    const registeredModuleNames = new Set();
    let currentModuleName = null;
    let expectingAction = false;
    const specialActionDevices = new Map();

    dryContactsDataArray.forEach((line, index) => {
        line = line.trim();

        // 检查第一行是否直接配置动作
        if (index === 0 && VALID_ACTIONS.includes(line)) {
            errors.push(
                `DRY CONTACT MODULE: Please define the module name using 'NAME:' before configuring its action.`
            );
            return;
        }

        if (line.startsWith("NAME")) {
            if (!checkNamePrefix(line, errors)) return;
            currentModuleName = line.substring(5).trim();
            
            if (!validateDryContactName(
                currentModuleName, 
                errors, 
                deviceNameToType, 
                registeredDeviceNames,
                registeredModuleNames
            )) {
                currentModuleName = null;
                return;
            }
            expectingAction = true;
        } else if (!currentModuleName && line.trim()) {
            // 如果没有当前模块名但尝试配置动作
            if (VALID_ACTIONS.includes(line)) {
                errors.push(
                    `DRY CONTACT MODULE: Cannot configure action '${line}' without first defining a module name using 'NAME:'.`
                );
                return;
            }
            errors.push(
                `DRY CONTACT MODULE: Unexpected line '${line}'. Each dry contact module should start with 'NAME:'.`
            );
            return;
        } else if (currentModuleName && expectingAction) {
            // 检查并记录非NORMAL动作的设备
            if (line !== 'NORMAL' && VALID_ACTIONS.includes(line)) {
                specialActionDevices.set(currentModuleName, line);
            }
            validateAction(line, errors, currentModuleName);
            expectingAction = false;
            currentModuleName = null;
        } else if (line) {
            errors.push(
                `DRY CONTACT MODULE: Unexpected line '${line}'. Each dry contact module should have a NAME followed by an action.`
            );
        }
    });

    // 检查是否有未完成的模块配置
    if (expectingAction) {
        errors.push(
            `DRY CONTACT MODULE: Missing action for module '${currentModuleName}'.`
        );
    }

    return { errors, specialActionDevices };
}