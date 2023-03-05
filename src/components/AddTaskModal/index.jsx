/* eslint-disable consistent-return */
import React, { useEffect, useState } from 'react';
import {
  Form,
  Button,
  Modal,
  Input,
  Tooltip,
  Avatar,
  message,
  Row,
  Select,
  Col,
  Checkbox,
  Radio,
  Popover,
  Upload,
  DatePicker,
  Spin,
} from 'antd';
import { connect, history } from 'umi';
import { CalendarX } from '@/utils/AppIcons';
import moment from 'moment';
import {
  isMomentToday,
  isMomentThisWeek,
  dayNameShort,
  dayNameAndDateShort,
} from '@/utils/dateTime/dateTimeUtils';
import { Plus } from '@/utils/AppIcons';
import BadgeAvatar from '@/components/BadgeAvatar';
import AvatarHoverView from '@/components/AvatarHoverView';
import AvatarHoverViewRest from '@/components/AvatarHoverViewRest';
import styles from './index.less';
import PeoplePicker from '@/components/People/PeoplePicker';
import { getInitials, getSingularPlural } from '@/utils/common';
import { uniq } from 'lodash';
import { UsergroupAddOutlined, FileAddOutlined, DeleteOutlined } from '@ant-design/icons';
import CustomRecurrenceModal from './CustomRecurrenceModal';

const { Dragger } = Upload;
const { TextArea } = Input;
const renderTaskPeopleAvatars = (peopleList, setPeopleList) => (
  <div className={styles.AddNoteFormModal}>
    <div className="flex items-center mr-3 -space-x-2">
      {peopleList &&
        peopleList.slice(0, 5).map((assignee) => (
          <AvatarHoverView profile={assignee} key={assignee.id + Math.random()}>
            <div className="ring-white ring-2 pl-1">
              {/* Badge Avatar with delete button */}
              <BadgeAvatar
                name={assignee.name}
                imgUrl={assignee.photoUrl}
                onDelete={() => {
                  const trimmedTaskAssigneeList = peopleList.filter((l) => l.id !== assignee.id);
                  setPeopleList([...trimmedTaskAssigneeList]);
                }}
                showBadge
              />
            </div>
          </AvatarHoverView>
        ))}

      {peopleList?.length > 5 && (
        <AvatarHoverViewRest
          newFilter
          title={`Assignees (${peopleList.length - 5})`}
          peopleList={peopleList?.slice(5, peopleList.length)}
          onDelete={(id) => {
            const newlist = peopleList.filter((l) => l.id !== id);
            setPeopleList([...newlist]);
          }}
        >
          <Avatar className={styles.PlustextAvatar}>+{peopleList.length - 5}</Avatar>
        </AvatarHoverViewRest>
      )}
    </div>
  </div>
);

const renderTaskDueDate = (dueDate, setDueDate) => {
  let dueDateLabel = '';

  if (dueDate) {
    const due = moment(dueDate);
    const isToday = isMomentToday(due);
    const wasDueThisWeek = isMomentThisWeek(due);
    // check if past due
    if (due.isBefore(moment(), 'day')) {
      // check if task was due this week
      if (wasDueThisWeek) {
        // Show in red color with Mon format
        dueDateLabel = dayNameShort(due.format('Do MMMM YYYY h:mm:ss a'));
        return (
          <Tooltip title={`Was due ${due.fromNow()}`}>
            <div className="text-red-700">{dueDateLabel}</div>
          </Tooltip>
        );
      }
      // past due since more than this week ago, show in Jan 14 format
      dueDateLabel = dayNameAndDateShort(due.format('Do MMMM YYYY h:mm:ss a'));
      return (
        <div className="flex">
          <Tooltip title={`Past due since ${due.fromNow()}`}>
            <div className="text-red-700">{dueDateLabel}</div>
          </Tooltip>
          <Popover content={'Clear date'}>
            <span className="text-red-500 mx-1 cursor-pointer" onClick={() => setDueDate()}>
              <DeleteOutlined />
            </span>
          </Popover>
        </div>
      );
    }
    // Due today, show Today text
    if (isToday) {
      dueDateLabel = `Today, ${moment(due).format('Do MMMM YYYY h:mm:ss a')}`;
      return (
        <div className="flex">
          <Tooltip title={`Due ${due.fromNow()}`}>
            <div className="text-blue-700">{dueDateLabel}</div>
          </Tooltip>
          <Popover content={'Clear date'}>
            <span className="text-red-500 mx-1 cursor-pointer" onClick={() => setDueDate()}>
              <DeleteOutlined />
            </span>
          </Popover>
        </div>
      );
    }

    // Due in the future, show Feb 12 text
    if (due.isAfter(moment(), 'day')) {
      //   dueDateLabel = monthNameAndDateShort(due);
      dueDateLabel = `${moment(due).format('dddd')}, ${moment(due).format(
        'Do MMMM YYYY h:mm:ss a',
      )}`;
      // if (isMomentInNext7Days(due)) {
      //   dueDateLabel = dayNameShort(due);
      // }
      return (
        <div className="flex">
          <Tooltip title={`Due ${due.fromNow()} on ${due.format('MMM DD')}`}>
            <div className="text-blue-700">{dueDateLabel}</div>
          </Tooltip>
          <Popover content={'Clear date'}>
            <span className="text-red-500 mx-1 cursor-pointer" onClick={() => setDueDate()}>
              <DeleteOutlined />
            </span>
          </Popover>
        </div>
      );
    }

    return (
      <Tooltip title="No due date">
        <div className="opacity-50">No due date</div>
      </Tooltip>
    );
  }
  return '';
};

