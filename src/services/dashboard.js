import { callApi } from '@/utils/apiUtils';
import { dashboard } from '@/utils/endpoints/dashboard';

export const getDashBoardAnalytical = () =>
  callApi({ uriEndPoint: dashboard.getDashBoardAnalytical.v1 });
