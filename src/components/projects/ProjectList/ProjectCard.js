import React, { useState } from "react";
import { Card, CardBody, CardSubtitle } from "reactstrap";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { IconButton, Menu, MenuItem } from "@mui/material";
import DeleteIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/EditNote';
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import LogoutIcon from '@mui/icons-material/Logout';
import default_image from "../../../assets/images/projects/default_image.jpg";
// import LazyLoad from 'react-lazyload';

const ProjectCard = ({
  project,
  onCardClick,
  onEdit,
  onRemove,
  onChangeBackground,
  onLeaveProject,
  setMenuOpen,
  userRole,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  // 直接设置图片 URL，不使用 useMemo
  const imageUrl = project.iconUrl || default_image;

  // Handle Menu open/close
  const handleMenuClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setMenuOpen(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMenuOpen(false);
  };

  // Edit action
  const handleEdit = () => {
    handleClose();
    onEdit(project);
  };

  // Remove action
  const handleRemove = () => {
    handleClose();
    onRemove(project);
  };

  // Change Background action
  const handleChangeBackground = () => {
    handleClose();
    onChangeBackground(project);
  };

  const handleLeaveProject = () => {
    handleClose();
    onLeaveProject(project);
  };

  return (
    <Card
      className="blog-card"
      style={{ position: "relative", borderRadius: '4px'}}
      onClick={(event) => onCardClick(event, project)}
    >
      <div style={{ 
        padding: "10px", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
      }}>
        <h6 style={{ margin: 0, fontWeight: "bold" }}>{project.name}</h6>
        <IconButton
          aria-label="more"
          aria-controls="menu"
          aria-haspopup="true"
          onClick={handleMenuClick}
          style={{
            padding: '8px',  // 减小内边距以适应更大的图标
            transition: 'background-color 0.3s',
          }}
          sx={{
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.08)',  // 稍微加深悬停时的背景色
            },
            '& .MuiSvgIcon-root': {  // 针对图标的样式
              fontSize: '2rem',  // 增大图标尺寸
            },
          }}
        >
          <MoreHorizIcon />  {/* 移除 fontSize 属性，使用 sx 中的样式 */}
        </IconButton>
      </div>

      <div
        style={{
          paddingTop: '75%',
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      <CardBody style={{padding: "10px "}}>
        <CardSubtitle>Address: {project.address || 'None'}</CardSubtitle>
        <CardSubtitle>Description: {project.des || 'None'}</CardSubtitle>
        <CardSubtitle>Role: {project.role || 'Visitor'}</CardSubtitle>
      </CardBody>

      {/* Menu for Edit, Remove, and Change Background actions */}
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
          <MenuItem key="change" onClick={handleChangeBackground}><WallpaperIcon style={{marginRight:"8px", color: "#4CAF50"}}/>Change Image</MenuItem>,
          <MenuItem key="edit" onClick={handleEdit}><EditIcon fontSize="medium" style={{marginRight:"8px", color: "#007bff"}}/>Edit</MenuItem>,
          <MenuItem key="remove" onClick={handleRemove}><DeleteIcon style={{marginRight:"8px", color: "#F44336"}}/>Remove</MenuItem>
        ] : null}
        {userRole === 'VISITOR' && (
          <MenuItem key="leave" onClick={handleLeaveProject}>
            <LogoutIcon style={{marginRight:"8px", color: "#dc3545"}}/>
            Leave Project
          </MenuItem>
        )}
      </Menu>
    </Card>
  );
};

export default ProjectCard;
