import React, { useEffect } from 'react';
import { Modal } from 'reactstrap';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography
} from '@mui/material';
import InvitationActions from './InvitationActions';

const InvitationModal = ({ isOpen, toggle, invitations, onActionComplete }) => {
  useEffect(() => {
    if (invitations.length === 0 && isOpen) {
      toggle();
    }
  }, [invitations, isOpen, toggle]);

  const modalStyle = {
    maxWidth: '800px',
    width: '90%',
    margin: '1.75rem auto'
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered style={modalStyle}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Your Invitations
        </Typography>
        
        {invitations.length === 0 ? (
          <Typography>You have no pending invitations.</Typography>
        ) : (
          <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell 
                    sx={{ 
                      width: '35%',
                      fontWeight: 600
                    }}
                  >
                    Project Name
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      width: '40%',
                      fontWeight: 600
                    }}
                  >
                    Address
                  </TableCell>
                  <TableCell 
                    align="right"
                    sx={{ 
                      width: '25%',
                      fontWeight: 600,
                      pr: 3  // 增加右侧padding以对齐按钮
                    }}
                  >
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invitations.map((invitation) => (
                  <TableRow
                    key={invitation.projectId}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell
                      sx={{
                        maxWidth: 0,  // 启用文本溢出
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {invitation.name}
                      </Typography>
                    </TableCell>
                    <TableCell
                      sx={{
                        maxWidth: 0,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {invitation.address}
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ pr: 3 }}>
                      <InvitationActions
                        projectId={invitation.projectId}
                        onActionComplete={onActionComplete}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Modal>
  );
};

export default InvitationModal;
