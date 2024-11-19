import React, { useState, useEffect, useRef } from "react";
import { Card, CardBody, CardSubtitle, Badge, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
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
  currentMembers = []
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDropdownHovered, setIsDropdownHovered] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState(userRole);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // 创建一个 ref 来引用下拉菜单容器
  const menuContainerRef = useRef(null);

  useEffect(() => {
    setCurrentUserRole(userRole);
  }, [userRole]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // 检查点击是否在菜单容器外部
      if (menuContainerRef.current && !menuContainerRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setMenuOpen(false);
      }
    };

    // 只在菜单打开时添加事件监听
    if (isDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isDropdownOpen, setMenuOpen]);

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
    setIsDropdownOpen(true);
    setMenuOpen(true);
  };

  const handleClose = () => {
    setIsDropdownOpen(false);
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

  const headerStyle = {
    padding: "10px", 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center",
    borderBottom: '1px solid #e0e0e0',
    minHeight: '50px',  // 确保最小高度
  };

  const titleContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    minWidth: 0,  // 允许子元素收缩
    flex: 1,      // 占据剩余空间
    marginRight: '10px',  // 与菜单按钮保持间距
  };

  const titleStyle = {
    margin: 0,
    fontWeight: "bold",
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '200px',
    transition: 'color 0.3s ease',
    // color: isHovered ? '#000000' : '#000000',
  };

  const subtitleStyle = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
    transition: 'color 0.3s ease',
    // color: isHovered ? '#757575' : '#757575',
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
        overflow: 'hidden',
      }}
      onClick={(event) => onCardClick(event, project)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={headerStyle}>
        <div style={titleContainerStyle}>
          <h6 style={titleStyle}>{project.name}</h6>
          {getRoleBadge(currentUserRole)}
        </div>
        <div ref={menuContainerRef}>
          <UncontrolledDropdown>
            <DropdownToggle 
              tag="span" 
              onClick={(e) => {
                e.stopPropagation();
                handleMenuClick(e);
              }}
              onMouseEnter={() => setIsDropdownHovered(true)}
              onMouseLeave={() => setIsDropdownHovered(false)}
              style={{
                cursor: 'pointer',
                padding: '8px 8px 14px 8px',
                borderRadius: '75%',
                backgroundColor: isDropdownHovered ? '#f1f1f1' : 'transparent',
                transition: 'background-color 0.3s'
              }}
            >
              <MoreHorizIcon style={{ fontSize: '30px', marginTop: '3px' }} />
            </DropdownToggle>
            <DropdownMenu 
              end 
              onClick={(e) => e.stopPropagation()}
              onMouseLeave={handleClose}
            >
              {currentUserRole === 'OWNER' ? [
                <DropdownItem 
                  key="invite" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleInviteMember();
                  }}
                >
                  <SendIcon fontSize="small" style={{marginRight:"8px", color: "#4CAF50"}}/>
                  Invite Member
                </DropdownItem>,
                <DropdownItem key="edit" onClick={handleEdit}>
                  <EditIcon style={{marginRight:"8px", color: "#007bff"}}/>
                  Edit
                </DropdownItem>,
                <DropdownItem key="change" onClick={handleChangeBackground}>
                  <WallpaperIcon fontSize="small" style={{marginRight:"8px", color: "grey"}}/>
                  Change Image
                </DropdownItem>,
                <DropdownItem key="remove" onClick={handleRemove}>
                  <DeleteIcon style={{marginRight:"8px", color: "#F44336"}}/>
                  Remove
                </DropdownItem>
              ] : null}
              {currentUserRole === 'VISITOR' && (
                <DropdownItem 
                  key="leave" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLeaveProject();
                  }}
                >
                  <LogoutIcon fontSize="small" style={{marginRight:"8px", color: "#dc3545"}}/>
                  Leave Project
                </DropdownItem>
              )}
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      </div>

      <div
        style={{
          paddingTop: '75%',
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          transition: 'transform 0.3s ease',
        }}
      />

      <CardBody style={{ 
        transition: 'background-color 0.3s ease',
        backgroundColor: isHovered ? '#f8f9fa' : 'transparent'
      }}>
        <CardSubtitle style={subtitleStyle}>
          Address: {project.address || 'None'}
        </CardSubtitle>
        <CardSubtitle style={{...subtitleStyle, marginTop: '8px'}}>
          Description: {project.des || 'None'}
        </CardSubtitle>
      </CardBody>
    </Card>
  );
};

export default ProjectCard;