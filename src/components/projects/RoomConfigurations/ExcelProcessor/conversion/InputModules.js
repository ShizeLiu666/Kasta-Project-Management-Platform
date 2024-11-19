import { 
    getDeviceNameToType,
    getRegisteredDevices 
} from './Devices';

const ACTION_MAPPING = {
    'MOMENTARY': 0,
    'TOGGLE': 1
};

export function processInputModules(inputModulesContent) {
    const registeredDeviceNames = getRegisteredDevices();
    const deviceNameToType = getDeviceNameToType();
    
    const inputsMap = new Map();
    let currentDevice = null;

    // 预处理所有 5 Input Module 类型的设备
    registeredDeviceNames.forEach(deviceName => {
        const deviceType = deviceNameToType[deviceName];
        if (deviceType === "5 Input Module") {
            inputsMap.set(deviceName, {
                deviceName: deviceName,
                // 使用 inputActions 替代 inputs
                inputActions: Array(5).fill(0)
            });
        }
    });

    // 处理配置数据
    (inputModulesContent || []).forEach(line => {
        line = line.trim();

        if (line.startsWith("NAME:")) {
            currentDevice = line.replace("NAME:", "").trim();
            if (!inputsMap.has(currentDevice)) {
                console.warn(`Device ${currentDevice} is not a registered 5 Input Module device`);
                currentDevice = null;
            }
        } else if (currentDevice && inputsMap.has(currentDevice)) {
            const [channel, action] = line.split(":").map(part => part.trim());
            const channelNumber = parseInt(channel, 10) - 1;
            
            const deviceConfig = inputsMap.get(currentDevice);
            
            // 使用 inputActions 替代 inputs
            if (channelNumber >= 0 && channelNumber < 5) {
                const actionValue = ACTION_MAPPING[action.toUpperCase()];
                if (actionValue !== undefined) {
                    deviceConfig.inputActions[channelNumber] = actionValue;
                }
            } else {
                console.warn(`Invalid channel number ${channelNumber + 1} for device ${currentDevice}`);
            }
        }
    });

    return { inputs: Array.from(inputsMap.values()) };
}
