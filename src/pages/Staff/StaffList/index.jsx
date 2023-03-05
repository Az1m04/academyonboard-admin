import React, { useState, useEffect } from 'react';
import { Tabs, Button } from 'antd';
import { connect, Link, useParams } from 'umi';
import Page from '@/components/Page';
import Breadcrumbs from '@/components/BreadCrumbs';
import { PlusSquareOutlined } from '@ant-design/icons';
import StaffListTable from './StaffListTable';

const { TabPane } = Tabs;

const StaffList = (props) => {
  const { dispatch, history } = props;
  const [keyword, setKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [viewSize, setViewSize] = useState(10);

  const { tab } = useParams();

  const getStatusId = (currentTab) => {
    switch (currentTab) {
      case 'active':
        return 'PARTYINV_ACCEPTED';
      case 'inactive':
        return 'INV_ACCPTD_DSBLD';
      case 'awaiting':
        return 'PARTYINV_SENT';
      default:
        return '';
    }
  };

  const getStaffList = (tab_, pageNo, fetchSize, key) =>
    dispatch({
      type: 'staff/getStaffList',
      payload: {
        query: {
          statusId: getStatusId(tab_),
          viewSize: fetchSize,
          startIndex: fetchSize * (pageNo - 1),
          keyword: key,
        },
      },
    });

  useEffect(() => {
    getStaffList(tab, currentPage, viewSize, '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container mx-auto">
      <Page
        title="Staff"
        PrevNextNeeded="N"
        breadcrumbs={
          <Breadcrumbs
            path={[
              {
                name: 'Dashboard',
                path: '/dashboard',
              },
              {
                name: 'All Staff',
                path: '/staff/list',
              },
            ]}
          />
        }
        primaryAction={
          <Link
            to={{
              pathname: '/staff/invite',
            }}
          >
            <Button icon={<PlusSquareOutlined />} type="primary" id="open-invite-staff">
              Invite staff
            </Button>
          </Link>
        }
      >
        <div className="bg-white shadow rounded">
          <Tabs
            defaultActiveKey="all"
            className=""
            onTabClick={(val) => {
              setCurrentPage(1);
              setViewSize(10);
              setKeyword('');
              history.push(`/staff/list/${val}`);
              getStaffList(val, 1, 10, '');
            }}
            activeKey={tab}
          >
            <TabPane tab={<span className="px-4">All</span>} key="all" />
            <TabPane tab={<span className="px-4">Active</span>} key="active" />
            <TabPane tab="Inactive" key="inactive" />
            <TabPane tab="Awaiting Response" key="awaiting" />
          </Tabs>
          <StaffListTable
            activeTab={tab}
            setKeyword={setKeyword}
            viewSize={viewSize}
            currentPage={currentPage}
            setViewSize={setViewSize}
            setCurrentPage={setCurrentPage}
            getStaffList={getStaffList}
            keyword={keyword}
            history={history}
          />
        </div>
      </Page>
    </div>
  );
};
export default connect(() => ({}))(StaffList);
