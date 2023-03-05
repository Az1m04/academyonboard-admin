import React, { useEffect, useState } from 'react';
import { currencyFormatter, currencyParser, decodeDollarsToDigits } from '@/utils/utils';
import { Form, Row, Col, Input, DatePicker, Divider, Radio } from 'antd';

const PaymentMode = ({
  form,
  installmentsLevel,
  setInstallmentsLevel,
  paymentMode,
  setPaymentMode,
}) => {
  // eslint-disable-next-line no-unused-vars
  const [value, setValue] = useState();

  useEffect(() => {
    setPaymentMode(form.getFieldValue(['feePayment', 'mode']));

    if (form.getFieldValue(['feePayment', 'numOfInstallments']) > 1) {
      // eslint-disable-next-line no-param-reassign
      installmentsLevel.length = form.getFieldValue(['feePayment', 'numOfInstallments']) || 0;
      installmentsLevel?.fill(0);
    }
  }, [form, paymentMode, installmentsLevel, setPaymentMode]);

  return (
    <div className="pb-4">
      <h2 className="p-5 text-base font-semibold text-gray-800 capitalize">Mode of payment</h2>
      <Divider style={{ margin: '0' }} />
      <div className={`px-4 mt-4`}>
        <Row gutter={[28]}>
          <Col lg={8} xl={8} md={8} sm={24} xs={24}>
            <div>
              <p className="font-medium text-gray-800">Total fee</p>
              <Form.Item
                name={['feePayment', 'totalFees']}
                rules={[
                  {
                    required: true,
                    message: 'Please enter total fee',
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
                      feePayment: { totalFees: currencyFormatter.format(currencyParser(mod)) },
                    });
                  }}
                />
              </Form.Item>
            </div>
          </Col>

          <Col lg={12} xl={12} md={8} sm={24} xs={24}>
            <Form.Item
              name={['feePayment', 'mode']}
              style={{ marginTop: 23 }}
              rules={[
                {
                  required: true,
                  message: 'Please select the required!',
                },
              ]}
            >
              <Radio.Group
                value={paymentMode}
                initialValue="New"
                onChange={(e) => {
                  setPaymentMode(e.target.value);
                  if (e.target.value === 'New') {
                    form.setFieldsValue({
                      feePayment: {
                        numOfInstallments: 1,
                      },
                      feePayments: [],
                    });
                    setInstallmentsLevel([0]);
                  }
                }}
              >
                <Radio value="New">Add installments</Radio>
                <Radio value="Merge"> Merge in previous</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>

          {paymentMode === 'New' && (
            <Col lg={8} xl={8} md={8} sm={24} xs={24}>
              <p className="font-medium text-gray-800">No. of Installments</p>
              <Form.Item
                name={['feePayment', 'numOfInstallments']}
                rules={[
                  {
                    required: true,
                    message: 'Please enter your no. of installments',
                  },
                ]}
                initialValue={1}
              >
                <Input
                  autoComplete="off"
                  size="medium"
                  type="number"
                  min={1}
                  placeholder="Enter no. of installments"
                  onChange={(event) => {
                    const state = [];
                    if (event.target.value >= 0) {
                      state.length = event.target.value || 0;
                      state.fill(0);

                      let dividedInstallmentAmount = 0;
                      dividedInstallmentAmount =
                        Number(
                          decodeDollarsToDigits(form?.getFieldValue(['feePayment', 'totalFees'])),
                        ) / event.target.value;

                      const feePayments = form.getFieldValue('feePayments') || [];

                      if (state?.length > 0) {
                        state?.forEach((_, idx) => {
                          feePayments[idx] = {
                            ...feePayments[idx],
                            amount: currencyFormatter.format(dividedInstallmentAmount),
                            // dueDate: undefined,
                          };
                        });

                        form.setFieldsValue({
                          feePayments,
                        });
                      }

                      setInstallmentsLevel(state);
                    }
                  }}
                />
              </Form.Item>
            </Col>
          )}
        </Row>
      </div>
      <div
        className={`${
          installmentsLevel?.length > 5 && 'overflow-y-auto overflow-x-hidden h-96 rounded-md pb-4'
        }`}
      >
        {paymentMode === 'New' &&
          installmentsLevel?.map((item, InstallmentsIndex) => (
            <>
              <p className="font-medium text-sm text-gray-800 py-2.5 bg-gray-100 px-4 ">
                Installment no. {InstallmentsIndex + 1}
              </p>
              <div className={`${installmentsLevel?.length > 5 && 'mb-4'} px-4 mt-4`} key={item}>
                <Row gutter={[12]}>
                  <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                    <p className="font-medium text-gray-800">Amount</p>
                    <Form.Item
                      name={['feePayments', InstallmentsIndex, 'amount']}
                      rules={[
                        {
                          required: true,
                          message: 'Please enter installments amount',
                        },
                      ]}
                      initialValue={form.getFieldValue(['feePayment', 'totalFees'])}
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

                          const feePayments = form.getFieldValue('feePayments');

                          setValue(feePayments);
                          feePayments[InstallmentsIndex] = {
                            ...feePayments[InstallmentsIndex],
                            amount: currencyFormatter.format(currencyParser(mod)),
                          };
                          form.setFieldsValue({
                            feePayments,
                          });
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                    <p className="font-medium text-gray-800">Due date</p>
                    <Form.Item
                      name={['feePayments', InstallmentsIndex, 'dueDate']}
                      rules={[
                        {
                          required: true,
                          message: 'Please select due date',
                        },
                      ]}
                    >
                      <DatePicker
                        getPopupContainer={(node) => node.parentNode}
                        size="medium"
                        style={{ width: '100%' }}
                        placeholder="Select installments due date"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </>
          ))}
      </div>
    </div>
  );
};

export default PaymentMode;
