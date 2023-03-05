import React, { useEffect, useImperativeHandle, useState } from 'react';
import PropTypes from 'prop-types';
import { ArrowDownShort, ArrowRightShort, Exclamation, Folder, Plus } from 'react-bootstrap-icons';
import { Avatar, Button, message, Tooltip, Popover, Form, Menu, Dropdown, Modal, Spin } from 'antd';
import { connect } from 'dva';
import TextArea from 'antd/lib/input/TextArea';
// import ZcpIcons from '@/utils/ZcpIcons'; TODO
import AvatarHoverViewRest from '@/components/AvatarHoverViewRest';
import AvatarHoverView from '@/components/AvatarHoverView';
// import { debounce, set, uniq } from 'lodash'; //TODO
import BadgeAvatar from '@/components/BadgeAvatar';
import TaskCategories from '@/pages/ProjectManagement/TaskManagement/components/ListComponent/components/TaskCategories';
import LinksBuilder from '@/components/LinksBuilder';
import TaskAttachmentBuilder from '@/components/TaskAttachmentBuilder';
import ChooseTemplate from '@/components/ChooseTemplate';
// import TaskSubType from '@/pages/ProjectManagement/TaskManagement/components/ListComponent/components/TaskSubType'; TODO
import TaskProjects from '@/pages/ProjectManagement/TaskManagement/components/ListComponent/components/TaskProjects';
// import Priorities from '@/pages/ProjectManagement/TaskManagement/components/ListComponent/components/Priorities'; TODO
import SelectDueDatePopover from '@/pages/Party/Components/TaskView/TaskTopBar/SelectDueDatePopover';

import { NotificationActiveIcon, NotificationOffIcon } from '@/utils/AppIcons';
import CheckValidation from '@/components/CheckValidation';

import { BulbOutlined, CloseCircleFilled } from '@ant-design/icons';
// import SharedContentComponent from '@/pages/deals/Projects/ProjectView/ProjectViewTabsWrapper/ProjectCollaborators/SharedContentComponent'; TODO
import { getInitials, getSingularPlural, retrieveImageFromClipboardAsBlob } from '@/utils/utils';
import PeoplePicker from '@/components/People/PeoplePicker';

// import Axios from 'axios'; TODO
// import { debugError, hostname } from '@/utils/apiUtils'; TODO
import styles from './index.less';
import { renderTaskDueDate } from '../ViewTaskListItem';
import CategoryPill from '../CategoryPill';

// If no default category id is passed this will be selected by default.
export const DEFAULT_CATEGORY_ID = 'TC_PRSNL';

/**
 *
 * @QuickTask - UI wizard to help create a quick task. See ./readme.md for documentation.
 * Usage:
 * Simply include the component with desired configuration and it'll take care of the rest.
 */
