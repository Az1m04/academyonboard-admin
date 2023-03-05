/* eslint-disable react-hooks/exhaustive-deps */
import { Table, Dropdown, Col, Row, Pagination, Input, Button, Tooltip, Badge } from 'antd';
import dayjs from 'dayjs';
import classes from './index.less';
import styles from './index.less';
import Icon, {
  ApartmentOutlined,
  DownOutlined,
  MoreOutlined,
  UpOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';
import CheckValidation from '@/components/CheckValidation';

import {
  WhatsAppAction,
  EnvelopeAction,
  Envelope,
  WhatsApp,
  ChatLeftIcon,
  TextIconAction,
  MassAssign,
  PersonFill,
  EnvelopeFillIcon,
  TelephoneFillIcon,
} from '@/utils/AppIcons';
import SearchNotFound from '@/assets/icons/empty-search-contact.png';
import LeadActions from '@/components/LeadsData/LeadActions';
import { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import relativeTime from 'dayjs/plugin/relativeTime';
import { debounce } from 'lodash';
import AssigneeModal from '@/components/AssigneeModal';
import GenerateWhatsAppMessage from '@/components/GenerateWhatsAppMessage';
import GenerateEmail from '@/components/GenerateEmail';
import GenerateNote from '@/components/GenerateNote';
import GeneratePhone from '@/components/GeneratePhone';
import { CardHeading } from 'react-bootstrap-icons';
import GetShortTimeString from '../GetShortTimeString';

const { Search } = Input;

dayjs.extend(relativeTime);

const LeadsTable = ({
  leadLoading,
  leadData,
  dispatch,
  leadType,
  purpose,
  setKeyword,
  viewSize,
  setViewSize,
  setStartIndex,
  getStudentLeadData,
  keyword,
  currentPage,
  setCurrentPage,
  resetKeyword,
  setResetKeyword,
  leads,
  followUps,
  isScheduleTable,
  followUpLeadData,
}) => {
  const [visibleWhatsApp, setVisibleWhatsApp] = useState(false);
  const [visibleEmail, setVisibleEmail] = useState(false);
  const [recordDetails, setRecordDetails] = useState([]);
  const [isNoteVisible, setIsNoteVisible] = useState(false);
  const [isPhoneVisible, setIsPhoneVisible] = useState(false);
  const [isAssigneeVisible, setIsAssigneeVisible] = useState(false);
  const [hideDropDown, setHideDropDown] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [expendedBackground, setExpendedBackground] = useState([]);
  const [leadTableData, setLeadTableData] = useState([]);
  const action = (val) => {
    setKeyword(val);
    setStartIndex(0);
    setCurrentPage(1);
  };
  const debounceSearch = debounce(action, 500);

  const menu = (key) => {
    return (
      <LeadActions
        record={key}
        hideDropDown={hideDropDown}
        type="student"
        setHideDropDown={setHideDropDown}
        partyId={key?.id}
        keyword={keyword}
      />
    );
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKey, selectedTableRows) => {
      setSelectedRowKeys(selectedRowKey);
      setSelectedRows(selectedTableRows);
    },
  };

  useEffect(() => {
    if (followUps || isScheduleTable) {
      setLeadTableData(followUpLeadData);
    } else {
      setLeadTableData(leadData);
    }
  }, [leadData, followUpLeadData]);

  const columns = [
    {
      title: 'Sr.no.',
      dataIndex: 'srno',
      align: 'center',
      width: 10,
      render: (_, __, index) => index + 1 + viewSize * (currentPage - 1),
    },
    {
      title: <div className="capitalize ml-2">name </div>,
      dataIndex: 'displayName',
      key: 'displayName',
      align: 'start',
      width: 200,
      sorter: (a, b) => a.displayName.length - b.displayName.length,
      sortDirections: ['ascend', 'descend'],

      render: (renderData, record) => (
        <div className="w-max ml-2">
          <div className="font-medium capitalize truncate flex pb-0">
            <p className="mb-0 mt-0.5 mr-0.5 text-yellow-500">
              <PersonFill />
            </p>
            <Tooltip
              title={<span className="capitalize">{record?.displayName}</span>}
              getPopupContainer={(node) => node.parentNode}
            >
              <p
                onClick={(e) => {
                  e.stopPropagation();
                  history.push(`/leads/students/leads/${record?.id}/profile/${'enquiry'}`);
                }}
                className="mb-0 mx-2 w-40 cursor-pointer underline underline-offset-4"
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {record?.displayName}
              </p>
            </Tooltip>
            <span
              className="bg-yellow-500 rounded text-white h-4 px-1 pb-0.5 mt-0.5 shadow-md"
              style={{ fontSize: '0.70rem' }}
            >
              {GetShortTimeString({ time: record?.createdAt })}
            </span>
          </div>

          <div className="space-y-1 mt-1">
            <div className="font-normal lowercase flex">
              <p className="mb-0 mt-1 mr-1 text-yellow-500">
                <EnvelopeFillIcon />
              </p>
              <p className="mb-0 mx-2"> {record?.primaryEmail?.toLowerCase()}</p>
            </div>
            <div className="flex">
              <p className="mb-0 mt-1 mr-1 text-yellow-500">
                <TelephoneFillIcon />
              </p>
              <p className="mb-0 mx-2">{record?.formattedPhone?.replace(/\s+/g, '')}</p>
            </div>
          </div>
        </div>
      ),
    },

    {
      title: <div className="capitalize">Services</div>,
      dataIndex: 'newNeeds',
      key: 'newNeeds',
      width: 130,
      render: (renderData, record) => (
        <div className="font-normal capitalize">
          {record?.newNeeds ? (
            record?.newNeeds?.map((item) => <div key={item.id}> {item?.description}</div>)
          ) : (
            <div>{record?.need?.description}</div>
          )}
        </div>
      ),
    },
    {
      title: <div className="capitalize">Purposes</div>,
      dataIndex: 'newNeeds',
      key: 'purposesName',
      width: 250,
      render: (data, record) => (
        <div>
          {record?.newNeeds ? (
            record?.newNeeds?.map((item) => (
              <Tooltip
                key={item?.id}
                title={
                  <div className="flex capitalize">
                    {item?.subNeeds?.map((value, idx) =>
                      idx + 1 === item?.subNeeds?.length
                        ? ` ${
                            Object.keys(value)?.includes('value')
                              ? ` ${value?.description} (${value?.value})`
                              : value?.description
                          }`
                        : `${
                            Object.keys(value)?.includes('value')
                              ? ` ${value?.description} (${value?.value})`
                              : value?.description
                          }, `,
                    )}
                  </div>
                }
                placement="topLeft"
                getPopupContainer={(node) => node.parentNode}
              >
                <div
                  className="w-52"
                  style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  <span className="font-normal capitalize ">
                    {item?.subNeeds?.map((value, idx) =>
                      idx + 1 === item?.subNeeds?.length
                        ? ` ${
                            Object.keys(value)?.includes('value')
                              ? ` ${value?.description} (${value?.value})`
                              : value?.description
                          }`
                        : `${
                            Object.keys(value)?.includes('value')
                              ? ` ${value?.description} (${value?.value})`
                              : value?.description
                          }, `,
                    )}
                  </span>
                </div>
              </Tooltip>
            ))
          ) : (
            <div className="  capitalize">
              {record?.need?.subNeeds?.description
                ? record?.need?.subNeeds?.description
                : record?.need?.subNeeds?.name || 'N/A'}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Interest Level',
      align: 'center',
      dataIndex: 'interestLevel',
      width: 120,
      render: (data) => (
        <div className="font-normal bg-green-500 rounded-full Capitalize mx-2 text-white shadow-lg">
          {data}
        </div>
      ),
    },
    {
      title: <div className="capitalize">status</div>,
      dataIndex: 'status',
      key: 'status',
      align: leads ? 'center' : 'start',
      width: 250,
      render: (renderData, record) => (
        <>
          {leads ? (
            <p
              className={`px-1 m-0 font-normal Capitalize font-medium ${
                (record?.lastActivity?.verb === 'Lead Created'
                  ? 'text-blue-500'
                  : renderData === 'Inactive' && 'text-red-500') || 'text-green-500'
              }`}
              style={{ whiteSpace: 'nowrap' }}
            >
              {record?.lastActivity?.verb === 'Lead Created' ? 'New Lead ' : renderData}
            </p>
          ) : (
            <>
              <div className="flex">
                <Tooltip
                  title="Last status"
                  placement="top"
                  getPopupContainer={(node) => node.parentNode}
                >
                  <span className="px-1 font-semibold">LS</span>
                </Tooltip>
                <p
                  className={`px-1 m-0 font-normal Capitalize ${
                    renderData === 'Inactive' && 'text-red-500'
                  }`}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  {renderData}
                </p>
              </div>
              <div className="flex mt-1">
                <Tooltip
                  title="Current status"
                  placement="top"
                  getPopupContainer={(node) => node.parentNode}
                >
                  <span className="px-1 font-semibold">CS</span>
                </Tooltip>
                <Tooltip
                  title={record?.leadStatusType}
                  placement="top"
                  getPopupContainer={(node) => node.parentNode}
                >
                  <div
                    className="px-1 m-0 font-normal w-48 Capitalize"
                    style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {record?.leadStatusType}
                  </div>
                </Tooltip>
              </div>
              <div className="flex mt-1">
                <Tooltip
                  title="Follow up status"
                  placement="top"
                  getPopupContainer={(node) => node.parentNode}
                >
                  <span className="px-1 font-semibold">FS</span>
                </Tooltip>
                <Tooltip
                  title={record?.lastFollowUpStatus}
                  placement="top"
                  getPopupContainer={(node) => node.parentNode}
                >
                  <div
                    className="px-1 m-0 font-normal w-48 Capitalize"
                    style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {record?.lastFollowUpBy?.isInterested !== undefined
                      ? (record?.lastFollowUpBy?.isInterested === true &&
                          record?.lastFollowUpStatus) ||
                        (record?.lastFollowUpBy?.isInterested === false &&
                          'Lead is not interested!')
                      : '--'}
                  </div>
                </Tooltip>
              </div>
            </>
          )}
        </>
      ),
    },
    {
      title: 'Stats',
      dataIndex: '',
      align: 'start',
      width: 200,
      render: (__, record) => (
        <div className="flex space-x-4 items-center cursor-pointer p-0">
          <div
            onClick={(e) => {
              e.stopPropagation();
              const payload = {
                visible: true,
                type: 'ADD_NOTE',
                title: 'Add note',
                subTitle: 'Add note',
                leadId: record.id,
                rec: null,
                purposeFor: 'students',
                record,
              };

              dispatch({
                type: 'leads/setStates',
                payload,
                key: 'editLead',
              });
            }}
          >
            <Badge
              size="small"
              title="Notes"
              count={record?.totalNotes}
              offset={[2, 20]}
              style={{ backgroundColor: '#111827' }}
            >
              <Tooltip title="Notes" placement="top" getPopupContainer={(node) => node.parentNode}>
                <Icon
                  style={{
                    color: '#F9FAFB',
                    fontSize: '1.1rem',
                    backgroundColor: '#4B5563',
                    borderRadius: '0.6rem',
                    padding: '0.15rem',
                  }}
                  component={CardHeading}
                />
              </Tooltip>
            </Badge>
          </div>
          <div>
            <Badge
              size="small"
              title="Visits"
              count={record?.totalVisits}
              offset={[2, 20]}
              style={{ backgroundColor: '#DC2626' }}
            >
              <Tooltip title="Visits" placement="top" getPopupContainer={(node) => node.parentNode}>
                <UserSwitchOutlined
                  style={{
                    color: '#F9FAFB',
                    fontSize: '1.1rem',
                    backgroundColor: '#4B5563',
                    borderRadius: '0.6rem',
                    padding: '0.15rem',
                  }}
                />
              </Tooltip>
            </Badge>
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation();
              const payload = {
                visible: true,
                type: 'ACTIVITY_TIMELINE',
                title: 'Activity timeline',
                subTitle: 'Activity timeline',
                leadId: record.id,
                rec: null,
                purposeFor: 'students',
                record,
              };
              dispatch({
                type: 'leads/setStates',
                payload,
                key: 'editLead',
              });
            }}
          >
            <Badge
              size="small"
              count={record?.totalActivities}
              title="Activities "
              offset={[2, 20]}
              style={{ backgroundColor: '#52c41a' }}
            >
              <Tooltip
                title="Activities "
                placement="top"
                getPopupContainer={(node) => node.parentNode}
              >
                <ApartmentOutlined
                  style={{
                    color: '#F9FAFB',
                    fontSize: '1.1rem',
                    backgroundColor: '#4B5563',
                    borderRadius: '0.6rem',
                    padding: '0.15rem',
                  }}
                />
              </Tooltip>
            </Badge>
          </div>
        </div>
      ),
    },
    {
      title: 'Actions',
      align: 'start',
      width: 100,
      render: (_, record) => (
        <div className="flex space-x-3 items-center">
          <Tooltip
            title="Send whatsapp message"
            placement="top"
            getPopupContainer={(node) => node.parentNode}
          >
            <div
              className={`cursor-pointer icon`}
              onClick={(e) => {
                e.stopPropagation();
                setVisibleWhatsApp(true);
                setRecordDetails([record]);
              }}
            >
              <WhatsAppAction />
            </div>
          </Tooltip>

          <Tooltip
            title="Send email message"
            placement="top"
            getPopupContainer={(node) => node.parentNode}
          >
            <div
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setVisibleEmail(true);
                setRecordDetails([record]);
              }}
            >
              <EnvelopeAction />
            </div>
          </Tooltip>

          <Tooltip
            title="Send text message"
            placement="top"
            getPopupContainer={(node) => node.parentNode}
          >
            <div
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setIsPhoneVisible(true);
                setRecordDetails([record]);
              }}
            >
              <TextIconAction />
            </div>
          </Tooltip>
        </div>
      ),
    },
    {
      width: 60,
      render: (_, record) => (
        <div>
          <Dropdown
            getPopupContainer={leadData?.totalCount > 5 ? (node) => node.parentNode : null}
            overlay={menu(record)}
            trigger={['click']}
            placement={'bottomRight'}
            visible={hideDropDown[record.id]}
            onVisibleChange={(value) =>
              setHideDropDown({
                [record.id]: value,
              })
            }
          >
            <MoreOutlined
              onClick={(e) => {
                e.stopPropagation();
                setHideDropDown({
                  [record.id]: true,
                });
              }}
              className="text-lg cursor-pointer hover:text-yellow-600 "
            />
          </Dropdown>
        </div>
      ),
    },
  ];

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
            value={resetKeyword}
            onChange={(value) => {
              debounceSearch(value?.target?.value);
              setResetKeyword(value?.target?.value);
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
                  getStudentLeadData();
                }}
                type="primary"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className={`bi bi-arrow-clockwise ${leadLoading && 'animate-spin'}`}
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
                onClick={() => {
                  setIsAssigneeVisible(true);
                }}
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
        columns={
          leads
            ? columns?.filter((item) => item?.key !== 'newNeeds' && item?.key !== 'purposesName')
            : columns
        }
        loading={leadLoading}
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
                  e.stopPropagation();
                  onExpand(record, e);
                  setExpendedBackground(expendedBackground?.filter((item) => item !== record?.id));
                }}
              />
            ) : (
              <DownOutlined
                onClick={(e) => {
                  e.stopPropagation();
                  onExpand(record, e);
                  setExpendedBackground((prev) => [...prev, record?.id]);
                }}
              />
            ),
          expandIconColumnIndex: 10,
        }}
        dataSource={leadTableData?.records?.map((item) => ({
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
          <CheckValidation show={leadTableData?.totalCount > 5}>
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
                total={leadTableData?.totalCount}
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

const mapStateToProps = ({ leads, loading, settings }) => ({
  leadData: leads?.leadData,
  leadLoading:
    loading?.effects['leads/getStudentLeadData'] || loading?.effects['leads/getClientLeadData'],
  editLead: leads.editLead,
  getAddFollowUp: leads.getAddFollowUp,
  primaryColor: settings.primaryColor,
  followUpLeadData: leads?.followUpLeadData,
});

const RenderInformation = ({ record, followUps }) => (
  <div className="p-6 bg-gray-100 rounded-md shadow-md">
    <Row>
      <Col xl={20} lg={20} md={20} sm={20} xs={20}>
        <Row gutter={[24, 24]} className="mb-4">
          <Col xl={6} lg={6} md={6} sm={6} xs={6}>
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

          <Col xl={6} lg={6} md={6} sm={6} xs={6}>
            <div className="font-semibold text-gray-500 ">Source</div>
            <div className="font-normal Capitalize">
              {record?.source || '--'}{' '}
              <span className="ml-2">({record?.leadReferencedBy?.displayName})</span>
            </div>
          </Col>

          <Col xl={6} lg={6} md={6} sm={6} xs={6}>
            <div className="font-semibold text-gray-500">Lead Creation Date</div>
            <div className="font-normal Capitalize">
              {dayjs(record?.createdAt).format('MMMM D, YYYY') || '--'}
            </div>
          </Col>
          <Col xl={6} lg={6} md={6} sm={6} xs={6}>
            <div className="font-semibold  text-gray-500 ">Lead Created By</div>
            <div className="font-normal Capitalize">{record?.createdBy?.displayName || '--'}</div>
          </Col>

          <Col xl={6} lg={6} md={6} sm={6} xs={6}>
            <div className="font-semibold text-gray-500">Last Updated On</div>
            <div className="font-normal Capitalize">
              {record?.lastModifiedDate
                ? dayjs(record?.lastModifiedDate)?.format('MMMM D, YYYY')
                : '--'}
            </div>
          </Col>
          <Col xl={6} lg={6} md={6} sm={6} xs={6}>
            <div className="font-semibold text-gray-500">Last Updated By</div>
            <div className="font-normal Capitalize">
              {record?.lastModifiedBy?.displayName || '--'}
            </div>
          </Col>
          <Col xl={6} lg={6} md={6} sm={6} xs={6}>
            <div className="font-semibold text-gray-500">Last Activity</div>
            <div className="font-normal Capitalize">{record?.lastActivity?.verb || '--'}</div>
          </Col>
          {followUps && (
            <>
              <Col xl={6} lg={6} md={6} sm={6} xs={6}>
                <div className="font-semibold text-gray-500">Last Followup Comment</div>
                <div className="font-normal Capitalize">
                  {record?.lastFollowUpBy?.notes || '--'}
                </div>
              </Col>
              <Col xl={6} lg={6} md={6} sm={6} xs={6}>
                <div className="font-semibold text-gray-500">Next action on</div>
                <div className="font-normal Capitalize">
                  {record?.lastFollowUpBy?.followUpOn
                    ? dayjs(record?.lastFollowUpBy?.followUpOn).format('MMMM D, YYYY')
                    : '--'}
                </div>
              </Col>
              <Col xl={6} lg={6} md={6} sm={6} xs={6}>
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
              <Col xl={6} lg={6} md={6} sm={6} xs={6}>
                <div className="font-semibold text-gray-500">Next action </div>
                <div className="font-normal Capitalize">{record?.nextActionMode || '--'}</div>
              </Col>
            </>
          )}
          <Col xl={6} lg={6} md={6} sm={6} xs={6}>
            <div className="font-semibold text-gray-500">Current note </div>
            <div className="font-normal Capitalize">{record?.lastNote?.name || '--'}</div>
          </Col>

          {followUps && (
            <Col xl={6} lg={6} md={6} sm={6} xs={6}>
              <div className="font-semibold text-gray-500">Last Followup Status</div>

              <div className="font-normal Capitalize">
                {record?.lastFollowUpBy?.isInterested !== undefined
                  ? (record?.lastFollowUpBy?.isInterested === true && record?.lastFollowUpStatus) ||
                    (record?.lastFollowUpBy?.isInterested === false && 'Lead is not interested!')
                  : '--'}
              </div>
            </Col>
          )}
        </Row>
      </Col>
      <Col xl={4} lg={4} md={4} sm={4} xs={4}>
        <Row gutter={[24, 24]}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <div className="font-normal text-white bg-yellow-500 rounded-lg px-2 shadow-lg">
              Lead Owner
            </div>
            <div className="capitalize px-2">{record?.owner?.displayName || 'User'}</div>
          </Col>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <div className="font-normal bg-green-500 rounded-lg px-2 shadow-lg text-white">
              Refer From
            </div>
            <div className="font-normal Capitalize px-2">
              {record?.lastAssignee?.displayName || '--'}
            </div>
          </Col>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <div className="font-normal bg-green-500 rounded-lg px-2 shadow-lg text-white">
              Refer To
            </div>
            <div className="capitalize px-2">{record?.assignee?.displayName || '--'}</div>
          </Col>
        </Row>
      </Col>
    </Row>
  </div>
);

export default connect(mapStateToProps)(LeadsTable);
