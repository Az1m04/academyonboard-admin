import { Form, Input } from 'antd';
import React from 'react';

const BasicDetails = () => {
  return (
    <div className="">
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
        <Input size="large" placeholder="eg. Summer collection, Under ₹1000, Staff pick" />
      </Form.Item>

      <Form.Item name="description" label="Description (optional)">
        <Input.TextArea placeholder="Description" autoSize={{ minRows: 4, maxRows: 6 }} />
      </Form.Item>
    </div>
  );
};

export default BasicDetails;
