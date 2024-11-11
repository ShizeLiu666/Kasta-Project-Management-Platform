import React, { useState, useMemo } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import CustomButton from './CustomButton';
import defaultAvatar from '../assets/images/users/normal_user.jpg';
import CustomSearchBar from './CustomSearchBar';

const MemberTable = ({ 
  members, 
  currentUserRole,
  showActions = false,
  onRemoveMember,
  customColumns = []
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMembers = useMemo(() => {
    if (!searchTerm) return members;
    
    return members.filter(member => {
      const searchValue = searchTerm.toLowerCase();
      const accountName = (member.account || member.username || '').toLowerCase();
      const nickName = (member.nickname || member.nickName || '').toLowerCase();
      return accountName.includes(searchValue) || nickName.includes(searchValue);
    });
  }, [members, searchTerm]);

  const getStatusChip = (status) => {
    let color;
    let label = status;
    let backgroundColor;
    let textColor;

    switch (status) {
      case 'ACCEPT':
        backgroundColor = '#28a745';
        textColor = '#fff';
        break;
      case 'REJECT':
        color = 'error';
        break;
      case 'WAITING':
        backgroundColor = '#FCB249';
        textColor = '#fff';
        break;
      default:
        color = 'default';
    }

    return (
      <Chip 
        label={label} 
        color={color}
        size="small"
        sx={{ 
          borderRadius: '4px',
          minWidth: '80px',
          justifyContent: 'center',
          ...(backgroundColor && {
            backgroundColor,
            color: textColor,
            '&:hover': {
              backgroundColor: backgroundColor
            }
          })
        }} 
      />
    );
  };

  const defaultColumns = [
    {
      id: 'account',
      label: 'Account',
      width: '37.5%',
      render: (member) => (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          overflow: 'hidden'
        }}>
          <Avatar
            src={member.headPic || defaultAvatar}
            sx={{ 
              width: 40,
              height: 40,
              flexShrink: 0
            }}
            imgProps={{
              onError: (e) => {
                e.target.onerror = null;
                e.target.src = defaultAvatar;
              }
            }}
          />
          <Box sx={{ ml: 2 }}>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 600,
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}
            >
              {member.account || member.username}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }}
            >
              {member.nickname || member.nickName}
            </Typography>
          </Box>
        </Box>
      )
    },
    {
      id: 'role',
      label: 'Role',
      width: '20%',
      render: (member) => (
        <Chip 
          label={member.role}
          size="small"
          sx={{ 
            borderRadius: '4px',
            backgroundColor: member.role === 'OWNER' ? '#FE0760' : 'default',
            color: member.role === 'OWNER' ? '#fff' : 'inherit'
          }}
        />
      )
    },
    {
      id: 'status',
      label: 'Status',
      width: '20%',
      render: (member) => (
        member.role !== 'OWNER' && getStatusChip(member.memberStatus)
      )
    }
  ];

  const columns = [...defaultColumns, ...customColumns];
  if (showActions && currentUserRole === 'OWNER') {
    columns.push({
      id: 'actions',
      label: 'Actions',
      width: '22.5%',
      render: (member) => (
        member.role !== 'OWNER' && (
          <CustomButton
            type="remove"
            onClick={() => onRemoveMember(member)}
            icon={<PersonRemoveIcon sx={{ fontSize: '16px' }} />}
            color="#f62d51"
            style={{
              minWidth: 'auto',
              height: '24px',
              padding: '0 8px',
              fontSize: '0.8125rem',
              fontWeight: 'normal',
              borderRadius: '4px',
              marginLeft: '0',
              marginRight: '0'
            }}
          >
            Remove
          </CustomButton>
        )
      )
    });
  }

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <CustomSearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholder="Search by account..."
          width="300px"
          showBorder={true}
        />
      </div>

      <TableContainer 
        component={Paper} 
        sx={{ 
          boxShadow: 'none',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          width: '100%',
          '& .MuiTable-root': {
            tableLayout: 'fixed',
            width: '100%'
          }
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell 
                  key={column.id}
                  sx={{ 
                    width: column.width,
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMembers.map((member, index) => (
              <TableRow
                key={index}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  '&:hover': { backgroundColor: '#f8f9fa' }
                }}
              >
                {columns.map((column) => (
                  <TableCell key={column.id}>
                    {column.render(member)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default MemberTable;