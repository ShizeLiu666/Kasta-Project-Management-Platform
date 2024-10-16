import * as XLSX from 'xlsx';

export const AllDeviceTypes = {
    "Dimmer Type": ["KBSKTDIM", "D300IB", "D300IB2", "DH10VIB", "DM300BH", "D0-10IB", "DDAL"],
    "Relay Type": ["KBSKTREL", "S2400IB2", "S2400IBH", "RM1440BH", "KBSKTR2400"],
    "Curtain Type": ["C300IBH"],
    "Fan Type": ["FC150A2"],
    "RGB Type": ["KB8RGBG", "KB36RGBS", "KB9TWG", "KB12RGBD", "KB12RGBG"],
    "PowerPoint Type": {
        "Single-Way": ["H1PPWVBX"],
        "Two-Way": ["K2PPHB", "H2PPHB", "H2PPWHB"]
    },
    "Dry Contact": ["S10IBH"],
    "Remote Control": {
        "1 Push Panel": ["H1RSMB", "1BMBH"],
        "2 Push Panel": ["H2RSMB"],
        "3 Push Panel": ["H3RSMB"],
        "4 Push Panel": ["H4RSMB"],
        "5 Push Panel": ["H5RSMB"],
        "6 Push Panel": ["H6RSMB"]
    },
    "5 Input Module": ["5RSIBH"],
    "6 Input Module": ["6RSIBH"],
    "4 Output Module": ["4OS2IBH"]
};

let deviceNameToType = {};
let deviceNameToAppearanceShortname = {};

export function resetDeviceNameToType() {
    deviceNameToType = {};
    deviceNameToAppearanceShortname = {};
}

export function extractTextFromSheet(sheet) {
    const textList = [];
    sheet.forEach(row => {
        row.forEach(cellValue => {
            if (cellValue && typeof cellValue === 'string') {
                let value = cellValue.replace(/（/g, '(').replace(/）/g, ')').replace(/：/g, ':');
                value = value.replace(/\(.*?\)/g, '');
                value.split('\n').forEach(text => {
                    if (text.trim()) textList.push(text.trim());
                });
            }
        });
    });
    return textList;
}

export function processExcelToJson(fileContent) {
    const workbook = XLSX.read(fileContent, { type: 'array' });
    const allTextData = {};

    workbook.SheetNames.forEach(sheetName => {
        if (sheetName.includes("Programming Details")) {
            const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
            allTextData["programming details"] = extractTextFromSheet(sheet);
        }
    });

    return Object.keys(allTextData).length ? allTextData : null;
}

export function processDevices(splitData) {
    const devicesContent = splitData.devices || [];
    const devicesData = [];
    let currentShortname = null;

    function isModelMatching(model, shortname) {
        return shortname && (model.includes(shortname) || shortname.includes(model));
    }

    devicesContent.forEach(line => {
        line = line.trim();

        if (line.startsWith("NAME:")) {
            currentShortname = line.replace("NAME:", "").trim();
            return;
        }

        if (line.startsWith("QTY:")) return;

        let deviceType = null;
        const shortnameForMatching = currentShortname;

        for (const [dtype, models] of Object.entries(AllDeviceTypes)) {
            if (Array.isArray(models)) {
                if (models.some(model => isModelMatching(model, shortnameForMatching))) {
                    deviceType = dtype;
                    break;
                }
            } else if (typeof models === 'object') {
                for (const subType in models) {
                    const subModelArray = models[subType];
                    if (Array.isArray(subModelArray) && subModelArray.some(model => isModelMatching(model, shortnameForMatching))) {
                        deviceType = `${dtype} (${subType})`;
                        break;
                    }
                }
            }
            if (deviceType) break;
        }

        if (currentShortname) {
            const deviceInfo = {
                appearanceShortname: currentShortname,
                deviceName: line,
                ...(deviceType && { deviceType })
            };
            devicesData.push(deviceInfo);

            deviceNameToType[line] = deviceType;
            deviceNameToAppearanceShortname[line] = currentShortname;
            // console.log(`Mapping ${line} to ${deviceType}`); // 调试信息
        }
    });

    return { devices: devicesData };
}

