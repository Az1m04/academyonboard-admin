import React from 'react';
import { Timeline } from 'antd';
import dayjs from 'dayjs';
import {
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

import AppIcons from '@/utils/AppIcons';

const ClientTimeline = ({ activityRec }) => {
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
      <div className="w-full" style={{ height: '45rem', overflow: 'auto', padding: '11px' }}>
        <Timeline className="w-full">
          {activityRec?.records?.map((rec, i) => (
            <Timeline.Item className="w-full" key={i} dot={getTimelineIcon('created')}>
              <div className="border-2 rounded-lg w-full">
                <div className="mx-1 mt-2 ">
                  <p className="mb-1 ">
                    {rec?.description}
                    <span
                      className="text-xs text-gray-500 pt-1 italic pl-1"
                      style={{ fontSize: '10px' }}
                    >
                      {dayjs(rec?.startTime).fromNow()}
                    </span>
                  </p>
                </div>

                <p
                  className="text-xs text-gray-500 flex justify-between mb-0 mx-1"
                  style={{ fontSize: '10px' }}
                >
                  <p className="mb-0 flex">
                    <svg
                      viewBox="64 64 896 896"
                      focusable="false"
                      data-icon="clock-circle"
                      width="1em"
                      height="1em"
                      fill="currentColor"
                      aria-hidden="true"
                      className="mr-0.5"
                      style={{ marginTop: '3px' }}
                    >
                      <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
                      <path d="M686.7 638.6L544.1 535.5V288c0-4.4-3.6-8-8-8H488c-4.4 0-8 3.6-8 8v275.4c0 2.6 1.2 5 3.3 6.5l165.4 120.6c3.6 2.6 8.6 1.8 11.2-1.7l28.6-39c2.6-3.7 1.8-8.7-1.8-11.2z"></path>
                    </svg>{' '}
                    {dayjs(rec?.startTime).format('MMM D')} at{' '}
                    {dayjs(rec?.startTime).format('h:mm A')}
                  </p>
                  {rec?.author?.displayName && (
                    <p className="mb-0 ">by {rec?.author?.displayName}</p>
                  )}
                </p>
              </div>
            </Timeline.Item>
          ))}
        </Timeline>
      </div>
    </div>
  );
};

export default ClientTimeline;
