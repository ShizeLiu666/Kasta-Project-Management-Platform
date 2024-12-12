import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../../auth';
import FanType from './Tables/FanType';

const DeviceList = ({ networkId }) => {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        // 第一次请求获取总数据量
        const url = '/devices/list';
        const initialResponse = await axiosInstance.post(url, {
          page: 1,
          size: 1,
          networkId: networkId
        });
        
        const initialData = initialResponse.data;
        const totalSize = initialData.data.totalElements;
        
        // 第二次请求获取所有数据
        const fullResponse = await axiosInstance.post(url, {
          page: 1,
          size: totalSize,
          networkId: networkId
        });
        
        const fullData = fullResponse.data;
        setDevices(fullData.data.content);
      } catch (error) {
        console.error('Failed to fetch devices:', error);
      }
    };

    if (networkId) {
      fetchDevices();
    }
  }, [networkId]);

  // Group devices by type
  const devicesByType = devices.reduce((acc, device) => {
    const type = device.deviceType;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(device);
    return acc;
  }, {});

  return (
    <>
      {devicesByType['FAN'] && devicesByType['FAN'].length > 0 && (
        <FanType devices={devicesByType['FAN']} />
      )}
      {/* 在这里可以添加其他设备类型的表格组件 */}
    </>
  );
};

export default DeviceList;
