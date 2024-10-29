import { AllDeviceTypes } from '../ExcelProcessor';

let deviceNameToType = {};
let deviceNameToAppearanceShortname = {};
let registeredDevices = [];

export function resetDeviceNameToType() {
    deviceNameToType = {};
    deviceNameToAppearanceShortname = {};
}

export function resetRegisteredDevices() {
    registeredDevices = [];
}

export function processDevices(splitData) {
    const devicesContent = splitData.devices || [];
    const devicesData = [];
    let currentShortname = null;

    resetRegisteredDevices();

    function isModelMatching(model, shortname) {
        return shortname && (model.includes(shortname) || shortname.includes(model));
    }

    devicesContent.forEach(line => {
        line = line.trim();

        if (line.startsWith("NAME:")) {
            currentShortname = line.replace("NAME:", "").trim();
            return;
        }

        if (line.startsWith("QTY:")) return;

        let deviceType = null;
        const shortnameForMatching = currentShortname;

        for (const [dtype, models] of Object.entries(AllDeviceTypes)) {
            if (Array.isArray(models)) {
                if (models.some(model => isModelMatching(model, shortnameForMatching))) {
                    deviceType = dtype;
                    break;
                }
            } else if (typeof models === 'object') {
                for (const subType in models) {
                    const subModelArray = models[subType];
                    if (Array.isArray(subModelArray) && subModelArray.some(model => isModelMatching(model, shortnameForMatching))) {
                        deviceType = `${dtype} (${subType})`;
                        break;
                    }
                }
            }
            if (deviceType) break;
        }

        if (currentShortname) {
            const deviceInfo = {
                appearanceShortname: currentShortname,
                deviceName: line,
                ...(deviceType && { deviceType })
            };
            devicesData.push(deviceInfo);

            deviceNameToType[line] = deviceType;
            deviceNameToAppearanceShortname[line] = currentShortname;
            registeredDevices.push(line);
        }
    });

    return { devices: devicesData };
}

export function getDeviceNameToType() {
    return deviceNameToType;
}

export function getDeviceNameToAppearanceShortname() {
    return deviceNameToAppearanceShortname;
}

export function getRegisteredDevices() {
    return registeredDevices;
}