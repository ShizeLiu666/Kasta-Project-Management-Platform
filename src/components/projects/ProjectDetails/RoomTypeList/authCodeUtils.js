import axiosInstance from '../../../../config';

/**
 * 获取超级用户的所有有效授权码
 * @param {string} token - 用户认证token
 * @returns {Promise<Array>} 处理后的授权码数组
 */
const fetchSuperUserAuthCodes = async (token) => {
  const response = await axiosInstance.get('/authorization-codes', {
    headers: { Authorization: `Bearer ${token}` },
    params: { page: 0, size: 1000 },
  });

  if (!response.data.success) {
    throw new Error(response.data.errorMsg || 'Failed to fetch auth codes');
  }

  return response.data.data.content
    .filter(code => 
      code.valid === true &&
      code.configUploadCount < 10 &&
      code.configRoomId === null &&
      code.usedBy === null
    )
    .map(code => ({
      code: code.code,
      label: code.code,
      value: code.code,
      description: `(${10 - code.configUploadCount} uploads left)`,
      configUploadCount: code.configUploadCount,
      commissionCount: code.commissionCount
    }));
};

/**
 * 获取普通用户的项目相关授权码
 * @param {string} token - 用户认证token
 * @param {string} currentUsername - 当前用户名
 * @returns {Promise<Array>} 处理后的授权码数组
 */
const fetchProjectRoomCodes = async (token, currentUsername) => {
  // 先获取总数
  const initialResponse = await axiosInstance.get('/authorization-codes/project-room-code', {
    headers: { Authorization: `Bearer ${token}` },
    params: { page: 0, size: 1 },
  });

  if (!initialResponse.data.success) {
    throw new Error(initialResponse.data.errorMsg || 'Failed to fetch initial auth codes');
  }

  const totalElements = initialResponse.data.data.totalElements;

  // 获取所有数据
  const fullResponse = await axiosInstance.get('/authorization-codes/project-room-code', {
    headers: { Authorization: `Bearer ${token}` },
    params: { page: 0, size: totalElements },
  });

  if (!fullResponse.data.success) {
    throw new Error(fullResponse.data.errorMsg || 'Failed to fetch auth codes');
  }

  return fullResponse.data.data.content
    .filter(code => 
      code.valid === true &&
      code.configUploadCount < 10 &&
      code.configRoomId === null &&
      code.usedBy === currentUsername
    )
    .map(code => ({
      code: code.code,
      label: code.code,
      value: code.code,
      description: `(${10 - code.configUploadCount} uploads left)`,
      configUploadCount: code.configUploadCount,
      commissionCount: code.commissionCount
    }));
};

/**
 * 统一的授权码获取接口
 * @param {Object} params - 参数对象
 * @param {string} params.token - 用户认证token
 * @param {boolean} params.isSuperUser - 是否是超级用户
 * @param {string} params.currentUsername - 当前用户名
 * @param {Function} params.onSuccess - 成功回调函数
 * @param {Function} params.onError - 错误回调函数
 */
export const fetchAuthCodes = async ({
  token,
  isSuperUser,
  currentUsername,
  onSuccess,
  onError
}) => {
  try {
    const codes = isSuperUser 
      ? await fetchSuperUserAuthCodes(token)
      : await fetchProjectRoomCodes(token, currentUsername);
    
    onSuccess?.(codes);
    return codes;
  } catch (error) {
    console.error('Error fetching auth codes:', error);
    onError?.(error.message || 'Failed to fetch authorization codes');
    throw error;
  }
};

/**
 * 获取当前用户信息
 * @returns {Object} 用户信息对象
 */
export const getCurrentUserInfo = () => {
  const userDetails = JSON.parse(localStorage.getItem('userDetails') || '{}');
  return {
    isSuperUser: userDetails.userType === 99999,
    currentUsername: userDetails.username || ''
  };
};