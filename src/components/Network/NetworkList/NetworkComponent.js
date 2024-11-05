import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col } from 'reactstrap';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import axiosInstance from '../../../config';
import { getToken } from '../../auth';
import ComponentCard from '../../AuthCodeManagement/ComponentCard';
import CustomButton from '../../CustomButton';
import CreateNetworkModal from './CreateNetworkModal';
import CustomAlert from '../../CustomAlert';
import CustomSearchBar from '../../CustomSearchBar';
import EditIcon from '@mui/icons-material/EditNote';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SendIcon from '@mui/icons-material/Send';
import DeleteNetworkModal from './DeleteNetworkModal';
import SyncIcon from '@mui/icons-material/Sync';
import StarIcon from '@mui/icons-material/Star';
import './NetworkComponent.scss';
import SwitchNetworkModal from './SwitchNetworkModal';
import EditNetworkModal from './EditNetworkModal';

const NetworkComponent = () => {
  const [networks, setNetworks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredNetworks, setFilteredNetworks] = useState([]);
  const [alert, setAlert] = useState({
    isOpen: false,
    message: '',
    severity: 'info',
    duration: 2000
  });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [currentNetworkId, setCurrentNetworkId] = useState(null);
  const [switchModalOpen, setSwitchModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // 获取网络列表并检查当前网络
  const fetchNetworks = async () => {
    try {
      const token = getToken();
      if (!token) {
        setAlert({
          isOpen: true,
          message: "Authentication token not found",
          severity: 'error',
          duration: 2000
        });
        return;
      }

      const response = await axiosInstance.get('/networks', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setNetworks(response.data.data);
        setFilteredNetworks(response.data.data);
        // 设置当前网络
        const currentNetwork = response.data.data.find(network => network.isCurrentNetwork);
        if (currentNetwork) {
          setCurrentNetworkId(currentNetwork.networkId);
        }
      } else {
        setAlert({
          isOpen: true,
          message: response.data.errorMsg || 'Failed to fetch networks',
          severity: 'error',
          duration: 2000
        });
      }
    } catch (err) {
      setAlert({
        isOpen: true,
        message: err.response?.data?.errorMsg || 'Failed to fetch networks',
        severity: 'error',
        duration: 2000
      });
    }
  };

  useEffect(() => {
    fetchNetworks();
  }, []);

  // 修改过滤网络的函数，只搜索 meshName
  const filterNetworks = useCallback((searchValue) => {
    return networks.filter((network) =>
      network.meshName.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [networks]);

  //  networks 或 searchTerm 改变时更新过滤结果
  useEffect(() => {
    setFilteredNetworks(filterNetworks(searchTerm));
  }, [networks, searchTerm, filterNetworks]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // 统一处理成功的回调函数
  const handleOperationSuccess = (message) => {
    setAlert({
      isOpen: true,
      message: message || 'Operation completed successfully',
      severity: 'success',
      duration: 2000
    });
    setTimeout(() => {
      fetchNetworks();  // 延迟执行 fetchNetworks
    }, 100);  // 添加小延迟
  };

  // 使用统一的处理函数
  const handleCreateSuccess = (message) => {
    handleOperationSuccess(message);
  };

  const handleEditClick = (network) => {
    setSelectedNetwork(network);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (network) => {
    setSelectedNetwork(network);
    setDeleteModalOpen(true);
  };

  const handleInviteClick = (network) => {
    console.log('Send invite to network:', network);
  };

  // 修改删除成功的处理函数
  const handleDeleteSuccess = (message) => {
    handleOperationSuccess(message);
  };

  // 处理切换网络
  const handleSwitchClick = (network) => {
    setSelectedNetwork(network);
    setSwitchModalOpen(true);
  };

  // 处理切换成功
  const handleSwitchSuccess = (message) => {
    handleOperationSuccess(message);
  };

  // 处理行点击事件
  const handleRowClick = (event, network) => {
    // 检查是否正在选择文本
    const isSelectingText = window.getSelection().toString().length > 0;
    // 检查是否点击了操作按钮区域
    const isActionCell = event.target.closest('.actions-cell');
    
    // 如果不是选择文本且不是点击操作按钮，则触发登录
    if (!isSelectingText && !isActionCell) {
      console.log('Login to network:', network);
      // TODO: 实现登录逻辑
    }
  };

  return (
    <div>
      <CustomAlert
        isOpen={alert.isOpen}
        onClose={() => setAlert(prev => ({ ...prev, isOpen: false }))}
        message={alert.message}
        severity={alert.severity}
      />
      <Row>
        <Col md="12">
          <ComponentCard title="Network Management">
            <div className="d-flex justify-content-between mb-3">
              <CustomSearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                placeholder="Search Network Name..."
                width="300px"
                showBorder={true}
                onFilter={(value) => {
                  const filtered = filterNetworks(value);
                  setFilteredNetworks(filtered);
                }}
              />
              <CustomButton
                type="create"
                onClick={() => setIsModalOpen(true)}
                style={{ marginLeft: 'auto' }}
              >
                Create Network
              </CustomButton>
            </div>

            <TableContainer
              component={Paper}
              sx={{
                boxShadow: 'none',  // 移除阴影
                border: '1px solid #dee2e6'  // 可选：添加简单边框
              }}
            >
              <Table
                className="network-table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Network Name</TableCell>
                    <TableCell>Network ID</TableCell>
                    <TableCell>Passphrase</TableCell>
                    <TableCell sx={{ width: '250px' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredNetworks.map((network) => (
                    <TableRow
                      key={network.networkId}
                      className="network-row"
                      onClick={(e) => handleRowClick(e, network)}
                      sx={{
                        backgroundColor: network.isCurrentNetwork ? '#f8f9fa' : 'inherit',
                        '&:hover': {
                          backgroundColor: '#f0f0f0',
                          cursor: 'pointer',
                        },
                      }}
                    >
                      <TableCell className="selectable-text">
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          {network.meshName}
                          {network.isCurrentNetwork && (
                            <StarIcon sx={{ 
                              color: '#ffc107',
                              marginLeft: '8px',
                              fontSize: '20px'
                            }} />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="selectable-text">
                        {network.networkId}
                      </TableCell>
                      <TableCell className="selectable-text">
                        {network.passphrase}
                      </TableCell>
                      <TableCell className="actions-cell">
                        <div className="d-flex">
                          <Button
                            startIcon={<SyncIcon />}
                            onClick={() => !network.isCurrentNetwork && handleSwitchClick(network)}
                            sx={{
                              color: network.isCurrentNetwork ? '#ccc' : '#6c757d',
                              textTransform: 'none',
                              '&:hover': { 
                                backgroundColor: 'transparent',
                                cursor: network.isCurrentNetwork ? 'not-allowed' : 'pointer'
                              },
                              marginRight: '10px',
                              pointerEvents: network.isCurrentNetwork ? 'none' : 'auto'
                            }}
                            disabled={network.isCurrentNetwork}
                          >
                            Switch
                          </Button>
                          <Button
                            startIcon={<SendIcon />}
                            onClick={() => handleInviteClick(network)}
                            sx={{
                              color: '#28a745',
                              textTransform: 'none',
                              '&:hover': { backgroundColor: 'transparent' },
                              marginRight: '10px'
                            }}
                          >
                            Invite
                          </Button>
                          <Button
                            startIcon={<EditIcon />}
                            onClick={() => handleEditClick(network)}
                            sx={{
                              color: '#007bff',
                              textTransform: 'none',
                              '&:hover': { backgroundColor: 'transparent' },
                              marginRight: '10px'
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            startIcon={<DeleteForeverIcon />}
                            onClick={() => handleDeleteClick(network)}
                            sx={{
                              color: '#dc3545',
                              textTransform: 'none',
                              '&:hover': { backgroundColor: 'transparent' }
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </ComponentCard>
        </Col>

        <CreateNetworkModal
          isOpen={isModalOpen}
          toggle={toggleModal}
          onSuccess={handleCreateSuccess}
          currentNetworkId={currentNetworkId}
        />

        <DeleteNetworkModal
          isOpen={deleteModalOpen}
          toggle={() => {
            setDeleteModalOpen(false);
            setSelectedNetwork(null);
          }}
          network={selectedNetwork}
          onDelete={handleDeleteSuccess}
        />

        <SwitchNetworkModal
          isOpen={switchModalOpen}
          toggle={() => {
            setSwitchModalOpen(false);
            setSelectedNetwork(null);
          }}
          network={selectedNetwork}
          currentNetworkId={currentNetworkId}
          onSuccess={handleSwitchSuccess}
        />

        <EditNetworkModal
          isOpen={editModalOpen}
          toggle={() => {
            setEditModalOpen(false);
            setSelectedNetwork(null);
          }}
          network={selectedNetwork}
          onSuccess={handleOperationSuccess}
        />
      </Row>
    </div>
  );
};

export default NetworkComponent;