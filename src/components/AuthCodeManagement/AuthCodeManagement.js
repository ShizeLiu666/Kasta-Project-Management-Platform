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

const { SearchBar } = Search;

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

  const fetchAuthCodes = useCallback(async () => {
    try {
      const token = getToken();
      const response = await axiosInstance.get('/authorization-codes', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: page - 1,
          size: sizePerPage,
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
    } finally {
      setLoading(false);
    }
  }, [page, sizePerPage]);

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
    hideSelectColumn: false,
    selectionHeaderRenderer: () => null,
    style: { backgroundColor: '#e8e8e8' },
    classes: 'custom-selection-row',
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

  return (
    <div>
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
                            classes="no-selection-highlight"
                            wrapperClasses="no-selection-highlight" // 添加这一行
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