import Breadcrumbs from '@/components/BreadCrumbs';
import Page from '@/components/Page';
import { Button, Tabs } from 'antd';
import React from 'react';
import { connect, Link } from 'umi';
import { PlusSquareOutlined } from '@ant-design/icons';
import CheckValidation from '@/components/CheckValidation';
import AwaitingVendors from './AwaitingVendors';
import ActiveInactiveVendors from './ActiveInactiveVendors';

const { TabPane } = Tabs;

const Vendors = ({ history, match, location }) => {
  const handleTabChange = (key) => {
    const url = match.url === '/' ? '' : match.url.replace(/[^/]+$/, '');
    switch (key) {
      case 'ACTIVE':
        history.push(`${url}active`);
        break;
      case 'INACTIVE':
        history.push(`${url}inactive`);
        break;
      case 'AWAITING':
        history.push(`${url}awaiting`);
        break;
      default:
        break;
    }
  };

  const getTabKey = () => {
    const url = match.path === '/' ? '' : match.path;
    const tabKey = location.pathname.replace(`${url}/`, '');
    if (tabKey && tabKey !== '/') {
      switch (tabKey) {
        case '/vendors/active':
          return 'ACTIVE';
        case '/vendors/inactive':
          return 'INACTIVE';
        case '/vendors/awaiting':
          return 'AWAITING';
        default:
          return 'ACTIVE';
      }
    }
    return 'ACTIVE';
  };

  return (
    <div className="container mx-auto mt-4">
      <Page
        title="Vendors"
        PrevNextNeeded="N"
        breadcrumbs={
          <Breadcrumbs
            path={[
              {
                name: 'Dashboard',
                path: '/dashboard',
              },
              {
                name: 'Vendors',
                path: '/vendors',
              },
            ]}
          />
        }
        primaryAction={
          <Link
            to={{
              pathname: '/vendors/invite',
            }}
          >
            <Button icon={<PlusSquareOutlined />} type="primary" id="open-new-vendor">
              Invite vendor
            </Button>
          </Link>
        }
      >
        <div className="bg-white shadow rounded">
          <Tabs
            defaultActiveKey="ACTIVE"
            className=""
            activeKey={getTabKey()}
            onChange={handleTabChange}
          >
            <TabPane tab={<span className="px-4">Active</span>} key="ACTIVE" />
            <TabPane tab={<span className="px-4">Inactive</span>} key="INACTIVE" />
            <TabPane tab={<span className="px-4">Awaiting response</span>} key="AWAITING" />
          </Tabs>

          <CheckValidation show={location.pathname === '/vendors/awaiting'}>
            <AwaitingVendors />
          </CheckValidation>
          <CheckValidation show={location.pathname !== '/vendors/awaiting'}>
            <ActiveInactiveVendors location={location} />
          </CheckValidation>
        </div>
      </Page>
    </div>
  );
};

export default connect(({ staff }) => ({
  staffList: staff.staffList,
}))(Vendors);
