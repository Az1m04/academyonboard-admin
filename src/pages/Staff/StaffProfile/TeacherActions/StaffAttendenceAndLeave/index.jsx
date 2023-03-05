import React, { useEffect, useState } from 'react';
import { Tabs, Divider, Table, Tooltip, Tag, Modal } from 'antd';
import moment from 'moment';
import StaffModalToApprove from './StaffModalToApprove';
import EmptyState from '@/components/EmptyState';
import emptyStateSvg from '@/assets/icons/space-empty.svg';
import { PlusCircle, Tools } from 'react-bootstrap-icons';
import StaffViewLeaveModal from './StaffViewLeaveModal';
import { connect, useParams } from 'umi';
import { EyeOutlined } from '@ant-design/icons';

const StaffAttendenceAndLeave = ({
  dispatch,
  loadingLeave,
  LeavesRecords,
  singleLeaveDetails,
  statusLoading,
}) => {
  const { TabPane } = Tabs;
  const { staffId } = useParams();
  const [viewModal, setViewModal] = useState(false);
  const [approveModal, setApproveModal] = useState(false);
  const [previewModal, setPreviewModal] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [tab, setTab] = useState('attendance');
  const [leaveNo, setLeaveNo] = useState();
  const [appiedFor, setAppiedFor] = useState();
  const [previewImage, setPreviewImage] = useState('');

  const getLeaveStatus = (value) => {
    if (value === 'APPROVED') return 'success';
    if (value === 'REJECTED') {
      return 'error';
    }
    return 'warning';
  };
  const getLeavesRecords = () => {
    dispatch({
      type: 'staff/getLeavesRecord',
      payload: {
        pathParams: { staffId },
      },
    });
  };
  const getLeaveDetails = (peopleId, leaveId) => {
    dispatch({
      type: 'staff/getSingleLeaveDetails',
      payload: {
        pathParams: { peopleId, leaveId },
      },
    });
  };
  const updateLeaveStatus = (values) => {
    dispatch({
      type: 'staff/markLeaveStatus',
      payload: {
        pathParams: { peopleId: appiedFor, leaveId: leaveNo },
        body: values,
      },
    }).then((res) => {
      if (res) {
        getLeavesRecords();
        setApproveModal(false);
      }
    });
  };
  useEffect(() => {
    if (tab === 'leave') {
      getLeavesRecords();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);
  const columns = [
    {
      title: <div className="text-center">Sr. no</div>,

      render: (_, __, index) => <div className="text-center text-gray-700">{index + 1}</div>,
    },
    {
      title: <div className="text-center">Course & Modules</div>,

      render: (data) => (
        <div className="text-gray-700 text-center">
          <span className="px-1"> {data?.product?.name}</span>{' '}
          <span className="border-l-2 border-yellow-500 px-1">
            {data?.product?.modules[0]?.name}
          </span>
        </div>
      ),
    },

    {
      title: <div className="text-center">Batch</div>,

      render: (data) => (
        <div className="flex items-center text-center justify-center ">
          <span className="text-gray-700">{data?.batchName} </span>{' '}
          <span className="ml-3 flex items-center px-1">
            {' '}
            (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              fill={'#180' || 'red'}
              viewBox="0 0 16 16"
            >
              <circle cx="8" cy="8" r="8" />
            </svg>{' '}
            <span className="ml-1">{data?.modeId !== 'OFFLINE' ? 'Online' : 'Offline'}</span> )
          </span>
        </div>
      ),
    },
    {
      title: <div className="text-center">Attendance %</div>,

      render: (data) => (
        <div className="text-center">
          <Tooltip
            color="white"
            title={
              <div className="text-gray-900 text-md font-semibold  ">
                <div>
                  Total classes :<span className="text-gray-700"> {data?.totalClasses}</span>
                </div>
                <div>
                  {' '}
                  <span className="text-green-500 text-md"> Present :</span>{' '}
                  <span className="text-gray-700">{data?.present}</span>
                </div>
                <div>
                  <span className="text-red-500 text-md"> Absent :</span>{' '}
                  <span className="text-gray-700">{data?.absent}</span>
                </div>
              </div>
            }
          >
            <span>{data?.attendancePer}</span>
          </Tooltip>
        </div>
      ),
    },
    {
      title: <div className="text-center"> Attend Stat.</div>,
      key: 'attendStatus',
      dataIndex: 'attendStatus',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <div className="flex gap-4 justify-center">
          <a>
            <PlusCircle className="text-xl" />
          </a>
          <a href="">
            <Tools className="text-xl" />
          </a>
        </div>
      ),
    },
  ];
  const columns1 = [
    {
      title: <div className="text-center">Sr. no</div>,

      render: (_, __, index) => <div className="text-center text-gray-700">{index + 1}</div>,
    },
    {
      title: <div className="text-center">App. Number</div>,
      render: (_, record) => <div className="text-gray-700 text-center">{record?.leaveId}</div>,
    },

    {
      title: <div className="text-center">Leave Type</div>,
      dataIndex: 'leaveType',

      key: 'leaveType',
      render: (text) => <div className=" text-center text-gray-700">{text}</div>,
    },
    {
      title: <div className="text-center">From Date</div>,

      render: (data) => (
        <div className="text-center text-gray-700">
          {moment(data?.startsAt).format('DD MMM YYYY')}
        </div>
      ),
    },
    {
      title: <div className="text-center"> From To</div>,

      render: (data) => (
        <div className="text-center text-gray-700">
          {moment(data?.endsAt).format('DD MMM YYYY')}
        </div>
      ),
    },
    {
      title: <div className="text-center"> Total Days</div>,

      render: (_, record) => <div className="text-center text-gray-700">{record?.totalDays}</div>,
    },
    {
      title: <div className="text-center"> Applied On</div>,

      render: (data) => (
        <div className="text-center text-gray-700">
          {moment(data?.appliedAt).format('DD MMM YYYY')}
        </div>
      ),
    },
    {
      title: <div className="text-center"> Supporting Document</div>,
      width: '7rem',
      align: 'center',
      render: (data) => (
        <>
          {data?.content?.downloadUrl ? (
            <Tooltip title="View document">
              <div
                className="text-center text-gray-700 flex justify-center cursor-pointer"
                onClick={() => {
                  setPreviewModal(true);
                  setPreviewImage(data?.content?.downloadUrl);
                }}
              >
                {
                  <img
                    className="w-5 h-5"
                    src={
                      'https://img.icons8.com/external-flatart-icons-outline-flatarticons/24/000000/external-attachment-twitter-flatart-icons-outline-flatarticons.png'
                    }
                  />
                }
              </div>
            </Tooltip>
          ) : (
            '--'
          )}
        </>
      ),
    },
    {
      title: <div className="text-center"> Leave status</div>,

      render: (data) => (
        <div className="text-center text-gray-700 flex justify-center">
          <Tag color={getLeaveStatus(data?.leaveStatusId)}>{data?.leaveStatusId}</Tag>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="flex mx-7 justify-between ">
          <Tooltip title="View leave details">
            <a
              className="text-blue-500 "
              onClick={() => {
                setViewModal(true);
                setViewData(record);
                getLeaveDetails(record?.appliedFor?.id, record?.id);
              }}
            >
              <EyeOutlined className="text-lg" />
            </a>
          </Tooltip>
          {record?.leaveStatusId === 'PENDING' && (
            <Tooltip title="Mark leave status">
              <a
                onClick={() => {
                  setApproveModal(true);
                  setViewData(record);
                  setLeaveNo(record?.id);
                  setAppiedFor(record?.appliedFor?.id);
                }}
              >
                <PlusCircle className="text-lg mt-1.5" />
              </a>
            </Tooltip>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="w-full">
        <div className="flex justify-between items-center h-10">
          <div className="text-blue-600 font-semibold text-lg">Attendance & Leave</div>
          <div className="items-center flex space-x-4"></div>
        </div>
        <Divider style={{ marginTop: '0.6rem' }} />
        <div className=" -mt-5">
          <Tabs
            defaultActiveKey="attendance"
            activeKey={tab}
            onChange={(val) => {
              setTab(val);
            }}
            className="font-semibold text-blue-500"
          >
            <TabPane
              tab={<span className="font-semibold">Attendance</span>}
              key={'attendance'}
              style={{ height: '45rem', overflow: 'auto', padding: '11px' }}
            >
              <Table
                locale={{
                  emptyText: (
                    <>
                      {' '}
                      <EmptyState
                        emptyState={emptyStateSvg}
                        emptyHeaderText={<span>No Attendance marked yet!</span>}
                      />
                    </>
                  ),
                }}
              >
                {columns?.map((items) => (
                  <Table.Column
                    key={items?.key}
                    onHeaderCell={() => ({
                      style: {
                        backgroundColor: 'white',
                        borderColor: 'white',
                        padding: '0px',
                      },
                    })}
                    onCell={() => ({
                      style: {
                        borderWidth: '1px',
                        padding: '10px',
                      },
                    })}
                    width={items?.width}
                    title={
                      <h1 className="text-blue-700 px-2.5 py-2.5 mt-1.5 text-sm">{items?.title}</h1>
                    }
                    dataIndex={items?.dataIndex}
                    align={items?.align}
                    render={items?.render}
                  />
                ))}
              </Table>
            </TabPane>
            <TabPane
              tab={<span className="font-semibold">Leave</span>}
              key={'leave'}
              style={{ height: '45rem', overflow: 'auto', padding: '11px' }}
            >
              <Table
                loading={Boolean(loadingLeave)}
                locale={{
                  emptyText: (
                    <>
                      <EmptyState
                        emptyState={emptyStateSvg}
                        emptyHeaderText={<span>No leave found yet!</span>}
                      />
                    </>
                  ),
                }}
                dataSource={LeavesRecords?.records}
                scroll={{ x: 1200 }}
              >
                {columns1?.map((items) => (
                  <Table.Column
                    key={items?.key}
                    onHeaderCell={() => ({
                      style: {
                        backgroundColor: 'white',
                        borderColor: 'white',
                        padding: '0px',
                      },
                    })}
                    onCell={() => ({
                      style: {
                        borderWidth: '1px',
                        padding: '10px',
                      },
                    })}
                    width={items?.width}
                    title={
                      <h1 className="text-blue-700 px-2.5 py-2.5 mt-1.5 text-sm">{items?.title}</h1>
                    }
                    dataIndex={items?.dataIndex}
                    align={items?.align}
                    render={items?.render}
                  />
                ))}
              </Table>
            </TabPane>
          </Tabs>
        </div>
      </div>
      <StaffModalToApprove
        setApproveModal={setApproveModal}
        approveModal={approveModal}
        viewData={viewData}
        statusLoading={statusLoading}
        updateLeaveStatus={updateLeaveStatus}
      />
      <StaffViewLeaveModal
        viewModal={viewModal}
        setViewModal={setViewModal}
        viewData={viewData}
        leaveDetails={singleLeaveDetails}
      />
      <Modal
        onCancel={() => setPreviewModal(false)}
        visible={previewModal}
        width="80%"
        title="Document Perview"
        footer={null}
        bodyStyle={{ margin: 0, padding: 0, height: '75vh' }}
      >
        <iframe
          title="Documents Preview"
          src={previewImage}
          className="h-full text-center w-full"
          frameBorder="0"
        />
      </Modal>
    </div>
  );
};
export default connect(({ staff, loading }) => ({
  LeavesRecords: staff?.LeavesRecords,
  singleLeaveDetails: staff?.studentLeaveDetails,
  loadingLeave: loading?.effects['staff/getLeavesRecord'],
  statusLoading: loading?.effects['staff/markLeaveStatus'],
}))(StaffAttendenceAndLeave);
