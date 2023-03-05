import {
  attachDocuments,
  createCollection,
  getCollectionDetails,
  removeAttachment,
  updateCollection,
} from '@/services/collection';

const Model = {
  namespace: 'collection',
  state: {
    collectionDetails: null,
    collectionAttachments: null,
  },
  effects: {
    *attachDocuments({ payload }, { call }) {
      const response = yield call(attachDocuments, payload);
      return response;
    },

    *createCollection({ payload }, { call }) {
      let res;
      let err;
      try {
        res = yield call(createCollection, payload);
      } catch (error) {
        err = error;
      }
      return { err, res };
    },
    *updateCollection({ payload }, { call, put }) {
      let res;
      let err;
      try {
        res = yield call(updateCollection, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'collectionDetails',
        });
      } catch (error) {
        err = error;
      }
      return { err, res };
    },

    *getCollectionDetails({ payload }, { call, put }) {
      let res;
      let err;
      try {
        res = yield call(getCollectionDetails, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'collectionDetails',
        });
        yield put({
          type: 'setStates',
          payload: res?.categoryContent,
          key: 'collectionAttachments',
        });
      } catch (error) {
        err = error;
      }
      return { err, res };
    },
    *removeAttachment({ payload }, { call, put, select }) {
      let res;
      let err;
      try {
        res = yield call(removeAttachment, payload);
        const list = yield select((state) => state.collection.collectionDetails.categoryContent);
        const data = list?.filter((p) => p.contentId !== payload.pathParams.contentId);
        yield put({
          type: 'setStates',
          payload: data,
          key: 'collectionAttachments',
        });
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
