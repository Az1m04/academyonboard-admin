import React from 'react';
import { Button, Divider, Input, Radio, Modal, Form, Select, Spin, message } from 'antd';
import { FileAddOutlined } from '@ant-design/icons';
import { connect } from 'umi';

const NotesModal = ({
  setAddNotesModal,
  addNotesModal,
  getStudentsList,
  dispatch,
  staffId,
  uploadNotesLoading,
  noteForm,
  isModalForEdit,
  setIsModalForEdit,
  getStaffNotes,
}) => {
  const uploadNoteDetails = (value) => {
    const newValues = {
      ...value,
      noteType: 'STUDENT_NOTE',
    };
    newValues.students = value?.students?.map((item) => {
      return {
        id: item,
      };
    });
    dispatch({
      type: 'staff/uploadStaffNotes',
      payload: {
        pathParams: {
          staffId,
        },
        body: newValues,
      },
    }).then((res) => {
      if (res?.responseMessage === 'success') {
        message.success('your teacher remarks add successfullly');
        setIsModalForEdit(false);
        setAddNotesModal(false);
        getStaffNotes();
      } else {
        message.error('something went wrong');
      }
    });
  };

  const { TextArea } = Input;
  return (
    <div>
      <Modal
        title={
          <div className="flex justify-between border-b">
            <div className="flex w-full pt-2">
              <FileAddOutlined className="mt-1 text-xl" style={{ color: 'rgba(30,58,138)' }} />
              <div className="w-full pl-4">
                <div className="w-full text-base font-semibold text-blue-900">
                  {isModalForEdit === true ? 'Edit notes' : 'Add notes'}
                  <div className="w-full text-sm font-normal text-gray-500">
                    {isModalForEdit === true ? 'Edit' : 'Add'} note for the student here
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
        centered
        onCancel={() => {
          setAddNotesModal(false);
          noteForm.resetFields();
          setIsModalForEdit(false);
        }}
        visible={addNotesModal}
        maskClosable={false}
        footer={false}
      >
        <Spin spinning={Boolean(uploadNotesLoading)}>
          <Form
            form={noteForm}
            onFinish={(val) => {
              uploadNoteDetails(val);
            }}
          >
            <p className="text-gray-900 font-medium mb-2 mt-2.5">Select student</p>
            <Form.Item
              name={'students'}
              style={{ margin: '0%' }}
              rules={[{ required: true, message: 'Please select student' }]}
            >
              <Select
                filterOption={false}
                showSearch
                mode="multiple"
                notFoundContent={null}
                style={{ width: '100%' }}
                placeholder="select a student"
                size="medium"
              >
                {getStudentsList?.records?.map((item) => (
                  <Select.Option key={item?.id} value={item?.id}>
                    {item?.displayName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <p className="font-medium text-gray-800 mb-0 mt-3.5">Set notes priority here</p>
            <Form.Item
              style={{ margin: '0%' }}
              name="priority"
              rules={[{ required: true, message: 'Please set a note priority' }]}
              initialValue="Low"
            >
              <Radio.Group>
                <Radio value="Low">Low</Radio>
                <Radio value="Medium">Medium</Radio>
                <Radio value="High">High</Radio>
                <Radio value="Very high">Very high</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              style={{ marginTop: '1rem' }}
              name="noteInfo"
              rules={[{ required: true, message: 'Please add a note first!' }]}
            >
              <TextArea
                className=""
                autoSize={{ minRows: 3, maxRows: 6 }}
                placeholder="Type a note here!"
              />
            </Form.Item>

            <Divider style={{ margin: '0' }} />
            <div className="flex justify-end mt-1.5">
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  {isModalForEdit === true ? 'Edit' : 'Add'} Note
                </Button>
              </Form.Item>
            </div>
          </Form>
        </Spin>
      </Modal>
    </div>
  );
};

export default connect(({ loading }) => ({
  uploadNotesLoading: loading?.effects['staff/uploadStaffNotes'],
}))(NotesModal);
