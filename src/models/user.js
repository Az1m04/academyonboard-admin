import {
  queryCurrent,
  userAvatar,
  userRegister,
  forgotUserPassword,
  updateUserPassword,
  resetUserPassword,
  updateCurrent,
} from '@/services/user';
import { setAuthority } from '@/utils/authority';

const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {},
  },
  effects: {
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
      if (response?.isAdmin) {
        setAuthority('admin');
      } else if (response?.isSupplier) {
        setAuthority('supplier');
      } else {
        setAuthority('user');
      }
      return response;
    },
    *userRegister({ payload, cb }, { call }) {
      const res = yield call(userRegister, payload);
      if (cb) cb(res);
    },
    *updateCurrent({ payload }, { call }) {
      const res = yield call(updateCurrent, payload);
      return res;
    },
    *userAvatarUpload({ payload, cb }, { call }) {
      const res = yield call(userAvatar, payload);
      if (cb) cb(res);
    },
    *userForgotPassword({ payload }, { call }) {
      const res = yield call(forgotUserPassword, payload);
      return res;
    },
    *resetUserPassword({ payload }, { call }) {
      const res = yield call(updateUserPassword, payload);
      return res;
    },
    *resetUserPasswordOnAccountCreation({ payload }, { call }) {
      return yield call(resetUserPassword, payload);
    },
  },
  reducers: {
    saveCurrentUser(state, action) {
      return { ...state, currentUser: action.payload || {} };
    },

    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
export default UserModel;
