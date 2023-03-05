import { Col, Row, Select, Form } from 'antd';
import React from 'react';

const AssignAccess = () => {
  const { Option } = Select;
  return (
    <Row gutter={16}>
      <Col xs={24} sm={12} md={12} lg={12} xl={12}>
        <p className="font-medium text-gray-800">Select main services</p>
        <Form.Item name="main_services">
          <Select
            getPopupContainer={(trigger) => trigger.parentNode}
            size="large"
            className="w-full"
            onSelect={(val) => {
              console.log(val);
            }}
            placeholder="select main services"
          >
            <Option value="Visas">Visas</Option>
            <Option value="Courses">Courses</Option>
            <Option value="Others">Others</Option>
          </Select>
        </Form.Item>
      </Col>
      <Col xs={24} sm={12} md={12} lg={12} xl={12}>
        <p className="font-medium text-gray-800">Select sub services</p>
        <Form.Item name="sub_services">
          <Select
            getPopupContainer={(trigger) => trigger.parentNode}
            size="large"
            className="w-full"
            onSelect={(val) => {
              console.log(val);
            }}
            placeholder="select sub services"
          >
            <Option value="Student Visa">Student Visa</Option>
            <Option value="Visitor Visa">Visitor Visa</Option>
          </Select>
        </Form.Item>
      </Col>
    </Row>
  );
};

export default AssignAccess;
