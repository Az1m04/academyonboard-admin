import { FileAddOutlined } from '@ant-design/icons';
import { Button, Divider, Form, Input, message, Modal, Radio, Select, Spin } from 'antd';
import React, { useState } from 'react';
import { connect, useParams } from 'umi';

const RemarksModal = ({
  remarksModal,
  setRemarksModal,
  getStudentsList,
  dispatch,
  loadingForUploadRemark,
  getStudentCourses,
  loadingForGetCourse,
  getAllRemarks,
  remarkForm,
  setIsModalForEdit,
  isModalForEdit,
}) => {
  const [courseModule, setCourseModule] = useState({});
  const { staffId } = useParams();

  const getCourses = (value) => {
    dispatch({
      type: 'staff/getStudentCourses',
      payload: {
        pathParams: {
          studentId: value,
        },
      },
    });
  };

  const uploadRemarkDetails = (val) => {
    const bodyValue = {
      ...val,
      noteType: 'TEACHER_NOTE',
    };
    bodyValue.students = [
      {
        id: val?.student,
      },
    ];
    dispatch({
      type: 'staff/uploadStaffRemarks',
      payload: {
        pathParams: {
          staffId,
        },
        body: bodyValue,
      },
    }).then((res) => {
      if (res?.responseMessage === 'success') {
        message.success('Your remarks create successfully');
        getAllRemarks();
        setRemarksModal(false);
        remarkForm.resetFields();
      } else {
        message.error('Something went wrong ');
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
                  {isModalForEdit === true ? 'Edit' : 'Add'} student remarks
                  <div className="w-full text-sm font-normal text-gray-500">
                    {isModalForEdit === true ? 'Edit' : 'Add'} teacher remarks for the student here
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
        onCancel={() => {
          setRemarksModal(false);
          remarkForm.resetFields();
          setIsModalForEdit(false);
        }}
        visible={remarksModal}
        footer={null}
        maskClosable={false}
      >
        <Spin spinning={Boolean(loadingForUploadRemark || loadingForGetCourse)}>
          <Form
            form={remarkForm}
            onFinish={(val) => {
              uploadRemarkDetails(val);
            }}
          >
            <p className="text-gray-900 font-medium mb-2 mt-2.5">Select student</p>
            <Form.Item
              name="student"
              style={{ margin: '0%' }}
              rules={[{ required: true, message: 'Please select student' }]}
            >
              <Select
                filterOption={false}
                showSearch
                onChange={(val) => {
                  remarkForm.setFieldsValue({
                    course: undefined,
                    module: undefined,
                  });
                  getCourses(val);
                }}
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
            <p className="font-medium text-gray-800 mb-0 mt-3.5">Set remarks priority here</p>
            <Form.Item
              style={{ marginBottom: 10 }}
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

            <p className="font-medium text-gray-800 mb-1.5">Course</p>
            <Form.Item
              name="course"
              style={{ magin: '0%' }}
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
                  setCourseModule(getStudentCourses?.records?.find((val) => val?.id === value));
                }}
              >
                {getStudentCourses?.records?.map((item) => (
                  <Select.Option value={item?.id} key={item?.id}>
                    {item?.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <p className="font-medium text-gray-800 mb-1.5">Module</p>
            <Form.Item
              name={['module', 'id']}
              style={{ magin: '0%' }}
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
                {courseModule?.modules?.map((items) => (
                  <Select.Option key={items?.id} value={items?.id}>
                    {items?.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <p className="font-medium text-gray-800  mb-1.5">Title</p>
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
                className=""
                autoSize={{ minRows: 3, maxRows: 6 }}
                placeholder="Type a note here!"
              />
            </Form.Item>

            <Divider style={{ margin: '0' }} />
            <div className="flex justify-end mt-2">
              <Form.Item>
                <Button htmlType="submit" type="primary">
                  {isModalForEdit === true ? 'Edit' : 'Add'} Remarks
                </Button>
              </Form.Item>
            </div>
          </Form>
        </Spin>
      </Modal>
    </div>
  );
};

export default connect(({ loading, staff }) => ({
  loadingForUploadRemark: loading?.effects['staff/uploadStaffRemarks'],
  getStudentCourses: staff?.getStudentCourses,
  loadingForGetCourse: loading?.effects['staff/getStudentCourses'],
}))(RemarksModal);
