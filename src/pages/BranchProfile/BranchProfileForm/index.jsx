import { Row, Col, Input, Form, Select } from 'antd';
import React from 'react';
import PhoneNumber from '@/components/PhoneNumber';
import CardSection from '@/components/CardSection';
import AssignAccess from './AssignAccess';
import UploadBranchDocs from './UploadBranchDocs';
import DigitalySignedAggrement from './DigitallySignedAggrement';
import AddPocForm from './AddPocForm';

const BranchProfileForm = ({ form }) => {
  const { Option } = Select;
  return (
    <>
      <CardSection
        className="mt-4"
        leftContent={
          <div className="pr-8 ">
            <div className="text-blue-900 font-semibold text-xl">Add branch</div>
            <div className="text-gray-600">Add Bank account details.</div>
          </div>
        }
        rightContent={
          <div className="bg-white shadow rounded p-4">
            <Row gutter={16}>
              <Col xs={24} sm={18} md={12} lg={6} xl={6}>
                <p className="font-medium text-gray-800">Select client from leads </p>
                <Form.Item name="client">
                  <Select
                    getPopupContainer={(trigger) => trigger.parentNode}
                    size="large"
                    className="w-full"
                    onSelect={(val) => {
                      console.log(val);
                    }}
                    placeholder="select client"
                  >
                    <Option value="client_1">client_1</Option>
                    <Option value="client_2">client_2</Option>
                    <Option value="client_3">client_3</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={18} md={12} lg={6} xl={6}>
                <p className="font-medium text-gray-800">Account number</p>
                <Form.Item name="accountNumber">
                  <Input size="large" type="number" placeholder="enter account number" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={18} md={12} lg={6} xl={6}>
                <p className="font-medium text-gray-800">Rewrite account number</p>
                <Form.Item name="reaccountNumber">
                  <Input size="large" type="number" placeholder="rewrite account number" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={18} md={12} lg={6} xl={6}>
                <p className="font-medium text-gray-800">Bank name</p>
                <Form.Item name="bankName">
                  <Input size="large" placeholder="enter bank name" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={18} md={12} lg={12} xl={12}>
                <p className="font-medium text-gray-800">Bank address</p>
                <Form.Item name="bank_address">
                  <Input size="large" placeholder="enter bank address" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={18} md={12} lg={6} xl={6}>
                <p className="font-medium text-gray-800">IFSC code</p>
                <Form.Item name="ifscCode">
                  <Input size="large" placeholder="enter IFSC code" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={18} md={12} lg={6} xl={6}>
                <p className="font-medium text-gray-800">SWIFT code</p>
                <Form.Item name="swiftCode">
                  <Input size="large" placeholder="enter SWIFT code" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={18} md={12} lg={12} xl={12}>
                <p className="font-medium text-gray-800">Website</p>
                <Form.Item name="website_link">
                  <Input
                    size="large"
                    addonBefore="http://"
                    addonAfter=".com"
                    defaultValue="omg.com"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={18} md={12} lg={6} xl={6}>
                <p className="font-medium text-gray-800">Whatsapp no.</p>
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
                  name={['primaryPhone', 'phone']}
                  placeholder="#####-#####"
                />
              </Col>
              <Col xs={24} sm={18} md={12} lg={6} xl={6}>
                <p className="font-medium text-gray-800">Office no.</p>
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
                  name={['primaryPhone', 'phone']}
                  placeholder="#####-#####"
                />
              </Col>
            </Row>
          </div>
        }
      />
      {/* POC */}
      <div className="mt-4">
        <CardSection
          className="mt-4"
          leftContent={
            <div className="pr-8 ">
              <div className="text-blue-900 font-semibold text-xl">Point of contact person</div>
              <div className="text-gray-600">The basic details of customer point of contact.</div>
            </div>
          }
          rightContent={
            <div className="bg-white shadow rounded p-4">
              <AddPocForm form={form} />
            </div>
          }
        />
      </div>
      {/* Emergency POC */}
      <div className="mt-4">
        <CardSection
          className="mt-4"
          leftContent={
            <div className="pr-8 ">
              <div className="text-blue-900 font-semibold text-xl">
                Emergency point of contact details
              </div>
              <div className="text-gray-600">
                The basic details of emergency customer point of contact.
              </div>
            </div>
          }
          rightContent={
            <div className="bg-white shadow rounded p-4">
              <AddPocForm form={form} />
            </div>
          }
        />
      </div>
      {/* AssginAccessForm */}
      <div className="mt-4">
        <CardSection
          className="mt-4"
          leftContent={
            <div className="pr-8 ">
              <div className="text-blue-900 font-semibold text-xl">Assign access</div>
              <div className="text-gray-600">Select services (main-services,sub-services).</div>
            </div>
          }
          rightContent={
            <div className="bg-white shadow rounded p-4">
              <AssignAccess form={form} />
            </div>
          }
        />
      </div>
      {/* AssginAccessForm */}
      <div className="mt-4">
        <CardSection
          className="mt-4"
          leftContent={
            <div className="pr-8 ">
              <div className="text-blue-900 font-semibold text-xl">Upload files</div>
              <div className="text-gray-600">Upload (logo,legal documents,GST&PAN).</div>
            </div>
          }
          rightContent={
            <div className="bg-white shadow rounded p-4">
              <UploadBranchDocs form={form} />
            </div>
          }
        />
      </div>
      {/* Digitally Signed */}
      <div className="mt-4">
        <CardSection
          className="mt-4"
          leftContent={
            <div className="pr-8 ">
              <div className="text-blue-900 font-semibold text-xl">Digitally sign agreement</div>
              <div className="text-gray-600">
                {/* <p className="mt-4">Upload (logo,legal documents,GST&PAN).</p> */}
              </div>
            </div>
          }
          rightContent={
            <div className="bg-white shadow rounded p-4">
              <DigitalySignedAggrement form={form} />
            </div>
          }
        />
      </div>
    </>
  );
};

export default BranchProfileForm;
