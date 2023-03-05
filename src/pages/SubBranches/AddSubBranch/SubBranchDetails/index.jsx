/* eslint-disable no-console */
/* eslint-disable react/jsx-key */
import React from 'react';
import { Form, Input, Row, Col, Divider } from 'antd';
import Address from '@/components/Address';
import PhoneNumber from '@/components/PhoneNumber';
import { callApi } from '@/utils/apiUtils';
import { useParams } from 'umi';

const SubBranchDetails = ({ form, onCountryChange, setOnCountryChange }) => {
  const { subBranchId } = useParams();
  return (
    <div className="mb-5 bg-white rounded-lg shadow ">
      <p className="px-5 pt-5 text-base font-semibold text-gray-800 ">Sub branch details</p>
      <Divider />
      <div className="px-5 pb-3">
        <Row gutter={[12, 0]}>
          <Col lg={8} xl={8} md={8} sm={24} xs={24}>
            <span className="block mb-2 font-medium text-gray-800">Sub branch name</span>
            <Form.Item
              name={'clientName'}
              rules={[
                {
                  required: true,
                  message: 'Please enter sub branch!',
                },
              ]}
            >
              <Input size="large" placeholder={`Enter sub branch name here`} maxLength={100} />
            </Form.Item>
          </Col>

          <Col xl={8} lg={8} md={8} sm={24} xs={24}>
            <span className="block mb-2 font-medium text-gray-800">Email </span>
            <Form.Item
              name="primaryEmail"
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
          <Col xl={8} lg={8} md={12} sm={24} xs={24}>
            <span className="block mb-2 font-medium text-gray-800">Phone</span>
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
              form={form}
              name={['primaryPhone', 'phone']}
              placeholder="#####-#####"
            />
          </Col>
        </Row>
        <Address
          form={form}
          mainHeading="Street/Village (Optional)"
          secondaryHeadingVisibility={false}
          type={'primaryAddress'}
          pinCodeHeading="PIN code (Optional)"
          onCountryChange={onCountryChange}
          setOnCountryChange={setOnCountryChange}
        />
      </div>
    </div>
  );
};

export default SubBranchDetails;
