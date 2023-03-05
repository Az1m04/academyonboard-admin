import {
  getCourses,
  getCourseDetails,
  addCourse,
  addTest,
  uploadTestContent,
  deleteTestContent,
  deleteTest,
  getTests,
  getTestById,
  updateTest,
  editCourse,
  getCoursesCategory,
  getCoursesSubCategory,
  getCoursesFromSubCategory,
  getCourseDetailSingle,
  getCoursesDetail,
  uploadCourseContentFile,
  uploadCoursedetails,
  getCourseContent,
  postCapsule,
  getCapsule,
  updateCapsule,
  deleteuploadCoursedetail,
  deleteCapsule,
  deleteUploadFile,
  updateCourseContentFile,
  createCapsuleTableRow,
  deleteUploadCourseContents,
  getCoursesForTeachingSchedule,
  getTeachingCapsuleForClassTest,
  getTeachingCapsuleForMockTest,
  uploadTeachingSchedule,
  getTeachingSchedules,
  capsuleTableRowUpdate,
  deleteCapsuleFormTableRow,
  getUpdateCourseContents,
  getCoursesDetailForModule,
  getTopicCount,
  getCapsuleDetail,
  updateCourseDLevelDetails,
  getSingleTeachingSchedules,
  updateTeachingSchedule,
  deleteTeachingSchedule,
  getCourseContentDLevel,
  uploadCourseContentDetails,
  getCourseDifficultyLevels,
  updateAdditionalFileName,
  getSingleCourse,
} from '@/services/courses';

