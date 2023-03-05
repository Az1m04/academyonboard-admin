import PhoneNumber from '@/components/PhoneNumber';
import {
  Row,
  Form,
  Col,
  Input,
  DatePicker,
  Select,
  Button,
  TimePicker,
  Divider,
  Checkbox,
  AutoComplete,
} from 'antd';
import { connect } from 'umi';
import React, { useEffect, useState } from 'react';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { currencyFormatter, currencyParser } from '@/utils/utils';
import { callApi } from '@/utils/apiUtils';
import { debounce } from 'lodash-es';

const { Option } = Select;
const JobInformation = ({
  form,
  departmentList,
  changedField,
  dispatch,
  staffList,
  setselectedDepartment,
}) => {
  useEffect(() => {
    form.setFieldsValue({
      jobInformation: { allowance: [undefined], flexiTime: [undefined] },
    });
  }, [form]);

  const [salaryToggle, setSalaryToggle] = useState(null);

  const extraSalaryBonus = [
    { label: 'Incentive', value: 'incentive' },
    { label: 'Allowance', value: 'allowance' },
  ];
  const getDepartmentList = () =>
    dispatch({
      type: 'staff/getDepartmentList',
      payload: {
        query: {
          viewSize: 10000,
        },
      },
    }).catch(() => {});

  const getStaffList = (key) =>
    dispatch({
      type: 'staff/getStaffList',
      payload: {
        query: {
          statusId: 'PARTYINV_ACCEPTED',
          showAdmin: true,
          viewSize: 10000,
          keyword: key,
        },
      },
    }).catch(() => {});

  const debounceSearch = debounce(getStaffList, 400);

  useEffect(() => {
    getStaffList('');
    getDepartmentList();
  }, []);

  return (
    <div>
      <Row gutter={16} align="middle">
        <Col xs={24} sm={18} md={12} lg={6} xl={6}>
          <p className="font-medium text-gray-800"> Title/Designation</p>
          <Form.Item
            name={['jobInformation', 'designation']}
            rules={[
              {
                required: true,
                message: 'Please enter title/designation',
              },
            ]}
          >
            <Input size="large" placeholder="Enter title/designation" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={18} md={12} lg={6} xl={6}>
          <p className="font-medium text-gray-800">Department</p>
          <div className="hidden">
            {/* This field is used for keeping the track of selected department */}
            <Form.Item name={['jobInformation', 'department', 'id']}></Form.Item>
          </div>
          <Form.Item
            name="departmentInput"
            rules={[
              {
                required: true,
                message: 'Please enter department',
              },
            ]}
          >
            <AutoComplete
              size="large"
              placeholder="Please select or enter department"
              onChange={(ev) => {
                setselectedDepartment(ev);
                if (departmentList?.records?.find((data) => data?.id === ev)?.id === undefined)
                  form.setFieldsValue({
                    jobInformation: {
                      department: {
                        id: ev,
                      },
                    },
                    departmentInput: ev,
                  });
              }}
              onSelect={(ev) => {
                form.setFieldsValue({
                  jobInformation: {
                    department: {
                      id: ev,
                    },
                  },
                  departmentInput: departmentList?.records?.find((data) => data?.id === ev)?.name,
                });
              }}
              options={departmentList?.records?.map((data) => ({
                label: data?.name,
                value: data?.id,
              }))}
              filterOption="label"
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={18} md={12} lg={6} xl={6}>
          <p className="font-medium text-gray-800">Supervisor/Manager</p>
          <Form.Item
            name={['jobInformation', 'reportsTo', 'id']}

            // rules={[
            //   {
            //     required: true,
            //     message: 'Please enter supervisor/manager',
            //   },
            // ]}
          >
            <Select
              size="large"
              placeholder="select supervisor"
              notFoundContent={null}
              showSearch
              onSearch={debounceSearch}
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={false}
              getPopupContainer={(node) => node.parentNode}
            >
              {staffList?.records?.map((val) => (
                <Option key={val.partyId}>{val.displayName}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={18} md={12} lg={6} xl={6}>
          <p className="font-medium text-gray-800">Work location</p>
          <Form.Item
            name={['jobInformation', 'workLocation']}
            rules={[
              {
                message: 'Please enter workLocation',
              },
            ]}
          >
            <Input size="large" placeholder="Enter workLocation" />
          </Form.Item>
        </Col>
        <Col lg={6} xl={6} md={12} sm={18} xs={24}>
          <p className="font-medium text-gray-800 ">Work phone</p>
          <PhoneNumber
            countryCode={['jobInformation', 'phone', 'countryCode']}
            form={form}
            name={['jobInformation', 'phone', 'phone']}
            placeholder="#####-#####"
            rules={[
              {
                message: 'Please enter valid mobile number',
                min: 10,
                len: 10,
              },
            ]}
          />
        </Col>
        <Col lg={6} xl={6} md={12} sm={18} xs={24}>
          <p className="font-medium text-gray-800">Work email</p>
          <Form.Item
            name={['jobInformation', 'primaryEmail']}
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Email can't be blank!",
              },
              ({ getFieldError }) => ({
                validator(rule, value) {
                  const a = getFieldError('email');
                  if (a.includes("'email' is not a valid email") || !value || value.length < 2) {
                    return Promise.resolve();
                  }
                  return callApi(
                    {
                      uriEndPoint: {
                        uri: '/user/isExistingLoginId',
                        method: 'GET',
                        version: '/xapi/v1',
                      },
                      query: {
                        user_id: value,
                      },
                    },
                    {
                      disableNotifications: true,
                    },
                  )
                    .then(() => Promise.resolve())

                    .catch(() => Promise.reject(new Error('Email already exists. Try again!')));
                },
              }),
              {
                message: 'Please enter a valid email address!',
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              },
            ]}
          >
            <Input size="large" placeholder="john.doe@domain.com" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={18} md={12} lg={6} xl={6}>
          <p className="font-medium text-gray-800">Start date</p>
          <Form.Item name={['jobInformation', 'startDate']}>
            <DatePicker
              style={{ width: '100%' }}
              size="large"
              format={'YYYY/MM'}
              picker="month"
              getPopupContainer={(node) => node.parentNode}
            />
          </Form.Item>
        </Col>
        <Col xs={0} sm={0} md={0} lg={6} xl={6} />
        <Divider />
        <Col xs={24} sm={18} md={12} lg={6} xl={6}>
          <p className="font-medium text-gray-800">Employment type</p>
          <Form.Item name={['jobInformation', 'employmentTypeId']}>
            <Select
              size="large"
              placeholder="Select Exam"
              getPopupContainer={(node) => node.parentNode}
            >
              <Option value="PART_TIME">Part-Time</Option>
              <Option value="FULL_TIME">Full-Time</Option>
              <Option value="FLEXI_TIME">Flexi-Time</Option>
              <Option value="MAN_HOUR">Man-Hour</Option>
            </Select>
          </Form.Item>
        </Col>
        {(changedField?.jobInformation?.employmentTypeId === 'PART_TIME' ||
          changedField?.jobInformation?.employmentTypeId === 'FULL_TIME') && (
          <>
            <Col lg={2} xl={2} md={6} sm={8} xs={12}>
              <p className="font-medium text-gray-800">Start time</p>
              <Form.Item name={['jobInformation', 'startTime']}>
                <TimePicker
                  format={'HH:mm'}
                  size="large"
                  placeholder="start time"
                  getPopupContainer={(node) => node.parentNode}
                />
              </Form.Item>
            </Col>
            <Col lg={2} xl={2} md={6} sm={8} xs={12}>
              <p className="font-medium text-gray-800">End time</p>
              <Form.Item name={['jobInformation', 'endTime']}>
                <TimePicker
                  format={'HH:mm'}
                  size="large"
                  placeholder="end time"
                  getPopupContainer={(node) => node.parentNode}
                />
              </Form.Item>
            </Col>
          </>
        )}
        {changedField?.jobInformation?.employmentTypeId === 'FLEXI_TIME' && (
          <>
            <Form.List name={['jobInformation', 'flexiTime']}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, fieldKey, ...restField }) => (
                    <>
                      <Col lg={2} xl={2} md={6} sm={8} xs={12}>
                        <p className="font-medium text-gray-800">Start time</p>
                        <Form.Item {...restField} name={[name, 'startTime']}>
                          <TimePicker
                            format={'HH:mm'}
                            size="large"
                            placeholder="start time"
                            getPopupContainer={(node) => node.parentNode}
                          />
                        </Form.Item>
                      </Col>
                      <Col lg={2} xl={2} md={6} sm={8} xs={12}>
                        <p className="font-medium text-gray-800">End time</p>
                        <Form.Item {...restField} name={[name, 'endTime']}>
                          <TimePicker format={'HH:mm'} size="large" placeholder="end time" />
                        </Form.Item>
                      </Col>
                      <Col
                        style={{
                          padding: '0',
                          display: 'flex',
                          justifyContent: 'end',
                          alignItems: 'center',
                        }}
                        lg={2}
                        xl={2}
                        md={12}
                        sm={18}
                        xs={24}
                      >
                        <DeleteOutlined
                          style={{
                            fontSize: '1rem',
                            color: 'rgba(220, 38, 38)',
                          }}
                          onClick={() => remove(name)}
                        />
                      </Col>
                    </>
                  ))}
                  <Form.Item className="items-center">
                    <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />} />
                  </Form.Item>
                </>
              )}
            </Form.List>
          </>
        )}
        {changedField?.jobInformation?.employmentTypeId === 'MAN_HOUR' && (
          <>
            <Col lg={2} xl={2} md={6} sm={8} xs={12}>
              <p className="font-medium text-gray-800">Target</p>
              <Form.Item name={['jobInformation', 'target']}>
                <Input size="large" type="number" min={1} placeholder="target" />
              </Form.Item>
            </Col>
            <Col lg={2} xl={2} md={6} sm={8} xs={12}>
              <p className="font-medium text-gray-800">Time limit</p>
              <Form.Item name={['jobInformation', 'timeLimitTypeId']}>
                <Select
                  size="large"
                  getPopupContainer={(node) => node.parentNode}
                  placeholder="Select time"
                >
                  <Option value="TF_hr">Hour</Option>
                  <Option value="TF_wk">Week</Option>
                  <Option value="TF_mon">Month</Option>
                  <Option value="TF_qr">Quarter</Option>
                  <Option value="TF_hy">Half year</Option>
                  <Option value="TF_yr">Year</Option>
                </Select>
              </Form.Item>
            </Col>
          </>
        )}
        <Col lg={6} xl={6} md={12} sm={18} xs={24}>
          <div className="flex justify-between">
            <p className="font-medium text-gray-800">Salary</p>
          </div>
          <div className="flex">
            <div className="w-full">
              <Form.Item name={['jobInformation', 'salary', 'amount']}>
                <Input
                  size="large"
                  placeholder="₹0.00"
                  autoComplete="off"
                  className="text-right"
                  onBlur={(event) => {
                    let i = 0;
                    let res = event.target.value
                      // replace the dots with empty string if value contains more than one dot
                      // leave first decimal
                      .replace(/\./g, () => {
                        i += 1;
                        return i >= 2 ? '' : '.';
                      })
                      // replace the commas too with empty string if have any
                      .replace(/,/g, '');
                    let mod;
                    if (res) {
                      res = res[0] === '₹' ? res.substring(1, res.length).trim() : res;
                      mod = Number(res).toFixed(2);
                    } else {
                      mod = event.target.value;
                    }
                    form.setFieldsValue({
                      jobInformation: {
                        salary: {
                          amount: currencyFormatter.format(currencyParser(mod)),
                        },
                      },
                    });
                  }}
                />
              </Form.Item>
            </div>
            <Form.Item name={['jobInformation', 'salary', 'durationTypeId']}>
              <Select
                size="large"
                getPopupContainer={(node) => node.parentNode}
                placeholder="Select time"
              >
                <Option value="TF_hr">Hour</Option>
                <Option value="TF_wk">Week</Option>
                <Option value="TF_mon">Month</Option>
                <Option value="TF_qr">Quarter</Option>
                <Option value="TF_hy">Half year</Option>
                <Option value="TF_yr">Year</Option>
              </Select>
            </Form.Item>
          </div>{' '}
        </Col>{' '}
        <Col lg={6} xl={6} md={12} sm={18} xs={24} className="flex items-center">
          <div>
            {' '}
            <Checkbox.Group
              options={extraSalaryBonus}
              onChange={(val) => {
                setSalaryToggle(val);
              }}
            />
          </div>
        </Col>{' '}
        {salaryToggle && salaryToggle.includes('incentive') && (
          <>
            <Col lg={5} xl={5} md={8} sm={12} xs={12}>
              <p className="font-medium text-gray-800">Incentive</p>
              <div className="flex">
                <div className=" flex-1">
                  <Form.Item
                    rules={[{ required: true, message: 'Please enter amount' }]}
                    name={['jobInformation', 'incentive', 'amount']}
                  >
                    <Input
                      style={{ textAlign: 'right' }}
                      size="large"
                      type="number"
                      min={1}
                      placeholder="incentive"
                    />
                  </Form.Item>
                </div>
                <Form.Item
                  className=" flex-1"
                  name={['jobInformation', 'incentive', 'durationTypeId']}
                  rules={[{ required: true, message: 'Please select time' }]}
                >
                  <Select
                    size="large"
                    placeholder="Select Time"
                    getPopupContainer={(node) => node.parentNode}
                  >
                    <Option value="TF_hr">Hour</Option>
                    <Option value="TF_wk">Week</Option>
                    <Option value="TF_mon">Month</Option>
                    <Option value="TF_qr">Quarter</Option>
                    <Option value="TF_hy">Half year</Option>
                    <Option value="TF_yr">Year</Option>
                  </Select>
                </Form.Item>
              </div>
            </Col>
          </>
        )}
      </Row>
      <Row gutter={16} align="middle">
        {salaryToggle && salaryToggle.includes('allowance') && (
          <>
            <Form.List name={['jobInformation', 'allowance']}>
              {(fields, { add, remove }) => (
                <>
                  {fields?.map(({ key, name, fieldKey, ...restField }) => (
                    <>
                      <Col lg={3} xl={3} md={6} sm={8} xs={12}>
                        <p className="font-medium text-gray-800">Type</p>
                        <Form.Item
                          rules={[{ required: true, message: 'Please enter type' }]}
                          {...restField}
                          name={[name, 'description']}
                        >
                          <Input size="large" placeholder="allowance type" />
                        </Form.Item>
                      </Col>
                      <Col lg={6} xl={6} md={8} sm={12} xs={12}>
                        <p className="font-medium text-gray-800">Allowance</p>
                        <div className="flex">
                          <div className="w-full">
                            <Form.Item
                              rules={[
                                {
                                  required: true,
                                  message: 'Please enter allowance',
                                },
                              ]}
                              {...restField}
                              name={[name, 'amount']}
                            >
                              <Input
                                style={{ textAlign: 'right' }}
                                size="large"
                                type="number"
                                placeholder="allowance amt"
                                min={1}
                              />
                            </Form.Item>
                          </div>
                          <Form.Item
                            rules={[{ required: true, message: 'Please select time' }]}
                            name={[name, 'durationTypeId']}
                          >
                            <Select
                              size="large"
                              getPopupContainer={(node) => node.parentNode}
                              placeholder="Select time"
                            >
                              <Option value="TF_hr">Hour</Option>
                              <Option value="TF_wk">Week</Option>
                              <Option value="TF_mon">Month</Option>
                              <Option value="TF_qr">Quarter</Option>
                              <Option value="TF_hy">Half year</Option>
                              <Option value="TF_yr">Year</Option>
                            </Select>
                          </Form.Item>
                        </div>
                      </Col>

                      <Col
                        style={{
                          padding: '0',
                          display: 'flex',
                          justifyContent: 'end',
                          alignItems: 'center',
                        }}
                        lg={3}
                        xl={3}
                        md={2}
                        sm={2}
                        xs={2}
                      >
                        <DeleteOutlined
                          style={{
                            fontSize: '1rem',
                            color: 'rgba(220, 38, 38)',
                          }}
                          onClick={() => remove(name)}
                        />
                      </Col>
                    </>
                  ))}

                  <Button
                    type="dashed"
                    className="ml-2 mb-2"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                  >
                    Add allowance
                  </Button>
                </>
              )}
            </Form.List>
          </>
        )}
      </Row>
    </div>
  );
};

export default connect(({ staff, user }) => ({
  departmentList: staff?.departmentList,
  staffList: staff.staffList,
  currentUser: user.currentUser,
}))(JobInformation);
