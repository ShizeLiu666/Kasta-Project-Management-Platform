const POWER_OPERATIONS = {
    ON: "ON",
    OFF: "OFF",
    UNSELECT: "UNSELECT"
};

//! Check for 'NAME' without a colon
function checkNamePrefix(line, errors) {
  if (!line.startsWith("NAME:")) {
    errors.push(
      `KASTA SCENE: The line '${line}' is missing a colon after 'NAME'. It should be formatted as 'NAME:'.`
    );
    return false;
  }
  return true;
}

//! Validate the scene name
function validateSceneName(sceneName, errors, registeredSceneNames) {
  //! Check if the scene name is empty
  if (!sceneName) {
    errors.push(
      `KASTA SCENE: The line with 'NAME:' is missing a scene name. Please enter a valid scene name.`
    );
    return false;
  }

  //! Check for disallowed special characters in the scene name, allowing spaces
  if (/[^a-zA-Z0-9_ ]/.test(sceneName)) {
    errors.push(
      `KASTA SCENE: The scene name '${sceneName}' contains special characters. Only letters, numbers, underscores, and spaces are allowed.`
    );
    return false;
  }

  // 检查重复的 Scene Name
  if (registeredSceneNames.has(sceneName)) {
    errors.push(`KASTA SCENE: The scene name '${sceneName}' is duplicated. Each scene name must be unique.`);
    return false;
  }

  registeredSceneNames.add(sceneName);
  return true;
}

//! Validate Relay Type operations using regex
function validateRelayTypeOperations(names, operation, errors, sceneName) {
  const singleOnPattern = /^[a-zA-Z0-9_]+ ON$/i;
  const singleOffPattern = /^[a-zA-Z0-9_]+ OFF$/i;
  const groupOnPattern = /^[a-zA-Z0-9_]+(,\s*[a-zA-Z0-9_]+)*\s+ON$/i;
  const groupOffPattern = /^[a-zA-Z0-9_]+(,\s*[a-zA-Z0-9_]+)*\s+OFF$/i;

  const operationString = names.join(", ") + " " + operation;

  if (
    !singleOnPattern.test(operationString) &&
    !singleOffPattern.test(operationString) &&
    !groupOnPattern.test(operationString) &&
    !groupOffPattern.test(operationString)
  ) {
    errors.push([
      `KASTA SCENE [${sceneName}]: Invalid operation format for Relay Type. The operation string "${operationString}" is not valid. Accepted formats are:`,
      "- DEVICE_NAME ON (Single ON)",
      "- DEVICE_NAME OFF (Single OFF)",
      "- DEVICE_NAME_1, DEVICE_NAME_2 ON (Group ON)",
      "- DEVICE_NAME_1, DEVICE_NAME_2 OFF (Group OFF)"
    ]);
  }
}

//! Validate Dimmer Type operations using regex
function validateDimmerTypeOperations(names, operation, errors, sceneName) {
  const singleOnPattern = /^[a-zA-Z0-9_]+ ON$/i;
  const singleOffPattern = /^[a-zA-Z0-9_]+ OFF$/i;
  const groupOnPattern = /^[a-zA-Z0-9_]+(\s*[,\s]\s*[a-zA-Z0-9_]+)* ON$/i;
  const groupOffPattern = /^[a-zA-Z0-9_]+(\s*[,\s]\s*[a-zA-Z0-9_]+)* OFF$/i;
  const singleDimmerPattern = /^[a-zA-Z0-9_]+ ON \+\d+%$/i;
  const groupDimmerPattern = /^[a-zA-Z0-9_]+(\s*[,\s]\s*[a-zA-Z0-9_]+)* ON \+\d+%$/i;

  const operationString = names.join(", ") + " " + operation;

  if (
    !singleOnPattern.test(operationString) &&
    !singleOffPattern.test(operationString) &&
    !groupOnPattern.test(operationString) &&
    !groupOffPattern.test(operationString) &&
    !singleDimmerPattern.test(operationString) &&
    !groupDimmerPattern.test(operationString)
  ) {
    errors.push([
      `KASTA SCENE [${sceneName}]: Dimmer Type operation '${operationString}' does not match any of the allowed formats. Accepted formats are:`,
      "- DEVICE_NAME ON (Single ON)",
      "- DEVICE_NAME OFF (Single OFF)",
      "- DEVICE_NAME_1, DEVICE_NAME_2 ON (Group ON)",
      "- DEVICE_NAME_1, DEVICE_NAME_2 OFF (Group OFF)",
      "- DEVICE_NAME ON +XX% (Single Device Dimming)",
      "- DEVICE_NAME_1, DEVICE_NAME_2 ON +XX% (Group Device Dimming)"
    ]);
  } else {
    const dimmerMatch = operation.match(/\+(\d+)%$/);
    if (dimmerMatch) {
      const dimmingValue = parseInt(dimmerMatch[1], 10);
      if (dimmingValue < 0 || dimmingValue > 100) {
        errors.push(
          `KASTA SCENE [${sceneName}]: Dimmer Type operation '${operationString}' contains an invalid dimming value '${dimmingValue}%'. The dimming value must be between 0 and 100.`
        );
      }
    }
  }
}

