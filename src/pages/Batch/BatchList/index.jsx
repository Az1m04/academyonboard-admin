/* eslint-disable react-hooks/exhaustive-deps */
import Page from '@/components/Page';
import { Button, Tabs } from 'antd';
import { connect, history } from 'umi';
import React, { useState, useEffect } from 'react';
import Breadcrumbs from '@/components/BreadCrumbs';
import BatchListTable from './BatchListTable';
import { PlusSquareOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;

const Batches = ({ dispatch, batchRecords, match, location }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [viewSize, setViewSize] = useState(10);
  const [startIndex, setStartIndex] = useState(0);
  const [acceptedKeyword, setAcceptedKeyword] = useState('');

  const getTabKey = () => {
    const url = match.path === '/' ? '' : match.path;
    const tabKey = location.pathname.replace(`${url}/`, '');
    if (tabKey && tabKey !== '/') {
      switch (tabKey) {
        case '/batches/all':
          return 'ALL';
        case '/batches/active':
          return 'ACTIVE';
        case '/batches/inactive':
          return 'INACTIVE';
        case '/batches/offline':
          return 'OFFLINE';
        case '/batches/online':
          return 'ONLINE';
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
      case 'ONLINE':
        history.push(`${url}online`);
        break;
      case 'OFFLINE':
        history.push(`${url}offline`);
        break;
      default:
        break;
    }
  };

  const getIsActiveKey = () => {
    const key = getTabKey();

    if (key === 'ACTIVE') {
      return true;
    }
    if (key === 'INACTIVE') {
      return false;
    }
    return '';
  };

  const getModeId = () => {
    const key = getTabKey();

    if (key === 'ONLINE') {
      return 'ONLINE';
    }
    if (key === 'OFFLINE') {
      return 'OFFLINE';
    }
    return '';
  };
  const getBatches = () =>
    dispatch({
      type: 'batch/getBatches',
      payload: {
        query: {
          isActive: getIsActiveKey(),
          modeId: getModeId(),
          isFetchAll: typeof getIsActiveKey() !== 'boolean' && getModeId()?.length === 0,
          viewSize,
          startIndex,
          keyword: acceptedKeyword,
        },
      },
    });
  useEffect(() => {
    getBatches();
  }, [viewSize, startIndex, acceptedKeyword, dispatch]);

  return (
    <div className="mt-8">
      <Page
        title="Batches"
        PrevNextNeeded="N"
        breadcrumbs={
          <Breadcrumbs
            path={[
              {
                name: 'Dashboard',
                path: '/dashboard',
              },
              {
                name: 'Batches',
                path: '/batches/all',
              },
            ]}
          />
        }
        primaryAction={
          <Button
            style={{ display: 'flex', alignItems: 'center' }}
            type="primary"
            icon={<PlusSquareOutlined />}
            onClick={() => {
              dispatch({
                type: 'courses/setStates',
                payload: {
                  singleCourseDetail: null,
                },
                key: 'singleCourseDetail',
              });
              dispatch({
                type: 'batch/setStates',
                payload: {
                  getParticularBatch: null,
                },
                key: 'getParticularBatch',
              });
              dispatch({
                type: 'classDetails/setStates',
                payload: {
                  classRecordById: null,
                },
                key: 'classRecordById',
              });
              history.push('/batches/new');
            }}
          >
            Add batch
          </Button>
        }
      >
        <div className="bg-white rounded shadow ">
          <Tabs defaultActiveKey="ACTIVE" activeKey={getTabKey()} onChange={handleTabChange}>
            <TabPane tab={<span className="px-4">All</span>} key="ALL" />
            <TabPane tab={<span className="px-4">Active</span>} key="ACTIVE" />
            <TabPane tab="Inactive" key="INACTIVE" />
            <TabPane tab="Online" key="ONLINE" />
            <TabPane tab="Offline" key="OFFLINE" />
          </Tabs>

          <BatchListTable
            setKeyword={setAcceptedKeyword}
            viewSize={viewSize}
            totalRecords={batchRecords}
            currentPage={currentPage}
            setViewSize={setViewSize}
            setCurrentPage={setCurrentPage}
            startIndex={startIndex}
            setStartIndex={setStartIndex}
            getBatches={getBatches}
            history={history}
          />
        </div>
      </Page>
    </div>
  );
};

const mapStateToProps = ({ batch }) => ({
  batchRecords: batch?.batchRecord,
});

export default connect(mapStateToProps)(Batches);
