import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import ComponentCard from "../CustomComponents/ComponentCard";
import {
  CircularProgress,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Tooltip,
  Chip
} from "@mui/material";
import DateRangeFilter from "./DateRangeFilter";
import OperationLogSearch from './OperationLogSearch';
import CustomButton from '../CustomComponents/CustomButton';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import SearchIcon from '@mui/icons-material/Search';
import axiosInstance from '../../config';
import { getToken } from '../auth';
import RefreshButton from '../CustomComponents/RefreshButton';

// 修改 TruncatedCell 组件
const TruncatedCell = ({ text, maxLength = 20 }) => {
  const truncatedText = text?.length > maxLength
    ? `${text.substring(0, maxLength)}...`
    : text || '-';

  return (
    <div style={{
      width: '100%',
      position: 'relative',
      display: 'flex',
      justifyContent: 'flex-start'  // 始终左对齐
    }}>
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
        <div style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          maxWidth: '100%',
          display: 'inline-block'
        }}>
          {truncatedText}
        </div>
      </Tooltip>
    </div>
  );
};

// 在 TruncatedCell 组件后添加 OperationTypeChip 组件
const OperationTypeChip = ({ type }) => {
  const getChipProps = () => {
    switch (type) {
      case 'ADD':
        return {
          label: 'ADD',
          color: '#e6f4ea',
          textColor: '#1e4620'
        };
      case 'MOD':
        return {
          label: 'MOD',
          color: '#fef7e0',
          textColor: '#996500'
        };
      case 'DEL':
        return {
          label: 'DEL',
          color: '#fde7e7',
          textColor: '#c62828'
        };
      default:
        return {
          label: type || 'NULL',
          color: '#f0f0f0',
          textColor: '#666666'
        };
    }
  };

  const { label, color, textColor } = getChipProps();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
      <Chip
        label={label}
        size="small"
        sx={{
          minWidth: '60px',
          backgroundColor: color,
          color: textColor,
          borderRadius: '4px',
          height: '24px',
          '& .MuiChip-label': { 
            px: 2,
            fontSize: '0.8125rem',
            lineHeight: '1.2',
            fontWeight: 450
          }
        }}
      />
    </Box>
  );
};

// 添加日期处理工具函数
const formatDateForDisplay = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
};

const formatDateForAPI = (date, isEndDate = false) => {
  if (!date) return null;
  const d = new Date(date);
  if (isEndDate) {
    d.setHours(23, 59, 59, 999);
  } else {
    d.setHours(0, 0, 0, 0);
  }
  return d.toISOString();
};

