import { callApi } from '@/utils/apiUtils';
import { timetable } from '@/utils/endpoints/timetable';

export const getBatches = ({ query }) => callApi({ uriEndPoint: timetable.getBatches.v1, query });

export const postModuleTimeSlot = ({ pathParams, body }) =>
  callApi({ uriEndPoint: timetable.postModuleTimeSlot.v1, pathParams, body });

export const getBatchesModuleSlots = ({ pathParams, query }) =>
  callApi({ uriEndPoint: timetable.getBatchesModuleSlots.v1, pathParams, query });
export const getTrainerAssignToBatch = ({ pathParams }) =>
  callApi({
    uriEndPoint: timetable.getTrainerAssignToBatch.v1,
    pathParams,
  });
export const getIsTimeslotExit = ({ pathParams, query }) =>
  callApi({ uriEndPoint: timetable.getIsTimeslotExit.v1, pathParams, query });

export const getFreeTeachers = ({ query }) =>
  callApi({ uriEndPoint: timetable.getFreeTeachers.v1, query });

export const getAllTeachers = ({ query }) =>
  callApi({ uriEndPoint: timetable.getAllTeachers.v1, query });

export const deleteModuleTimeslot = ({ pathParams, query }) =>
  callApi({ uriEndPoint: timetable.deleteModuleTimeslot.v1, pathParams, query });

export const replaceTeacher = ({ pathParams, body }) =>
  callApi({ uriEndPoint: timetable.replaceTeacher.v1, pathParams, body });

export const updateModuleTimeSlot = ({ pathParams, body }) =>
  callApi({ uriEndPoint: timetable.updateModuleTimeSlot.v1, pathParams, body });

export const getTeacherFreeTimeslot = ({ query }) =>
  callApi({ uriEndPoint: timetable.getTeacherFreeTimeslot.v1, query });
export const getClassesFreeSlot = ({ query }) =>
  callApi({ uriEndPoint: timetable.getClassesFreeSlot.v1, query });
