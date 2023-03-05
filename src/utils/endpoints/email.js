const { defaults } = require('./defaults');

export const email = {
  // Student endpoints

  addStudentEmailTemplate: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/companies/:orgId/settings/email/templates',
    },
  },
  deleteStudentEmailTemplate: {
    v1: {
      ...defaults.methods.DELETE,
      ...defaults.versions.v1,
      uri: '/companies/:orgId/settings/email/templates/:templateId',
    },
  },
  getStudentEmailTemplate: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/companies/:orgId/settings/email/templates',
    },
  },

  sendEmailInBulk: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/common/send/email',
    },
  },

  sendEmailSingleLead: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/party/:partyId/email',
    },
  },

  // Client endpoints

  addClientEmailTemplate: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/companies/:orgId/settings/email/templates',
    },
  },
  deleteClientEmailTemplate: {
    v1: {
      ...defaults.methods.DELETE,
      ...defaults.versions.v1,
      uri: '/companies/:orgId/settings/email/templates/:templateId',
    },
  },
  getClientEmailTemplate: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/companies/:orgId/settings/email/templates',
    },
  },
};
