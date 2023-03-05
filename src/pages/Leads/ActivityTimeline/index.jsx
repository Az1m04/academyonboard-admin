import React, { useEffect, useState } from 'react';
import { Checkbox, Select, DatePicker, Skeleton } from 'antd';
import { connect } from 'umi';
import { CheckValidationWithoutDiv as CheckValidation } from '@/components/CheckValidation';
import TimeLine from './TimeLine';
import ActivityTime from './ActivityTime';
import moment from 'moment';

const { RangePicker } = DatePicker;

const { Option } = Select;

const ActivityTimeline = ({ dispatch, editLead, activityRec, loading }) => {
  const [activityType, setActivityType] = useState('');
  const [isStudent, setIsStudent] = useState(false);
  const [isCounsellor, setIsCounsellor] = useState(false);
  const [selectedDate, setSelectedDate] = useState(undefined);
  const [range, setRange] = useState([moment().subtract(7, 'day'), moment()]);

  const activityList = [
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
      id: '3',
      label: 'Follow up',
      value: 'lead_follow_up_by',
    },
    {
      id: '4',
      label: 'Lead note',
      value: 'lead_note',
    },
    {
      id: '5',
      label: 'Demo class',
      value: 'lead_demo_class',
    },
    {
      id: '6',
      label: 'Demo account',
      value: 'Demo_account',
    },
    {
      id: '7',
      label: 'Individual lead',
      value: 'lead_assignee',
    },
    {
      id: '8',
      label: 'Assessment test',
      value: 'lead_assessment_test',
    },
  ];

  const activityTimeList = [
    {
      label: 'Today',
      id: 'TODAY',
      value: moment().format('YYYY-MM-DD HH:mm:ss'),
      startDate: moment().format('YYYY-MM-DD HH:mm:ss'),
      endDate: moment().format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      label: 'Yesterday',
      id: 'YESTERDAY',
      startDate: moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss'),
      endDate: moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss'),
      value: moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      label: 'Last 7 days',
      id: 'LAST_7_DAYS',
      value: moment().subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss'),
      startDate: moment().subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss'),
      endDate: moment().format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      label: 'Last 15 days',
      id: 'LAST_15_DAYS',
      value: moment().subtract(15, 'days').format('YYYY-MM-DD HH:mm:ss'),
      startDate: moment().subtract(15, 'days').format('YYYY-MM-DD HH:mm:ss'),
      endDate: moment().format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      label: 'Last 30 days',
      id: 'LAST_30_DAYS',
      value: moment().subtract(30, 'days').format('YYYY-MM-DD HH:mm:ss'),
      startDate: moment().subtract(30, 'days').format('YYYY-MM-DD HH:mm:ss'),
      endDate: moment().format('YYYY-MM-DD HH:mm:ss'),
    },

    {
      label: 'Last month',
      id: 'LAST_MONTH',
      value: moment().subtract(1, 'months').format('YYYY-MM-DD HH:mm:ss'),
      startDate: moment().subtract(1, 'months').format('YYYY-MM-DD HH:mm:ss'),
      endDate: moment().format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      label: 'Custom',
      id: 'CUSTOM',
      value: 'custom',
    },
  ];

  const getActivityRecord = () => {
    const query = {
      activityType,
      isStudent,
      isCounsellor,
      startDate:
        selectedDate === 'Custom'
          ? range[0].format('YYYY-MM-DD HH:mm:ss')
          : activityTimeList?.filter((p) => p?.label === selectedDate)[0]?.startDate,
      endDate:
        selectedDate === 'Custom'
          ? range[1].format('YYYY-MM-DD HH:mm:ss')
          : activityTimeList?.filter((p) => p?.label === selectedDate)[0]?.endDate,
      viewSize: 1000,
    };
    if (editLead?.enquiryId) {
      query.enquiryId = editLead?.enquiryId;
    }
    dispatch({
      type: 'leads/getActivity',
      payload: {
        pathParams: { leadId: editLead?.leadId },
        query,
      },
    });
  };

  useEffect(() => {
    getActivityRecord();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activityType, isStudent, isCounsellor, selectedDate, range]);
  const onActivityChange = (value) => {
    setActivityType(value);
  };

  const checkBoxOptions = [
    {
      label: <span className="text-white">Counsellor</span>,
      value: 'counsellor',
    },
    { label: <span className="text-white">Student</span>, value: 'student' },
  ];

  const onCheckboxChange = (checkedValue) => {
    if (checkedValue.includes('student')) {
      setIsStudent(true);
    } else {
      setIsStudent(false);
    }
    if (checkedValue.includes('counsellor')) {
      setIsCounsellor(true);
    } else {
      setIsCounsellor(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between h-12 px-4 py-4 text-white bg-gray-700">
        <div className="font-semibold text-white">
          <Checkbox.Group options={checkBoxOptions} onChange={onCheckboxChange} />
        </div>
        <div className="flex justify-between">
          <div>
            <Select
              value={selectedDate}
              allowClear
              onChange={(value) => {
                setSelectedDate(value);
              }}
              placeholder="Select time filters"
              style={{ width: '8rem' }}
              listHeight="600"
            >
              {activityTimeList?.map((item) => (
                <Option key={item?.id} value={item?.label}>
                  {item?.label}
                </Option>
              ))}
            </Select>
          </div>
          <div>
            {selectedDate === 'Custom' && (
              <RangePicker
                value={range}
                allowClear={false}
                format="DD MMM, YYYY"
                onChange={(val) => {
                  setRange(val);
                  getActivityRecord(val);
                }}
                placeholder={['Search by', 'date']}
                style={{ width: '12rem' }}
                disabledDate={(date) => date > moment().add(1, 'day')}
              />
            )}
          </div>
        </div>
      </div>

      <div className="flex w-full p-5">
        <Skeleton loading={loading}>
          <div
            className="w-1/3 mr-4"
            style={{ height: '45rem', overflowY: 'auto', overflowX: 'hidden', width: '177px' }}
          >
            <Select
              value={activityType}
              placeholder="Activity type"
              onChange={onActivityChange}
              listHeight={300}
            >
              {activityList?.map((item) => (
                <Option key={item?.id} value={item?.value}>
                  {item?.label}
                </Option>
              ))}
            </Select>

            <CheckValidation show={activityRec}>
              <ActivityTime activityRec={activityRec} />
            </CheckValidation>
          </div>
        </Skeleton>

        <Skeleton loading={loading}>
          <CheckValidation show={activityRec}>
            <TimeLine activityRec={activityRec} />
          </CheckValidation>
        </Skeleton>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  activityRec: state?.leads?.activityRecord,
  editLead: state.leads.editLead,
  loading: state.loading.effects['leads/getActivity'],
});

export default connect(mapStateToProps)(ActivityTimeline);
