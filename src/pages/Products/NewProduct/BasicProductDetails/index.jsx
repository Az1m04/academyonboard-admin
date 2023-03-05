import { Form, Input } from 'antd';
import React from 'react';

const { TextArea } = Input;

const BasicProductDetails = ({ type, placeholder }) => {
  return (
    <div>
      <Form.Item
        name="name"
        label="Title"
        rules={[
          {
            required: true,
            message: `${type} title can't be blank`,
          },
        ]}
      >
        <Input size="large" placeholder={placeholder} />
      </Form.Item>

      <Form.Item name="description" label="Description">
        <TextArea placeholder="Description" autoSize={{ minRows: 4, maxRows: 6 }} />
      </Form.Item>
    </div>
  );
};

export default BasicProductDetails;
