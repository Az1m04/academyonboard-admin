import Address from '@/components/Address';
import { Button, Form, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';

const VendorDetailsForm = ({ currentUser, dispatch }) => {
  const [form] = Form.useForm();
  // eslint-disable-next-line no-unused-vars
  const [formValues, setFormValues] = useState();
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('IN');
  const [onCountryChange, setOnCountryChange] = useState('IN');
  useEffect(() => {
    if (currentUser) {
      setSelectedCountry(currentUser?.personalDetails?.address?.countryCode);
    }
  }, [currentUser]);

  return (
    <div className="bg-white rounded shadow p-4">
      <Form
        form={form}
        hideRequiredMark
        layout="vertical"
        colon={false}
        onValuesChange={(values) => setFormValues(values)}
        initialValues={{
          address: {
            addressLine1: currentUser?.personalDetails?.address?.addressLine1,
            addressLine2: currentUser?.personalDetails?.address?.addressLine2,
            stateCode: currentUser?.personalDetails?.address?.stateCode,
            postalCode: currentUser?.personalDetails?.address?.postalCode,
            countryCode: currentUser?.personalDetails?.address?.countryCode,
            city: currentUser?.personalDetails?.address?.city,
          },
        }}
        onFinish={(values) => {
          setLoading(true);
          dispatch({
            type: 'user/updateCurrent',
            payload: {
              body: {
                personalDetails: values,
              },
            },
          }).then((res) => {
            if (res) {
              dispatch({
                type: 'user/fetchCurrent',
                payload: {},
              }).then(() => {
                message.success('Address updated successfully');
                setLoading(false);
              });
            } else {
              setLoading(false);
            }
          });
        }}
      >
        <Address
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          type="address"
          form={form}
          onCountryChange={onCountryChange}
          setOnCountryChange={setOnCountryChange}
        />
        <div className="text-right ">
          <Button
            htmlType="submit"
            type="primary"
            size="medium"
            loading={loading}
            className="text-center text-white flex-end"
          >
            {currentUser?.personalDetails?.address?.addressLine1 ? 'Update' : 'Save'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default connect(({ user }) => ({
  currentUser: user.currentUser,
}))(VendorDetailsForm);
