const { defaults } = require('./defaults');

export const endUser = {
  uploadPublicHolidays: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/common/upload/holidays',
    },
  },
  uploadCorrectPublicHolidays: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/common/import/holidays',
    },
  },
};
