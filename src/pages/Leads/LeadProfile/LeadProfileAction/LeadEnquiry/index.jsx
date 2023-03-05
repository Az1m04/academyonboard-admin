import {
  Badge,
  Button,
  Col,
  Divider,
  Dropdown,
  Form,
  Pagination,
  Row,
  Table,
  Tabs,
  Tooltip,
} from 'antd';
import dayjs from 'dayjs';
import React, { useState, useEffect } from 'react';
import Icon, {
  ApartmentOutlined,
  DownOutlined,
  MoreOutlined,
  UpOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';
import { WhatsAppAction, EnvelopeAction, TextIconAction } from '@/utils/AppIcons';
import SearchNotFound from '@/assets/icons/empty-search-contact.png';
import { CardHeading } from 'react-bootstrap-icons';
import { useParams, connect, history } from 'umi';
import GetShortTimeString from '@/components/GetShortTimeString';
import AddLeadEnquiry from './AddLeadEnquiry';
import LeadActions from '@/components/LeadsData/LeadActions/index.jsx';
import EditLead from '../../../EditLead';
import CheckValidation from '@/components/CheckValidation';

const LeadEnquiry = ({ dispatch, getSingleLeadEnquiry, loadingGetEnquiry, editLead }) => {
  const [tab, setTab] = useState('COURSES');
  const [expendedBackground, setExpendedBackground] = useState([]);
  const [addEnquiryModal, setAddEnquiryModal] = useState(false);
  const [hideDropDown, setHideDropDown] = useState({});
  const [startIndex, setStartIndex] = useState(0);
  const [viewSize, setViewSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [leadCourse, setLeadCourse] = useState();

  const [form] = Form.useForm();
  const { TabPane } = Tabs;
  const { leadId } = useParams();
  const getLeadEnquiry = () => {
    dispatch({
      type: 'leads/getSingleLeadEnquiry',
      payload: {
        query: {
          leadId,
          searchBy: tab,
          startIndex,
          viewSize,
        },
      },
    });
  };
  useEffect(() => {
    if (!editLead?.visible) {
      getLeadEnquiry();
    }
  }, [tab, viewSize, startIndex, editLead]);
  const menu = (key) => {
    return (
      <LeadActions
        record={key}
        hideDropDown={hideDropDown}
        type="student"
        setHideDropDown={setHideDropDown}
        partyId={key?.id}
        enquiryId={key?.enquiryId}
        getLeadEnquiry={getLeadEnquiry}
        singleLeadEnquiry={'single_lead_Data'}
      />
    );
  };

  const tabs = [
    {
      title: 'Course',
      key: 'COURSES',
    },
    {
      title: 'Visa',
      key: 'VISA',
    },
    {
      title: 'Other services',
      key: 'OTHERS',
    },
  ];
  const columns = [
    {
      title: 'Sr. No.',
      dataIndex: 'srNo.',
      key: 'srNo',
      render: (__, _, index) => index + 1 + viewSize * (currentPage - 1),
    },
    {
      title: 'Enq no.',
      dataIndex: 'enqNo.',
      key: 'enqNo.',
      width: 150,
      render: (_, record) => (
        <div
          onClick={() => {
            history.push(`/leads/students/enquiries/all`);
          }}
        >
          <p>
            {record?.enquiryId}{' '}
            <span
              className="bg-yellow-500 rounded text-white h-4 px-1 pb-0.5 mt-0.5 shadow-md"
              style={{ fontSize: '0.70rem' }}
            >
              {GetShortTimeString({ time: record?.createdAt })}
            </span>
          </p>
        </div>
      ),
    },
    {
      title: 'Purpose',
      dataIndex: 'newNeeds',
      key: 'purpose',
      render: (__, record) => (
        <div>
          <div>
            <Tooltip
              title={
                <div className="flex capitalize">
                  {record?.need?.subNeeds?.description
                    ? record?.need?.subNeeds?.description
                    : record?.need?.subNeeds?.name}
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
                  {record?.need?.subNeeds?.description
                    ? record?.need?.subNeeds?.description
                    : record?.need?.subNeeds?.name}
                </span>
              </div>
            </Tooltip>
          </div>
        </div>
      ),
    },
    {
      title: 'Interset Level',
      key: 'interestLevel',
      dataIndex: 'interestLevel',
      width: 120,
      align: 'center',
      render: (data) => (
        <div className="font-normal bg-green-500 rounded-full Capitalize mx-2 text-white shadow-lg">
          {data}
        </div>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: (data, record) => (
        <>
          <div className="flex">
            <Tooltip
              title="Last status"
              placement="top"
              getPopupContainer={(node) => node.parentNode}
            >
              <span className="px-1 font-semibold">LS:</span>
            </Tooltip>
            <p
              className={`px-1 m-0 font-normal Capitalize ${data === 'Inactive' && 'text-red-500'}`}
              style={{ whiteSpace: 'nowrap' }}
            >
              {data}
            </p>
          </div>

          <div className="flex mt-1">
            <Tooltip
              title="Current status"
              placement="top"
              getPopupContainer={(node) => node.parentNode}
            >
              <span className="px-1 font-semibold">CS:</span>
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
              <span className="px-1 font-semibold">FS:</span>
            </Tooltip>
            <Tooltip title={'ghhh'} placement="top" getPopupContainer={(node) => node.parentNode}>
              <div
                className="px-1 m-0 font-normal w-48 Capitalize"
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {record?.lastFollowUpStatus}
              </div>
            </Tooltip>
          </div>
        </>
      ),
    },
    {
      title: 'Stats',
      key: 'stats',
      render: (text, record) => (
        <div className="flex space-x-4 items-center cursor-pointer p-0">
          <div>
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
          <div>
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
      title: 'Action',
      key: 'action',
      render: () => (
        <div className="flex space-x-3 items-center">
          <Tooltip
            title="Send whatsapp message"
            placement="top"
            getPopupContainer={(node) => node.parentNode}
          >
            <div className={`cursor-pointer icon`}>
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
            getPopupContainer={
              getSingleLeadEnquiry?.totalCount > 5 ? (node) => node.parentNode : null
            }
            overlay={menu(record)}
            trigger={['click']}
            placement={'bottomRight'}
            visible={hideDropDown[record.enquiryId]}
            onVisibleChange={(value) =>
              setHideDropDown({
                [record.enquiryId]: value,
              })
            }
          >
            <MoreOutlined
              onClick={(e) => {
                setLeadCourse(record?.need?.subNeeds?.id);
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
  const RenderInformation = ({ record }) => (
    <div className="p-6 bg-gray-100 rounded-md shadow-md">
      <Row gutter={[24, 24]} className="mb-4">
        <Col xl={5} lg={5} md={5} sm={24} xs={24}>
          <div className="font-semibold text-gray-500 ">Enq Priority</div>
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
          <div className="font-semibold text-gray-500">Enq Creation Date</div>
          <div className="font-normal Capitalize">
            {dayjs(record?.createdAt).format('MMMM D, YYYY') || '--'}
          </div>
        </Col>
        <Col xl={5} lg={5} md={5} sm={24} xs={24}>
          <div className="font-semibold  text-gray-500 ">Enq Created By</div>
          <div className="font-normal Capitalize">{record?.owner?.displayName || '--'}</div>
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

  return (
    <div>
      <div className="mt-4">
        <Form form={form} hideRequiredMark>
          <div className="flex justify-between">
            <div>
              <div className="text-blue-700 font-medium text-xl">Enquiry</div>
            </div>
            <div className="mx-5">
              <Button
                onClick={() => {
                  setAddEnquiryModal(true);
                }}
                type="primary"
                size="middle"
              >
                Add enquiry
              </Button>
            </div>
          </div>
          <Divider style={{ marginTop: '0.6rem' }} />

          <div className="mr-5 mt-5">
            <Tabs
              defaultActiveKey={tab}
              onChange={(val) => {
                setTab(val);
              }}
              className="font-medium text-blue-500"
            >
              {tabs?.map((tabData) => (
                <TabPane
                  tab={<span>{tabData?.title}</span>}
                  key={tabData?.key}
                  style={{ height: '37rem', overflow: 'auto', padding: '11px' }}
                >
                  <div>
                    <Table
                      columns={columns}
                      dataSource={getSingleLeadEnquiry?.records?.map((item) => ({
                        ...item,
                        key: item?.enquiryId,
                      }))}
                      loading={loadingGetEnquiry}
                      pagination={false}
                      className="cursor-pointer"
                      // onRow={() => {
                      //   return {
                      //     onClick: () => {
                      //       history.push(`/leads/students/enquiries/all`);
                      //     },
                      //   };
                      // }}
                      locale={{
                        emptyText: (
                          <div className="flex items-center justify-center text-center">
                            <div>
                              <p className="text-lg">No leads enquiry yet!</p>
                              <img
                                className="ml-16 "
                                src={SearchNotFound}
                                alt="No leads enquiry found!"
                                style={{ height: '100px' }}
                              />
                            </div>
                          </div>
                        ),
                      }}
                      expandable={{
                        expandedRowRender: (record) => <RenderInformation record={record} />,

                        expandIcon: ({ expanded, onExpand, record }) =>
                          expanded ? (
                            <UpOutlined
                              onClick={(e) => {
                                e.stopPropagation();
                                onExpand(record, e);
                                setExpendedBackground(
                                  expendedBackground?.filter((item) => item !== record?.enquiryId),
                                );
                              }}
                            />
                          ) : (
                            <DownOutlined
                              onClick={(e) => {
                                e.stopPropagation();
                                onExpand(record, e);
                                setExpendedBackground((prev) => [...prev, record?.enquiryId]);
                              }}
                            />
                          ),
                        expandIconColumnIndex: 10,
                      }}
                      footer={() => (
                        <CheckValidation show={getSingleLeadEnquiry?.totalCount > 5}>
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
                              total={getSingleLeadEnquiry?.totalCount}
                              showTotal={(total, range) =>
                                `${range[0]}-${range[1]} of ${total} items`
                              }
                              onChange={(current) => {
                                setStartIndex(viewSize * (current - 1));
                                setCurrentPage(current);
                              }}
                            />
                          </Row>
                        </CheckValidation>
                      )}
                    />
                  </div>
                </TabPane>
              ))}
            </Tabs>
          </div>
        </Form>
      </div>
      <AddLeadEnquiry
        setAddEnquiryModal={setAddEnquiryModal}
        addEnquiryModal={addEnquiryModal}
        getLeadEnquiry={getLeadEnquiry}
      />
      <EditLead courseId={leadCourse} />
    </div>
  );
};

export default connect(({ leads, loading }) => ({
  getSingleLeadEnquiry: leads?.getSingleLeadEnquiry,
  editLead: leads?.editLead,
  loadingGetEnquiry: loading?.effects['leads/getSingleLeadEnquiry'],
}))(LeadEnquiry);
