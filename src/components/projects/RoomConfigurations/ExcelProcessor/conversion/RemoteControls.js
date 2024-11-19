import { getDeviceNameToType } from './Devices';
import { processRemoteParameters } from './RemoteParameters';

const getRcIndex = (deviceType, operation) => {
    const upperOperation = operation ? operation.toUpperCase() : '';

    if (deviceType === "Curtain Type") {
        switch (upperOperation) {
            case "OPEN": return 0;
            case "CLOSE": return 1;
            case "WHOLE": return 2;
            default: return 2;
        }
    }
    
    if (deviceType === "Fan Type") {
        switch (upperOperation) {
            case "FAN": return 0;
            case "LAMP": return 1;
            case "WHOLE": return 2;
            default: return 0;
        }
    }
    
    if (deviceType === "PowerPoint Type (Two-Way)") {
        switch (upperOperation) {
            case "LEFT": return 0;
            case "RIGHT": return 1;
            case "WHOLE": return 2;
            default: return 2;
        }
    }
    
    if (deviceType === "4 Output Module") {
        switch (upperOperation) {
            case "FIRST": return 0;
            case "SECOND": return 1;
            case "THIRD": return 2;
            case "FOURTH": return 3;
            case "WHOLE": return 4;
            default: return 4;
        }
    }
    
    return 1;
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
                const isRemoteControl = deviceType && deviceType.includes("Remote Control");
                
                const remoteData = {
                    remoteName: currentRemote,
                    links: currentLinks,
                };
                
                if (isRemoteControl) {
                    const parameterValues = {};
                    parameters.forEach((param, key) => {
                        parameterValues[key.toLowerCase()] = param.value;
                    });
                    remoteData.parameters = parameterValues;
                }
                
                remoteControlsData.push(remoteData);
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
            let baseAction = null;

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

            baseAction = baseAction ? baseAction.toUpperCase() : null;

            currentLinks.push({
                linkIndex,
                linkType,
                linkName,
                action: baseAction,
                rc_index
            });
        }
    });

    if (currentRemote) {
        const deviceType = deviceNameToType[currentRemote];
        const isRemoteControl = deviceType && deviceType.includes("Remote Control");
        
        const remoteData = {
            remoteName: currentRemote,
            links: currentLinks,
        };
        
        if (isRemoteControl) {
            const parameterValues = {};
            parameters.forEach((param, key) => {
                parameterValues[key.toLowerCase()] = param.value;
            });
            remoteData.parameters = parameterValues;
        }
        
        remoteControlsData.push(remoteData);
    }

    return { remoteControls: remoteControlsData };
}