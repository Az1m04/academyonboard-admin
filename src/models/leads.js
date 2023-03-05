import {
  getCountryStates,
  addClientLeads,
  inviteClients,
  getStudentLeadData,
  getClientList,
  getParticularStudentLeadData,
  updateParticularStudentLeadData,
  getClientLeadData,
  addFollowUp,
  getParticularClientLeadData,
  updateClientLead,
  getStaffMembers,
  getAssignList,
  getAddFollowUp,
  addAssignAssessmentTest,
  getAssessmentTest,
  addLeadPriority,
  addLeadNotes,
  getActivity,
  getLeadNotes,
  setLeadOwner,
  addDemoClass,
  getDemoClass,
  assignAccount,
  getLastStatusList,
  assignIndividualLead,
  removeLead,
  flagWhatsApp,
  flagTextMessage,
  getLeadFollowUp,
  getOldStaffMembers,
  getQualificationsList,
  getInstituteList,
  updateFollowUp,
  studentLeadStats,
  branchLeadStats,
  assignDemoAccount,
  getParticularAssessmentTest,
  updateAssignAssessmentTest,
  getStudentEnquiries,
  removeLeadEnquiry,
  getEnquiryStats,
  leadSerivcesAfterRegistration,
  getLeadCommunicationLog,
  uploadLeadNotes,
  markasReadLeadNotes,
  deleteLeadNotes,
  getSingleLeadNote,
  updateLeadNote,
  uploadClientLead,
  deleteLeadFollowup,
  deleteMultipleLeadNotes,
  getSingleLeadEnquiry,
  markasUnreadLeadNotes,
  markasMultipleReadLeadNotes,
  markasMultipleUnreadLeadNotes,
  getLeadAssessmentTest,
  assignLeadDemoClass,
  getLeadDemoClasses,
  checkIsPhoneNumberExists,
  addLeadEnquiry,
  updateLeadAssessmentTest,
  deleteLeadAssessmentTest,
  deleteLeadDemoClass,
  singleLeadDemoClass,
  updateLeadDemoClass,
  leadStatusDemoClass,
  changeAssessmentTestStatus,
  getStudentFollowUpLeadData,
  studentFollowUpLeadStats,
  studentScheduleLeadStats,
  downloadAssessmentTest,
  getSingleLeadAssessmentTest,
} from '@/services/leads';