const sceneOutputTemplates = {
    "Relay Type": (name, status) => ({
        name,
        status, // 已经是布尔值，直接使用
        statusConditions: {} // Relay Type 通常没有额外的状态条件
    }),
    "Curtain Type": (name, status) => ({
        name,
        status, // 已经是布尔值，直接使用
        statusConditions: {
            position: status ? 100 : 0 // OPEN 为 true 时，位置为 100；CLOSE 为 false 时，位置为 0
        }
    }),
    "Dimmer Type": (name, status, level = 100) => ({
        name,
        status, // 已经是布尔值，直接使用
        statusConditions: {
            level // 亮度值由外部传入，默认为 100
        }
    }),
    "Fan Type": (name, status, relay_status, speed) => ({
        name,
        status, // 已经是布尔值，直接使用
        statusConditions: {
            relay: relay_status, // relay_status 已经是布尔值
            speed // 风速值由外部传入
        }
    }),
    "PowerPoint Type": {
        "Two-Way": (name, left_power, right_power) => ({
            name,
            statusConditions: {
                leftPowerOnOff: left_power, // 左侧电源状态，布尔值
                rightPowerOnOff: right_power // 右侧电源状态，布尔值
            }
        }),
        "Single-Way": (name, power) => ({
            name,
            statusConditions: {
                rightPowerOnOff: power // 单路电源状态，布尔值
            }
        })
    }
};

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

    if (deviceType.includes("Two-Way")) {
        // 查找操作指令的索引
        let rightPowerIndex = parts.findIndex(part => part.toUpperCase() === "ON" || part.toUpperCase() === "OFF");
        let leftPowerIndex = parts.findIndex((part, index) => index > rightPowerIndex && (part.toUpperCase() === "ON" || part.toUpperCase() === "OFF"));

        if (rightPowerIndex === -1 || leftPowerIndex === -1) {
            // console.warn(`Invalid operation format for Two-Way PowerPoint Type: ${parts.join(" ")}`);
            return contents;
        }

        const rightPower = parts[rightPowerIndex].toUpperCase() === "ON";
        const leftPower = parts[leftPowerIndex].toUpperCase() === "ON";

        parts.slice(0, rightPowerIndex).forEach(deviceName => {
            contents.push(sceneOutputTemplates["PowerPoint Type"]["Two-Way"](deviceName.trim().replace(",", ""), rightPower, leftPower));
        });
    } else if (deviceType.includes("Single-Way")) {
        const power = parts[parts.length - 1].toUpperCase() === "ON"; // 转换为布尔值
        parts.slice(0, -1).forEach(deviceName => {
            contents.push(sceneOutputTemplates["PowerPoint Type"]["Single-Way"](deviceName.trim().replace(",", ""), power));
        });
    }

    return contents;
}

