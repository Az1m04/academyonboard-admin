import React from 'react';
import { Row, Col, Input, Form } from 'antd';

const BankDetails = () => {
  return (
    <div>
      <Row gutter={16}>
        <Col xs={24} sm={18} md={12} lg={6} xl={6}>
          <p className="font-medium text-gray-800">Bank Name</p>
          <Form.Item
            name={'bankName'}
            rules={[{ required: true, message: 'Please enter name to proceed' }]}
          >
            <Input size="large" placeholder="Enter Bank Name" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={18} md={12} lg={6} xl={6}>
          <p className="font-medium text-gray-800">Account Number</p>
          <Form.Item
            name={'accountNumber'}
            rules={[{ required: true, message: 'Please enter name to proceed' }]}
          >
            <Input size="large" type="number" placeholder="Enter Account Number" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={18} md={12} lg={6} xl={6}>
          <p className="font-medium text-gray-800">IFSC Code</p>
          <Form.Item
            name={'ifscCode'}
            rules={[{ required: true, message: 'Please enter name to proceed' }]}
          >
            <Input size="large" placeholder="Enter IFSC Code" />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};

export default BankDetails;
