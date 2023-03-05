import React, { useState, useEffect } from 'react';
import { Tabs, Button } from 'antd';
import { connect, Link } from 'umi';
import Page from '@/components/Page';
import Breadcrumbs from '@/components/BreadCrumbs';
import { PlusSquareOutlined } from '@ant-design/icons';
import ClientListTable from './ClientListTable';
import { Envelope, WhatsApp, ChatLeftIcon } from '@/utils/AppIcons';

const { TabPane } = Tabs;
const ClientsList = (props) => {
  const { clientList, dispatch, loading, match, location, history } = props;

  const [acceptedKeyword, setAcceptedKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [startIndex, setStartIndex] = useState(0);
  const [viewSize, setViewSize] = useState(10);

  const getClientsList = () => {
    const url = match.path === '/' ? '' : match.path;
    const tabKey = location.pathname.replace(`${url}/`, '');
    if (tabKey && tabKey !== '/') {
      if (tabKey === '/clients/all') {
        dispatch({
          type: 'leads/getClientList',
          payload: {
            query: {
              viewSize,
              startIndex,
              keyword: acceptedKeyword,
              status: 'ALL',
            },
          },
        });
      } else {
        dispatch({
          type: 'leads/getClientList',
          payload: {
            query: {
              viewSize,
              startIndex,
              keyword: acceptedKeyword,
              isAccepted: tabKey === '/clients/active',
            },
          },
        });
      }
    }
  };

  useEffect(() => {
    getClientsList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewSize, startIndex, acceptedKeyword, dispatch]);

  const getTabKey = () => {
    const url = match.path === '/' ? '' : match.path;
    const tabKey = location.pathname.replace(`${url}/`, '');
    if (tabKey && tabKey !== '/') {
      switch (tabKey) {
        case '/clients/all':
          return 'ALL';
        case '/clients/active':
          return 'ACTIVE';
        case '/clients/inactive':
          return 'INACTIVE';
        default:
          return 'ALL';
      }
    }
    return 'ALL';
  };

  const handleTabChange = (key) => {
    const url = match.url === '/' ? '' : match.url.replace(/[^/]+$/, '');
    switch (key) {
      case 'ALL':
        history.push(`${url}all`);
        break;
      case 'ACTIVE':
        history.push(`${url}active`);
        break;
      case 'INACTIVE':
        history.push(`${url}inactive`);
        break;
      default:
        break;
    }
  };

  return (
    <div className="container mx-auto">
      <Page
        title="Clients"
        PrevNextNeeded="N"
        breadcrumbs={
          <Breadcrumbs
            path={[
              {
                name: 'Dashboard',
                path: '/dashboard',
              },
              {
                name: 'All Clients',
                path: '/clients/all',
              },
            ]}
          />
        }
        primaryAction={
          <Link
            to={{
              pathname: '/clients/invite',
            }}
          >
            <Button icon={<PlusSquareOutlined />} type="primary" id="open-invite-staff">
              Invite client
            </Button>
          </Link>
        }
      >
        <div className="flex justify-end mb-4">
          <div className="flex space-x-2 ">
            <Button
              // disabled={selectedRows?.length === 0}
              // onClick={() => setVisibleEmail(true)}
              type="primary"
            >
              <Envelope />
            </Button>
            <Button
              // onClick={() => setVisibleWhatsApp(true)}
              // disabled={selectedRows?.length === 0}
              type="primary"
            >
              <WhatsApp />
            </Button>
            <Button type="primary">
              <ChatLeftIcon />
            </Button>
          </div>
        </div>

        <div className="bg-white shadow rounded">
          <Tabs defaultActiveKey="ACTIVE" activeKey={getTabKey()} onChange={handleTabChange}>
            <TabPane tab={<span className="px-4">All</span>} key="ALL" />
            <TabPane tab={<span className="px-4">Active</span>} key="ACTIVE" />
            <TabPane tab={<span className="px-4">Inactive</span>} key="INACTIVE" />
          </Tabs>
          <ClientListTable
            viewSize={viewSize}
            totalRecords={clientList?.totalCount}
            currentPage={currentPage}
            setViewSize={setViewSize}
            setCurrentPage={setCurrentPage}
            setStartIndex={setStartIndex}
            setKeyword={setAcceptedKeyword}
            clientList={clientList?.records}
            loading={loading}
            getClientsList={getClientsList}
          />
        </div>
      </Page>
    </div>
  );
};
export default connect(({ leads, loading }) => ({
  clientList: leads.clientList,
  loading: loading.effects['leads/getClientList'],
}))(ClientsList);
