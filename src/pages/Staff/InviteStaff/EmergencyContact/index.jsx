import React from 'react';
import { Row, Col, Input, Form } from 'antd';
import PhoneNumber from '@/components/PhoneNumber';
import { callApi } from '@/utils/apiUtils';

const EmergencyContact = ({ form }) => {
  return (
    <div>
      <Row gutter={16}>
        <Col xs={24} sm={18} md={12} lg={6} xl={6}>
          <p className="font-medium text-gray-800">Name</p>
          <Form.Item
            name={['emergencyContact', 'name']}
            rules={[
              { required: true, message: 'Please enter name to proceed' },
              {
                pattern: /^[a-zA-Z ]*$/,
                message: 'Please enter text only',
              },
            ]}
          >
            <Input size="large" placeholder="Enter name here" />
          </Form.Item>
        </Col>
        <Col lg={6} xl={6} md={12} sm={18} xs={24}>
          <p className="font-medium text-gray-800 ">Phone</p>
          <PhoneNumber
            countryCode={['emergencyContact', 'primaryPhone', 'countryCode']}
            form={form}
            name={['emergencyContact', 'primaryPhone', 'phone']}
            placeholder="#####-#####"
            rules={[
              {
                message: 'Please enter valid mobile number',
                min: 10,
                len: 10,
              },
            ]}
          />
        </Col>
        <Col lg={6} xl={6} md={12} sm={18} xs={24}>
          <p className="font-medium text-gray-800">Email</p>
          <Form.Item
            name={['emergencyContact', 'primaryEmail']}
            rules={[
              ({ getFieldError }) => ({
                validator(rule, value) {
                  const a = getFieldError('email');
                  if (a.includes("'email' is not a valid email") || !value || value.length < 2) {
                    return Promise.resolve();
                  }
                  return (
                    callApi(
                      {
                        uriEndPoint: {
                          uri: '/user/isExistingLoginId',
                          method: 'GET',
                          version: '/xapi/v1',
                        },
                        query: {
                          user_id: value,
                        },
                      },
                      {
                        disableNotifications: true,
                      },
                    )
                      .then(() => Promise.resolve())
                      // eslint-disable-next-line prefer-promise-reject-errors
                      .catch(() => Promise.reject('Email already exists. Try again!'))
                  );
                },
              }),
              {
                message: 'Please enter a valid email address!',
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              },
            ]}
          >
            <Input size="large" placeholder="john.doe@domain.com" />
          </Form.Item>
        </Col>
        <Col lg={6} xl={6} md={12} sm={18} xs={24}>
          <p className="font-medium text-gray-800">Relation</p>
          <Form.Item
            name={['emergencyContact', 'relation']}
            rules={[{ required: true, message: 'Please enter relation' }]}
          >
            <Input size="large" placeholder="Enter your relation" />
          </Form.Item>
        </Col>
        <Col lg={6} xl={6} md={12} sm={18} xs={24}>
          <p className="font-medium text-gray-800">Address</p>
          <Form.Item name={['emergencyContact', 'location']}>
            <Input size="large" placeholder="Enter your address" />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};

export default EmergencyContact;
