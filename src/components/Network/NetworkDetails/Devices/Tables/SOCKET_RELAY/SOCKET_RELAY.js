// src/components/Network/NetworkDetails/Devices/Tables/SOCKET_RELAY/SOCKET_RELAY.js
import React, { useState, useEffect } from 'react';
import { 
  Typography,
  Tooltip,
  Pagination,
  Chip
} from '@mui/material';
import { 
  Modal,
  ModalBody
} from 'reactstrap';
import BasicTable from '../BasicTable';
import socketRelayIcon from '../../../../../../assets/icons/DeviceType/SOCKET_RELAY.png';
import { DEVICE_CONFIGS } from '../../DeviceConfigs';
import CustomButton from '../../../../../CustomComponents/CustomButton';
import DownloadIcon from '@mui/icons-material/Download';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BrightnessLowIcon from '@mui/icons-material/BrightnessLow';

// 自定义错误日志模态框组件 - 不包含标题栏，只有关闭按钮
const SimpleErrorModal = ({ isOpen, toggle, children }) => {
  return (
    <Modal 
      isOpen={isOpen} 
      toggle={toggle}
      centered
      scrollable
      size="lg"
    >
      <div style={{ position: 'relative' }}>
        {/* 只有关闭按钮，没有标题栏 */}
        <button
          type="button"
          className="close"
          onClick={toggle}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            zIndex: 10,
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#666',
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <ModalBody style={{ paddingTop: '40px' }}>
        {children}
      </ModalBody>
    </Modal>
  );
};