function determineDeviceType(deviceName) {
    const originalDeviceName = deviceName.trim().replace(',', '');

    if (!originalDeviceName) {
        // console.error(`Error: Detected empty or invalid device name: '${originalDeviceName}'`);
        throw new Error("Device name can not be empty.");
    }

    const deviceType = deviceNameToType[originalDeviceName];
    if (deviceType) {
        return deviceType;
    } else {
        throw new Error(`Can not define device type for '${originalDeviceName}'`);
    }
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

export function processScenes(splitData) {
    const scenesContent = splitData.scenes || [];
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

export function processGroups(splitData) {
    const groupsContent = splitData.groups || [];
    const groupsData = [];
    let currentGroupName = null;
    let currentDevices = [];

    groupsContent.forEach(line => {
        line = line.trim();

        if (line.startsWith("NAME:")) {
            if (currentGroupName) {
                groupsData.push({
                    groupName: currentGroupName,
                    devices: currentDevices
                });
                currentDevices = [];
            }
            currentGroupName = line.replace("NAME:", "").trim();
        } else if (currentGroupName) {
            line = line.replace(/CONTROL CONTENT:|DEVICE CONTENT:|DEVICE CONTROL:/g, '').trim();
            const devices = line.split(',')
                                .map(device => device.trim())
                                .filter(device => device);
            
            devices.forEach(deviceName => {
                currentDevices.push({
                    appearanceShortname: deviceNameToAppearanceShortname[deviceName] || '',
                    deviceName: deviceName
                });
            });
        }
    });

    // 添加最后一个组
    if (currentGroupName) {
        groupsData.push({
            groupName: currentGroupName,
            devices: currentDevices
        });
    }

    return { groups: groupsData };
}

function getRcIndex(deviceType, operation) {
    // 将操作转换为大写以进行比较
    const upperOperation = operation ? operation.toUpperCase() : '';

    if (deviceType === "Curtain Type") {
        switch (upperOperation) {
            case "OPEN":
                return 0;
            case "CLOSE":
                return 1;
            case "WHOLE":
                return 2;
            default:
                return 1; // 默认为 CLOSE
        }
    }
    
    if (deviceType === "Fan Type") {
        switch (upperOperation) {
            case "FAN":
                return 0;
            case "LAMP":
                return 1;
            case "WHOLE":
                return 2;
            default:
                return 0; // 默认为 FAN
        }
    }
    
    if (deviceType === "PowerPoint Type (Two-Way)") {
        if (!upperOperation) {
            return 4; // 保持不变，表示两路都开
        }
        const [leftOperation, rightOperation] = upperOperation.split(/\s+/);
        if (rightOperation === "ON" && leftOperation === "OFF") {
            return 2; // 右侧（第一路）开，左侧关
        } else if (rightOperation === "OFF" && leftOperation === "ON") {
            return 3; // 右侧（第一路）关，左侧开
        } else if (rightOperation === "ON" && leftOperation === "ON") {
            return 4; // 两路都开
        } else if (rightOperation === "OFF" && leftOperation === "OFF") {
            return 5; // 两路都关
        }
    }
    
    return 1; // 默认值，用于其他设备类型
}

export function processRemoteControls(splitData) {
    const remoteControlsContent = splitData.remoteControls || [];
    const remoteControlsData = [];
    let currentRemote = null;
    let currentLinks = [];

    remoteControlsContent.forEach(line => {
        line = line.trim();

        if (line.startsWith("TOTAL")) return;

        if (line.startsWith("NAME:")) {
            if (currentRemote) {
                remoteControlsData.push({ remoteName: currentRemote, links: currentLinks });
            }
            currentRemote = line.replace("NAME:", "").trim();
            currentLinks = [];
        } else if (line.startsWith("LINK:")) {
            return;
        } else {
            const parts = line.split(":");
            if (parts.length < 2) return;

            const linkIndex = parseInt(parts[0].trim(), 10) - 1;
            let linkDescription = parts[1].trim();
            let action = null;

            if (linkDescription.includes(" - ")) {
                [linkDescription, action] = linkDescription.split(" - ");
                action = action.trim();
            }

            let linkType = 0;
            let linkName = "";
            let rc_index = 1; // 默认值为 1

            if (linkDescription.startsWith("SCENE")) {
                linkType = 4; // 场景
                linkName = linkDescription.replace("SCENE", "").trim();
                rc_index = 0; // 场景控制
            } else if (linkDescription.startsWith("GROUP")) {
                linkType = 2; // 分组
                linkName = linkDescription.replace("GROUP", "").trim();
                rc_index = 32; // 分组控制
            } else if (linkDescription.startsWith("DEVICE")) {
                linkType = 1; // 设备
                linkName = linkDescription.replace("DEVICE", "").trim();
                const deviceType = deviceNameToType[linkName];
                rc_index = getRcIndex(deviceType, action);
            }

            // 将 action 转换为大写
            action = action ? action.toUpperCase() : null;

            currentLinks.push({ linkIndex, linkType, linkName, action, rc_index });
        }
    });

    if (currentRemote) {
        remoteControlsData.push({ remoteName: currentRemote, links: currentLinks });
    }

    return { remoteControls: remoteControlsData };
}

export function splitJsonFile(inputData) {
    const content = inputData["programming details"] || [];
    const splitKeywords = {
        devices: "KASTA DEVICE",
        groups: "KASTA GROUP",
        scenes: "KASTA SCENE",
        remoteControls: "REMOTE CONTROL LINK"
    };

    const splitData = { devices: [], groups: [], scenes: [], remoteControls: [] };
    let currentKey = null;

    content.forEach(line => {
        if (Object.values(splitKeywords).includes(line)) {
            currentKey = Object.keys(splitKeywords).find(key => splitKeywords[key] === line);
            return;
        }
        if (currentKey) splitData[currentKey].push(line);
    });

    return {
        ...processDevices(splitData),
        ...processGroups(splitData),
        ...processScenes(splitData),
        ...processRemoteControls(splitData)
    };
}
