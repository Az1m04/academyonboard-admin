import React, { useState, useEffect } from 'react';
import {
  Button,
  Calendar,
  message,
  Divider,
  Input,
  Modal,
  Popover,
  Spin,
  Tabs,
  Tooltip,
  Tag,
} from 'antd';
import { connect, useParams } from 'umi';
import styles from './index.less';
import {
  CaretLeftFill,
  CaretRightFill,
  Envelope,
  PlusCircle,
  Whatsapp,
} from 'react-bootstrap-icons';
import BatchAttendanceTable from './BatchAttendanceTable';
import { ChatLeftIcon, CourseBookIcon, MoneyBag, StudentWithBag } from '@/utils/AppIcons';
import GenerateWhatsAppMessage from '@/components/GenerateWhatsAppMessage';
import CheckValidation from '@/components/CheckValidation';
import GenerateEmail from '@/components/GenerateEmail';
import moment from 'moment';
import Avatar from 'antd/lib/avatar/avatar';
import StudentsAttendanceTable from './StudentsAttendanceTable';
import { getInitials } from '@/utils/common';
import { UsergroupAddOutlined } from '@ant-design/icons';
import customCalendarHeaderRenderer from '@/components/customCalendarHeaderRenderer';
import { debounce } from 'lodash';
import EmptyState from '@/components/EmptyState';
import emptyStateSvg from '@/assets/icons/space-empty.svg';

