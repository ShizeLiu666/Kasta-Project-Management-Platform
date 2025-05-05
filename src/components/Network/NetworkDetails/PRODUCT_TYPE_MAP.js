export const PRODUCT_TYPE_MAP = {
    // 1. FAN (风扇)
    'tb7prezu': 'FAN',
    
    // 2. RGB_CW (RGB调色温灯)
    'clniiasn': 'RGB_CW',
    
    // 3. CCT_DOWNLIGHT (色温筒灯)
    'myfiewpc': 'CCT_DOWNLIGHT',
    
    // 4. DIMMER (调光器)
    '5atdh35u': 'DIMMER',
    
    // ToDo 5. SOCKET_RELAY (继电器插座)  !!! 有派生 ~
    'k8tngzhj': 'SOCKET_RELAY',
    
    // 6. SOCKET_SWITCH (开关) - ok
    'ay5nnjdm': 'SOCKET_SWITCH',

    // 7. THERMOSTAT (恒温器)
    'fphjf3jj': 'THERMOSTAT',
    
    // 8. POWER_POINT (电源插座)
    'xdddhvid': 'POWER_POINT',
    
    // 9. DAYLIGHT_SENSOR (日光传感器) - ok
    'opz0gj1q': 'DAYLIGHT_SENSOR',
    
    // 10. CURTAIN (窗帘) - ok
    'ldiuak9c': 'CURTAIN',
    
    // 11. DRY_CONTACT (干接点) - ok
    'zphgv5n9': 'DRY_CONTACT',
    
    // 12. VCAL_SOCKET (VCAL插座) - 竖版插座 半ppt 一个空位
    '7doxadh6': 'VCAL_SOCKET',
    
    // // 13. T3_SWITCH (三键开关) Ignore it for now
    'acqhrjul': 'T3_SWITCH',
    
    // // 14. T3_DIMMER (三键调光器) Ignore it for now
    'fybufemo': 'T3_DIMMER',
    
    // toDo 15.PANGU - ok !!! 有派生 - sub_devices ~
    'eexc6xorj65omqap': 'PANGU',
    
    // ToDO 16. TOUCH_PANEL (触摸面板) - 动态 icon 根据参数 !!! 有派生 ~
    'skr8wl4o': 'TOUCH_PANEL',
    
    // ToDO 17. RB02 (遥控器) - 220 v / 电磁的 !!! 有派生 ~
    'ng8eledm': 'RB02',
    
    // ToDO 18. FIVE_BUTTON (五键开关) !!! 有派生 ~
    'ng8eledm5': 'FIVE_BUTTON',
    
    // ToDO 19. FIVE_INPUT (五路输入) !!! 有派生 - SignalInputBind ~
    'ng8eledmi5': 'FIVE_INPUT',
    
    // ToDo  20. PIR - ok !!! 有派生 - SignalInputBind 两个按钮 ~
    'p9ms1caa': 'PIR',
    
    // 21. MULTIVUE 
    'ng8eledv5': 'MULTIVUE',
    
    // ToDO 22. SIX_INPUT_FOUR_OUTPUT (六进四出) - 动态 icon 根据参数 ~
    '5ozdgdrd': 'SIX_INPUT_FOUR_OUTPUT',
    
    // 23. SOCKET_DIMMER (插座调光器)
    'bofkqirg': 'SOCKET_DIMMER',
};

// 在控制台中运行
// console.log(Object.entries(PRODUCT_TYPE_MAP).filter(([_, value]) => value === 'T3_SWITCH').map(([key]) => key));