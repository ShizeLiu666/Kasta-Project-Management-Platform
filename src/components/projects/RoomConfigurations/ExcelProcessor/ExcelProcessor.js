import { processDevices, resetDeviceNameToType, getDeviceNameToType } from './conversion/Devices';
import { processGroups } from './conversion/Groups';
import { processScenes } from './conversion/Scenes';
import { processRemoteControls } from './conversion/RemoteControls';
import { processOutputModules } from './conversion/OutputModules';
import { processInputModules } from './conversion/InputModules';
import { processRemoteParameters } from './conversion/RemoteParameters';
import { validateRemoteParameters } from './validation/RemoteParameters';

const AllDeviceTypes = {
    "Dimmer Type": ["KBSKTDIM", "D300IB", "D300IB2", "DH10VIB", "DM300BH", "D0-10IB", "DDAL"],
    "Relay Type": ["KBSKTREL", "S2400IB2", "S2400IBH", "RM1440BH", "KBSKTR2400"],
    "Curtain Type": ["C300IBH"],
    "Fan Type": ["FC150A2"],
    "PowerPoint Type": {
        "Single-Way": ["H1PPWVBX"],
        "Two-Way": ["K2PPHB", "H2PPHB", "H2PPWHB"]
    },
    "Dry Contact": ["S10IBH"],
    "Remote Control": {
        "1 Push Panel": ["H1RSMB", "1BMBH"],
        "2 Push Panel": ["H2RSMB"],
        "3 Push Panel": ["H3RSMB"],
        "4 Push Panel": ["H4RSMB"],
        "5 Push Panel": ["H5RSMB"],
        "6 Push Panel": ["H6RSMB"]
    },
    "5 Input Module": ["5RSIBH"],
    "4 Output Module": ["4OS2IBH"]
};

const sceneOutputTemplates = {
    "Relay Type": (name, status) => ({
        name,
        status, // 已经是布尔值，直接使用
        statusConditions: {} // Relay Type 通常没有额外的状态条件
    }),
    "Curtain Type": (name, status) => ({
        name,
        status, // 已经是布尔值，直接使用
        statusConditions: {
            position: status ? 100 : 0 // OPEN 为 true 时，位置为 100；CLOSE 为 false 时，位置为 0
        }
    }),
    "Dimmer Type": (name, status, level = 100) => ({
        name,
        status, // 已经是布尔值，直接使用
        statusConditions: {
            level // 亮度值由外部传入，默认为 100
        }
    }),
    "Fan Type": (name, status, relay_status, speed) => ({
        name,
        status, // 已经是布尔值，直接使用
        statusConditions: {
            relay: relay_status, // relay_status 已经是布尔值
            speed // 风速值由外部传入
        }
    }),
    "PowerPoint Type": {
        "Two-Way": (name, left_power, right_power) => ({
            name,
            statusConditions: {
                leftPowerOnOff: left_power, // 左侧电源状态，布尔值
                rightPowerOnOff: right_power // 右侧电源状态，布尔值
            }
        }),
        "Single-Way": (name, power) => ({
            name,
            statusConditions: {
                rightPowerOnOff: power // 单路电源状态，布尔值
            }
        })
    }
};

function determineDeviceType(deviceName) {
    const originalDeviceName = deviceName.trim().replace(',', '');

    if (!originalDeviceName) {
        throw new Error("Device name can not be empty.");
    }

    const deviceType = getDeviceNameToType()[originalDeviceName];
    if (deviceType) {
        return deviceType;
    } else {
        throw new Error(`Can not define device type for '${originalDeviceName}'`);
    }
}

// 处理遥控器参数的函数
function handleRemoteParameters(remoteParametersContent) {
    const { errors, parameters } = validateRemoteParameters(remoteParametersContent);
    if (errors && errors.length > 0) {
        return { errors, parameters: null };
    }
    return processRemoteParameters(remoteParametersContent, parameters);
}

export {
    resetDeviceNameToType,
    processDevices,
    processGroups,
    processScenes,
    processRemoteControls,
    processOutputModules,
    processInputModules,
    processRemoteParameters,
    validateRemoteParameters,
    handleRemoteParameters,
    AllDeviceTypes,
    determineDeviceType,
    sceneOutputTemplates
};
