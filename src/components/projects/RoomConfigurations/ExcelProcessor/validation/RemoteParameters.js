/**
 * 遥控器参数验证模块 (RemoteParameters.js)
 * 
 * 验证逻辑概述：
 * 1. 参数格式验证：
 *    - 验证参数名称是否在预定义列表中
 *    - 检查参数值格式（参数名: 参数值）
 *    - 确保参数值在允许的范围内
 * 2. 参数值验证：
 *    - BACKLIGHT: 背光开关（ENABLED/DISABLED）
 *    - BACKLIGHT_COLOR: 背光颜色（WHITE/GREEN/BLUE）
 *    - BACKLIGHT_TIMEOUT: 背光超时时间（30S/1MIN/2MIN/3MIN/5MIN/10MIN/NEVER）
 *    - BEEP: 蜂鸣器开关（ENABLED/DISABLED）
 *    - NIGHT_LIGHT: 夜灯亮度（LOW/MEDIUM/HIGH/DISABLED）
 * 3. 参数数量验证：
 *    - 检查参数总数不超过最大限制（5个）
 *    - 允许部分参数为空（可选参数）
 * 4. 参数完整性验证：
 *    - 验证必填参数是否提供
 *    - 检查参数格式是否正确
 * 
 * 输入格式：
 * BACKLIGHT: ENABLED
 * BACKLIGHT_COLOR: WHITE
 * BACKLIGHT_TIMEOUT: 2MIN
 * BEEP: DISABLED
 * NIGHT_LIGHT: LOW
 * 
 * 输出：
 * - errors: 验证错误数组
 * - parameters: 参数映射表（Map对象）
 */

// 有效参数定义常量
export const VALID_PARAMETERS = {
    BACKLIGHT: ['ENABLED', 'DISABLED'],
    BACKLIGHT_COLOR: ['WHITE', 'GREEN', 'BLUE'],
    BACKLIGHT_TIMEOUT: ['30S', '1MIN', '2MIN', '3MIN', '5MIN', '10MIN', 'NEVER'],
    BEEP: ['ENABLED', 'DISABLED'],
    NIGHT_LIGHT: ['LOW', 'MEDIUM', 'HIGH', 'DISABLED']
};

// 主验证函数
export function validateRemoteParameters(parameterDataArray) {
    // 如果没有参数数据，直接返回空
    if (!parameterDataArray || parameterDataArray.length === 0) {
        return { errors: [], parameters: new Map() };
    }

    const errors = [];
    const parameters = new Map(Object.keys(VALID_PARAMETERS).map(key => [key, ""]));
    
    parameterDataArray.forEach(line => {
        line = line.trim();
        const [paramName, value] = line.split(':').map(part => part.trim().toUpperCase());
        
        if (!VALID_PARAMETERS[paramName]) {
            errors.push(
                `REMOTE CONTROL PARAMETER: Unknown parameter '${paramName}'. Valid parameters are: ${Object.keys(VALID_PARAMETERS).join(', ')}`
            );
            return;
        }
        
        if (!value) {
            errors.push(
                `REMOTE CONTROL PARAMETER: Missing value for parameter '${paramName}'`
            );
            return;
        }

        if (!VALID_PARAMETERS[paramName].includes(value)) {
            errors.push(
                `REMOTE CONTROL PARAMETER: Invalid value '${value}' for ${paramName}. Valid values are: ${VALID_PARAMETERS[paramName].join(', ')}`
            );
            return;
        }

        parameters.set(paramName, value);
    });

    // 只检查参数数量上限
    const validParameterCount = Array.from(parameters.values()).filter(value => value !== "").length;
    if (validParameterCount > 5) {
        errors.push(
            `REMOTE CONTROL PARAMETER: Too many parameters specified. Maximum allowed is 5, but got ${validParameterCount}`
        );
    }

    return { errors, parameters };
}