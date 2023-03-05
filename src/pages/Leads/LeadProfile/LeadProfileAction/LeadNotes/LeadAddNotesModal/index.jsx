import React, { useState } from 'react';
import { Button, Divider, Input, Modal, Form, Spin, message, Radio } from 'antd';
import { FileAddOutlined } from '@ant-design/icons';
import { connect } from 'umi';

const LeadAddNotesModal = ({
  leadNoteForm,
  addLeadNoteModal,
  setAddLeadNoteModal,
  dispatch,
  leadId,
  getLeadNotesRecord,
  getSingleLeadNote,
  isNoteForEdit,
  setIsNoteForEdit,
  addNoteLoading,
  updateNoteLoading,
}) => {
  const [notesValue, setNotesValue] = useState('');
  const addLeadNote = (val) => {
    const body = {
      ...val,
      noteType: 'LEAD_NOTE',
    };

    dispatch({
      type: 'leads/uploadLeadNotes',
      payload: {
        pathParams: { leadId },
        body: { ...body },
      },
    }).then((res) => {
      if (res?.id) {
        getLeadNotesRecord();
        setAddLeadNoteModal(false);
        message.success('your note have been created successfully');

        leadNoteForm.resetFields();
      }
    });
  };
  const updateLeadNote = (val) => {
    const body = {
      ...val,
      noteType: 'LEAD_NOTE',
    };
    dispatch({
      type: 'leads/updateLeadNote',
      payload: {
        pathParams: { leadId, notesId: getSingleLeadNote?.id },
        body: { ...body },
      },
    }).then((res) => {
      if (res?.id) {
        setIsNoteForEdit(false);
        getLeadNotesRecord();
        message.success('your note have been updated successfully');
        setAddLeadNoteModal(false);
        leadNoteForm.resetFields();
      }
    });
  };

  return (
    <div>
      <Modal
        title={
          <div className="flex justify-between border-b">
            <div className="flex w-full pt-2">
              <FileAddOutlined className="mt-1 text-xl" style={{ color: 'rgba(30,58,138)' }} />
              <div className="w-full pl-4">
                <div className="w-full text-base font-semibold text-blue-900">
                  {isNoteForEdit === true ? 'Edit note' : 'Add notes'}
                  <div className="w-full text-sm font-normal text-gray-500">
                    {isNoteForEdit === true ? 'Edit note' : 'Add note'} for the lead here
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
        centered
        onCancel={() => {
          setAddLeadNoteModal(false);
          leadNoteForm.resetFields();
          setIsNoteForEdit(false);
        }}
        visible={addLeadNoteModal}
        maskClosable={false}
        footer={false}
      >
        <Spin spinning={Boolean(addNoteLoading || updateNoteLoading)}>
          <Form
            form={leadNoteForm}
            onFinish={(val) => {
              if (isNoteForEdit === true) {
                updateLeadNote(val);
              } else {
                addLeadNote(val);
              }
            }}
          >
            <p className="font-medium text-gray-800 ">Set notes priority here</p>
            <Form.Item
              style={{ marginBottom: 10 }}
              name="priority"
              rules={[{ required: true, message: 'Please set a note priority' }]}
              initialValue="Low"
            >
              <Radio.Group value={notesValue} onChange={(val) => setNotesValue(val.target.value)}>
                <Radio value="Low">Low</Radio>
                <Radio value="Medium">Medium</Radio>
                <Radio value="High">High</Radio>
                <Radio value="Very high">Very high</Radio>
              </Radio.Group>
            </Form.Item>

            <p className="font-medium text-gray-800 mb-0 mt-3.5">Add note here</p>

            <Form.Item
              style={{ marginTop: '1rem' }}
              name="noteInfo"
              rules={[{ required: true, message: 'Please add a note first!' }]}
            >
              <Input.TextArea
                className=""
                autoSize={{ minRows: 3, maxRows: 6 }}
                placeholder="Type a note here!"
              />
            </Form.Item>

            <Divider style={{ margin: '0' }} />
            <div className="flex justify-end mt-1.5">
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  {isNoteForEdit === true ? 'Update note' : 'Add note'}
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
  addNoteLoading: loading?.effects['leads/uploadLeadNotes'],
  updateNoteLoading: loading?.effects['leads/uploadLeadNotes'],
}))(LeadAddNotesModal);
