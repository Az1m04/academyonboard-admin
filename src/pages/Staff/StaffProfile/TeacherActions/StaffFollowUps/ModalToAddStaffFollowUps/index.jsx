import React from 'react';
import { Form, Radio, Input, Modal, Select, AutoComplete, DatePicker, Spin, Button } from 'antd';

import style from './index.less';
import { AppstoreAddOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

const ModalToAddFollowUps = ({
  lastStatusList,
  form,
  nextAction,
  setNextAction,
  isFolowUpsModalVisible,
  setIsFolowUpsModalVisible,
  studentsList,
  loading,
  createStaffFollowUps,
  createLoading,
  editFollowUp,
  setEditFollowUp,
  updateFollowUp,
  updateLoading,
}) => {
  const { Option } = Select;
  dayjs.extend(relativeTime);

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
    {
      label: 'Others',
      value: 'WEPT_TASK_OTHERS',
    },
  ];
  return (
    <div>
      <Modal
        title={
          <div className="border-b pb-3">
            <span className="flex items-center gap-2">
              <span className="" style={{ color: 'rgba(30,58,138)' }}>
                <AppstoreAddOutlined className=" text-4xl" style={{ color: 'rgba(30,58,138)' }} />
              </span>
              <div className="flex flex-col">
                <span className="font-semibold " style={{ color: 'rgba(30,58,138)' }}>
                  {editFollowUp ? 'Update follow up' : 'Add follow up'}
                </span>
                <span className="font-normal  text-sm" style={{ color: 'rgba(30,58,138)' }}>
                  {editFollowUp
                    ? 'Update follow up for the student or staff here'
                    : 'Add follow up for the student or staff here'}
                </span>
              </div>
            </span>
          </div>
        }
        onCancel={() => {
          setIsFolowUpsModalVisible(false);
          setEditFollowUp();
          form.resetFields();
        }}
        visible={isFolowUpsModalVisible}
        footer={
          <>
            <Button
              onClick={() => {
                setIsFolowUpsModalVisible(false);
                setEditFollowUp();
                form.resetFields();
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              loading={createLoading || updateLoading}
              onClick={() => form.submit()}
            >
              {editFollowUp ? 'Update' : 'Add'}
            </Button>
          </>
        }
        maskClosable={false}
      >
        <Spin spinning={Boolean(loading) || Boolean(createLoading) || Boolean(updateLoading)}>
          <Form
            form={form}
            onFinish={(values) => {
              if (editFollowUp) {
                updateFollowUp(values);
              } else {
                createStaffFollowUps(values);
              }
            }}
          >
            <div className="">
              <div className={`px-4 rounded-lg w-full ${style.SelectBtn}`}>
                <div className="mt-2">
                  <p className="text-xs font-semibold">Select student</p>
                  <Form.Item name={['followUpBy', 'id']}>
                    <Select
                      showSearch
                      style={{ width: '100%' }}
                      allowClear
                      placeholder="Add student"
                      filterOption={false}
                    >
                      {studentsList?.records?.map((studentItem) => (
                        <Select.Option
                          key={studentItem?.id}
                          value={studentItem?.id}
                          label={studentItem?.displayName}
                        >
                          {studentItem?.displayName}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
                <p className="text-xs font-semibold">Current action</p>
                <Form.Item
                  name="currentActionMode"
                  rules={[{ required: true, message: 'Please select current action' }]}
                >
                  <Select
                    placeholder="Select current action"
                    onChange={(val) => setNextAction(val)}
                  >
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
                  <Form.Item noStyle initialValue={'ANSWERED'} name={'phoneStatus'}>
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
                  <Form.Item noStyle initialValue={'MEETING_DONE'} name={'meetingStatus'}>
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

              <>
                <div className={`px-4 rounded-lg w-full ${style.SelectBtn}`}>
                  <p className="text-xs font-semibold">Next action</p>
                  <Form.Item
                    name="nextActionMode"
                    rules={[{ required: true, message: 'Please select next action' }]}
                  >
                    <Select
                      placeholder="Select next action"
                      className={style.SelectBtn}
                      getPopupContainer={(node) => node.parentNode}
                    >
                      {arrayOfInteractions?.map((type) => (
                        <Option key={type.value}>{type.label}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>

                <div className=" px-4 ">
                  <div>
                    <p className="text-xs font-semibold">Next follow up date time</p>
                    <Form.Item
                      name="nextFollowUpOn"
                      rules={[{ required: true, message: 'Please select folow up date' }]}
                    >
                      <DatePicker
                        style={{ borderRadius: '0.3rem', width: '100%' }}
                        allowClear={false}
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
                  <span className="text-xs font-semibold">Add remarks</span>
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
                    rules={[{ required: true, message: 'Please select last status' }]}
                  >
                    <AutoComplete
                      style={{ marginTop: '0.3rem', borderRadius: '0.3rem' }}
                      size="middle"
                      options={lastStatusList?.statusList?.map((val) => ({
                        label: val,
                        value: val,
                      }))}
                    >
                      <Input className="w-full" size="middle" placeholder="Enter last status" />
                    </AutoComplete>
                  </Form.Item>
                </div>
              </>
            </div>
          </Form>
        </Spin>
      </Modal>
    </div>
  );
};
export default ModalToAddFollowUps;
