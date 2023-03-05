import { callApi, hostname } from '@/utils/apiUtils';
import { service } from '@/utils/endpoints/service';
import Axios from 'axios';

export const createService = ({ body }) =>
  callApi({ uriEndPoint: service.create.v1, body })
    .then((res) => res)
    .catch((err) => err);

export const attachServiceDocuments = async ({ data, id }) =>
  Axios.post(`${hostname()}/xapi/v1/products/${id}/content`, data, {
    headers: {
      accessToken: localStorage.getItem('accessToken'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

export const getServices = ({ query }) =>
  callApi({ uriEndPoint: service.getServices.v1, query })
    .then((res) => res)
    .catch((err) => err);
