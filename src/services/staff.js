import apiEndPoints from '@/utils/apiEndPoints';
import { callApi } from '@/utils/apiUtils';

export const createStaff = (body) =>
  callApi({ uriEndPoint: apiEndPoints.staff.createStaff.v1, body })
    .then((res) => res)
    .catch(() => {});

export const inviteUser = (body) =>
  callApi({ uriEndPoint: apiEndPoints.staff.inviteUser.v1, body })
    .then((res) => res)
    .catch(() => {});

export const getStaffList = ({ query, pathParams }) =>
  callApi({ uriEndPoint: apiEndPoints.staff.getStaffList.v1, query, pathParams })
    .then((res) => res)
    .catch(() => {});

export const getDepartmentStaffList = ({ pathParams }) =>
  callApi({ uriEndPoint: apiEndPoints.staff.getDepartmentStaffList.v1, pathParams })
    .then((res) => res)
    .catch(() => {});

export const addStaff = ({ body }) =>
  callApi({ uriEndPoint: apiEndPoints.staff.addStaff.v1, body })
    .then((res) => res)
    .catch(() => {});

export const disableStaff = ({ pathParams }) =>
  callApi({ uriEndPoint: apiEndPoints.staff.disableStaff.v1, pathParams })
    .then((res) => res)
    .catch(() => {});

export const enableStaff = ({ pathParams, body }) =>
  callApi({ uriEndPoint: apiEndPoints.staff.enableStaff.v1, pathParams, body });

export const getStaffDetails = (pathParams) =>
  callApi({ uriEndPoint: apiEndPoints.staff.getStaffDetails.v1, pathParams })
    .then((res) => res)
    .catch(() => {});
export const getTeacherDetails = ({ pathParams }) =>
  callApi({ uriEndPoint: apiEndPoints.staff.getTeacherDetails.v1, pathParams })
    .then((res) => res)
    .catch(() => {});
export const getLeaves = ({ pathParams }) =>
  callApi({ uriEndPoint: apiEndPoints.staff.getLeaves.v1, pathParams })
    .then((res) => res)
    .catch(() => {});
export const getTeacherBatchDetails = ({ pathParams }) =>
  callApi({ uriEndPoint: apiEndPoints.staff.getTeacherBatchDetails.v1, pathParams })
    .then((res) => res)
    .catch(() => {});
export const getStudentsList = ({ pathParams, query }) =>
  callApi({ uriEndPoint: apiEndPoints.staff.getStudentsList.v1, pathParams, query })
    .then((res) => res)
    .catch(() => {});
export const getStaffBatches = ({ pathParams, query }) =>
  callApi({ uriEndPoint: apiEndPoints.staff.getStaffBatches.v1, pathParams, query })
    .then((res) => res)
    .catch(() => {});
export const getStaffBatchesStudents = ({ pathParams, query }) =>
  callApi({ uriEndPoint: apiEndPoints.staff.getStaffBatchesStudents.v1, pathParams, query })
    .then((res) => res)
    .catch(() => {});
export const StaffBatchesStudentsAttendance = ({ pathParams, query, body }) =>
  callApi({
    uriEndPoint: apiEndPoints.staff.StaffBatchesStudentsAttendance.v1,
    pathParams,
    query,
    body,
  })
    .then((res) => res)
    .catch(() => {});
export const updateBatchStudentsAttendance = ({ pathParams, query, body }) =>
  callApi({
    uriEndPoint: apiEndPoints.staff.updateBatchStudentsAttendance.v1,
    pathParams,
    query,
    body,
  })
    .then((res) => res)
    .catch(() => {});
export const getActivities = ({ pathParams, query, body }) =>
  callApi({ uriEndPoint: apiEndPoints.staff.getActivities.v1, pathParams, query, body })
    .then((res) => res)
    .catch(() => {});
