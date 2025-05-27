import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Paper, Tooltip } from '@mui/material';

/**
 * 房间组件，显示房间信息、设备列表和房间平面图
 * @param {Object} room - 房间信息对象
 * @param {Array} devices - 设备列表数组
 */
const RoomComponent = ({ room, devices }) => {
  // 跟踪当前悬浮的设备ID
  const [hoveredDevice, setHoveredDevice] = useState(null);
  // 添加图片实际显示区域的状态
  const [imageRect, setImageRect] = useState({ top: 0, left: 0, width: 0, height: 0 });
  // 添加对图片元素的引用
  const imageRef = useRef(null);

  // 创建一个空的背景区域样式
  const emptyBackgroundStyle = {
    width: '100%',
    height: '100%',
    backgroundColor: '#f8f9fa', // 浅灰色背景
    border: '2px dashed #dee2e6', // 虚线边框
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  // 计算图片实际显示区域和尺寸
  const updateImageRect = () => {
    if (imageRef.current) {
      const img = imageRef.current;
      const container = img.parentElement;
      
      // 获取容器尺寸
      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;
      
      // 获取图片真实尺寸
      const imgWidth = img.naturalWidth;
      const imgHeight = img.naturalHeight;
      
      // 计算图片的实际显示尺寸
      let displayWidth, displayHeight;
      
      if (imgWidth / imgHeight > containerWidth / containerHeight) {
        // 图片比例更宽，将受到宽度限制
        displayWidth = containerWidth;
        displayHeight = (imgHeight / imgWidth) * containerWidth;
      } else {
        // 图片比例更高，将受到高度限制
        displayHeight = containerHeight;
        displayWidth = (imgWidth / imgHeight) * containerHeight;
      }
      
      // 计算图片在容器中的位置（居中）
      const top = (containerHeight - displayHeight) / 2;
      const left = (containerWidth - displayWidth) / 2;
      
      setImageRect({
        top,
        left,
        width: displayWidth,
        height: displayHeight
      });
    }
  };

  // 图片加载完成后更新图片尺寸信息
  useEffect(() => {
    if (room?.bgUrl) {
      const handleResize = () => {
        updateImageRect();
      };
      
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [room?.bgUrl]);

  // 计算设备在图片实际显示区域上的位置 - 更灵活的偏移方案
  const calculateDevicePosition = (device) => {
    // 基本偏移量
    let offsetX = 55;
    let offsetY = 30;
    
    // 可以根据设备类型调整偏移量
    // if (device.deviceType === 'SOME_TYPE') {
    //   offsetX = 20;
    //   offsetY = 10;
    // }
    
    if (!room?.bgUrl) {
      return {
        left: `calc(${device.x}% + ${offsetX}px)`,
        top: `calc(${device.y}% + ${offsetY}px)`
      };
    }

    return {
      left: `${imageRect.left + (device.x / 100) * imageRect.width + offsetX}px`,
      top: `${imageRect.top + (device.y / 100) * imageRect.height + offsetY}px`
    };
  };

  return (
    <Box
      sx={{
        display: 'flex', // 使用flex布局
        gap: 2, // 元素间距为2个单位
        height: '600px', // 固定高度
        p: 2, // padding: 16px (2 * 8px)
        cursor: 'default' // 防止出现文本选择光标
      }}
    >
      {/* 左侧设备列表面板 */}
      <Paper
        elevation={0} // 移除阴影效果
        sx={{
          width: '20%', // 占总宽度的20%
          minWidth: '250px', // 最小宽度确保可读性
          height: '100%', // 填充父容器高度
          border: '1px solid #dee2e6', // 添加边框
          borderRadius: '8px', // 圆角边框
          overflow: 'hidden', // 防止内容溢出
          display: 'flex',
          flexDirection: 'column' // 垂直排列子元素
        }}
      >
        {/* 房间信息头部 */}
        <Box 
          sx={{ 
            p: 2, // padding: 16px
            borderBottom: '1px solid #dee2e6', // 底部分隔线
            backgroundColor: '#f8f9fa' // 浅灰色背景
          }}
        >
          {/* 房间名称和ID */}
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {room.name}
            <Tooltip title={`Room ID: ${room.roomId || ''} | RID: ${room.rid || room.roomId || ''}`}>
              <Typography
                component="span"
                variant="body2"
                sx={{
                  color: '#95a5a6',
                  ml: 1,
                  fontWeight: 400,
                  cursor: 'pointer',
                  textDecoration: 'underline dotted',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: 120,
                  verticalAlign: 'middle',
                  display: 'inline-block'
                }}
              >
                {`- ${room.roomId} | ${room.rid || room.roomId}`}
              </Typography>
            </Tooltip>
          </Typography>
          {/* 设备数量显示 */}
          <Typography variant="body2" color="text.secondary">
            {devices?.length || 0} {devices?.length === 1 ? 'device' : 'devices'}
          </Typography>
        </Box>

        {/* 设备列表 */}
        <List
          sx={{
            overflowY: 'auto', // 垂直方向可滚动
            flex: 1, // 占用剩余空间
            // 自定义滚动条样式
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#dee2e6',
              borderRadius: '3px',
            },
            paddingTop: '0px'
          }}
        >
          {/* 遍历渲染设备列表项 */}
          {devices?.map((device) => (
            <ListItem
              key={device.deviceId}
              onMouseEnter={() => setHoveredDevice(device.deviceId)}
              onMouseLeave={() => setHoveredDevice(null)}
              sx={{
                cursor: 'pointer',
                transition: 'background-color 0.2s ease', // 平滑过渡效果
                '&:hover': {
                  backgroundColor: '#e3f2fd', // 悬浮时的背景色
                },
                // 当前悬浮项的背景色
                backgroundColor: hoveredDevice === device.deviceId ? '#e3f2fd' : 'transparent',
              }}
            >
              {/* 设备信息显示 */}
              <ListItemText
                primary={
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {device.name}
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{
                        color: '#95a5a6',
                        ml: 0.5,
                        fontWeight: 400
                      }}
                    >
                      - {device.deviceId}
                    </Typography>
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" color="text.secondary">
                    {device.appearanceShortname}
                    {/* <br />
                    Position: X:{device.x}, Y:{device.y} */}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* 右侧房间图片/标记区域 */}
      <Paper
        elevation={0}
        sx={{
          flex: 1,
          height: '100%',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {/* 图片容器 */}
        <Box
          sx={{
            width: '100%',
            height: '100%',
            position: 'relative',
          }}
        >
          {room?.bgUrl ? (
            <img 
              ref={imageRef} // 添加ref引用
              src={room.bgUrl}
              alt={room.name || "Room Layout"}
              onLoad={updateImageRect} // 图片加载完成后更新尺寸信息
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.onerror = null;
              }}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                objectPosition: 'center',
                filter: hoveredDevice ? 'brightness(0.8)' : 'brightness(1)',
                transition: 'filter 0.3s ease',
                backgroundColor: '#f8f9fa'
              }}
            />
          ) : (
            <Box sx={emptyBackgroundStyle}>
              <Typography 
                variant="body1" 
                color="text.secondary"
                sx={{ 
                  textAlign: 'center',
                  opacity: hoveredDevice ? 0.5 : 1,
                  transition: 'opacity 0.3s ease'
                }}
              >
                No Room Image
              </Typography>
            </Box>
          )}
          
          {/* 设备位置标记点 - 现在使用计算出的位置 */}
          {devices?.map((device) => {
            const position = calculateDevicePosition(device);
            return (
              <Box
                key={device.deviceId}
                sx={{
                  position: 'absolute',
                  left: position.left,
                  top: position.top,
                  width: '60px', // 改回原来的大小
                  height: '60px',
                  backgroundColor: '#fbcd0b',
                  opacity: hoveredDevice === device.deviceId ? 0.8 : 0.5,
                  borderRadius: '50%',
                  transform: 'translate(-50%, -50%)',
                  transition: 'opacity 0.2s ease',
                  cursor: 'pointer',
                  zIndex: 2,
                  '&:hover': {
                    opacity: 1.0
                  }
                }}
                onMouseEnter={() => setHoveredDevice(device.deviceId)}
                onMouseLeave={() => setHoveredDevice(null)}
              />
            );
          })}
        </Box>
      </Paper>
    </Box>
  );
};

export default RoomComponent;