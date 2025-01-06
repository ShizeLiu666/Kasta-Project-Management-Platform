import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
// import Button from '@mui/material/Button';
import axiosInstance from '../../../config';
import { getToken } from '../../auth';
import ComponentCard from '../../CustomComponents/ComponentCard';
// import CustomButton from '../../CustomButton';
import CreateNetworkModal from './CreateNetworkModal';
import CustomAlert from '../../CustomComponents/CustomAlert';
import CustomSearchBar from '../../CustomComponents/CustomSearchBar';
// import EditIcon from '@mui/icons-material/EditNote';
// import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
// import SendIcon from '@mui/icons-material/Send';
import DeleteNetworkModal from './DeleteNetworkModal';
// import StarIcon from '@mui/icons-material/Star';
import './NetworkComponent.scss';
import SwitchNetworkModal from './SwitchNetworkModal';
import EditNetworkModal from './EditNetworkModal';
import NetworkDetails from '../NetworkDetails/NetworkDetails';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
// import RefreshIcon from '@mui/icons-material/Refresh';
import RefreshButton from '../../CustomComponents/RefreshButton';
import TablePagination from '@mui/material/TablePagination';
import { Typography } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { queryFns } from '../NetworkDetails/useNetworkQueries';
import CustomLoading from '../../../components/CustomComponents/CustomLoading';

// 创建 QueryClient 实例
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

