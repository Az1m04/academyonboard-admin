/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { Input, Button, Form, Select, Radio, DatePicker, message, AutoComplete } from 'antd';
import style from './index.less';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

const SubBranchFollowsUp = ({
  dispatch,
  currentUser,
  loading,
  lastStatusList,
  setIsFollowsUpVisible,
  followsUpId,
  // subBranchData,
}) => {
  const [form] = Form.useForm();
  const { Option } = Select;

  const [nextAction, setNextAction] = useState('');
  dayjs.extend(relativeTime);

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

  useEffect(() => {
    if (followsUpId) {
      dispatch({
        type: 'leads/getLastStatusList',
        payload: {},
      });
    }
  }, [currentUser, dispatch, followsUpId]);

  const onCommentFinish = (value) => {
    const data = {
      ...value,
      nextFollowUpOn: value?.nextFollowUpOn?.toISOString(),
    };
    data.followUpBy = { id: followsUpId };
    data.roleTypeId = 'SUB_BRANCH';
    dispatch({
      type: 'leads/addFollowUp',
      payload: {
        body: data,
        pathParams: {
          leadId: followsUpId,
        },
        query: { isInterested: true },
      },
    }).then((res) => {
      if (res?.status === 'ok') {
        message.success('Follow up is added successfully');
        setIsFollowsUpVisible(null);
      } else {
        message.error('Something went wrong');
      }
    });
  };

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
      <Form form={form} onFinish={onCommentFinish} hideRequiredMark>
        <div className={`px-4 mt-5 rounded-lg w-full ${style.SelectBtn}`}>
          <p className="text-xs font-semibold">Current action</p>
          <Form.Item
            name="currentActionMode"
            rules={[{ required: true, message: 'Please select current action' }]}
            style={{ margin: 0 }}
          >
            <Select
              placeholder="Select current action"
              getPopupContainer={(node) => node.parentNode}
              onChange={(val) => setNextAction(val)}
            >
              {arrayOfInteractions?.map((type) => (
                <Option key={type.value}>{type.label}</Option>
              ))}
            </Select>
          </Form.Item>
        </div>
        <div className="py-4">
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

          <>
            <div className={`px-4 rounded-lg w-full ${style.SelectBtn}`}>
              <p className="text-xs font-semibold">Next action</p>
              <Form.Item
                name="nextActionMode"
                rules={[{ required: true, message: 'Please select next action !' }]}
              >
                <Select
                  placeholder="Select next action"
                  className={style.SelectBtn}
                  onChange={(val) => {
                    if (form.getFieldValue('nextFollowUpOn') !== undefined) {
                      form.setFieldsValue({
                        lastStatus: `${
                          arrayOfInteractions?.find((item) => item?.value === val)?.label
                        } has been scheduled on ${dayjs(
                          form.getFieldValue('nextFollowUpOn'),
                        )?.format('MMM D, YYYY, hh:MM A')} `,
                      });
                    }
                  }}
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
                  rules={[{ required: true, message: 'Please select next action date & time!' }]}
                >
                  <DatePicker
                    style={{ borderRadius: '0.3rem', width: '100%' }}
                    allowClear={false}
                    use12Hours={true}
                    showTime
                    format="DD-MM-YYYY HH:mm"
                    size="middle"
                    placeholder="Please select"
                    onChange={(val) => {
                      if (form.getFieldValue('nextActionMode') !== undefined) {
                        form.setFieldsValue({
                          lastStatus: `${
                            arrayOfInteractions?.find(
                              (item) => item?.value === form.getFieldValue('nextActionMode'),
                            )?.label
                          } has been scheduled on ${dayjs(val)?.format('MMM D, YYYY, hh:MM A')} `,
                        });
                      }
                    }}
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
            <div className="px-4 pb-4">
              <span className="text-xs font-semibold">Last status</span>
              <Form.Item
                name="lastStatus"
                rules={[{ required: true, message: 'Please add last status!' }]}
              >
                <AutoComplete
                  style={{ marginTop: '0.3rem', borderRadius: '0.3rem' }}
                  size="middle"
                  className={style.SelectBtn}
                  options={lastStatusList?.statusList?.map((val) => ({
                    label: val,
                    value: val,
                  }))}
                  getPopupContainer={(node) => node.parentNode}
                >
                  <Input className="w-full" size="middle" placeholder="Enter last status" />
                </AutoComplete>
              </Form.Item>
            </div>
          </>

          <div className="flex justify-end py-2 mr-5 bg-white">
            <Button
              size="middle"
              onClick={() => {
                setIsFollowsUpVisible(null);
              }}
              className="mr-4"
            >
              Cancel
            </Button>

            <Button loading={loading} type="primary" size="middle" onClick={() => form.submit()}>
              Add
            </Button>
          </div>
        </div>
      </Form>
    </>
  );
};

export default connect(({ leads, user, staff, loading }) => ({
  departmentList: staff.departmentList,
  currentUser: user.currentUser,
  leadData: leads?.clientLeadData?.records,
  staffList: staff.staffList,
  lastStatusList: leads?.lastStatusList,
  getLeadFollowUp: leads?.getLeadFollowUp,
  loading: loading?.effects['leads/addFollowUp'],
}))(SubBranchFollowsUp);
