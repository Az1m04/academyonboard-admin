const { defaults } = require('./defaults');

export const batch = {
  addBatch: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/schedules',
    },
  },
  updateBatch: {
    v1: {
      ...defaults.methods.PUT,
      ...defaults.versions.v1,
      uri: '/schedules/:updateBatchId',
    },
  },
  getBatches: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/schedules',
    },
  },
  changeActivityStatus: {
    v1: {
      ...defaults.methods.PUT,
      ...defaults.versions.v1,
      uri: '/schedules/:scheduleId/status',
    },
  },
  getParticularBatch: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/schedules/:scheduleId',
    },
  },
  getBatchDetails: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/schedules/:batchId',
    },
  },
  getStudentAssignToBatch: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/schedules/:batchId/enrollments',
    },
  },
  getTrainerAssignToBatch: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/schedules/:batchId/trainers',
    },
  },
  addStudentsToBatch: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/schedules/:batchId/bulk/students',
    },
  },
  addTeachersToBatch: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/schedules/:batchId/mass/trainers',
    },
  },
  getTrainers: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/schedules/:batchId/trainers/available',
    },
  },
  removeTrainerFromBatch: {
    v1: {
      ...defaults.methods.DELETE,
      ...defaults.versions.v1,
      uri: '/schedules/:batchId/trainers/:trainerId',
    },
  },
  removeStudentFromBatch: {
    v1: {
      ...defaults.methods.DELETE,
      ...defaults.versions.v1,
      uri: '/schedules/:batchId/students/:studentId',
    },
  },
  getTeachingScheduleList: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/teaching/schedules',
    },
  },
  assignTeachingSchedule: {
    v1: {
      ...defaults.methods.PUT,
      ...defaults.versions.v1,
      uri: '/schedules/:batchId/timesheet/:timesheetId/assign',
    },
  },
  getAssignedTeachingSchedule: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/schedules/:batchId/teaching/schedules',
    },
  },
  removeTeachingSchedule: {
    v1: {
      ...defaults.methods.DELETE,
      ...defaults.versions.v1,
      uri: '/schedules/:batchId/timesheet/:timesheetId',
    },
  },
};
