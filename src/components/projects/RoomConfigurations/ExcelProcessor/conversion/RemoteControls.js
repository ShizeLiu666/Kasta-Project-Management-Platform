/**
 * 遥控器控制转换模块 (conversion/RemoteControls.js)
 * 
 * 支持的遥控器类型：
 * 1. 按键面板系列：
 *    - 1 Push Panel: 1个按键
 *    - 2 Push Panel: 2个按键  
 *    - 3 Push Panel: 3个按键
 *    - 4 Push Panel: 4个按键
 *    - 5 Push Panel: 5个按键
 *    - 6 Push Panel: 6个按键
 * 2. 输入模块系列：
 *    - 5 Input Module: 5个输入通道
 * 
 * 核心功能模块：
 * 1. 遥控器配置管理：
 *    - createDefaultLink: 创建默认按键链接对象
 *    - getRemoteButtonCount: 获取遥控器按键数量
 *    - 自动填充未配置的按键为默认值
 * 
 * 2. 智能目标识别系统：
 *    - determineTargetType: 识别绑定目标类型
 *    - 支持设备(Device)、组(Group)、场景(Scene)三种目标类型
 *    - 自动清理目标名称前缀
 * 
 * 3. rc_index映射引擎：
 *    - ACTION_RC_INDEX_MAP: 操作到索引的映射表
 *    - getRcIndex: 根据设备类型和操作获取rc索引
 *    - 支持窗帘、风扇、电源插座、输出模块的复杂操作映射
 * 
 * 4. 参数集成系统：
 *    - 集成RemoteParameters模块的参数处理
 *    - 区分Input Module和其他设备的参数需求
 *    - 自动参数键名标准化
 * 
 * 支持的目标类型：
 * - Type 1: Device (设备) - 直接控制单个设备
 * - Type 2: Group (组) - 控制设备组，rc_index固定为32
 * - Type 4: Scene (场景) - 触发场景，rc_index固定为0
 * 
 * 复杂操作映射：
 * 1. 窗帘操作：OPEN(0), CLOSE(1), WHOLE(2)
 * 2. 风扇操作：FAN(0), LAMP(1), WHOLE(2)  
 * 3. 电源插座操作：LEFT(0), RIGHT(1), WHOLE(2)
 * 4. 4输出模块：FIRST(0), SECOND(1), THIRD(2), FOURTH(3), WHOLE(4)
 * 
 * 输入格式示例：
 * ```
 * NAME: 客厅遥控器
 * 1: 客厅主灯 - WHOLE
 * 2: GROUP 客厅组 
 * 3: SCENE 晚间场景
 * 4: 客厅窗帘 - OPEN
 * ```
 * 
 * 输出格式：
 * ```json
 * {
 *   "remoteControls": [
 *     {
 *       "remoteName": "客厅遥控器",
 *       "links": [
 *         {
 *           "linkIndex": 0,
 *           "linkType": 1,
 *           "linkName": "客厅主灯", 
 *           "action": "WHOLE",
 *           "rc_index": 0
 *         }
 *       ],
 *       "parameters": {
 *         "backlight": 1,
 *         "beep": 1
 *       }
 *     }
 *   ]
 * }
 * ```
 */

import { getDeviceNameToType } from './Devices';
import { processRemoteParameters } from './RemoteParameters';

/**
 * 创建默认按键链接对象
 * 
 * 功能：为未配置的按键创建标准的默认链接对象
 * 用途：确保所有按键位置都有完整的配置，避免空值错误
 * 
 * @param {number} index - 按键索引（从0开始）
 * @returns {Object} 默认链接对象
 */
const createDefaultLink = (index) => ({
    action: "",           // 操作指令（空表示无操作）
    linkName: "",         // 链接目标名称（空表示无目标）
    linkType: 0,          // 链接类型（0表示无链接）
    rc_index: 0,          // 遥控器索引（默认为0）
    linkIndex: index      // 按键索引位置
});

/**
 * 获取遥控器按键数量
 * 
 * 功能：根据设备类型自动计算遥控器的按键数量
 * 支持：1-6按键面板、5输入模块
 * 
 * @param {string} deviceType - 设备类型字符串
 * @returns {number} 按键数量
 */
