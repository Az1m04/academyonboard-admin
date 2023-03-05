import { useState } from 'react';
import { Modal, Button, Form, Input } from 'antd';
import { connect } from 'umi';

const PhoneModal = ({
  isPhoneVisible,
  setIsPhoneVisible,
  recordDetails,
  setRecordDetails,
  // setAssesTestNotificationMode,
  dispatch,
}) => {
  const [isFormChange, setIsFormChange] = useState(false);
  const [form] = Form.useForm();
  const onValuesChange = () => {
    setIsFormChange(true);
  };

  const onTextMessageFinish = (values) => {
    // setAssesTestNotificationMode('WEPT_TASK_TEXT_MSG');
    dispatch({
      type: 'leads/flagTextMessage',
      payload: {
        pathParams: {
          leadId: recordDetails?.[0]?.id,
        },
        body: {
          messageType: 'TEXT_MESSAGE',
          remarks: values?.note,
          formattedPhone: recordDetails?.[0]?.formattedPhone?.replace(/\s+/g, ''),
        },
      },
    }).then((res) => {
      if (res?.status === 'ok') {
        form.resetFields();
        setRecordDetails('');
        setIsPhoneVisible(false);
        setIsFormChange(false);
      }
    });
  };

  return (
    <Modal
      title={
        <>
          <div className="text-gray-600">
            Generate message
            {recordDetails.length !== 0 &&
              recordDetails?.map((item) => {
                return (
                  <>
                    <span> for</span>
                    <span> {item?.displayName?.toLowerCase()} </span>
                  </>
                );
              })}
          </div>
          <div className="mt-5 text-sm text-gray-400">
            Phone number :{' '}
            {recordDetails.length !== 0 && recordDetails?.map((item) => item.formattedPhone)}
          </div>
        </>
      }
      centered
      visible={isPhoneVisible}
      onCancel={() => {
        form.resetFields();
        setRecordDetails('');
        setIsPhoneVisible(false);
        setIsFormChange(false);
      }}
      footer={null}
    >
      <Form
        form={form}
        onValuesChange={onValuesChange}
        onFinish={(value) => onTextMessageFinish(value)}
      >
        <Form.Item name="note" rules={[{ required: true, message: 'Please enter message' }]}>
          <Input.TextArea rows={4} />
        </Form.Item>
        <div className="flex justify-end">
          <div>
            <Button
              style={{ visibility: isFormChange ? 'visible' : 'hidden' }}
              type="primary"
              htmlType="submit"
            >
              Send
            </Button>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default connect(() => ({}))(PhoneModal);
