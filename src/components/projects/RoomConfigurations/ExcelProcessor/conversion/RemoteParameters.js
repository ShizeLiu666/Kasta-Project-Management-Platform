import { VALID_PARAMETERS } from '../validation/RemoteParameters';

// 定义默认参数
const DEFAULT_PARAMETERS = {
    BACKLIGHT: 'ENABLED',          // value: 1
    BACKLIGHT_COLOR: 'BLUE',       // value: 3
    BACKLIGHT_TIMEOUT: '1MIN',     // value: 1
    BEEP: 'ENABLED',              // value: 1
    NIGHT_LIGHT: 'MEDIUM'         // value: 15
};

// 参数值映射表
const PARAMETER_VALUES = {
    BACKLIGHT: {
        'ENABLED': 1,
        'DISABLED': 0
    },
    BACKLIGHT_COLOR: {
        'WHITE': 1,
        'GREEN': 2,
        'BLUE': 3
    },
    BACKLIGHT_TIMEOUT: {
        '30S': 0,
        '1MIN': 1,
        '2MIN': 2,
        '3MIN': 3,
        '5MIN': 4,
        '10MIN': 5,
        'NEVER': 6
    },
    BEEP: {
        'ENABLED': 1,
        'DISABLED': 0
    },
    NIGHT_LIGHT: {
        'LOW': 10,
        'MEDIUM': 15,
        'HIGH': 20,
        'DISABLED': 0
    }
};

export function processRemoteParameters(remoteParametersContent) {
    // 初始化默认参数
    const parameters = new Map(
        Object.entries(DEFAULT_PARAMETERS).map(([key, value]) => [
            key,
            { text: value, value: PARAMETER_VALUES[key][value] }
        ])
    );

    if (!remoteParametersContent || !Array.isArray(remoteParametersContent)) {
        return { parameters };
    }

    remoteParametersContent.forEach(line => {
        line = line.trim();
        
        if (line.startsWith("REMOTE CONTROL PARAMETER")) {
            return;
        }

        const [paramName, value] = line.split(':').map(part => part.trim().toUpperCase());
        
        if (VALID_PARAMETERS[paramName] && VALID_PARAMETERS[paramName].includes(value)) {
            parameters.set(paramName, {
                text: value,
                value: PARAMETER_VALUES[paramName][value]
            });
        }
    });

    return { parameters };
}