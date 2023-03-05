import React, { useState } from 'react';
import { Input, Button, Modal, Form } from 'antd';
import { useForm } from 'antd/lib/form/Form';

const LeadsDropdownModal = ({
  btnText,
  modalIcon,
  heading,
  subHeading,
  placeholderTxt,
  isVisible,
  isModalVisible,
  inputName,
  rules,
}) => {
  // eslint-disable-next-line no-unused-vars
  const [isFormChange, setIsFormChange] = useState(false);
  const { form } = useForm();

  const onValuesChange = () => {
    setIsFormChange(true);
  };
  return (
    <>
      <Modal
        bodyStyle={{ padding: 0 }}
        title={null}
        visible={isVisible}
        onCancel={() => {
          isModalVisible(false);
        }}
        footer={null}
      >
        <Form form={form} onValuesChange={onValuesChange}>
          <div className="flex px-4 py-4 border-b">
            {modalIcon}

            <div className="ml-3">
              <h2 className="text-base font-semibold text-blue-900">
                {heading}
                <p className="text-sm font-normal text-gray-500">{subHeading}</p>
              </h2>
            </div>
          </div>
          <div className="m-4">
            <Form.Item name={inputName} rules={rules} style={{ margin: '0' }}>
              <Input.TextArea
                placeholder={placeholderTxt}
                autoSize={{ minRows: 3, maxRows: 6 }}
              ></Input.TextArea>
            </Form.Item>
          </div>
          <div className="flex justify-end border-t">
            <Button type="primary" htmlType="submit" style={{ margin: '1rem' }}>
              {btnText}
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default LeadsDropdownModal;
