import React, { useState, useMemo } from "react";
import { Card, CardBody, CardSubtitle } from "reactstrap";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { IconButton, Menu, MenuItem } from "@mui/material";
import DeleteIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/EditNote';
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import default_image from "../../../assets/images/projects/default_image.jpg";
import LazyLoad from 'react-lazyload';

const ProjectCard = ({
  project,
  onCardClick,
  onEdit,
  onRemove,
  onChangeBackground,
  setMenuOpen,
  userRole,  // 添加这个 prop
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  // 使用 useMemo 缓存图片 URL
  const imageUrl = useMemo(() => {
    if (project.iconUrl) {
      const timestamp = project.updatedAt || Date.now();
      return `${project.iconUrl}?v=${timestamp}`;
    }
    return default_image;
  }, [project.iconUrl, project.updatedAt]);

  // Handle Menu open/close
  const handleMenuClick = (event) => {
    event.stopPropagation(); // Prevent triggering the card's click handler
    setAnchorEl(event.currentTarget);
    setMenuOpen(true); // Menu is open
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMenuOpen(false); // Menu is closed
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

  return (
    <Card
      className="blog-card"
      style={{ position: "relative" }}
      onClick={(event) => onCardClick(event, project)}
    >
      <div style={{ 
        padding: "10px", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        // borderBottom: "1px solid #e0e0e0"
      }}>
        <h6 style={{ margin: 0, fontWeight: "bold" }}>{project.name}</h6>
        <IconButton
          aria-label="more"
          aria-controls="menu"
          aria-haspopup="true"
          onClick={handleMenuClick}
          style={{ padding: 0 }}
        >
          <MoreHorizIcon />
        </IconButton>
      </div>
      <LazyLoad height={0} once>
        <div
          style={{
            paddingTop: '75%',
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
      </LazyLoad>
      <CardBody style={{padding: "10px "}}>
        <CardSubtitle>Address: {project.address || 'None'}</CardSubtitle>
        <CardSubtitle>Description: {project.des || 'None'}</CardSubtitle>
        <CardSubtitle>Role: {project.role || 'Visitor'}</CardSubtitle>
      </CardBody>

      {/* More Options Icon */}
      <IconButton
        aria-label="more"
        aria-controls="menu"
        aria-haspopup="true"
        onClick={handleMenuClick}
        style={{
          position: "absolute",
          top: "5px",
          right: "10px",
          color: "#A9A9A9",
        }}
      >
        {/* <MoreHorizIcon fontSize="large"/> */}
      </IconButton>

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
        {userRole === 'OWNER' && (
          <>
            <MenuItem onClick={handleChangeBackground}><WallpaperIcon style={{marginRight:"8px", color: "#4CAF50"}}/>Change Image</MenuItem>
            <MenuItem onClick={handleEdit}><EditIcon fontSize="medium" style={{marginRight:"8px", color: "#007bff"}}/>Edit</MenuItem>
            <MenuItem onClick={handleRemove}><DeleteIcon style={{marginRight:"8px", color: "#F44336"}}/>Remove</MenuItem>
          </>
        )}
        {/* 可以添加一些 VISITOR 可以看到的菜单项 */}
        <MenuItem onClick={handleClose}>Close</MenuItem>
      </Menu>
    </Card>
  );
};

export default ProjectCard;
