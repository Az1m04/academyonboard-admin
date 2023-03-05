import React, { useEffect, useState } from 'react';
import { Badge, Tabs } from 'antd';
import { connect, history } from 'umi';
import LeadsTable from '../../../../components/LeadsTable';

const { TabPane } = Tabs;
const FollowUps = ({ match, dispatch, studentFollowUpLeadStats }) => {
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
  };

  const tabs = [
    {
      key: 'all',
      title: (
        <Badge
          count={
            studentFollowUpLeadStats?.status === 'ok' &&
            studentFollowUpLeadStats?.stats?.allFollowUps
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
      key: 'today-done-follow-ups',
      title: (
        <Badge
          count={
            studentFollowUpLeadStats?.status === 'ok' &&
            studentFollowUpLeadStats?.stats?.todayFollowUpDone
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
          <p className="pt-2.5 pr-3"> {`Today's done follow-ups`}</p>
        </Badge>
      ),
    },
    {
      key: 'today-follow-ups',
      title: (
        <Badge
          count={
            studentFollowUpLeadStats?.status === 'ok' &&
            studentFollowUpLeadStats?.stats?.todayFollowUp
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
          <p className="pt-2.5 pr-3"> {`Today's follow-ups`}</p>
        </Badge>
      ),
    },
    {
      key: 'missed-follow-ups',
      title: (
        <Badge
          count={
            studentFollowUpLeadStats?.status === 'ok' &&
            studentFollowUpLeadStats?.stats?.missedFollowUps
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
          <p className="pt-2.5 pr-3">Missed follow-ups</p>
        </Badge>
      ),
    },
    {
      key: 'planned-follow-ups',
      title: (
        <Badge
          count={
            studentFollowUpLeadStats?.status === 'ok' &&
            studentFollowUpLeadStats?.stats?.pendingFollowUp
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
          <p className="pt-2.5 pr-3">Planned follow-ups</p>
        </Badge>
      ),
    },
  ];
  const { tabname } = match.params;

  const getTabKey = () => {
    switch (tabname) {
      case 'all':
        return 'ALL';
      case 'today-follow-ups':
        return 'TODAY_FOLLOWUP';
      case 'today-done-follow-ups':
        return 'TODAY_FOLLOWUP_DONE';
      case 'missed-follow-ups':
        return 'MISSED';
      case 'planned-follow-ups':
        return 'PENDING';

      default:
        return 'All';
    }
  };

  const followUpVariable = 'follow-ups';

  const getStudentLeadData = () => {
    dispatch({
      type: 'leads/getStudentFollowUpLeadData',
      payload: {
        query: {
          leadTypeId: 'LEAD_STUDENT',
          [followUpVariable]: getTabKey(),
          keyword,
          viewSize,
          startIndex,
        },
      },
    });
    dispatch({
      type: 'leads/studentFollowUpLeadStats',
      payload: {
        query: {
          statsBy: 'FOLLOW_UP',
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
                  getStudentLeadData={getStudentLeadData}
                  keyword={keyword}
                  followUps={true}
                  setKeyword={setKeyword}
                  viewSize={viewSize}
                  setCurrentPage={setCurrentPage}
                  currentPage={currentPage}
                  resetKeyword={resetKeyword}
                  setResetKeyword={setResetKeyword}
                  setViewSize={setViewSize}
                  startIndex={startIndex}
                  setStartIndex={setStartIndex}
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
  followUpLeadData: leads?.followUpLeadData,
  leadLoading:
    loading?.effects['leads/getStudentLeadData'] || loading?.effects['leads/getClientLeadData'],
  studentFollowUpLeadStats: leads?.studentFollowUpLeadStats,
});

export default connect(mapStateToProps)(FollowUps);
