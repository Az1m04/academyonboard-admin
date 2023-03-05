import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from 'antd';

const NumberInput = ({ placeholder, name, rules, label, form, setFields, setWarrantyValue }) => {
  const onChange = (e) => {
    const { value } = e.target;
    const reg = /^-?\d*(\.\d*)?$/;
    // eslint-disable-next-line no-restricted-globals
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      if (setWarrantyValue) setWarrantyValue(value);
      if (setFields) {
        setFields(value);
      }
    } else {
      form?.setFieldsValue({
        [name]: '',
      });
    }
    return value;
  };
  return (
    <Form.Item name={name} rules={rules} label={<span className="formLabel">{label}</span>}>
      <Input size="large" type="number" placeholder={placeholder} onChange={onChange} />
    </Form.Item>
  );
};

NumberInput.propTypes = {
  placeholder: PropTypes.string,
  rules: PropTypes.array,
  label: PropTypes.string,
};

export default NumberInput;
