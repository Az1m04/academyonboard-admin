import { addStudentEmailTemplate } from '@/services/email';
import { getStudentEmailTemplate } from '@/services/email';
import { deleteStudentEmailTemplate } from '@/services/email';

import { addClientEmailTemplate } from '@/services/email';
import { getClientEmailTemplate } from '@/services/email';
import { deleteClientEmailTemplate, sendEmailSingleLead, sendEmailInBulk } from '@/services/email';

const Model = {
  namespace: 'email',
  state: {
    studentEmailTemplates: [],
    clientEmailTemplates: [],
  },
  effects: {
    // Student Templates

    *sendEmailSingleLead({ payload }, { call }) {
      const res = yield call(sendEmailSingleLead, payload);
      return res;
    },
    *sendEmailInBulk({ payload }, { call }) {
      const res = yield call(sendEmailInBulk, payload);
      return res;
    },
    *addStudentEmailTemplate({ payload }, { call }) {
      const response = yield call(addStudentEmailTemplate, payload);
      return response;
    },
    *deleteStudentEmailTemplate({ payload }, { call }) {
      const response = yield call(deleteStudentEmailTemplate, payload);
      return response;
    },
    *getStudentEmailTemplate({ payload }, { call, put }) {
      const response = yield call(getStudentEmailTemplate, payload);
      yield put({
        type: 'setStates',
        payload: response,
        key: 'studentEmailTemplates',
      });
      return response;
    },

    // Client Templates

    *addClientEmailTemplate({ payload }, { call }) {
      const response = yield call(addClientEmailTemplate, payload);
      return response;
    },
    *deleteClientEmailTemplate({ payload }, { call }) {
      const response = yield call(deleteClientEmailTemplate, payload);
      return response;
    },
    *getClientEmailTemplate({ payload }, { call, put }) {
      const response = yield call(getClientEmailTemplate, payload);
      yield put({
        type: 'setStates',
        payload: response,
        key: 'clientEmailTemplates',
      });
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
export default Model;
