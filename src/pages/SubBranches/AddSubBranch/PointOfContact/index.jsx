import React from 'react';
import { Form, Input, Row, Col, Divider, Select } from 'antd';
import PhoneNumber from '@/components/PhoneNumber';
import { callApi } from '@/utils/apiUtils';
import { useParams } from 'umi';

const PointOfContact = ({ form, setCode, code }) => {
  const { Option } = Select;
  const { subBranchId } = useParams();
  return (
    <div className="mb-5 bg-white rounded-lg shadow">
      <p className="px-5 pt-5 text-base font-semibold text-gray-800">Point of contact</p>
      <Divider />
      <div className="px-5 pb-3">
        <Row gutter={[12, 0]}>
          <Col lg={3} xl={3} md={12} sm={24} xs={24}>
            <span className="block mb-2 font-medium text-gray-800">Title</span>
            <Form.Item
              name={['clientPoc', 'prefix']}
              rules={[
                {
                  required: true,
                  message: 'Please enter Title!',
                },
              ]}
            >
              <Select
                size="large"
                placeholder="Title"
                getPopupContainer={(node) => node.parentNode}
              >
                <Option value="Mr">Mr</Option>
                <Option value="Miss">Miss</Option>
                <Option value="Mrs">Mrs</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col lg={7} xl={7} md={12} sm={24} xs={24}>
            <span className="block mb-2 font-medium text-gray-800">First name</span>
            <Form.Item
              name={['clientPoc', 'firstName']}
              rules={[
                {
                  required: true,
                  message: 'Please enter first name! ',
                },
                {
                  pattern: /^[a-zA-Z ]*$/,
                  message: 'Please enter text only',
                },
              ]}
            >
              <Input size="large" placeholder="Enter first name here" />
            </Form.Item>
          </Col>

          <Col lg={7} xl={7} md={12} sm={24} xs={24}>
            <span className="block mb-2 font-medium text-gray-800">Middle name (Optional)</span>
            <Form.Item
              name={['clientPoc', 'middleName']}
              rules={[
                {
                  pattern: /^[a-zA-Z ]*$/,
                  message: 'Please enter text only',
                },
              ]}
            >
              <Input size="large" placeholder="Enter middle name here" />
            </Form.Item>
          </Col>

          <Col lg={7} xl={7} md={12} sm={24} xs={24}>
            <span className="block mb-2 font-medium text-gray-800 ">Last name </span>
            <Form.Item
              name={['clientPoc', 'lastName']}
              rules={[
                { required: true, message: 'Please enter last name' },
                {
                  pattern: /^[a-zA-Z ]*$/,
                  message: 'Please enter text only',
                },
              ]}
            >
              <Input size="large" placeholder="Enter last name here" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[24, 0]}>
          {subBranchId ? (
            <Col xl={8} lg={8} md={8} sm={24} xs={24}>
              <span className="block mb-2 font-medium text-gray-800">Email </span>
              <Form.Item name={['clientPoc', 'primaryEmail']}>
                <Input size="large" disabled type="email" placeholder="john.doe@domain.com" />
              </Form.Item>
            </Col>
          ) : (
            <Col xl={8} lg={8} md={8} sm={24} xs={24}>
              <span className="block mb-2 font-medium text-gray-800">Email </span>
              <Form.Item
                name={['clientPoc', 'primaryEmail']}
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: "Email can't be blank!",
                  },
                  ({ getFieldError }) => ({
                    validator(rule, value) {
                      if (!subBranchId) {
                        const a = getFieldError('email');
                        if (
                          a.includes("'email' is not a valid email") ||
                          !value ||
                          value.length < 2
                        ) {
                          return Promise.resolve();
                        }
                        return callApi(
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

                          .catch(() =>
                            Promise.reject(
                              new Error('Email already exists. Try again with another email!'),
                            ),
                          );
                        // eslint-disable-next-line no-else-return
                      } else {
                        return Promise.resolve();
                      }
                    },
                  }),
                  {
                    message: 'Please enter a valid email address!',
                    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  },
                ]}
              >
                <Input
                  size="large"
                  disabled={subBranchId}
                  type="email"
                  placeholder="john.doe@domain.com"
                />
              </Form.Item>
            </Col>
          )}
          <Col xl={8} lg={8} md={8} sm={24} xs={24}>
            <div className="">
              <span className="block mb-2 font-medium text-gray-800">Phone</span>
              <PhoneNumber
                setCode={setCode}
                code={code}
                countryCode={['phone', 'countryCode']}
                rules={[
                  {
                    required: true,
                    message: "Phone number can't be blank!",
                    min: 10,
                    len: 10,
                  },
                ]}
                form={form}
                name={['phone', 'phone']}
                placeholder="#####-#####"
              />
            </div>
          </Col>
          <Col xl={8} lg={8} md={8} sm={24} xs={24}>
            <div className="">
              <span className="block mb-2 font-medium text-gray-800">Alternate phone</span>
              <PhoneNumber
                setCode={setCode}
                code={code}
                countryCode={['alternatePhone', 'countryCode']}
                rules={[
                  {
                    required: true,
                    message: "Alternate phone number can't be blank!",
                    min: 10,
                    len: 10,
                  },
                ]}
                form={form}
                name={['alternatePhone', 'phone']}
                placeholder="#####-#####"
              />
            </div>
          </Col>
          <Col lg={8} xl={8} md={8} sm={24} xs={24}>
            <span className="block mb-2 font-medium text-gray-800 ">Designation</span>
            <Form.Item
              name={['clientPoc', 'designation']}
              rules={[{ required: true, message: 'Please enter designation' }]}
            >
              <Input size="large" placeholder="Enter designation here" />
            </Form.Item>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default PointOfContact;
