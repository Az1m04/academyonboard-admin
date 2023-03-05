import { getDashBoardAnalytical } from '@/services/dashboard';

const Model = {
  namespace: 'dashboard',
  state: {
    dashBoardAnalytical: null,
  },
  effects: {
    *getDashBoardAnalytical({ payload }, { call, put }) {
      try {
        const res = yield call(getDashBoardAnalytical, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'dashBoardAnalytical',
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
