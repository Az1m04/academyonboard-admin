import React from 'react';
import { connect } from 'umi';
import ArrowCustomDefault from '@/assets/img/ArrowCustomDefault.png';
import ArrowCustomYellow from '@/assets/img/ArrowCustomYellow.png';
import ArrowCustomGreen from '@/assets/img/ArrowCustomGreen.png';
import ArrowCustomRed from '@/assets/img/ArrowCustomRed.png';

const Steps = ({ studentStages }) => {
  const verifiedSteps = [
    {
      lable: 'Unverified',
      value: 'unverified',
      status: studentStages?.verifyStatus,
    },
    {
      lable: 'Registered',
      value: 'registered',
      status: studentStages?.registerStatus,
    },
    {
      lable: 'Courses running',
      value: 'coursesRunning',
      status: studentStages?.courseStatus,
    },
    {
      lable: 'Exam / Test',
      value: 'examTest',
      status: studentStages?.examTest,
    },
    {
      lable: 'Result',
      value: 'result',
      status: studentStages?.result,
    },
    {
      lable: 'Certificate',
      value: 'certificate',
      status: studentStages?.certificate,
    },
  ];
  return (
    <div className="flex justify-between mx-2 ">
      {verifiedSteps?.map((val) => (
        <>
          <div
            key={val?.value}
            className={`text-md ${
              val?.status === 'Active' && val?.value === 'coursesRunning'
                ? ' text-white '
                : `${
                    val?.status === 'Active' && val?.value === 'registered'
                      ? '  text-white '
                      : `${
                          val?.status === 'Active' && val?.value === 'unverified'
                            ? ' text-white '
                            : `${
                                val?.status === 'Active' && val?.value === 'classTest'
                                  ? '0  text-white '
                                  : `${
                                      val?.status === 'Active' && val?.value === 'result'
                                        ? ' text-white '
                                        : `${
                                            val?.status === 'Active' && val?.value === 'certificate'
                                              ? '  text-white '
                                              : `text-gray-700`
                                          }`
                                    }`
                              }`
                        }`
                  }`
            } relative text-center text-base  font-semibold w-full `}
          >
            <div className="absolute -ml-0 xl:-ml-0 2xl:-ml-5 w-full sm:mt-1 md:mt-2 lg:mt-3 ">
              {val?.lable}
            </div>
            <div>
              {' '}
              <img
                style={{ height: '45px' }}
                src={
                  val?.status === 'Active' && val?.value === 'coursesRunning'
                    ? ArrowCustomYellow
                    : `${
                        val?.status === 'Active' && val?.value === 'registered'
                          ? ArrowCustomGreen
                          : `${
                              val?.status === 'Active' && val?.value === 'unverified'
                                ? ArrowCustomRed
                                : `${
                                    val?.status === 'Active' && val?.value === 'classTest'
                                      ? ArrowCustomYellow
                                      : `${
                                          val?.status === 'Active' && val?.value === 'result'
                                            ? ArrowCustomGreen
                                            : `${
                                                val?.status === 'Active' &&
                                                val?.value === 'certificate'
                                                  ? ArrowCustomGreen
                                                  : ArrowCustomDefault
                                              }`
                                        }`
                                  }`
                            }`
                      }`
                }
                alt=""
              />
            </div>
          </div>
        </>
      ))}
    </div>
  );
};

export default connect(({ student, loading }) => ({
  studentStages: student.studentStages,
  loading: loading.effects['student/getStudentDetails'],
}))(Steps);
