import React, { useEffect, useState } from 'react';
import { Tabs, Button, Drawer, message } from 'antd';
import { connect, Link, useParams } from 'umi';
import Page from '@/components/Page';
import Breadcrumbs from '@/components/BreadCrumbs';
import Icon, { PlusSquareOutlined } from '@ant-design/icons';
import AppIcons, { Envelope, WhatsApp } from '@/utils/AppIcons';
import SubBranchTable from './SubBranchTable';
import ActionTitleRender from '../Leads/ClientLeads/ClientLeadActions/ActionTitleRender';
import SubBranchFollowsUp from './SubBranchActions/SubBranchFollowsUp';

const { TabPane } = Tabs;
const ClientsList = ({ subBranchesList, loading, history, dispatch, DALoading }) => {
  const { tabName } = useParams();
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [startIndex, setStartIndex] = useState(0);
  const [viewSize, setViewSize] = useState(10);
  const [keyword, setKeyword] = useState();
  const [visibleWhatsApp, setVisibleWhatsApp] = useState(false);
  const [visibleEmail, setVisibleEmail] = useState(false);
  const [recordDetails, setRecordDetails] = useState([]);
  const [isNoteVisible, setIsNoteVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isPhoneVisible, setIsPhoneVisible] = useState(false);
  const [isFollowsUpVisible, setIsFollowsUpVisible] = useState(null);
  const tabs = [
    { title: <span className="px-4">All</span>, key: 'ALL', push: 'all' },
    { title: <span className="px-4">Active</span>, key: 'ACTIVE', push: 'active' },
    { title: <span className="px-4">Inactive</span>, key: 'INACTIVE', push: 'inactive' },
  ];

  const getSubBranchesList = (key) => {
    const query = {
      viewSize,
      startIndex,
      keyword: key,

      clientId: 'OMG',
    };
    if (tabName === 'all') {
      query.status = tabName?.toUpperCase();
    } else if (tabName?.toUpperCase() === 'ACTIVE') {
      query.isAccepted = tabName?.toUpperCase() === 'ACTIVE';
    } else {
      query.isEnabled = false;
    }
    dispatch({
      type: 'subBranch/getSubBranches',
      payload: {
        query,
      },
    });
  };
  const updateDisableEnable = (subBranch) => {
    dispatch({
      type: 'subBranch/disableSubBranch',
      payload: {
        pathParams: {
          type: subBranch?.enabled ? 'deactivate' : 'reactivate',
          partyId: subBranch?.clientPoc?.id,
        },
      },
    }).then((res) => {
      if (res) {
        message.success(
          `${subBranch?.clientName}'s account has been ${
            subBranch?.enabled ? 'disabled' : 'enabled'
          }`,
        );
        getSubBranchesList('');
      }
    });
  };
  useEffect(() => {
    getSubBranchesList('');
  }, [tabName, currentPage, viewSize, startIndex]);

  return (
    <div className="container mx-auto">
      <Page
        title="Sub branches"
        PrevNextNeeded="N"
        breadcrumbs={
          <Breadcrumbs
            path={[
              {
                name: 'Dashboard',
                path: '/dashboard',
              },
              {
                name: 'All sub branches',
                path: '#',
              },
            ]}
          />
        }
        primaryAction={
          <Link
            to={{
              pathname: '/sub-branches/add/new',
            }}
          >
            <Button type="primary" style={{ display: 'flex', alignItems: 'center' }} id="open">
              <PlusSquareOutlined /> Add sub branch
            </Button>
          </Link>
        }
      >
        <div className="flex justify-end mb-4">
          <div className="flex space-x-2 ">
            <Button
              disabled={selectedRows?.length === 0}
              onClick={() => setVisibleEmail(true)}
              type="primary"
            >
              <Envelope />
            </Button>
            <Button
              onClick={() => setVisibleWhatsApp(true)}
              disabled={selectedRows?.length === 0}
              type="primary"
            >
              <WhatsApp />
            </Button>
          </div>
        </div>

        <div className="bg-white shadow rounded">
          <Tabs
            activeKey={tabName?.toUpperCase()}
            onTabClick={(key) => {
              setKeyword('');
              setStartIndex(0);
              setCurrentPage(1);
              history.push(`/sub-branches/${key?.toLowerCase()}`);
            }}
          >
            {tabs?.map((tab) => (
              <TabPane tab={tab?.title} key={tab?.key}>
                {tab?.push === tabName && (
                  <SubBranchTable
                    viewSize={viewSize}
                    startIndex={startIndex}
                    currentPage={currentPage}
                    setViewSize={setViewSize}
                    setCurrentPage={setCurrentPage}
                    setStartIndex={setStartIndex}
                    subBranchesList={subBranchesList}
                    loadings={{ loading, DALoading }}
                    getSubBranchesList={getSubBranchesList}
                    selectedRowKeys={selectedRowKeys}
                    setSelectedRowKeys={setSelectedRowKeys}
                    visibleEmail={visibleEmail}
                    setVisibleEmail={setVisibleEmail}
                    isNoteVisible={isNoteVisible}
                    setIsNoteVisible={setIsNoteVisible}
                    recordDetails={recordDetails}
                    setRecordDetails={setRecordDetails}
                    selectedRows={selectedRows}
                    setSelectedRows={setSelectedRows}
                    visibleWhatsApp={visibleWhatsApp}
                    setVisibleWhatsApp={setVisibleWhatsApp}
                    keyword={keyword}
                    setKeyword={setKeyword}
                    isPhoneVisible={isPhoneVisible}
                    setIsPhoneVisible={setIsPhoneVisible}
                    isFollowsUpVisible={isFollowsUpVisible}
                    setIsFollowsUpVisible={setIsFollowsUpVisible}
                    updateDisableEnable={updateDisableEnable}
                  />
                )}
              </TabPane>
            ))}
          </Tabs>
        </div>
        <Drawer
          title={
            <ActionTitleRender
              icon={
                <Icon
                  component={AppIcons.PeopleFill}
                  className="mt-1.5 text-2xl"
                  style={{ color: 'rgba(30,58,138)' }}
                />
              }
              title={'Add follow up'}
              subTitle={'add follow up for sub branch here'}
            />
          }
          style={{ zIndex: 1000000 }}
          placement="right"
          bodyStyle={{ padding: '0' }}
          headerStyle={{ padding: '5px 18px 5px 24px' }}
          onClose={() => setIsFollowsUpVisible(null)}
          visible={isFollowsUpVisible}
          width={550}
        >
          <SubBranchFollowsUp
            followsUpId={isFollowsUpVisible}
            setIsFollowsUpVisible={setIsFollowsUpVisible}
          />
        </Drawer>
      </Page>
    </div>
  );
};
export default connect(({ subBranch, loading }) => ({
  subBranchesList: subBranch?.subBranchesList,
  loading: loading?.effects['subBranch/getSubBranches'],
  DALoading: loading?.effects['subBranch/disableSubBranch'],
}))(ClientsList);
