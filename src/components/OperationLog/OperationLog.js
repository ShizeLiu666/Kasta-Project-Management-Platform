import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import DateRangeFilter from "./DateRangeFilter";

// Fake data for simulation
const fakeLogs = [
  {
    id: 1,
    username: "Alice",
    operation_time: new Date().toISOString(),
    operation_type: "Create",
    target_type: "Project",
    target_id: "PRJ001",
    description: 'Created a new project named "Alpha".'
  },
  {
    id: 2,
    username: "Bob",
    operation_time: new Date(Date.now() - 3600 * 1000).toISOString(),
    operation_type: "Edit",
    target_type: "User",
    target_id: "USR002",
    description: "Updated user profile information."
  },
  {
    id: 3,
    username: "Charlie",
    operation_time: new Date(Date.now() - 7200 * 1000).toISOString(),
    operation_type: "Delete",
    target_type: "Task",
    target_id: "TSK003",
    description: "Deleted obsolete task data."
  }
];

function OperationLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLogs(fakeLogs);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const filteredLogs = logs.filter(log => {
    if (startDate && endDate) {
      const opTime = new Date(log.operation_time);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      return opTime >= startDate && opTime <= end;
    }
    return true;
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <ComponentCard title="Operation Log">
      <DateRangeFilter onDateChange={handleDateChange} />
      
      {loading ? (
        <Box sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "200px",
        }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Operation Type</TableCell>
                  <TableCell>Target</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredLogs
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{log.id}</TableCell>
                      <TableCell>{log.username}</TableCell>
                      <TableCell>{log.operation_type}</TableCell>
                      <TableCell>{`${log.target_type} (${log.target_id})`}</TableCell>
                      <TableCell>
                        {new Date(log.operation_time).toLocaleString()}
                      </TableCell>
                      <TableCell>{log.description}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={filteredLogs.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </>
      )}
    </ComponentCard>
  );
}

export default OperationLog;