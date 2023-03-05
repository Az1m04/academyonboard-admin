import { addSudentWhatsAppTemplate } from '@/services/template';
import { deleteStudentWhatsAppTemplate } from '@/services/template';
import { getStudentWhatsAppTemplates } from '@/services/template';
import { searchStudentWhatsAppTemplates } from '@/services/template';
import { addClientWhatsAppTemplate } from '@/services/template';
import { deleteClientWhatsAppTemplate } from '@/services/template';
import { getClientWhatsAppTemplates } from '@/services/template';
import { searchClientWhatsAppTemplates } from '@/services/template';

const Model = {
  namespace: 'template',
  state: {
    studentWhatsAppTemplates: [],
    searchedStudentWhatsAppTemplates: [],
    clientWhatsAppTemplates: [],
    searchedclientWhatsAppTemplates: [],
  },
  effects: {
    *addSudentWhatsAppTemplate({ payload }, { call }) {
      const response = yield call(addSudentWhatsAppTemplate, payload);
      return response;
    },

    *deleteStudentWhatsAppTemplate({ payload }, { call }) {
      const response = yield call(deleteStudentWhatsAppTemplate, payload);
      return response;
    },

    *getStudentWhatsAppTemplates({ payload }, { call, put }) {
      const response = yield call(getStudentWhatsAppTemplates, payload);
      yield put({
        type: 'setStates',
        payload: response,
        key: 'studentWhatsAppTemplates',
      });
      return response;
    },
    *searchStudentWhatsAppTemplates({ payload }, { call, put }) {
      const response = yield call(searchStudentWhatsAppTemplates, payload);
      yield put({
        type: 'setStates',
        payload: response,
        key: 'searchedStudentWhatsAppTemplates',
      });
      return response;
    },

    *addClientWhatsAppTemplate({ payload }, { call }) {
      const response = yield call(addClientWhatsAppTemplate, payload);
      return response;
    },

    *deleteClientWhatsAppTemplate({ payload }, { call }) {
      const response = yield call(deleteClientWhatsAppTemplate, payload);
      return response;
    },

    *getClientWhatsAppTemplates({ payload }, { call, put }) {
      const response = yield call(getClientWhatsAppTemplates, payload);
      yield put({
        type: 'setStates',
        payload: response,
        key: 'clientWhatsAppTemplates',
      });
      return response;
    },
    *searchClientWhatsAppTemplates({ payload }, { call, put }) {
      const response = yield call(searchClientWhatsAppTemplates, payload);
      yield put({
        type: 'setStates',
        payload: response,
        key: 'searchedclientWhatsAppTemplates',
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
