/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  Avatar,
  Button,
  Dropdown,
  Select,
  Tabs,
  Menu,
  Checkbox,
  message,
  Form,
  DatePicker,
  Spin,
  Tooltip,
  Divider,
} from 'antd';
import moment from 'moment';
import { FileTextOutlined, MoreOutlined, UserOutlined } from '@ant-design/icons';
import { connect, useParams, history } from 'umi';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import AppIcons from '@/utils/AppIcons';
import ModalToAddNotes from './ModalToAddNotes';
import CheckValidation from '@/components/CheckValidation';
import EmptyState from '@/components/EmptyState';
import emptyStateSvg from '@/assets/icons/space-empty.svg';

dayjs.extend(relativeTime);

const Notes = ({ dispatch, noteDetails, editLead, loadingNotes }) => {
  const [form] = Form.useForm();
  const { studentId, tabname, tabs } = useParams();
  const { Option } = Select;
  const [tab, setTab] = useState(tabs);
  const { TabPane } = Tabs;
  const [selectedDate, setSelectedDate] = useState('');
  const [range, setRange] = useState([moment().subtract(7, 'day'), moment()]);
  const { RangePicker } = DatePicker;
  const [multipleNotesSelection, setMultipleNotesSelection] = useState([]);
  const [, setDropdownVisible] = useState(false);
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
  const renderSideColor = (item) => {
    if (item?.statusId === 'unread') {
      return 'bg-yellow-500';
    }
    return 'bg-green-500';
  };

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
      pathParams: { studentId },
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
      },
    };
    dispatch({
      type: 'student/getNotesList',
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
      type: 'student/getNotesList',
      payload,
    });
  };

  useEffect(() => {
    getNotesRecord();
    getStudentStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, tab]);

  const DeleteNote = (id) => {
    const payload = {
      pathParams: { studentId, notesId: id },
    };
    dispatch({
      type: 'student/deleteNotes',
      payload,
    }).then((res) => {
      if (res?.status === 'ok') {
        message.success('Note deleted successfully');
        getNotesRecord();
        getStudentStats();
      } else {
        message.error('Something went wrong');
      }
    });
  };

  const AddNote = (id) => {
    dispatch({
      type: 'leads/setStates',
      payload: {
        visible: true,
        type: 'ADD_NOTE',
        title: 'Add note',
        subTitle: 'Add note',
        leadId: studentId,
        noteId: id,
        rec: null,
        purposeFor: 'studentsProfile',
      },
      key: 'editLead',
    });
  };

  const getParticularNote = (id) => {
    const payload = {
      pathParams: { studentId, notesId: id },
    };
    dispatch({
      type: 'student/getParticularNote',
      payload,
    }).then((res) => {
      if (res?.status === 'ok') {
        AddNote(id);
        form.setFieldsValue({ ...res });
      } else {
        message.error('Something went wrong');
      }
    });
  };

  const markNoteRead = (id) => {
    const payload = {
      pathParams: { studentId, notesId: id },
    };
    dispatch({
      type: 'student/markNoteRead',
      payload,
    }).then((res) => {
      if (res?.status === 'ok') {
        message.success('Note marked as read');
        getNotesRecord();
      } else {
        message.error('Something went wrong');
      }
    });
  };

  const markNoteUnread = (id) => {
    const payload = {
      pathParams: { studentId, notesId: id },
    };
    dispatch({
      type: 'student/markNoteUnread',
      payload,
    }).then((res) => {
      if (res?.status === 'ok') {
        message.success('Note marked as unread');
        getNotesRecord();
      } else {
        message.error('Something went wrong');
      }
    });
  };

  const multipleSelectionActions = (action) => {
    if (action === 'DELETE') {
      dispatch({
        type: 'student/deleteMultipleNotes',
        payload: {
          pathParams: { studentId },
          body: multipleNotesSelection?.map((item) => {
            return {
              id: item?.id,
            };
          }),
        },
      }).then((res) => {
        if (res?.status === 'ok') {
          message.success('Selected notes deleted successfully');
          getNotesRecord();
          getStudentStats();
        } else {
          message.error('Something went wrong');
        }
        form.setFieldsValue({
          actions: undefined,
        });
      });
    } else {
      const payload = {
        pathParams: { studentId },
        query: { status: action },
        body: multipleNotesSelection?.map((item) => {
          return {
            id: item?.id,
          };
        }),
      };
      dispatch({
        type: 'student/multipleActions',
        payload,
      }).then((res) => {
        if (res?.status === 'ok') {
          message.success(
            `Selected Notes marked as ${action === 'UNREAD' ? 'unread' : 'read'} successfully`,
          );
          getNotesRecord();
          getStudentStats();
          setMultipleNotesSelection([]);
          form.resetFields();
        } else {
          message.error('Something went wrong');
        }
        form.setFieldsValue({
          actions: undefined,
        });
      });
    }
  };

  const onFinish = (values) => {
    if (editLead?.noteId) {
      const body = {
        ...values,
        // noteType: 'STUDENT_NOTE',
      };
      dispatch({
        type: 'student/updateStudentNotes',
        payload: { body, pathParams: { studentId, noteId: editLead?.noteId } },
      }).then((res) => {
        if (res?.status === 'ok') {
          message.success('You have updated the note successfully');
          getStudentNotes();
          form.resetFields();
          dispatch({
            type: 'leads/setStates',
            payload: {
              visible: false,
              type: null,
              title: null,
              subTitle: null,
              leadId: null,
              noteId: null,
              rec: null,
              purposeFor: null,
            },
            key: 'editLead',
          });
        } else {
          message.error('Something went wrong !!');
        }
      });
    } else {
      const body = {
        ...values,
        // noteType: 'STUDENT_NOTE',
      };
      dispatch({
        type: 'student/addStudentNotes',
        payload: { body, pathParams: { studentId } },
      }).then((res) => {
        if (res?.status === 'ok') {
          message.success('You have added the note successfully');
          getStudentNotes();
          getStudentStats();
          form.resetFields();
          dispatch({
            type: 'leads/setStates',
            payload: {
              visible: false,
              type: null,
              title: null,
              subTitle: null,
              leadId: null,
              noteId: null,
              rec: null,
              purposeFor: null,
            },
            key: 'editLead',
          });
        } else {
          message.error('Something went wrong !!');
        }
      });
    }
  };
  return (
    <Form onFinish={onFinish} hideRequiredMark autoComplete="off" form={form}>
      <div className="w-full">
        <div className="flex justify-between items-center h-10">
          <div className="text-blue-600 font-semibold text-lg">Notes</div>
          <div className="items-center flex space-x-4">
            <div>
              <Form.Item name="actions">
                <Select
                  placeholder="Actions"
                  style={{ width: '8rem', color: '#3B82F6', marginTop: '24px' }}
                  onChange={(value) => multipleSelectionActions(value)}
                >
                  <Option value="DELETE">Delete</Option>
                  {<Option value="READ">Mark as Read</Option>}
                  <Option value="UNREAD">Mark as Unread</Option>
                </Select>
              </Form.Item>
            </div>

            <div>
              <Select
                style={{ width: '12rem', color: '#3B82F6' }}
                placeholder="select..."
                onChange={(value) => {
                  setSelectedDate(value);
                  setRange([moment().subtract(7, 'day'), moment()]);
                }}
              >
                {activityTimeList?.map((item) => (
                  <Option
                    key={item?.id}
                    value={item?.label}
                    className="bg-gray-100 rounded-lg mx-2 mt-2"
                    style={{ color: '#3B82F6' }}
                  >
                    {item?.label}
                  </Option>
                ))}
              </Select>
            </div>
            <div>
              {selectedDate === 'Custom' && (
                <RangePicker
                  value={range}
                  format="DD MMM, YYYY"
                  onChange={(val) => {
                    setRange(val);
                  }}
                  placeholder={['Search by', 'date']}
                  style={{ width: '12rem' }}
                  disabledDate={(date) => date > moment().add(1, 'day')}
                />
              )}
            </div>
            <div>
              <Button type="primary" size="middle" onClick={() => AddNote()}>
                Add Notes
              </Button>
            </div>
          </div>
        </div>
        <Divider style={{ marginTop: '0.6rem' }} />
        <div className=" -mt-5">
          <Tabs
            defaultActiveKey="allNotes"
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
                style={{
                  marginBottom: '2.5rem',
                  height: '36rem',
                  overflow: 'auto',
                  padding: '11px',
                }}
              >
                <Spin spinning={Boolean(studentId) && loadingNotes}>
                  <CheckValidation
                    show={noteDetails?.records?.length > 0}
                    fallback={
                      <EmptyState
                        emptyState={emptyStateSvg}
                        emptyHeaderText={<span>No notes found yet!</span>}
                      />
                    }
                  />
                  {noteDetails?.records?.map((item, index) => (
                    <div
                      className={`${
                        item?.statusId === 'unread' && 'bg-blue-50 '
                      } flex mb-4 h-full shadow-md`}
                      key={item?.id}
                    >
                      <div className={`${renderSideColor(item)} w-2 rounded-l-lg`} />
                      <div className="border w-full rounded-r-lg pb-2">
                        <div className="flex justify-between  px-4 py-2 leading-3 ">
                          <div className="flex">
                            <div className="">
                              <Form.Item name="checkBoxs">
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
                                              (val) => val?.id !== item?.id,
                                            )
                                          : [],
                                      );
                                    }
                                  }}
                                />
                              </Form.Item>
                            </div>
                            <div className="flex ml-4 ">
                              <div className="flex justify-center items-center leading-3 h-9 w-9 bg-gray-300 rounded-full ">
                                <FileTextOutlined style={{ color: '#3B82F6' }} />
                              </div>

                              <div className="ml-4 ">
                                <div className="flex  font-bold text-red-500 items-center ">
                                  <div className="font-medium text-lg  ">{item?.priority}</div>
                                </div>
                                <div className=" mt-1 text-md text-green-500 ">
                                  {dayjs(item?.createdAt).format('MM-DD-YYYY ')}
                                  <span className="border-l pl-2 ml-2">
                                    {dayjs(item?.createdAt).format('h:mm A')}
                                  </span>
                                </div>
                                <div className="flex flex-row text-gray-700 text-base font-semibold mt-5">
                                  {item?.noteInfo}
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
                                      <Menu.Item onClick={() => getParticularNote(item?.id)}>
                                        Edit
                                      </Menu.Item>
                                      <Menu.Item onClick={() => DeleteNote(item?.id)}>
                                        Delete
                                      </Menu.Item>
                                      {item?.statusId === 'unread' && (
                                        <Menu.Item onClick={() => markNoteRead(item?.id)}>
                                          Mark as read
                                        </Menu.Item>
                                      )}
                                      {item?.statusId === 'read' && (
                                        <Menu.Item onClick={() => markNoteUnread(item?.id)}>
                                          Mark as Unread
                                        </Menu.Item>
                                      )}
                                    </Menu>
                                  }
                                >
                                  <MoreOutlined
                                    onClick={() => setDropdownVisible(true)}
                                    className="text-lg cursor-pointer hover:text-yellow-600 "
                                  />
                                </Dropdown>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center -mt-2  mx-6 justify-end ">
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
                                </span>
                                <span className="ml-2">{item?.createdByInfo?.displayName}</span>
                              </div>
                            </div>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  ))}
                </Spin>
              </TabPane>
            ))}
          </Tabs>
        </div>
      </div>
      <ModalToAddNotes form={form} />
    </Form>
  );
};

export default connect(({ student, leads, loading }) => ({
  noteDetails: student?.studentNotesList,
  editLead: leads?.editLead,
  loadingNotes: loading.effects['student/getNotesList'],
}))(Notes);
