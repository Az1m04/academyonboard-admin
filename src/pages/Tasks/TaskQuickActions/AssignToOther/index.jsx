import React from 'react';
import { connect } from 'umi';
import { getInitials } from '@/utils/common';
import { Avatar, Checkbox, Col, Form, Popover, Row, Select } from 'antd';

const AssignToOther = ({
  dispatch,
  form,
  staffList,
  departmentList,
  branchList,
  isDepartmentInclude,
  setIsDepartmentInclude,
  setIsStaffInclude,
  isStaffInclude,
}) => {
  return (
    <>
      <div className="flex">
        <Form.Item name="isDepartmentInclude" valuePropName="checked" noStyle>
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
          <Form.Item name="isStaffInclude" valuePropName="checked" noStyle>
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
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
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
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
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
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <div>
                <p className="text-sm font-semibold">Select staff</p>
                <Form.Item name={'members'}>
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
                          content={itemStaff?.displayName}
                          {...props}
                        >
                          <div>
                            <Avatar
                              src={itemStaff?.photoUrl}
                              alt={itemStaff?.displayName && getInitials(itemStaff?.displayName)}
                              size={30}
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
                                <Avatar
                                  src={itemStaff?.photoUrl}
                                  alt={
                                    itemStaff?.displayName && getInitials(itemStaff?.displayName)
                                  }
                                  size={30}
                                />
                              </div>
                            ) : (
                              <Avatar className="uppercase text-gray-900 font-medium" size={30}>
                                <p className="text-gray-900 text-xs pt-2">
                                  {itemStaff?.displayName && getInitials(itemStaff?.displayName)}
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
    </>
  );
};

export default connect(({ tasks }) => ({
  branchList: tasks?.branchList,
  departmentList: tasks?.departmentList,
  staffList: tasks?.staffList,
}))(AssignToOther);
