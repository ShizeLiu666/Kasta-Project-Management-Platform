/**
 * 设备验证模块 (Devices.js)
 * 
 * 验证逻辑概述：
 * 1. 格式验证：检查设备定义是否使用正确的 "NAME:" 前缀格式
 * 2. 设备型号验证：
 *    - 验证设备型号是否在预定义的 AllDeviceTypes 中存在
 *    - 检查设备型号名称是否符合命名规范（字母、数字、下划线、连字符）
 * 3. 设备名称验证：
 *    - 确保设备名称唯一性（不能重复）
 *    - 检查设备名称长度（1-20字符）
 *    - 验证设备名称不能与设备型号相同
 *    - 确保设备名称符合命名规范（字母、数字、下划线、连字符，不能包含空格）
 * 4. 实例验证：确保每个定义的设备型号至少有一个设备实例
 * 5. 依赖关系建立：构建设备名称到设备类型的映射关系，供其他模块使用
 * 
 * 输入格式：
 * NAME: 设备型号
 * 设备名称1
 * 设备名称2
 * ...
 * 
 * 输出：
 * - errors: 验证错误数组
 * - deviceNameToType: 设备名称到设备类型的映射
 * - registeredDeviceNames: 已注册的设备名称集合
 */

import { AllDeviceTypes } from "../ExcelProcessor";

// 常量定义
const NAME_PREFIX = "NAME:";
const QTY_PREFIX = "QTY:";
const KASTA_DEVICE_ERROR = "KASTA DEVICE:";
const VALID_NAME_REGEX = /^[a-zA-Z0-9_-]+$/;

// 辅助函数
const createError = (message) => `${KASTA_DEVICE_ERROR} ${message}`;

const isValidName = (name) => VALID_NAME_REGEX.test(name);

// 检查行是否以 NAME: 开头
function checkNamePrefix(line, errors) {
  if (!line.startsWith(NAME_PREFIX)) {
    errors.push(createError(`The line '${line}' is missing a colon after 'NAME'. It should be formatted as 'NAME:'.`));
    return false;
  }
  return true;
}

// 验证设备型号有效性
function validateDeviceModel(deviceModel, errors) {
  if (!deviceModel) {
    errors.push(createError("The line with 'NAME:' is missing a device model. Please enter a valid device model."));
    return false;
  }

  if (!isValidName(deviceModel)) {
    errors.push(createError(`The device model '${deviceModel}' contains invalid characters. Only letters, numbers, and underscores are allowed.`));
    return false;
  }

  return true;
}

// 检查可能缺少NAME:前缀的设备型号
function checkMissingNamePrefix(line, errors) {
  const checkModel = (model) => {
    if (model === line) {
      errors.push(createError(`The device model '${line}' seems to be missing the 'NAME: ' prefix. It should be formatted as 'NAME: ${line}'.`));
      return true;
    }
    return false;
  };

  for (const models of Object.values(AllDeviceTypes)) {
    if (Array.isArray(models)) {
      if (models.some(checkModel)) return false;
    } else if (typeof models === "object") {
      for (const subModels of Object.values(models)) {
        if (Array.isArray(subModels) && subModels.some(checkModel)) return false;
      }
    }
  }
  return true;
}

// 获取所有设备型号的函数
function getAllModelNames() {
  const allModels = [];
  
  for (const value of Object.values(AllDeviceTypes)) {
    if (Array.isArray(value)) {
      allModels.push(...value);
    } else if (typeof value === 'object') {
      // 处理嵌套对象（如 PowerPoint Type 和 Remote Control）
      Object.values(value).forEach(subModels => {
        if (Array.isArray(subModels)) {
          allModels.push(...subModels);
        }
      });
    }
  }

  // console.log("All Models:", allModels);
  
  return allModels;
}

// 缓存所有设备型号
const ALL_MODEL_NAMES = getAllModelNames();

