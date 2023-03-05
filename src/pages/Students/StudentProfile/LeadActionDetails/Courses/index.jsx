import {
  CalendarOutlined,
  CarryOutOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarCircleOutlined,
  DollarOutlined,
  ExclamationCircleTwoTone,
  EyeOutlined,
  HistoryOutlined,
  IdcardOutlined,
  InteractionOutlined,
  NodeCollapseOutlined,
  PauseCircleOutlined,
  SafetyOutlined,
  UserOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';
import { Divider, Tooltip, Spin, Drawer, Dropdown, Menu } from 'antd';
import { connect, useParams } from 'umi';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { getInitials } from '@/utils/common';
import EmptyState from '@/components/EmptyState';
import CheckValidation from '@/components/CheckValidation';
import emptyStateSvg from '@/assets/icons/space-empty.svg';
import UpgradeCourse from '../../UpgradeCourse';
import AssignBatch from '../../AssignBatch';
import AssignAssessmentTest from '@/pages/Students/StudentProfile/AssignTest';
import AddAdditionalDays from '../../AddAdditionalDays';
import Fees from '../../Fees';
import AssignTeacher from '../../AssignTeacher';
import AssignedStudentOwner from '../../AssignedStudentOwner';
import { currencyFormatter } from '@/utils/utils';
import WithdrawCourse from '../../WithdrawCourse';
import CourseActivityLogs from './CourseActivityLogs';
import PaymentHistory from './PaymentHistory';
import PauseCourse from '../../PauseCourse';
import ChangeCourseStatus from '../../ChangeCourseStatus';
import { RiFileMarkLine } from 'react-icons/ri';
import CourseDetails from './CourseDetails';

const Courses = ({ dispatch, courseDetails, loadingCourses }) => {
  const { studentId } = useParams();
  const [showDrawer, setShowDrawer] = useState(false);
  const [idx, setIdx] = useState('');
  const [option, setOption] = useState();
  const [coursePaidFee, setCoursePaidFee] = useState(null);

  const getCourseDetails = () => {
    dispatch({
      type: 'student/getCourseDetails',
      payload: {
        pathParams: {
          studentId,
        },
      },
    }).catch(() => {});
  };
  const getStudentWallets = () => {
    dispatch({
      type: 'student/getStudentWallet',
      payload: {
        pathParams: {
          studentId,
        },
      },
    }).catch(() => {});
  };

  const UI = () => {
    switch (option) {
      case 'Payment history':
        return (
          <PaymentHistory
            idx={idx}
            coursePaidFee={coursePaidFee}
            setShowDrawer={setShowDrawer}
            showDrawer={showDrawer}
          />
        );
      case 'Activity logs':
        return (
          <CourseActivityLogs
            idx={idx}
            coursePaidFee={coursePaidFee}
            setShowDrawer={setShowDrawer}
            showDrawer={showDrawer}
          />
        );
      case 'Course Details':
        return (
          <CourseDetails
            courseid={idx}
            coursePaidFee={coursePaidFee}
            setShowDrawer={setShowDrawer}
            showDrawer={showDrawer}
          />
        );
      case 'Withdraw course':
        return (
          <WithdrawCourse
            idx={idx}
            setShowDrawer={setShowDrawer}
            coursePaidFee={coursePaidFee}
            showDrawer={showDrawer}
          />
        );
      case 'Pause course':
        return (
          <PauseCourse
            idx={idx}
            setShowDrawer={setShowDrawer}
            coursePaidFee={coursePaidFee}
            showDrawer={showDrawer}
          />
        );
      case 'Change course status':
        return (
          <ChangeCourseStatus
            idx={idx}
            setShowDrawer={setShowDrawer}
            coursePaidFee={coursePaidFee}
            showDrawer={showDrawer}
          />
        );
      case 'Assign batch':
        return (
          <AssignBatch
            idx={idx?.id}
            id={studentId}
            setShowDrawer={setShowDrawer}
            showDrawer={showDrawer}
          />
        );
      case 'Assign test':
        return (
          <AssignAssessmentTest
            idx={idx}
            id={studentId}
            setShowDrawer={setShowDrawer}
            showDrawer={showDrawer}
          />
        );
      case 'Update course':
        return (
          <UpgradeCourse
            idx={idx}
            id={studentId}
            setShowDrawer={setShowDrawer}
            showDrawer={showDrawer}
          />
        );
      case 'Add additional days':
        return (
          <AddAdditionalDays idx={idx} setShowDrawer={setShowDrawer} showDrawer={showDrawer} />
        );
      case 'Add fee':
        return <Fees idx={idx} setShowDrawer={setShowDrawer} showDrawer={showDrawer} />;
      case 'Upgrade course':
        return (
          <UpgradeCourse
            idx={idx}
            id={studentId}
            setShowDrawer={setShowDrawer}
            showDrawer={showDrawer}
          />
        );

      case 'Assign teacher/change teacher':
        return (
          <AssignTeacher
            idx={idx}
            id={studentId}
            setShowDrawer={setShowDrawer}
            showDrawer={showDrawer}
          />
        );
      case 'Assigned course owner/change':
        return (
          <AssignedStudentOwner
            idx={idx}
            id={studentId}
            setShowDrawer={setShowDrawer}
            showDrawer={showDrawer}
          />
        );

      default:
        return <AssignBatch idx={idx} setShowDrawer={setShowDrawer} showDrawer={showDrawer} />;
    }
  };

  const setTitle = (value) => {
    switch (value) {
      case 'Withdraw course':
        return (
          <div className="items-start flex">
            <div className="mr-2  pr-2">
              <NodeCollapseOutlined style={{ color: 'rgb(30, 58, 138)', fontSize: '20px' }} />
            </div>
            <div>
              <span className="text-sm font-semibold text-blue-900"> Withdraw course</span>
              <div className="text-sm font-normal text-gray-500">Withdraw Course here</div>
            </div>
          </div>
        );
      case 'Pause course':
        return (
          <div className="items-start flex">
            <div className="mr-2  pr-2">
              <PauseCircleOutlined style={{ color: 'rgb(30, 58, 138)', fontSize: '20px' }} />
            </div>
            <div>
              <span className="text-sm font-semibold text-blue-900"> Pause course</span>
              <div className="text-sm font-normal text-gray-500">Pause Course here</div>
            </div>
          </div>
        );
      case 'Change course status':
        return (
          <div className="items-start flex">
            <div className="mr-2  pr-2">
              <SafetyOutlined style={{ color: 'rgb(30, 58, 138)', fontSize: '20px' }} />
            </div>
            <div>
              <span className="text-sm font-semibold text-blue-900">
                {' '}
                Change course status manually
              </span>
              <div className="text-sm font-normal text-gray-500">
                Change course status manually here
              </div>
            </div>
          </div>
        );
      case 'Payment history':
        return (
          <div className="items-start flex">
            <div className="mr-2  pr-2">
              <HistoryOutlined style={{ color: 'rgb(30, 58, 138)', fontSize: '20px' }} />
            </div>
            <div>
              <span className="text-sm font-semibold text-blue-900"> Payment history</span>
              <div className="text-sm font-normal text-gray-500">Payment history of the course</div>
            </div>
          </div>
        );
      case 'Activity logs':
        return (
          <div className="items-start flex">
            <div className="mr-2  pr-2">
              <InteractionOutlined style={{ color: 'rgb(30, 58, 138)', fontSize: '20px' }} />
            </div>
            <div>
              <span className="text-sm font-semibold text-blue-900"> Activity logs</span>
              <div className="text-sm font-normal text-gray-500">Activity logs of the course</div>
            </div>
          </div>
        );
      case 'Course Details':
        return (
          <div className="items-start flex">
            <div className="mr-2  pr-2">
              <RiFileMarkLine style={{ color: 'rgb(30, 58, 138)', fontSize: '20px' }} />
            </div>
            <div>
              <span className="text-sm font-semibold text-blue-900 mt-[-4px]"> Course Details</span>
            </div>
          </div>
        );
      case 'Update course':
        return (
          <div className="items-start flex">
            <div className="mr-2  pr-2">
              <UserOutlined style={{ color: 'rgb(30, 58, 138)', fontSize: '20px' }} />
            </div>
            <div>
              <span className="text-sm font-semibold text-blue-900"> Update course</span>
              <div className="text-sm font-normal text-gray-500">Update course here</div>
            </div>
          </div>
        );

      case 'Assign batch':
        return (
          <div className="items-start flex">
            <div className="mr-2  pr-2">
              <IdcardOutlined style={{ color: 'rgb(30, 58, 138)', fontSize: '20px' }} />
            </div>
            <div>
              <span className="text-sm font-semibold text-blue-900">
                {' '}
                {idx?.batch ? 'Change batch' : 'Assign batch'}
              </span>
              <div className="text-sm font-normal text-gray-500">
                {idx?.batch ? 'Change batch of' : 'Assign batch to'} the course here
              </div>
            </div>
          </div>
        );
      case 'Assign test':
        return (
          <div className="items-start flex">
            <div className="mr-2  pr-2">
              <CarryOutOutlined style={{ color: 'rgb(30, 58, 138)', fontSize: '20px' }} />
            </div>
            <div>
              <span className="text-sm font-semibold text-blue-900"> Assign test</span>
              <div className="text-sm font-normal text-gray-500">
                Assign test to the course here
              </div>
            </div>
          </div>
        );

      case 'Add additional days':
        return (
          <div className="items-start flex">
            <div className="mr-2  pr-2">
              <CalendarOutlined style={{ color: 'rgb(30, 58, 138)', fontSize: '20px' }} />
            </div>
            <div>
              <span className="text-sm font-semibold text-blue-900"> Add additional days</span>
              <div className="text-sm font-normal text-gray-500">Add additional days here</div>
            </div>
          </div>
        );

      case 'Add fee':
        return (
          <div className="items-start flex">
            <div className="mr-2  pr-2">
              <DollarOutlined style={{ color: 'rgb(30, 58, 138)', fontSize: '20px' }} />
            </div>
            <div>
              <span className="text-sm font-semibold text-blue-900">Add fee</span>
              <div className="text-sm font-normal text-gray-500">Add fee</div>
            </div>
          </div>
        );

      case 'Assign teacher/change teacher':
        return (
          <div className="items-start flex">
            <div className="mr-2  pr-2">
              <UserSwitchOutlined style={{ color: 'rgb(30, 58, 138)', fontSize: '20px' }} />
            </div>
            <div>
              <span className="text-sm font-semibold text-blue-900">
                Assign teacher/change teacher
              </span>
              <div className="text-sm font-normal text-gray-500">Assign teacher/change teacher</div>
            </div>
          </div>
        );
      case 'Assigned course owner/change':
        return (
          <div className="items-start flex">
            <div className="mr-2  pr-2">
              <UserSwitchOutlined style={{ color: 'rgb(30, 58, 138)', fontSize: '20px' }} />
            </div>
            <div>
              <span className="text-sm font-semibold text-blue-900">
                Assigned course owner/change
              </span>
              <div className="text-sm font-normal text-gray-500">Assigned course owner/change</div>
            </div>
          </div>
        );

      default:
        break;
    }
    return '';
  };

  useEffect(() => {
    getCourseDetails();
    getStudentWallets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId, dispatch]);

  const renderSideColor = (index) => {
    if (index % 2 === 0) {
      return 'bg-yellow-500';
    }
    if (index % 3 === 0) {
      return 'bg-red-500';
    }
    return 'bg-green-500';
  };
  const onClick = ({ key }) => {
    setOption(key);
  };

  const menu = (course) => {
    // console.log(course, '<===course');

    return (
      <Menu onClick={onClick}>
        <Menu.Item
          key="Update course"
          onClick={() => {
            setIdx(course?.id);
            setShowDrawer(true);
          }}
        >
          Update course
        </Menu.Item>
        <Menu.Item
          key="Withdraw course"
          onClick={() => {
            setIdx(course?.id);
            setShowDrawer(true);
            setCoursePaidFee(course);
          }}
        >
          Withdraw course
        </Menu.Item>
        <Menu.Item
          key="Pause course"
          onClick={() => {
            setIdx(course?.id);
            setShowDrawer(true);
            setCoursePaidFee(course);
          }}
        >
          Pause course
        </Menu.Item>
        <Menu.Item
          key="Change course status"
          onClick={() => {
            setIdx(course?.id);
            setShowDrawer(true);
            setCoursePaidFee(course);
          }}
        >
          Change course status manually
        </Menu.Item>
        <Menu.Item
          key="Assign batch"
          onClick={() => {
            setIdx(course);
            setShowDrawer(true);
          }}
        >
          {course?.batch ? 'Change batch' : 'Assign batch'}
        </Menu.Item>
        <Menu.Item
          key="Assign test"
          onClick={() => {
            setIdx(course?.id);
            setShowDrawer(true);
          }}
        >
          Assign test
        </Menu.Item>
        <Menu.Item
          key="Add additional days"
          onClick={() => {
            setIdx(course?.id);
            setShowDrawer(true);
          }}
        >
          Add additional days
        </Menu.Item>
        <Menu.Item
          key="Add fee"
          onClick={() => {
            setIdx(course?.id);
            setShowDrawer(true);
          }}
        >
          Add fee
        </Menu.Item>
        <Menu.Item
          key="Assign teacher/change teacher"
          onClick={() => {
            setIdx(course?.id);
            setShowDrawer(true);
          }}
        >
          Assign teacher/change teacher
        </Menu.Item>
        <Menu.Item
          key="Assigned course owner/change"
          onClick={() => {
            setIdx(course?.id);
            setShowDrawer(true);
          }}
        >
          Assigned course owner/change
        </Menu.Item>
      </Menu>
    );
  };

  return (
    <div style={{ marginBottom: '2.5rem', overflow: 'auto', padding: '11px' }}>
      <div className="flex justify-between">
        <div className="text-blue-600 font-semibold text-lg">Courses</div>
      </div>
      <Divider style={{ marginTop: '0.6rem' }} />
      <div className="overflow-y-auto" style={{ height: '37rem' }}>
        <CheckValidation
          show={courseDetails?.records?.length > 0}
          fallback={
            <EmptyState
              emptyState={emptyStateSvg}
              emptyHeaderText={<span>No courses found yet!</span>}
            />
          }
        />
        <Spin spinning={Boolean(studentId) && loadingCourses}>
          {courseDetails?.records?.map((course, index) => (
            <div key={course?.id} className="flex mb-4 h-full shadow-md">
              <div className={`${renderSideColor(index)} w-2 rounded-l-lg  `} />
              <div className="border w-full rounded-r-lg">
                <div className="flex justify-between">
                  <div className="my-2 border-r w-11/12 ">
                    <div className="flex text-lg text-center items-center font-semibold text-blue-700 px-4  ">
                      <div className="text-left w-auto">{course?.name}</div>
                      {course?.batch && (
                        <div className=" px-2 -mt-1">
                          <Tooltip
                            autoAdjustOverflow={true}
                            overlayInnerStyle={
                              course?.lastBatch ? { width: '650px' } : { width: '350px' }
                            }
                            placement="topLeft"
                            color="white"
                            title={
                              <div className="text-black py-2 px-1 w-full">
                                <table className="text-center">
                                  <tr className=" border">
                                    <th className="border-r" style={{ width: '100px' }}>
                                      Sr No
                                    </th>
                                    {course?.lastBatch && (
                                      <>
                                        <th className="border-r" style={{ width: '100px' }}>
                                          Previous Batch Name
                                        </th>
                                        <th className="border-r" style={{ width: '100px' }}>
                                          From
                                        </th>
                                        <th className="border-r" style={{ width: '100px' }}>
                                          To
                                        </th>
                                      </>
                                    )}
                                    <th className="border-r" style={{ width: '100px' }}>
                                      Current Batch Name
                                    </th>
                                    <th className="border-r" style={{ width: '100px' }}>
                                      From
                                    </th>
                                    <th className="border-r" style={{ width: '100px' }}>
                                      To
                                    </th>
                                  </tr>

                                  <tr className="border">
                                    <td className="border-r">{1}</td>
                                    {course?.lastBatch && (
                                      <>
                                        <td className="border-r">{course?.lastBatch?.name}</td>
                                        <td className="border-r">
                                          {moment(course?.lastBatch?.estimatedStartDate).format(
                                            'LL',
                                          )}
                                        </td>
                                        <td className="border-r">
                                          {moment(
                                            course?.lastBatch?.estimatedCompletionDate,
                                          ).format('LL')}
                                        </td>
                                      </>
                                    )}
                                    <td className="border-r">{course?.batch?.name}</td>
                                    <td className="border-r">
                                      {moment(course?.batch?.estimatedStartDate).format('LL')}
                                    </td>
                                    <td className="border-r">
                                      {moment(course?.batch?.estimatedCompletionDate).format('LL')}
                                    </td>
                                  </tr>
                                </table>
                                {/* <div className="pb-1">
                                  
                                  {course?.batch ? `Current Batch: ${course?.batch?.name}` : ''}
                                </div>
                                <div>
                                  
                                  {course?.lastBatch
                                    ? `Last Batch: ${course?.lastBatch?.name}`
                                    : ''}
                                </div> */}
                              </div>
                            }
                          >
                            <ExclamationCircleTwoTone />
                          </Tooltip>
                        </div>
                      )}
                      <span className="text-yellow-500 mx-2 mt-1" style={{ fontSize: '12px' }}>
                        {course?.batch ? (
                          <>
                            <div className="flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                fill={course.batch?.mode === 'Online' ? '#180' : 'red'}
                                viewBox="0 0 16 16"
                              >
                                <circle cx="8" cy="8" r="8" />
                              </svg>
                              <div className="ml-1">({course.batch?.mode})</div>
                            </div>
                          </>
                        ) : (
                          ''
                        )}
                      </span>
                      <Tooltip
                        title={`Expiring on ${moment(course?.endDate).format('DD MMM YYYY')} (
                         ${moment(course?.endDate).format('LT')})`}
                      >
                        <div
                          className={
                            course?.courseStatus === 'Withdraw'
                              ? 'bg-red-500 rounded-lg text-white text-sm p-2 shadow-md'
                              : 'bg-green-500 rounded-lg text-white text-sm p-2 shadow-md'
                          }
                          style={{ fontSize: '12px' }}
                        >
                          Status : {course?.courseStatus ? course?.courseStatus : 'Pending'}
                        </div>
                      </Tooltip>
                      <Tooltip
                        title={`Due on : ${
                          course?.paymentDueDate
                            ? moment(course?.paymentDueDate).format('DD/MM/YYYY')
                            : 'No due date'
                        }`}
                      >
                        <div
                          className="bg-yellow-500 rounded-lg text-white text-sm ml-2 p-2 shadow-md"
                          style={{ fontSize: '12px' }}
                        >
                          Fees status : {course?.feeStatus ? course?.feeStatus : 'No due date'}
                        </div>
                      </Tooltip>
                      <Tooltip
                        title={
                          // <>
                          course?.modules
                            ? course?.modules?.map((item) => (
                                <div key={item?.id}>
                                  {item?.name} : {item?.attendancePercentage}%
                                </div>
                              ))
                            : `${course?.attendancePercentage}%`
                        }
                      >
                        <div
                          className="bg-yellow-500 rounded-lg text-white text-sm ml-2 p-2 shadow-md"
                          style={{ fontSize: '12px' }}
                        >
                          Attendance : {course?.attendancePercentage}%
                        </div>
                      </Tooltip>
                      <Tooltip title="Progress not available">
                        <div
                          className="bg-green-500 rounded-lg text-white text-sm ml-2  p-2 shadow-md"
                          style={{ fontSize: '12px' }}
                        >
                          Test Progress :{` `}
                          {course?.testStatus?.length > 0
                            ? course?.testStatus?.map((item) => (
                                <p key={item?.courseId}>
                                  Name: {item?.name} | Status: {item?.status}
                                </p>
                              ))
                            : 'Not available'}
                        </div>
                      </Tooltip>
                    </div>
                    <div className="text-red-500 font-bold mt-2 px-4 ">
                      Batch :
                      <span className="text-gray-500 font-semibold">
                        {course?.batch
                          ? ` ${course?.batch?.name} - ${`${moment(
                              course?.batch?.estimatedStartDate,
                            ).format('LT')} 
                          ${moment(course?.batch?.estimatedCompletionDate).format('LT')}`}`
                          : ` Not assigned`}
                      </span>
                    </div>
                    <div className="text-red-500 font-bold my-2 px-4 ">
                      Extra Class :
                      <span className="text-gray-500 font-semibold">
                        {course?.batch?.workEffortTypeId
                          ? ` ${`${moment(course?.batch?.estimatedStartDate).format('LT')} 
                            ${moment(course?.batch?.estimatedCompletionDate).format('LT')}`}`
                          : ` Not assigned`}
                      </span>
                    </div>
                  </div>
                  <div className="px-2 my-2 pt-4 border-r w-1/6">
                    <div className="font-bold text-gray-700">
                      Total Fees{' '}
                      <span className=" text-gray-500 font-semibold">
                        : {currencyFormatter?.format(course?.totalAmount) || '0'}
                      </span>
                      <span className="text-yellow-400 font-semibold ml-4"></span>
                    </div>
                    <div className="font-bold text-gray-700">
                      Paid{' '}
                      <span className=" text-gray-500 font-semibold">
                        : {currencyFormatter?.format(course?.amountPaid) || '0'}
                      </span>
                      <span className="text-yellow-400 font-semibold ml-4"></span>
                    </div>
                    <div className="font-bold text-gray-700">
                      Pending{' '}
                      <span className=" text-gray-500 font-semibold">
                        : {currencyFormatter?.format(course?.amountPending) || '0'}
                      </span>
                      <span className="text-yellow-400 font-semibold ml-4"></span>
                    </div>
                  </div>

                  <div className=" w-1/4 flex justify-center items-center">
                    <div className="flex  items-center mt-3">
                      <div
                        onClick={() => {
                          setOption('Course Details');
                          setShowDrawer(true);
                          setIdx(course?.id);
                          setCoursePaidFee(course);
                        }}
                        className="bg-green-200 cursor-pointer text-green-500 h-8 w-8 mx-1 rounded-lg shadow-md"
                      >
                        <Tooltip placement="top" title={'Course Details'}>
                          <EyeOutlined
                            // onClick={() => console.log(idx, '<===id')}
                            className="px-2 py-2 text-lg"
                          />
                        </Tooltip>
                      </div>
                      <div
                        className="bg-blue-200 text-blue-500 cursor-pointer h-8 w-8 mx-1 rounded-lg shadow-md"
                        onClick={() => {
                          setOption('Payment history');
                          setShowDrawer(true);
                          setIdx(course?.id);
                          setCoursePaidFee(course);
                        }}
                      >
                        <Tooltip placement="top" title={'Payment history'}>
                          <DollarCircleOutlined className="px-2 py-2  text-lg" />
                        </Tooltip>
                      </div>

                      <div
                        className="bg-red-200 text-red-500 cursor-pointer h-8 w-8 mx-1 rounded-lg shadow-md"
                        onClick={() => {
                          setOption('Activity logs');
                          setShowDrawer(true);
                          setIdx(course?.id);
                          setCoursePaidFee(course);
                        }}
                      >
                        <Tooltip placement="top" title={'Activity logs'}>
                          <ClockCircleOutlined className="px-2 py-2  text-lg" />
                        </Tooltip>
                      </div>
                      <div
                        className={`${
                          course?.courseStatus === 'Withdraw' ? 'invisible' : ' '
                        }   bg-yellow-200 text-yellow-500 cursor-pointer h-8 w-8 mx-1 rounded-lg shadow-md`}
                      >
                        <Tooltip placement="top" title={'Quick actions'}>
                          <Dropdown
                            disabled={course?.courseStatus === 'Withdraw'}
                            overlay={menu(course)}
                          >
                            <CheckCircleOutlined className="px-2 py-2  text-lg" />
                          </Dropdown>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                </div>
                <Divider style={{ margin: '0' }} />
                <div className="flex justify-between px-2 py-4  ">
                  <div className="text-gray-700 font-bold mx-2 text-md">
                    Modules/Subject :
                    <span className="font-semibold  pl-1 text-gray-500">
                      {course?.modules ? course?.modules?.map((p) => p?.name)?.join(',') : 'N/A'}
                    </span>
                  </div>
                  <Divider type="vertical" />
                  <div className="text-gray-700 font-bold  mx-2 text-md">
                    Start Date & Time :
                    <span className="font-semibold  text-gray-500 pl-1">
                      {moment(course?.startDate).format('DD MMM YYYY')} (
                      {moment(course?.startDate).format('LT')})
                    </span>
                  </div>
                  <div className="text-gray-700 font-bold  mx-2 text-md">
                    End Date & Time :
                    <span className="font-semibold  pl-1 text-gray-500">
                      {moment(course?.endDate).format('DD MMM YYYY')} (
                      {moment(course?.endDate).format('LT')})
                    </span>
                  </div>
                  <div className="text-gray-700 font-bold mx-2 text-md">
                    Days Left :
                    <span className="font-semibold  text-red-500 pl-1">
                      {course?.daysLeft} days
                    </span>
                  </div>
                  <Tooltip title={`Course type ${course?.courseType}`}>
                    <div className="bg-blue-700 text-white text-lg font-bold flex items-center justify-center rounded-full h-8 w-8">
                      {getInitials(course?.courseType)}
                    </div>
                  </Tooltip>
                </div>
              </div>
            </div>
          ))}
        </Spin>
      </div>
      <Drawer
        destroyOnClose
        title={setTitle(option)}
        placement="right"
        width={600}
        onClose={() => {
          setOption('');
          setShowDrawer(false);
        }}
        visible={showDrawer}
      >
        {UI()}
      </Drawer>
    </div>
  );
};

export default connect(({ student, loading }) => ({
  courseDetails: student?.courseDetails,
  getStudentWallet: student?.getStudentWallet,
  loadingCourses: loading?.effects['student/getCourseDetails'],
}))(Courses);
