const { defaults } = require('./defaults');

export const template = {
  // student endpoints

  addSudentWhatsAppTemplate: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/companies/:orgId/settings/message/templates',
    },
  },
  deleteStudentWhatsAppTemplate: {
    v1: {
      ...defaults.methods.DELETE,
      ...defaults.versions.v1,
      uri: '/companies/:orgId/settings/message/templates/:templateId',
    },
  },
  getStudentWhatsAppTemplates: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/companies/:orgId/settings/message/templates',
    },
  },
  searchStudentWhatsAppTemplates: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/companies/:orgId/settings/message/templates/',
    },
  },

  // client endpoints

  addClientWhatsAppTemplate: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/companies/:orgId/settings/message/templates',
    },
  },

  deleteClientWhatsAppTemplate: {
    v1: {
      ...defaults.methods.DELETE,
      ...defaults.versions.v1,
      uri: '/companies/:orgId/settings/message/templates/:templateId',
    },
  },

  getClientWhatsAppTemplates: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/companies/:orgId/settings/message/templates/',
    },
  },
  searchClientWhatsAppTemplates: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/companies/:orgId/settings/message/templates/',
    },
  },
};
