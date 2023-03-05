import apiEndPoints from '@/utils/apiEndPoints';
import { common } from '@/utils/endpoints/common';
import { callApi } from '@/utils/apiUtils';

export const inviteVendor = ({ body }) =>
  callApi({
    uriEndPoint: apiEndPoints.vendor.invite.v1,
    body,
  })
    .then((res) => res)
    .catch(() => {});

export const awaitingVendors = () =>
  callApi({
    uriEndPoint: apiEndPoints.vendor.awaiting.v1,
  })
    .then((res) => res)
    .catch(() => {});

export const getVendors = () =>
  callApi({
    uriEndPoint: apiEndPoints.vendor.getVendors.v1,
  })
    .then((res) => res)
    .catch(() => {});

export const acceptVendor = ({ body }) =>
  callApi({
    uriEndPoint: apiEndPoints.vendor.acceptVendor.v1,
    body,
  })
    .then((res) => res)
    .catch(() => {});

export const setPassword = ({ body }) =>
  callApi({
    uriEndPoint: common.setPassword.v1,
    body,
  })
    .then((res) => res)
    .catch(() => {});
