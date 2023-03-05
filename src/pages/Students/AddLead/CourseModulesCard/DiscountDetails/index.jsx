import React from 'react';
import { Form, Row, Col, Input, Switch } from 'antd';
import { currencyFormatter, currencyParser, decodeDollarsToDigits } from '@/utils/utils';

const DiscountDetails = ({
  feesDetailsForm,
  index,
  isAddOtherAddAdjustmentPresent,
  setIsAddOtherAddAdjustmentPresent,
  modulesList,
  setValue,
  setInstallmentsLevel,
  setPaymentMode,
}) => {
  return (
    <div className="">
      <div className="bg-gray-100 px-4 mb-4 flex justify-between h-10 ">
        <p className="font-medium text-sm text-gray-800 py-2.5 ">Payment adjustments</p>
        <div className="flex flex-wrap justify-end space-x-4">
          <div className="flex justify-end  space-x-4 ">
            <p className="font-medium text-gray-800 text-sm py-2.5">Add other charges</p>
            <Form.Item name={['items', index, 'feeTypeIdOtherCharges']}>
              <Switch
                size="default"
                checked={isAddOtherAddAdjustmentPresent?.addOther}
                onClick={(ev) => {
                  setIsAddOtherAddAdjustmentPresent((prev) => ({ ...prev, addOther: ev }));

                  if (ev === false) {
                    const items = feesDetailsForm.getFieldValue('items');

                    if (modulesList?.length > 0) {
                      let fee = 0;

                      if (feesDetailsForm?.getFieldValue(['feePayment', 'totalFees'])) {
                        fee =
                          Number(
                            decodeDollarsToDigits(
                              feesDetailsForm?.getFieldValue(['feePayment', 'totalFees']),
                            ),
                          ) -
                          Number(
                            decodeDollarsToDigits(
                              feesDetailsForm.getFieldValue(['items', index, 'otherAmount']),
                            ),
                          );
                      }
                      items[index] = {
                        ...items[index],
                        otherPurpose: '',
                        otherRemarks: '',
                        otherAmount: '',
                      };
                      feesDetailsForm.setFieldsValue({
                        items,
                        feePayment: {
                          totalFees: currencyFormatter.format(fee),
                        },
                      });
                    } else {
                      // Deleting added other amount into full course fee
                      let fee = 0;
                      items?.forEach((item) => {
                        fee += Number(decodeDollarsToDigits(item?.basicAmount || 0));
                        fee -= Number(decodeDollarsToDigits(item?.adjustmentAmount || 0));
                        if (feesDetailsForm?.getFieldValue(['feePayment', 'totalFees'])) {
                          fee =
                            Number(
                              decodeDollarsToDigits(
                                feesDetailsForm?.getFieldValue(['feePayment', 'totalFees']),
                              ),
                            ) -
                            Number(
                              decodeDollarsToDigits(
                                feesDetailsForm.getFieldValue(['items', index, 'otherAmount']),
                              ),
                            );
                        }
                      });

                      items[index] = {
                        ...items[index],
                        otherPurpose: '',
                        otherRemarks: '',
                        otherAmount: '',
                      };

                      feesDetailsForm.setFieldsValue({
                        items,
                        feePayment: {
                          totalFees: currencyFormatter.format(fee),
                        },
                      });
                    }
                    // Resetting installments fields when discount amount's changes made
                    if (feesDetailsForm?.getFieldValue(['feePayment', 'numOfInstallments']) > 0) {
                      setInstallmentsLevel([0]);
                      setPaymentMode(false);

                      feesDetailsForm.setFieldsValue({
                        feePayment: {
                          mode: false,
                          numOfInstallments: 1,
                        },
                        feePayments: [],
                      });
                    }
                  }
                }}
              />
            </Form.Item>
          </div>
          <div className="flex justify-end  space-x-4 ">
            <p className="font-medium text-gray-800 text-sm py-2.5">Discount adjustments</p>
            <Form.Item name={['items', index, 'feeTypeIdAdjustment']}>
              <Switch
                size="default"
                checked={isAddOtherAddAdjustmentPresent?.addAdjustment}
                onClick={(ev) => {
                  setIsAddOtherAddAdjustmentPresent((prev) => ({ ...prev, addAdjustment: ev }));

                  if (ev === false) {
                    const items = feesDetailsForm.getFieldValue('items');
                    items[index] = {
                      ...items[index],
                      adjustmentPurpose: '',
                      adjustmentRemarks: '',
                      adjustmentAmount: '',
                    };

                    let totalFees = 0;
                    items?.forEach((item, idx) => {
                      const checkModules = Object.keys(item);

                      if (
                        checkModules?.includes('addModulesCheckbox') &&
                        item?.addModulesCheckbox === true
                      ) {
                        if (
                          checkModules?.includes('modulesItems') ||
                          item?.modulesItems !== undefined
                        ) {
                          item?.modulesItems?.forEach((selectedAmt) => {
                            totalFees += Number(
                              decodeDollarsToDigits(selectedAmt?.moduleBasicAmount || 0),
                            );
                          });
                        } else {
                          totalFees += 0;
                        }
                      } else {
                        // eslint-disable-next-line no-lonely-if
                        if (item?.modulesItems !== undefined) {
                          item?.modulesItems?.forEach((selectedAmt) => {
                            totalFees += Number(
                              decodeDollarsToDigits(selectedAmt?.moduleBasicAmount || 0),
                            );
                          });
                        } else {
                          totalFees += Number(decodeDollarsToDigits(item?.basicAmount || 0));
                        }
                      }

                      if (index !== idx) {
                        totalFees -= Number(decodeDollarsToDigits(item?.adjustmentAmount || 0));
                        totalFees += Number(decodeDollarsToDigits(item?.otherAmount || 0));
                      } else {
                        totalFees += Number(decodeDollarsToDigits(item?.adjustmentAmount || 0));
                        totalFees += Number(decodeDollarsToDigits(item?.otherAmount || 0));
                      }
                    });

                    // Resetting installments fields when discount amount's switch off
                    if (feesDetailsForm?.getFieldValue(['feePayment', 'numOfInstallments']) > 0) {
                      setInstallmentsLevel([0]);
                      setPaymentMode(false);
                    }
                    feesDetailsForm.setFieldsValue({
                      feePayment: {
                        totalFees: currencyFormatter.format(totalFees),
                        mode: false,
                        numOfInstallments: 1,
                      },
                      items,
                      feePayments: [],
                    });
                  }
                }}
              />
            </Form.Item>
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        {isAddOtherAddAdjustmentPresent.addOther && (
          <div className="w-full">
            {/* <p className="font-medium text-sm text-gray-800 mb-4 bg-gray-100 px-4 py-2 rounded-full">
            Add other charges
          </p> */}
            <div className="px-4">
              <Row gutter={[12]}>
                <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                  <div className="">
                    <p className="font-medium text-gray-800">Other charges description</p>
                    <Form.Item
                      name={['items', index, 'otherPurpose']}
                      rules={[
                        {
                          required: true,
                          message: 'Please select Purpose',
                        },
                      ]}
                    >
                      <Input autoComplete="off" placeholder="Enter purpose" size="large" />
                    </Form.Item>
                  </div>
                </Col>
                <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                  <div className="">
                    <p className="font-medium text-gray-800">Other charges amount</p>
                    <Form.Item
                      name={['items', index, 'otherAmount']}
                      rules={[
                        {
                          required: true,
                          message: 'Please enter amount ',
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

                          const items = feesDetailsForm.getFieldValue('items');

                          setValue((prev) => {
                            return { ...prev, ...mod };
                          });
                          items[index] = {
                            ...items[index],
                            otherAmount: currencyFormatter.format(currencyParser(mod)),
                          };

                          let otherChargesFee = 0;

                          items?.forEach((item) => {
                            const checkModules = Object.keys(item);

                            if (
                              checkModules?.includes('addModulesCheckbox') &&
                              item?.addModulesCheckbox === true
                            ) {
                              if (
                                checkModules?.includes('modulesItems') ||
                                item?.modulesItems !== undefined
                              ) {
                                item?.modulesItems?.forEach((selectedAmt) => {
                                  otherChargesFee += Number(
                                    decodeDollarsToDigits(selectedAmt?.moduleBasicAmount || 0),
                                  );
                                });
                              } else {
                                otherChargesFee += 0;
                              }
                            } else {
                              // eslint-disable-next-line no-lonely-if
                              if (item?.modulesItems !== undefined) {
                                item?.modulesItems?.forEach((selectedAmt) => {
                                  otherChargesFee += Number(
                                    decodeDollarsToDigits(selectedAmt?.moduleBasicAmount || 0),
                                  );
                                });
                              } else {
                                otherChargesFee += Number(
                                  decodeDollarsToDigits(item?.basicAmount || 0),
                                );
                              }
                            }
                            otherChargesFee -= Number(
                              decodeDollarsToDigits(item?.adjustmentAmount || 0),
                            );

                            otherChargesFee += Number(
                              decodeDollarsToDigits(item?.otherAmount || 0),
                            );
                          });

                          feesDetailsForm.setFieldsValue({
                            items,
                            feePayment: {
                              totalFees: currencyFormatter.format(otherChargesFee),
                            },
                          });

                          // Resetting installments fields when other charges changes made

                          if (
                            feesDetailsForm?.getFieldValue(['feePayment', 'numOfInstallments']) > 0
                          ) {
                            setInstallmentsLevel([0]);
                            setPaymentMode(false);

                            feesDetailsForm.setFieldsValue({
                              feePayment: {
                                mode: false,
                                numOfInstallments: 1,
                              },
                              feePayments: [],
                            });
                          }
                        }}
                      />
                    </Form.Item>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        )}

        {isAddOtherAddAdjustmentPresent.addAdjustment && (
          <div className="w-full">
            {/* <p className="font-medium text-sm text-gray-800 mb-4 bg-gray-100 px-4 py-2 rounded-full">
            Add discount adjustment
          </p> */}
            <div className="px-4">
              <Row gutter={[12]}>
                <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                  <div className="">
                    <p className="font-medium text-gray-800">Discount description</p>
                    <Form.Item
                      name={['items', index, 'adjustmentPurpose']}
                      rules={[
                        {
                          required: true,
                          message: 'Please select Purpose',
                        },
                      ]}
                    >
                      <Input autoComplete="off" placeholder="Enter purpose" size="large" />
                    </Form.Item>
                  </div>
                </Col>
                <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                  <div className="">
                    <p className="font-medium text-gray-800">Discount amount</p>
                    <Form.Item
                      name={['items', index, 'adjustmentAmount']}
                      rules={[
                        {
                          required: true,
                          message: 'Please enter amount ',
                        },
                        () => ({
                          validator(_, value) {
                            if (modulesList?.length > 0) {
                              const moduleItems = feesDetailsForm?.getFieldValue([
                                'items',
                                index,
                                'modulesItems',
                              ]);
                              let totalModuleFees = 0;
                              moduleItems?.forEach((selectedAmt) => {
                                totalModuleFees += Number(
                                  decodeDollarsToDigits(selectedAmt?.moduleBasicAmount),
                                );
                              });

                              const itemData = feesDetailsForm.getFieldValue('items')[index];
                              const fees =
                                totalModuleFees +
                                Number(decodeDollarsToDigits(itemData?.otherAmount) || 0);

                              const val = Number(value) ? value : decodeDollarsToDigits(value);
                              if (fees >= val) {
                                // eslint-disable-next-line prefer-promise-reject-errors
                                return Promise.resolve();
                                // eslint-disable-next-line no-else-return
                              } else {
                                return Promise.reject(
                                  new Error(
                                    "Discount amount can't be larger than the total amount of selected modules!",
                                  ),
                                );
                              }

                              // eslint-disable-next-line no-else-return
                            } else {
                              const itemData = feesDetailsForm.getFieldValue('items')[index];
                              const fees =
                                Number(decodeDollarsToDigits(itemData?.basicAmount) || 0) +
                                Number(decodeDollarsToDigits(itemData?.otherAmount) || 0);

                              const val = Number(value) ? value : decodeDollarsToDigits(value);
                              if (fees >= val) {
                                // eslint-disable-next-line prefer-promise-reject-errors
                                return Promise.resolve();
                                // eslint-disable-next-line no-else-return
                              } else {
                                return Promise.reject(
                                  new Error(
                                    "Discount amount can't be larger than the total amount of selected course!",
                                  ),
                                );
                              }
                            }
                          },
                        }),
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

                          const items = feesDetailsForm.getFieldValue('items');

                          setValue((prev) => {
                            return { ...prev, ...mod };
                          });
                          items[index] = {
                            ...items[index],
                            adjustmentAmount: currencyFormatter.format(currencyParser(mod)),
                          };

                          let totalFees = 0;
                          items?.forEach((item, idx) => {
                            const checkModules = Object.keys(item);

                            if (
                              checkModules?.includes('addModulesCheckbox') &&
                              item?.addModulesCheckbox === true
                            ) {
                              if (
                                checkModules?.includes('modulesItems') ||
                                item?.modulesItems !== undefined
                              ) {
                                item?.modulesItems?.forEach((selectedAmt) => {
                                  totalFees += Number(
                                    decodeDollarsToDigits(selectedAmt?.moduleBasicAmount || 0),
                                  );
                                });
                              } else {
                                totalFees += 0;
                              }
                            } else {
                              // eslint-disable-next-line no-lonely-if
                              if (item?.modulesItems !== undefined) {
                                item?.modulesItems?.forEach((selectedAmt) => {
                                  totalFees += Number(
                                    decodeDollarsToDigits(selectedAmt?.moduleBasicAmount || 0),
                                  );
                                });
                              } else {
                                totalFees += Number(decodeDollarsToDigits(item?.basicAmount || 0));
                              }
                            }
                            totalFees -= Number(decodeDollarsToDigits(item?.adjustmentAmount || 0));

                            totalFees += Number(decodeDollarsToDigits(item?.otherAmount || 0));

                            if (index === idx) {
                              if (
                                // checkModules?.includes('modulesItems') ||
                                item?.modulesItems !== undefined
                              ) {
                                let totalModuleFees = 0;

                                item?.modulesItems?.forEach((selectedAmt) => {
                                  totalModuleFees += Number(
                                    decodeDollarsToDigits(selectedAmt?.moduleBasicAmount),
                                  );
                                });

                                const finalFee =
                                  totalModuleFees +
                                  Number(decodeDollarsToDigits(item?.otherAmount || 0)) -
                                  Number(mod);

                                if (finalFee < 0) {
                                  totalFees += -1 * finalFee;
                                  items[index] = {
                                    ...items[index],
                                    adjustmentAmount: currencyFormatter.format(
                                      Number(mod) + finalFee,
                                    ),
                                  };
                                }
                              } else {
                                const finalFee =
                                  Number(decodeDollarsToDigits(item?.basicAmount || 0)) +
                                  Number(decodeDollarsToDigits(item?.otherAmount || 0)) -
                                  Number(mod);

                                if (finalFee < 0) {
                                  totalFees += -1 * finalFee;
                                  items[index] = {
                                    ...items[index],
                                    adjustmentAmount: currencyFormatter.format(
                                      Number(mod) + finalFee,
                                    ),
                                  };
                                }
                              }
                            }
                          });

                          // Resetting installments fields when discount amount's changes made

                          if (
                            feesDetailsForm?.getFieldValue(['feePayment', 'numOfInstallments']) > 0
                          ) {
                            setInstallmentsLevel([0]);
                            setPaymentMode(false);

                            feesDetailsForm.setFieldsValue({
                              feePayment: {
                                mode: false,
                                numOfInstallments: 1,
                              },
                              feePayments: [],
                            });
                          }
                          feesDetailsForm.setFieldsValue({
                            items,
                            feePayment: {
                              totalFees: currencyFormatter.format(totalFees),
                            },
                          });
                        }}
                      />
                    </Form.Item>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscountDetails;
