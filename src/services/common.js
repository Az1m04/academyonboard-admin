import { hostname, callApi } from '@/utils/apiUtils';
import { common } from '@/utils/endpoints/common';
import Axios from 'axios';

export const getCountryStates = ({ pathParams: { countryId } }) =>
  Axios.get(`${hostname()}/xapi/v1/common/country/${countryId}/provinces`)
    .then((result) => result.data)
    .catch(() => {});

export const getCountriesList = () =>
  Axios({
    method: 'get',
    url: `${hostname()}/xapi/v1/common/country`,
  })
    .then((response) => {
      const status = 'ok';
      return {
        data: response.data,
        status,
      };
    })
    .catch(() => {
      const status = 'notok';
      return {
        status,
      };
    });

export const getTelephonicCode = () =>
  Axios({
    method: 'get',
    url: `${hostname()}/xapi/v1/common/country/telephonicCode`,
  })
    .then((response) => {
      const status = 'ok';
      return {
        data: response.data,
        status,
      };
    })
    .catch(() => {
      const status = 'notok';
      return {
        status,
      };
    });

export const uploadContent = (body) =>
  callApi({ uriEndPoint: common.uploadContent.v1, body })
    .then((res) => res)
    .catch((err) => err);
export const getPaymentMethods = ({ pathParams, query }) =>
  callApi({ uriEndPoint: common.getPaymentMethods.v1, pathParams, query });

export const paymentCheckOutComplete = ({ body, pathParams }) =>
  callApi({ uriEndPoint: common.paymentCheckOutComplete.v1, body, pathParams });

// TODO
// export const getCommonColors = () => {
//   return callApi({
//     uriEndPoint: common.getCommonColors.v1,
//   });
// }

export const getCommonColors = () =>
  callApi({ uriEndPoint: common.getCommonColors.v1 })
    .then((res) => res)
    .catch((err) => err);
