import { getServices, attachServiceDocuments, createService } from '@/services/service';

const Model = {
  namespace: 'service',
  state: {
    services: null,
  },
  effects: {
    *getServices({ payload }, { call, put }) {
      let res;
      let err;

      try {
        res = yield call(getServices, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'services',
        });
      } catch (error) {
        err = error;
      }
      return { err, res };
    },

    *attachServiceDocuments({ payload }, { call }) {
      const response = yield call(attachServiceDocuments, payload);
      return response;
    },

    *createService({ payload }, { call }) {
      let res;
      let err;
      try {
        res = yield call(createService, payload);
      } catch (error) {
        err = error;
      }
      return { err, res };
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
