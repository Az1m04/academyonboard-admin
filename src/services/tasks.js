import { tasks } from '@/utils/endpoints/tasks';
import { callApi } from '@/utils/apiUtils';

export function getMyTasks({ query }) {
  return callApi({
    uriEndPoint: tasks.getMyTasks.v1,
    query,
  });
}

export const createTask = ({ pathParams, body }) =>
  callApi({ uriEndPoint: tasks.createTask.v1, pathParams, body })
    .then((resp) => resp)
    .catch((err) => ({ ...err, status: 'notok' }));

export const completeTask = ({ pathParams, body }) =>
  callApi({
    uriEndPoint: tasks.completeTask.v1,
    pathParams,
    body,
  });
export const reopenTask = ({ pathParams }) =>
  callApi({
    uriEndPoint: tasks.reopenTask.v1,
    pathParams,
  })
    .then((res) => res)
    .catch(() => {});

export const addTaskCategory = ({ body }) =>
  callApi({ uriEndPoint: tasks.addTaskCategory.v1, body });
export const getTaskCategoryList = () => callApi({ uriEndPoint: tasks.getTaskCategoryList.v1 });
export const getBranchList = ({ query }) => {
  return callApi({
    uriEndPoint: tasks.getBranchList.v1,
    query,
  });
};
export const getDepartmentList = ({ query }) => {
  return callApi({
    uriEndPoint: tasks.getDepartmentList.v1,
    query,
  });
};
export const getStaffList = ({ query, pathParams }) => {
  return callApi({
    uriEndPoint: tasks.getStaffList.v1,
    query,
    pathParams,
  });
};
export const getStudentsList = ({ query }) => {
  return callApi({
    uriEndPoint: tasks.getStudentsList.v1,
    query,
  });
};
export const getTasksList = ({ query }) => {
  return callApi({
    uriEndPoint: tasks.getTasksList.v1,
    query,
  });
};
export const removeTaskFromList = ({ pathParams }) => {
  return callApi({
    uriEndPoint: tasks.removeTaskFromList.v1,
    pathParams,
  });
};
export const changePriority = ({ pathParams, body }) =>
  callApi({
    uriEndPoint: tasks.changePriority.v1,
    pathParams,
    body,
  });

export const singleTaskDetail = ({ pathParams, body }) =>
  callApi({
    uriEndPoint: tasks.singleTaskDetail.v1,
    pathParams,
    body,
  });
export const markAsComplete = ({ pathParams, body }) =>
  callApi({
    uriEndPoint: tasks.markAsComplete.v1,
    pathParams,
    body,
  });
export const markAsProcess = ({ pathParams, body }) =>
  callApi({
    uriEndPoint: tasks.markAsProcess.v1,
    pathParams,
    body,
  });
export const getTaskCounts = () =>
  callApi({
    uriEndPoint: tasks.getTaskCounts.v1,
  });
export const getTaskActivity = ({ pathParams }) =>
  callApi({
    uriEndPoint: tasks.getTaskActivity.v1,
    pathParams,
  });

export const updateTask = ({ pathParams, body }) =>
  callApi({
    uriEndPoint: tasks.updateTask.v1,
    pathParams,
    body,
  });
export const addFollowUpInTask = ({ pathParams, body }) =>
  callApi({
    uriEndPoint: tasks.addFollowUpInTask.v1,
    pathParams,
    body,
  });
export const getFollowUpInTask = ({ query }) =>
  callApi({
    uriEndPoint: tasks.getFollowUpInTask.v1,
    query,
  });
export const assignToOther = ({ pathParams, body }) =>
  callApi({
    uriEndPoint: tasks.assignToOther.v1,
    pathParams,
    body,
  });
