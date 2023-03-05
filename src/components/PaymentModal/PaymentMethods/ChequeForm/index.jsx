import React from 'react';
import { Form, Input } from 'antd';

const ChequeForm = () => {
  return (
    <div>
      <div>
        <div className="omgFormLabel mt-2">Cheque no</div>
        <Form.Item
          required={false}
          colon={false}
          style={{
            margin: 0,
            padding: 0,
            lineHeight: 0,
          }}
        >
          <Input size="large" placeholder="Enter cheque no" />
        </Form.Item>
      </div>
      <div>
        <div className="omgFormLabel mt-2">Bank name</div>
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

export default ChequeForm;
