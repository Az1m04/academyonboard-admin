import React from 'react';
import { Form, Select } from 'antd';

const ChangePriority = () => {
  const priority = [
    {
      title: 'Very High',
      value: 'VERY_HIGH',
    },
    {
      title: 'High',
      value: 'HIGH',
    },
    {
      title: 'Low',
      value: 'LOW',
    },
    {
      title: 'Medium',
      value: 'MEDIUM',
    },
  ];
  return (
    <>
      <p className="text-sm font-semibold ">Select Priority</p>
      <Form.Item name="priorityTypeId" style={{ margin: '' }}  rules={[
          {
            required: true,
            message: 'Please select priority!',
          },
        ]}>
        <Select
          size="large"
          placeholder="Select priority"
          getPopupContainer={(node) => node.parentNode}
        >
          {priority?.map((prior) => (
            <Select.Option value={prior?.value} key={prior?.value}>
              {prior?.title}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </>
  );
};

export default ChangePriority;
