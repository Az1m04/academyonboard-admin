import React, { useState } from 'react';
import { Table, Input, Row, Pagination, Tooltip, Button, Popconfirm, message } from 'antd';
// import { getIntials } from '@/utils/utils';
import dayjs from 'dayjs';
import SearchNotFound from '@/assets/icons/empty-search-contact.png';
import { debounce } from 'lodash';
import { connect, history, useLocation } from 'umi';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
  EnvelopeAction,
  EnvelopeFillIcon,
  PhoneIconAction,
  TelephoneFillIcon,
  WhatsAppAction,
  PersonFill,
} from '@/utils/AppIcons';
import { CheckValidationWithoutDiv as CheckValidation } from '@/components/CheckValidation';
import GenerateWhatsAppMessage from '@/components/GenerateWhatsAppMessage';
import GenerateEmail from '@/components/GenerateEmail';
import GeneratePhone from '@/components/GeneratePhone';

dayjs.extend(relativeTime);

const { Search } = Input;

/**
 *
 * @updateDisable - The purpose of this function is to update enabled prop to y or n
 */

const StudentsListTable = ({
  currentPage,
  setViewSize,
  setCurrentPage,
  setStartIndex,
  viewSize,
  awaiting,
  setKeyword,
  totalRecords,
  dispatch,
  clientList,
  currentUser,
  loading,
  newStudentList,
  setSelectedRows,
  selectedRows,
  selectedRowKeys,
  setSelectedRowKeys,
}) => {
  const [visibleWhatsApp, setVisibleWhatsApp] = useState(false);
  const [recordDetails, setRecordDetails] = useState([]);
  const [visibleEmail, setVisibleEmail] = useState(false);
  const [isPhoneVisible, setIsPhoneVisible] = useState(false);

  const location = useLocation();

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKey, selectedTableRows) => {
      setSelectedRowKeys(selectedRowKey);
      setSelectedRows(selectedTableRows);
    },
  };

  function handleChangePagination(current) {
    setStartIndex(viewSize * (current - 1));
    setCurrentPage(current);
  }
  const action = (value) => {
    setKeyword(value);
  };
  /**
   *
   * @param {object} staff
   */

  const updateDisable = (staff) => {
    dispatch({
      type: 'student/enableDisableStudent',
      payload: {
        pathParams: {
          type: staff?.enabled ? 'deactivate' : 'reactivate',
          partyId: staff.id,
        },
      },
    }).then((res) => {
      if (res) {
        message.success(
          `${staff.name}'s account has been ${staff?.enabled ? 'disabled' : 'enabled'}`,
        );
        newStudentList();
      }
    });
  };

  const debounceSearch = debounce(action, 400);
  const renderActionButton = (record) => {
    if (record && record.enabled) {
      return (
        <Popconfirm
          title="Are you sure you want to disable this student?"
          onConfirm={(e) => {
            updateDisable(record);
            e.stopPropagation();
          }}
          okText="Disable"
          cancelText="Cancel"
          okType="danger"
          onCancel={(e) => {
            e.stopPropagation();
          }}
        >
          <Button
            onClick={(e) => {
              e.stopPropagation();
            }}
            size="small"
            type="danger"
            disabled={record?.id === currentUser?.id}
          >
            Disable
          </Button>
        </Popconfirm>
      );
    }
    return (
      <Popconfirm
        title="Are you sure you want to enable this student?"
        onConfirm={(e) => {
          updateDisable(record);
          e.stopPropagation();
        }}
        okText="Enable"
        cancelText="Cancel"
        okType="danger"
        onCancel={(e) => {
          e.stopPropagation();
        }}
      >
        <Button
          onClick={(e) => {
            e.stopPropagation();
          }}
          size="small"
          type="primary"
        >
          Enable
        </Button>
      </Popconfirm>
    );
  };
  const srNoCell = {
    title: 'Sr.no.',
    dataIndex: 'srno',
    align: 'center',
    width: 50,
    render: (_, __, index) => index + 1 + viewSize * (currentPage - 1),
  };
  const nameCell = {
    title: <span className="ml-10"> Name</span>,
    dataIndex: 'name',

    sorter: (a, b) => {
      if (a?.name?.toLowerCase() === b?.name?.toLowerCase()) {
        return 0;
      }
      const val = a?.name?.toLowerCase() > b?.name?.toLowerCase();
      return val ? 1 : -1;
    },
    render: (name, record) => (
      <div className="flex items-center">
        <div className="p-1 pr-4">
          {/* <div>{viewSize * (currentPage - 1) + clientList.records.indexOf(record) + 1}</div> */}
        </div>
        {/* <Avatar className="w-8 uppercase bg-blue-800" style={{ backgroundColor: '#ffa500' }}>
          {name && getIntials(name)}
        </Avatar> */}
        <div className="w-48 ml-2">
          <div className="flex">
            <p className="mb-0 mt-0.5 mr-1 text-yellow-500">
              <PersonFill />
            </p>
            <div
              className="font-medium capitalize truncate ml-1.5"
              title={record.name && record.name}
            >
              {record.name && record.name}
            </div>
          </div>
          <div className="flex">
            <p className="mb-0 mt-1 mr-1 text-yellow-500">
              <EnvelopeFillIcon />
            </p>
            <p className="mb-0 mx-2 ">{record?.primaryEmail}</p>
          </div>
          <div className="flex">
            <p className="mb-0 mt-1 mr-1 text-yellow-500">
              <TelephoneFillIcon />
            </p>
            <p className="mb-0 mx-2 w-40">{record?.formattedPhone}</p>
          </div>
          {/* <div className="">Requested on {dayjs(record.createdDate).format('MMMM D, YYYY')}</div> */}
        </div>
      </div>
    ),
  };
  const invitedOnCell = {
    title: 'Invited on',
    dataIndex: 'last_invited_on',
    render: (data) => <p>{dayjs(data).format('MMMM D, YYYY')}</p>,
  };
  // const phoneCell = {
  //   title: ' Phone',
  //   dataIndex: 'phoneFormatted',
  //   render: (phone) => (
  //     <p>{phone || <p className="font-medium flex items-center"> 9876543210</p>}</p>
  //   ),
  // };
  // const emailCell = {
  //   title: ' Email',
  //   dataIndex: 'primaryEmail',
  //   render: (data) => <p>{data}</p>,
  // };
  // const inviedByCell = {
  //   title: ' Invited by',
  //   dataIndex: 'party_id_from',
  //   render: (data) => (
  //     <div className="">
  //       <p>{data?.name}</p>
  //     </div>
  //   ),
  // };

  const studentStatusCell = {
    title: 'Status',
    dataIndex: 'studentStatus',
    render: (data, record) => (
      <div>{record?.courseStatus || <span className="text-center pl-8">--</span>}</div>
    ),
  };
  const walletStatus = {
    title: 'Wallet status',
    dataIndex: 'walletStatus',
    render: () => <div>1000</div>,
  };

  const courseCell = {
    title: 'Course',
    dataIndex: 'enrollmentDetails',
    render: (data) => data?.programName || '-',
  };
  const statusCell = {
    title: 'Status',
    dataIndex: 'status',
    render: (data) => data || '-',
  };

  const allColumns = [
    srNoCell,
    nameCell,
    //  phoneCell, emailCell,
    courseCell,
    statusCell,
    studentStatusCell,
  ];

  const inactiveColumns = [
    srNoCell,
    nameCell,
    // phoneCell,
    // emailCell,
    courseCell,
    statusCell,
    studentStatusCell,
    {
      title: '',
      dataIndex: 'statusId',
      // render: (text, record) => (
      //   <div>
      //     <ThreeDotsVertical />
      //   </div>
      // ),
      render: (text, record) => <div>{renderActionButton(record)}</div>,
    },
  ];

  const activeColumns = [
    srNoCell,
    nameCell,
    // phoneCell,
    // emailCell,
    courseCell,
    studentStatusCell,
    walletStatus,
    invitedOnCell,

    {
      width: 10,
      title: 'Action',
      dataIndex: '',
      render: (_, record) => (
        <div className="flex space-x-3">
          <Tooltip title="Generate whatsapp message">
            <div
              className="cursor-pointer"
              onClick={(ev) => {
                ev.stopPropagation();
                setVisibleWhatsApp(true);
                setRecordDetails([record]);
              }}
            >
              <WhatsAppAction />
            </div>
          </Tooltip>

          <Tooltip title="Generate email message">
            <div
              className="cursor-pointer"
              onClick={(ev) => {
                ev.stopPropagation();
                setVisibleEmail(true);
                setRecordDetails([record]);
              }}
            >
              <EnvelopeAction />
            </div>
          </Tooltip>
          {/* <Tooltip title="Add note">
            <div
              className="cursor-pointer"
              onClick={() => {
                setIsNoteVisible(true);
                setRecordDetails([record]);
              }}
            >
              <Badge count={0} size="small" showZero>
                <CopyIconAction />
              </Badge>
            </div>
          </Tooltip> */}

          <Tooltip title="Generate text message">
            <div
              className="cursor-pointer"
              onClick={(ev) => {
                ev.stopPropagation();
                setIsPhoneVisible(true);
                setRecordDetails([record]);
              }}
            >
              <PhoneIconAction />
            </div>
          </Tooltip>
        </div>
      ),
    },
    {
      title: '',
      dataIndex: 'statusId',
      render: (text, record) => <div>{renderActionButton(record)}</div>,
    },
  ];

  const getColumns = () => {
    const lastUrl = location?.pathname?.split('/')[location?.pathname?.split('/')?.length - 1];
    switch (lastUrl) {
      case 'active':
        return activeColumns;
      case 'inactive':
        return inactiveColumns;
      default:
        return allColumns;
    }
  };

  return (
    <div>
      <div className="flex mx-4 mb-4">
        <div className="w-full mt-4">
          <Search
            size="large"
            placeholder="Enter keyword here to search students..."
            onInput={(value) => debounceSearch(value.target.value)}
          />
        </div>
      </div>
      <div className="w-full">
        <Table
          scroll={{ x: 100 }}
          className="no-shadow zcp-fixed-w-table"
          rowClassName="cursor-pointer"
          pagination={false}
          columns={getColumns()}
          dataSource={clientList}
          rowKey={(record) => record.id}
          rowSelection={{
            type: 'checkbox',
            ...rowSelection,
          }}
          // loading={staffLoading}
          loading={loading}
          onRow={(record) => ({
            onClick: () => {
              if (!awaiting) {
                history.push(`/students/${record.id}`);
              }
            },
          })}
          locale={{
            emptyText: (
              <div className="flex items-center justify-center text-center">
                <div>
                  <p className="text-lg">No student added yet!</p>
                  <img
                    className="ml-16 "
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
                onShowSizeChange={(e, p) => {
                  setViewSize(p);
                  setCurrentPage(1);
                  setStartIndex(0);
                }}
                defaultCurrent={1}
                current={currentPage}
                pageSize={viewSize}
                total={totalRecords}
                showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                onChange={handleChangePagination}
              />
            </Row>
          )}
        />
      </div>
      <CheckValidation show={visibleWhatsApp}>
        <GenerateWhatsAppMessage
          type="student"
          purpose={'general'}
          visible={visibleWhatsApp}
          setVisible={setVisibleWhatsApp}
          recordDetails={recordDetails}
          setRecordDetails={setRecordDetails}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          setSelectedRowKeys={setSelectedRowKeys}
        />
      </CheckValidation>
      <CheckValidation show={visibleEmail}>
        <GenerateEmail
          type="student"
          purpose={'general'}
          visible={visibleEmail}
          setVisible={setVisibleEmail}
          recordDetails={recordDetails}
          setRecordDetails={setRecordDetails}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          setSelectedRowKeys={setSelectedRowKeys}
        />
      </CheckValidation>
      <CheckValidation show={isPhoneVisible}>
        <GeneratePhone
          isPhoneVisible={isPhoneVisible}
          setIsPhoneVisible={setIsPhoneVisible}
          recordDetails={recordDetails}
          setRecordDetails={setRecordDetails}
        />
      </CheckValidation>
    </div>
  );
};
export default connect(({ student, user }) => ({
  studentsList: student.studentsList,
  currentUser: user.currentUser,
}))(StudentsListTable);
