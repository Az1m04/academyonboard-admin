import { callApi } from '@/utils/apiUtils';
import { template } from '@/utils/endpoints/template';

// Student Templates

export const addSudentWhatsAppTemplate = ({ body, pathParams, query }) =>
  callApi({ uriEndPoint: template.addSudentWhatsAppTemplate.v1, body, pathParams, query })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((err) => ({ ...err, status: 'notok' }));

export const deleteStudentWhatsAppTemplate = ({ pathParams }) =>
  callApi({ uriEndPoint: template.deleteStudentWhatsAppTemplate.v1, pathParams })
    .then((res) => res)
    .catch((err) => err);

export const getStudentWhatsAppTemplates = ({ pathParams, query }) =>
  callApi({ uriEndPoint: template.getStudentWhatsAppTemplates.v1, pathParams, query })
    .then((res) => res)
    .catch((err) => err);

export const searchStudentWhatsAppTemplates = ({ pathParams, query }) =>
  callApi({ uriEndPoint: template.searchStudentWhatsAppTemplates.v1, pathParams, query })
    .then((res) => res)
    .catch((err) => err);

// Client Templates

export const addClientWhatsAppTemplate = ({ body, pathParams, query }) =>
  callApi({ uriEndPoint: template.addClientWhatsAppTemplate.v1, body, pathParams, query })
    .then((res) => res)
    .catch((err) => err);

export const deleteClientWhatsAppTemplate = ({ pathParams }) =>
  callApi({ uriEndPoint: template.deleteClientWhatsAppTemplate.v1, pathParams })
    .then((res) => res)
    .catch((err) => err);

export const getClientWhatsAppTemplates = ({ pathParams, query }) =>
  callApi({ uriEndPoint: template.getClientWhatsAppTemplates.v1, pathParams, query })
    .then((res) => res)
    .catch((err) => err);

export const searchClientWhatsAppTemplates = ({ pathParams, query }) =>
  callApi({ uriEndPoint: template.searchClientWhatsAppTemplates.v1, pathParams, query })
    .then((res) => res)
    .catch((err) => err);
