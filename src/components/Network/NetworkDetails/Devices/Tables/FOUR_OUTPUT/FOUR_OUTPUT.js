import React, { useMemo, useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Tooltip
} from '@mui/material';
import { useNetworkDevices, useNetworkGroups } from '../../../../NetworkDetails/useNetworkQueries';
import { PRODUCT_TYPE_MAP } from '../../../../NetworkDetails/PRODUCT_TYPE_MAP';
import VirtualDryContacts from './VirtualDryContacts';
import AutomationRules from '../SIX_INPUT/AutomationRules';

// 复用相同的工具函数
const TruncatedText = ({ text, maxLength = 20 }) => {
  const truncatedText = text?.length > maxLength
    ? `${text.substring(0, maxLength)}...`
    : text || '-';

  return (
    <Tooltip
      title={text || '-'}
      placement="top"
      arrow
      sx={{
        tooltip: {
          backgroundColor: '#333',
          fontSize: '0.875rem',
          padding: '8px 12px',
          maxWidth: 'none'
        },
        arrow: {
          color: '#333'
        }
      }}
    >
      <span style={{
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        display: 'block'
      }}>
        {truncatedText}
      </span>
    </Tooltip>
  );
};

const FOUR_OUTPUT = ({ devices, networkId }) => {
  const [selectedDevice, setSelectedDevice] = useState(null);
  
  // 使用 options 获取数据
  const { data: allDevices = [] } = useNetworkDevices(networkId, {
    enabled: !!networkId,
    staleTime: 30000,
    cacheTime: 60000
  });
  const { data: allGroups = [] } = useNetworkGroups(networkId, {
    enabled: !!networkId,
    staleTime: 30000,
    cacheTime: 60000
  });

  // 创建设备和组的映射
  const deviceMap = useMemo(() => {
    if (!allDevices?.length) return {};
    return allDevices.reduce((acc, device) => {
      acc[String(device.did)] = device.name;
      return acc;
    }, {});
  }, [allDevices]);

  const groupMap = useMemo(() => {
    if (!allGroups?.length) return {};
    return allGroups.reduce((acc, group) => {
      acc[group.groupId] = group.name;
      return acc;
    }, {});
  }, [allGroups]);

  // 预处理设备数据
  const processedDevices = useMemo(() => {
    if (!devices?.length) return [];
    
    return devices.map(device => {
      const specificAttributes = device.specificAttributes || {};
      let virtualDryContacts = specificAttributes.virtualDryContacts || [];
      let automts = specificAttributes.automts || [];
      
      if (typeof virtualDryContacts === 'string') {
        try {
          virtualDryContacts = JSON.parse(virtualDryContacts);
        } catch (e) {
          console.error('Failed to parse virtualDryContacts string:', e);
          virtualDryContacts = [];
        }
      }
      
      if (typeof automts === 'string') {
        try {
          automts = JSON.parse(automts);
        } catch (e) {
          console.error('Failed to parse automts string:', e);
          automts = [];
        }
      }

      return {
        ...device,
        specificAttributes: {
          ...specificAttributes,
          virtualDryContacts,
          automts
        }
      };
    });
  }, [devices]);

  // 获取干接点信息
  const getContactInfo = React.useCallback((device, contactIndex) => {
    const contacts = device.specificAttributes?.virtualDryContacts || [];
    return contacts.find(contact => Number(contact.hole) === contactIndex) || null;
  }, []);

  // 检查是否有任何设备配置了特定干接点
  const anyDeviceHasContact = React.useCallback((contactIndex) => {
    return processedDevices.some(device => {
      const contacts = device.specificAttributes?.virtualDryContacts || [];
      return contacts.some(c => Number(c.hole) === contactIndex);
    });
  }, [processedDevices]);

  // 渲染干接点信息
  const renderContactInfo = React.useCallback((contact) => {
    if (!contact) {
      return (
        <Box sx={{ 
          padding: '12px',
          borderRadius: 1.5,
          bgcolor: '#f8f9fa',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          height: '260px', // 调整内部容器高度
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden' // 防止内容溢出
        }}>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ opacity: 0.7, fontStyle: 'italic' }}
          >
            No Contact
          </Typography>
        </Box>
      );
    }

    return (
      <Box sx={{ 
        padding: '12px',
        borderRadius: 1.5,
        bgcolor: '#f8f9fa',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        height: '260px', // 调整内部容器高度
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden' // 防止内容溢出
      }}>
        {/* Contact Name */}
        <Box sx={{ width: '100%', textAlign: 'center' }}>
          <Typography
            variant="body2"
            component="div"
            sx={{
              color: '#2c3e50',
              fontWeight: 600,
              fontSize: '0.875rem'
            }}
          >
            <TruncatedText text={contact.virtualName} maxLength={20} />
          </Typography>
        </Box>

        {/* Status */}
        <Box sx={{ 
          textAlign: 'center', 
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px'
        }}>
          <Typography 
            variant="caption" 
            sx={{
              color: '#95a5a6',
              fontSize: '0.7rem'
            }}
          >
            Status
          </Typography>
          <Chip
            label={contact.onOff ? "ON" : "OFF"}
            size="small"
            color={contact.onOff ? "success" : "error"}
            sx={{
              alignSelf: 'center',
              height: 20,
              '& .MuiChip-label': { 
                fontSize: '0.75rem', 
                fontWeight: 500 
              }
            }}
          />
        </Box>
      </Box>
    );
  }, []);

  // 当用户点击设备行时选择设备
  const handleSelectDevice = (device) => {
    setSelectedDevice(device);
  };

  useEffect(() => {
    // 初始化时选择第一个设备
    if (processedDevices?.length > 0 && !selectedDevice) {
      setSelectedDevice(processedDevices[0]);
    }
  }, [processedDevices, selectedDevice]);

  if (!processedDevices || processedDevices.length === 0) return null;

  return (
    <Box sx={{ mb: 4 }}>
      {/* 标题部分 */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <img
          src={require('../../../../../../assets/icons/DeviceType/FOUR_OUTPUT.png')}
          alt="4-Output Device"
          style={{ width: 30, height: 30, marginRight: 12 }}
        />
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          4-Output Device
        </Typography>
        <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
          ({processedDevices.length} {processedDevices.length === 1 ? 'device' : 'devices'})
        </Typography>
      </Box>

      {/* 三栏并排布局：Output Channels | Virtual Dry Contacts | Automation Rules */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        {/* 1. 左侧表格 - Output Channels */}
        <Box sx={{ width: '50%', height: '369px', overflow: 'hidden' }}> {/* 强制高度并隐藏溢出 */}
          <TableContainer
            component={Paper}
            elevation={0}
            variant="outlined"
            sx={{
              borderRadius: 2,
              overflow: 'hidden',
              borderColor: 'rgba(224, 224, 224, 0.7)',
              height: '369px', // 强制表格容器高度
              maxHeight: '369px' // 确保不超过
            }}
          >
            <Table size="medium" sx={{ tableLayout: 'fixed' }}>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                  <TableCell
                    width="30%"
                    sx={{
                      borderBottom: '1px solid rgba(224, 224, 224, 0.7)',
                      fontWeight: 500,
                      padding: '8px 16px' // 减少padding
                    }}
                  >
                    Device
                  </TableCell>
                  <TableCell
                    colSpan={4}
                    align="center"
                    width="70%"
                    sx={{
                      borderBottom: '1px solid rgba(224, 224, 224, 0.7)',
                      fontWeight: 500,
                      padding: '8px 16px' // 减少padding
                    }}
                  >
                    Output Channels
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell sx={{ padding: '8px 16px', borderBottom: '1px solid rgba(224, 224, 224, 0.3)' }}></TableCell>
                  {[1, 2, 3, 4].map(contactIndex => {
                    const hasContact = anyDeviceHasContact(contactIndex);
                    return (
                      <TableCell
                        key={contactIndex}
                        align="center"
                        sx={{
                          padding: '8px',
                          borderBottom: '1px solid rgba(224, 224, 224, 0.3)'
                        }}
                      >
                        <Chip
                          label={`Output ${contactIndex}`}
                          size="small"
                          sx={{
                            bgcolor: hasContact ? '#fbcd0b' : '#9e9e9e',
                            color: '#ffffff',
                            fontWeight: 500,
                            padding: '0 2px'
                          }}
                        />
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableHead>

              <TableBody>
                {processedDevices.map((device, deviceIndex) => (
                  <TableRow
                    key={device.deviceId}
                    sx={{ 
                      bgcolor: 'white',
                      cursor: 'pointer',
                      height: '276.5px' // 控制行高
                    }}
                    onClick={() => handleSelectDevice(device)}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{
                        padding: '8px 16px',
                        borderBottom: deviceIndex === processedDevices.length - 1 ? 'none' : '1px solid rgba(224, 224, 224, 0.2)',
                        height: '276.5px' // 控制单元格高度
                      }}
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {device.name}
                          <Typography
                            component="span"
                            variant="body2"
                            sx={{ color: '#95a5a6', ml: 0.5, fontWeight: 400 }}
                          >
                            - {device.deviceId}
                          </Typography>
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {device.appearanceShortname}
                        </Typography>
                      </Box>
                    </TableCell>

                    {[1, 2, 3, 4].map(contactIndex => {
                      const contact = getContactInfo(device, contactIndex);
                      return (
                        <TableCell
                          key={contactIndex}
                          align="center"
                          sx={{
                            padding: '8px', // 减少padding
                            width: `${70 / 4}%`,
                            height: '276.5px', // 控制单元格高度
                            maxHeight: '276.5px', // 确保不超过
                            borderBottom: deviceIndex === processedDevices.length - 1 ? 'none' : '1px solid rgba(224, 224, 224, 0.2)',
                            overflow: 'hidden' // 防止内容溢出
                          }}
                        >
                          {renderContactInfo(contact)}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* 2. 中间区域 - Virtual Dry Contacts */}
        <Box sx={{ width: '25%', height: '369px', overflow: 'hidden' }}> {/* 强制高度并隐藏溢出 */}
          {selectedDevice && (
            <Paper
              elevation={0}
              variant="outlined"
              sx={{
                borderRadius: 2,
                overflow: 'hidden',
                borderColor: 'rgba(224, 224, 224, 0.7)',
                bgcolor: '#ffffff',
                height: '369px', // 固定高度
                maxHeight: '369px' // 确保不超过
              }}
            >
              <Box sx={{
                bgcolor: '#f5f5f5',
                p: 1.5,
                borderBottom: '1px solid rgba(224, 224, 224, 0.7)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  Virtual Dry Contacts
                </Typography>
              </Box>
              <Box sx={{ 
                height: 'calc(369px - 52px)', 
                maxHeight: 'calc(369px - 52px)', 
                overflow: 'auto' // 内容溢出时显示滚动条
              }}>
                <VirtualDryContacts
                  device={selectedDevice}
                />
              </Box>
            </Paper>
          )}
        </Box>

        {/* 3. 右侧区域 - Automation Rules */}
        <Box sx={{ width: '25%', height: '369px', overflow: 'hidden' }}> {/* 强制高度并隐藏溢出 */}
          {selectedDevice && (
            <Paper
              elevation={0}
              variant="outlined"
              sx={{
                borderRadius: 2,
                overflow: 'hidden',
                borderColor: 'rgba(224, 224, 224, 0.7)',
                bgcolor: '#ffffff',
                height: '369px', // 固定高度
                maxHeight: '369px' // 确保不超过
              }}
            >
              <Box sx={{
                bgcolor: '#f5f5f5',
                p: 1.5,
                borderBottom: '1px solid rgba(224, 224, 224, 0.7)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  Automation Rules
                </Typography>
              </Box>
              <Box sx={{ 
                height: 'calc(369px - 52px)', 
                maxHeight: 'calc(369px - 52px)', 
                overflow: 'auto' // 内容溢出时显示滚动条
              }}>
                <AutomationRules
                  device={selectedDevice}
                  deviceMap={deviceMap}
                  groupMap={groupMap}
                />
              </Box>
            </Paper>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default FOUR_OUTPUT; 