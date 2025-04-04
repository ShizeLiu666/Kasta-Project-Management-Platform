import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Row, Col, Button } from 'reactstrap';
import ComponentCard from '../CustomComponents/ComponentCard';
import { getToken } from '../auth/auth';
import axiosInstance from '../../config';
import CreateAuthCodeModal from './CreateAuthCodeModal';
import EditAuthCodeModal from './EditAuthCodeModal';
import './AuthCodeManagement.scss';
import EditIcon from '@mui/icons-material/EditNote';  // 导入 EditIcon
import ContentCopyIcon from '@mui/icons-material/ContentCopy';  // 导入 ContentCopyIcon
import CustomAlert from '../CustomComponents/CustomAlert';  // 导入 CustomAlert
import CustomButton from '../CustomComponents/CustomButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import TableSortLabel from '@mui/material/TableSortLabel';
import SearchWithField from '../CustomComponents/SearchWithField';
// import { backdropClasses } from '@mui/material';

// const { SearchBar } = Search;

const TruncatedCell = ({ text, maxLength = 20, canCopy = false, onCopy }) => {
  const truncatedText = text?.length > maxLength
    ? `${text.substring(0, maxLength)}...`
    : text || '-';

  const cellContent = (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      maxWidth: '100%'
    }}>
      {canCopy && (
        <ContentCopyIcon
          style={{ marginRight: '10px', cursor: 'pointer', flexShrink: 0 }}
          onClick={(e) => {
            e.stopPropagation();
            onCopy(text);
          }}
          fontSize="small"
        />
      )}
      <Tooltip
        title={text || '-'}
        placement="top"
        arrow
        sx={{
          tooltip: {
            backgroundColor: '#333', 
            fontSize: '0.875rem',
            padding: '8px 12px', 
            maxWidth: 'none'  // 允许 tooltip 根据内容自动调整宽度
          },
          arrow: {
            color: '#333' // 箭头颜色
          }
        }}
      >
        <div
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {truncatedText}
        </div>
      </Tooltip>
    </div>
  );

  return cellContent;
};

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
  const [searchField, setSearchField] = useState('all');

  // Wrap searchFields in useMemo
  const searchFields = useMemo(() => [
    { value: 'all', label: 'All Fields' },
    { value: 'code', label: 'Code' },
    { value: 'creator', label: 'Creator' },
    { value: 'usedBy', label: 'Used By' },
    { value: 'note', label: 'Note' }
  ], []); // 移除了 configRoomId 选项

  const fetchAuthCodes = useCallback(async () => {
    setLoading(true);
    try {
      const token = getToken();

      // Step 1: Get total count first
      const countResponse = await axiosInstance.get('/authorization-codes', {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: 0, size: 1 } // Minimal request to get total count
      });

      if (!countResponse.data.success) {
        throw new Error(countResponse.data.errorMsg || 'Failed to fetch total count');
      }

      const totalElements = countResponse.data.data.totalElements;

      // Step 2: Fetch all data with the exact size needed
      const allDataResponse = await axiosInstance.get('/authorization-codes', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: 0,
          size: totalElements || 1 // Use exact count, fallback to 1 if count is 0
        }
      });

      if (allDataResponse.data.success) {
        setAuthCodes(allDataResponse.data.data.content);
      } else {
        console.error('Failed to fetch auth codes:', allDataResponse.data.errorMsg);
        throw new Error(allDataResponse.data.errorMsg || 'Failed to fetch auth codes');
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

  // Enhanced filter function with field selection
  const filterAuthCodes = useCallback((searchValue) => {
    const searchTerm = searchValue.toLowerCase().trim();

    if (!searchTerm) return authCodes;

    return authCodes.filter(authCode => {
      if (searchField === 'all') {
        return searchFields
          .filter(field => field.value !== 'all')
          .some(({ value }) => {
            const fieldValue = String(authCode[value] || '').toLowerCase();
            return fieldValue.includes(searchTerm);
          });
      } else {
        const fieldValue = String(authCode[searchField] || '').toLowerCase();
        return fieldValue.includes(searchTerm);
      }
    });
  }, [authCodes, searchField, searchFields]);

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

  // 定义可排序的列
  const sortableColumns = {
    createDate: 'Create Date',
    valid: 'Valid'
  };

  // 排序处理函数
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // 渲染表头单元格
  const renderHeaderCell = (id, label, width, hideOnMobile = false) => {
    const isSortable = id in sortableColumns;

    return (
      <TableCell
        key={id}
        sx={{
          minWidth: width,
          maxWidth: width,
          cursor: isSortable ? 'pointer' : 'default',
          // 在小屏幕上隐藏非关键列
          display: {
            xs: hideOnMobile ? 'none' : 'table-cell',
            md: 'table-cell'
          },
          // 允许文本换行
          whiteSpace: 'normal',
          wordBreak: 'break-word'
        }}
      >
        {isSortable ? (
          <TableSortLabel
            active={orderBy === id}
            direction={orderBy === id ? order : 'asc'}
            onClick={() => handleRequestSort(id)}
            sx={{
              '&:hover': { color: '#fbcd0b' },
              '&.Mui-active': {
                color: '#fbcd0b',
                '& .MuiTableSortLabel-icon': {
                  color: '#fbcd0b',
                }
              }
            }}
          >
            {label}
          </TableSortLabel>
        ) : (
          label
        )}
      </TableCell>
    );
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

  // Add reset function
  const handleRefresh = useCallback(() => {
    setSearchTerm('');
    setSearchField('all');
    setOrder('desc');
    setOrderBy('createDate');
    setMuiPage(0);
    fetchAuthCodes();
  }, [fetchAuthCodes]);

  const headerCells = [
    { id: 'code', label: 'Code', width: '18%' },
    { id: 'creator', label: 'Creator', width: '12%' },
    { id: 'createDate', label: 'Create Date', width: '20%' },
    { id: 'usedBy', label: 'Used By', width: '16%', hideOnMobile: true },
    { id: 'configUploadCount', label: 'Upload Cnt', width: '8%' },
    { id: 'commissionCount', label: 'Comm. Cnt', width: '8%' },
    { id: 'valid', label: 'Valid', width: '8%' },
    { id: 'note', label: 'Note', width: '15%', hideOnMobile: true },
    { id: 'actions', label: 'Actions', width: '5%' }
  ];

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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <SearchWithField
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    searchField={searchField}
                    setSearchField={setSearchField}
                    searchFields={searchFields}
                    onFilter={filterAuthCodes}
                    onRefresh={handleRefresh}
                  />
                </Box>

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
                  border: '1px solid #dee2e6',
                  width: '100%',
                  '& .MuiTable-root': {
                    tableLayout: 'fixed', // 添加这行来强制使用固定表格布局
                  },
                  '& .MuiTableCell-root': {
                    padding: {
                      xs: '8px 4px', // 小屏幕使用更小的padding
                      md: '16px 8px'
                    }
                  },
                  '& .MuiButtonBase-root': {
                    '& .MuiTouchRipple-root': {
                      display: 'none'
                    }
                  }
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      {headerCells.map(cell => renderHeaderCell(
                        cell.id,
                        cell.label,
                        cell.width,
                        cell.hideOnMobile
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortData(filteredAuthCodes)
                      .slice(muiPage * rowsPerPage, muiPage * rowsPerPage + rowsPerPage)
                      .map((authCode) => (
                        <TableRow key={authCode.code}>
                          <TableCell sx={{ display: { xs: 'table-cell', md: 'table-cell' }, width: '18%' }}>
                            <TruncatedCell text={authCode.code} canCopy={true} onCopy={copyToClipboard} />
                          </TableCell>
                          <TableCell sx={{ display: { xs: 'table-cell', md: 'table-cell' }, width: '12%' }}>
                            <TruncatedCell text={authCode.creator} />
                          </TableCell>
                          <TableCell sx={{ display: { xs: 'table-cell', md: 'table-cell' }, width: '20%' }}>
                            {new Date(authCode.createDate).toLocaleString('zh-CN', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit',
                              hour12: false  // 这里设置为 24 小时制
                            })}
                          </TableCell>
                          <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }, width: '16%' }}>
                            <TruncatedCell text={authCode.usedBy} />
                          </TableCell>
                          <TableCell sx={{ display: { xs: 'table-cell', md: 'table-cell' }, width: '8%' }}>
                            {authCode.configUploadCount}
                          </TableCell>
                          <TableCell sx={{ display: { xs: 'table-cell', md: 'table-cell' }, width: '8%' }}>
                            {authCode.commissionCount}
                          </TableCell>
                          <TableCell sx={{ display: { xs: 'table-cell', md: 'table-cell' }, width: '8%' }}>
                            <Chip
                              label={authCode.valid ? 'Yes' : 'No'}
                              color={authCode.valid ? 'success' : 'error'}
                              size="small"
                              sx={{
                                minWidth: '60px',
                                '& .MuiChip-label': { px: 2 },
                                backgroundColor: authCode.valid ? '#e6f4ea' : '#fde7e7',
                                color: authCode.valid ? '#1e4620' : '#c62828',
                                borderRadius: '4px',
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }, width: '15%' }}>
                            <TruncatedCell text={authCode.note} />
                          </TableCell>
                          <TableCell
                            sx={{
                              display: { xs: 'table-cell', md: 'table-cell' },
                              width: '5%',
                              minWidth: '60px'
                            }}
                          >
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
                              <EditIcon fontSize="small" style={{ marginRight: "4px" }} />
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
                    borderTop: '1px solid #ced4da',
                    '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                      margin: 0,
                    },
                    // Disable ripple for pagination
                    '& .MuiButtonBase-root': {
                      '& .MuiTouchRipple-root': {
                        display: 'none'
                      }
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
      <Box sx={{
        '& .MuiButtonBase-root': {
          '& .MuiTouchRipple-root': {
            display: 'none'
          }
        }
      }}>
        {/* ... other content ... */}
      </Box>
    </div>
  );
};

export default AuthCodeManagement;