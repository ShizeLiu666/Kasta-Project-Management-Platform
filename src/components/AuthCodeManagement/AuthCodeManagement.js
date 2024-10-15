import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Button } from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, { PaginationProvider, PaginationListStandalone, SizePerPageDropdownStandalone } from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import ComponentCard from './ComponentCard';
import { getToken } from '../auth/auth';
import axiosInstance from '../../config';
import CreateAuthCodeModal from './CreateAuthCodeModal';
import EditAuthCodeModal from './EditAuthCodeModal';
import './AuthCodeManagement.scss';
import EditIcon from '@mui/icons-material/EditNote';  // 导入 EditIcon
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';  // 导入 ContentCopyIcon
import CustomAlert from '../CustomAlert';  // 导入 CustomAlert

const { SearchBar } = Search;

const sortIndicator = (order) => {
  if (!order) return <span className="sort-indicator">&nbsp;↕</span>;
  return order === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />;
};

const AuthCodeManagement = () => {
  const [authCodes, setAuthCodes] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAuthCode, setSelectedAuthCode] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({
    isOpen: false,
    message: '',
    severity: 'success'
  });

  const fetchAuthCodes = useCallback(async () => {
    setLoading(true);
    try {
      const token = getToken();
      // 首先获取总数
      const countResponse = await axiosInstance.get('/authorization-codes', {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: 0, size: 1 },
      });

      if (countResponse.data.success) {
        const totalCount = countResponse.data.data.totalElements;
        setTotalElements(totalCount);

        // 然后获取所有数据
        const allDataResponse = await axiosInstance.get('/authorization-codes', {
          headers: { Authorization: `Bearer ${token}` },
          params: { page: 0, size: totalCount },
        });

        if (allDataResponse.data.success) {
          setAuthCodes(allDataResponse.data.data.content);
        } else {
          console.error('Failed to fetch auth codes:', allDataResponse.data.errorMsg);
        }
      } else {
        console.error('Failed to fetch total count:', countResponse.data.errorMsg);
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

  const handleSelectRow = (row, isSelect) => {
    if (isSelect) {
      setSelectedAuthCode(row);
    } else {
      setSelectedAuthCode(null);
    }
  };

  const toggleEditModal = () => {
    setEditModalOpen(!editModalOpen);
  };

  const selectRow = {
    mode: 'radio',
    clickToSelect: true,
    onSelect: handleSelectRow,
    selected: selectedAuthCode ? [selectedAuthCode.code] : [],
    hideSelectColumn: true,
    selectionHeaderRenderer: () => null,
    style: { backgroundColor: '#e8e8e8' },
    classes: 'custom-selection-row',
  };

  const columns = [
    {
      dataField: 'code',
      text: 'Code',
      formatter: (cell, row) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ContentCopyIcon 
            style={{ marginRight: '10px', cursor: 'pointer' }}
            onClick={() => copyToClipboard(cell)}
            fontSize="small"
          />
          {cell}
        </div>
      ),
    },
    {
      dataField: 'creator',
      text: 'Creator',
      sort: true,
      headerFormatter: (column, colIndex, { sortElement, filterElement }) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {column.text} {sortElement}
        </div>
      ),
      sortCaret: sortIndicator,
    },
    {
      dataField: 'usageCount',
      text: 'Usage Count',
      sort: true,
      headerFormatter: (column, colIndex, { sortElement, filterElement }) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {column.text} {sortElement}
        </div>
      ),
      sortCaret: sortIndicator,
      headerStyle: { width: '150px' },
      style: { width: '150px' }, 
    },
    {
      dataField: 'createDate',
      text: 'Create Date',
      sort: true,
      formatter: (cell) => new Date(cell).toLocaleString(),
      headerFormatter: (column, colIndex, { sortElement, filterElement }) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {column.text} {sortElement}
        </div>
      ),
      sortCaret: sortIndicator,
    },
    {
      dataField: 'valid',
      text: 'Valid',
      formatter: (cell) => cell ? 'Yes' : 'No',
      // 移除了 sort 属性和相关的排序配置
    },
    {
      dataField: 'actions',
      text: 'Actions',
      formatter: (cell, row) => (
        <Button
          color="primary"
          size="sm"
          onClick={() => handleEditClick(row)}
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
      ),
      headerStyle: { width: '100px' }
    }
  ];

  const handleEditClick = (row) => {
    setSelectedAuthCode(row);
    toggleEditModal();
  };

  const paginationOptions = {
    custom: true,
    totalSize: totalElements,
    page,
    sizePerPage,
    sizePerPageList: [
      { text: '10', value: 10 },
      { text: '15', value: 15 },
      { text: '20', value: 20 },
    ],
    onPageChange: (page) => setPage(page),
    onSizePerPageChange: (sizePerPage, page) => {
      setSizePerPage(sizePerPage);
      setPage(page);
    },
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
          severity: 'success'
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
          severity: 'success'
        });
      } else {
        setAlert({
          isOpen: true,
          message: 'Copy failed, please copy manually',
          severity: 'error'
        });
      }
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
      setAlert({
        isOpen: true,
        message: 'Copy failed, please copy manually',
        severity: 'error'
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
              <ToolkitProvider
                keyField="code"
                data={authCodes}
                columns={columns}
                search
              >
                {(props) => (
                  <div>
                    <div className="d-flex justify-content-between mb-3">
                      <SearchBar 
                        {...props.searchProps} 
                        placeholder="Search Code..."
                      />
                      <Button
                        color="secondary"
                        onClick={toggleCreateModal}
                        style={{
                          backgroundColor: "#fbcd0b",
                          borderColor: "#fbcd0b",
                          color: "#fff",
                          fontWeight: "bold",
                          textTransform: "none",
                        }}
                      >
                        Create Auth Codes
                      </Button>
                    </div>
                    <PaginationProvider pagination={paginationFactory(paginationOptions)}>
                      {({ paginationProps, paginationTableProps }) => (
                        <div>
                          <BootstrapTable
                            {...props.baseProps}
                            {...paginationTableProps}
                            bootstrap4
                            striped
                            hover
                            condensed
                            noDataIndication="No data available"
                            selectRow={selectRow}
                            classes="allow-selection"
                            sortCaret={(order, column) => {
                              if (!order) return (<span>&nbsp;&nbsp;↕</span>);
                              else if (order === 'asc') return (<span>&nbsp;&nbsp;↑</span>);
                              else if (order === 'desc') return (<span>&nbsp;&nbsp;↓</span>);
                              return null;
                            }}
                          />
                          <div className="d-flex justify-content-between align-items-center mt-3">
                            <SizePerPageDropdownStandalone {...paginationProps} />
                            <PaginationListStandalone {...paginationProps} />
                          </div>
                        </div>
                      )}
                    </PaginationProvider>
                  </div>
                )}
              </ToolkitProvider>
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
