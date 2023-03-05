const { defaults } = require('./defaults');

export const product = {
  getCategories: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/products/categories',
    },
  },
  getProductTags: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/products/tags',
    },
  },
  create: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/products',
    },
  },
  getProducts: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/products',
    },
  },
  getProductDetails: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/products/:id',
    },
  },
  getProductAttachments: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/products/:id/attachments',
    },
  },
  updateProduct: {
    v1: {
      ...defaults.methods.PUT,
      ...defaults.versions.v1,
      uri: '/products/:id',
    },
  },
  removeAttachment: {
    v1: {
      ...defaults.methods.DELETE,
      ...defaults.versions.v1,
      uri: '/:type/:id/attachment/:contentId',
    },
  },
  variants: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/products/:id/variants',
    },
  },
};
