/* eslint-disable no-console */
/* eslint-disable react/jsx-key */
import React from 'react';
import { Input, Row, Col, Select, Form, Divider } from 'antd';

const AddressForm = ({ form }) => {
  const { Option } = Select;

  const countryName = [
    {
      id: 'IND',
      value: 'INDIA',
    },
  ];

  const states = [
    {
      id: 'PUN',
      value: 'PUNJAB',
    },
    {
      id: 'ASM',
      value: 'ASAM',
    },
    {
      id: 'CHD',
      value: 'CHANDIGARH',
    },
    {
      id: 'HAR',
      value: 'HARYANA',
    },
  ];

  console.log(`form`, form);
  return (
    <div className="bg-white rounded-lg mb-5 shadow">
      <p className="text-base text-gray-800 font-semibold px-5 pt-5">Address details</p>
      <Divider />
      <div className="p-5">
        <Row gutter={[24, 12]}>
          <Col xl={12} lg={12} md={24} sm={24} xs={24}>
            <span className="font-medium text-gray-800 block mb-2">Street/Village</span>
            <Form.Item
              name="street/villageInput"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: 'Please enter street/village details!',
                },
              ]}
            >
              <Input placeholder="123 Hill St." size="large" autoComplete="dontshow" />
            </Form.Item>
          </Col>

          <Col xl={12} lg={12} md={24} sm={24} xs={24}>
            <span className="font-medium text-gray-800 block mb-2">City</span>
            <Form.Item
              name="cityInput"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: 'Please enter your city!',
                },
              ]}
            >
              <Input autoComplete="dontshow" size="large" placeholder="City" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[24, 12]}>
          <Col xl={8} lg={8} md={12} sm={24} xs={24}>
            <span className="font-medium text-gray-800 block mb-2">Postal / ZIP code</span>
            <Form.Item
              name="postal/zipCodeInput"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: 'Please enter your Postal / ZIP code!',
                },
              ]}
            >
              <Input autoComplete="dontshow" size="large" placeholder="Postal / ZIP code" />
            </Form.Item>
          </Col>

          <Col xl={8} lg={8} md={12} sm={24} xs={24}>
            <span className="font-medium text-gray-800 block mb-2">Country</span>
            <Form.Item
              name="countryInput"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Country can't be blank!",
                },
              ]}
            >
              <Select size="large" placeholder="Select a country" autoComplete="dontshow">
                {countryName.map((item) => (
                  <Option value={item.id}>{item.value}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xl={8} lg={8} md={12} sm={24} xs={24}>
            <span className="font-medium text-gray-800 block mb-2">State</span>
            <Form.Item
              name="stateInput"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: 'Select your state !',
                },
              ]}
            >
              <Select
                allowClear
                showSearch
                size="large"
                placeholder="state"
                optionFilterProp="children"
                getPopupContainer={(node) => node.parentNode}
              >
                {states.map((item) => (
                  <Option value={item.id}>
                    {item.value} ({item.id})
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AddressForm;