//! Validate Fan Type operations using regex
function validateFanTypeOperations(parts, errors, sceneName) {
  const deviceName = parts[0];

  // 检查设备名称是否有效
  if (!deviceName || ["ON", "OFF", "RELAY", "SPEED"].includes(deviceName)) {
    errors.push(
      `KASTA SCENE [${sceneName}]: The device name is missing or invalid in the instruction: "${parts.join(
        " "
      )}". A valid device name is required.`
    );
    return;
  }

  // 检查设备名称中是否包含无效字符
  if (/[^a-zA-Z0-9_]/.test(deviceName)) {
    errors.push(
      `KASTA SCENE [${sceneName}]: The device name '${deviceName}' contains invalid characters. Only letters, numbers, and underscores are allowed.`
    );
    return;
  }

  // 获取操作部分
  const operation = parts.slice(1).join(" ");

  // 定义单风扇操作的合法模式（修改正则表达式以限制速度范围）
  const singleFanPattern = /^[a-zA-Z0-9_]+ ON RELAY (ON|OFF)(?: SPEED [1-3])?$/i;
  const singleFanOffPattern = /^[a-zA-Z0-9_]+ OFF RELAY OFF$/i;

  // 构建操作字符串
  const operationString = deviceName + " " + operation;

  // 检查速度值是否在有效范围内
  if (operation.toUpperCase().includes('SPEED')) {
    const speedMatch = operation.match(/SPEED (\d+)/i);
    if (speedMatch) {
      const speedValue = parseInt(speedMatch[1]);
      if (speedValue < 1 || speedValue > 3) {
        errors.push(
          `KASTA SCENE [${sceneName}]: Fan speed value must be between 1 and 3. Found: ${speedValue}`
        );
        return;
      }
    }
  }

  // 检查操作字符串是否匹配合法模式
  if (
    !singleFanPattern.test(operationString) &&
    !singleFanOffPattern.test(operationString)
  ) {
    errors.push([
      `KASTA SCENE [${sceneName}]: Fan Type operation '${operationString}' does not match any of the allowed formats. Accepted formats are:`,
      "- FAN_NAME ON RELAY ON (Single ON)",
      "- FAN_NAME OFF RELAY OFF (Single OFF)",
      "- FAN_NAME ON RELAY ON SPEED X (X must be 1-3)"
    ]);
  }
}

//! Validate Curtain Type operations using regex
function validateCurtainTypeOperations(names, operation, errors, sceneName) {
  const singleCurtainPattern = /^[a-zA-Z0-9_]+ (OPEN|CLOSE)$/i;
  const groupCurtainPattern =
    /^[a-zA-Z0-9_]+(,\s*[a-zA-Z0-9_]+)*\s+(OPEN|CLOSE)$/i;

  const operationString = names.join(", ") + " " + operation;

  if (
    !singleCurtainPattern.test(operationString) &&
    !groupCurtainPattern.test(operationString)
  ) {
    errors.push([
      `KASTA SCENE [${sceneName}]: Invalid operation format for Curtain Type. The operation string "${operationString}" is not valid. Accepted formats are:`,
      "- DEVICE_NAME OPEN (Single Open)",
      "- DEVICE_NAME CLOSE (Single Close)",
      "- DEVICE_NAME_1, DEVICE_NAME_2 OPEN (Group Open)",
      "- DEVICE_NAME_1, DEVICE_NAME_2 CLOSE (Group Close)"
    ]);
  }
}

