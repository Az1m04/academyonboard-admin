import React, { useEffect, useState } from 'react';
import { Badge, Tabs } from 'antd';
import { connect, history } from 'umi';
import LeadsTable from '../../../../components/LeadsTable';

const { TabPane } = Tabs;
const Closed = ({ match, dispatch, studentLeadStats }) => {
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
      key: 'feedback-not-given',
      title: (
        <Badge
          count={
            studentLeadStats?.status === 'ok' &&
            studentLeadStats?.leadStudentStats?.totalNoFeedbackCount
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
          <p className="pt-2.5 pr-3"> Feedback not given</p>
        </Badge>
      ),
    },
    {
      key: 'positive-feedback',
      title: (
        <Badge
          count={
            studentLeadStats?.status === 'ok' &&
            studentLeadStats?.leadStudentStats?.totalPositiveCount
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
          <p className="pt-2.5 pr-3">Positive feedback</p>
        </Badge>
      ),
    },
    {
      key: 'negative-feedback',
      title: (
        <Badge
          count={
            studentLeadStats?.status === 'ok' &&
            studentLeadStats?.leadStudentStats?.totalNegativeCount
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
          <p className="pt-2.5 pr-3">Negative feedback</p>
        </Badge>
      ),
    },
  ];
  const { tabname } = match.params;

  const getTabKey = () => {
    switch (tabname) {
      case 'feedback-not-given':
        return 'NO_FEEDBACK';
      case 'positive-feedback':
        return 'POSITIVE';
      case 'negative-feedback':
        return 'NEGATIVE';
      default:
        return '';
    }
  };

  const getStudentLeadData = () => {
    dispatch({
      type: 'leads/getStudentLeadData',
      payload: {
        query: {
          leadTypeId: 'LEAD_STUDENT',
          feedBackType: getTabKey(),
          searchBy: tabname === 'all' ? 'LEAD_CLOSED' : '',
          // closed: tabname === 'all' ? true : '',
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
          statsBy: 'CLOSED',
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
                  currentPage={currentPage}
                  resetKeyword={resetKeyword}
                  setResetKeyword={setResetKeyword}
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

export default connect(mapStateToProps)(Closed);
