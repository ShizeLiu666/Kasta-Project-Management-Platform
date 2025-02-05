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
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography
} from "@mui/material";
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import DateRangeFilter from "./DateRangeFilter";
import SearchWithField from '../CustomComponents/SearchWithField';
import CustomButton from '../CustomComponents/CustomButton';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import SearchIcon from '@mui/icons-material/Search';
import axiosInstance from '../../config';
import { getToken } from '../auth';
import RefreshButton from '../CustomComponents/RefreshButton';

function OperationLog() {
  // 搜索参数状态
  const [searchParams, setSearchParams] = useState({
    searchTerm: '',
    searchField: 'all',
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
    { value: 'operation_type', label: 'Operation Type' },
    { value: 'target_type', label: 'Target Type' },
    { value: 'description', label: 'Description' }
  ], []);

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
      page: 0 // 重置到第一页
    };
    setPage(0);
    setQueryParams(params);
    fetchLogs(params);
  };

  // 处理重置
  const handleReset = () => {
    setSearchParams({
      searchTerm: '',
      searchField: 'all',
      startDate: null,
      endDate: null
    });
    setQueryParams(null);
    setPage(0);
    dateRangeRef.current?.reset();
    fetchLogs({}); // 重新获取无筛选条件的数据
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
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    fetchLogs({ ...queryParams, page: 0, size: newRowsPerPage });
  };

  // 添加刷新处理函数
  const handleRefreshAll = useCallback(() => {
    // 重置所有状态
    setSearchParams({
      searchTerm: '',
      searchField: 'all',
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
      {/* 搜索面板 */}
      <Accordion defaultExpanded>
        <AccordionSummary 
          expandIcon={<ExpandMoreIcon />}
          sx={{
            backgroundColor: '#f8f9fa',
            '&:hover': {
              backgroundColor: '#f0f1f2'
            }
          }}
        >
          <Typography fontWeight="medium">Search Conditions</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            {/* 搜索字段和按钮 */}
            <Grid item xs={12}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2,
                width: '100%'
              }}>
                <Box sx={{ flex: 1 }}>
                  <SearchWithField
                    searchTerm={searchParams.searchTerm}
                    setSearchTerm={(term) => 
                      setSearchParams(prev => ({ ...prev, searchTerm: term }))
                    }
                    searchField={searchParams.searchField}
                    setSearchField={(field) => 
                      setSearchParams(prev => ({ ...prev, searchField: field }))
                    }
                    searchFields={searchFields}
                    onFilter={null} // 禁用实时搜索
                  />
                </Box>
                <CustomButton
                  onClick={handleReset}
                  icon={<FilterAltOffIcon />}
                  style={{
                    backgroundColor: '#fff',
                    color: '#6c757d',
                    border: '1px solid #6c757d',
                    minWidth: 'auto',
                    height: '40px'
                  }}
                >
                  Reset
                </CustomButton>
                <CustomButton
                  onClick={handleSearch}
                  icon={<SearchIcon />}
                  style={{
                    backgroundColor: '#fbcd0b',
                    color: '#FFF',
                    minWidth: 'auto',
                    height: '40px'
                  }}
                >
                  Search
                </CustomButton>
                <RefreshButton 
                  onClick={handleRefreshAll}
                  tooltip="Reset all filters and refresh data"
                />
              </Box>
            </Grid>

            {/* 日期范围 */}
            <Grid item xs={12}>
              <DateRangeFilter 
                ref={dateRangeRef}
                onDateChange={handleDateChange}
                value={{ 
                  startDate: searchParams.startDate, 
                  endDate: searchParams.endDate 
                }}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

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
                    <TableCell>Operation Type</TableCell>
                    <TableCell>Target</TableCell>
                    <TableCell>Time</TableCell>
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