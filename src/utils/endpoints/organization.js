const { defaults } = require('./defaults');

export const organization = {
  members: {
    list: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '',
      },
    },
  },
};
