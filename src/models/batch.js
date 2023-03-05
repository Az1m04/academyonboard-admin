import {
  addBatch,
  getBatches,
  changeActivityStatus,
  getBatchDetails,
  addStudentsToBatch,
  getTrainers,
  addTeachersToBatch,
  getStudentAssignToBatch,
  getTrainerAssignToBatch,
  removeTrainerFromBatch,
  removeStudentFromBatch,
  getParticularBatch,
  updateBatch,
  getTeachingScheduleList,
  assignTeachingSchedule,
  getAssignedTeachingSchedule,
  removeTeachingSchedule,
} from '@/services/batch';

const Model = {
  namespace: 'batch',
  state: {
    batchRecord: null,
    trainersOfCurrentBatch: null,
    studentsOfCurrentBatch: null,
    getParticularBatch: null,
    getTeachingScheduleList: null,
    getAssignedTeachingSchedule: null,
  },
  effects: {
    *addBatch({ payload }, { call }) {
      try {
        const res = yield call(addBatch, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *updateBatch({ payload }, { call }) {
      try {
        const res = yield call(updateBatch, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getBatches({ payload }, { call, put }) {
      const res = yield call(getBatches, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'batchRecord',
      });
      return res;
    },
    *changeActivityStatus({ payload }, { call }) {
      try {
        const res = yield call(changeActivityStatus, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getParticularBatch({ payload }, { call, put }) {
      try {
        const res = yield call(getParticularBatch, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'getParticularBatch',
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getBatchDetails({ payload }, { call, put }) {
      try {
        const res = yield call(getBatchDetails, payload);

        yield put({
          type: 'setStates',
          payload: res,
          key: 'currentBatchDetails',
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getStudentAssignToBatch({ payload }, { call, put }) {
      try {
        const res = yield call(getStudentAssignToBatch, payload);

        yield put({
          type: 'setStates',
          payload: res,
          key: 'studentsOfCurrentBatch',
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getTrainerAssignToBatch({ payload }, { call, put }) {
      try {
        const res = yield call(getTrainerAssignToBatch, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'trainersOfCurrentBatch',
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *addStudentsToBatch({ payload }, { call }) {
      try {
        const res = yield call(addStudentsToBatch, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },

    *getTrainers({ payload }, { call }) {
      try {
        const res = yield call(getTrainers, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *addTeachersToBatch({ payload }, { call }) {
      try {
        const res = yield call(addTeachersToBatch, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *removeTrainerFromBatch({ payload }, { call, select, put }) {
      try {
        const res = yield call(removeTrainerFromBatch, payload);
        const prevTrainersOfCurrentBatch = yield select(
          ({ batch }) => batch.trainersOfCurrentBatch,
        );
        const currTrainersOfCurrentBatch = prevTrainersOfCurrentBatch?.filter(
          (trainer) => trainer?.id !== payload?.pathParams?.trainerId,
        );
        yield put({
          type: 'setStates',
          payload: currTrainersOfCurrentBatch,
          key: 'trainersOfCurrentBatch',
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getTeachingScheduleList({ payload }, { call, put }) {
      try {
        const res = yield call(getTeachingScheduleList, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'getTeachingScheduleList',
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *assignTeachingSchedule({ payload }, { call }) {
      try {
        const res = yield call(assignTeachingSchedule, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *removeTeachingSchedule({ payload }, { call }) {
      try {
        const res = yield call(removeTeachingSchedule, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getAssignedTeachingSchedule({ payload }, { call, put }) {
      try {
        const res = yield call(getAssignedTeachingSchedule, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'getAssignedTeachingSchedule',
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *removeStudentFromBatch({ payload }, { call, select, put }) {
      try {
        const res = yield call(removeStudentFromBatch, payload);
        const prevTrainersOfCurrentBatch = yield select(
          ({ batch }) => batch.studentsOfCurrentBatch,
        );
        const currStudentsOfCurrentBatch = prevTrainersOfCurrentBatch?.filter(
          (student) => student?.student?.id !== payload?.pathParams?.studentId,
        );
        yield put({
          type: 'setStates',
          payload: currStudentsOfCurrentBatch,
          key: 'studentsOfCurrentBatch',
        });

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
