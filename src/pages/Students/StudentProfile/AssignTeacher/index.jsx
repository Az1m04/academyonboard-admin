import { Button, Form, Select, Divider, Timeline, message } from 'antd';

import { connect, history } from 'umi';
import React, { useEffect, useState } from 'react';
import classes from './index.less';
import { debounce } from 'lodash';
import EmptyState from '@/components/EmptyState';
import CheckValidation from '@/components/CheckValidation';
import emptyStateSvg from '@/assets/icons/space-empty.svg';
import dayjs from 'dayjs';
import ReactHtmlParser from 'react-html-parser';
import AppIcons from '@/utils/AppIcons';

const AssignTeacher = ({
  dispatch,
  id,
  idx,
  setShowDrawer,
  getDepartmentStaffList,
  StudentTeacherActivity,
  departmentList,
}) => {
  const [form] = Form.useForm();
  const { Option } = Select;
  const [viewSize] = useState(10);
  const [batchRecord, setBatchRecord] = useState(null);
  const onCourseSelectHandler = () => {
    dispatch({
      type: 'batch/getBatches',
      payload: {
        query: { isFetchAll: true, programId: idx },
      },
    }).then((res) => setBatchRecord(res));
  };
  useEffect(() => {
    if (idx) onCourseSelectHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const getStaffList = (key) => {
    dispatch({
      type: 'staff/getStaffList',
      payload: {
        query: {
          statusId: 'PARTYINV_ACCEPTED',
          viewSize: 1000,
          keyword: key,
          showAdmin: true,
        },
      },
    });
  };
  const HandleSumit = (values) => {
    const data = {
      teacher: { id: values?.selectAssign },
    };
    dispatch({
      type: 'student/assignTeacher',
      payload: {
        body: data,
        pathParams: { studentId: id },
      },
    }).then((res) => {
      if (res?.status === 'ok') {
        setShowDrawer(false);
        message.success('You have set teacher successfully');

        history.push(`/students/${id}`);
      } else {
        message.error(res?.data?.message);
      }
    });
  };
  const debounceSearch = debounce(getStaffList, 400);

  const getTeacherActivityRecord = () => {
    dispatch({
      type: 'student/getStudentTeacherActivity',
      payload: {
        pathParams: { studentId: id },
        query: {
          activityType: 'student_teacher',
          viewSize: 1000,
        },
      },
    });
  };
  const getTimelineIcon = () => {
    return (
      <div
        className="flex items-center justify-center w-8 h-8 text-white rounded-full"
        style={{ backgroundColor: '#ffa500' }}
      >
        <AppIcons.PersonSquare />
      </div>
    );
  };

  useEffect(() => {
    getTeacherActivityRecord();
    getStaffList();
    dispatch({
      type: 'staff/getDepartmentList',
      payload: {
        query: {
          viewSize,
        },
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div>
        <Form
          form={form}
          hideRequiredMark
          autoComplete="off"
          onFinish={(values) => HandleSumit(values)}
        >
          <div className="px-4">
            <span className="block"> Select Batch</span>
            <Form.Item name="batch" style={{ margin: '0%' }}>
              <Select
                size="medium"
                placeholder={'select a batch'}
                style={{ width: '100%' }}
                getPopupContainer={(node) => node.parentNode}
              >
                {batchRecord?.records?.length > 0 &&
                  batchRecord?.records?.map((val) => (
                    <Option key={val?.id} value={val?.id}>
                      {val.name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </div>

          <div className="px-4 pt-4">
            <span className="block"> Select Department</span>
            <Form.Item
              name="department"
              rules={[{ required: true, message: 'Please select department' }]}
            >
              <Select
                placeholder="Please select departments"
                getPopupContainer={(node) => node.parentNode}
                onChange={(val) => {
                  dispatch({
                    type: 'staff/getDepartmentStaffList',
                    payload: {
                      pathParams: { depId: val },
                    },
                  });
                  form.setFieldsValue({
                    selectAssign: undefined,
                  });
                }}
              >
                {departmentList?.records?.map((val) => (
                  <Option key={val.id}>{val.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </div>
          <div className="px-4 -mt-2">
            <span className="block"> Select teacher</span>
            <Form.Item
              style={{ margin: '0%' }}
              name={'selectAssign'}
              rules={[{ required: true, message: 'Please select a teacher first' }]}
            >
              <Select
                filterOption={false}
                showSearch
                onSearch={debounceSearch}
                notFoundContent={null}
                style={{ width: '100%' }}
                placeholder="select a teacher"
                size="medium"
              >
                {getDepartmentStaffList?.members?.map((val) => (
                  <Option key={val?.id} value={val?.id}>
                    {val?.displayName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>
          <Divider style={{ margin: '2rem 0rem 2rem 0rem' }} />
          <div className="flex justify-end px-4">
            <Button size="large" onClick={() => {}} className="mr-4">
              Reset
            </Button>

            <Button type="primary" size="large" onClick={() => form.submit()}>
              Assign
            </Button>
          </div>
        </Form>
      </div>
      <div className="my-5 text-md font-semibold">Activity logs</div>
      <div className="flex justify-between ">
        <span>
          Showing{' '}
          <span className="text-blue-600 pr-1">{StudentTeacherActivity?.records?.length || 0}</span>
          of <span className="text-green-600">{StudentTeacherActivity?.totalCount || 0}</span>
        </span>
      </div>
      <CheckValidation
        show={StudentTeacherActivity?.records?.length > 0}
        fallback={
          <EmptyState
            emptyState={emptyStateSvg}
            emptyHeaderText={<span>No teacher have been assigned yet!</span>}
          />
        }
      />

      <div className={`px-5 ${classes.TimeLineIcon}`}>
        <Timeline className="w-full">
          {StudentTeacherActivity?.records?.map((rec) => (
            <>
              <Timeline.Item dot={getTimelineIcon()} key={rec?.ownerId}>
                <div className="flex justify-between pl-6">
                  <div className="flex-wrap w-full">
                    <div className="flex justify-between">
                      <div>
                        <span className="font-semibold text-blue-600">
                          {rec?.author?.displayName}
                        </span>{' '}
                        <span>{rec?.description}</span>
                      </div>
                      <div>
                        <div className="text-right text-gray-400">
                          <div className="text-xs italic text-gray-800">
                            {dayjs(rec?.startTime).fromNow()}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      <p className="m-0">
                        {dayjs(rec?.startTime).format('MMM D, YYYY')} at{' '}
                        {dayjs(rec?.startTime).format('h:mm A')}
                      </p>
                    </div>
                    <div className="w-full richtext-container-div">
                      {ReactHtmlParser(rec?.dataDescription)}
                    </div>
                  </div>
                </div>
              </Timeline.Item>
            </>
          ))}
        </Timeline>
      </div>
    </div>
  );
};

export default connect(({ student, staff }) => ({
  StudentTeacherActivity: student?.getStudentTeacherActivity,
  getDepartmentStaffList: staff.getDepartmentStaffList,
  departmentList: staff.departmentList,
  staffList: staff?.staffList,
}))(AssignTeacher);
