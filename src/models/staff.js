import {
  createStaff,
  getStaffList,
  inviteUser,
  disableStaff,
  getStaffDetails,
  updateStaffDetails,
  staffClassAssociation,
  deleteStaffClassAssociation,
  addStaff,
  getDepartmentList,
  createDepartment,
  getOrgMemberList,
  enableStaff,
  getDepartmentStaffList,
  getTeacherDetails,
  getTeacherBatchDetails,
  getStudentsList,
  getStaffBatches,
  getStaffBatchesStudents,
  StaffBatchesStudentsAttendance,
  updateBatchStudentsAttendance,
  getActivities,
  getStaffScheduled,
  getLeavesRecord,
  getSingleLeaveDetails,
  markLeaveStatus,
  staffFollowUps,
  getStaffFollowUps,
  updateStaffFollowUps,
  deleteStaffFollowUps,
  getRoleAndResponsibilities,
  getCommunicationalLogs,
  uploadStaffNotes,
  uploadStaffRemarks,
  getStudentCourses,
  getTeachingPlan,
  getStaffAllNotes,
  getSingleStaffNotes,
  getStaffAllRemark,
  deleteStaffNotes,
  markReadStaffNote,
  updateEditStaffDetails,
  promoteStaff,
  uploadStaffProfile,
  uploadStaffTask,
  getStaffActivity,
  upldateStaffProfile,
  getWalletStatus,
  getSalaryStatus,
  applyStaffLeave,
  staffSuperviser,
  getAllStaffLeave,
  getStaffTasksList,
  addStaffSalary,
  getLeaves,
} from '@/services/staff';

