/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */
/**
 * Model For Tasks Entity
 */

import {
  getMyTasks,
  addTaskCategory,
  getTaskCategoryList,
  createTask,
  reopenTask,
  completeTask,
  getBranchList,
  getDepartmentList,
  getStaffList,
  getStudentsList,
  getTasksList,
  removeTaskFromList,
  changePriority,
  singleTaskDetail,
  markAsComplete,
  markAsProcess,
  getTaskCounts,
  getTaskActivity,
  updateTask,
  addFollowUpInTask,
  getFollowUpInTask,
  assignToOther,
} from '@/services/tasks';
import { isArray } from 'lodash-es';
import moment from 'moment';
// import { playStateChangeUpAudio, playStateChangeDownAudio } from '@/utils/audioUtils';

const Model = {
  namespace: 'tasks',
  state: {
    taskCategoryList: null,
    recentTasks: [],
    taskSearchResults: [],
    tasks: {
      backlogTasks: [],
      tasksDueLatter: [],
      tasksDueToday: [],
      overdueTasks: [],
    },
    partyTaskDetails: {},
    subTasks: [],
    getBranchList: null,
    departmentList: null,
    staffList: null,
    studentsList: null,
    tasksList: null,
    taskCounts: null,
    activityTaskRecord: null,
    followUpInTask: null,
  },
  effects: {
    *getTasksDueToday({ payload }, { call, put, select }) {
      try {
        let res;
        switch (payload.tasksType) {
          case 'personal':
            res = yield call(getMyTasks, payload);
            break;
          default:
            res = yield call(getMyTasks, payload);
            break;
        }
        let tasks = yield select((state) => state.tasks.tasks);
        // to check if filter changed or start index is zero then empty the state
        if (payload?.isFilterChangedOrStartIndexZero) {
          tasks = {
            ...tasks,
            tasksDueToday: [...res?.records],
            totalTasksDueToday: res?.totalCount,
          };
        } else {
          tasks = {
            ...tasks,
            tasksDueToday: [...tasks?.tasksDueToday, ...res?.records],
            totalTasksDueToday: res?.totalCount,
          };
        }

        yield put({
          type: 'setStates',
          payload: tasks,
          key: 'tasks',
        });
        return res;
      } catch (error) {
        return null;
      }
    },
    *getTasksDueLatter({ payload }, { call, put, select }) {
      try {
        let res;
        switch (payload.tasksType) {
          case 'personal':
            res = yield call(getMyTasks, payload);
            break;

          default:
            res = yield call(getMyTasks, payload);
            break;
        }
        let tasks = yield select((state) => state.tasks.tasks);
        if (payload?.isFilterChangedOrStartIndexZero) {
          tasks = {
            ...tasks,
            tasksDueLatter: [...res?.records],
            totalTasksDueLatter: res?.totalCount,
          };
        } else {
          tasks = {
            ...tasks,
            tasksDueLatter: [...tasks?.tasksDueLatter, ...res?.records],
            totalTasksDueLatter: res?.totalCount,
          };
        }

        yield put({
          type: 'setStates',
          payload: tasks,
          key: 'tasks',
        });
        return res;
      } catch (error) {
        return null;
      }
    },
    *getOverdueTasks({ payload }, { call, put, select }) {
      try {
        let res;
        switch (payload.tasksType) {
          case 'personal':
            res = yield call(getMyTasks, payload);
            break;

          default:
            res = yield call(getMyTasks, payload);
            break;
        }
        let tasks = yield select((state) => state.tasks.tasks);
        if (payload?.isFilterChangedOrStartIndexZero) {
          tasks = {
            ...tasks,
            overdueTasks: [...res?.records],
            totalOverdueTasks: res?.totalCount,
          };
        } else {
          tasks = {
            ...tasks,
            overdueTasks: [...tasks?.overdueTasks, ...res?.records],
            totalOverdueTasks: res?.totalCount,
          };
        }

        yield put({
          type: 'setStates',
          payload: tasks,
          key: 'tasks',
        });
        return res;
      } catch (error) {
        return null;
      }
    },
    *getBacklogTasks({ payload }, { call, put, select }) {
      try {
        let res;
        switch (payload.tasksType) {
          case 'personal':
            res = yield call(getMyTasks, payload);
            break;

          default:
            res = yield call(getMyTasks, payload);
            break;
        }
        let tasks = yield select((state) => state.tasks.tasks);
        if (payload?.isFilterChangedOrStartIndexZero) {
          tasks = {
            ...tasks,
            backlogTasks: [...res?.records],
            totalBacklogTasks: res?.totalCount,
          };
        } else {
          tasks = {
            ...tasks,
            backlogTasks: [...tasks?.backlogTasks, ...res?.records],
            totalBacklogTasks: res?.totalCount,
          };
        }

        yield put({
          type: 'setStates',
          payload: tasks,
          key: 'tasks',
        });
        return res;
      } catch (error) {
        return null;
      }
    },
    *createTask({ payload }, { call, put, select }) {
      const tasks = yield select((state) => state.tasks.tasks);
      try {
        let taskType;
        const diff = moment().diff(moment(payload?.body?.dueDate), 's');
        if (diff === 0) {
          taskType = 'tasksDueToday';
        }
        if (!payload?.body?.dueDate) {
          taskType = 'backlogTasks';
        }
        if (diff < 0) {
          taskType = 'tasksDueLatter';
        }
        if (diff > 0) {
          taskType = 'overdueTasks';
        }

        yield put({
          type: 'setStates',
          payload: {
            ...tasks,
            [taskType]: [
              {
                id: 'newtask',
                name: payload.body.name,
                priorityTypeId: '',
                statusId: 'TASK_CREATED',
                isComplete: false,
                completed: false,
                showPlanned: false,
                assignees: [],
              },
              ...tasks[taskType],
            ],
          },
          key: 'tasks',
        });
        const res = yield call(createTask, payload);

        yield put({
          type: 'setStates',
          payload: {
            ...tasks,
            [taskType]: [res, ...tasks[taskType]],
          },
          key: 'tasks',
        });

        // Log analytics
        return res;
      } catch (error) {
        yield put({
          type: 'setStates',
          payload: { ...tasks },
          key: 'tasks',
        });
        return null;
      }
    },
    *completeTask({ payload }, { select, put, call }) {
      let res;
      let err;
      let tasks;
      try {
        tasks = yield select((state) => state.tasks.tasks);
        yield put({
          type: 'setStates',
          payload: Object.fromEntries(
            Object.entries(tasks).map(([taskType, taskList]) => {
              if (!isArray(taskList)) {
                return [taskType, taskList];
              }
              return [
                taskType,
                taskList.map((task) =>
                  task.id === payload.pathParams.id ? { ...task, completed: true } : task,
                ),
              ];
            }),
          ),
          key: 'tasks',
        });
        res = yield call(completeTask, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'partyTaskDetails',
        });
        // play success sound
        // playStateChangeUpAudio();
        // logTaskCompletedEvent();
        return res;
      } catch (error) {
        yield put({
          type: 'setStates',
          payload: { ...tasks },
          key: 'tasks',
        });
        err = error;
      }

      if (err) {
        // some api level error occurred. This can be handled in dispatch
        return Promise.reject(err);
      }
      return res;
    },
    *reopenTask({ payload }, { select, put, call }) {
      const tasks = yield select((state) => state.tasks.tasks);

      try {
        yield put({
          type: 'setStates',
          payload: Object.fromEntries(
            Object.entries(tasks).map(([taskType, taskList]) => {
              if (!isArray(taskList)) {
                return [taskType, taskList];
              }
              return [
                taskType,
                taskList.map((task) =>
                  task.id === payload.pathParams.id ? { ...task, completed: false } : task,
                ),
              ];
            }),
          ),
          key: 'tasks',
        });
        const res = yield call(reopenTask, payload);
        // play sound
        // playStateChangeDownAudio();

        // logTaskReopenedEvent();
        return res;
      } catch (error) {
        yield put({
          type: 'setStates',
          payload: [...tasks],
          key: 'tasks',
        });
        console.log({ error });
        return null;
      }
    },
    *addTaskCategory({ payload }, { call }) {
      let apiResponse;
      let err;
      try {
        apiResponse = yield call(addTaskCategory, payload);
      } catch (error) {
        // extract the error response from the server
        err = error;
      }
      if (err) {
        // some api level error occurred. This can be handled in dispatch
        return Promise.reject(err);
      }
      return apiResponse;
    },

    *getTaskCategoryList({ payload }, { call, put }) {
      let apiResponse;
      let err;
      try {
        apiResponse = yield call(getTaskCategoryList, payload);
        yield put({
          type: 'setStates',
          payload: apiResponse,
          key: 'taskCategoryList',
        });
      } catch (error) {
        // extract the error response from the server
        err = error;
      }
      if (err) {
        // some api level error occurred. This can be handled in dispatch
        return Promise.reject(err);
      }
      return apiResponse;
    },
    *getBranchList({ payload }, { call, put }) {
      let apiResponse;
      let err;
      try {
        apiResponse = yield call(getBranchList, payload);
        yield put({
          type: 'setStates',
          payload: apiResponse,
          key: 'branchList',
        });
      } catch (error) {
        // extract the error response from the server
        err = error;
      }
      if (err) {
        // some api level error occurred. This can be handled in dispatch
        return Promise.reject(err);
      }
      return apiResponse;
    },
    *getDepartmentList({ payload }, { call, put }) {
      let apiResponse;
      let err;
      try {
        apiResponse = yield call(getDepartmentList, payload);
        yield put({
          type: 'setStates',
          payload: apiResponse,
          key: 'departmentList',
        });
      } catch (error) {
        // extract the error response from the server
        err = error;
      }
      if (err) {
        // some api level error occurred. This can be handled in dispatch
        return Promise.reject(err);
      }
      return apiResponse;
    },
    *getStaffList({ payload }, { call, put }) {
      let apiResponse;
      let err;
      try {
        apiResponse = yield call(getStaffList, payload);
        yield put({
          type: 'setStates',
          payload: apiResponse,
          key: 'staffList',
        });
      } catch (error) {
        // extract the error response from the server
        err = error;
      }
      if (err) {
        // some api level error occurred. This can be handled in dispatch
        return Promise.reject(err);
      }
      return apiResponse;
    },
    *getStudentsList({ payload }, { call, put }) {
      let apiResponse;
      let err;
      try {
        apiResponse = yield call(getStudentsList, payload);
        yield put({
          type: 'setStates',
          payload: apiResponse,
          key: 'studentsList',
        });
      } catch (error) {
        // extract the error response from the server
        err = error;
      }
      if (err) {
        // some api level error occurred. This can be handled in dispatch
        return Promise.reject(err);
      }
      return apiResponse;
    },
    *getTasksList({ payload }, { call, put }) {
      let apiResponse;
      let err;
      try {
        apiResponse = yield call(getTasksList, payload);
        yield put({
          type: 'setStates',
          payload: apiResponse,
          key: 'tasksList',
        });
      } catch (error) {
        // extract the error response from the server
        err = error;
      }
      if (err) {
        // some api level error occurred. This can be handled in dispatch
        return Promise.reject(err);
      }
      return apiResponse;
    },
    *removeTaskFromList({ payload }, { call }) {
      let apiResponse;
      let err;
      try {
        apiResponse = yield call(removeTaskFromList, payload);
        return apiResponse;
      } catch (error) {
        // extract the error response from the server
        err = error;
      }
      if (err) {
        // some api level error occurred. This can be handled in dispatch
        return Promise.reject(err);
      }
      return apiResponse;
    },
    *changePriority({ payload }, { call }) {
      let apiResponse;
      let err;
      try {
        apiResponse = yield call(changePriority, payload);
      } catch (error) {
        // extract the error response from the server
        err = error;
      }
      if (err) {
        // some api level error occurred. This can be handled in dispatch
        return Promise.reject(err);
      }
      return apiResponse;
    },
    *singleTaskDetail({ payload }, { call }) {
      let apiResponse;
      let err;
      try {
        apiResponse = yield call(singleTaskDetail, payload);
        return apiResponse;
      } catch (error) {
        // extract the error response from the server
        err = error;
      }
      if (err) {
        // some api level error occurred. This can be handled in dispatch
        return Promise.reject(err);
      }
      return apiResponse;
    },
    *markAsComplete({ payload }, { call }) {
      let apiResponse;
      let err;
      try {
        apiResponse = yield call(markAsComplete, payload);
        return apiResponse;
      } catch (error) {
        // extract the error response from the server
        err = error;
      }
      if (err) {
        // some api level error occurred. This can be handled in dispatch
        return Promise.reject(err);
      }
      return apiResponse;
    },
    *markAsProcess({ payload }, { call }) {
      let apiResponse;
      let err;
      try {
        apiResponse = yield call(markAsProcess, payload);
        return apiResponse;
      } catch (error) {
        // extract the error response from the server
        err = error;
      }
      if (err) {
        // some api level error occurred. This can be handled in dispatch
        return Promise.reject(err);
      }
      return apiResponse;
    },
    *getTaskCounts({ payload }, { call, put }) {
      let apiResponse;
      let err;
      try {
        apiResponse = yield call(getTaskCounts, payload);
        yield put({
          type: 'setStates',
          payload: apiResponse,
          key: 'taskCounts',
        });
        return apiResponse;
      } catch (error) {
        // extract the error response from the server
        err = error;
      }
      if (err) {
        // some api level error occurred. This can be handled in dispatch
        return Promise.reject(err);
      }
      return apiResponse;
    },
    *getTaskActivity({ payload }, { call, put }) {
      let apiResponse;
      let err;
      try {
        apiResponse = yield call(getTaskActivity, payload);
        yield put({
          type: 'setStates',
          payload: apiResponse,
          key: 'activityTaskRecord',
        });
        return apiResponse;
      } catch (error) {
        // extract the error response from the server
        err = error;
      }
      if (err) {
        // some api level error occurred. This can be handled in dispatch
        return Promise.reject(err);
      }
      return apiResponse;
    },
    *updateTask({ payload }, { call }) {
      let apiResponse;
      let err;
      try {
        apiResponse = yield call(updateTask, payload);

        return apiResponse;
      } catch (error) {
        // extract the error response from the server
        err = error;
      }
      if (err) {
        // some api level error occurred. This can be handled in dispatch
        return Promise.reject(err);
      }
      return apiResponse;
    },
    *addFollowUpInTask({ payload }, { call }) {
      let apiResponse;
      let err;
      try {
        apiResponse = yield call(addFollowUpInTask, payload);

        return apiResponse;
      } catch (error) {
        // extract the error response from the server
        err = error;
      }
      if (err) {
        // some api level error occurred. This can be handled in dispatch
        return Promise.reject(err);
      }
      return apiResponse;
    },
    *getFollowUpInTask({ payload }, { call, put }) {
      let apiResponse;
      let err;
      try {
        apiResponse = yield call(getFollowUpInTask, payload);
        yield put({
          type: 'setStates',
          payload: apiResponse,
          key: 'followUpInTask',
        });
      } catch (error) {
        // extract the error response from the server
        err = error;
      }
      if (err) {
        // some api level error occurred. This can be handled in dispatch
        return Promise.reject(err);
      }
      return apiResponse;
    },
    *assignToOther({ payload }, { call }) {
      let apiResponse;
      let err;
      try {
        apiResponse = yield call(assignToOther, payload);
        return apiResponse;
      } catch (error) {
        // extract the error response from the server
        err = error;
      }
      if (err) {
        // some api level error occurred. This can be handled in dispatch
        return Promise.reject(err);
      }
      return apiResponse;
    },
  },
  reducers: {
    setStates(state, { payload, key }) {
      return {
        ...state,
        [key]: payload,
      };
    },
  },
};

export default Model;
