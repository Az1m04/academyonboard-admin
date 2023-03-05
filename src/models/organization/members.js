/**
 * For managing members for an organization.
 */

import { listOrganizationMembers } from '@/services/Organization/Member';

const UserModel = {
  namespace: 'orgMembers',
  state: {
    members: [],
    departments: [],
    invitations: [],
    appRole: { role: '' },
    memberListOfParticularRoleType: {},
  },
  effects: {
    *listOrganizationMembers({ payload, cb }, { call, put, select }) {
      const id = yield select(
        (state) => state.user.currentUser?.personalDetails?.organizationDetails?.orgPartyGroupId,
      );

      let response;
      try {
        response = yield call(listOrganizationMembers, { ...payload, accountId: id });
      } catch (err) {
        //
      }
      if (response) {
        yield put({
          type: 'setStates',
          payload: response,
          key: 'members',
        });
      }
      if (cb) cb(response);

      return response;
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
export default UserModel;
