import { AllDeviceTypes } from "../ExcelProcessor";

// 常量定义
const NAME_PREFIX = "NAME:";
const QTY_PREFIX = "QTY:";
const KASTA_DEVICE_ERROR = "KASTA DEVICE:";
const VALID_NAME_REGEX = /^[a-zA-Z0-9_]+$/;

// 辅助函数
const createError = (message) => `${KASTA_DEVICE_ERROR} ${message}`;

const isValidName = (name) => VALID_NAME_REGEX.test(name);

function checkNamePrefix(line, errors) {
  if (!line.startsWith(NAME_PREFIX)) {
    errors.push(createError(`The line '${line}' is missing a colon after 'NAME'. It should be formatted as 'NAME:'.`));
    return false;
  }
  return true;
}

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

function validateDeviceName(line, errors, registeredDeviceNames) {
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

function checkConflict(modelList, deviceName) {
  return Array.isArray(modelList) && modelList.includes(deviceName);
}

export function validateDevices(deviceDataArray) {
  const errors = [];
  let deviceNameToType = {};
  const registeredDeviceNames = new Set();
  let currentDeviceType = null;
  let currentDeviceModel = null;

  deviceDataArray.forEach((line) => {
    line = line.trim();

    if (line.startsWith(QTY_PREFIX) || line.includes("(")) return;

    if (line.startsWith(NAME_PREFIX)) {
      // 情况1和2：NAME开头的行
      if (!checkNamePrefix(line, errors)) return;
      currentDeviceModel = line.substring(NAME_PREFIX.length).trim();
      if (!validateDeviceModel(currentDeviceModel, errors)) return;

      const { type, exists } = findDeviceType(currentDeviceModel);
      currentDeviceType = type;

      if (!exists) {
        errors.push(createError(`The device model '${currentDeviceModel}' is not recognized in any known device type.`));
        return;
      }
      
      deviceNameToType[currentDeviceModel] = currentDeviceType;
    } else {
      // 情况3：可能缺少NAME前缀的行
      if (!checkMissingNamePrefix(line, errors)) return;
      if (!validateDeviceName(line, errors, registeredDeviceNames)) return;

      if (currentDeviceType) {
        deviceNameToType[line] = currentDeviceType;
      }
    }
  });

  // 删除与 AllDeviceTypes 中已存在的设备名冲突的条目
  Object.keys(deviceNameToType).forEach((deviceName) => {
    for (const models of Object.values(AllDeviceTypes)) {
      if (checkConflict(models, deviceName)) {
        delete deviceNameToType[deviceName];
        break;
      }
      if (typeof models === "object") {
        if (Object.values(models).some(subModels => checkConflict(subModels, deviceName))) {
          delete deviceNameToType[deviceName];
          break;
        }
      }
    }
  });

  console.log("Errors found:", errors);
  console.log("Device Types:", deviceNameToType);

  return { errors, deviceNameToType, registeredDeviceNames };
}