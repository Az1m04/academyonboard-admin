import { AppstoreAddOutlined } from '@ant-design/icons';
import {
  AutoComplete,
  DatePicker,
  Form,
  Input,
  Modal,
  Radio,
  Select,
  Button,
  Col,
  Row,
  Checkbox,
  message,
  Switch,
  Spin,
} from 'antd';
import { connect, useParams } from 'umi';
import React, { useEffect, useState } from 'react';

const AddLeadFollowUps = ({
  setAddFollowUpsModal,
  addFollowUpsModal,
  dispatch,
  clientList,
  getDepartmentStaffList,
  currentUser,
  lastStatusList,
  departmentList,
  getLeadFollowUpRecord,
  createLoading,
  isInterested,
  setIsInterested,
  addFollowUpsForm,
  setAssignee,
  assignee,
  editFollowUp,
  setEditFollowUp,
  singleGetFollowUp,
  updateFollowUpLoading,
  nextAction,
  setNextAction,
}) => {
  const [branchId, setBranchId] = useState();

  const { Option } = Select;

  const { leadId } = useParams();

  const phoneStatus = [
    {
      name: 'Answered',
      value: 'ANSWERED',
    },
    {
      name: 'Not picked',
      value: 'NOT_PICKED',
    },
    {
      name: 'Not reachable',
      value: 'NOT_REACHABLE',
    },
    {
      name: 'Switch off',
      value: 'SWITCH_OFF',
    },
  ];

  const meetingStatus = [
    {
      name: 'Meeting done',
      value: 'MEETING_DONE',
    },
    {
      name: 'Meeting not done',
      value: 'MEETING_NOT_DONE',
    },
    {
      name: 'Meeting canceled',
      value: 'MEETING_CANCELED',
    },
  ];

  const list = [
    {
      name: 'EMPLOYEE',
      value: currentUser?.personalDetails?.id,
    },
    {
      name: 'LEAD_STUDENT',
      value: leadId,
    },
  ];

  const arrayOfInteractions = [
    { label: 'Phone', value: 'WEPT_TASK_PHONE_CALL' },
    {
      label: 'Text message',
      value: 'WEPT_TASK_TEXT_MSG',
    },
    {
      label: 'Whatsapp message',
      value: 'WEPT_TASK_WATSAP_MSG',
    },
    {
      label: 'Email',
      value: 'WEPT_TASK_EMAIL',
    },
    {
      label: 'Visited office',
      value: 'WEPT_TASK_VISIT',
    },
    {
      label: 'Meeting',
      value: 'WEPT_TASK_MEETING',
    },
    {
      label: 'Others',
      value: 'WEPT_TASK_OTHERS',
    },
  ];
  const options = [
    { label: 'Positive', value: 'POSITIVE' },
    { label: 'Negative', value: 'NEGATIVE' },
    { label: 'No feedback', value: 'NO_FEEDBACK' },
  ];
  useEffect(() => {
    dispatch({
      type: 'staff/getDepartmentList',
      payload: {
        query: {
          viewSize: 10000,
        },
      },
    });

    dispatch({
      type: 'leads/getClientList',
      payload: {
        query: {
          isAccepted: true,
          clientId: 'OMG',
        },
      },
    }).catch(() => {});

    dispatch({
      type: 'leads/getLastStatusList',
      payload: {},
    });
  }, [dispatch, editFollowUp]);
  useEffect(() => {
    if (branchId) {
      dispatch({
        type: 'leads/getAssignList',
        payload: {
          pathParams: {
            orgId: currentUser?.personalDetails?.firstName,
          },
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchId]);

  const onCommentFinish = (value) => {
    const data = {
      ...value,

      department: {
        id: value?.selectDepartment || '',
        members: value?.selectAssign?.map((item) => {
          return { id: item };
        }) || [{ id: '' }],
      },
      nextFollowUpOn: value?.nextFollowUpOn?.toISOString(),
      roleTypeId: list?.find((val) => val?.value === value?.followUpBy?.id)?.name,
    };

    if (!assignee) {
      delete data.department;
    }

    if (!isInterested) {
      delete data.department;
      delete data.followUpOn;
    }

    delete data.selectAssign;
    delete data.selectDepartment;

    if (!data?.branch?.id) {
      delete data?.branch?.id;
    }
    dispatch({
      type: 'leads/addFollowUp',
      payload: {
        body: data,
        pathParams: {
          leadId,
        },
        query: { isInterested },
      },
    }).then((res) => {
      if (res?.status === 'ok') {
        message.success('Follow up is added successfully');
        dispatch({
          type: 'leads/setStates',
          payload: {
            visible: false,
            type: null,
            title: null,
            leadId: null,
          },
          key: 'editLead',
        });
        setAddFollowUpsModal(false);
        addFollowUpsForm.resetFields();
        setAssignee(false);
        getLeadFollowUpRecord();
        setNextAction('');
      } else {
        message.error('Something went wrong');
      }
    });
    setEditFollowUp(false);
  };
  const updateLeadFollowUp = (value) => {
    const data = {
      ...value,

      department: {
        id: value?.selectDepartment || '',
        members: value?.selectAssign?.map((item) => {
          return { id: item };
        }) || [{ id: '' }],
      },
      nextFollowUpOn: value?.nextFollowUpOn?.toISOString(),
      roleTypeId: list?.find((val) => val?.value === value?.followUpBy?.id)?.name,
    };

    if (!assignee) {
      delete data.department;
    }

    if (!isInterested) {
      delete data.department;
      delete data.followUpOn;
    }

    delete data.selectAssign;
    delete data.selectDepartment;

    if (!data?.branch?.id) {
      delete data?.branch?.id;
    }
    dispatch({
      type: 'leads/updateFollowUp',
      payload: {
        body: data,
        pathParams: {
          leadId,
          followUpId: singleGetFollowUp?.id,
        },
        // query: { isInterested },
      },
    }).then((res) => {
      if (res?.status === 'ok') {
        message.success('Follow up is updated successfully');
        dispatch({
          type: 'leads/setStates',
          payload: {
            visible: false,
            type: null,
            title: null,
            leadId: null,
          },
          key: 'editLead',
        });
        setAddFollowUpsModal(false);
        addFollowUpsForm.resetFields();
        setAssignee(false);
        getLeadFollowUpRecord();
        setEditFollowUp(false);
        setNextAction('');
      } else {
        message.error('Something went wrong');
      }
    });
  };

  return (
    <div>
      <Modal
        title={
          <div className="border-b pb-3">
            <span className="flex items-center gap-2">
              <span className="" style={{ color: 'rgba(30,58,138)' }}>
                <AppstoreAddOutlined className=" text-4xl" style={{ color: 'rgba(30,58,138)' }} />
              </span>
              <div className="flex flex-col">
                <span className="font-semibold " style={{ color: 'rgba(30,58,138)' }}>
                  {editFollowUp ? 'Update' : 'Add'} follow up
                </span>
                <span className="font-normal  text-sm" style={{ color: 'rgba(30,58,138)' }}>
                  {editFollowUp ? 'Update' : 'Add'} follow up for the lead here
                </span>
              </div>
            </span>
          </div>
        }
        onCancel={() => {
          setAddFollowUpsModal(false);
          setEditFollowUp(false);
          addFollowUpsForm.resetFields();
        }}
        visible={addFollowUpsModal}
        footer={
          <>
            <Button
              onClick={() => {
                setEditFollowUp(false);
                setAddFollowUpsModal(false);

                addFollowUpsForm.resetFields();
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              loading={createLoading}
              onClick={() => addFollowUpsForm.submit()}
            >
              {editFollowUp ? 'Update' : 'Add'}
            </Button>
          </>
        }
        maskClosable={false}
      >
        <Spin spinning={Boolean(updateFollowUpLoading || updateFollowUpLoading)}>
          <Form
            form={addFollowUpsForm}
            onFinish={(val) => {
              if (editFollowUp) {
                updateLeadFollowUp(val);
              } else {
                onCommentFinish(val);
              }
            }}
          >
            <div className="">
              <div className={`px-4 rounded-lg w-full `}>
                <div className="mt-2">
                  <p className="text-xs font-semibold">Select Current action</p>
                  <Form.Item
                    name={['followUpBy', 'id']}
                    initialValue={currentUser?.personalDetails?.id}
                  >
                    <Radio.Group defaultValue={currentUser?.personalDetails?.id}>
                      {list?.map((item) => (
                        <Radio key={item?.value} value={item?.value}>
                          By{' '}
                          {item?.name === 'EMPLOYEE'
                            ? currentUser?.personalDetails?.displayName
                            : 'Student'}
                        </Radio>
                      ))}
                    </Radio.Group>
                  </Form.Item>
                </div>
                <div className="flex justify-end">
                  <p className="mr-2 text-xs font-semibold">Not interested</p>
                  <Switch
                    checked={!isInterested}
                    size="small"
                    onChange={(val) => {
                      setIsInterested(!val);
                      addFollowUpsForm.resetFields();
                      setAssignee(false);
                    }}
                  />
                </div>
                <p className="text-xs font-semibold">Current action</p>
                <Form.Item
                  name="currentActionMode"
                  rules={[{ required: true, message: 'Please select current action' }]}
                >
                  <Select
                    placeholder="Select current action"
                    onChange={(value) => {
                      setNextAction(value);
                    }}
                    value={nextAction}
                  >
                    {arrayOfInteractions?.map((type) => (
                      <Select.Option key={type?.value} value={type?.value}>
                        {type?.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              {nextAction === 'WEPT_TASK_PHONE_CALL' && (
                <div className="px-4 pb-4">
                  <Form.Item noStyle initialValue={'ANSWERED'} name={'phoneLogStatus'}>
                    <Radio.Group>
                      {phoneStatus?.map((item) => (
                        <Radio key={item?.name} value={item?.value}>
                          {item?.name}
                        </Radio>
                      ))}
                    </Radio.Group>
                  </Form.Item>
                </div>
              )}
              {nextAction === 'WEPT_TASK_MEETING' && (
                <div className="px-4 pb-4">
                  <Form.Item noStyle initialValue={'MEETING_DONE'} name={'meetingStatus'}>
                    <Radio.Group>
                      {meetingStatus?.map((item) => (
                        <Radio key={item?.name} value={item?.value}>
                          {item?.name}
                        </Radio>
                      ))}
                    </Radio.Group>
                  </Form.Item>
                </div>
              )}
              {!isInterested && (
                <>
                  <div className="px-4">
                    <span className="text-xs font-semibold">Add feedback (Optional)</span>
                    <Form.Item name="comment">
                      <Input
                        style={{ marginTop: '0.3rem', borderRadius: '0.3rem' }}
                        size="middle"
                        placeholder="Add feedback"
                      />
                    </Form.Item>
                    <Form.Item name="feedBackType" initialValue="POSITIVE">
                      <Radio.Group options={options} />
                    </Form.Item>
                  </div>
                  <div className="px-4 py-4">
                    <span className="text-xs font-semibold">Last status</span>
                    <Form.Item
                      name="lastStatus"
                      rules={[{ required: true, message: 'Please add last status!' }]}
                    >
                      <AutoComplete
                        style={{ marginTop: '0.3rem', borderRadius: '0.3rem' }}
                        size="middle"
                        options={lastStatusList?.statusList?.map((val) => ({
                          label: val,
                          value: val,
                        }))}
                        getPopupContainer={(node) => node.parentNode}
                      >
                        <Input className="w-full" size="middle" placeholder="Enter last status" />
                      </AutoComplete>
                    </Form.Item>
                  </div>
                </>
              )}
              {isInterested && (
                <>
                  <div className={`px-4 rounded-lg w-full `}>
                    <p className="text-xs font-semibold">Next action</p>
                    <Form.Item
                      name="nextActionMode"
                      rules={[{ required: true, message: 'Please select next action' }]}
                    >
                      <Select
                        placeholder="Select next action"
                        getPopupContainer={(node) => node.parentNode}
                      >
                        {arrayOfInteractions?.map((type) => (
                          <Option key={type.value}>{type.label}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>

                  <div className=" px-4 ">
                    <div>
                      <p className="text-xs font-semibold">Next follow up date time</p>
                      <Form.Item
                        name="nextFollowUpOn"
                        rules={[{ required: true, message: 'Please select folow up date' }]}
                      >
                        <DatePicker
                          style={{ borderRadius: '0.3rem', width: '100%' }}
                          allowClear={false}
                          use12Hours={true}
                          showTime
                          format="DD-MM-YYYY HH:mm"
                          size="middle"
                          placeholder="Please select"
                          getPopupContainer={(node) => node.parentNode}
                        />
                      </Form.Item>
                    </div>
                  </div>
                  <div className="px-4">
                    <span className="text-xs font-semibold">Add remarks(optional)</span>
                    <Form.Item name="notes">
                      <Input
                        style={{ marginTop: '0.3rem', borderRadius: '0.3rem' }}
                        size="middle"
                        placeholder="add remarks"
                      />
                    </Form.Item>
                  </div>
                  <div className="px-4 ">
                    <span className="text-xs font-semibold">Last status</span>
                    <Form.Item
                      name="lastStatus"
                      rules={[{ required: true, message: 'Please select last status' }]}
                    >
                      <AutoComplete
                        style={{ marginTop: '0.3rem', borderRadius: '0.3rem' }}
                        size="middle"
                        options={lastStatusList?.statusList?.map((val) => ({
                          label: val,
                          value: val,
                        }))}
                      >
                        <Input className="w-full" size="middle" placeholder="Enter last status" />
                      </AutoComplete>
                    </Form.Item>
                  </div>
                  <div className="flex px-4 items-center pb-4">
                    {/* the assignee flow is not complete need to fetch department by branch then members by department */}
                    <Checkbox
                      onChange={(val) => setAssignee(val?.target?.checked)}
                      checked={assignee}
                    >
                      <span className="font-bold">Add assignee</span>
                    </Checkbox>
                  </div>
                  {assignee === true && (
                    <div className=" px-4 ">
                      <Row gutter={16} className={`flex`}>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                          <div>
                            {' '}
                            <p className="text-xs font-semibold">Select branch</p>
                            <Form.Item
                              name={['branch', 'id']}
                              rules={[{ required: true, message: 'Please select branch!' }]}
                            >
                              <Select
                                placeholder="Please select branch"
                                className="w-full"
                                onSelect={(val) => {
                                  setBranchId(val);
                                }}
                                getPopupContainer={(node) => node.parentNode}
                              >
                                {clientList?.records?.map((val) => (
                                  <Option key={val?.id} value={val?.id}>
                                    {' '}
                                    {val?.clientName}
                                  </Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </div>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                          <div>
                            <p className="text-xs font-semibold">Select department</p>
                            <Form.Item
                              name="selectDepartment"
                              rules={[{ required: true, message: 'Please select department!' }]}
                            >
                              <Select
                                placeholder="Please select departments"
                                getPopupContainer={(node) => node.parentNode}
                                onChange={(val) => {
                                  dispatch({
                                    type: 'staff/getDepartmentStaffList',
                                    payload: {
                                      pathParams: { depId: val },
                                    },
                                  });
                                  addFollowUpsForm.setFieldsValue({
                                    selectAssign: undefined,
                                  });
                                }}
                              >
                                {departmentList?.records?.map((val) => (
                                  <Option key={val.id}>{val.name}</Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </div>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                          <div>
                            <p className="text-xs font-semibold">Select Assignee</p>
                            <Form.Item
                              name={'selectAssign'}
                              rules={[{ required: true, message: 'Please select assignee!' }]}
                            >
                              <Select
                                placeholder="Please select assignees"
                                getPopupContainer={(node) => node.parentNode}
                                mode="multiple"
                              >
                                {getDepartmentStaffList?.members?.map((val) => (
                                  <Option key={val?.id} value={val?.id}>
                                    {val?.displayName}
                                  </Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  )}
                </>
              )}
            </div>
          </Form>
        </Spin>
      </Modal>
    </div>
  );
};

export default connect(({ leads, staff, user, loading }) => ({
  clientList: leads?.clientList,
  getDepartmentStaffList: staff?.getDepartmentStaffList,
  currentUser: user?.currentUser,
  lastStatusList: leads?.lastStatusList,
  departmentList: staff?.departmentList,
  createLoading: loading?.effects['leads/addFollowUp'],
  updateFollowUpLoading: loading?.effects['leads/updateFollowUp'],
}))(AddLeadFollowUps);
