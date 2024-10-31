export const VALID_PARAMETERS = {
    BACKLIGHT: ['ENABLED', 'DISABLED'],
    BACKLIGHT_COLOR: ['WHITE', 'GREEN', 'BLUE'],
    BACKLIGHT_TIMEOUT: ['30S', '1MIN', '2MIN', '3MIN', '5MIN', '10MIN', 'NEVER'],
    BEEP: ['ENABLED', 'DISABLED'],
    NIGHT_LIGHT: ['LOW', 'MEDIUM', 'HIGH', 'DISABLED']
};

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