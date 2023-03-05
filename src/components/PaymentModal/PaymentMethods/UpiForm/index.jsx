import React from 'react';
import { Form, Input, Select } from 'antd';

const UpiForm = () => {
  const { Option } = Select;
  return (
    <div>
      <div className="mb-2">
        <div className="omgFormLabel">Select payment mode</div>
        <Select
          getPopupContainer={(trigger) => trigger.parentNode}
          size="large"
          className="w-full"
          placeholder="select payment mode"
        >
          <Option value={'Google Pay'}>Google Pay</Option>
          <Option value={'Phone Pay'}>Phone Pay</Option>
        </Select>
      </div>
      <div>
        <div className="omgFormLabel mt-2">Transaction no</div>
        <Form.Item
          required={false}
          colon={false}
          style={{
            margin: 0,
            padding: 0,
            lineHeight: 0,
          }}
        >
          <Input size="large" placeholder="Enter bank name" />
        </Form.Item>
      </div>
    </div>
  );
};

export default UpiForm;
