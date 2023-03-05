import PhoneNumber from '@/components/PhoneNumber';
import UploadAvatar from '@/components/UploadAvatar';
import { Button, Input, Form, message, Row, Col } from 'antd';
import React, { useState } from 'react';
import { connect } from 'umi';

const BasicDetailsForm = ({ currentUser, dispatch }) => {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  return (
    <div className="bg-white rounded shadow">
      <Form
        hideRequiredMark
        layout="vertical"
        colon={false}
        initialValues={{
          phone: {
            phone: currentUser?.personalDetails?.primaryPhone?.areaCode
              ? `${currentUser?.personalDetails?.primaryPhone?.areaCode}${currentUser?.personalDetails?.primaryPhone?.phone}`
              : '',
          },
        }}
        onFinish={(values) => {
          const body = {
            personalDetails: {
              firstName: values.firstName,
              middleName: values.middleName,
              lastName: values.lastName,
              phone: {
                countryCode: values.phone.countryCode,
                areaCode: values.phone.phone.substring(0, 3),
                phone: values.phone.phone.substring(3),
              },
            },
          };

          setLoading(true);
          dispatch({
            type: 'user/updateCurrent',
            payload: {
              body,
            },
          }).then((res) => {
            if (res) {
              dispatch({
                type: 'user/fetchCurrent',
                payload: {},
              }).then(() => {
                message.success('Basic details updated successfully');
                setLoading(false);
              });
            } else {
              setLoading(false);
            }
          });
        }}
      >
        <div className="">
          <UploadAvatar />
          <div className="px-4 py-3">
            <Row gutter={24}>
              <Col xl={8} lg={8} md={24} sm={24} xs={24}>
                <Form.Item
                  initialValue={currentUser?.personalDetails?.firstName}
                  name="firstName"
                  label={<span className="formLabel">First name</span>}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: "First name can't be blank!",
                    },
                  ]}
                >
                  <Input placeholder="John" size="large" />
                </Form.Item>
              </Col>
              <Col xl={8} lg={8} md={24} sm={24} xs={24}>
                <Form.Item
                  initialValue={currentUser?.personalDetails?.middleName}
                  name="middleName"
                  label={<span className="formLabel">Middle name</span>}
                >
                  <Input placeholder="Kim" size="large" />
                </Form.Item>
              </Col>

              <Col xl={8} lg={8} md={24} sm={24} xs={24}>
                <Form.Item
                  initialValue={currentUser?.personalDetails?.lastName}
                  name="lastName"
                  label={<span className="formLabel">Last name</span>}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: "Last name can't be blank!",
                    },
                  ]}
                >
                  <Input size="large" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                <Form.Item
                  initialValue={currentUser?.personalDetails?.primaryEmail}
                  name="email"
                  label={<span className="formLabel">Email</span>}
                >
                  <Input disabled size="large" />
                </Form.Item>
              </Col>

              <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                <Form.Item
                  required
                  label={<span className="font-semibold text-gray-800">Phone</span>}
                >
                  <PhoneNumber
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
                    placeholder="Enter phone number"
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* Save/Update button */}
          <div className="px-4 py-3 text-right bg-gray-50 sm:px-6">
            <Button
              htmlType="submit"
              type="primary"
              size="medium"
              loading={loading}
              className="text-center text-white flex-end"
            >
              {currentUser?.personalDetails?.fullName ? 'Update' : 'Save'}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default connect(({ user }) => ({
  currentUser: user.currentUser,
}))(BasicDetailsForm);
