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
      allowInvalid: false,
      strict: true,
      autoWrapRow: true,
      autoWrapCol: true
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

  // 检查 AllDeviceTypes 的内容
  console.log('AllDeviceTypes:', AllDeviceTypes);
  console.log('deviceTypes:', deviceTypes);

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

          <div style={{ 
            minHeight: '400px',  // 确保有足够的高度
            width: '100%',
            position: 'relative' // 确保下拉菜单定位正确
          }}>
            <HotTable
              data={data}
              columns={columns}
              colHeaders={['Device Type *', 'Appearance Shortname *', 'Device Name *']}
              rowHeaders={true}
              licenseKey="non-commercial-and-evaluation"
              stretchH="all"
              width="100%"
              height={300}
              autoWrapRow={true}
              autoWrapCol={true}
              dropdownMenu={true}
              contextMenu={true}
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
              afterRender={() => {
                console.log('Table rendered');
                console.log('Available device types:', deviceTypes);
              }}
              minSpareRows={1}
              minRows={5}
            />
          </div>
        </Col>
      </Row>
    </ComponentCard>
  );
};

export default TestComponent;