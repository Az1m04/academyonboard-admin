import React, { useEffect } from 'react';
import { Form, Button, Select, message, Divider, Timeline } from 'antd';
import { connect, history } from 'umi';
import classes from './index.less';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import CheckValidation from '@/components/CheckValidation';
import emptyStateSvg from '@/assets/icons/space-empty.svg';
import EmptyState from '@/components/EmptyState';
import AppIcons from '@/utils/AppIcons';
import ReactHtmlParser from 'react-html-parser';
import { debounce } from 'lodash';

dayjs.extend(relativeTime);

const AssignedStudentOwner = ({
  setShowDrawer,
  staffList,
  dispatch,
  id,
  loading,
  studentActivity,
  studentOwnerName,
}) => {
  const [form] = Form.useForm();
  const { Option } = Select;

  const getStaffList = (key) =>
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
  const getActivityRecord = () => {
    dispatch({
      type: 'student/getStudentOwnerActivity',
      payload: {
        pathParams: { studentId: id },
        query: {
          activityType: 'student_owner',
          viewSize: 1000,
        },
      },
    });
  };

  const debounceSearch = debounce(getStaffList, 400);

  useEffect(() => {
    getStaffList('');
    getActivityRecord();
    form.setFieldsValue({
      owner: { id: studentOwnerName?.displayName },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const createAssignOwner = (values) => {
    // eslint-disable-next-line no-console
    dispatch({
      type: 'student/assignOwner',
      payload: {
        body: values,
        pathParams: { studentId: id },
      },
    }).then((res) => {
      if (res?.status === 'ok') {
        setShowDrawer(false);
        message.success('You have set owner successfully');

        history.push(`/students/${id}`);
      } else {
        message.error(res?.data?.message);
      }
    });
  };
  return (
    <>
      <Form
        form={form}
        hideRequiredMark
        autoComplete="off"
        onFinish={(values) => createAssignOwner(values)}
      >
        <div className="p-4">
          <span className="block"> Select owner</span>
          <Form.Item
            name={['owner', 'id']}
            rules={[{ required: true, message: 'Please select a owner first' }]}
          >
            <Select
              filterOption={false}
              showSearch
              onSearch={debounceSearch}
              notFoundContent={null}
              style={{ width: '100%' }}
              placeholder="select a owner"
              size="medium"
            >
              {staffList?.records?.map((item) => {
                return (
                  <Option key={item?.partyId} value={item?.partyId}>
                    {item?.displayName}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        </div>
        <Divider style={{ margin: '0' }} />
        <div className="flex justify-end p-4">
          <Button
            size="large"
            onClick={() => {
              form.setFieldsValue({
                owner: { id: '' },
              });
            }}
            className="mr-4"
          >
            Reset
          </Button>

          <Button loading={loading} type="primary" size="large" onClick={() => form.submit()}>
            Assign
          </Button>
        </div>
      </Form>

      <div className="my-5 text-md font-semibold">Activity logs</div>
      <div className="flex justify-between ">
        <span>
          Showing{' '}
          <span className="text-blue-600 pr-1">{studentActivity?.records?.length || 0}</span>
          of <span className="text-green-600">{studentActivity?.totalCount || 0}</span>
        </span>
      </div>

      <CheckValidation
        show={studentActivity?.records?.length > 0}
        fallback={
          <EmptyState
            emptyState={emptyStateSvg}
            emptyHeaderText={<span>No owner have been assigned yet!</span>}
          />
        }
      />

      <div className={`px-5 ${classes.TimeLineIcon}`}>
        <Timeline className="w-full">
          {studentActivity?.records?.map((rec) => (
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
                    <div className="w-full rich text-container-div">
                      {ReactHtmlParser(rec?.dataDescription)}
                    </div>
                  </div>
                </div>
              </Timeline.Item>
            </>
          ))}
        </Timeline>
      </div>
    </>
  );
};

export default connect(({ student, user, loading, staff }) => ({
  currentUser: user?.currentUser,
  studentActivity: student?.getStudentOwnerActivity,
  staffList: staff?.staffList,
  loading: loading?.effects['leads/setLeadOwner'],
}))(AssignedStudentOwner);
