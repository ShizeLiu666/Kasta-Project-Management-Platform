import React, { useState } from 'react';
import { 
  Typography,
  Box,
  Chip,
  Tooltip,
  Pagination
} from '@mui/material';
import { 
  Modal,
  ModalBody
} from 'reactstrap';
import BasicTable from '../BasicTable';
import panguIcon from '../../../../../../assets/icons/DeviceType/PANGU.png';
import { DEVICE_CONFIGS } from '../../DeviceConfigs';
import CustomButton from '../../../../../CustomComponents/CustomButton';

// 简化的子设备模态框组件 - 没有标题栏，只有关闭按钮
const SimpleSubDevicesModal = ({ isOpen, toggle, children }) => {
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
            zIndex: 1,
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

// 子设备对话框组件 - 重新设计为类似 ErrorLogModal
const SubDevicesDialog = ({ isOpen, toggle, subDevices }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 获取当前显示的子设备 - 简化为直接使用所有子设备
  const filteredDevices = subDevices || [];
  const totalPages = Math.ceil(filteredDevices.length / itemsPerPage);
  const currentDevices = filteredDevices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <SimpleSubDevicesModal
      isOpen={isOpen}
      toggle={toggle}
    >
      <div style={{ marginBottom: '20px' }}>
        {/* 在内容顶部显示设备数量 */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '15px',
          borderBottom: '1px solid #eee',
          paddingBottom: '10px'
        }}>
          <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
            {subDevices?.length || 0} total device{(subDevices?.length !== 1) ? 's' : ''}
          </Typography>
        </div>

        {/* 子设备列表 */}
        {currentDevices.length > 0 ? (
          <div>
            {currentDevices.map((device, index) => (
              <div key={device.sendDeviceId || index} style={{ 
                marginBottom: '10px', 
                padding: '10px', 
                backgroundColor: '#f9f9f9',
                borderRadius: '4px',
                borderLeft: `3px solid ${device.isAuth === 1 ? '#4caf50' : '#ff9800'}`
              }}>
                <div style={{ marginBottom: '5px' }}>
                  <strong>Send Device ID:</strong> {device.sendDeviceId}
                </div>
                <div style={{ marginBottom: '5px' }}>
                  <strong>Send DID:</strong> {device.sendDid}
                </div>
                <div>
                  <Chip 
                    label={device.isAuth === 1 ? "Authorized" : "Unauthorized"} 
                    size="small" 
                    color={device.isAuth === 1 ? "success" : "warning"}
                  />
                </div>
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
          <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f5f5f9', borderRadius: '4px' }}>
            No sub devices found
          </div>
        )}

        {/* 显示当前页信息 */}
        {filteredDevices.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.9rem', color: '#666' }}>
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredDevices.length)} of {filteredDevices.length} devices
          </div>
        )}
      </div>
    </SimpleSubDevicesModal>
  );
};

// 连接状态详情组件
const ConnectionStateDetails = ({ connectState }) => {
  const details = DEVICE_CONFIGS.PANGU?.helpers?.getConnectionDetails?.(connectState) || {};
  
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
      <Chip 
        label="WiFi" 
        size="small" 
        color={details.wifi ? "success" : "default"}
        variant={details.wifi ? "filled" : "outlined"}
      />
      <Chip 
        label="Ethernet" 
        size="small" 
        color={details.ethernet ? "success" : "default"}
        variant={details.ethernet ? "filled" : "outlined"}
      />
      <Chip 
        label="Internet" 
        size="small" 
        color={details.internet ? "success" : "default"}
        variant={details.internet ? "filled" : "outlined"}
      />
      <Chip 
        label="Kasta Cloud" 
        size="small" 
        color={details.kastaCloud ? "success" : "default"}
        variant={details.kastaCloud ? "filled" : "outlined"}
      />
    </Box>
  );
};

const PANGUType = ({ devices }) => {
  // 预处理设备数据，将嵌套属性提取到顶层
  const processedDevices = devices.map(device => ({
    ...device,
    connectState: device.specificAttributes?.connectState,
    subDevices: device.specificAttributes?.subDevices || []
  }));
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSubDevices, setSelectedSubDevices] = useState([]);

  const handleSubDevicesClick = (subDevices) => {
    if (subDevices?.length) {
      setSelectedSubDevices(subDevices);
      setDialogOpen(true);
    }
  };

  const columns = [
    {
      id: 'connectState',
      label: 'Connection',
      format: (value) => <ConnectionStateDetails connectState={value} />
    },
    {
      id: 'subDevices',
      label: 'Sub Devices',
      format: (subDevices = []) => {
        if (!subDevices.length) {
          return (
            <Typography variant="body2" color="textSecondary">
              No Devices
            </Typography>
          );
        }

        return (
          <Tooltip title="Click to view sub devices" arrow>
            <CustomButton
              onClick={(e) => {
                e.stopPropagation();
                handleSubDevicesClick(subDevices);
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
              {`${subDevices.length} Device${subDevices.length > 1 ? 's' : ''}`}
            </CustomButton>
          </Tooltip>
        );
      }
    }
  ];

  return (
    <>
      <BasicTable
        title={`PanGu Gateway (${devices.length} devices)`}
        icon={panguIcon}
        devices={processedDevices}  // 使用预处理后的设备数据
        columns={columns}
        nameColumnWidth="40%"
      />

      {/* 添加调试信息 */}
      {devices.length === 0 && (
        <Typography color="error" sx={{ mt: 2 }}>
          No PANGU devices found. Check console for details.
        </Typography>
      )}

      <SubDevicesDialog
        isOpen={dialogOpen}
        toggle={() => setDialogOpen(false)}
        subDevices={selectedSubDevices}
      />
    </>
  );
};

export default PANGUType; 