import { getDeviceNameToType } from './Devices';
import { processRemoteParameters } from './RemoteParameters';

// 创建默认链接对象的函数
const createDefaultLink = (index) => ({
    action: "",
    linkName: "",
    linkType: 0,
    rc_index: 0,
    linkIndex: index
});

// 获取遥控器按键数量的函数
const getRemoteButtonCount = (deviceType) => {
    if (!deviceType) return 0;
    if (deviceType.includes("6 Push Panel")) return 6;
    if (deviceType.includes("5 Push Panel")) return 5;
    if (deviceType.includes("4 Push Panel")) return 4;
    if (deviceType.includes("3 Push Panel")) return 3;
    if (deviceType.includes("2 Push Panel")) return 2;
    if (deviceType.includes("1 Push Panel")) return 1;
    if (deviceType.includes("5 Input Module")) return 5;
    return 0;
};

// 添加 rc_index 映射
const ACTION_RC_INDEX_MAP = {
    'CURTAIN': {
        'OPEN': 0,
        'CLOSE': 1,
        'WHOLE': 2
    },
    'FAN': {
        'FAN': 0,
        'LAMP': 1,
        'WHOLE': 2
    },
    'POWERPOINT': {
        'LEFT': 0,
        'RIGHT': 1,
        'WHOLE': 2
    },
    '4_OUTPUT': {
        'FIRST': 0,
        'SECOND': 1,
        'THIRD': 2,
        'FOURTH': 3,
        'WHOLE': 4
    },
};

// 获取 rc_index 的函数
const getRcIndex = (deviceType, operation) => {
    if (!operation) return 0;
    
    const upperOperation = operation.toUpperCase();
    
    if (deviceType.includes("Curtain Type")) {
        return ACTION_RC_INDEX_MAP.CURTAIN[upperOperation] ?? 2;
    }
    if (deviceType.includes("Fan Type")) {
        return ACTION_RC_INDEX_MAP.FAN[upperOperation] ?? 0;
    }
    if (deviceType === "PowerPoint Type (Two-Way)") {
        return ACTION_RC_INDEX_MAP.POWERPOINT[upperOperation] ?? 2;
    }
    if (deviceType === "4 Output Module") {
        return ACTION_RC_INDEX_MAP['4_OUTPUT'][upperOperation] ?? 4;
    }
    // if (deviceType === "5 Input Module") {
    //     return ACTION_RC_INDEX_MAP['5_INPUT'][upperOperation] ?? 5;
    // }
    
    return 0;
};

export function processRemoteControls(
    remoteControlsContent, 
    remoteParametersContent,
    registeredGroupNames,
    registeredSceneNames
) {
    if (!remoteControlsContent) return { remoteControls: [] };
    
    const deviceNameToType = getDeviceNameToType();
    const remoteControlsData = [];
    let currentRemote = null;
    let currentLinks = [];

    // 处理参数
    const { parameters } = processRemoteParameters(remoteParametersContent);

    const determineTargetType = (targetName) => {
        // 移除可能存在的关键词前缀
        const cleanTargetName = targetName
            .replace(/^(DEVICE|GROUP|SCENE)\s+/, '')
            .trim();

        // 首先检查是否是设备
        if (deviceNameToType[cleanTargetName]) {
            return {
                type: 1, // DEVICE
                name: cleanTargetName,
                deviceType: deviceNameToType[cleanTargetName]
            };
        }
        
        if (registeredGroupNames?.has(cleanTargetName)) {
            return {
                type: 2, // GROUP
                name: cleanTargetName
            };
        }
        
        if (registeredSceneNames?.has(cleanTargetName)) {
            return {
                type: 4, // SCENE
                name: cleanTargetName
            };
        }
        
        return null;
    };

    remoteControlsContent.forEach(line => {
        line = line.trim();

        if (line.startsWith("TOTAL")) return;

        if (line.startsWith("NAME:")) {
            // 处理前一个遥控器的数据
            if (currentRemote) {
                const deviceType = deviceNameToType[currentRemote];
                const buttonCount = getRemoteButtonCount(deviceType);
                
                // 创建完整的按键数组
                const fullLinks = Array(buttonCount).fill(null).map((_, index) => {
                    const existingLink = currentLinks.find(link => link.linkIndex === index);
                    return existingLink || createDefaultLink(index);
                });

                // 检查是否是 Input Module
                const isInputModule = deviceType?.includes("Input Module");
                
                const remoteData = {
                    remoteName: currentRemote,
                    links: fullLinks,
                    // 只有非 Input Module 设备才需要 parameters
                    parameters: isInputModule ? undefined : {}
                };

                // 只有非 Input Module 设备才处理参数
                if (!isInputModule && parameters) {
                    parameters.forEach((param, key) => {
                        remoteData.parameters[key.toLowerCase()] = param.value;
                    });
                }
                
                remoteControlsData.push(remoteData);
            }

            currentRemote = line.replace("NAME:", "").trim();
            currentLinks = [];
        } else if (line.includes(":")) {
            const [indexStr, targetInfo] = line.split(":");
            if (!indexStr || !targetInfo) return;

            const linkIndex = parseInt(indexStr.trim(), 10) - 1;
            const [targetName, operation] = targetInfo.trim().split(" - ").map(part => part?.trim());
            
            const targetTypeInfo = determineTargetType(targetName);
            if (targetTypeInfo) {
                const rc_index = targetTypeInfo.type === 2 ? 32 : 
                               getRcIndex(targetTypeInfo.deviceType, operation);
                
                currentLinks.push({
                    linkIndex,
                    linkType: targetTypeInfo.type,
                    linkName: targetTypeInfo.name,
                    action: operation || "",
                    rc_index
                });
            }
        }
    });

    // 处理最后一个遥控器
    if (currentRemote) {
        const deviceType = deviceNameToType[currentRemote];
        const buttonCount = getRemoteButtonCount(deviceType);
        const isInputModule = deviceType?.includes("Input Module");
        
        const fullLinks = Array(buttonCount).fill(null).map((_, index) => {
            const existingLink = currentLinks.find(link => link.linkIndex === index);
            return existingLink || createDefaultLink(index);
        });

        const remoteData = {
            remoteName: currentRemote,
            links: fullLinks,
            parameters: isInputModule ? undefined : {}
        };

        // 只有非 Input Module 设备才处理参数
        if (!isInputModule && parameters) {
            parameters.forEach((param, key) => {
                remoteData.parameters[key.toLowerCase()] = param.value;
            });
        }

        remoteControlsData.push(remoteData);
    }

    return { remoteControls: remoteControlsData };
}