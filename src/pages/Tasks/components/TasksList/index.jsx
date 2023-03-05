import React from 'react';
import { Collapse, Spin } from 'antd';
import { connect } from 'dva';
import { CaretRightOutlined } from '@ant-design/icons';
import CheckValidation from '@/components/CheckValidation';
import ViewTaskListItem from '../ViewTaskListItem';
// import { DummyTasksList } from './DummyTasks';

const { Panel } = Collapse;

/**
 *
 * @TasksList - Renders a list of tasks, Group them by projects/sections.
 * Usage:
 * Simply include the component with desired configuration and it'll take care of the rest.
 */
const TasksList = ({
  setTaskTimelog,
  taskList,
  setSelectedTaskId,
  calendarRef,
  markTaskCompleted,
  reopenTask,
  overdueTaskStartIndex,
  setOverdueTaskStartIndex,
  latterTaskStartIndex,
  setLatterTaskStartIndex,
  todayTaskStartIndex,
  setTodayTaskStartIndex,
  tasksDueLatterLoading,
  tasksDueTodayLoading,
  overdueTasksLoading,
  backlogTasksLoading,
  backlogTaskStartIndex,
  setBacklogStartIndex,
}) => {
  // const [taskCompleted, setTaskCompleted] = useState('');
  // const [noteInfo, setNoteInfo] = useState({});
  // const [form] = Form.useForm();
  // const [listAssignees, setListAssignees] = useState([]);
  // const [addAssigneeVisible, setAddAssigneeVisible] = useState(false);
  // const [addAssigneeLoading, setAddAssigneeLoading] = useState(false);

  return (
    <>
      <Collapse
        bordered={false}
        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
        className="site-collapse-custom-collapse"
        activeKey="1"
      >
        <Panel
          header={
            <span className="font-medium text-red-700">
              OVERDUE ({taskList?.totalOverdueTasks ? taskList?.totalOverdueTasks : 0})
            </span>
          }
          key="1"
          className="site-collapse-custom-panel"
        >
          <Spin active spinning={!!overdueTasksLoading}>
            {taskList?.overdueTasks?.map((task) => (
              <div
                aria-hidden="true"
                key={task.id}
                href
                draggable="true"
                onDragStart={() => {
                  if (calendarRef)
                    return calendarRef?.current?.handleDragStart({
                      title: task.id,
                      name: task.name,
                    });
                  return null;
                }}
              >
                <ViewTaskListItem
                  showTaskCategory
                  task={task}
                  key={task.id}
                  onClick={() => {
                    // setTaskDrawer(true);
                    setSelectedTaskId(task.id, task);
                    if (setTaskTimelog) setTaskTimelog('overdueTasks');
                  }}
                  markTaskCompleted={(payload) => {
                    markTaskCompleted(payload);
                  }}
                  reopenTask={reopenTask}
                />
              </div>
            ))}
          </Spin>

          <CheckValidation show={taskList?.overdueTasks && taskList?.overdueTasks?.length === 0}>
            <div className="p-2">No overdue tasks</div>
          </CheckValidation>
          <CheckValidation show={taskList?.totalOverdueTasks > overdueTaskStartIndex + 5}>
            <div>
              <span
                className="flex justify-end font-medium text-sm pl-4 text-blue-800 "
                style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
                onClick={() => setOverdueTaskStartIndex(overdueTaskStartIndex + 5)}
              >
                Show more tasks...
              </span>
            </div>
          </CheckValidation>
        </Panel>
      </Collapse>

      <Collapse
        activeKey="2"
        bordered={false}
        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
        className="site-collapse-custom-collapse"
      >
        <Panel
          header={
            <span className="font-medium text-green-500">
              TODAY ({taskList?.totalTasksDueToday ? taskList?.totalTasksDueToday : 0})
            </span>
          }
          key="2"
          className="site-collapse-custom-panel"
        >
          <Spin active spinning={!!tasksDueTodayLoading}>
            {taskList?.tasksDueToday?.map((task) => (
              <div
                aria-hidden="true"
                key={task.id}
                href
                draggable="true"
                onDragStart={() => {
                  if (calendarRef)
                    return calendarRef?.current?.handleDragStart({
                      title: task.id,
                      name: task.name,
                    });
                  return null;
                }}
              >
                <ViewTaskListItem
                  showTaskCategory
                  task={task}
                  key={task.id}
                  onClick={() => {
                    // setTaskDrawer(true);
                    setSelectedTaskId(task.id, task);
                    if (setTaskTimelog) setTaskTimelog('tasksDueToday');
                  }}
                  markTaskCompleted={(payload) => {
                    markTaskCompleted(payload);
                  }}
                  reopenTask={reopenTask}
                />
              </div>
            ))}
          </Spin>
          <CheckValidation show={taskList?.tasksDueToday?.length === 0}>
            <div className="p-2">No tasks added today!</div>
          </CheckValidation>
          <CheckValidation show={taskList?.totalTasksDueToday > todayTaskStartIndex + 5}>
            <div>
              <span
                className="flex justify-end font-medium text-sm pl-4 text-blue-800 "
                style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
                onClick={() => setTodayTaskStartIndex(todayTaskStartIndex + 5)}
              >
                Show more tasks...
              </span>
            </div>
          </CheckValidation>
        </Panel>
      </Collapse>
      <Collapse
        activeKey="3"
        bordered={false}
        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
        className="site-collapse-custom-collapse"
      >
        <Panel
          header={
            <span className="font-medium text-blue-700">
              LATER ({taskList?.totalTasksDueLatter ? taskList?.totalTasksDueLatter : 0})
            </span>
          }
          key="3"
          className="site-collapse-custom-panel"
        >
          <Spin active spinning={!!tasksDueLatterLoading}>
            {taskList?.tasksDueLatter?.map((task) => (
              <div
                aria-hidden="true"
                key={task.id}
                href
                draggable="true"
                onDragStart={() => {
                  if (calendarRef)
                    return calendarRef?.current?.handleDragStart({
                      title: task.id,
                      name: task.name,
                    });
                  return null;
                }}
              >
                <ViewTaskListItem
                  showTaskCategory
                  task={task}
                  key={task.id}
                  onClick={() => {
                    // setTaskDrawer(true);
                    setSelectedTaskId(task.id, task);
                    if (setTaskTimelog) setTaskTimelog('tasksDueLatter');
                  }}
                  markTaskCompleted={(payload) => {
                    markTaskCompleted(payload);
                  }}
                  reopenTask={reopenTask}
                />
              </div>
            ))}
          </Spin>

          <CheckValidation show={taskList?.tasksDueLatter?.length === 0}>
            <div className="p-2">No tasks added later!</div>
          </CheckValidation>
          <CheckValidation show={taskList?.totalTasksDueLatter > latterTaskStartIndex + 5}>
            <div>
              <span
                className="flex justify-end font-medium text-sm pl-4 text-blue-800 "
                style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
                onClick={() => setLatterTaskStartIndex(latterTaskStartIndex + 5)}
              >
                Show more tasks...
              </span>
            </div>
          </CheckValidation>
        </Panel>
      </Collapse>
      <Collapse
        activeKey="4"
        bordered={false}
        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
        className="site-collapse-custom-collapse"
      >
        <Panel
          header={
            <span className="font-medium text-blue-700">
              Backlog ({taskList?.totalBacklogTasks ? taskList?.totalBacklogTasks : 0})
            </span>
          }
          key="4"
          className="site-collapse-custom-panel"
        >
          <Spin active spinning={!!backlogTasksLoading}>
            {taskList?.backlogTasks?.map((task) => (
              <div
                aria-hidden="true"
                key={task.id}
                href
                draggable="true"
                onDragStart={() => {
                  if (calendarRef)
                    return calendarRef?.current?.handleDragStart({
                      title: task.id,
                      name: task.name,
                    });
                  return null;
                }}
              >
                <ViewTaskListItem
                  showTaskCategory
                  task={task}
                  key={task.id}
                  onClick={() => {
                    // setTaskDrawer(true);
                    setSelectedTaskId(task.id, task);
                    if (setTaskTimelog) setTaskTimelog('backlogTasks');
                  }}
                  markTaskCompleted={(payload) => {
                    markTaskCompleted(payload);
                  }}
                  reopenTask={reopenTask}
                  showCompletionActionButton
                />
              </div>
            ))}
          </Spin>
          <CheckValidation show={taskList?.backlogTasks?.length === 0}>
            <div className="p-2">No backlog tasks!</div>
          </CheckValidation>
          <CheckValidation show={taskList?.totalBacklogTasks > backlogTaskStartIndex + 5}>
            <div>
              <span
                className="flex justify-end font-medium text-sm pl-4 text-blue-800 "
                style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
                onClick={() => setBacklogStartIndex(backlogTaskStartIndex + 5)}
              >
                Show more tasks...
              </span>
            </div>
          </CheckValidation>
        </Panel>
      </Collapse>
    </>
  );
};

TasksList.defaultProps = {
  /**
   * @param {boolean} showTaskCategory : signifies whether to show the task category id or not, false by default.
   */
  showTaskCategory: false,
};

const mapStateToProps = ({ user }) => ({
  currentUser: user.currentUser,
});

export default connect(mapStateToProps)(TasksList);
