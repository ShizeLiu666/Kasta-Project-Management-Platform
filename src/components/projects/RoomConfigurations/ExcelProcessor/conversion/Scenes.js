import { sceneOutputTemplates, determineDeviceType } from '../ExcelProcessor';

function handleFanType(parts) {
    const deviceName = parts[0];
    const status = parts[1] === "ON"; // 风扇开关状态：ON 为 true，OFF 为 false
    const relayStatus = parts[3] === "ON"; // 继电器开关状态：ON 为 true，OFF 为 false
    let speed = status ? 1 : 0; // 默认速度：ON 为 1，OFF 为 0

    if (parts.length > 5 && parts[4] === "SPEED") {
        speed = parseInt(parts[5], 10); // 如果提供了速度，使用提供的速度值
    }

    return [sceneOutputTemplates["Fan Type"](deviceName, status, relayStatus, speed)];
}


function handleDimmerType(parts) {
    const contents = [];
    const statusIndex = parts.findIndex(part => ["ON", "OFF"].includes(part));
    const status = parts[statusIndex] === "ON"; // 将状态转换为布尔值

    let level = 100;
    if (status && parts.length > statusIndex + 1) { // 只在 ON 时考虑亮度
        try {
            const levelPart = parts[statusIndex + 1].replace("+", "").replace("%", "").trim();
            level = parseInt(levelPart, 10);
        } catch (e) {
            level = 100;
        }
    } else if (!status) { // OFF 状态亮度设为 0
        level = 0;
    }

    parts.slice(0, statusIndex).forEach(entry => {
        const deviceName = entry.trim().replace(",", "");
        try {
            const deviceType = determineDeviceType(deviceName);
            if (deviceType === "Relay Type") { // 判断是否是继电器设备
                contents.push(sceneOutputTemplates["Relay Type"](deviceName, status));
            } else {
                contents.push(sceneOutputTemplates["Dimmer Type"](deviceName, status, level));
            }
        } catch (e) {
            // console.warn(`Skipping device due to error: ${e.message}`);
        }
    });

    return contents;
}

function handleRelayType(parts) {
    const contents = [];
    const status = parts[parts.length - 1] === "ON"; // 将状态转换为布尔值

    parts.slice(0, -1).forEach(entry => {
        const deviceName = entry.trim().replace(",", "");
        try {
            const deviceType = determineDeviceType(deviceName);
            if (deviceType === "Dimmer Type") { // 判断是否是调光器设备
                const level = status ? 100 : 0; // 如果是调光器，ON 为 100，OFF 为 0
                contents.push(sceneOutputTemplates["Dimmer Type"](deviceName, status, level));
            } else {
                contents.push(sceneOutputTemplates["Relay Type"](deviceName, status));
            }
        } catch (e) {
            // console.warn(`Skipping device due to error: ${e.message}`);
        }
    });

    return contents;
}

function handleCurtainType(parts) {
    const contents = [];
    const status = parts[parts.length - 1] === "OPEN"; // 将 OPEN 转换为 true，CLOSE 转换为 false

    parts.slice(0, -1).forEach(entry => {
        const deviceName = entry.trim().replace(",", "");
        contents.push(sceneOutputTemplates["Curtain Type"](deviceName, status));
    });

    return contents;
}

function handleDryContactType(parts) {
    const contents = [];
    const status = parts[parts.length - 1] === "ON"; // 将状态转换为布尔值

    parts.slice(0, -1).forEach(entry => {
        const deviceName = entry.trim().replace(",", "");
        contents.push(sceneOutputTemplates["Relay Type"](deviceName, status)); // Dry Contact 类型和 Relay 类型处理类似
    });

    return contents;
}

