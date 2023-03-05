/* eslint-disable no-unused-vars */
import moment from 'moment';
import { Select, DatePicker, Input, Divider, Tabs } from 'antd';
import React, { useState } from 'react';
import { connect, useParams } from 'umi';
import { debounce } from 'lodash';
import { RiseOutlined } from '@ant-design/icons';
import TestReports from './TestReports';
import TestAssigned from './TestAssigned';
import HomeWork from './HomeWork';
import PraticeTest from './PraticeTest';

const TestRecordsServices = () => {
  const { TabPane } = Tabs;
  const { Search } = Input;
  const { Option } = Select;
  const [courseType, setCourseType] = '';
  const [keyword, setKeyword] = useState('');
  const { studentId } = useParams();

  const courses = [
    {
      id: '0',
      label: 'All Activities',
      value: '',
    },
    {
      id: '1',
      label: 'Lead priority',
      value: 'lead_priority',
    },

    {
      id: '2',
      label: 'Lead owner',
      value: 'lead_owner',
    },
    {
      id: '2',
      label: 'Follow up',
      value: 'lead_followUpBy',
    },
  ];
  const action = (value) => {
    setKeyword(value);
  };
  const debounceSearch = debounce(action, 400);
  const callback = (key) => {
    console.log(key);
  };

  return (
    <div>
      <div className="flex justify-between">
        <div className="text-blue-600 font-semibold text-lg">Test Records & Services</div>
        <div className="flex justify-between">
          <div className="mr-4">
            <Select
              style={{ width: '12rem' }}
              value={courseType}
              placeholder="Course type"
              onChange={(value) => setCourseType(value)}
            >
              {courses?.map((item) => (
                <Option key={item?.id} value={item?.value}>
                  {item?.label}
                </Option>
              ))}
            </Select>
          </div>
          <div className="rounded-2xl mx-2">
            <Search
              style={{ width: '12rem' }}
              size="middle"
              placeholder="Enter keyword to search"
              onChange={(value) => debounceSearch(value?.target?.value)}
              enterButton
            />
          </div>
          <div className="">
            <DatePicker format="DD MMM, YYYY" style={{ width: '16rem' }} />
          </div>
        </div>
      </div>
      <Divider style={{ marginTop: '0.5rem', marginBottom: '1rem' }} />
      <Tabs defaultActiveKey="5" onChange={callback} style={{ marginBottom: '2.5rem' }}>
        <TabPane tab={<span className="font-semibold">Class Test(2)</span>} key="1">
          <TestReports />
        </TabPane>
        <TabPane tab={<span className="font-semibold">Assigned Test(6)</span>} key="2">
          <TestAssigned studentId={studentId} />
        </TabPane>
        <TabPane tab={<span className="font-semibold">Home work(8)</span>} key="3">
          <HomeWork />
        </TabPane>
        <TabPane tab={<span className="font-semibold">Practice Test</span>} key="4">
          <PraticeTest />
        </TabPane>
        <TabPane tab={<span className="font-semibold">Mock Test</span>} key="5">
          <TestReports />
        </TabPane>
        <div className="flex font-semibold space-x-2 justify-end">
          <span className="">
            <RiseOutlined />
          </span>
          <span className="text-green-500 text-base">Cumulative Progress</span>
        </div>
      </Tabs>
    </div>
  );
};

export default connect(() => ({}))(TestRecordsServices);
