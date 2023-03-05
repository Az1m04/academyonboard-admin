// TODO : Don't remove commented code
// import { organization } from '@/utils/endpoints/organization';
// import { callApi } from '@/utils/apiUtils';

// export const listOrganizationMembers = ({ accountId, searchCriteria }) =>
//     callApi({
//         uriEndPoint: organization.members.list.v1,
//         pathParams: { accountId },
//         query: searchCriteria,
//     });
export const listOrganizationMembers = () => {
  return {
    records: [
      {
        createdAt: '2021-07-02T10:10:46.329Z',
        displayName: 'Bhupinder  Singh',
        email: 'bhupinder.sandhu@simbaquartz.com',
        firstName: 'Bhupinder ',
        id: '12836',
        isAssumed: false,
        lastLoggedInAt: '2021-09-14T04:52:32.424Z',
        lastModifiedAt: '2021-07-02T10:10:46.329Z',
        lastName: 'Singh',

        photoUrl:
          'https://cdn.managemyorg.com/pub/user/avatar/8827a881-9f34-4cbd-b371-8eab20cb4e80.png',
        self: false,
        timezone: 'Asia/Kolkata',
      },
      {
        createdAt: '2021-07-01T08:05:10.406Z',
        displayName: 'Jobanjit Josan',
        email: 'jobanjit.josan@simbaquartz.com',
        firstName: 'Jobanjit',
        id: '12811',
        isAssumed: false,
        lastLoggedInAt: '2021-09-02T13:12:55.672Z',
        lastModifiedAt: '2021-07-01T08:05:10.406Z',
        lastName: 'Josan',

        photoUrl:
          'https://cdn.managemyorg.com/pub/user/avatar/5f76d880-ca7e-468a-a023-e4dad47f0983.png',
        self: false,
        timezone: 'Asia/Kolkata',
      },
    ],
  };
};
