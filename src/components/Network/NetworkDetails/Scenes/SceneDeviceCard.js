import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const SceneDeviceCard = ({ device }) => {
  const renderAttributes = (attributes) => {
    return Object.entries(attributes).map(([key, value]) => (
      <Typography key={key} variant="body2" color="text.secondary">
        {key}: {value}
      </Typography>
    ));
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="subtitle1">
          Device ID: {device.deviceId}
        </Typography>
        {renderAttributes(device.attributes)}
      </CardContent>
    </Card>
  );
};