// 验证设备名称有效性
function validateDeviceName(line, errors, registeredDeviceNames) {
  // console.log("Line:", line);
  // 首先检查是否与任何设备型号冲突
  if (ALL_MODEL_NAMES.includes(line)) {
    errors.push(createError(`The device name '${line}' cannot be the same as any device model name.`));
    return false;
  }

  // 长度检查
  if (line.length < 1 || line.length > 20) {
    errors.push(createError(`The device name '${line}' must be between 1 and 20 characters long.`));
    return false;
  }

  if (registeredDeviceNames.has(line)) {
    errors.push(createError(`The device name '${line}' is duplicated. Each device name must be unique.`));
    return false;
  }

  if (line.includes(" ")) {
    errors.push(createError(`The device name '${line}' contains spaces. Consider using underscores ('_') or camelCase instead.`));
    return false;
  }

  if (!isValidName(line)) {
    errors.push(createError(`The device name '${line}' contains invalid characters. Only letters, numbers, and underscores are allowed.`));
    return false;
  }

  registeredDeviceNames.add(line);
  return true;
}

// 根据设备型号查找对应的设备类型
function findDeviceType(currentDeviceModel) {
  for (const [deviceType, models] of Object.entries(AllDeviceTypes)) {
    if (Array.isArray(models) && models.includes(currentDeviceModel)) {
      return { type: deviceType, exists: true };
    } else if (typeof models === "object") {
      for (const [subType, subModels] of Object.entries(models)) {
        if (Array.isArray(subModels) && subModels.includes(currentDeviceModel)) {
          return { type: `${deviceType} (${subType})`, exists: true };
        }
      }
    }
  }
  return { type: null, exists: false };
}

// 主验证函数
export function validateDevices(deviceDataArray) {
  const errors = [];
  let deviceNameToType = {};
  const registeredDeviceNames = new Set();
  let currentDeviceType = null;
  let currentDeviceModel = null;
  let hasCurrentModel = false;  // 标记是否有当前有效的设备型号
  let hasDeviceInstance = false;  // 标记当前型号是否有设备实例

  deviceDataArray.forEach((line, index) => {
    line = line.trim();

    // 跳过数量和括号行
    if (line.startsWith(QTY_PREFIX) || line.includes("(")) return;

    if (line.startsWith(NAME_PREFIX)) {
      // 检查前一个设备型号是否有设备实例
      if (hasCurrentModel && !hasDeviceInstance) {
        errors.push(createError(`No device instance was defined for model '${currentDeviceModel}'. Please add at least one device name.`));
      }

      // 重置设备实例标记
      hasDeviceInstance = false;
      
      // 处理NAME:开头的行
      if (!checkNamePrefix(line, errors)) return;
      currentDeviceModel = line.substring(NAME_PREFIX.length).trim();
      if (!validateDeviceModel(currentDeviceModel, errors)) {
        hasCurrentModel = false;
        return;
      }

      const { type, exists } = findDeviceType(currentDeviceModel);
      currentDeviceType = type;

      if (!exists) {
        errors.push(createError(`The device model '${currentDeviceModel}' is not recognized in any known device type.`));
        hasCurrentModel = false;
        return;
      }
      
      hasCurrentModel = true;
      deviceNameToType[currentDeviceModel] = currentDeviceType;
    } else {
      // 处理设备名称行
      if (!checkMissingNamePrefix(line, errors)) return;
      
      // 检查是否有当前有效的设备型号
      if (!hasCurrentModel) {
        errors.push(createError(`The device name '${line}' is not associated with any device model. Please define a device model using 'NAME:' first.`));
        return;
      }
      
      // 检查设备名称是否与任何设备型号相同
      if (ALL_MODEL_NAMES.includes(line)) {
        errors.push(createError(`The device name '${line}' cannot be the same as any device model name.`));
        return;
      }

      if (!validateDeviceName(line, errors, registeredDeviceNames)) return;

      if (currentDeviceType) {
        deviceNameToType[line] = currentDeviceType;
        hasDeviceInstance = true;  // 标记已有设备实例
      }
    }
  });

  // 检查最后一个设备型号是否有设备实例
  if (hasCurrentModel && !hasDeviceInstance) {
    errors.push(createError(`No device instance was defined for model '${currentDeviceModel}'. Please add at least one device name.`));
  }

  // 删除与 AllDeviceTypes 中已存在的设备名冲突的条目
  Object.keys(deviceNameToType).forEach((deviceName) => {
    if (ALL_MODEL_NAMES.includes(deviceName)) {
      delete deviceNameToType[deviceName];
    }
  });

  return { errors, deviceNameToType, registeredDeviceNames };
}