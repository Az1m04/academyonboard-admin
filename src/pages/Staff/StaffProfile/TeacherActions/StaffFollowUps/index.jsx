import React, { useEffect, useState } from 'react';
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
  Dropdown,
  Menu,
  Spin,
  message,
} from 'antd';
import moment from 'moment';
import { debounce } from 'lodash';
import { connect } from 'umi';
import { useParams } from 'umi';
import { MoreOutlined, UserOutlined } from '@ant-design/icons';
import AppIcons from '@/utils/AppIcons';
import CheckValidation from '@/components/CheckValidation';
import emptyStateSvg from '@/assets/icons/space-empty.svg';
import EmptyState from '@/components/EmptyState';
import ModalToAddStaffFollowUps from './ModalToAddStaffFollowUps';
import { getInitials } from '@/utils/common';

const StaffFollowUps = ({
  dispatch,
  studentsList,
  staffFollowUpsList,
  loading,
  createLoading,
  updateLoading,
  listLoading,
  deleteLoading,
}) => {
  const [form] = Form.useForm();
  const { staffId } = useParams();
  const [activityType, setActivityType] = useState();
  const [isFolowUpsModalVisible, setIsFolowUpsModalVisible] = useState(false);
  const [keyword, setKeyword] = useState();
  const [selectedDate, setSelectedDate] = useState(undefined);
  const [range, setRange] = useState([moment().subtract(7, 'day'), moment()]);
  const [tab, setTab] = useState('all');
  const [nextAction, setNextAction] = useState('');
  const [editFollowUp, setEditFollowUp] = useState();
  const { Search } = Input;
  const { RangePicker } = DatePicker;
  const { TabPane } = Tabs;
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
  const getStudentsData = () => {
    dispatch({
      type: 'staff/getStudentsList',
      payload: {
        pathParams: {
          staffId,
        },
        query: { veiwSize: 10000 },
      },
    });
  };
  const getStaffFollowUpsList = (status, actionType, search) => {
    dispatch({
      type: 'staff/getStaffFollowUps',
      payload: {
        pathParams: {
          staffId,
        },
        query: {
          veiwSize: 1000,
          status,
          keyword: search,
          action: actionType,
          startDay:
            selectedDate === 'Custom' && range !== null
              ? range[0]?.format('YYYY-MM-DD HH:mm:ss')
              : activityTimeList?.filter((p) => p?.label === selectedDate)[0]?.startDate,
          endDay:
            selectedDate === 'Custom' && range !== null
              ? range[1]?.format('YYYY-MM-DD HH:mm:ss')
              : activityTimeList?.filter((p) => p?.label === selectedDate)[0]?.endDate,
        },
      },
    });
  };
  const createStaffFollowUps = (values) => {
    const body = {
      followUpBy: values?.followUpBy,
      notes: values?.notes,
      lastStatus: values?.lastStatus,
      currentActionMode: values?.currentActionMode,
      nextActionMode: values?.nextActionMode,
      nextFollowUpOn: values?.nextFollowUpOn && values?.nextFollowUpOn?.toISOString(),
      phoneStatus: values?.phoneStatus && values?.phoneStatus,
      meetingLogStatus: values?.meetingLogStatus && values?.meetingLogStatus,
    };
    dispatch({
      type: 'staff/staffFollowUps',
      payload: {
        pathParams: {
          staffId,
        },
        body,
      },
    })
      .then((res) => {
        if (res?.responseMessage === 'success') {
          getStaffFollowUpsList(tab, '', '');
          setIsFolowUpsModalVisible(false);
          form.resetFields();
          message.success('Follow up add successfully');
        }
      })
      .catch((err) => {
        if (err) {
          message.error('Something went wrong');
        }
      });
  };
  const updateFollowUp = (values) => {
    const body = {
      followUpBy: values?.followUpBy,
      notes: values?.notes,
      lastStatus: values?.lastStatus,
      currentActionMode: values?.currentActionMode,
      nextActionMode: values?.nextActionMode,
      nextFollowUpOn: values?.nextFollowUpOn && values?.nextFollowUpOn?.toISOString(),
      phoneStatus: values?.phoneStatus && values?.phoneStatus,
      meetingLogStatus: values?.meetingLogStatus && values?.meetingLogStatus,
    };
    dispatch({
      type: 'staff/updateStaffFollowUps',
      payload: {
        pathParams: {
          staffId,
          followUpId: editFollowUp,
        },
        body,
      },
    })
      .then((res) => {
        if (res?.responseMessage === 'success') {
          getStaffFollowUpsList(tab, activityType, keyword);
          setIsFolowUpsModalVisible(false);
          message.success('Follow up update successfully');
        }
      })
      .catch((err) => {
        if (err) {
          message.error('Something went wrong');
        }
      });
  };
  const DeleteFollowUps = (id) => {
    const payload = {
      pathParams: { staffId, followUpId: id },
    };
    dispatch({
      type: 'staff/deleteStaffFollowUps',
      payload,
    })
      .then((res) => {
        if (res?.responseMessage === 'success') {
          message.success('Follow up deleted successfully');
          getStaffFollowUpsList(tab, activityType, keyword);
        }
      })
      .catch((err) => {
        if (err) {
          message.error('Something went wrong');
        }
      });
  };
  useEffect(() => {
    getStaffFollowUpsList(tab, activityType, keyword);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, activityType, selectedDate, range, keyword]);
  useEffect(() => {
    if (isFolowUpsModalVisible) {
      getStudentsData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFolowUpsModalVisible]);
  const tabsPane = [
    {
      tab: `All `,
      key: 'all',
    },
    {
      tab: `Scheduled ()`,
      key: 'scheduled',
    },
    {
      tab: `Today's ()`,
      key: 'today',
    },
    {
      tab: `Completed ()`,
      key: 'completed',
    },
    {
      tab: `Overdue ()`,
      key: 'overdue',
    },
  ];
  return (
    <div>
      <div>
        <Spin spinning={Boolean(listLoading) || Boolean(deleteLoading)}>
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
                onClick={() => setIsFolowUpsModalVisible(true)}
              />

              <div className="rounded-2xl mx-2">
                <Search
                  style={{ width: '12rem' }}
                  size="middle"
                  placeholder="Enter keyword to search"
                  allowClear
                  onChange={(value) => debounceSearch(value?.target?.value)}
                  enterButton
                />
              </div>
              <div className="mr-4">
                <Select
                  style={{ width: '12rem' }}
                  value={activityType}
                  placeholder="Activity list"
                  allowClear
                  onChange={(value) => setActivityType(value)}
                >
                  {ActivityList?.map((item) => (
                    <Select.Option key={item?.id} value={item?.value}>
                      {item?.label}
                    </Select.Option>
                  ))}
                </Select>
              </div>
              <div className="flex justify-between mr-2">
                <div className="mr-2">
                  <Select
                    style={{ width: '12rem', color: '#3B82F6' }}
                    value={selectedDate}
                    allowClear
                    onChange={(value) => {
                      setSelectedDate(value);
                      setRange([moment().subtract(7, 'day'), moment()]);
                    }}
                    placeholder="Select time filter"
                    listHeight={400}
                    getPopupContainer={(node) => node.parentNode}
                  >
                    {activityTimeList?.map((item) => (
                      <Select.Option
                        key={item?.id}
                        value={item?.label}
                        className="bg-gray-100 mx-2 rounded-lg mt-2"
                        style={{ color: '#3B82F6', overflow: 'hidden' }}
                      >
                        {item?.label}
                      </Select.Option>
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
                style={{ height: '38rem', overflow: 'auto', padding: '11px' }}
              >
                <CheckValidation
                  show={staffFollowUpsList?.length > 0}
                  fallback={
                    <EmptyState
                      emptyState={emptyStateSvg}
                      emptyHeaderText={<span>No follow ups found yet</span>}
                    />
                  }
                >
                  {staffFollowUpsList?.map((val) => (
                    <div key={item?.id}>
                      <div className="flex  h-full  my-4 mr-2 shadow-md rounded-r-lg">
                        <div
                          className={`${val?.taskStatus === 'Scheduled' && 'bg-yellow-500'} ${
                            val?.taskStatus === 'Overdue' && 'bg-red-500'
                          } ${val?.taskStatus === 'Completed' && 'bg-green-500'} ${
                            val?.taskStatus === 'Today' && 'bg-blue-500'
                          } ${
                            val?.taskStatus === 'Task assigned' && 'bg-blue-500'
                          } w-2 rounded-l-lg `}
                        />
                        <div className="border rounded-r-lg w-full">
                          <div className="flex items-center mx-2 my-2 justify-between">
                            {tab === 'all' && (
                              <div className=" flex space-x-20  w-full">
                                <div className="w-1/3">
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
                                    <div className="flex text-md">
                                      <div className="border-r text-green-500 font-semibold ml-14   ">
                                        {moment(val?.createdDate).format('MM-DD-YYYY')}
                                        <span className="border-l pl-2 mx-2">
                                          {moment(val?.createdDate).format('h:mm A')}
                                        </span>
                                      </div>
                                      <div className="text-gray-500 font-semibold pl-2">
                                        {val?.taskStatus}
                                      </div>
                                    </div>
                                  </Tooltip>
                                </div>

                                {val?.nextFollowUpOn !== undefined && val?.nextActionMode && (
                                  <div className="border-l w-1/2">
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
                                        <div className="flex -mt- text-md">
                                          <div className=" text-green-500 font-semibold ml-14 ">
                                            {moment(val?.nextFollowUpOn).format('MM-DD-YYYY')}

                                            <span className="border-l pl-2 ml-2">
                                              {moment(val?.nextFollowUpOn).format('h:mm A')}
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
                                      moment(val?.nextFollowUpOn).format('MM-DD-YYYY h:mm A')}
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
                                    {moment(val?.createdDate).format('MM-DD-YYYY h:mm A')}
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
                                    {moment(val?.createdDate).format('MM-DD-YYYY h:mm A')}
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
                                      moment(val?.nextFollowUpOn).format('MM-DD-YYYY h:mm A')}
                                  </div>
                                </div>
                              </div>
                            )}

                            <div className="flex justify-end">
                              <span>
                                <Dropdown
                                  getPopupContainer={(node) => node.parentNode}
                                  placement="bottomLeft"
                                  arrow
                                  trigger={['click']}
                                  overlay={
                                    <Menu className="not-italic">
                                      {val?.nextFollowUpOn !== undefined && (
                                        <Menu.Item
                                          onClick={() => {
                                            dispatch({
                                              type: 'staff/getStudentsList',
                                              payload: {
                                                pathParams: {
                                                  staffId,
                                                },
                                                query: { veiwSize: 10000 },
                                              },
                                            });
                                            form.setFieldsValue({
                                              followUpBy: { id: val?.followUpBy?.id },
                                              currentActionMode: val?.currentModeId,
                                              nextActionMode: val?.nextModeId,
                                              notes: val?.notes,
                                              nextFollowUpOn: moment(val?.nextFollowUpOn),
                                              lastStatus: val?.lastStatus,
                                            });
                                            setIsFolowUpsModalVisible(true);
                                            setNextAction(val?.currentModeId);
                                            setEditFollowUp(val?.id);
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
                                  <Tooltip title="Quick actions">
                                    <MoreOutlined className="text-lg cursor-pointer hover:text-yellow-600 " />
                                  </Tooltip>
                                </Dropdown>
                              </span>
                            </div>
                          </div>

                          <div className="flex justify-between mx-2 mt-8 mb-2">
                            <div className="text-yellow-500 text-md font-bold">
                              Remarks :
                              <span className="text-gray-500 font-semibold">{val?.notes}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex">
                                <div className="text-yellow-500 font-bold mr-2 text-md">
                                  Created for :
                                </div>
                                <div className="flex justify-center items-center ">
                                  {val?.followUpBy?.photoUrl ? (
                                    <div>
                                      <img
                                        src={val?.followUpBy?.photoUrl}
                                        alt=""
                                        className="rounded-full w-8 h-8"
                                      />
                                    </div>
                                  ) : (
                                    <Avatar
                                      className="uppercase text-gray-900 font-medium"
                                      size="small"
                                    >
                                      <p className="text-gray-900 text-xs pt-1">
                                        {val?.followUpBy?.displayName &&
                                          getInitials(val?.followUpBy?.displayName)}
                                      </p>
                                    </Avatar>
                                  )}
                                </div>
                                <div className="text-gray-500 text-md ml-2 mt-0.5 font-semibold">
                                  {val?.followUpBy?.displayName}
                                </div>
                              </div>
                              <div className=" border-r pr-2 ">
                                <Tooltip title="Language teacher | Teaching | BO-Kapurthala">
                                  <div className="flex">
                                    <div className="text-yellow-500 font-bold mr-2 text-md">
                                      Created by :
                                    </div>
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
                                    <div className="text-gray-500 text-md ml-2 mt-0.5 font-semibold">
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

          <ModalToAddStaffFollowUps
            studentsList={studentsList}
            isFolowUpsModalVisible={isFolowUpsModalVisible}
            setIsFolowUpsModalVisible={setIsFolowUpsModalVisible}
            form={form}
            editFollowUp={editFollowUp}
            setEditFollowUp={setEditFollowUp}
            loading={loading}
            nextAction={nextAction}
            setNextAction={setNextAction}
            createStaffFollowUps={createStaffFollowUps}
            createLoading={createLoading}
            updateFollowUp={updateFollowUp}
            updateLoading={updateLoading}
          />
        </Spin>
      </div>
    </div>
  );
};
export default connect(({ staff, loading }) => ({
  loading: loading.effects['staff/getStudentsList'],
  listLoading: loading.effects['staff/getStaffFollowUps'],
  createLoading: loading.effects['staff/staffFollowUps'],
  updateLoading: loading.effects['staff/updateStaffFollowUps'],
  deleteLoading: loading.effects['staff/deleteStaffFollowUps'],
  studentsList: staff?.getStudentsList,
  staffFollowUpsList: staff?.staffFollowUpsList,
}))(StaffFollowUps);
