import React, { useState, useEffect } from 'react';
import { Select, DatePicker, Divider, Timeline, Tabs, Spin } from 'antd';
import moment from 'moment';
import { connect, useParams, history } from 'umi';

import AppIcons from '@/utils/AppIcons';
import dayjs from 'dayjs';

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

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const LeadActivityLog = ({ dispatch, activityRecord, loadingForGetActivity }) => {
  const { leadId } = useParams();
  const { Option } = Select;
  // const [activity, setActivity] = useState('All_Activities');
  // const [quickActivity, setQuickActivity] = useState('All');

  const [selectedDate, setSelectedDate] = useState('');
  const [range, setRange] = useState([moment().subtract(7, 'day'), moment()]);
  const [tab, setTab] = useState('allActivities');

  // const activityActionList = [
  //   {
  //     id: '0',
  //     label: 'Edit',
  //     value: 'edit',
  //   },
  //   {
  //     id: '1',
  //     label: 'Upgrade course',
  //     value: 'upgrade_course',
  //   },

  //   {
  //     id: '2',
  //     label: 'Assign batch',
  //     value: 'assign_batch',
  //   },
  //   {
  //     id: '3',
  //     label: 'Assign test',
  //     value: 'assign_test',
  //   },
  //   {
  //     id: '4',
  //     label: 'Assign teacher/change teacher',
  //     value: 'assign_teacher',
  //   },
  //   {
  //     id: '5',
  //     label: 'Assign student owner/change',
  //     value: 'assign_student_owner',
  //   },
  // ];

  // const activityList = [
  //   {
  //     id: '0',
  //     label: 'All Activities',
  //     value: 'All_Activities',
  //   },
  //   {
  //     id: '1',
  //     label: 'Lead priority',
  //     value: 'lead_priority',
  //   },

  //   {
  //     id: '2',
  //     label: 'Lead owner',
  //     value: 'lead_owner',
  //   },
  //   {
  //     id: '2',
  //     label: 'Follow up',
  //     value: 'lead_followUpBy',
  //   },
  // ];

  const activityTimeList = [
    {
      label: 'Today',
      id: 'TODAY',
    },
    {
      label: 'Yesterday',
      id: 'YESTERDAY',
    },
    {
      label: 'Last 7 days',
      id: 'WEEK',
    },
    {
      label: 'Last 15 days',
      id: 'FORTNIGHT',
    },
    {
      label: 'Last 30 days',
      id: 'MONTH',
    },

    {
      label: 'Last month',
      id: 'LAST_MONTH',
    },
    {
      label: 'Custom',
      id: 'CUSTOM',
    },
  ];

  const getActivityRecord = () => {
    const data = {};
    if (tab === 'byBranch') {
      data.activityType = 'lead_follow_up_by';
      history.push('?activityType=by-branch');
    } else if (tab === 'byLead') {
      data.activityType = 'lead_follow_up_by_lead';
      history.push('?activityType=by-lead');
    } else {
      history.push('?activityType=all-activities');
    }
    // switch (quickActivity) {
    //   case 'edit':
    //     data.activityType = 'update_student';
    //     history.push('?activityType=update_student');
    //     break;
    //   case 'upgrade_course':
    //     data.activityType = 'update_student_course';
    //     history.push('?activityType=by-lead-priority');
    //     break;
    //   case 'assign_batch':
    //     data.activityType = 'batch_assignee';
    //     history.push('?activityType=by-lead-owner');
    //     break;
    //   case 'assign_test':
    //     data.activityType = 'lead_followUpBy';
    //     history.push('?activityType=by-lead-follow-Up-By');
    //     break;
    //   case 'assign_teacher':
    //     data.activityType = 'student_teacher';
    //     history.push('?activityType=student_teacher');
    //     break;
    //   case 'assign_student_owner':
    //     data.activityType = 'student_owner';
    //     history.push('?activityType=student_owner');
    //     break;
    //   default:
    //     history.push('?activityType=');
    //     break;
    // }
    // switch (activity) {
    //   case 'All_Activities':
    //     data.typeId = 'All_Activities';
    //     history.push('?activityType=all-activities?typeId=all-activities');
    //     break;
    //   case 'lead_priority':
    //     data.typeId = 'lead_priority';
    //     history.push('?typeId=by-lead-priority');
    //     break;
    //   case 'lead_owner':
    //     data.typeId = 'lead_owner';
    //     history.push('?typeId=by-lead-owner');
    //     break;
    //   case 'lead_followUpBy':
    //     data.typeId = 'lead_followUpBy';
    //     history.push('?typeId=by-lead-follow-Up-By');
    //     break;
    //   default:
    //     data.typeId = 'All_Activities';
    //     history.push('?typeId=all-activities');
    //     break;
    // }

    switch (selectedDate) {
      case 'TODAY':
        data.interval = 'TODAY';
        history.push('?interval=TODAY');
        break;
      case 'YESTERDAY':
        data.interval = 'YESTERDAY';
        history.push('?interval=YESTERDAY');
        break;
      case 'WEEK':
        data.interval = 'WEEK';
        history.push('?interval=Last-7-days');
        break;
      case 'FORTNIGHT':
        data.interval = 'FORTNIGHT';
        history.push('?interval=Last-15-days');
        break;
      case 'MONTH':
        data.interval = 'MONTH';
        history.push('?interval=Last-30-days');
        break;
      case 'LAST_MONTH':
        data.interval = 'LAST_MONTH';
        history.push('?interval=LAST-MONTH');
        break;
      case 'CUSTOM':
        history.push('?interval=CUSTOM');
        break;

      default:
        data.interval = '';
        history.push('?interval=TODAY');
        break;
    }
    if (tab === 'byBranch' || tab === 'byStudent') {
      delete data?.typeId;
    }

    const payload = {
      pathParams: { leadId },
      query: {
        ...data,
        startDate:
          selectedDate === 'CUSTOM' && range !== null
            ? range[0]?.format('YYYY-MM-DD HH:mm:ss')
            : '',
        endDate:
          selectedDate === 'CUSTOM' && range !== null
            ? range[1]?.format('YYYY-MM-DD HH:mm:ss')
            : '',
        viewSize: 1000,
      },
    };

    dispatch({
      type: 'leads/getActivity',
      payload,
    });
  };

  useEffect(() => {
    getActivityRecord();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, range, tab]);
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
        <div className="text-blue-600 font-semibold text-lg">Activity logs</div>
        <div className="flex justify-between">
          <div className="flex justify-between">
            <div className="mr-2">
              <Select
                style={{ width: '12rem', color: '#3B82F6' }}
                onChange={(value) => {
                  setSelectedDate(value);
                }}
                placeholder="select..."
              >
                {activityTimeList?.map((item) => (
                  <Option
                    key={item?.id}
                    value={item?.id}
                    className="bg-gray-100 rounded-lg mx-2 mt-2"
                    style={{ color: '#3B82F6' }}
                  >
                    {item?.label}
                  </Option>
                ))}
              </Select>
            </div>
            <div>
              {selectedDate === 'CUSTOM' && (
                <RangePicker
                  value={range}
                  format="DD MMM, YYYY"
                  onChange={(val) => {
                    setRange(val);
                    getActivityRecord(val);
                  }}
                  placeholder={['Search by', 'date']}
                  style={{ width: '12rem' }}
                  disabledDate={(date) => date > moment().add(1, 'day')}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <Divider style={{ marginTop: '0.6rem' }} />
      <Spin spinning={Boolean(loadingForGetActivity)}>
        <Tabs
          defaultActiveKey="allActivities"
          activeKey={tab}
          onChange={(val) => {
            setTab(val);
          }}
          className="font-semibold text-blue-500"
        >
          <Divider style={{ marginTop: '0.6rem' }} />
          <TabPane tab={<span className="font-semibold">All activities</span>} key="allActivities">
            <CheckValidation
              show={activityRecord?.records?.length > 0}
              fallback={
                <EmptyState
                  emptyState={emptyStateSvg}
                  emptyHeaderText={<span>No activity has been logged yet!</span>}
                />
              }
            />
            <div className="w-full" style={{ height: '38rem', overflow: 'auto', padding: '11px' }}>
              <Timeline className="w-full">
                {activityRecord?.records?.map((rec, i) => (
                  <div key={i} className="flex">
                    <div style={{ flexWrap: 'wrap' }} className="mr-4 mt-2">
                      <span className="w-max flex">
                        <div className="mt-1 mr-1">
                          <ClockFaded />
                        </div>
                        <div>{dayjs(rec?.startTime).format('MMM D, YYYY')}</div>{' '}
                      </span>

                      <div className="ml-5">at {dayjs(rec?.startTime).format('h:mm A')}</div>
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
                          {dayjs(rec?.startTime)?.fromNow()}
                        </p>
                      </div>
                    </Timeline.Item>
                  </div>
                ))}
              </Timeline>
            </div>
          </TabPane>
          <TabPane tab={<span className="font-semibold">By branch</span>} key="byBranch">
            <CheckValidation
              show={activityRecord?.records?.length > 0}
              fallback={
                <EmptyState
                  emptyState={emptyStateSvg}
                  emptyHeaderText={<span>No Activities found yet!</span>}
                />
              }
            />
            <div className="w-full" style={{ height: '38rem', overflow: 'auto', padding: '11px' }}>
              <Timeline className="w-full">
                {activityRecord?.records?.map((rec, i) => (
                  <div key={i} className="flex">
                    <div style={{ flexWrap: 'wrap' }} className="mr-4 mt-2">
                      <span className="w-max flex">
                        <div className="mt-1 mr-1">
                          <ClockFaded />
                        </div>{' '}
                        <div>{dayjs(rec?.startTime).format('MMM D, YYYY')}</div>{' '}
                      </span>

                      <div className="ml-5">at {dayjs(rec?.startTime).format('h:mm A')}</div>
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
                          {dayjs(rec?.startTime)?.fromNow()}
                        </p>
                      </div>
                    </Timeline.Item>
                  </div>
                ))}
              </Timeline>
            </div>
          </TabPane>
          <TabPane tab={<span className="font-semibold">By Lead</span>} key="byLead">
            <CheckValidation
              show={activityRecord?.records?.length > 0}
              fallback={
                <EmptyState
                  emptyState={emptyStateSvg}
                  emptyHeaderText={<span>No Activities found yet!</span>}
                />
              }
            />
            <div className="w-full" style={{ height: '38rem', overflow: 'auto', padding: '11px' }}>
              <Timeline className="w-full">
                {activityRecord?.records?.map((rec, i) => (
                  <div key={i} className="flex">
                    <div style={{ flexWrap: 'wrap' }} className="mr-4 mt-2">
                      <span className="w-max flex">
                        <div className="mt-1 mr-1">
                          <ClockFaded />
                        </div>{' '}
                        <div>{dayjs(rec?.startTime).format('MMM D, YYYY')}</div>{' '}
                      </span>

                      <div className="ml-5">at {dayjs(rec?.startTime).format('h:mm A')}</div>
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
                          {dayjs(rec?.startTime)?.fromNow()}
                        </p>
                      </div>
                    </Timeline.Item>
                  </div>
                ))}
              </Timeline>
            </div>
          </TabPane>
        </Tabs>
      </Spin>
    </div>
  );
};

export default connect(({ leads, loading }) => ({
  activityRecord: leads?.activityRecord,
  loadingForGetActivity: loading?.effects['leads/getActivity'],
}))(LeadActivityLog);