function OperationLog() {
  // 搜索参数状态
  const [searchParams, setSearchParams] = useState({
    searchField: 'all',
    searchValue: '',     // 改名更清晰
    startDate: null,
    endDate: null
  });

  // 查询参数状态（仅在点击搜索按钮时更新）
  const [queryParams, setQueryParams] = useState(null);
  
  // 分页和数据状态
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDateRangeValid, setIsDateRangeValid] = useState(true);
  
  const dateRangeRef = useRef(null);
  
  // 检查搜索是否可用
  const isSearchDisabled = !isDateRangeValid;

  // 1. 创建一个 ref 来追踪是否是首次加载
  const isFirstLoad = useRef(true);

  const fetchLogs = useCallback(async (params) => {
    setLoading(true);
    try {
      const token = getToken();
      const requestData = {
        page: params.page,
        size: params.size,
        searchValue: params.searchValue || '',
        searchField: params.searchField || 'all',
        startDate: formatDateForAPI(params.startDate),
        endDate: formatDateForAPI(params.endDate, true)
      };

      console.log('Fetching logs with params:', {
        ...requestData,
        startDate: requestData.startDate ? formatDateForDisplay(requestData.startDate) : null,
        endDate: requestData.endDate ? formatDateForDisplay(requestData.endDate) : null
      });

      const response = await axiosInstance.post('/logs/search', requestData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setLogs(response.data.data.content);
        setTotal(response.data.data.totalElements);
      } else {
        console.error('Failed to fetch logs:', response.data.errorMsg);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 3. 修改 useEffect，只在首次加载时执行
  useEffect(() => {
    if (isFirstLoad.current) {
      fetchLogs({
        page: 0,
        size: rowsPerPage,
        searchField: 'all',
        searchValue: '',
        startDate: null,
        endDate: null
      });
      isFirstLoad.current = false;
    }
  }, [fetchLogs, rowsPerPage]);

  const searchFields = useMemo(() => [
    { value: 'all', label: 'All Fields' },
    { value: 'username', label: 'Username' },
    { value: 'description', label: 'Description' },
    { value: 'operationType', label: 'Operation Type' },
    { value: 'targetType', label: 'Target Type' }
  ], []);

  // 处理搜索
  const handleSearch = () => {
    const params = {
      ...searchParams,
      page: 0,
      size: rowsPerPage
    };
    setPage(0);
    setQueryParams(params);
    fetchLogs(params);
  };

  // 修改重置处理函数，只重置条件不刷新数据
  const handleReset = () => {
    setSearchParams({
      searchField: 'all',
      searchValue: '',
      startDate: null,
      endDate: null
    });
    setQueryParams(null);
    setPage(0);
    dateRangeRef.current?.reset();
  };

  // 处理日期变更
  const handleDateChange = (start, end) => {
    setSearchParams(prev => ({
      ...prev,
      startDate: start,
      endDate: end
    }));
  };

  // 处理分页变更
  const handleChangePage = (event, newPage) => {
    console.log('Changing to page:', newPage);
    // 先更新页码
    setPage(newPage);
    // 构建查询参数，保持现有的搜索条件
    const currentParams = {
      ...(queryParams || searchParams), // 如果没有查询参数，使用当前搜索条件
      page: newPage,
      size: rowsPerPage
    };
    setQueryParams(currentParams);
    fetchLogs(currentParams);
  };

  // 处理每页数量变更
  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    console.log('Changing rows per page to:', newRowsPerPage);
    // 更新每页数量并重置页码
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    // 构建查询参数
    const currentParams = {
      ...(queryParams || searchParams), // 如果没有查询参数，使用当前搜索条件
      page: 0,
      size: newRowsPerPage
    };
    setQueryParams(currentParams);
    fetchLogs(currentParams);
  };

  // 修改刷新函数
  const handleRefreshAll = useCallback(() => {
    setSearchParams({
      searchField: 'all',
      searchValue: '',
      startDate: null,
      endDate: null
    });
    setQueryParams(null);
    fetchLogs({ 
      page: 0,
      size: rowsPerPage,
      searchField: 'all',
      searchValue: '',
      startDate: null,
      endDate: null
    });
  }, [rowsPerPage, fetchLogs]);

  // 假设在组件内定义 searchParams 的默认状态为：
  const defaultSearchParams = {
    searchField: 'all',
    searchValue: '',
    startDate: null,
    endDate: null,
  };

  // 假设 searchParams 为当前的搜索条件状态
  // 比较当前 searchParams 与默认状态，判断是否有任意输入
  const isSearchEmpty = (
    searchParams.searchField === defaultSearchParams.searchField &&
    searchParams.searchValue === defaultSearchParams.searchValue &&
    !searchParams.startDate &&
    !searchParams.endDate
  );

  return (
    <ComponentCard title="Operation Log">
      {/* 搜索区域 */}
      <Paper 
        elevation={0}
        sx={{ 
          p: { xs: 2, md: 3 },  // 内边距
          mb: 3,
          border: '1px solid #dee2e6',
          borderRadius: '4px',
          backgroundColor: '#fff'
        }}
      >
        <Typography 
          variant="subtitle1" 
          sx={{ 
            mb: 2.5,
            fontWeight: 600,
            color: '#495057',
            fontSize: '1rem'
          }}
        >
          Search Conditions
        </Typography>

        {/* 搜索条件区域 - 响应式布局 */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'stretch', md: 'center' }, 
          gap: 2,
          width: '100%',  // 这里控制了整个搜索区域的宽度
          mb: 2
        }}>
          {/* 日期选择器 */}
          <Box sx={{ 
            flex: { xs: '1 1 auto', md: '0 0 auto' },
            minWidth: { xs: '100%', md: 'auto' }
          }}>
            <DateRangeFilter 
              ref={dateRangeRef}
              onDateChange={handleDateChange}
              value={{ 
                startDate: searchParams.startDate, 
                endDate: searchParams.endDate 
              }}
              onValidityChange={setIsDateRangeValid}
              hideResetButton={true}
            />
          </Box>

          {/* 搜索字段和输入框 */}
          <Box sx={{ 
            flex: { xs: '1 1 auto', md: '1' },
            minWidth: { xs: '100%', md: 'auto' },
            '& .MuiFormControl-root': {
              minWidth: { xs: '100%', sm: 'auto' }
            },
            '& .MuiTextField-root': {
              minWidth: { xs: '100%', sm: '250px' }
            }
          }}>
            <OperationLogSearch
              searchValue={searchParams.searchValue}
              setSearchValue={(value) => 
                setSearchParams(prev => ({ ...prev, searchValue: value }))
              }
              searchField={searchParams.searchField}
              setSearchField={(field) => 
                setSearchParams(prev => ({ ...prev, searchField: field }))
              }
              searchFields={searchFields}
              containerStyle={{ 
                marginBottom: 0,
                width: '100%'
              }}
            />
          </Box>

          {/* Action Buttons */}
          <Box sx={{ 
            display: 'flex', 
            gap: 2,
            flexDirection: { xs: 'row', md: 'row' },
            justifyContent: { xs: 'space-between', md: 'flex-start' },
            flex: { xs: '1 1 auto', md: '0 0 auto' },
            minWidth: { xs: '100%', md: 'auto' }
          }}>
            <CustomButton
              onClick={handleReset}
              icon={<FilterAltOffIcon />}
              disabled={isSearchEmpty}
              // 当搜索条件有任意输入时使用红色按钮样式（此处采用 CustomButton 的 "leave" 类型，即红色）
              type={!isSearchEmpty ? 'leave' : undefined}
              style={
                !isSearchEmpty 
                  ? {
                      // 红色按钮样式
                      backgroundColor: '#dc3545', 
                      color: '#fff',
                      border: 'none',
                      minWidth: { xs: '45%', md: '215px' },
                      height: '40px',
                      padding: '0 12px'
                    }
                  : {
                      // 默认静止状态样式
                      backgroundColor: '#fff',
                      color: '#6c757d',
                      border: '1px solid #6c757d',
                      minWidth: { xs: '45%', md: '215px' },
                      height: '40px',
                      padding: '0 12px'
                    }
              }
            >
              Clear All
            </CustomButton>
            <Box sx={{ 
              display: 'flex', 
              gap: 1,
              flex: { xs: '0 0 auto', md: '0 0 auto' }
            }}>
              <CustomButton
                onClick={handleSearch}
                icon={<SearchIcon />}
                disabled={isSearchDisabled}
                style={{
                  backgroundColor: '#fbcd0b',
                  color: '#FFF',
                  minWidth: 'auto',
                  height: '40px',
                  opacity: isSearchDisabled ? 0.5 : 1,
                  cursor: isSearchDisabled ? 'not-allowed' : 'pointer'
                }}
              >
                Search
              </CustomButton>
              <RefreshButton 
                onClick={handleRefreshAll}
                tooltip="Reset all filters and refresh data"
              />
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* 数据显示 */}
      <Box sx={{ mt: 2 }}>
        {loading ? (
          <Box sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "200px",
          }}>
            <CircularProgress sx={{ color: '#fbcd0b' }} />
          </Box>
        ) : (
          <>
            <TableContainer 
              component={Paper}
              sx={{ 
                border: '1px solid #dee2e6',
                borderRadius: '4px',
                boxShadow: 'none',
                width: '100%',
                '& .MuiTable-root': {
                  tableLayout: 'fixed',  // 添加固定表格布局
                },
                '& .MuiTableCell-root': {
                  padding: {
                    xs: '8px 4px',
                    md: '16px 8px'
                  }
                }
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                    <TableCell sx={{ width: '18%' }}>Time</TableCell>
                    <TableCell sx={{ width: '12%' }}>Username</TableCell>
                    <TableCell sx={{ width: '10%' }}>Operation Type</TableCell>
                    <TableCell sx={{ width: '25%' }}>Description</TableCell>
                    <TableCell sx={{ width: '20%' }}>Target Type</TableCell>
                    <TableCell sx={{ width: '15%' }}>Target Id</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.operationTime}>
                      <TableCell>
                        {formatDateForDisplay(log.operationTime)}
                      </TableCell>
                      <TableCell>
                        <TruncatedCell text={log.username} maxLength={15} />
                      </TableCell>
                      <TableCell>
                        <OperationTypeChip type={log.operationType} />
                      </TableCell>
                      <TableCell>
                        <TruncatedCell text={log.description} maxLength={50} />
                      </TableCell>
                      <TableCell>
                        <TruncatedCell text={log.targetType} maxLength={30} />
                      </TableCell>
                      <TableCell>
                        <TruncatedCell text={log.targetId} maxLength={20} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={total}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[10, 25, 50]}
              labelDisplayedRows={({ from, to, count }) => 
                `${from}-${to} of ${count !== -1 ? count : 'more than ' + to}`
              }
              showFirstButton
              showLastButton
              sx={{
                borderTop: '1px solid #dee2e6',
                '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                  margin: 0,
                },
                '& .MuiButtonBase-root': {
                  '& .MuiTouchRipple-root': {
                    display: 'none'
                  }
                }
              }}
            />
          </>
        )}
      </Box>
    </ComponentCard>
  );
}

export default OperationLog;