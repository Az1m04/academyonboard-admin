import React, { useState } from 'react';
import { FileAddOutlined } from '@ant-design/icons';
import { Form, Button, Divider, Select, Radio, Input, Modal } from 'antd';
import { connect } from 'umi';

const ModalToAddTeacherNotes = ({ dispatch, loading, courseDetails, editLead, form }) => {
  const [notesValue, setNotesValue] = useState('');

  const [isTouched, setIsTouched] = useState(false);
  const [courseId, setCourseId] = useState('');

  const { TextArea } = Input;

  const newCourse = courseDetails?.records?.filter((item) => courseId?.includes(item?.id));

  const moduless = newCourse?.map((item) => item?.modules?.map((val) => val))[0];

  return (
    <Modal
      title={
        <div className="flex justify-between border-b">
          <div className="flex w-full px-4 py-4 pt-2">
            <FileAddOutlined className="mt-1 text-xl" style={{ color: 'rgba(30,58,138)' }} />
            <div className="w-full pl-4">
              <div className="w-full text-base font-semibold text-blue-900">
                {editLead?.noteId ? 'Edit teacher remarks' : 'Add teacher remarks'}
                <div className="w-full text-sm font-normal text-gray-500">
                  {editLead?.noteId ? 'Edit teacher remarks' : 'Add teacher remarks'} for the
                  student here
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      onCancel={() => {
        dispatch({
          type: 'leads/setStates',
          payload: {
            visible: false,
            type: null,
            title: null,
            leadId: null,
          },
          key: 'editLead',
        });
        form.resetFields();
      }}
      visible={editLead?.visible && editLead?.purposeFor === 'studentsProfile'}
      footer={null}
    >
      <>
        <div className="p-4">
          <p className="font-medium text-gray-800 mb-0">Set remarks priority here</p>
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

          <p className="font-medium text-gray-800">Course</p>
          <Form.Item
            name="course"
            rules={[
              {
                required: true,
                message: 'Please select the course category',
              },
            ]}
          >
            <Select
              size="middle"
              placeholder={'Please select the course'}
              style={{ width: '100%' }}
              getPopupContainer={(node) => node.parentNode}
              onChange={(value) => {
                setCourseId(value);
              }}
            >
              {courseDetails?.records?.map((item) => (
                <Select.Option value={item?.id} key={item?.id}>
                  {item?.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {moduless !== undefined && (
            <>
              <p className="font-medium text-gray-800">Module</p>
              <Form.Item
                name="module"
                rules={[
                  {
                    required: true,
                    message: 'Please select the course category',
                  },
                ]}
              >
                <Select
                  size="middle"
                  placeholder={'Please select the course'}
                  style={{ width: '100%' }}
                  getPopupContainer={(node) => node.parentNode}
                >
                  {moduless?.map((item) => (
                    <Select.Option value={item?.id} key={item?.id}>
                      {item?.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </>
          )}

          <p className="font-medium text-gray-800 mb-0">Title</p>
          <Form.Item
            name="title"
            rules={[{ required: true, message: 'Please set a note priority' }]}
          >
            <Input placeholder="Add title for the remarks" />
          </Form.Item>
          <Form.Item
            style={{ margin: '0' }}
            name="noteInfo"
            rules={[{ required: true, message: 'Please add a note first!' }]}
          >
            <TextArea
              onChange={(ev) => {
                if (ev.target.value && !isTouched) {
                  setIsTouched((prev) => !prev);
                } else if (ev.target.value === '' && isTouched) {
                  setIsTouched((prev) => !prev);
                }
              }}
              className=""
              autoSize={{ minRows: 3, maxRows: 6 }}
              placeholder="Type a note here!"
            />
          </Form.Item>
        </div>
        <Divider style={{ margin: '0' }} />
        <div className="flex justify-end p-4">
          <Button
            size="large"
            disabled={!form.getFieldValue('noteInfo')}
            onClick={() => {
              form.resetFields();
            }}
            className="mr-4"
          >
            Reset
          </Button>

          <Button loading={loading} type="primary" size="large" onClick={() => form.submit()}>
            {editLead?.noteId ? 'Update' : 'Add'}
          </Button>
        </div>
      </>
    </Modal>
  );
};

export default connect(({ leads, loading, student }) => ({
  editLead: leads?.editLead,
  courseDetails: student?.courseDetails,
  notesRecord: leads?.activityRecord,
  loading: loading?.effects['student/addStudentNotes'],
}))(ModalToAddTeacherNotes);
