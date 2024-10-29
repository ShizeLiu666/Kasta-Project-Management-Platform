import { 
    getDeviceNameToAppearanceShortname,
    getDeviceNameToType,
    getRegisteredDevices 
} from './Devices';

const PULSE_MAPPING = {
    'NORMAL': 0,
    '1SEC': 1,
    '6SEC': 2,
    '9SEC': 3,
    'REVERS': 4
};

export function processVirtualContacts(splitData) {
    const registeredDeviceNames = getRegisteredDevices();
    const deviceNameToType = getDeviceNameToType();
    
    console.log("getDeviceNameToAppearanceShortname:", getDeviceNameToAppearanceShortname);

    const virtualContactsContent = splitData.outputs || [];
    const outputsMap = new Map();
    let currentDevice = null;

    // 检查 registeredDeviceNames 中的 4 Output Module 类型设备
    registeredDeviceNames.forEach(deviceName => {
        if (deviceNameToType[deviceName] === "4 Output Module") {
            outputsMap.set(deviceName, {
                deviceName: deviceName,
                virtualDryContacts: Array(4).fill(null).map((_, index) => ({
                    channel: index,
                    pulse: 0,
                    virtualName: ""
                }))
            });
        }
    });

    // 直接处理配置
    virtualContactsContent.forEach(line => {
        line = line.trim();

        if (line.startsWith("NAME:")) {
            // 遇到新设备名称时，创建新的设备配置
            currentDevice = line.replace("NAME:", "").trim();
            outputsMap.set(currentDevice, {
                deviceName: currentDevice,
                virtualDryContacts: Array(4).fill(null).map((_, index) => ({
                    channel: index,
                    pulse: 0,
                    virtualName: ""
                }))
            });
        } else if (currentDevice) {
            const [channel, command] = line.split(":").map(part => part.trim());
            const channelNumber = parseInt(channel, 10) - 1;
            
            let terminalCommand = command;
            let action = 'NORMAL';

            if (command.includes(" - ")) {
                const [name, actionType] = command.split(" - ");
                terminalCommand = name.trim();
                action = actionType.trim();
            }

            const deviceConfig = outputsMap.get(currentDevice);
            deviceConfig.virtualDryContacts[channelNumber] = {
                channel: channelNumber,
                pulse: PULSE_MAPPING[action] || 0,
                virtualName: terminalCommand
            };
        }
    });

    return { outputs: Array.from(outputsMap.values()) };
}