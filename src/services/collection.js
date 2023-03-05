import { callApi, hostname } from '@/utils/apiUtils';
import { collection } from '@/utils/endpoints/collection';
import Axios from 'axios';

export const createCollection = ({ body }) =>
  callApi({ uriEndPoint: collection.create.v1, body })
    .then((res) => res)
    .catch((err) => err);

export const attachDocuments = async ({ data, id }) =>
  Axios.post(`${hostname()}/xapi/v1/products/categories/${id}/content`, data, {
    headers: {
      accessToken: localStorage.getItem('accessToken'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

export const getCollectionDetails = ({ pathParams }) =>
  callApi({ uriEndPoint: collection.getCollectionDetails.v1, pathParams })
    .then((res) => res)
    .catch((err) => err);

export const removeAttachment = ({ pathParams }) =>
  callApi({ uriEndPoint: collection.removeAttachment.v1, pathParams })
    .then((res) => res)
    .catch((err) => err);

export const updateCollection = ({ pathParams, body }) =>
  callApi({ uriEndPoint: collection.updateCollection.v1, pathParams, body })
    .then((res) => res)
    .catch((err) => err);
