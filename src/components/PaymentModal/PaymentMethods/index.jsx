/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Row, Col, Select, Input, DatePicker, notification, Tooltip } from 'antd';
import { withRouter, connect } from 'umi';
import AppModal from '@/components/AppModal';
import CurrencyFormattedInput from '@/components/CurrencyFormattedInput';
import moment from 'moment';
import CheckValidation from '@/components/CheckValidation';
import styles from './index.less';
import PaymentDocument from '../PaymentDocument';
import ChequeForm from './ChequeForm';
import CardSwipeForm from './CardSwipeForm';
import UpiForm from './UpiForm';
import { currencyFormatter, decodeDollarsToDigits } from '@/utils/utils';
import { CheckCircleFill, HourglassSplit, AlarmFill } from 'react-bootstrap-icons';

const { Option } = Select;
const { TextArea } = Input;

const PaymentMethods = ({
  showModal,
  setShowModal,
  paymentMethods,
  studentRecord,
  studentInstallments,
  loading,
  dispatch,
  paymentStats,
}) => {
  const dateFormat = 'ddd MMM DD, YYYY';
  const [type, setType] = useState('Cash');
  const [fileList, setFilelist] = useState([]);
  const [form] = Form.useForm();
  const [receivedAmount, setReceivedAmount] = useState(0);
  const [allValues, setAllValues] = useState('');

  function handleChange(value) {
    switch (value) {
      case 'CASH':
        setType('Cash');
        break;
      case 'CHEQUE':
        setType('Cheque');
        break;
      case 'CARD_SWIPE':
        setType('Card Swipe');
        break;
      case 'UPI':
        setType('Upi');
        break;
      default:
        break;
    }
  }

  const renderCreditCard = () => {
    switch (type) {
      case 'Cheque':
        return <ChequeForm />;
      case 'Card Swipe':
        return <CardSwipeForm />;
      case 'Upi':
        return <UpiForm />;
      default:
        return '';
    }
  };

  const beforeUpload = (content) => {
    setFilelist([].concat(fileList, content));
  };
  /**
   * getStudentInstallments() to get number of installments of the opened student profile.
   */
  const getStudentInstallments = () => {
    dispatch({
      type: 'student/getStudentInstallments',
    });
  };

  useEffect(() => {
    getStudentInstallments();
  }, []);
  useEffect(() => {}, [studentInstallments]);

  const handlePayment = (values) => {
    const data = {
      ...values,
    };
    data.effective_date = values?.effective_date?.toISOString();
    data.receivedAmount = parseFloat(decodeDollarsToDigits(values?.receivedAmount));
    data.currency_uom_id = 'CAD';

    dispatch({
      type: 'student/receiveInstallmentPayment',
      payload: {
        pathParams: {
          orderId: '125511',
        },
        body: {
          ...data,
        },
      },
    })
      .then((res) => {
        notification?.success({
          message: 'Great Job!',
          description: 'Payment Received Successfully!',
        });
        form?.resetFields();
        setShowModal(false);
      })
      .catch((err) => {
        notification.error({
          message: 'Oops! Something went wrong.',
          description: err?.data?.message,
        });
      });
  };
  const getInstallmentTooltip = (status, dueNext) => {
    if (status === 'DONE') {
      return 'Payment done';
    }
    if (status === 'PENDING' && dueNext) {
      return 'Click to proceed..';
    }
    if (status === 'PENDING' && !dueNext) {
      return 'Next installment ';
    }
    return '';
  };
  const getInstallmentTypeIcons = (status, dueNext) => {
    if (status === 'DONE') {
      return <CheckCircleFill className="text-green-700 text-xl" />;
    }
    if (status === 'PENDING' && dueNext) {
      return <HourglassSplit className="text-yellow-500 text-xl" />;
    }
    if (status === 'PENDING' && !dueNext) {
      return <AlarmFill className="text-blue-500 text-xl" />;
    }
    return '';
  };
  return (
    <AppModal
      destroyOnClose
      showModal={showModal}
      titleName={`Receive payment for ${studentRecord?.displayName}`}
      width="768px"
      footer={
        <Button type="primary" loading={loading} onClick={() => form?.submit()}>
          Receive {form?.getFieldValue('receivedAmount')}
        </Button>
      }
      setShowModal={setShowModal}
      afterClose={() => {
        form.resetFields();
        setReceivedAmount(0);
        setType('Cash');
      }}
    >
      <Form
        form={form}
        onFinish={handlePayment}
        onValuesChange={(values) => {
          setAllValues(values);
        }}
      >
        <Row gutter={16} className="p-0">
          <Col
            style={{ paddingRight: 0 }}
            xs={24}
            sm={24}
            md={12}
            lg={12}
            xl={12}
            xxl={12}
            className=""
          >
            <div className="p-4">
              <div className="flex justify-between border-b p-4 bg-blue-100">
                <div className="">
                  <div className="uppercase text-xs font-medium text-gray-900 text-center">
                    Outstanding amount
                  </div>
                  <div className="text-sm font-semibold text-red-600 text-center">
                    {' '}
                    {currencyFormatter.format(
                      (+paymentStats?.totalAmount - +paymentStats?.paymentReceived).toString() ||
                        '0',
                    )}
                  </div>
                </div>
                <div className="">
                  <div className="uppercase text-xs font-medium text-gray-900">Received amount</div>
                  <div className="text-sm font-semibold text-red-600 text-right">
                    {currencyFormatter.format(paymentStats?.paymentReceived || '0')}
                  </div>
                </div>
              </div>
              <div className="flex justify-between border-b p-4 bg-indigo-100">
                <div className={styles.Amount}>
                  <div className="uppercase text-xs font-medium text-gray-900 text-center">
                    Total amount
                  </div>
                  <div className="text-sm font-semibold text-blue-600 text-center">
                    {currencyFormatter.format(paymentStats?.totalAmount || '0')}
                  </div>
                </div>
              </div>
              <div className="bg-gray-100 p-4">
                This will ensure that you have received the payment of{' '}
                <span className="font-semibold">
                  {form.getFieldValue('receivedAmount') || receivedAmount}
                </span>{' '}
                via {type}.
              </div>
              {/* installments cards */}
              <div className="p-2 my-4 shadow" style={{ maxHeight: '280px', overflowY: 'scroll' }}>
                {studentInstallments?.map((installment) => (
                  <Tooltip
                    placement="right"
                    title={getInstallmentTooltip(installment.status, installment.dueNext)}
                    key={installment.installmentNo}
                  >
                    <div
                      className={`py-4 my-4  hover:bg-gray-100 flex justify-around  items-center  shadow rounded-lg border cursor-pointer ${
                        installment.status === 'DONE' && 'italic line-through cursor-not-allowed'
                      } ${installment.dueNext && 'bg-blue-100'}`}
                      style={{
                        borderLeft: `${installment.dueNext && '3px solid #ffa500'}`,
                      }}
                      // ref={installment.dueNext && scrollToNextInst}
                      onClick={(e) => {
                        if (installment.status === 'PENDING' && installment.dueNext) {
                          setReceivedAmount(installment?.Amount);
                          form?.setFieldsValue({ receivedAmount: `₹${installment?.Amount}` });
                        } else {
                          e.preventDefault();
                        }
                      }}
                    >
                      {getInstallmentTypeIcons(installment.status, installment.dueNext)}
                      <span className="text-lg text-black">{installment?.installmentNo}</span>
                      <div className="text-red-700">
                        Amount:
                        <span className="font-semibold text-green-700">
                          {' '}
                          ${installment?.Amount}
                        </span>
                        <div
                          className={`text-right text-xs ${
                            installment?.status === 'PENDING' ? 'text-red-700' : 'text-blue-700'
                          } text-xs italic`}
                        >
                          {`${installment?.status === 'PENDING' ? 'Due on' : 'Paid on'} ${moment(
                            installment?.status === 'PENDING'
                              ? installment?.dueOn
                              : installment?.paidOn,
                          ).format('MMM d, YYYY')}`}
                        </div>
                      </div>
                    </div>
                  </Tooltip>
                ))}
              </div>
              {/* ----- */}
            </div>

            <CheckValidation show={fileList?.length > 0}>
              <PaymentDocument {...{ fileList, setFilelist }} />
            </CheckValidation>
          </Col>

          <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12} style={{ maxHeight: '400px' }}>
            <div className="p-4 w-full">
              <div className="mb-2">
                <div className="omgFormLabel">Select payment method</div>
                <Form.Item
                  colon={false}
                  rules={[
                    {
                      required: true,
                      message: 'Please select payment method!',
                    },
                  ]}
                  style={{
                    margin: 0,
                    padding: 0,
                    lineHeight: 0,
                  }}
                  name="payment_method"
                >
                  <Select
                    getPopupContainer={(trigger) => trigger.parentNode}
                    size="large"
                    className="w-full"
                    onChange={handleChange}
                    placeholder="select payment method"
                  >
                    {paymentMethods?.map((payment) => (
                      <Option key={payment.paymentMethodTypeId} value={payment.paymentMethodTypeId}>
                        {payment.paymentMethodDescription}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>

              <div>
                <div className="omgFormLabel">Payment Date</div>
                <Form.Item
                  colon={false}
                  rules={[
                    {
                      required: true,
                      message: "Date can't be blank!",
                    },
                  ]}
                  style={{
                    margin: 0,
                    padding: 0,
                    lineHeight: 0,
                  }}
                  name="effective_date"
                >
                  <DatePicker
                    placeholder="Select date"
                    size="large"
                    format={dateFormat}
                    className="w-full"
                    disabledDate={(currentDate) => currentDate && currentDate > moment()}
                  />
                </Form.Item>
              </div>
              <div>
                <div className="omgFormLabel mt-2">Payment Reference (Wire / Cheque Number)</div>
                <Form.Item
                  colon={false}
                  style={{
                    margin: 0,
                    padding: 0,
                    lineHeight: 0,
                  }}
                  name="ref_num"
                >
                  <Input size="large" placeholder="Enter reference id" />
                </Form.Item>
              </div>
              <div className="">{renderCreditCard()}</div>
              <div>
                <div className="omgFormLabel mt-2">Enter payment amount</div>
                <Form.Item
                  style={{ margin: 0 }}
                  colon={false}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: "amount can't be blank!",
                    },
                  ]}
                  name="receivedAmount"
                  initialValue="₹0.00"
                >
                  <CurrencyFormattedInput
                    disabled
                    form={form}
                    size="large"
                    onFocus={(e) => e.target.select()}
                    width={200}
                    style={{ width: '100%' }}
                    placeholder="Enter payment amount"
                    afterOnBlur={() => {}}
                  />
                </Form.Item>
              </div>

              <div>
                <div className="omgFormLabel mt-2">Comment</div>
                <Form.Item required={false} colon={false} name="comments">
                  <TextArea
                    placeholder="Enter comments here"
                    autoSize={{ minRows: 3, maxRows: 6 }}
                  />
                </Form.Item>
              </div>
              {/* TODO: @Amit Mathur comment it upload documents functionality for now.may implement this later. */}
              {/* <div className="w-full ">
                <Upload
                  beforeUpload={(content) => {
                    beforeUpload(content);
                  }}
                  fileList={[]}
                >
                  <div className="w-full  font-medium p-3 cursor-pointer rounded-lg border-gray-400 border border-dashed text-center">
                    <Icon type="upload" /> Upload documents
                  </div>
                </Upload>
              </div> */}
            </div>
          </Col>
        </Row>
      </Form>
    </AppModal>
  );
};

const mapStateToProps = ({ common, student, loading }) => ({
  paymentMethods: common.paymentMethods,
  paymentStats: student.paymentStats,
  studentRecord: student.studentRecord,
  studentInstallments: student.studentInstallments,
  loading: loading.effects['common/paymentCheckOutComplete'],
});

export default connect(mapStateToProps)(withRouter(PaymentMethods));
