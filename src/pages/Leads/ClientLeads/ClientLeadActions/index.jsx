import { message, Popconfirm } from 'antd';
import React from 'react';
import { history, connect } from 'umi';

const ClientLeadActions = ({ partyId, record, setActionKey, dispatch, getClients }) => {
  const list = [
    {
      name: 'Edit',
      value: 'EDIT',
    },
    {
      name: 'Register as branch',
      value: 'REGISTER_AS_BRANCH',
    },
    {
      name: 'Lead priority',
      value: 'LEAD_PRIORITY',
      subTitle: 'Set Lead priority',
    },
    {
      name: 'Add note',
      value: 'ADD_NOTE',
      subTitle: 'Add note',
    },
    {
      name: 'Lead owner',
      value: 'LEAD_OWNER',
      subTitle: 'Set owner',
    },
    {
      name: 'Add follow up',
      value: 'ADD_FOLLOW_UP',
      subTitle: 'Add follow up',
    },
    {
      name: 'Activity timeline',
      value: 'ACTIVITY_TIMELINE',
    },
    {
      name: 'Assign demo account',
      value: 'ASSIGN_DEMO_ACCOUNT',
      subTitle: 'for the lead here',
    },
    {
      name: 'Assign Individual Lead',
      value: 'ASSIGN_INDIVIDUAL_LEAD',
      subTitle: 'for the lead here',
    },
  ];

  return (
    <div className="bg-white rounded-sm shadow z-50" style={{ zIndex: 1000 }}>
      {record?.leadStatusId !== 'LEAD_CLOSED' &&
        list?.map((item) => (
          <div
            key={item?.value}
            onClick={() => {
              if (item?.value === 'EDIT') {
                history.push(`/leads/client/${partyId}/editLead`);
              } else if (item?.value === 'REGISTER_AS_BRANCH') {
                history.push(`/clients/invite/${partyId}`);
              } else if (item?.value !== 'REGISTER_AS_BRANCH') {
                setActionKey({
                  id: partyId,
                  key: item?.value,
                  subTitle: item?.subTitle,
                  title: item?.name,
                });
              }
            }}
            className={`border-b p-3 border-gray-300 cursor-pointer hover:bg-yellow-50 `}
            disable={record?.status === 'Closed' ? true : null}
          >
            {item?.name}
          </div>
        ))}
      <Popconfirm
        // getPopupContainer={(node) => node.parentNode}
        title="Are you sure that you want to delete this lead?"
        onConfirm={() => {
          dispatch({
            type: 'leads/removeLead',
            payload: {
              pathParams: {
                leadId: partyId,
              },
              body: {
                isEnabled: true,
              },
            },
          }).then((res) => {
            if (res) {
              message.success('Your lead is deleted successfully');
              getClients();
            }
          });
        }}
        okText="Yes"
        cancelText="No"
      >
        <div
          key={'DELETE'}
          className={`border-b p-3 border-gray-300 cursor-pointer hover:bg-yellow-50`}
        >
          Delete
        </div>
      </Popconfirm>
    </div>
  );
};

export default connect(() => ({}))(ClientLeadActions);
