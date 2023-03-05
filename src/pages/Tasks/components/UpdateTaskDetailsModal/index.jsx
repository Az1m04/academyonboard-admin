import React, { useState, useEffect } from 'react';
import { Form, Button, Modal, Input, Tooltip, Avatar, message, Dropdown, Menu } from 'antd';
import { connect } from 'umi';
import { CalendarX, Exclamation, ArrowRightShort, ArrowDownShort } from '@/utils/AppIcons';
import SelectDueDatePopover from '@/components/SelectDueDatePopover';
import moment from 'moment';
import {
  isMomentToday,
  isMomentThisWeek,
  dayNameShort,
  dayNameAndDateShort,
  monthNameAndDateShort,
} from '@/utils/dateTime/dateTimeUtils';
import { Plus } from '@/utils/AppIcons';
import BadgeAvatar from '@/components/BadgeAvatar';
import AvatarHoverView from '@/components/AvatarHoverView';
import AvatarHoverViewRest from '@/components/AvatarHoverViewRest';
import styles from './index.less';
import PeoplePicker from '@/components/People/PeoplePicker';
import { getSingularPlural } from '@/utils/common';
import { uniq } from 'lodash';
import { Check2, CheckCircleFill } from 'react-bootstrap-icons';
import PersonDetails from '@/components/People/PersonDetails';
import CheckValidation from '@/components/CheckValidation';

const { TextArea } = Input;
const reqIcon = (taskPriority) => {
  switch (taskPriority) {
    case 'High':
      return <Exclamation className="text-xl text-red-700" />;
    case 'Normal':
      return <ArrowRightShort className="text-xl text-blue-700" />;
    case 'Low':
      return <ArrowDownShort className="text-xl text-green-700" />;
    default:
      return <Exclamation className="text-xl text-gray-500" />;
  }
};

const renderTaskPeopleAvatars = (assignees, setAssignees) => (
  <div className={styles.AddNoteFormModal}>
    <div className="flex items-center mr-3 -space-x-2">
      {assignees &&
        assignees.slice(0, 5).map((assignee) => (
          <AvatarHoverView profile={assignee} key={assignee.id + Math.random()}>
            <div className="ring-white ring-2 pl-1">
              {/* Badge Avatar with delete button */}
              <BadgeAvatar
                name={assignee.name}
                imgUrl={assignee.photoUrl}
                onDelete={() => {
                  const trimmedTaskAssigneeList = assignees.filter((l) => l.id !== assignee.id);
                  setAssignees([...trimmedTaskAssigneeList]);
                }}
                showBadge
              />
            </div>
          </AvatarHoverView>
        ))}

      {assignees?.length > 5 && (
        <AvatarHoverViewRest
          newFilter
          title={`Assignees (${assignees.length - 5})`}
          assignees={assignees?.slice(5, assignees.length)}
          onDelete={(id) => {
            const newlist = assignees.filter((l) => l.id !== id);
            setAssignees([...newlist]);
          }}
        >
          <Avatar className={styles.PlustextAvatar}>+{assignees.length - 5}</Avatar>
        </AvatarHoverViewRest>
      )}
    </div>
  </div>
);

