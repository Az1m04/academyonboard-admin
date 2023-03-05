import React from 'react';
import { Form, Row, Col, Input, Select } from 'antd';
import PhoneNumber from '@/components/PhoneNumber';
import TextArea from 'antd/lib/input/TextArea';

const BasicDetailsForm = ({ form }) => {
  const { Option } = Select;

  const referenceList = [
    {
      label: 'Web Inquiry',
    },
    {
      label: 'Office',
    },
    {
      label: 'Walkin ',
    },
    {
      label: 'Staff Ref',
    },
    {
      label: 'Student Ref',
    },
  ];
  return (
    <div>
      <div className="">
        <div className="mb-4">
          <div className="formLabel">Company name</div>
          <Form.Item
            name={'company_name'}
            rules={[
              {
                required: true,
                message: 'Please enter company name',
              },
            ]}
          >
            <Input size="large" placeholder="Enter company name here" maxLength={100} />
          </Form.Item>
        </div>

        <Row gutter={[24, 12]}>
          <Col lg={4} xl={4} md={4} sm={24} xs={24}>
            <div className="formLabel">Title</div>
            <Form.Item name={'title'}>
              <Input size="large" placeholder="Mr/Miss/Mrs." />
            </Form.Item>
          </Col>
          <Col lg={10} xl={10} md={10} sm={24} xs={24}>
            <div className="font-medium text-gray-800">First name</div>
            <Form.Item
              name={'first_name'}
              rules={[
                {
                  required: true,
                  message: 'Please enter first name of the contact person',
                },
              ]}
            >
              <Input size="large" placeholder="First name of contact person" />
            </Form.Item>
          </Col>
          <Col lg={10} xl={10} md={10} sm={24} xs={24}>
            <div className="font-medium text-gray-800">Last name</div>
            <Form.Item name={'last_name'}>
              <Input size="large" placeholder="Last name of contact person" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[24, 12]}>
          <Col xl={12} lg={12} md={24} sm={24} xs={24}>
            <div className="font-semibold text-gray-800">Phone Number</div>
            <Form.Item required>
              <PhoneNumber
                countryCode={['contacts', 'country_code']}
                rules={[
                  {
                    required: true,
                    message: "Phone number can't be blank!",
                    min: 10,
                    len: 10,
                  },
                ]}
                form={form}
                name={['contacts', 'phone']}
                placeholder="Enter phone number"
              />
            </Form.Item>
          </Col>
          <Col xl={12} lg={12} md={24} sm={24} xs={24}>
            <div className="font-medium text-gray-800">Alternate mobile number</div>
            <Form.Item name={'alternate_number'}>
              <Input size="large" placeholder="Alternate mobile number" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[24, 12]}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <div className="font-medium text-gray-800">Email</div>
            <Form.Item
              name={'email'}
              rules={[
                {
                  message: 'Please enter a valid email!',
                  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                },
              ]}
            >
              <Input size="large" type="email" placeholder="john.doe@domain.com" />
            </Form.Item>
          </Col>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <div className="font-medium text-gray-800">Reference</div>
            <Form.Item style={{ marginBottom: 0 }} name="reference">
              <Select size="large" placeholder="Enter reference">
                {referenceList.map((item) => (
                  <Option key={item?.label} value={item?.label}>
                    {item?.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[24, 12]}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <div className="font-medium text-gray-800">Purpose</div>
            <Form.Item name="purpose">
              <TextArea
                size="large"
                placeholder="Enter purpose here"
                autoSize={{ minRows: 3, maxRows: 5 }}
              />
            </Form.Item>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default BasicDetailsForm;
