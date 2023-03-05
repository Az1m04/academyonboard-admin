import { Col, DatePicker, Form, Input, Radio, Row, TimePicker } from 'antd';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import React, { useState } from 'react';

const options = [
  {
    name: 'Percentage',
    value: 'PERCENTAGE',
  },
  {
    name: 'Fixed amount',
    value: 'FIXED_AMOUNT',
  },
  {
    name: 'Free Shipping',
    value: 'FREE_SHIPPING',
  },
  {
    name: 'Buy X Get Y',
    value: 'BUY_X_GET_Y',
  },
];

const valueOptions = [
  {
    name: 'All Products',
    value: 'ALL_PRODUCTS',
  },
  {
    name: 'Specific collections',
    value: 'SPECIFIC_COLLECTIONS',
  },
  {
    name: 'Specific products',
    value: 'SPECIFIC_PRODUCTS',
  },
];

const reqOptions = [
  {
    name: 'Minimum purchase amount (₹)',
    value: 'MINIMUM_AMOUNT',
  },
  {
    name: 'Minimum quantity of items',
    value: 'MINIMUM_QUANTITY',
  },
];

const AutomaticDiscountForm = ({ form }) => {
  const [showEndDate, setShowEndDate] = useState(false);
  return (
    <div className="">
      <div className="bg-white p-4 rounded-md shadow">
        <div className="font-semibold text-gray-900 mb-4">Automatic discount</div>
        <Form.Item
          name="name"
          label="Title"
          rules={[
            {
              required: true,
              message: "Collection title can't be blank",
            },
          ]}
        >
          <Input size="large" placeholder="eg. New year promotion" />
        </Form.Item>
        <div className="-mt-6 text-gray-600">Customer will see this in cart at checkout.</div>
      </div>
      <div className="bg-white p-4 rounded-md shadow mt-4">
        <div className="font-semibold text-gray-900 mb-4">Types</div>

        <Form.Item
          name="discount_type"
          initialValue="PERCENTAGE"
          rules={[
            {
              required: true,
              message: 'Please select collection type',
            },
          ]}
        >
          <Radio.Group className="w-full ">
            {options?.map((opt) => (
              <div
                key={opt.value}
                onClick={() => {
                  form.setFieldsValue({ discount_type: opt.value });
                }}
                className="my-1 rounded rounded-b-none"
              >
                <Radio
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                  }}
                  value={opt.value}
                >
                  <div className="font-normal text-gray-900 ml-2">{opt.name}</div>
                </Radio>
              </div>
            ))}
          </Radio.Group>
        </Form.Item>
      </div>
      <div className="bg-white rounded-md shadow mt-4">
        <div className="p-4">
          <div className="font-semibold text-gray-900 mb-4">Value</div>
          <Form.Item
            name="value"
            label="Discount Value"
            rules={[
              {
                required: true,
                message: 'Please enter discount value',
              },
            ]}
          >
            <Input style={{ width: '50%' }} size="large" suffix="%" />
          </Form.Item>
        </div>
        <div className="p-4 border-t">
          <div className="font-semibold text-gray-900 mb-2">Applies to</div>
          <Form.Item
            name="applies_to"
            initialValue="ALL_PRODUCTS"
            rules={[
              {
                required: true,
                message: 'Please select collection type',
              },
            ]}
          >
            <Radio.Group className="w-full ">
              {valueOptions?.map((opt) => (
                <div
                  key={opt.value}
                  onClick={() => {
                    form.setFieldsValue({ applies_to: opt.value });
                  }}
                  className="my-1 rounded rounded-b-none"
                >
                  <Radio
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      width: '100%',
                    }}
                    value={opt.value}
                  >
                    <div className="font-normal text-gray-900 ml-2">{opt.name}</div>
                  </Radio>
                </div>
              ))}
            </Radio.Group>
          </Form.Item>
        </div>
      </div>
      <div className="bg-white p-4 rounded-md shadow mt-4">
        <div className="font-semibold text-gray-900 mb-4">Minimum requirements</div>
        <Form.Item
          name="requirements"
          initialValue="NONE"
          rules={[
            {
              required: true,
              message: 'Please select minimum requirements',
            },
          ]}
        >
          <Radio.Group className="w-full ">
            {reqOptions?.map((opt) => (
              <>
                <div
                  key={opt.value}
                  onClick={() => {
                    form.setFieldsValue({ requirements: opt.value });
                  }}
                  className="my-1 rounded rounded-b-none"
                >
                  <Radio
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      width: '100%',
                    }}
                    value={opt.value}
                  >
                    <div className="font-normal text-gray-900 ml-2">{opt.name}</div>
                  </Radio>
                </div>
                <div className="ml-8">
                  <Input style={{ width: '50%' }} size="large" />
                </div>
              </>
            ))}
          </Radio.Group>
        </Form.Item>
      </div>

      <div className="bg-white p-4 rounded-md shadow mt-4">
        <div className="font-semibold text-gray-900 mb-4">Active Dates</div>

        <Row gutter={24}>
          <Col xl={12} lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Start Date"
              name="start_date"
              rules={[
                {
                  required: true,
                  message: 'Please select start date',
                },
              ]}
            >
              <DatePicker size="large" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xl={12} lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Start Time"
              name="start_date"
              rules={[
                {
                  required: true,
                  message: 'Please select start time',
                },
              ]}
            >
              <TimePicker size="large" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <div className="-mt-1">
          <Checkbox checked={showEndDate} onChange={() => setShowEndDate(!showEndDate)}>
            <span className="mx-2">Set end date</span>
          </Checkbox>
        </div>
        {showEndDate && (
          <Row className="mt-2 -mb-2" gutter={24}>
            <Col xl={12} lg={12} md={12} sm={24} xs={24}>
              <Form.Item
                label="Start Date"
                name="start_date"
                rules={[
                  {
                    required: true,
                    message: 'Please select start date',
                  },
                ]}
              >
                <DatePicker size="large" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm={24} xs={24}>
              <Form.Item
                label="Start Time"
                name="start_date"
                rules={[
                  {
                    required: true,
                    message: 'Please select start time',
                  },
                ]}
              >
                <TimePicker size="large" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        )}
      </div>
    </div>
  );
};

export default AutomaticDiscountForm;
