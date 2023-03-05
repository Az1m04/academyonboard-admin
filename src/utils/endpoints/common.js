const { defaults } = require('./defaults');

export const common = {
  uploadContent: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/content',
      headerProps: {
        'Content-Type': 'multipart/form-data',
      },
    },
  },
  setPassword: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/user/reset/password',
    },
  },

  checkServer: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/ping',
    },
  },
  getPaymentMethods: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/stores/:storeId/payment/methods',
    },
  },

  paymentCheckOutComplete: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/checkouts/:checkoutId/complete',
    },
  },

  getCommonColors: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/common/colors',
    },
  },
};
