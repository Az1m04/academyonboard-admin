const { defaults } = require('./defaults');

export const dashboard = {
  getDashBoardAnalytical: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/admin/analytical',
    },
  },
};
