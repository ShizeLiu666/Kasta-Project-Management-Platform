/**
 * 场景转换模块 (conversion/Scenes.js)
 * 
 * 功能概述：
 * 这是conversion系统中最复杂的模块，负责将Excel中的场景定义数据转换为标准化的JSON格式。
 * 支持6种主要设备类型的复杂场景操作，包括状态控制、参数调节、多路操作等高级功能。
 * 
 * 支持的设备类型：
 * 1. 风扇类型 (Fan Type)：支持开关状态、继电器控制、速度调节(0-2档)
 * 2. 调光器类型 (Dimmer Type)：支持开关状态、亮度调节(0-100%)
 * 3. 继电器类型 (Relay Type)：支持开关状态控制
 * 4. 窗帘类型 (Curtain Type)：支持开启/关闭、位置控制
 * 5. 干接点类型 (Dry Contact)：支持开关状态控制
 * 6. 电源插座类型 (PowerPoint Type)：支持单路/双路插座的复杂状态控制
 * 
 * 核心功能模块：
 * 1. 设备类型处理器：
 *    - handleFanType: 风扇设备专用处理器
 *    - handleDimmerType: 调光器设备专用处理器  
 *    - handleRelayType: 继电器设备专用处理器
 *    - handleCurtainType: 窗帘设备专用处理器
 *    - handleDryContactType: 干接点设备专用处理器
 *    - handlePowerPointType: 电源插座设备专用处理器
 * 
 * 2. 核心解析引擎：
 *    - parseSceneContent: 场景内容解析器
 *    - processScenes: 主场景处理函数
 * 
 * 3. 智能操作识别：
 *    - 支持多种操作指令：ON/OFF、OPEN/CLOSE、TURN ON/TURN OFF
 *    - 自动标准化操作指令格式
 *    - 智能参数解析（亮度、速度、位置等）
 * 
 * 输入格式示例：
 * ```
 * NAME: 客厅场景
 * CONTROL CONTENT:
 * 客厅主灯 ON 80%
 * 客厅吊扇 ON RELAY ON SPEED 2
 * 客厅窗帘 OPEN
 * 客厅插座 ON OFF
 * ```
 * 
 * 输出格式：
 * ```json
 * {
 *   "scenes": [
 *     {
 *       "sceneName": "客厅场景",
 *       "contents": [
 *         {
 *           "name": "客厅主灯",
 *           "status": true,
 *           "statusConditions": { "level": 80 }
 *         },
 *         {
 *           "name": "客厅吊扇", 
 *           "status": true,
 *           "statusConditions": { "relay": true, "speed": 2 }
 *         }
 *       ]
 *     }
 *   ]
 * }
 * ```
 */

import { sceneOutputTemplates, determineDeviceType } from '../ExcelProcessor';

/**
 * 风扇类型设备处理器
 * 
 * 功能：处理风扇设备的复杂状态控制
 * 支持参数：
 * - 风扇开关状态 (ON/OFF)
 * - 继电器开关状态 (ON/OFF)  
 * - 风扇速度控制 (0/1/2档)
 * 
 * 指令格式：设备名称 风扇状态 RELAY 继电器状态 SPEED 速度值
 * 示例：客厅吊扇 ON RELAY ON SPEED 2
 */
function handleFanType(parts) {
    const deviceName = parts[0];
    const status = parts[1] === "ON"; // 风扇开关状态：ON 为 true，OFF 为 false
    const relayStatus = parts[3] === "ON"; // 继电器开关状态：ON 为 true，OFF 为 false
    let speed = 0; // 默认速度为 0

    // 解析速度参数（如果存在）
    if (parts.length > 5 && parts[4] === "SPEED") {
        const parsedSpeed = parseInt(parts[5], 10);
        // 确保速度只能是 0、1、2
        speed = [0, 1, 2].includes(parsedSpeed) ? parsedSpeed : 0;
    }

    return [sceneOutputTemplates["Fan Type"](deviceName, status, relayStatus, speed)];
}

