/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { connect } from 'umi';
import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Select, Button, message } from 'antd';

const AssignIndividual = ({
  dispatch,
  departmentList,
  currentUser,
  clientList,
  staffList,
  loading,
  editLead,
  getDepartmentStaffList,
}) => {
  const [form] = Form.useForm();
  const { Option } = Select;
  // eslint-disable-next-line no-unused-vars
  const [viewSize, setViewSize] = useState(10);
  const [startIndex, setStartIndex] = useState(0);
  const [branchId, setBranchId] = useState();
  useEffect(() => {
    dispatch({
      type: 'staff/getDepartmentList',
      payload: {
        query: {
          viewSize,
        },
      },
    });
    if (editLead?.record?.referBy?.department?.id) {
      dispatch({
        type: 'staff/getDepartmentStaffList',
        payload: {
          pathParams: { depId: editLead?.record?.referBy?.department?.id },
        },
      }).catch(() => {});
    }

    dispatch({
      type: 'leads/getClientList',
      payload: {
        query: {
          isAccepted: true,
          clientId: 'OMG',
          viewSize,
          startIndex,
        },
      },
    }).catch(() => {});

    form.setFieldsValue({
      department: editLead?.record?.referBy?.department?.id,
      assignee: editLead?.record?.assignee?.id,
    });
  }, []);

  useEffect(() => {
    if (branchId) {
      dispatch({
        type: 'leads/getAssignList',
        payload: {
          pathParams: {
            orgId: currentUser?.personalDetails?.organizationDetails?.orgPartyGroupId,
          },
        },
      });
    }
  }, [branchId]);

  return (
    <div className="mx-4">
      <Form
        layout="vertical"
        hideRequiredMark
        size="large"
        form={form}
        onFinish={(values) => {
          const body = {
            id: editLead?.leadId,
            assignee: {
              id: values?.assignee,
            },
          };
          dispatch({
            type: 'leads/assignIndividualLead',
            payload: { body: [body] },
          })
            .then((res) => {
              if (res?.isAssigned === 'ok') {
                message.success('Assign lead successfully');
                form.resetFields();
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
              }
            })
            .catch(() => {});
        }}
      >
        <div className="py-4">
          <Row gutter={[12, 0]}>
            <Col span={24}>
              <div className="">Select branch</div>
              <Form.Item name="branch">
                <Select
                  size="large"
                  className="w-full"
                  onSelect={(val) => {
                    setBranchId(val);
                  }}
                  placeholder="Select branch here"
                >
                  {clientList?.records?.map((val) => (
                    <Option key={val?.id} value={val?.id}>
                      {val?.clientName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <div className="">Select department</div>
              <Form.Item
                name="department"
                rules={[{ required: true, message: 'Please select department' }]}
              >
                <Select
                  size="large"
                  className="w-full"
                  placeholder="Select department here"
                  onChange={(val) => {
                    dispatch({
                      type: 'staff/getDepartmentStaffList',
                      payload: {
                        pathParams: { depId: val },
                      },
                    });
                    form.setFieldsValue({
                      assignee: undefined,
                    });
                  }}
                >
                  {departmentList?.records?.map((val) => (
                    <Option key={val?.id} value={val?.id}>
                      {val?.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <div className="">Select assignee</div>
              <Form.Item
                name="assignee"
                rules={[{ required: true, message: 'Please select assignee' }]}
              >
                <Select size="large" className="w-full" placeholder="Select assignee name here">
                  {getDepartmentStaffList?.members?.map((val) => (
                    <Option key={val?.id} value={val?.id}>
                      {val?.displayName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <div className="flex justify-end">
            <div>
              <Button
                type="link"
                onClick={() => {
                  form.resetFields();
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
                }}
              >
                Cancel
              </Button>
            </div>
            <div>
              <Button type="primary" htmlType="submit" loading={loading}>
                Save
              </Button>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default connect(({ staff, leads, user, loading }) => ({
  departmentList: staff.departmentList,
  clientList: leads.clientList,
  editLead: leads.editLead,
  clientLeadData: leads.clientLeadData,
  assignList: leads.assignList,
  staffList: staff.staffList,
  getDepartmentStaffList: staff.getDepartmentStaffList,
  currentUser: user?.currentUser,
  loading: loading?.effects['leads/assignIndividualLead'],
}))(AssignIndividual);
