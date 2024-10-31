import React from "react";
import { Alert, AlertTitle } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const RemoteParameters = ({ parameterErrors, parameterData, success }) => {
  return (
    <div style={{ marginTop: "40px" }}>
      {parameterErrors && (
        <Alert severity="error" style={{ marginTop: "10px" }}>
          <AlertTitle>Error</AlertTitle>
          <div>
            <strong>Parameter Errors:</strong>
            <ul>
              {parameterErrors.map((error, index) => (
                <li key={`param-${index}`}>{error}</li>
              ))}
            </ul>
          </div>
        </Alert>
      )}

      {success && parameterData && (
        <>
          <Alert severity="success" style={{ marginTop: "20px" }}>
            <AlertTitle>Remote Control Parameters:</AlertTitle>
          </Alert>

          <TableContainer component={Paper} style={{ marginTop: "20px" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Parameter</strong></TableCell>
                  <TableCell><strong>Value</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.from(parameterData.parameters.entries())
                  .filter(([_, value]) => value !== "")
                  .map(([param, value]) => (
                    <TableRow key={param}>
                      <TableCell>{param}</TableCell>
                      <TableCell>{value}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </div>
  );
};

export default RemoteParameters;