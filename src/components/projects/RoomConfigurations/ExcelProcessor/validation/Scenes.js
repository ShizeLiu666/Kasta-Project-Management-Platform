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

  // 定义单风扇操作的合法模式
  const singleFanPattern = /^[a-zA-Z0-9_]+ ON RELAY (ON|OFF)(?: SPEED \d+)?$/i;
  const singleFanOffPattern = /^[a-zA-Z0-9_]+ OFF RELAY OFF$/i;

  // 构建操作字符串
  const operationString = deviceName + " " + operation;

  // 检查操作字符串是否匹配合法模式
  if (
    !singleFanPattern.test(operationString) &&
    !singleFanOffPattern.test(operationString)
  ) {
    errors.push([
      `KASTA SCENE [${sceneName}]: Fan Type operation '${operationString}' does not match any of the allowed formats. Accepted formats are:`,
      "- FAN_NAME ON RELAY ON (Single ON)",
      "- FAN_NAME OFF RELAY OFF (Single OFF)",
      "- FAN_NAME ON RELAY ON SPEED X (Single ON with Speed, optional)"
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
  // 找到第一个 ON 或 OFF 之前的部分作为设备名
  const deviceNames = [];
  let operationIndex = -1;

  for (let i = 0; i < parts.length; i++) {
    if (["ON", "OFF"].includes(parts[i].toUpperCase())) {
      operationIndex = i;
      break;
    } else {
      // 去除设备名称中的逗号和空格
      deviceNames.push(parts[i].replace(/,$/, "").trim());
    }
  }

  // 获取操作部分
  const operationParts = parts.slice(operationIndex);

  // 调试输出
  // console.log("Device Names:", deviceNames);
  // console.log("Operation Parts:", operationParts);
  // console.log("deviceNameToType:", deviceNameToType);

  // 检查设备类型是否一致
  const deviceTypes = new Set(
    deviceNames.map((name) => deviceNameToType[name])
  );

  // 调试输出每个设备的类型
  // deviceNames.forEach((name) => {
  //   console.log(`Device: ${name}, Type: ${deviceNameToType[name]}`);
  // });

  // 如果有设备名在 `deviceNameToType` 中找不到类型
  if (deviceTypes.has(undefined)) {
    errors.push(
      `KASTA SCENE [${sceneName}]: One or more devices in the instruction "${parts.join(
        " "
      )}" have unrecognized names.`
    );
    return;
  }

  if (deviceTypes.size > 1) {
    errors.push(
      `KASTA SCENE [${sceneName}]: Devices in the same batch must be of the same type. The instruction "${parts.join(
        " "
      )}" contains mixed types.`
    );
    return;
  }

  const deviceType = deviceTypes.values().next().value;

  // 构建操作字符串
  const operationString =
    deviceNames.join(", ") + " " + operationParts.join(" ");

  const singlePPTPattern = /^PPT\d+\s+(ON|OFF)$/i;
  const twoWayPPTPattern = /^PPT_\d+\s+(ON|OFF)\s+(ON|OFF)$/i;
  const groupSingleWayPPTPattern = /^PPT_\d+(,\s*PPT_\d+)*\s+(ON|OFF)$/i;
  const groupTwoWayPPTPattern = /^PPT_\d+(,\s*PPT_\d+)*\s+(ON|OFF)\s+(ON|OFF)$/i;

  let isValid = false;

  if (deviceType === "PowerPoint Type (Single-Way)") {
    isValid =
      singlePPTPattern.test(operationString) ||
      groupSingleWayPPTPattern.test(operationString);
  } else if (deviceType === "PowerPoint Type (Two-Way)") {
    isValid =
      twoWayPPTPattern.test(operationString) ||
      groupTwoWayPPTPattern.test(operationString);
  }

  if (!isValid) {
    errors.push([
      `KASTA SCENE [${sceneName}]: Invalid POWERPOINT operation. The operation string "${operationString}" is not valid for device type "${deviceType}". Supported formats are:`,
      "- DEVICE_NAME ON (Single-way ON)",
      "- DEVICE_NAME ON ON (Two-way ON ON)",
      "- DEVICE_NAME OFF OFF (Two-way OFF OFF)",
      "- DEVICE_NAME_1, DEVICE_NAME_ ON OFF (Group ON OFF)"
    ]);
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

  function isValidOperation(part) {
    const normalizedPart = part.toLowerCase();
    return ["on", "off", "turn on", "turn off", "open", "close"].includes(normalizedPart);
  }

  function normalizeOperation(operation) {
    operation = operation.toLowerCase().trim();
    if (operation === 'on' || operation === 'turn on') {
        return 'ON';
    } else if (operation === 'off' || operation === 'turn off') {
        return 'OFF';
    }
    return operation.toUpperCase(); // 对于其他操作，保持大写
  }

  // Step 1 & 2: Identify devices and operation
  let deviceNameProvided = false;
  let operationParts = [];
  let i = 0;
  while (i < parts.length) {
    const part = parts[i];
    const nextPart = parts[i + 1];
    
    if (isValidOperation(part) || (part.toLowerCase() === "turn" && nextPart && isValidOperation(part + " " + nextPart))) {
      if (!operation) {
        operation = normalizeOperation(part + (nextPart && part.toLowerCase() === "turn" ? " " + nextPart : ""));
        operationParts.push(operation);
        i += (part.toLowerCase() === "turn" ? 2 : 1);
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
    errors.push(
      `KASTA SCENE [${sceneName}]: No valid operation (ON, OFF, OPEN, CLOSE) found in the instruction: "${parts.join(" ")}". Unable to determine command.`
    );
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
    if (
      simplifiedTypesInBatch.size > 1 &&
      !(
        simplifiedTypesInBatch.has("PowerPoint") &&
        simplifiedTypesInBatch.size === 1
      )
    ) {
      const containsDimmerAndRelay =
        simplifiedTypesInBatch.has("Dimmer") &&
        simplifiedTypesInBatch.has("Relay");
      const containsDimmingOperation = /\+\d+%/.test(instruction);

      if (containsDimmerAndRelay && !containsDimmingOperation) {
        return;
      } else {
        errors.push(
          `KASTA SCENE [${sceneName}]: Devices in the same batch must be of the same type, except Dimmer Type and Relay Type can coexist when performing the same ON/OFF operation without dimming. The problematic instruction was: "${instruction}".`
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
