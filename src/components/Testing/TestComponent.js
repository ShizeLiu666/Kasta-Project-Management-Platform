import React, { useState } from 'react';
import { Row, Col, Button } from 'reactstrap';
// import { getToken } from '../auth';
// import axiosInstance from '../../config';
import CustomAlert from '../CustomAlert';
import ComponentCard from '../AuthCodeManagement/ComponentCard';
import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/dist/handsontable.full.min.css';
import { AllDeviceTypes } from '../projects/RoomConfigurations/ExcelProcessor/ExcelProcessor';

// 注册所有 Handsontable 模块
registerAllModules();

// 从 AllDeviceTypes 中提取设备类型
const deviceTypes = Object.keys(AllDeviceTypes);

// 获取指定设备类型的外观简称
const getAppearanceShortnames = (deviceType) => {
  const models = AllDeviceTypes[deviceType];
  if (!models) return [];
  
  // 处理嵌套结构（如 PowerPoint Type 和 Remote Control）
  if (typeof models === 'object' && !Array.isArray(models)) {
    return Object.values(models).flat();
  }
  return models;
};

const TestComponent = () => {
//   const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    isOpen: false,
    message: '',
    severity: 'success',
    duration: 3000
  });
  const [data, setData] = useState([
    ['', '', ''], // 空行
  ]);

  const columns = [
    {
      title: 'Device Type',
      type: 'dropdown',
      source: deviceTypes,
      allowInvalid: false
    },
    {
      title: 'Appearance Shortname',
      type: 'dropdown',
      source: function(query, process) {
        // 获取当前行的设备类型
        const row = this.instance.getSelectedLast()[0];
        const deviceType = this.instance.getDataAtCell(row, 0);
        return getAppearanceShortnames(deviceType);
      },
      allowInvalid: false
    },
    {
      title: 'Device Name',
      type: 'text',
      validator: function(value, callback) {
        if (!value) {
          callback(false);
        } else {
          callback(true);
        }
      }
    }
  ];

  const handleAddRow = () => {
    setData([...data, ['', '', '']]);
  };

  const handleSave = () => {
    // 验证数据
    const isValid = data.every(row => 
      row[0] && row[1] && row[2] // 检查必填字段
    );

    if (!isValid) {
      showAlert('Please fill in all required fields', 'error');
      return;
    }

    // TODO: 发送数据到服务器
    console.log('Saving data:', data);
    showAlert('Data saved successfully', 'success');
  };

  const showAlert = (message, severity = 'success', duration = 3000) => {
    setAlert({
      isOpen: true,
      message,
      severity,
      duration
    });
  };

  return (
    <ComponentCard title="Device Configuration">
      <Row>
        <Col>
          <CustomAlert
            isOpen={alert.isOpen}
            onClose={() => setAlert(prev => ({ ...prev, isOpen: false }))}
            message={alert.message}
            severity={alert.severity}
            autoHideDuration={alert.duration}
          />
          
          <div style={{ marginBottom: '10px' }}>
            <Button 
              color="primary"
              onClick={handleAddRow}
              style={{ marginRight: '10px' }}
            >
              Add Row
            </Button>
            <Button 
              color="success"
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </div>

          <HotTable
            data={data}
            columns={columns}
            colHeaders={['Device Type *', 'Appearance Shortname *', 'Device Name *']}
            rowHeaders={true}
            height="auto"
            licenseKey="non-commercial-and-evaluation"
            stretchH="all"
            width="100%"
            afterChange={(changes, source) => {
              if (changes && source !== 'loadData') {
                const [row, prop, oldValue, newValue] = changes[0];
                if (prop === 0) { // 如果改变的是 Device Type
                  const hot = changes[0].instance;
                  if (hot && typeof hot.setDataAtCell === 'function') {
                    hot.setDataAtCell(row, 1, '');
                  } else {
                    // 使用 setData 来更新整个数据
                    const newData = [...data];
                    newData[row][1] = '';
                    setData(newData);
                  }
                }
                console.log(`Cell changed: row ${row}, ${prop}, from ${oldValue} to ${newValue}`);
              }
            }}
          />
        </Col>
      </Row>
    </ComponentCard>
  );
};

export default TestComponent;