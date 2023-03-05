import React from 'react';
import { Form, Input } from 'antd';

const CardSwipeForm = () => {
  return (
    <div>
      <div>
        <div className="omgFormLabel mt-2">Card last four digit</div>
        <Form.Item
          required={false}
          colon={false}
          style={{
            margin: 0,
            padding: 0,
            lineHeight: 0,
          }}
        >
          <Input size="large" type="number" placeholder="Enter card last four digit" />
        </Form.Item>
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

export default CardSwipeForm;
