/* eslint-disable react/jsx-key */
import { productList } from '@/pages/Leads/ClientLeads/AddClientLead';
import { Row, Col, Select, Form } from 'antd';
import React from 'react';

const ServiceInformation = ({ lookingFor, setLookingFor, form }) => {
  const { Option } = Select;

  return (
    <div>
      <Row gutter={16}>
        <Col xl={12} lg={12} md={12} sm={24} xs={24}>
          <span className="font-medium text-gray-800 block mb-2">Assign Access</span>
          <Form.Item
            name="lookingFor"
            rules={[{ required: true, message: 'Please select service here!' }]}
          >
            <Select
              size="large"
              placeholder="Select your service"
              getPopupContainer={(node) => node.parentNode}
              onChange={(e) => {
                setLookingFor(e);
                form?.setFieldsValue({ product: undefined });
              }}
            >
              <Option value="Software">Software</Option>
              <Option value="Service And Software">Services &amp; Software</Option>
            </Select>
          </Form.Item>
        </Col>
        {lookingFor === 'Service And Software' && (
          <Col xl={12} lg={12} md={12} sm={24} xs={24}>
            <span className="block mb-2 font-medium text-gray-800">Services </span>
            <Form.Item name={'services'}>
              <Select
                mode="multiple"
                size="large"
                getPopupContainer={(node) => node.parentNode}
                placeholder="Select Product"
              >
                {productList?.map((item) => (
                  <Select.Option key={item?.id} value={item?.id}>
                    {item?.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default ServiceInformation;