/**
 * 调光器类型设备处理器
 * 
 * 功能：处理调光器设备的开关和亮度控制
 * 支持参数：
 * - 开关状态 (ON/OFF)
 * - 亮度级别 (0-100%)
 * 
 * 特殊处理：
 * - 自动检测继电器设备并使用继电器模板
 * - OFF状态时亮度自动设为0
 * - 支持百分比符号的自动清理
 * 
 * 指令格式：设备名称1,设备名称2 ON/OFF [亮度值%]
 * 示例：客厅主灯,卧室台灯 ON 80%
 */
function handleDimmerType(parts) {
    const contents = [];
    const statusIndex = parts.findIndex(part => ["ON", "OFF"].includes(part.toUpperCase()));
    const status = parts[statusIndex] === "ON"; // 将状态转换为布尔值

    let level = 100;
    // 解析亮度参数（仅在ON状态时有效）
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

    // 处理多个设备（逗号分隔）
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
            // 跳过无效设备
        }
    });

    return contents;
}

/**
 * 继电器类型设备处理器
 * 
 * 功能：处理继电器设备的开关控制
 * 支持参数：
 * - 开关状态 (ON/OFF)
 * 
 * 特殊处理：
 * - 自动检测调光器设备并使用调光器模板
 * - 为调光器设备自动设置亮度值（ON=100, OFF=0）
 * 
 * 指令格式：设备名称1,设备名称2 ON/OFF
 * 示例：客厅插座,卧室插座 ON
 */
function handleRelayType(parts) {
    const contents = [];
    const status = parts[parts.length - 1] === "ON"; // 将状态转换为布尔值

    // 处理多个设备（除最后一个状态参数外的所有部分）
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
            // 跳过无效设备
        }
    });

    return contents;
}

/**
 * 窗帘类型设备处理器
 * 
 * 功能：处理窗帘设备的开关控制
 * 支持参数：
 * - 开关状态 (OPEN/CLOSE)
 * - 位置控制 (OPEN=100, CLOSE=0)
 * 
 * 指令格式：设备名称1,设备名称2 OPEN/CLOSE
 * 示例：客厅窗帘,卧室窗帘 OPEN
 */
function handleCurtainType(parts) {
    const contents = [];
    const status = parts[parts.length - 1] === "OPEN"; // 将 OPEN 转换为 true，CLOSE 转换为 false

    // 处理多个设备（除最后一个状态参数外的所有部分）
    parts.slice(0, -1).forEach(entry => {
        const deviceName = entry.trim().replace(",", "");
        contents.push(sceneOutputTemplates["Curtain Type"](deviceName, status));
    });

    return contents;
}

/**
 * 干接点类型设备处理器
 * 
 * 功能：处理干接点设备的开关控制
 * 支持参数：
 * - 开关状态 (ON/OFF)
 * 
 * 注意：干接点设备使用与继电器相同的输出模板
 * 
 * 指令格式：设备名称1,设备名称2 ON/OFF
 * 示例：门禁系统,警报器 ON
 */
function handleDryContactType(parts) {
    const contents = [];
    const status = parts[parts.length - 1] === "ON"; // 将状态转换为布尔值

    // 处理多个设备（除最后一个状态参数外的所有部分）
    parts.slice(0, -1).forEach(entry => {
        const deviceName = entry.trim().replace(",", "");
        contents.push(sceneOutputTemplates["Relay Type"](deviceName, status)); // Dry Contact 类型和 Relay 类型处理类似
    });

    return contents;
}

/**
 * 电源插座类型设备处理器
 * 
 * 功能：处理单路和双路电源插座的复杂状态控制
 * 支持参数：
 * - 单路插座：ON/OFF/UNSELECT
 * - 双路插座：左路状态 右路状态
 * 
 * 状态映射：
 * - ON: 2 (开启)
 * - OFF: 1 (关闭)  
 * - UNSELECT: 0 (未选择)
 * 
 * 特殊规则：
 * - 双路插座不允许 UNSELECT UNSELECT 组合
 * - 只要有一路为ON，整体status就为true
 * 
 * 指令格式：
 * - 单路：设备名称 ON/OFF/UNSELECT
 * - 双路：设备名称 左路状态 右路状态
 * 示例：客厅插座 ON OFF
 */
