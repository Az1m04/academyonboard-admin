import React, { useState, useEffect } from 'react';
import {
  Avatar,
  Button,
  Checkbox,
  Divider,
  Dropdown,
  // Input,
  Tooltip,
  Tabs,
  Menu,
  Form,
  Spin,
  Select,
  message,
} from 'antd';
import NotesModal from './NotesModal';
import RemarksModal from './RemarksModal';
import { connect, useParams, history } from 'umi';
import { FileTextOutlined, MoreOutlined, UserOutlined } from '@ant-design/icons';
import CheckValidation from '@/components/CheckValidation';
import EmptyState from '@/components/EmptyState';
import emptyStateSvg from '@/assets/icons/space-empty.svg';
import dayjs from 'dayjs';
// import relativeTime from 'dayjs/plugin/relativeTime';
import AppIcons from '@/utils/AppIcons';
// import NoteModal from '@/components/GenerateNote';
import moment from 'moment';
import StaffRemarks from './StaffRemarks';

const NotesAndRemarks = ({
  dispatch,
  getStudentsList,
  getStaffAllNotes,
  loadingForGetAllNotes,
  getStaffAllRemark,
  loadingForGetRemarks,
}) => {
  // const { Search } = Input;
  const [addNotesModal, setAddNotesModal] = useState(false);
  const [remarksModal, setRemarksModal] = useState(false);
  const [isModalForEdit, setIsModalForEdit] = useState(false);
  const [multipleNotesSelection, setMultipleNotesSelection] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [range, setRange] = useState([moment().subtract(7, 'day'), moment()]);
  const [tab, setTab] = useState('allNotes');
  const [remarkTab, setRemarkTab] = useState('all');
  const { staffId } = useParams();
  const { TabPane } = Tabs;
  const [noteForm] = Form.useForm();
  const [remarkForm] = Form.useForm();
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

  const getStaffNotes = () => {
    const data = {};
    switch (tab) {
      case 'branch':
        data.noteType = 'BRANCH';
        history.push('?note-Type=branch');
        break;
      case 'student':
        data.noteType = 'STUDENT';
        history.push('?note-Type=student');
        break;
      case 'unread':
        data.status = 'unread';
        history.push('?status=unread');
        break;
      default:
        data.noteType = 'ALL';
        history.push('?status=allNotes');
        break;
    }

    const payload = {
      pathParams: { staffId },
      query: {
        ...data,
        startDay:
          selectedDate === 'Custom' && range !== null
            ? range[0].format('YYYY-MM-DD HH:mm:ss')
            : activityTimeList?.filter((p) => p?.label === selectedDate)[0]?.startDate,
        endDay:
          selectedDate === 'Custom' && range !== null
            ? range[1].format('YYYY-MM-DD HH:mm:ss')
            : activityTimeList?.filter((p) => p?.label === selectedDate)[0]?.endDate,
        viewSize: 1000,
        noteType: 'STUDENT',
        partyRole: 'EMPLOYEE',
      },
    };
    dispatch({
      type: 'staff/getStaffAllNotes',
      payload,
    });
  };
  const getAllRemarks = () => {
    dispatch({
      type: 'staff/getStaffAllRemark',
      payload: {
        pathParams: {
          staffId,
        },
        query: { noteType: 'TEACHER', partyRole: 'EMPLOYEE' },
      },
    });
  };
  const DeleteStaffNote = (val) => {
    dispatch({
      type: 'staff/deleteStaffNotes',
      payload: {
        pathParams: {
          staffId,
          noteId: val,
        },
      },
    }).then(() => {
      getStaffNotes();
    });
  };
  const markReadNotes = (val) => {
    dispatch({
      type: 'staff/markReadStaffNote',
      payload: {
        pathParams: {
          staffId,
          noteId: val,
        },
      },
    }).then((res) => {
      if (res?.message === 'Note status updated successfully.') {
        getStaffNotes();
        message.success(res?.message);
      } else {
        message.error('Something went worng');
      }
    });
  };
  useEffect(() => {
    dispatch({
      type: 'staff/getStudentsList',
      payload: {
        pathParams: {
          staffId,
        },
      },
    });
    getStaffNotes();
    getAllRemarks();
  }, [dispatch, selectedDate, range, tab]);

  const getSingleNoteData = (value) => {
    setIsModalForEdit(true);
    dispatch({
      type: 'staff/getSingleStaffNotes',
      payload: {
        pathParams: {
          staffId,
        },
        query: { noteId: value, partyRole: 'EMPLOYEE' },
      },
    }).then((res) => {
      setAddNotesModal(true);
      noteForm.setFieldsValue({
        priority: res?.records?.map((ite) => ite?.priority).toString(),
        noteInfo: res?.records?.map((items) => items?.noteInfo).toString(),
        students: res?.records[0]?.students?.map((item) => item?.id),
      });
    });
  };
  const getSingleRemark = (val) => {
    setIsModalForEdit(true);
    dispatch({
      type: 'staff/getSingleStaffNotes',
      payload: {
        pathParams: {
          staffId,
        },
        query: { noteId: val, partyRole: 'EMPLOYEE' },
      },
    }).then((res) => {
      setRemarksModal(true);
      remarkForm.setFieldsValue({
        priority: res?.records?.map((ite) => ite?.priority).toString(),
        noteInfo: res?.records?.map((items) => items?.noteInfo).toString(),
        student: res?.records[0]?.students?.map((item) => item?.id).toString(),
        id: res?.records[0]?.module?.name,
        course: res?.records[0]?.product?.name,
        title: res?.records[0]?.title,
      });
    });
  };
  const tabsPane = [
    {
      tab: <span className="font-semibold">All notes</span>,
      key: 'allNotes',
    },
    {
      tab: <span className="font-semibold">Branch name</span>,
      key: 'branch',
    },
    {
      tab: <span className="font-semibold">Student</span>,
      key: 'student',
    },
    {
      tab: <span className="font-semibold">Unread</span>,
      key: 'unread',
    },
  ];
  const mainTabs = [
    {
      tab: <span className="font-semibold">Notes</span>,
      key: 'notes',
    },
    {
      tab: <span className="font-semibold">Remarks</span>,
      key: 'remarks',
    },
  ];

  const renderSideColor = (item) => {
    if (item?.statusId === 'unread') {
      return 'bg-yellow-500';
    }
    return 'bg-green-500';
  };
  const multipleSelectionActions = () => {};

  return (
    <div>
      <h1 className="text-blue-700 text-xl font-medium  mt-4">Notes & Remarks</h1>
      <div className="flex justify-end mr-10">
        {/* <Search
          style={{ width: '30rem', boxShadow: '0 2px 4px -1px rgb(0 0 0 / 0.1)' }}
          size="middle"
          placeholder="Enter keyword to search"
          enterButton
        /> */}

        <div className="space-x-2 flex">
          {multipleNotesSelection?.length > 0 && (
            <Select
              placeholder="Actions"
              style={{ width: '8rem', color: '#3B82F6' }}
              allowClear
              onChange={(value) => multipleSelectionActions(value)}
            >
              <Select.Option value="DELETE">Delete</Select.Option>
              {<Select.Option value="READ">Mark as Read</Select.Option>}
              <Select.Option value="UNREAD">Mark as Unread</Select.Option>
            </Select>
          )}
          <div>
            <Select
              style={{ width: '12rem', color: '#3B82F6' }}
              placeholder="select..."
              allowClear
              onChange={(value) => {
                setSelectedDate(value);
                setRange([moment().subtract(7, 'day'), moment()]);
              }}
            >
              {activityTimeList?.map((item) => (
                <Select.Option
                  key={item?.id}
                  value={item?.label}
                  className="bg-gray-100 rounded-lg mx-2 mt-2"
                  style={{ color: '#3B82F6' }}
                >
                  {item?.label}
                </Select.Option>
              ))}
            </Select>
          </div>
          <Tooltip title="">
            <Button size="middle" type="primary" onClick={() => setAddNotesModal(true)}>
              Add Note
            </Button>
          </Tooltip>
          <Tooltip title="">
            <Button size="middle" type="primary" onClick={() => setRemarksModal(true)}>
              Add Remarks
            </Button>
          </Tooltip>
        </div>
      </div>
      <div className="mr-10">
        <Divider />
      </div>
      <div>
        <div className=" -mt-5">
          <Tabs defaultActiveKey="notes">
            {mainTabs?.map((val) => (
              <TabPane tab={val?.tab} key={val?.key}>
                {val?.key === 'notes' ? (
                  <Tabs
                    defaultActiveKey="allNotes"
                    activeKey={tab}
                    onChange={(value) => {
                      setTab(value);
                      // history.push(`/students/${studentId}/${tabname}/${val}`);
                    }}
                    className="font-semibold text-blue-500"
                  >
                    {tabsPane?.map((value) => (
                      <TabPane
                        tab={value?.tab}
                        key={value?.key}
                        style={{ height: '32rem', overflow: 'auto', padding: '11px' }}
                      >
                        <Spin spinning={Boolean(loadingForGetAllNotes)}>
                          <CheckValidation
                            show={getStaffAllNotes?.records?.length > 0}
                            fallback={
                              <EmptyState
                                emptyState={emptyStateSvg}
                                emptyHeaderText={<span>No notes found yet!</span>}
                              />
                            }
                          />
                          <div>
                            {getStaffAllNotes?.records?.map((item) => (
                              <div
                                className={`${item?.statusId === 'unread' && 'bg-blue-50 '}
                            flex mb-4 h-full shadow-md`}
                                key={item?.id}
                              >
                                <div
                                  className={`${renderSideColor(item)}
                                    w-2 rounded-l-lg `}
                                />
                                <div className="border w-full rounded-r-lg pb-2">
                                  <div className="flex justify-between  px-4 py-2 leading-3 ">
                                    <div className="flex">
                                      <div className="">
                                        <Checkbox
                                          onClick={(e) => {
                                            if (e.target.checked) {
                                              setMultipleNotesSelection((prev) => [
                                                ...prev,
                                                { id: item?.id },
                                              ]);
                                            } else {
                                              setMultipleNotesSelection(
                                                multipleNotesSelection?.length > 0
                                                  ? multipleNotesSelection?.filter(
                                                      (filterVal) => filterVal?.id !== item?.id,
                                                    )
                                                  : [],
                                              );
                                            }
                                          }}
                                        />
                                      </div>
                                      <div className="flex ml-4 mt-4">
                                        <div className="flex justify-center items-center leading-3 h-9 w-9 bg-gray-300 rounded-full ">
                                          <FileTextOutlined style={{ color: '#3B82F6' }} />
                                        </div>

                                        <div className="ml-4 ">
                                          <div
                                            className={`flex  font-bold text-red-500 items-center ${
                                              (item?.priority === 'Low' && 'text-green-500 ') ||
                                              (item?.priority === 'Medium' && 'text-yellow-500 ') ||
                                              (item?.priority === 'Very high' && 'text-red-700 ')
                                            }`}
                                          >
                                            <div className="font-medium font-base mb-1  ">
                                              {item?.priority} Priority
                                            </div>
                                          </div>
                                          <div className=" mt-1 text-md text-green-500 ">
                                            {dayjs(item?.createdAt).format('MM-DD-YYYY ')}{' '}
                                            <span className="border-l pl-2 ml-2">
                                              {' '}
                                              {dayjs(item?.createdAt).format('h:mm A')}{' '}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div>
                                      <div className="text-gray-500 text-base items-center leading-3  flex ">
                                        <div className=" mr-2  ">
                                          {item?.statusId === 'unread' ? (
                                            <AppIcons.EnvelopeAction />
                                          ) : (
                                            <AppIcons.EnvelopeOpen />
                                          )}
                                        </div>

                                        <div className="">
                                          <Dropdown
                                            getPopupContainer={(node) => node.parentNode}
                                            placement="bottomLeft"
                                            arrow
                                            overlay={
                                              <Menu className="not-italic">
                                                <Menu.Item
                                                  onClick={() => getSingleNoteData(item?.id)}
                                                >
                                                  Edit
                                                </Menu.Item>
                                                <Menu.Item
                                                  onClick={() => DeleteStaffNote(item?.id)}
                                                >
                                                  Delete
                                                </Menu.Item>
                                                {/* {item?.statusId === 'unread' && ( */}
                                                <Menu.Item onClick={() => markReadNotes(item?.id)}>
                                                  Mark as read
                                                </Menu.Item>
                                                {/* )} */}
                                                {/* {item?.statusId === 'read' && ( */}
                                                <Menu.Item
                                                // onClick={() => markNoteUnread(item?.id)}
                                                >
                                                  Mark as Unread
                                                </Menu.Item>
                                                {/* )} */}
                                              </Menu>
                                            }
                                          >
                                            <MoreOutlined
                                              // onClick={() => setDropdownVisible(true)}
                                              className="text-lg cursor-pointer hover:text-yellow-600 "
                                            />
                                          </Dropdown>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="ml-12 mr-8">
                                    <div
                                      className={`flex flex-row text-gray-700 text-sm w-full font-semibold mt-2 bg-yellow-100  p-4 `}
                                    >
                                      {item?.noteInfo}
                                    </div>
                                  </div>
                                  <div className="flex items-center mt-4  mx-14 ">
                                    <Tooltip title="Language teacher | Teaching | BO-Kapurthala">
                                      <div className="flex  items-center">
                                        <div className="flex justify-center items-center ">
                                          <Avatar
                                            size="small"
                                            style={{ backgroundColor: '#3162A5' }}
                                            icon={
                                              <div className="-mt-1">
                                                <UserOutlined />
                                              </div>
                                            }
                                          />
                                        </div>
                                        <div className=" text-gray-500">
                                          <span className="text-yellow-500 font-semibold ml-2 text-base">
                                            Created by :
                                          </span>{' '}
                                          <span className="ml-2">
                                            {item?.createdByInfo?.displayName}
                                          </span>
                                        </div>
                                      </div>
                                    </Tooltip>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </Spin>
                      </TabPane>
                    ))}
                  </Tabs>
                ) : (
                  <div>
                    <StaffRemarks
                      setRemarkTab={setRemarkTab}
                      remarkTab={remarkTab}
                      loadingForGetRemarks={loadingForGetRemarks}
                      getStaffAllRemark={getStaffAllRemark}
                      getSingleRemark={getSingleRemark}
                      tab={tab}
                      staffId={staffId}
                      getAllRemarks={getAllRemarks}
                    />
                  </div>
                )}
              </TabPane>
            ))}
          </Tabs>
        </div>
      </div>
      <NotesModal
        setAddNotesModal={setAddNotesModal}
        addNotesModal={addNotesModal}
        getStudentsList={getStudentsList}
        staffId={staffId}
        noteForm={noteForm}
        setIsModalForEdit={setIsModalForEdit}
        isModalForEdit={isModalForEdit}
        getStaffNotes={getStaffNotes}
      />
      <RemarksModal
        setRemarksModal={setRemarksModal}
        remarksModal={remarksModal}
        getStudentsList={getStudentsList}
        staffId={staffId}
        getAllRemarks={getAllRemarks}
        remarkForm={remarkForm}
        isModalForEdit={isModalForEdit}
        setIsModalForEdit={setIsModalForEdit}
      />
    </div>
  );
};

export default connect(({ staff, loading }) => ({
  getStudentsList: staff?.getStudentsList,
  loadingForGetStudent: loading.effects['staff/getStudentsList'],
  loadingForGetAllNotes: loading?.effects['staff/getStaffAllNotes'],
  loadingForGetRemarks: loading?.effects['staff/getStaffAllRemark'],
  getStaffAllNotes: staff?.getStaffAllNotes,
  getStaffAllRemark: staff?.getStaffAllRemark,
}))(NotesAndRemarks);
