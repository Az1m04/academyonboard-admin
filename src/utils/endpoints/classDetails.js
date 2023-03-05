const { defaults } = require('./defaults');

export const classDetails = {
  addClass: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/classes',
    },
  },

  getClass: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/classes',
    },
  },
  getClassById: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/classes/:classId',
    },
  },
  updateClass: {
    v1: {
      ...defaults.methods.PUT,
      ...defaults.versions.v1,
      uri: '/classes/:classId',
    },
  },
  changeActivityStatus: {
    v1: {
      ...defaults.methods.PUT,
      ...defaults.versions.v1,
      uri: '/classes/:classId/status',
    },
  },
  deleteClass: {
    v1: {
      ...defaults.methods.DELETE,
      ...defaults.versions.v1,
      uri: '/classes/:classId',
    },
  },
};
