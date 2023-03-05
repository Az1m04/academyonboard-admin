import { useState } from 'react';
import { Modal, Button, Form, Input } from 'antd';

const NoteModal = ({ isNoteVisible, setIsNoteVisible, recordDetails, setRecordDetails }) => {
  const [isFormChange, setIsFormChange] = useState(false);
  const [form] = Form.useForm();
  const onValuesChange = () => {
    setIsFormChange(true);
  };
  return (
    <Modal
      title={
        <div className="text-gray-600">
          Add note
          {recordDetails.length !== 0 &&
            recordDetails?.map((item) => {
              return (
                <>
                  <span> for</span>
                  <span className="capitalize"> {item?.displayName?.toLowerCase()} </span>
                </>
              );
            })}
        </div>
      }
      centered
      visible={isNoteVisible}
      onCancel={() => {
        form.resetFields();
        setRecordDetails('');
        setIsNoteVisible(false);
        setIsFormChange(false);
      }}
      footer={null}
    >
      <Form form={form} onValuesChange={onValuesChange}>
        <Form.Item name="note" rules={[{ required: true, message: 'Please enter note' }]}>
          <Input.TextArea rows={4} />
        </Form.Item>
        <div className="flex justify-end">
          <div>
            <Button
              style={{ visibility: isFormChange ? 'visible' : 'hidden' }}
              type="primary"
              htmlType="submit"
            >
              Add
            </Button>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default NoteModal;