export const getWeekNumber = () => {
  let weeks = moment().weeks() - moment().startOf('month').weeks() + 1;
  weeks = (weeks + 52) % 52;
  switch (weeks) {
    case 1:
      return 'first ';
    case 2:
      return 'second ';
    case 3:
      return 'third ';
    case 4:
      return 'four ';
    case 5:
      return 'five ';
    default:
      return 'first ';
  }
};
export const TimeDuration = [
  {
    title: `Daily`,
    value: 'DAILY',
  },
  {
    title: `Weekly on ${moment().format('dddd')}`,
    value: 'WEEKLY',
  },
  {
    title: `Monthly on ${getWeekNumber()}${moment().format('dddd').toLowerCase()}`,
    value: 'MONTHLY',
  },
  {
    title: `Yearly on ${moment().format('MMMM Do')}`,
    value: 'YEARLY',
  },
  {
    title: 'Custom...',
    value: 'CUSTOM',
  },
];
export const priority = [
  {
    title: 'Very High',
    value: 'VERY_HIGH',
  },
  {
    title: 'High',
    value: 'HIGH',
  },
  {
    title: 'Low',
    value: 'LOW',
  },
  {
    title: 'Medium',
    value: 'MEDIUM',
  },
];
const AddTaskModal = ({
  visible,
  dispatch,
  currentUser,
  addingTaskLoading,
  branchList,
  departmentList,
  staffList,
  studentsList,
  leadType,
  setLeadType,
  searchStudentBy,
  setSearchStudentBy,
  keyword,
  setKeyword,
  getAllTasksList,
  subListFilter,
  setMode,
  getTasksCounts,
}) => {
  const [form] = Form.useForm();
  const [studentForm] = Form.useForm();
  const [customRecurrenceForm] = Form.useForm();
  const [dueDate, setDueDate] = useState();
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [studentSelectList, setStudentSelectList] = useState([]);
  const [notifyPeople, setNotifyPeople] = useState([]);
  const [addStudentLoading, setAddStudentLoading] = useState(false);
  const [showAddFollowerModal, setShowAddFollowerModal] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [addFollowerLoading, setAddFollowerLoading] = useState(false);
  const [discardChangesModalVisible, setDiscardChangesModalVisible] = useState(false);
  const [isDepartmentInclude, setIsDepartmentInclude] = useState(false);
  const [isStaffInclude, setIsStaffInclude] = useState(false);
  const [disableStudentModalField, setDisableStudentModalField] = useState(false);
  const [contentsForTask, setContentsForTask] = useState([]);
  const [isRecurrenceModalVisible, setIsRecurrenceModalVisible] = useState(false);
  const [repeatCount, setRepeatCount] = useState(1);
  const [repeatOption, setRepeatOption] = useState('WEEKLY');
  const [repeatEnds, setRepeatEnds] = useState('never');
  const [recurrencePayload, setRecurrencePayload] = useState();
  const resetAllState = () => {
    setDueDate('');
    setStudentSelectList([]);
    setFollowers([]);
    setContentsForTask([]);
    setIsDepartmentInclude(false);
    setIsStaffInclude(false);
    form.resetFields();
  };

  const closeModal = () => {
    dispatch({
      type: 'global/setTaskModalVisible',
      payload: {
        value: false,
      },
    });
    setIsDepartmentInclude(false);
    setIsStaffInclude(false);
  };

  // NOTE: @AmitMathur comment out the getTaskCategory Api dispatch for now.
  // const getTaskCategories = () => {
  //   dispatch({
  //     type: 'tasks/getTaskCategoryList',
  //   });
  // };
  // useEffect(() => {
  //   getTaskCategories();
  // }, []);
  const createTask = () => {
    const allValues = form.getFieldsValue();
    const departmentObj = {
      id: allValues?.department,
      members: allValues?.members?.map((item) => {
        return { id: item };
      }),
    };
    const taskPayload = {
      body: {
        students: studentSelectList?.map((stud) => {
          return { id: stud?.id };
        }),
        notifyPeople: uniq(notifyPeople?.map((notify) => notify.id)),
        priorityTypeId: allValues?.priorityTypeId,
        dueDate: dueDate && dueDate?.toISOString(),
        followers: followers?.map((item) => ({ id: item?.id })),
        name: allValues?.title || 'Untitled Task',
        branch: allValues?.branch,
        department: departmentObj,
        sourcePage: searchStudentBy,
        description: allValues?.remark,
        contents: contentsForTask?.map((item) => {
          return { encodedFile: item?.encodedFile, name: item?.name, typeId: item?.typeId };
        }),
        ...recurrencePayload,
      },
    };
    dispatch({
      type: 'tasks/createTask',
      payload: taskPayload,
    })
      .then((res) => {
        if (res?.id) {
          let taskSuccessMessage = `Task #${res?.id} created successfully!`;

          if (notifyPeople.length) {
            // people will be notified, let the user know about how many.
            taskSuccessMessage = taskSuccessMessage.concat(
              ` ${notifyPeople.length} ${getSingularPlural(
                'person',
                notifyPeople?.length,
              )} will be notified`,
            );
          }
          const subFilter = subListFilter !== 'ALL' ? subListFilter : '';
          getAllTasksList(0, 10, '', res?.recurrence?.repetitionType, subFilter);
          history.push(`/tasks/${res?.recurrence?.repetitionType.toLowerCase()}`);
          setMode(res?.recurrence?.repetitionType);
          message.success(taskSuccessMessage);
          resetAllState();
          closeModal();
          customRecurrenceForm?.resetFields();
          setRepeatOption('WEEKLY');
          setRepeatEnds('never');
          setRecurrencePayload();
          setRepeatCount(1);
          getTasksCounts();
        } else {
          const errorResponse = res?.error?.response?.data;
          message.error(errorResponse?.message || 'Unable to create Task! We are working on it!');
        }
      })
      .catch((err) => console.log({ err }));
  };
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  const getStudents = (leadTypeId, searchBy, keywordSearch) => {
    dispatch({
      type: 'tasks/getStudentsList',
      payload: {
        query: {
          leadTypeId,
          searchBy,
          keyword: keywordSearch,
        },
      },
    });
  };
  useEffect(() => {
    dispatch({
      type: 'tasks/getBranchList',
      payload: {
        query: {
          // status: 'ALL',
          clientId: 'OMG',
          isAccepted: true,
        },
      },
    });
    dispatch({
      type: 'tasks/getDepartmentList',
      payload: {
        query: {
          veiwSize: 1000,
        },
      },
    });
  }, []);
  useEffect(() => {
    getStudents(leadType, searchStudentBy, keyword);
  }, [leadType, searchStudentBy, keyword]);
  const onSearch = (val) => {
    setKeyword(val);
  };
  useEffect(() => {
    const addedStudent = studentSelectList?.map((items) => {
      return { value: items?.id, key: items?.id, label: items?.name };
    });
    if (studentSelectList?.length === 0) {
      setDisableStudentModalField(false);
    }
    studentForm?.setFieldsValue({
      students: addedStudent,
    });
  }, [studentSelectList, studentForm]);
  const createRecurrencePayload = (value) => {
    let weeks = moment().weeks() - moment().startOf('month').weeks() + 1;
    weeks = (weeks + 52) % 52;
    switch (value) {
      case 'DAILY':
        return setRecurrencePayload({
          isRecurrence: true,
          recurrence: {
            recurrenceType: value,
            repetitionType: value,
            repetitionFrequency: 1,
            startDate: moment().toISOString(),
            isEnds: false,
          },
        });
      case 'WEEKLY':
        return setRecurrencePayload({
          isRecurrence: true,
          recurrence: {
            recurrenceType: value,
            repetitionType: value,
            repetitionOn: [moment().format('ddd').toUpperCase()],
            repetitionFrequency: 1,
            startDate: moment().toISOString(),
            isEnds: false,
          },
        });
      case 'MONTHLY':
        return setRecurrencePayload({
          isRecurrence: true,
          recurrence: {
            recurrenceType: value,
            repetitionType: value,
            repetitionOn: [moment().format('ddd').toUpperCase()],
            repetitionFrequency: 1,
            repetitionOnType: 'DAY',
            repeatByDay: weeks,
            startDate: moment().toISOString(),
            isEnds: false,
          },
        });
      case 'YEARLY':
        return setRecurrencePayload({
          isRecurrence: true,
          recurrence: {
            startDate: '2022-02-11T04:40:52.040Z',
            recurrenceType: 'YEARLY',
            isEnds: false,
            repetitionFrequency: 1,
            repetitionType: 'YEARLY',
            repetitionOnType: 'DATE',
          },
        });
      default:
        break;
    }
  };
  return (
    <Modal
      centered
      wrapClassName="app-modal-flat"
      destroyOnClose
      width={700}
      keyboard={false}
      maskClosable={false}
      title={
        <span className="flex items-center">
          <span className="text-blue-700">
            <FileAddOutlined className="text-4xl mr-2 " />
          </span>

          <div className="flex flex-col">
            <span className="font-semibold text-blue-700">Create a new task</span>

            <span className="font-normal text-blue-700 text-sm">Assign task</span>
          </div>
        </span>
      }
      visible={visible}
      onCancel={() => {
        closeModal();
        resetAllState();
        form.resetFields();
      }}
      footer={
        <div>
          <Button
            loading={addingTaskLoading}
            className="pr-4"
            key="back"
            onClick={() => setDiscardChangesModalVisible(true)}
          >
            Reset
          </Button>
          <Button
            key="submit"
            type="primary"
            loading={addingTaskLoading}
            onClick={() => form?.submit()}
          >
            {addingTaskLoading ? 'Creating...' : 'Create'}
          </Button>
        </div>
      }
    >
      <Spin spinning={Boolean(addingTaskLoading)}>
        <Modal
          title="Are you sure you want to continue?"
          visible={discardChangesModalVisible}
          destroyOnClose
          onCancel={() => setDiscardChangesModalVisible(false)}
          onOk={() => {
            setDiscardChangesModalVisible(false);
            resetAllState();
            form.resetFields();
          }}
        >
          All of your changes will be lost
        </Modal>
        <Form form={form} requiredMark={false} onFinish={createTask}>
          <CustomRecurrenceModal
            setIsRecurrenceModalVisible={setIsRecurrenceModalVisible}
            isRecurrenceModalVisible={isRecurrenceModalVisible}
            createTaskForm={form}
            customRecurrenceForm={customRecurrenceForm}
            repeatCount={repeatCount}
            setRepeatCount={setRepeatCount}
            repeatOption={repeatOption}
            setRepeatOption={setRepeatOption}
            repeatEnds={repeatEnds}
            setRepeatEnds={setRepeatEnds}
            getWeekNumber={getWeekNumber}
            setRecurrencePayload={setRecurrencePayload}
            recurrencePayload={recurrencePayload}
          />
          <div className="flex">
            <Form.Item name="isDepartmentInclude">
              <Checkbox
                checked={isDepartmentInclude}
                style={{ display: 'flex' }}
                onChange={(e) => {
                  setIsDepartmentInclude(e.target.checked);
                  if (!e.target.checked) {
                    setIsStaffInclude(false);
                    form.setFieldsValue({
                      members: undefined,
                      department: undefined,
                    });
                  }
                }}
              >
                <p className="pl-2">Add department</p>
              </Checkbox>
            </Form.Item>
            {isDepartmentInclude === true ? (
              <Form.Item name="isStaffInclude">
                <Checkbox
                  style={{ display: 'flex' }}
                  checked={isStaffInclude}
                  onChange={(e) => {
                    setIsStaffInclude(e.target.checked);
                    if (!e.target.checked) {
                      form.setFieldsValue({
                        members: undefined,
                      });
                    }
                  }}
                >
                  <p className="pl-2">Add staff</p>
                </Checkbox>
              </Form.Item>
            ) : null}
          </div>
          <div className="">
            <Row gutter={16}>
              <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                <div>
                  <p className="text-sm font-semibold">Select branch</p>
                  <Form.Item
                    name={['branch', 'id']}
                    rules={[{ required: true, message: 'Please select branch!' }]}
                  >
                    <Select
                      size="large"
                      placeholder="Please select branch"
                      className="w-full"
                      getPopupContainer={(node) => node.parentNode}
                    >
                      {branchList?.records?.map((item) => (
                        <Select.Option key={item?.id} value={item?.id}>
                          {item?.clientName}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                {isDepartmentInclude === true ? (
                  <div>
                    <p className="text-sm font-semibold">Select department</p>
                    <Form.Item name="department">
                      <Select
                        size="large"
                        placeholder="select department"
                        getPopupContainer={(node) => node.parentNode}
                        onChange={(e) => {
                          dispatch({
                            type: 'tasks/getStaffList',
                            payload: {
                              pathParams: {
                                departmentId: e,
                              },
                              query: {
                                veiwSize: 1000,
                              },
                            },
                          });
                          form.setFieldsValue({
                            members: undefined,
                          });
                        }}
                      >
                        {departmentList?.records?.map((item) => (
                          <Select.Option value={item?.id} key={item?.id}>
                            {item?.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>
                ) : null}
              </Col>
              {isStaffInclude && isDepartmentInclude ? (
                <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                  <div>
                    <p className="text-sm font-semibold">Select staff</p>
                    <Form.Item name={['members']}>
                      <Select
                        size="large"
                        mode="multiple"
                        placeholder="select staff"
                        getPopupContainer={(node) => node.parentNode}
                        tagRender={(props) => {
                          // eslint-disable-next-line prefer-destructuring
                          const itemStaff = props.label.props.itemStaff;
                          return itemStaff?.photoUrl !== undefined ? (
                            <Popover
                              key={itemStaff?.id}
                              itemStaff={itemStaff}
                              title={itemStaff?.displayName}
                              {...props}
                            >
                              <div>
                                <img
                                  src={itemStaff?.photoUrl}
                                  alt=""
                                  className="rounded-full w-8 h-8"
                                />
                              </div>
                            </Popover>
                          ) : (
                            <Popover
                              key={itemStaff?.id}
                              itemStaff={itemStaff}
                              content={itemStaff?.displayName}
                              {...props}
                            >
                              <Avatar
                                {...props}
                                style={{ cursor: 'pointer' }}
                                className="uppercase text-gray-900 font-medium mx-2"
                                size={30}
                              >
                                <p className="text-gray-900 text-xs pt-2">
                                  {itemStaff?.displayName && getInitials(itemStaff?.displayName)}
                                </p>
                              </Avatar>
                            </Popover>
                          );
                        }}
                      >
                        {staffList?.members?.map((itemStaff) => (
                          <Select.Option key={itemStaff?.id} value={itemStaff?.partyId}>
                            <div
                              key={itemStaff?.id}
                              itemStaff={itemStaff}
                              title={itemStaff?.displayName}
                            >
                              <div className="flex gap-2 px-2 cursor-pointer  w-max">
                                {itemStaff?.photoUrl !== undefined ? (
                                  <div>
                                    <img
                                      src={itemStaff?.photoUrl}
                                      alt=""
                                      className="rounded-full w-8 h-8"
                                    />
                                  </div>
                                ) : (
                                  <Avatar className="uppercase text-gray-900 font-medium" size={30}>
                                    <p className="text-gray-900 text-xs pt-2">
                                      {itemStaff?.displayName &&
                                        getInitials(itemStaff?.displayName)}
                                    </p>
                                  </Avatar>
                                )}

                                <p className="text-gray-900 font-medium capitalize mt-1.5 text-xs">
                                  {itemStaff?.displayName}
                                </p>
                              </div>
                            </div>
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>
                </Col>
              ) : null}
            </Row>
          </div>
          <p className="text-sm font-semibold ">Add work title</p>
          <Form.Item
            name="title"
            style={{ margin: '5px 0px' }}
            label={false}
            rules={[
              {
                required: true,
                message: 'Please input the title of the task!',
              },
            ]}
          >
            <TextArea
              minRows={2}
              onKeyDown={(event) => {
                if (event.keyCode === 50) {
                  if (event.shiftKey) {
                    //   TODO:
                  }
                }
              }}
              autoSize
              size="large"
              placeholder="Work Description"
            />
          </Form.Item>
          <Row gutter={16}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <div>
                <p className="text-sm font-semibold mt-4">Select type of work</p>
                <Form.Item
                  name="durationUnitId"
                  style={{ margin: '' }}
                  rules={[{ required: true, message: 'Please select type of work!' }]}
                >
                  <Select
                    size="large"
                    placeholder="Select work type"
                    getPopupContainer={(node) => node.parentNode}
                    onSelect={(value) => {
                      createRecurrencePayload(value);
                      if (value === 'CUSTOM') {
                        setIsRecurrenceModalVisible(true);
                      }
                    }}
                  >
                    {TimeDuration?.map((dru) => (
                      <Select.Option value={dru?.value} key={dru?.value}>
                        {dru?.title}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <div>
                <p className="text-sm font-semibold mt-4">Select Priority</p>
                <Form.Item name="priorityTypeId" style={{ margin: '' }}>
                  <Select
                    size="large"
                    placeholder="Select priority"
                    getPopupContainer={(node) => node.parentNode}
                  >
                    {priority?.map((prior) => (
                      <Select.Option value={prior?.value} key={prior?.value}>
                        {prior?.title}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </Col>
          </Row>
          {/* Add students */}
          <div className="flex items-center justify-between mb-4">
            <Tooltip title="Choose student" className="cursor-pointer">
              <Button onClick={() => setShowAddStudentModal(true)}>
                <Plus className="align-top text-2xl font-bold" /> Select Student(s)
              </Button>
            </Tooltip>
            <div>
              {studentSelectList?.length !== 0 &&
                renderTaskPeopleAvatars(studentSelectList, setStudentSelectList)}
            </div>
          </div>
          <Modal
            centered
            maskClosable={false}
            keyboard={false}
            title={
              <span className="flex items-center">
                <span>
                  <UsergroupAddOutlined className="text-4xl mr-2" />
                </span>

                <div className="flex flex-col">
                  <span className="font-semibold">Add student</span>

                  <span className="font-normal text-sm">
                    Search and choose people by name or phone number.
                  </span>
                </div>
              </span>
            }
            visible={showAddStudentModal}
            onCancel={() => setShowAddStudentModal(false)}
            footer={
              <div>
                <Button
                  key="submit"
                  type="primary"
                  loading={addStudentLoading}
                  disabled={!disableStudentModalField}
                  onClick={() => {
                    setAddStudentLoading(true);
                    dispatch({
                      type: 'tasks/getStudentsList',
                      payload: {
                        query: {
                          leadTypeId: leadType,
                          searchBy: searchStudentBy,
                        },
                      },
                    }).then((res) => {
                      if (res?.records?.length > 0) {
                        studentForm.submit();
                        setAddStudentLoading(false);
                      }
                    });
                  }}
                >
                  Add
                </Button>
              </div>
            }
          >
            <Form
              form={studentForm}
              onFinish={(values) => {
                setShowAddStudentModal(false);
                message.success(`Student added successfully.`);
                setStudentSelectList(
                  // eslint-disable-next-line array-callback-return
                  values?.students?.map((items) => {
                    if (studentsList?.records?.find((item) => item?.id === items?.value)) {
                      // eslint-disable-next-line prefer-const
                      let data = studentsList?.records?.find((item) => item?.id === items?.value);
                      return {
                        id: data?.id,
                        name: data?.displayName,
                        photoUrl: data?.photoUrl,
                      };
                    }
                  }),
                );
              }}
            >
              <p className="text-sm font-semibold ">Select from</p>
              <Radio.Group
                disabled={disableStudentModalField}
                onChange={(e) => setLeadType(e.target.value)}
                style={{ display: 'flex' }}
                size="large"
                defaultValue={'LEAD'}
                buttonStyle="solid"
              >
                <Radio value="LEAD">Leads</Radio>
                <Radio value="STUDENT">Students</Radio>
              </Radio.Group>
              <p className="text-sm font-semibold mt-4">Select purpose</p>
              <Select
                size="large"
                disabled={disableStudentModalField}
                style={{ width: '100%' }}
                placeholder="Select work type"
                defaultValue={'COURSES'}
                onChange={(e) => setSearchStudentBy(e)}
                getPopupContainer={(node) => node.parentNode}
              >
                <Select.Option value="COURSES" key="COURSES">
                  Course
                </Select.Option>
                <Select.Option value="VISA" key="VISA">
                  Visa
                </Select.Option>
                <Select.Option value="OTHERS" key="OTHERS">
                  Other Services
                </Select.Option>
              </Select>
              <div className="mt-2">
                <p className="text-sm font-semibold mt-4">Select student</p>
                <Form.Item name="students">
                  <Select
                    showSearch
                    size="large"
                    style={{ width: '100%' }}
                    onSearch={onSearch}
                    allowClear
                    placeholder="Add student"
                    defaultActiveFirstOption={false}
                    mode="multiple"
                    labelInValue
                    notFoundContent={null}
                    filterOption={false}
                    onBlur={() => {
                      setKeyword('');
                    }}
                    onSelect={() => {
                      setKeyword('');
                    }}
                    onChange={(e) => {
                      if (e?.length > 0) {
                        setDisableStudentModalField(true);
                      } else {
                        setDisableStudentModalField(false);
                        setStudentSelectList([]);
                      }
                    }}
                  >
                    {studentsList?.records?.map((studentItem) => (
                      <Select.Option key={studentItem?.id} label={studentItem?.displayName}>
                        {studentItem?.displayName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </Form>
          </Modal>
          {/* Due Date field */}
          <div className="flex items-center justify-between my-4">
            <Button style={{ display: 'flex', alignItems: 'center', padding: '0%' }}>
              <span className="relative w-32">
                <DatePicker
                  showTime={{ use12Hours: true }}
                  showNow={false}
                  disabledDate={(date) => date.valueOf() < moment().subtract(1, 'days').valueOf()}
                  suffixIcon={<></>}
                  style={{ cursor: 'pointer', width: '100%' }}
                  bordered={false}
                  allowClear={false}
                  value={dueDate}
                  onChange={(e) => setDueDate(e)}
                />
                <span
                  style={{ pointerEvents: 'none' }}
                  className="absolute bg-white flex gap-2 px-2 w-full left-0 top-0 mt-1 cursor-pointer"
                >
                  <span className="">
                    <CalendarX />
                  </span>
                  <span className="mt-0.5">Due date</span>
                </span>
              </span>
            </Button>
            <div>{renderTaskDueDate(dueDate, setDueDate)}</div>
          </div>

          {/* Followers */}
          <div className="flex items-center justify-between mb-4">
            <Tooltip title="Choose task followers" className="cursor-pointer">
              <Button onClick={() => setShowAddFollowerModal(true)}>
                <Plus className="align-top text-2xl font-bold" /> Select follower(s)
              </Button>
            </Tooltip>
            <div>
              {followers?.length === 0 ? (
                <Button
                  type="dashed"
                  onClick={() =>
                    setFollowers([
                      {
                        name: currentUser?.personalDetails?.displayName,
                        email: currentUser?.personalDetails?.primaryEmail,
                        id: currentUser?.personalDetails?.id,
                        // photoUrl: TODO,
                      },
                    ])
                  }
                >
                  Follow?
                </Button>
              ) : (
                renderTaskPeopleAvatars(followers, setFollowers)
              )}
            </div>
          </div>
          <p className="text-sm font-semibold ">Add remarks</p>
          <Form.Item name="remark" style={{ margin: '5px 0px' }} label={false}>
            <TextArea
              minRows={2}
              onKeyDown={(event) => {
                if (event.keyCode === 50) {
                  if (event.shiftKey) {
                    //   TODO:
                  }
                }
              }}
              autoSize
              size="large"
              placeholder="Enter any remark"
            />
          </Form.Item>
          <div>
            <Form.Item name="uploadedFiles">
              <Dragger
                name={'file'}
                accept=".jpg, .png, .jpeg, .gif, .bmp, .tif,.pdf,.doc,.docx,.xlsx ,.tiff|image/*"
                onChange={(info) => {
                  const { status } = info.file;
                  if (status === 'done') {
                    message.success(`${info.file.name} file uploaded successfully.`);
                  } else if (status === 'error') {
                    message.error(`${info.file.name} file upload failed.`);
                  }
                }}
                onRemove={(data) => {
                  setContentsForTask(contentsForTask?.filter((del) => del?.uId !== data?.uid));
                  return true;
                }}
                multiple={true}
                beforeUpload={async (data) => {
                  await toBase64(data)
                    .then((res) => {
                      const obj = {
                        encodedFile: res,
                        name: data?.name,
                        typeId: 'DOCUMENT',
                        uId: data?.uid,
                      };
                      setContentsForTask((prev) => [...prev, obj]);
                    })
                    .catch(() => {});
                  return false;
                }}
                style={{
                  display: 'block',
                  backgroundColor: 'white',
                  boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                }}
              >
                <p className="">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </p>
                <p className="ant-upload-text">
                  <span className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500 mr-1.5">
                    Upload a file
                  </span>
                  or drag and drop
                </p>
              </Dragger>
            </Form.Item>
          </div>
          <PeoplePicker
            setVisible={setShowAddFollowerModal}
            visible={showAddFollowerModal}
            savedValues={followers}
            title={() => 'Select followers of this task'}
            buttonName="Select"
            loading={addFollowerLoading}
            // listLoading={listOrganizationMembersLoading}
            search={(searchValue) =>
              dispatch({
                type: 'staff/getOrgMemberList',
                payload: {
                  query: {
                    keyword: searchValue,
                    startIndex: '0',
                    fetchSize: '5',
                    sortBy: 'displayName',
                  },
                  pathParams: {
                    clientId: currentUser?.personalDetails?.organizationDetails?.orgPartyGroupId,
                  },
                },
              })
            }
            onChange={(values) => {
              setAddFollowerLoading(true);
              const peopleToBeNotified = [
                ...values.map((value) => ({
                  id: value.id,
                  name: value.displayName,
                  email: value.email,
                  photoUrl: value.photoUrl,
                })),
                ...followers,
              ];
              setFollowers(peopleToBeNotified);
              setNotifyPeople(peopleToBeNotified.filter(({ id }) => id !== currentUser?.id));
              setAddFollowerLoading(false);
              setShowAddFollowerModal(false);
              message.success(
                `${values.length} ${getSingularPlural(
                  'follower',
                  values?.length,
                )} added successfully!`,
              );
            }}
          />
          {/* Category */}
          {/* NOTE: @AmitMathur comment out the addTaskCategory functionality for now. */}

          {/* <div className="flex items-center justify-between mb-4">
          <Popover
            visible={categoryVisible}
            onVisibleChange={() => {
              setCategoryVisible(!categoryVisible);
            }}
            overlayClassName={styles.popoverStyle}
            trigger="click"
            placement="bottom"
            content={
              <TaskCategories
                // projectId={projectId}
                setCategoryId={setCategoryId}
                type="inputTask"
                categoryVisible={categoryVisible}
                setCategoryVisible={setCategoryVisible}
                category={category}
                form={form}
                setCategory={setCategory}
                setCategoryColor={setCategoryColor}
                setCategoryForegroundColor={setCategoryForegroundColor}
              />
            }
          >
            <Button onClick={(e) => e.preventDefault()}>Select category</Button>
          </Popover>

          <div className="pl-4">
            <CategoryPill
              id={categoryId}
              name={category}
              backgroundColor={categoryColor}
              foregroundColor={categoryForegroundColor}
            />
          </div>
        </div> */}

          {/* NOTE: @AmitMathur comment out the Link and Attachments files functionality for now. */}

          {/* <div className="flex flex-col justify-start mb-4">
          <div className={showLinkSelector ? '' : 'hidden'}>
            <LinksBuilder savedLinks={savedLinks} setSavedLinks={setSavedLinks} />
          </div>
        </div> */}

          {/* <div className="flex flex-col justify-start mb-4">
          <div className={showAttachmentSelector ? '' : 'hidden'}>
            <TaskAttachmentBuilder
              savedFiles={savedFiles}
              setSavedFiles={setSavedFiles}
              className="pt-4"
            />
          </div>
        </div> */}
        </Form>
      </Spin>
    </Modal>
  );
};

AddTaskModal.defaultProps = {
  name: '',
  layoutMode: 'default',
  placeHolderText: 'Task name...',
  showAssigneeSelector: true,
  showProjectSelector: true,
  showCategorySelector: true,
  showTemplateSelector: true,
  showLinkSelector: true,
  showAttachmentSelector: true,
  showTip: true,
  taskCreatedCallBack: () => {},
  defaultAssignees: [],
  defaultFollowers: [],
};

const mapStateToProps = ({ user, global, loading, tasks }) => ({
  currentUser: user.currentUser,
  visible: global?.taskModalVisible,
  branchList: tasks?.branchList,
  departmentList: tasks?.departmentList,
  staffList: tasks?.staffList,
  studentsList: tasks?.studentsList,
  addingTaskLoading: loading.effects['tasks/createTask'],
});

export default connect(mapStateToProps)(AddTaskModal);
