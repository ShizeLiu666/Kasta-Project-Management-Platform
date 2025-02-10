import React, { useState, useCallback, useMemo, useRef } from "react";
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
  Typography
} from "@mui/material";
import DateRangeFilter from "./DateRangeFilter";
import OperationLogSearch from './OperationLogSearch';
import CustomButton from '../CustomComponents/CustomButton';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import SearchIcon from '@mui/icons-material/Search';
import axiosInstance from '../../config';
import { getToken } from '../auth';
import RefreshButton from '../CustomComponents/RefreshButton';

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
  
  const dateRangeRef = useRef(null);
  
  const searchFields = useMemo(() => [
    { value: 'all', label: 'All Fields' },
    { value: 'username', label: 'Username' },
    { value: 'description', label: 'Description' },
    { value: 'operation_type', label: 'Operation Type' },
    { value: 'target_type', label: 'Target Type' }
  ], []);

  // 添加日期验证状态
  const [isDateRangeValid, setIsDateRangeValid] = useState(true);

  // 检查搜索是否可用
  const isSearchDisabled = !isDateRangeValid;

  // 获取日志数据的函数
  const fetchLogs = useCallback(async (params) => {
    setLoading(true);
    try {
      const token = getToken();
      const response = await axiosInstance.get('/operation-logs', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page,
          size: rowsPerPage,
          ...params
        }
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
  }, [page, rowsPerPage]);

  // 处理搜索
  const handleSearch = () => {
    const params = {
      ...searchParams,
      page: 0,
      // 处理日期，确保时间范围完整
      startDate: searchParams.startDate ? 
        new Date(new Date(searchParams.startDate).setHours(0, 0, 0, 0)).toISOString() : null,
      endDate: searchParams.endDate ? 
        new Date(new Date(searchParams.endDate).setHours(23, 59, 59, 999)).toISOString() : null
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
    setPage(newPage);
    fetchLogs({ ...queryParams, page: newPage });
  };

  // 处理每页数量变更
  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10); // 转换为整数
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    fetchLogs({ ...queryParams, page: 0, size: newRowsPerPage });
  };

  // 刷新按钮处理函数保持不变
  const handleRefreshAll = useCallback(() => {
    // 重置所有状态
    setSearchParams({
      searchField: 'all',
      searchValue: '',
      startDate: null,
      endDate: null
    });
    setQueryParams(null);
    setPage(0);
    setRowsPerPage(10);
    dateRangeRef.current?.reset();
    // 重新获取数据
    fetchLogs({});
  }, [fetchLogs]);

  return (
    <ComponentCard title="Operation Log">
      {/* 搜索区域 */}
      <Paper 
        elevation={0}
        sx={{ 
          p: { xs: 2, md: 3 },  // 在小屏幕上减小内边距
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
          flexDirection: { xs: 'column', md: 'row' },  // 在小屏幕上垂直堆叠
          alignItems: { xs: 'stretch', md: 'center' }, 
          gap: 2,
          width: '100%',
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
              style={{
                backgroundColor: '#fff',
                color: '#6c757d',
                border: '1px solid #6c757d',
                minWidth: { xs: '45%', md: '215px' },
                height: '40px',
                padding: '0 12px'
              }}
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
                boxShadow: 'none'
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                    <TableCell>ID</TableCell>
                    <TableCell>Username</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell>Operation Type</TableCell>
                    <TableCell>Target</TableCell>
                    <TableCell>Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{log.id}</TableCell>
                      <TableCell>{log.username}</TableCell>
                      <TableCell>{log.operation_type}</TableCell>
                      <TableCell>{`${log.target_type} (${log.target_id})`}</TableCell>
                      <TableCell>
                        {new Date(log.operation_time).toLocaleString('zh-CN', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: false
                        })}
                      </TableCell>
                      <TableCell>{log.description}</TableCell>
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