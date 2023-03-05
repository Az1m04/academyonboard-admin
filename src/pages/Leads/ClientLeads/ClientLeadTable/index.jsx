/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { Table, Col, Row, Pagination, Input, Button, Tooltip } from 'antd';
import dayjs from 'dayjs';
import classes from './index.less';
import styles from './index.less';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import CheckValidation from '@/components/CheckValidation';
import { Envelope, WhatsApp, ChatLeftIcon, MassAssign } from '@/utils/AppIcons';
import SearchNotFound from '@/assets/icons/empty-search-contact.png';
import relativeTime from 'dayjs/plugin/relativeTime';
import { debounce } from 'lodash';
import AssigneeModal from '@/components/AssigneeModal';
import GenerateWhatsAppMessage from '@/components/GenerateWhatsAppMessage';
import GenerateEmail from '@/components/GenerateEmail';
import GenerateNote from '@/components/GenerateNote';
import GeneratePhone from '@/components/GeneratePhone';

const { Search } = Input;

dayjs.extend(relativeTime);

const ClientLeadTable = ({
  leadLoading,
  leadData,
  leadType,
  purpose,
  currentPage,
  columns,
  visibleWhatsApp,
  setVisibleWhatsApp,
  visibleEmail,
  setVisibleEmail,
  recordDetails,
  setRecordDetails,
  isNoteVisible,
  setIsNoteVisible,
  isPhoneVisible,
  setIsPhoneVisible,
  isAssigneeVisible,
  setIsAssigneeVisible,
  selectedRows,
  setSelectedRows,
  selectedRowKeys,
  setSelectedRowKeys,
  expendedBackground,
  setExpendedBackground,
  keyword,
  setKeyword,
  viewSize,
  setViewSize,
  setCurrentPage,
  setStartIndex,
  getClients,
}) => {
  const { loading } = leadLoading;
  const action = (val) => {
    setStartIndex(0);
    setCurrentPage(1);
    if (getClients) {
      getClients(val);
    }
  };
  const debounceSearch = debounce(action, 500);

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKey, selectedTableRows) => {
      setSelectedRowKeys(selectedRowKey);
      setSelectedRows(selectedTableRows);
    },
  };

  const RenderInformation = ({ record }) => (
    <div className="p-6 bg-gray-100 rounded-md shadow-md">
      <Row gutter={[24, 24]} className="mb-4">
        <Col xl={5} lg={5} md={5} sm={24} xs={24}>
          <div className="font-semibold text-gray-500 ">Lead Priority</div>
          <Tooltip
            title={`Remarks - ${
              record?.priorityRemark || 'There is no any priority remarks set yet!'
            }`}
            getPopupContainer={(node) => node.parentNode}
          >
            <div
              className={`font-normal Capitalize rounded-md w-max px-1 shadow-lg ${
                record?.priorityType === 'Medium' && 'bg-yellow-500 text-white'
              } ${record?.priorityType === 'High' && 'bg-green-500 text-white'} ${
                record?.priorityType === 'Very High' && 'bg-red-500 text-white'
              }  ${record?.priorityType === 'Low' && 'bg-blue-500 text-white'}`}
            >
              {record?.priorityType || '--'}
            </div>
          </Tooltip>
        </Col>

        <Col xl={5} lg={5} md={5} sm={24} xs={24}>
          <div className="font-semibold text-gray-500 ">Source</div>
          <div className="font-normal Capitalize">
            {record?.source || '--'}{' '}
            <span className="ml-2">({record?.leadReferencedBy?.displayName})</span>
          </div>
        </Col>

        <Col xl={4} lg={4} md={4} sm={24} xs={24}>
          <div className="font-semibold text-gray-500">Lead Creation Date</div>
          <div className="font-normal Capitalize">
            {dayjs(record?.createdAt).format('MMMM D, YYYY') || '--'}
          </div>
        </Col>
        <Col xl={5} lg={5} md={5} sm={24} xs={24}>
          <div className="font-semibold  text-gray-500 ">Lead Created By</div>
          <div className="font-normal Capitalize">{record?.createdBy?.displayName || '--'}</div>
        </Col>
        <Col xl={5} lg={5} md={5} sm={24} xs={24}>
          <div className="font-normal text-white bg-yellow-500 rounded-lg px-2 shadow-lg">
            Lead Owner
          </div>
          <div className="capitalize px-2">{record?.owner?.displayName || 'User'}</div>
        </Col>
      </Row>
      <Row gutter={[24, 24]} className="my-4">
        <Col xl={5} lg={5} md={5} sm={24} xs={24}>
          <div className="font-semibold text-gray-500">Last Updated On</div>
          <div className="font-normal Capitalize">
            {record?.lastModifiedDate
              ? dayjs(record?.lastModifiedDate)?.format('MMMM D, YYYY')
              : '--'}
          </div>
        </Col>
        <Col xl={5} lg={5} md={5} sm={24} xs={24}>
          <div className="font-semibold text-gray-500">Last Updated By</div>
          <div className="font-normal Capitalize">
            {record?.lastModifiedBy?.displayName || '--'}
          </div>
        </Col>
        <Col xl={4} lg={4} md={4} sm={24} xs={24}>
          <div className="font-semibold text-gray-500">Last Activity</div>
          <div className="font-normal Capitalize">{record?.lastActivity?.verb || '--'}</div>
        </Col>
        <Col xl={5} lg={5} md={5} sm={24} xs={24}>
          <div className="font-semibold text-gray-500">Last Followup Comment</div>
          <div className="font-normal Capitalize">{record?.lastFollowUpBy?.notes || '--'}</div>
        </Col>
        <Col xl={5} lg={5} md={5} sm={24} xs={24}>
          <div className="font-normal bg-green-500 rounded-lg px-2 shadow-lg text-white">
            Refer From
          </div>
          <div className="font-normal Capitalize px-2">
            {record?.lastAssignee?.displayName || '--'}
          </div>
        </Col>
      </Row>
      <Row gutter={[24, 24]} className="my-4">
        <Col xl={5} lg={5} md={5} sm={24} xs={24}>
          <div className="font-semibold text-gray-500">Next action on</div>
          <div className="font-normal Capitalize">
            {record?.lastFollowUpBy?.followUpOn
              ? dayjs(record?.lastFollowUpBy?.followUpOn).format('MMMM D, YYYY')
              : '--'}
          </div>
        </Col>
        <Col xl={5} lg={5} md={5} sm={24} xs={24}>
          <div className="font-semibold text-gray-500">Next action by</div>
          <Tooltip
            title={
              record?.nextActionBy?.map((item, idx) =>
                idx + 1 === record?.nextActionBy?.length
                  ? item?.displayName
                  : `${item?.displayName}, `,
              ) || 'There is no any next assignee set yet!'
            }
            placement="topLeft"
            getPopupContainer={(node) => node.parentNode}
          >
            <div
              className="font-normal Capitalize w-64"
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {record?.nextActionBy?.map((item, idx) =>
                idx + 1 === record?.nextActionBy?.length
                  ? item?.displayName
                  : `${item?.displayName}, `,
              ) || '--'}
            </div>
          </Tooltip>
        </Col>
        <Col xl={4} lg={4} md={4} sm={24} xs={24}>
          <div className="font-semibold text-gray-500">Next action </div>
          <div className="font-normal Capitalize">{record?.nextActionMode || '--'}</div>
        </Col>
        <Col xl={5} lg={5} md={5} sm={24} xs={24}>
          <div className="font-semibold text-gray-500">Current note </div>
          <div className="font-normal Capitalize">{record?.lastNote?.name || '--'}</div>
        </Col>
        <Col xl={5} lg={5} md={5} sm={24} xs={24}>
          <div className="font-normal bg-green-500 rounded-lg px-2 shadow-lg text-white">
            Refer To
          </div>
          <div className="capitalize px-2">{record?.assignee?.displayName || '--'}</div>
        </Col>
      </Row>
      <Row gutter={[24, 24]} className="my-4">
        <Col xl={5} lg={5} md={5} sm={24} xs={24}>
          <div className="font-semibold text-gray-500">Last Followup Status</div>

          <div className="font-normal Capitalize">
            {record?.lastFollowUpBy?.isInterested !== undefined
              ? (record?.lastFollowUpBy?.isInterested === true && record?.lastFollowUpStatus) ||
                (record?.lastFollowUpBy?.isInterested === false && 'Lead is not interested!')
              : '--'}
          </div>
        </Col>
      </Row>
    </div>
  );

  const rowUpdateColorHandler = (rec) =>
    expendedBackground?.find((val) => val === rec?.id) ? styles?.tableRowUpdateStyling : '';

  return (
    <>
      <div className="flex justify-between m-4">
        <div className={`rounded-2xl ${styles?.searchInputRadius}`}>
          <Search
            style={{ width: '52rem' }}
            size="middle"
            placeholder="Enter keyword to search"
            value={keyword}
            onChange={(value) => {
              debounceSearch(value?.target?.value);
              setKeyword(value?.target?.value);
            }}
            enterButton
          />
        </div>

        <div>
          <div className={`flex space-x-2 ${classes?.buttonStyling}`}>
            <Tooltip title="Refresh table" placement="top">
              <Button
                size="middle"
                onClick={() => {
                  getClients();
                }}
                type="primary"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className={`bi bi-arrow-clockwise ${loading && 'animate-spin'}`}
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"
                  />
                  <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
                </svg>
              </Button>
            </Tooltip>
            <Tooltip title="Assign mass leads" placement="top">
              <Button
                size="middle"
                // onClick={() => {
                //   setIsAssigneeVisible(true);
                // }}
                type="primary"
                disabled={selectedRows?.length === 0}
              >
                <MassAssign />
              </Button>
            </Tooltip>
            <Tooltip title="Send mass email messages" placement="top">
              <Button
                size="middle"
                disabled={selectedRows?.length === 0}
                onClick={() => setVisibleEmail(true)}
                type="primary"
              >
                <Envelope />
              </Button>
            </Tooltip>

            <Tooltip title="Send mass WhatsApp messages" placement="top">
              <Button
                size="middle"
                onClick={() => setVisibleWhatsApp(true)}
                type="primary"
                disabled={selectedRows?.length === 0}
              >
                <WhatsApp />
              </Button>
            </Tooltip>

            <Tooltip title="Send mass text messages" placement="top">
              <Button size="middle" type="primary">
                <ChatLeftIcon />
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>

      <Table
        className={styles?.tableStyling}
        size="small"
        rowClassName={rowUpdateColorHandler}
        scroll={{ x: 500 }}
        pagination={false}
        columns={columns}
        loading={loading}
        rowSelection={{
          type: 'checkbox',
          ...rowSelection,
        }}
        expandable={{
          expandedRowRender: (record) => <RenderInformation record={record} />,

          expandIcon: ({ expanded, onExpand, record }) =>
            expanded ? (
              <UpOutlined
                onClick={(e) => {
                  onExpand(record, e);
                  setExpendedBackground(expendedBackground?.filter((item) => item !== record?.id));
                }}
              />
            ) : (
              <DownOutlined
                onClick={(e) => {
                  onExpand(record, e);
                  setExpendedBackground((prev) => [...prev, record?.id]);
                }}
              />
            ),
          expandIconColumnIndex: 10,
        }}
        dataSource={leadData?.records?.map((item) => ({
          ...item,
          key: item?.id,
        }))}
        locale={{
          emptyText: (
            <div className="flex items-center justify-center text-center">
              <div>
                <p className="text-lg">No leads yet!</p>
                <img
                  className="ml-16 "
                  src={SearchNotFound}
                  alt="No leads found!"
                  style={{ height: '100px' }}
                />
              </div>
            </div>
          ),
        }}
        footer={() => (
          <CheckValidation show={leadData?.totalCount > 5}>
            <Row type="flex" justify="end">
              <Pagination
                key={`page-${currentPage}`}
                showSizeChanger
                pageSizeOptions={['10', '25', '50', '100']}
                onShowSizeChange={(current, size) => {
                  setViewSize(size);
                  setCurrentPage(current);
                  setStartIndex(0);
                }}
                defaultCurrent={1}
                current={currentPage}
                pageSize={viewSize}
                total={leadData?.totalCount}
                showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                onChange={(current) => {
                  setStartIndex(viewSize * (current - 1));
                  setCurrentPage(current);
                }}
              />
            </Row>
          </CheckValidation>
        )}
      />
      <CheckValidation show={isAssigneeVisible}>
        <AssigneeModal
          visible={isAssigneeVisible}
          setVisible={setIsAssigneeVisible}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
        />
      </CheckValidation>
      <CheckValidation show={visibleWhatsApp}>
        <GenerateWhatsAppMessage
          type={leadType}
          purpose={purpose}
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
          type={leadType}
          purpose={purpose}
          visible={visibleEmail}
          setVisible={setVisibleEmail}
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
      <CheckValidation show={isPhoneVisible}>
        <GeneratePhone
          isPhoneVisible={isPhoneVisible}
          setIsPhoneVisible={setIsPhoneVisible}
          recordDetails={recordDetails}
          setRecordDetails={setRecordDetails}
        />
      </CheckValidation>
    </>
  );
};

export default ClientLeadTable;
