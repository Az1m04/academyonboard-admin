/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import {
  Input,
  Button,
  Form,
  Switch,
  Select,
  Radio,
  Row,
  Col,
  DatePicker,
  message,
  Checkbox,
  AutoComplete,
  Timeline,
} from 'antd';
import style from './index.less';
import CheckValidation from '@/components/CheckValidation';
import EmptyState from '@/components/EmptyState';
import emptyStateSvg from '@/assets/icons/space-empty.svg';
import AppIcons from '@/utils/AppIcons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import ReactHtmlParser from 'react-html-parser';

const AddFollowUp = ({
  dispatch,
  editLead,
  currentUser,
  clientList,
  departmentList,
  loading,
  lastStatusList,
  getLeadFollowUp,
  getDepartmentStaffList,
}) => {
  const [form] = Form.useForm();
  const { Option } = Select;
  // eslint-disable-next-line no-unused-vars
  const [viewSize, setViewSize] = useState(10);
  // eslint-disable-next-line no-unused-vars
  const [startIndex, setStartIndex] = useState(0);
  const [assignee, setAssignee] = useState(false);
  const [branchId, setBranchId] = useState();
  const [isInterested, setIsInterested] = useState(true);
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

  const list = [
    {
      name: 'EMPLOYEE',
      value: currentUser?.personalDetails?.id,
    },
    {
      name: 'LEAD_STUDENT',
      value: editLead?.leadId,
    },
  ];

  const options = [
    { label: 'Positive', value: 'POSITIVE' },
    { label: 'Negative', value: 'NEGATIVE' },
    { label: 'No feedback', value: 'NO_FEEDBACK' },
  ];

  const getFollowUps = () => {
    dispatch({
      type: 'leads/getLeadFollowUp',
      payload: {
        pathParams: {
          leadId: editLead?.leadId,
        },
      },
    });
    if (editLead?.record?.lastFollowUpBy?.department?.id) {
      dispatch({
        type: 'staff/getDepartmentStaffList',
        payload: {
          pathParams: { depId: editLead?.record?.lastFollowUpBy?.department?.id },
        },
      });
    }

    if (
      editLead?.record?.lastFollowUpBy &&
      Object.keys(editLead?.record?.lastFollowUpBy)?.includes('department')
    ) {
      setAssignee(true);
    }
    if (editLead?.record?.lastFollowUpBy?.isInterested === true) {
      setIsInterested(true);
    }
    if (editLead?.record?.lastFollowUpBy?.isInterested === false) {
      setIsInterested(false);
    }
    form.setFieldsValue({
      followUpBy: {
        id:
          editLead?.record?.lastFollowUpBy?.roleTypeId &&
          list?.find((val) => val?.name === editLead?.record?.lastFollowUpBy?.roleTypeId)?.value,
      },
      lastStatus: editLead?.record?.lastFollowUpStatus
        ? editLead?.record?.lastFollowUpStatus
        : undefined,
      branch: {
        id: editLead?.record?.lastFollowUpBy?.branch?.id
          ? editLead?.record?.lastFollowUpBy?.branch?.id
          : undefined,
      },
      selectDepartment: editLead?.record?.lastFollowUpBy?.department?.id
        ? editLead?.record?.lastFollowUpBy?.department?.id
        : undefined,
      selectAssign:
        editLead?.record?.lastFollowUpBy?.lastAssignee?.length > 0
          ? editLead?.record?.lastFollowUpBy?.lastAssignee?.map((item) => item?.id)
          : undefined,
      currentActionMode: editLead?.record?.currentActionId,
      isInterested: editLead?.record?.lastFollowUpBy?.isInterested,
      comment: editLead?.record?.lastFollowUpBy?.comment,
      feedBackType: editLead?.record?.lastFollowUpBy?.feedBackType,
    });
  };

  const onCommentFinish = (value) => {
    const data = {
      ...value,
      followUpBy: { id: editLead?.leadId },
      enquiryId: editLead?.enquiryId,
      department: {
        id: value?.selectDepartment || '',
        members: value?.selectAssign?.map((item) => {
          return { id: item };
        }) || [{ id: '' }],
      },
      nextFollowUpOn: value?.nextFollowUpOn?.toISOString(),
      roleTypeId: list?.find((val) => val?.value === value?.followUpBy?.id)?.name,
    };

    if (!assignee) {
      delete data.department;
    }

    if (!isInterested) {
      delete data.department;
      delete data.followUpOn;
    }

    delete data.selectAssign;
    delete data.selectDepartment;

    if (!data?.branch?.id) {
      delete data?.branch?.id;
    }
    dispatch({
      type: 'leads/addFollowUp',
      payload: {
        body: data,
        pathParams: {
          leadId: editLead?.leadId,
        },
        query: { isInterested },
      },
    }).then((res) => {
      if (res?.status === 'ok') {
        message.success('Follow up is added successfully');
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
        getFollowUps();
      } else {
        message.error('Something went wrong');
      }
    });
  };

  useEffect(() => {
    getFollowUps();
  }, []);

  const getTimelineIcon = () => {
    return (
      <div
        className="flex items-center justify-center w-8 h-8 text-white rounded-full"
        style={{ backgroundColor: '#ffa500' }}
      >
        <AppIcons.CardText />
      </div>
    );
  };

  return (
    <>
      <Form form={form} onFinish={onCommentFinish} hideRequiredMark>
        <div className="py-4">
          <div className="py-2 px-4">
            Select <span className="font-bold">current actions</span>
          </div>

          <div className="flex items-baseline justify-between px-4 mb-5">
            <Form.Item
              initialValue={currentUser?.personalDetails?.id}
              name={['followUpBy', 'id']}
              rules={[
                {
                  required: true,
                  message: 'Please select by whom current action is going to perform!',
                },
              ]}
            >
              <Radio.Group>
                {list?.map((item) => (
                  <Radio key={item?.value} value={item?.value}>
                    By{' '}
                    {item?.name === 'EMPLOYEE'
                      ? currentUser?.personalDetails?.displayName
                      : 'Student'}
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>
            <div className="flex flex-wrap justify-end">
              <p className="mr-2 text-xs font-semibold">Not interested</p>
              <Switch
                checked={!isInterested}
                size="small"
                onChange={(val) => {
                  setIsInterested(!val);
                  form.resetFields();
                  setAssignee(false);
                }}
              />
            </div>
          </div>

          <div className={`px-4 rounded-lg w-full ${style.SelectBtn}`}>
            <p className="text-xs font-semibold">Current action</p>
            <Form.Item
              name="currentActionMode"
              rules={[{ required: true, message: 'Please select current action' }]}
            >
              <Select
                placeholder="Select current action"
                getPopupContainer={(node) => node.parentNode}
              >
                {arrayOfInteractions?.map((type) => (
                  <Option key={type.value}>{type.label}</Option>
                ))}
                <Option value="WEPT_TASK_VISIT">Visited office</Option>
              </Select>
            </Form.Item>
          </div>

          {!isInterested && (
            <>
              <div className="px-4">
                <span className="text-xs font-semibold">Add feedback (Optional)</span>
                <Form.Item name="comment">
                  <Input
                    style={{ marginTop: '0.3rem', borderRadius: '0.3rem' }}
                    size="middle"
                    placeholder="Add feedback"
                  />
                </Form.Item>
                <Form.Item name="feedBackType" initialValue="POSITIVE">
                  <Radio.Group options={options} />
                </Form.Item>
              </div>
              <div className="px-4 py-4">
                <span className="text-xs font-semibold">Last status</span>
                <Form.Item
                  name="lastStatus"
                  rules={[{ required: true, message: 'Please add last status!' }]}
                >
                  <AutoComplete
                    style={{ marginTop: '0.3rem', borderRadius: '0.3rem' }}
                    size="middle"
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
          )}
          {isInterested && (
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
              <div className="px-4 py-4">
                <span className="text-xs font-semibold">Last status</span>
                <Form.Item
                  name="lastStatus"
                  rules={[{ required: true, message: 'Please add last status!' }]}
                >
                  <AutoComplete
                    style={{ marginTop: '0.3rem', borderRadius: '0.3rem' }}
                    size="middle"
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

              <div className="flex px-4 items-center pb-4">
                {/* the assignee flow is not complete need to fetch department by branch then members by department */}
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
                        <Form.Item
                          name={['branch', 'id']}
                          rules={[{ required: true, message: 'Please select branch!' }]}
                        >
                          <Select
                            placeholder="Please select branch"
                            className="w-full"
                            onSelect={(val) => {
                              setBranchId(val);
                            }}
                            getPopupContainer={(node) => node.parentNode}
                          >
                            {clientList?.records?.map((val) => (
                              <Option key={val?.id} value={val?.id}>
                                {' '}
                                {val?.clientName}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </div>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                      <div>
                        <p className="text-xs font-semibold">Select department</p>
                        <Form.Item
                          name="selectDepartment"
                          rules={[{ required: true, message: 'Please select department!' }]}
                        >
                          <Select
                            placeholder="Please select departments"
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
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                      <div>
                        <p className="text-xs font-semibold">Select Assignee</p>
                        <Form.Item
                          name={'selectAssign'}
                          rules={[{ required: true, message: 'Please select assignee!' }]}
                        >
                          <Select
                            placeholder="Please select assignees"
                            getPopupContainer={(node) => node.parentNode}
                            mode="multiple"
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
          )}

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

      {getLeadFollowUp?.length && (
        <div className="flex justify-between p-8 ">
          <span>
            Showing <span className="text-blue-600 pr-1"> {getLeadFollowUp?.length} </span>
            of <span className="text-green-600"> {getLeadFollowUp?.length} </span>
          </span>
        </div>
      )}

      <CheckValidation
        show={getLeadFollowUp?.length > 0}
        fallback={
          <EmptyState
            emptyState={emptyStateSvg}
            emptyHeaderText={<span>No follow ups have been added yet!</span>}
          />
        }
      />

      <div className={`px-5 ${style.TimeLineIcon}`}>
        <Timeline className="w-full">
          {getLeadFollowUp?.map((rec) => (
            <>
              <Timeline.Item dot={getTimelineIcon()} key={rec?.id}>
                <div className="flex justify-between pl-6">
                  <div className="flex-wrap w-full">
                    <div className="flex justify-between">
                      <div>
                        <span className="font-semibold text-blue-600">
                          {rec?.createdBy?.displayName}
                        </span>{' '}
                        <span>has added follow up</span>
                      </div>
                      <div>
                        <div className="text-right text-gray-400">
                          <div className="text-xs italic text-gray-800">
                            {dayjs(rec?.createdAt).fromNow()}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 flex">
                      <div>
                        <p>
                          Previous action was{' '}
                          {
                            <span className="font-bold">
                              {rec?.currentActionMode?.toLowerCase()}
                            </span>
                          }{' '}
                          on {dayjs(rec?.createdAt).format('MMM D, YYYY')} at{' '}
                          {dayjs(rec?.createdAt).format('h:mm A')} and Next action is{' '}
                          {<span className="font-bold">{rec?.nextActionMode?.toLowerCase()}</span>}{' '}
                          will be taken by{' '}
                          {<span className="font-bold">{rec?.followUpBy?.displayName}</span>}{' '}
                          scheduled on{' '}
                          {
                            <span className="font-bold">
                              {dayjs(rec?.followUpOn).format('MMM D, YYYY')}
                            </span>
                          }{' '}
                          at{' '}
                          {
                            <span className="font-bold">
                              {dayjs(rec?.followUpOn).format('h:mm A')}
                            </span>
                          }{' '}
                        </p>
                      </div>
                    </div>
                    <div className="w-full richtext-container-div">
                      {ReactHtmlParser(rec?.noteInfo)}
                    </div>
                  </div>
                </div>
              </Timeline.Item>
            </>
          ))}
          <div className="h-14" />
        </Timeline>
      </div>
    </>
  );
};

export default connect(({ leads, user, staff, loading }) => ({
  departmentList: staff.departmentList,
  currentUser: user.currentUser,
  editLead: leads.editLead,
  clientList: leads.clientList,
  staffList: staff.staffList,
  lastStatusList: leads?.lastStatusList,
  getLeadFollowUp: leads?.getLeadFollowUp,
  getDepartmentStaffList: staff.getDepartmentStaffList,
  loading: loading?.effects['leads/addFollowUp'],
}))(AddFollowUp);
