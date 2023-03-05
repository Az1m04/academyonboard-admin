import apiEndPoints from '@/utils/apiEndPoints';
import { callApi } from '@/utils/apiUtils';
import studentInstallments from '../../public/studentInstallmentsDummy';

export const addStudent = ({ body, pathParams }) =>
  callApi({
    uriEndPoint: apiEndPoints.students.addStudent.v1,
    body,
    pathParams,
  })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((err) => ({ ...err, status: 'notok' }));

export const getStudentDetails = ({ pathParams }) =>
  callApi({
    uriEndPoint: apiEndPoints.students.getStudentDetails.v1,
    pathParams,
  })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((err) => ({ ...err, status: 'notok' }));
export const getStudentCurrentStatus = ({ pathParams }) =>
  callApi({
    uriEndPoint: apiEndPoints.students.getStudentCurrentStatus.v1,
    pathParams,
  });
export const getWalletStatus = ({ pathParams }) =>
  callApi({
    uriEndPoint: apiEndPoints.students.getWalletStatus.v1,
    pathParams,
  })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((err) => ({ ...err, status: 'notok' }));
export const getCourseDetails = ({ pathParams }) =>
  callApi({
    uriEndPoint: apiEndPoints.students.getCourseDetails.v1,
    pathParams,
  });

export const walletDetails = ({ pathParams }) =>
  callApi({
    uriEndPoint: apiEndPoints.students.walletDetails.v1,
    pathParams,
  })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((err) => ({ ...err, status: 'notok' }));

export const studentExtentCourseToken = ({ pathParams, body }) =>
  callApi({
    uriEndPoint: apiEndPoints.students.studentExtentCourseToken.v1,
    pathParams,
    body,
  });
export const updateCourseDetails = ({ body, pathParams }) =>
  callApi({ uriEndPoint: apiEndPoints.students.updateCourseDetails.v1, body, pathParams })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((err) => ({ ...err, status: 'notok' }));
export const upgradeCourseDetails = ({ body, pathParams }) =>
  callApi({ uriEndPoint: apiEndPoints.students.upgradeCourseDetails.v1, body, pathParams });
export const addStudentNotes = ({ body, pathParams }) =>
  callApi({ uriEndPoint: apiEndPoints.students.addStudentNotes.v1, body, pathParams })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((err) => ({ ...err, status: 'notok' }));
export const markNoteRead = ({ body, pathParams }) =>
  callApi({ uriEndPoint: apiEndPoints.students.markNoteRead.v1, body, pathParams })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((err) => ({ ...err, status: 'notok' }));
export const markNoteUnread = ({ body, pathParams }) =>
  callApi({ uriEndPoint: apiEndPoints.students.markNoteUnread.v1, body, pathParams })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((err) => ({ ...err, status: 'notok' }));
export const updateStudentNotes = ({ body, pathParams }) =>
  callApi({ uriEndPoint: apiEndPoints.students.updateStudentNotes.v1, body, pathParams })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((err) => ({ ...err, status: 'notok' }));
export const getNotes = ({ pathParams, query }) =>
  callApi({ uriEndPoint: apiEndPoints.students.getNotes.v1, pathParams, query });
export const getNotesList = ({ pathParams, query }) =>
  callApi({ uriEndPoint: apiEndPoints.students.getNotesList.v1, pathParams, query });
export const getTeacherRemarks = ({ pathParams, query }) =>
  callApi({ uriEndPoint: apiEndPoints.students.getTeacherRemarks.v1, pathParams, query });
export const getParticularNote = ({ pathParams }) =>
  callApi({ uriEndPoint: apiEndPoints.students.getParticularNote.v1, pathParams })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((err) => ({ ...err, status: 'notok' }));
export const getFollowUpsCounts = ({ pathParams, query }) =>
  callApi({ uriEndPoint: apiEndPoints.students.getFollowUpsCounts.v1, pathParams, query })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((err) => ({ ...err, status: 'notok' }));
