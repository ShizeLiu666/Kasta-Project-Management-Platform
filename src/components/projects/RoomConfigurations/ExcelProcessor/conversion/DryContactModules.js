import { 
    getDeviceNameToType,
    getRegisteredDevices 
} from './Devices';

const PULSE_MAPPING = {
    'NORMAL': 0,
    '1SEC': 1,
    '6SEC': 2,
    '9SEC': 3,
    'REVERSE': 4
};

export function processDryContactModules(dryContactsContent) {
    const registeredDeviceNames = getRegisteredDevices();
    const deviceNameToType = getDeviceNameToType();
    
    const dryContactsMap = new Map();
    let currentDevice = null;

    // 预处理所有 Dry Contact 类型的设备
    registeredDeviceNames.forEach(deviceName => {
        if (deviceNameToType[deviceName] === "Dry Contact") {
            dryContactsMap.set(deviceName, {
                deviceName: deviceName,
                pulse: 0  // 默认为 NORMAL
            });
        }
    });

    // 处理配置数据
    (dryContactsContent || []).forEach(line => {
        line = line.trim();

        if (line.startsWith("NAME:")) {
            currentDevice = line.replace("NAME:", "").trim();
            if (!dryContactsMap.has(currentDevice)) {
                console.warn(`Device ${currentDevice} is not a registered Dry Contact device`);
                currentDevice = null;
            }
        } else if (currentDevice && dryContactsMap.has(currentDevice)) {
            const action = line.trim();
            const deviceConfig = dryContactsMap.get(currentDevice);
            deviceConfig.pulse = PULSE_MAPPING[action] || 0;
        }
    });

    return { dryContacts: Array.from(dryContactsMap.values()) };
}