// 错误日志内容组件
const ErrorLogModal = ({ isOpen, toggle, errors }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentChannel, setCurrentChannel] = useState('all');
  const itemsPerPage = 10;

  // 按通道分组错误
  const errorsByChannel = {};
  if (errors && errors.length > 0) {
    errors.forEach(error => {
      const channelKey = error.channel.toString();
      if (!errorsByChannel[channelKey]) {
        errorsByChannel[channelKey] = [];
      }
      errorsByChannel[channelKey].push(error);
    });
  }

  // 获取当前显示的错误
  const getFilteredErrors = () => {
    if (currentChannel === 'all') {
      return errors || [];
    } else {
      return errorsByChannel[currentChannel] || [];
    }
  };

  const filteredErrors = getFilteredErrors();
  const totalPages = Math.ceil(filteredErrors.length / itemsPerPage);
  const currentErrors = filteredErrors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 重置分页当筛选条件改变时
  useEffect(() => {
    setCurrentPage(1);
  }, [currentChannel]);

  // 下载错误日志为TXT文件
  const downloadErrorLogs = () => {
    if (!errors || errors.length === 0) return;

    // 创建TXT内容
    let txtContent = `Socket Relay Error Logs - Generated on ${new Date().toLocaleString()}\n`;
    txtContent += `Total Errors: ${errors.length}\n\n`;
    
    // 按通道分组添加错误
    Object.keys(errorsByChannel).forEach(channelKey => {
      const channelErrors = errorsByChannel[channelKey];
      txtContent += `=== ${DEVICE_CONFIGS.SOCKET_RELAY.helpers.getChannelText(channelKey)} Channel (${channelErrors.length} errors) ===\n\n`;
      
      channelErrors.forEach((error, index) => {
        txtContent += `[Error ${index + 1}]\n`;
        txtContent += `Type: ${DEVICE_CONFIGS.SOCKET_RELAY.helpers.getErrorTypeText(error.errorType)}\n`;
        txtContent += `Description: ${DEVICE_CONFIGS.SOCKET_RELAY.helpers.getErrorDescription(error.errorType)}\n`;
        txtContent += `Value: ${error.value !== undefined ? error.value : '-'}\n`;
        if (error.modifyDate) {
          txtContent += `Last Modified: ${new Date(error.modifyDate).toLocaleString()}\n`;
        }
        txtContent += '\n';
      });
    });

    // 创建Blob并下载
    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `socket_relay_errors_${new Date().toISOString().slice(0, 10)}.txt`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <SimpleErrorModal
      isOpen={isOpen}
      toggle={toggle}
    >
      <div style={{ marginBottom: '20px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '15px',
          borderBottom: '1px solid #eee',
          paddingBottom: '10px',
          paddingRight: '30px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
              {errors?.length || 0} total error{(errors?.length !== 1) ? 's' : ''}
            </Typography>
            
            <div>
              <label htmlFor="channelFilter" style={{ marginRight: '10px' }}>Channel:</label>
              <select 
                id="channelFilter"
                value={currentChannel}
                onChange={(e) => setCurrentChannel(e.target.value)}
                style={{ padding: '5px', borderRadius: '4px', borderColor: '#ddd' }}
              >
                <option value="all">All Channels</option>
                {Object.keys(errorsByChannel).map(channel => (
                  <option key={channel} value={channel}>
                    {DEVICE_CONFIGS.SOCKET_RELAY.helpers.getChannelText(channel)} Channel
                  </option>
                ))}
              </select>
            </div>
          </div>

          <CustomButton
            onClick={downloadErrorLogs}
            icon={<DownloadIcon />}
            style={{
              backgroundColor: '#fbcd0b',
              minWidth: 'auto',
              height: 'auto',
              padding: '6px 12px'
            }}
          >
            Download TXT
          </CustomButton>
        </div>

        {/* 错误日志列表 */}
        {currentErrors.length > 0 ? (
          <div>
            {currentErrors.map((error, index) => (
              <div key={index} style={{ 
                marginBottom: '10px', 
                padding: '10px', 
                backgroundColor: '#f9f9f9',
                borderRadius: '4px',
                borderLeft: '3px solid #fbcd0b'
              }}>
                <div style={{ marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>
                  {DEVICE_CONFIGS.SOCKET_RELAY.helpers.getChannelText(error.channel)} Channel
                </div>
                <div style={{ marginBottom: '5px' }}>
                  <strong>Error Type:</strong> {DEVICE_CONFIGS.SOCKET_RELAY.helpers.getErrorTypeText(error.errorType)}
                </div>
                <div style={{ marginBottom: '5px' }}>
                  <strong>Description:</strong> {DEVICE_CONFIGS.SOCKET_RELAY.helpers.getErrorDescription(error.errorType)}
                </div>
                <div style={{ marginBottom: '5px' }}>
                  <strong>Value:</strong> {error.value !== undefined ? error.value : '-'}
                </div>
                {error.modifyDate && (
                  <div style={{ color: '#666', fontSize: '0.85rem' }}>
                    <strong>Last Modified:</strong> {new Date(error.modifyDate).toLocaleString()}
                  </div>
                )}
              </div>
            ))}

            {/* 分页控件 */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <Pagination 
                  count={totalPages} 
                  page={currentPage}
                  onChange={(_, page) => setCurrentPage(page)}
                  color="primary"
                  size="medium"
                />
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
            {errors && errors.length > 0 
              ? 'No errors match your current filters' 
              : 'No error logs found'}
          </div>
        )}

        {/* 显示当前页信息 */}
        {filteredErrors.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.9rem', color: '#666' }}>
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredErrors.length)} of {filteredErrors.length} errors
          </div>
        )}
      </div>
    </SimpleErrorModal>
  );
};

const SOCKET_RELAYType = ({ devices }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedErrors, setSelectedErrors] = useState([]);

  const handleErrorClick = (errors) => {
    if (errors?.length) {
      setSelectedErrors(errors);
      setDialogOpen(true);
    }
  };

  const columns = [
    {
      id: 'power',
      label: 'Power',
      format: (value) => {
        const isOn = value === 1;
        const color = value === undefined ? '#9e9e9e' : (isOn ? '#4caf50' : '#f44336');
        return (
          <Chip 
            icon={<PowerSettingsNewIcon />}
            label={value === undefined ? '-' : (isOn ? 'ON' : 'OFF')}
            size="small"
            sx={{ 
              backgroundColor: `${color}20`,
              color: color,
              fontWeight: 500,
              '& .MuiChip-icon': { color: color }
            }}
          />
        );
      }
    },
    {
      id: 'pValue',
      label: 'Level',
      format: (value) => {
        if (value === undefined || value === null) return '-';
        const percentage = Math.round((value / 255) * 100);
        return (
          <Chip 
            icon={<BrightnessLowIcon />}
            label={`${percentage}%`}
            size="small"
            sx={{ 
              backgroundColor: '#fbcd0b20',
              color: '#fbcd0b',
              fontWeight: 500,
              '& .MuiChip-icon': { color: '#fbcd0b' }
            }}
          />
        );
      }
    },
    {
      id: 'delay',
      label: 'Delay',
      format: (value) => {
        if (value === undefined || value === null) {
          return (
            <Chip 
              icon={<AccessTimeIcon />}
              label="-"
              size="small"
              sx={{ 
                backgroundColor: '#edf2f7',
                color: '#718096',
                fontWeight: 500,
                '& .MuiChip-icon': { color: '#718096' }
              }}
            />
          );
        }
        return (
          <Chip 
            icon={<AccessTimeIcon />}
            label={`${value} min`}
            size="small"
            sx={{ 
              backgroundColor: '#edf2f7',
              color: '#718096',
              fontWeight: 500,
              '& .MuiChip-icon': { color: '#718096' }
            }}
          />
        );
      }
    },
    {
      id: 'socketErrors',
      label: 'Error Logs',
      format: (value) => {
        const errors = value || [];
        
        if (!errors.length) {
          return (
            <Typography variant="body2" color="textSecondary">
              No Errors
            </Typography>
          );
        }

        return (
          <Tooltip title="Click to view error details" arrow>
            <CustomButton
              onClick={(e) => {
                e.stopPropagation();
                handleErrorClick(errors);
              }}
              style={{
                minWidth: 'auto',
                height: 'auto',
                padding: '4px 8px',
                backgroundColor: '#fbcd0b',
                color: '#FFF',
                fontWeight: 'normal',
                fontSize: '0.75rem'
              }}
            >
              {`${errors.length} Error${errors.length > 1 ? 's' : ''}`}
            </CustomButton>
          </Tooltip>
        );
      }
    }
  ];

  return (
    <>
      <BasicTable
        title="Socket Relay"
        icon={socketRelayIcon}
        devices={devices}
        columns={columns}
        nameColumnWidth="20%"
        enhancedDisplay={false}
      />

      <ErrorLogModal
        isOpen={dialogOpen}
        toggle={() => setDialogOpen(false)}
        errors={selectedErrors}
      />
    </>
  );
};

export default SOCKET_RELAYType;