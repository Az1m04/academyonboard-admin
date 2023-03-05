import React from 'react';
import { Form, Input } from 'antd';

const { TextArea } = Input;
const MarkAsComplete = () => {
  return (
    <div>
      <p className="text-sm font-semibold ">Add remarks</p>
      <Form.Item
        name="noteInfo"
        style={{ margin: '0%' }}
        rules={[
          {
            required: true,
            message: 'Please input the remark of the task!',
          },
        ]}
      >
        <TextArea
          minRows={2}
          onKeyDown={(event) => {
            if (event.keyCode === 50) {
              if (event.shiftKey) {
                //   TODO:
              }
            }
          }}
          autoSize
          size="large"
          placeholder="Add remarks"
        />
      </Form.Item>
    </div>
  );
};

export default MarkAsComplete;
