import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Button } from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import ComponentCard from './ComponentCard';
import { getToken } from '../auth/auth';
import axiosInstance from '../../config';
import CreateAuthCodeModal from './CreateAuthCodeModal';
import EditAuthCodeModal from './EditAuthCodeModal';
import './AuthCodeManagement.scss';

const { SearchBar } = Search;

const AuthCodeManagement = () => {
  const [authCodes, setAuthCodes] = useState([]);
  const [page, setPage] = useState(0);
  const [sizePerPage, setSizePerPage] = useState(100);
  const [totalElements, setTotalElements] = useState(0);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAuthCode, setSelectedAuthCode] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchAuthCodes = useCallback(async (page, size) => {
    try {
      const token = getToken();
      const response = await axiosInstance.get('/authorization-codes', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: page,
          size: size,
        },
      });
      if (response.data.success) {
        setAuthCodes(response.data.data.content);
        setTotalElements(response.data.data.totalElements);
      } else {
        console.error('Failed to fetch auth codes:', response.data.errorMsg);
      }
    } catch (error) {
      console.error('Error fetching auth codes:', error);
    }
  }, []);

  useEffect(() => {
    fetchAuthCodes(page, sizePerPage);
  }, [fetchAuthCodes, page, sizePerPage, refreshTrigger]);

  const handleSelectRow = (row, isSelect) => {
    if (isSelect) {
      setSelectedAuthCode(row);
    } else {
      setSelectedAuthCode(null);
    }
    // console.log(isSelect ? 'Selected:' : 'Deselected:', row);
  };

  const toggleEditModal = () => {
    setEditModalOpen(!editModalOpen);
  };

  const selectRow = {
    mode: 'radio',  // 改为 'radio' 以实现单选
    clickToSelect: true,
    onSelect: handleSelectRow,
    selected: selectedAuthCode ? [selectedAuthCode.code] : [],
    hideSelectColumn: false,  // 显示选择列
    selectionHeaderRenderer: () => null,  // 移除顶部的全选复选框
  };

  const columns = [
    {
      dataField: 'code',
      text: 'Code',
      sort: true,
    },
    {
      dataField: 'creator',
      text: 'Creator',
      sort: true,
    },
    {
      dataField: 'usageCount',
      text: 'Usage Count',
      sort: true,
    },
    {
      dataField: 'createDate',
      text: 'Create Date',
      sort: true,
      formatter: (cell) => new Date(cell).toLocaleString(),
    },
    {
      dataField: 'valid',
      text: 'Valid',
      sort: true,
      formatter: (cell) => cell ? 'Yes' : 'No',
    },
  ];

  const handleTableChange = (type, { page, sizePerPage }) => {
    setPage(page - 1);  // Subtract 1 to convert from 1-based to 0-based
    setSizePerPage(sizePerPage);
  };

  const paginationOptions = {
    page: page + 1,  // Add 1 to convert from 0-based to 1-based
    sizePerPage: sizePerPage,
    totalSize: totalElements,
    showTotal: true,
    paginationTotalRenderer: (from, to, size) => (
      <span className="react-bootstrap-table-pagination-total" style={{ marginLeft: '10px' }}>
        Showing {from} to {to} of {size} Results
      </span>
    ),
  };

  const toggleCreateModal = () => {
    setCreateModalOpen(!createModalOpen);
  };

  const handleCreateAuthCodes = (count) => {
    setRefreshTrigger(prev => prev + 1);
    setCreateModalOpen(false);
  };

  return (
    <div>
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
                    <SearchBar {...props.searchProps} />
                    <div>
                      <Button
                        color="secondary"
                        onClick={toggleCreateModal}
                        style={{
                          backgroundColor: "#fbcd0b",
                          borderColor: "#fbcd0b",
                          color: "#fff",
                          fontWeight: "bold",
                          textTransform: "none",
                          marginRight: "10px"
                        }}
                      >
                        Create Auth Codes
                      </Button>
                      <Button
                        color="secondary"
                        onClick={toggleEditModal}
                        style={{
                          backgroundColor: "#007bff",
                          borderColor: "#007bff",
                          color: "#fff",
                          fontWeight: "bold",
                          textTransform: "none",
                        }}
                        disabled={!selectedAuthCode}
                      >
                        Edit Auth Code
                      </Button>
                    </div>
                  </div>
                  <BootstrapTable
                    {...props.baseProps}
                    bootstrap4
                    striped
                    hover
                    condensed
                    pagination={paginationFactory(paginationOptions)}
                    onTableChange={handleTableChange}
                    noDataIndication="No data available"
                    selectRow={selectRow}
                  />
                </div>
              )}
            </ToolkitProvider>
          </ComponentCard>
        </Col>
      </Row>
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