export const getTeacherRemarksCounts = ({ pathParams, query }) =>
  callApi({ uriEndPoint: apiEndPoints.students.getTeacherRemarksCounts.v1, pathParams, query })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((err) => ({ ...err, status: 'notok' }));
export const deleteNotes = ({ pathParams }) =>
  callApi({ uriEndPoint: apiEndPoints.students.deleteNotes.v1, pathParams })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((err) => ({ ...err, status: 'notok' }));
export const deleteFollowUps = ({ pathParams }) =>
  callApi({ uriEndPoint: apiEndPoints.students.deleteFollowUps.v1, pathParams })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((err) => ({ ...err, status: 'notok' }));
export const deleteMultipleNotes = ({ body, pathParams }) =>
  callApi({ uriEndPoint: apiEndPoints.students.deleteMultipleNotes.v1, body, pathParams })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((err) => ({ ...err, status: 'notok' }));
export const getCommunicationalLogs = ({ pathParams, query }) =>
  callApi({ uriEndPoint: apiEndPoints.students.getCommunicationalLogs.v1, pathParams, query })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((err) => ({ ...err, status: 'notok' }));
export const multipleActions = ({ body, pathParams, query }) =>
  callApi({ uriEndPoint: apiEndPoints.students.multipleActions.v1, body, pathParams, query })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((err) => ({ ...err, status: 'notok' }));
export const getFollowUps = ({ pathParams, query }) =>
  callApi({ uriEndPoint: apiEndPoints.students.getFollowUps.v1, pathParams, query });
export const getStudentStages = ({ pathParams }) =>
  callApi({ uriEndPoint: apiEndPoints.students.getStudentStages.v1, pathParams })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((err) => ({ ...err, status: 'notok' }));
export const getEmergencyContact = ({ pathParams }) =>
  callApi({
    uriEndPoint: apiEndPoints.students.getEmergencyContact.v1,
    pathParams,
  });
export const getQualificationDetails = ({ pathParams }) =>
  callApi({
    uriEndPoint: apiEndPoints.students.getQualificationDetails.v1,
    pathParams,
  });
export const getPrimaryTeacherName = ({ pathParams }) =>
  callApi({
    uriEndPoint: apiEndPoints.students.getPrimaryTeacherName.v1,
    pathParams,
  });
export const getStudentOwnerName = ({ pathParams }) =>
  callApi({
    uriEndPoint: apiEndPoints.students.getStudentOwnerName.v1,
    pathParams,
  });
export const getAllStudentList = ({ query }) =>
  callApi({
    uriEndPoint: apiEndPoints.students.getAllStudentList.v1,
    query,
  })
    .then((res) => res)
    .catch(() => {});
export const getAllEnabledStudentList = ({ query }) =>
  callApi({
    uriEndPoint: apiEndPoints.students.getAllEnabledStudentList.v1,
    query,
  })
    .then((res) => res)
    .catch(() => {});
export const getAllDisabledStudentList = ({ query }) =>
  callApi({
    uriEndPoint: apiEndPoints.students.getAllDisabledStudentList.v1,
    query,
  })
    .then((res) => res)
    .catch(() => {});

export const enableDisableStudent = ({ pathParams }) =>
  callApi({ uriEndPoint: apiEndPoints.staff.disableStaff.v1, pathParams });

export const getAllStudents = ({ query, pathParams }) =>
  callApi({
    uriEndPoint: apiEndPoints.students.getStudents.v1,
    query,
    pathParams,
  })
    .then((res) => res)
    .catch(() => {});

export const getStudent = ({ pathParams }) =>
  callApi({ uriEndPoint: apiEndPoints.students.getStudent.v1, pathParams })
    .then((res) => res)
    .catch(() => {});
export const getStudentCourseEnrollments = ({ pathParams }) =>
  callApi({
    uriEndPoint: apiEndPoints.students.getStudentCourseEnrollments.v1,
    pathParams,
  });

export const getStudentInstallments = () => studentInstallments;