//! Validate PowerPoint Type operations using regex
function validatePowerPointTypeOperations(
  parts,
  errors,
  sceneName,
  deviceNameToType
) {
  // 找到第一个操作符（ON, OFF, UNSELECT）之前的部分作为设备名
  const deviceNames = [];
  let operationIndex = -1;

  for (let i = 0; i < parts.length; i++) {
    if (Object.values(POWER_OPERATIONS).includes(parts[i].toUpperCase())) {
      operationIndex = i;
      break;
    } else {
      deviceNames.push(parts[i].replace(/,$/, "").trim());
    }
  }

  // 获取操作部分
  const operationParts = parts.slice(operationIndex);

  // 检查设备类型是否一致
  const deviceTypes = new Set(
    deviceNames.map((name) => deviceNameToType[name])
  );

  // 验证设备存在性
  if (deviceTypes.has(undefined)) {
    errors.push(
      `KASTA SCENE [${sceneName}]: One or more devices in the instruction "${parts.join(
        " "
      )}" have unrecognized names.`
    );
    return;
  }

  // 验证设备类型一致性
  if (deviceTypes.size > 1) {
    errors.push(
      `KASTA SCENE [${sceneName}]: Devices in the same batch must be of the same type.`
    );
    return;
  }

  const deviceType = deviceTypes.values().next().value;
  const operationString = deviceNames.join(", ") + " " + operationParts.join(" ");

  // 新的正则表达式模式
  const singleWayPattern = /^PPT\d+\s+(ON|OFF)$/i;
  const twoWayPattern = /^PPT_\d+\s+((ON\s+ON)|(ON\s+OFF)|(OFF\s+ON)|UNSELECT)$/i;

  let isValid = false;

  if (deviceType === "PowerPoint Type (Single-Way)") {
    isValid = singleWayPattern.test(operationString);
    if (!isValid) {
      errors.push([
        `KASTA SCENE [${sceneName}]: Invalid Single-Way PowerPoint operation. The operation string "${operationString}" is not valid. Supported formats are:`,
        "- DEVICE_NAME ON",
        "- DEVICE_NAME OFF"
      ]);
    }
  } else if (deviceType === "PowerPoint Type (Two-Way)") {
    isValid = twoWayPattern.test(operationString);
    if (!isValid) {
      errors.push([
        `KASTA SCENE [${sceneName}]: Invalid Two-Way PowerPoint operation. The operation string "${operationString}" is not valid. Supported formats are:`,
        "- DEVICE_NAME ON ON",
        "- DEVICE_NAME ON OFF",
        "- DEVICE_NAME OFF ON",
        "- DEVICE_NAME UNSELECT"
      ]);
    }
  }
}

//! Validate Dry Contact Type operations using regex
function validateDryContactTypeOperations(names, operation, errors, sceneName) {
  const singleOnPattern = /^[a-zA-Z0-9_]+ ON$/i;
  const singleOffPattern = /^[a-zA-Z0-9_]+ OFF$/i;
  const groupOnPattern = /^[a-zA-Z0-9_]+(, [a-zA-Z0-9_]+)* ON$/i;
  const groupOffPattern = /^[a-zA-Z0-9_]+(, [a-zA-Z0-9_]+)* OFF$/i;

  const operationString = names.join(", ") + " " + operation;

  if (
    !singleOnPattern.test(operationString) &&
    !singleOffPattern.test(operationString) &&
    !groupOnPattern.test(operationString) &&
    !groupOffPattern.test(operationString)
  ) {
    errors.push([
      `KASTA SCENE [${sceneName}]: Invalid operation format for Dry Contact Type. The operation string "${operationString}" is not valid. Accepted formats are:`,
      "- DEVICE_NAME ON (Single ON)",
      "- DEVICE_NAME OFF (Single OFF)",
      "- DEVICE_NAME_1, DEVICE_NAME_2 ON (Group ON)",
      "- DEVICE_NAME_1, DEVICE_NAME_2 OFF (Group OFF)"
    ]);
  }
}

