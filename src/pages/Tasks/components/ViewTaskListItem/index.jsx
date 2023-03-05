/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import {
  ArrowDownShort,
  ArrowRightShort,
  CalendarX,
  CheckCircleFill,
  Circle,
  Clock,
  Exclamation,
  EyeFill,
  EyeSlash,
  Pencil,
} from 'react-bootstrap-icons';
import PropTypes from 'prop-types';
import { connect, withRouter } from 'umi';
import { Tooltip, Avatar, Skeleton, Button } from 'antd';
import { getInitials } from '@/utils/common';
import {
  isMomentToday,
  isMomentThisWeek,
  dayNameShort,
  dayNameAndDateShort,
  monthNameAndDateShort,
  convertMinsToTime,
} from '@/utils/dateTime/dateTimeUtils';
import UpdateTaskDetailsModal from '../UpdateTaskDetailsModal';
import { SyncOutlined } from '@ant-design/icons';
import CheckValidation from '@/components/CheckValidation';

export const renderTaskDueDate = (dueDate) => {
  let dueDateLabel = '';

  if (dueDate) {
    const due = moment(dueDate);
    const isToday = isMomentToday(due);
    const wasDueThisWeek = isMomentThisWeek(due);
    // check if past due
    if (due.isBefore(moment(), 'day')) {
      // check if task was due this week
      if (wasDueThisWeek) {
        // Show in red color with Mon format
        dueDateLabel = dayNameShort(due);
        return (
          <Tooltip title={`Was due ${due.fromNow()}`}>
            <div className="text-red-700">{dueDateLabel}</div>
          </Tooltip>
        );
      }
      // past due since more than this week ago, show in Jan 14 format
      dueDateLabel = dayNameAndDateShort(due);
      return (
        <Tooltip title={`Past due since ${due.fromNow()}`}>
          <div className="text-red-700">{dueDateLabel}</div>
        </Tooltip>
      );
    }
    // Due today, show Today text
    if (isToday) {
      dueDateLabel = 'Today';
      return (
        <Tooltip title={`Due ${due.fromNow()}`}>
          <div className="text-blue-700">{dueDateLabel}</div>
        </Tooltip>
      );
    }

    // Due in the future, show Feb 12 text
    if (due.isAfter(moment(), 'day')) {
      dueDateLabel = monthNameAndDateShort(due);
      // if (isMomentInNext7Days(due)) {
      //   dueDateLabel = dayNameShort(due);
      // }
      return (
        <Tooltip title={`Due ${due.fromNow()} on ${due.format('MMM DD')}`}>
          <div className="text-blue-700">{dueDateLabel}</div>
        </Tooltip>
      );
    }

    return (
      <Tooltip title={`No due date}`}>
        <div className="opacity-50">{dueDateLabel}</div>
      </Tooltip>
    );
  }

  return (
    <Tooltip title="No due date">
      <div className="opacity-25">
        <CalendarX className="text-xl" />
      </div>
    </Tooltip>
  );
};

const renderTaskPriority = ({ priorityTypeId }) => {
  if (priorityTypeId === 'High') {
    return (
      <Tooltip title="High priority">
        <Exclamation className="text-xl text-red-700" />
      </Tooltip>
    );
  }
  if (priorityTypeId === 'Low') {
    return (
      <Tooltip title="Low priority">
        <ArrowDownShort className="text-xl text-green-700" />
      </Tooltip>
    );
  }
  return (
    <Tooltip title="Normal priority">
      <ArrowRightShort className="text-xl text-blue-700" />
    </Tooltip>
  );
};
// TODO
// const markTaskCompleted = ({ taskId, partyIds, noteInfo, jsonText }) => {
// dispatch({
//   type: 'tasks/completeTask',
//   payload: {
//     pathParams: { id: taskId },
//     body: {
//       notifyAssigness: partyIds,
//       noteInfo,
//       jsonText,
//     },
//   },
// }).then(() => {
//   setTimeout(() => {
//     dispatch({
//       type: 'calendar/getPartyCalendarEvents',
//       payload: {
//         calendarId: currentUser?.email,
//       },
//     });
//   }, 1000);
// });
// };

