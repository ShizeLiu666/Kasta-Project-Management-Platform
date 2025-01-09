import { useQuery } from '@tanstack/react-query';
import { axiosInstance, getToken } from '../../../components/auth';
import React from 'react';

// 抽离通用的获取分页数据的函数
const fetchPaginatedData = async (url, networkId) => {
  const token = getToken();
  if (!token) throw new Error("No token found");

  const initialResponse = await axiosInstance.post(url, {
    page: 1,
    size: 1,
    networkId
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const totalSize = initialResponse.data.data.totalElements;
  if (totalSize === 0) return [];

  const fullResponse = await axiosInstance.post(url, {
    page: 1,
    size: totalSize,
    networkId
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return fullResponse.data.data.content;
};

// 抽离获取成员的函数
const fetchMembers = async (networkId) => {
  const token = getToken();
  if (!token) throw new Error("No token found");

      const response = await axiosInstance.get(`/networks/${networkId}/members`, {
        headers: { Authorization: `Bearer ${token}` }
      });

  if (response.data.success) {
    return response.data.data.sort((a, b) => {
      if (a.role === 'OWNER') return -1;
      if (b.role === 'OWNER') return 1;
      return 0;
    });
  }
  throw new Error(response.data.errorMsg || 'Failed to fetch members');
};

// 导出查询函数供预加载使用
export const queryFns = {
  members: (networkId) => fetchMembers(networkId),
  devices: (networkId) => fetchPaginatedData('/devices/list', networkId),
  groups: (networkId) => fetchPaginatedData('/groups/list', networkId),
  scenes: (networkId) => fetchPaginatedData('/scene/list', networkId),
  rooms: (networkId) => fetchPaginatedData('/rooms/list', networkId),
  timers: (networkId) => fetchPaginatedData('/timers/list', networkId),
  schedules: (networkId) => fetchPaginatedData('/schedule/list', networkId)
};

// Hooks
// ** Members **
export const useNetworkMembers = (networkId) => {
  return useQuery({
    queryKey: ['network-members', networkId],
    queryFn: () => queryFns.members(networkId),
    staleTime: 30000,
    cacheTime: 5 * 60 * 1000,
    enabled: !!networkId
  });
};

// ** Devices **
export const useNetworkDevices = (networkId) => {
  return useQuery({
    queryKey: ['network-devices', networkId],
    queryFn: () => queryFns.devices(networkId),
    staleTime: 30000,
    cacheTime: 5 * 60 * 1000,
    enabled: !!networkId
  });
};

// ** Group List **
export const useNetworkGroups = (networkId) => {
  return useQuery({
    queryKey: ['network-groups', networkId],
    queryFn: () => queryFns.groups(networkId),
    staleTime: 30000,
    cacheTime: 5 * 60 * 1000,
    enabled: !!networkId
  });
};

// 特殊的查询（带额外参数的）
// ** Group Devices **
export const useGroupDevices = (networkId, groupId) => {
    return useQuery({
      queryKey: ['group-devices', networkId, groupId],
      queryFn: async () => {
        const token = getToken();
        if (!token) throw new Error("No token found");
  
        const response = await axiosInstance.post('/groups/devices', {
          groupId,
          networkId
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
  
        if (!response.data.success) {
          throw new Error(response.data.errorMsg || 'Failed to fetch group devices');
        }
  
        return response.data.data;
      },
      staleTime: 30000,
      cacheTime: 5 * 60 * 1000,
      enabled: !!groupId
    });
  };

// ** Scene List **
export const useNetworkScenes = (networkId) => {
  return useQuery({
    queryKey: ['network-scenes', networkId],
    queryFn: () => fetchPaginatedData('/scene/list', networkId),
    staleTime: 30000,
    cacheTime: 5 * 60 * 1000,
    enabled: !!networkId
  });
};

// ** Scene Devices **
export const useSceneDevices = (networkId, sceneId) => {
  // 获取网络中的所有设备作为查找表
  const { data: networkDevices = [] } = useNetworkDevices(networkId);
  const devicesMap = React.useMemo(() => {
    return networkDevices.reduce((acc, device) => {
      acc[device.deviceId] = device;
      return acc;
    }, {});
  }, [networkDevices]);

  // 获取场景设备
  const sceneDevicesQuery = useQuery({
    queryKey: ['scene-devices', networkId, sceneId],
    queryFn: async () => {
      const token = getToken();
      if (!token) throw new Error("No token found");

      const response = await axiosInstance.post('/scene/get/items', {
        sceneId,
        networkId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.data.success) {
        throw new Error(response.data.errorMsg || 'Failed to fetch scene devices');
      }

      // 合并设备信息和场景状态
      return response.data.data.map(sceneDevice => ({
        ...sceneDevice,
        deviceInfo: devicesMap[sceneDevice.deviceId] || null,
      }));
    },
    staleTime: 30000,
    cacheTime: 5 * 60 * 1000,
    enabled: !!sceneId && !!networkId
  });

  return sceneDevicesQuery;
};

// ** Room List **
export const useNetworkRooms = (networkId) => {
  return useQuery({
    queryKey: ['network-rooms', networkId],
    queryFn: async () => {
      const token = getToken();
      if (!token) throw new Error("No token found");

      const response = await axiosInstance.post('/rooms/list', {
        networkId,
        page: 1,
        size: 100  // 或者其他合适的大小
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.data.success) {
        throw new Error(response.data.errorMsg || 'Failed to fetch rooms');
      }

      return response.data.data.content;  // 返回 content 数组
    },
    staleTime: 30000,
    cacheTime: 5 * 60 * 1000,
    enabled: !!networkId
  });
};

// ** Room Devices **
export const useRoomDevices = (networkId, roomId) => {
    return useQuery({
      queryKey: ['room-devices', networkId, roomId],
      queryFn: async () => {
        const token = getToken();
        if (!token) throw new Error("No token found");
  
        const response = await axiosInstance.post('/rooms/get/devices', {
          roomId,
          networkId
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
  
        if (!response.data.success) {
          throw new Error(response.data.errorMsg || 'Failed to fetch room devices');
        }
  
        return response.data.data;
      },
      staleTime: 30000,
      cacheTime: 5 * 60 * 1000,
      enabled: !!roomId
    });
  };

// ** Timers **
export const useNetworkTimers = (networkId) => {
  return useQuery({
    queryKey: ['network-timers', networkId],
    queryFn: () => queryFns.timers(networkId),
    staleTime: 30000,
    cacheTime: 5 * 60 * 1000,
    enabled: !!networkId
  });
};

// ** Schedules **
export const useNetworkSchedules = (networkId) => {
  return useQuery({
    queryKey: ['network-schedules', networkId],
    queryFn: () => queryFns.schedules(networkId),
    staleTime: 30000,
    cacheTime: 5 * 60 * 1000,
    enabled: !!networkId
  });
};