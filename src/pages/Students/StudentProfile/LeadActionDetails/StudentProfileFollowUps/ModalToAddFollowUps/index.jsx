import React, { useState, useEffect } from 'react';
import {
  Form,
  Button,
  Radio,
  Input,
  Modal,
  Select,
  AutoComplete,
  DatePicker,
  Checkbox,
  Row,
  Col,
} from 'antd';
import { connect } from 'umi';
import style from './index.less';
import { AppstoreAddOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

const ModalToAddFollowUps = ({
  editLead,
  dispatch,
  currentUser,
  lastStatusList,
  clientList,
  departmentList,
  loading,
  assignee,
  setAssignee,
  setIsInterested,
  form,
  getDepartmentStaffList,
  nextAction,
  setNextAction,
  list,
}) => {
  // eslint-disable-next-line no-unused-vars
  const [startIndex, setStartIndex] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [viewSize, setViewSize] = useState(10);
  const [branchId, setBranchId] = useState();
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

  const getStaffList = (key) =>
    dispatch({
      type: 'staff/getStaffList',
      payload: {
        query: {
          statusId: 'PARTYINV_ACCEPTED',
          viewSize: 1000,
          keyword: key,
          showAdmin: true,
        },
      },
    });

  useEffect(() => {
    getStaffList('');
    dispatch({
      type: 'staff/getDepartmentList',
      payload: {
        query: {
          viewSize: 10000,
        },
      },
    });

    dispatch({
      type: 'leads/getClientList',
      payload: {
        query: {
          isAccepted: true,
          clientId: 'OMG',
          viewSize,
          startIndex,
        },
      },
    }).catch(() => {});

    dispatch({
      type: 'leads/getLastStatusList',
      payload: {},
    });
  }, [currentUser, dispatch]);

  useEffect(() => {
    if (branchId) {
      dispatch({
        type: 'leads/getAssignList',
        payload: {
          pathParams: {
            orgId: currentUser?.personalDetails?.firstName,
          },
        },
      });
    }
  }, [branchId]);

  return (
    <Modal
      title={
        <div className="flex justify-between border-b">
          <div className="flex w-full px-4 py-4 pt-2">
            <AppstoreAddOutlined className="mt-1 text-xl" style={{ color: 'rgba(30,58,138)' }} />

            <div className="w-full pl-4">
              <div className="w-full text-base font-semibold text-blue-900">
                {editLead?.followUpId ? 'Edit follow up' : 'Add follow up'}
                <div className="w-full text-sm font-normal text-gray-500">
                  <span>{editLead?.followUpId ? 'Edit follow up' : 'Add follow up'}</span> for the
                  student here
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      onCancel={() => {
        dispatch({
          type: 'leads/setStates',
          payload: {
            visible: false,
            type: null,
            title: null,
            leadId: null,
          },
          key: 'editLead',
        });
        form.resetFields();
        setAssignee(false);
        setIsInterested(true);
        setNextAction('');
      }}
      visible={editLead?.visible && editLead?.purposeFor === 'studentsFollowUp'}
      footer={null}
    >
      <div className="">
        <div className="py-2 px-4">
          Select <span className="font-bold">current actions</span>
        </div>
        <div className="flex items-baseline justify-between px-4 mb-5">
          <Form.Item
            noStyle
            initialValue={currentUser?.personalDetails?.id}
            name={['followUpBy', 'id']}
          >
            <Radio.Group>
              {list?.map((item) => (
                <Radio key={item?.name} value={item?.value}>
                  By{' '}
                  {item?.name === 'EMPLOYEE'
                    ? currentUser?.personalDetails?.displayName
                    : 'Student'}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>
        </div>
        <div className={`px-4 rounded-lg w-full ${style.SelectBtn}`}>
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
            <Form.Item noStyle initialValue={currentUser?.personalDetails?.id} name={'phoneStatus'}>
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
            <Form.Item
              noStyle
              initialValue={currentUser?.personalDetails?.id}
              name={'meetingStatus'}
            >
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
            <Form.Item name="nextActionMode">
              <Select
                placeholder="Select next action"
                className={style.SelectBtn}
                onChange={(val) => {
                  if (form.getFieldValue('nextFollowUpOn') !== undefined) {
                    form.setFieldsValue({
                      lastStatus: `${
                        arrayOfInteractions?.find((item) => item?.value === val)?.label
                      } has been scheduled on ${dayjs(form.getFieldValue('nextFollowUpOn'))?.format(
                        'MMM D, YYYY, hh:MM A',
                      )} `,
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
              <Form.Item name="nextFollowUpOn">
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
            <span className="text-xs font-semibold">Add remarks</span>
            <Form.Item name="notes">
              <Input
                style={{ marginTop: '0.3rem', borderRadius: '0.3rem' }}
                size="middle"
                placeholder="add remarks"
              />
            </Form.Item>
          </div>
          <div className="px-4 py-4">
            <span className="text-xs font-semibold">Last status</span>
            <Form.Item name="lastStatus">
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
          <div className="flex px-4 items-center pb-4">
            <Checkbox onChange={(val) => setAssignee(val?.target?.checked)} checked={assignee}>
              <span className="font-bold">Add assignee</span>
            </Checkbox>
          </div>
          {assignee === true && (
            <div className=" px-4 ">
              <Row gutter={16} className={`flex ${style.SelectBtn}`}>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <div>
                    {' '}
                    <p className="text-xs font-semibold">Select branch</p>
                    <Form.Item name={['branch', 'id']}>
                      <Select
                        placeholder="select branch"
                        className="w-full"
                        onSelect={(val) => {
                          setBranchId(val);
                        }}
                        getPopupContainer={(node) => node.parentNode}
                      >
                        {clientList?.records?.map((val) => (
                          <Select.Option key={val?.id} value={val?.id}>
                            {val?.clientName}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <div>
                    <p className="text-xs font-semibold">Select department</p>
                    <Form.Item name="selectDepartment">
                      <Select
                        placeholder="select departments"
                        getPopupContainer={(node) => node.parentNode}
                        onChange={(val) => {
                          dispatch({
                            type: 'staff/getDepartmentStaffList',
                            payload: {
                              pathParams: { depId: val },
                            },
                          });
                          form.setFieldsValue({
                            selectAssign: undefined,
                          });
                        }}
                      >
                        {departmentList?.records?.map((val) => (
                          <Option key={val.id}>{val.name}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>
                </Col>
              </Row>
              <Row gutter={16} className={`flex ${style.SelectBtn}`}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  <div>
                    <p className="text-xs font-semibold">Select Assignee</p>
                    <Form.Item name={'selectAssign'}>
                      <Select
                        placeholder="select next action"
                        getPopupContainer={(node) => node.parentNode}
                        mode="multiple"
                        style={{ width: '100%' }}
                      >
                        {getDepartmentStaffList?.members?.map((val) => (
                          <Option key={val?.id} value={val?.id}>
                            {val?.displayName}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </>

        <div className="flex justify-end py-2 bg-white">
          <Button
            size="middle"
            onClick={() => {
              dispatch({
                type: 'leads/setStates',
                payload: {
                  visible: false,
                  type: null,
                  title: null,
                  leadId: null,
                },
                key: 'editLead',
              });
              form.resetFields();
              setAssignee(false);
              setIsInterested(true);
            }}
            className="mr-4"
          >
            Cancel
          </Button>

          <Button loading={loading} type="primary" size="middle" onClick={() => form.submit()}>
            {editLead?.followUpId ? 'Update' : 'Add'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default connect(({ leads, loading, user, staff }) => ({
  editLead: leads?.editLead,
  currentUser: user.currentUser,
  lastStatusList: leads?.lastStatusList,
  clientList: leads.clientList,
  departmentList: staff.departmentList,
  staffList: staff.staffList,
  getDepartmentStaffList: staff.getDepartmentStaffList,
  loading: loading?.effects['leads/addFollowUp'],
}))(ModalToAddFollowUps);
