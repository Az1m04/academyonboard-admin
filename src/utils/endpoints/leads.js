const { defaults } = require('./defaults');

export const leads = {
  addClientLead: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/leads',
    },
  },
  updateClientLead: {
    v1: {
      ...defaults.methods.PUT,
      ...defaults.versions.v1,
      uri: '/leads/:clientID',
    },
  },
  inviteClient: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/client',
    },
  },
  getStudentFollowUpLeadData: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/leads/enquires',
    },
  },

  getStudentLeadData: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/leads/search',
    },
  },
  uploadClientLead: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/leads/:leadId/branch/register',
    },
  },
  getStaffMembers: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/admin/clients/invite',
    },
  },
  getQualificationsList: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/party/qualifications',
    },
  },
  getInstituteList: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/party/qualifications',
    },
  },
  getOldStaffMembers: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/admin/clients/invite',
    },
  },

  getParticularLeadData: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/leads/:leadId',
    },
  },
  updateParticularLeadData: {
    v1: {
      ...defaults.methods.PUT,
      ...defaults.versions.v1,
      uri: '/leads/:leadId',
    },
  },
  getClientLeadData: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/leads/search',
    },
  },
  getLeadFollowUp: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/leads/:leadId/settings/followUp',
    },
  },
  updateFollowUp: {
    v1: {
      ...defaults.methods.PUT,
      ...defaults.versions.v1,
      uri: '/leads/:leadId/settings/followUp/:followUpId',
    },
  },
  getClientList: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/client',
    },
  },
  studentLeadStats: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/students/stats',
    },
  },
  studentFollowUpLeadStats: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/leads/enquires/followUp/stats',
    },
  },
  studentScheduleLeadStats: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/leads/schedule/followUp/stats',
    },
  },

  flagWhatsApp: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/leads/:leadId/message',
    },
  },
  flagTextMessage: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/leads/:leadId/message',
    },
  },
  getAssignList: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/client/:orgId/members',
    },
  },
  addAssignAssessmentTest: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/leads/:leadId/assign/tests',
    },
  },
  updateAssignAssessmentTest: {
    v1: {
      ...defaults.methods.PUT,
      ...defaults.versions.v1,
      uri: '/tests/:testId/party/:leadId',
    },
  },
  getAssessmentTest: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/tests',
    },
  },
  getParticularAssessmentTest: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/leads/:leadId/tests',
    },
  },
  assignIndividualLead: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/leads/mass/assignee',
    },
  },

  removeLead: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/leads/:leadId/deactivate',
    },
  },
  removeLeadEnquiry: {
    v1: {
      ...defaults.methods.DELETE,
      ...defaults.versions.v1,
      uri: '/leads/:leadId/enquiry/:enquiryId',
    },
  },
  getLastStatusList: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/leads/followup/statuses',
    },
  },
  getEnquiryStats: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/leads/enquires/stats',
    },
  },
  addDemoClass: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/leads/:leadId/assign/demo/class',
    },
  },
  getDemoClass: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/leads/demo/classes',
    },
  },
  addFollowUp: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/leads/:leadId/followUp',
    },
  },

  getAddFollowUp: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/leads/:leadId/settings/followUp',
    },
  },

  addLeadPriority: {
    v1: {
      ...defaults.methods.PUT,
      ...defaults.versions.v1,
      uri: '/leads/:leadId',
    },
  },
  getActivity: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/party/:leadId/activities',
    },
  },
  addLeadNotes: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/leads/:leadId/notes',
    },
  },
  getLeadNotes: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/leads/:leadId/notes',
    },
  },
  setLeadOwner: {
    v1: {
      ...defaults.methods.PUT,
      ...defaults.versions.v1,
      uri: '/leads/:leadId',
    },
  },
  getParticularClientLeadData: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/leads/:leadId',
    },
  },
  assignAccount: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/students/:studentId/demo/register',
    },
  },
  leadSerivcesAfterRegistration: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/leads/needs',
    },
  },
  getLeadCommunicationLog: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/leads/:leadId/communication/logs',
    },
  },
  uploadLeadNotes: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/leads/:leadId/notes',
    },
  },
  markasReadLeadNotes: {
    v1: {
      ...defaults.methods.PUT,
      ...defaults.versions.v1,
      uri: '/party/:leadId/notes/:noteId/read',
    },
  },
  deleteLeadNotes: {
    v1: {
      ...defaults.methods.DELETE,
      ...defaults.versions.v1,
      uri: '/party/:leadId/notes/:notesId',
    },
  },
  getSingleLeadNote: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/leads/:leadId/notes/:notesId',
    },
  },
  updateLeadNote: {
    v1: {
      ...defaults.methods.PUT,
      ...defaults.versions.v1,
      uri: '/leads/:leadId/notes/:notesId',
    },
  },
  deleteLeadFollowup: {
    v1: {
      ...defaults.methods.DELETE,
      ...defaults.versions.v1,
      uri: '/leads/:leadId/settings/followUp/:workEffortId',
    },
  },
  assignDemoAccount: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/leads/:clientId/demo/register',
    },
  },
  branchLeadStats: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/leads/stats',
    },
  },
  getStudentEnquiries: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/leads/enquires',
    },
  },
  deleteMultipleLeadNotes: {
    v1: {
      ...defaults.methods.DELETE,
      ...defaults.versions.v1,
      uri: '/leads/:leadId/notes',
    },
  },
  getSingleLeadEnquiry: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/leads/enquires',
    },
  },
  markasUnreadLeadNotes: {
    v1: {
      ...defaults.methods.PUT,
      ...defaults.versions.v1,
      uri: '/party/:leadId/notes/:noteId/unread',
    },
  },
  markasMultipleReadLeadNotes: {
    v1: {
      ...defaults.methods.PUT,
      ...defaults.versions.v1,
      uri: '/party/:leadId/notes/read',
    },
  },
  markasMultipleUnreadLeadNotes: {
    v1: {
      ...defaults.methods.PUT,
      ...defaults.versions.v1,
      uri: '/party/:leadId/notes/unread',
    },
  },
  getLeadAssessmentTest: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/leads/:leadId/tests',
    },
  },
  getSingleLeadAssessmentTest: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/leads/:leadId/tests',
    },
  },
  assignLeadDemoClass: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/leads/:leadId/assign/demo/class',
    },
  },
  leadStatusDemoClass: {
    v1: {
      ...defaults.methods.PUT,
      ...defaults.versions.v1,
      uri: 'leads/:leadId/demoClass/status/change',
    },
  },
  getLeadDemoClasses: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/leads/demo/classes',
    },
  },
  checkIsPhoneNumberExists: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/user/phone/check-existing',
    },
  },
  addLeadEnquiry: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/leads/:leadId/enquiry',
    },
  },
  updateLeadAssessmentTest: {
    v1: {
      ...defaults.methods.PUT,
      ...defaults.versions.v1,
      uri: '/tests/:testId/party/:leadId',
    },
  },
  deleteLeadAssessmentTest: {
    v1: {
      ...defaults.methods.DELETE,
      ...defaults.versions.v1,
      uri: '/leads/:leadId/test',
    },
  },
  deleteLeadDemoClass: {
    v1: {
      ...defaults.methods.DELETE,
      ...defaults.versions.v1,
      uri: '/leads/:leadId/demo/class',
    },
  },
  singleLeadDemoClass: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/leads/:leadId/demo/class/:classId',
    },
  },
  updateLeadDemoClass: {
    v1: {
      ...defaults.methods.PUT,
      ...defaults.versions.v1,
      uri: '/leads/:leadId/demo/class',
    },
  },
  changeAssessmentTestStatus: {
    v1: {
      ...defaults.methods.PUT,
      ...defaults.versions.v1,
      uri: '/leads/:leadId/tests/:testId/status',
    },
  },
  downloadAssessmentTest: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/tests/course/:courseId/test/:testId',
    },
  },
};
