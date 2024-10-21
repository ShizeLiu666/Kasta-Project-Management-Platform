import React from 'react';
import { styled } from '@mui/material/styles';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/EditNote';

const Demo = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

const RoomElement = ({ roomType, onDelete, onEdit, onClick, userRole }) => {
  const isOwner = userRole === 'OWNER';

  return (
    <Demo>
      <ListItemButton
        onClick={onClick}
        sx={{
          '&:hover': {
            backgroundColor: '#f0f0f0',
            cursor: 'pointer',
          },
        }}
      >
        <ListItemAvatar>
          <Avatar>
            <FolderIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={`${roomType.name} (${roomType.typeCode})`}
          secondary={roomType.des || "No description"}
        />
        {isOwner && (
          <>
            <IconButton edge="end" style={{ marginRight: "5px" }} aria-label="edit" onClick={(e) => { e.stopPropagation(); onEdit(); }}>
              <EditIcon fontSize="medium" sx={{ color: "#007bff" }}/>
            </IconButton>
            <IconButton fontSize="medium" edge="end" aria-label="delete" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
              <DeleteIcon sx={{ color: "#f62d51" }}/>
            </IconButton>
          </>
        )}
      </ListItemButton>
    </Demo>
  );
};

export default RoomElement;
