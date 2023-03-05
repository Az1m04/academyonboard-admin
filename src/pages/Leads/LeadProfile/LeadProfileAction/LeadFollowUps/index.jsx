import AppIcons from '@/utils/AppIcons';
import { MoreOutlined, UserOutlined } from '@ant-design/icons';
import {
  Avatar,
  Button,
  Divider,
  Select,
  Tooltip,
  Tabs,
  Dropdown,
  Menu,
  Spin,
  message,
  Form,
  DatePicker,
} from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import AddLeadFollowUps from './AddLeadFollowUps';

import { history, connect, useParams } from 'umi';
import CheckValidation from '@/components/CheckValidation';
import EmptyState from '@/components/EmptyState';
import emptyStateSvg from '@/assets/icons/space-empty.svg';
import moment from 'moment';

const LeadFollowUps = ({ dispatch, getLeadFollowUp, getAllFollowUpLoading, currentUser }) => {
  const [addFollowUpsModal, setAddFollowUpsModal] = useState(false);
  const [singleGetFollowUp, setSingleGetFollowUp] = useState();
  const [isInterested, setIsInterested] = useState(true);
  const [assignee, setAssignee] = useState(false);
  const [editFollowUp, setEditFollowUp] = useState(false);
  const [nextAction, setNextAction] = useState('');
  const [leadActivityType, setLeadActivityType] = useState(undefined);

  const [addFollowUpsForm] = Form.useForm();

  const [selectedDate, setSelectedDate] = useState(undefined);
  const [range, setRange] = useState([moment().subtract(7, 'day'), moment()]);
  const [tab, setTab] = useState('all');
  const { leadId } = useParams();

  const { Option } = Select;

  const { RangePicker } = DatePicker;
  const { TabPane } = Tabs;

  const switchCaseForCurrentAction = (currentAction) => {
    switch (currentAction) {
      case 'Others':
        return { retVal: 'Other action was performed on', icon: <AppIcons.ThreeDotsHorizontal /> };
      case 'Phone':
        return { retVal: 'Phone call was made on', icon: <AppIcons.TelephoneFillIcon /> };
      case 'Email':
        return { retVal: 'Email was sent on', icon: <AppIcons.Envelope /> };
      case 'Whatsapp Message':
        return { retVal: 'Whatsapp message was sent on', icon: <AppIcons.WhatsApp /> };
      case 'Text Message':
        return { retVal: 'Text message was sent on', icon: <AppIcons.ChatIcon /> };
      case 'Visit':
        return { retVal: 'Visited office on', icon: <AppIcons.GeoIcon /> };
      case 'Meeting':
        return { retVal: 'Meeting was performed on', icon: <AppIcons.People /> };
      default:
        return 'N/A';
    }
  };

  const switchCaseForNextAction = (currentAction) => {
    switch (currentAction) {
      case 'Others':
        return {
          retVal: 'Other action has been scheduled on',
          icon: <AppIcons.ThreeDotsHorizontal />,
        };
      case 'Phone':
        return { retVal: 'Phone call has been scheduled on', icon: <AppIcons.TelephoneFillIcon /> };
      case 'Email':
        return { retVal: 'Email has been scheduled on', icon: <AppIcons.Envelope /> };
      case 'Whatsapp Message':
        return { retVal: 'Whatsapp message has been scheduled on', icon: <AppIcons.WhatsApp /> };
      case 'Text Message':
        return { retVal: 'Text message has been scheduled on', icon: <AppIcons.ChatIcon /> };
      case 'Visit':
        return { retVal: 'Office visit has been scheduled on', icon: <AppIcons.GeoIcon /> };
      case 'Meeting':
        return { retVal: 'Meeting has been scheduled on', icon: <AppIcons.People /> };
      default:
        return 'N/A';
    }
  };
  const ActivityList = [
    {
      id: '0',
      label: 'Phone call',
      value: 'WEPT_TASK_PHONE_CALL',
    },
    {
      id: '1',
      label: 'Message',
      value: 'WEPT_TASK_TEXT_MSG',
    },

    {
      id: '2',
      label: 'Whatsapp',
      value: 'WEPT_TASK_WATSAP_MSG',
    },
    {
      id: '3',
      label: 'Visit',
      value: 'WEPT_TASK_VISIT',
    },
    {
      label: 'Meeting',
      value: 'WEPT_TASK_MEETING',
    },
    {
      id: '4',
      label: 'Email',
      value: 'WEPT_TASK_EMAIL',
    },
    {
      id: '5',
      label: 'Others',
      value: 'WEPT_TASK_OTHERS',
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
  const getLeadFollowUpRecord = () => {
    const data = {};

    switch (tab) {
      case 'scheduled':
        data.status = 'SCHEDULED';
        history.push('?status=scheduled');
        break;
      case 'today':
        data.status = 'TODAY';
        history.push('?status=today');
        break;
      case 'completed':
        data.status = 'COMPLETED ';
        history.push('?status=completed');
        break;
      case 'overdue':
        data.status = 'OVERDUE';
        history.push('?status=overdue');
        break;

      default:
        data.status = 'all';
        history.push('?status=all');

        break;
    }

    switch (leadActivityType) {
      case 'WEPT_TASK_PHONE_CALL':
        data.action = 'WEPT_TASK_PHONE_CALL';
        history.push('?action=PHONE-CALL');
        break;
      case 'WEPT_TASK_TEXT_MSG':
        data.action = 'WEPT_TASK_TEXT_MSG';
        history.push('?action=MESSAGE');
        break;
      case 'WEPT_TASK_WATSAP_MSG':
        data.action = 'WEPT_TASK_WATSAP_MSG';
        history.push('?action=WHATSAPP');
        break;
      case 'WEPT_TASK_VISIT':
        data.action = 'WEPT_TASK_VISIT';
        history.push('?action=VISIT');
        break;
      case 'WEPT_TASK_EMAIL':
        data.action = 'WEPT_TASK_EMAIL';
        history.push('?action=EMAIL');
        break;
      case 'WEPT_TASK_OTHERS':
        data.action = 'WEPT_TASK_OTHERS';
        history.push('?action=OTHERS');
        break;
      default:
        delete data.action;

        break;
    }

    const payload = {
      pathParams: { leadId },

      query: {
        ...data,
        startDay:
          selectedDate === 'Custom' && range !== null
            ? range[0]?.format('YYYY-MM-DD HH:mm:ss')
            : activityTimeList?.filter((p) => p?.label === selectedDate)[0]?.startDate,
        endDay:
          selectedDate === 'Custom' && range !== null
            ? range[1]?.format('YYYY-MM-DD HH:mm:ss')
            : activityTimeList?.filter((p) => p?.label === selectedDate)[0]?.endDate,

        viewSize: 1000,
      },
    };
    dispatch({
      type: 'leads/getLeadFollowUp',
      payload,
    });
  };

  useEffect(() => {
    getLeadFollowUpRecord();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, selectedDate, range, leadActivityType]);

  const DeleteLeadFollowUps = (id) => {
    const payload = {
      pathParams: { leadId, workEffortId: id },
    };
    dispatch({
      type: 'leads/deleteLeadFollowup',
      payload,
    }).then((res) => {
      if (res?.status === 'okk') {
        message.success('Follow up deleted successfully');
        getLeadFollowUpRecord();
      } else {
        message.error('Something went wrong');
      }
    });
  };
  const tabsPane = [
    {
      tab: `All `,
      key: 'all',
    },
    {
      tab: `Scheduled `,
      key: 'scheduled',
    },
    {
      tab: `Today's`,
      key: 'today',
    },
    {
      tab: `Completed`,
      key: 'completed',
    },
    {
      tab: `Overdue `,
      key: 'overdue',
    },
  ];
  const list = [
    {
      name: 'EMPLOYEE',
      value: currentUser?.personalDetails?.id,
    },
    {
      name: 'LEAD_STUDENT',
      value: leadId,
    },
  ];
  const editFollowUps = (val) => {
    setSingleGetFollowUp(val);
    setEditFollowUp(true);
    setAddFollowUpsModal(true);
    addFollowUpsForm?.setFieldsValue({
      currentActionMode: val?.currentModeId,
      nextActionMode: val?.nextModeId,
      notes: val?.notes,
      nextFollowUpOn: moment(val?.nextFollowUpOn),
    });
    if (Object.keys(val)?.includes('department')) {
      setAssignee(true);
    }
    setIsInterested(val?.isInterested);

    setNextAction(val?.currentModeId);
    addFollowUpsForm.setFieldsValue({
      followUpBy: {
        id: val?.roleTypeId && list?.find((value) => value?.name === val?.roleTypeId)?.value,
      },
      lastStatus: val?.lastStatus ? val?.lastStatus : undefined,
      branch: {
        id: val?.branch?.id ? val?.branch?.id : undefined,
      },
      selectDepartment: val?.department?.id ? val?.department?.id : undefined,
      selectAssign:
        val?.department?.members?.length > 0
          ? val?.department?.members?.map((items) => items?.id)
          : undefined,
      currentActionMode: val?.currentModeId,
      nextActionMode: val?.nextModeId,
      isInterested: val?.lastFollowUpBy?.isInterested,
      comment: val?.lastFollowUpBy?.comment,
      feedBackType: val?.lastFollowUpBy?.feedBackType,
      phoneStatus: val?.currentModeId === 'WEPT_TASK_PHONE_CALL' ? val.phoneLogStatus : undefined,
      meetingStatus: val?.currentModeId === 'WEPT_TASK_MEETING' ? val.meetingLogStatus : undefined,
    });

    // setIsInterested(val?.isInterested);
  };

  return (
    <div>
      <Spin spinning={Boolean(getAllFollowUpLoading)}>
        <div>
          <div className="flex justify-between">
            <div>
              <div className="text-blue-700 font-medium text-xl">Lead follow ups</div>
            </div>
            <div className="flex justify-between gap-5">
              <div>
                <Button type="primary" onClick={() => setAddFollowUpsModal(true)}>
                  Add follow
                </Button>
              </div>
              <div className="mr-4">
                <Select
                  style={{ width: '12rem' }}
                  value={leadActivityType}
                  placeholder="Activity list"
                  onChange={(value) => setLeadActivityType(value)}
                >
                  {ActivityList?.map((item) => (
                    <Option key={item?.id} value={item?.value}>
                      {item?.label}
                    </Option>
                  ))}
                </Select>
              </div>
              <div className="mr-4">
                <Select
                  style={{ width: '15rem', color: '#3B82F6' }}
                  value={selectedDate}
                  onChange={(value) => {
                    setSelectedDate(value);
                    setRange([moment().subtract(7, 'day'), moment()]);
                  }}
                  placeholder="Select time filter"
                  listHeight={400}
                  getPopupContainer={(node) => node.parentNode}
                >
                  {activityTimeList?.map((item) => (
                    <Option
                      key={item?.id}
                      value={item?.label}
                      className="bg-gray-100 rounded-lg mx-2 mt-2"
                      style={{ color: '#3B82F6', overflow: 'hidden' }}
                    >
                      {item?.label}
                    </Option>
                  ))}
                </Select>
                <div>
                  {selectedDate === 'Custom' && (
                    <RangePicker
                      allowEmpty
                      value={range}
                      format="DD MMM, YYYY"
                      onChange={(val) => {
                        setRange(val);
                      }}
                      placeholder={['Search by', 'date']}
                      style={{ width: '12rem' }}
                      disabledDate={(date) => date > moment().add(1, 'day')}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          <Divider style={{ marginTop: '0.6rem' }} />
        </div>
        <Tabs
          defaultActiveKey="all"
          activeKey={tab}
          onChange={(val) => {
            setTab(val);
          }}
          className="font-semibold text-blue-500"
        >
          <Divider style={{ marginTop: '0.6rem' }} />
          {tabsPane?.map((item) => (
            <TabPane
              tab={item?.tab}
              key={item?.key}
              style={{ overflow: 'auto', padding: '11px', height: '38rem' }}
            >
              <CheckValidation
                show={getLeadFollowUp?.length > 0}
                fallback={
                  <EmptyState
                    emptyState={emptyStateSvg}
                    emptyHeaderText={<span>No follow ups&lsquo;s found yet!</span>}
                  />
                }
              >
                {getLeadFollowUp?.length &&
                  getLeadFollowUp?.map((val) => (
                    <div key={item?.id}>
                      <div className="flex  h-full  my-4 mr-2 shadow-md rounded-r-lg">
                        <div
                          className={`${val?.taskStatus === 'Scheduled' && 'bg-yellow-500'} ${
                            val?.taskStatus === 'Overdue' && 'bg-red-500'
                          } ${val?.taskStatus === 'Completed' && 'bg-green-500'} ${
                            val?.taskStatus === 'Today' && 'bg-blue-500'
                          } w-2 rounded-l-lg `}
                        />
                        <div className="border rounded-r-lg w-full">
                          <div className="flex items-center mx-2 my-2 justify-between">
                            {tab === 'all' && (
                              <div className=" flex space-x-20  w-full">
                                <div>
                                  <Tooltip title="Current action">
                                    <div
                                      className={`flex ${
                                        val?.nextFollowUpOn !== undefined &&
                                        val?.nextActionMode &&
                                        ''
                                      }`}
                                    >
                                      <div className="rounded-full bg-gray-300 h-8.5 w-8.5 mt-2 p-2.5 shadow-md">
                                        {switchCaseForCurrentAction(val?.currentActionMode)?.icon}
                                      </div>

                                      <div className="flex text-lg  font-semibold text-gray-700 px-4 items-center ">
                                        {switchCaseForCurrentAction(val?.currentActionMode)?.retVal}
                                      </div>
                                    </div>
                                    <div className="flex -mt-3 text-md">
                                      <div className="border-r text-green-500 font-semibold ml-14 pr-4">
                                        {dayjs(val?.createdDate).format('MM-DD-YYYY')}
                                        <span className="border-l pl-2 ml-2">
                                          {' '}
                                          {dayjs(val?.createdDate).format('h:mm A')}
                                        </span>
                                      </div>
                                      <div className="text-gray-500 font-semibold pl-2">
                                        {val?.taskStatus}
                                      </div>
                                    </div>
                                  </Tooltip>
                                </div>

                                {val?.nextFollowUpOn !== undefined && val?.nextActionMode && (
                                  <div className="border-l">
                                    <Tooltip title="Next action">
                                      <div className=" ml-4 ">
                                        <div className="flex">
                                          <div className="rounded-full bg-gray-300 h-8.5 w-8.5 mt-2 p-2.5 shadow-md">
                                            {val?.nextFollowUpOn !== undefined &&
                                              switchCaseForNextAction(val?.nextActionMode)?.icon}
                                          </div>

                                          <div className="flex text-lg  font-semibold text-gray-700 px-4 items-center ">
                                            {val?.nextFollowUpOn !== undefined &&
                                              switchCaseForNextAction(val?.nextActionMode)?.retVal}
                                          </div>
                                        </div>
                                        <div className="flex -mt-3 text-md">
                                          <div className=" text-green-500 font-semibold ml-14 pr-4">
                                            {dayjs(val?.nextFollowUpOn).format('MM-DD-YYYY')}
                                            <span className="border-l pl-2 ml-2">
                                              {' '}
                                              {dayjs(val?.nextFollowUpOn).format('h:mm A')}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </Tooltip>
                                  </div>
                                )}
                              </div>
                            )}
                            {tab === 'scheduled' && (
                              <div className="flex">
                                <div className="rounded-full bg-gray-300 h-8.5 w-8.5 mt-2 p-2.5 shadow-md">
                                  {val?.nextFollowUpOn !== undefined &&
                                    switchCaseForNextAction(val?.nextActionMode)?.icon}
                                </div>

                                <div className="flex text-lg  font-semibold text-gray-700 px-4 items-center ">
                                  {val?.nextFollowUpOn !== undefined &&
                                    switchCaseForNextAction(val?.nextActionMode)?.retVal}
                                  <div className="text-green-500 text-base ml-2">
                                    {val?.nextFollowUpOn !== undefined &&
                                      dayjs(val?.nextFollowUpOn).format('MM-DD-YYYY h:mm A')}
                                  </div>
                                </div>
                              </div>
                            )}
                            {tab === 'today' && (
                              <div className="flex">
                                <div className="rounded-full bg-gray-300 h-8.5 w-8.5 mt-2 p-2.5 shadow-md">
                                  {switchCaseForCurrentAction(val?.currentActionMode)?.icon}
                                </div>

                                <div className="flex text-lg  font-semibold text-gray-700 px-4 items-center ">
                                  {switchCaseForCurrentAction(val?.currentActionMode)?.retVal}
                                  <div className="text-green-500 text-base ml-2">
                                    {dayjs(val?.createdDate).format('MM-DD-YYYY h:mm A')}
                                  </div>
                                </div>
                              </div>
                            )}
                            {tab === 'completed' && (
                              <div className="flex">
                                <div className="rounded-full bg-gray-300 h-8.5 w-8.5 mt-2 p-2.5 shadow-md">
                                  {switchCaseForCurrentAction(val?.currentActionMode)?.icon}
                                </div>

                                <div className="flex text-lg  font-semibold text-gray-700 px-4 items-center ">
                                  {switchCaseForCurrentAction(val?.currentActionMode)?.retVal}
                                  <div className="text-yellow-500 text-base ml-2">
                                    {dayjs(val?.createdDate).format('MM-DD-YYYY h:mm A')}
                                  </div>
                                </div>
                              </div>
                            )}
                            {tab === 'overdue' && (
                              <div className="flex">
                                <div className="rounded-full bg-gray-300 h-8.5 w-8.5 mt-2 p-2.5 shadow-md">
                                  {val?.nextFollowUpOn !== undefined &&
                                    switchCaseForNextAction(val?.nextActionMode)?.icon}
                                </div>

                                <div className="flex text-lg  font-semibold text-gray-700 px-4 items-center ">
                                  {val?.nextFollowUpOn !== undefined &&
                                    switchCaseForNextAction(val?.nextActionMode)?.retVal}
                                  <div className="text-yellow-500 text-base ml-2">
                                    {val?.nextFollowUpOn !== undefined &&
                                      dayjs(val?.nextFollowUpOn).format('MM-DD-YYYY h:mm A')}
                                  </div>
                                </div>
                              </div>
                            )}

                            <div className="flex justify-end">
                              {/* {selectedDate !== undefined && ( */}
                              <span>
                                <Dropdown
                                  getPopupContainer={(node) => node.parentNode}
                                  placement="bottomLeft"
                                  arrow
                                  overlay={
                                    <Menu className="not-italic">
                                      {val?.nextFollowUpOn !== undefined && (
                                        <Menu.Item
                                          onClick={() => {
                                            editFollowUps(val);
                                          }}
                                        >
                                          Edit
                                        </Menu.Item>
                                      )}
                                      <Menu.Item onClick={() => DeleteLeadFollowUps(val?.id)}>
                                        Delete
                                      </Menu.Item>
                                    </Menu>
                                  }
                                >
                                  <MoreOutlined className="text-lg cursor-pointer hover:text-yellow-600 " />
                                </Dropdown>
                              </span>
                              {/* )} */}
                            </div>
                          </div>

                          <div className="flex justify-between mx-2 mt-8 mb-2">
                            <div className="text-yellow-500 text-md font-bold">
                              Remarks :{' '}
                              <span className="text-gray-500 font-semibold">{val?.notes}</span>
                            </div>
                            <div className="flex items-center">
                              <div className=" border-r pr-2 ">
                                <Tooltip title="Language teacher | Teaching | BO-Kapurthala">
                                  <div className="flex">
                                    <div className="flex justify-center items-center ">
                                      <Avatar
                                        size="small"
                                        style={{ backgroundColor: '#3162A5' }}
                                        icon={
                                          <div className="-mt-1">
                                            <UserOutlined />
                                          </div>
                                        }
                                      />
                                    </div>

                                    <div className="text-yellow-500 font-bold ml-2 text-md">
                                      Created by :
                                    </div>
                                    <div className="text-gray-500 text-md ml-2 font-semibold">
                                      {val?.createdBy?.displayName}
                                    </div>
                                  </div>
                                </Tooltip>
                              </div>
                              <Tooltip title="Current action">
                                <div className="text-lg  ml-2  text-gray-700 ">
                                  {val?.currentActionMode !== undefined &&
                                    switchCaseForCurrentAction(val?.currentActionMode)?.icon}
                                </div>
                              </Tooltip>
                              <Tooltip title="Next action">
                                <div className="text-lg  ml-2 text-gray-700">
                                  {val?.nextFollowUpOn !== undefined &&
                                    switchCaseForNextAction(val?.nextActionMode)?.icon}
                                </div>
                              </Tooltip>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </CheckValidation>
            </TabPane>
          ))}
        </Tabs>
      </Spin>
      <AddLeadFollowUps
        addFollowUpsModal={addFollowUpsModal}
        setAddFollowUpsModal={setAddFollowUpsModal}
        getLeadFollowUpRecord={getLeadFollowUpRecord}
        setIsInterested={setIsInterested}
        isInterested={isInterested}
        addFollowUpsForm={addFollowUpsForm}
        assignee={assignee}
        setAssignee={setAssignee}
        editFollowUp={editFollowUp}
        setEditFollowUp={setEditFollowUp}
        singleGetFollowUp={singleGetFollowUp}
        setNextAction={setNextAction}
        nextAction={nextAction}
      />
    </div>
  );
};

export default connect(({ leads, loading, user }) => ({
  getLeadFollowUp: leads?.getLeadFollowUp,
  getAllFollowUpLoading: loading?.effects['leads/getLeadFollowUp'],
  currentUser: user?.currentUser,
}))(LeadFollowUps);
