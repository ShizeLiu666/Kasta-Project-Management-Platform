/**
 * Excel数据转换处理器 (ExcelProcessor.js)
 * 
 * 系统架构概述：
 * 这是整个Excel到JSON转换系统的核心协调器，负责统一管理和调度所有转换模块。
 * 与validation系统配合，形成完整的Excel数据处理流水线。
 * 
 * 主要功能：
 * 1. 模块导入与管理：
 *    - 导入所有conversion子模块
 *    - 提供统一的转换接口
 *    - 管理模块间的依赖关系
 * 
 * 2. 设备类型定义与映射：
 *    - AllDeviceTypes: 完整的设备类型映射表
 *    - 支持12+种智能家居设备类型
 *    - 包含调光器、继电器、窗帘、风扇、电源插座等
 * 
 * 3. 场景输出模板系统：
 *    - sceneOutputTemplates: 不同设备类型的场景输出格式
 *    - 支持复杂的设备状态和条件配置
 *    - 处理设备特定的参数（亮度、速度、位置等）
 * 
 * 4. 工具函数：
 *    - determineDeviceType: 设备类型自动判断
 *    - handleRemoteParameters: 遥控器参数处理
 *    - handleRemoteControls: 遥控器控制处理
 * 
 * 转换流程架构：
 * ```
 * Excel数据输入
 *      ↓
 * validation验证 → 错误收集
 *      ↓
 * conversion转换 → JSON输出
 *      ↓
 * 设备配置文件生成
 * ```
 * 
 * 支持的转换模块：
 * - Devices: 设备基础信息转换
 * - Groups: 设备组配置转换  
 * - Scenes: 场景配置转换
 * - RemoteControls: 遥控器绑定转换
 * - RemoteParameters: 遥控器参数转换
 * - InputModules: 输入模块转换
 * - OutputModules: 输出模块转换
 * - DryContactModules: 干接点模块转换
 * 
 * 输入：验证后的分类数据
 * 输出：标准化的JSON配置对象
 */

// 导入所有转换模块
import { processDevices, resetDeviceNameToType, getDeviceNameToType } from './conversion/Devices';
import { processGroups } from './conversion/Groups';
import { processScenes } from './conversion/Scenes';
import { processRemoteControls } from './conversion/RemoteControls';
import { processOutputModules } from './conversion/OutputModules';
import { processInputModules } from './conversion/InputModules';
import { processDryContactModules } from './conversion/DryContactModules';
import { processRemoteParameters } from './conversion/RemoteParameters';
import { validateRemoteParameters } from './validation/RemoteParameters';

// 所有支持的设备类型定义映射表
const AllDeviceTypes = {
    "Dimmer Type": ["KBSKTDIM", "D300IB", "D300IB2", "DH10VIB", "DM300BH", "D0-10IB", "DDAL"],
    "Relay Type": ["KBSKTREL", "S2400IB2", "S2400IB-H", "RM1440BH", "KBSKTR2400","SSR1200"],
    "Curtain Type": ["C300IBH"],
    "Fan Type": ["FC150A2", "FC150A"],
    "PowerPoint Type": {
        "Single-Way": ["H1PPWVBX"],
        "Two-Way": ["K2PPHB", "H2PPHB", "H2PPWHB", 'H2PPHB']
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

// 场景输出模板系统 - 定义不同设备类型的场景输出格式
const sceneOutputTemplates = {
    // 继电器类型模板
    "Relay Type": (name, status) => ({
        name,
        status, // 已经是布尔值，直接使用
        statusConditions: {} // Relay Type 通常没有额外的状态条件
    }),
    // 窗帘类型模板
    "Curtain Type": (name, status) => ({
        name,
        status, // 已经是布尔值，直接使用
        statusConditions: {
            position: status ? 100 : 0 // OPEN 为 true 时，位置为 100；CLOSE 为 false 时，位置为 0
        }
    }),
    // 调光器类型模板
    "Dimmer Type": (name, status, level = 100) => ({
        name,
        status, // 已经是布尔值，直接使用
        statusConditions: {
            level // 亮度值由外部传入，默认为 100
        }
    }),
    // 风扇类型模板
    "Fan Type": (name, status, relay_status, speed) => ({
        name,
        status, // 已经是布尔值，直接使用
        statusConditions: {
            relay: relay_status, // relay_status 已经是布尔值
            speed // 风速值由外部传入
        }
    }),
    // 电源插座类型模板
    "PowerPoint Type": {
        // 双路电源插座
        "Two-Way": (name, left_power, right_power) => ({
            name,
            statusConditions: {
                leftPowerOnOff: left_power, // 左侧电源状态，布尔值
                rightPowerOnOff: right_power // 右侧电源状态，布尔值
            }
        }),
        // 单路电源插座
        "Single-Way": (name, power) => ({
            name,
            statusConditions: {
                rightPowerOnOff: power // 单路电源状态，布尔值
            }
        })
    }
};

// 设备类型自动判断函数
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

// 遥控器参数处理函数
function handleRemoteParameters(remoteParametersContent) {
    const { errors, parameters } = validateRemoteParameters(remoteParametersContent);
    if (errors && errors.length > 0) {
        return { errors, parameters: null };
    }
    return processRemoteParameters(remoteParametersContent, parameters);
}

// 遥控器控制处理函数
function handleRemoteControls(
    remoteControlsContent, 
    remoteParametersContent,
    registeredGroupNames,
    registeredSceneNames
) {
    // 传递给实际的处理函数
    return processRemoteControls(
        remoteControlsContent, 
        remoteParametersContent,
        registeredGroupNames,
        registeredSceneNames
    );
}

// 导出所有处理函数和工具
export {
    resetDeviceNameToType,
    processDevices,
    processGroups,
    processScenes,
    handleRemoteControls as processRemoteControls,
    processOutputModules,
    processInputModules,
    processDryContactModules,
    processRemoteParameters,
    validateRemoteParameters,
    handleRemoteParameters,
    AllDeviceTypes,
    determineDeviceType,
    sceneOutputTemplates
};
