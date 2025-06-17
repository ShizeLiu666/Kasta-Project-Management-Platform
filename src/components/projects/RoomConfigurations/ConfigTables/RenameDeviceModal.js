import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
  Box,
  Typography,
  IconButton,
  Pagination,
  FormHelperText,
  Select,
  MenuItem,
  FormControl
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import CustomButton from '../../../CustomComponents/CustomButton';
import { AllDeviceTypes } from '../ExcelProcessor/ExcelProcessor';

const ITEMS_PER_PAGE = 5;
const VALID_NAME_REGEX = /^[a-zA-Z0-9_-]+$/;

// Get all device model names for validation
const getAllModelNames = () => {
  const allModels = [];
  
  for (const value of Object.values(AllDeviceTypes)) {
    if (Array.isArray(value)) {
      allModels.push(...value);
    } else if (typeof value === 'object') {
      Object.values(value).forEach(subModels => {
        if (Array.isArray(subModels)) {
          allModels.push(...subModels);
        }
      });
    }
  }
  
  return allModels;
};

// Get models for a specific device type
const getModelsForDeviceType = (deviceType) => {
  // Remove count suffix from device type (e.g., "Dimmer Type (13)" -> "Dimmer Type")
  const cleanDeviceType = deviceType.replace(/\s*\(\d+\)$/, '');
  
  const deviceTypeData = AllDeviceTypes[cleanDeviceType];
  if (!deviceTypeData) return [];
  
  if (Array.isArray(deviceTypeData)) {
    return deviceTypeData;
  } else if (typeof deviceTypeData === 'object') {
    // For nested types like PowerPoint Type, Remote Control
    const allModels = [];
    Object.values(deviceTypeData).forEach(subModels => {
      if (Array.isArray(subModels)) {
        allModels.push(...subModels);
      }
    });
    return allModels;
  }
  
  return [];
};

const ALL_MODEL_NAMES = getAllModelNames();

