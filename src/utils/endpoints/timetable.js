const { defaults } = require('./defaults');

export const timetable = {
  getBatches: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/schedules/timetable',
    },
  },
  postModuleTimeSlot: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/schedules/:batchId/modules/:moduleId',
    },
  },
  updateModuleTimeSlot: {
    v1: {
      ...defaults.methods.PUT,
      ...defaults.versions.v1,
      uri: '/schedules/:batchId/timetables/:timetableId',
    },
  },
  getBatchesModuleSlots: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/schedules/timetable',
    },
  },
  getIsTimeslotExit: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/schedules/:batchId/slot/available',
    },
  },
  getFreeTeachers: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/trainers/available',
    },
  },
  deleteModuleTimeslot: {
    v1: {
      ...defaults.methods.DELETE,
      ...defaults.versions.v1,
      uri: '/schedules/:batchId/timetables/:timetableId',
    },
  },
  getAllTeachers: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/admin/clients/invite',
    },
  },
  replaceTeacher: {
    v1: {
      ...defaults.methods.PUT,
      ...defaults.versions.v1,
      uri: '/schedules/:batchId/timetables/:timetableId/replace/trainer',
    },
  },
  getTeacherFreeTimeslot: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/schedules/teachers/available/slots',
    },
  },
  getClassesFreeSlot: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/classes/available/slots',
    },
  },
  getTrainerAssignToBatch: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/schedules/:batchId/trainers',
    },
  },
};
