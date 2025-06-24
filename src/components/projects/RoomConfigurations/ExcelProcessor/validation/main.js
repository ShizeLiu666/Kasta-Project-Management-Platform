/**
 * 验证系统主入口模块 (main.js)
 * 
 * 系统架构概述：
 * 整个Excel到JSON验证系统的协调器，负责统一调度和管理所有验证模块。
 * 
 * 主要功能：
 * 1. 数据预处理：
 *    - 接收Excel文件内容并转换为JSON格式
 *    - 按关键词分割数据到不同的验证类别
 *    - 提取"programming details"工作表数据
 * 
 * 2. 数据分类：
 *    - KASTA DEVICE: 设备定义数据
 *    - KASTA GROUP: 组定义数据  
 *    - KASTA SCENE: 场景定义数据
 *    - REMOTE CONTROL LINK: 遥控器绑定数据
 * 
 * 3. 验证流程编排（按依赖顺序）：
 *    - 第一阶段：设备验证 -> 生成设备名称到类型的映射
 *    - 第二阶段：组验证 -> 验证设备引用，生成组名集合
 *    - 第三阶段：场景验证 -> 验证设备和组引用，生成场景名集合
 *    - 第四阶段：遥控器验证 -> 验证所有类型的目标引用
 * 
 * 4. 错误收集与格式化：
 *    - 收集所有模块的验证错误
 *    - 按模块类型分组并添加分隔符
 *    - 过滤空错误并返回统一格式
 * 
 * 验证依赖关系：
 * ```
 * 设备验证 (Devices)
 *     ↓ deviceNameToType
 * 组验证 (Groups) ← 设备依赖
 *     ↓ registeredGroupNames  
 * 场景验证 (Scenes) ← 设备依赖
 *     ↓ registeredSceneNames
 * 遥控器验证 (RemoteControls) ← 设备、组、场景依赖
 * ```
 * 
 * 输入：Excel文件内容 (Blob/File)
 * 输出：验证错误数组，按模块分组
 */

// 导入Excel处理器（仅导入需要的功能）
import { processExcelToJson } from '../ExcelProcessor';
// 导入各个验证模块
import { validateDevices } from './Devices';
import { validateGroups } from './Groups';
import { validateScenes } from './Scenes';
import { validateRemoteControls } from './RemoteControls';

// 根据关键词分割JSON数据到不同类别
function splitJsonFile(content) {
    // 定义分割关键词映射
    const splitKeywords = {
        devices: "KASTA DEVICE",
        groups: "KASTA GROUP",
        scenes: "KASTA SCENE",
        remoteControls: "REMOTE CONTROL LINK"
    };

    // 初始化分类数据容器
    const splitData = { devices: [], groups: [], scenes: [], remoteControls: [] };
    let currentKey = null;

    content.forEach(line => {
        line = line.trim(); // 确保没有前后空格

        // 检查是否为分类关键词
        if (Object.values(splitKeywords).includes(line)) {
            currentKey = Object.keys(splitKeywords).find(key => splitKeywords[key] === line);
            return;
        }

        // 将数据行添加到当前分类中
        if (currentKey) {
            splitData[currentKey].push(line);
        }
    });

    return splitData;
}

// 主验证函数：协调所有验证模块的执行
export function validateExcel(fileContent) {
    // 第一步：将Excel内容转换为JSON格式
    const allTextData = processExcelToJson(fileContent);

    if (!allTextData) {
        return ['No valid data found in the Excel file'];
    }

    // 第二步：分割数据到不同验证类别
    const splitData = splitJsonFile(allTextData["programming details"]); 

    // 调试信息：输出分割后的数据结构
    console.log('****************************************************************');
    console.log(splitData);
    console.log('****************************************************************');

    // 第三步：按依赖顺序执行验证

    // 1：设备验证（基础层）- 生成设备名称到类型的映射
    const { errors: deviceErrors, deviceNameToType, registeredDeviceNames } = validateDevices(splitData.devices);

    // 2：组验证（依赖设备） - 传入设备映射，生成组名集合
    const { errors: groupErrors, registeredGroupNames } = validateGroups(splitData.groups, deviceNameToType);

    // 3：场景验证（依赖设备） - 传入设备映射，生成场景名集合
    const { errors: sceneErrors, registeredSceneNames } = validateScenes(splitData.scenes, deviceNameToType);

    // 4：遥控器验证（依赖所有前面的结果） - 传入所有已注册的名称
    const remoteControlErrors = validateRemoteControls(
        splitData.remoteControls,
        deviceNameToType,
        registeredDeviceNames,
        registeredGroupNames,
        registeredSceneNames
    );

    // 第四步：收集和格式化所有错误
    // 在每个错误数组后添加空字符串作为分隔符
    const allErrors = [
        ...deviceErrors,
        '', 
        ...groupErrors,
        '', 
        ...sceneErrors,
        '',
        ...remoteControlErrors
    ];

    // 返回所有错误，过滤掉空数组或空字符串
    return allErrors.filter(Boolean);
}