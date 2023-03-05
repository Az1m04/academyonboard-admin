import React, { useEffect, useState } from 'react';
import { Badge, Tabs } from 'antd';
import { connect, history } from 'umi';
import LeadsTable from '../../../../components/LeadsTable';

const { TabPane } = Tabs;
const Demo = ({ match, dispatch, studentLeadStats }) => {
  const [startIndex, setStartIndex] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [viewSize, setViewSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [resetKeyword, setResetKeyword] = useState('');
  const onTabChange = (key) => {
    history.push(key);
    setCurrentPage(1);
    setKeyword('');
    setStartIndex(0);
    setResetKeyword('');
  };

  const tabs = [
    {
      key: 'all',
      title: (
        <Badge
          count={
            studentLeadStats?.status === 'ok' &&
            studentLeadStats?.leadStudentStats?.totalFeedbackCount
          }
          size="small"
          style={{
            fontSize: '10px',
            marginTop: '3px',
            backgroundColor: '#f59e0b',
            padding: '0px 4px 0px 4px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            width: '28px',
          }}
        >
          <p className="pt-2.5 pr-3">All</p>
        </Badge>
      ),
    },
    {
      key: 'scheduled',
      title: (
        <Badge
          count={
            studentLeadStats?.status === 'ok' &&
            studentLeadStats?.leadStudentStats?.totalFeedbackCount
          }
          size="small"
          style={{
            fontSize: '10px',
            marginTop: '3px',
            backgroundColor: '#f59e0b',
            padding: '0px 4px 0px 4px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            width: '28px',
          }}
        >
          <p className="pt-2.5 pr-3">Scheduled</p>
        </Badge>
      ),
    },
    {
      key: 'running',
      title: (
        <Badge
          count={
            studentLeadStats?.status === 'ok' &&
            studentLeadStats?.leadStudentStats?.totalFeedbackCount
          }
          size="small"
          style={{
            fontSize: '10px',
            marginTop: '3px',
            backgroundColor: '#f59e0b',
            padding: '0px 4px 0px 4px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            width: '28px',
          }}
        >
          <p className="pt-2.5 pr-3">Running</p>
        </Badge>
      ),
    },
    {
      key: 'completed',
      title: (
        <Badge
          count={
            studentLeadStats?.status === 'ok' &&
            studentLeadStats?.leadStudentStats?.totalFeedbackCount
          }
          size="small"
          style={{
            fontSize: '10px',
            marginTop: '3px',
            backgroundColor: '#f59e0b',
            padding: '0px 4px 0px 4px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            width: '28px',
          }}
        >
          <p className="pt-2.5 pr-3">Completed</p>
        </Badge>
      ),
    },
    {
      key: 'not-attended',
      title: (
        <Badge
          count={
            studentLeadStats?.status === 'ok' &&
            studentLeadStats?.leadStudentStats?.totalFeedbackCount
          }
          size="small"
          style={{
            fontSize: '10px',
            marginTop: '3px',
            backgroundColor: '#f59e0b',
            padding: '0px 4px 0px 4px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            width: '28px',
          }}
        >
          <p className="pt-2.5 pr-3">Not attended</p>
        </Badge>
      ),
    },
    {
      key: 'not-completed',
      title: (
        <Badge
          count={
            studentLeadStats?.status === 'ok' &&
            studentLeadStats?.leadStudentStats?.totalFeedbackCount
          }
          size="small"
          style={{
            fontSize: '10px',
            marginTop: '3px',
            backgroundColor: '#f59e0b',
            padding: '0px 4px 0px 4px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            width: '28px',
          }}
        >
          <p className="pt-2.5 pr-3"> Not completed</p>
        </Badge>
      ),
    },
  ];
  const { tabname } = match.params;

  const getTabKey = () => {
    switch (tabname) {
      case 'all':
        return 'ALL';
      case 'running':
        return 'PRTYASGN_RUNNING';
      case 'completed':
        return 'PRTYASGN_COMPLETED';
      case 'not-attended':
        return 'PRTYASGN_NOTATTENDED';
      case 'scheduled':
        return 'PRTYASGN_PENDING';
      case "not-completed'":
        return 'PRTYASGN_NOTCOMPLETED';
      default:
        return 'All';
    }
  };

  const getStudentLeadData = () => {
    dispatch({
      type: 'leads/getStudentLeadData',
      payload: {
        query: {
          leadTypeId: 'LEAD_STUDENT',
          demoClassStatus: getTabKey(),
          keyword,
          viewSize,
          startIndex,
        },
      },
    });
    dispatch({
      type: 'leads/studentLeadStats',
      payload: {
        query: {
          statsBy: 'DEMO',
          viewSize: '10000',
        },
      },
    });
  };

  useEffect(() => {
    getStudentLeadData();
  }, [viewSize, startIndex, keyword, dispatch, tabname]);

  return (
    <div>
      <div className="flex w-full bg-white rounded shadow">
        <div className="w-full">
          <Tabs
            defaultActiveKey="all"
            className="w-full"
            onChange={onTabChange}
            activeKey={tabname}
          >
            {tabs.map(({ key, title }) => (
              <TabPane key={key} tab={<span className="px-4">{title}</span>}>
                <LeadsTable
                  keyword={keyword}
                  setKeyword={setKeyword}
                  viewSize={viewSize}
                  setCurrentPage={setCurrentPage}
                  resetKeyword={resetKeyword}
                  setResetKeyword={setResetKeyword}
                  currentPage={currentPage}
                  setViewSize={setViewSize}
                  startIndex={startIndex}
                  setStartIndex={setStartIndex}
                  getStudentLeadData={getStudentLeadData}
                />
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
  studentLeadStats: leads?.studentLeadStats,
});

export default connect(mapStateToProps)(Demo);
