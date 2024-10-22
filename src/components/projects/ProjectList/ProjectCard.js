import React, { useState } from "react";
import { Card, CardBody, CardSubtitle, Badge } from "reactstrap";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { IconButton, Menu, MenuItem } from "@mui/material";
import DeleteIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/EditNote';
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import LogoutIcon from '@mui/icons-material/Logout';
import SendIcon from '@mui/icons-material/Send';
import default_image from "../../../assets/images/projects/default_image.jpg";

const ProjectCard = ({
  project,
  onCardClick,
  onEdit,
  onRemove,
  onChangeBackground,
  onLeaveProject,
  onInviteMember,
  setMenuOpen,
  userRole,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const imageUrl = project.iconUrl || default_image;

  const getRoleBadge = (role) => {
    let color;
    switch (role) {
      case 'OWNER':
        color = 'danger';
        break;
      case 'VISITOR':
        color = 'info';
        break;
      default:
        color = 'secondary';
    }
    return <Badge color={color} style={{ marginLeft: '10px', borderRadius: '4px'}}>{role}</Badge>;
  };

  const handleMenuClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setMenuOpen(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMenuOpen(false);
  };

  const handleEdit = () => {
    handleClose();
    onEdit(project);
  };

  const handleRemove = () => {
    handleClose();
    onRemove(project);
  };

  const handleChangeBackground = () => {
    handleClose();
    onChangeBackground(project);
  };

  const handleLeaveProject = () => {
    handleClose();
    onLeaveProject(project);
  };

  const handleInviteMember = () => {
    handleClose();
    onInviteMember(project);
  };

  return (
    <Card
      className="blog-card"
      style={{
        position: "relative",
        borderRadius: '8px',
        transition: 'all 0.3s ease',
        boxShadow: isHovered ? '0 8px 16px rgba(0,0,0,0.1)' : '0 4px 8px rgba(0,0,0,0.05)',
        border: isHovered ? '1px solid #fbcd0b' : '1px solid #e0e0e0',
        margin: '10px',
        // overflow: 'hidden',
      }}
      onClick={(event) => onCardClick(event, project)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ 
        padding: "10px", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        borderBottom: '1px solid #e0e0e0',
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h6 style={{ margin: 0, fontWeight: "bold" }}>{project.name}</h6>
          {getRoleBadge(userRole)}
        </div>
        <IconButton
          aria-label="more"
          aria-controls="menu"
          aria-haspopup="true"
          onClick={handleMenuClick}
          style={{
            padding: '8px',
            transition: 'background-color 0.3s',
          }}
          sx={{
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.08)',
            },
            '& .MuiSvgIcon-root': {
              fontSize: '2rem',
            },
          }}
        >
          <MoreHorizIcon />
        </IconButton>
      </div>

      <div
        style={{
          paddingTop: '75%',
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          transition: 'transform 0.3s ease',
          // transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        }}
      />

      <CardBody>
        <CardSubtitle>Address: {project.address || 'None'}</CardSubtitle>
        <CardSubtitle>Description: {project.des || 'None'}</CardSubtitle>
      </CardBody>

      <Menu
        id="menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {userRole === 'OWNER' ? [
          <MenuItem key="invite" onClick={handleInviteMember}>
            <SendIcon fontSize="small" style={{marginRight:"8px", color: "#4CAF50"}}/>
            Invite Member
          </MenuItem>,
          <MenuItem key="edit" onClick={handleEdit}>
          <EditIcon style={{marginRight:"8px", color: "#007bff"}}/>
          Edit
        </MenuItem>,
          <MenuItem key="change" onClick={handleChangeBackground}>
            <WallpaperIcon fontSize="small" style={{marginRight:"8px", color: "grey"}}/>
            Change Image
          </MenuItem>,
          <MenuItem key="remove" onClick={handleRemove}>
            <DeleteIcon style={{marginRight:"8px", color: "#F44336"}}/>
            Remove
          </MenuItem>
        ] : null}
        {userRole === 'VISITOR' && (
          <MenuItem key="leave" onClick={handleLeaveProject}>
            <LogoutIcon fontSize="small" style={{marginRight:"8px", color: "#dc3545"}}/>
            Leave Project
          </MenuItem>
        )}
      </Menu>
    </Card>
  );
};

export default ProjectCard;
