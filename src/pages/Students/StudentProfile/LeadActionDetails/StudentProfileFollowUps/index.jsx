import React, { useState, useEffect } from 'react';
import {
  Select,
  DatePicker,
  Input,
  Divider,
  Tabs,
  Tooltip,
  Avatar,
  Button,
  Form,
  message,
  Spin,
  Dropdown,
  Menu,
} from 'antd';
import moment from 'moment';
import { debounce } from 'lodash';
import { connect, useParams, history } from 'umi';
import { MoreOutlined, UserOutlined } from '@ant-design/icons';
import AppIcons from '@/utils/AppIcons';
import dayjs from 'dayjs';
import ModalToAddFollowUps from './ModalToAddFollowUps';

const StudentProfileFollowUps = ({
  dispatch,
  followUpDetails,
  followUpsCounts,
  editLead,
  loadingFollowUp,
  currentUser,
}) => {
  const [activityType, setActivityType] = useState(undefined);
  const [isInterested, setIsInterested] = useState(true);
  const { studentId, tabname, tabs } = useParams();
  const [keyword, setKeyword] = useState('');
  const [assignee, setAssignee] = useState(false);
  const [selectedDate, setSelectedDate] = useState(undefined);
  const [range, setRange] = useState([moment().subtract(7, 'day'), moment()]);
  const [tab, setTab] = useState(tabs);
  const [nextAction, setNextAction] = useState('');
  const { Option } = Select;
  const { Search } = Input;
  const { RangePicker } = DatePicker;
  const { TabPane } = Tabs;

  const [form] = Form.useForm();

  const action = (value) => {
    setKeyword(value);
  };

  const debounceSearch = debounce(action, 400);
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

  const getFollowUpRecord = () => {
    const data = {};

    switch (tab) {
      case 'scheduled':
        data.status = 'scheduled';
        history.push('?status=scheduled');
        break;
      case 'today':
        data.status = 'today';
        history.push('?status=today');
        break;
      case 'completed':
        data.status = 'COMPLETED';
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

    switch (activityType) {
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

    if (keyword) {
      data.keyword = keyword;
    } else {
      delete data.keyword;
    }

    const payload = {
      pathParams: { leadId: studentId },

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
        followUpFor: 'STUDENT',
        viewSize: 1000,
      },
    };
    dispatch({
      type: 'student/getFollowUps',
      payload,
    });
    dispatch({
      type: 'student/getFollowUpsCounts',
      payload,
    });
  };

  useEffect(() => {
    getFollowUpRecord();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, range, tab, studentId, tabname, activityType, keyword]);

  const DeleteFollowUps = (id) => {
    const payload = {
      pathParams: { studentId, followUpId: id },
    };
    dispatch({
      type: 'student/deleteFollowUps',
      payload,
    }).then((res) => {
      if (res?.status === 'ok') {
        message.success('Follow up deleted successfully');
        getFollowUpRecord();
      } else {
        message.error('Something went wrong');
      }
    });
  };
  const tabsPane = [
    {
      tab: `All (${followUpsCounts?.status === 'ok' ? followUpsCounts?.taskStats?.allTask : '0'})`,
      key: 'all',
    },
    {
      tab: `Scheduled (${
        followUpsCounts?.status === 'ok' ? followUpsCounts?.taskStats?.scheduleTask : '0'
      })`,
      key: 'scheduled',
    },
    {
      tab: `Today's (${
        followUpsCounts?.status === 'ok' ? followUpsCounts?.taskStats?.todayTask : '0'
      })`,
      key: 'today',
    },
    {
      tab: `Completed (${
        followUpsCounts?.status === 'ok' ? followUpsCounts?.taskStats?.completedTask : '0'
      })`,
      key: 'completed',
    },
    {
      tab: `Overdue (${
        followUpsCounts?.status === 'ok' ? followUpsCounts?.taskStats?.overDueTask : '0'
      })`,
      key: 'overdue',
    },
  ];

  const AddFollowUp = (id) => {
    dispatch({
      type: 'leads/setStates',
      payload: {
        visible: true,
        type: null,
        title: null,
        subTitle: 'Add note',
        leadId: studentId,
        rec: null,
        followUpId: id,
        purposeFor: 'studentsFollowUp',
      },
      key: 'editLead',
    });
  };

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
  const onCommentFinish = (value) => {
    // eslint-disable-next-line no-console
    const data = {
      ...value,

      department: {
        id: value?.selectDepartment || '',
        members: value?.selectAssign?.map((item) => {
          return { id: item };
        }) || [{ id: '' }],
      },
      nextFollowUpOn: value?.nextFollowUpOn?.toISOString(),
      roleTypeId: list?.find((val) => val?.value === value?.followUpBy?.id)?.name,
    };

    if (value.currentActionMode === 'WEPT_TASK_PHONE_CALL') {
      data.phoneLogStatus = value?.phoneStatus;
    }

    if (value.currentActionMode === 'WEPT_TASK_MEETING') {
      data.meetingLogStatus = value?.meetingStatus;
    }

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

    if (editLead?.followUpId) {
      dispatch({
        type: 'leads/updateFollowUp',
        payload: {
          body: data,
          pathParams: {
            leadId: editLead?.leadId,
            followUpId: editLead?.followUpId,
          },
          query: { isInterested },
        },
      }).then((res) => {
        if (res?.status === 'ok') {
          message.success('Follow up is updated successfully');
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

          setActivityType(form.getFieldValue('currentActionMode'));
          setAssignee(false);
          setIsInterested(true);
          history.push(`/students/${editLead?.leadId}/follow-up`);
          setTab(tabsPane[0]?.key);
          setSelectedDate('Today');
          getFollowUpRecord();
          form.resetFields();
          setNextAction('');
        } else {
          message.error('Something went wrong');
        }
      });
    } else {
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

          setActivityType(form.getFieldValue('currentActionMode'));
          setAssignee(false);
          setIsInterested(true);
          history.push(`/students/${editLead?.leadId}/follow-up`);
          setTab(tabsPane[0]?.key);
          setSelectedDate('Today');
          getFollowUpRecord();
          form.resetFields();
          setNextAction('');
        } else {
          message.error('Something went wrong');
        }
      });
    }
  };

  return (
    <Form form={form} onFinish={onCommentFinish} hideRequiredMark>
      <div>
        <div className="flex justify-between">
          <div className="text-blue-600 font-semibold text-lg">Follow ups</div>
          <div className="flex justify-between">
            <Button
              style={{
                backgroundColor: 'rgb(27, 86, 143)',
                border: 'none',
                height: '30px',
                width: '30px',
                marginRight: '30px',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
              }}
              className="hover:bg-sky-700"
              shape="circle"
              icon={
                <svg
                  viewBox="64 64 896 896"
                  focusable="false"
                  data-icon="plus"
                  width="1em"
                  height="1em"
                  fill="currentColor"
                  aria-hidden="true"
                  style={{ fontSize: '1.2rem', color: '#fff' }}
                  className="ml-1.5 mt-0.5 "
                >
                  <defs>
                    <style></style>
                  </defs>
                  <path d="M482 152h60q8 0 8 8v704q0 8-8 8h-60q-8 0-8-8V160q0-8 8-8z"></path>
                  <path d="M176 474h672q8 0 8 8v60q0 8-8 8H176q-8 0-8-8v-60q0-8 8-8z"></path>
                </svg>
              }
              onClick={() => AddFollowUp()}
            />

            <div className="rounded-2xl mx-2">
              <Search
                style={{ width: '12rem' }}
                size="middle"
                placeholder="Enter keyword to search"
                onChange={(value) => debounceSearch(value?.target?.value)}
                enterButton
              />
            </div>
            <div className="mr-4">
              <Select
                style={{ width: '12rem' }}
                value={activityType}
                placeholder="Activity list"
                onChange={(value) => setActivityType(value)}
              >
                {ActivityList?.map((item) => (
                  <Option key={item?.id} value={item?.value}>
                    {item?.label}
                  </Option>
                ))}
              </Select>
            </div>

            <div className="flex justify-between">
              <div className="mr-2">
                <Select
                  style={{ width: '12rem', color: '#3B82F6' }}
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
                      style={{ color: '#3B82F6', width: '100%', overflow: 'hidden' }}
                    >
                      {item?.label}
                    </Option>
                  ))}
                </Select>
              </div>
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

        <Spin spinning={Boolean(studentId) && loadingFollowUp}>
          <Form.Item name="tabs">
            <Tabs
              defaultActiveKey="all"
              activeKey={tabs}
              onChange={(val) => {
                setTab(val);
                history.push(`/students/${studentId}/${tabname}/${val}`);
              }}
              className="font-semibold text-blue-500"
            >
              <Divider style={{ marginTop: '0.6rem' }} />
              {tabsPane?.map((item) => (
                <TabPane
                  tab={item?.tab}
                  key={item?.key}
                  style={{ marginBottom: ' 2.5rem', overflow: 'auto', padding: '11px' }}
                >
                  {followUpDetails?.map((val) => (
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
                              {selectedDate !== undefined && (
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
                                              AddFollowUp(val?.id);
                                              form.setFieldsValue({
                                                currentActionMode: val?.currentModeId,
                                                nextActionMode: val?.nextModeId,
                                                notes: val?.notes,
                                                nextFollowUpOn: moment(val?.nextFollowUpOn),
                                              });

                                              if (Object.keys(val)?.includes('department')) {
                                                setAssignee(true);
                                              }

                                              if (val?.department?.id) {
                                                dispatch({
                                                  type: 'staff/getDepartmentStaffList',
                                                  payload: {
                                                    pathParams: { depId: val?.department?.id },
                                                  },
                                                });
                                              }
                                              setNextAction(val?.currentModeId);
                                              form.setFieldsValue({
                                                followUpBy: {
                                                  id:
                                                    val?.roleTypeId &&
                                                    editLead.leadId &&
                                                    list?.find(
                                                      (value) => value?.name === val?.roleTypeId,
                                                    )?.value,
                                                },
                                                lastStatus: val?.lastStatus
                                                  ? val?.lastStatus
                                                  : undefined,
                                                branch: {
                                                  id: val?.branch?.id ? val?.branch?.id : undefined,
                                                },
                                                selectDepartment: val?.department?.id
                                                  ? val?.department?.id
                                                  : undefined,
                                                selectAssign:
                                                  val?.department?.members?.length > 0
                                                    ? val?.department?.members?.map(
                                                        (items) => items?.id,
                                                      )
                                                    : undefined,
                                                currentActionMode: val?.currentModeId,
                                                nextActionMode: val?.nextModeId,
                                                isInterested: val?.lastFollowUpBy?.isInterested,
                                                comment: val?.lastFollowUpBy?.comment,
                                                feedBackType: val?.lastFollowUpBy?.feedBackType,
                                                phoneStatus:
                                                  val?.currentModeId === 'WEPT_TASK_PHONE_CALL'
                                                    ? val.phoneLogStatus
                                                    : undefined,
                                                meetingStatus:
                                                  val?.currentModeId === 'WEPT_TASK_MEETING'
                                                    ? val.meetingLogStatus
                                                    : undefined,
                                              });

                                              setIsInterested(val?.isInterested);
                                            }}
                                          >
                                            Edit
                                          </Menu.Item>
                                        )}
                                        <Menu.Item onClick={() => DeleteFollowUps(val?.id)}>
                                          Delete
                                        </Menu.Item>
                                      </Menu>
                                    }
                                  >
                                    <MoreOutlined className="text-lg cursor-pointer hover:text-yellow-600 " />
                                  </Dropdown>
                                </span>
                              )}
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
                                      {val?.followUpBy?.displayName}
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
                </TabPane>
              ))}
            </Tabs>
          </Form.Item>
        </Spin>

        <ModalToAddFollowUps
          getFollowUpRecord={getFollowUpRecord}
          setTab={setTab}
          setSelectedDate={setSelectedDate}
          tabsPane={tabsPane}
          assignee={assignee}
          setAssignee={setAssignee}
          isInterested={isInterested}
          setIsInterested={setIsInterested}
          form={form}
          nextAction={nextAction}
          setNextAction={setNextAction}
          list={list}
        />
      </div>
    </Form>
  );
};

export default connect(({ student, loading, leads, user }) => ({
  followUpDetails: student?.followUpDetails,
  loadingFollowUp: loading?.effects['student/getFollowUps'],
  followUpsCounts: student?.followUpsCounts,
  editLead: leads?.editLead,
  currentUser: user.currentUser,
}))(StudentProfileFollowUps);
