import apiEndPoints from '@/utils/apiEndPoints';
import { callApi } from '@/utils/apiUtils';

export const addLead = ({ body }) =>
  callApi({ uriEndPoint: apiEndPoints.students.addLead.v1, body }).then((res) => ({ ...res, status: 'ok' })).catch((err) => ({ ...err, status: 'notok' }));
