/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import { currencyFormatter, currencyParser, decodeDollarsToDigits } from '@/utils/utils';
import { Form, Row, Col, Input, DatePicker, Divider, Checkbox } from 'antd';

const ModeOfPayment = ({
  feesDetailsForm,
  installmentsLevel,
  setInstallmentsLevel,
  paymentMode,
  setPaymentMode,
}) => {
  // eslint-disable-next-line no-unused-vars
  const [value, setValue] = useState();

  useEffect(() => {
    setPaymentMode(feesDetailsForm.getFieldValue(['feePayment', 'mode']));
    if (feesDetailsForm.getFieldValue(['feePayment', 'numOfInstallments']) > 1) {
      // eslint-disable-next-line no-param-reassign
      installmentsLevel.length =
        feesDetailsForm.getFieldValue(['feePayment', 'numOfInstallments']) || 0;
      installmentsLevel?.fill(0);
    }
  }, [feesDetailsForm, paymentMode, installmentsLevel, setPaymentMode]);

  return (
    <div className="pb-4">
      <h2 className="p-5 text-base font-semibold text-gray-800 capitalize">Mode of payment</h2>
      <Divider style={{ margin: '0' }} />
      <div className={`px-4 mt-4`}>
        <Row gutter={[28]}>
          <Col lg={10} xl={10} md={12} sm={24} xs={24}>
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
                  size="large"
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

                    feesDetailsForm.setFieldsValue({
                      feePayment: { totalFees: currencyFormatter.format(currencyParser(mod)) },
                    });
                  }}
                />
              </Form.Item>
            </div>
          </Col>

          <Col lg={4} xl={4} md={12} sm={24} xs={24}>
            <Form.Item
              name={['feePayment', 'mode']}
              valuePropName="checked"
              style={{ marginTop: 23 }}
            >
              <Checkbox
                onChange={(e) => {
                  setPaymentMode(e.target.checked);
                  if (!e.target.checked) {
                    feesDetailsForm.setFieldsValue({
                      feePayment: {
                        numOfInstallments: 1,
                      },
                      feePayments: [],
                    });
                    setInstallmentsLevel([0]);
                  }
                }}
              >
                Add installments
              </Checkbox>
            </Form.Item>
          </Col>

          {paymentMode && (
            <Col lg={10} xl={10} md={12} sm={24} xs={24}>
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
                  size="large"
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
                          decodeDollarsToDigits(
                            feesDetailsForm?.getFieldValue(['feePayment', 'totalFees']),
                          ),
                        ) / event.target.value;

                      const feePayments = feesDetailsForm.getFieldValue('feePayments') || [];

                      if (state?.length > 0) {
                        state?.forEach((_, idx) => {
                          feePayments[idx] = {
                            ...feePayments[idx],
                            amount: currencyFormatter.format(dividedInstallmentAmount),
                            // dueDate: undefined,
                          };
                        });

                        feesDetailsForm.setFieldsValue({
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
        className={`grid grid-cols-4 gap-2 w-full px-4 ${
          installmentsLevel?.length > 8 && 'overflow-y-auto overflow-x-hidden h-96 rounded-md pb-4'
        }`}
      >
        {paymentMode &&
          installmentsLevel?.map((item, InstallmentsIndex) => (
            <>
              <div key={item} className="w-full bg-gray-50 rounded-lg shadow-md">
                <p className="font-medium text-sm text-gray-800 py-2.5 bg-blue-100 px-4 rounded-t-lg">
                  Installment no. {InstallmentsIndex + 1}
                </p>
                <div className={` px-4 mt-4`} key={InstallmentsIndex + 1}>
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
                        initialValue={feesDetailsForm.getFieldValue(['feePayment', 'totalFees'])}
                      >
                        <Input
                          size="large"
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

                            const feePayments = feesDetailsForm.getFieldValue('feePayments');

                            setValue(feePayments);
                            feePayments[InstallmentsIndex] = {
                              ...feePayments[InstallmentsIndex],
                              amount: currencyFormatter.format(currencyParser(mod)),
                            };
                            feesDetailsForm.setFieldsValue({
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
                          size="large"
                          style={{ width: '100%' }}
                          placeholder="Select installments due date"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              </div>
            </>
          ))}
      </div>
    </div>
  );
};

export default ModeOfPayment;
