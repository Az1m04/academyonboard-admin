import CheckValidation from '@/components/CheckValidation';
import { Checkbox, Form, InputNumber, Select } from 'antd';
import React from 'react';

const { Option } = Select;

const ProductShipping = ({ form }) => {
  return (
    <>
      <div className="p-4 ">
        <div className="pt-2">
          <Form.Item noStyle name="isPhysical" label={null} valuePropName="checked">
            <Checkbox>This is a physical product</Checkbox>
          </Form.Item>
        </div>
      </div>

      <CheckValidation show={form.getFieldValue('isPhysical')}>
        <div className="p-4 border-t">
          <div className="text-black text-sm font-medium">WEIGHT</div>
          <div className="text-gray-400 text-sm mt-1">
            Used to calculate shipping rates at checkout and label prices during fulfillment.
          </div>
          <div className="mt-4 flex">
            <Form.Item
              initialValue="0"
              className="mt-4"
              name="weight"
              label={<span className="formLabel">Weight</span>}
            >
              <InputNumber
                style={{
                  width: 200,
                }}
                min={0}
                className="w-full"
                size="large"
                placeholder="0.0"
              />
            </Form.Item>
            <div
              style={{
                paddingTop: 30,
              }}
            >
              <Form.Item className="mt-4" name="weightUnit" label={null} initialValue="WT_kg">
                <Select size="large" style={{ width: 70 }}>
                  <Option value="WT_kg">Kg</Option>
                  <Option value="WT_g">g</Option>
                </Select>
              </Form.Item>
            </div>
          </div>
        </div>
      </CheckValidation>
    </>
  );
};

export default ProductShipping;
