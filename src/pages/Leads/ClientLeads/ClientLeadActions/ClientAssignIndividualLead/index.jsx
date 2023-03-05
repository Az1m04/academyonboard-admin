import React, { useEffect, useState } from 'react';
import { Button, Col, Form, message, Row, Select } from 'antd';
import { connect } from 'umi';

const ClientAssignIndividualLead = ({
  actionKey,
  setActionKey,
  clientList,
  dispatch,
  departmentList,
  loading,
  leadData,
  currentUser,
  getDepartmentStaffList,
}) => {
  const [form] = Form.useForm();
  const { Option } = Select;
  // eslint-disable-next-line no-unused-vars
  const [branchId, setBranchId] = useState();
  useEffect(() => {
    const record = leadData?.find((lead) => lead?.id === actionKey?.id);
    dispatch({
      type: 'staff/getDepartmentList',
      payload: {
        query: {
          viewSize: 1000,
        },
      },
    });
    if (record?.referBy?.department?.id) {
      dispatch({
        type: 'staff/getDepartmentStaffList',
        payload: {
          pathParams: { depId: record?.referBy?.department?.id },
        },
      }).catch(() => {});
    }

    dispatch({
      type: 'leads/getClientList',
      payload: {
        query: {
          isAccepted: true,
          clientId: 'OMG',
          viewSize: 10000,
          startIndex: 0,
        },
      },
    }).catch(() => {});
    form.setFieldsValue({
      department: record?.referBy?.department?.id,
      assignee: record?.assignee?.id,
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
    <div>
      <div className="mx-4">
        <Form
          layout="vertical"
          hideRequiredMark
          size="large"
          form={form}
          onFinish={(values) => {
            const body = {
              id: actionKey?.id,
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
                  setActionKey({ id: null, title: null, subTitle: null, key: null });
                }
              })
              .catch(() => {});
          }}
        >
          <div className="py-4">
            <Row gutter={[12, 0]}>
              <Col span={24}>
                <div className="formLabel">Select branch</div>
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
                <div className="formLabel">Select department</div>
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
                <div className="formLabel">Select assignee</div>
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
                    setActionKey({ id: null, title: null, subTitle: null, key: null });
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
    </div>
  );
};

export default connect(({ staff, leads, user, loading }) => ({
  departmentList: staff?.departmentList,
  clientList: leads?.clientList,
  clientLeadData: leads?.clientLeadData,
  assignList: leads?.assignList,
  staffList: staff?.staffList,
  getDepartmentStaffList: staff?.getDepartmentStaffList,
  currentUser: user?.currentUser,
  loading: loading?.effects['leads/assignIndividualLead'],
  leadData: leads?.clientLeadData?.records,
}))(ClientAssignIndividualLead);
