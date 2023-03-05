/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Modal, Form, Row, Col, Select, Button, message } from 'antd';
import { connect } from 'umi';

const { Option } = Select;

const AssigneeModal = ({
  visible,
  setVisible,
  dispatch,
  departmentList,
  clientList,
  clientLeadData,
  assignList,
  currentUser,
  getDepartmentStaffList,
  selectedRows,
}) => {
  const [form] = Form.useForm();
  const [viewSize, setViewSize] = useState(10);
  const [startIndex, setStartIndex] = useState(0);
  const [branchId, setBranchId] = useState();
  useEffect(() => {
    if (visible) {
      dispatch({
        type: 'staff/getDepartmentList',
        payload: {
          query: {
            viewSize,
          },
        },
      }).catch(() => {});

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
      dispatch({
        type: 'staff/getStaffList',
        payload: {
          query: {
            statusId: 'PARTYINV_ACCEPTED',
            viewSize: 1000,
            showAdmin: true,
          },
        },
      }).catch(() => {});
    }
  }, [visible, dispatch]);

  useEffect(() => {
    if (branchId) {
      dispatch({
        type: 'leads/getAssignList',
        pathParams: {
          orgId: currentUser?.personalDetails?.organizationDetails?.orgPartyGroupId,
        },
      }).catch(() => {});
    }
  }, [branchId]);

  return (
    <Modal
      title={<div className="text-gray-500">Mass assign leads</div>}
      visible={visible}
      onCancel={() => {
        setVisible(false);
      }}
      footer={null}
    >
      <Form
        layout="vertical"
        hideRequiredMark
        size="large"
        form={form}
        onFinish={(values) => {
          let body = [];
          if (selectedRows?.length > 0) {
            body = selectedRows?.map((item) => {
              return {
                id: item?.id,
                assignee: {
                  id: values?.assignee,
                },
              };
            });
            dispatch({
              type: 'leads/assignIndividualLead',
              payload: { body },
            })
              .then((res) => {
                if (res) {
                  message.success('Assign lead successfully');
                  setVisible(false);
                }
              })
              .catch(() => {
                // catch errors silently
              });
          }
        }}
      >
        <div className="py-4">
          <Row gutter={[12, 0]}>
            <Col span={24}>
              <div className="text-gray-400">Select branch</div>
              <Form.Item name="branch">
                <Select
                  size="large"
                  className="w-full"
                  onSelect={(val) => {
                    setBranchId(val);
                  }}
                  getPopupContainer={(node) => node.parentNode}
                  placeholder="please select branch"
                >
                  {clientList?.records?.map((val) => (
                    <Option key={val.id} value={val.id}>
                      {' '}
                      {val.clientName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <div className="text-gray-400">Select department</div>
              <Form.Item name="department">
                <Select
                  size="large"
                  className="w-full"
                  placeholder="Please select departments"
                  onChange={(val) => {
                    dispatch({
                      type: 'staff/getDepartmentStaffList',
                      payload: {
                        pathParams: { depId: val },
                      },
                    });
                    form.setFieldsValue({
                      selectAssign: undefined,
                    });
                  }}
                  getPopupContainer={(node) => node.parentNode}
                >
                  {departmentList?.records?.map((val) => (
                    <Option key={val.id} value={val.id}>
                      {val.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <div className="text-gray-400">Select assignee</div>
              <Form.Item name="assignee">
                <Select
                  size="large"
                  className="w-full"
                  placeholder="Please select assignees"
                  getPopupContainer={(node) => node.parentNode}
                >
                  {getDepartmentStaffList?.members?.map((val) => (
                    <Option key={val.id} value={val.id}>
                      {val.displayName}
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
                  setVisible(false);
                }}
              >
                Cancel
              </Button>
            </div>
            <div>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </div>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default connect(({ leads, staff, user }) => ({
  departmentList: staff.departmentList,
  clientList: leads.clientList,
  clientLeadData: leads.clientLeadData,
  assignList: leads.assignList,
  currentUser: user?.currentUser,
  staffList: staff?.staffList,
  getDepartmentStaffList: staff.getDepartmentStaffList,
}))(AssigneeModal);
