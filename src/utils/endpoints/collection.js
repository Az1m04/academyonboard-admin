const { defaults } = require('./defaults');

export const collection = {
  create: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/products/categories',
    },
  },
  getCollectionDetails: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/products/categories/:id',
    },
  },
  removeAttachment: {
    v1: {
      ...defaults.methods.DELETE,
      ...defaults.versions.v1,
      uri: '/products/categories/:id/content/:contentId',
    },
  },
  updateCollection: {
    v1: {
      ...defaults.methods.PUT,
      ...defaults.versions.v1,
      uri: '/products/categories/:id',
    },
  },
};
