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
    Chip,
    IconButton,
    Collapse
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const getLinkTypeString = (type) => {
    switch (type) {
        case 1: return 'Device';
        case 2: return 'Group';
        case 3: return 'Room';
        case 4: return 'Scene';
        default: return 'Unknown';
    }
};

const getLinkTypeColor = (type) => {
    switch (type) {
        case 1: return '#fbcd0b';   
        case 2: return '#009688';    // Group - 绿色
        // case 3: return '#F5A623';    // Room - 橙色
        case 4: return '#9C27B0';    // Scene - 紫色
        default: return '#95A5A6';   // 默认 - 灰色
    }
};

const RemoteControlTable = ({ remoteControls }) => {
    const [isTableExpanded, setIsTableExpanded] = useState(true);

    if (!remoteControls || remoteControls.length === 0) {
        return null;
    }

    return (
        <Box sx={{ width: '100%', mt: 4 }}>
            <Typography
                variant="h6"
                sx={{
                    mb: 3,
                    fontWeight: 500,
                    color: '#2c3e50',
                    display: 'flex',
                    alignItems: 'center',
                    '&::before': {
                        content: '""',
                        width: '4px',
                        height: '24px',
                        backgroundColor: '#fbcd0b',
                        marginRight: '12px',
                        borderRadius: '4px'
                    }
                }}
            >
                Remote Control Configuration
                <IconButton
                    size="small"
                    onClick={() => setIsTableExpanded(!isTableExpanded)}
                    sx={{ ml: 0.5 }}
                >
                    {isTableExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
            </Typography>

            <Collapse in={isTableExpanded} timeout="auto" unmountOnExit>
                <TableContainer
                    component={Paper}
                    sx={{
                        boxShadow: 'none',
                        '& .MuiTable-root': {
                            borderCollapse: 'separate',
                            borderSpacing: '0 4px',
                        }
                    }}
                >
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    sx={{
                                        fontWeight: 'bold',
                                        backgroundColor: '#f8f9fa',
                                        width: '20%'
                                    }}
                                >
                                    Remote Name
                                </TableCell>
                                <TableCell
                                    sx={{
                                        fontWeight: 'bold',
                                        backgroundColor: '#f8f9fa',
                                        width: '15%'
                                    }}
                                >
                                    Link
                                </TableCell>
                                <TableCell
                                    sx={{
                                        fontWeight: 'bold',
                                        backgroundColor: '#f8f9fa',
                                        width: '20%'
                                    }}
                                >
                                    Link Type
                                </TableCell>
                                <TableCell
                                    sx={{
                                        fontWeight: 'bold',
                                        backgroundColor: '#f8f9fa',
                                        width: '25%'
                                    }}
                                >
                                    Target
                                </TableCell>
                                <TableCell
                                    sx={{
                                        fontWeight: 'bold',
                                        backgroundColor: '#f8f9fa',
                                        width: '20%'
                                    }}
                                >
                                    Action
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {remoteControls.map((remote, remoteIndex) => (
                                <React.Fragment key={remoteIndex}>
                                    {/* 如果不是第一个遥控器，添加空行 */}
                                    {remoteIndex > 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={5}
                                                sx={{
                                                    height: '16px',
                                                    border: 'none',
                                                    backgroundColor: 'transparent'
                                                }}
                                            />
                                        </TableRow>
                                    )}
                                    {/* 渲染遥控器的链接 */}
                                    {remote.links.map((link, linkIndex) => (
                                        <TableRow
                                            key={`${remoteIndex}-${linkIndex}`}
                                            sx={{
                                                backgroundColor: '#fff',
                                            }}
                                        >
                                            <TableCell sx={{
                                                fontWeight: linkIndex === 0 ? 'bold' : 'normal', verticalAlign: 'top',
                                                ...(linkIndex !== 0 && { border: 'none' })
                                            }}>
                                                {linkIndex === 0 ? remote.remoteName : ''}
                                            </TableCell>
                                            <TableCell>
                                                {link.linkIndex + 1}
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={getLinkTypeString(link.linkType)}
                                                    sx={{
                                                        backgroundColor: getLinkTypeColor(link.linkType),
                                                        color: 'white',
                                                        fontWeight: 'bold',
                                                        fontSize: '0.8rem',
                                                        borderRadius: '4px',
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {link.linkName}
                                            </TableCell>
                                            <TableCell>
                                                {link.action || '-'}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </React.Fragment>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Collapse>
        </Box>
    );
};

export default RemoteControlTable;