const getRemoteButtonCount = (deviceType) => {
    if (!deviceType) return 0;
    if (deviceType.includes("6 Push Panel")) return 6;
    if (deviceType.includes("5 Push Panel")) return 5;
    if (deviceType.includes("4 Push Panel")) return 4;
    if (deviceType.includes("3 Push Panel")) return 3;
    if (deviceType.includes("2 Push Panel")) return 2;
    if (deviceType.includes("1 Push Panel")) return 1;
    if (deviceType.includes("5 Input Module")) return 5;
    return 0;
};

/**
 * 操作到rc_index的映射表
 * 
 * 功能：定义不同设备类型的操作指令与rc_index的对应关系
 * 用途：实现复杂设备的精确操作控制
 * 
 * 映射规则：
 * - 窗帘：开启(0)、关闭(1)、整体(2)
 * - 风扇：风扇(0)、灯光(1)、整体(2)
 * - 电源插座：左路(0)、右路(1)、整体(2)
 * - 4输出模块：第一路(0)、第二路(1)、第三路(2)、第四路(3)、整体(4)
 */
const ACTION_RC_INDEX_MAP = {
    'CURTAIN': {
        'OPEN': 0,      // 窗帘开启
        'CLOSE': 1,     // 窗帘关闭
        'WHOLE': 2      // 窗帘整体控制
    },
    'FAN': {
        'FAN': 0,       // 风扇控制
        'LAMP': 1,      // 灯光控制
        'WHOLE': 2      // 风扇整体控制
    },
    'POWERPOINT': {
        'LEFT': 0,      // 左路插座
        'RIGHT': 1,     // 右路插座
        'WHOLE': 2      // 插座整体控制
    },
    '4_OUTPUT': {
        'FIRST': 0,     // 第一输出
        'SECOND': 1,    // 第二输出
        'THIRD': 2,     // 第三输出
        'FOURTH': 3,    // 第四输出
        'WHOLE': 4      // 整体输出控制
    },
};

/**
 * 获取rc_index值
 * 
 * 功能：根据设备类型和操作指令计算对应的rc_index值
 * 算法：基于ACTION_RC_INDEX_MAP进行智能匹配
 * 
 * @param {string} deviceType - 设备类型
 * @param {string} operation - 操作指令
 * @returns {number} rc_index值
 */
const getRcIndex = (deviceType, operation) => {
    if (!operation) return 0;
    
    const upperOperation = operation.toUpperCase();
    
    // 窗帘类型设备
    if (deviceType.includes("Curtain Type")) {
        return ACTION_RC_INDEX_MAP.CURTAIN[upperOperation] ?? 2;
    }
    // 风扇类型设备
    if (deviceType.includes("Fan Type")) {
        return ACTION_RC_INDEX_MAP.FAN[upperOperation] ?? 0;
    }
    // 双路电源插座
    if (deviceType === "PowerPoint Type (Two-Way)") {
        return ACTION_RC_INDEX_MAP.POWERPOINT[upperOperation] ?? 2;
    }
    // 4输出模块
    if (deviceType === "4 Output Module") {
        return ACTION_RC_INDEX_MAP['4_OUTPUT'][upperOperation] ?? 4;
    }
    
    return 0; // 默认返回0
};

/**
 * 主遥控器处理函数
 * 
 * 功能：将Excel中的遥控器绑定数据转换为标准化的JSON格式
 * 依赖：Devices模块（设备类型映射）、RemoteParameters模块（参数处理）
 * 
 * 处理流程：
 * 1. 解析遥控器名称和按键绑定
 * 2. 识别绑定目标类型（设备/组/场景）
 * 3. 计算rc_index值
 * 4. 处理遥控器参数
 * 5. 生成完整的按键配置数组
 * 
 * @param {Array} remoteControlsContent - 遥控器内容数组
 * @param {Array} remoteParametersContent - 遥控器参数内容数组
 * @param {Set} registeredGroupNames - 已注册的组名集合
 * @param {Set} registeredSceneNames - 已注册的场景名集合
 * @returns {Object} 标准化的遥控器配置对象
 */
