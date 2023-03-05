import React, { useEffect, useState } from 'react';
import { Badge, Tabs } from 'antd';
import { connect, history } from 'umi';
import LeadsTable from '../../../../components/LeadsTable';

const { TabPane } = Tabs;
const ScheduleTasks = ({ match, dispatch, studentScheduleLeadStats }) => {
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
      key: 'call-back',
      title: (
        <Badge
          count={
            // studentScheduleLeadStats?.status === 'ok' &&
            studentScheduleLeadStats?.stats?.callBack
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
          <p className="pt-2.5 pr-3">Call back</p>
        </Badge>
      ),
    },
    {
      key: 'walking',
      title: (
        <Badge
          count={
            // studentScheduleLeadStats?.status === 'ok' &&
            studentScheduleLeadStats?.stats?.walkIn
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
          <p className="pt-2.5 pr-3">Walk in</p>
        </Badge>
      ),
    },
    {
      key: 'appointment',
      title: (
        <Badge
          count={
            // studentScheduleLeadStats?.status === 'ok' &&
            studentScheduleLeadStats?.stats?.appointment
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
          <p className="pt-2.5 pr-3">Appointment</p>
        </Badge>
      ),
    },
    {
      key: 'mail',
      title: (
        <Badge
          count={
            // studentScheduleLeadStats?.status === 'ok' &&
            studentScheduleLeadStats?.stats?.mail
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
          <p className="pt-2.5 pr-3">Mail</p>
        </Badge>
      ),
    },
    {
      key: 'whatsapp',
      title: (
        <Badge
          count={
            // studentScheduleLeadStats?.status === 'ok' &&
            studentScheduleLeadStats?.stats?.whatsapp
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
          <p className="pt-2.5 pr-3">WhatsApp</p>
        </Badge>
      ),
    },
    {
      key: 'text-msg',
      title: (
        <Badge
          count={
            // studentScheduleLeadStats?.status === 'ok' &&
            studentScheduleLeadStats?.stats?.textMsg
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
          <p className="pt-2.5 pr-3">Text message</p>
        </Badge>
      ),
    },
  ];
  const { tabname } = match.params;

  const getTabKey = () => {
    switch (tabname) {
      case 'call-back':
        return 'WEPT_TASK_PHONE_CALL';
      case 'walking':
        return 'WEPT_TASK_VISIT';
      case 'appointment':
        return 'WEPT_TASK_MEETING';
      case 'mail':
        return 'WEPT_TASK_EMAIL';
      case 'text-msg':
        return 'WEPT_TASK_TEXT_MSG';
      case 'whatsapp':
        return 'WEPT_TASK_WATSAP_MSG';
      default:
        return 'WEPT_TASK_PHONE_CALL';
    }
  };

  const getStudentLeadData = () => {
    dispatch({
      type: 'leads/getStudentFollowUpLeadData',
      payload: {
        query: {
          leadTypeId: 'LEAD_STUDENT',
          scheduleTaskStatus: getTabKey(),
          keyword,
          viewSize,
          startIndex,
        },
      },
    });
    dispatch({
      type: 'leads/studentScheduleLeadStats',
      payload: {
        query: {
          statsBy: 'SCHEDULED',
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
                  setViewSize={setViewSize}
                  startIndex={startIndex}
                  setCurrentPage={setCurrentPage}
                  resetKeyword={resetKeyword}
                  setResetKeyword={setResetKeyword}
                  currentPage={currentPage}
                  setStartIndex={setStartIndex}
                  getStudentLeadData={getStudentLeadData}
                  isScheduleTable={true}
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
  studentScheduleLeadStats: leads?.studentScheduleLeadStats,
});
export default connect(mapStateToProps)(ScheduleTasks);
