import { callApi } from '@/utils/apiUtils';
import { classDetails } from '@/utils/endpoints/classDetails';

export const addClass = ({ body }) =>
  callApi({ uriEndPoint: classDetails.addClass.v1, body })
    .then((res) => res)
    .catch((err) => err);

export const getClass = ({ query }) => callApi({ uriEndPoint: classDetails.getClass.v1, query });

export const getClassById = ({ pathParams }) =>
  callApi({ uriEndPoint: classDetails.getClassById.v1, pathParams })
    .then((res) => res)
    .catch((err) => err);

export const updateClass = ({ pathParams, body }) =>
  callApi({
    uriEndPoint: classDetails.updateClass.v1,
    pathParams,
    body,
  });
export const changeActivityStatus = ({ pathParams, body }) =>
  callApi({ uriEndPoint: classDetails.changeActivityStatus.v1, pathParams, body })
    .then((res) => res)
    .catch((err) => err);

export const deleteClass = ({ pathParams, query }) =>
  callApi({
    uriEndPoint: classDetails.deleteClass.v1,
    pathParams,
    query,
  });
