import {
  getCategories,
  getProductTags,
  createProduct,
  attachDocuments,
  getProducts,
  getProductDetails,
  getProductAttachments,
  updateProduct,
  removeAttachment,
  getProductVariants,
} from '@/services/product';

const Model = {
  namespace: 'product',
  state: {
    categories: null,
    collections: null,
    tags: null,
    products: null,
    productDetails: null,
    productAttachments: null,
    variants: null,
  },
  effects: {
    *getCategories({ payload }, { call, put }) {
      let res;
      let err;

      try {
        res = yield call(getCategories, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'categories',
        });
      } catch (error) {
        err = error;
      }
      return { err, res };
    },
    *getCollections({ payload }, { call, put }) {
      let res;
      let err;

      try {
        res = yield call(getCategories, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'collections',
        });
      } catch (error) {
        err = error;
      }
      return { err, res };
    },

    *getProductVariants({ payload }, { call, put }) {
      let res;
      let err;

      try {
        res = yield call(getProductVariants, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'variants',
        });
      } catch (error) {
        err = error;
      }
      return { err, res };
    },
    *updateProduct({ payload }, { call, put }) {
      let res;
      let err;

      try {
        res = yield call(updateProduct, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'productDetails',
        });
      } catch (error) {
        err = error;
      }
      return { err, res };
    },
    *getProducts({ payload }, { call, put }) {
      let res;
      let err;

      try {
        res = yield call(getProducts, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'products',
        });
      } catch (error) {
        err = error;
      }
      return { err, res };
    },

    *getProductAttachments({ payload }, { call, put }) {
      let res;
      let err;

      try {
        res = yield call(getProductAttachments, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'productAttachments',
        });
      } catch (error) {
        err = error;
      }
      return { err, res };
    },
    *attachDocuments({ payload }, { call }) {
      const response = yield call(attachDocuments, payload);
      return response;
    },

    *removeAttachment({ payload }, { call, put, select }) {
      let res;
      let err;
      try {
        res = yield call(removeAttachment, payload);
        const list = yield select((state) => state.product.productAttachments);
        const data = list?.filter((p) => p.contentId !== payload.pathParams.contentId);
        yield put({
          type: 'setStates',
          payload: data,
          key: 'productAttachments',
        });
      } catch (error) {
        err = error;
      }
      return { err, res };
    },
    *getProductTags({ payload }, { call, put }) {
      let res;
      let err;

      try {
        res = yield call(getProductTags, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'tags',
        });
      } catch (error) {
        err = error;
      }
      return { err, res };
    },
    *getProductDetails({ payload }, { call, put }) {
      let res;
      let err;

      try {
        res = yield call(getProductDetails, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'productDetails',
        });
      } catch (error) {
        err = error;
      }
      return { err, res };
    },
    *createProduct({ payload }, { call }) {
      let res;
      let err;
      try {
        res = yield call(createProduct, payload);
      } catch (error) {
        err = error;
      }
      return { err, res };
    },
  },
  reducers: {
    setStates(state, { payload, key }) {
      return {
        ...state,
        [key]: payload,
      };
    },
  },
};
export default Model;
