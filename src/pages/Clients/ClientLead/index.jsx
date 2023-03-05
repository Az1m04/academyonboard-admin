/* eslint-disable no-unused-vars */
/* eslint-disable no-trailing-spaces */
/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable no-shadow */
import React, { useState } from 'react';
import Page from '@/components/Page';
import { Table, Input, Avatar, Row, Pagination, Button, Dropdown, Icon, Menu, Tooltip } from 'antd';
import { getInitials } from '@/utils/common';
import dayjs from 'dayjs';
import { history } from 'umi';
import { debounce } from 'lodash';

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
      client_name: 'Lavkash Bhardwaj',
      client_poc: {
        display_name: 'Dhingra Complex',
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
      primary_email: 'lavkash.bhardwaj@simbaquartz.com',
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
      client_name: 'Sandeep Mansotra',
      client_poc: {
        display_name: 'Supreme Complex',
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
      primary_email: 'sandeep@simbaquartz.com',
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
      client_name: 'Rasleen Cheema',
      client_poc: {
        display_name: 'ML Complex',
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
      primary_email: 'rasleen.cheema@simbaquartz.com',
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
        phone: '3435455',
      },
      store_id: 'ssp.store',
      status: 'contacted',
    },
  ],
};

const { Search } = Input;
const ClientLead = ({ loading }) => {
  const [searchText, setSearchText] = useState('');
  const [startIndex, setStartIndex] = useState(0);
  const [viewSize, setViewSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [record, setRecord] = useState('');
  const [postRecord, setPostRecord] = useState('');

  // Add follower popup modal state
  // eslint-disable-next-line no-unused-vars
  const [addFollowerModal, setAddFollowerModal] = useState(false);

  // PostupdatePopUpModal state
  const [postUpdateButton, setPostUpdateButton] = useState();

  // States & functions for Drawer component
  const [visible, setVisible] = useState();

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  // Functions for popover on view button hover
  const content = <p>Quick view lead details</p>;

  // console.log('clients', clients);

  // icon for Activity in drawer
  const ThunderIcon = () => (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
      className="bi bi-lightning-fill"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z"
      />
    </svg>
  );
  const menu = () => (
    <Menu>
      <Menu.Item key="0">
        <a href="http://www.alipay.com/">1st menu item</a>
      </Menu.Item>
      <Menu.Item key="1">
        <a href="http://www.taobao.com/">2nd menu item</a>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="3">3rd menu item</Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: 'Name',
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
              <div className="font-medium text-blue-700 " title={record?.client_name}>
                {record?.client_name}
              </div>
              <div className="">{record?.primary_email}</div>
              <div className="font-semibold">
                Added {dayjs(record?.created_at)?.format('HH')} hours ago
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Company',
      key: 'client_poc',
      render: (_, record) => (
        <div className="font-semibold text-sm">{record?.client_poc?.display_name}</div>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => (
        <div>
          <Dropdown trigger={['click']} overlay={menu}>
            <p className="" onClick={(e) => e.stopPropagation()}>
              contacted
              <Icon type="caret-down" />
            </p>
          </Dropdown>
        </div>
      ),
    },
    {
      title: 'Contacted',
      key: 'primary_phone',
      render: (_, record) => (
        <div>
          <p className=""> {dayjs(record?.created_at).format('MMM D, YYYY h:mm A')}</p>
          <p className="flex">
            via{' '}
            <p className="mx-1 font-semibold">
              Phone <Icon type="mobile" />
            </p>
          </p>
        </div>
      ),
    },
    {
      // title: 'Contacted',
      key: 'primary_phone',
      render: (_, record) => (
        <div>
          <Tooltip title="Quick view lead details">
            <Icon
              type="select"
              onClick={(e) => {
                e.stopPropagation();
                setRecord(record);
                setPostRecord(record);
                showDrawer();
              }}
            />
          </Tooltip>
        </div>
      ),
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
        title="Client leads"
        PrevNextNeeded="N"
        subTitle={
          <div className="text-sm text-gray-800 font-normal">View your client leads here.</div>
        }
        primaryAction={
          <Button
            type="primary"
            onClick={() => {
              history.push('/clients/leads/new');
            }}
          >
            Add lead <Icon type="plus-square" />
          </Button>
        }
      >
        <div className="flex p-4 shadow bg-white">
          <div className="w-full bg-white">
            <Search
              onChange={(e) => debounceSearch(e.target.value)}
              size="large"
              placeholder="Enter keyword here to search leads..."
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
            columns={columns}
          />
          <Row className="mt-10 mb-10" type="flex" justify="end">
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
        </div>
        {/* <Drawer
          className={classNames(styles?.DrawerContainer)}
          onClose={onClose}
          width={600}
          destroyOnClose
          bodyStyle={{ padding: 0 }}
          visible={visible}
        >
          <div className="bg-white">
            <div className="bg-gray-700 bg-gradient-to-r from-green-400 to-blue-500 h-32 absolute w-full z-0" />
            <div className="flex flex-col overflow-y-auto h-full space-y-4 pt-16">
              <div className="w-full flex-col z-10 justify-center">
                <div className="flex flex-col items-center p-4 space-y-4">
                  <div className="rounded-full border-4 border-white ">
                    <Avatar className="bg-blue-600" size={100}>
                      {getInitials(record?.client_name)}
                    </Avatar>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-2xl font-bold">{record?.client_name}</div>
                    <div className="font-semibold text-gray-700 flex">
                      <svg
                        width="1em"
                        height="1em"
                        viewBox="0 0 16 16"
                        className="bi bi-building mr-1 mt-1 text-base"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M14.763.075A.5.5 0 0 1 15 .5v15a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5V14h-1v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V10a.5.5 0 0 1 .342-.474L6 7.64V4.5a.5.5 0 0 1 .276-.447l8-4a.5.5 0 0 1 .487.022zM6 8.694L1 10.36V15h5V8.694zM7 15h2v-1.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5V15h2V1.309l-7 3.5V15z"
                        />
                        <path d="M2 11h1v1H2v-1zm2 0h1v1H4v-1zm-2 2h1v1H2v-1zm2 0h1v1H4v-1zm4-4h1v1H8V9zm2 0h1v1h-1V9zm-2 2h1v1H8v-1zm2 0h1v1h-1v-1zm2-2h1v1h-1V9zm0 2h1v1h-1v-1zM8 7h1v1H8V7zm2 0h1v1h-1V7zm2 0h1v1h-1V7zM8 5h1v1H8V5zm2 0h1v1h-1V5zm2 0h1v1h-1V5zm0-2h1v1h-1V3z" />
                      </svg>
                     Individual
                    </div>
                    <div className=" flex flex justify-between items-center w-full mt-5 mb-5">
                      <Tooltip title="Request status update from assignee(s).">
                        <Button type="default" size="middle">
                          Request Update
                        </Button>
                      </Tooltip>
                      <div className="mx-32" />
                      <div className="flex font-semibold text-gray-700">
                        <Icon type="clock-circle" className="mr-1 mt-1 text-base" /> Last modified{' '}
                        {dayjs('2021-06-21T13:02:49.437Z').fromNow()}
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full">

                      <div className="">
                        <div className="app-label">Assignee</div>
                        <div className="mt-3">
                          <div className="flex items-center">
                            <div className="flex items-center justify-between">
                              <div>
                                <div
                                  className="flex items-center space-x-3
                                   "
                                >
                                  <div>
                                    <Avatar className="bg-primary">
                                      {getInitials(record?.client_name)}
                                    </Avatar>
                                  </div>
                                  <div className="text-left ml-2">
                                    <div className="text-black font-medium text-sm ">
                                      {record?.client_name}
                                    </div>

                                    <div className="text-sm text-gray-600">New Assignee</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>


                      <div className="pb-2">
                        <div className="text-right app-label pb-3">Followers</div>
                        <div className="mt-2">
                          <div className="flex justify-end items-center ">
                            <div className="">
                              <Popover

                                content={<Avatar>{getInitials(record?.client_name)}</Avatar>}
                              >
                                <Badge
                                  className="text-red-500"
                                  count={

                                    <Icon type="close-circle" theme="filled" />
                                  }
                                >
                                  <Avatar>

                                    {getInitials(record?.client_name)}
                                  </Avatar>
                                </Badge>
                              </Popover>
                              <Tooltip title="Add followers">
                                <Button
                                  type="dashed"
                                  shape="circle"
                                  className="mx-2"
                                  onClick={() => setAddFollowerModal(true)}
                                >
                                  <Icon
                                    type="plus"
                                    className="text-gray-700 text-sm align-bottom"
                                  />
                                </Button>
                              </Tooltip>


                              <AddFollowerPopUpModel
                                visible={addFollowerModal}
                                setVisible={setAddFollowerModal}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>


                    <div
                      aria-hidden="true"
                      className="cursor-pointer w-full py-2 mt-5 border-t border-b"
                      onClick={() => setPostUpdateButton(true)}
                    >
                      <PostUpdatePopUpModal
                        visible={postUpdateButton}
                        setVisible={setPostUpdateButton}
                        record={postRecord}

                      />
                      <div className="flex items-center justify-between">
                        <div className="">
                          <Avatar>{getInitials(record?.client_name)}</Avatar>
                        </div>
                        <p className="flex-auto text-gray-500 font-medium pl-2">
                          Post an update for {record?.client_poc?.display_name}
                        </p>
                        <div className="text-gray-500">
                          <Icon type="wechat" className="text-2xl" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-100 py-2  text-center font-semibold flex ">
                      <div className="flex">
                        <span className="text-blue-600 pr-2 py-1">{ThunderIcon()}</span>
                        <p className="">Activity</p>
                      </div>
                      <div className="mx-64" />
                      <div className="" />
                    </div>

                    <PartyActivityTab />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Drawer> */}
      </Page>
    </div>
  );
};

export default ClientLead;
