import { callApi } from '@/utils/apiUtils';
import { subBranch } from '@/utils/endpoints/subBranch';

export const postSubBranch = ({ body }) =>
  callApi({ uriEndPoint: subBranch.postSubBranch.v1, body });
export const getSubBranches = ({ query }) =>
  callApi({ uriEndPoint: subBranch.getSubBranches.v1, query });
export const getSingleSubBranch = ({ pathParams }) =>
  callApi({ uriEndPoint: subBranch.getSingleSubBranch.v1, pathParams });
export const putSubBranch = ({ body, pathParams }) =>
  callApi({ uriEndPoint: subBranch.putSubBranch.v1, body, pathParams });
export const disableSubBranch = ({ pathParams }) =>
  callApi({ uriEndPoint: subBranch.disableSubBranch.v1, pathParams });
