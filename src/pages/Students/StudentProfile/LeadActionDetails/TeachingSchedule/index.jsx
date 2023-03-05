import React, { useEffect, useState } from 'react';
// import MyTeachingPlan from './MyTeachingPlan';
import { DatePicker, Tabs } from 'antd';
import TeachingScheduleTable from './TeachingScheduleTable';
import { connect, useParams } from 'umi';
import moment from 'moment';

const TeachingSchedule = ({ dispatch, studentBatchDetails }) => {
  const [subListFilter, setSubListFilter] = useState();
  const { studentId } = useParams();
  const [tab, setTab] = useState();
  useEffect(() => {
    dispatch({
      type: 'student/getStudentBatchDetails',
      payload: { pathParams: { studentId } },
    });
  }, [studentId, dispatch]);
  const getStudentTeachingSchedule = (filterByDate) => [
    dispatch({
      type: 'student/getTeachingSchedule',
      payload: {
        pathParams: { studentId },
        query: {
          batchId: subListFilter,
          filterByDate,

          viewSize: 1000,
        },
      },
    }),
  ];

  const { TabPane } = Tabs;
  const tabs = [
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
  useEffect(() => {
    let filterDate;
    if (tab === 'today') {
      filterDate = moment().format('YYYY-MM-DD hh:mm:ss');
    } else if (tab === 'tomorrow') {
      filterDate = moment().add(1, 'days').format('YYYY-MM-DD hh:mm:ss');
    } else {
      filterDate = moment().add(-1, 'days').format('YYYY-MM-DD hh:mm:ss');
    }
    getStudentTeachingSchedule(filterDate);
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
      getStudentTeachingSchedule(filterDate);
    }
  }, [subListFilter]);
  function toTitleCase(str) {
    return str.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }
  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-blue-700 text-xl font-medium  mt-4">Teaching Schedule</h1>{' '}
        <div className="py-2 px-10">
          <DatePicker style={{ width: '20rem' }} />
        </div>
      </div>
      <div className="mr-10">
        <Tabs
          defaultActiveKey="today"
          onChange={(value) => {
            setTab(value);
          }}
        >
          {tabs?.map(({ key, title }) => (
            <TabPane tab={title} key={key}></TabPane>
          ))}
        </Tabs>
      </div>
      <div className=" my-5">
        {/* <Radio.Group
          // buttonStyle="solid"
          size="small"
          // className={`${styles.customRadioButtonDesign}`}
          value={subListFilter}
          onChange={(e) => {
            setSubListFilter(e.target.value);
          }}
        >
          {studentBatchDetails?.records?.map((items) => (
            <Radio.Button key={items?.batchId} value={items?.batchId}>
              {toTitleCase(items?.batchName)}
            </Radio.Button>
          ))}
        </Radio.Group> */}
        <div className="flex">
          {studentBatchDetails?.records?.map((items) => (
            <p
              key={items?.batchId}
              onClick={() => {
                setSubListFilter(items?.batchId);
              }}
              style={{ borderColor: '#eab308' }}
              className="text-gray-900 border-l-2 border-r-2 cursor-pointer select-none   font-medium px-4 text-xs "
            >
              {toTitleCase(items?.batchName)}
            </p>
          ))}
        </div>
      </div>
      <div className="mr-10">{/* <MyTeachingPlan /> */}</div>
      <div className="mr-10">
        <TeachingScheduleTable subListFilter={subListFilter} />
      </div>
    </div>
  );
};

export default connect(({ student }) => ({
  studentBatchDetails: student?.studentBatchDetails,
}))(TeachingSchedule);
