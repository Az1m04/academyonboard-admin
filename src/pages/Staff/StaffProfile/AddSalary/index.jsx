import React, { useState, useEffect } from 'react';
import Page from '@/components/Page';
import Breadcrumbs from '@/components/BreadCrumbs';
import { connect, useParams } from 'umi';
import { Button, Select, Form, Input, Row, Col, DatePicker } from 'antd';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import FixedFooter from '@/components/FixedFooter';

const { TextArea } = Input;

const paymentMode = [
  {
    mode: 'Bank Transfer',
  },
  {
    mode: 'UPI',
  },
  {
    mode: 'NEFT',
  },
  {
    mode: 'Online Banking',
  },
];

const AddSalary = ({ dispatch }) => {
  const [salaryform] = Form.useForm();
  const { staffId } = useParams();
  const [staffWorkingDays, setStaffWorkingDays] = useState();
  const [staffName, setStaffName] = useState('');
  const [staffBaseSalary, setStaffBaseSalary] = useState('');

  const history = useHistory();
  const onMonthChange = (value) => {
    const days = moment(`${value}/${moment()?.format('DD/YYYY')}`).daysInMonth();
    const totalWorkingDays =
      days - (salaryform.getFieldValue('fullDayLeave') + salaryform.getFieldValue('halfDay') / 2);
    setStaffWorkingDays(totalWorkingDays);
    console.log(totalWorkingDays);
    const perdaySalary = staffBaseSalary / days;
    salaryform.setFieldsValue({
      workingDays: totalWorkingDays,

      salaryAmount: perdaySalary * totalWorkingDays,
    });
  };
  console.log(staffWorkingDays);
  const getLeaves = () => {
    dispatch({
      type: 'staff/getLeaves',
      payload: {
        pathParams: { teacherId: staffId },
      },
    }).then((resp) => {
      salaryform.setFieldsValue({
        fullDayLeave: resp.fullDayLeaves,
        halfDay: resp.halfDayLeaves,
      });
      console.log('resp.', resp.fullDayLeaves);
    });
  };

  const getDetails = () => {
    dispatch({
      type: 'staff/getTeacherDetails',
      payload: {
        pathParams: {
          TeacherId: staffId,
        },
      },
    }).then((resp) => {
      salaryform.setFieldsValue({
        empId: resp.id,
        empName: resp.fullName,
        AccountNum: resp.bankDetails.accountNumber,
        bankName: resp.bankDetails.bankName,
        // ifscCode: resp.ifscCode,
      });
      setStaffName(resp.fullName);
      setStaffBaseSalary(resp.jobInformation.salary[0].amount);
    });
  };

  const addSalary = (values) => {
    const body = {};
    body.workingDays = values?.workingDays;
    body.leaves = values?.leaves;
    body.incentive = values?.advanceAmount;
    body.deduction = values?.loan;
    body.amount = values?.salaryAmount;
    body.comments = values?.remark;
    // body.empName = values?.empName;
    // body.empId = values?.empId;
    // body.AccountName = values?.AccountName;
    // body.paymentMethord = values?.paymentMethord;
    // body.bankName = values?.bankName;
    // body.ifscCode = values?.ifscCode;
    // body.dateFormed = values?.dateFormed;
    // body.halfDay = values?.halfDay;
    // body.lateDays = values?.lateDays;
    // body.loan = values?.loan;
    // body.tax = values?.tax;
    // body.preparedBy = values?.preparedBy;

    dispatch({
      type: 'staff/addStaffSalary',
      payload: {
        body,
        pathParams: {
          staffId,
        },
      },
    }).then(() => history.push(`/staff/${staffId}/profile/salary-wallet`));

    // console.log('body :>> ', body);
  };

  useEffect(() => {
    getDetails();
    getLeaves();
  }, []);

  return (
    <>
      <div className="container mx-auto">
        <Page
          title={staffName}
          PrevNextNeeded="N"
          breadcrumbs={
            <Breadcrumbs
              path={[
                {
                  name: 'Dashboard',
                  path: '/dashboard',
                },
                {
                  name: 'Staff',
                  path: '/staff/list',
                },
                {
                  name: 'Add Salary',
                  path: '#',
                },
              ]}
            />
          }
        >
          <div className="bg-white rounded-md shadow-md mt-10">
            <div className="text-base text-gray-800 font-semibold px-5 pt-5 border-b">
              <p>Add Salary</p>
            </div>
            <div className="px-5 pt-5 pb-5">
              <Form
                form={salaryform}
                onFinish={addSalary}
                // onValuesChange={() => {
                //   // const newDate =
                //   //   +staffWorkingDays - (+(values.leaves || 0) + (1 / 2) * +(values.halfDay || 0));
                //   // (1 / 4) * +(values.lateDays || 0));
                //   const perdaySalary = staffBaseSalary / staffWorkingDays;

                //   const finalPayment = perdaySalary * staffWorkingDays;
                //   // (+(values.loan || 0) + +(values.advanceAmount || 0) + +(values.tax || 0));
                //   salaryform.setFieldsValue({
                //     salaryAmount: finalPayment.toFixed(2),
                //     workingDays: staffWorkingDays,
                //   });
                // }}
              >
                <Row gutter={[12, 0]}>
                  <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                    <span className="block mb-2 font-medium text-gray-800">Select Month</span>
                    <Form.Item name="SelectMonth">
                      <Select
                        size="large"
                        placeholder="Select month"
                        onChange={(e) => {
                          onMonthChange(e);
                        }}
                      >
                        {Array.apply(0, Array(12))
                          .map((_, i) => {
                            const elem = {};
                            elem.id = +(i + 1);
                            elem.name = moment().month(i).format('MMMM');
                            return elem;
                          })
                          ?.map((item) => (
                            <Select.Option key={item.id} value={item?.id}>
                              {item?.name}
                            </Select.Option>
                          ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  {salaryform.getFieldValue('workingDays') ? (
                    <>
                      <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                        <span className="block mb-2 font-medium text-gray-800">Emp Name </span>
                        <Form.Item name="empName">
                          <Input
                            disabled
                            size="large"
                            type="text"
                            name={'jsjakdl'}
                            value="hkjdf"
                            placeholder="Enter Emp Name"
                          />
                        </Form.Item>
                      </Col>
                      <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                        <span className="block mb-2 font-medium text-gray-800">Emp ID </span>
                        <Form.Item name="empId">
                          <Input disabled size="large" type="number" placeholder="Enter Emp ID" />
                        </Form.Item>
                      </Col>
                      <Col xl={8} lg={8} md={12} sm={24} xs={24}>
                        <span className="block mb-2 font-medium text-gray-800">Account Name</span>
                        <Form.Item name="AccountName">
                          <Input size="large" type="text" placeholder="Enter Account Name" />
                        </Form.Item>
                      </Col>
                      <Col xl={8} lg={8} md={12} sm={24} xs={24}>
                        <span className="block mb-2 font-medium text-gray-800">Account Number</span>
                        <Form.Item name="AccountNum">
                          <Input
                            size="large"
                            type="number"
                            placeholder="Enter Account Number"
                            disabled
                          />
                        </Form.Item>
                      </Col>

                      <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                        <span className="block mb-2 font-medium text-gray-800">Payment Mode </span>
                        <Form.Item name="paymentMethord">
                          <Select size="large" className="my-20" placeholder="Payment Mode">
                            {paymentMode?.map((item) => (
                              <Select.Option key={item?.mode} value={item?.mode}>
                                {item?.mode}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>

                      <Col xl={8} lg={8} md={12} sm={24} xs={24}>
                        <span className="block mb-2 font-medium text-gray-800">Bank Name</span>
                        <Form.Item name="bankName">
                          <Input size="large" type="text" placeholder="Enter Bank Name" disabled />
                        </Form.Item>
                      </Col>
                      <Col xl={8} lg={8} md={12} sm={24} xs={24}>
                        <span className="block mb-2 font-medium text-gray-800">IFSC Code</span>
                        <Form.Item name="ifscCode">
                          <Input
                            size="large"
                            type="number"
                            placeholder="Enter IFSC Code"
                            disabled
                          />
                        </Form.Item>
                      </Col>

                      <Col xl={8} lg={8} md={12} sm={24} xs={24}>
                        <span className="block mb-2   font-medium text-gray-800">Date</span>
                        <Form.Item name="dateFormed">
                          <DatePicker className="w-full" size="large" placeholder="Date Prepared" />
                        </Form.Item>
                      </Col>

                      <Col xl={8} lg={8} md={12} sm={24} xs={24}>
                        <span className="block mb-2  font-medium text-gray-800">
                          Number Of Full day Leaves
                        </span>
                        <Form.Item name="fullDayLeave">
                          <Input
                            size="large"
                            type="number"
                            placeholder="Total Number of full leaves"
                            disabled
                          />
                        </Form.Item>
                      </Col>
                      <Col xl={8} lg={8} md={12} sm={24} xs={24}>
                        <span className="block mb-2 font-medium text-gray-800">
                          Number Of Half Day leaves
                        </span>
                        <Form.Item name="halfDay">
                          <Input
                            size="large"
                            type="number"
                            placeholder="Total Number of  Leaves"
                            disabled
                          />
                        </Form.Item>
                      </Col>
                      <Col xl={8} lg={8} md={12} sm={24} xs={24}>
                        <span className="block mb-2 font-medium text-gray-800">
                          Number Of Late Days
                        </span>
                        <Form.Item name="lateDays">
                          <Input
                            size="large"
                            type="number"
                            placeholder="Total  Number Of Late Days"
                          />
                        </Form.Item>
                      </Col>
                      <Col xl={8} lg={8} md={12} sm={24} xs={24}>
                        <span className="block mb-2  font-medium text-gray-800">
                          Total Number of Working Days
                        </span>
                        <Form.Item name={'workingDays'}>
                          <Input
                            size="large"
                            type="number"
                            placeholder="Enter Total Number of Working Days"
                          />
                        </Form.Item>
                      </Col>
                      <Col xl={8} lg={8} md={12} sm={24} xs={24}>
                        <span className="block mb-2 font-medium text-gray-800">Loan Amount</span>
                        <Form.Item name="loan">
                          <Input size="large" type="number" placeholder="Enter Loan Amount" />
                        </Form.Item>
                      </Col>
                      <Col xl={8} lg={8} md={12} sm={24} xs={24}>
                        <span className="block mb-2 font-medium text-gray-800">Advance</span>
                        <Form.Item name="advanceAmount">
                          <Input size="large" type="number" placeholder="Enter Advance Amount" />
                        </Form.Item>
                      </Col>
                      <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                        <span className="block mb-2  font-medium text-gray-800">Tax </span>
                        <Form.Item name="tax">
                          <Input size="large" type="text" placeholder="Enter Tax Amount" />
                        </Form.Item>
                      </Col>
                      <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                        <span className="block mb-2  font-medium text-gray-800">Total Salary </span>
                        <Form.Item name="salaryAmount" initialValue={12000}>
                          <Input
                            disabled
                            size="large"
                            type="text"
                            placeholder="Enter Total Salary"
                          />
                        </Form.Item>
                      </Col>
                      <Col xl={8} lg={8} md={12} sm={24} xs={24}>
                        <span className="block mb-2 font-medium text-gray-800">Prepared By</span>
                        <Form.Item name="preparedBy">
                          <Input size="large" type="text" placeholder="Salary Prepared By" />
                        </Form.Item>
                      </Col>
                      <Col className="w-full">
                        <span className="block mb-2 font-medium text-gray-800">Remark</span>
                        <Form.Item name="remark">
                          <TextArea
                            style={{
                              height: 120,
                            }}
                          />
                        </Form.Item>
                      </Col>
                    </>
                  ) : null}
                </Row>
              </Form>
            </div>
          </div>
          <FixedFooter classes="text-right">
            <div
              className="flex m-auto"
              style={{
                maxWidth: '80rem',
              }}
            >
              <div className="w-full text-black">
                <Button
                  onClick={() => {
                    // history.push(`/staff/${staffId}/profile/salary-wallet`);
                    salaryform.submit();
                  }}
                >
                  Add Salary
                </Button>
              </div>
            </div>
          </FixedFooter>
        </Page>
      </div>
    </>
  );
};

export default connect(() => ({}))(AddSalary);
