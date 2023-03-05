import {
  getBatches,
  postModuleTimeSlot,
  getBatchesModuleSlots,
  getIsTimeslotExit,
  getFreeTeachers,
  deleteModuleTimeslot,
  getAllTeachers,
  replaceTeacher,
  updateModuleTimeSlot,
  getTeacherFreeTimeslot,
  getClassesFreeSlot,
  getTrainerAssignToBatch,
} from '@/services/timetable';

const Model = {
  namespace: 'timetable',
  state: {
    BatchesList: null,
    singleBatchSlot: null,
    freeTeachersList: null,
    allTeachersList: null,
    teacherFreeTimeslotList: null,
    classesFreeTimeslotList: null,
    trainersOfCurrentBatch: null,
  },
  effects: {
    *getBatches({ payload }, { call, put }) {
      try {
        const res = yield call(getBatches, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'BatchesList',
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *postModuleTimeSlot({ payload }, { call }) {
      try {
        const res = yield call(postModuleTimeSlot, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getBatchesModuleSlots({ payload }, { call, put }) {
      try {
        const res = yield call(getBatchesModuleSlots, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'singleBatchSlot',
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getIsTimeslotExit({ payload }, { call }) {
      try {
        const res = yield call(getIsTimeslotExit, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getFreeTeachers({ payload }, { call, put }) {
      try {
        const res = yield call(getFreeTeachers, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'freeTeachersList',
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getAllTeachers({ payload }, { call, put }) {
      try {
        const res = yield call(getAllTeachers, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'allTeachersList',
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *deleteModuleTimeslot({ payload }, { call }) {
      try {
        const res = yield call(deleteModuleTimeslot, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *replaceTeacher({ payload }, { call }) {
      try {
        const res = yield call(replaceTeacher, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *updateModuleTimeSlot({ payload }, { call }) {
      try {
        const res = yield call(updateModuleTimeSlot, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getTeacherFreeTimeslot({ payload }, { call, put }) {
      try {
        const res = yield call(getTeacherFreeTimeslot, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'teacherFreeTimeslotList',
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getClassesFreeSlot({ payload }, { call, put }) {
      try {
        const res = yield call(getClassesFreeSlot, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'classesFreeTimeslotList',
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
