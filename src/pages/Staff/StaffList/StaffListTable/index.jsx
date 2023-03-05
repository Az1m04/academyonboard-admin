import React from 'react';
import { Table, Input, Row, Pagination, Button, Popconfirm, message } from 'antd';
import dayjs from 'dayjs';
import SearchNotFound from '@/assets/icons/empty-search-contact.png';
import { debounce } from 'lodash';
import { connect } from 'umi';
// import { getInitials } from '@/utils/common';

import relativeTime from 'dayjs/plugin/relativeTime';
import { EnvelopeFillIcon, PersonFill, TelephoneFillIcon } from '@/utils/AppIcons';

dayjs.extend(relativeTime);

const { Search } = Input;

/**
 *
 * @updateDisable - The purpose of this function is to update enabled prop to y or n
 */

const StaffListTable = ({
  activeTab,
  currentPage,
  setViewSize,
  setCurrentPage,
  viewSize,
  setKeyword,
  staffLoading,
  dispatch,
  staffList,
  currentUser,
  getStaffList,
  keyword,
  history,
  // primaryColor,
}) => {
  function handleChangePagination(current, size) {
    // check if size is diff from previous set current page as one
    setCurrentPage(size !== viewSize ? 1 : current);
    setViewSize(size);
    getStaffList(activeTab, current, size, keyword);
  }

  const action = (value) => {
    setKeyword(value);
    setCurrentPage(1);
    getStaffList(activeTab, 1, viewSize, value);
  };
  /**
   *
   * @param {object} staff
   */

  const updateDisable = (staff) => {
    dispatch({
      type: 'staff/disableStaff',
      payload: {
        pathParams: {
          partyId: staff?.partyId,
        },
      },
    })
      .then(() => {
        message.success(`${staff?.displayName || 'Staff'}'s account has been disabled`);
      })
      .catch(() => {});
  };

  const enableStaff = (staff) =>
    dispatch({
      type: 'staff/enableStaff',
      payload: {
        body: { isEnabled: true, reason: 'hello', notes: 'reactivate notes' },
        pathParams: {
          partyId: staff?.partyId,
        },
      },
    })
      .then(() => {
        message.success(`${staff?.displayName || 'Staff'}'s account has been enabled`);
      })
      .catch(() => {});

  const debounceSearch = debounce(action, 400);

  const srNumberColumnCell = {
    title: 'Sr. No.',
    dataIndex: 'srno',
    align: 'center',
    render: (_, __, index) => index + 1 + viewSize * (currentPage - 1),
  };
  const displayNameColumnCell = {
    title: 'Name',
    dataIndex: 'displayName',
    render: (name, record) => (
      <div className="flex items-center">
        {/* <Avatar className=" w-8 uppercase" style={{ backgroundColor: primaryColor }}>
          {name && getInitials(name)}
        </Avatar> */}
        <div className="">
          <div className="font-medium truncate capitalize flex " title={record.name && record.name}>
            <p className="mb-0 mt-0.5 mr-1 text-yellow-500">
              <PersonFill />
            </p>
            <p className="mb-0">{record.displayName && record.displayName}</p>
          </div>
          <div className="flex">
            <p className="mb-0 mt-1 mr-1 text-yellow-500">
              <EnvelopeFillIcon />
            </p>
            <p className="mb-0">{record?.primaryEmail}</p>
          </div>
          <div className="flex">
            <p className="mb-0 mt-1 mr-1 text-yellow-500">
              <TelephoneFillIcon />
            </p>
            <p className="mb-0">
              {record?.phone?.countryCode}
              {record?.phone?.areaCode}
              {record?.phone?.phone}
            </p>
          </div>
          {/* <div className="">Requested on {dayjs(record.lastInviteDate).format('MMMM D, YYYY')}</div> */}
        </div>
      </div>
    ),
  };

  const emailColumnCell = {
    title: ' Email',
    dataIndex: 'primaryEmail',
    render: (data) => <p>{data}</p>,
  };

  const invitedByCell = {
    title: 'Invited By',
    dataIndex: 'invitedByInfo',
    render: (_, record) => (
      <div className="">
        <div>
          Invited by{' '}
          <span className="font-medium text-gray-800">{record?.invitedByInfo?.name}</span>
        </div>
        <div>on {dayjs(record.lastInvitedOn).format('MMMM D, YYYY')}</div>
      </div>
    ),
  };
  // const walletStatus = {
  //   title: 'Wallet status',
  //   dataIndex: 'walletStatus',
  //   render: () => <div>1000</div>,
  // };
  const department = {
    title: 'Department',
    dataIndex: 'department',
    render: (data) => <div>{data || 'N/A'}</div>,
  };
  const designation = {
    title: 'Designation  ',
    dataIndex: 'designation ',
    render: (__, record) => <div>{record?.designation || 'N/A'}</div>,
  };
  const status = {
    title: 'Status',
    dataIndex: 'status',
    render: (__, record) => (
      <div>
        {(record?.statusId === 'PARTYINV_SENT' && 'Awaiting Response') ||
          (record?.statusId === 'PARTYINV_ACCEPTED' && 'Enabled') ||
          (record?.statusId === 'INV_ACCPTD_DSBLD' && 'Disabled')}
      </div>
    ),
  };
  const disableButtonCell = (record) => (
    <Popconfirm
      title="Are you sure you want to disable this staff member?"
      onConfirm={(e) => {
        updateDisable(record);
        e.stopPropagation();
      }}
      okText="Disable"
      cancelText="Cancel"
      okType="danger"
      okButtonProps={{ type: 'primary' }}
      onCancel={(e) => {
        e.stopPropagation();
      }}
      getPopupContainer={(node) => node.parentNode}
    >
      <Button
        onClick={(e) => {
          e.stopPropagation();
        }}
        size="small"
        type="danger"
      >
        Disable
      </Button>
    </Popconfirm>
  );

  const enableButtonCell = (record) => (
    <Popconfirm
      title="Are you sure you want to enable this staff member?"
      onConfirm={(e) => {
        enableStaff(record);
        e.stopPropagation();
      }}
      okText="Enable"
      cancelText="Cancel"
      onCancel={(e) => {
        e.stopPropagation();
      }}
      getPopupContainer={(node) => node.parentNode}
    >
      <Button
        onClick={(e) => {
          e.stopPropagation();
        }}
        size="small"
        type="primary"
        disabled={record.partyId === currentUser.id}
      >
        Enable
      </Button>
    </Popconfirm>
  );

  const activeColumns = [
    srNumberColumnCell,
    displayNameColumnCell,
    // emailColumnCell,
    department,
    // walletStatus,
    designation,
    invitedByCell,
    {
      title: 'Action',
      dataIndex: 'statusId',
      render: (text, record) => disableButtonCell(record),
    },
  ];

  const inactiveColumns = [
    srNumberColumnCell,
    displayNameColumnCell,
    emailColumnCell,
    department,
    designation,
    invitedByCell,
    {
      title: 'Action',
      dataIndex: 'statusId',
      render: (text, record) => enableButtonCell(record),
    },
  ];

  const awaitingColumns = [
    srNumberColumnCell,
    displayNameColumnCell,
    emailColumnCell,
    department,
    invitedByCell,
  ];

  const allTabColumns = [
    srNumberColumnCell,
    displayNameColumnCell,
    emailColumnCell,
    department,
    invitedByCell,
    status,
  ];

  const getActiveTabColumn = () => {
    switch (activeTab) {
      case 'active':
        return activeColumns;
      case 'inactive':
        return inactiveColumns;
      case 'awaiting':
        return awaitingColumns;
      default:
        return allTabColumns;
    }
  };

  return (
    <div>
      <div className="flex mx-4 mb-4">
        <div className="w-full mt-4">
          <Search
            size="large"
            placeholder="Enter keyword here to search staff..."
            onInput={(value) => debounceSearch(value.target.value)}
          />
        </div>
      </div>
      <div className="w-full">
        <Table
          className="no-shadow zcp-fixed-w-table"
          rowClassName="cursor-pointer"
          pagination={false}
          scroll={{ x: 1100 }}
          columns={getActiveTabColumn()}
          dataSource={staffList?.records}
          // rowKey={(record) => record.id}
          loading={staffLoading}
          onRow={(record) => ({
            onClick: () => {
              history.push(`/staff/${record?.partyId}/profile`);
            },
          })}
          locale={{
            emptyText: (
              <div className="text-center flex justify-center items-center">
                <div>
                  <p className="text-lg">No staff member invited yet!</p>
                  <img
                    className=" ml-16"
                    src={SearchNotFound}
                    alt="No staff member found!"
                    style={{ height: '100px' }}
                  />
                </div>
              </div>
            ),
          }}
          footer={() => (
            <Row className="mt-2" type="flex" justify="end">
              <Pagination
                key={`page-${currentPage}`}
                showSizeChanger
                pageSizeOptions={['10', '25', '50', '100']}
                defaultCurrent={1}
                current={currentPage}
                pageSize={viewSize}
                total={staffList?.totalCount}
                showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                onChange={handleChangePagination}
              />
            </Row>
          )}
        />
      </div>
    </div>
  );
};
export default connect(({ loading, staff, user, settings }) => ({
  currentUser: user.currentUser,
  staffLoading: loading.effects['staff/getStaffList'],
  staffList: staff.staffList,
  primaryColor: settings.primaryColor,
}))(StaffListTable);
