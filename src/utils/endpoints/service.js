const { defaults } = require('./defaults');

export const service = {
  create: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/products',
    },
  },
  getServices: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/products',
    },
  },
};
