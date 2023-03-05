import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Drawer, Timeline, Spin, message } from 'antd';
import { useParams, history, connect } from 'umi';
import {
  AppstoreAddOutlined,
  AuditOutlined,
  CheckCircleFilled,
  CheckCircleOutlined,
  HighlightOutlined,
  InteractionOutlined,
  BranchesOutlined,
  DeploymentUnitOutlined,
} from '@ant-design/icons';
import ChangePriority from './ChangePriority';
import styles from '../index.less';
import MarkAsComplete from './MarkAsComplete';
import MarkAsInProcess from './MarkAsInProcess';
import moment from 'moment';
import { ClockFaded } from '@/utils/AppIcons';
import AddFollowUp from './AddFollowUp';
import AssignToOther from './AssignToOther';
import EscalateTask from './EscalateTask';

const TaskQuickActions = ({
  dispatch,
  activityTaskRecord,
  changePriorityLoading,
  markAsCompleteLoading,
  markInProcessLoading,
  activityLoading,
  assignTaskToOthersLoading,
  followUpPopulateLoading,
  singleTaskDetailsLoading,
}) => {
  const [form] = Form.useForm();
  const { quickActionType, taskId, tabName } = useParams();
  const [nextAction, setNextAction] = useState('');
  const [isDepartmentInclude, setIsDepartmentInclude] = useState(false);
  const [isStaffInclude, setIsStaffInclude] = useState(false);
  // eslint-disable-next-line consistent-return
  const getModalUI = () => {
    switch (quickActionType) {
      case 'change-priority':
        return <ChangePriority />;
      case 'mark-as-completed':
        return <MarkAsComplete />;
      case 'mark-as-in-process':
        return <MarkAsInProcess />;
      case 'add-follow-up':
        return <AddFollowUp setNextAction={setNextAction} nextAction={nextAction} />;
      case 'assign-to-other':
        return (
          <AssignToOther
            form={form}
            isDepartmentInclude={isDepartmentInclude}
            setIsDepartmentInclude={setIsDepartmentInclude}
            isStaffInclude={isStaffInclude}
            setIsStaffInclude={setIsStaffInclude}
          />
        );
      case 'escalate-task':
        return (
          <EscalateTask
            form={form}
            isDepartmentInclude={isDepartmentInclude}
            setIsDepartmentInclude={setIsDepartmentInclude}
            isStaffInclude={isStaffInclude}
            setIsStaffInclude={setIsStaffInclude}
          />
        );
      default:
        break;
    }
  };

  // eslint-disable-next-line consistent-return
  const getModalTitle = () => {
    switch (quickActionType) {
      case 'change-priority':
        return (
          <span className="flex items-center py-1 px-2">
            <span className="text-blue-700">
              <HighlightOutlined className="text-4xl mr-2 " />
            </span>

            <div className="flex flex-col">
              <span className="font-semibold text-blue-700">Change priority</span>

              <span className="font-normal text-blue-700 text-sm">update priority </span>
            </div>
          </span>
        );
      case 'mark-as-completed':
        return (
          <span className="flex items-center py-1 px-2">
            <span className="text-blue-700">
              <CheckCircleOutlined className="text-4xl mr-2 " />
            </span>

            <div className="flex flex-col">
              <span className="font-semibold text-blue-700">Mark as completed</span>

              <span className="font-normal text-blue-700 text-sm">
                mark as completed with remarks
              </span>
            </div>
          </span>
        );
      case 'mark-as-in-process':
        return (
          <span className="flex items-center py-1 px-2">
            <span className="text-blue-700">
              <InteractionOutlined className="text-4xl mr-2 " />
            </span>

            <div className="flex flex-col">
              <span className="font-semibold text-blue-700">Mark as in process</span>

              <span className="font-normal text-blue-700 text-sm">
                mark as in process with remarks
              </span>
            </div>
          </span>
        );
      case 'add-follow-up':
        return (
          <span className="flex items-center py-1 px-2">
            <span className="text-blue-700">
              <AppstoreAddOutlined className="mr-2 text-4xl" />
            </span>

            <div className="flex flex-col">
              <span className="font-semibold text-blue-700">Add Followup</span>

              <span className="font-normal text-blue-700 text-sm">add followup with remarks</span>
            </div>
          </span>
        );
      case 'assign-to-other':
        return (
          <span className="flex items-center py-1 px-2">
            <span className="text-blue-700">
              <BranchesOutlined className="mr-2 text-4xl" />
            </span>

            <div className="flex flex-col">
              <span className="font-semibold text-blue-700">Assign to other</span>

              <span className="font-normal text-blue-700 text-sm">assign task to others </span>
            </div>
          </span>
        );
      case 'escalate-task':
        return (
          <span className="flex items-center py-1 px-2">
            <span className="text-blue-700">
              <DeploymentUnitOutlined className="mr-2 text-4xl" />
            </span>

            <div className="flex flex-col">
              <span className="font-semibold text-blue-700">Escalate to other</span>

              <span className="font-normal text-blue-700 text-sm">escalate task </span>
            </div>
          </span>
        );
      default:
        break;
    }
  };
  const updatePriority = (values) => {
    dispatch({
      type: 'tasks/changePriority',
      payload: {
        pathParams: {
          taskId,
        },
        body: values,
      },
    }).then((res) => {
      if (res) {
        history.push(`/tasks/${tabName}`);
        message.success('Priority change successfully');
      }
    });
  };
  const markAsDone = (values) => {
    dispatch({
      type: 'tasks/markAsComplete',
      payload: {
        pathParams: {
          taskId,
        },
        body: values,
      },
    }).then((res) => {
      if (res) {
        history.push(`/tasks/${tabName}`);
        message.success('Marked as complete successfully');
      }
    });
  };
  const markInProcess = (values) => {
    dispatch({
      type: 'tasks/markAsProcess',
      payload: {
        pathParams: {
          taskId,
        },
        body: values,
      },
    }).then((res) => {
      if (res) {
        message.success('Marked as in process successfully');
        history.push(`/tasks/${tabName}`);
      }
    });
  };
  const addFollowUps = (values) => {
    const body = {
      notes: values?.notes,
      lastStatus: values?.lastStatus,
      currentActionMode: values?.currentActionMode,
      nextActionMode: values?.nextActionMode,
      nextFollowUpOn: values?.nextFollowUpOn && values?.nextFollowUpOn?.toISOString(),
      phoneStatus: values?.phoneStatus && values?.phoneStatus,
      meetingLogStatus: values?.meetingLogStatus && values?.meetingLogStatus,
    };

    dispatch({
      type: 'tasks/addFollowUpInTask',
      payload: {
        pathParams: {
          taskId,
        },
        body,
      },
    }).then((res) => {
      if (res) {
        message.success('Add followUp successfully');
        history.push(`/tasks/${tabName}`);
      }
    });
  };
  const assignTaskToOthers = (values) => {
    const departmentObj = {
      id: values?.department,
      members: values?.members?.map((item) => {
        return { id: item };
      }),
    };
    const body = { branch: values?.branch, department: departmentObj };
    dispatch({
      type: 'tasks/assignToOther',
      payload: {
        pathParams: {
          taskId,
        },
        body,
      },
    }).then((res) => {
      if (res) {
        message.success('Task updated successfully');
        history.push(`/tasks/${tabName}`);
      }
    });
  };
  const EscalateTaskToOthers = (values) => {
    const departmentObj = {
      id: values?.department,
      members: values?.members?.map((item) => {
        return { id: item };
      }),
    };
    const body = {
      branch: values?.branch,
      department: departmentObj,
      description: values?.noteInfo,
    };
    dispatch({
      type: 'tasks/assignToOther',
      payload: {
        pathParams: {
          taskId,
        },
        body,
      },
    }).then((res) => {
      if (res) {
        message.success('Task updated successfully');
        history.push(`/tasks/${tabName}`);
      }
    });
  };
  useEffect(() => {
    if (
      quickActionType === 'change-priority' ||
      quickActionType === 'assign-to-other' ||
      quickActionType === 'escalate-task'
    ) {
      dispatch({
        type: 'tasks/singleTaskDetail',
        payload: {
          pathParams: {
            taskId,
          },
        },
      }).then((res) => {
        if (quickActionType === 'change-priority') {
          form.setFieldsValue({
            priorityTypeId: res?.priority,
          });
        }
        if (quickActionType === 'assign-to-other' || quickActionType === 'escalate-task') {
          form.setFieldsValue({
            branch: { id: res?.branch?.id },
          });
          if (res?.department) {
            setIsDepartmentInclude(true);
            form.setFieldsValue({
              department: res?.department?.id,
              isDepartmentInclude: true,
            });
            dispatch({
              type: 'tasks/getStaffList',
              payload: {
                pathParams: {
                  departmentId: res?.department?.id,
                },
                query: {
                  veiwSize: 1000,
                },
              },
            }).then((response) => {
              if (response) {
                if (res?.department?.members) {
                  const members = res?.department?.members?.map((item) => item?.id);
                  setIsStaffInclude(true);
                  form.setFieldsValue({
                    members,
                    isStaffInclude: true,
                  });
                }
              }
            });
          }
        }
      });
    }
    if (quickActionType === 'add-follow-up') {
      dispatch({
        type: 'tasks/getFollowUpInTask',
        payload: {
          query: {
            taskId,
          },
        },
      }).then((res) => {
        if (res?.records?.length > 0) {
          form?.setFieldsValue({
            currentActionMode: res?.records[0]?.nextActionId,
            lastStatus: res?.records[0]?.lastStatus,
          });
          setNextAction(res?.records[0]?.nextActionId);
        }
      });
    }
    if (quickActionType === 'activity-logs') {
      dispatch({
        type: 'tasks/getTaskActivity',
        payload: {
          pathParams: {
            taskId,
          },
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);
  const updateTaskInfo = (values) => {
    if (quickActionType === 'change-priority') updatePriority(values);
    else if (quickActionType === 'mark-as-completed') markAsDone(values);
    else if (quickActionType === 'mark-as-in-process') markInProcess(values);
    else if (quickActionType === 'add-follow-up') addFollowUps(values);
    else if (quickActionType === 'assign-to-other') assignTaskToOthers(values);
    else if (quickActionType === 'escalate-task') EscalateTaskToOthers(values);
  };

  return (
    <>
      <Modal
        centered
        wrapClassName="app-modal-flat"
        destroyOnClose
        width={quickActionType === 'add-follow-up' ? 520 : 500}
        className={`${styles.modalHeader}`}
        keyboard={false}
        maskClosable={false}
        title={getModalTitle()}
        visible={quickActionType !== undefined && quickActionType !== 'activity-logs'}
        onCancel={() => {
          history.push(`/tasks/${tabName}`);
        }}
        footer={
          <div>
            <Button
              key="submit"
              type="primary"
              loading={
                changePriorityLoading ||
                markAsCompleteLoading ||
                markInProcessLoading ||
                assignTaskToOthersLoading
              }
              onClick={() => form?.submit()}
            >
              {'Update'}
            </Button>
          </div>
        }
      >
        <Spin
          spinning={Boolean(
            followUpPopulateLoading ||
              changePriorityLoading ||
              markAsCompleteLoading ||
              markInProcessLoading ||
              assignTaskToOthersLoading ||
              singleTaskDetailsLoading,
          )}
        >
          <Form form={form} onFinish={(values) => updateTaskInfo(values)}>
            {getModalUI()}
          </Form>
        </Spin>
      </Modal>
      {/* Activity logs */}
      <Drawer
        title={
          <div className="items-start flex">
            <div className="mr-2 -mt-0.5  pr-2">
              <AuditOutlined style={{ color: 'rgb(30, 58, 138)', fontSize: '20px' }} />
            </div>
            <div>
              <span className="text-base font-semibold text-blue-900">Activity logs</span>
              <div className="text-sm font-normal text-gray-500">Task activities here</div>
            </div>
          </div>
        }
        headerStyle={{ padding: '10px 10px', outline: 'none' }}
        visible={quickActionType === 'activity-logs'}
        width={700}
        drawerStyle={{ padding: '0px' }}
        onClose={() => history?.push(`/tasks/${tabName}`)}
        maskClosable={false}
      >
        <Spin spinning={activityLoading}>
          <Timeline className="w-full">
            {activityTaskRecord?.taskActivities?.map((rec, i) => (
              <div key={i} className="flex">
                <div style={{ flexWrap: 'wrap' }} className="mr-4 mt-2">
                  <span className="w-max flex">
                    <div className="mt-1 mr-1">
                      <ClockFaded />
                    </div>
                    <div>{moment(rec?.startTime).format('MMM D, YYYY')}</div>{' '}
                  </span>

                  <div className="ml-5">at {moment(rec?.startTime).format('h:mm A')}</div>
                </div>
                <Timeline.Item
                  className="w-full"
                  key={i}
                  dot={<CheckCircleFilled className="text-2xl" />}
                  style={{
                    marginTop: 20,
                  }}
                >
                  <div className="border-2 rounded-lg -mt-2 flex">
                    <div className="mx-2 mt-2">
                      <p className="mb-2">{rec?.description}</p>
                    </div>
                    <p className="mx-2 mt-2 mb-2 text-gray-500" style={{ whiteSpace: 'nowrap' }}>
                      {moment(rec?.startTime)?.fromNow()}
                    </p>
                  </div>
                </Timeline.Item>
              </div>
            ))}
          </Timeline>
        </Spin>
      </Drawer>
    </>
  );
};

export default connect(({ tasks, loading }) => ({
  activityTaskRecord: tasks?.activityTaskRecord,
  changePriorityLoading: loading?.effects['tasks/changePriority'],
  markAsCompleteLoading: loading?.effects['tasks/markAsComplete'],
  markInProcessLoading: loading?.effects['tasks/markAsProcess'],
  activityLoading: loading?.effects['tasks/getTaskActivity'],
  assignTaskToOthersLoading: loading?.effects['tasks/assignToOther'],
  followUpPopulateLoading: loading?.effects['tasks/getFollowUpInTask'],
  singleTaskDetailsLoading: loading?.effects['tasks/singleTaskDetail'],
}))(TaskQuickActions);
