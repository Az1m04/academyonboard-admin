import { callApi } from '@/utils/apiUtils';
import { endUser } from '@/utils/endpoints/endUser';

export const uploadPublicHolidays = ({ body }) =>
  callApi({ uriEndPoint: endUser.uploadPublicHolidays.v1, body })
    .then((res) => ({ ...res, isUploaded: 'ok' }))
    .catch((err) => ({ ...err, isUploaded: 'notok' }));

export const uploadCorrectPublicHolidays = ({ body }) =>
  callApi({ uriEndPoint: endUser.uploadCorrectPublicHolidays.v1, body })
    .then((res) => ({ ...res, isUploaded: 'ok' }))
    .catch((err) => ({ ...err, isUploaded: 'notok' }));
