/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  Tabs,
  Form,
  Spin,
  Divider,
  Table,
  Tooltip,
  Tag,
  Modal,
  Button,
  Select,
  DatePicker,
} from 'antd';
import moment from 'moment';
import { connect, useParams, history } from 'umi';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import ModalToApprove from './ModalToApprove';
import EmptyState from '@/components/EmptyState';
import emptyStateSvg from '@/assets/icons/space-empty.svg';
import { PlusCircle, Tools } from 'react-bootstrap-icons';
import ViewLeavesModal from './ViewLeavesModal';

dayjs.extend(relativeTime);

const AttendanceAndLeave = ({
  dispatch,
  noteDetails,
  loadingNotes,
  studentLeaveList,
  studentAttendanceList,
}) => {
  const [form] = Form.useForm();
  const { studentId, tabname, tabs } = useParams();
  const [viewModal, setViewModal] = useState(false);
  const [approveModal, setApproveModal] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [tab, setTab] = useState(tabs);
  const { TabPane } = Tabs;
  const [selectedDate] = useState('');
  const [range] = useState([moment().subtract(7, 'day'), moment()]);
  const [previewModal, setPreviewModal] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [isAttendanceModal, setIsAttendanceModal] = useState(false);
  const [studentAttendance, setStudentAttendance] = useState();

  const getLeaveList = () => {
    dispatch({
      type: 'student/getStudentLeaveList',
      payload: {
        pathParams: {
          studentId,
        },
      },
    }).catch(() => {});
  };
  useEffect(() => {
    dispatch({
      type: 'student/getStudentApproverList',
      payload: {
        pathParams: {
          studentId,
        },
      },
    }).catch(() => {});

    dispatch({
      type: 'student/getStudentAttendanceList',
      payload: {
        pathParams: {
          studentId,
        },
      },
    }).catch(() => {});

    getLeaveList();
  }, [dispatch, studentId]);

  useEffect(() => {
    if (viewData?.leaveId) {
      dispatch({
        type: 'student/getSingleStudentLeave',
        payload: {
          pathParams: {
            studentId,
            leaveId: viewData?.leaveId,
          },
        },
      }).catch(() => {});
    }
  }, [viewData]);

  useEffect(() => {
    getLeaveList();
  }, [approveModal]);

  const tabsPane = [
    {
      tab: <span className="font-semibold">Attendance</span>,
      key: 'attendance',
    },
    {
      tab: <span className="font-semibold">Leave</span>,
      key: 'leave',
    },
  ];

  const activityTimeList = [
    {
      label: 'Today',
      id: 'TODAY',
      value: moment().format('YYYY-MM-DD HH:mm:ss'),
      startDate: moment().format('YYYY-MM-DD HH:mm:ss'),
      endDate: moment().format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      label: 'Yesterday',
      id: 'YESTERDAY',
      startDate: moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss'),
      endDate: moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss'),
      value: moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      label: 'Last 7 days',
      id: 'LAST_7_DAYS',
      value: moment().subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss'),
      startDate: moment().subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss'),
      endDate: moment().format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      label: 'Last 15 days',
      id: 'LAST_15_DAYS',
      value: moment().subtract(15, 'days').format('YYYY-MM-DD HH:mm:ss'),
      startDate: moment().subtract(15, 'days').format('YYYY-MM-DD HH:mm:ss'),
      endDate: moment().format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      label: 'Last 30 days',
      id: 'LAST_30_DAYS',
      value: moment().subtract(30, 'days').format('YYYY-MM-DD HH:mm:ss'),
      startDate: moment().subtract(30, 'days').format('YYYY-MM-DD HH:mm:ss'),
      endDate: moment().format('YYYY-MM-DD HH:mm:ss'),
    },

    {
      label: 'Last month',
      id: 'LAST_MONTH',
      value: moment().subtract(1, 'months').format('YYYY-MM-DD HH:mm:ss'),
      startDate: moment().subtract(1, 'months').format('YYYY-MM-DD HH:mm:ss'),
      endDate: moment().format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      label: 'Custom',
      id: 'CUSTOM',
      value: 'custom',
    },
  ];

  const getNotesRecord = () => {
    const data = {};

    switch (tab) {
      case 'LEAVE':
        data.noteType = 'LEAVE';

        break;
      default:
        data.noteType = 'ATTENDANCE';

        break;
    }

    const payload = {
      pathParams: { studentId },
      query: {
        ...data,
        startDate:
          selectedDate === 'Custom'
            ? range[0].format('YYYY-MM-DD HH:mm:ss')
            : activityTimeList?.filter((p) => p?.label === selectedDate)[0]?.startDate,
        endDate:
          selectedDate === 'Custom'
            ? range[1].format('YYYY-MM-DD HH:mm:ss')
            : activityTimeList?.filter((p) => p?.label === selectedDate)[0]?.endDate,
        viewSize: 1000,
      },
    };
    dispatch({
      type: 'student/getNotes',
      payload,
    });
  };
  const getStudentStats = () => {
    dispatch({
      type: 'students/getStudentStats',
      payload: {
        pathParams: { studentId },
      },
    });
  };
  const getStudentNotes = () => {
    const payload = {
      pathParams: { studentId },
      query: { noteType: 'All' },
    };
    dispatch({
      type: 'student/getNotes',
      payload,
    });
  };

  useEffect(() => {
    getNotesRecord();
    getStudentStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, tab]);

  const getLeaveStatus = (value) => {
    if (value === 'APPROVED') return 'success';
    if (value === 'REJECTED') {
      return 'error';
    }
    return 'warning';
  };

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
      render: (_, record) => (
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

      render: (data) => <div className="text-gray-700 text-center">{data?.leaveId}</div>,
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

      render: (data) => (
        <div className="text-center text-gray-700">
          {moment(data?.endsAt).diff(moment(data?.startsAt), 'days')}
        </div>
      ),
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

      render: (data) => (
        <>
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
                  src={
                    data?.content?.downloadUrl
                      ? 'https://img.icons8.com/external-flatart-icons-outline-flatarticons/24/000000/external-attachment-twitter-flatart-icons-outline-flatarticons.png'
                      : ''
                  }
                />
              }
            </div>
          </Tooltip>
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
        <div className="flex gap-4 justify-center ">
          {record?.leaveStatusId === 'PENDING' && (
            <Tooltip title="Mark leave status">
              <a
                onClick={() => {
                  setApproveModal(true);
                  setViewData(record);
                }}
              >
                <PlusCircle className="text-xl" />
              </a>
            </Tooltip>
          )}
          <Tooltip title="View leave details">
            <a
              className="text-blue-500 underline"
              onClick={() => {
                setViewModal(true);
                setViewData(record);
              }}
            >
              view{' '}
            </a>
          </Tooltip>

          <ModalToApprove
            setApproveModal={setApproveModal}
            approveModal={approveModal}
            studentId={studentId}
            viewData={viewData}
          />
          <ViewLeavesModal viewModal={viewModal} setViewModal={setViewModal} viewData={viewData} />
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">
      <div className="flex justify-between items-center h-10">
        <div className="text-blue-600 font-semibold text-lg">Attendance & Leave</div>
        <div className="items-center flex space-x-4 mx-5">
          <Button
            type="primary"
            onClick={() => {
              setIsAttendanceModal(true);
            }}
          >
            Mark student attendance
          </Button>
        </div>
      </div>
      <Divider style={{ marginTop: '0.6rem' }} />
      <div className=" -mt-5">
        <Tabs
          defaultActiveKey="attendance"
          activeKey={tabs}
          onChange={(val) => {
            setTab(val);
            history.push(`/students/${studentId}/${tabname}/${val}`);
          }}
          className="font-semibold text-blue-500"
        >
          {tabsPane?.map((value) => (
            <TabPane
              tab={value?.tab}
              key={value?.key}
              style={{ marginBottom: '2.5rem', overflow: 'auto', padding: '11px' }}
            >
              <Spin spinning={Boolean(studentId) && loadingNotes}>
                {value?.key === 'attendance' ? (
                  <>
                    {noteDetails?.records?.length > 0 && (
                      <Table
                        dataSource={studentAttendanceList?.records}
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
                              <h1 className="text-blue-700 px-2.5 py-2.5 mt-1.5 text-sm">
                                {items?.title}
                              </h1>
                            }
                            dataIndex={items?.dataIndex}
                            align={items?.align}
                            render={items?.render}
                          />
                        ))}
                      </Table>
                    )}
                  </>
                ) : (
                  <>
                    {' '}
                    {noteDetails?.records?.length > 0 && (
                      <Table
                        dataSource={studentLeaveList?.records}
                        locale={{
                          emptyText: (
                            <>
                              {' '}
                              <EmptyState
                                emptyState={emptyStateSvg}
                                emptyHeaderText={<span>No leave found yet!</span>}
                              />
                            </>
                          ),
                        }}
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
                              <h1 className="text-blue-700 px-2.5 py-2.5 mt-1.5 text-sm">
                                {items?.title}
                              </h1>
                            }
                            dataIndex={items?.dataIndex}
                            align={items?.align}
                            render={items?.render}
                          />
                        ))}
                      </Table>
                    )}{' '}
                  </>
                )}
              </Spin>
            </TabPane>
          ))}
        </Tabs>
      </div>
      <Modal
        visible={isAttendanceModal}
        title="Mark student attendance here"
        footer={null}
        onCancel={() => {
          setIsAttendanceModal(false);
          setStudentAttendance();
        }}
      >
        <div>
          <div className="mt-5">
            <div className="flex">
              <p className="font-medium text-gary-700">Date:</p>
              <p className="px-2 mx-2 ">
                <DatePicker defaultValue={moment()} />
                {/* {moment().format('DD MMMM YYYY')}  */}
              </p>
            </div>
            <p className="font-medium">Student attendance</p>
            <div className="w-full">
              <Select
                value={studentAttendance}
                onChange={(val) => {
                  setStudentAttendance(val);
                }}
                style={{ width: '100%' }}
                placeholder={'Please select attendance'}
              >
                <Select.Option value={'Morning_Evening'}>Morning and Evening</Select.Option>
                <Select.Option value={'Module_Wise'}>Module Wise</Select.Option>
                <Select.Option value={'Full_Day'}>Full day attendance</Select.Option>
              </Select>
            </div>
          </div>
          <div className="flex justify-end mt-5 gap-5">
            <Button
              type="default"
              onClick={() => {
                setIsAttendanceModal(false);
                setStudentAttendance();
              }}
            >
              Cancel
            </Button>
            <Button type="primary">Submit</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default connect(({ student, leads, loading }) => ({
  noteDetails: student?.noteDetails,
  editLead: leads?.editLead,
  studentLeaveList: student?.studentLeaveList,
  studentAttendanceList: student?.studentAttendanceList,
  loadingNotes: loading.effects['student/getStudentLeaveList'],
}))(AttendanceAndLeave);
