import * as React from 'react';
import Box from '@mui/material/Box';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { styled } from '@mui/material/styles';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CustomAlert from '../../../../CustomComponents/CustomAlert';

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

  const fallbackCopyTextToClipboard = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        setAlertOpen(true);
      }
    } catch (err) {
      console.error('Fallback: Copy failed', err);
    }

    document.body.removeChild(textArea);
  };

  const handleCopy = (event) => {
    if (copyText) {
      event.stopPropagation();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(copyText)
          .then(() => {
            setAlertOpen(true);
          })
          .catch(err => {
            console.error('Copy failed: ', err);
            fallbackCopyTextToClipboard(copyText);
          });
      } else {
        fallbackCopyTextToClipboard(copyText);
      }
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
    <Box sx={{ minHeight: 20, minWidth: 250 }}>
      <SimpleTreeView defaultExpandedItems={defaultExpandedItems}>
        {children}
      </SimpleTreeView>
    </Box>
  );
};
