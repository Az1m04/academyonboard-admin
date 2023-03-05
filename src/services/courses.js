import { callApi } from '@/utils/apiUtils';
import { courses } from '@/utils/endpoints/courses';

export const getCourses = ({ query }) =>
  callApi({ uriEndPoint: courses.getCourses.v1, query })
    .then((res) => {
      return res;
    })
    .catch((err) => err);
export const getCourseContent = ({ query }) =>
  callApi({ uriEndPoint: courses.getCourseContent.v1, query })
    .then((res) => {
      return res;
    })
    .catch((err) => err);
export const getCoursesCategory = ({ query }) =>
  callApi({ uriEndPoint: courses.getCoursesCategory.v1, query })
    .then((res) => {
      return res;
    })
    .catch((err) => err);
export const getCoursesSubCategory = ({ query }) =>
  callApi({ uriEndPoint: courses.getCoursesSubCategory.v1, query })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((err) => ({ ...err, status: 'notok' }));

export const getCoursesFromSubCategory = ({ query }) =>
  callApi({ uriEndPoint: courses.getCoursesFromSubCategory.v1, query })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((err) => ({ ...err, status: 'notok' }));

export const addCourse = ({ body }) =>
  callApi({ uriEndPoint: courses.addCourse.v1, body })
    .then((res) => {
      return res;
    })
    .catch((err) => err);

export const getCourseDetails = ({ pathParams, query }) =>
  callApi({ uriEndPoint: courses.getSingleCourseDetails.v1, pathParams, query })
    .then((res) => {
      return res;
    })
    .catch((err) => err);

export const addTest = ({ pathParams, body }) =>
  callApi({ uriEndPoint: courses.addTest.v1, pathParams, body })
    .then((res) => {
      return res;
    })
    .catch((err) => err);
export const uploadTestContent = ({ body }) =>
  callApi({ uriEndPoint: courses.uploadTestContent.v1, body });
export const deleteTestContent = ({ pathParams }) =>
  callApi({ uriEndPoint: courses.deleteTestContent.v1, pathParams });
export const deleteTest = ({ pathParams }) =>
  callApi({ uriEndPoint: courses.deleteTest.v1, pathParams });
export const updateTest = ({ pathParams, body }) =>
  callApi({ uriEndPoint: courses.updateTest.v1, pathParams, body })
    .then((res) => {
      return res;
    })
    .catch((err) => err);

export const getTests = ({ query }) =>
  callApi({ uriEndPoint: courses.getTests.v1, query })
    .then((res) => {
      return res;
    })
    .catch((err) => err);

export const getTestById = ({ pathParams }) =>
  callApi({ uriEndPoint: courses.getTestById.v1, pathParams });

export const editCourse = ({ pathParams, body }) =>
  callApi({ uriEndPoint: courses.editCourse.v1, pathParams, body });

export const getCourseDetailSingle = ({ pathParams, query }) =>
  callApi({ uriEndPoint: courses.getCourseDetailSingle.v1, pathParams, query });
export const postCapsule = ({ pathParams, body }) =>
  callApi({ uriEndPoint: courses.postCapsule.v1, pathParams, body })
    .then((res) => {
      return { ...res, status: 'ok' };
    })
    .catch((err) => err);
export const getCapsule = ({ query }) =>
  callApi({ uriEndPoint: courses.getCapsule.v1, query })
    .then((res) => {
      return res;
    })
    .catch((err) => err);
export const getSingleCourse = ({ query, pathParams }) =>
  callApi({ uriEndPoint: courses.getSingleCourse.v1, query, pathParams })
    .then((res) => {
      return res;
    })
    .catch((err) => err);
export const getCoursesDetail = ({ pathParams, query }) =>
  callApi({ uriEndPoint: courses.getCoursesDetail.v1, pathParams, query })
    .then((res) => {
      return res;
    })
    .catch((err) => err);
export const getCoursesDetailForModule = ({ pathParams, query }) =>
  callApi({ uriEndPoint: courses.getCoursesDetailForModule.v1, pathParams, query })
    .then((res) => {
      return res;
    })
    .catch((err) => err);

export const deleteuploadCoursedetail = ({ pathParams }) =>
  callApi({ uriEndPoint: courses.deleteuploadCoursedetail.v1, pathParams })
    .then((res) => {
      return res;
    })
    .catch((err) => err);

export const deleteUploadFile = ({ pathParams }) =>
  callApi({ uriEndPoint: courses.deleteUploadFile.v1, pathParams })
    .then((res) => {
      return res;
    })
    .catch((err) => err);

export const updateCourseContentFile = ({ pathParams, body }) =>
  callApi({ uriEndPoint: courses.updateCourseContentFile.v1, pathParams, body })
    .then((res) => {
      return res;
    })
    .catch((err) => err);
export const uploadCourseContentFile = ({ pathParams, body }) =>
  callApi({ uriEndPoint: courses.uploadCourseContentFile.v1, pathParams, body })
    .then((res) => {
      return res;
    })
    .catch((err) => err);