export const staffClassAssociation = ({ body, staffId }) => {
  return callApi({
    uriEndPoint: apiEndPoints.staff.addClassToStaff.v1,
    body,
    pathParams: { staffId },
  })
    .then((res) => res)
    .catch(() => {});
};
export const deleteStaffClassAssociation = ({ body, staffId }) => {
  return callApi({
    uriEndPoint: apiEndPoints.staff.deleteClassOfStaff.v1,
    body,
    pathParams: { staffId },
  })
    .then((res) => res)
    .catch(() => {});
};

export const updateStaffDetails = ({ body, staffId }) => {
  return callApi({
    uriEndPoint: apiEndPoints.staff.updateStaffDetails.v1,
    body,
    pathParams: { staffId },
  })
    .then((res) => res)
    .catch(() => {});
};
export const getDepartmentList = ({ query, pathParams }) =>
  callApi({ uriEndPoint: apiEndPoints.staff.getDepartmentList.v1, query, pathParams });

export const getLeavesRecord = ({ query, pathParams }) =>
  callApi({ uriEndPoint: apiEndPoints.staff.getLeavesRecord.v1, query, pathParams });

export const getSingleLeaveDetails = ({ query, pathParams }) =>
  callApi({ uriEndPoint: apiEndPoints.staff.getSingleLeaveDetails.v1, query, pathParams });

export const markLeaveStatus = ({ body, pathParams }) =>
  callApi({ uriEndPoint: apiEndPoints.staff.markLeaveStatus.v1, body, pathParams });

export const staffFollowUps = ({ body, pathParams }) =>
  callApi({ uriEndPoint: apiEndPoints.staff.staffFollowUps.v1, body, pathParams });

export const getStaffFollowUps = ({ query, pathParams }) =>
  callApi({ uriEndPoint: apiEndPoints.staff.getStaffFollowUps.v1, query, pathParams });

export const updateStaffFollowUps = ({ body, pathParams }) =>
  callApi({ uriEndPoint: apiEndPoints.staff.updateStaffFollowUps.v1, body, pathParams });

export const deleteStaffFollowUps = ({ pathParams }) =>
  callApi({ uriEndPoint: apiEndPoints.staff.deleteStaffFollowUps.v1, pathParams });

export const getOrgMemberList = ({ query, pathParams }) =>
  callApi({ uriEndPoint: apiEndPoints.staff.getOrgMemberList.v1, query, pathParams });

export const createDepartment = ({ body }) =>
  callApi({ uriEndPoint: apiEndPoints.staff.createDepartment.v1, body });

export const getStaffScheduled = ({ pathParams, query, body }) =>
  callApi({ uriEndPoint: apiEndPoints.staff.getStaffScheduled.v1, pathParams, query, body })
    .then((res) => res)
    .catch(() => {});
export const getRoleAndResponsibilities = ({ pathParams, query }) =>
  callApi({ uriEndPoint: apiEndPoints.staff.getRoleAndResponsibilities.v1, pathParams, query })
    .then((res) => res)
    .catch(() => {});
export const getCommunicationalLogs = ({ pathParams, query }) =>
  callApi({ uriEndPoint: apiEndPoints.staff.getCommunicationalLogs.v1, pathParams, query })
    .then((res) => res)
    .catch(() => {});

export const uploadStaffNotes = ({ pathParams, query, body }) =>
  callApi({ uriEndPoint: apiEndPoints.staff.uploadStaffNotes.v1, pathParams, query, body })
    .then((res) => res)
    .catch(() => {});

export const uploadStaffRemarks = ({ pathParams, query, body }) =>
  callApi({ uriEndPoint: apiEndPoints.staff.uploadStaffRemarks.v1, pathParams, query, body })
    .then((res) => res)
    .catch((res) => res);

export const getStudentCourses = ({ pathParams, query }) =>
  callApi({ uriEndPoint: apiEndPoints.staff.getStudentCourses.v1, pathParams, query })
    .then((res) => res)
    .catch((res) => res);

export const getStaffAllNotes = ({ pathParams, query }) =>
  callApi({ uriEndPoint: apiEndPoints.staff.getStaffAllNotes.v1, pathParams, query })
    .then((res) => res)
    .catch(() => {});

