import { StudentWithBag, TrophyIcon } from '@/utils/AppIcons';
import {
  DeploymentUnitOutlined,
  ExperimentFilled,
  FileTextFilled,
  FundFilled,
  PhoneFilled,
  ReconciliationFilled,
  ScheduleFilled,
  SignalFilled,
  TeamOutlined,
  UsergroupAddOutlined,
  WalletFilled,
} from '@ant-design/icons';
import { Row, Col } from 'antd';
import React from 'react';
import { Link, useParams, history } from 'umi';
import ActivityTimeline from './ActivityTimeline';
import MyStudents from './MyStudents';
import NotesAndRemarks from './NotesAndRemarks';
import StaffRoleAndResponsibilities from './StaffRoleAndResponsibilities';
import StudentAttendance from './StudentAttendance';
import TeachingSchedule from './TeachingSchedule';
import TestRecords from './TestRecords';
import WalletAndSalary from './WalletAndSalary';
import StaffCommunicationLog from './StaffCommunicationLog';
import StaffAttendenceAndLeave from './StaffAttendenceAndLeave';
import StaffFollowUps from './StaffFollowUps';
import StaffLeave from './StaffLeave';
import StaffTask from './StaffTask';

const TeacherActions = () => {
  const { staffId, activeTab } = useParams();

  const TeacherActionList = [
    {
      name: 'my-students',
      icon: <StudentWithBag fill="#111827" />,
      title: `My Students `,
      historyPush: `/staff/${staffId}/profile/${'my-students'}`,
    },
    {
      name: 'teaching-schedule',
      icon: <ScheduleFilled className="mr-1.5 text-xl text-gray-800" />,
      title: `Teaching Schedule`,
      historyPush: `/staff/${staffId}/profile/${'teaching-schedule'}`,
    },
    {
      name: 'test-records',
      icon: <ReconciliationFilled className="mr-1.5 text-xl text-gray-800" />,
      title: `Test Records`,
      historyPush: `/staff/${staffId}/profile/${'test-records'}`,
    },
    {
      name: 'student-attendance',
      icon: <UsergroupAddOutlined className="mr-1.5 text-xl text-gray-800" />,
      title: `Student Attendance`,
      historyPush: `/staff/${staffId}/profile/${'student-attendance'}`,
    },

    {
      name: 'notes-remarks',
      icon: <FileTextFilled className="mr-1.5 text-xl text-gray-800" />,
      title: `Notes & Remarks`,
      historyPush: `/staff/${staffId}/profile/${'notes-remarks'}`,
    },
    {
      name: 'follow-ups',
      icon: <TeamOutlined className="mr-1.5 text-xl text-gray-800" />,
      title: `Follow Ups`,
      historyPush: `/staff/${staffId}/profile/${'follow-ups'}`,
    },
    {
      name: 'activity-timeline',
      icon: <FundFilled className="mr-1.5 text-xl text-gray-800" />,
      title: `Activity Timeline`,
      historyPush: `/staff/${staffId}/profile/${'activity-timeline'}`,
    },
    {
      name: 'attendance-leave-records',
      icon: <SignalFilled className="mr-1.5 text-xl text-gray-800" />,
      title: `Attendance & Leave Records `,
      historyPush: `/staff/${staffId}/profile/${'attendance-leave-records'}`,
    },
    {
      name: 'communicational-log',
      icon: <PhoneFilled className="mr-1.5 text-xl text-gray-800" />,
      title: `Communicational Logs (${'0'})`,
      historyPush: `/staff/${staffId}/profile/${'communicational-log'}`,
    },
    {
      name: 'role-responsibilities',
      icon: <DeploymentUnitOutlined className="mr-1.5 text-xl text-gray-800" />,
      title: `Role & Responsibilities `,
      historyPush: `/staff/${staffId}/profile/${'role-responsibilities'}`,
    },
    {
      name: 'salary-wallet',
      icon: <WalletFilled className="mr-1.5 text-xl text-gray-800" />,
      title: `Salary & Wallet `,
      historyPush: `/staff/${staffId}/profile/${'salary-wallet'}`,
    },
    {
      name: 'work-tasks',
      icon: <ExperimentFilled className="mr-1.5 text-xl text-gray-800" />,
      title: 'Work & Tasks',
      historyPush: `/staff/${staffId}/profile/${'work-tasks'}`,
    },
    {
      name: 'performances-acheivements',
      icon: <TrophyIcon fill="#111827" />,
      title: 'Performances & Acheivements',
      historyPush: `/staff/${staffId}/profile/${'performances-acheivements'}`,
    },
    {
      name: 'staff-leave',
      icon: <TrophyIcon fill="#111827" />,
      title: 'Staff leave',
      historyPush: `/staff/${staffId}/profile/${'staff-leave'}`,
    },
  ];

  const getStep = () => {
    switch (activeTab) {
      case 'my-students':
        return <MyStudents />;
      case 'student-attendance':
        return <StudentAttendance />;
      case 'activity-timeline':
        return <ActivityTimeline />;
      case 'notes-remarks':
        return <NotesAndRemarks />;
      case 'teaching-schedule':
        return <TeachingSchedule />;
      case 'test-records':
        return <TestRecords />;
      case 'role-responsibilities':
        return <StaffRoleAndResponsibilities />;
      case 'salary-wallet':
        return <WalletAndSalary />;
      case 'communicational-log':
        return <StaffCommunicationLog />;
      case 'attendance-leave-records':
        return <StaffAttendenceAndLeave />;
      case 'follow-ups':
        return <StaffFollowUps />;
      case 'staff-leave':
        return <StaffLeave />;
      case 'work-tasks':
        return <StaffTask />;

      default:
        return <MyStudents />;
    }
  };

  return (
    <div className="">
      <Row gutter={16}>
        <Col xs={24} sm={24} md={5} lg={5} xl={5}>
          <div className="border ">
            {TeacherActionList?.map((val) => (
              <>
                <Link to={val?.path}>
                  <div
                    className={`flex border-b items-center  px-2 py-2.5 bg-gradient-to-r hover:from-white hover:from-gray-200  text-base font-semibold cursor-pointer
                      ${
                        activeTab === val.name
                          ? `bg-gradient-to-r from-white from-gray-200 text-gray-900 shadow-md`
                          : 'text-gray-500'
                      }`}
                    onClick={() => {
                      history.push(val?.historyPush);
                    }}
                  >
                    <div className="mr-3 pb-2 text-gray-800">{val?.icon}</div>
                    <div className="text-gray-800">{val?.title}</div>
                  </div>
                </Link>
              </>
            ))}
          </div>
        </Col>
        <Col xs={24} sm={24} md={19} lg={19} xl={19}>
          {getStep()}
        </Col>
      </Row>
    </div>
  );
};

export default TeacherActions;