const renderTaskDueDate = (dueDate) => {
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
        dueDateLabel = dayNameShort(due);
        return (
          <Tooltip title={`Was due ${due.fromNow()}`}>
            <div className="text-red-700">{dueDateLabel}</div>
          </Tooltip>
        );
      }
      // past due since more than this week ago, show in Jan 14 format
      dueDateLabel = dayNameAndDateShort(due);
      return (
        <Tooltip title={`Past due since ${due.fromNow()}`}>
          <div className="text-red-700">{dueDateLabel}</div>
        </Tooltip>
      );
    }
    // Due today, show Today text
    if (isToday) {
      dueDateLabel = `Today, ${moment(due).format('Do MMMM YYYY')}`;
      return (
        <Tooltip title={`Due ${due.fromNow()}`}>
          <div className="text-blue-700">{dueDateLabel}</div>
        </Tooltip>
      );
    }

    // Due in the future, show Feb 12 text
    if (due.isAfter(moment(), 'day')) {
      //   dueDateLabel = monthNameAndDateShort(due);
      dueDateLabel = `${moment(due).format('dddd')}, ${moment(due).format('Do MMMM YYYY')}`;
      // if (isMomentInNext7Days(due)) {
      //   dueDateLabel = dayNameShort(due);
      // }
      return (
        <Tooltip title={`Due ${due.fromNow()} on ${due.format('MMM DD')}`}>
          <div className="text-blue-700">{dueDateLabel}</div>
        </Tooltip>
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

const UpdateTaskModal = ({
  isEditTaskVisible,
  setIsEditTaskVisible,
  selectedTaskToEdit,
  placeHolderText,
  dispatch,
  currentUser,
}) => {
  const [form] = Form.useForm();
  const [addingTaskLoading, setAddingTaskLoading] = useState(false);
  const [selectDueDatePopoverVisible, setSelectDueDatePopoverVisible] = useState(false);
  const [dueDate, setDueDate] = useState('');
  const [showAddAssigneeModal, setShowAddAssigneeModal] = useState(false);
  const [assignees, setAssignees] = useState([]);
  const [notifyPeople, setNotifyPeople] = useState([]);
  const [addAssigneeLoading, setAddAssigneeLoading] = useState(false);
  const [showAddFollowerModal, setShowAddFollowerModal] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [addFollowerLoading, setAddFollowerLoading] = useState(false);
  const [taskPriority, setTaskPriority] = useState('Normal');
  const [discardChangesModalVisible, setDiscardChangesModalVisible] = useState(false);

  const setAllStatesForEditing = () => {
    setDueDate(selectedTaskToEdit?.dueDate);
    setAssignees([selectedTaskToEdit?.assignees]);
    // setFollowers([selectedTaskToEdit?.]);
    setTaskPriority(selectedTaskToEdit?.priorityTypeId);
  };
  useEffect(() => {
    if (selectedTaskToEdit) setAllStatesForEditing();
  }, [selectedTaskToEdit]);
  const resetAllState = () => {
    setDueDate('');
    setAssignees([]);
    setFollowers([]);
    setTaskPriority('Normal');
    form.resetFields();
  };

  const TaskPriorityOptionsMenu = (
    <Menu>
      <Menu.ItemGroup
        className="p-0"
        title={<div className="text-gray-500 text-xs uppercase">Task Priority</div>}
      >
        <Menu.Item onClick={() => setTaskPriority('High')}>
          <div className="flex space-x-1">
            <div>
              <Exclamation className="text-xl text-red-700" />
            </div>
            <div>High priority</div>
          </div>
        </Menu.Item>
        <Menu.Item onClick={() => setTaskPriority('Normal')}>
          <div className="flex space-x-1">
            <div>
              <ArrowRightShort className="text-xl text-blue-700" />
            </div>
            <div>Normal priority</div>
          </div>
        </Menu.Item>
        <Menu.Item onClick={() => setTaskPriority('Low')}>
          <div className="flex space-x-1">
            <div>
              <ArrowDownShort className="text-xl text-green-700" />
            </div>
            <div>Low priority</div>
          </div>
        </Menu.Item>
      </Menu.ItemGroup>
    </Menu>
  );
  const UpdateTask = () => {
    const allValues = form.getFieldsValue();
    const taskPayload = {
      body: {
        assignee: assignees?.map((assignee) => assignee.id),
        notifyPeople: uniq(notifyPeople?.map((notify) => notify.id)),
        priorityTypeId: taskPriority,
        dueDate,
        followers: followers?.map((item) => ({ id: item?.id })),
        name: allValues?.title || 'Untitled Task',
      },
    };
    dispatch({
      type: 'tasks/updateTask',
      payload: taskPayload,
    })
      .then((res) => {
        if (res?.id) {
          let taskSuccessMessage = `Task #${res?.id} updated successfully!`;

          if (notifyPeople.length) {
            // people will be notified, let the user know about how many.
            taskSuccessMessage = taskSuccessMessage.concat(
              ` ${notifyPeople.length} ${getSingularPlural(
                'person',
                notifyPeople?.length,
              )} will be notified`,
            );
          }

          message.success(taskSuccessMessage);
          setAddingTaskLoading(false);
          setIsEditTaskVisible();
          resetAllState();
        } else {
          const errorResponse = res?.error?.response?.data;
          message.error(errorResponse?.message || 'Unable to update Task! We are working on it!');
        }
      })
      .catch((err) => console.log({ err }));
  };
  return (
    <Modal
      centered
      wrapClassName="app-modal-flat"
      destroyOnClose
      maskClosable={false}
      keyboard={false}
      title={
        <span className="flex items-center">
          <span>Edit Task</span>
        </span>
      }
      visible={isEditTaskVisible}
      onCancel={() => {
        setIsEditTaskVisible(false);
        resetAllState();
        form.resetFields();
      }}
      footer={
        <div>
          <Button className="pr-4" key="back" onClick={() => setDiscardChangesModalVisible(true)}>
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
      width={600}
    >
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
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        name="form_in_modal"
        initialValues={{
          modifier: 'public',
        }}
        onFinish={UpdateTask}
      >
        <div className="flex justify-between items-center bg-blue-50 p-2 -m-6 mb-4 border shadow">
          <div className="flex items-center space-x-2">
            {/* Task completion action button and completion details view */}
            <CheckValidation
              show={false}
              fallback={
                <div className="flex items-center space-x-2">
                  <div>
                    <Tooltip title="Completed, click to reopen">
                      <Button
                        type="default"
                        size="middle"
                        //   loading={reopeningTask}
                        onClick={() => {
                          // reopenTask(taskId);
                        }}
                      >
                        {/* {reopeningTask ? (
                            'Reopening task...'
                          ) : ( */}
                        <div className="flex items-center">
                          <CheckCircleFill className="text-xl text-green-800 mr-1" />
                          Completed
                        </div>
                        {/* )} */}
                      </Button>
                    </Tooltip>
                  </div>
                  {/* Completed on / by details */}
                  <div>
                    <div className="text-xs">
                      by <span className="font-semibold">Amit Mathur</span>
                    </div>
                    <div className="text-xs font-medium italic text-gray-500">
                      completed {moment().fromNow()}
                    </div>
                  </div>
                </div>
              }
            >
              {/* {loadingTaskDetails ? (
                  <Skeleton.Button active size="default" />
                ) : ( */}
              <Button
                type="primary"
                //   loading={completingTask}
                size="middle"
                onClick={() => {
                  // markTaskCompleted(taskId);
                }}
              >
                <div className="flex items-center ">
                  <Check2 className="text-xl mr-2" /> Mark complete
                </div>
              </Button>
              {/* )} */}
            </CheckValidation>
          </div>
          <div className="flex justify-end">
            {/* Show owner details */}
            <Tooltip title={`Created ${monthNameAndDateShort()}`}>
              <PersonDetails
                // showLoadingSkeleton={loadingTaskDetails}
                // photoUrl={creator?.photoUrl}
                showInReverseOrder
                displayName="Amit Mathur"
                secondaryText={`Created ${moment().fromNow()}`}
              />
            </Tooltip>
          </div>
        </div>
        <Form.Item
          name="title"
          style={{ marginBottom: '0' }}
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
            autoFocus
            size="large"
            placeholder={placeHolderText}
            autoSize
          />
        </Form.Item>

        {/* Due Date field */}
        <div className="flex items-center justify-between my-4">
          <Button
            style={{ display: 'flex', alignItems: 'center' }}
            onClick={() => setSelectDueDatePopoverVisible(true)}
          >
            <CalendarX /> <span className="pl-2">Due date</span>
          </Button>
          <SelectDueDatePopover
            visible={selectDueDatePopoverVisible}
            onDueDateChange={(body) => {
              setSelectDueDatePopoverVisible(false);
              setDueDate(body.dueDate);
            }}
            setVisible={setSelectDueDatePopoverVisible}
          />
          <div>{renderTaskDueDate(dueDate)}</div>
        </div>

        {/* Assignee */}
        <div className="flex items-center justify-between mb-4">
          <Tooltip title="Choose task assignees" className="cursor-pointer">
            <Button onClick={() => setShowAddAssigneeModal(true)}>
              <Plus className="align-top text-2xl font-bold" /> Select assignee(s)
            </Button>
          </Tooltip>
          <div>
            {assignees?.length === 0 ? (
              <Button
                type="dashed"
                onClick={() =>
                  setAssignees([
                    {
                      name: currentUser?.personalDetails?.displayName,
                      email: currentUser?.personalDetails?.primaryEmail,
                      id: currentUser?.personalDetails?.id,
                      photoUrl: currentUser?.personalDetails?.avatarUrl,
                    },
                  ])
                }
              >
                Assign to me
              </Button>
            ) : (
              renderTaskPeopleAvatars(assignees, setAssignees)
            )}
          </div>
        </div>
        <PeoplePicker
          setVisible={setShowAddAssigneeModal}
          visible={showAddAssigneeModal}
          savedValues={assignees}
          title={() => 'Assign task to people'}
          buttonName="Assign"
          loading={addAssigneeLoading}
          // listLoading={listOrganizationMembersLoading}
          search={(searchValue) =>
            dispatch({
              type: 'staff/getStaffList',
              payload: {
                query: {
                  keyword: searchValue,
                  startIndex: '0',
                  fetchSize: '5',
                  sortBy: 'displayName',
                },
              },
            })
          }
          onChange={(values) => {
            setAddAssigneeLoading(true);
            const peopleToBeAssigned = [
              ...values.map((value) => ({
                id: value.id,
                name: value.displayName,
                email: value.email,
                photoUrl: value.photoUrl,
              })),
              ...assignees,
            ];
            setAssignees(peopleToBeAssigned);
            setNotifyPeople(peopleToBeAssigned.filter(({ id }) => id !== currentUser?.id));
            setAddAssigneeLoading(false);
            setShowAddAssigneeModal(false);
            message.success(
              `${values.length} ${getSingularPlural(
                'assignee',
                values?.length,
              )} added successfully!`,
            );
          }}
        />

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
              type: 'staff/getStaffList',
              payload: {
                query: {
                  keyword: searchValue,
                  startIndex: '0',
                  fetchSize: '5',
                  sortBy: 'displayName',
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

        {/* Priority */}
        <div className="flex items-center justify-between mb-4">
          <Dropdown overlay={TaskPriorityOptionsMenu} trigger={['click']}>
            <Tooltip title="Choose task priority">
              <Button onClick={(e) => e.preventDefault()}>Set priority</Button>
            </Tooltip>
          </Dropdown>
          <div className="pl-4">
            {reqIcon(taskPriority)} {taskPriority}
          </div>
        </div>
      </Form>
    </Modal>
  );
};

UpdateTaskModal.defaultProps = {
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

const mapStateToProps = ({ user, global }) => ({
  currentUser: user.currentUser,
  visible: global?.taskModalVisible,
});

export default connect(mapStateToProps)(UpdateTaskModal);
