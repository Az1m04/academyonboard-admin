import React, { useState } from 'react';
import { Button, Col, Form, Input, Modal, Row, Select } from 'antd';
import { history, useParams } from 'umi';
import PhoneNumber from '@/components/PhoneNumber';
import { ClientServicesIcon } from '@/utils/AppIcons';

const ClientLeadServicesModal = ({
  setVisible,
  visible,
  type,
  setType,
  form,
  setLookingFor,
  lookingFor,
  productList,
}) => {
  const { clientId } = useParams();
  const [modalForm] = Form.useForm();
  const [code, setCode] = useState('');
  return (
    <Modal
      title={
        <div className=" rounded-t-lg " style={{ borderRadius: '20px' }}>
          <div className="flex">
            <ClientServicesIcon />
            <div>
              <p className=" text-xl font-semibold text-blue-900 capitalize m-0">Services</p>
              <p className="text-sm font-normal text-gray-800 m-0">
                Select services to be taken by lead
              </p>
            </div>
          </div>
        </div>
      }
      visible={visible && !clientId}
      onCancel={() => history.push('/leads/client/leads/all')}
      maskClosable={false}
      footer={
        <div>
          <Button
            type="primary"
            onClick={() => {
              modalForm?.submit();
            }}
          >
            Submit
          </Button>
        </div>
      }
      width={1000}
    >
      <Form
        form={modalForm}
        onFinish={(values) => {
          form?.setFieldsValue({ ...values });
          setVisible(false);
        }}
      >
        <Row gutter={[12, 12]}>
          <Col xl={12} lg={12} md={12} sm={24} xs={24}>
            <div className="">
              <span className="block mb-2 font-medium text-gray-800">Phone number</span>
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
                form={modalForm}
                name={['phone', 'phone']}
                placeholder="#####-#####"
              />
            </div>
          </Col>
          <Col xl={12} lg={12} md={12} sm={24} xs={24}>
            <span className="block mb-2 font-medium text-gray-800">Type</span>
            <Form.Item
              name="type"
              rules={[
                {
                  required: true,
                  message: 'Select type please',
                },
              ]}
            >
              <Select
                size="large"
                placeholder="Select type here"
                value={type}
                onChange={(value) => setType(value)}
              >
                {['School', 'Company', 'Institute', 'Language School']?.map((item) => (
                  <Select.Option key={item} value={item}>
                    {item}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          {modalForm?.getFieldValue('type') && (
            <>
              <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                <span className="block mb-2 font-medium text-gray-800">{type} name</span>
                <Form.Item name={['company', 'name']}>
                  <Input
                    size="large"
                    placeholder={`Enter ${type?.toLowerCase()} name here`}
                    maxLength={100}
                  />
                </Form.Item>
              </Col>
              <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                <span className="block mb-2 font-medium text-gray-800 ">Looking for</span>
                <Form.Item
                  name={'lookingFor'}
                  rules={[
                    {
                      required: true,
                      message: 'Please select your choice',
                    },
                  ]}
                >
                  <Select
                    style={{ width: '100%' }}
                    size="large"
                    getPopupContainer={(node) => node.parentNode}
                    placeholder="Please select your choice"
                    onChange={(e) => {
                      setLookingFor(e);
                      modalForm?.setFieldsValue({ product: undefined });
                    }}
                  >
                    <Select.Option value="Software">Software</Select.Option>
                    <Select.Option value="Service And Software">
                      Services &amp; Software
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              {lookingFor === 'Service And Software' && (
                <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                  <span className="block mb-2 font-medium text-gray-800">Services </span>
                  <Form.Item name={'services'}>
                    <Select mode="multiple" size="large" placeholder="Select Product">
                      {productList?.map((item) => (
                        <Select.Option key={item?.id} value={item?.id}>
                          {item?.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              )}
            </>
          )}
        </Row>
      </Form>
    </Modal>
  );
};

export default ClientLeadServicesModal;