const Model = {
  namespace: 'courses',
  state: {
    allCourses: [],
    singleCourseDetail: null,
    allTests: [],
    testRecordById: [],
    getCoursesCategory: [],
    getCoursesSubCategory: null,
    getCoursesFromSubCategory: null,
    getCourseDetailSingle: null,
    getSingleCourse: null,
    getCoursesDetail: null,
    getCourseContent: null,
    getCapsule: null,
    postCapsuleResponse: null,
    getCoursesForTeachingSchedule: null,
    getTeachingCapsuleForClassTest: null,
    getTeachingCapsuleForMockTest: null,
    getTeachingSchedules: null,
    getSingleTeachingSchedules: null,
    getTopicCount: null,
    getUpdateCourseContents: null,
    getCoursesDetailForModule: null,
    getCapsuleDetail: null,
    getCourseContentDLevel: null,
    difficultyLevelsExistingList: null,
  },
  effects: {
    *getCourses({ payload }, { call, put }) {
      const res = yield call(getCourses, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'allCourses',
      });
    },
    *getCourseDetailSingle({ payload }, { call, put }) {
      const res = yield call(getCourseDetailSingle, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'getCourseDetailSingle',
      });
    },
    *getSingleCourse({ payload }, { call, put }) {
      try {
        const res = yield call(getSingleCourse, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'getSingleCourse',
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getCoursesDetail({ payload }, { call, put }) {
      const res = yield call(getCoursesDetail, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'getCoursesDetail',
      });
    },
    *getCoursesDetailForModule({ payload }, { call, put }) {
      const res = yield call(getCoursesDetailForModule, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'getCoursesDetailForModule',
      });
    },
    *uploadCourseContentFile({ payload }, { call }) {
      try {
        const res = yield call(uploadCourseContentFile, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *deleteUploadCourseContents({ payload }, { call }) {
      const res = yield call(deleteUploadCourseContents, payload);
      return res;
    },
    *getCoursesForTeachingSchedule({ payload }, { call, put }) {
      try {
        const res = yield call(getCoursesForTeachingSchedule, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'getCoursesForTeachingSchedule',
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getTeachingCapsuleForClassTest({ payload }, { call, put }) {
      try {
        const res = yield call(getTeachingCapsuleForClassTest, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'getTeachingCapsuleForClassTest',
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getTeachingCapsuleForMockTest({ payload }, { call, put }) {
      try {
        const res = yield call(getTeachingCapsuleForMockTest, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'getTeachingCapsuleForMockTest',
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *uploadTeachingSchedule({ payload }, { call }) {
      try {
        const res = yield call(uploadTeachingSchedule, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getTeachingSchedules({ payload }, { call, put }) {
      try {
        const res = yield call(getTeachingSchedules, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'getTeachingSchedules',
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getSingleTeachingSchedules({ payload }, { call, put }) {
      try {
        const res = yield call(getSingleTeachingSchedules, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'getSingleTeachingSchedules',
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *updateTeachingSchedule({ payload }, { call }) {
      try {
        const res = yield call(updateTeachingSchedule, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *deleteTeachingSchedule({ payload }, { call }) {
      const res = yield call(deleteTeachingSchedule, payload);
      return res;
    },
    *getUpdateCourseContents({ payload }, { call, put }) {
      try {
        const res = yield call(getUpdateCourseContents, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'getUpdateCourseContents',
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *deleteuploadCoursedetail({ payload }, { call }) {
      const res = yield call(deleteuploadCoursedetail, payload);
      return res;
    },
    *deleteUploadFile({ payload }, { call }) {
      const res = yield call(deleteUploadFile, payload);
      return res;
    },
    *updateCourseContentFile({ payload }, { call }) {
      try {
        const res = yield call(updateCourseContentFile, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *updateCourseDLevelDetails({ payload }, { call }) {
      try {
        const res = yield call(updateCourseDLevelDetails, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *uploadCoursedetails({ payload }, { call }) {
      try {
        const res = yield call(uploadCoursedetails, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getCourseContent({ payload }, { call, put }) {
      try {
        const res = yield call(getCourseContent, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'getCourseContent',
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getCoursesCategory({ payload }, { call, put }) {
      const res = yield call(getCoursesCategory, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'getCoursesCategory',
      });
      return res;
    },
    *getCoursesSubCategory({ payload }, { call, put }) {
      const res = yield call(getCoursesSubCategory, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'getCoursesSubCategory',
      });
      return res;
    },

    *getCoursesFromSubCategory({ payload }, { call, put }) {
      const res = yield call(getCoursesFromSubCategory, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'getCoursesFromSubCategory',
      });
      return res;
    },

    *addCourse({ payload }, { call }) {
      try {
        const res = yield call(addCourse, payload);

        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *editCourse({ payload }, { call }) {
      try {
        const res = yield call(editCourse, payload);

        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getCourseDetails({ payload }, { call, put }) {
      const res = yield call(getCourseDetails, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'singleCourseDetail',
      });
      return res;
    },

    *addTest({ payload }, { call }) {
      const res = yield call(addTest, payload);
      return res;
    },
    *uploadTestContent({ payload }, { call }) {
      try {
        const res = yield call(uploadTestContent, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *deleteTestContent({ payload }, { call }) {
      try {
        const res = yield call(deleteTestContent, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *deleteTest({ payload }, { call }) {
      try {
        const res = yield call(deleteTest, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *updateTest({ payload }, { call }) {
      const res = yield call(updateTest, payload);
      return res;
    },

    *getTests({ payload }, { call, put }) {
      const res = yield call(getTests, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'allTests',
      });
    },
    *getTestById({ payload }, { call, put }) {
      let apiResponse;
      let err;
      try {
        apiResponse = yield call(getTestById, payload);
        yield put({
          type: 'setStates',
          payload: apiResponse,
          key: 'testRecordById',
        });
      } catch (error) {
        // extract the error response from the server
        err = error;
      }
      if (err) {
        // some api level error occurred. This can be handled in dispatch
        return Promise.reject(err);
      }
      return apiResponse;
    },
    *postCapsule({ payload }, { call, put }) {
      const res = yield call(postCapsule, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'postCapsuleResponse',
      });
      return res;
    },
    *getCapsule({ payload }, { call, put }) {
      const res = yield call(getCapsule, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'getCapsule',
      });
    },
    *updateCapsule({ payload }, { call }) {
      const res = yield call(updateCapsule, payload);
      return res;
    },
    *deleteCapsule({ payload }, { call }) {
      const res = yield call(deleteCapsule, payload);
      return res;
    },
    *createCapsuleTableRow({ payload }, { call }) {
      try {
        const res = yield call(createCapsuleTableRow, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *capsuleTableRowUpdate({ payload }, { call }) {
      try {
        const res = yield call(capsuleTableRowUpdate, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *deleteCapsuleFormTableRow({ payload }, { call }) {
      try {
        const res = yield call(deleteCapsuleFormTableRow, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getTopicCount({ payload }, { call, put }) {
      try {
        const res = yield call(getTopicCount, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'getTopicCount',
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getCapsuleDetail({ payload }, { call, put }) {
      try {
        const res = yield call(getCapsuleDetail, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'getCapsuleDetail',
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getCourseContentDLevel({ payload }, { call, put }) {
      try {
        const res = yield call(getCourseContentDLevel, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'getCourseContentDLevel',
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getCourseDifficultyLevels({ payload }, { call, put }) {
      try {
        const res = yield call(getCourseDifficultyLevels, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'difficultyLevelsExistingList',
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *uploadCourseContentDetails({ payload }, { call }) {
      try {
        const res = yield call(uploadCourseContentDetails, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *updateAdditionalFileName({ payload }, { call }) {
      try {
        const res = yield call(updateAdditionalFileName, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
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
