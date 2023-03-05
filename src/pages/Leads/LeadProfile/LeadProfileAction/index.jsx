import { Row, Col } from 'antd';
import React from 'react';
import { Link, connect, useParams, history } from 'umi';
import { Kanban } from 'react-bootstrap-icons';
import {
  FileTextFilled,
  FundFilled,
  PhoneFilled,
  ReconciliationFilled,
  ScheduleFilled,
  TeamOutlined,
} from '@ant-design/icons';
import LeadEnquiry from './LeadEnquiry';
import ServiceAfterRegisration from './ServiceAfterRegisration';
import LeadFollowUps from './LeadFollowUps';
import LeadActivityLog from './LeadActivityLog';
import LeadCommunicationLog from './LeadCommunicationLog';
import LeadNotes from './LeadNotes';
import LeadAssessmentTests from './LeadAssessmentTests';
import LeadDemoClass from './LeadDemoClass';

const LeadProfileAction = () => {
  const { leadId, activeTab } = useParams();

  const leadActionList = [
    {
      name: 'enquiry',
      icon: <Kanban className=" mt-1.5 text-xl text-gray-800" />,
      title: `Enquiry`,
      path: `/leads/students/leads/${leadId}/profile/${'enquiry'}`,
    },
    {
      name: 'sevice-after-registration',
      icon: <Kanban className=" mt-1.5 text-xl text-gray-800" />,
      title: `Service after Registration`,
      path: `/leads/students/leads/${leadId}/profile/${'sevice-after-registration'}`,
    },
    {
      name: 'lead-follow-up',
      icon: <TeamOutlined className="mt-1.5 text-xl text-gray-800" />,
      title: `Follow ups`,
      path: `/leads/students/leads/${leadId}/profile/${'lead-follow-up'}`,
    },
    {
      name: 'activity-log',
      icon: <FundFilled className="mt-1.5 text-xl text-gray-800" />,
      title: `Activity logs`,
      path: `/leads/students/leads/${leadId}/profile/${'activity-log'}`,
    },
    {
      name: 'communicational-log',
      icon: <PhoneFilled className="mt-1.5 text-xl text-gray-800" />,
      title: `Communicational Logs`,
      path: `/leads/students/leads/${leadId}/profile/${'communicational-log'}`,
    },

    {
      name: 'notes',
      icon: <FileTextFilled className="mt-1.5 text-xl text-gray-800" />,
      title: `Notes`,
      path: `/leads/students/leads/${leadId}/profile/${'notes'}`,
    },
    {
      name: 'assessment-test',
      icon: <ScheduleFilled className="mt-1.5 text-xl text-gray-800" />,
      title: `Assessment tests `,
      path: `/leads/students/leads/${leadId}/profile/${'assessment-test'}`,
    },
    {
      name: 'demo-class',
      icon: <ReconciliationFilled className="mt-1.5 text-xl text-gray-800" />,
      title: `Demo class`,
      path: `/leads/students/leads/${leadId}/profile/${'demo-class'}`,
    },
    // TODO
    // {
    //   name: 'registered',
    //   icon: <SignalFilled className="mt-1.5 text-xl text-gray-800" />,
    //   title: `Registered`,
    // },

    // {
    //   name: 'wallet',
    //   icon: <WalletFilled className="mt-1.5 text-xl text-gray-800" />,
    //   title: `Wallet `,
    // },
  ];

  const getStep = () => {
    switch (activeTab) {
      case 'leadEnquiry':
        return <LeadEnquiry />;
      case 'sevice-after-registration':
        return <ServiceAfterRegisration />;
      case 'lead-follow-up':
        return <LeadFollowUps />;
      case 'activity-log':
        return <LeadActivityLog />;
      case 'communicational-log':
        return <LeadCommunicationLog />;
      case 'notes':
        return <LeadNotes />;
      case 'assessment-test':
        return <LeadAssessmentTests />;
      case 'demo-class':
        return <LeadDemoClass />;

      default:
        return <LeadEnquiry />;
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
                        activeTab === val?.name
                          ? `bg-gradient-to-r from-white from-gray-200 text-gray-900 shadow-md`
                          : 'text-gray-500'
                      }`}
                    onClick={() => {
                      history.push(val?.path);
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
}))(LeadProfileAction);
