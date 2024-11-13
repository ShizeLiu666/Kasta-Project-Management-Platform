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

export function processOutputModules(outputModulesContent) {
    const registeredDeviceNames = getRegisteredDevices();
    const deviceNameToType = getDeviceNameToType();
    
    const outputsMap = new Map();
    let currentDevice = null;

    // 预处理所有 4 Output Module 类型的设备
    registeredDeviceNames.forEach(deviceName => {
        if (deviceNameToType[deviceName] === "4 Output Module") {
            outputsMap.set(deviceName, {
                deviceName: deviceName,
                outputs: Array(4).fill(null).map((_, index) => ({
                    channel: index,
                    pulse: 0,
                    outputName: ""
                }))
            });
        }
    });

    // 处理配置数据
    (outputModulesContent || []).forEach(line => {
        line = line.trim();

        if (line.startsWith("NAME:")) {
            currentDevice = line.replace("NAME:", "").trim();
            if (!outputsMap.has(currentDevice)) {
                console.warn(`Device ${currentDevice} is not a registered 4 Output Module device`);
                currentDevice = null;
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
            deviceConfig.outputs[channelNumber] = {
                channel: channelNumber,
                pulse: PULSE_MAPPING[action] || 0,
                outputName: terminalCommand
            };
        }
    });

    return { outputs: Array.from(outputsMap.values()) };
}