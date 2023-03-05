import React from 'react';
import { Row, Col, Input, Form } from 'antd';

const BankDetails = () => {
  return (
    <div>
      <Row gutter={16}>
        <Col xs={24} sm={18} md={12} lg={6} xl={6}>
          <p className="font-medium text-gray-800">Bank name</p>
          <Form.Item name={['bankDetail', 'bankName']}>
            <Input size="large" placeholder="enter bank name" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={18} md={12} lg={6} xl={6}>
          <p className="font-medium text-gray-800">Account number</p>
          <Form.Item name={['bankDetail', 'accountNum']}>
            <Input size="large" type="number" placeholder="enter account number" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={18} md={12} lg={6} xl={6}>
          <p className="font-medium text-gray-800">IFSC code</p>
          <Form.Item name={['bankDetail', 'ifscCode']}>
            <Input size="large" placeholder="enter IFSC code" />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};

export default BankDetails;