const ViewTaskListItem = ({
  task,
  markTaskCompleted,
  reopenTask,
  // onClick,
  // dispatch,
  isTemplate,
  extraContent,
  overlayClassName,
  showTaskId,
  showCompletionActionButton,
  showTotalTimeSpent,
  onResumeClick,
  currentUser,
}) => {
  const [isEditTaskVisible, setIsEditTaskVisible] = useState(false);
  const [selectedTaskToEdit, setSelectedTaskToEdit] = useState('');
  // const [completionNoteLoading, setCompletionNoteLoading] = useState(false);
  const [showNewlyCreatedFlag, setShowNewlyCreatedFlag] = useState(false); // used to show a new flag for the task.
  // const [taskCreatedSince, setTaskCreatedSince] = useState(5); // task created since seconds ago to show the newly created flag.

  const { id: taskId } = task;
  useEffect(() => {
    if (task.id !== 'newtask') {
      if (moment().diff(moment(task.createdDate), 's') <= 5) {
        setShowNewlyCreatedFlag(true);
      }
    } else {
      setShowNewlyCreatedFlag(true);
    }

    // setNumberOfSubTasks(task?.subTasksCount);
    setTimeout(() => {
      setShowNewlyCreatedFlag(false);
    }, 5000);
    return () => {};
  }, []);
  return (
    <>
      <div className={overlayClassName} id={`viewtaskitem-${task.id}`}>
        {/* Checkbox to mark task as completed, hidden for task type templates. */}
        <CheckValidation show={showCompletionActionButton}>
          <span className={`${task.completed ? 'text-green-700' : 'text-gray-800'}`}>
            {task.completed ? (
              <Tooltip title="Click to reopen task">
                <CheckCircleFill
                  onClick={(e) => {
                    e.preventDefault();
                    reopenTask(task.id);
                  }}
                  className="text-lg"
                />
              </Tooltip>
            ) : task.id === 'newtask' ? (
              <SyncOutlined spin />
            ) : (
              <>
                <CheckValidation
                  show={task?.assignees?.map((item) => item?.id).includes(currentUser?.id)}
                  // fallback={
                  //   <Popconfirm
                  //     title="Do you want to add completion note?"
                  //     // onConfirm={() => setShowAddNoteModal(true)}
                  //     onCancel={(e) => {
                  //       markTaskCompleted({ taskId: task.id });
                  //     }}
                  //     cancelText="Skip"
                  //     okText="Add Note"
                  //   >
                  //     <Tooltip title="Click to mark task completed">
                  //       <Circle className="text-lg" />
                  //     </Tooltip>
                  //   </Popconfirm>
                  // }
                >
                  <Tooltip title="Click to mark task completed">
                    <span
                      aria-hidden="true"
                      onClick={() => {
                        markTaskCompleted({ taskId: task.id });
                      }}
                    >
                      <Circle className="text-lg" />
                    </span>
                  </Tooltip>
                </CheckValidation>
              </>
            )}
          </span>
        </CheckValidation>
        {/* Newly created task indicator */}
        <CheckValidation show={showNewlyCreatedFlag}>
          <div>
            <div className="rounded-full text-white bg-primary text-xxs uppercase px-2">New</div>
          </div>
        </CheckValidation>
        {/* Task ID */}
        <CheckValidation show={showTaskId}>
          <div>
            <div className="text-gray-500 px-2">#{taskId}</div>
          </div>
        </CheckValidation>
        {/* Task name */}
        <div
          className="cursor-pointer flex-auto truncate"
          aria-hidden="true"
          // onClick={onClick}
        >
          {!isTemplate && task.completed ? (
            <div className="text-black font-medium italic truncate">
              <del>{task.taskName || task.name}</del>
            </div>
          ) : (
            <div className="text-black font-medium truncate">{task.name}</div>
          )}
          {extraContent || null}
        </div>
        {/* Shown for task templates only, signifies template visibility, private/public */}
        <CheckValidation show={isTemplate}>
          <div>
            {task?.isPublic ? (
              <EyeFill className="text-green-600" />
            ) : (
              <EyeSlash className="text-gray-600" />
            )}
          </div>
        </CheckValidation>
        {/* Task assignees */}
        <CheckValidation show={!isTemplate}>
          <div className="flex -space-x-2">
            {task.assignees &&
              task.assignees.map((assignee, key) => (
                <div id={`vti-asng-${task.id}-${assignee.id}`} key={key}>
                  <Tooltip
                    title={
                      <div className="flex space-x-2 items-center">
                        <div>
                          <Avatar size="large" src={assignee.photoUrl}>
                            {getInitials(assignee.displayName)}
                          </Avatar>
                        </div>
                        <div>
                          <div className="font-semibold">{assignee.displayName}</div>
                          <div>{assignee.email}</div>
                        </div>
                      </div>
                    }
                  >
                    <Avatar className="ring-white ring-2" size="small" src={assignee.photoUrl}>
                      {getInitials(assignee.displayName)}
                    </Avatar>
                  </Tooltip>
                </div>
              ))}
          </div>
        </CheckValidation>
        {/* Subtasks count / Show number of sub tasks, only shown if subtasks exist */}
        <CheckValidation show={showTotalTimeSpent}>
          <div>
            {/* Total time spent */}
            {task?.totalTimeSpentInMins > 0 && (
              <div className="flex items-center">
                <Tooltip title="Total time spent on the task.">
                  <div className="flex-none text-sm text-gray-800 font-semibold px-4">
                    <Clock /> {convertMinsToTime(task?.totalTimeSpentInMins)}
                  </div>
                </Tooltip>
                <div>
                  <Button
                    size="small"
                    onClick={() => {
                      if (onResumeClick) onResumeClick({ taskDetails: task, taskId });
                    }}
                  >
                    Resume
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CheckValidation>

        {/* Task priority */}
        <div>{renderTaskPriority(task)}</div>
        {/* Task due date */}
        <div className="text-xs font-semibold text-right" style={{ minWidth: '45px' }}>
          {task?.dueDate ? (
            renderTaskDueDate(task?.dueDate)
          ) : (
            <Tooltip title="No due date">
              <CalendarX className="text-gray-500" />
            </Tooltip>
          )}
        </div>
        <div className="ml-2 cursor-pointer" data-html2canvas-ignore="true">
          <Tooltip title="Edit task details">
            <Pencil
              onClick={() => {
                setIsEditTaskVisible(true);
                setSelectedTaskToEdit(task);
              }}
            />
          </Tooltip>
        </div>
      </div>
      <UpdateTaskDetailsModal
        isEditTaskVisible={isEditTaskVisible}
        setIsEditTaskVisible={setIsEditTaskVisible}
        selectedTaskToEdit={selectedTaskToEdit}
      />
    </>
  );
};

/**
 * Represents the loading/skeleton state of a task item.
 * Use it to show skeleton state for a task item in a list.
 */
export const ViewTaskListItemSkeleton = () => {
  return (
    <div>
      <div className="flex items-center space-x-4 px-4 py-2">
        <div>
          <Skeleton.Avatar size="large" active loading />
        </div>
        <div className="flex-auto pb-4">
          <Skeleton title paragraph={false} active loading />
        </div>
        <div className="flex-none">
          <Skeleton.Button size="small" shape="round" active loading />
        </div>
        <div className="flex-none">
          <Skeleton.Button size="small" shape="circle" active loading />
        </div>
      </div>
    </div>
  );
};

ViewTaskListItem.defaultProps = {
  showTaskCategory: false,
  isTemplate: false,
  showSubTasksCount: true,
  extraContent: null,
  overlayClassName:
    'transition-none flex space-x-2 items-center px-4 py-2 rounded shadow bg-white hover:bg-gray-100 mb-2',
  showTaskId: false,
  showCompletionActionButton: true,
  showTotalTimeSpent: false,
  onResumeClick: () => {},
};

ViewTaskListItem.propTypes = {
  /**
   * @param {boolean} showTaskCategory : signifies whether to show the task category id or not, false by default.
   */
  showTaskCategory: PropTypes.bool,
  /**
   * @param {boolean} isTemplate : signifies whether the task is a template, if so editable parts are disabled.
   */
  isTemplate: PropTypes.bool,
  /**
   * @param {boolean} showSubTasksCount : To toggle visibility of showing how many subtasks exist for the task, defaults to true
   */
  showSubTasksCount: PropTypes.bool,
  /**
   * @param {node} extraContent : Extra content to be rendered under the task name, defaults to null. Useful for displaying extra actions under task templates list.
   */
  extraContent: PropTypes.node,
  /**
   * @param {string} overlayClassName : For custom styling of wrapper div, default one has shadows and round corners. Example can be overlayClassName="transition-none flex space-x-2 items-center px-4 py-2 hover:bg-gray-100"
   */
  overlayClassName: PropTypes.string,
  /**
   * @param {boolean} showTaskId : If true displays the task id before task name, defaults to falsee
   */
  showTaskId: PropTypes.bool,
  /**
   * @param {boolean} showCompletionActionButton : If false hides the mark completed button shown on the left most side of the task list item. Defaults to true. Turn it false to show the list in read only mode, like for displaying recent tasks list.
   */
  showCompletionActionButton: PropTypes.bool,
  /**
   * If true displays the total time spent on the task with a button to resume work if the task is not completed. Also invokes onResumeClick if passed.
   * @default false
   */
  showTotalTimeSpent: PropTypes.bool,
  /**
   * Callback invoked when showTotalTimeSpent is true and some time is logged on the task. Passes {taskDetails, taskId} to the callback
   */
  onResumeClick: PropTypes.func,
};

export default withRouter(
  connect(({ user }) => ({
    currentUser: user.currentUser,
  }))(ViewTaskListItem),
);
