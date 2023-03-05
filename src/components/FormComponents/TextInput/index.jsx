import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Row, Col } from 'antd';

const TextInput = ({ placeholder, name, rules }) => {
  return (
    <Row>
      <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
        <Form.Item name={name} rules={rules}>
          <Input size="large" placeholder={placeholder} />
        </Form.Item>
      </Col>
    </Row>
  );
};

TextInput.propTypes = {
  placeholder: PropTypes.string,
  rules: PropTypes.array,
};

export default TextInput;
