import React, { useEffect, useState } from 'react';
import { Avatar, Modal, Select, Button, Spin, message, Form } from 'antd';
import { connect, useParams } from 'umi';
import { getInitials } from '@/utils/common';
import { debounce } from 'lodash-es';
import style from './index.less';
import { UsergroupAddOutlined } from '@ant-design/icons';

function AddStudentToBatchModal({
  visible,
  setVisible,
  dispatch,
  primaryColor,
  fetching,
  studentsOfCurrentBatch,
  loading,
  courseId,
  currentBatchDetails,
}) {
  const [form] = Form.useForm();
  const [students, setStudents] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const { batchId } = useParams();
  const getStudents = (keyword) =>
    dispatch({
      type: 'student/getAllStudentList',
      payload: {
        query: {
          courseId,
          batchId,
          viewSize: 10000,
          keyword,
        },
      },
    })
      .then((res) => {
        const arrOfIdsStudentsOfCurrentBatch = studentsOfCurrentBatch?.map(
          (student) => student?.student?.id,
        );
        setStudentList(
          res?.records?.filter((student) => !arrOfIdsStudentsOfCurrentBatch?.includes(student?.id)),
        );
      })
      .catch(() => {});
  const debounceSearch = debounce(getStudents, 400);

  useEffect(() => {
    if (visible) {
      getStudents('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const handleAddStudentsToBatch = (values) => {
    const body = values?.students?.map((student) => ({ id: student }));
    dispatch({
      type: 'batch/addStudentsToBatch',
      payload: {
        body,
        pathParams: { batchId },
      },
    })
      .then(() => {
        dispatch({
          type: 'batch/getStudentAssignToBatch',
          payload: { pathParams: { batchId } },
        }).catch(() => {});
        message.success(`${values?.students?.length} student(s) added to the batch successfully`);
        form?.resetFields();
        setVisible(false);
      })
      .catch(() => {});
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-1.5" style={{ color: '#1B568F' }}>
          <UsergroupAddOutlined className="text-xl" />
          <h1 style={{ color: '#1B568F' }} className="m-0">
            Add students to batch
          </h1>
        </div>
      }
      visible={visible}
      onCancel={() => {
        setVisible(false);
        form?.resetFields();
      }}
      maskClosable={false}
      destroyOnClose
      bodyStyle={{ maxHeight: '60vh', overflow: 'auto' }}
      afterClose={() => {
        setStudents([]);
        setStudentList([]);
        form?.resetFields();
      }}
      footer={
        <div className="flex justify-between ">
          <div>{students?.length} Record(s)</div>
          <Button
            type="primary"
            loading={loading}
            onClick={() => {
              form?.submit();
            }}
          >
            Add
          </Button>
        </div>
      }
    >
      <Spin spinning={Boolean(fetching)}>
        <div className={` ${style.overRideSelect} w-full`}>
          <Form form={form} onFinish={(values) => handleAddStudentsToBatch(values)}>
            <p className="font-medium text-gray-900 mt-0 mb-1">Select Student</p>
            <Form.Item
              name="students"
              rules={[
                {
                  required: true,
                  message: 'Please select student',
                },
                () => ({
                  validator(_, value) {
                    if (currentBatchDetails?.modeId === 'OFFLINE') {
                      if (
                        value?.length + studentsOfCurrentBatch?.length <=
                        currentBatchDetails?.classRoom?.sittingCapacity
                      ) {
                        return Promise.resolve();
                        // eslint-disable-next-line no-else-return
                      } else {
                        return Promise.reject(
                          value &&
                            new Error(
                              `You can't add more than ${
                                currentBatchDetails?.classRoom?.sittingCapacity -
                                studentsOfCurrentBatch?.length
                              } student. because class room sitting capacity is ${
                                currentBatchDetails?.classRoom?.sittingCapacity
                              }`,
                            ),
                        );
                      }
                      // eslint-disable-next-line no-else-return
                    } else {
                      return Promise.resolve();
                    }
                  },
                }),
              ]}
            >
              <Select
                onChange={(ev) => {
                  setStudents(ev);
                }}
                placeholder="Search students"
                mode="multiple"
                value={students}
                showSearch
                filterOption={false}
                onSearch={debounceSearch}
                className="w-full"
                size="large"
              >
                {studentList?.map((student) => (
                  <Select.Option key={student?.id}>
                    <div className="w-full flex">
                      <div>
                        <Avatar style={{ background: primaryColor }} src={student?.photoUrl}>
                          {getInitials(student?.name)}
                        </Avatar>
                      </div>
                      <div className="pl-4 pb-2">
                        <p className="mb-0 ">{student?.name}</p>
                        <p className="mb-0 text-gray-600">{student?.primaryEmail}</p>
                      </div>
                    </div>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </div>
      </Spin>
    </Modal>
  );
}
export default connect(({ batch, settings, loading }) => ({
  primaryColor: settings.primaryColor,
  studentsOfCurrentBatch: batch?.studentsOfCurrentBatch,
  currentBatchDetails: batch?.currentBatchDetails,
  fetching: loading?.effects['student/getAllStudentList'],
  loading: loading?.effects['batch/addStudentsToBatch'],
}))(AddStudentToBatchModal);
