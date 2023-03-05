/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable quotes */
/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable space-infix-ops */
/* eslint-disable arrow-body-style */
import React, { useState } from 'react';
import { Modal, Button, Form, Avatar, Input, Icon, Switch, Badge } from 'antd';
import { getInitials } from '@/utils/common';
import classNames from 'classnames';
import { connect } from 'dva';
import styles from './index.less';

const PostUpdatePopUpModal = ({ visible, setVisible, form, record }) => {
  const [switchButton, setSwitchButton] = useState(true);
  console.log(`switchButton`, switchButton);
  console.log(`visible`, visible);
  console.log(`Postrecord`, record);
  const onFinish = (values) => {
    console.log(`values`, values);
  };

  const onChange = (checked) => {
    console.log(`switch to ${checked}`);
    setSwitchButton(checked);
  };
  return (
    <Modal
      wrapClassName="app-modal-flat"
      destroyOnClose
      // maskClosable={false}
      keyboard={false}
      visible={visible}
      onCancel={(e) => {
        setVisible(false);
        e.stopPropagation();
      }}
      width={800}
      footer={
        <div className="flex justify-between bg-gray-100 p-5 rounded-b-full">
          <div className="flex">
            {switchButton && (
              <>
                {/* <Popover
                  // overlayClassName="app-popup"
                  content={<Avatar>{getInitials(record?.client_name)}</Avatar>}
                  title="Notify to.."
                  trigger="hover"
                > */}
                <Badge
                  className="text-red-500"
                  count={
                    // will show delete icon
                    <Icon type="close-circle" theme="filled" />
                  }
                >
                  <Avatar>
                    {/* display initials */}
                    {getInitials(record?.client_name)}
                  </Avatar>
                </Badge>
                {/* </Popover> */}
                {/* <Tooltip
                  title="Notify additional people"
                  className={classNames(styles?.ModalHeader)}
                > */}
                <Button
                  type="dashed"
                  shape="circle"
                  className="mx-2"
                  // onClick={() => setAddFollowerModal(true)}
                >
                  <Icon type="plus" className="text-gray-700 text-sm align-bottom" />
                </Button>
                {/* </Tooltip> */}
              </>
            )}
            <div className="flex m-1">
              <Switch defaultChecked onChange={onChange} />
              <p className="ml-2 font-semibold">Notify via Email?</p>
            </div>
          </div>
          <Button type="primary">Post</Button>
        </div>
      }
      title={
        <div className="flex ">
          <div className=" mr-2">
            <Avatar size="large">{getInitials(record?.client_name)}</Avatar>
          </div>
          <div className="">
            <p className="text-lg font-semibold">{record?.client_name}</p>
            <p className="text-sm font-semibold text-gray-700">Post an update for</p>
          </div>
        </div>
      }
      className={classNames(styles?.ModalHeader)}
    >
      <div className="">
        <Form form={form} onFinish={onFinish}>
          <Form.Item name="PostUpdateInput">
            <Input.TextArea
              autoSize={{ minRows: 7, maxRows: 7 }}
              placeholder="Post an update.."
              size="large"
              className={classNames(styles?.ModalHeader)}
              // style={{ height: 150, border: false }}
            />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default connect()(Form.create()(PostUpdatePopUpModal));
