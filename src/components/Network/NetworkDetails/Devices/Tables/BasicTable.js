// src/components/Network/NetworkDetails/Devices/Tables/BasicTable.js
import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    Typography,
    Collapse,
    IconButton,
    Chip,
    Tooltip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

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
    titleColor = '#fbcd0b',
    
    // 新增配置
    defaultExpanded = true,   // 默认是否展开
}) => {
    // 添加展开/折叠状态
    const [expanded, setExpanded] = useState(defaultExpanded);
    
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
        <Box sx={{ mb: 4 }}>
            <Paper 
                elevation={0}
                variant="outlined"
                sx={{
                    borderRadius: 2,
                    overflow: 'hidden',
                    borderColor: 'rgba(224, 224, 224, 0.7)'
                }}
            >
                {/* 3. 可折叠的标题区域 */}
                <Box 
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        backgroundColor: headerBgColor,
                        borderBottom: expanded ? `1px solid ${borderColor}` : 'none',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {icon && (
                            <img
                                src={icon}
                                alt={title}
                                style={{
                                    width: 30,
                                    height: 30,
                                    objectFit: 'contain',
                                    marginRight: 12
                                }}
                            />
                        )}
                        <Typography
                            variant="subtitle1"
                            sx={{
                                fontWeight: 600,
                                color: titleColor,
                            }}
                        >
                            {title}
                        </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Chip
                            label={`${devices.length} ${devices.length === 1 ? 'device' : 'devices'}`}
                            size="small"
                            sx={{
                                bgcolor: 'rgba(251, 205, 11, 0.1)',
                                color: '#fbcd0b',
                                fontWeight: 500,
                                mr: 1
                            }}
                        />
                        <IconButton 
                            size="small"
                            onClick={() => setExpanded(!expanded)}
                        >
                            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                    </Box>
                </Box>

                {/* 4. 可折叠的表格区域 */}
                <Collapse in={expanded}>
                    <TableContainer
                        component={Box}
                        sx={{
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
                                                // backgroundColor: headerBgColor
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
                                                                    <Tooltip title={`Device ID: ${device.deviceId || ''} | DID: ${device.did || ''}`}>
                                                                        <Typography
                                                                            component="span"
                                                                            variant="body2"
                                                                            sx={{
                                                                                color: '#95a5a6',
                                                                                ml: 0.5,
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
                                                                            {`- ${device.deviceId} | ${device.did}`}
                                                                        </Typography>
                                                                    </Tooltip>
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
                                                try {
                                                    const attrValue = device.specificAttributes && device.specificAttributes[column.id];
                                                    const formattedContent = formatWithDevice 
                                                        ? column.format(attrValue, device)
                                                        : column.format(attrValue);
                                                    cellContent = React.isValidElement(formattedContent) 
                                                        ? formattedContent 
                                                        : safeRender(formattedContent);
                                                } catch (error) {
                                                    console.error(`Error formatting column ${column.id}:`, error);
                                                    cellContent = 'Error';
                                                }
                                            } else {
                                                const value = device.specificAttributes && device.specificAttributes[column.id];
                                                cellContent = safeRender(value);
                                            }

                                            return (
                                                <TableCell key={column.id} align="left">
                                                    <Box sx={{ 
                                                        typography: 'body2',
                                                        fontSize: '0.875rem'
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
                </Collapse>
            </Paper>
        </Box>
    );
};

export default BasicTable;