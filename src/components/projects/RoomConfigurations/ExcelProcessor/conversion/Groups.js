import { getDeviceNameToAppearanceShortname } from './Devices';

export function processGroups(splitData) {
    const groupsContent = splitData.groups || [];
    const groupsData = [];
    let currentGroupName = null;
    let currentDevices = [];

    groupsContent.forEach(line => {
        line = line.trim();

        if (line.startsWith("NAME:")) {
            if (currentGroupName) {
                groupsData.push({
                    groupName: currentGroupName,
                    devices: currentDevices
                });
                currentDevices = [];
            }
            currentGroupName = line.replace("NAME:", "").trim();
        } else if (currentGroupName) {
            line = line.replace(/CONTROL CONTENT:|DEVICE CONTENT:|DEVICE CONTROL:/g, '').trim();
            const devices = line.split(',')
                                .map(device => device.trim())
                                .filter(device => device);
            
            devices.forEach(deviceName => {
                currentDevices.push({
                    appearanceShortname: getDeviceNameToAppearanceShortname()[deviceName] || '',
                    deviceName: deviceName
                });
            });
        }
    });

    // 添加最后一个组
    if (currentGroupName) {
        groupsData.push({
            groupName: currentGroupName,
            devices: currentDevices
        });
    }

    return { groups: groupsData };
}