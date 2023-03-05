import React from 'react';
import { Table, Input, Row, Pagination, Avatar, Tooltip, Popover, Popconfirm, Button } from 'antd';
import { getIntials } from '@/utils/utils';
import dayjs from 'dayjs';
import SearchNotFound from '@/assets/icons/empty-search-contact.png';
import { connect, useParams, history } from 'umi';
import GenerateWhatsAppMessage from '@/components/GenerateWhatsAppMessage';
import GenerateEmail from '@/components/GenerateEmail';
import CheckValidation from '@/components/CheckValidation';
import { debounce } from 'lodash';
import { EnvelopeAction, TextIconAction, WhatsAppAction } from '@/utils/AppIcons';
import GeneratePhone from '@/components/GeneratePhone';
import { MoreOutlined } from '@ant-design/icons';
import styles from './index.less';

const { Search } = Input;

/**
 *
 * @updateDisable - The purpose of this function is to update enabled prop to y or n
 */

const SubBranchTable = ({
  currentPage,
  setViewSize,
  setCurrentPage,
  setStartIndex,
  viewSize,
  selectedRowKeys,
  setSelectedRowKeys,
  visibleEmail,
  setVisibleEmail,
  isPhoneVisible,
  setIsPhoneVisible,
  recordDetails,
  setRecordDetails,
  selectedRows,
  setSelectedRows,
  visibleWhatsApp,
  setVisibleWhatsApp,
  subBranchesList,
  getSubBranchesList,
  keyword,
  setKeyword,
  setIsFollowsUpVisible,
  updateDisableEnable,
  currentUser,
  loadings,
}) => {
  const { tabName } = useParams();
  const { loading, DALoading } = loadings;
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
  const action = (key) => {
    getSubBranchesList(key);
  };

  const debounceSearch = debounce(action, 400);
  const renderActionButton = (record) => {
    if (record && record?.enabled) {
      return (
        <Popconfirm
          title="Are you sure you want to disable this sub branch?"
          onConfirm={(e) => {
            updateDisableEnable(record);
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
        title="Are you sure you want to enable this sub branch?"
        onConfirm={(e) => {
          updateDisableEnable(record);
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
  const activeColumns = [
    {
      title: 'Sr.no.',
      dataIndex: 'srno',
      align: 'center',
      width: 50,
      render: (_, __, index) => index + 1 + viewSize * (currentPage - 1),
    },
    {
      title: 'Name',
      dataIndex: 'clientName',
      width: 250,
      render: (name, record) => (
        <div className="flex items-center">
          <Avatar className="bg-blue-800 w-8 uppercase" style={{ backgroundColor: '#ffa500' }}>
            {name && getIntials(name)}
          </Avatar>
          <div className="ml-2">
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
      title: 'Location',
      dataIndex: 'address',
      render: (data) => (
        <Tooltip title={data?.formattedAddress}>
          <p className={'truncate w-48 m-0'}>{data?.formattedAddress}</p>
        </Tooltip>
      ),
    },
    {
      title: 'Phone No.',
      dataIndex: 'primaryPhone',
      width: '200px',
      render: (data) => <p className="m-0">{data?.phoneFormatted}</p>,
    },
    {
      title: ' Email',
      dataIndex: 'primaryEmail',
      render: (data) => <p className="m-0">{data}</p>,
    },

    {
      title: 'Actions',
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <div className="flex space-x-3 items-center">
            <Tooltip
              title="Send whatsapp message"

              // getPopupContainer={(node) => node.parentNode}
            >
              <div
                className={`cursor-pointer icon`}
                onClick={() => {
                  setVisibleWhatsApp(true);
                  setRecordDetails([record]);
                }}
              >
                <WhatsAppAction />
              </div>
            </Tooltip>

            <Tooltip
              title="Send email message"

              // getPopupContainer={(node) => node.parentNode}
            >
              <div
                className="cursor-pointer"
                onClick={() => {
                  setVisibleEmail(true);
                  setRecordDetails([record]);
                }}
              >
                <EnvelopeAction />
              </div>
            </Tooltip>

            <Tooltip
              title="Send text message"

              // getPopupContainer={(node) => node.parentNode}
            >
              <div
                className="cursor-pointer"
                onClick={() => {
                  setIsPhoneVisible(true);
                  setRecordDetails([record]);
                }}
              >
                <TextIconAction />
              </div>
            </Tooltip>
          </div>

          <Popover
            content={
              <>
                <div
                  style={{ padding: '0px' }}
                  className="bg-white flex flex-col"
                  onClick={(e) => e.stopPropagation()}
                >
                  <a
                    className="text-gray-900 hover:text-yellow-500 hover:bg-gray-50 px-4 py-2.5 border-b w-48 "
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      history.push(`/sub-branches/edit/${record?.id}`);
                    }}
                  >
                    Edit
                  </a>
                  <a
                    className="text-gray-900 hover:text-yellow-500 hover:bg-gray-50 px-4 py-2.5 border-b w-48 "
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setIsFollowsUpVisible(record?.id);
                    }}
                  >
                    Add follow up
                  </a>
                </div>
              </>
            }
            onClick={(e) => {
              e.stopPropagation();
            }}
            trigger={'click'}
            placement="bottomRight"
            overlayClassName={`${styles.customPopOver}`}
          >
            <Tooltip title="Quick actions">
              <a
                className="text-gray-900 flex items-center"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
              >
                <MoreOutlined className="text-gray-900" />
              </a>
            </Tooltip>
          </Popover>
        </div>
      ),
    },
    {
      title: 'Invitation status',
      key: 'status',
      width: '140px',
      dataIndex: 'status',
      align: 'center',
      render: (text, record) => (
        <div className="m-0">
          <span
            className={`font-medium text-sm ${
              record?.statusId === 'PARTYINV_SENT'
                ? `text-blue-500`
                : `${
                    (record?.statusId === 'PARTYINV_ACCEPTED' && 'text-green-500') ||
                    'text-yellow-500'
                  }`
            }`}
          >
            {text.replace('Invitation', '')}
          </span>
        </div>
      ),
    },
    {
      key: 'partyStatus',
      render: (_, record) => renderActionButton(record),
    },
  ];

  return (
    <div>
      <div className="flex mx-4 mb-4">
        <div className="w-full mt-4">
          <Search
            size="large"
            placeholder="Enter keyword here to search clients..."
            value={keyword}
            onChange={(value) => {
              setKeyword(value.target.value);
              debounceSearch(value.target.value);
            }}
          />
        </div>
      </div>

      <div className="w-full">
        <Table
          className="no-shadow zcp-fixed-w-table"
          rowClassName="cursor-pointer"
          pagination={false}
          scroll={{ x: 1000 }}
          columns={
            tabName === 'all'
              ? activeColumns?.filter((item) => item?.key !== 'partyStatus')
              : activeColumns?.filter((item) => item?.key !== 'status')
          }
          rowSelection={{
            type: 'checkbox',
            ...rowSelection,
          }}
          dataSource={subBranchesList?.records}
          rowKey={(record) => record.id}
          loading={loading || DALoading}
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
                total={subBranchesList?.totalCount}
                showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                onChange={handleChangePagination}
              />
            </Row>
          )}
        />
      </div>

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
export default connect(({ user }) => ({
  currentUser: user?.currentUser,
}))(SubBranchTable);