export const getSingleStaffNotes = ({ pathParams, query }) =>
  callApi({ uriEndPoint: apiEndPoints.staff.getSingleStaffNotes.v1, pathParams, query })
    .then((res) => res)
    .catch(() => {});

export const getStaffAllRemark = ({ pathParams, query }) =>
  callApi({ uriEndPoint: apiEndPoints.staff.getStaffAllRemark.v1, pathParams, query })
    .then((res) => res)
    .catch(() => {});

export const deleteStaffNotes = ({ pathParams, query }) =>
  callApi({ uriEndPoint: apiEndPoints.staff.deleteStaffNotes.v1, pathParams, query })
    .then((res) => res)
    .catch(() => {});

export const markReadStaffNote = ({ pathParams, query }) =>
  callApi({ uriEndPoint: apiEndPoints.staff.markReadStaffNote.v1, pathParams, query })
    .then((res) => res)
    .catch(() => {});
export const updateEditStaffDetails = ({ pathParams, query, body }) =>
  callApi({ uriEndPoint: apiEndPoints.staff.updateEditStaffDetails.v1, pathParams, query, body })
    .then((res) => res)
    .catch(() => {});

export const promoteStaff = ({ pathParams, query, body }) =>
  callApi({ uriEndPoint: apiEndPoints.staff.promoteStaff.v1, pathParams, query, body })
    .then((res) => res)
    .catch(() => {});
export const uploadStaffProfile = ({ pathParams, query, body }) =>
  callApi({ uriEndPoint: apiEndPoints.staff.uploadStaffProfile.v1, pathParams, query, body })
    .then((res) => res)
    .catch(() => {});
export const uploadStaffTask = ({ pathParams, query, body }) =>
  callApi({ uriEndPoint: apiEndPoints.staff.uploadStaffTask.v1, pathParams, query, body })
    .then((res) => res)
    .catch(() => {});
export const upldateStaffProfile = ({ pathParams, query, body }) =>
  callApi({ uriEndPoint: apiEndPoints.staff.upldateStaffProfile.v1, pathParams, query, body })
    .then((res) => res)
    .catch(() => {});

export const getStaffActivity = ({ pathParams, query, body }) =>
  callApi({ uriEndPoint: apiEndPoints.staff.getStaffActivity.v1, pathParams, query, body })
    .then((res) => res)
    .catch(() => {});

export const getTeachingPlan = ({ query }) =>
  callApi({ uriEndPoint: apiEndPoints.staff.getTeachingPlan.v1, query });

export const getWalletStatus = ({ pathParams, query }) =>
  callApi({ uriEndPoint: apiEndPoints.staff.getWalletStatus.v1, pathParams, query });
export const getSalaryStatus = ({ pathParams, query }) =>
  callApi({ uriEndPoint: apiEndPoints.staff.getSalaryStatus.v1, pathParams, query });
export const applyStaffLeave = ({ pathParams, query, body }) =>
  callApi({ uriEndPoint: apiEndPoints.staff.applyStaffLeave.v1, pathParams, query, body })
    .then((res) => res)
    .catch(() => {});

export const staffSuperviser = ({ pathParams, query }) =>
  callApi({ uriEndPoint: apiEndPoints.staff.staffSuperviser.v1, pathParams, query })
    .then((res) => res)
    .catch(() => {});

export const getAllStaffLeave = ({ pathParams, query }) =>
  callApi({ uriEndPoint: apiEndPoints.staff.getAllStaffLeave.v1, pathParams, query })
    .then((res) => res)
    .catch(() => {});

export const getStaffTasksList = ({ query }) =>
  callApi({ uriEndPoint: apiEndPoints.staff.getStaffTasksList.v1, query })
    .then((res) => res)
    .catch(() => {});
export const addStaffSalary = ({ pathParams, body }) =>
  callApi({ uriEndPoint: apiEndPoints.staff.addStaffSalary.v1, pathParams, body });
