/* eslint-disable react/no-array-index-key */
import React, { useEffect } from 'react';
import { Divider, Timeline, Tabs, Spin } from 'antd';
import { connect, useParams } from 'umi';
import AppIcons from '@/utils/AppIcons';
import CheckValidation from '@/components/CheckValidation';
import EmptyState from '@/components/EmptyState';
import emptyStateSvg from '@/assets/icons/space-empty.svg';
import {
  ClockFaded,
  NodePlus,
  BlackBoard,
  DemoCalender,
  PersonDashFill,
  JournalText,
  Dollar,
  PersonWorkSpace,
  BookFill,
  BookHalf,
  PersonCheck,
} from '@/utils/AppIcons';
import moment from 'moment';

const { TabPane } = Tabs;
const ActivityLog = ({ dispatch, activityRecord, loading }) => {
  const { staffId } = useParams();

  const tabs = [
    {
      title: 'All activities',
      key: '',
    },
    {
      title: 'By branch',
      key: 'By Branch',
    },
    {
      title: 'By staff',
      key: 'byStaff',
    },
  ];

  const getStaffActivitiesDetails = () => {
    dispatch({
      type: 'staff/getActivities',
      payload: {
        pathParams: {
          staffId,
        },
      },
    });
  };

  useEffect(() => {
    getStaffActivitiesDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const getActivityIcon = (type) => {
    switch (type) {
      case 'lead_priority':
        return <AppIcons.SortUp />;

      case 'lead_owner':
        return <AppIcons.PersonSquare />;

      case ' lead_follow_up_by':
        return <NodePlus />;

      case 'lead_demo_class':
        return <BlackBoard />;

      case 'demo_account':
        return <DemoCalender />;

      case 'lead_expired':
        return <PersonDashFill />;

      case 'lead_assessment_test':
        return <JournalText />;

      case 'student_payment':
        return <Dollar />;

      case 'lead_follow_up_by_student':
        return <PersonWorkSpace />;

      case 'add_student_course':
        return <BookFill />;

      case 'update_student_course':
        return <BookHalf />;

      case 'batch_assignee':
        return <PersonCheck />;
      default:
        return <AppIcons.PeopleFill />;
    }
  };
  const getTimelineIcon = (type) => {
    return (
      <div
        className="flex items-center justify-center w-8 h-8 text-white rounded-full"
        style={{ backgroundColor: '#ffa500' }}
      >
        {getActivityIcon(type)}
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-between">
        <div className="text-blue-600 font-semibold text-lg">Activity Timeline</div>
      </div>
      <Divider style={{ marginTop: '0.6rem' }} />
      <Spin spinning={Boolean(staffId) && loading}>
        <Tabs defaultActiveKey="" className="font-semibold text-blue-500">
          <Divider style={{ marginTop: '0.6rem' }} />
          {tabs?.map((item) => (
            <TabPane tab={<span className="font-semibold">{item?.title}</span>} key={item?.key}>
              <CheckValidation
                show={activityRecord?.records?.length > 0}
                fallback={
                  <EmptyState
                    emptyState={emptyStateSvg}
                    emptyHeaderText={<span>No activity has been logged yet!</span>}
                  />
                }
              />
              <div
                className="w-full"
                style={{ height: '45rem', overflow: 'auto', padding: '11px' }}
              >
                <Timeline className="w-full">
                  {activityRecord?.records?.map((rec, i) => (
                    <div key={i} className="flex">
                      <div style={{ flexWrap: 'wrap' }} className="mr-4 mt-2">
                        <span className="w-max flex">
                          <div className="mt-1 mr-1">
                            <ClockFaded />
                          </div>
                          <div>{moment(rec?.startTime).format('MMM D, YYYY')}</div>{' '}
                        </span>

                        <div className="ml-5">at {moment(rec?.startTime).format('h:mm A')}</div>
                      </div>
                      <Timeline.Item
                        className="w-full"
                        key={i}
                        dot={getTimelineIcon(rec?.activityType)}
                        style={{
                          marginTop: 20,
                        }}
                      >
                        <div className="border-2 rounded-lg -mt-2 flex">
                          <div className="mx-2 mt-2">
                            <p className="mb-2">{rec?.description}</p>
                          </div>
                          <p
                            className="mx-2 mt-2 mb-2 text-gray-500"
                            style={{ whiteSpace: 'nowrap' }}
                          >
                            {moment(rec?.startTime)?.fromNow()}
                          </p>
                        </div>
                      </Timeline.Item>
                    </div>
                  ))}
                </Timeline>
              </div>
            </TabPane>
          ))}
        </Tabs>
      </Spin>
    </div>
  );
};

export default connect(({ staff, loading }) => ({
  activityRecord: staff?.getActivities,
  loading: loading?.effects['staff/getActivities'],
}))(ActivityLog);