function handlePowerPointType(parts, deviceType) {
    const contents = [];
    
    const operationIndex = parts.findIndex(part => 
        ["ON", "OFF", "UNSELECT"].includes(part.toUpperCase())
    );
    
    if (operationIndex === -1) return contents;
    
    const deviceNames = parts.slice(0, operationIndex);
    const operations = parts.slice(operationIndex);

    if (deviceType.includes("Single-Way")) {
        deviceNames.forEach(deviceName => {
            contents.push({
                name: deviceName.trim().replace(",", ""),
                deviceType: "PowerPoint Type (Single-Way)",
                statusConditions: {
                    status: operations[0].toUpperCase() === "ON"
                }
            });
        });
    } else if (deviceType.includes("Two-Way")) {
        deviceNames.forEach(deviceName => {
            const leftStatus = operations[0].toUpperCase();
            const rightStatus = operations[1] ? operations[1].toUpperCase() : "OFF";
            
            if (leftStatus === "UNSELECT" && rightStatus === "UNSELECT") {
                console.warn("Invalid combination: UNSELECT UNSELECT is not allowed");
                return;
            }

            contents.push({
                name: deviceName.trim().replace(",", ""),
                deviceType: "PowerPoint Type (Two-Way)",
                statusConditions: {
                    leftStatus: leftStatus,
                    rightStatus: rightStatus
                }
            });
        });
    }

    return contents;
}

export function parseSceneContent(sceneName, contentLines) {
    const contents = [];

    function normalizeOperation(operation) {
        operation = operation.toLowerCase().trim();
        if (operation === 'on' || operation === 'turn on') {
            return 'ON';
        } else if (operation === 'off' || operation === 'turn off') {
            return 'OFF';
        }
        return operation.toUpperCase();
    }

    contentLines.forEach(line => {
        const parts = line.split(/\s+/);
        if (parts.length < 2) return;

        try {
            const deviceType = determineDeviceType(parts[0]);

            // 查找操作指令的索引
            let operationIndex = parts.findIndex(part =>
                ['ON', 'OFF', 'OPEN', 'CLOSE'].includes(part.toUpperCase()) ||
                (part.toUpperCase() === 'TURN' && parts[parts.indexOf(part) + 1] &&
                    ['ON', 'OFF'].includes(parts[parts.indexOf(part) + 1].toUpperCase()))
            );

            if (operationIndex !== -1) {
                // 标准化操作指令
                let operation = parts[operationIndex].toUpperCase();
                if (operation === 'TURN') {
                    operation += ' ' + parts[operationIndex + 1].toUpperCase();
                    parts.splice(operationIndex, 2, normalizeOperation(operation));
                } else {
                    parts[operationIndex] = normalizeOperation(operation);
                }
            }

            if (deviceType === "Fan Type") {
                contents.push(...handleFanType(parts));
            } else if (deviceType === "Relay Type") {
                contents.push(...handleRelayType(parts));
            } else if (deviceType === "Curtain Type") {
                contents.push(...handleCurtainType(parts));
            } else if (deviceType === "Dimmer Type") {
                contents.push(...handleDimmerType(parts));
            } else if (deviceType.includes("PowerPoint Type")) {
                if (deviceType.includes("Two-Way")) {
                    contents.push(...handlePowerPointType(parts, "Two-Way PowerPoint Type"));
                } else if (deviceType.includes("Single-Way")) {
                    contents.push(...handlePowerPointType(parts, "Single-Way PowerPoint Type"));
                }
            } else if (deviceType === "Dry Contact") {
                contents.push(...handleDryContactType(parts));
            }
        } catch (e) {
            console.warn(`Skipping line due to error: ${e.message}`);
        }
    });

    return contents;
}

export function processScenes(scenesContent) {
    if (!scenesContent) return { scenes: [] };
    
    const scenesData = {};
    let currentScene = null;

    scenesContent.forEach(line => {
        line = line.trim();

        if (line.startsWith("CONTROL CONTENT:")) return;

        if (line.startsWith("NAME:")) {
            currentScene = line.replace("NAME:", "").trim();
            if (!scenesData[currentScene]) {
                scenesData[currentScene] = [];
            }
        } else if (currentScene) {
            scenesData[currentScene].push(...parseSceneContent(currentScene, [line]));
        }
    });

    return {
        scenes: Object.entries(scenesData).map(([sceneName, contents]) => ({ sceneName, contents }))
    };
}