import React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/EditNote';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

const UsageInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: theme.spacing(0.5),
  minWidth: '180px',
}));

const RoomElement = ({ roomType, onDelete, onEdit, onClick, userRole }) => {
  const isOwner = userRole === 'OWNER';
  const remainingConfigUploads = 10 - (roomType.configUploadCount || 0);
  const remainingCommissions = 25 - (roomType.commissionCount || 0);

  const getUsageColor = (remaining, total) => {
    const percentage = (remaining / total) * 100;
    if (percentage > 60) return "success";
    if (percentage > 30) return "warning";
    return "error";
  };

  return (
    <Card 
      elevation={0}
      sx={{
        cursor: 'pointer',
        transition: 'all 0.3s ease-in-out',
        boxShadow: 'none',
        '&:hover': {
          transform: 'translateY(-2px)',
        },
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid #f0f0f0'
      }}
      onClick={onClick}
    >
      <CardContent sx={{ padding: '20px 24px' }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" flex={1}>
            <Avatar sx={{ 
              marginRight: 3,
              width: 52,
              height: 52,
            }}>
              <FolderIcon sx={{ fontSize: 28 }} />
            </Avatar>
            
            <Box flex={1}>
              <Typography variant="h6" component="div" sx={{ 
                fontWeight: 600,
                color: 'text.primary',
                fontSize: '1.15rem',
                marginBottom: '4px'
              }}>
                {roomType.name}
              </Typography>
              
              <Box display="flex" alignItems="center" gap={1.5} sx={{ mb: 1 }}>
                <Chip 
                  label={roomType.typeCode} 
                  size="small" 
                  color="primary" 
                  variant="outlined"
                  sx={{ 
                    fontWeight: 500,
                    fontSize: '0.75rem'
                  }}
                />
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ 
                fontSize: '0.9rem',
                fontStyle: roomType.des ? 'normal' : 'italic'
              }}>
                {roomType.des || "No description"}
              </Typography>
            </Box>
          </Box>

          <Box display="flex" alignItems="center" gap={3}>
            <UsageInfo>
              <Chip 
                label={`Configs: ${remainingConfigUploads}/10`}
                size="small"
                color={getUsageColor(remainingConfigUploads, 10)}
                variant="outlined"
                sx={{ 
                  fontWeight: 500,
                  minWidth: '140px',
                  justifyContent: 'center'
                }}
              />
              <Chip 
                label={`Commissions: ${remainingCommissions}/25`}
                size="small"
                color={getUsageColor(remainingCommissions, 25)}
                variant="outlined"
                sx={{ 
                  fontWeight: 500,
                  minWidth: '140px',
                  justifyContent: 'center'
                }}
              />
            </UsageInfo>

            {isOwner && (
              <Box display="flex" gap={0.5}>
                <IconButton 
                  size="medium"
                  sx={{ 
                    color: "primary.main",
                    padding: '6px',
                    '&:hover': { 
                      color: 'primary.dark',
                      backgroundColor: 'transparent'
                    }
                  }}
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    onEdit(); 
                  }}
                >
                  <EditIcon fontSize="medium" />
                </IconButton>
                <IconButton 
                  size="medium"
                  sx={{ 
                    color: "error.main",
                    padding: '6px',
                    '&:hover': { 
                      color: 'error.dark',
                      backgroundColor: 'transparent'
                    }
                  }}
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    onDelete(); 
                  }}
                >
                  <DeleteIcon fontSize="medium" />
                </IconButton>
              </Box>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RoomElement;
