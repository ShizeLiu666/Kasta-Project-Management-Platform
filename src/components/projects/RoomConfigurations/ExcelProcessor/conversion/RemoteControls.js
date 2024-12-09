import { getDeviceNameToType } from './Devices';
import { processRemoteParameters } from './RemoteParameters';

// 创建默认链接对象的函数
const createDefaultLink = (index) => ({
    action: "",          // 改为空字符串
    linkName: "",        // 改为空字符串
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

// 添加 getRcIndex 函数
const getRcIndex = (deviceType, operation) => {
    if (!operation) return 0;
    
    const upperOperation = operation.toUpperCase();

    if (deviceType === "Curtain Type") {
        switch (upperOperation) {
            case "OPEN": return 0;
            case "CLOSE": return 1;
            case "WHOLE": return 2;
            default: return 2;  // 默认为 WHOLE
        }
    }
    
    if (deviceType === "Fan Type") {
        switch (upperOperation) {
            case "FAN": return 0;
            case "LAMP": return 1;
            case "WHOLE": return 2;
            default: return 0;  // 默认为 FAN
        }
    }
    
    if (deviceType && deviceType.includes("PowerPoint Type")) {
        if (deviceType.includes("Two-Way")) {
            switch (upperOperation) {
                case "LEFT": return 0;
                case "RIGHT": return 1;
                case "WHOLE": return 2;
                default: return 2;  // 默认为 WHOLE
            }
        }
    }
    
    if (deviceType === "4 Output Module") {
        switch (upperOperation) {
            case "FIRST": return 0;
            case "SECOND": return 1;
            case "THIRD": return 2;
            case "FOURTH": return 3;
            case "WHOLE": return 4;
            default: return 4;  // 默认为 WHOLE
        }
    }
    
    return 0;  // 其他设备类型的默认值
};

export function processRemoteControls(remoteControlsContent, remoteParametersContent) {
    if (!remoteControlsContent) return { remoteControls: [] };
    
    const { parameters } = processRemoteParameters(remoteParametersContent);
    const deviceNameToType = getDeviceNameToType();
    
    const remoteControlsData = [];
    let currentRemote = null;
    let currentLinks = [];

    remoteControlsContent.forEach(line => {
        line = line.trim();

        if (line.startsWith("TOTAL")) return;

        if (line.startsWith("NAME:")) {
            if (currentRemote) {
                const deviceType = deviceNameToType[currentRemote];
                const isRemoteControl = deviceType && (
                    deviceType.includes("Push Panel") || 
                    deviceType.includes("Input Module")
                );
                
                if (isRemoteControl) {
                    const buttonCount = getRemoteButtonCount(deviceType);
                    
                    // 创建完整的按键数组，包含所有按键的默认值
                    const fullLinks = Array(buttonCount).fill(null).map((_, index) => {
                        const existingLink = currentLinks.find(link => link.linkIndex === index);
                        return existingLink || createDefaultLink(index);
                    });

                    const remoteData = {
                        remoteName: currentRemote,
                        links: fullLinks,
                    };
                    
                    // 添加参数
                    const parameterValues = {};
                    parameters.forEach((param, key) => {
                        parameterValues[key.toLowerCase()] = param.value;
                    });
                    remoteData.parameters = parameterValues;
                    
                    remoteControlsData.push(remoteData);
                }
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
            let baseAction = "";

            if (linkDescription.includes(" - ")) {
                [linkDescription, baseAction] = linkDescription.split(" - ");
                baseAction = baseAction.trim();
            }

            let linkType = 0;
            let linkName = "";
            let rc_index = 0;

            if (linkDescription.startsWith("SCENE")) {
                linkType = 4;
                linkName = linkDescription.replace("SCENE", "").trim();
            } else if (linkDescription.startsWith("GROUP")) {
                linkType = 2;
                linkName = linkDescription.replace("GROUP", "").trim();
                rc_index = 32;
            } else if (linkDescription.startsWith("DEVICE")) {
                linkType = 1;
                linkName = linkDescription.replace("DEVICE", "").trim();
                const deviceType = deviceNameToType[linkName];
                rc_index = getRcIndex(deviceType, baseAction);
            }

            currentLinks.push({
                linkIndex,
                linkType,
                linkName,
                action: baseAction || "",  // 确保空值为空字符串而不是null
                rc_index
            });
        }
    });

    // 处理最后一个遥控器
    if (currentRemote) {
        const deviceType = deviceNameToType[currentRemote];
        const isRemoteControl = deviceType && (
            deviceType.includes("Push Panel") || 
            deviceType.includes("Input Module")
        );
        
        if (isRemoteControl) {
            const buttonCount = getRemoteButtonCount(deviceType);
            const fullLinks = Array(buttonCount).fill(null).map((_, index) => {
                const existingLink = currentLinks.find(link => link.linkIndex === index);
                return existingLink || createDefaultLink(index);
            });

            const remoteData = {
                remoteName: currentRemote,
                links: fullLinks,
            };
            
            const parameterValues = {};
            parameters.forEach((param, key) => {
                parameterValues[key.toLowerCase()] = param.value;
            });
            remoteData.parameters = parameterValues;
            
            remoteControlsData.push(remoteData);
        }
    }

    return { remoteControls: remoteControlsData };
}