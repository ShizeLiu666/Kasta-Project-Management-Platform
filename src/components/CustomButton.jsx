import React from 'react';
import { Button } from 'reactstrap';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import LogoutIcon from '@mui/icons-material/Logout';

const buttonTypes = {
  create: {
    icon: <AddIcon />,
    color: "#fbcd0b"
  },
  invite: {
    icon: <SendIcon />,
    color: "#4CAF50"
  },
  leave: {
    icon: <LogoutIcon />,
    color: "#dc3545"  // danger color
  }
};

const CustomButton = ({ 
  type,
  color,
  onClick, 
  children, 
  userRole,
  allowedRoles,
  style = {},
  icon,
  ...props 
}) => {
  const buttonConfig = type ? buttonTypes[type] : {};
  const buttonColor = color || buttonConfig.color || "#fbcd0b";
  const buttonIcon = icon || buttonConfig.icon;

  // 如果指定了 allowedRoles 和 userRole，才进行角色检查
  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    return null;
  }

  const buttonStyle = {
    backgroundColor: buttonColor,
    borderColor: buttonColor,
    color: "#fff",
    fontWeight: "bold",
    textTransform: "none",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center', // 确保内容居中
    transition: 'all 0.3s ease',
    borderRadius: '4px',
    padding: '6px 12px', // 添加一些内边距
    minWidth: '120px', // 设置最小宽度以确保按钮不会太窄
    height: '40px', // 设置固定高度
    ...style
  };

  return (
    <Button
      color="primary"
      onClick={onClick}
      style={buttonStyle}
      className="custom-button"
      {...props}
    >
      {buttonIcon && <span style={{ marginRight: '8px', display: 'flex', alignItems: 'center' }}>{buttonIcon}</span>}
      <span>{children}</span>
    </Button>
  );
};

// 添加一个样式标签到组件中
const style = document.createElement('style');
style.textContent = `
  .custom-button:hover {
    filter: brightness(108%);
  }
  .custom-button:active {
    filter: brightness(100%);
  }
`;
document.head.appendChild(style);

export default CustomButton;