const Model = {
  namespace: 'leads',
  state: {
    getAddFollowUp: null,
    selectedLead: null,
    leadData: null,
    clientLeadData: null,
    staffMembersData: null,
    getOldStaffMembers: null,
    studentLeadRecord: null,
    clientLeadRecord: null,
    updateStudentLeadRecord: null,
    flagWhatsApp: null,
    flagTextMessage: null,
    getLeadFollowUp: null,
    getQualificationsList: null,
    getInstituteList: null,
    updateFollowUp: null,
    studentLeadStats: null,
    branchLeadStats: null,
    getParticularAssessmentTest: null,
    updateAssignAssessmentTest: null,
    getLeadCommunicationLog: null,
    leadSerivcesAfterRegistration: null,
    getSingleLeadNote: null,
    getSingleLeadEnquiry: null,
    getLeadAssessmentTest: null,
    getLeadDemoClasses: null,
    updateLeadAssessmentTest: null,
    singleLeadDemoClass: null,
    followUpLeadData: null,
    studentFollowUpLeadStats: null,
    studentScheduleLeadStats: null,
    downloadAssessmentTest: null,
    singleLeadAssessmentTest: null,
    editLead: {
      visible: false,
      type: null,
      title: null,
      subTitle: null,
      leadId: null,
      noteId: null,
      followUpId: null,
      rec: null,
      purposeFor: null,
      keyword: null,
    },
    assessmentTest: null,
    activityRecord: null,
    studentEnquiriesList: null,
    enquiryStats: null,
  },
  effects: {
    *getStateCodes({ payload }, { call, put }) {
      const res = yield call(getCountryStates, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'stateCodes',
      });
    },

    *addClientLead({ payload }, { call }) {
      const res = yield call(addClientLeads, payload);
      return res;
    },

    *updateClientLead({ payload }, { call }) {
      const res = yield call(updateClientLead, payload);
      return res;
    },

    *inviteClient({ payload }, { call }) {
      const res = yield call(inviteClients, payload);
      return res;
    },

    *getStudentLeadData({ payload }, { call, put }) {
      const res = yield call(getStudentLeadData, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'leadData',
      });
      return res;
    },
    *getStudentFollowUpLeadData({ payload }, { call, put }) {
      const res = yield call(getStudentFollowUpLeadData, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'followUpLeadData',
      });
      return res;
    },
    *getStaffMembers({ payload }, { call, put }) {
      const res = yield call(getStaffMembers, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'staffMembersData',
      });
      return res;
    },
    *getOldStaffMembers({ payload }, { call, put }) {
      const res = yield call(getOldStaffMembers, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'getOldStaffMembers',
      });
      return res;
    },
    *removeLead({ payload }, { call, select, put }) {
      const res = yield call(removeLead, payload);
      const copyLeadData = yield select(({ leads }) => leads.leadData);
      const records = copyLeadData?.records?.filter(
        (lead) => lead?.id !== payload?.pathParams?.leadId,
      );
      yield put({
        type: 'setStates',
        key: 'leadData',
        payload: { ...copyLeadData, records },
      });
      return res;
    },
    *getParticularStudentLeadData({ payload }, { call, put }) {
      const res = yield call(getParticularStudentLeadData, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'studentLeadRecord',
      });
      return res;
    },
    *updateParticularStudentLeadData({ payload }, { call, put }) {
      const res = yield call(updateParticularStudentLeadData, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'updateStudentLeadRecord',
      });
      return res;
    },
    *getEnquiryStats({ payload }, { call, put }) {
      try {
        const res = yield call(getEnquiryStats, payload);
        yield put({
          type: 'setStates',
          key: 'enquiryStats',
          payload: res,
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getClientList({ payload }, { call, put }) {
      try {
        const res = yield call(getClientList, payload);
        yield put({
          type: 'setStates',
          key: 'clientList',
          payload: res,
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *removeLeadEnquiry({ payload }, { call }) {
      try {
        const res = yield call(removeLeadEnquiry, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *flagWhatsApp({ payload }, { call, put }) {
      const res = yield call(flagWhatsApp, payload);
      yield put({
        type: 'setStates',
        key: 'flagWhatsApp',
        payload: res,
      });
      return res;
    },
    *flagTextMessage({ payload }, { call, put }) {
      const res = yield call(flagTextMessage, payload);
      yield put({
        type: 'setStates',
        key: 'flagTextMessage',
        payload: res,
      });
      return res;
    },
    *addDemoClass({ payload }, { call, select, put }) {
      try {
        const res = yield call(addDemoClass, payload);

        if (res?.status === 'ok') {
          // in order to reflect the change in the last activity and status in the table on assigning demo class
          // copy the lead data and add/update the demo class

          const copyLeadData = yield select(({ leads }) => leads.leadData);
          const mutatedRecordsOfDemoClass = copyLeadData.records?.map((lead) => {
            return lead.id === payload?.pathParams?.leadId
              ? {
                  ...lead,
                  lastActivity: { ...res, verb: res?.lastActivity?.verb },
                  leadStatusType: res?.lastStatusType || '--',
                  demoClass: {
                    course: { id: res?.demoClass?.course?.id },
                    batch: { id: res?.demoClass?.batch?.id },
                    fromDate: res?.demoClass?.fromDate,
                    thruDate: res?.demoClass?.thruDate,
                    mode: res?.demoClass?.mode,
                    partyGroupId: res?.demoClass?.partyGroupId,
                  },
                  lastModifiedDate: res?.leadLastModifiedDate,
                  lastModifiedBy: { ...res?.leadLastModifiedBy },
                }
              : lead;
          });

          yield put({
            type: 'setStates',
            key: 'leadData',
            payload: { ...copyLeadData, records: mutatedRecordsOfDemoClass },
          });
        }

        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },

    *getLastStatusList({ payload }, { call, put }) {
      const res = yield call(getLastStatusList, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'lastStatusList',
      });
      return res;
    },
    *getDemoClass({ payload }, { call }) {
      const res = yield call(getDemoClass, payload);
      return res;
    },
    *updateAssignAssessmentTest({ payload }, { call, select, put }) {
      try {
        const res = yield call(updateAssignAssessmentTest, payload);

        // in order to reflect the change in the last activity in the table on assigning assessment test
        // copy the lead data and add/update the assessment test
        if (res?.status === 'ok') {
          const copyLeadData = yield select(({ leads }) => leads.leadData);
          const mutatedRecordsOfAssessmentTest = copyLeadData.records?.map((lead) => {
            return lead?.id === payload?.pathParams?.leadId
              ? {
                  ...lead,
                  lastActivity: { ...res, verb: res?.lastActivity?.verb },
                  leadStatusType: res?.lastStatusType || '--',
                  testDetail: [...res?.leadData?.testDetail],
                  lastModifiedDate: res?.leadLastModifiedDate,
                  lastModifiedBy: { ...res?.leadLastModifiedBy },
                }
              : lead;
          });

          yield put({
            type: 'setStates',
            key: 'leadData',
            payload: { ...copyLeadData, records: mutatedRecordsOfAssessmentTest },
          });
        }

        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *addAssignAssessmentTest({ payload }, { call, select, put }) {
      try {
        const res = yield call(addAssignAssessmentTest, payload);
        // in order to reflect the change in the last activity in the table on assigning assessment test
        // copy the lead data and add/update the assessment test
        if (res?.status === 'ok') {
          const copyLeadData = yield select(({ leads }) => leads?.leadData);
          const mutatedRecordsOfAssessmentTest = copyLeadData?.records?.map((lead) => {
            return lead?.id === payload?.pathParams?.leadId
              ? {
                  ...lead,
                  lastActivity: { ...res, verb: res?.lastActivity?.verb },
                  leadStatusType: res?.lastStatusType || '--',
                  testDetail: [...res?.testDetail],
                  lastModifiedDate: res?.leadLastModifiedDate,
                  lastModifiedBy: { ...res?.leadLastModifiedBy },
                }
              : lead;
          });

          yield put({
            type: 'setStates',
            key: 'leadData',
            payload: { ...copyLeadData, records: mutatedRecordsOfAssessmentTest },
          });
        }

        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getAssessmentTest({ payload }, { call, put }) {
      try {
        const res = yield call(getAssessmentTest, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'assessmentTest',
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getParticularAssessmentTest({ payload }, { call, put }) {
      try {
        const res = yield call(getParticularAssessmentTest, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'getParticularAssessmentTest',
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getAssignList({ payload }, { call, put }) {
      try {
        const res = yield call(getAssignList, payload);
        yield put({
          type: 'setStates',
          key: 'assignList',
          payload: res,
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getClientLeadData({ payload }, { call, put }) {
      try {
        const res = yield call(getClientLeadData, payload);
        yield put({
          type: 'setStates',
          key: 'clientLeadData',
          payload: res,
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getStudentEnquiries({ payload }, { call, put }) {
      try {
        const res = yield call(getStudentEnquiries, payload);
        yield put({
          type: 'setStates',
          key: 'studentEnquiriesList',
          payload: res,
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getLeadFollowUp({ payload }, { call, put }) {
      const res = yield call(getLeadFollowUp, payload);
      yield put({
        type: 'setStates',
        key: 'getLeadFollowUp',
        payload: res,
      });
      return res;
    },
    *updateFollowUp({ payload }, { call, put }) {
      try {
        const res = yield call(updateFollowUp, payload);
        yield put({
          type: 'setStates',
          key: 'updateFollowUp',
          payload: res,
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *addFollowUp({ payload }, { call, select, put }) {
      try {
        const res = yield call(addFollowUp, payload);
        // in order to reflect the change in the last lead priority in the table on updating priority
        // copy the lead data and add/update the lead priority
        if (res?.status === 'ok') {
          const copyLeadData = yield select(({ leads }) => leads.leadData);

          const mutatedRecordsOfLeadFollowUp = copyLeadData?.records?.map((lead) => {
            return lead.id === payload?.pathParams?.leadId
              ? {
                  ...lead,
                  lastActivity: { ...res, verb: res?.lastActivity?.verb },
                  nextActionBy: res?.nextActionBy,
                  lastFollowUpStatus: res?.lastFollowUpStatus,
                  nextFollowUpStatus: res?.nextFollowUpStatus,
                  leadStatusType: res?.leadStatusType,
                  nextActionMode: res?.nextActionMode,
                  lastFollowUpBy: {
                    ...res,
                    roleTypeId: res?.lastFollowUpBy?.roleTypeId,
                    followUpOn: res?.lastFollowUpBy?.followUpOn,
                    notes: res?.lastFollowUpBy?.notes,
                    branch: { id: res?.lastFollowUpBy?.branch?.id },
                    department: { id: res?.lastFollowUpBy?.department?.id },
                    lastAssignee: res?.lastFollowUpBy?.lastAssignee,
                    isInterested: res?.lastFollowUpBy?.isInterested,
                    comments: res?.lastFollowUpBy?.comments,
                    feedBackType: res?.lastFollowUpBy?.feedBackType,
                  },
                  currentActionId: res?.currentActionModeId,
                  lastModifiedDate: res?.leadLastModifiedDate,
                  lastModifiedBy: { ...res?.leadLastModifiedBy },
                }
              : lead;
          });

          yield put({
            type: 'setStates',
            key: 'leadData',
            payload: { ...copyLeadData, records: mutatedRecordsOfLeadFollowUp },
          });
        }
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *studentLeadStats({ payload }, { call, put }) {
      try {
        const res = yield call(studentLeadStats, payload);

        yield put({
          type: 'setStates',
          key: 'studentLeadStats',
          payload: res,
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *studentFollowUpLeadStats({ payload }, { call, put }) {
      try {
        const res = yield call(studentFollowUpLeadStats, payload);

        yield put({
          type: 'setStates',
          key: 'studentFollowUpLeadStats',
          payload: res,
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *studentScheduleLeadStats({ payload }, { call, put }) {
      try {
        const res = yield call(studentScheduleLeadStats, payload);

        yield put({
          type: 'setStates',
          key: 'studentScheduleLeadStats',
          payload: res,
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },

    *branchLeadStats({ payload }, { call, put }) {
      try {
        const res = yield call(branchLeadStats, payload);
        yield put({
          type: 'setStates',
          key: 'branchLeadStats',
          payload: res,
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *updateLeadAssessmentTest({ payload }, { call, put }) {
      try {
        const res = yield call(updateLeadAssessmentTest, payload);
        yield put({
          type: 'setStates',
          key: 'updateLeadAssessmentTest',
          payload: res,
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },

    *deleteLeadAssessmentTest({ payload }, { call }) {
      try {
        const res = yield call(deleteLeadAssessmentTest, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *deleteLeadDemoClass({ payload }, { call }) {
      try {
        const res = yield call(deleteLeadDemoClass, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *singleLeadDemoClass({ payload }, { call, put }) {
      try {
        const res = yield call(singleLeadDemoClass, payload);
        yield put({
          type: 'setStates',
          key: 'singleLeadDemoClass',
          payload: res,
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *updateLeadDemoClass({ payload }, { call }) {
      try {
        const res = yield call(updateLeadDemoClass, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },

    *assignDemoAccount({ payload }, { call }) {
      try {
        const res = yield call(assignDemoAccount, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getAddFollowUp({ payload }, { call, put }) {
      try {
        const res = yield call(getAddFollowUp, payload);

        yield put({
          type: 'setStates',
          key: 'getAddFollowUp',
          payload: res,
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getParticularClientLeadData({ payload }, { call, put }) {
      try {
        const res = yield call(getParticularClientLeadData, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'clientLeadRecord',
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *addLeadPriority({ payload }, { call, put, select }) {
      try {
        const res = yield call(addLeadPriority, payload);

        // in order to reflect the change in the last lead priority in the table on updating priority
        // copy the lead data and add/update the lead priority

        const copyLeadData = yield select(({ leads }) => leads?.leadData);
        const mutatedRecordsOfLeadPriority = copyLeadData?.records?.map((lead) => {
          return lead?.id === payload?.pathParams?.leadId
            ? {
                ...lead,
                lastActivity: { ...res, verb: res?.lastActivity?.verb },
                priority: res?.priority,
                priorityType: res?.priorityType,
                priorityRemark: res?.priorityRemark ? res?.priorityRemark : undefined,
                lastModifiedDate: res?.leadLastModifiedDate,
                lastModifiedBy: { ...res?.leadLastModifiedBy },
              }
            : lead;
        });

        yield put({
          type: 'setStates',
          key: 'leadData',
          payload: { ...copyLeadData, records: mutatedRecordsOfLeadPriority },
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },

    *assignIndividualLead({ payload }, { call, select, put }) {
      try {
        const res = yield call(assignIndividualLead, payload);

        // in order to reflect the change in the last activity in the table on assigning individual lead
        // copy the lead data and assign the lead
        const copyLeadData = yield select(({ leads }) => leads?.leadData);
        const mutatedRecordsOfAssignedIndividualLead = copyLeadData?.records?.map((lead) => {
          return lead?.id
            ? {
                ...lead,
                lastActivity: {
                  ...res?.lastActivity,
                  verb: res?.lastActivity?.verb,
                },
                referBy: {
                  ...res?.assignee,
                  department: { id: res?.assignee?.department?.departmentId },
                },
                lastAssignee: {
                  ...res?.lastAssignee,
                },
                assignee: {
                  ...res?.assignee,
                },
                lastModifiedDate: res?.leadLastModifiedDate,
                lastModifiedBy: { ...res?.leadLastModifiedBy },
              }
            : lead;
        });

        yield put({
          type: 'setStates',
          key: 'leadData',
          payload: { ...copyLeadData, records: mutatedRecordsOfAssignedIndividualLead },
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },

    *getActivity({ payload }, { call, put }) {
      const res = yield call(getActivity, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'activityRecord',
      });
      return res;
    },
    *getQualificationsList({ payload }, { call, put }) {
      const res = yield call(getQualificationsList, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'getQualificationsList',
      });
      return res;
    },
    *getInstituteList({ payload }, { call, put }) {
      try {
        const res = yield call(getInstituteList, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'getInstituteList',
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },

    *addLeadNotes({ payload }, { call, put, select }) {
      try {
        const res = yield call(addLeadNotes, payload);

        // in order to reflect the change in the last note in the table on adding new note
        // copy the lead data and add the new note

        const copyLeadData = yield select(({ leads }) => leads?.leadData);
        const mutatedRecordsOfLeadDate = copyLeadData?.records?.map((lead) => {
          return lead.id === payload?.pathParams?.leadId
            ? {
                ...lead,
                lastNote: { ...res, name: res?.lastActivity?.newValue },
                lastActivity: { ...res, verb: res?.lastActivity?.verb },
                lastModifiedDate: res?.leadLastModifiedDate,
                lastModifiedBy: { ...res?.leadLastModifiedBy },
              }
            : lead;
        });

        yield put({
          type: 'setStates',
          key: 'leadData',
          payload: { ...copyLeadData, records: mutatedRecordsOfLeadDate },
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },

    *getLeadNotes({ payload }, { call, put }) {
      const res = yield call(getLeadNotes, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'activityRecord',
      });
      return res;
    },
    *leadSerivcesAfterRegistration({ payload }, { call, put }) {
      const res = yield call(leadSerivcesAfterRegistration, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'leadSerivcesAfterRegistration',
      });
      return res;
    },
    *getLeadCommunicationLog({ payload }, { call, put }) {
      const res = yield call(getLeadCommunicationLog, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'getLeadCommunicationLog',
      });
      return res;
    },
    *uploadLeadNotes({ payload }, { call }) {
      try {
        const res = yield call(uploadLeadNotes, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },

    *markasReadLeadNotes({ payload }, { call }) {
      try {
        const res = yield call(markasReadLeadNotes, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *deleteLeadNotes({ payload }, { call }) {
      try {
        const res = yield call(deleteLeadNotes, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getSingleLeadNote({ payload }, { call, put }) {
      const res = yield call(getSingleLeadNote, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'getSingleLeadNote',
      });
      return res;
    },
    *updateLeadNote({ payload }, { call }) {
      try {
        const res = yield call(updateLeadNote, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *uploadClientLead({ payload }, { call }) {
      try {
        const res = yield call(uploadClientLead, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *deleteLeadFollowup({ payload }, { call }) {
      try {
        const res = yield call(deleteLeadFollowup, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *deleteMultipleLeadNotes({ payload }, { call }) {
      try {
        const res = yield call(deleteMultipleLeadNotes, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },

    *getSingleLeadEnquiry({ payload }, { call, put }) {
      const res = yield call(getSingleLeadEnquiry, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'getSingleLeadEnquiry',
      });
      return res;
    },
    *markasUnreadLeadNotes({ payload }, { call }) {
      try {
        const res = yield call(markasUnreadLeadNotes, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *markasMultipleReadLeadNotes({ payload }, { call }) {
      try {
        const res = yield call(markasMultipleReadLeadNotes, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *markasMultipleUnreadLeadNotes({ payload }, { call }) {
      try {
        const res = yield call(markasMultipleUnreadLeadNotes, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getLeadAssessmentTest({ payload }, { call, put }) {
      const res = yield call(getLeadAssessmentTest, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'getLeadAssessmentTest',
      });
      return res;
    },
    *assignLeadDemoClass({ payload }, { call }) {
      try {
        const res = yield call(assignLeadDemoClass, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getLeadDemoClasses({ payload }, { call, put }) {
      const res = yield call(getLeadDemoClasses, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'getLeadDemoClasses',
      });
      return res;
    },
    *downloadAssessmentTest({ payload }, { call, put }) {
      const res = yield call(downloadAssessmentTest, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'downloadAssessmentTest',
      });
      return res;
    },
    *getSingleLeadAssessmentTest({ payload }, { call, put }) {
      const res = yield call(getSingleLeadAssessmentTest, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'singleLeadAssessmentTest',
      });
      return res;
    },

    *leadStatusDemoClass({ payload }, { call }) {
      try {
        const res = yield call(leadStatusDemoClass, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *changeAssessmentTestStatus({ payload }, { call }) {
      try {
        const res = yield call(changeAssessmentTestStatus, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },

    *setLeadOwner({ payload }, { call, put, select }) {
      try {
        const res = yield call(setLeadOwner, payload);

        // in order to reflect the change in the last lead owner in the table on adding new note
        // copy the lead data and add the new owner

        const copyLeadData = yield select(({ leads }) => leads.leadData);
        const mutatedRecordsOfLeadOwner = copyLeadData?.records?.map((lead) => {
          return lead.id === payload?.pathParams?.leadId
            ? {
                ...lead,
                owner: {
                  ...res,
                  displayName: res?.owner?.displayName || '--',
                  id: res?.owner?.partyId,
                },
                lastActivity: { ...(lead?.lastActivity || {}), verb: res?.lastActivity?.verb },
                lastModifiedDate: res?.leadLastModifiedDate,
                lastModifiedBy: { ...res?.leadLastModifiedBy },
              }
            : lead;
        });

        yield put({
          type: 'setStates',
          key: 'leadData',
          payload: { ...copyLeadData, records: mutatedRecordsOfLeadOwner },
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *assignAccount({ payload }, { call, put, select }) {
      try {
        const res = yield call(assignAccount, payload);
        if (res?.status === 'ok') {
          // in order to reflect the change in the last activity in the table on assigning demo account
          // copy the lead data and assign the demo account

          const copyLeadData = yield select(({ leads }) => leads.leadData);
          const mutatedRecordsOfAssignedDemoAccount = copyLeadData.records?.map((lead) => {
            return lead.id === payload?.pathParams?.studentId
              ? {
                  ...lead,
                  lastActivity: { ...res, verb: res?.lastActivity?.verb },
                  leadStatusType: res?.lastStatusType || '--',
                  demoAccount: {
                    endDate: res?.demoAccount?.endDate,
                    startDate: res?.demoAccount?.startDate,
                  },
                  lastModifiedDate: res?.leadLastModifiedDate,
                  lastModifiedBy: { ...res?.leadLastModifiedBy },
                }
              : lead;
          });
          yield put({
            type: 'setStates',
            key: 'leadData',
            payload: { ...copyLeadData, records: mutatedRecordsOfAssignedDemoAccount },
          });
        }

        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *checkIsPhoneNumberExists({ payload }, { call }) {
      try {
        const res = yield call(checkIsPhoneNumberExists, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *addLeadEnquiry({ payload }, { call }) {
      try {
        const res = yield call(addLeadEnquiry, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
  },

  reducers: {
    setStates(state, { payload, key }) {
      return {
        ...state,
        [key]: payload,
      };
    },
  },
};
export default Model;
