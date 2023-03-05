import React from 'react';
import { Tabs } from 'antd';
import { connect, history } from 'umi';

const { TabPane } = Tabs;
const LeadsData = (props) => {
  const { match, children } = props;

  const onTabChange = (key) => {
    history.push(key);
  };

  const tabs = [
    { key: 'all', title: 'All' },
    { key: 'online', title: 'Online' },
    { key: 'office-visits', title: 'Office visits' },
    { key: 'main-branch', title: 'Main Branch' },
    { key: 'social-media', title: 'Social Media' },
    { key: 'refereed', title: 'Refereed' },
    { key: 'printed-media', title: 'Printed Media' },
    { key: 're-inquired', title: 'Re-Inquired' },
    { key: 'closed', title: 'Closed' },
    { key: 'registered', title: 'Registered' },
    { key: 'assessment-test', title: 'Assessment Test' },
    { key: 'demo', title: 'Demo(s)' },
    { key: 'follow-ups', title: 'Follow-ups' },
    { key: 'courses', title: 'Courses' },
    { key: 'visas', title: 'Visas' },
    { key: 'others', title: 'Others' },
  ];

  const { tabname } = match.params;

  return (
    <div>
      <div className="flex w-full bg-white rounded shadow">
        <div className="w-full">
          <Tabs
            defaultActiveKey="newleads"
            className="w-full"
            onChange={onTabChange}
            activeKey={tabname}
          >
            {tabs.map(({ key, title }) => (
              <TabPane key={key} tab={<span className="px-4">{title}</span>}>
                {key === tabname && children}
              </TabPane>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ leads, loading }) => ({
  leadData: leads?.leadData,
  leadLoading:
    loading?.effects['leads/getStudentLeadData'] || loading?.effects['leads/getClientLeadData'],
});

export default connect(mapStateToProps)(LeadsData);
