import * as React from 'react';
import Box from '@mui/material/Box';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { styled } from '@mui/material/styles';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CustomAlert from '../../../../CustomAlert';

const StyledTreeItem = styled(TreeItem)({
  '& .MuiTreeItem-label': {
    fontSize: '1rem',
    padding: '4px 0',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  '& .MuiTreeItem-content': {
    padding: '4px 8px',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)'
    },
    '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)' // 使用相同的背景色
    },
    '&.Mui-selected:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)' // 选中状态下的悬浮也使用相同的背景色
    }
  }
});

export const CustomTreeItem = React.forwardRef(({ copyText, label, ...props }, ref) => {
  const [alertOpen, setAlertOpen] = React.useState(false);

  const handleCopy = (event) => {
    if (copyText) {
      event.stopPropagation();
      navigator.clipboard.writeText(copyText);
      setAlertOpen(true);
    }
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const customLabel = copyText ? (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <ContentCopyIcon fontSize="small" />
      {label}
    </div>
  ) : label;

  return (
    <>
      <StyledTreeItem
        {...props}
        ref={ref}
        label={customLabel}
        onClick={copyText ? handleCopy : undefined}
        sx={{
          ...props.sx,
          cursor: copyText ? 'pointer' : 'default'
        }}
      />
      <CustomAlert
        isOpen={alertOpen}
        onClose={handleAlertClose}
        message="Copied to clipboard"
        severity="success"
        autoHideDuration={2000}
      />
    </>
  );
});

export const CustomTreeViewContainer = ({ children, defaultExpandedItems = [] }) => {
  return (
    <Box sx={{ minHeight: 352, minWidth: 250 }}>
      <SimpleTreeView defaultExpandedItems={defaultExpandedItems}>
        {children}
      </SimpleTreeView>
    </Box>
  );
};