function handlePowerPointType(parts, deviceType) {
    const contents = [];

    // 查找操作指令的位置（ON/OFF/UNSELECT）
    const operationIndex = parts.findIndex(part =>
        ["ON", "OFF", "UNSELECT"].includes(part.toUpperCase())
    );

    if (operationIndex === -1) return contents;

    // 分离设备名称和操作指令
    const deviceNames = parts.slice(0, operationIndex);   // 设备名称部分
    const operations = parts.slice(operationIndex);      // 操作指令部分

    // 状态映射函数
    const mapStatus = (status) => {
        switch (status) {
            case "ON": return 2;
            case "OFF": return 1;
            case "UNSELECT": return 0;
            default: return 1; // 默认为 OFF 状态
        }
    };

    // 处理单路插座
    if (deviceType.includes("Single-Way")) {
        deviceNames.forEach(deviceName => {
            const statusValue = operations[0].toUpperCase() === "ON" ? 2 : 1;
            contents.push({
                name: deviceName.trim().replace(",", ""),
                status: statusValue === 2,
                deviceType: "PowerPoint Type (Single-Way)",
                statusConditions: {
                    status: statusValue
                }
            });
        });
    } 
    // 处理双路插座
    else if (deviceType.includes("Two-Way")) {
        deviceNames.forEach(deviceName => {
            const leftStatus = operations[0].toUpperCase();
            const rightStatus = operations[1] ? operations[1].toUpperCase() : "OFF";

            // 验证无效组合
            if (leftStatus === "UNSELECT" && rightStatus === "UNSELECT") {
                console.warn("Invalid combination: UNSELECT UNSELECT is not allowed");
                return;
            }

            // 计算整体状态：只要有一路为 ON，整体 status 就为 true
            const overallStatus = leftStatus === "ON" || rightStatus === "ON";

            contents.push({
                name: deviceName.trim().replace(",", ""),
                status: overallStatus,
                deviceType: "PowerPoint Type (Two-Way)",
                statusConditions: {
                    leftStatus: mapStatus(leftStatus),
                    rightStatus: mapStatus(rightStatus)
                }
            });
        });
    }

    return contents;
}

/**
 * 场景内容解析器
 * 
 * 功能：解析单个场景的内容行，识别设备类型并调用相应的处理器
 * 
 * 核心流程：
 * 1. 操作指令标准化（ON/OFF/OPEN/CLOSE/TURN ON/TURN OFF）
 * 2. 设备类型自动识别
 * 3. 调用对应的设备类型处理器
 * 4. 收集并返回所有设备的场景配置
 * 
 * 支持的操作指令：
 * - 基础指令：ON, OFF, OPEN, CLOSE
 * - 复合指令：TURN ON, TURN OFF
 * - 自动标准化：turn on → ON, turn off → OFF
 */
export function parseSceneContent(sceneName, contentLines) {
    const contents = [];

    // 操作指令标准化函数
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
            // 自动识别设备类型
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

            // 根据设备类型调用相应的处理器
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

/**
 * 主场景处理函数
 * 
 * 功能：将Excel中的场景数据转换为标准化的JSON格式
 * 
 * 处理流程：
 * 1. 解析场景名称（NAME: 行）
 * 2. 跳过CONTROL CONTENT:标识行
 * 3. 解析每个场景的设备控制指令
 * 4. 生成最终的场景配置对象
 * 
 * 输入格式：
 * ```
 * NAME: 场景名称
 * CONTROL CONTENT:
 * 设备控制指令行1
 * 设备控制指令行2
 * ```
 * 
 * 输出：包含所有场景及其内容的标准化对象
 */
export function processScenes(scenesContent) {
    if (!scenesContent) return { scenes: [] };

    const scenesData = {};
    let currentScene = null;

    scenesContent.forEach(line => {
        line = line.trim();

        // 跳过CONTROL CONTENT:标识行
        if (line.startsWith("CONTROL CONTENT:")) return;

        // 解析场景名称
        if (line.startsWith("NAME:")) {
            currentScene = line.replace("NAME:", "").trim();
            if (!scenesData[currentScene]) {
                scenesData[currentScene] = [];
            }
        } else if (currentScene) {
            // 解析场景内容并添加到当前场景
            scenesData[currentScene].push(...parseSceneContent(currentScene, [line]));
        }
    });

    // 转换为最终的数组格式
    return {
        scenes: Object.entries(scenesData).map(([sceneName, contents]) => ({ sceneName, contents }))
    };
}