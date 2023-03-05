/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable no-shadow */
import React, { useState } from 'react';
import Page from '@/components/Page';
import { Table, Input, Avatar, Row, Pagination, Button } from 'antd';
import { getInitials } from '@/utils/common';
import dayjs from 'dayjs';
import { connect, history } from 'umi';
import { debounce } from 'lodash';
import { ArrowRightOutlined } from '@ant-design/icons';

const clients = {
  result: [
    {
      address: {
        address_line_1: '11',
        city: 'Barrie',
        country_code: 'CA',
        country_name: 'California',
        formattedAddress: '11, Barrie, Manitoba 143001, California',
        id: '10247',
        postal_code: '143001',
        state_code: 'MB',
        state_name: 'Manitoba',
      },
      client_name: 'Sandeep singh',
      client_poc: {
        display_name: 'Dhingra Complex',
        id: '10528',
        store_id: 'ssp.store',
      },
      created_at: '2021-06-21T13:02:49.437Z',
      created_by: 'Store Manager',
      enabled: true,
      id: '10162',
      invitation_status: 'Onboarded',
      last_modified_at: '2021-06-21T13:02:51.267Z',
      logo_image_url:
        'https://cdn.trucktrainingtech.com/pub/user/avatar/0e19ae17-0291-4e8d-8f6b-a706ac9699b4.jpg',
      number_of_employees: 0,
      primary_email: 'Sandeep singh@simbaquartz.com',
      primary_phone: {
        area_code: '334',
        country_code: '+1',
        phone: '3435455',
      },
      store_id: 'ssp.store',
      status: 'contacted',
    },
    {
      address: {
        address_line_1: '16',
        city: 'jakarta',
        country_code: 'CA',
        country_name: 'California',
        formattedAddress: '11, Barrie, Manitoba 143001, California',
        id: '10247',
        postal_code: '143001',
        state_code: 'MB',
        state_name: 'indonasia',
      },
      client_name: 'Sandeep Mansotra',
      client_poc: {
        display_name: 'Supreme Complex',
        id: '10321',
        store_id: 'ssp.store',
      },
      created_at: '2021-06-21T13:02:49.437Z',
      created_by: 'Store Manager',
      enabled: true,
      id: '10162',
      invitation_status: 'Onboarded',
      last_modified_at: '2021-06-21T13:02:51.267Z',
      logo_image_url:
        'https://cdn.trucktrainingtech.com/pub/user/avatar/0e19ae17-0291-4e8d-8f6b-a706ac9699b4.jpg',
      number_of_employees: 0,
      primary_email: 'sandeep@simbaquartz.com',
      primary_phone: {
        area_code: '334',
        country_code: '+1',
        phone: '8546464',
      },
      store_id: 'ssp.store',
      status: 'contacted',
    },
    {
      address: {
        address_line_1: '14',
        city: 'Amrirtsar',
        country_code: 'CA',
        country_name: 'California',
        formattedAddress: '11, Barrie, Manitoba 143001, California',
        id: '10247',
        postal_code: '143001',
        state_code: 'MB',
        state_name: 'Punjab',
      },
      client_name: 'Rasleen Cheema',
      client_poc: {
        display_name: 'ML Complex',
        id: '101654',
        store_id: 'ssp.store',
      },
      created_at: '2021-06-21T13:02:49.437Z',
      created_by: 'Store Manager',
      enabled: true,
      id: '10162',
      invitation_status: 'Onboarded',
      last_modified_at: '2021-06-21T13:02:51.267Z',
      logo_image_url:
        'https://cdn.trucktrainingtech.com/pub/user/avatar/0e19ae17-0291-4e8d-8f6b-a706ac9699b4.jpg',
      number_of_employees: 0,
      primary_email: 'rasleen.cheema@simbaquartz.com',
      primary_phone: {
        area_code: '334',
        country_code: '+1',
        phone: '653285',
      },
      store_id: 'ssp.store',
      status: 'contacted',
    },
    {
      address: {
        address_line_1: '17',
        city: 'Jalandhar',
        country_code: 'CA',
        country_name: 'California',
        formattedAddress: '11, Barrie, Manitoba 143001, California',
        id: '10247',
        postal_code: '143001',
        state_code: 'MB',
        state_name: 'punjab',
      },
      client_name: 'Niharika Sharma',
      client_poc: {
        display_name: 'Abute Complex',
        id: '10163',
        store_id: 'ssp.store',
      },
      created_at: '2021-06-21T13:02:49.437Z',
      created_by: 'Store Manager',
      enabled: true,
      id: '10162',
      invitation_status: 'Onboarded',
      last_modified_at: '2021-06-21T13:02:51.267Z',
      logo_image_url:
        'https://cdn.trucktrainingtech.com/pub/user/avatar/0e19ae17-0291-4e8d-8f6b-a706ac9699b4.jpg',
      number_of_employees: 0,
      primary_email: 'niharika.sharma@simbaquartz.com',
      primary_phone: {
        area_code: '334',
        country_code: '+1',
        phone: '6645445',
      },
      store_id: 'ssp.store',
      status: 'contacted',
    },
  ],
};

