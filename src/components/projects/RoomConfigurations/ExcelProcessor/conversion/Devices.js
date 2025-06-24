/**
 * 设备转换模块 (conversion/Devices.js)
 * 
 * 主要功能：
 * 1. 设备数据解析：
 *    - 解析Excel中的设备定义行
 *    - 提取设备型号简称和设备名称
 *    - 自动识别和分类设备类型
 * 
 * 2. 设备类型映射：
 *    - 基于AllDeviceTypes进行智能匹配
 *    - 支持精确匹配和模糊匹配算法
 *    - 处理嵌套设备类型（如单路/双路插座）
 * 
 * 3. 状态管理：
 *    - deviceNameToType: 设备名称到类型的映射表
 *    - deviceNameToAppearanceShortname: 设备名称到外观简称映射
 *    - registeredDevices: 已注册设备名称列表
 * 
 * 4. 工具函数：
 *    - 重置状态函数
 *    - 获取映射表函数
 *    - 设备注册管理
 * 
 * 输入格式：
 * ```
 * NAME: 设备型号简称
 * 设备名称1
 * 设备名称2
 * 设备名称3
 * ```
 * 
 * 输出格式：
 * {
 *   "devices": [
 *     {
 *       "appearanceShortname": "设备型号简称",
 *       "deviceName": "设备名称",
 *       "deviceType": "设备类型"
 *     }
 *   ]
 * }
 */

import { AllDeviceTypes } from '../ExcelProcessor';

// 全局状态管理：设备名称到类型的映射表
let deviceNameToType = {};
// 全局状态管理：设备名称到外观简称的映射表
let deviceNameToAppearanceShortname = {};
// 全局状态管理：已注册设备列表
let registeredDevices = [];

// 重置设备名称映射表
export function resetDeviceNameToType() {
    deviceNameToType = {};
    deviceNameToAppearanceShortname = {};
}

// 重置已注册设备列表
export function resetRegisteredDevices() {
    registeredDevices = [];
}

// 主设备处理函数：将设备内容转换为标准JSON格式
export function processDevices(devicesContent) {
    if (!devicesContent) return { devices: [] };
    
    const devicesData = [];
    let currentShortname = null;

    resetRegisteredDevices();

    // 智能设备型号匹配函数：支持双向模糊匹配
    function isModelMatching(model, shortname) {
        return shortname && (model.includes(shortname) || shortname.includes(model));
    }

    devicesContent.forEach(line => {
        line = line.trim();

        // 解析设备型号简称行
        if (line.startsWith("NAME:")) {
            currentShortname = line.replace("NAME:", "").trim();
            return;
        }

        // 跳过数量行（QTY行不参与转换）
        if (line.startsWith("QTY:")) return;

        let deviceType = null;
        const shortnameForMatching = currentShortname;

        // 遍历所有设备类型进行匹配
        for (const [dtype, models] of Object.entries(AllDeviceTypes)) {
            if (Array.isArray(models)) {
                // 处理简单数组类型的设备
                if (models.some(model => isModelMatching(model, shortnameForMatching))) {
                    deviceType = dtype;
                    break;
                }
            } else if (typeof models === 'object') {
                // 处理嵌套对象类型的设备（如电源插座的单路/双路）
                for (const subType in models) {
                    const subModelArray = models[subType];
                    if (Array.isArray(subModelArray) && 
                        subModelArray.some(model => isModelMatching(model, shortnameForMatching))) {
                        deviceType = `${dtype} (${subType})`;
                        break;
                    }
                }
            }
            if (deviceType) break;
        }

        // 构建设备信息对象并注册到全局状态
        if (currentShortname) {
            const deviceInfo = {
                appearanceShortname: currentShortname,
                deviceName: line,
                ...(deviceType && { deviceType })
            };
            devicesData.push(deviceInfo);

            // 更新全局映射表
            deviceNameToType[line] = deviceType;
            deviceNameToAppearanceShortname[line] = currentShortname;
            registeredDevices.push(line);
        }
    });

    return { devices: devicesData };
}

// 获取设备名称到类型的映射表
export function getDeviceNameToType() {
    return deviceNameToType;
}

// 获取设备名称到外观简称的映射表
export function getDeviceNameToAppearanceShortname() {
    return deviceNameToAppearanceShortname;
}

// 获取已注册设备列表
export function getRegisteredDevices() {
    return registeredDevices;
}