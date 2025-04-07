// src/components/Network/NetworkDetails/Devices/Tables/BasicTable.js
import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    Typography
} from '@mui/material';

// 辅助函数：安全地将任何值转换为可渲染的字符串
const safeRender = (value) => {
    if (value === null || value === undefined) {
        return 'N/A';
    }
    if (typeof value === 'object') {
        return JSON.stringify(value);
    }
    return String(value);
};

const BasicTable = ({
    // 基础配置
    title,                    // 表格标题
    icon,                     // 表格图标
    devices,                  // 设备数据
    columns,                  // 列配置
    formatWithDevice = false, // 是否将整个设备对象传递给format函数

    // 样式配置(可选)
    nameColumnWidth = '30%',  // 名称列宽度
    headerBgColor = '#f8f9fa',
    borderColor = '#dee2e6',
    titleColor = '#fbcd0b'
}) => {
    // 1. 计算其他列的默认宽度
    const remainingWidth = (100 - parseInt(nameColumnWidth)) / (columns.length - 1);

    // 2. 处理列配置
    const processedColumns = [
        {
            id: 'name',
            label: 'Device',
            width: nameColumnWidth
        },
        ...columns.map(col => ({
            ...col,
            width: col.width || `${remainingWidth}%`
        }))
    ];

    return (
        <Box>
            {/* 3. 标题区域 */}
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 2,
                pl: 0
            }}>
                {icon && (
                    <img
                        src={icon}
                        alt={title}
                        style={{
                            width: 30,
                            height: 30,
                            objectFit: 'contain'
                        }}
                    />
                )}
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 500,
                        color: titleColor,
                        mb: 0.5,
                        ml: 0.5
                    }}
                >
                    {title}
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        ml: 0.5,
                        color: 'text.secondary'
                    }}
                >
                    ({devices.length} {devices.length === 1 ? 'device' : 'devices'})
                </Typography>
            </Box>

            {/* 4. 表格区域 */}
            <TableContainer
                component={Paper}
                sx={{
                    boxShadow: 'none',
                    border: `1px solid ${borderColor}`,
                    borderRadius: '8px',
                    width: '100%',
                    '& .MuiTable-root': {
                        tableLayout: 'fixed',
                        width: '100%'
                    }
                }}
            >
                <Table>
                    {/* 5. 表头 */}
                    <TableHead>
                        <TableRow>
                            {processedColumns.map(column => (
                                <TableCell
                                    key={column.id}
                                    sx={{
                                        width: column.width,
                                        fontWeight: 'bold',
                                        whiteSpace: 'nowrap',
                                        backgroundColor: headerBgColor
                                    }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>

                    {/* 6. 表格主体 */}
                    <TableBody>
                        {devices.map((device) => (
                            <TableRow
                                key={device.deviceId}
                                sx={{
                                    '&:last-child td, &:last-child th': { border: 0 },
                                    '&:hover': { backgroundColor: headerBgColor }
                                }}
                            >
                                {processedColumns.map(column => {
                                    if (column.id === 'name') {
                                        return (
                                            <TableCell key={column.id} sx={{ width: column.width }}>
                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    overflow: 'hidden',
                                                    maxWidth: '100%'
                                                }}>
                                                    <Box sx={{ minWidth: 0, flex: 1 }}>
                                                        <Typography
                                                            variant="subtitle2"
                                                            sx={{
                                                                fontWeight: 600,
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap'
                                                            }}
                                                        >
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
                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                            sx={{
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap'
                                                            }}
                                                        >
                                                            {device.appearanceShortname}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                        );
                                    }

                                    // 处理其他列
                                    let cellContent;
                                    
                                    if (column.format) {
                                        // 使用format函数，确保返回的是可渲染的内容
                                        try {
                                            // 获取属性值
                                            const attrValue = device.specificAttributes && device.specificAttributes[column.id];
                                            
                                            // 根据formatWithDevice选项决定传递什么参数给format函数
                                            const formattedContent = formatWithDevice 
                                                ? column.format(attrValue, device) // 传递属性值和整个设备对象
                                                : column.format(attrValue);        // 只传递属性值
                                            
                                            // 检查format函数返回的是否是React元素
                                            cellContent = React.isValidElement(formattedContent) 
                                                ? formattedContent 
                                                : safeRender(formattedContent);
                                        } catch (error) {
                                            console.error(`Error formatting column ${column.id}:`, error);
                                            cellContent = 'Error';
                                        }
                                    } else {
                                        // 直接访问specificAttributes
                                        const value = device.specificAttributes && device.specificAttributes[column.id];
                                        cellContent = safeRender(value);
                                    }

                                    return (
                                        <TableCell key={column.id} align="left">
                                            <Box sx={{ 
                                                typography: 'body2',  // 保持排版样式不变
                                                fontSize: '0.875rem'   // 相当于 body2 的大小
                                            }}>
                                                {cellContent}
                                            </Box>
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default BasicTable;