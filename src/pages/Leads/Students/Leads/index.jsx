import React, { useEffect, useState } from 'react';
import { Badge, Tabs } from 'antd';
import { connect, history } from 'umi';
import LeadsTable from '../../../../components/LeadsTable';

const { TabPane } = Tabs;
const Leads = ({ match, dispatch, leadData }) => {
  const [startIndex, setStartIndex] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [viewSize, setViewSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [resetKeyword, setResetKeyword] = useState('');

  const onTabChange = (key) => {
    if (key === 'officeVisits') {
      history.push('office-visits');
    } else {
      history.push(key);
    }
    setKeyword('');
    setStartIndex(0);
    setCurrentPage(1);
    setResetKeyword('');
  };

  const tabs = [
    {
      key: 'all',
      title: (
        <Badge
          count={leadData?.status === 'ok' && leadData?.stats?.totalCount}
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
      style: 'ml-6 pr-2',
    },
    {
      key: 'online',
      title: (
        <Badge
          count={leadData?.status === 'ok' && leadData?.stats?.onlineCount}
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
          <p className="pt-2.5 pr-3">Online</p>
        </Badge>
      ),
      style: 'px-2',
    },
    {
      key: 'office-visits',
      title: (
        <Badge
          count={leadData?.status === 'ok' && leadData?.stats?.officeVisitCount}
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
          <p className="pt-2.5 pr-3">Office visits</p>
        </Badge>
      ),
      style: 'px-2',
    },
    {
      key: 'branch-reference',
      title: (
        <Badge
          count={leadData?.status === 'ok' && leadData?.stats?.branchRefCount}
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
          <p className="pt-2.5 pr-2">Branch reference</p>
        </Badge>
      ),
      style: 'px-2',
    },
    {
      key: 'social-media',
      title: (
        <Badge
          count={leadData?.status === 'ok' && leadData?.stats?.socialMediaCount}
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
          <p className="pt-2.5 pr-3">Social media</p>
        </Badge>
      ),
      style: 'px-2',
    },
    {
      key: 'referred',
      title: (
        <Badge
          count={leadData?.status === 'ok' && leadData?.stats?.referredCount}
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
          <p className="pt-2.5 pr-3">Referred</p>
        </Badge>
      ),
      style: 'px-2',
    },
    {
      key: 'printed-media',
      title: (
        <Badge
          count={leadData?.status === 'ok' && leadData?.stats?.printedMediaCount}
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
          <p className="pt-2.5 pr-3">Printed media</p>
        </Badge>
      ),
      style: 'px-2',
    },
    {
      key: 're-inquired',
      title: (
        <Badge
          count={leadData?.status === 'ok' && leadData?.stats?.reInquiredCount}
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
          <p className="pt-2.5 pr-3">Re-inquired</p>
        </Badge>
      ),
      style: 'px-2',
    },
    {
      key: 'closed',
      title: (
        <Badge
          count={leadData?.status === 'ok' && leadData?.stats?.leadClosedCount}
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
          <p className="pt-2.5 pr-3">Closed</p>
        </Badge>
      ),
      style: 'px-2',
    },
    {
      key: 'registered',
      title: (
        <Badge
          count={leadData?.status === 'ok' && leadData?.stats?.partyRegisteredCount}
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
          <p className="pt-2.5 pr-3">Registered</p>
        </Badge>
      ),
      style: 'px-2',
    },
    {
      key: 'courses',
      title: (
        <Badge
          count={leadData?.status === 'ok' && leadData?.stats?.coursesCount}
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
          <p className="pt-2.5 pr-3">Courses</p>
        </Badge>
      ),
      style: 'px-2',
    },
    {
      key: 'visas',
      title: (
        <Badge
          count={leadData?.status === 'ok' && leadData?.stats?.visaCount}
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
          <p className="pt-2.5 pr-3">Visas</p>
        </Badge>
      ),
      style: 'px-2',
    },
    {
      key: 'others',
      title: (
        <Badge
          count={leadData?.status === 'ok' && leadData?.stats?.othersCount}
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
          <p className="pt-2.5 pr-3">Others</p>
        </Badge>
      ),
      style: 'mr-2 px-2',
    },
  ];
  const { tabname } = match.params;

  const searchLeadBy = () => {
    switch (tabname) {
      case 'all':
        return '';
      case 'online':
        return 'ONLINE';
      case 'office-visits':
        return 'OFFICE_VISIT';
      case 'branch-reference':
        return 'BRANCH_REF';
      case 'social-media':
        return 'SOCIAL_MEDIA';
      case 'referred':
        return 'REFERRED';
      case 'printed-media':
        return 'PRINTED_MEDIA';
      case 're-inquired':
        return 'PARTY_RE_INQUIRED';
      case 'closed':
        return 'LEAD_CLOSED';
      case 'registered':
        return 'PARTY_REGISTERED';
      case 'visas':
        return 'VISA';
      case 'courses':
        return 'COURSES';
      case 'others':
        return 'OTHERS';

      default:
        return '';
    }
  };
  const getTab = () => {
    switch (tabname) {
      case 'visas':
        return 'VISA';
      case 'courses':
        return 'COURSES';
      case 'others':
        return 'OTHERS';
      default:
        return '';
    }
  };

  const getStudentLeadData = (val) => {
    dispatch({
      type: 'leads/getStudentLeadData',
      payload: {
        query: {
          leadTypeId: 'LEAD_STUDENT',
          searchBy: searchLeadBy(),
          forLooking: getTab(),
          keyword: val || keyword,
          viewSize,
          startIndex,
        },
      },
    });
  };

  useEffect(() => {
    getStudentLeadData();
  }, [viewSize, startIndex, dispatch, tabname, keyword]);

  return (
    <div>
      <div className="flex w-full bg-white rounded shadow leadStudentTable">
        <div className="w-full">
          <Tabs
            defaultActiveKey="all"
            className="w-full"
            onChange={onTabChange}
            activeKey={tabname}
          >
            {tabs.map(({ key, title, style }) => (
              <TabPane key={key} tab={<span className={`${style && style} w-max`}>{title}</span>}>
                <LeadsTable
                  keyword={keyword}
                  leads={true}
                  setKeyword={setKeyword}
                  viewSize={viewSize}
                  setViewSize={setViewSize}
                  startIndex={startIndex}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  resetKeyword={resetKeyword}
                  setResetKeyword={setResetKeyword}
                  setStartIndex={setStartIndex}
                  getStudentLeadData={getStudentLeadData}
                  purpose="lead"
                  leadType="student"
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
});
export default connect(mapStateToProps)(Leads);
