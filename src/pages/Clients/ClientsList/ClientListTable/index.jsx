import React, { useState } from 'react';
import { Table, Input, Row, Pagination, Avatar, Button, Popconfirm, message, Spin } from 'antd';
import { getIntials } from '@/utils/utils';
import dayjs from 'dayjs';
import SearchNotFound from '@/assets/icons/empty-search-contact.png';
import { debounce } from 'lodash';
import { connect } from 'umi';
import { LoadingOutlined } from '@ant-design/icons';
import GenerateNote from '@/components/GenerateNote';
import GenerateWhatsAppMessage from '@/components/GenerateWhatsAppMessage';
import GenerateEmail from '@/components/GenerateEmail';
import CheckValidation from '@/components/CheckValidation';

const { Search } = Input;

/**
 *
 * @updateDisable - The purpose of this function is to update enabled prop to y or n
 */

const ClientListTable = ({
  currentPage,
  setViewSize,
  setCurrentPage,
  setStartIndex,
  viewSize,
  awaiting,
  setKeyword,
  totalRecords,
  staffLoading,
  dispatch,
  clientList,
  currentUser,
  loading,
  getClientsList,
}) => {
  const [visibleWhatsApp, setVisibleWhatsApp] = useState(false);
  const [visibleEmail, setVisibleEmail] = useState(false);
  const [recordDetails, setRecordDetails] = useState([]);
  const [isNoteVisible, setIsNoteVisible] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

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
      type: `staff/disableStaff`,
      payload: {
        pathParams: {
          type: staff?.enabled ? 'deactivate' : 'reactivate',
          partyId: staff?.clientPoc?.id,
        },
      },
    }).then((res) => {
      if (res?.responseMessage === 'success') {
        message.success(`${staff.clientName}'s account has been disabled`);
        getClientsList();
      }
    });
  };

  const enableClient = (record) => {
    dispatch({
      type: `staff/enableStaff`,
      payload: {
        pathParams: {
          type: record?.enabled ? 'deactivate' : 'reactivate',
          partyId: record?.clientPoc?.id,
        },
      },
    }).then((res) => {
      if (res?.responseMessage === 'success') {
        message.success(`${record?.clientName}'s account has been enabled`);
        getClientsList();
      }
    });
  };

  const debounceSearch = debounce(action, 400);
  const renderActionButton = (record) => {
    if (record && record?.enabled) {
      return (
        <Popconfirm
          title="Are you sure you want to disable this client?"
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
            disabled={record.id === currentUser.id}
          >
            Disable
          </Button>
        </Popconfirm>
      );
    }
    return (
      <Button
        onClick={(e) => {
          enableClient(record);
          e.stopPropagation();
        }}
        size="small"
        type="primary"
      >
        Enable
      </Button>
    );
  };

  const activeColumns = [
    {
      title: 'Sr.no.',
      dataIndex: 'srno',
      align: 'center',
      width: 50,
      render: (_, __, index) => index + 1 + viewSize * (currentPage - 1),
    },
    {
      title: <span className="ml-10"> Name</span>,
      dataIndex: 'clientName',
      render: (name, record) => (
        <div className="flex items-center">
          {/* <div className="p-1 pr-4">
            <div>{viewSize * (currentPage - 1) + clientList.records.indexOf(record) + 1}</div>
          </div> */}
          <Avatar className="bg-blue-800 w-8 uppercase" style={{ backgroundColor: '#ffa500' }}>
            {name && getIntials(name)}
          </Avatar>
          <div className="ml-2 w-48">
            <div
              className="font-medium truncate capitalize"
              title={record.clientName && record.clientName}
            >
              {record.clientName && record.clientName}
            </div>
            <div className="">Requested on {dayjs(record.createdAt).format('MMMM D, YYYY')}</div>
          </div>
        </div>
      ),
    },
    {
      title: ' Email',
      dataIndex: 'primaryEmail',
      render: (data) => <p>{data}</p>,
    },
    {
      title: 'Invited on',
      dataIndex: 'createdAt',
      render: (_, record) => (
        <div className="">
          <div>
            Invited by <span className="font-medium text-gray-800">{record?.createdBy}</span>
          </div>
          <div>on {dayjs(record.createdAt).format('MMMM D, YYYY')}</div>
        </div>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'statusId',
      render: (text, record) => <div>{renderActionButton(record)}</div>,
    },
  ];
  const awaitingColumns = [
    {
      title: 'Sr. No.',
      dataIndex: 'srno',
      align: 'center',
      render: (_, __, index) => index + 1 + viewSize * (currentPage - 1),
    },
    {
      title: 'Name',
      dataIndex: 'to_name',
      render: (name, record) => (
        <div className="flex items-center">
          <Avatar className="bg-blue-800 w-8 uppercase" style={{ backgroundColor: '#1c9cff' }}>
            {name && getIntials(name)}
          </Avatar>
          <div className="ml-2 w-48">
            <div className="font-medium truncate capitalize" title={record?.to_name}>
              {record?.to_name}
            </div>
            <div className="">Requested on {dayjs(record.created_at).calendar()}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Invited on',
      dataIndex: 'last_invited_on',
      render: (data) => <p>{dayjs(data).format('MMMM D, YYYY')}</p>,
    },
    {
      title: ' Email',
      dataIndex: 'email',
      render: (data) => <p>{data}</p>,
    },
    {
      title: ' Invited by',
      dataIndex: 'party_id_from',
      render: (data) => (
        <div className="">
          <p>{data?.name}</p>
        </div>
      ),
    },
  ];
  return (
    <div>
      <div className="flex mx-4 mb-4">
        <div className="w-full mt-4">
          <Search
            size="large"
            placeholder="Enter keyword here to search clients..."
            onInput={(value) => debounceSearch(value.target.value)}
          />
        </div>
      </div>
      <Spin spinning={loading} indicator={<LoadingOutlined />}>
        <div className="w-full">
          <Table
            className="no-shadow zcp-fixed-w-table"
            rowClassName="cursor-pointer"
            pagination={false}
            columns={awaiting ? awaitingColumns : activeColumns}
            rowSelection={{
              type: 'checkbox',
              ...rowSelection,
            }}
            dataSource={clientList?.records}
            rowKey={(record) => record.id}
            loading={staffLoading}
            // onRow={(record) => ({
            //   onClick: () => {
            //     if (!awaiting) {
            //       history.push(`/staff/${record.id}/profile`);
            //     }
            //   },
            // })}
            locale={{
              emptyText: (
                <div className="text-center flex justify-center items-center">
                  <div>
                    <p className="text-lg">No clients added yet!</p>
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
      </Spin>
      <CheckValidation show={visibleEmail}>
        <GenerateEmail
          type="client"
          purpose="general"
          visible={visibleEmail}
          setVisible={setVisibleEmail}
          recordDetails={recordDetails}
          setRecordDetails={setRecordDetails}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          setSelectedRowKeys={setSelectedRowKeys}
        />
      </CheckValidation>
      <CheckValidation show={visibleWhatsApp}>
        <GenerateWhatsAppMessage
          type="client"
          purpose="general"
          visible={visibleWhatsApp}
          setVisible={setVisibleWhatsApp}
          recordDetails={recordDetails}
          setRecordDetails={setRecordDetails}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          setSelectedRowKeys={setSelectedRowKeys}
        />
      </CheckValidation>

      <CheckValidation show={isNoteVisible}>
        <GenerateNote
          isNoteVisible={isNoteVisible}
          setIsNoteVisible={setIsNoteVisible}
          recordDetails={recordDetails}
          setRecordDetails={setRecordDetails}
        />
      </CheckValidation>
    </div>
  );
};
export default connect(({ leads, user }) => ({
  clientList: leads.clientList,
  currentUser: user.currentUser,
}))(ClientListTable);