const RenameDeviceModal = ({ 
  open, 
  onClose, 
  devices, 
  allDevices,
  onSave, 
  deviceType,
  deviceModel,
  onDownloadUpdatedConfig
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [renamedDevices, setRenamedDevices] = useState({});
  const [selectedModel, setSelectedModel] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Reset state when modal opens or devices change
  useEffect(() => {
    if (open) {
      setCurrentPage(1);
      setRenamedDevices({});
      setSelectedModel(deviceModel || '');
      setHasChanges(false);
      setValidationErrors({});
    }
  }, [open, devices, deviceModel]);

  // Validate device name according to Devices.js rules
  const validateDeviceName = (newName, originalName, allDeviceNames) => {
    if (!newName || newName.trim() === '') {
      return 'Device name cannot be empty';
    }

    const trimmedName = newName.trim();

    // Length check
    if (trimmedName.length < 1 || trimmedName.length > 20) {
      return 'Device name must be between 1 and 20 characters long';
    }

    // Check for spaces
    if (trimmedName.includes(' ')) {
      return 'Device name cannot contain spaces. Use underscores (_) or camelCase instead';
    }

    // Check valid characters
    if (!VALID_NAME_REGEX.test(trimmedName)) {
      return 'Device name can only contain letters, numbers, and underscores';
    }

    // Check if name conflicts with device model names
    if (ALL_MODEL_NAMES.includes(trimmedName)) {
      return 'Device name cannot be the same as any device model name';
    }

    // Check for duplicates (excluding the original name)
    const otherNames = allDeviceNames.filter(name => name !== originalName);
    if (otherNames.includes(trimmedName)) {
      return 'Device name must be unique';
    }

    return null; // No error
  };

  // Calculate pagination
  const totalPages = Math.ceil(devices.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentDevices = devices.slice(startIndex, endIndex);

  const handleNameChange = (deviceName, newName) => {
    // Get ALL device names for global validation (not just current device type)
    const allGlobalDeviceNames = allDevices ? allDevices.map(device => device.deviceName) : [];
    const allRenamedNames = Object.values(renamedDevices).filter(name => name && name.trim() !== '');
    const combinedNames = [...allGlobalDeviceNames, ...allRenamedNames];

    // Validate the new name
    const error = validateDeviceName(newName, deviceName, combinedNames);
    
    setRenamedDevices(prev => ({
      ...prev,
      [deviceName]: newName
    }));

    setValidationErrors(prev => ({
      ...prev,
      [deviceName]: error
    }));

    // Check for changes
    checkForChanges();
  };

  const handleModelChange = (newModel) => {
    setSelectedModel(newModel);
    // Check for changes with the new model value
    const hasNameChanges = Object.keys(renamedDevices).some(key => {
      const value = renamedDevices[key];
      return value && value.trim() !== '' && value.trim() !== key && !validationErrors[key];
    });

    const hasModelChanges = newModel && newModel !== deviceModel;
    setHasChanges(hasNameChanges || hasModelChanges);
  };

  const checkForChanges = () => {
    const hasNameChanges = Object.keys(renamedDevices).some(key => {
      const value = renamedDevices[key];
      return value && value.trim() !== '' && value.trim() !== key && !validationErrors[key];
    });

    const hasModelChanges = selectedModel && selectedModel !== deviceModel;

    setHasChanges(hasNameChanges || hasModelChanges);
  };

  const handleSave = () => {
    // Only save devices that have changed names and have no validation errors
    const validNameChanges = {};
    Object.entries(renamedDevices).forEach(([oldName, newName]) => {
      if (newName && newName.trim() !== '' && newName.trim() !== oldName && !validationErrors[oldName]) {
        validNameChanges[oldName] = newName.trim();
      }
    });

    // Check if model has changed
    const newModel = selectedModel && selectedModel !== deviceModel ? selectedModel : null;

    if (Object.keys(validNameChanges).length > 0 || newModel) {
      // Print changes to console instead of downloading
      console.log('=== Device Rename/Model Changes ===');
      console.log('Device Type:', deviceType);
      console.log('Original Model:', deviceModel);
      console.log('New Model:', newModel || 'No change');
      console.log('Name Changes:', validNameChanges);
      console.log('Total Name Changes:', Object.keys(validNameChanges).length);
      console.log('');
      console.log('🔄 Global Replacement Will Occur In:');
      console.log('  • devices[] - Main device list');
      console.log('  • groups[].devices[] - Group device references');
      console.log('  • scenes[].contents[].name - Scene device references');
      console.log('  • remoteControls[].links[].linkName - Remote control device links');
      console.log('  • inputs[].deviceName - Input module references');
      console.log('  • outputs[].deviceName - Output module references');
      console.log('  • dryContacts[].deviceName - Dry contact references');
      console.log('=====================================');
      
      // Call onSave without download callback
      onSave(validNameChanges, newModel, null);
    }
    onClose();
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: '500px'
        }
      }}
    >
      <DialogTitle sx={{ 
        m: 0, 
        p: 2, 
        display: 'flex', 
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid #dee2e6'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <EditIcon sx={{ mr: 1, color: '#fbcd0b' }} />
          <Typography variant="h6" component="div">
            Rename Devices
          </Typography>
        </Box>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {/* Device Type Information */}
        <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderBottom: '1px solid #dee2e6' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
            Device Type: {deviceType}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ minWidth: '60px' }}>
              Model:
            </Typography>
            <FormControl size="small" sx={{ minWidth: '200px' }}>
              <Select
                value={selectedModel}
                onChange={(e) => handleModelChange(e.target.value)}
                sx={{
                  fontSize: '0.875rem',
                  fontFamily: 'monospace',
                  backgroundColor: '#fff',
                  '&.Mui-focused': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#fbcd0b'
                    }
                  }
                }}
              >
                {getModelsForDeviceType(deviceType).map((model) => (
                  <MenuItem 
                    key={model} 
                    value={model}
                    sx={{ fontSize: '0.875rem', fontFamily: 'monospace' }}
                  >
                    {model}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Total: {devices.length} devices
          </Typography>
        </Box>

        {/* Device Rename Table */}
        <TableContainer 
          component={Paper} 
          sx={{ 
            boxShadow: 'none',
            '& .MuiTableRow-root': {
              '&:hover': {
                backgroundColor: '#f0f0f0 !important'
              }
            },
            '& .MuiTableCell-root': {
              '&:hover': {
                backgroundColor: 'transparent !important'
              }
            },
            '& .MuiTouchRipple-root': {
              display: 'none'
            }
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                <TableCell sx={{ fontWeight: 'bold', width: '5%' }}>
                  #
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', width: '47.5%' }}>
                  Original Device Name
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', width: '47.5%' }}>
                  New Device Name
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentDevices.map((device, index) => {
                const globalIndex = startIndex + index + 1;
                const deviceName = device.deviceName;
                const newName = renamedDevices[deviceName] || '';
                const hasError = validationErrors[deviceName];

                return (
                  <TableRow 
                    key={deviceName}
                    sx={{ 
                      '&:nth-of-type(odd)': { backgroundColor: '#fafafa' },
                      '&:hover': { backgroundColor: '#f0f0f0' }
                    }}
                  >
                    <TableCell sx={{ fontWeight: 500, color: '#666' }}>
                      {globalIndex}
                    </TableCell>
                    <TableCell>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontFamily: 'monospace',
                          backgroundColor: '#f5f5f5',
                          padding: '4px 8px',
                          borderRadius: 1,
                          fontSize: '0.85rem'
                        }}
                      >
                        {deviceName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <TextField
                          size="small"
                          placeholder="Enter new name..."
                          value={newName}
                          onChange={(e) => handleNameChange(deviceName, e.target.value)}
                          fullWidth
                          error={!!hasError}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              fontSize: '0.85rem',
                              fontFamily: 'monospace',
                              '&.Mui-focused': {
                                '& .MuiOutlinedInput-notchedOutline': {
                                  borderColor: hasError ? '#d32f2f' : '#fbcd0b'
                                }
                              }
                            }
                          }}
                        />
                        {hasError && (
                          <FormHelperText error sx={{ fontSize: '0.75rem', mt: 0.5 }}>
                            {hasError}
                          </FormHelperText>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            p: 2,
            borderTop: '1px solid #dee2e6',
            backgroundColor: '#f8f9fa'
          }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              sx={{
                '& .MuiPaginationItem-root': {
                  '&.Mui-selected': {
                    backgroundColor: '#fbcd0b',
                    color: '#fff',
                    '&:hover': {
                      backgroundColor: '#e3b900'
                    }
                  },
                  '& .MuiTouchRipple-root': {
                    display: 'none'
                  }
                }
              }}
            />
            <Typography 
              variant="caption" 
              sx={{ 
                ml: 2, 
                alignSelf: 'center',
                color: '#666'
              }}
            >
              Page {currentPage} of {totalPages}
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ 
        p: 2, 
        backgroundColor: '#f8f9fa',
        borderTop: '1px solid #dee2e6'
      }}>
        <CustomButton
          onClick={onClose}
          color="#6c757d"
          style={{ marginRight: '8px' }}
        >
          Cancel
        </CustomButton>
        <CustomButton
          onClick={handleSave}
          color="#fbcd0b"
          disabled={!hasChanges || Object.values(validationErrors).some(error => error)}
        >
          Save Changes
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
};

export default RenameDeviceModal;