import { Form, Input, Radio } from 'antd';
import React from 'react';

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
    name: 'None',
    value: 'NONE',
  },
  {
    name: 'Minimum purchase amount (₹)',
    value: 'MINIMUM_AMOUNT',
  },
  {
    name: 'Minimum quantity of items',
    value: 'MINIMUM_QUANTITY',
  },
];

const eligibiltyOptions = [
  {
    name: 'Everyone',
    value: 'EVERYONE',
  },
  {
    name: 'Specific groups of customers',
    value: 'CUSTOMERS',
  },
  {
    name: 'Specific customers',
    value: 'SPECIFIC_CUSTOMERS',
  },
];

const DiscountCodeForm = ({ form }) => {
  return (
    <div className="">
      <div className="bg-white p-4 rounded-md shadow">
        <div className="flex justify-between mb-6">
          <div className="font-semibold text-gray-900">Discount Code</div>
          <div className="text-blue-800">Generate Code</div>
        </div>
        <Form.Item
          name="name"
          rules={[
            {
              required: true,
              message: "Collection title can't be blank",
            },
          ]}
        >
          <Input size="large" placeholder="eg. SPRINGSALE" />
        </Form.Item>
        <div className="-mt-6 text-gray-600">Customer will enter discount at checkout.</div>
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
            ))}
          </Radio.Group>
        </Form.Item>
      </div>
      <div className="bg-white p-4 rounded-md shadow mt-4">
        <div className="font-semibold text-gray-900 mb-4">Customer eligibility</div>
        <Form.Item
          name="eligibility"
          initialValue="EVERYONE"
          rules={[
            {
              required: true,
              message: 'Please select customer eligibility',
            },
          ]}
        >
          <Radio.Group className="w-full ">
            {eligibiltyOptions?.map((opt) => (
              <div
                key={opt.value}
                onClick={() => {
                  form.setFieldsValue({ eligibility: opt.value });
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
  );
};

export default DiscountCodeForm;
