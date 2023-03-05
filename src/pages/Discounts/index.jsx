import Breadcrumbs from '@/components/BreadCrumbs';
import Page from '@/components/Page';
import React from 'react';
import { connect, Link } from 'umi';
import { PlusSquareOutlined } from '@ant-design/icons';
import { Button, Tabs } from 'antd';

const { TabPane } = Tabs;

const Discounts = ({ children }) => {
  return (
    <div className="container mx-auto mt-4">
      <Page
        title="Discounts"
        PrevNextNeeded="N"
        breadcrumbs={
          <Breadcrumbs
            path={[
              {
                name: 'Dashboard',
                path: '/dashboard',
              },
              {
                name: 'Discounts',
                path: '/discounts',
              },
            ]}
          />
        }
        primaryAction={
          <Link
            to={{
              pathname: '/discounts/new',
            }}
          >
            <Button icon={<PlusSquareOutlined />} type="primary">
              Create discount
            </Button>
          </Link>
        }
      >
        <Tabs defaultActiveKey="1">
          <TabPane tab="Tab 1" key="1">
            {children}
          </TabPane>
          <TabPane tab="Tab 2" key="2">
            {children}
          </TabPane>
        </Tabs>
      </Page>
    </div>
  );
};

export default connect(({ staff }) => ({
  staffList: staff.staffList,
}))(Discounts);
