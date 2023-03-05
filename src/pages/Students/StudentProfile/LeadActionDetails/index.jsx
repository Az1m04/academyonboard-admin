import Courses from './Courses';
import { Row, Col } from 'antd';
import React, { useState } from 'react';
import { Link, connect } from 'umi';
import ActivityLog from './ActivityLog';
import Notes from './Notes';
import TeachingSchedule from './TeachingSchedule';
import CommunicationalLogs from './CommunicationalLogs';
import TestRecordsServices from './TestRecordsServices';
import EmergencyContacts from './EmergencyContacts';
import StudentProfileFollowUps from './StudentProfileFollowUps';
import Wallet from './Wallet';
import TeacherRemarks from './TeacherRemarks';
import AttendanceAndLeave from './AttendanceAndLeave';
import DownloadCertificate from './DownloadCertif';
import { Kanban } from 'react-bootstrap-icons';
import {
  CommentOutlined,
  DownloadOutlined,
  ExclamationOutlined,
  FileTextFilled,
  FundFilled,
  PhoneFilled,
  ReconciliationFilled,
  ScheduleFilled,
  SignalFilled,
  TeamOutlined,
  WalletFilled,
} from '@ant-design/icons';

const LeadActionDetails = ({ StudentStats, tabname, studentId }) => {
  const [tab, setTab] = useState(tabname);
  const [activeTab, setActiveTab] = useState(tabname);

  const leadActionList = [
    {
      name: 'courses',
      icon: <Kanban className=" mt-1.5 text-xl text-gray-800" />,
      title: `Courses ( ${
        StudentStats?.stats?.courseCount ? StudentStats?.stats?.courseCount : '0'
      } )`,
      path: `/students/${studentId}/courses`,
    },
    {
      name: 'follow-up',
      icon: <TeamOutlined className="mr-1.5 text-xl text-gray-800" />,
      title: `Follow ups ( ${
        StudentStats?.stats?.followUpCount ? StudentStats?.stats?.followUpCount : '0'
      } )`,
      path: `/students/${studentId}/follow-up/all`,
    },
    {
      name: 'activity-log',
      icon: <FundFilled className="mr-1.5 text-xl text-gray-800" />,
      title: `Activity logs ( ${
        StudentStats?.stats?.activityCount ? StudentStats?.stats?.activityCount : '0'
      } )`,
      path: `/students/${studentId}/activity-log`,
    },
    {
      name: 'communicational-log',
      icon: <PhoneFilled className="mr-1.5 text-xl text-gray-800" />,
      title: `Communicational Logs (${
        StudentStats?.stats?.communicationCount ? StudentStats?.stats?.communicationCount : '0'
      })`,
      path: `/students/${studentId}/communicational-log`,
    },

    {
      name: 'notes',
      icon: <FileTextFilled className="mr-1.5 text-xl text-gray-800" />,
      title: `Notes (${StudentStats?.stats?.notesCount ? StudentStats?.stats?.notesCount : '0'})`,
      path: `/students/${studentId}/notes`,
    },
    {
      name: 'teaching-schedule',
      icon: <ScheduleFilled className="mr-1.5 text-xl text-gray-800" />,
      title: `Teaching Schedule `,
      path: `/students/${studentId}/teaching-schedule`,
    },
    {
      name: 'test-records-progress',
      icon: <ReconciliationFilled className="mr-1.5 text-xl text-gray-800" />,
      title: `Test Records & Progress `,
      path: `/students/${studentId}/test-records-progress`,
    },
    {
      name: 'attendance-leave',
      icon: <SignalFilled className="mr-1.5 text-xl text-gray-800" />,
      title: `Attendance & Leave `,
      path: `/students/${studentId}/attendance-leave`,
    },
    {
      name: 'teacher-remarks',
      icon: <CommentOutlined className="mr-1.5 text-xl text-gray-800" />,
      title: `Teacher Remarks (${
        StudentStats?.stats?.teacherRemarkCount ? StudentStats?.stats?.teacherRemarkCount : '0'
      })`,
      path: `/students/${studentId}/teacher-remarks/all`,
    },
    {
      name: 'wallet',
      icon: <WalletFilled className="mr-1.5 text-xl text-gray-800" />,
      title: `Wallet (${
        StudentStats?.stats?.walletCount ? StudentStats?.stats?.walletCount : '0'
      })`,
      path: `/students/${studentId}/wallet`,
    },
    {
      name: 'emergency-contact',
      icon: <ExclamationOutlined className="mr-1.5 text-xl text-gray-800" />,
      title: 'Emergency Contacts',
      path: `/students/${studentId}/emergency-contact`,
    },
    {
      name: 'downloads',
      icon: <DownloadOutlined className="mr-1.5 text-xl text-gray-800" />,
      title: 'Downloads',
      path: `/students/${studentId}/downloads`,
    },
  ];

  const getStep = () => {
    switch (tab) {
      case 'courses':
        return <Courses />;
      case 'follow-up':
        return <StudentProfileFollowUps />;
      case 'activity-log':
        return <ActivityLog />;
      case 'notes':
        return <Notes />;
      case 'teaching-schedule':
        return <TeachingSchedule />;
      case 'communicational-log':
        return <CommunicationalLogs />;
      case 'test-records-progress':
        return <TestRecordsServices />;
      case 'emergency-contact':
        return <EmergencyContacts />;
      case 'wallet':
        return <Wallet />;
      case 'teacher-remarks':
        return <TeacherRemarks />;
      case 'attendance-leave':
        return <AttendanceAndLeave />;
      case 'downloads':
        return <DownloadCertificate />;
      default:
        return <Courses />;
    }
  };

  return (
    <div className="mt-6">
      <Row gutter={16}>
        <Col xs={24} sm={24} md={5} lg={5} xl={5}>
          <div className="border ">
            {leadActionList?.map((val) => (
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
                      // setTab(val.path.split('/')[val.path.split('/').length - 1]);
                      setTab(val?.name);
                      setActiveTab(val?.name);
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

export default connect(({ student, leads, students }) => ({
  activityRecord: leads?.activityRecord,
  communicationalLogs: student?.communicationalLogs,
  StudentStats: students?.StudentStats,
}))(LeadActionDetails);