// 修改日期格式化函数
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);

  // 检查日期是否有效
  if (isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(date);
};

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
  const [showNetworkDetails, setShowNetworkDetails] = useState(false);
  const [activeNetwork, setActiveNetwork] = useState(null);
  const [orderDirection, setOrderDirection] = useState('desc');
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isNetworkLoading, setIsNetworkLoading] = useState(false);

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

      console.log('GET /networks Response:', {
        success: response.data.success,
        data: response.data.data,
        errorMsg: response.data.errorMsg,
        errorCode: response.data.errorCode
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

  // const handleEditClick = (network) => {
  //   setSelectedNetwork(network);
  //   setEditModalOpen(true);
  // };

  // const handleDeleteClick = (network) => {
  //   setSelectedNetwork(network);
  //   setDeleteModalOpen(true);
  // };

  // const handleInviteClick = (network) => {
  //   console.log('Send invite to network:', network);
  // };

  // 修改删除成功的处理函数
  const handleDeleteSuccess = (message) => {
    handleOperationSuccess(message);
  };

  // 处理切换网络
  // const handleSwitchClick = (network) => {
  //   setSelectedNetwork(network);
  //   setSwitchModalOpen(true);
  // };

  // 处理切换成功
  const handleSwitchSuccess = (message) => {
    handleOperationSuccess(message);
  };

  // 处理网络点击
  const handleNetworkClick = async (event, network) => {
    const isSelectingText = window.getSelection().toString().length > 0;
    const isActionCell = event.target.closest('.actions-cell');

    if (!isSelectingText && !isActionCell) {
      setIsNetworkLoading(true); // 开始加载
      const networkId = network.networkId;
      
      try {
        await Promise.all([
          queryClient.prefetchQuery({
            queryKey: ['network-members', networkId],
            queryFn: () => queryFns.members(networkId)
          }),
          queryClient.prefetchQuery({
            queryKey: ['network-devices', networkId],
            queryFn: () => queryFns.devices(networkId)
          }),
          queryClient.prefetchQuery({
            queryKey: ['network-groups', networkId],
            queryFn: () => queryFns.groups(networkId)
          }),
          queryClient.prefetchQuery({
            queryKey: ['network-scenes', networkId],
            queryFn: () => queryFns.scenes(networkId)
          }),
          queryClient.prefetchQuery({
            queryKey: ['network-rooms', networkId],
            queryFn: () => queryFns.rooms(networkId)
          }),
          queryClient.prefetchQuery({
            queryKey: ['network-timers', networkId],
            queryFn: () => queryFns.timers(networkId)
          }),
          queryClient.prefetchQuery({
            queryKey: ['network-schedules', networkId],
            queryFn: () => queryFns.schedules(networkId)
          })
        ]);

        setActiveNetwork(network);
        setShowNetworkDetails(true);
      } finally {
        setIsNetworkLoading(false); // 结束加载
      }
    }
  };

  // 处理返回网络列表
  const handleBackToList = () => {
    setShowNetworkDetails(false);
    setActiveNetwork(null);
  };

  const handleSort = () => {
    const isAsc = orderDirection === 'asc';
    setOrderDirection(isAsc ? 'desc' : 'asc');

    const sortedNetworks = [...filteredNetworks].sort((a, b) => {
      if (!a.createData) return 1;
      if (!b.createData) return -1;
      const comparison = new Date(a.createData) - new Date(b.createData);
      return isAsc ? -comparison : comparison;
    });

    setFilteredNetworks(sortedNetworks);
  };

  const handleRefresh = async () => {
    setIsLoading(true);  // 开始加载
    await fetchNetworks();
    setTimeout(() => {
      setIsLoading(false);  // 结束加载
    }, 500);  // 添加小延迟使动画效果更明显
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <CustomAlert
          isOpen={alert.isOpen}
          onClose={() => setAlert(prev => ({ ...prev, isOpen: false }))}
          message={alert.message}
          severity={alert.severity}
        />
        <Row>
          <Col md="12">
            <ComponentCard showTitle={false}>
              <Row>
                <Col>
                  <Breadcrumb>
                    <BreadcrumbItem>
                      {showNetworkDetails ? (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleBackToList();
                          }}
                          style={{
                            background: "none",
                            border: "none",
                            color: "blue",
                            textDecoration: "underline",
                            cursor: "pointer",
                            padding: 0,
                            font: "inherit",
                          }}
                        >
                          Networks
                        </button>
                      ) : (
                        "Networks"
                      )}
                    </BreadcrumbItem>
                    {showNetworkDetails && (
                      <BreadcrumbItem active>
                        {activeNetwork?.meshName}<Typography
                          component="span"
                          variant="body2"
                          sx={{
                            color: '#95a5a6',
                            ml: 0.5,
                            fontWeight: 400
                          }}
                        >
                          - {activeNetwork.networkId}
                        </Typography>
                      </BreadcrumbItem>
                    )}
                  </Breadcrumb>
                </Col>
              </Row>

              {!showNetworkDetails ? (
                // 网络列表视图
                <>
                  <div className="d-flex justify-content-between mb-3">
                    <div className="d-flex align-items-center">
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
                      <RefreshButton
                        onClick={handleRefresh}
                        isLoading={isLoading}
                      />
                    </div>
                  </div>

                  <TableContainer
                    component={Paper}
                    sx={{
                      boxShadow: 'none',
                      border: '1px solid #dee2e6',
                      opacity: isLoading ? 0.6 : 1,
                      transition: 'opacity 0.3s'
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
                          <TableCell
                            onClick={handleSort}
                            style={{ cursor: 'pointer' }}
                            sx={{
                              '&:hover': { backgroundColor: '#f5f5f5' }
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              Create Time
                              {orderDirection === 'asc'
                                ? <ArrowDropUpIcon sx={{ fontSize: 20 }} />
                                : <ArrowDropDownIcon sx={{ fontSize: 20 }} />
                              }
                            </div>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredNetworks
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((network) => (
                            <TableRow
                              key={network.networkId}
                              className="network-row"
                              onClick={(e) => handleNetworkClick(e, network)}
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
                                    <span style={{
                                      color: '#fbcd0b',
                                      marginLeft: '8px',
                                      fontSize: '14px',
                                      fontWeight: 'bold'
                                    }}>
                                      * Current Network
                                    </span>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="selectable-text">
                                {network.networkId}
                              </TableCell>
                              <TableCell className="selectable-text">
                                {network.passphrase}
                              </TableCell>
                              <TableCell className="selectable-text">
                                {formatDate(network.createData)}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>

                    <TablePagination
                      component="div"
                      count={filteredNetworks.length}
                      page={page}
                      onPageChange={handleChangePage}
                      rowsPerPage={rowsPerPage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      rowsPerPageOptions={[1, 5, 10, 25]}
                      labelRowsPerPage="Rows per page"
                      labelDisplayedRows={({ from, to, count }) =>
                        `${from}-${to} of ${count}`
                      }
                      sx={{
                        borderTop: '1px solid #dee2e6',
                        '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                          margin: 0,
                        }
                      }}
                    />
                  </TableContainer>
                </>
              ) : (
                // 使用新的 NetworkDetails 组件
                <NetworkDetails network={activeNetwork} />
              )}
            </ComponentCard>
          </Col>
        </Row>

        {/* 保持原有的模态框 */}
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
        <style>
          {`
            @keyframes spin {
              from {
                transform: rotate(0deg);
              }
              to {
                transform: rotate(360deg);
              }
            }
          `}
        </style>
        {isNetworkLoading && <CustomLoading />}
      </div>
    </QueryClientProvider>
  );
};

export default NetworkComponent;