export function processRemoteControls(
    remoteControlsContent, 
    remoteParametersContent,
    registeredGroupNames,
    registeredSceneNames
) {
    if (!remoteControlsContent) return { remoteControls: [] };
    
    const deviceNameToType = getDeviceNameToType();
    const remoteControlsData = [];
    let currentRemote = null;
    let currentLinks = [];

    // 处理遥控器参数
    const { parameters } = processRemoteParameters(remoteParametersContent);

    /**
     * 目标类型识别函数
     * 
     * 功能：识别绑定目标的类型（设备/组/场景）
     * 处理：自动清理目标名称前缀（DEVICE/GROUP/SCENE）
     * 
     * @param {string} targetName - 目标名称
     * @returns {Object|null} 目标类型信息对象
     */
    const determineTargetType = (targetName) => {
        // 移除可能存在的关键词前缀
        const cleanTargetName = targetName
            .replace(/^(DEVICE|GROUP|SCENE)\s+/, '')
            .trim();

        // 首先检查是否是设备
        if (deviceNameToType[cleanTargetName]) {
            return {
                type: 1, // DEVICE类型
                name: cleanTargetName,
                deviceType: deviceNameToType[cleanTargetName]
            };
        }
        
        // 检查是否是组
        if (registeredGroupNames?.has(cleanTargetName)) {
            return {
                type: 2, // GROUP类型
                name: cleanTargetName
            };
        }
        
        // 检查是否是场景
        if (registeredSceneNames?.has(cleanTargetName)) {
            return {
                type: 4, // SCENE类型
                name: cleanTargetName
            };
        }
        
        return null; // 未识别的目标类型
    };

    remoteControlsContent.forEach(line => {
        line = line.trim();

        // 跳过TOTAL行
        if (line.startsWith("TOTAL")) return;

        // 解析遥控器名称行
        if (line.startsWith("NAME:")) {
            // 处理前一个遥控器的数据
            if (currentRemote) {
                const deviceType = deviceNameToType[currentRemote];
                const buttonCount = getRemoteButtonCount(deviceType);
                
                // 创建完整的按键数组（补全未配置的按键）
                const fullLinks = Array(buttonCount).fill(null).map((_, index) => {
                    const existingLink = currentLinks.find(link => link.linkIndex === index);
                    return existingLink || createDefaultLink(index);
                });

                // 检查是否是输入模块（输入模块不需要parameters）
                const isInputModule = deviceType?.includes("Input Module");
                
                const remoteData = {
                    remoteName: currentRemote,
                    links: fullLinks,
                    // 只有非输入模块设备才需要parameters
                    parameters: isInputModule ? undefined : {}
                };

                // 只有非输入模块设备才处理参数
                if (!isInputModule && parameters) {
                    parameters.forEach((param, key) => {
                        remoteData.parameters[key.toLowerCase()] = param.value;
                    });
                }
                
                remoteControlsData.push(remoteData);
            }

            // 开始处理新的遥控器
            currentRemote = line.replace("NAME:", "").trim();
            currentLinks = [];
        } 
        // 解析按键绑定行（格式：按键号: 目标名称 - 操作）
        else if (line.includes(":")) {
            const [indexStr, targetInfo] = line.split(":");
            if (!indexStr || !targetInfo) return;

            const linkIndex = parseInt(indexStr.trim(), 10) - 1; // 转换为0基础索引
            const [targetName, operation] = targetInfo.trim().split(" - ").map(part => part?.trim());
            
            // 识别目标类型
            const targetTypeInfo = determineTargetType(targetName);
            if (targetTypeInfo) {
                // 计算rc_index：组类型固定为32，其他根据操作计算
                const rc_index = targetTypeInfo.type === 2 ? 32 : 
                               getRcIndex(targetTypeInfo.deviceType, operation);
                
                currentLinks.push({
                    linkIndex,
                    linkType: targetTypeInfo.type,
                    linkName: targetTypeInfo.name,
                    action: operation || "",
                    rc_index
                });
            }
        }
    });

    // 处理最后一个遥控器
    if (currentRemote) {
        const deviceType = deviceNameToType[currentRemote];
        const buttonCount = getRemoteButtonCount(deviceType);
        const isInputModule = deviceType?.includes("Input Module");
        
        // 创建完整的按键数组
        const fullLinks = Array(buttonCount).fill(null).map((_, index) => {
            const existingLink = currentLinks.find(link => link.linkIndex === index);
            return existingLink || createDefaultLink(index);
        });

        const remoteData = {
            remoteName: currentRemote,
            links: fullLinks,
            parameters: isInputModule ? undefined : {}
        };

        // 处理参数（仅非输入模块设备）
        if (!isInputModule && parameters) {
            parameters.forEach((param, key) => {
                remoteData.parameters[key.toLowerCase()] = param.value;
            });
        }

        remoteControlsData.push(remoteData);
    }

    return { remoteControls: remoteControlsData };
}