const StudentAttendance = ({
  dispatch,
  loading,
  loadingStudent,
  getStaffBatches,
  getStudentsList,
  getStaffBatchesStudents,
  loadingStaffBatchesStudents,
  updateStaffBatcheAttendance,
  submitStaffBatchAttendance,
}) => {
  const { staffId } = useParams();
  const { TabPane } = Tabs;
  const { Search } = Input;
  const [dateFilter, setDateFilter] = useState(
    moment()
      .calendar()
      .replace(` at ${moment().format('LT')}`, ''),
  );
  const [increaseDecrease, setIncreaseDecrease] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);
  const [batchAttendanceModel, setBatchAttendanceModel] = useState(false);
  const [studentAttendanceModel, setStudentAttendanceModel] = useState(false);
  const [singleStudentAttendance, setSingleStudentAttendance] = useState();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [visibleWhatsApp, setVisibleWhatsApp] = useState(false);
  const [visibleEmail, setVisibleEmail] = useState(false);
  const [recordDetails, setRecordDetails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewSize, setViewSize] = useState(5);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(moment());
  const [batchId, setBatchId] = useState();
  const [batchStudentsAttendance, setBatchStudentsAttendance] = useState([]);
  const [batchUpdateStudentsAttendance, setBatchUpdateStudentsAttendance] = useState(false);
  const [mode, setMode] = useState('');
  const [keywords, setKeywords] = useState();
  const tabs = [
    {
      title: 'All Batch',
      key: '',
    },
    {
      title: 'Online Batch',
      key: 'ONLINE',
    },
    {
      title: 'Offline Batch',
      key: 'OFFLINE',
    },
    {
      title: 'All Students',
      key: 'allStudents',
    },
  ];
  const getStaffBatchesDetails = (filterByDate, keyword, start, size, modetype) => {
    dispatch({
      type: 'staff/getStaffBatches',
      payload: {
        pathParams: {
          staffId,
        },
        query: { filterByDate, keyword, mode: modetype, startIndex: start, viewSize: size },
      },
    });
  };
  const getBatchesStudents = (batch) => {
    setBatchId(batch);
    const attendanceDate = moment().add(increaseDecrease, 'days').format('YYYY-MM-DD HH:mm:ss');
    dispatch({
      type: 'staff/getStaffBatchesStudents',
      payload: {
        pathParams: {
          batchId: batch,
        },
        query: { attendanceDate },
      },
    }).then((res) => {
      if (res?.studentDetails[0]?.timesheetId) {
        setBatchStudentsAttendance(
          res?.studentDetails?.map((details) => {
            return { id: details?.id, timesheetId: details?.timesheetId, status: details?.status };
          }),
        );
        setBatchUpdateStudentsAttendance(true);
      } else {
        setBatchStudentsAttendance([]);
        setBatchUpdateStudentsAttendance(false);
      }
    });
  };
  const getStudentsData = (start, size, keyword, modetype) => {
    dispatch({
      type: 'staff/getStudentsList',
      payload: {
        pathParams: {
          staffId,
        },
        query: { keyword, mode: modetype, startIndex: start, viewSize: size },
      },
    });
  };

  const PostBatchAttendance = () => {
    let Presentstudents = [];
    Presentstudents = getStaffBatchesStudents?.studentDetails?.map((find) =>
      batchStudentsAttendance?.find((items) => items?.id === find?.id)?.id === undefined
        ? { id: find?.id, status: 'PRESENT', timesheetId: find?.timesheetId }
        : null,
    );
    const body = [...Presentstudents?.filter((fill) => fill !== null), ...batchStudentsAttendance];
    const attendanceDate = moment().add(increaseDecrease, 'days').format('YYYY-MM-DD HH:mm:ss');
    dispatch({
      type: 'staff/StaffBatchesStudentsAttendance',
      payload: {
        body,
        pathParams: {
          batchId,
        },
        query: { attendanceDate },
      },
    }).then((res) => {
      if (res?.responseMessage === 'success') {
        setBatchAttendanceModel(false);
        message.success('Attendance successfully Marked');
        getStaffBatchesDetails(attendanceDate, '', 0, 7, '');
      }
    });
  };
  const updateStudentsAttendance = () => {
    const attendanceDate = moment().add(increaseDecrease, 'days').format('YYYY-MM-DD HH:mm:ss');
    dispatch({
      type: 'staff/updateBatchStudentsAttendance',
      payload: {
        body: batchStudentsAttendance,
        pathParams: {
          batchId,
        },
        query: { attendanceDate },
      },
    }).then((res) => {
      if (res?.responseMessage === 'success') {
        setBatchAttendanceModel(false);
        message.success('Attendance updated successfully');
        getStaffBatchesDetails(attendanceDate, '', 0, 7, '');
      }
    });
  };
  useEffect(() => {
    getStudentsData(0, 5, '', '');
  }, []);
  useEffect(() => {
    setDateFilter(
      moment()
        .add(increaseDecrease, 'days')
        .calendar()
        .replace(` at ${moment().format('LT')}`, ''),
    );
    const filterByDate = moment().add(increaseDecrease, 'days').format('YYYY-MM-DD HH:mm:ss');
    getStaffBatchesDetails(filterByDate, '', 0, 7, '');
  }, [increaseDecrease]);
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKey, selectedTableRows) => {
      setSelectedRowKeys(selectedRowKey);
      setSelectedRows(selectedTableRows);
      setRecordDetails(selectedTableRows);
    },
  };
  const action = (value) => {
    setCurrentPage(1);
    if (mode === 'allStudents') {
      getStudentsData(0, viewSize, value, '');
    } else {
      const filterByDate = moment().add(increaseDecrease, 'days').format('YYYY-MM-DD HH:mm:ss');
      getStaffBatchesDetails(filterByDate, value, 0, 7, mode);
    }
  };
  const onSearchChange = debounce(action, 600);
  const onTabChange = (key) => {
    if (key !== 'allStudents') {
      const filterByDate = moment().add(increaseDecrease, 'days').format('YYYY-MM-DD HH:mm:ss');
      getStaffBatchesDetails(filterByDate, '', 0, 7, key);
    } else {
      getStudentsData(0, viewSize, '', '');
    }
    setMode(key);
    setKeywords('');
  };
  return (
    <div>
      <Spin spinning={Boolean(loading)}>
        <h1 className="text-blue-700 text-xl font-medium mt-4">Student Attendance</h1>

        <div className="flex justify-between mr-10">
          <Search
            style={{ width: '30rem' }}
            size="middle"
            placeholder="Enter keyword to search"
            enterButton
            value={keywords}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setKeywords(e.target.value);
            }}
          />
          <div className="flex">
            <Button
              className={styles?.dateButton}
              style={{
                border: 'none',
                background: 'none',
                boxShadow: 'none',
                width: 'max-content',
              }}
              onClick={() => {
                setIncreaseDecrease(increaseDecrease - 1);
              }}
            >
              <CaretLeftFill className=" text-xl " />
            </Button>
            <div className="">
              <div>
                <Popover
                  overlayClassName="mmo-popup"
                  trigger="click"
                  placement="bottomLeft"
                  visible={isCalendarVisible}
                  onVisibleChange={() => setIsCalendarVisible(!isCalendarVisible)}
                  content={
                    <div className="pb-2 mb-2 border-b" style={{ maxWidth: '300px' }}>
                      <Calendar
                        disabledDate={(currentDate) => currentDate && currentDate > moment()}
                        fullscreen={false}
                        headerRender={({ value, type, onChange, onTypeChange }) => {
                          return customCalendarHeaderRenderer({
                            value,
                            type,
                            onChange,
                            onTypeChange,
                          });
                        }}
                        onSelect={(momentDate) => {
                          if (
                            moment(momentDate).format('YYYY-MM-DD') <=
                            moment()?.format('YYYY-MM-DD')
                          )
                            setSelectedDate(momentDate);
                        }}
                      />
                      <div className="flex-auto flex space-x-2 justify-end">
                        <Button
                          onClick={() => setIsCalendarVisible(false)}
                          type="text"
                          size="large"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="link"
                          size="large"
                          className="font-semibold"
                          onClick={() => {
                            const date1 = new Date(selectedDate.format('L'));
                            const date2 = new Date(moment().format('L'));
                            const DifferenceInTime = date2.getTime() - date1.getTime();
                            const DifferenceInDays = DifferenceInTime / (1000 * 3600 * 24);
                            setIncreaseDecrease(-DifferenceInDays);
                            setIsCalendarVisible(false);
                          }}
                        >
                          OK
                        </Button>
                      </div>
                    </div>
                  }
                >
                  <h1 className="hover:bg-gray-50 px-2.5 py-1 cursor-pointer text-gray-900 font-bold  tracking-wide  text-center select-none outline-hidden">
                    {dateFilter.replace(` at ${moment().format('LT')}`, '')}
                  </h1>
                </Popover>
              </div>
            </div>

            <Button
              disabled={dateFilter === 'Today'}
              style={{ border: 'none', background: 'none', boxShadow: 'none' }}
              className={styles?.dateButton}
              onClick={() => {
                setIncreaseDecrease(increaseDecrease + 1);
              }}
            >
              <CaretRightFill className=" text-xl  " />
            </Button>
          </div>
          <div className="space-x-2 flex">
            <Tooltip title="">
              <Button size="middle" type="primary">
                <PlusCircle className="text-base" style={{ color: 'white' }} />
              </Button>
            </Tooltip>
            <Tooltip title="Refresh table">
              <Button
                size="middle"
                type="primary"
                onClick={() => {
                  if (mode === 'allStudents') {
                    getStudentsData(0, viewSize, '', '');
                  } else {
                    const filterByDate = moment()
                      .add(increaseDecrease, 'days')
                      .format('YYYY-MM-DD hh:mm:ss');
                    getStaffBatchesDetails(filterByDate, '', 0, 7, mode);
                  }
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className={`bi bi-arrow-clockwise ${
                    Boolean(loading || loadingStudent) && 'animate-spin'
                  }`}
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
            <Tooltip title="Send mass email messages" placement="top">
              <Button
                size="middle"
                type="primary"
                className={styles?.buttonStyling}
                disabled={selectedRows?.length === 0}
                onClick={() => setVisibleEmail(true)}
              >
                <Envelope />
              </Button>
            </Tooltip>
            <Tooltip title="Send mass whatsapp messages">
              <Button
                size="middle"
                type="primary"
                className={styles?.buttonStyling}
                disabled={selectedRows?.length === 0}
                style={{}}
                onClick={() => setVisibleWhatsApp(true)}
              >
                <Whatsapp className="text-base" />
              </Button>
            </Tooltip>
            <Tooltip title="">
              <Button size="middle" type="primary">
                <ChatLeftIcon className="text-base" style={{ color: 'white' }} />
              </Button>
            </Tooltip>
          </div>
        </div>
        <div className="mr-10">
          <Divider />
        </div>
        <div className="mr-10">
          <Tabs defaultActiveKey="" onChange={onTabChange}>
            {tabs?.map(({ key, title }) => (
              <TabPane tab={title} key={key}>
                {key !== 'allStudents' ? (
                  <div className="">
                    <BatchAttendanceTable
                      loading={loading}
                      mode={mode}
                      dispatch={dispatch}
                      getBatchesStudents={getBatchesStudents}
                      setBatchAttendanceModel={setBatchAttendanceModel}
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                      viewSize={viewSize}
                      setViewSize={setViewSize}
                      getStaffBatches={getStaffBatches}
                    />
                  </div>
                ) : (
                  <StudentsAttendanceTable
                    setStudentAttendanceModel={setStudentAttendanceModel}
                    loading={loadingStudent}
                    rowSelection={rowSelection}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    viewSize={viewSize}
                    setViewSize={setViewSize}
                    setSingleStudentAttendance={setSingleStudentAttendance}
                    // handleChangePagination={handleChangePagination}
                    getStudentsData={getStudentsData}
                    getStudentsList={getStudentsList}
                  />
                )}
              </TabPane>
            ))}
          </Tabs>
        </div>
      </Spin>
      <CheckValidation show={visibleWhatsApp}>
        <GenerateWhatsAppMessage
          type="student"
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
      <CheckValidation show={visibleEmail}>
        <GenerateEmail
          type="student"
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
      <Modal
        title={
          <div className="flex pt-3 px-6">
            <UsergroupAddOutlined style={{ color: '#1d4ed8' }} className="text-xl mr-1.5 mt-1.5" />
            <h1 className="text-blue-700 font-bold py-2">
              {batchUpdateStudentsAttendance === true
                ? 'Update Batch attendance'
                : 'Mark Batch attendance'}
            </h1>
          </div>
        }
        className={styles.modelHeader}
        centered
        onCancel={() => setBatchAttendanceModel(false)}
        footer={
          getStaffBatchesStudents?.studentDetails?.length > 0 ? (
            <div className="px-6">
              {batchUpdateStudentsAttendance === true ? (
                <Button
                  loading={Boolean(updateStaffBatcheAttendance)}
                  style={{
                    background: '#096dd9',
                    color: 'white',
                    fontWeight: '500',
                    borderColor: '#096dd9',
                  }}
                  onClick={() => updateStudentsAttendance()}
                >
                  Update Attendance
                </Button>
              ) : (
                <Button
                  loading={Boolean(submitStaffBatchAttendance)}
                  style={{
                    background: '#096dd9',
                    color: 'white',
                    fontWeight: '500',
                    borderColor: '#096dd9',
                  }}
                  onClick={() => PostBatchAttendance()}
                >
                  Submit
                </Button>
              )}
            </div>
          ) : null
        }
        visible={batchAttendanceModel}
        maskClosable={false}
      >
        <Spin spinning={Boolean(loadingStaffBatchesStudents)}>
          <CheckValidation
            show={getStaffBatchesStudents?.studentDetails?.length > 0}
            fallback={
              <EmptyState
                emptyState={emptyStateSvg}
                emptyHeaderText={<span>No student assigned yet</span>}
              />
            }
          >
            <div className="overflow-y-auto px-4" style={{ maxHeight: '20rem' }}>
              {getStaffBatchesStudents?.studentDetails?.map((item) => (
                <div className=" border mb-4 rounded-md shadow-md pb-2" key={item?.id}>
                  <div className="flex justify-between items-center px-2 py-2">
                    <div className="flex items-center">
                      {item?.photoUrl !== undefined ? (
                        <div>
                          <img src={item?.photoUrl} alt="" className="rounded-full w-8 h-8" />
                        </div>
                      ) : (
                        <Avatar
                          className="uppercase text-gray-900 font-medium"
                          size={40}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            backgroundColor: '#f56a00',
                          }}
                        >
                          <p className="text-white font-medium text-xs m-0">
                            {item?.displayName && getInitials(item?.displayName)}
                          </p>
                        </Avatar>
                      )}
                      <div className="m-0">
                        <h1 className="text-gray-900 font-medium mb-0 ml-2">{item?.displayName}</h1>
                        <h1 className="text-gray-900 font-medium mb-0 ml-2">{item?.email}</h1>
                      </div>
                    </div>
                    <div className="">
                      {/* eslint-disable-next-line no-nested-ternary */}
                      {item?.status === 'LEAVE' ? (
                        <button
                          className="text-white font-medium bg-yellow-500  rounded-md shadow-md flex-none"
                          style={{ padding: '0.25rem 0.875rem' }}
                        >
                          On leave
                        </button>
                      ) : batchStudentsAttendance?.find((finded) => finded?.id === item?.id)
                          ?.status === 'ABSENT' ? (
                        <Tooltip title="Click to Present">
                          <button
                            className="text-white font-medium bg-red-500 rounded-md shadow-md outline-hidden select-none "
                            style={{ padding: '0.25rem 1.25rem' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setBatchStudentsAttendance(
                                batchStudentsAttendance?.map((find) => {
                                  if (find?.id === item?.id) {
                                    return {
                                      id: find?.id,
                                      status: 'PRESENT',
                                      timesheetId: find?.timesheetId,
                                    };
                                    // eslint-disable-next-line no-else-return
                                  } else {
                                    return { ...find };
                                  }
                                }),
                              );
                            }}
                          >
                            Absent
                          </button>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Click to Absent">
                          <button
                            className="text-white font-medium bg-green-500 rounded-md shadow-md outline-hidden select-none"
                            style={{ padding: '0.25rem 1.15rem' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setBatchStudentsAttendance(
                                batchStudentsAttendance?.find((finded) => finded?.id === item?.id)
                                  ?.id !== undefined
                                  ? batchStudentsAttendance?.map((find) => {
                                      if (find?.id === item?.id) {
                                        return {
                                          id: find?.id,
                                          status: 'ABSENT',
                                          timesheetId: find?.timesheetId,
                                        };
                                        // eslint-disable-next-line no-else-return
                                      } else {
                                        return { ...find };
                                      }
                                    })
                                  : [
                                      {
                                        id: item?.id,
                                        status: 'ABSENT',
                                        timesheetId: item?.timesheetId,
                                      },
                                      ...batchStudentsAttendance,
                                    ],
                              );
                            }}
                          >
                            Present
                          </button>
                        </Tooltip>
                      )}
                    </div>
                  </div>
                  <div className="mt-1 border-t mx-2">
                    <div className="m-0 pt-2 flex justify-evenly">
                      <Tag
                        color="red"
                        style={{ display: 'flex', alignItems: 'center', padding: '0.05rem 0.7rem' }}
                      >
                        <MoneyBag color="red" />
                        <p className="m-0">
                          Pending: <span>{item?.amountPending}</span>
                        </p>
                      </Tag>
                      <Tag
                        color="green"
                        style={{ display: 'flex', alignItems: 'center', padding: '0.05rem 0.7rem' }}
                      >
                        <CourseBookIcon color="green" />
                        <p className="m-0 pl-1">
                          <span>{item?.courseStatus}</span>
                        </p>
                      </Tag>
                      <Tag
                        color="orange"
                        style={{ display: 'flex', alignItems: 'center', padding: '0.05rem 0.7rem' }}
                      >
                        <StudentWithBag fill="orange" width="22" height="22" />
                        <p className="m-0 pl-1">Demo</p>
                      </Tag>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CheckValidation>
        </Spin>
      </Modal>
      <Modal
        title={<h1 className="text-blue-700 font-bold py-2">Mark student attendance</h1>}
        centered
        closable={false}
        footer={false}
        visible={studentAttendanceModel}
        maskClosable={true}
        onCancel={() => setStudentAttendanceModel(false)}
      >
        <div className="" style={{ maxHeight: '20rem' }}>
          <div className=" mb-4 py-2" key={singleStudentAttendance?.id}>
            <div className="flex justify-between border-b pb-2">
              <div className="flex">
                <Avatar className="uppercase text-gray-900 font-medium" size={30}>
                  <p className="text-gray-900 text-xs pt-2">
                    {singleStudentAttendance?.displayName &&
                      getInitials(singleStudentAttendance?.displayName)}
                  </p>
                </Avatar>
                <h1 className="text-gray-900 font-medium mt-1 ml-2">
                  {singleStudentAttendance?.displayName}
                </h1>
              </div>
              <button className="text-white font-medium bg-green-500 px-4 py-1 rounded-md shadow-md">
                Present
              </button>
            </div>
            <div className="flex mt-2">
              <h1 className="text-gray-900 font-medium">Batch:</h1>
              <p className="text-gray-500 font-medium ml-2">
                {singleStudentAttendance?.batch?.name}
              </p>
            </div>
            <div className="flex ">
              <h1 className="text-gray-900 font-medium">Course:</h1>
              <p className="text-gray-500 font-medium ml-2">
                {singleStudentAttendance?.product?.name}
              </p>
            </div>
            <div className="flex ">
              <h1 className="text-gray-900 font-medium">Modules:</h1>
              <p className="text-gray-500 font-medium ml-2">
                {singleStudentAttendance?.product?.modules?.map((item, index) => (
                  <span
                    key={item?.id}
                    className={`${
                      index === 0
                        ? `border-l-4 pl-2 ml-2 border-r-4 pr-2 mr-2 border-yellow-500`
                        : `border-r-4 pr-2 mr-2 border-yellow-500`
                    }`}
                  >
                    {item?.name}
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default connect(({ staff, loading }) => ({
  loading: loading.effects['staff/getStaffBatches'],
  getStaffBatches: staff?.getStaffBatches,
  getStaffBatchesStudents: staff?.getStaffBatchesStudents,
  loadingStudent: loading.effects['staff/getStudentsList'],
  loadingStaffBatchesStudents: loading.effects['staff/getStaffBatchesStudents'],
  updateStaffBatcheAttendance: loading.effects['staff/updateBatchStudentsAttendance'],
  submitStaffBatchAttendance: loading.effects['staff/updateBatchStudentsAttendance'],
  getStudentsList: staff?.getStudentsList,
}))(StudentAttendance);
