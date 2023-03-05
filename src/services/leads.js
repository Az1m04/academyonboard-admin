import { hostname, callApi } from '@/utils/apiUtils';
import { common } from '@/utils/endpoints/common';
import { leads } from '@/utils/endpoints/leads';
import Axios from 'axios';

export const getCountryStates = ({ pathParams: { countryId } }) =>
  Axios.get(`${hostname()}/xapi/v1/common/country/${countryId}/provinces`)
    .then((result) => result.data)
    .catch(() => {});

export const addClientLeads = ({ body }) =>
  callApi({ uriEndPoint: leads.addClientLead.v1, body })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((err) => ({ ...err, status: 'notok' }));

export const updateClientLead = ({ body, pathParams }) =>
  callApi({ uriEndPoint: leads.updateClientLead.v1, body, pathParams })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((err) => ({ ...err, status: 'notok' }));

export const inviteClients = ({ body }) =>
  callApi({ uriEndPoint: leads.inviteClient.v1, body })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((err) => ({ ...err, status: 'notok' }));

export const getStudentLeadData = ({ query }) =>
  callApi({ uriEndPoint: leads.getStudentLeadData.v1, query })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((err) => ({ ...err, status: 'notok' }));

export const getStudentFollowUpLeadData = ({ query }) =>
  callApi({ uriEndPoint: leads.getStudentFollowUpLeadData.v1, query })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((err) => ({ ...err, status: 'notok' }));

export const getQualificationsList = ({ query }) =>
  callApi({ uriEndPoint: leads.getQualificationsList.v1, query })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((err) => ({ ...err, status: 'notok' }));

export const getInstituteList = ({ query }) =>
  callApi({ uriEndPoint: leads.getInstituteList.v1, query })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((err) => ({ ...err, status: 'notok' }));

export const getStaffMembers = ({ query }) =>
  callApi({ uriEndPoint: leads.getStaffMembers.v1, query })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((err) => ({ ...err, status: 'notok' }));

export const getOldStaffMembers = ({ query }) =>
  callApi({ uriEndPoint: leads.getOldStaffMembers.v1, query })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((err) => ({ ...err, status: 'notok' }));

export const getParticularStudentLeadData = ({ query, pathParams }) =>
  callApi({ uriEndPoint: leads.getParticularLeadData.v1, query, pathParams })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((err) => ({ ...err, status: 'notok' }));

export const updateParticularStudentLeadData = ({ body, pathParams }) =>
  callApi({ uriEndPoint: leads.updateParticularLeadData.v1, body, pathParams })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((err) => ({ ...err, status: 'notok' }));

export const getClientLeadData = ({ query }) =>
  callApi({ uriEndPoint: leads.getClientLeadData.v1, query })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((err) => ({ ...err, status: 'notok' }));

export const getLeadFollowUp = ({ query, pathParams }) =>
  callApi({ uriEndPoint: leads.getLeadFollowUp.v1, query, pathParams }).catch((err) => ({
    ...err,
    status: 'notok',
  }));

export const updateFollowUp = ({ body, query, pathParams }) =>
  callApi({ uriEndPoint: leads.updateFollowUp.v1, body, query, pathParams })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((err) => ({
      ...err,
      status: 'notok',
    }));

export const getParticularClientLeadData = ({ pathParams, query }) =>
  callApi({
    uriEndPoint: leads.getParticularClientLeadData.v1,
    pathParams,
    query,
  });

export const getClientList = ({ query }) =>
  callApi({
    uriEndPoint: leads.getClientList.v1,
    query,
  });
export const flagWhatsApp = ({ body, pathParams }) =>
  callApi({
    uriEndPoint: leads.flagWhatsApp.v1,
    body,
    pathParams,
  })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((err) => ({ ...err, status: 'notok' }));
export const flagTextMessage = ({ body, pathParams }) =>
  callApi({
    uriEndPoint: leads.flagTextMessage.v1,
    body,
    pathParams,
  })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((err) => ({ ...err, status: 'notok' }));
export const getAssignList = ({ pathParams }) =>
  callApi({ uriEndPoint: leads.getAssignList.v1, pathParams })
    .then((res) => res)
    .catch((err) => err);

