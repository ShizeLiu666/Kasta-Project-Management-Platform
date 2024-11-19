import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Box
} from '@mui/material';
import ComponentCard from '../../../CustomComponents/ComponentCard';

const DeviceTable = ({ devices }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  if (!devices || devices.length === 0) {
    return null;
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div>
      <div className="component-card-title">Devices</div>
      <div>
        <TableContainer 
          component={Paper} 
          sx={{ 
            boxShadow: 'none',
            '& .MuiTableCell-root': {
              borderBottom: '1px solid #dee2e6'
            }
          }}
        >
          <Box sx={{ position: 'relative' }}>
            <Table sx={{ minWidth: 650 }} aria-label="device table">
              <TableHead>
                <TableRow>
                  <TableCell 
                    sx={{ 
                      fontWeight: 'bold',
                      backgroundColor: '#f8f9fa',
                      borderBottom: '2px solid #dee2e6'
                    }}
                  >
                    Device Name
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      fontWeight: 'bold',
                      backgroundColor: '#f8f9fa',
                      borderBottom: '2px solid #dee2e6'
                    }}
                  >
                    Type
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      fontWeight: 'bold',
                      backgroundColor: '#f8f9fa',
                      borderBottom: '2px solid #dee2e6'
                    }}
                  >
                    Model
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {devices
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((device, index) => (
                    <TableRow
                      key={index}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell>{device.deviceName}</TableCell>
                      <TableCell>{device.deviceType}</TableCell>
                      <TableCell>{device.appearanceShortname}</TableCell>
                    </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={devices.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                '.MuiTablePagination-toolbar': {
                  justifyContent: 'flex-end'
                },
                '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                  margin: 0
                }
              }}
            />
          </Box>
        </TableContainer>
      </div>
    </div>
  );
};

export default DeviceTable;