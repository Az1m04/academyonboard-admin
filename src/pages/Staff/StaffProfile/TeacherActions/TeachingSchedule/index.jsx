/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import MyTeachingPlan from './MyTeachingPlan';
import { Tabs, Radio, Spin, message } from 'antd';
import { connect, useParams } from 'umi';
import TeachingScheduleTable from './TeachingScheduleTable';
import moment from 'moment';
import styles from './index.less';
import CheckValidation from '@/components/CheckValidation';
import EmptyState from '@/components/EmptyState';
import emptyStateSvg from '@/assets/icons/space-empty.svg';

const TeachingSchedule = ({
  dispatch,
  staffScheduled,
  staffBatchesList,
  batchListLoading,
  teachingPlanList,
  teachingPlanLoading,
}) => {
  const { TabPane } = Tabs;
  const { staffId } = useParams();
  const [tab, setTab] = useState('today');
  const [subListFilter, setSubListFilter] = useState();

  const tabOptions = [
    {
      title: `Yesterday`,
      key: 'yesterday',
    },
    {
      title: `Today`,
      key: 'today',
    },
    {
      title: `Tomorrow`,
      key: 'tomorrow',
    },
  ];
  const getTeachingScheduleList = (filterByDate, batchId) => {
    dispatch({
      type: 'staff/getStaffScheduled',
      payload: {
        pathParams: {
          staffId,
        },
        query: {
          filterByDate,
          batchId,
          viewSize: 1000,
        },
      },
    });
  };
  const getTeachingPlan = (filterByDate, batchId, partyId) => {
    dispatch({
      type: 'staff/getTeachingPlan',
      payload: { query: { partyId, batchId, filterByDate } },
    });
  };
  const getStaffBatchesDetails = (filterByDate) => {
    dispatch({
      type: 'staff/getStaffBatches',
      payload: {
        pathParams: {
          staffId,
        },
        query: { filterByDate, hasTeachingSchedule: true },
      },
    })
      .then((res) => {
        if (res?.records) {
          const idBatch = res?.records[0]?.batchId;
          getTeachingScheduleList(filterByDate, idBatch);
          getTeachingPlan(filterByDate, idBatch, staffId);
          setSubListFilter(res?.records[0]?.batchId);
        }
      })
      .catch((err) => {
        if (err) message.error('Something went wrong');
      });
  };

  useEffect(() => {
    let filterDate;
    if (tab === 'today') {
      filterDate = moment().format('YYYY-MM-DD hh:mm:ss');
    } else if (tab === 'tomorrow') {
      filterDate = moment().add(1, 'days').format('YYYY-MM-DD hh:mm:ss');
    } else {
      filterDate = moment().add(-1, 'days').format('YYYY-MM-DD hh:mm:ss');
    }
    getStaffBatchesDetails(filterDate);
  }, [tab]);
  useEffect(() => {
    if (subListFilter !== undefined) {
      let filterDate;
      if (tab === 'today') {
        filterDate = moment().format('YYYY-MM-DD hh:mm:ss');
      } else if (tab === 'tomorrow') {
        filterDate = moment().add(1, 'days').format('YYYY-MM-DD hh:mm:ss');
      } else {
        filterDate = moment().add(-1, 'days').format('YYYY-MM-DD hh:mm:ss');
      }
      getTeachingScheduleList(filterDate, subListFilter);
      getTeachingPlan(filterDate, subListFilter, staffId);
    }
  }, [subListFilter]);
  function toTitleCase(str) {
    return str.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }
  return (
    <div>
      <Spin spinning={Boolean(batchListLoading)}>
        <div className="">
          <h1 className="text-blue-700 text-xl font-medium  mt-4">Teaching Schedule</h1>
        </div>
        <div className="mr-10">
          <Tabs defaultActiveKey="today" onChange={(value) => setTab(value)}>
            {tabOptions?.map(({ key, title }) => (
              <TabPane tab={title} key={key}></TabPane>
            ))}
          </Tabs>
        </div>
        <div className="mt-2">
          <Radio.Group
            size="small"
            className={`${styles.customRadioButtonDesign}`}
            value={subListFilter}
            onChange={(e) => {
              setSubListFilter(e.target.value);
            }}
          >
            {staffBatchesList?.records?.map((items) => (
              <Radio.Button key={items?.batchId} value={items?.batchId}>
                {toTitleCase(items?.batchName)}
              </Radio.Button>
            ))}
          </Radio.Group>
        </div>
        <CheckValidation
          show={teachingPlanList?.batchList[0]?.moduleSlots?.length > 0}
          fallback={
            <EmptyState
              emptyState={emptyStateSvg}
              emptyHeaderText={<span>No batch assigned yet</span>}
            />
          }
        >
          <div className="mr-10">
            <MyTeachingPlan teachingPlanList={teachingPlanList} loading={teachingPlanLoading} />
          </div>
          <div className="mr-10">
            <TeachingScheduleTable staffScheduled={staffScheduled} />
          </div>
        </CheckValidation>
      </Spin>
    </div>
  );
};

export default connect(({ staff, loading }) => ({
  staffScheduled: staff?.staffScheduled,
  staffBatchesList: staff?.getStaffBatches,
  teachingPlanList: staff?.teachingPlanList,
  teachingPlanLoading: loading?.effects['staff/getTeachingPlan'],
  batchListLoading: loading?.effects['staff/getStaffBatches'],
}))(TeachingSchedule);
