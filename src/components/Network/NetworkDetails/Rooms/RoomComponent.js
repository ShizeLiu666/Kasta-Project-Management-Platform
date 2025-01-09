import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, Paper } from '@mui/material';
import exampleRoomImage from '../../../../assets/images/Rooms/example.jpg';

/**
 * 房间组件，显示房间信息、设备列表和房间平面图
 * @param {Object} room - 房间信息对象
 * @param {Array} devices - 设备列表数组
 */
const RoomComponent = ({ room, devices }) => {
  // 跟踪当前悬浮的设备ID
  const [hoveredDevice, setHoveredDevice] = React.useState(null);
  // 图片引用，用于获取图片加载状态
  const imageRef = React.useRef(null);

  // 图片加载完成后的处理函数
  const handleImageLoad = () => {
    if (imageRef.current) {
      // 如果后续需要使用图片尺寸，可以在这里处理
      // 现在使用百分比定位，所以暂时不需要具体尺寸
    }
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
          <Typography variant="h6" sx={{ color: '#fbcd0b' }}>
            {room?.name || 'Room Name'} {/* 如果没有房间名称则显示默认值 */}
            <Typography
              component="span"
              variant="body2"
              sx={{
                color: '#95a5a6',
                ml: 1, // margin-left: 8px
                fontWeight: 400
              }}
            >
              - {room?.roomId || 'ID'}
            </Typography>
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
                    <br />
                    Position: X:{device.x}, Y:{device.y}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* 右侧房间图片区域 */}
      <Paper
        elevation={0}
        sx={{
          flex: 1, // 占用剩余空间
          height: '100%',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          overflow: 'hidden',
          position: 'relative' // 用于定位设备标记点
        }}
      >
        {/* 图片容器 */}
        <Box
          sx={{
            width: '100%',
            height: '100%',
            position: 'relative',
            '& img': { // 图片样式
              width: '100%',
              height: '100%',
              objectFit: 'cover', // 保持比例填充
              objectPosition: 'center',
              transition: 'filter 0.3s ease' // 亮度变化过渡效果
            }
          }}
        >
          {/* 房间图片 */}
          <img 
            ref={imageRef}
            src={room?.bgUrl || exampleRoomImage} // 优先使用房间背景图，否则使用示例图片
            alt={room?.name || "Room Layout"}
            onLoad={handleImageLoad}
            onError={(e) => {
              e.target.src = exampleRoomImage; // 图片加载失败时使用示例图片
              e.target.onerror = null; // 防止无限循环
            }}
            style={{
              // 当有设备被悬浮时降低图片亮度
              filter: hoveredDevice ? 'brightness(0.8)' : 'brightness(1)'
            }}
          />
          
          {/* 设备位置标记点 */}
          {devices?.map((device) => (
            <Box
              key={device.deviceId}
              sx={{
                position: 'absolute',
                // 使用百分比定位，确保位置准确
                left: `${(device.x / 100) * 100}%`,
                top: `${(device.y / 100) * 100}%`,
                width: '50px',
                height: '50px',
                backgroundColor: '#fbcd0b', // 黄色标记点
                // 根据悬浮状态改变透明度
                opacity: hoveredDevice === device.deviceId ? 0.8 : 0.5,
                borderRadius: '50%', // 圆形标记点
                transform: 'translate(-50%, -50%)', // 居中定位
                transition: 'opacity 0.2s ease', // 透明度变化过渡效果
                cursor: 'pointer',
                zIndex: 1,
                '&:hover': {
                  opacity: 1.0
                }
              }}
              onMouseEnter={() => setHoveredDevice(device.deviceId)}
              onMouseLeave={() => setHoveredDevice(null)}
            />
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default RoomComponent;