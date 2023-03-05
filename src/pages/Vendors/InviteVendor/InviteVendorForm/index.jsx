import PhoneNumber from '@/components/PhoneNumber';
import { Button, Input, Form, Row, Col, Radio, Select } from 'antd';
import React from 'react';
import { connect } from 'umi';

const { Option } = Select;

const InviteVendorForm = ({ loading, form }) => {
  const prefixSelector = (
    <Form.Item initialValue="Mr" name="title" noStyle>
      <Select style={{ width: 70 }}>
        <Option value="Mr">Mr</Option>
        <Option value="Mrs">Mrs</Option>
        <Option value="Other">Other</Option>
      </Select>
    </Form.Item>
  );

  return (
    <div className="bg-white rounded shadow">
      <div className="">
        <div className="px-4 py-3">
          <Row gutter={24}>
            <Col xl={8} lg={8} md={24} sm={24} xs={24}>
              <Form.Item
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
                <Input addonBefore={prefixSelector} placeholder="John" size="large" />
              </Form.Item>
            </Col>
            <Col xl={8} lg={8} md={24} sm={24} xs={24}>
              <Form.Item
                initialValue=""
                name="middleName"
                label={<span className="formLabel">Middle name</span>}
              >
                <Input placeholder="Kim" size="large" />
              </Form.Item>
            </Col>

            <Col xl={8} lg={8} md={24} sm={24} xs={24}>
              <Form.Item
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
                <Input placeholder="Doe" size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="email"
            label={<span className="formLabel">Email</span>}
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Email can't be blank!",
              },
              {
                type: 'email',
                message: 'Invalid email',
              },
            ]}
          >
            <Input placeholder="example@gmail.com" size="large" />
          </Form.Item>

          <Form.Item required label={<span className="font-semibold text-gray-800">Phone</span>}>
            <PhoneNumber
              countryCode={['phone', 'countryCode']}
              rules={[
                {
                  required: true,
                  message: "Phone number can't be blank!",
                },
                {
                  min: 10,
                  len: 10,
                  message: 'Invalid phone',
                },
              ]}
              form={form}
              name={['phone', 'phone']}
              placeholder="Enter phone number"
            />
          </Form.Item>

          <Form.Item
            initialValue="ED_INSTITUTE"
            name="role"
            label={<span className="font-semibold text-gray-800">Refrence type</span>}
            rules={[
              {
                required: true,
                message: 'Please pick an item!',
              },
            ]}
          >
            <Radio.Group buttonStyle="solid">
              <Radio.Button value="ED_INSTITUTE">Edu Institution</Radio.Button>
              <Radio.Button value="TEACHER">Teacher</Radio.Button>
              <Radio.Button value="SERVICE_PROVIDER">Service Provider</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </div>

        {/* Save/Update button */}
        <div className="px-4 py-3 text-right bg-gray-50 sm:px-6">
          <Button
            loading={loading}
            type="primary"
            size="medium"
            className="text-center text-white flex-end"
            onClick={() => {
              form.submit();
            }}
          >
            Send invitation
          </Button>
        </div>
      </div>
    </div>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['vendor/inviteVendor'],
}))(InviteVendorForm);
