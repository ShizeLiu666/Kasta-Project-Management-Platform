import React, { useState } from 'react';
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
  Typography,
  Stack
} from '@mui/material';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import DangerousIcon from '@mui/icons-material/Dangerous';
import InvitationActions from './InvitationActions';
import CustomButton from '../CustomButton';
import { handleBulkInvitationAction } from './InvitationActions';

const InvitationModal = ({ isOpen, toggle, invitations, onActionComplete }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const modalStyle = {
    maxWidth: '800px',
    width: '90%',
    margin: '1.75rem auto'
  };

  const handleBulkAction = async (action) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    try {
      await handleBulkInvitationAction(action, onActionComplete);
    } finally {
      setTimeout(() => {
        setIsProcessing(false);
      }, 500);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered style={modalStyle}>
      <Box sx={{ p: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 2 
        }}>
          <Typography variant="h6">
            Your Invitations
          </Typography>
          
          {invitations.length > 0 && (
            <Stack direction="row" spacing={1}>
              <CustomButton
                type="invite"
                onClick={() => handleBulkAction('accept')}
                disabled={isProcessing}
                icon={<DoneAllIcon sx={{ fontSize: '16px' }} />}
                style={{
                  minWidth: '140px',
                  height: '32px',
                  fontSize: '0.875rem'
                }}
              >
                Accept All
              </CustomButton>
              <CustomButton
                type="remove"
                onClick={() => handleBulkAction('reject')}
                disabled={isProcessing}
                icon={<DangerousIcon sx={{ fontSize: '16px' }} />}
                style={{
                  minWidth: '140px',
                  height: '32px',
                  fontSize: '0.875rem'
                }}
              >
                Reject All
              </CustomButton>
            </Stack>
          )}
        </Box>
        
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
