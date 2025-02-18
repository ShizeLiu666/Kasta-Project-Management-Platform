import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Paper,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const AutomationDialog = ({ open, onClose, automations }) => {
  const [expanded, setExpanded] = useState(false);

  // 确保 automations 是数组
  const automationList = Array.isArray(automations) ? automations : [];

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const renderTriggers = (triggers = []) => (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle2" color="textSecondary" gutterBottom>
        Triggers
      </Typography>
      {triggers.map((trigger, index) => (
        <Paper key={index} elevation={0} sx={{ p: 1, mb: 1, bgcolor: '#f5f5f5' }}>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Typography variant="caption" color="textSecondary">
                Signal Hole: {trigger.signalHole}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" color="textSecondary">
                Active Type: {trigger.activeType}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Chip
                size="small"
                label={trigger.durationEnable ? 
                  `Duration: ${trigger.duration}ms` : 
                  'No Duration'
                }
                sx={{ mt: 1 }}
              />
            </Grid>
          </Grid>
        </Paper>
      ))}
    </Box>
  );

  const renderActions = (actions = []) => (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle2" color="textSecondary" gutterBottom>
        Actions
      </Typography>
      {actions.map((action, index) => (
        <Paper key={index} elevation={0} sx={{ p: 1, mb: 1, bgcolor: '#f5f5f5' }}>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Typography variant="caption" color="textSecondary">
                Signal Hole: {action.signalHole}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" color="textSecondary">
                Action Type: {action.activeType}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Chip
                size="small"
                label={action.durationEnable ? 
                  `Duration: ${action.duration}ms` : 
                  'No Duration'
                }
                sx={{ mt: 1 }}
              />
            </Grid>
          </Grid>
        </Paper>
      ))}
    </Box>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Automation Rules
      </DialogTitle>
      <DialogContent>
        {automationList.length > 0 ? (
          automationList.map((automation, index) => (
            <Accordion
              key={index}
              expanded={expanded === `panel${index}`}
              onChange={handleChange(`panel${index}`)}
              sx={{ mb: 1 }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Grid container alignItems="center" spacing={1}>
                  <Grid item>
                    <Typography variant="subtitle1">
                      {automation.name || `Rule ${index + 1}`}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Chip
                      size="small"
                      label={automation.state ? 'Enabled' : 'Disabled'}
                      color={automation.state ? 'success' : 'default'}
                    />
                  </Grid>
                  {automation.periodEnable && (
                    <Grid item>
                      <Chip
                        size="small"
                        label={`${automation.startHour}:${automation.startMinute} - ${automation.stopHour}:${automation.stopMinute}`}
                      />
                    </Grid>
                  )}
                </Grid>
              </AccordionSummary>
              <AccordionDetails>
                <Box>
                  {renderTriggers(automation.triggerList)}
                  {renderActions(automation.actionList)}
                </Box>
              </AccordionDetails>
            </Accordion>
          ))
        ) : (
          <Typography color="textSecondary" align="center">
            No automation rules configured
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AutomationDialog;