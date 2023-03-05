import {
  getSubBranches,
  postSubBranch,
  getSingleSubBranch,
  putSubBranch,
  disableSubBranch,
} from '@/services/subBranch';

const Model = {
  namespace: 'subBranch',
  state: { subBranchesList: null, singleSubBranch: null },
  effects: {
    *postSubBranch({ payload }, { call }) {
      try {
        const res = yield call(postSubBranch, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *putSubBranch({ payload }, { call }) {
      try {
        const res = yield call(putSubBranch, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *disableSubBranch({ payload }, { call }) {
      try {
        const res = yield call(disableSubBranch, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getSubBranches({ payload }, { call, put }) {
      try {
        const res = yield call(getSubBranches, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'subBranchesList',
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getSingleSubBranch({ payload }, { call, put }) {
      try {
        const res = yield call(getSingleSubBranch, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'singleSubBranch',
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
