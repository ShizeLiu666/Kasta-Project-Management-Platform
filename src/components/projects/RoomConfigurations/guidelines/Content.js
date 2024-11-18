export const content = {
    en: {
      title: 'Configuration Guidelines',
      // Device Configuration
      deviceConfig: 'Device Configuration',
      modelDeclaration: 'Device Model Declaration',
      namingRules: 'Device Naming Rules',
      mustStartWith: 'Must start with NAME:',
      deviceModels: 'Device models must be from \'Supported Devices\'',
      allowedChars: 'Allowed characters:',
      letters: 'Letters (a-z, A-Z)',
      numbers: 'Numbers (0-9)',
      underscore: 'Underscore (_)',
      noSpaces: 'Spaces are not allowed',
      uniqueName: 'Each device name must be unique and cannot conflict with Device models',
      closeButton: 'Close',
  
      // Group Configuration
      groupConfig: 'Group Configuration',
      groupModelDeclaration: 'Group Model Declaration',
      deviceListRules: 'Device List Rules',
      groupMustStartWith: 'Must start with NAME:',
      groupNamesCanContain: 'Group names can contain:',
      groupLetters: 'Letters (a-z, A-Z)',
      groupNumbers: 'Numbers (0-9)',
      groupUnderscore: 'Underscore (_)',
      groupSpaces: 'Spaces (unlike device names)',
      uniqueGroupName: 'Each group name must be unique',
      listDevices: 'List devices after group name',
      eachDeviceMust: 'Each device must:',
      previouslyDefined: 'Be previously defined in DEVICE section',
      noSpacesInDevice: 'Not contain spaces',
      uniqueInGroup: 'Be unique within the group',
      devicesSeparated: 'Multiple devices separated by commas',
  
      // Scene Configuration
      sceneConfig: {
        title: 'Scene Configuration',
        sceneDeclaration: 'Scene Declaration',
        deviceOperationRules: 'Device Operation Rules',
        scene: 'Scene',
        mustStartWith: 'Must start with NAME:',
        sceneNamesCanContain: 'Scene names can contain:',
        letters: 'Letters (a-z, A-Z)',
        numbers: 'Numbers (0-9)',
        underscore: 'Underscore (_)',
        spaces: 'Spaces',
        uniqueSceneName: 'Each scene name must be unique',
        deviceTypes: {
          relay: {
            title: 'Relay/Dry Contact Type:',
            rules: [
              'DEVICE_NAME ON/OFF',
              'DEVICE_NAME_1, DEVICE_NAME_2 ON/OFF'
            ]
          },
          dimmer: {
            title: 'Dimmer Type:',
            rules: [
              'DEVICE_NAME ON/OFF',
              'DEVICE_NAME ON +XX% (0-100%)',
              'DEVICE_NAME_1, DEVICE_NAME_2 ON +XX%'
            ]
          },
          fan: {
            title: 'Fan Type:',
            rules: [
              'FAN_NAME ON RELAY ON [SPEED X]  (X = 1-3)',
              'FAN_NAME ON RELAY ON',
              'FAN_NAME OFF RELAY OFF'
            ]
          },
          curtain: {
            title: 'Curtain Type:',
            rules: [
              'DEVICE_NAME OPEN/CLOSE',
              'DEVICE_NAME_1, DEVICE_NAME_2 OPEN/CLOSE'
            ]
          },
          powerPoint: {
            title: 'PowerPoint Type:',
            rules: {
              singleWay: {
                title: 'Single-Way:',
                rules: ['DEVICE_NAME ON/OFF']
              },
              twoWay: {
                title: 'Two-Way:',
                rules: [
                  'DEVICE_NAME ON ON',
                  'DEVICE_NAME ON OFF',
                  'DEVICE_NAME OFF ON',
                  'DEVICE_NAME UNSELECT'
                ]
              }
            }
          }
        },
        generalRules: [
          'All devices must be previously defined in DEVICE section',
          'Multiple devices of the same type can be controlled together',
          'Cannot mix different device types in group operations (except Relay and Dimmer)',
          'Percentage values must be between 0-100',
          'Device names must be defined before any operation commands',
          'Operations must follow the exact format specified for each device type',
          'Commands are case-insensitive but must match the specified format',
          'Each instruction must contain at least one device and one valid operation'
        ]
      },
      // Remote Control Configuration
      remoteControlConfig: {
        title: 'Remote Control Configuration',
        declaration: 'Device Declaration',
        configRules: 'Button/Input Configuration Rules',
        mustStartWith: 'Must start with NAME:',
        deviceNamesCanContain: 'Device names can contain:',
        letters: 'Letters (a-z, A-Z)',
        numbers: 'Numbers (0-9)',
        underscore: 'Underscore (_)',
        spaces: 'Spaces',
        deviceTypes: {
          title: 'Must be defined in DEVICE section as:',
          types: [
            'Remote Control type (1-6 Push Panel)',
            '5/6 Input Module',
            '4 Output Module'
          ]
        },
        commandFormat: {
          title: 'Basic Format:',
          format: '[Number]: [Command Type] [Target] [Options]',
          notes: [
            'Number: Based on device type (1-6)',
            'Command Types: DEVICE, GROUP, or SCENE'
          ]
        },
        commandTypes: {
          device: {
            title: 'DEVICE Commands:',
            standard: {
              title: 'Standard Devices:',
              format: 'Basic: [Number]: DEVICE [device_name]'
            },
            fan: {
              title: 'Fan Type:',
              formats: [
                'DEVICE [device_name]    (Default operation: FAN)',
                'DEVICE [device_name] - FAN',
                'DEVICE [device_name] - LAMP',
                'DEVICE [device_name] - WHOLE'
              ]
            },
            curtain: {
              title: 'Curtain Type:',
              formats: [
                'DEVICE [device_name]    (Default operation: OPEN)',
                'DEVICE [device_name] - OPEN',
                'DEVICE [device_name] - CLOSE',
                'DEVICE [device_name] - WHOLE'
              ]
            },
            powerPoint: {
              title: 'PowerPoint Type (Two-Way):',
              formats: [
                'DEVICE [device_name]    (Default operation: WHOLE)',
                'DEVICE [device_name] - LEFT',
                'DEVICE [device_name] - RIGHT',
                'DEVICE [device_name] - WHOLE'
              ]
            },
            outputModule: {
              title: '4 Output Module:',
              formats: [
                'DEVICE [device_name]    (Default operation: WHOLE)',
                'DEVICE [device_name] - FIRST',
                'DEVICE [device_name] - SECOND',
                'DEVICE [device_name] - THIRD',
                'DEVICE [device_name] - FOURTH',
                'DEVICE [device_name] - WHOLE'
              ]
            },
            inputModule: {
              title: 'Input Module (5/6 Input):',
              basic: {
                title: 'Basic Device Binding:',
                format: 'DEVICE [device_name]    (Default: MOMENTARY)'
              },
              deviceOperation: {
                title: 'Device with Operation:',
                curtain: {
                  title: 'Curtain Examples:',
                  formats: [
                    'DEVICE [device_name] - OPEN    (Default: MOMENTARY)',
                    'DEVICE [device_name] - CLOSE    (Default: MOMENTARY)'
                  ]
                },
                fan: {
                  title: 'Fan Examples:',
                  formats: [
                    'DEVICE [device_name] - FAN    (Default: MOMENTARY)',
                    'DEVICE [device_name] - LAMP    (Default: MOMENTARY)'
                  ]
                }
              },
              inputAction: {
                title: 'Device with Input Action:',
                formats: [
                  'DEVICE [device_name] + TOGGLE',
                  'DEVICE [device_name] + MOMENTARY    (Default)'
                ]
              },
              combinedOperation: {
                title: 'Combined Operation and Input Action:',
                curtain: {
                  title: 'Curtain Examples:',
                  formats: [
                    'DEVICE [device_name] - OPEN + TOGGLE',
                    'DEVICE [device_name] - CLOSE + MOMENTARY'
                  ]
                },
                fan: {
                  title: 'Fan Examples:',
                  formats: [
                    'DEVICE [device_name] - FAN + TOGGLE',
                    'DEVICE [device_name] - LAMP + MOMENTARY'
                  ]
                }
              }
            }
          },
          group: {
            title: 'GROUP Commands:',
            formats: [
              'GROUP [group_name]'
            ]
          },
          scene: {
            title: 'SCENE Commands:',
            formats: [
              'SCENE [scene_name]'
            ]
          }
        },
        rules: [
          'Button/Input numbers must not exceed device capacity:',
          '• 1-6 Push Panel: 1-6 buttons',
          '• 5 Input Module: 1-5 inputs',
          '• 6 Input Module: 1-6 inputs',
          'All referenced devices/groups/scenes must exist',
          'Each button/input can only have one command',
          'Only Input Modules support TOGGLE/MOMENTARY actions',
          'Commands must match device type capabilities',
          'Input Module actions (TOGGLE/MOMENTARY) are added with \'+\' symbol'
        ]
      },
      outputModuleConfig: {
        title: 'Output Module Configuration',
        declaration: 'Device Declaration',
        configRules: 'Channel Configuration Rules',
        mustStartWith: 'Must start with NAME:',
        deviceNamesCanContain: 'Device names can contain:',
        letters: 'Letters (a-z, A-Z)',
        numbers: 'Numbers (0-9)',
        underscore: 'Underscore (_)',
        spaces: 'Spaces',
        deviceTypes: {
          title: 'Must be defined in DEVICE section as:',
          types: [
            '4 Output Module'
          ]
        },
        channelFormat: {
          title: 'Channel Format:',
          basic: '[channel_number]: [channel_name]',
          withAction: '[channel_number]: [channel_name] - [action]',
          notes: [
            'Channel numbers must be between 1 and 4',
            'Channel names cannot contain spaces',
            'Each channel can only be used once per output module'
          ]
        },
        actions: {
          title: 'Supported Actions:',
          types: [
            'NORMAL (default if not specified)',
            '1SEC (1 second pulse)',
            '6SEC (6 seconds pulse)',
            '9SEC (9 seconds pulse)',
            'REVERS (reverse operation)'
          ]
        },
        rules: [
          'Device must be of type "4 Output Module"',
          'Each output module must have a unique name',
          'Channel numbers must be between 1-4',
          'Channel names cannot contain spaces',
          'Each channel can only be used once per module',
          'Actions are optional (NORMAL is default)',
          'Only supported actions are allowed',
          'Command format must be exact'
        ]
      },
      remoteParametersConfig: {
        title: 'Remote Parameters Configuration',
        declaration: 'Parameter Declaration',
        configRules: 'Parameter Configuration Rules',
        globalNote: 'This configuration is global and will affect the default behavior of all remote controls',
        optionalNote: 'Parameter configuration is optional and you can only set the parameters you need to modify',
        defaultValues: 'Default Values:',
        parameters: {
          backlight: {
            title: 'Backlight',
            defaultValue: 'ENABLED',
            values: [
              'BACKLIGHT: ENABLED (Enabled)',
              'BACKLIGHT: DISABLED (Disabled)'
            ]
          },
          backlightColor: {
            title: 'Backlight Color',
            defaultValue: 'BLUE',
            values: [
              'BACKLIGHT_COLOR: WHITE (White)',
              'BACKLIGHT_COLOR: GREEN (Green)',
              'BACKLIGHT_COLOR: BLUE (Blue)'
            ]
          },
          backlightTimeout: {
            title: 'Backlight Timeout',
            defaultValue: '1MIN',
            values: [
              'BACKLIGHT_TIMEOUT: 30S (30 seconds)',
              'BACKLIGHT_TIMEOUT: 1MIN (1 minute)',
              'BACKLIGHT_TIMEOUT: 2MIN (2 minutes)',
              'BACKLIGHT_TIMEOUT: 3MIN (3 minutes)',
              'BACKLIGHT_TIMEOUT: 5MIN (5 minutes)',
              'BACKLIGHT_TIMEOUT: 10MIN (10 minutes)',
              'BACKLIGHT_TIMEOUT: NEVER (Never)'
            ]
          },
          beep: {
            title: 'Beep',
            defaultValue: 'ENABLED',
            values: [
              'BEEP: ENABLED (Enabled)',
              'BEEP: DISABLED (Disabled)'
            ]
          },
          nightLight: {
            title: 'Night Light',
            defaultValue: 'MEDIUM',
            values: [
              'NIGHT_LIGHT: LOW (Low brightness)',
              'NIGHT_LIGHT: MEDIUM (Medium brightness)',
              'NIGHT_LIGHT: HIGH (High brightness)',
              'NIGHT_LIGHT: DISABLED (Disabled)'
            ]
          }
        },
        rules: [
          'Each parameter must follow the colon format',
          'Only one parameter can be set per line',
          'Parameters are case-insensitive',
          'Only supported parameter values are allowed',
          'Each parameter can only be set once',
          'Unset parameters will use the default values',
          'You can only set the parameters you need to modify'
        ]
      }
    },
    zh: {
      title: '配置指南',
      // Device Configuration
      deviceConfig: '设备配置',
      modelDeclaration: '设备型号声明',
      namingRules: '设备命名规则',
      mustStartWith: '必须以 NAME: 开头',
      deviceModels: '设备型号必须来自"支持的设备"列表',
      allowedChars: '允许的字符：',
      letters: '字母 (a-z, A-Z)',
      numbers: '数字 (0-9)',
      underscore: '下划线 (_)',
      noSpaces: '不允许使用空格',
      uniqueName: '每个设备名称必须唯一，且不能与设备型号冲突',
      closeButton: 'CLOSE',
  
      // Group Configuration
      groupConfig: '组配置',
      groupModelDeclaration: '组模型声明',
      deviceListRules: '设备列表规则',
      groupMustStartWith: '必须以 NAME: 开头',
      groupNamesCanContain: '组名可以包含：',
      groupLetters: '字母 (a-z, A-Z)',
      groupNumbers: '数字 (0-9)',
      groupUnderscore: '下划线 (_)',
      groupSpaces: '空格（与设备名不同）',
      uniqueGroupName: '每个组名必须唯一',
      listDevices: '在组名后列出设备',
      eachDeviceMust: '每个设备必须：',
      previouslyDefined: '在 DEVICE 部分已定义',
      noSpacesInDevice: '不包含空格',
      uniqueInGroup: '在组内唯一',
      devicesSeparated: '多个设备用逗号分隔',
  
      // Scene Configuration
      sceneConfig: {
        title: '场景配置',
        sceneDeclaration: '场景声明',
        deviceOperationRules: '设备操作规则',
        scene: '场景',
        mustStartWith: '必须以 NAME: 开头',
        sceneNamesCanContain: '场景名称可以包含：',
        letters: '字母 (a-z, A-Z)',
        numbers: '数字 (0-9)',
        underscore: '下划线 (_)',
        spaces: '空格',
        uniqueSceneName: '每个场景名称必须唯一',
        deviceTypes: {
          relay: {
            title: '继电器/干接点类型：',
            rules: [
              'DEVICE_NAME ON/OFF',
              'DEVICE_NAME_1, DEVICE_NAME_2 ON/OFF'
            ]
          },
          dimmer: {
            title: '调光器类型：',
            rules: [
              'DEVICE_NAME ON/OFF',
              'DEVICE_NAME ON +XX% (0-100%)',
              'DEVICE_NAME_1, DEVICE_NAME_2 ON +XX%'
            ]
          },
          fan: {
            title: '风扇类型：',
            rules: [
              'FAN_NAME ON RELAY ON [SPEED X]  (X = 1-3)',
              'FAN_NAME ON RELAY ON',
              'FAN_NAME OFF RELAY OFF'
            ]
          },
          curtain: {
            title: '窗帘类型：',
            rules: [
              'DEVICE_NAME OPEN/CLOSE',
              'DEVICE_NAME_1, DEVICE_NAME_2 OPEN/CLOSE'
            ]
          },
          powerPoint: {
            title: '电源点类型：',
            rules: {
              singleWay: {
                title: '单路：',
                rules: ['DEVICE_NAME ON/OFF']
              },
              twoWay: {
                title: '双路：',
                rules: [
                  'DEVICE_NAME ON ON',
                  'DEVICE_NAME ON OFF',
                  'DEVICE_NAME OFF ON',
                  'DEVICE_NAME UNSELECT'
                ]
              }
            }
          }
        },
        generalRules: [
          '所有设备必须在 DEVICE 部分已定义',
          '可以同时控制同类型的多个设备',
          '不能在组操作中混合不同类型的设备（继电器和调光器除外）',
          '百分比值必须在 0-100 之间',
          '设备名称必须在任何操作命令之前定义',
          '操作必须严格遵循每种设备类型指定的格式',
          '命令不区分大小写，但必须匹配指定格式',
          '每条指令必须包含至少一个设备和一个有效操作'
        ]
      },
      // Remote Control Configuration 中文版
      remoteControlConfig: {
        title: '遥控器配置',
        declaration: '设备声明',
        configRules: '按钮/输入配置规则',
        mustStartWith: '必须以 NAME: 开头',
        deviceNamesCanContain: '设备名称可以包含：',
        letters: '字母 (a-z, A-Z)',
        numbers: '数字 (0-9)',
        underscore: '下划线 (_)',
        spaces: '空格',
        deviceTypes: {
          title: '必须在 DEVICE 部分定义为：',
          types: [
            '遥控器类型 (1-6键面板)',
            '5/6路输入模块',
            '4路输出模块'
          ]
        },
        commandFormat: {
          title: '基本格式：',
          format: '[编号]: [命令类型] [目标] [选项]',
          notes: [
            '编号：基于设备类型 (1-6)',
            '命令类型: DEVICE, GROUP, 或 SCENE'
          ]
        },
        commandTypes: {
          device: {
            title: 'DEVICE 命令：',
            standard: {
              title: '标准设备：',
              format: '基本格式：[编号]: DEVICE [设备名称]'
            },
            fan: {
              title: '风扇类型：',
              formats: [
                'DEVICE [设备名称]    (默认操作: FAN)',
                'DEVICE [设备名称] - FAN',
                'DEVICE [设备名称] - LAMP',
                'DEVICE [设备名称] - WHOLE'
              ]
            },
            curtain: {
              title: '窗帘类型：',
              formats: [
                'DEVICE [设备名称]    (默认操作: OPEN)',
                'DEVICE [设备名称] - OPEN',
                'DEVICE [设备名称] - CLOSE',
                'DEVICE [设备名称] - WHOLE'
              ]
            },
            powerPoint: {
              title: '电源点类型(双路）：',
              formats: [
                'DEVICE [设备名称]    (默认操作: WHOLE)',
                'DEVICE [设备名称] - LEFT',
                'DEVICE [设备名称] - RIGHT',
                'DEVICE [设备名称] - WHOLE'
              ]
            },
            outputModule: {
              title: '4路输出模块:',
              formats: [
                'DEVICE [设备名称]    (默认操作: WHOLE)',
                'DEVICE [设备名称] - FIRST',
                'DEVICE [设备名称] - SECOND',
                'DEVICE [设备名称] - THIRD',
                'DEVICE [设备名称] - FOURTH',
                'DEVICE [设备名称] - WHOLE'
              ]
            },
            inputModule: {
              title: '输入模块(5/6路输入):',
              basic: {
                title: '基础设备绑定：',
                format: 'DEVICE [设备名称]    (默认: MOMENTARY)'
              },
              deviceOperation: {
                title: '设备操作：',
                curtain: {
                  title: '窗帘示例：',
                  formats: [
                    'DEVICE [设备名称] - OPEN    (默认: MOMENTARY)',
                    'DEVICE [设备名称] - CLOSE    (默认: MOMENTARY)'
                  ]
                },
                fan: {
                  title: '风扇示例：',
                  formats: [
                    'DEVICE [设备名称] - FAN    (默认: MOMENTARY)',
                    'DEVICE [设备名称] - LAMP    (默认: MOMENTARY)'
                  ]
                }
              },
              inputAction: {
                title: '输入动作：',
                formats: [
                  'DEVICE [设备名称] + TOGGLE',
                  'DEVICE [设备名称] + MOMENTARY    (默认)'
                ]
              },
              combinedOperation: {
                title: '组合操作和输入动作：',
                curtain: {
                  title: '窗帘示例：',
                  formats: [
                    'DEVICE [设备名称] - OPEN + TOGGLE',
                    'DEVICE [设备名称] - CLOSE + MOMENTARY'
                  ]
                },
                fan: {
                  title: '风扇示例：',
                  formats: [
                    'DEVICE [设备名称] - FAN + TOGGLE',
                    'DEVICE [设备名称] - LAMP + MOMENTARY'
                  ]
                }
              }
            }
          },
          group: {
            title: 'GROUP 命令：',
            formats: [
              'GROUP [组名称]'
            ]
          },
          scene: {
            title: 'SCENE 命令：',
            formats: [
              'SCENE [场景名称]'
            ]
          }
        },
        rules: [
          '按钮/输入编号不能超过设备容量：',
          '• 1-6键面板: 1-6个按钮',
          '• 5输入模块: 1-5个输入',
          '• 6输入模块: 1-6个输入',
          '所有引用的设备/组/场景必须存在',
          '每个按钮/输入只能有一个命令',
          '只有输入模块支持 TOGGLE/MOMENTARY 动作',
          '命令必须匹配设备类型功能',
          '输入模块动作 (TOGGLE/MOMENTARY) 使用 \'+\' 符号添加'
        ]
      },
      outputModuleConfig: {
        title: '输出模块配置',
        declaration: '设备声明',
        configRules: '通道配置规则',
        mustStartWith: '必须以 NAME: 开头',
        deviceNamesCanContain: '设备名称可以包含：',
        letters: '字母 (a-z, A-Z)',
        numbers: '数字 (0-9)',
        underscore: '下划线 (_)',
        spaces: '空格',
        deviceTypes: {
          title: '必须在 DEVICE 部分定义为：',
          types: [
            '4路输出模块'
          ]
        },
        channelFormat: {
          title: '通道格式：',
          basic: '[通道号]: [通道名称]',
          withAction: '[通道号]: [通道名称] - [动作]',
          notes: [
            '通道号必须在1到4之间',
            '通道名称不能包含空格',
            '每个通道在每个输出模块中只能使用一次'
          ]
        },
        actions: {
          title: '支持的动作：',
          types: [
            'NORMAL (默认，如未指定)',
            '1SEC (1秒脉冲)',
            '6SEC (6秒脉冲)',
            '9SEC (9秒脉冲)',
            'REVERS (反向操作)'
          ]
        },
        rules: [
          '设备类型必须是"4输出模块"',
          '每个4输出模块必须有唯一的名称',
          '通道号必须在1-4之间',
          '通道名称不能包含空格',
          '每个通道在每个模块中只能使用一次',
          '动作是可选的(默认为NORMAL)',
          '只允许使用支持的动作',
          '命令格式必须准确'
        ]
      },
      remoteParametersConfig: {
        title: '遥控器参数配置',
        declaration: '参数声明',
        configRules: '参数配置规则',
        globalNote: '此配置为全局设置，将影响所有遥控器的默认行为',
        optionalNote: '参数配置为可选项，可以只设置需要修改的参数',
        defaultValues: '默认值：',
        parameters: {
          backlight: {
            title: '背光',
            defaultValue: 'ENABLED',
            values: [
              'BACKLIGHT: ENABLED (启用)',
              'BACKLIGHT: DISABLED (禁用)'
            ]
          },
          backlightColor: {
            title: '背光颜色',
            defaultValue: 'BLUE',
            values: [
              'BACKLIGHT_COLOR: WHITE (白色)',
              'BACKLIGHT_COLOR: GREEN (绿色)',
              'BACKLIGHT_COLOR: BLUE (蓝色)'
            ]
          },
          backlightTimeout: {
            title: '背光超时',
            defaultValue: '1MIN',
            values: [
              'BACKLIGHT_TIMEOUT: 30S (30秒)',
              'BACKLIGHT_TIMEOUT: 1MIN (1分钟)',
              'BACKLIGHT_TIMEOUT: 2MIN (2分钟)',
              'BACKLIGHT_TIMEOUT: 3MIN (3分钟)',
              'BACKLIGHT_TIMEOUT: 5MIN (5分钟)',
              'BACKLIGHT_TIMEOUT: 10MIN (10分钟)',
              'BACKLIGHT_TIMEOUT: NEVER (永不)'
            ]
          },
          beep: {
            title: '蜂鸣器',
            defaultValue: 'ENABLED',
            values: [
              'BEEP: ENABLED (启用)',
              'BEEP: DISABLED (禁用)'
            ]
          },
          nightLight: {
            title: '夜灯',
            defaultValue: 'MEDIUM',
            values: [
              'NIGHT_LIGHT: LOW (低亮度)',
              'NIGHT_LIGHT: MEDIUM (中亮度)',
              'NIGHT_LIGHT: HIGH (高亮度)',
              'NIGHT_LIGHT: DISABLED (禁用)'
            ]
          }
        },
        rules: [
          '每个参数必须使用冒号格式',
          '每行只能设置一个参数',
          '参数不区分大小写',
          '只允许使用支持的参数值',
          '每个参数只能设置一次',
          '未设置的参数将使用默认值',
          '可以只设置需要修改的参数'
        ]
      }
    }
  };