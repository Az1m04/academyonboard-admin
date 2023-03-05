import { callApi } from '@/utils/apiUtils';
import { batch } from '@/utils/endpoints/batch';

export const addBatch = ({ body }) =>
  callApi({ uriEndPoint: batch.addBatch.v1, body })
    .then((res) => res)
    .catch((err) => err);
export const updateBatch = ({ body, pathParams }) =>
  callApi({ uriEndPoint: batch.updateBatch.v1, body, pathParams })
    .then((res) => res)
    .catch((err) => err);

export const getBatches = ({ query }) =>
  callApi({ uriEndPoint: batch.getBatches.v1, query })
    .then((res) => res)
    .catch((err) => err);

export const changeActivityStatus = ({ pathParams, body }) =>
  callApi({ uriEndPoint: batch.changeActivityStatus.v1, pathParams, body })
    .then((res) => res)
    .catch((err) => err);
export const getParticularBatch = ({ pathParams }) =>
  callApi({ uriEndPoint: batch.getParticularBatch.v1, pathParams })
    .then((res) => res)
    .catch((err) => err);

export const getBatchDetails = ({ pathParams }) =>
  callApi({ uriEndPoint: batch.getBatchDetails.v1, pathParams });

export const addStudentsToBatch = ({ pathParams, body }) =>
  callApi({ uriEndPoint: batch.addStudentsToBatch.v1, body, pathParams });

export const getTrainers = ({ query, pathParams }) =>
  callApi({ uriEndPoint: batch.getTrainers.v1, query, pathParams });

export const addTeachersToBatch = ({ body, pathParams }) =>
  callApi({ uriEndPoint: batch.addTeachersToBatch.v1, body, pathParams });

export const getStudentAssignToBatch = ({ pathParams }) =>
  callApi({
    uriEndPoint: batch.getStudentAssignToBatch.v1,
    pathParams,
  });

export const getTrainerAssignToBatch = ({ pathParams }) =>
  callApi({
    uriEndPoint: batch.getTrainerAssignToBatch.v1,
    pathParams,
  });

export const removeTrainerFromBatch = ({ pathParams }) =>
  callApi({ uriEndPoint: batch.removeTrainerFromBatch.v1, pathParams });

export const removeStudentFromBatch = ({ pathParams }) =>
  callApi({ uriEndPoint: batch.removeStudentFromBatch.v1, pathParams });
export const getTeachingScheduleList = ({ query }) =>
  callApi({ uriEndPoint: batch.getTeachingScheduleList.v1, query });
export const assignTeachingSchedule = ({ pathParams }) =>
  callApi({ uriEndPoint: batch.assignTeachingSchedule.v1, pathParams });

export const getAssignedTeachingSchedule = ({ pathParams }) =>
  callApi({ uriEndPoint: batch.getAssignedTeachingSchedule.v1, pathParams });

export const removeTeachingSchedule = ({ pathParams }) =>
  callApi({ uriEndPoint: batch.removeTeachingSchedule.v1, pathParams });
