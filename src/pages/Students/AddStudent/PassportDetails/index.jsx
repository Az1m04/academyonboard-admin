import React from 'react';
import { Row, Col, Input, Form, DatePicker, Divider, message } from 'antd';
import Card from '@/components/Structure/Card';
import { useState } from 'react';

const PassportDetails = ({ form }) => {
  const [issueDate, setIssueDate] = useState();
  const [expiryDate, setExpiryDate] = useState();

  return (
    <Card>
      <h2 className="p-5 text-base font-semibold text-gray-800">Passport details</h2>
      <Divider style={{ margin: '0' }} />
      <div className="px-4 mt-4">
        <Row gutter={12}>
          <Col lg={8} xl={8} md={24} sm={24} xs={24}>
            <p className="font-medium text-gray-800">Passport no.</p>
            <Form.Item
              name="passPortNo"
              rules={[
                {
                  required: true,
                  message: 'Please enter passport no.',
                },
              ]}
            >
              <Input size="large" placeholder="Enter passport no." autoComplete="off" />
            </Form.Item>
          </Col>
          <Col lg={8} xl={8} md={24} sm={24} xs={24}>
            <p className="font-medium text-gray-800 ">Issue date</p>
            <Form.Item
              name="issueDate"
              rules={[
                {
                  required: true,
                  message: 'Please select other course',
                },
              ]}
            >
              <DatePicker
                size="large"
                style={{ width: '100%' }}
                placeholder="Select issue date"
                onChange={(value) => {
                  setExpiryDate();
                  setIssueDate(value);
                  form.setFieldsValue({
                    expDate: undefined,
                  });
                }}
              />
            </Form.Item>
          </Col>
          <Col lg={8} xl={8} md={24} sm={24} xs={24}>
            <p className="font-medium text-gray-800 ">Expiry date</p>
            <Form.Item
              name="expDate"
              rules={[
                {
                  required: true,
                  message: 'Please select passport expiry date',
                },
              ]}
            >
              <DatePicker
                value={expiryDate}
                size="large"
                style={{ width: '100%' }}
                placeholder="Select expiry date"
                disabledDate={(current) => current.valueOf() < issueDate}
                onChange={(val) => {
                  if (!issueDate) {
                    message.error('Please select issue date first');
                  } else {
                    setExpiryDate(val);
                  }
                }}
              />
            </Form.Item>
          </Col>
        </Row>
      </div>
    </Card>
  );
};

export default PassportDetails;
