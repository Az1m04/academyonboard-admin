import {
  getCountriesList,
  getCountryStates,
  uploadContent,
  getTelephonicCode,
  getPaymentMethods,
  paymentCheckOutComplete,
  getCommonColors,
} from '@/services/common';

const Model = {
  namespace: 'common',
  state: {
    stateCodes: null,
    contentId: null,
    countriesList: null,
    telephonicCode: [],
    colors: null,
  },
  effects: {
    *getColors({ payload }, { call, put }) {
      const response = yield call(getCommonColors, payload);

      yield put({
        type: 'setStates',
        payload: response,
        key: 'colors',
      });
    },
    *getStateCodes({ payload }, { call, put }) {
      const res = yield call(getCountryStates, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'stateCodes',
      });
    },
    *getCountriesList({ payload }, { call, put }) {
      const res = yield call(getCountriesList, payload);
      yield put({
        type: 'setStates',
        payload: res?.data || [],
        key: 'countriesList',
      });
      return res?.data || [];
    },
    *getTelephonicCode(_, { call, put }) {
      const res = yield call(getTelephonicCode);
      const teleInfo = res?.data?.map((item) => {
        return {
          ...item,
          formattedTeleCode: `+${item?.teleCode}`,
        };
      });
      yield put({
        type: 'setStates',
        payload: teleInfo,
        key: 'telephonicCode',
      });
      return res;
    },

    *uploadContent({ payload }, { call, put }) {
      const res = yield call(uploadContent, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'contentId',
      });
      return res;
    },
    *getPaymentMethods({ payload }, { call, put }) {
      let apiResponse;
      let err;
      try {
        apiResponse = yield call(getPaymentMethods, payload);
        yield put({
          type: 'setStates',
          payload: apiResponse,
          key: 'paymentMethods',
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
    *paymentCheckOutComplete({ payload }, { call }) {
      let apiResponse;
      let err;
      try {
        apiResponse = yield call(paymentCheckOutComplete, payload);
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
