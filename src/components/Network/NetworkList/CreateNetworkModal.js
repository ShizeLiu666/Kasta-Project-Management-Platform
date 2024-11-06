import React, { useState } from 'react';
import CustomModal from '../../CustomModal';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import axiosInstance from '../../../config';
import { getToken } from '../../auth';

const CreateNetworkModal = ({ isOpen, toggle, onSuccess, currentNetworkId }) => {
  const [networkData, setNetworkData] = useState({
    meshName: '',
    passphrase: '',
    // isCurrentNetwork: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    /* const value = e.target.type === 'select-one' 
      ? e.target.value === 'true' 
      : e.target.value; */

    setNetworkData({
      ...networkData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    const token = getToken();
    if (!token) {
      setError("Authentication token not found, please log in again");
      setIsSubmitting(false);
      return;
    }

    try {
      console.log('Creating network with data:', networkData);
      const createResponse = await axiosInstance.post('/networks', networkData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (createResponse.data.success) {
        console.log('Created network response:', createResponse.data);
        /* if (networkData.isCurrentNetwork && currentNetworkId) {
          try {
            await axiosInstance.put('/networks/selected', [{
              networkId: currentNetworkId,
              currentNetwork: false
            }], {
              headers: { Authorization: `Bearer ${token}` }
            });
          } catch (switchError) {
            console.error('Error updating previous current network:', switchError);
          }
        } */

        onSuccess('Network created successfully');
        setNetworkData({
          meshName: '',
          passphrase: '',
          // isCurrentNetwork: false
        });
        toggle();
      } else {
        setError(createResponse.data.errorMsg || 'Failed to create network');
      }
    } catch (err) {
      setError(err.response?.data?.errorMsg || 'Failed to create network');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CustomModal
      isOpen={isOpen}
      toggle={toggle}
      title="Create Network"
      onSubmit={handleSubmit}
      submitText="Create"
      isSubmitting={isSubmitting}
      error={error}
      submitButtonType={null}
    >
      <Form>
        <FormGroup>
          <Label for="meshName">Network Name</Label>
          <Input
            type="text"
            name="meshName"
            id="meshName"
            value={networkData.meshName}
            onChange={handleChange}
            placeholder="Enter network name"
          />
        </FormGroup>
        <FormGroup>
          <Label for="passphrase">
            Passphrase
            <span style={{ 
              color: '#dc3545', 
              fontSize: '0.875rem',
              marginLeft: '8px' 
            }}>
              *Cannot be modified after creation
            </span>
          </Label>
          <Input
            type="text"
            name="passphrase"
            id="passphrase"
            value={networkData.passphrase}
            onChange={handleChange}
            placeholder="Enter passphrase"
          />
        </FormGroup>
        {/* <FormGroup>
          <Label for="isCurrentNetwork">Set as Current Network</Label>
          <Input
            type="select"
            name="isCurrentNetwork"
            id="isCurrentNetwork"
            value={networkData.isCurrentNetwork}
            onChange={handleChange}
          >
            <option value={true}>Yes</option>
            <option value={false}>No</option>
          </Input>
        </FormGroup> */}
        <small className="text-muted" style={{ display: 'block', marginTop: '10px' }}>
          Note: The newly created network will automatically become your current network.
        </small>
      </Form>
    </CustomModal>
  );
};

export default CreateNetworkModal;