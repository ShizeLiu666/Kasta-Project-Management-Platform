import { getDeviceNameToType } from './Devices';

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
                const deviceType = getDeviceNameToType()[linkName];
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
