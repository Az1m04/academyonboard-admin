import React, { useState, useEffect } from 'react';
import { Form, Input, Row, Col, Button, DatePicker, Select, message, Radio, Checkbox } from 'antd';
import { connect, useParams, history } from 'umi';
import { currencyFormatter, currencyParser } from '@/utils/utils';
import moment from 'moment';

const Fees = ({ courseDetails, idx, getStudentCoursePayment, dispatch }) => {
  const { studentId } = useParams();
  const { Option } = Select;
  const [form] = Form.useForm();
  const [courseId, getCourseId] = useState(idx || null);
  const [hideDate, setHideDate] = useState('cash');
  const [orderId, getOrderId] = useState(null);
  const [remainings, setRemainings] = useState([]);
  const button = (
    <Button
      onClick={() => {
        form.submit();
      }}
      type="primary"
      size="large"
      // loading={updateing}
    >
      {'Update'}
    </Button>
  );
  const getStudentCoursePayments = () => {
    dispatch({
      type: 'student/getStudentCoursePayment',
      payload: {
        pathParams: { studentId },
      },
    }).then((res) => getOrderId(res?.payment?.orderId));
  };

  const courseDate = courseDetails?.records?.filter((val) => courseId?.includes(val?.id))[0];

  useEffect(() => {
    getStudentCoursePayments();
    if (courseId) {
      form.setFieldsValue({
        payableAmount: currencyFormatter?.format(courseDate?.amount ? courseDate?.amount : '0'),
      });
    }
    if (idx) {
      form.setFieldsValue({
        course: courseDate?.id,
        payableAmount: currencyFormatter?.format(courseDate?.amount ? courseDate?.amount : '0'),
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const onCommentFinish = (val) => {
    dispatch({
      type: 'student/receiveInstallmentPayment',
      payload: {
        body: val,
        pathParams: { orderId },
      },
    }).then((res) => {
      if (res?.status === 'ok') {
        message.success('Fees updated successfully');
        history.push(`/students/${studentId}`);
      } else {
        message.error('Something went wrong!');
      }
    });
  };
  function onChange(checkedValues) {
    const remainingArray = getStudentCoursePayment?.payment?.installments?.filter(
      (v) => !checkedValues?.map((val) => val?.id).includes(v?.id),
    )[0];
    setRemainings(remainingArray);
    if (checkedValues?.length > 0)
      form.setFieldsValue({
        payableAmount: currencyFormatter.format(
          checkedValues.reduce((a, b) => a + b.amount, 0) || '0',
        ),
        nextDueDate: moment(remainingArray?.dueDate),
      });
    else form.resetFields();
  }

  return (
    <div className="-m-8 ">
      <div className="">
        <div className="">
          <div className=" text-base text-xl pl-8 pb-2 pt-3 border border-b-2 border-t-2 bg-gray-100  font-semibold w-full text-gray-800">
            Installments
          </div>
          <div className="px-8 mt-3 ">
            <Form form={form} onFinish={onCommentFinish} hideRequiredMark autoComplete="off">
              <Row gutter={24}>
                <Col
                  lg={24}
                  xl={24}
                  md={24}
                  sm={24}
                  xs={24}
                  className=" overflow-y-auto "
                  style={{ maxHeight: '450px' }}
                >
                  <Checkbox.Group style={{ width: '100%' }} onChange={onChange}>
                    {getStudentCoursePayment?.payment?.installments?.map((v) => {
                      return (
                        <>
                          <div key={v?.id} className="mb-4">
                            <Checkbox value={v}>
                              <div className="flex space-x-5 ">
                                <div>
                                  <div className="font-medium text-gray-800">Amount</div>
                                  <div>{currencyFormatter?.format(v?.amount)}</div>
                                </div>
                                <div>
                                  <div className="font-medium text-gray-800">Due date</div>
                                  <div>{moment(v?.dueDate).format('YYYY-MM-DD')}</div>
                                </div>
                              </div>
                            </Checkbox>
                          </div>
                        </>
                      );
                    })}
                  </Checkbox.Group>
                </Col>
                <Col lg={24} xl={24} md={24} sm={24} xs={24}>
                  <span className="block mb-2 mt-5 font-medium text-gray-800">Your course</span>
                  <Form.Item
                    name="course"
                    rules={[
                      {
                        required: true,
                        message: 'Please select course!',
                      },
                    ]}
                  >
                    {idx ? (
                      <Select size="medium" className="w-full" onChange={(val) => getCourseId(val)}>
                        <Option key={courseDate?.id} value={courseDate?.id}>
                          {courseDate?.name}
                        </Option>
                      </Select>
                    ) : (
                      <Select size="medium" className="w-full" onChange={(val) => getCourseId(val)}>
                        {courseDetails?.records?.map((val) => (
                          <Option key={val?.id} value={val?.id}>
                            {val?.name}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>

                <Col lg={8} xl={8} md={8} sm={24} xs={24}>
                  <p className="font-medium text-gray-800">Payable amount</p>
                  <Form.Item name="payableAmount">
                    <Input
                      disabled
                      placeholder="₹0.00"
                      className="text-right text-gray-800"
                      size="middle"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
                <Col lg={8} xl={8} md={8} sm={24} xs={24}>
                  <p className="font-medium text-gray-800">Balance amount</p>
                  <Form.Item
                    name="balanceAmount"
                    rules={[
                      {
                        required: true,
                        message: 'Please enter balance amount',
                      },
                    ]}
                  >
                    <Input
                      size="medium"
                      onFocus={(e) => e.target.select()}
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
                          amount: currencyFormatter.format(currencyParser(mod)),
                        });
                      }}
                    />
                  </Form.Item>
                </Col>
                {hideDate === 'upi' || remainings === undefined ? (
                  <></>
                ) : (
                  <Col lg={8} xl={8} md={8} sm={24} xs={24}>
                    <p className="font-medium text-gray-800">Next due date</p>
                    <Form.Item
                      name="nextDueDate"
                      rules={[
                        {
                          required: true,
                          message: 'Please enter due date!',
                        },
                      ]}
                    >
                      <DatePicker size="medium" />
                    </Form.Item>
                  </Col>
                )}
                <Col lg={24} xl={24} md={24} sm={24} xs={24} className=" border-b border-gray-400">
                  <span className="block mb-2 font-medium text-gray-800">Payment method</span>
                  <Form.Item name="method">
                    <Radio.Group
                      defaultValue={'cash'}
                      value={hideDate}
                      onChange={(val) => setHideDate(val?.target.value)}
                    >
                      <Radio value={'cash'}>Cash</Radio>
                      <Radio value={'cheque'}>Cheque</Radio>
                      <Radio value={'card'}>Card</Radio>
                      <Radio value={'upi'}>UPI</Radio>
                      <Radio value={'bank'}>Bank</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <div className="bg-gray-100 border border-gray-600 w-full mt-5">
                  {hideDate === 'cash' && (
                    <>
                      <Col lg={24} xl={24} md={24} sm={24} xs={24} className="mt-2">
                        <p className="font-medium text-gray-800 mb-3">Remarks (Optional)</p>
                        <Form.Item name="remarks">
                          <Input.TextArea placeholder="Enter a message" rows={4} />
                        </Form.Item>
                      </Col>
                    </>
                  )}
                  {hideDate === 'upi' && (
                    <>
                      <Col lg={24} xl={24} md={24} sm={24} xs={24} className="mt-2">
                        <p className="font-medium text-gray-800 mb-3">UPI ID</p>
                        <Form.Item
                          name="upiID"
                          rules={[
                            {
                              required: true,
                              message: 'Please enter your upi ID!',
                            },
                          ]}
                        >
                          <Input
                            placeholder=""
                            className=" text-gray-800"
                            size="middle"
                            style={{ width: '100%' }}
                          />
                        </Form.Item>
                      </Col>
                      <Col lg={24} xl={24} md={24} sm={24} xs={24}>
                        <p className="font-sm text-gray-600 mb-3">* UPI transaction details</p>
                      </Col>
                      <Col lg={24} xl={24} md={24} sm={24} xs={24} className="-mt-2">
                        <p className="font-medium text-gray-800 ">
                          UPI Transaction ID/ Wallet Txn ID
                        </p>
                        <Form.Item
                          name="chequeNo"
                          rules={[
                            {
                              required: true,
                              message: 'Please enter cheque number!',
                            },
                          ]}
                        >
                          <Input
                            placeholder=""
                            className=" text-gray-800"
                            size="middle"
                            style={{ width: '100%' }}
                          />
                        </Form.Item>
                      </Col>
                    </>
                  )}
                  {hideDate === 'cheque' && (
                    <>
                      <Row gutter={16} className="px-2 mt-2">
                        <Col lg={24} xl={24} md={24} sm={24} xs={24}>
                          <p className="font-sm text-gray-600 mb-3">* Cheque details</p>
                        </Col>
                        <Col lg={8} xl={8} md={8} sm={24} xs={24}>
                          <p className="font-medium text-gray-800">Cheque no</p>
                          <Form.Item
                            name="chequeNo"
                            rules={[
                              {
                                required: true,
                                message: 'Please enter cheque number!',
                              },
                            ]}
                          >
                            <Input
                              placeholder="Please enter cheque number!"
                              className=" text-gray-800"
                              size="middle"
                              style={{ width: '100%' }}
                            />
                          </Form.Item>
                        </Col>
                        <Col lg={8} xl={8} md={8} sm={24} xs={24}>
                          <p className="font-medium text-gray-800">Bank name</p>
                          <Form.Item
                            name="bankName"
                            rules={[
                              {
                                required: true,
                                message: 'Please enter bank name!',
                              },
                            ]}
                          >
                            <Input
                              placeholder="Please enter bank name!"
                              className=" text-gray-800"
                              size="middle"
                              style={{ width: '100%' }}
                            />
                          </Form.Item>
                        </Col>
                        <Col lg={8} xl={8} md={8} sm={24} xs={24}>
                          <p className="font-medium text-gray-800">Cheque date</p>
                          <Form.Item
                            name="chequeDate"
                            rules={[
                              {
                                required: true,
                                message: 'Please enter date!',
                              },
                            ]}
                          >
                            <DatePicker size="medium" />
                          </Form.Item>
                        </Col>
                      </Row>
                    </>
                  )}
                  {hideDate === 'bank' && (
                    <>
                      <Col lg={24} xl={24} md={24} sm={24} xs={24} className="mt-2">
                        <p className="font-medium text-gray-800 mb-3">Bank</p>
                        <Form.Item
                          name="bank"
                          rules={[
                            {
                              required: true,
                              message: 'Please enter your bank!',
                            },
                          ]}
                        >
                          <Input
                            placeholder="Enter your bank name"
                            className=" text-gray-800"
                            size="middle"
                            style={{ width: '100%' }}
                          />
                        </Form.Item>
                      </Col>

                      <Col lg={24} xl={24} md={24} sm={24} xs={24} className="-mt-2">
                        <p className="font-medium text-gray-800 ">Bank account number</p>
                        <Form.Item
                          name="bankAccountNumber"
                          rules={[
                            {
                              required: true,
                              message: 'Please enter bank account number!',
                            },
                          ]}
                        >
                          <Input
                            placeholder="Enter bank account number"
                            className=" text-gray-800"
                            size="middle"
                            style={{ width: '100%' }}
                          />
                        </Form.Item>
                      </Col>
                      <Col lg={24} xl={24} md={24} sm={24} xs={24} className="-mt-2">
                        <p className="font-medium text-gray-800 ">IFSC code</p>
                        <Form.Item
                          name="ifscCode"
                          rules={[
                            {
                              required: true,
                              message: 'Please enter IFSC code!',
                            },
                          ]}
                        >
                          <Input
                            placeholder="Enter bank IFSC code"
                            className=" text-gray-800"
                            size="middle"
                            style={{ width: '100%' }}
                          />
                        </Form.Item>
                      </Col>
                    </>
                  )}
                  {hideDate === 'card' && (
                    <>
                      <Row gutter={16} className="mt-2 px-2">
                        <Col lg={24} xl={24} md={24} sm={24} xs={24}>
                          <p className="font-medium text-gray-800 mb-3">Card number</p>
                          <Form.Item
                            name="cardNumber"
                            rules={[
                              {
                                required: true,
                                message: 'Please enter your card number!',
                              },
                            ]}
                          >
                            <Input
                              placeholder="CARD NUMBER"
                              className=" text-gray-800"
                              size="middle"
                              style={{ width: '100%' }}
                            />
                          </Form.Item>
                        </Col>

                        <Col lg={24} xl={24} md={24} sm={24} xs={24} className="-mt-2">
                          <p className="font-medium text-gray-800 ">Card holder name</p>
                          <Form.Item
                            name="nameOnCard"
                            rules={[
                              {
                                required: true,
                                message: 'Please enter name',
                              },
                            ]}
                          >
                            <Input
                              placeholder="CARD HOLDER NAME"
                              className=" text-gray-800"
                              size="middle"
                              style={{ width: '100%' }}
                            />
                          </Form.Item>
                        </Col>
                        <Col lg={12} xl={12} md={12} sm={24} xs={24} className="-mt-2">
                          <p className="font-medium text-gray-800 ">Expiry date</p>
                          <Form.Item
                            name="expiryDate"
                            rules={[
                              {
                                required: true,
                                message: 'Expiry date required!',
                              },
                            ]}
                          >
                            <DatePicker className="w-full" size="medium" />
                          </Form.Item>
                        </Col>
                        <Col lg={12} xl={12} md={12} sm={24} xs={24} className="-mt-2">
                          <p className="font-medium text-gray-800 ">Security code</p>
                          <Form.Item
                            name="securityCode"
                            rules={[
                              {
                                required: true,
                                message: 'Please enter security code',
                              },
                            ]}
                          >
                            <Input
                              placeholder="CVV"
                              className=" text-gray-800"
                              size="middle"
                              style={{ width: '100%' }}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </>
                  )}
                </div>
              </Row>
            </Form>
            <div className="border-t-2 mt-5 w-full flex justify-end ">
              <div className="mt-4 ">{button}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default connect(({ student, loading }) => ({
  courseDetails: student?.courseDetails,
  getStudentCoursePayment: student?.getStudentCoursePayment,
  loadingCourses: loading?.effects['student/getCourseDetails'],
}))(Fees);