export const getPaymentStats = ({ pathParams }) =>
  callApi({
    uriEndPoint: apiEndPoints.students.getPaymentStats.v1,
    pathParams,
  });
export const receiveInstallmentPayment = ({ pathParams, body }) =>
  callApi({
    uriEndPoint: apiEndPoints.students.receiveInstallmentPayment.v1,
    pathParams,
    body,
  });
export const getParticularStudentProfilePic = ({ pathParams }) =>
  callApi({
    uriEndPoint: apiEndPoints.students.getParticularStudentProfilePic.v1,
    pathParams,
  })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((err) => ({ ...err, status: 'notok' }));

export const getParentOccupations = ({ pathParams }) =>
  callApi({
    uriEndPoint: apiEndPoints.students.getParentOccupations.v1,
    pathParams,
  })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((err) => ({ ...err, status: 'notok' }));

export const getStudentTasks = ({ pathParams, query }) =>
  callApi({
    uriEndPoint: apiEndPoints.students.getStudentTasks.v1,
    pathParams,
    query,
  })
    .then((res) => res)
    .catch(() => {});

export const setApproval = (pathParams) =>
  callApi({ uriEndPoint: apiEndPoints.students.setApproval.v1, pathParams })
    .then((res) => res)
    .catch(() => {});

export const updateStudentDetails = ({ body, studentId }) => {
  return callApi({
    uriEndPoint: apiEndPoints.students.updateStudentDetails.v1,
    body,
    pathParams: { studentId },
  })
    .then((res) => res)
    .catch(() => {});
};

export const getStudentUploadedNotes = ({ pathParams }) =>
  callApi({
    uriEndPoint: apiEndPoints.students.getStudentTaskNotes.v1,
    pathParams,
  })
    .then((res) => res)
    .catch(() => {});

export const getStudentUploadedAttachments = ({ pathParams }) =>
  callApi({
    uriEndPoint: apiEndPoints.students.getStudentTaskAssignment.v1,
    pathParams,
  })
    .then((res) => res)
    .catch(() => {});

export const getStudentStats = ({ pathParams }) =>
  callApi({
    uriEndPoint: apiEndPoints.students.getStudentStats.v1,
    pathParams,
  })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch(() => {});

export const uploadStudentAttachments = ({ body, query, pathParams }) =>
  callApi({
    uriEndPoint: apiEndPoints.students.uploadStudentAttachments.v1,
    body,
    query,
    pathParams,
  })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((error) => error);
export const getTestAssigned = ({ pathParams }) =>
  callApi({
    uriEndPoint: apiEndPoints.students.getTestAssigned.v1,
    pathParams,
  })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((error) => error);

export const getStudentAttachments = ({ pathParams }) =>
  callApi({
    uriEndPoint: apiEndPoints.students.getStudentAttachments.v1,
    pathParams,
  })
    .then((res) => res)
    .catch(() => {});

export const deleteStudentAttachments = ({ pathParams }) =>
  callApi({
    uriEndPoint: apiEndPoints.students.deleteStudentAttachments.v1,
    pathParams,
  })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch(() => {});

export const assignOwner = ({ pathParams, body }) =>
  callApi({ uriEndPoint: apiEndPoints.students.assignOwner.v1, pathParams, body })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((res) => ({ ...res, status: 'notok' }));
export const getStudentOwnerActivity = ({ pathParams, query }) =>
  callApi({ uriEndPoint: apiEndPoints.students.getStudentOwnerActivity.v1, pathParams, query })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch(() => {});
export const getStudentTestActivity = ({ pathParams, query }) =>
  callApi({ uriEndPoint: apiEndPoints.students.getStudentTestActivity.v1, pathParams, query })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch(() => {});
export const assignTeacher = ({ pathParams, body }) =>
  callApi({ uriEndPoint: apiEndPoints.students.assignTeacher.v1, pathParams, body })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch(() => {});
export const getStudentTeacherActivity = ({ pathParams, query }) =>
  callApi({ uriEndPoint: apiEndPoints.students.getStudentTeacherActivity.v1, pathParams, query })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch(() => {});