const QuickTask = ({
  name,
  placeHolderText,
  reff,
  layoutMode,
  currentUser,
  defaultCategoryId,
  defaultCategory,
  taskCreatedCallBack,
  dispatch,
  // members, TODO
  // projectItemTypes, TODO
  allProjects,
  // taskPriorities, TODO
  projectName,
  projectId,
  onCreateTask,
  projectMembers,
  showProjectSelector,
  showCategorySelector,
  showTemplateSelector,
  showAssigneeSelector,
  showLinkSelector,
  showAttachmentSelector,
  showTip,
  isImageUploading,
  listOrganizationMembersLoading,
  // hideExtra, TODO
  defaultAssignees,
  // defaultFollowers, TODO
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [taskName, setTaskName] = useState(name);
  const [listAssignees, setListAssignees] = useState([]);
  const [notifyPeople, setNotifyPeople] = useState([]);

  // template related state
  // const [isTemplateUsed, setIsTemplateUsed] = useState(false); TODO
  const [templateTaskData, setTemplateTaskData] = useState(null);
  // const [templateTaskRes, setTemplateTaskRes] = useState(); TODO
  // end of task template state

  const [notifyPeopleOnTaskAssignment, setNotifyPeopleOnTaskAssignment] = useState(true);
  const [categoryVisible, setCategoryVisible] = useState(false);
  const [categoryId, setCategoryId] = useState(defaultCategoryId || 'PRJ_CAT_03');
  const [category, setCategory] = useState(defaultCategory || 'Personal');
  // const [taskSubType, setTaskSubType] = useState('Improvement'); TODO
  const [taskSubTypeId, setTaskSubTypeId] = useState('PJ_ITEM_IMPVMNT');
  const [categoryColor, setCategoryColor] = useState('#039be5');
  const [categoryForegroundColor, setCategoryForegroundColor] = useState('#ffffff');
  // const [priorityName, setPriorityName] = useState('Major'); TODO
  // const [subTypeVisible, setSubTypeVisible] = useState(false); TODO
  const [projectsVisible, setProjectsVisible] = useState(false);
  // const [priorityVisible, setPriorityVisible] = useState(false); TODO
  const [project, setProject] = useState({
    id: '',
    name: '',
  });

  const [taskPriorityIcon, setTaskPriorityIcon] = useState();
  const [taskPriority, setTaskPriority] = useState('Normal');
  const [savedLinks, setSavedLinks] = useState([]);
  const [savedFiles, setSavedFiles] = useState([]);
  const [showAddAssigneeModal, setShowAddAssigneeModal] = useState(false);
  const [addAssigneeLoading, setAddAssigneeLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState({ visible: false, data: '' });
  const [templateId, setTemplateId] = useState();
  // layout modes
  const [isLayoutModeDefault, setIsLayoutModeDefault] = useState(false);
  const [isLayoutModeResponsive, setIsLayoutModeResponsive] = useState(false);
  const [isLayoutModeSubtask, setIsLayoutModeSubtask] = useState(false);

  const [addingTaskLoading, setAddingTaskLoading] = useState(false);

  const [form] = Form.useForm();

  // TODO
  // const renderSubtypeSelectedIcon = () => {
  //   if (taskSubType === 'Bug') {
  //     return ZcpIcons.Bug;
  //   }
  //   if (taskSubType === 'Change Request' || taskSubType === 'New Feature') {
  //     return ZcpIcons.Feature;
  //   }
  //   if (taskSubType === 'Story' || taskSubType === 'Improvement') {
  //     return ZcpIcons.Improvement;
  //   }
  //   return ZcpIcons.Epic;
  // };

  // TODO
  // const renderPriorityIcon = () => {
  //   if (priorityName && priorityName === 'Major') {
  //     return <Icon className="mt-1 text-red-800" component={ZcpIcons.DoubleArrowUp} />;
  //   }
  //   if (priorityName && priorityName === 'Blocker') {
  //     return <Icon className="mt-1 text-red-900" component={ZcpIcons.Blocker} />;
  //   }
  //   if (priorityName && priorityName === 'Critical') {
  //     return <Icon className="mt-1 text-red-900 " component={ZcpIcons.ArrowUp} />;
  //   }
  //   if (priorityName && priorityName === 'Minor') {
  //     return <Icon className="mt-1 text-green-800" component={ZcpIcons.DoubleArrowDown} />;
  //   }
  //   return <Icon className="mt-1 text-gray-600" component={ZcpIcons.ArrowDown} />;
  // };
  const setTaskTemplateObj = (item) => {
    setTemplateTaskData(item);
    // setIsTemplateUsed(true); TODO
  };

  useEffect(() => {
    if (templateTaskData) {
      setTaskName(templateTaskData?.name);
    }
  }, [templateTaskData]);

  // this will create task from Template
  const createTaskFromTemplate = () => {
    if (templateTaskData) {
      const taskPayload = {
        parentTaskId: '',
        description: '',
        categoryId: categoryId || 'TC_PRSNL',
        taskSubTypeId,
        assignee: listAssignees.map((assignee) => assignee.id),
        // notifyPeople: uniq(notifyPeople.map((notify) => notify.id)), TODO
        priorityTypeId: taskPriority,
        // dueDate, TODO
        followers: [{ id: currentUser.id }],
        projectId,
        taskName: taskName || 'Untitled Task',
        templateId: templateTaskData?.id,
        links: savedLinks,
        files: savedFiles,
      };
      dispatch({
        type: 'template/createTaskFromTemplate',
        payload: taskPayload,
      }).then((res) => {
        if (res?.taskId) {
          let taskSuccessMessage = `Task #${res.taskId} created successfully!`;

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
          // resetTaskState(true); TODO

          // resetTaskState(false);
          if (taskCreatedCallBack) {
            taskCreatedCallBack(res);
          }
        } else {
          const errorResponse = res?.error?.response?.data;
          message.error(errorResponse?.message || 'Unable to create Task! We are working on it!');
        }
      });
      // .catch((err) => debugError({ err })); TODO
    }
  };

  const getProjects = () => {
    dispatch({
      type: 'projects/getAllProjects',
      payload: {
        keyword: '',
        sort_by: '',
        view_size: 20,
        view_index: 0,
      },
    });
  };

  const getProjectMembers = () => {
    if (projectId) {
      dispatch({
        type: 'projects/getProjectMembers',
        payload: {
          projectId,
        },
      });
    }
  };

  useEffect(() => {
    if (projectId && projectName) {
      setProject({ id: projectId, name: projectName });
    }

    if (defaultCategoryId) {
      setCategoryId(defaultCategoryId);
    }
    if (defaultCategory) {
      setCategory(defaultCategory);
    }
  }, [projectId, projectName]);

  /**
   * @getType This is the function to fetch subtypes
   */
  const getType = () => {
    dispatch({
      type: 'task/getType',
    });
  };

  const getPriorities = () => {
    dispatch({
      type: 'task/projectTaskPriorities',
    });
  };

  useEffect(() => {
    getType();
    getProjects();
    getPriorities();
    getProjectMembers();
  }, []);

  /**
   * Resets the task state making it ready for next task.
   * @param {boolean} hardReset setting to true will clear the list of assignees as well.
   */
  const resetTaskState = (hardReset) => {
    // setTaskName('');
    setSavedFiles([]);
    if (isLayoutModeResponsive) {
      setIsFocused(false);
    }
    setCategoryId(defaultCategoryId || 'PRJ_CAT_03');
    setCategory(defaultCategory || 'Personal');
    // setTaskSubType('Improvement'); TODO
    setTaskSubTypeId('PJ_ITEM_IMPVMNT');
    setCategoryColor('#039be5');
    setCategoryForegroundColor('#ffffff');
    setSavedLinks([]);
    if (hardReset) {
      if (layoutMode !== 'subtask') {
        setListAssignees([]);
        setNotifyPeople([]);
      }
    }
  };

  // add the current logged - in user by default in task assingee list
  useEffect(() => {
    // For responsive mode mark it is isFocused
    if (isLayoutModeResponsive) {
      setIsFocused(true);
    }
  }, [currentUser]);
  const [selectDueDatePopoverVisible, setSelectDueDatePopoverVisible] = useState(false);
  const [dueDate, setDueDate] = useState();

  const reqIcon = () => {
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

  // const [imageUploading, setImageUploading] = useState(false);TODO
  const handlePaste = (e) => {
    const data = new FormData();
    retrieveImageFromClipboardAsBlob(e, (file) => {
      data.append('file', file);
      dispatch({
        type: 'common/uploadCommonContent',
        payload: { data },
      }).then((res) => {
        const array = [...savedFiles];
        array.push({
          id: res?.data?.contentId,
          uid: res?.data?.contentId,
          name: res?.data?.fileName,
          url: res?.data?.url,
        });
        setSavedFiles(array);
        message.success('File uploaded successfully');
      });
    });
  };

  const createTask = (cb) => {
    // creates the task on the server.
    // check if taskCreatedCallBack exists, if so invoke it with the response.
    setTaskName('');

    onCreateTask({
      taskName: taskName || 'Untitled Task',
      listAssignees,
      // notifyPeople: notifyPeopleOnTaskAssignment ? uniq(notifyPeople) : [], TODO
      categoryId,
      taskPriority,
      taskSubTypeId,
      savedLinks,
      dueDate,
      savedFiles,
      templateId,
    })
      .then((res) => {
        if (res?.id) {
          let taskSuccessMessage = `Task #${res.id} created successfully!`;

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

          resetTaskState(true);
          if (taskCreatedCallBack && !cb) {
            taskCreatedCallBack(res);
          }
          if (cb) {
            cb(res);
          }
        } else {
          const errorResponse = res?.error?.response?.data;
          message.error(errorResponse?.message || 'Unable to create Task! We are working on it!');
        }
      })
      .catch((err) => {
        message.error('Something went wrong! Details: ', err);
      });
  };

  const keydownHandler = (event) => {
    if (event.keyCode === 13 && event.ctrlKey) {
      setTaskName('');
      setCategoryId(defaultCategoryId || 'PRJ_CAT_03');
      setTaskPriority('Normal');
      setTaskPriorityIcon('');
      setDueDate('');
      setSavedFiles([]);
      setSavedLinks([]);
      setTemplateId('');
      setListAssignees([]);
      setNotifyPeople([]);
      setNotifyPeopleOnTaskAssignment(true);
      setCategory(defaultCategory || 'Personal');
      // setTaskSubType('Improvement'); TODO
      setTaskSubTypeId('PJ_ITEM_IMPVMNT');
      // setPriorityName('Major'); TODO
      setTemplateId('');

      if (showProjectSelector) {
        setProject({
          id: '',
          name: '',
        });
      }
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', keydownHandler);
    return () => {
      document.removeEventListener('keydown', keydownHandler);
    };
  }, []);

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

  /**
   * Content rendered when the task is focused, shows the ready to take input and create task state.
   *
   * @returns
   */
  const renderFocusedContent = () => {
    return (
      <div className="flex space-x-1 items-center">
        {/* Task owner, hidden for subtask mode */}
        <CheckValidation show={!isLayoutModeSubtask}>
          <div className="w-8 h-8 flex items-center">
            <Avatar src={currentUser.photoUrl} className="bg-blue-800">
              {getInitials(currentUser.displayName)}
            </Avatar>
          </div>
        </CheckValidation>
        {/* Text primary input to enter task name, listens to enter event as well. */}
        <div className="flex-1 font-medium">
          <TextArea
            onPressEnter={(evt) => {
              form.resetFields();
              evt.preventDefault();
              // make api call to create task
              if (taskName !== '') {
                createTask();
              }
            }}
            onChange={(evt) => {
              setTaskName(evt.target.value);
            }}
            onKeyDown={(event) => {
              if (event.keyCode === 50) {
                if (event.shiftKey) {
                  setShowAddAssigneeModal(true);
                }
                // setTaskName(taskName.concat('@'));
              }
            }}
            value={taskName}
            autoFocus
            className="font-medium"
            placeholder={placeHolderText}
            bordered={false}
            autoSize
            onPaste={handlePaste}
          />
        </div>
        {/* Task assignee selector, excludes already selected members */}
        {(taskName || isLayoutModeResponsive || isLayoutModeSubtask) && showAssigneeSelector ? (
          <>
            {/* Task category */}
            <CheckValidation show={showCategorySelector}>
              <div className="mx-2">
                <Popover
                  visible={categoryVisible}
                  onVisibleChange={() => {
                    setCategoryVisible(!categoryVisible);
                  }}
                  overlayClassName="mmo-popup"
                  trigger="click"
                  placement="bottom"
                  content={
                    <TaskCategories
                      projectId={projectId}
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
                  <CategoryPill
                    id={categoryId}
                    name={category}
                    backgroundColor={categoryColor}
                    foregroundColor={categoryForegroundColor}
                    onClickHandler={() => {
                      setCategoryVisible(!categoryVisible);
                    }}
                  />
                </Popover>
              </div>
            </CheckValidation>

            {/* Display list of selected assignees for sub task mode */}
            {/* <CheckValidation show={isLayoutModeSubtask}>{renderTaskAssignees()}</CheckValidation> TODO */}

            {/* Task assignee selector */}
            <div>
              <Tooltip title="Choose task assignees" className="cursor-pointer">
                <Button
                  className="flex items-center justify-center"
                  type="dashed"
                  shape="circle"
                  onClick={() => {
                    setShowAddAssigneeModal(true);
                  }}
                  icon={<Plus className="align-top text-2xl font-bold" />}
                />
              </Tooltip>
              <PeoplePicker
                setVisible={setShowAddAssigneeModal}
                visible={showAddAssigneeModal}
                savedValues={listAssignees}
                suggestedValues={projectMembers}
                title={() => 'Assign task to people'}
                buttonName="Assign"
                loading={addAssigneeLoading}
                listLoading={listOrganizationMembersLoading}
                search={(searchValue) =>
                  dispatch({
                    type: 'orgMembers/listOrganizationMembers',
                    payload: {
                      searchCriteria: {
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
                    ...listAssignees,
                  ];
                  setListAssignees(peopleToBeAssigned);
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
            </div>
          </>
        ) : (
          ''
        )}
        {/* Task priority */}
        <div>
          <Dropdown overlay={TaskPriorityOptionsMenu} trigger={['click']}>
            <Tooltip title="Choose task priority">
              <Button
                type="link"
                shape="circle"
                className="hover:bg-gray-100"
                icon={reqIcon()}
                onClick={(e) => e.preventDefault()}
              />
            </Tooltip>
          </Dropdown>
        </div>
        {/* Due date selector */}
        <div>
          <Tooltip title="Set due date">
            <SelectDueDatePopover
              visible={selectDueDatePopoverVisible}
              onDueDateChange={(body) => {
                setSelectDueDatePopoverVisible(false);
                setDueDate(body.dueDate);
              }}
              setVisible={setSelectDueDatePopoverVisible}
            >
              {renderTaskDueDate(dueDate)}
            </SelectDueDatePopover>
          </Tooltip>
        </div>
      </div>
    );
  };

  const renderNonFocusedContent = () => {
    return (
      <>
        <div className="w-8 h-8 flex items-center">
          <Plus className="text-2xl" />
        </div>
        <div className="flex-auto font-medium pl-2">Add a task</div>
      </>
    );
  };

  /**
   * Renders the list of task assignees. Shows max 5 and handles overflow after.
   */
  const renderTaskAssignees = () => (
    <div className={styles.AddNoteFormModal}>
      <div className="flex items-center mr-3 -space-x-2">
        {listAssignees &&
          listAssignees.slice(0, 5).map((assignee) => (
            <AvatarHoverView profile={assignee} key={assignee.id + Math.random()}>
              <div className="ring-white ring-2 px-1">
                {/* Badge Avatar with delete button */}
                <BadgeAvatar
                  name={assignee.displayName}
                  imgUrl={assignee.photoUrl}
                  onDelete={() => {
                    const trimmedTaskAssigneeList = listAssignees.filter(
                      (l) => l.id !== assignee.id,
                    );
                    setListAssignees([...trimmedTaskAssigneeList]);
                    const trimmedNotifyPeopleList = notifyPeople.filter(
                      (l) => l.id !== assignee.id,
                    );
                    setNotifyPeople([...trimmedNotifyPeopleList]);
                  }}
                  showBadge
                />
              </div>
            </AvatarHoverView>
          ))}

        {listAssignees && listAssignees.length > 5 && (
          <AvatarHoverViewRest
            newFilter
            title={`Assignees (${listAssignees.length - 5})`}
            assignees={listAssignees && listAssignees.slice(5, listAssignees.length)}
            onDelete={(id) => {
              const newlist = listAssignees.filter((l) => l.id !== id);
              setListAssignees([...newlist]);
            }}
          >
            <Avatar className={styles.PlustextAvatar}>+{listAssignees.length - 5}</Avatar>
          </AvatarHoverViewRest>
        )}
      </div>
    </div>
  );

  /**
   * Renders the list of task notification recipients. List of people who will be notified about a task assignment.
   */
  const renderTaskNotificationRecipients = () => (
    <div>
      {notifyPeople && !!notifyPeople.length && (
        <>
          <div className="flex space-x-2 items-center">
            <CheckValidation show={notifyPeopleOnTaskAssignment}>
              <div className="flex items-center space-x-2">
                <div className="text-xs italic font-semibold text-gray-500">
                  {notifyPeople.length} {notifyPeople.length === 1 ? 'Person' : 'People'} will be
                  notified
                </div>
                <div className="flex items-center mr-3 -space-x-2">
                  {notifyPeople.map((person) => (
                    <div key="">
                      <Tooltip
                        title={
                          <div className="flex space-x-2 items-center">
                            <div>
                              <Avatar size="large" src={person.photoUrl}>
                                {getInitials(person.name)}
                              </Avatar>
                            </div>
                            <div>
                              <div className="font-semibold">{person.name}</div>
                              <div>{person.email}</div>
                            </div>
                          </div>
                        }
                      >
                        <Avatar className="ring-white ring-2" src={person.photoUrl}>
                          {getInitials(person.name)}
                        </Avatar>
                      </Tooltip>
                    </div>
                  ))}
                </div>
              </div>
            </CheckValidation>
            {/* Button to turn notifications on and off */}
            <div>
              <Tooltip
                title={
                  notifyPeopleOnTaskAssignment
                    ? 'Notifications enabled, task assignees will be notified, click to disable.'
                    : 'Notifications disabled, task assignees will not be notified, click to enable notifications.'
                }
              >
                <button
                  type="button"
                  onClick={() => {
                    setNotifyPeopleOnTaskAssignment(!notifyPeopleOnTaskAssignment);
                  }}
                  className={`w-9 h-9 rounded-full border grid place-items-center ${
                    notifyPeopleOnTaskAssignment
                      ? 'bg-yellow-300 text-yellow-900'
                      : ' bg-gray-100 text-gray-800'
                  }`}
                >
                  {notifyPeopleOnTaskAssignment ? NotificationActiveIcon() : NotificationOffIcon()}
                </button>
              </Tooltip>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const showTaskAssingees = () =>
    listAssignees.filter((assingee) => assingee.id !== currentUser?.id)?.length > 0;

  const taskWrapperClassName = () => {
    const baseClassName = 'flex text-black items-center transition-all';
    let taskInputModeClass = 'max-w-md opacity-75';
    if (isFocused) {
      if (isLayoutModeResponsive) {
        taskInputModeClass = 'bg-white shadow  mx-auto rounded mt-4 w-full';
      } else if (isLayoutModeSubtask) {
        taskInputModeClass = 'w-full';
      } else {
        taskInputModeClass = 'bg-white shadow  mx-auto rounded mt-4 w-full max-w-lg';
      }
    }

    return `${baseClassName} ${taskInputModeClass}`;
  };

  useImperativeHandle(reff, () => ({
    createTask(cb) {
      createTask(cb);
    },
  }));

  useEffect(() => {
    if (layoutMode === 'responsive') {
      setIsLayoutModeResponsive(true);
      setIsFocused(true); // render the widget in expanded mode
    } else if (layoutMode === 'subtask') {
      setIsLayoutModeSubtask(true);
      setIsFocused(true); // render the widget in expanded mode
    } else {
      setIsLayoutModeDefault(true);
    }
    return () => {};
  }, [layoutMode]);

  useEffect(() => {
    // see if defaultAssignees exist
    if (defaultAssignees.length) {
      setListAssignees(defaultAssignees);
    }
    return () => {};
  }, [defaultAssignees]);

  return (
    <>
      <div
        aria-hidden="true"
        onBlur={() => {
          // make sure there's no input value in the task input field
          if (!taskName) {
            // make sure mode is not fullscreen(responsive)
            if (isLayoutModeDefault) setIsFocused(false);
          }
        }}
        onClick={() => {
          setIsFocused(true);
        }}
        className={taskWrapperClassName()}
      >
        {isFocused ? (
          <div className="w-full flex flex-col space-y-2">
            <Spin spinning={!!isImageUploading}>
              <div className={!isLayoutModeSubtask && 'px-4 pt-4'}>{renderFocusedContent()}</div>
            </Spin>
            {(isFocused || showTaskAssingees) && (
              <div className={isLayoutModeSubtask ? 'hidden' : ''}>
                <div className="px-4">
                  {/* Option to select project, links, tags, date, project, calendar event */}
                  <div className="flex items-center space-x-2">
                    {/* Links button */}
                    <div className={showLinkSelector ? '' : 'hidden'}>
                      <LinksBuilder savedLinks={savedLinks} setSavedLinks={setSavedLinks} />
                    </div>
                    {/* Attachments button */}
                    <div className={showAttachmentSelector ? '' : 'hidden'}>
                      <TaskAttachmentBuilder
                        savedFiles={savedFiles}
                        setSavedFiles={setSavedFiles}
                      />
                    </div>

                    {/* Task Template selector, hidden for sub task mode */}
                    <div className={showTemplateSelector ? '' : 'hidden'}>
                      <ChooseTemplate
                        templateId={templateId}
                        setTemplateId={(id) => setTemplateId(id)}
                        setTaskTemplateObj={(item) => setTaskTemplateObj(item)}
                        // make api call to createTaskFromTemplate
                        createTaskFromTemplate={() => createTaskFromTemplate()}
                      />
                    </div>

                    {/* Task project selector */}
                    <div className={showProjectSelector ? '' : 'hidden'}>
                      <Popover
                        visible={projectName ? false : projectsVisible}
                        onVisibleChange={() => {
                          setProjectsVisible(!projectsVisible);
                        }}
                        overlayClassName={styles.PopoverPadding}
                        trigger="click"
                        placement="bottom"
                        content={
                          <TaskProjects
                            project={project}
                            setProjectsVisible={setProjectsVisible}
                            setProject={setProject}
                            afterProjectChange={(id) =>
                              dispatch({
                                type: 'projects/getProjectCategories',
                                payload: { projectId: id },
                              })
                            }
                            allProjects={allProjects}
                            selectedProjectId={project.id}
                          />
                        }
                      >
                        <Button
                          type="dashed"
                          onClick={() => {
                            setProjectsVisible(true);
                          }}
                        >
                          <div className="flex items-center space-x-2">
                            <Folder className="text-lg" />
                            <span className="truncate" style={{ maxWidth: '180px' }}>
                              {project?.name || 'Choose project'}
                            </span>{' '}
                          </div>
                        </Button>
                      </Popover>
                    </div>
                  </div>
                </div>
                {/* List of assignees, displayed under the task name, hidden for subtask mode. */}
                <CheckValidation show={!isLayoutModeSubtask}>
                  <div className="px-4 flex justify-between">
                    <div>
                      <div className="mb-3 text-gray-600 text-sm uppercase font-semibold">
                        Assignees ({listAssignees?.length})
                      </div>
                      {renderTaskAssignees()}
                    </div>
                    {/* Notify people about task assignment */}
                    <div>{renderTaskNotificationRecipients()}</div>
                  </div>
                </CheckValidation>
                <div className="flex pl-4 pt-2">
                  {savedFiles.map((image) => (
                    <div
                      key=""
                      style={{ position: 'relative' }}
                      className=" border-2 border-blue-500 rounded-lg mr-2 "
                    >
                      <Button
                        style={{ backgroundColor: 'transparent', border: 'none', padding: 0 }}
                        onClick={() => {
                          setPreviewImage({ visible: true, data: image.url });
                        }}
                      >
                        <img
                          className="h-24 w-24 p-2"
                          src={image.url}
                          style={{ position: 'block' }}
                        />
                        <Button
                          style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            padding: 0,
                            margin: '-17px',
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSavedFiles(savedFiles.filter(({ id }) => id !== image.id));
                          }}
                        >
                          <CloseCircleFilled className="text-blue-700 opacity-100 pr-2 text-lg" />
                        </Button>
                      </Button>
                    </div>
                  ))}
                </div>
                <Modal
                  visible={previewImage.visible}
                  title="View Image"
                  footer={null}
                  width={1000}
                  onCancel={() => setPreviewImage({ visible: false, data: '' })}
                >
                  <img alt="example" style={{ width: '100%' }} src={previewImage.data} />
                </Modal>
                {/* Pro tip, not shown for subtask layoutMode, or if showTip is false */}
                <CheckValidation show={!isLayoutModeSubtask && showTip}>
                  <div className="flex justify-between items-center py-2 px-4 bg-gray-100">
                    <div className="italic text-sm texty-gray-500">
                      <div>
                        <BulbOutlined /> <strong>Pro tip</strong>: Use{' '}
                        <span className="text-xs rounded bg-gray-200 px-1 border font-medium text-gray-500 capitalize">
                          Enter
                        </span>{' '}
                        key to create a task ,{' '}
                        <span className="text-xs rounded bg-gray-200 px-1 border font-medium text-gray-500 capitalize">
                          Ctrl + Enter
                        </span>{' '}
                        to reset task entry and{' '}
                        <span className="text-xs rounded bg-gray-200 px-1 border font-medium text-gray-500 capitalize">
                          Ctrl + v{' '}
                        </span>
                        to directly upload an image.
                      </div>
                    </div>
                    <div className="flex space-x-4">
                      <div>
                        <Button
                          type="text"
                          disabled={!(listAssignees.length > 0 || taskName)}
                          onClick={() => {
                            resetTaskState(true);
                          }}
                        >
                          Reset
                        </Button>
                      </div>
                      <div>
                        <Button
                          type="primary"
                          disabled={!taskName}
                          loading={addingTaskLoading}
                          onClick={() => {
                            setTaskPriority(taskPriorityIcon);
                            setAddingTaskLoading(true);
                            if (templateTaskData) {
                              createTaskFromTemplate();
                              return;
                            }
                            createTask();
                          }}
                        >
                          {addingTaskLoading ? 'Adding' : 'Add'} task
                        </Button>
                      </div>
                    </div>
                  </div>
                </CheckValidation>
              </div>
            )}
          </div>
        ) : (
          renderNonFocusedContent()
        )}
      </div>
    </>
  );
};

QuickTask.defaultProps = {
  name: '',
  layoutMode: 'default',
  placeHolderText: 'Write a task name...',
  defaultCategoryId: DEFAULT_CATEGORY_ID,
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

QuickTask.propTypes = {
  /**
   * @param {string} name : is the name of the task if a predefined value needs to be provided.
   */
  name: PropTypes.string,
  /**
   * @param {string} name : is the name of the task input placeholder if a predefined value needs to be provided.
   */
  placeHolderText: PropTypes.string,
  /**
   * @param {string} defaultCategoryId : is the default category id that will be selected
   */
  defaultCategoryId: PropTypes.string,
  /**
   * @param {object} taskCreatedCallBack : is the callback function that will be triggerred once the task is created. Includes the returned response as the argument to the callback.
   */
  // eslint-disable-next-line react/no-unused-prop-types
  taskCreatedCallBack: PropTypes.func,
  /**
   * @param {string} layoutMode : is the name of the layout mode used to display the quick task creator,
   * should be one of "default", "responsive", "subtask".
   *  Responsive mode doesn't expand on focus and takes full parent width.
   * Subtask mode shows the minimal information to create the task.
   */
  layoutMode: PropTypes.string,
  /**
   * @param {bool} showProjectSelector : indicates whether project selector control needs to be shown or not, defaults to true.
   */
  showProjectSelector: PropTypes.bool,
  /**
   * @param {bool} showCategorySelector : indicates whether category selector control needs to be shown or not, defaults to true.
   */
  showCategorySelector: PropTypes.bool,
  /**
   * @param {bool} showAssigneeSelector : indicates whether task assignee selector control needs to be shown or not, defaults to true.
   * Useful for hiding in case of task templates.
   */
  showAssigneeSelector: PropTypes.bool,
  /**
   * @param {bool} showTemplateSelector : indicates whether task template selector control needs to be shown or not, defaults to true.
   */
  showTemplateSelector: PropTypes.bool,
  /**
   * @param {bool} showLinkSelector : indicates whether task links selector control needs to be shown or not, defaults to true.
   */
  showLinkSelector: PropTypes.bool,
  /**
   * @param {bool} showAttachmentSelector : indicates whether task attachments selector control needs to be shown or not, defaults to true.
   */
  showAttachmentSelector: PropTypes.bool,
  /**
   * @param {bool} showTip : displays a tip about how to use task "Shows short keys (Use enter key ...)". Defaults to true
   */
  showTip: PropTypes.bool,
  /**
   * @param {defaultAssignees}- is the default list of assignees. Defaults to empty list.
   */
  defaultAssignees: PropTypes.array,
  /**
   * @param {defaultFollowers}- is the default list of followers. Defaults to empty list.
   */
  defaultFollowers: PropTypes.array,
};

const mapStateToProps = ({ loading, task, user, orgMembers, projects }) => ({
  currentUser: user.currentUser,
  members: orgMembers.members,
  projectItemTypes: task.projectItemTypes,
  taskPriorities: task.taskPriorities,
  allProjects: projects.allProjects,
  isImageUploading: loading.effects['common/uploadCommonContent'],
  listOrganizationMembersLoading: loading.effects['orgMembers/listOrganizationMembers'],
  projectMembers: projects?.project?.members?.records,
});

export default connect(mapStateToProps, null, null, { forwardRef: true })(QuickTask);
