import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Button } from 'reactstrap';
import ComponentCard from '../CustomComponents/ComponentCard';
import { getToken } from '../auth';
import axiosInstance from '../../config';
import CreateAuthCodeModal from './CreateAuthCodeModal';
import EditAuthCodeModal from './EditAuthCodeModal';
import './AuthCodeManagement.scss';
import EditIcon from '@mui/icons-material/EditNote';  // 导入 EditIcon
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';  // 导入 ContentCopyIcon
import CustomAlert from '../CustomComponents/CustomAlert';  // 导入 CustomAlert
import CustomButton from '../CustomComponents/CustomButton';
import CustomSearchBar from '../CustomComponents/CustomSearchBar';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
// import { backdropClasses } from '@mui/material';

// const { SearchBar } = Search;

const AuthCodeManagement = () => {
  const [authCodes, setAuthCodes] = useState([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAuthCode, setSelectedAuthCode] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({
    isOpen: false,
    message: '',
    severity: 'success',
    duration: 2000  // 默认持续时间为 2 秒
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredAuthCodes, setFilteredAuthCodes] = useState([]);
  const [muiPage, setMuiPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState('createDate'); // 默认按创建日期排序
  const [order, setOrder] = useState('desc'); // 默认降序

  const fetchAuthCodes = useCallback(async () => {
    setLoading(true);
    try {
      const token = getToken();
      // 删除获取总数的请求，直接获取所有数据
      const allDataResponse = await axiosInstance.get('/authorization-codes', {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: 0, size: 1000 }, // 使用一个足够大的数字
      });

      if (allDataResponse.data.success) {
        setAuthCodes(allDataResponse.data.data.content);
      } else {
        console.error('Failed to fetch auth codes:', allDataResponse.data.errorMsg);
      }
    } catch (error) {
      console.error('Error fetching auth codes:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAuthCodes();
  }, [fetchAuthCodes, refreshTrigger]);

  const toggleEditModal = () => {
    setEditModalOpen(!editModalOpen);
  };

  const handleEditClick = (row) => {
    setSelectedAuthCode(row);
    toggleEditModal();
  };

  const toggleCreateModal = () => {
    setCreateModalOpen(!createModalOpen);
  };

  const handleCreateAuthCodes = (count) => {
    setRefreshTrigger(prev => prev + 1);
    setCreateModalOpen(false);
  };

  const copyToClipboard = (text) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      // Modern browsers
      navigator.clipboard.writeText(text).then(() => {
        setAlert({
          isOpen: true,
          message: 'Copied successfully',
          severity: 'success',
          duration: 2000  // 设置持续时间为 2 秒
        });
      }).catch(err => {
        console.error('Failed to copy: ', err);
        fallbackCopyTextToClipboard(text);
      });
    } else {
      // Fallback
      fallbackCopyTextToClipboard(text);
    }
  };

  const fallbackCopyTextToClipboard = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    
    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        setAlert({
          isOpen: true,
          message: 'Copied successfully',
          severity: 'success',
          duration: 2000  // 设置持续时间为 2 秒
        });
      } else {
        setAlert({
          isOpen: true,
          message: 'Copy failed, please copy manually',
          severity: 'error',
          duration: 2000  // 设置持续时间为 2 秒
        });
      }
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
      setAlert({
        isOpen: true,
        message: 'Copy failed, please copy manually',
        severity: 'error',
        duration: 2000  // 设置持续时间为 2 秒
      });
    }

    document.body.removeChild(textArea);
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlert(prev => ({ ...prev, isOpen: false }));
  };

  useEffect(() => {
    if (alert.isOpen) {
      const timer = setTimeout(() => {
        setAlert(prev => ({ ...prev, isOpen: false }));
      }, alert.duration);

      return () => clearTimeout(timer);
    }
  }, [alert.isOpen, alert.duration]);

  // 过滤授权码的函数
  const filterAuthCodes = useCallback((searchValue) => {
    return authCodes.filter((authCode) =>
      authCode.code.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [authCodes]);

  // 当 authCodes 或 searchTerm 改变时更新过滤结果
  useEffect(() => {
    setFilteredAuthCodes(filterAuthCodes(searchTerm));
  }, [authCodes, searchTerm, filterAuthCodes]);

  const handleChangePage = (event, newPage) => {
    setMuiPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setMuiPage(0);
  };

  // 添加排序处理函数
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // 排序函数
  const sortData = (data) => {
    return [...data].sort((a, b) => {
      if (orderBy === 'createDate') {
        const dateA = new Date(a.createDate);
        const dateB = new Date(b.createDate);
        return order === 'asc' ? dateA - dateB : dateB - dateA;
      }
      if (orderBy === 'usageCount') {
        return order === 'asc' 
          ? a.usageCount - b.usageCount 
          : b.usageCount - a.usageCount;
      }
      if (orderBy === 'valid') {
        // 将布尔值转换为数字进行排序
        const validA = a.valid ? 1 : 0;
        const validB = b.valid ? 1 : 0;
        return order === 'asc' ? validA - validB : validB - validA;
      }
      return 0;
    });
  };

  return (
    <div>
      <CustomAlert
        isOpen={alert.isOpen}
        onClose={handleCloseAlert}
        message={alert.message}
        severity={alert.severity}
      />
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Row>
          <Col md="12">
            <ComponentCard title="Authorization Code Management">
              <div className="d-flex justify-content-between mb-3">
                <CustomSearchBar
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  placeholder="Search Auth Code..."
                  width="300px"
                  showBorder={true}
                  onFilter={(value) => {
                    const filtered = filterAuthCodes(value);
                    setFilteredAuthCodes(filtered);
                  }}
                />
                <CustomButton
                  type="create"
                  onClick={toggleCreateModal}
                  style={{ marginLeft: 'auto' }}
                >
                  Create Auth Codes
                </CustomButton>
              </div>

              <TableContainer 
                component={Paper}
                sx={{
                  boxShadow: 'none',
                  border: '1px solid #dee2e6'
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Code</TableCell>
                      <TableCell>Creator</TableCell>
                      <TableCell 
                        onClick={() => handleRequestSort('createDate')}
                        style={{ cursor: 'pointer' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          Create Date
                          {orderBy === 'createDate' && (
                            order === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>Used By</TableCell>
                      <TableCell 
                        onClick={() => handleRequestSort('usageCount')}
                        style={{ cursor: 'pointer' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          Usage Count
                          {orderBy === 'usageCount' && (
                            order === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell 
                        onClick={() => handleRequestSort('valid')}
                        style={{ cursor: 'pointer' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          Valid
                          {orderBy === 'valid' && (
                            order === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortData(filteredAuthCodes)
                      .slice(muiPage * rowsPerPage, muiPage * rowsPerPage + rowsPerPage)
                      .map((authCode) => (
                        <TableRow
                          key={authCode.code}
                          sx={{
                            '&:hover': {
                              backgroundColor: '#f5f5f5',
                              cursor: 'pointer',
                            },
                          }}
                        >
                          <TableCell>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <ContentCopyIcon 
                                style={{ marginRight: '10px', cursor: 'pointer' }}
                                onClick={() => copyToClipboard(authCode.code)}
                                fontSize="small"
                              />
                              {authCode.code}
                            </div>
                          </TableCell>
                          <TableCell>{authCode.creator}</TableCell>
                          <TableCell>{new Date(authCode.createDate).toLocaleString()}</TableCell>
                          <TableCell>{authCode.usedBy}</TableCell>
                          <TableCell>{authCode.usageCount}</TableCell>
                          <TableCell>
                            <Chip
                              label={authCode.valid ? 'Yes' : 'No'}
                              color={authCode.valid ? 'success' : 'error'}
                              size="small"
                              sx={{
                                minWidth: '60px',
                                '& .MuiChip-label': {
                                  px: 2,
                                },
                                backgroundColor: authCode.valid ? '#e6f4ea' : '#fde7e7',
                                color: authCode.valid ? '#1e4620' : '#c62828',
                                borderRadius: '4px',
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              color="primary"
                              size="sm"
                              onClick={() => handleEditClick(authCode)}
                              style={{
                                backgroundColor: 'transparent',
                                border: 'none',
                                color: '#007bff',
                                padding: '0',
                              }}
                            >
                              <EditIcon fontSize="medium" style={{marginRight:"4px"}}/>
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                <TablePagination
                  component="div"
                  count={filteredAuthCodes.length}
                  page={muiPage}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[10, 15, 20]}
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
            </ComponentCard>
          </Col>
        </Row>
      )}
      <CreateAuthCodeModal
        isOpen={createModalOpen}
        toggle={toggleCreateModal}
        onCreateAuthCodes={handleCreateAuthCodes}
      />
      <EditAuthCodeModal
        isOpen={editModalOpen}
        toggle={toggleEditModal}
        authCode={selectedAuthCode}
        onEditAuthCode={(updatedAuthCode) => {
          setAuthCodes(authCodes.map(code => 
            code.code === updatedAuthCode.code ? updatedAuthCode : code
          ));
          setSelectedAuthCode(updatedAuthCode);
        }}
      />
    </div>
  );
};

export default AuthCodeManagement;