/**
 * 设备组转换模块 (conversion/Groups.js)
 * 
 * 主要功能：
 * 1. 组数据解析：
 *    - 解析Excel中的组定义行
 *    - 提取组名称和组内设备列表
 *    - 处理多种设备内容标识符格式
 * 
 * 2. 设备引用解析：
 *    - 解析组内设备名称列表（逗号分隔）
 *    - 获取设备的外观简称信息
 *    - 建立组与设备的关联关系
 * 
 * 3. 格式标准化：
 *    - 统一处理多种设备内容标识符
 *    - 支持的标识符：CONTROL CONTENT、DEVICE CONTENT、DEVICE CONTROL
 *    - 过滤空白和无效设备名称
 * 
 * 4. 依赖管理：
 *    - 依赖Devices模块的getDeviceNameToAppearanceShortname函数
 *    - 确保组内设备引用的有效性
 * 
 * 输入格式：
 * ```
 * NAME: 组名称1
 * CONTROL CONTENT: 设备名称1, 设备名称2, 设备名称3
 * 或
 * DEVICE CONTENT: 设备名称1, 设备名称2
 * 或
 * DEVICE CONTROL: 设备名称1, 设备名称2
 * 
 * NAME: 组名称2
 * 设备名称4, 设备名称5
 * ```
 * 
 * 输出格式：
 * ```json
 * {
 *   "groups": [
 *     {
 *       "groupName": "组名称1",
 *       "devices": [
 *         {
 *           "appearanceShortname": "设备型号简称",
 *           "deviceName": "设备名称1"
 *         },
 *         {
 *           "appearanceShortname": "设备型号简称",
 *           "deviceName": "设备名称2"
 *         }
 *       ]
 *     }
 *   ]
 * }
 * ```
 */

import { getDeviceNameToAppearanceShortname } from './Devices';

// 主组处理函数：将组内容转换为标准JSON格式
export function processGroups(groupsContent) {
    if (!groupsContent) return { groups: [] };
    
    const groupsData = [];
    let currentGroupName = null;
    let currentDevices = [];

    groupsContent.forEach(line => {
        line = line.trim();

        // 解析组名称行
        if (line.startsWith("NAME:")) {
            // 如果存在当前组，先保存到结果中
            if (currentGroupName) {
                groupsData.push({
                    groupName: currentGroupName,
                    devices: currentDevices
                });
                currentDevices = [];
            }
            currentGroupName = line.replace("NAME:", "").trim();
        } else if (currentGroupName) {
            // 处理设备列表行：清理各种设备内容标识符
            line = line.replace(/CONTROL CONTENT:|DEVICE CONTENT:|DEVICE CONTROL:/g, '').trim();
            
            // 按逗号分割设备名称并过滤空值
            const devices = line.split(',')
                                .map(device => device.trim())
                                .filter(device => device);
            
            // 为每个设备创建标准化对象
            devices.forEach(deviceName => {
                currentDevices.push({
                    appearanceShortname: getDeviceNameToAppearanceShortname()[deviceName] || '',
                    deviceName: deviceName
                });
            });
        }
    });

    // 处理最后一个组（如果存在）
    if (currentGroupName) {
        groupsData.push({
            groupName: currentGroupName,
            devices: currentDevices
        });
    }

    return { groups: groupsData };
}