import React from 'react';
import { Row, Col, Input, Form, Select } from 'antd';
import PhoneNumber from '@/components/PhoneNumber';
import { callApi } from '@/utils/apiUtils';

const EmergencyStudentContact = ({ form, parentList }) => {
  return (
    <div className="px-4 mt-4">
      <Row gutter={12}>
        <Col lg={8} xl={8} md={24} sm={24} xs={24}>
          <p className="font-medium text-gray-800">Name</p>
          <Form.Item
            name={['emergencyContact', 'firstName']}
            rules={[
              {
                required: true,
                message: "Please enter emergency contact's name",
              },
              {
                pattern: /^[a-zA-Z ]*$/,
                message: 'Please enter text only',
              },
            ]}
          >
            <Input size="large" placeholder="Enter contact's name" autoComplete="off" />
          </Form.Item>
        </Col>
        <Col lg={8} xl={8} md={24} sm={24} xs={24}>
          <p className="font-medium text-gray-800 ">Phone</p>
          <PhoneNumber
            countryCode={['emergencyContact', 'primaryPhone', 'countryCode']}
            form={form}
            name={['emergencyContact', 'primaryPhone', 'phone']}
            placeholder="#####-#####"
            rules={[
              {
                required: true,
                message: "Phone number can't be blank",
                min: 10,
                len: 10,
              },
            ]}
          />
        </Col>
        <Col lg={8} xl={8} md={24} sm={24} xs={24}>
          <p className="font-medium text-gray-800">Email</p>
          <Form.Item
            name={['emergencyContact', 'primaryEmail']}
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Email can't be blank!",
              },
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
            <Input size="large" placeholder="john.doe@domain.com" autoComplete="off" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={12}>
        {/* <Col lg={12} xl={12} md={24} sm={24} xs={24}>
          <p className="font-medium text-gray-800">Relation</p>
          <Form.Item
            name={['emergencyContact', 'relation']}
            rules={[
              {
                required: true,
                message: 'Please enter your relation with emergency contact',
              },
            ]}
          >
            <Input size="large" placeholder="Enter your relation" autoComplete="off" />
          </Form.Item>
        </Col> */}
        <Col lg={12} xl={12} md={24} sm={24} xs={24}>
          <p className="font-medium text-gray-800 ">Relation</p>
          <Form.Item
            name={['emergencyContact', 'relation']}
            rules={[
              {
                required: true,
                message: 'Please select relation first',
              },
            ]}
          >
            <Select
              size="large"
              getPopupContainer={(node) => node.parentNode}
              placeholder="Select a parent"
              optionFilterProp="children"
            >
              {parentList?.map((item) => (
                <Select.Option value={item?.id} key={item?.id}>
                  {item?.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col lg={12} xl={12} md={24} sm={24} xs={24}>
          <p className="font-medium text-gray-800">Address</p>
          <Form.Item
            name={['emergencyContact', 'location']}
            rules={[
              {
                required: true,
                message: "Please enter emergency contact's address",
              },
            ]}
          >
            <Input size="large" placeholder="Enter contact's address" autoComplete="off" />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};

export default EmergencyStudentContact;
