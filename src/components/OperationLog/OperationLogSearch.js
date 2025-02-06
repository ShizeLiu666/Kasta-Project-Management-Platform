import React from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';

const OPERATION_TYPES = [
  'Create',
  'Edit',
  'Delete',
  'Update',
  // ... 添加其他操作类型
];

const TARGET_TYPES = [
  'Project',
  'User',
  'Task',
  'Room',
  // ... 添加其他目标类型
];

function OperationLogSearch({
  searchValue,
  setSearchValue,
  searchField,
  setSearchField,
  searchFields,
  containerStyle,
}) {
  // 根据选择的搜索字段返回不同的输入组件
  const renderSearchInput = () => {
    switch (searchField) {
      case 'operation_type':
        return (
          <FormControl
            size="small"
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                height: '40px',
                '&:hover fieldset': {
                  borderColor: '#fbcd0b',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#fbcd0b',
                }
              },
              '& .Mui-focused': {
                color: '#fbcd0b !important'
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#fbcd0b'
              },
              '& .MuiSelect-select': {
                '&:focus': {
                  backgroundColor: 'transparent'
                }
              },
              '& .MuiMenuItem-root.Mui-selected': {
                backgroundColor: '#fbcd0b !important',
                color: '#000'
              }
            }}
          >
            <InputLabel>Operation Type</InputLabel>
            <Select
              value={searchValue}
              label="Operation Type"
              onChange={(e) => setSearchValue(e.target.value)}
            >
              {OPERATION_TYPES.map(type => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case 'target_type':
        return (
          <FormControl
            size="small"
            fullWidth
            sx={{
                '& .MuiOutlinedInput-root': {
                  height: '40px',
                  '&:hover fieldset': {
                    borderColor: '#fbcd0b',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#fbcd0b',
                  }
                },
                '& .Mui-focused': {
                  color: '#fbcd0b !important'
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#fbcd0b'
                },
                '& .MuiSelect-select': {
                  '&:focus': {
                    backgroundColor: 'transparent'
                  }
                },
                '& .MuiMenuItem-root.Mui-selected': {
                  backgroundColor: '#fbcd0b !important',
                  color: '#000'
                }
              }}
          >
            <InputLabel>Target Type</InputLabel>
            <Select
              value={searchValue}
              label="Target Type"
              onChange={(e) => setSearchValue(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {TARGET_TYPES.map(type => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      default:
        return (
          <TextField
            size="small"
            fullWidth
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={`Search by ${searchFields.find(f => f.value === searchField)?.label || 'all fields'}...`}
            sx={{
              '& .MuiOutlinedInput-root': {
                height: '40px',
                '&:hover fieldset': {
                  borderColor: '#fbcd0b',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#fbcd0b',
                }
              }
            }}
          />
        );
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ...containerStyle }}>
      {/* Search Field Selector */}
      <FormControl
        size="small"
        sx={{
          minWidth: 180,
          '& .MuiOutlinedInput-root': {
            height: '40px',
            backgroundColor: '#fff',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#fbcd0b'
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#fbcd0b',
              borderWidth: '1px'
            }
          },
          '& .Mui-focused': {
            color: '#fbcd0b !important'
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#fbcd0b'
          }
        }}
      >
        <InputLabel>Search In</InputLabel>
        <Select
          value={searchField}
          label="Search In"
          onChange={(e) => {
            setSearchField(e.target.value);
            setSearchValue('');
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                '& .MuiMenuItem-root': {
                  '&:hover': {
                    backgroundColor: 'rgba(251, 205, 11, 0.1)'
                  },
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(251, 205, 11, 0.2)'
                  },
                  '&.Mui-selected:hover': {
                    backgroundColor: 'rgba(251, 205, 11, 0.3)'
                  }
                }
              }
            }
          }}
        >
          {searchFields.map(field => (
            <MenuItem key={field.value} value={field.value}>
              {field.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Search Input */}
      {renderSearchInput()}
    </Box>
  );
}

export default OperationLogSearch; 