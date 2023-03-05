import {
  inviteVendor,
  awaitingVendors,
  getVendors,
  acceptVendor,
  setPassword,
} from '@/services/vendors';

const Model = {
  namespace: 'vendor',
  state: {
    vendors: null,
    pendingVendors: null,
  },
  effects: {
    *inviteVendor({ payload }, { call }) {
      const res = yield call(inviteVendor, payload);
      return res;
    },
    *acceptVendor({ payload }, { call }) {
      const res = yield call(acceptVendor, payload);
      return res;
    },
    *setPassword({ payload }, { call }) {
      const res = yield call(setPassword, payload);
      return res;
    },
    *awaitingVendors({ payload }, { call, put }) {
      const res = yield call(awaitingVendors, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'pendingVendors',
      });
      return res;
    },
    *getVendors({ payload }, { call, put }) {
      const res = yield call(getVendors, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'vendors',
      });
      return res;
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