export const uploadContent = (body) =>
  callApi({ uriEndPoint: common.uploadContent.v1, body })
    .then((res) => res)
    .catch((err) => err);

export const studentLeadStats = ({ query }) =>
  callApi({ uriEndPoint: leads.studentLeadStats.v1, query })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((err) => ({ ...err, status: 'notok' }));

export const studentFollowUpLeadStats = ({ query }) =>
  callApi({ uriEndPoint: leads.studentFollowUpLeadStats.v1, query })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((err) => ({ ...err, status: 'notok' }));

export const studentScheduleLeadStats = ({ query }) =>
  callApi({ uriEndPoint: leads.studentScheduleLeadStats.v1, query })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((err) => ({ ...err, status: 'notok' }));

export const branchLeadStats = ({ query }) =>
  callApi({ uriEndPoint: leads.branchLeadStats.v1, query });

export const addFollowUp = ({ body, pathParams, query }) =>
  callApi({
    uriEndPoint: leads.addFollowUp.v1,
    body,
    pathParams,
    query,
  })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((err) => ({ ...err, status: 'notok' }));

export const getLastStatusList = () => callApi({ uriEndPoint: leads.getLastStatusList.v1 });

export const getAddFollowUp = ({ pathParams, query }) =>
  callApi({ uriEndPoint: leads.getAddFollowUp.v1, pathParams, query })
    .then((res) => ({
      response: res,
      status: 'ok',
    }))
    .catch((err) => ({ ...err, status: 'error' }));

export const addDemoClass = ({ body, pathParams }) =>
  callApi({ uriEndPoint: leads.addDemoClass.v1, body, pathParams })
    .then((res) => ({
      ...res,
      status: 'ok',
    }))
    .catch((err) => ({ ...err, status: 'error' }));

export const getDemoClass = () => callApi({ uriEndPoint: leads.getDemoClass.v1 });

export const addAssignAssessmentTest = ({ body, pathParams }) =>
  callApi({ uriEndPoint: leads.addAssignAssessmentTest.v1, body, pathParams })
    .then((res) => ({
      ...res,
      status: 'ok',
    }))
    .catch((err) => ({ ...err, status: 'error' }));

export const updateAssignAssessmentTest = ({ body, pathParams }) =>
  callApi({ uriEndPoint: leads.updateAssignAssessmentTest.v1, body, pathParams })
    .then((res) => ({
      ...res,
      status: 'ok',
    }))
    .catch((err) => ({ ...err, status: 'error' }));

export const getAssessmentTest = ({ query }) =>
  callApi({ uriEndPoint: leads.getAssessmentTest.v1, query });

export const getParticularAssessmentTest = ({ pathParams, query }) =>
  callApi({ uriEndPoint: leads.getParticularAssessmentTest.v1, pathParams, query });

export const addLeadPriority = ({ body, pathParams }) =>
  callApi({ uriEndPoint: leads.addLeadPriority.v1, body, pathParams })
    .then((res) => ({ ...res, isOk: 'ok' }))
    .catch((err) => ({ ...err, status: 'notok' }));

export const getActivity = ({ pathParams, query }) =>
  callApi({ uriEndPoint: leads.getActivity.v1, pathParams, query })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((err) => ({ ...err, status: 'notok' }));

export const addLeadNotes = ({ body, pathParams }) =>
  callApi({ uriEndPoint: leads.addLeadNotes.v1, body, pathParams })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((err) => ({ ...err, status: 'notok' }));

export const getLeadNotes = ({ pathParams, query }) =>
  callApi({ uriEndPoint: leads.getLeadNotes.v1, pathParams, query })
    .then((res) => res)
    .catch((err) => ({ ...err, status: 'notok' }));

export const setLeadOwner = ({ body, pathParams }) =>
  callApi({ uriEndPoint: leads.setLeadOwner.v1, body, pathParams })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((err) => ({ ...err, status: 'notok' }));

export const assignAccount = ({ body, pathParams }) =>
  callApi({
    uriEndPoint: leads.assignAccount.v1,
    body,
    pathParams,
  })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((err) => ({ ...err, status: 'notok' }));
