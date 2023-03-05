import { Timeline } from 'antd';

import { connect } from 'umi';
import React, { useEffect } from 'react';
import dayjs from 'dayjs';
import EmptyState from '@/components/EmptyState';
import CheckValidation from '@/components/CheckValidation';
import AppIcons from '@/utils/AppIcons';
import emptyStateSvg from '@/assets/icons/space-empty.svg';
import classes from './index.less';
import ReactHtmlParser from 'react-html-parser';

const PaymentHistory = ({
  dispatch,
  // setShowDrawer,
  // showDrawer,
  studentActivity,
  idx,
  studentDetails,
}) => {
  // const [activityRecord, setActivityRecord] = useState(null);

  const getCoursePaymentActivity = () => {
    dispatch({
      type: 'student/getStudentOwnerActivity',
      payload: {
        pathParams: { studentId: studentDetails?.id },
        query: {
          activityType: 'student_course_payment',
          courseId: idx,
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
    getCoursePaymentActivity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
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
            emptyHeaderText={<span>No payment has been received yet!</span>}
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
    </div>
  );
};

export default connect(({ student, user }) => ({
  studentDetails: student?.studentDetails,
  currentUser: user.currentUser,
}))(PaymentHistory);
