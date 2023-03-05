import React, { useEffect } from 'react';
import { connect, useParams } from 'umi';
import { notification } from 'antd';
import { Calendar3Icon } from '@/utils/AppIcons';
import moment from 'moment';
import { currencyFormatter } from '@/utils/utils';

const CourseDetails = ({ dispatch, studentCoursesEnrollments }) => {
  const { studentId } = useParams();
  const getStudentCourseEnrollments = () => {
    dispatch({
      type: 'student/getStudentCourseEnrollments',
      payload: {
        pathParams: {
          studentId,
        },
      },
    }).catch((err) => {
      notification.error({
        message: 'Oops! Something went wrong.',
        description: err?.data?.message,
      });
    });
  };
  useEffect(() => getStudentCourseEnrollments(), []);
  return (
    <div>
      {studentCoursesEnrollments?.enrollments?.map((enrObj) => (
        <div className=" rounded shadow" key={enrObj?.id}>
          <div className="p-2 flex justify-between">
            <div className="text-2xl p-2" style={{ color: '#0d6efd' }}>
              {Calendar3Icon()}
              {/* Beginning date month short code */}
              <div className="text-sm font-medium uppercase">
                {moment(enrObj?.startsAt).format('ll')?.substring(0, 3)}
              </div>
            </div>

            <div className="flex-auto border-l ml-1 pl-2">
              <div className="text-lg text-blue-800 font-semibold cursor-pointer">
                Enrolled in {enrObj?.name}
              </div>
              <div className="my-10 space-x-4">
                <span className="w- my-4 text-blue-700 bg-blue-200 rounded p-3 shadow">
                  Starts on {moment(enrObj?.startsAt).format('ddd MMM DD, YYYY')}
                </span>
                <span className="my-4 text-green-700 bg-green-200 rounded p-3 shadow">
                  Ends on {moment(enrObj?.endsAt).format('ddd MMM DD, YYYY')}
                </span>
              </div>
            </div>

            <div>
              <div className="font-semibold text-gray-800 text-xl text-center px-2 my-1">
                {/* for now amount is hardcoded. */}
                {currencyFormatter.format(3000)}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default connect(({ student }) => ({
  studentCoursesEnrollments: student.studentCoursesEnrollments,
}))(CourseDetails);
