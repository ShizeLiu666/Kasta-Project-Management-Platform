import React, { useState, useEffect, useCallback } from 'react';
import { FormGroup, Label, Input, Card, CardBody, Row, Col } from 'reactstrap';

/**
 * Remote Binding Editor Component
 * Used for editing the remoteBind property of FIVE_BUTTON devices
 * Simplified to support only one binding per button
 */
const RemoteBindEditor = ({ value, onChange, config }) => {
  // Initialize binding
  const [binding, setBinding] = useState(null);
  
  // Create default binding from template or defaults
  const createDefaultBinding = useCallback(() => {
    return config?.template?.[0] || {
      bindType: 0,  // Device type to bind
      bindId: 0,    // DID of the device to bind (not deviceId)
      hour: 0,      // Timer hour
      min: 0,       // Timer minute
      state: 0,     // State after timer
      enable: 1,    // Whether timer is effective
      hasTimer: 0,  // Has timer or not
      hole: 1,      // Button position (1-5)
      bindChannel: 0  // Left or right channel
    };
  }, [config]);
  
  // Update binding when value changes
  useEffect(() => {
    if (value) {
      try {
        // If value is a string, try to parse as JSON
        const parsedValue = typeof value === 'string' ? JSON.parse(value) : value;
        
        // If array, take the first item, otherwise use as is
        const initialBinding = Array.isArray(parsedValue) ? 
          (parsedValue.length > 0 ? parsedValue[0] : null) : 
          parsedValue;
          
        setBinding(initialBinding || createDefaultBinding());
      } catch (e) {
        console.error('Failed to parse remoteBind value', e);
        setBinding(createDefaultBinding());
      }
    } else {
      // If no value, use template to create default binding
      setBinding(createDefaultBinding());
    }
  }, [value, createDefaultBinding]);

  // Update binding field
  const updateBinding = (field, value) => {
    if (!binding) return;
    
    const updatedBinding = {
      ...binding,
      [field]: value
    };
    
    setBinding(updatedBinding);
    onChange(JSON.stringify([updatedBinding])); // Always wrap in array for API consistency
  };

  // Render field
  const renderField = (fieldName, fieldConfig) => {
    if (!binding) return null;
    
    const { type, label, options, optionLabels, min, max } = fieldConfig;
    
    // Special handling for bindId field to allow direct input
    if (fieldName === 'bindId') {
      return (
        <FormGroup key={fieldName}>
          <Label>{label}</Label>
          <Input
            type="number"
            value={binding[fieldName]}
            onChange={(e) => updateBinding(fieldName, Number(e.target.value))}
            placeholder="Enter device DID to bind"
          />

        </FormGroup>
      );
    }
    
    switch (type) {
      case 'select':
        return (
          <FormGroup key={fieldName}>
            <Label>{label}</Label>
            <Input
              type="select"
              value={binding[fieldName]}
              onChange={(e) => {
                const value = e.target.value;
                // If numeric option, convert to number
                updateBinding(fieldName, !isNaN(Number(value)) ? Number(value) : value);
              }}
            >
              {Array.isArray(options) && options.map((option, i) => {
                // Handle both simple values and {value, label} objects
                if (typeof option === 'object' && option !== null && 'value' in option) {
                  return (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  );
                } else {
                  return (
                    <option key={option} value={option}>
                      {optionLabels && i < optionLabels.length ? optionLabels[i] : option}
                    </option>
                  );
                }
              })}
            </Input>
            {fieldConfig.description && (
              <small className="form-text text-muted">{fieldConfig.description}</small>
            )}
          </FormGroup>
        );
        
      case 'number':
        return (
          <FormGroup key={fieldName}>
            <Label>{label}</Label>
            <Input
              type="number"
              value={binding[fieldName]}
              min={min}
              max={max}
              onChange={(e) => updateBinding(fieldName, Number(e.target.value))}
            />
            {fieldConfig.description && (
              <small className="form-text text-muted">{fieldConfig.description}</small>
            )}
          </FormGroup>
        );
        
      default:
        return (
          <FormGroup key={fieldName}>
            <Label>{label}</Label>
            <Input
              type="text"
              value={binding[fieldName]}
              onChange={(e) => updateBinding(fieldName, e.target.value)}
            />
            {fieldConfig.description && (
              <small className="form-text text-muted">{fieldConfig.description}</small>
            )}
          </FormGroup>
        );
    }
  };

  if (!binding) return <div>Loading...</div>;

  return (
    <div className="remote-bind-editor">
      <div className="mb-3">
        <h6 className="mb-0">Button Binding Configuration</h6>
      </div>
      
      <Card className="mb-3 border">
        <CardBody>
          <Row>
            {/* Button Position (hole) field should be first */}
            <Col md={6}>
              {config?.fields?.hole && renderField('hole', config.fields.hole)}
            </Col>
            
            {/* Binding ID field should be next */}
            <Col md={6}>
              {config?.fields?.bindId && renderField('bindId', config.fields.bindId)}
            </Col>
            
            {/* Other fields */}
            {config?.fields && Object.entries(config.fields)
              .filter(([fieldName]) => fieldName !== 'hole' && fieldName !== 'bindId')
              .map(([fieldName, fieldConfig]) => (
                <Col md={fieldName === 'hasTimer' ? 12 : 6} key={fieldName}>
                  {renderField(fieldName, fieldConfig)}
                </Col>
              ))}
          </Row>
          
          {/* Conditional rendering for timer-related fields */}
          {binding.hasTimer === 1 && (
            <div className="mt-2 p-2 bg-light rounded">
              <h6>Timer Settings</h6>
              <Row>
                <Col md={6}>
                  {config?.fields?.hour && renderField('hour', config.fields.hour)}
                </Col>
                <Col md={6}>
                  {config?.fields?.min && renderField('min', config.fields.min)}
                </Col>
              </Row>
            </div>
          )}
        </CardBody>
      </Card>
      
      {/* Field descriptions */}
      <div className="mt-3">
        <details>
          <summary className="text-primary cursor-pointer">View Field Descriptions</summary>
          <div className="mt-2 p-3 bg-light rounded">
            <ul className="mb-0">
              {config?.fields && Object.entries(config.fields).map(([fieldName, fieldConfig]) => (
                <li key={fieldName}>
                  <strong>{fieldConfig.label}</strong>: {fieldConfig.description}
                </li>
              ))}
            </ul>
          </div>
        </details>
      </div>
    </div>
  );
};

export default RemoteBindEditor; 