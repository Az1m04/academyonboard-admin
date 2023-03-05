import PhoneNumber from '@/components/PhoneNumber';
import { Col, Form, Input, Row } from 'antd';
import React from 'react';

const AddPocForm = () => {
  return (
    <Row gutter={16}>
      <Col xs={24} sm={18} md={12} lg={12} xl={12}>
        <p className="font-medium text-gray-800">Name</p>
        <Form.Item name="name">
          <Input size="large" placeholder="enter name" />
        </Form.Item>
      </Col>
      <Col xs={24} sm={18} md={12} lg={12} xl={12}>
        <p className="font-medium text-gray-800">Email ID</p>
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              whitespace: true,
              message: "Email can't be blank!",
            },
            {
              message: 'Please enter a valid email address!',
              pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            },
          ]}
        >
          <Input size="large" placeholder="Enter email" />
        </Form.Item>
      </Col>
      <Col xs={24} sm={18} md={12} lg={8} xl={8}>
        <p className="font-medium text-gray-800">Phone no.</p>
        <PhoneNumber
          countryCode={['primaryPhone', 'countryCode']}
          rules={[
            {
              required: true,
              message: "Phone number can't be blank!",
              min: 10,
              len: 10,
            },
          ]}
          name={['primaryPhone', 'phone']}
          placeholder="#####-#####"
        />
      </Col>
      <Col xs={24} sm={18} md={12} lg={8} xl={8}>
        <p className="font-medium text-gray-800">Alt phone no.</p>
        <PhoneNumber
          countryCode={['primaryPhone', 'countryCode']}
          rules={[
            {
              required: true,
              message: "Phone number can't be blank!",
              min: 10,
              len: 10,
            },
          ]}
          name={['primaryPhone', 'phone']}
          placeholder="#####-#####"
        />
      </Col>

      <Col xs={24} sm={18} md={12} lg={8} xl={8}>
        <p className="font-medium text-gray-800">Designation</p>
        <Form.Item name="designation">
          <Input size="large" placeholder="enter designation" />
        </Form.Item>
      </Col>
    </Row>
  );
};

export default AddPocForm;
