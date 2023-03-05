import React, { useEffect } from 'react';
import successtick from '@/assets/successtick.gif';
import JWT from 'jwt-decode';

const SuccessfullyDone = ({
  dispatch,
  location: {
    query: { token },
  },
}) => {
  const NewToken = JWT(token);
  useEffect(() => {
    dispatch({
      type: 'students/studentExtentCourseToken',
      payload: {
        body: token,
        pathPrams: { studentId: NewToken?.studentId, courseId: NewToken?.courseId },
      },
    });
  }, []);
  return (
    <div className="flex justify-center">
      <div>
        <p className="text-5xl font-semibold text-green-500  text-center">Done</p>
        <img src={successtick} height="100%" width="100%" alt="Successfully" />
      </div>
    </div>
  );
};

export default SuccessfullyDone;
