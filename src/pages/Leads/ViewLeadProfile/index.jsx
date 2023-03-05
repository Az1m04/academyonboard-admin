import React, { useEffect } from 'react';
import { connect, useParams } from 'umi';
import LeadProfile from '../LeadProfile';

const ViewLeadProfile = ({ dispatch, clientLeadRecord, loadingForGetSingleLead }) => {
  const { leadId } = useParams();
  useEffect(() => {
    dispatch({
      type: 'leads/getParticularClientLeadData',
      payload: { pathParams: { leadId } },
    });
  }, [leadId, dispatch]);

  return (
    <div>
      <LeadProfile
        clientLeadRecord={clientLeadRecord}
        loadingForGetSingleLead={loadingForGetSingleLead}
      />
    </div>
  );
};

export default connect(({ leads, loading }) => ({
  clientLeadRecord: leads?.clientLeadRecord,
  loadingForGetSingleLead: loading?.effects['leads/getParticularClientLeadData'],
}))(ViewLeadProfile);
