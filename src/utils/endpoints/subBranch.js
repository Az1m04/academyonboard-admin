const { defaults } = require('./defaults');

export const subBranch = {
  postSubBranch: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/client',
    },
  },
  getSubBranches: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/client',
    },
  },
  getSingleSubBranch: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/client/:subBranchId',
    },
  },
  putSubBranch: {
    v1: {
      ...defaults.methods.PUT,
      ...defaults.versions.v1,
      uri: '/client/:subBranchId',
    },
  },
  disableSubBranch: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/party/:partyId/:type',
    },
  },
};
