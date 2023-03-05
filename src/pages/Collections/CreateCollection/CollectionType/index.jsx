import { Button, Col, Form, Radio, Row, Select } from 'antd';
import React, { useState } from 'react';

const CollectionType = ({ form }) => {
  const [collectionType, setCollectionType] = useState('AUTOMATED');
  return (
    <div className="bg-white rounded-md shadow">
      <div className="px-4 pt-4">
        <div className="font-semibold text-gray-900 mb-4">Collection type</div>
        <Form.Item
          name="collection_type"
          initialValue="AUTOMATED"
          rules={[
            {
              required: true,
              message: 'Please select collection type',
            },
          ]}
        >
          <Radio.Group className="w-full ">
            <div
              onClick={() => {
                setCollectionType('MANUAL');
                form.setFieldsValue({ collection_type: 'MANUAL' });
              }}
              className=" rounded rounded-b-none"
            >
              <Radio
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                }}
                value="MANUAL"
              >
                <div className="flex-auto whitespace-normal ml-2 cursor-pointer leading-normal py-2">
                  <div className="">
                    <div className="font-normal text-gray-900 py-1">Manual</div>
                    <span className="text-gray-700">
                      Add products to this collection one by one. Learn more about manual
                      collections.
                    </span>
                  </div>
                </div>
              </Radio>
            </div>
            <div
              onClick={() => {
                setCollectionType('AUTOMATED');
                form.setFieldsValue({ collection_type: 'AUTOMATED' });
              }}
              className="flex items-center rounded rounded-b-none"
            >
              <Radio
                value="AUTOMATED"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <div className="whitespace-normal cursor-pointer ml-2 leading-normal py-2">
                  <div className="font-normal text-gray-900 py-1">Automated</div>
                  <div className="flex-1 w-full text-gray-700">
                    Existing and future products that match the conditions you set will
                    automatically be added to this collection. Learn more about automated
                    collections.
                  </div>
                </div>
              </Radio>
            </div>
          </Radio.Group>
        </Form.Item>
      </div>
      {collectionType === 'AUTOMATED' && (
        <div className="border-t p-4">
          <div className="font-medium">CONDITIONS</div>
          <div className="flex items-center">
            <div className="-mt-6 mr-4">Products must match:</div>
            <Form.Item
              name="condition"
              rules={[
                {
                  required: true,
                  message: 'Please select the condition',
                },
              ]}
            >
              <Radio.Group className="w-full ">
                <div className="flex items-center">
                  <div
                    onClick={() => form.setFieldsValue({ condition: 'MANUAL' })}
                    className="rounded rounded-b-none"
                  >
                    <Radio
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                      }}
                      value="MANUAL"
                    >
                      <div className="flex-auto whitespace-normal ml-2 cursor-pointer leading-normal">
                        <div className="font-normal text-gray-900">all condition</div>
                      </div>
                    </Radio>
                  </div>
                  <div
                    onClick={() => form.setFieldsValue({ condition: 'AUTOMATED' })}
                    className="rounded rounded-b-none"
                  >
                    <Radio
                      value="AUTOMATED"
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <div className="whitespace-normal cursor-pointer ml-2 leading-normal ">
                        <div className="font-normal text-gray-900">any condition</div>
                      </div>
                    </Radio>
                  </div>
                </div>
              </Radio.Group>
            </Form.Item>
          </div>
          <Row gutter={24}>
            <Col xl={8} md={8} sm={24} xs={24}>
              <Form.Item name="collections">
                <Select size="large"></Select>
              </Form.Item>
            </Col>
            <Col xl={8} md={8} sm={24} xs={24}>
              <Form.Item name="collections">
                <Select size="large"></Select>
              </Form.Item>
            </Col>
            <Col xl={8} md={8} sm={24} xs={24}>
              <Form.Item name="collections">
                <Select size="large"></Select>
              </Form.Item>
            </Col>
          </Row>
          <Button>Add another condition</Button>
        </div>
      )}
    </div>
  );
};

export default CollectionType;
