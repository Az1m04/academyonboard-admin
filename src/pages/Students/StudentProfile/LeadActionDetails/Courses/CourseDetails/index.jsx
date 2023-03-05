import { Timeline } from 'antd';

import { connect } from 'umi';
import React, { useEffect } from 'react';

// import classes from './index.less';

import { Divider } from 'antd';

const CourseDetails = ({ dispatch, courseid, getSingleCourse }) => {
  const getCourseDetails = () => {
    dispatch({
      type: 'courses/getSingleCourse',
      payload: {
        pathParams: {
          courseId: courseid,
        },
      },
    });
  };

  useEffect(() => {
    getCourseDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div>
        <Timeline className="w-full">
          <div key={getSingleCourse?.ownerId}>
            <div>
              <div className="font-bold ">
                Course Name :<span className="ml-2 text-gray-500 ">{getSingleCourse?.name}</span>
              </div>
              <div className="font-bold ">
                Category Name :
                <span className="ml-2 text-gray-500">{getSingleCourse?.categoryName}</span>
              </div>
              <div className="font-bold ">
                Sub-Category Name :
                <span className="ml-2 text-gray-500">{getSingleCourse?.subCategoryName}</span>
              </div>
              <div className="font-bold ">
                Discription :
                <span className="ml-2 text-gray-500">{getSingleCourse?.description}</span>
              </div>
              <Divider style={{ marginTop: '0.6rem' }} />
              <div className="text-lg font-bold">Modules</div>
              {getSingleCourse?.courseModules?.map((item, index) => {
                return (
                  <div key={item.id}>
                    <div className="mt-4 font-bold">
                      <span className="font-bold">{index + 1}.</span> Module Name :
                      <span className="ml-2 text-gray-500">{item?.name}</span>
                    </div>

                    <div className="ml-4 font-bold">
                      Daily Test Marks :
                      <span className="ml-2  text-gray-500">{item?.dailyTestMarks}</span>{' '}
                      <span className="ml-5">
                        By: <spam className="text-gray-500">{item.mockTestMarkEnteredBy}</spam>{' '}
                      </span>
                    </div>
                    <div className="ml-4 font-bold">
                      Mocy Test Marks :
                      <span className="ml-2  text-gray-500">{item?.mockTestMarks}</span>{' '}
                      <span className="ml-5">
                        By: <spam className="text-gray-500">{item.mockTestMarkEnteredBy}</spam>
                      </span>
                    </div>

                    {item.fees.map((items) => {
                      return (
                        <div key={items?.feeDurationId}>
                          <div className="ml-4 font-bold  ">
                            Fee Amount :
                            <span className="ml-2  text-gray-500">{items?.feeAmount}</span>{' '}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </Timeline>
      </div>
    </div>
  );
};

export default connect(({ student, user, courses }) => ({
  getSingleCourse: courses?.getSingleCourse,
  studentActivity: student?.getStudentOwnerActivity,
  currentUser: user.currentUser,
}))(CourseDetails);