export const updateCourseDLevelDetails = ({ pathParams, body }) =>
  callApi({ uriEndPoint: courses.updateCourseDLevelDetails.v1, pathParams, body })
    .then((res) => {
      return res;
    })
    .catch((err) => err);

export const deleteUploadCourseContents = ({ pathParams }) =>
  callApi({ uriEndPoint: courses.deleteUploadCourseContents.v1, pathParams })
    .then((res) => {
      return res;
    })
    .catch((err) => err);

export const getCoursesForTeachingSchedule = ({ query }) =>
  callApi({ uriEndPoint: courses.getCoursesForTeachingSchedule.v1, query })
    .then((res) => {
      return res;
    })
    .catch((err) => err);

export const getTeachingCapsuleForClassTest = ({ query }) =>
  callApi({ uriEndPoint: courses.getTeachingCapsuleForClassTest.v1, query })
    .then((res) => {
      return res;
    })
    .catch((err) => err);

export const getTeachingCapsuleForMockTest = ({ query }) =>
  callApi({ uriEndPoint: courses.getTeachingCapsuleForMockTest.v1, query })
    .then((res) => {
      return res;
    })
    .catch((err) => err);

export const uploadTeachingSchedule = ({ pathParams, body }) =>
  callApi({ uriEndPoint: courses.uploadTeachingSchedule.v1, pathParams, body })
    .then((res) => {
      return res;
    })
    .catch((err) => err);
export const getTeachingSchedules = ({ pathParams, query }) =>
  callApi({ uriEndPoint: courses.getTeachingSchedules.v1, pathParams, query })
    .then((res) => {
      return res;
    })
    .catch((err) => err);
export const getSingleTeachingSchedules = ({ pathParams, query }) =>
  callApi({ uriEndPoint: courses.getSingleTeachingSchedules.v1, pathParams, query })
    .then((res) => {
      return res;
    })
    .catch((err) => err);

export const updateTeachingSchedule = ({ pathParams, body }) =>
  callApi({ uriEndPoint: courses.updateTeachingSchedule.v1, pathParams, body })
    .then((res) => {
      return res;
    })
    .catch((err) => err);

export const deleteTeachingSchedule = ({ pathParams }) =>
  callApi({ uriEndPoint: courses.deleteTeachingSchedule.v1, pathParams })
    .then((res) => {
      return res;
    })
    .catch((err) => err);
export const getUpdateCourseContents = ({ pathParams, query }) =>
  callApi({ uriEndPoint: courses.getUpdateCourseContents.v1, pathParams, query })
    .then((res) => {
      return res;
    })
    .catch((err) => err);

export const uploadCoursedetails = ({ pathParams, body }) =>
  callApi({ uriEndPoint: courses.uploadCoursedetails.v1, pathParams, body });
export const updateCapsule = ({ pathParams, body }) =>
  callApi({ uriEndPoint: courses.updateCapsule.v1, pathParams, body })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((err) => err);
export const deleteCapsule = ({ pathParams }) =>
  callApi({ uriEndPoint: courses.deleteCapsule.v1, pathParams })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((err) => err);
export const createCapsuleTableRow = ({ pathParams, body, query }) =>
  callApi({ uriEndPoint: courses.createCapsuleTableRow.v1, pathParams, body, query })
    .then((res) => ({ res, status: 'ok' }))
    .catch((err) => err);
export const capsuleTableRowUpdate = ({ pathParams, body }) =>
  callApi({ uriEndPoint: courses.capsuleTableRowUpdate.v1, pathParams, body });

export const deleteCapsuleFormTableRow = ({ pathParams }) =>
  callApi({ uriEndPoint: courses.deleteCapsuleFormTableRow.v1, pathParams })
    .then((res) => ({ res, status: 'ok' }))
    .catch((err) => err);
export const getTopicCount = ({ pathParams, query }) =>
  callApi({ uriEndPoint: courses.getTopicCount.v1, pathParams, query })
    .then((res) => {
      return res;
    })
    .catch((err) => err);
export const getCapsuleDetail = ({ pathParams }) =>
  callApi({ uriEndPoint: courses.getCapsuleDetail.v1, pathParams })
    .then((res) => {
      return res;
    })
    .catch((err) => err);

export const getCourseContentDLevel = ({ pathParams }) =>
  callApi({ uriEndPoint: courses.getCourseContentDLevel.v1, pathParams })
    .then((res) => {
      return res;
    })
    .catch((err) => err);

export const uploadCourseContentDetails = ({ pathParams, body }) =>
  callApi({ uriEndPoint: courses.uploadCourseContentDetails.v1, pathParams, body })
    .then((res) => {
      return res;
    })
    .catch((err) => err);
export const getCourseDifficultyLevels = ({ pathParams }) =>
  callApi({ uriEndPoint: courses.getCourseDifficultyLevels.v1, pathParams });

export const updateAdditionalFileName = ({ body }) =>
  callApi({ uriEndPoint: courses.updateAdditionalFileName.v1, body })
    .then((res) => {
      return res;
    })
    .catch((err) => err);
