import React, { useState, useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import ComponentCard from './ComponentCard';
import { getToken } from '../auth/auth';
import axiosInstance from '../../config';
import './AuthCodeManagement.scss';

const { SearchBar } = Search;

const AuthCodeManagement = () => {
  const [authCodes, setAuthCodes] = useState([]);
  const [page, setPage] = useState(0);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchAuthCodes(page, sizePerPage);
  }, [page, sizePerPage]);

  const fetchAuthCodes = async (page, size) => {
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
        setTotalPages(response.data.data.totalPages);
      } else {
        console.error('Failed to fetch auth codes:', response.data.errorMsg);
      }
    } catch (error) {
      console.error('Error fetching auth codes:', error);
    }
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
      <span className="react-bootstrap-table-pagination-total" style={{marginLeft: '10px'}}>
        Showing {from} to {to} of {size} Results
      </span>
    ),
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
                    <span>Total Records: {totalElements}, Total Pages: {totalPages}</span>
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
                  />
                </div>
              )}
            </ToolkitProvider>
          </ComponentCard>
        </Col>
      </Row>
    </div>
  );
};

export default AuthCodeManagement;