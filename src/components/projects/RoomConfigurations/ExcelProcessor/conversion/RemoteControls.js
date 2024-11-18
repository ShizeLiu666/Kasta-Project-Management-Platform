import { getDeviceNameToType } from './Devices';
import { processRemoteParameters } from './RemoteParameters';

const INPUT_MODULE_TYPES = ["5 Input Module", "6 Input Module"];
const INPUT_MODULE_ACTIONS = {
    'TOGGLE': 1,
    'MOMENTARY': 0
};

function getRcIndex(deviceType, operation) {
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
                return 2; // 默认为 WHOLE
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
        switch (upperOperation) {
            case "LEFT":
                return 0; // 左插座
            case "RIGHT":
                return 1; // 右插座
            case "WHOLE":
                return 2; // 整体控制
            default:
                return 2; // 默认为整体控制
        }
    }
    
    if (deviceType === "4 Output Module") {
        switch (upperOperation) {
            case "FIRST":
                return 0;
            case "SECOND":
                return 1;
            case "THIRD":
                return 2;
            case "FOURTH":
                return 3;
            case "WHOLE":
                return 4;
            default:
                return 4; // 默认为WHOLE
        }
    }
    
    return 1; // 默认值，用于其他设备类型
}

export function processRemoteControls(remoteControlsContent, remoteParametersContent) {
    if (!remoteControlsContent) return { remoteControls: [] };
    
    const { parameters } = processRemoteParameters(remoteParametersContent);
    
    const remoteControlsData = [];
    let currentRemote = null;
    let currentLinks = [];
    let isInputModule = false;
    let deviceType = null;
    let inputActions = null;

    remoteControlsContent.forEach(line => {
        line = line.trim();

        if (line.startsWith("TOTAL")) return;

        if (line.startsWith("NAME:")) {
            if (currentRemote) {
                const parameterValues = {};
                if (!isInputModule) {
                    parameters.forEach((param, key) => {
                        parameterValues[key.toLowerCase()] = param.value;
                    });
                }
                
                remoteControlsData.push({
                    remoteName: currentRemote,
                    links: currentLinks,
                    ...(isInputModule ? { 
                        inputActions: inputActions 
                    } : { 
                        parameters: parameterValues 
                    })
                });
            }
            currentRemote = line.replace("NAME:", "").trim();
            currentLinks = [];
            deviceType = getDeviceNameToType()[currentRemote];
            isInputModule = INPUT_MODULE_TYPES.includes(deviceType);
            
            // 初始化 inputActions 数组，根据设备类型设置长度
            if (isInputModule) {
                const length = deviceType === "5 Input Module" ? 5 : 6;
                inputActions = new Array(length).fill(INPUT_MODULE_ACTIONS.MOMENTARY);
            }
        } else if (line.startsWith("LINK:")) {
            return;
        } else {
            const parts = line.split(":");
            if (parts.length < 2) return;

            const linkIndex = parseInt(parts[0].trim(), 10) - 1;
            let linkDescription = parts[1].trim();
            let baseAction = null;

            // 解析命令
            if (linkDescription.includes(" + ")) {
                // 处理 Input Module 的 TOGGLE/MOMENTARY
                const [baseCommand, actionType] = linkDescription.split(" + ").map(s => s.trim());
                linkDescription = baseCommand;
                if (isInputModule && actionType.toUpperCase() === 'TOGGLE') {
                    inputActions[linkIndex] = INPUT_MODULE_ACTIONS.TOGGLE;
                }
            }

            if (linkDescription.includes(" - ")) {
                [linkDescription, baseAction] = linkDescription.split(" - ");
                baseAction = baseAction.trim();
            }

            let linkType = 0;
            let linkName = "";
            let rc_index = 1;

            if (linkDescription.startsWith("SCENE")) {
                linkType = 4;
                linkName = linkDescription.replace("SCENE", "").trim();
                rc_index = 0;
            } else if (linkDescription.startsWith("GROUP")) {
                linkType = 2;
                linkName = linkDescription.replace("GROUP", "").trim();
                rc_index = 32;
            } else if (linkDescription.startsWith("DEVICE")) {
                linkType = 1;
                linkName = linkDescription.replace("DEVICE", "").trim();
                const deviceType = getDeviceNameToType()[linkName];
                rc_index = getRcIndex(deviceType, baseAction);
            }

            // 将 action 转换为大写
            baseAction = baseAction ? baseAction.toUpperCase() : null;

            const linkData = {
                linkIndex,
                linkType,
                linkName,
                action: baseAction,
                rc_index
            };

            currentLinks.push(linkData);
        }
    });

    if (currentRemote) {
        const parameterValues = {};
        if (!isInputModule) {
            parameters.forEach((param, key) => {
                parameterValues[key.toLowerCase()] = param.value;
            });
        }
        
        remoteControlsData.push({
            remoteName: currentRemote,
            links: currentLinks,
            ...(isInputModule ? { 
                inputActions: inputActions 
            } : { 
                parameters: parameterValues 
            })
        });
    }

    return { remoteControls: remoteControlsData };
}