export const assignDemoAccount = ({ body, pathParams }) =>
  callApi({
    uriEndPoint: leads.assignDemoAccount.v1,
    body,
    pathParams,
  });

export const assignIndividualLead = ({ body }) =>
  callApi({ uriEndPoint: leads.assignIndividualLead.v1, body })
    .then((res) => ({ ...res, isAssigned: 'ok' }))
    .catch((err) => ({ ...err, isAssigned: 'notok' }));

export const removeLead = ({ pathParams, body }) =>
  callApi({ uriEndPoint: leads.removeLead.v1, pathParams, body });
export const removeLeadEnquiry = ({ pathParams }) =>
  callApi({ uriEndPoint: leads.removeLeadEnquiry.v1, pathParams });
export const getStudentEnquiries = ({ query }) =>
  callApi({ uriEndPoint: leads.getStudentEnquiries.v1, query });
export const getEnquiryStats = ({ query }) =>
  callApi({ uriEndPoint: leads.getEnquiryStats.v1, query });

export const leadSerivcesAfterRegistration = ({ body }) =>
  callApi({ uriEndPoint: leads.leadSerivcesAfterRegistration.v1, body })
    .then((res) => ({ ...res, isAssigned: 'ok' }))
    .catch((err) => ({ ...err, isAssigned: 'notok' }));

export const getLeadCommunicationLog = ({ body, pathParams, query }) =>
  callApi({ uriEndPoint: leads.getLeadCommunicationLog.v1, body, pathParams, query })
    .then((res) => ({ ...res }))
    .catch((err) => ({ ...err }));

export const uploadLeadNotes = ({ body, pathParams }) =>
  callApi({ uriEndPoint: leads.uploadLeadNotes.v1, body, pathParams })
    .then((res) => ({ ...res }))
    .catch((err) => ({ ...err }));

export const markasReadLeadNotes = ({ body, pathParams }) =>
  callApi({ uriEndPoint: leads.markasReadLeadNotes.v1, body, pathParams })
    .then((res) => ({ ...res, status: 'okk' }))
    .catch((err) => ({ ...err }));

export const deleteLeadNotes = ({ body, pathParams }) =>
  callApi({ uriEndPoint: leads.deleteLeadNotes.v1, body, pathParams })
    .then((res) => ({ ...res, status: 'okk' }))
    .catch((err) => ({ ...err }));

export const getSingleLeadNote = ({ body, pathParams }) =>
  callApi({ uriEndPoint: leads.getSingleLeadNote.v1, body, pathParams })
    .then((res) => ({ ...res, status: 'okk' }))
    .catch((err) => ({ ...err }));

export const updateLeadNote = ({ body, pathParams }) =>
  callApi({ uriEndPoint: leads.updateLeadNote.v1, body, pathParams })
    .then((res) => ({ ...res, status: 'okk' }))
    .catch((err) => ({ ...err }));

export const uploadClientLead = ({ body, pathParams }) =>
  callApi({ uriEndPoint: leads.uploadClientLead.v1, body, pathParams })
    .then((res) => ({ ...res, status: 'okk' }))
    .catch((err) => ({ ...err }));

export const deleteLeadFollowup = ({ body, pathParams }) =>
  callApi({ uriEndPoint: leads.deleteLeadFollowup.v1, body, pathParams })
    .then((res) => ({ ...res, status: 'okk' }))
    .catch((err) => ({ ...err }));
export const deleteMultipleLeadNotes = ({ body, pathParams }) =>
  callApi({ uriEndPoint: leads.deleteMultipleLeadNotes.v1, body, pathParams })
    .then((res) => ({ ...res, status: 'okk' }))
    .catch((err) => ({ ...err }));

export const getSingleLeadEnquiry = ({ body, pathParams, query }) =>
  callApi({ uriEndPoint: leads.getSingleLeadEnquiry.v1, body, pathParams, query })
    .then((res) => ({ ...res, status: 'okk' }))
    .catch((err) => ({ ...err }));

export const markasUnreadLeadNotes = ({ body, pathParams, query }) =>
  callApi({ uriEndPoint: leads.markasUnreadLeadNotes.v1, body, pathParams, query })
    .then((res) => ({ ...res, status: 'okk' }))
    .catch((err) => ({ ...err }));

