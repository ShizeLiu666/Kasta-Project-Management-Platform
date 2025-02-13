import React from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';

const OPERATION_TYPES = [
  'ADD',
  'MOD',
  'DEL',
  'Others',
  // ... 添加其他操作类型
];

function OperationLogSearch({
  searchValue,
  setSearchValue,
  searchField,
  setSearchField,
  searchFields,
  containerStyle,
}) {
  // 根据 searchField 渲染不同的输入组件
  const renderSearchInput = () => {
    if (searchField === 'operationType') {
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
            {OPERATION_TYPES.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    }
    return (
      <TextField
        size="small"
        fullWidth
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder={`Search by ${searchFields.find(f => f.value === searchField)?.label || 'all fields'}...`}
        sx={{
          minWidth: { xs: '200px', sm: '250px' },
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
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: { xs: 'column', sm: 'row' },
      alignItems: { xs: 'stretch', sm: 'center' }, 
      gap: 2, 
      ...containerStyle,
      minWidth: { xs: '100%', sm: 'auto' }
    }}>
      {/* Search Field Selector */}
      <FormControl
        size="small"
        sx={{
          minWidth: { xs: '100%', sm: '180px' },
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

      {/* 根据条件渲染搜索输入框 */}
      {renderSearchInput()}
    </Box>
  );
}

export default OperationLogSearch; 