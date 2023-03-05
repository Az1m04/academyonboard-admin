import { callApi } from '@/utils/apiUtils';
import { email } from '@/utils/endpoints/email';

// Student Templates

export const addStudentEmailTemplate = ({ body, pathParams, query }) =>
  callApi({
    uriEndPoint: email.addStudentEmailTemplate.v1,
    body,
    pathParams,
    query,
  })
    .then((res) => res)
    .catch((err) => err);

export const deleteStudentEmailTemplate = ({ pathParams }) =>
  callApi({ uriEndPoint: email.deleteStudentEmailTemplate.v1, pathParams })
    .then((res) => res)
    .catch((err) => err);

export const getStudentEmailTemplate = ({ pathParams, query }) =>
  callApi({ uriEndPoint: email.getStudentEmailTemplate.v1, pathParams, query })
    .then((res) => res)
    .catch((err) => err);

export const sendEmailSingleLead = ({ pathParams, body }) =>
  callApi({ uriEndPoint: email.sendEmailSingleLead.v1, pathParams, body });

export const sendEmailInBulk = ({ body }) =>
  callApi({ uriEndPoint: email.sendEmailInBulk.v1, body });

// Client Templates

export const addClientEmailTemplate = ({ body, pathParams, query }) =>
  callApi({
    uriEndPoint: email.addClientEmailTemplate.v1,
    body,
    pathParams,
    query,
  })
    .then((res) => res)
    .catch((err) => err);

export const deleteClientEmailTemplate = ({ pathParams }) =>
  callApi({ uriEndPoint: email.deleteClientEmailTemplate.v1, pathParams })
    .then((res) => res)
    .catch((err) => err);

export const getClientEmailTemplate = ({ pathParams, query }) =>
  callApi({ uriEndPoint: email.getClientEmailTemplate.v1, pathParams, query })
    .then((res) => res)
    .catch((err) => err);
