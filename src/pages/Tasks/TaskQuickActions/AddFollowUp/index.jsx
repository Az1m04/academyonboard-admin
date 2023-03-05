import React from 'react';
import { Form, Select, Radio, Input, AutoComplete, DatePicker } from 'antd';
import styles from './index.less';
import moment from 'moment';

const AddFollowUp = ({ setNextAction, nextAction }) => {
  const arrayOfInteractions = [
    { label: 'Phone', value: 'WEPT_TASK_PHONE_CALL' },
    {
      label: 'Text message',
      value: 'WEPT_TASK_TEXT_MSG',
    },
    {
      label: 'Whatsapp message',
      value: 'WEPT_TASK_WATSAP_MSG',
    },
    {
      label: 'Email',
      value: 'WEPT_TASK_EMAIL',
    },
    {
      label: 'Visited office',
      value: 'WEPT_TASK_VISIT',
    },
    {
      label: 'Meeting',
      value: 'WEPT_TASK_MEETING',
    },
  ];
  const phoneStatus = [
    {
      name: 'Answered',
      value: 'ANSWERED',
    },
    {
      name: 'Not picked',
      value: 'NOT_PICKED',
    },
    {
      name: 'Not reachable',
      value: 'NOT_REACHABLE',
    },
    {
      name: 'Switch off',
      value: 'SWITCH_OFF',
    },
  ];

  const meetingStatus = [
    {
      name: 'Meeting done',
      value: 'MEETING_DONE',
    },
    {
      name: 'Meeting not done',
      value: 'MEETING_NOT_DONE',
    },
    {
      name: 'Meeting canceled',
      value: 'MEETING_CANCELED',
    },
  ];
  return (
    <>
      <div className={`px-4 rounded-lg w-full ${styles.SelectBtn}`}>
        <p className="text-xs font-semibold">Current action</p>
        <Form.Item
          name="currentActionMode"
          rules={[{ required: true, message: 'Please select current action' }]}
        >
          <Select placeholder="Select current action" onChange={(val) => setNextAction(val)}>
            {arrayOfInteractions?.map((type) => (
              <Select.Option key={type?.value} value={type?.value}>
                {type?.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </div>
      {nextAction === 'WEPT_TASK_PHONE_CALL' && (
        <div className="px-4 pb-4">
          <Form.Item noStyle name={'phoneStatus'} initialValue="ANSWERED">
            <Radio.Group>
              {phoneStatus?.map((item) => (
                <Radio key={item?.name} value={item?.value}>
                  {item?.name}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>
        </div>
      )}
      {nextAction === 'WEPT_TASK_MEETING' && (
        <div className="px-4 pb-4">
          <Form.Item noStyle name={'meetingStatus'} initialValue="MEETING_DONE">
            <Radio.Group>
              {meetingStatus?.map((item) => (
                <Radio key={item?.name} value={item?.value}>
                  {item?.name}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>
        </div>
      )}
      <div className={`px-4 rounded-lg w-full ${styles.SelectBtn}`}>
        <p className="text-xs font-semibold">Next action</p>
        <Form.Item
          name="nextActionMode"
          rules={[{ required: true, message: 'Please select next action !' }]}
        >
          <Select
            placeholder="Select next action"
            className={styles.SelectBtn}
            getPopupContainer={(node) => node.parentNode}
          >
            {arrayOfInteractions?.map((type) => (
              <Select.Option key={type.value}>{type.label}</Select.Option>
            ))}
          </Select>
        </Form.Item>
      </div>

      <div className=" px-4 ">
        <div>
          <p className="text-xs font-semibold">Next follow up date time</p>
          <Form.Item
            name="nextFollowUpOn"
            rules={[{ required: true, message: 'Please select next action date & time!' }]}
          >
            <DatePicker
              style={{ borderRadius: '0.3rem', width: '100%' }}
              allowClear={false}
              disabledDate={(date) => date.valueOf() < moment().subtract(1, 'days').valueOf()}
              use12Hours={true}
              showTime
              format="DD-MM-YYYY HH:mm"
              size="middle"
              placeholder="Please select"
              getPopupContainer={(node) => node.parentNode}
            />
          </Form.Item>
        </div>
      </div>
      <div className="px-4">
        <span className="text-xs font-semibold">Add remarks (Optional)</span>
        <Form.Item name="notes">
          <Input
            style={{ marginTop: '0.3rem', borderRadius: '0.3rem' }}
            size="middle"
            placeholder="add remarks"
          />
        </Form.Item>
      </div>
      <div className="px-4 ">
        <span className="text-xs font-semibold">Last status</span>
        <Form.Item
          name="lastStatus"
          rules={[{ required: true, message: 'Please add last status!' }]}
        >
          <AutoComplete
            style={{ marginTop: '0.3rem', borderRadius: '0.3rem' }}
            size="middle"
            getPopupContainer={(node) => node.parentNode}
          >
            <Input className="w-full" size="middle" placeholder="Enter last status" />
          </AutoComplete>
        </Form.Item>
      </div>
    </>
  );
};

export default AddFollowUp;
