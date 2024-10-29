import { 
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

export function processVirtualContacts(virtualContactsContent) {
    const registeredDeviceNames = getRegisteredDevices();
    const deviceNameToType = getDeviceNameToType();
    
    const outputsMap = new Map();
    let currentDevice = null;

    // 预处理所有 4 Output Module 类型的设备
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

    // 处理配置数据
    (virtualContactsContent || []).forEach(line => {
        line = line.trim();

        if (line.startsWith("NAME:")) {
            // 只设置当前设备名称，不再重复创建配置
            currentDevice = line.replace("NAME:", "").trim();
            // 检查设备是否存在且是否为4 Output Module
            if (!outputsMap.has(currentDevice)) {
                console.warn(`设备 ${currentDevice} 不是已注册的4 Output Module设备`);
                currentDevice = null; // 重置currentDevice，避免处理未注册设备的配置
            }
        } else if (currentDevice && outputsMap.has(currentDevice)) {
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