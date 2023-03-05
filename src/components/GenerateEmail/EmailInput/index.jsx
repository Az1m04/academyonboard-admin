/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import { Button, Col, Form, Modal, Row, Input, Select, Switch, Steps, Avatar, Tooltip } from 'antd';
import classNames from 'classnames';
import React, { useState } from 'react';
import { UserAddOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import styles from './index.less';

const EmailInput = ({
  name,
  label,
  data,
  emailList,
  form,
  allowStyling,
  currentUser,
  setIsEmpty,
}) => {
  const [addPopUp, setAddPopUp] = useState({});

  const changeStatus = () => {
    if (name === 'to') setIsEmpty(true);
  };

  return (
    <Row>
      <Col xl={20} lg={20} md={20} sm={24} xs={24}>
        <Form.Item
          className={classNames(allowStyling && styles.labelStyling)}
          name={name}
          label={<span className={classNames('formLabel')}>{label}</span>}
          form={form}
        >
          <Select
            form={form}
            dropdownStyle={{ display: 'none' }}
            className="w-full"
            showSearch
            size="large"
            filterOption
            mode="multiple"
            maxTagCount={3}
            placeholder="Add email or search by name"
            optionLabelProp="label"
            tokenSeparators={[',']}
            onSelect={() => {
              if (name === 'to') {
                setIsEmpty(false);
              }
            }}
            onDeselect={(value) => {
              if (form.getFieldValue('to').length === 0) {
                changeStatus();
              }
              if (value === currentUser?.personalDetails?.emailAddresses[0]?.email) {
                setAddPopUp({ [name]: false });
              }
            }}
          >
            {data && data?.map((item) => <Select.Option key={item.id}></Select.Option>)}
          </Select>
        </Form.Item>
      </Col>
      <Col xl={4} lg={4} md={4} sm={24} xs={24}>
        <div className="mb-2 ml-4">
          <Tooltip title="Send a copy to yourself by adding your email to the package.">
            <Button
              disabled={addPopUp[name]}
              size="large"
              onClick={() => {
                if (
                  !form
                    .getFieldValue(name)
                    ?.find(
                      (list) => list === currentUser?.personalDetails?.emailAddresses[0]?.email,
                    )
                ) {
                  form.setFieldsValue({
                    [name]: [
                      ...(form.getFieldValue(name) || []),
                      currentUser?.personalDetails?.emailAddresses[0]?.email,
                    ],
                  });
                  setAddPopUp({ [name]: true });
                }
              }}
            >
              <UserAddOutlined />
            </Button>
          </Tooltip>
        </div>
      </Col>
    </Row>
  );
};

export default connect(({ user }) => ({ currentUser: user.currentUser }))(EmailInput);