export const markasMultipleReadLeadNotes = ({ body, pathParams, query }) =>
  callApi({ uriEndPoint: leads.markasMultipleReadLeadNotes.v1, body, pathParams, query })
    .then((res) => ({ ...res, status: 'okk' }))
    .catch((err) => ({ ...err }));

export const markasMultipleUnreadLeadNotes = ({ body, pathParams, query }) =>
  callApi({ uriEndPoint: leads.markasMultipleUnreadLeadNotes.v1, body, pathParams, query })
    .then((res) => ({ ...res, status: 'okk' }))
    .catch((err) => ({ ...err }));

export const getLeadAssessmentTest = ({ body, pathParams, query }) =>
  callApi({ uriEndPoint: leads.getLeadAssessmentTest.v1, body, pathParams, query })
    .then((res) => res)
    .catch((err) => ({ ...err }));

export const getSingleLeadAssessmentTest = ({ body, pathParams, query }) =>
  callApi({ uriEndPoint: leads.getSingleLeadAssessmentTest.v1, body, pathParams, query })
    .then((res) => res)
    .catch((err) => ({ ...err }));

export const assignLeadDemoClass = ({ body, pathParams, query }) =>
  callApi({ uriEndPoint: leads.assignLeadDemoClass.v1, body, pathParams, query })
    .then((res) => ({ ...res, status: 'okk' }))
    .catch((err) => ({ ...err }));

export const getLeadDemoClasses = ({ body, pathParams, query }) =>
  callApi({ uriEndPoint: leads.getLeadDemoClasses.v1, body, pathParams, query })
    .then((res) => res)
    .catch((err) => ({ ...err }));

export const checkIsPhoneNumberExists = ({ body }) =>
  callApi({ uriEndPoint: leads.checkIsPhoneNumberExists.v1, body });

export const addLeadEnquiry = ({ body, pathParams }) =>
  callApi({ uriEndPoint: leads.addLeadEnquiry.v1, body, pathParams })
    .then((res) => ({ ...res, status: 'okk' }))
    .catch((err) => ({ ...err }));

export const updateLeadAssessmentTest = ({ body, pathParams }) =>
  callApi({ uriEndPoint: leads.updateLeadAssessmentTest.v1, body, pathParams })
    .then((res) => ({ ...res, status: 'okk' }))
    .catch((err) => ({ ...err }));

export const deleteLeadAssessmentTest = ({ body, pathParams }) =>
  callApi({ uriEndPoint: leads.deleteLeadAssessmentTest.v1, body, pathParams })
    .then((res) => ({ ...res, status: 'okk' }))
    .catch((err) => ({ ...err }));

export const deleteLeadDemoClass = ({ body, pathParams }) =>
  callApi({ uriEndPoint: leads.deleteLeadDemoClass.v1, body, pathParams })
    .then((res) => ({ ...res, status: 'okk' }))
    .catch((err) => ({ ...err }));

export const singleLeadDemoClass = ({ body, pathParams }) =>
  callApi({ uriEndPoint: leads.singleLeadDemoClass.v1, body, pathParams })
    .then((res) => ({ ...res, status: 'okk' }))
    .catch((err) => ({ ...err }));

export const updateLeadDemoClass = ({ body, pathParams }) =>
  callApi({ uriEndPoint: leads.updateLeadDemoClass.v1, body, pathParams })
    .then((res) => ({ ...res, status: 'okk' }))
    .catch((err) => ({ ...err }));

export const changeAssessmentTestStatus = ({ body, pathParams }) =>
  callApi({ uriEndPoint: leads.changeAssessmentTestStatus.v1, body, pathParams })
    .then((res) => ({ ...res, status: 'okk' }))
    .catch((err) => ({ ...err }));

export const downloadAssessmentTest = ({ pathParams }) =>
  callApi({ uriEndPoint: leads.downloadAssessmentTest.v1, pathParams });

export const leadStatusDemoClass = ({ body, pathParams }) =>
  callApi({ uriEndPoint: leads.leadStatusDemoClass.v1, body, pathParams })
    .then((res) => ({ ...res, status: 'okk' }))
    .catch((err) => ({ ...err }));