//! Validate the consistency of device types within a line in a scene
function validateSceneDevicesInLine(parts, errors, deviceNameToType, sceneName) {
  let deviceTypesInLine = new Set();
  let deviceNames = [];
  let operation = null;
  let isFanOperation = false;

  function isValidOperation(part, deviceType) {
    const normalizedPart = part.toUpperCase();
    
    // PowerPoint Type 特殊处理
    if (deviceType && deviceType.includes("PowerPoint Type")) {
        if (deviceType.includes("Single-Way")) {
            return ["ON", "OFF"].includes(normalizedPart);
        }
        // Two-Way 的处理在 validatePowerPointTypeOperations 中完成
        return true;
    }
    
    // 其他设备类型的常规处理
    return ["ON", "OFF", "TURN ON", "TURN OFF", "OPEN", "CLOSE"].includes(normalizedPart);
  }

  function normalizeOperation(operation) {
    operation = operation.toUpperCase().trim();
    switch(operation) {
        case "ON":
        case "TURN ON":
            return POWER_OPERATIONS.ON;
        case "OFF":
        case "TURN OFF":
            return POWER_OPERATIONS.OFF;
        case "UNSELECT":
            return POWER_OPERATIONS.UNSELECT;
        default:
            return operation;
    }
  }

  // Step 1 & 2: Identify devices and operation
  let deviceNameProvided = false;
  let operationParts = [];
  let i = 0;

  // 添加 currentDeviceType 变量
  let currentDeviceType = null;

  while (i < parts.length) {
    const part = parts[i];
    const nextPart = parts[i + 1];
    
    // 如果已有设备名称，获取其类型
    if (deviceNames.length > 0 && deviceNames[0].length > 0) {
      currentDeviceType = deviceNameToType[deviceNames[0][0]];
    }
    
    // 检查是否是 "TURN ON" 或 "TURN OFF"
    if (part.toUpperCase() === "TURN" && nextPart && ["ON", "OFF"].includes(nextPart.toUpperCase())) {
        if (!operation) {
            operation = normalizeOperation(nextPart);
            operationParts.push(operation);
            i += 2;
            continue;
        }
    } else if (isValidOperation(part, currentDeviceType)) {
        if (!operation) {
            operation = normalizeOperation(part);
            operationParts.push(operation);
            i++;
            continue;
        }
    } else if (/^\+\d+%$/.test(part)) {
        operationParts.push(part);
    } else if (operation && ["RELAY", "SPEED"].includes(part.toUpperCase())) {
        isFanOperation = true;
        operationParts.push(part);
    } else {
        if (deviceNames.length === 0) {
            deviceNames.push([]);
        }
        deviceNames[0].push(part.replace(",", ""));
        deviceNameProvided = true;
    }
    i++;
  }

  if (!deviceNameProvided) {
    errors.push(
      `KASTA SCENE [${sceneName}]: The instruction "${parts.join(" ")}" is missing a device name or has an invalid format.`
    );
    return;
  }

  if (!operation) {
    const deviceType = deviceNameToType[deviceNames[0][0]];
    if (deviceType && deviceType.includes("PowerPoint Type (Single-Way)")) {
        errors.push(
            `KASTA SCENE [${sceneName}]: Single-Way PowerPoint only supports ON/OFF operations. Invalid instruction: "${parts.join(" ")}"`
        );
    } else {
        errors.push(
            `KASTA SCENE [${sceneName}]: No valid operation found in the instruction: "${parts.join(" ")}". Unable to determine command.`
        );
    }
    return;
  }

  operation = operationParts.join(" ");

  // Step 3: Validate the existence and type of each device
  deviceNames.forEach((names) => {
    const typesInBatch = new Set();

    names.forEach((name) => {
      const deviceType = deviceNameToType[name];
      if (deviceType) {
        typesInBatch.add(deviceType);
        deviceTypesInLine.add(deviceType);
      } else if (
        !isFanOperation &&
        !/^\+\d+%$/.test(name) &&
        !/^\d+%$/.test(name) &&
        !/^\+\d+$/.test(name) &&
        !/^\+\w+%$/.test(name) &&
        !/^-\d+$/.test(name) &&
        !/^-\d+%$/.test(name)
      ) {
        errors.push(
          `KASTA SCENE [${sceneName}]: The device name '${name}' in the scene is not recognized.`
        );
      }
    });

    // Step 4: Validate mixed types in the same batch
    const simplifiedTypesInBatch = new Set(
      [...typesInBatch].map((type) => type.split(" ")[0])
    );

    const instruction = parts.join(" ");
    // Allow PowerPoint Types to be treated in a special case
    if (simplifiedTypesInBatch.size > 1) {
      const containsDimmerAndRelay =
        simplifiedTypesInBatch.has("Dimmer") &&
        simplifiedTypesInBatch.has("Relay");
      const containsDimmingOperation = /\+\d+%/.test(instruction);

      if (containsDimmerAndRelay && !containsDimmingOperation) {
        return;
      } else {
        errors.push(
          `KASTA SCENE [${sceneName}]: Devices in the same batch must be of the same type. The problematic instruction was: "${instruction}".`
        );
        return;
      }
    }
  });

  // Step 5: If there are no recognized devices, skip further checks
  if (deviceNames.flat().length === 0) {
    errors.push(
      `KASTA SCENE [${sceneName}]: No recognized devices found in the instruction.`
    );
    return;
  }

  // Step 6: Validate operations based on device type using regex
  const checkDeviceType = (deviceType, baseType) =>
    deviceType.startsWith(baseType);

  if (
    [...deviceTypesInLine].some((type) => checkDeviceType(type, "Relay Type"))
  ) {
    validateRelayTypeOperations(
      deviceNames.flat(),
      operation,
      errors,
      sceneName
    );
  }
  if (
    [...deviceTypesInLine].some((type) => checkDeviceType(type, "Dimmer Type"))
  ) {
    validateDimmerTypeOperations(
      deviceNames.flat(),
      operation,
      errors,
      sceneName
    );
  }
  if (
    [...deviceTypesInLine].some((type) => checkDeviceType(type, "Fan Type"))
  ) {
    validateFanTypeOperations(parts, errors, sceneName);
  }
  if (
    [...deviceTypesInLine].some((type) => checkDeviceType(type, "Curtain Type"))
  ) {
    validateCurtainTypeOperations(
      deviceNames.flat(),
      operation,
      errors,
      sceneName
    );
  }
  if (
    [...deviceTypesInLine].some((type) => checkDeviceType(type, "Dry Contact"))
  ) {
    validateDryContactTypeOperations(
      deviceNames.flat(),
      operation,
      errors,
      sceneName
    );
  }
  if (
    [...deviceTypesInLine].some((type) =>
      checkDeviceType(type, "PowerPoint Type")
    )
  ) {
    validatePowerPointTypeOperations(
      parts,
      errors,
      sceneName,
      deviceNameToType
    );
  }
}

//! Validate all scenes in the provided data
export function validateScenes(sceneDataArray, deviceNameToType) {
  const errors = [];
  const registeredSceneNames = new Set();
  let currentSceneName = null;

  sceneDataArray.forEach((line) => {
    line = line.trim();

    if (line.startsWith("CONTROL CONTENT")) {
      return;
    }

    if (line.startsWith("NAME")) {
      if (!checkNamePrefix(line, errors)) return;
      currentSceneName = line.substring(5).trim();
      if (!validateSceneName(currentSceneName, errors, registeredSceneNames))
        return;
    } else if (currentSceneName && line) {
      const parts = line.split(/\s+/);
      validateSceneDevicesInLine(
        parts,
        errors,
        deviceNameToType,
        currentSceneName
      );
    }
  });

  // console.log(deviceNameToType);
  // console.log("Errors found:", errors);

  return { errors, registeredSceneNames };
}