const Model = {
  namespace: 'staff',
  state: {
    0: null,
    classInfo: null,
    staffDetails: null,
    staffList: null,
    getDepartmentStaffList: null,
    getTeacherDetails: null,
    getTeacherBatchDetails: null,
    getStudentsList: null,
    getStaffBatches: null,
    getStaffBatchesStudents: null,
    getActivities: null,
    staffScheduled: null,
    LeavesRecords: null,
    singleLeaveDetails: null,
    staffFollowUpsList: null,
    getRoleAndResponsibilities: null,
    getCommunicationalLogs: null,
    getStudentCourses: null,
    teachingPlanList: null,
    getStaffAllNotes: null,
    getSingleStaffNotes: null,
    getStaffAllRemark: null,
    getStaffActivity: null,
    walletStatusList: null,
    salaryStatusList: null,
    staffSuperviser: null,
    getAllStaffLeave: null,
    staffTasksList: null,
    getLeaves: null,
  },
  effects: {
    *createStaff({ payload, cb }, { call }) {
      const res = yield call(createStaff, payload);
      if (cb) cb(res);
      return res;
    },
    *inviteUser({ payload, cb }, { call }) {
      const res = yield call(inviteUser, payload);
      if (cb) cb(res);
      return res;
    },
    *getStaffList({ payload }, { call, put }) {
      const res = yield call(getStaffList, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'staffList',
      });
      return res;
    },
    *getDepartmentStaffList({ payload }, { call, put }) {
      const res = yield call(getDepartmentStaffList, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'getDepartmentStaffList',
      });
      return res;
    },
    *addStaff({ payload }, { call, put }) {
      const res = yield call(addStaff, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'addStaff',
      });
      return res;
    },
    *getDepartmentList({ payload }, { call, put }) {
      try {
        const res = yield call(getDepartmentList, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'departmentList',
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getWalletStatus({ payload }, { call, put }) {
      try {
        const res = yield call(getWalletStatus, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'walletStatusList',
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getSalaryStatus({ payload }, { call, put }) {
      try {
        const res = yield call(getSalaryStatus, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'salaryStatusList',
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *createDepartment({ payload }, { call }) {
      try {
        const res = yield call(createDepartment, payload);

        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getOrgMemberList({ payload }, { call, put }) {
      let apiResponse;
      let err;
      try {
        apiResponse = yield call(getOrgMemberList, payload);
        yield put({
          type: 'setStates',
          payload: apiResponse,
          key: 'orgMemberList',
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
    *disableStaff({ payload }, { call, select, put }) {
      try {
        const res = yield call(disableStaff, payload);

        const list = yield select((state) => state.staff.staffList);
        const prevRecord = list?.records;
        const newRecord = prevRecord?.filter(
          (record) => record?.partyId !== payload?.pathParams?.partyId,
        );
        yield put({
          type: 'setStates',
          payload: { ...list, records: newRecord },
          key: 'staffList',
        });

        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *enableStaff({ payload }, { call, select, put }) {
      const res = yield call(enableStaff, payload);

      const list = yield select((state) => state.staff.staffList);

      const prevRecord = list?.records;
      const newRecord = prevRecord?.filter(
        (record) => record?.partyId !== payload?.pathParams?.partyId,
      );
      yield put({
        type: 'setStates',
        payload: { ...list, records: newRecord },
        key: 'staffList',
      });

      return res;
    },
    *getStaffDetails({ payload }, { call, put }) {
      const response = yield call(getStaffDetails, payload);
      yield put({
        type: 'setStates',
        payload: response,
        key: 'staffDetails',
      });
    },
    *getTeacherDetails({ payload }, { call, put }) {
      try {
        const res = yield call(getTeacherDetails, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'getTeacherDetails',
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getLeaves({ payload }, { call, put }) {
      try {
        const res = yield call(getLeaves, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'getLeaves',
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getTeacherBatchDetails({ payload }, { call, put }) {
      try {
        const res = yield call(getTeacherBatchDetails, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'getTeacherBatchDetails',
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getStudentsList({ payload }, { call, put }) {
      try {
        const res = yield call(getStudentsList, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'getStudentsList',
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getStaffBatches({ payload }, { call, put }) {
      try {
        const res = yield call(getStaffBatches, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'getStaffBatches',
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getStaffBatchesStudents({ payload }, { call, put }) {
      try {
        const res = yield call(getStaffBatchesStudents, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'getStaffBatchesStudents',
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *StaffBatchesStudentsAttendance({ payload }, { call }) {
      try {
        const res = yield call(StaffBatchesStudentsAttendance, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *updateBatchStudentsAttendance({ payload }, { call }) {
      try {
        const res = yield call(updateBatchStudentsAttendance, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getActivities({ payload }, { call, put }) {
      try {
        const res = yield call(getActivities, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'getActivities',
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getLeavesRecord({ payload }, { call, put }) {
      try {
        const res = yield call(getLeavesRecord, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'LeavesRecords',
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getSingleLeaveDetails({ payload }, { call, put }) {
      try {
        const res = yield call(getSingleLeaveDetails, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'singleLeaveDetails',
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *markLeaveStatus({ payload }, { call }) {
      try {
        const res = yield call(markLeaveStatus, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *staffFollowUps({ payload }, { call }) {
      try {
        const res = yield call(staffFollowUps, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getStaffFollowUps({ payload }, { call, put }) {
      try {
        const res = yield call(getStaffFollowUps, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'staffFollowUpsList',
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *updateStaffFollowUps({ payload }, { call }) {
      try {
        const res = yield call(updateStaffFollowUps, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *deleteStaffFollowUps({ payload }, { call }) {
      try {
        const res = yield call(deleteStaffFollowUps, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *updateStaffDetails({ payload }, { call, put }) {
      const response = yield call(updateStaffDetails, payload);
      yield put({
        type: 'setStates',
        payload: response,
        key: 'staffDetails',
      });
      return response;
    },
    *staffClassAssociation({ payload }, { call }) {
      const res = yield call(staffClassAssociation, payload);
      return res;
    },
    *deleteStaffClassAssociation({ payload }, { call }) {
      const res = yield call(deleteStaffClassAssociation, payload);
      return res;
    },
    *getStaffScheduled({ payload }, { call, put }) {
      try {
        const res = yield call(getStaffScheduled, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'staffScheduled',
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getRoleAndResponsibilities({ payload }, { call, put }) {
      try {
        const res = yield call(getRoleAndResponsibilities, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'getRoleAndResponsibilities',
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getCommunicationalLogs({ payload }, { call, put }) {
      try {
        const res = yield call(getCommunicationalLogs, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'getCommunicationalLogs',
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *uploadStaffNotes({ payload }, { call }) {
      try {
        const res = yield call(uploadStaffNotes, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *uploadStaffRemarks({ payload }, { call }) {
      try {
        const res = yield call(uploadStaffRemarks, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getStudentCourses({ payload }, { call, put }) {
      try {
        const res = yield call(getStudentCourses, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'getStudentCourses',
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getTeachingPlan({ payload }, { call, put }) {
      try {
        const res = yield call(getTeachingPlan, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'teachingPlanList',
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getStaffAllNotes({ payload }, { call, put }) {
      try {
        const res = yield call(getStaffAllNotes, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'getStaffAllNotes',
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getSingleStaffNotes({ payload }, { call, put }) {
      try {
        const res = yield call(getSingleStaffNotes, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'getSingleStaffNotes',
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getStaffAllRemark({ payload }, { call, put }) {
      try {
        const res = yield call(getStaffAllRemark, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'getStaffAllRemark',
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *deleteStaffNotes({ payload }, { call }) {
      try {
        const res = yield call(deleteStaffNotes, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *markReadStaffNote({ payload }, { call }) {
      try {
        const res = yield call(markReadStaffNote, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *updateEditStaffDetails({ payload }, { call }) {
      try {
        const res = yield call(updateEditStaffDetails, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *promoteStaff({ payload }, { call }) {
      try {
        const res = yield call(promoteStaff, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *uploadStaffProfile({ payload }, { call }) {
      try {
        const res = yield call(uploadStaffProfile, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *upldateStaffProfile({ payload }, { call }) {
      try {
        const res = yield call(upldateStaffProfile, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *uploadStaffTask({ payload }, { call }) {
      try {
        const res = yield call(uploadStaffTask, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getStaffActivity({ payload }, { call, put }) {
      try {
        const res = yield call(getStaffActivity, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'getStaffActivity',
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *applyStaffLeave({ payload }, { call }) {
      try {
        const res = yield call(applyStaffLeave, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *staffSuperviser({ payload }, { call, put }) {
      try {
        const res = yield call(staffSuperviser, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'staffSuperviser',
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getAllStaffLeave({ payload }, { call, put }) {
      try {
        const res = yield call(getAllStaffLeave, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'getAllStaffLeave',
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getStaffTasksList({ payload }, { call, put }) {
      try {
        const res = yield call(getStaffTasksList, payload);
        yield put({
          type: 'setStates',
          key: 'staffTasksList',
          payload: res,
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *addStaffSalary({ payload }, { call }) {
      try {
        const res = yield call(addStaffSalary, payload);

        return res;
      } catch (error) {
        return Promise.reject(error);
      }
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