export const addDemoClass = ({ body, pathParams }) =>
  callApi({ uriEndPoint: apiEndPoints.students.addDemoClass.v1, body, pathParams })
    .then((res) => ({
      ...res,
      status: 'ok',
    }))
    .catch((err) => ({ ...err, status: 'error' }));

export const addExtraDays = ({ body, pathParams }) =>
  callApi({ uriEndPoint: apiEndPoints.students.addExtraDays.v1, body, pathParams })
    .then((res) => ({
      ...res,
      status: 'ok',
    }))
    .catch((err) => ({ ...err, status: 'error' }));
export const getActivity = ({ pathParams, query }) =>
  callApi({ uriEndPoint: apiEndPoints.students.getActivity.v1, pathParams, query })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((err) => ({ ...err, status: 'notok' }));

export const withdrawCourse = ({ body, query, pathParams }) =>
  callApi({
    uriEndPoint: apiEndPoints.students.withdrawCourse.v1,
    body,
    query,
    pathParams,
  })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((error) => error);

export const getStudentCourses = ({ pathParams, query }) =>
  callApi({ uriEndPoint: apiEndPoints.students.getStudentCourses.v1, pathParams, query })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((err) => ({ ...err, status: 'notok' }));
export const getStudentWallet = ({ pathParams, query }) =>
  callApi({ uriEndPoint: apiEndPoints.students.getStudentWallet.v1, pathParams, query })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((err) => ({ ...err, status: 'notok' }));

export const getStudentCoursePayment = ({ pathParams, query }) =>
  callApi({ uriEndPoint: apiEndPoints.students.getStudentCoursePayment.v1, pathParams, query })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((err) => ({ ...err, status: 'notok' }));

export const getStudentApproverList = ({ pathParams, query }) =>
  callApi({ uriEndPoint: apiEndPoints.students.getStudentApproverList.v1, pathParams, query })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((err) => ({ ...err, status: 'notok' }));

export const getStudentLeaveList = ({ pathParams, query }) =>
  callApi({ uriEndPoint: apiEndPoints.students.getStudentLeaveList.v1, pathParams, query })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((err) => ({ ...err, status: 'notok' }));

export const getStudentAttendanceList = ({ pathParams, query }) =>
  callApi({ uriEndPoint: apiEndPoints.students.getStudentAttendanceList.v1, pathParams, query })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((err) => ({ ...err, status: 'notok' }));
export const approveLeave = ({ body, pathParams }) =>
  callApi({ uriEndPoint: apiEndPoints.students.approveLeave.v1, body, pathParams })
    .then((res) => ({
      ...res,
      status: 'ok',
    }))
    .catch((err) => ({ ...err, status: 'error' }));

export const getSingleStudentLeave = ({ pathParams, query }) =>
  callApi({ uriEndPoint: apiEndPoints.students.getSingleStudentLeave.v1, pathParams, query })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((err) => ({ ...err, status: 'notok' }));
export const getStudentCertificate = ({ pathParams, query }) =>
  callApi({ uriEndPoint: apiEndPoints.students.getStudentCertificate.v1, pathParams, query })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((err) => ({ ...err, status: 'notok' }));
export const getStudentWalletdata = ({ pathParams, query }) =>
  callApi({ uriEndPoint: apiEndPoints.students.getStudentWalletdata.v1, pathParams, query });

export const getTeachingSchedule = ({ pathParams, query }) =>
  callApi({ uriEndPoint: apiEndPoints.students.getTeachingSchedule.v1, pathParams, query })
    .then((res) => ({
      ...res,
      status: 'ok',
    }))
    .catch((err) => ({ ...err, status: 'error' }));

export const getStudentBatchDetails = ({ pathParams }) =>
  callApi({ uriEndPoint: apiEndPoints.students.getStudentBatchDetails.v1, pathParams })
    .then((res) => ({
      ...res,
      status: 'ok',
    }))
    .catch((err) => ({ ...err, status: 'error' }));
