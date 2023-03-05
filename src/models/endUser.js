import { uploadPublicHolidays, uploadCorrectPublicHolidays } from '@/services/endUser';

const Model = {
  namespace: 'endUser',
  state: {
    uploadPublicHolidays: null,
    uploadCorrectPublicHolidays: null,
  },

  effects: {
    *uploadPublicHolidays({ payload }, { call, put }) {
      const res = yield call(uploadPublicHolidays, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'uploadPublicHolidays',
      });
      return res;
    },
    *uploadCorrectPublicHolidays({ payload }, { call, put }) {
      const res = yield call(uploadCorrectPublicHolidays, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'uploadCorrectPublicHolidays',
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