const { Search } = Input;
const Clients = ({ dispatch, loading }) => {
  const [searchText, setSearchText] = useState('');
  const [startIndex, setStartIndex] = useState(0);
  const [viewSize, setViewSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  // const [assumeButtonLoading, setAssumeButtonLoading] = useState({});
  // console.log('clients', clients);
  // useEffect(() => {
  //   dispatch({
  //     type: 'client/getAllClients',
  //     payload: {
  //       query: {
  //         keyword: searchText,
  //         view_size: viewSize,
  //         start_index: startIndex,
  //       },
  //     },
  //   });
  // }, [searchText, viewSize, startIndex, dispatch]);

  const columns = [
    {
      title: 'Business name',
      key: 'client_name',
      render: (_, record) => (
        <div>
          {console.log(record, 'record')}
          <div className="flex items-center">
            <div className="p-1 pr-3">
              <Avatar className="bg-blue-800 w-8 uppercase" style={{ backgroundColor: '#2675bf' }}>
                {getInitials(record?.client_name)}
              </Avatar>
            </div>
            <div className="ml-2 w-48">
              <div className="font-medium truncate capitalize" title={record?.client_name}>
                {record?.client_name}
              </div>
              <div className="text-gray-800 text-sm font-semibold">{record?.id}</div>
              <div className="">Since {dayjs(record?.created_at).format('MMMM D, YYYY')}</div>
              {/* <div>
                {record?.invitation_status === 'Pending' ? (
                  <span
                    className="rounded-full bg-red-200 text-red-800 uppercase text-xs px-2 py-1 font-semibold"
                    style={{ fontSize: '9px' }}
                  >
                    Pending
                  </span>
                ) : (
                  <span
                    className="rounded-full bg-green-200 text-green-800 uppercase text-xs px-2 py-1 font-semibold"
                    style={{ fontSize: '9px' }}
                  >
                    {record?.invitation_status}
                  </span>
                )}
              </div> */}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Owner name',
      key: 'client_poc',
      render: (_, record) => (
        <div>
          <div>{record?.client_poc?.display_name}</div>
          <div className="font-medium text-sm text-gray-700">{record?.client_poc?.id}</div>
        </div>
      ),
    },
    {
      title: 'Location',
      key: 'address',
      render: (_, record) => (
        <div>
          <div className="capitalize">{record?.address?.address_line_1}</div>
          <div className="capitalize">{record?.address?.city}</div>
          <div className="capitalize">
            {record?.address?.state_name} ({record?.address?.country_code})
          </div>
        </div>
      ),
    },
    {
      title: 'Phone',
      key: 'primary_phone',
      render: (_, record) => (
        <div>
          ({record?.primary_phone?.area_code}) {record?.primary_phone?.phone?.substring(0, 3)}-
          {record?.primary_phone?.phone?.substring(3)}
        </div>
      ),
    },

    {
      title: 'Email',
      dataIndex: 'primary_email',
      key: 'primary_email',
      render: (data) => <div>{data.toLowerCase()}</div>,
    },
  ];

  const action = (value) => {
    setSearchText(value);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceSearch = React.useCallback(debounce(action, 400), []);
  return (
    <div className="mt-8">
      <Page
        title="All clients"
        PrevNextNeeded="N"
        subTitle={
          <div className="text-sm text-gray-800 font-normal">Manage your clients here.</div>
        }
        primaryAction={
          <Button
            type="primary"
            onClick={() => {
              history.push('/clients/new');
            }}
          >
            Invite client <ArrowRightOutlined />
          </Button>
        }
      >
        <div className="flex p-4 shadow bg-white">
          <div className="w-full bg-white">
            <Search
              onChange={(e) => debounceSearch(e.target.value)}
              size="large"
              placeholder="Enter keyword here to search clients..."
              enterButton
            />
          </div>
        </div>
        <div className="w-full">
          <Table
            loading={loading}
            rowKey={(record) => record?.id}
            className="no-shadow zcp-fixed-w-table"
            rowClassName="cursor-pointer"
            pagination={false}
            dataSource={clients?.result}
            onRow={(record) => ({
              onClick: (e) => {
                e.stopPropagation();
                history.push(`/clients/${record?.id}`);
              },
            })}
            columns={columns}
            footer={() => (
              <Row className="mt-2" type="flex" justify="end">
                <Pagination
                  showSizeChanger
                  pageSizeOptions={['10', '25', '50']}
                  onShowSizeChange={(e, p) => {
                    setViewSize(p);
                    setCurrentPage(1);
                    setStartIndex(0);
                  }}
                  current={currentPage}
                  total={clients?.result?.length}
                  showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                  pageSize={viewSize}
                  onChange={(current) => {
                    setStartIndex(viewSize * (current - 1));
                    setCurrentPage(current);
                  }}
                />
              </Row>
            )}
          />
        </div>
      </Page>
    </div>
  );
};

export default connect(() => ({}))(Clients);
