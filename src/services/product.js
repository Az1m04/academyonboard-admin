import { callApi, hostname } from '@/utils/apiUtils';
import { product } from '@/utils/endpoints/product';
import Axios from 'axios';

export const getCategories = ({ query }) =>
  callApi({ uriEndPoint: product.getCategories.v1, query })
    .then((res) => res)
    .catch((err) => err);

export const getProductTags = () =>
  callApi({ uriEndPoint: product.getProductTags.v1 })
    .then((res) => res)
    .catch((err) => err);

export const createProduct = ({ body }) =>
  callApi({ uriEndPoint: product.create.v1, body })
    .then((res) => res)
    .catch((err) => err);

export const attachDocuments = async ({ data, id }) =>
  Axios.post(`${hostname()}/xapi/v1/products/${id}/content`, data, {
    headers: {
      accessToken: localStorage.getItem('accessToken'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

export const getProducts = ({ query }) =>
  callApi({ uriEndPoint: product.getProducts.v1, query })
    .then((res) => res)
    .catch((err) => err);

export const getProductDetails = ({ pathParams }) =>
  callApi({ uriEndPoint: product.getProductDetails.v1, pathParams })
    .then((res) => res)
    .catch((err) => err);

export const getProductAttachments = ({ pathParams }) =>
  callApi({ uriEndPoint: product.getProductAttachments.v1, pathParams })
    .then((res) => res)
    .catch((err) => err);

export const updateProduct = ({ pathParams, body }) =>
  callApi({ uriEndPoint: product.updateProduct.v1, pathParams, body })
    .then((res) => res)
    .catch((err) => err);

export const removeAttachment = ({ pathParams }) =>
  callApi({ uriEndPoint: product.removeAttachment.v1, pathParams })
    .then((res) => res)
    .catch((err) => err);

export const getProductVariants = ({ pathParams }) =>
  callApi({ uriEndPoint: product.variants.v1, pathParams })
    .then((res) => res)
    .catch((err) => err);
