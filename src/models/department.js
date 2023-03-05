import {
  createDepartment,
  deleteDepartment,
  getAllDepartment,
  updateDepartment,
} from '@/services/department';

const Model = {
  namespace: 'department',
  state: { departmentList: null },
  effects: {
    *createDepartment({ payload }, { call }) {
      const res = yield call(createDepartment, payload);
      return res;
    },
    *getAllDepartment(_, { call, put }) {
      const res = yield call(getAllDepartment);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'allDepartment',
      });
      return res;
    },
    *deleteDepartment({ payload }, { call }) {
      const res = yield call(deleteDepartment, payload);
      return res;
    },
    *updateDepartment({ payload }, { call }) {
      const res = yield call(updateDepartment, payload);
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
