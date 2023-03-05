import React, { useEffect, useState } from 'react';
import Page from '@/components/Page';
import {
  Tooltip,
  Button,
  Avatar,
  Tabs,
  Input,
  Badge,
  Table,
  Radio,
  Popover,
  Popconfirm,
  message,
  Row,
  Pagination,
} from 'antd';
import { connect, history, useParams } from 'umi';
import { getInitials } from '@/utils/common';
import AddTaskModal from '@/components/AddTaskModal';
import moment from 'moment';
import styles from './index.less';
import {
  AuditOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import emptyStateSvg from '@/assets/icons/space-empty.svg';
import { debounce } from 'lodash';
import CheckValidation from '@/components/CheckValidation';
import TaskQuickActions from './TaskQuickActions';
import AppIcons from '@/utils/AppIcons';

const { TabPane } = Tabs;
const { Search } = Input;
const Tasks = ({
  dispatch,
  tasksList,
  loading,
  taskTypeCounts,
  deleteLoading,
  followUpInTasksList,
  loadingEventsTask,
}) => {
  const { tabName } = useParams();
  const [subListFilter, setSubListFilter] = useState('ALL');
  const [leadType, setLeadType] = useState('LEAD');
  const [searchStudentBy, setSearchStudentBy] = useState('COURSES');
  const [keyword, setKeyword] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [viewSize, setViewSize] = useState(10);
  const [taskKeyword, setTaskKeyword] = useState();
  const [taskId, setTaskId] = useState();
  const [mode, setMode] = useState(tabName?.toUpperCase() || 'DAILY');
  const [startIndex, setStartIndex] = useState(0);

  const menuList = [
    {
      title: 'Change priority',
      key: 'change-priority',
      edit: 'change-priority',
      historyPush: `/tasks/${mode.toLowerCase()}/${taskId}/edit/${'change-priority'}`,
    },
    {
      title: 'Assign to other',
      key: 'assign-to-other',
      historyPush: `/tasks/${mode.toLowerCase()}/${taskId}/edit/${'assign-to-other'}`,
    },
    {
      title: 'Escalate task',
      key: 'escalate-task',
      historyPush: `/tasks/${mode.toLowerCase()}/${taskId}/edit/${'escalate-task'}`,
    },
    {
      title: 'Mark as completed',
      key: 'mark-as-completed',
      historyPush: `/tasks/${mode.toLowerCase()}/${taskId}/edit/${'mark-as-completed'}`,
    },
    {
      title: 'Add follow up',
      key: 'add-follow-up',
      historyPush: `/tasks/${mode.toLowerCase()}/${taskId}/edit/${'add-follow-up'}`,
    },
    {
      title: 'Mark as in process',
      key: 'mark-as-in-process',
      historyPush: `/tasks/${mode.toLowerCase()}/${taskId}/edit/${'mark-as-in-process'}`,
    },
    {
      title: 'Activity logs',
      key: 'activity-logs',
      historyPush: `/tasks/${mode.toLowerCase()}/${taskId}/edit/${'activity-logs'}`,
    },
  ];
  const quickActions = (
    <div
      style={{ padding: '0px' }}
      className="bg-white flex flex-col"
      onClick={(e) => e.stopPropagation()}
    >
      {menuList?.map((item) => (
        <a
          className="text-gray-900 hover:text-yellow-500 hover:bg-gray-50 px-4 py-2.5 border-b w-48 "
          key={item?.key}
          onClick={(e) => {
            e.stopPropagation();
            history.push(item?.historyPush || '/tasks');
          }}
        >
          {item?.title}
        </a>
      ))}
    </div>
  );
  const quickActionsInProcess = (
    <div style={{ padding: '0px' }} className="bg-white flex flex-col">
      {menuList
        ?.filter((item) => item?.key === 'mark-as-completed' || item?.key === 'activity-logs')
        ?.map((item) => (
          <a
            className="text-gray-900 hover:text-yellow-500 hover:bg-gray-50 px-4 py-2.5 border-b w-48"
            key={item?.key}
            onClick={(e) => {
              e.stopPropagation();
              history.push(item?.historyPush || '/tasks');
            }}
          >
            {item?.title}
          </a>
        ))}
    </div>
  );
  const getAllTasksList = (start, size, keywordName, taskTypeId, statusId) => {
    dispatch({
      type: 'tasks/getTasksList',
      payload: {
        query: {
          startIndex: start,
          keyword: keywordName,
          taskTypeId,
          statusId,
          viewSize: size,
        },
      },
    });
  };
  const getAllFollowups = (start, size, keywordName) => {
    dispatch({
      type: 'tasks/getFollowUpInTask',
      payload: {
        query: {
          startIndex: start,
          keyword: keywordName,
          viewSize: size,
        },
      },
    });
  };
  const getTasksCounts = () => {
    dispatch({
      type: 'tasks/getTaskCounts',
      payload: {
        viewSize: 10000,
      },
    });
  };
  const listFilter = [
    {
      title: (
        <Badge
          count={taskTypeCounts?.taskStats?.TODAY?.todayCount}
          size="small"
          style={{
            fontSize: '10px',
            marginTop: '3px',
            backgroundColor: '#f59e0b',
            padding: '0px 4px 0px 4px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            width: '28px',
          }}
        >
          <p className="pt-2.5 pr-3 m-0">Today</p>
        </Badge>
      ),
      key: 'TODAY',
    },
    {
      title: (
        <Badge
          count={taskTypeCounts?.taskStats?.DAILY?.dailyCount}
          size="small"
          style={{
            fontSize: '10px',
            marginTop: '3px',
            backgroundColor: '#f59e0b',
            padding: '0px 4px 0px 4px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            width: '28px',
          }}
        >
          <p className="pt-2.5 pr-3 m-0">Daily</p>
        </Badge>
      ),
      key: 'DAILY',
    },
    {
      title: (
        <Badge
          count={taskTypeCounts?.taskStats?.WEEKLY?.weeklyCount}
          size="small"
          style={{
            fontSize: '10px',
            marginTop: '3px',
            backgroundColor: '#f59e0b',
            padding: '0px 4px 0px 4px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            width: '28px',
          }}
        >
          <p className="pt-2.5 pr-3 m-0">Weekly</p>
        </Badge>
      ),
      key: 'WEEKLY',
    },
    {
      title: (
        <Badge
          count={taskTypeCounts?.taskStats?.MONTHLY?.monthlyCount}
          size="small"
          style={{
            fontSize: '10px',
            marginTop: '3px',
            backgroundColor: '#f59e0b',
            padding: '0px 4px 0px 4px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            width: '28px',
          }}
        >
          <p className="pt-2.5 pr-3 m-0">Monthy</p>
        </Badge>
      ),
      key: 'MONTHLY',
    },
    {
      title: (
        <Badge
          count={taskTypeCounts?.taskStats?.YEARLY?.yearlyCount}
          size="small"
          style={{
            fontSize: '10px',
            marginTop: '3px',
            backgroundColor: '#f59e0b',
            padding: '0px 4px 0px 4px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            width: '28px',
          }}
        >
          <p className="pt-2.5 pr-3 m-0">Yearly</p>
        </Badge>
      ),
      key: 'YEARLY',
    },
    {
      title: (
        <Badge
          count={taskTypeCounts?.taskStats?.EVENT?.eventCount}
          size="small"
          style={{
            fontSize: '10px',
            marginTop: '3px',
            backgroundColor: '#f59e0b',
            padding: '0px 4px 0px 4px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            width: '28px',
          }}
        >
          <p className="pt-2.5 pr-3 m-0">Events&Tasks</p>
        </Badge>
      ),
      key: 'EVENTS-TASKS',
    },
  ];
  const tabsFilter = [
    {
      title: (
        <Badge
          count={taskTypeCounts?.taskStats[mode?.toUpperCase()]?.[`${mode?.toLowerCase()}Count`]}
          size="small"
          style={{
            fontSize: '10px',
            marginTop: '12px',
            backgroundColor: '#f59e0b',
            padding: '0px 4px 0px 4px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            width: '28px',
          }}
        >
          <p className="  pr-2 mt-1 text-gray-900 font-medium mx-2">All</p>
        </Badge>
      ),
      emptyText: '',
      key: 'ALL',
    },
    {
      title: (
        <Badge
          count={taskTypeCounts?.taskStats[mode?.toUpperCase()]?.assignedTask}
          size="small"
          style={{
            fontSize: '10px',
            marginTop: '12px',
            backgroundColor: '#f59e0b',
            padding: '0px 4px 0px 4px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            width: '28px',
          }}
        >
          <p className="  pr-2 mt-1 text-gray-900 font-medium mx-3">Assigned</p>
        </Badge>
      ),
      key: 'TASK_CREATED',
      emptyText: 'assigned',
    },
    {
      title: (
        <Badge
          count={taskTypeCounts?.taskStats[mode?.toUpperCase()]?.inProcessTask}
          size="small"
          style={{
            fontSize: '10px',
            marginTop: '12px',
            backgroundColor: '#f59e0b',
            padding: '0px 4px 0px 4px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            width: '28px',
          }}
        >
          <p className="  pr-2 mt-1 text-gray-900 font-medium mx-2">In Process</p>
        </Badge>
      ),
      key: 'TASK_IN_PROGRESS',
      emptyText: 'in Process',
    },
    {
      title: (
        <Badge
          count={taskTypeCounts?.taskStats[mode?.toUpperCase()]?.completedTask}
          size="small"
          style={{
            fontSize: '10px',
            marginTop: '12px',
            backgroundColor: '#f59e0b',
            padding: '0px 4px 0px 4px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            width: '28px',
          }}
        >
          <p className="  pr-2 mt-1 text-gray-900 font-medium mx-2">Completed</p>
        </Badge>
      ),
      key: 'TASK_DONE',
      emptyText: 'completed',
    },
    {
      title: (
        <Badge
          count={taskTypeCounts?.taskStats[mode?.toUpperCase()]?.taskNotCompleted}
          size="small"
          style={{
            fontSize: '10px',
            marginTop: '12px',
            backgroundColor: '#f59e0b',
            padding: '0px 4px 0px 4px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            width: '28px',
          }}
        >
          <p className="  pr-2 mt-1 text-gray-900 font-medium mx-2">Not completed on time</p>
        </Badge>
      ),
      key: 'TASK_NOT_COMPLETED',
      emptyText: 'not completed on time',
    },
    {
      title: (
        <Badge
          count={taskTypeCounts?.taskStats[mode?.toUpperCase()]?.assignedTask}
          size="small"
          style={{
            fontSize: '10px',
            marginTop: '12px',
            backgroundColor: '#f59e0b',
            padding: '0px 4px 0px 4px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            width: '28px',
          }}
        >
          <p className="  pr-2 mt-1 text-gray-900 font-medium mx-2">Pending</p>
        </Badge>
      ),
      key: 'TASK_PENDING',
      emptyText: 'pending',
    },
    {
      title: (
        <Badge
          count={taskTypeCounts?.taskStats[mode?.toUpperCase()]?.reAssignedTask}
          size="small"
          style={{
            fontSize: '10px',
            marginTop: '12px',
            backgroundColor: '#f59e0b',
            padding: '0px 4px 0px 4px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            width: '28px',
          }}
        >
          <p className="  pr-2 mt-1 text-gray-900 font-medium mx-3">Re assigned</p>
        </Badge>
      ),
      key: 'TASK_RE_ASSIGNED',
      emptyText: 're assigned',
    },
    {
      title: (
        <Badge
          count={taskTypeCounts?.taskStats[mode?.toUpperCase()]?.escalatedTask}
          size="small"
          style={{
            fontSize: '10px',
            marginTop: '12px',
            backgroundColor: '#f59e0b',
            padding: '0px 4px 0px 4px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            width: '28px',
          }}
        >
          <p className="  pr-2 mt-1 text-gray-900 font-medium mx-3">Escalated</p>
        </Badge>
      ),
      key: 'TASK_ESCALATED',
      emptyText: 'escalated',
    },
    {
      title: (
        <Badge
          count={taskTypeCounts?.taskStats[mode?.toUpperCase()]?.overdueTask}
          size="small"
          style={{
            fontSize: '10px',
            marginTop: '12px',
            backgroundColor: '#f59e0b',
            padding: '0px 4px 0px 4px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            width: '28px',
          }}
        >
          <p className="  pr-2 mt-1 text-gray-900 font-medium mx-2">Overdue</p>
        </Badge>
      ),
      key: 'TASK_OVERDUE',
      emptyText: 'overdue',
    },
  ];
  const columns = [
    {
      title: 'Sr.no.',
      align: 'center',
      render: (_, __, index) => (
        <span className="text-gray-900 font-medium">
          {index + 1 + viewSize * (currentPage - 1)}
        </span>
      ),
    },

    {
      title: 'Description',
      key: 'work',
      align: 'left',
      width: '13rem',
      render: (_, record) => (
        <span className="flex gap-2 mt-2">
          <Tooltip title={record?.name}>
            <p
              className={` ${
                record?.students?.length > 0 ? 'w-10' : 'w-44'
              } font-medium text-gray-900 mt-1.5`}
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {record?.name}
            </p>
          </Tooltip>
          <span className="flex">
            <>
              <Avatar.Group
                maxCount={2}
                size="large"
                onClick={(e) => e.stopPropagation()}
                maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf', cursor: 'pointer' }}
              >
                {record?.students?.map((items) => (
                  <>
                    <Popover
                      key={items?.id}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      content={
                        <a
                          className="flex gap-2 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (items?.roleTypeId === 'LEAD_STUDENT') {
                              history.push('/leads/students/leads/all');
                            } else {
                              history.push(`/students/${items?.id}`);
                            }
                          }}
                        >
                          {items?.photoUrl !== undefined ? (
                            <Avatar src={items?.photoUrl} />
                          ) : (
                            <Avatar
                              className="uppercase font-medium"
                              style={{
                                backgroundColor: '#f56a00',
                              }}
                            >
                              {items?.displayName && getInitials(items?.displayName)}
                            </Avatar>
                          )}
                          <p className="mt-2 text-gray-900 font-medium">{items?.displayName}</p>
                        </a>
                      }
                    >
                      {items?.photoUrl !== undefined ? (
                        <Avatar
                          src={items?.photoUrl}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (items?.roleTypeId === 'LEAD_STUDENT') {
                              history.push('/leads/students/leads/all');
                            } else {
                              history.push(`/students/${items?.id}`);
                            }
                          }}
                          style={{ cursor: 'pointer' }}
                          size={35}
                        />
                      ) : (
                        <Avatar
                          className="uppercase font-medium"
                          style={{
                            backgroundColor: '#f56a00',
                            cursor: 'pointer',
                            fontSize: '11px',
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (items?.roleTypeId === 'LEAD_STUDENT') {
                              history.push('/leads/students/leads/all');
                            } else {
                              history.push(`/students/${items?.id}`);
                            }
                          }}
                          size={35}
                        >
                          {items?.displayName && getInitials(items?.displayName)}
                        </Avatar>
                      )}
                    </Popover>
                  </>
                ))}
              </Avatar.Group>
            </>
          </span>
        </span>
      ),
    },
    {
      title: 'Priority',
      key: 'Priority',
      align: 'left',
      render: (_, record) =>
        record?.priorityTypeId === 'LOW' ? (
          <span className="text-green-500 font-medium">Low</span>
        ) : (
          <span>
            {record?.priorityTypeId === 'MEDIUM' ? (
              <span className="text-yellow-500 font-medium">Medium</span>
            ) : (
              <span>
                {record?.priorityTypeId === 'HIGH' ? (
                  <span className="text-red-600 font-medium">High</span>
                ) : (
                  <span className="text-red-700 font-medium">Very high</span>
                )}
              </span>
            )}
          </span>
        ),
    },
    {
      title: 'Date',
      key: 'date',
      align: 'left',
      render: (_, record) => (
        <span className=" font-medium text-sm">{moment(record?.startDate).format('ll')}</span>
      ),
    },
    {
      title: 'Assigned By',
      key: 'assignedBy',
      align: 'center',
      width: 110,
      render: (_, record) => (
        <Popover
          content={<a className="text-black font-medium">{record?.assignedBy?.displayName}</a>}
        >
          <span className="flex gap-2 cursor-pointer mt-3 pl-5">
            {record?.assignedBy?.photoUrl !== undefined ? (
              <Avatar src={record?.assignedBy?.photoUrl} />
            ) : (
              <Avatar
                className="uppercase font-medium"
                style={{
                  backgroundColor: '#f56a00',
                  fontSize: '11px',
                }}
              >
                {record?.assignedBy?.displayName && getInitials(record?.assignedBy?.displayName)}
              </Avatar>
            )}
          </span>
        </Popover>
      ),
    },

    {
      title: 'Type of Work',
      key: 'taskTypeId',
      align: 'left',
      render: (_, record) => (
        <span className="text-gray-900 font-medium capitalize pt-3">
          {record?.repetitionType.toLowerCase()}
        </span>
      ),
    },

    {
      title: 'Due date',
      key: 'dueDate',
      align: 'center',
      render: (_, record) =>
        record?.dueDate === undefined ? (
          '--'
        ) : (
          <Popover
            content={
              record?.dueDate && (
                <span
                  className={`font-medium text-sm ${
                    subListFilter !== 'TASK_DONE'
                      ? moment(record?.dueDate).isBefore(moment()) && 'text-red-500'
                      : 'text-gray-900'
                  }`}
                >
                  Due {moment(record?.dueDate).fromNow()}
                </span>
              )
            }
          >
            <span
              className={`font-medium text-sm ${
                subListFilter !== 'TASK_DONE'
                  ? moment(record?.dueDate).isBefore(moment()) && 'text-red-500'
                  : 'text-gray-900'
              }`}
            >
              {record?.dueDate && moment(record?.dueDate).format('Do MMM h:mm a')}
            </span>
          </Popover>
        ),
    },
    {
      title: 'Actions',
      key: 'Actions',
      align: 'left',
      render: (_, record) => (
        <span className="flex gap-3">
          {record?.statusId === 'TASK_IN_PROGRESS' ||
          record?.statusId === 'TASK_DONE' ||
          record?.statusId === 'TASK_OVERDUE' ? null : (
            <a
              onClick={(e) => {
                e.stopPropagation();
                history.push(`/tasks/${record?.id}/edit`);
              }}
            >
              <Tooltip title="Edit task">
                {' '}
                <EditOutlined className="text-yellow-700" />
              </Tooltip>
            </a>
          )}
          <div onClick={(e) => e.stopPropagation()}>
            <Popconfirm
              title="Are you sure to delete this task?"
              onConfirm={(e) => {
                e.stopPropagation();
                dispatch({
                  type: 'tasks/removeTaskFromList',
                  payload: {
                    pathParams: {
                      taskId: record?.id,
                    },
                  },
                }).then((res) => {
                  if (res?.responseMessage === 'success') {
                    message.success('task deleted successfully');
                    const subFilter = subListFilter !== 'ALL' ? subListFilter : '';
                    getAllTasksList(startIndex, viewSize, '', mode, subFilter);
                    getTasksCounts();
                  } else {
                    message.error('Something went wrong');
                  }
                });
              }}
              okText="Delete"
              okType="danger"
              cancelText="No"
              onCancel={(e) => e.stopPropagation()}
            >
              <a className="text-red-600 hover:text-red-500" onClick={(e) => e.stopPropagation()}>
                <DeleteOutlined className=" text-red-600" />
              </a>
            </Popconfirm>
          </div>
          {record?.statusId === 'TASK_DONE' || record?.statusId === 'TASK_OVERDUE' ? null : (
            <Popover
              content={
                record?.statusId === 'TASK_IN_PROGRESS' ? quickActionsInProcess : quickActions
              }
              onClick={(e) => {
                e.stopPropagation();
              }}
              trigger={'click'}
              placement="bottomRight"
              overlayClassName={`${styles.customPopOver}`}
            >
              <Tooltip title="Quick actions">
                <a
                  className="text-gray-900"
                  onClick={(e) => {
                    setTaskId(record?.id);
                    e.stopPropagation();
                  }}
                >
                  <MoreOutlined className="text-gray-900 " />
                </a>
              </Tooltip>
            </Popover>
          )}
          {record?.statusId === 'TASK_DONE' || record?.statusId === 'TASK_OVERDUE' ? (
            <Tooltip title="view activities">
              <a
                className="text-blue-600 hover:text-blue-500"
                onClick={(e) => {
                  e.stopPropagation();
                  history.push(
                    `/tasks/${mode.toLowerCase()}/${record?.id}/edit/${'activity-logs'}`,
                  );
                }}
              >
                <AuditOutlined className=" text-blue-600" />
              </a>
            </Tooltip>
          ) : null}
        </span>
      ),
    },
  ];
  const AllColumn = [
    {
      title: 'Sr.no.',
      align: 'center',
      render: (_, __, index) => (
        <span className="text-gray-900 font-medium">
          {index + 1 + viewSize * (currentPage - 1)}
        </span>
      ),
    },

    {
      title: 'Description',
      key: 'work',
      align: 'left',
      width: '13rem',
      render: (_, record) => (
        <span className="flex gap-2 mt-2">
          <Tooltip title={record?.name}>
            <p
              className={` ${
                record?.students?.length > 0 ? 'w-10' : 'w-44'
              } font-medium text-gray-900 mt-1.5`}
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {record?.name}
            </p>
          </Tooltip>
          <span className="flex">
            <>
              <Avatar.Group
                maxCount={2}
                size="large"
                onClick={(e) => e.stopPropagation()}
                maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf', cursor: 'pointer' }}
              >
                {record?.students?.map((items) => (
                  <>
                    <Popover
                      key={items?.id}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      content={
                        <a
                          className="flex gap-2 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (items?.roleTypeId === 'LEAD_STUDENT') {
                              history.push('/leads/students/leads/all');
                            } else {
                              history.push(`/students/${items?.id}`);
                            }
                          }}
                        >
                          {items?.photoUrl !== undefined ? (
                            <Avatar src={items?.photoUrl} />
                          ) : (
                            <Avatar
                              className="uppercase font-medium"
                              style={{
                                backgroundColor: '#f56a00',
                              }}
                            >
                              {items?.displayName && getInitials(items?.displayName)}
                            </Avatar>
                          )}
                          <p className="mt-2 text-gray-900 font-medium">{items?.displayName}</p>
                        </a>
                      }
                    >
                      {items?.photoUrl !== undefined ? (
                        <Avatar
                          src={items?.photoUrl}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (items?.roleTypeId === 'LEAD_STUDENT') {
                              history.push('/leads/students/leads/all');
                            } else {
                              history.push(`/students/${items?.id}`);
                            }
                          }}
                          style={{ cursor: 'pointer' }}
                          size={35}
                        />
                      ) : (
                        <Avatar
                          className="uppercase font-medium"
                          style={{
                            backgroundColor: '#f56a00',
                            cursor: 'pointer',
                            fontSize: '11px',
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (items?.roleTypeId === 'LEAD_STUDENT') {
                              history.push('/leads/students/leads/all');
                            } else {
                              history.push(`/students/${items?.id}`);
                            }
                          }}
                          size={35}
                        >
                          {items?.displayName && getInitials(items?.displayName)}
                        </Avatar>
                      )}
                    </Popover>
                  </>
                ))}
              </Avatar.Group>
            </>
          </span>
        </span>
      ),
    },
    {
      title: 'Priority',
      key: 'Priority',
      align: 'left',
      render: (_, record) =>
        record?.priorityTypeId === 'LOW' ? (
          <span className="text-green-500 font-medium">Low</span>
        ) : (
          <span>
            {record?.priorityTypeId === 'MEDIUM' ? (
              <span className="text-yellow-500 font-medium">Medium</span>
            ) : (
              <span>
                {record?.priorityTypeId === 'HIGH' ? (
                  <span className="text-red-600 font-medium">High</span>
                ) : (
                  <span className="text-red-700 font-medium">Very high</span>
                )}
              </span>
            )}
          </span>
        ),
    },
    {
      title: 'Date',
      key: 'date',
      align: 'left',
      render: (_, record) => (
        <span className=" font-medium text-sm">{moment(record?.startDate).format('ll')}</span>
      ),
    },
    {
      title: 'Assigned By',
      key: 'assignedBy',
      align: 'center',
      width: 110,
      render: (_, record) => (
        <Popover
          content={<a className="text-black font-medium">{record?.assignedBy?.displayName}</a>}
        >
          <span className="flex gap-2 cursor-pointer mt-3 pl-5">
            {record?.assignedBy?.photoUrl !== undefined ? (
              <Avatar src={record?.assignedBy?.photoUrl} />
            ) : (
              <Avatar
                className="uppercase font-medium"
                style={{
                  backgroundColor: '#f56a00',
                  fontSize: '11px',
                }}
              >
                {record?.assignedBy?.displayName && getInitials(record?.assignedBy?.displayName)}
              </Avatar>
            )}
          </span>
        </Popover>
      ),
    },

    {
      title: 'Type of Work',
      key: 'taskTypeId',
      align: 'center',
      width: 120,
      render: (_, record) => (
        <span className="text-gray-900 font-medium capitalize pt-3">
          {record?.repetitionType.toLowerCase()}
        </span>
      ),
    },

    {
      title: 'Due date',
      key: 'dueDate',
      align: 'center',
      render: (_, record) =>
        record?.dueDate === undefined ? (
          '--'
        ) : (
          <Popover
            content={
              record?.dueDate && (
                <span
                  className={`font-medium text-sm ${
                    moment(record?.dueDate).isBefore(moment()) ? 'text-red-500' : 'text-gray-900'
                  }`}
                >
                  Due {moment(record?.dueDate).fromNow()}
                </span>
              )
            }
          >
            <span
              className={`font-medium text-sm ${
                moment(record?.dueDate).isBefore(moment()) ? 'text-red-500' : 'text-gray-900'
              }`}
            >
              {record?.dueDate && moment(record?.dueDate).format('Do MMM h:mm a')}
            </span>
          </Popover>
        ),
    },
    {
      title: 'Actions',
      key: 'Actions',
      align: 'left',
      render: (_, record) => (
        <span className="flex gap-3">
          {record?.statusId === 'TASK_IN_PROGRESS' ||
          record?.statusId === 'TASK_DONE' ||
          record?.statusId === 'TASK_OVERDUE' ? null : (
            <a
              onClick={(e) => {
                e.stopPropagation();
                history.push(`/tasks/${record?.id}/edit`);
              }}
            >
              <Tooltip title="Edit task">
                {' '}
                <EditOutlined className="text-yellow-700" />
              </Tooltip>
            </a>
          )}
          <div onClick={(e) => e.stopPropagation()}>
            <Popconfirm
              title="Are you sure to delete this task?"
              onConfirm={(e) => {
                e.stopPropagation();
                dispatch({
                  type: 'tasks/removeTaskFromList',
                  payload: {
                    pathParams: {
                      taskId: record?.id,
                    },
                  },
                }).then((res) => {
                  if (res?.responseMessage === 'success') {
                    message.success('task deleted successfully');
                    const subFilter = subListFilter !== 'ALL' ? subListFilter : '';
                    getAllTasksList(startIndex, viewSize, '', mode, subFilter);
                    getTasksCounts();
                  } else {
                    message.error('Something went wrong');
                  }
                });
              }}
              okText="Delete"
              okType="danger"
              cancelText="No"
              onCancel={(e) => e.stopPropagation()}
            >
              <a className="text-red-600 hover:text-red-500" onClick={(e) => e.stopPropagation()}>
                <DeleteOutlined className=" text-red-600" />
              </a>
            </Popconfirm>
          </div>
          {record?.statusId === 'TASK_DONE' || record?.statusId === 'TASK_OVERDUE' ? null : (
            <Popover
              content={
                record?.statusId === 'TASK_IN_PROGRESS' ? quickActionsInProcess : quickActions
              }
              onClick={(e) => {
                e.stopPropagation();
              }}
              trigger={'click'}
              placement="bottomRight"
              overlayClassName={`${styles.customPopOver}`}
            >
              <Tooltip title="Quick actions">
                <a
                  className="text-gray-900"
                  onClick={(e) => {
                    setTaskId(record?.id);
                    e.stopPropagation();
                  }}
                >
                  <MoreOutlined className="text-gray-900 " />
                </a>
              </Tooltip>
            </Popover>
          )}
          {record?.statusId === 'TASK_DONE' || record?.statusId === 'TASK_OVERDUE' ? (
            <Tooltip title="view activities">
              <a
                className="text-blue-600 hover:text-blue-500"
                onClick={(e) => {
                  e.stopPropagation();
                  history.push(
                    `/tasks/${mode.toLowerCase()}/${record?.id}/edit/${'activity-logs'}`,
                  );
                }}
              >
                <AuditOutlined className=" text-blue-600" />
              </a>
            </Tooltip>
          ) : null}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (__, record) => (
        <div>
          <div
            className={`${
              (record?.statusId === 'TASK_DONE' && 'text-green-600') ||
              (record?.statusId === 'TASK_OVERDUE' && 'text-red-600') ||
              (record?.statusId === 'TASK_CREATED' && 'text-indigo-600') ||
              (record?.statusId === 'TASK_IN_PROGRESS' && 'text-yellow-600')
            } font-medium`}
          >
            {(record?.statusId === 'TASK_DONE' && 'Complete') ||
              (record?.statusId === 'TASK_OVERDUE' && 'Overdue') ||
              (record?.statusId === 'TASK_CREATED' && 'Pending') ||
              (record?.statusId === 'TASK_IN_PROGRESS' && 'Progress') ||
              (record?.statusId === 'TASK_NOT_COMPLETED' && 'Not complete on time')}
          </div>
        </div>
      ),
    },
  ];
  const switchCaseForNextAction = (currentAction) => {
    switch (currentAction) {
      case 'Others':
        return <AppIcons.ThreeDotsHorizontal />;
      case 'Phone':
        return <AppIcons.TelephoneFillIcon />;
      case 'Email':
        return <AppIcons.Envelope />;
      case 'Whatsapp Message':
        return <AppIcons.WhatsApp />;
      case 'Text Message':
        return <AppIcons.ChatIcon />;
      case 'Visit':
        return <AppIcons.GeoIcon />;
      case 'Meeting':
        return <AppIcons.People />;
      default:
        return <></>;
    }
  };
  const eventsAndTaskColumns = [
    {
      title: 'Sr.no.',
      align: 'center',
      width: '8rem',
      render: (_, __, index) => (
        <span className="text-gray-900 font-medium">
          {index + 1 + viewSize * (currentPage - 1)}
        </span>
      ),
    },
    {
      title: 'Name',
      align: 'left',
      width: '13rem',
      render: (_, record) => (
        <span className="flex">
          <span className="text-yellow-500 mr-1.5 mt-0.5">
            {switchCaseForNextAction(record?.currentAction)}
          </span>
          <span className="text-gray-900 font-medium capitalize ">
            {Object.keys(record?.followUpBy)?.length > 0 ? (
              <a
                className="text-gray-900 "
                onClick={() =>
                  record?.taskBy === 'LEAD_STUDENT'
                    ? history?.push('/leads/students/leads/all')
                    : history.push(`/students/${record?.followUpBy?.id}`)
                }
              >
                {record?.followUpBy?.displayName}
              </a>
            ) : (
              <a
                className="text-gray-900 "
                onClick={() => history?.push(`/tasks/${record?.taskId}/view`)}
              >
                <Tooltip title={record?.taskName}>
                  <p
                    className={`${
                      record?.students?.length > 0 ? 'w-10' : 'w-44'
                    } font-medium text-gray-900 mb-0`}
                    style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {record?.taskName}
                  </p>
                </Tooltip>
              </a>
            )}
          </span>
        </span>
      ),
    },
    {
      title: 'By',
      align: 'left',
      render: (_, record) => (
        <span className="text-gray-900 font-medium capitalize">
          {record?.taskBy === 'STUDENT' ? (
            'Student'
          ) : (
            <>{record?.taskBy === 'LEAD_STUDENT' ? 'Lead' : 'Task'}</>
          )}
        </span>
      ),
    },
    {
      title: 'Current action',
      align: 'left',
      render: (_, record) => (
        <span className=" font-medium text-sm">{record?.currentAction || '--'}</span>
      ),
    },
    {
      title: 'Next action',
      align: 'left',
      render: (_, record) => (
        <span className=" font-medium text-sm">{record?.nextAction || '--'}</span>
      ),
    },
    {
      title: 'Date',
      key: 'date',
      align: 'center',
      render: (_, record) => (
        <span className=" font-medium text-sm">{moment(record?.startDate).format('ll')}</span>
      ),
    },
    {
      title: 'Time',
      key: 'time',
      align: 'center',
      render: (_, record) => (
        <span className=" font-medium text-sm">{moment(record?.startDate).format('LT')}</span>
      ),
    },
    {
      title: 'Remarks',
      key: 'remarks',
      align: 'left',
      render: (_, record) =>
        (record?.remarks && (
          <Tooltip title={record?.remarks}>
            <p
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              className=" font-medium text-sm w-20"
            >
              {record?.remarks}
            </p>
          </Tooltip>
        )) ||
        '--',
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'left',
      render: (_, record) => (
        <div className="flex gap-5">
          <Tooltip title="Mark as Complete">
            <a
              className="text-green-600 hover:text-red-500"
              onClick={(e) => {
                e.stopPropagation();
                history.push(
                  `/tasks/${mode.toLowerCase()}/${record?.taskId}/edit/${'mark-as-completed'}`,
                );
              }}
            >
              <CheckCircleOutlined />
            </a>
          </Tooltip>
          <Popconfirm
            title="Are you sure to delete this task?"
            onConfirm={(e) => {
              e.stopPropagation();
              dispatch({
                type: 'tasks/removeTaskFromList',
                payload: {
                  pathParams: {
                    taskId: record?.taskId,
                  },
                },
              }).then((res) => {
                if (res?.responseMessage === 'success') {
                  message.success('task deleted successfully');
                  getTasksCounts();
                  getAllFollowups(startIndex, viewSize, '');
                } else {
                  message.error('Something went wrong');
                }
              });
            }}
            okText="Delete"
            okType="danger"
            cancelText="No"
            onCancel={(e) => e.stopPropagation()}
          >
            <a className="text-red-600 hover:text-red-500" onClick={(e) => e.stopPropagation()}>
              <DeleteOutlined className=" text-red-600" />
            </a>
          </Popconfirm>
        </div>
      ),
    },
  ];
  const action = (value) => {
    if (tabName !== 'events-tasks') {
      setCurrentPage(1);
      const subFilter = subListFilter !== 'ALL' ? subListFilter : '';
      getAllTasksList(0, viewSize, value, mode, subFilter);
    } else {
      setCurrentPage(1);
      getAllFollowups(0, viewSize, value);
    }
  };
  const onSearchChange = debounce(action, 600);
  function handleChangePagination(current, size) {
    setStartIndex(viewSize * (current - 1));
    if (tabName !== 'events-tasks') {
      setCurrentPage(current);
      const subFilter = subListFilter !== 'ALL' ? subListFilter : '';
      getAllTasksList(size * (current - 1), size, taskKeyword, tabName?.toUpperCase(), subFilter);
    } else {
      setCurrentPage(current);
      getAllFollowups(size * (current - 1), size, taskKeyword);
    }
  }
  const onTabChange = (key) => {
    if (key !== 'EVENTS-TASKS') {
      const subFilter = subListFilter !== 'ALL' ? subListFilter : '';
      getAllTasksList(0, viewSize, taskKeyword, key, subFilter);
    } else {
      getAllFollowups(0, viewSize, '');
    }
    setMode(key);
    setTaskKeyword();
  };
  useEffect(() => {
    const subFilter = subListFilter !== 'ALL' ? subListFilter : '';
    getAllTasksList(0, viewSize, '', mode, subFilter);
    setTaskKeyword();
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subListFilter]);
  useEffect(() => {
    if (tabName === 'events-tasks') {
      getAllFollowups(0, viewSize, '');
      setCurrentPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabName]);
  useEffect(() => {
    getTasksCounts();
  }, []);
  return (
    <Page
      title={
        <div>
          <div className="flex items-center">
            <div className="ml-2">
              <div className="text-3xl font-semibold text-gray-800">Tasks</div>
            </div>
          </div>
        </div>
      }
      primaryAction={
        <Tooltip title="Create Task">
          <Button
            type="primary"
            onClick={() => {
              dispatch({
                type: 'global/setTaskModalVisible',
                payload: {
                  value: true,
                },
              });
            }}
          >
            Add new
          </Button>
        </Tooltip>
      }
    >
      <div className="bg-white">
        <div className="flex  py-2 lg:flex-col md:flex-col sm:flex-col 2xl:flex-row xl:flex-row">
          <div className="w-full">
            <Tabs
              activeKey={mode}
              defaultActiveKey={mode || tabName?.toUpperCase()}
              onTabClick={(e) => history.push(`/tasks/${e?.toLowerCase()}`)}
              onChange={onTabChange}
            >
              {listFilter?.map((items) => (
                <TabPane tab={<span className="mx-2.5">{items?.title}</span>} key={items?.key} />
              ))}
            </Tabs>
          </div>
          <div
            style={{ borderColor: '#f0f0f0' }}
            className={` w-full mt-2 md:pl-4  md:pb-2  border-b  ${styles?.searchInputRadius}`}
          >
            <Search
              size="middle"
              placeholder="Enter keyword to search"
              enterButton
              value={taskKeyword}
              onChange={(e) => {
                onSearchChange(e.target.value);
                setTaskKeyword(e.target.value);
              }}
            />
          </div>
        </div>
        {tabName === 'events-tasks' ? null : (
          <div className="flex gap-5 px-4 py-2 lg:flex-col 2xl:flex-row xl:flex-col">
            <div className="flex">
              <Radio.Group
                size="middle"
                buttonStyle="solid"
                defaultValue=""
                className={`${styles.customRadioButtonDesign}`}
                value={subListFilter}
                onChange={(e) => {
                  setSubListFilter(e.target.value);
                }}
              >
                {tabsFilter?.map((items) => (
                  <Radio.Button key={items?.key} value={items?.key}>
                    {items?.title}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </div>
          </div>
        )}
        <Table
          scroll={{ x: 1100 }}
          dataSource={
            tabName === 'events-tasks' ? followUpInTasksList?.records : tasksList?.records
          }
          pagination={false}
          loading={Boolean(loading) || Boolean(deleteLoading) || Boolean(loadingEventsTask)}
          className={tabName === 'events-tasks' ? null : `${styles?.tableCell}`}
          columns={
            // eslint-disable-next-line no-nested-ternary
            tabName === 'events-tasks'
              ? eventsAndTaskColumns
              : subListFilter === 'ALL'
              ? AllColumn
              : columns
          }
          locale={{
            emptyText:
              tabName === 'events-tasks' ? (
                <div className="text-center py-20">
                  <div className="flex justify-center">
                    <img
                      src={emptyStateSvg}
                      alt="No task assign found!"
                      style={{ height: '100px' }}
                    />
                  </div>
                  <h1 className="text-lg font-bold text-blue-700">
                    No events & tasks have been assigned yet.
                  </h1>
                  <p className="text-gray-900">Let add some now and they will show up here.</p>
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="flex justify-center">
                    <img
                      src={emptyStateSvg}
                      alt="No task assign found!"
                      style={{ height: '100px' }}
                    />
                  </div>
                  <span className="text-lg font-bold text-blue-700">
                    No {tabsFilter?.find((item) => item?.key === subListFilter)?.emptyText} task
                    Found yet!
                  </span>
                  <p className="text-gray-900">Let add some now and they will show up here.</p>
                </div>
              ),
          }}
          rowClassName={tabName === 'events-tasks' ? null : 'cursor-pointer'}
          onRow={(record) =>
            tabName === 'events-tasks'
              ? null
              : {
                  onClick: (e) => {
                    history.push(`/tasks/${record.id}/view`);
                    e.stopPropagation();
                  },
                }
          }
          footer={() =>
            tabName === 'events-tasks' ? (
              <CheckValidation show={followUpInTasksList?.totalCount > 5}>
                <Row className="mt-2" type="flex" justify="end">
                  <Pagination
                    key={`page-${currentPage}`}
                    showSizeChanger
                    pageSizeOptions={['10', '25', '50', '100']}
                    onShowSizeChange={(e, p) => {
                      setViewSize(p);
                      setCurrentPage(1);
                      setStartIndex(0);
                    }}
                    defaultCurrent={currentPage}
                    current={currentPage}
                    pageSize={viewSize}
                    total={followUpInTasksList?.totalCount}
                    showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                    onChange={handleChangePagination}
                  />
                </Row>
              </CheckValidation>
            ) : (
              <CheckValidation show={tasksList?.totalCount > 5}>
                <Row className="mt-2" type="flex" justify="end">
                  <Pagination
                    key={`page-${currentPage}`}
                    showSizeChanger
                    pageSizeOptions={['10', '25', '50', '100']}
                    onShowSizeChange={(e, p) => {
                      setViewSize(p);
                      setCurrentPage(1);
                      setStartIndex(0);
                    }}
                    defaultCurrent={1}
                    current={currentPage}
                    pageSize={viewSize}
                    total={tasksList?.totalCount}
                    showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                    onChange={handleChangePagination}
                  />
                </Row>
              </CheckValidation>
            )
          }
        />
      </div>
      <AddTaskModal
        leadType={leadType}
        setLeadType={setLeadType}
        searchStudentBy={searchStudentBy}
        setSearchStudentBy={setSearchStudentBy}
        keyword={keyword}
        setKeyword={setKeyword}
        getAllTasksList={getAllTasksList}
        subListFilter={subListFilter}
        setMode={setMode}
        getTasksCounts={getTasksCounts}
      />
      <TaskQuickActions />
    </Page>
  );
};

export default connect(({ tasks, loading }) => ({
  tasksList: tasks?.tasksList,
  taskTypeCounts: tasks?.taskCounts,
  followUpInTasksList: tasks?.followUpInTask,
  loading: loading?.effects['tasks/getTasksList'],
  loadingEventsTask: loading?.effects['tasks/getFollowUpInTask'],
  deleteLoading: loading?.effects['tasks/removeTaskFromList'],
}))(Tasks);
