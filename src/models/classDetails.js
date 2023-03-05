import {
  addClass,
  getClass,
  getClassById,
  updateClass,
  deleteClass,
  changeActivityStatus,
} from '@/services/classDetails';

const Model = {
  namespace: 'classDetails',
  state: {
    allClasses: null,
    classRecordById: null,
    deleteClass: null,
    // changeActivityStatus: null,
  },
  effects: {
    *addClass({ payload }, { call }) {
      const res = yield call(addClass, payload);
      return res;
    },

    *getClass({ payload }, { call, put }) {
      try {
        const res = yield call(getClass, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'allClasses',
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getClassById({ payload }, { call, put }) {
      const res = yield call(getClassById, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'classRecordById',
      });
      return res;
    },
    *updateClass({ payload }, { call }) {
      const res = yield call(updateClass, payload);

      return res;
    },
    *deleteClass({ payload }, { call }) {
      try {
        const res = yield call(deleteClass, payload);

        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *changeActivityStatus({ payload }, { call }) {
      try {
        const res = yield call(changeActivityStatus, payload);
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
