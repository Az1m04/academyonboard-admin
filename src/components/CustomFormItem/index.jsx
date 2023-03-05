import { Form } from 'antd';
import React from 'react';

function CustomFormItem({
  children,
  label,
  name,
  rules,
  initialValue,
  fieldKey,
  getValueFromEvent,
}) {
  return (
    <>
      {label && <label className="field-label">{label}</label>}
      <Form.Item
        label={null}
        shouldUpdate
        name={name}
        rules={rules}
        getValueFromEvent={getValueFromEvent}
        initialValue={initialValue}
        fieldKey={fieldKey}
      >
        {children}
      </Form.Item>
    </>
  );
}

export default CustomFormItem;
