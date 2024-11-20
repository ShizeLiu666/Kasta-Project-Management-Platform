import React, { useState, useEffect, useRef } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Collapse,
  IconButton,
  Typography
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const GroupRow = ({ group }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTextTruncated, setIsTextTruncated] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    const checkTruncation = () => {
      if (textRef.current) {
        const isOverflowing = textRef.current.scrollWidth > textRef.current.clientWidth;
        setIsTextTruncated(isOverflowing);
      }
    };

    checkTruncation();
    window.addEventListener('resize', checkTruncation);
    return () => window.removeEventListener('resize', checkTruncation);
  }, [group]);

  const deviceNames = group.devices.map(device => device.deviceName).join(', ');

  return (
    <>
      <TableRow 
        sx={{
          '& > *': { borderBottom: '1px solid rgba(224, 224, 224, 1)' },
          backgroundColor: '#fff',
          '& td': {
            padding: '16px',
          }
        }}
      >
        <TableCell 
          component="th" 
          scope="row"
          sx={{ 
            fontWeight: 'bold',
            width: '40%',
            borderBottom: '1px solid rgba(224, 224, 224, 1)',
          }}
        >
          {group.groupName} ({group.devices.length})
        </TableCell>
        <TableCell 
          sx={{ 
            width: '60%',
            position: 'relative',
            borderBottom: '1px solid rgba(224, 224, 224, 1)',
          }}
        >
          <Box
            ref={textRef}
            sx={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              pr: isTextTruncated ? 4 : 0,
            }}
          >
            {deviceNames}
          </Box>
          {isTextTruncated && (
            <IconButton
              size="small"
              onClick={() => setIsExpanded(!isExpanded)}
              sx={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
              }}
            >
              {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          )}
        </TableCell>
      </TableRow>
      {isTextTruncated && (
        <TableRow>
          <TableCell 
            colSpan={2} 
            sx={{ 
              py: 0,
              backgroundColor: '#fafafa',
              borderBottom: '1px solid rgba(224, 224, 224, 1)',
              '& .MuiCollapse-root': {
                '& .MuiBox-root': {
                  py: 2,
                  px: 3,
                }
              }
            }}
          >
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <Box sx={{ py: 2, px: 3 }}>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ lineHeight: 1.6 }}
                >
                  {deviceNames}
                </Typography>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

const GroupTable = ({ groups }) => {
  if (!groups || groups.length === 0) {
    return null;
  }

  return (
    <Box sx={{ width: '100%', mt: 4}}>
      <Typography
        variant="h6"
        sx={{
          mb: 3,
          fontWeight: 500,
          color: '#2c3e50',
          display: 'flex',
          alignItems: 'center',
          '&::before': {
            content: '""',
            width: '4px',
            height: '24px',
            backgroundColor: '#009688',
            marginRight: '12px',
            borderRadius: '4px'
          }
        }}
      >
        Group Configuration
      </Typography>

      <TableContainer 
        component={Paper} 
        sx={{ 
          boxShadow: 'none',
          '& .MuiTable-root': {
            borderCollapse: 'separate',
            borderSpacing: '0 4px',
          }
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell 
                sx={{ 
                  fontWeight: 'bold', 
                  backgroundColor: '#f8f9fa',
                  width: '40%'
                }}
              >
                Group Name
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 'bold', 
                  backgroundColor: '#f8f9fa',
                  width: '60%'
                }}
              >
                Devices
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {groups.map((group, index) => (
              <React.Fragment key={index}>
                {index > 0 && (
                  <TableRow>
                    <TableCell 
                      sx={{ 
                        // height: '4px',
                        padding: 0,
                        border: 'none',
                        backgroundColor: 'transparent'
                      }} 
                    />
                  </TableRow>
                )}
                <GroupRow group={group} />
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default GroupTable;