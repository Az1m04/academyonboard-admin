import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Input, Select, DatePicker, Divider, notification } from 'antd';
import { currencyFormatter, currencyParser, decodeDollarsToDigits } from '@/utils/utils';
import Card from '@/components/Structure/Card';
import moment from 'moment';
import DiscountDetails from '../DiscountDetails';
import { connect } from 'umi';

const FeePaymentDetails = ({
  courseDetailsForm,
  index,
  feeArray,
  feesDetailsForm,
  courseDisplayName,
  courseList,
  setInstallmentsLevel,
  setPaymentMode,
}) => {
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [startValue, setStartValue] = useState(null);
  const modulesIds = courseDetailsForm.getFieldValue(['items', index, 'modulesList']);
  const modulesList = courseList[index]?.courseModulesArray?.filter((mod) =>
    modulesIds?.includes(mod?.id),
  );
  const [isAddOtherAddAdjustmentPresent, setIsAddOtherAddAdjustmentPresent] = useState({
    addAdjustment: false,
    addOther: false,
  });
  useEffect(() => {
    setIsAddOtherAddAdjustmentPresent({
      addAdjustment: feesDetailsForm?.getFieldValue(['items', index, 'feeTypeIdAdjustment']),
      addOther: feesDetailsForm.getFieldValue(['items', index, 'feeTypeIdOtherCharges']),
    });
  }, [feesDetailsForm, index]);
  // eslint-disable-next-line no-unused-vars
  const [value, setValue] = useState(null);
  const cleanInput = (inp) => {
    if (inp) {
      return inp.replace(/(?!-)[^0-9.]/g, '').replace('-', '');
    }
    return '';
  };
  const onChange = (e, idx) => {
    const items = feesDetailsForm.getFieldValue('items');
    const values = cleanInput(e.toString());
    items[index].modulesItems[idx] = {
      ...items[index].modulesItems[idx],
      moduleNoOfDays: values,
    };
    feesDetailsForm.setFieldsValue({
      items,
    });
  };

  const frequencyOfTime = [
    {
      value: 'TF_day',
      name: 'days',
      calculateUnit: 'days',
    },
    {
      value: 'TF_wk',
      name: 'weeks',
      calculateUnit: 'weeks',
    },
    {
      value: 'TF_mon',
      name: 'months',
      calculateUnit: 'months',
    },
    {
      value: 'TF_qr',
      name: 'quarters',
      calculateUnit: 'quarters',
    },
    {
      value: 'TF_yr',
      name: 'years',
      calculateUnit: 'years',
    },
    {
      value: 'TF_hy',
      name: 'half years',
      calculateUnit: 'half years',
    },
    {
      value: 'TF_sm',
      name: 'semesters',
      calculateUnit: 'months',
    },
  ];

  const onFrequencyChange = (e) => {
    const items = feesDetailsForm.getFieldValue('items');
    const values = cleanInput(e.target.value.toString());
    items[index] = {
      ...items[index],
      timeFreq: values,
    };
    feesDetailsForm.setFieldsValue({
      items,
    });
  };

  const onModulesFrequencyChange = (e, idx) => {
    const items = feesDetailsForm.getFieldValue('items');
    const values = cleanInput(e.target.value.toString());
    items[index].modulesItems[idx] = {
      ...items[index].modulesItems[idx],
      timeFreq: values,
    };
    feesDetailsForm.setFieldsValue({
      items,
    });
  };
  return (
    <Card>
      <h2 className="p-5 text-base font-semibold text-gray-800 ">
        {courseDetailsForm.getFieldValue(['items', index, 'addModulesCheckbox'])
          ? `${courseDisplayName} module wise fee details`
          : `${courseDisplayName} full course fee details`}
      </h2>
      <Divider style={{ margin: '0' }} />
      <div className="px-4 mt-4">
        {courseDetailsForm.getFieldValue(['items', index, 'addModulesCheckbox']) &&
          modulesList?.map((moduleItem, idx) => (
            <Row gutter={[12]} key={moduleItem?.id} Form={feesDetailsForm}>
              <Col lg={4} xl={4} md={12} sm={24} xs={24}>
                <p className="font-medium text-gray-800">Module name</p>
                <Form.Item
                  name={['items', index, 'modulesItems', idx, 'moduleId']}
                  rules={[
                    {
                      required: true,
                      message: 'Please select name of the module',
                    },
                  ]}
                >
                  <Select
                    size="large"
                    placeholder="Please list down the module name"
                    style={{ width: '100%' }}
                    getPopupContainer={(node) => node.parentNode}
                  >
                    <Select.Option value={moduleItem?.id}>{moduleItem?.displayName}</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col lg={4} xl={4} md={12} sm={24} xs={24}>
                <div className="">
                  <p className="font-medium text-gray-800">Frequency of time</p>
                  <Form.Item
                    name={['items', index, 'modulesItems', idx, 'moduleDurationUnitId']}
                    rules={[
                      {
                        required: true,
                        message: 'Please select module fee frequency',
                      },
                    ]}
                  >
                    <Select
                      // allowClear
                      showSearch
                      size="large"
                      getPopupContainer={(node) => node.parentNode}
                      placeholder="Select a frequency of time"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      onSelect={(val) => {
                        const items = feesDetailsForm.getFieldValue('items');

                        const fee1 = moduleItem?.fees?.find((amt) => amt?.feeDurationId === val)
                          ?.feeAmount;
                        setValue((prev) => {
                          return { ...prev, ...fee1 };
                        });
                        items[index].modulesItems[idx] = {
                          ...items[index].modulesItems[idx],
                          moduleBasicAmount: currencyFormatter.format(fee1),
                          timeFreq: undefined,
                          moduleStartDate: undefined,
                          moduleEndDate: undefined,
                          moduleNoOfDays: undefined,
                        };

                        let fee = 0;

                        items?.forEach((item, idxModules) => {
                          if (item?.modulesItems !== undefined) {
                            item?.modulesItems?.forEach((selectedAmt) => {
                              fee += Number(
                                decodeDollarsToDigits(selectedAmt?.moduleBasicAmount || 0),
                              );
                            });
                          } else {
                            fee += Number(decodeDollarsToDigits(item?.basicAmount || 0));
                          }
                          if (index !== idxModules) {
                            fee -= Number(decodeDollarsToDigits(item?.adjustmentAmount || 0));
                            fee += Number(decodeDollarsToDigits(item?.otherAmount || 0));
                          }
                        });

                        feesDetailsForm.setFieldsValue({
                          items,
                          feePayment: { totalFees: currencyFormatter.format(fee) },
                        });
                      }}
                      onChange={(val) => {
                        if (val) {
                          const items = feesDetailsForm.getFieldValue('items');
                          items[index] = {
                            ...items[index],
                            otherPurpose: '',
                            otherRemarks: '',
                            otherAmount: '',
                            adjustmentPurpose: '',
                            adjustmentRemarks: '',
                            adjustmentAmount: '',
                            feeTypeIdAdjustment: false,
                            feeTypeIdOtherCharges: false,
                          };

                          feesDetailsForm.setFieldsValue({
                            items,
                          });
                          setIsAddOtherAddAdjustmentPresent({
                            addAdjustment: false,
                            addOther: false,
                          });
                          // Resetting installments fields when frequency of time changes
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
                        }
                      }}
                    >
                      {moduleItem?.fees?.map((item) => (
                        <Select.Option value={item?.feeDurationId} key={item?.feeDurationId}>
                          {item?.feeDuration}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
              <Col lg={2} xl={2} md={12} sm={24} xs={24}>
                <p className="font-medium text-gray-800">
                  No. of{' '}
                  {
                    frequencyOfTime?.find(
                      (val) =>
                        val?.value ===
                        feesDetailsForm.getFieldValue([
                          'items',
                          index,
                          'modulesItems',
                          idx,
                          'moduleDurationUnitId',
                        ]),
                    )?.name
                  }
                </p>
                <Form.Item
                  name={['items', index, 'modulesItems', idx, 'timeFreq']}
                  rules={[
                    {
                      required: true,
                      message: 'Please add frequency of time',
                    },
                  ]}
                >
                  <Input
                    autoComplete="off"
                    size="large"
                    min={0}
                    placeholder={`Enter no. of ${
                      frequencyOfTime?.find(
                        (val) =>
                          val?.value ===
                          feesDetailsForm.getFieldValue([
                            'items',
                            index,
                            'modulesItems',
                            idx,
                            'moduleDurationUnitId',
                          ]),
                      )?.name
                    }`}
                    onChange={(val) => {
                      onModulesFrequencyChange(val, idx);
                      // Giving notification messages
                      if (
                        feesDetailsForm.getFieldValue([
                          'items',
                          index,
                          'modulesItems',
                          idx,
                          'moduleDurationUnitId',
                        ]) === undefined
                      ) {
                        const args = {
                          description: `Please select frequency of time first`,
                          duration: 2,
                        };
                        notification.error(args);
                      } else {
                        const items = feesDetailsForm.getFieldValue('items');
                        items[index].modulesItems[idx] = {
                          ...items[index].modulesItems[idx],
                          moduleEndDate: undefined,
                          moduleStartDate: undefined,
                        };

                        setValue(items);
                        feesDetailsForm.setFieldsValue({
                          items,
                        });
                      }
                    }}
                    onBlur={(val) => {
                      if (
                        feesDetailsForm.getFieldValue([
                          'items',
                          index,
                          'modulesItems',
                          idx,
                          'moduleDurationUnitId',
                        ]) !== undefined
                      ) {
                        const items = feesDetailsForm.getFieldValue('items');

                        const fee1 =
                          moduleItem?.fees?.find(
                            (amt) =>
                              amt?.feeDurationId ===
                              feesDetailsForm.getFieldValue([
                                'items',
                                index,
                                'modulesItems',
                                idx,
                                'moduleDurationUnitId',
                              ]),
                          )?.feeAmount * val.target.value;

                        setValue(fee1);

                        items[index].modulesItems[idx] = {
                          ...items[index].modulesItems[idx],
                          moduleBasicAmount: currencyFormatter.format(fee1),
                        };

                        feesDetailsForm.setFieldsValue({
                          items,
                        });

                        let fee = 0;

                        items?.forEach((item, idxModules) => {
                          if (item?.modulesItems !== undefined) {
                            item?.modulesItems?.forEach((selectedAmt) => {
                              fee += Number(
                                decodeDollarsToDigits(selectedAmt?.moduleBasicAmount || 0),
                              );
                            });
                          } else {
                            fee += Number(decodeDollarsToDigits(item?.basicAmount || 0));
                          }
                          if (index !== idxModules) {
                            fee -= Number(decodeDollarsToDigits(item?.adjustmentAmount || 0));
                            fee += Number(decodeDollarsToDigits(item?.otherAmount || 0));
                          } else {
                            items[index] = {
                              ...items[index],
                              otherPurpose: '',
                              otherRemarks: '',
                              otherAmount: '',
                              adjustmentPurpose: '',
                              adjustmentRemarks: '',
                              adjustmentAmount: '',
                              feeTypeIdAdjustment: false,
                              feeTypeIdOtherCharges: false,
                            };

                            feesDetailsForm.setFieldsValue({
                              items,
                            });

                            setIsAddOtherAddAdjustmentPresent({
                              addAdjustment: false,
                              addOther: false,
                            });
                          }

                          feesDetailsForm.setFieldsValue({
                            feePayment: { totalFees: currencyFormatter.format(fee) },
                          });
                        });
                      }
                    }}
                  />
                </Form.Item>
              </Col>
              <Col lg={4} xl={4} md={12} sm={24} xs={24}>
                <p className="font-medium text-gray-800">Module start date</p>
                <Form.Item
                  name={['items', index, 'modulesItems', idx, 'moduleStartDate']}
                  rules={[
                    {
                      required: true,
                      message: 'Please select module start date',
                    },
                  ]}
                >
                  <DatePicker
                    size="large"
                    style={{ width: '100%' }}
                    placeholder="Select module start date"
                    on
                    onChange={(val) => {
                      if (val !== null) {
                        if (
                          feesDetailsForm.getFieldValue([
                            'items',
                            index,
                            'modulesItems',
                            idx,
                            'timeFreq',
                          ])
                        ) {
                          const items = feesDetailsForm.getFieldValue('items') || [];

                          const newEndDate = moment(val).add(
                            feesDetailsForm.getFieldValue([
                              'items',
                              index,
                              'modulesItems',
                              idx,
                              'moduleDurationUnitId',
                            ]) === 'TF_sm'
                              ? 6 *
                                  Number(
                                    feesDetailsForm.getFieldValue([
                                      'items',
                                      index,
                                      'modulesItems',
                                      idx,
                                      'timeFreq',
                                    ]),
                                  )
                              : Number(
                                  feesDetailsForm.getFieldValue([
                                    'items',
                                    index,
                                    'modulesItems',
                                    idx,
                                    'timeFreq',
                                  ]),
                                ),
                            `${
                              frequencyOfTime?.find(
                                (item) =>
                                  item?.value ===
                                  feesDetailsForm.getFieldValue([
                                    'items',
                                    index,
                                    'modulesItems',
                                    idx,
                                    'moduleDurationUnitId',
                                  ]),
                              )?.calculateUnit
                            }`,
                          );

                          setValue(newEndDate);
                          items[index].modulesItems[idx] = {
                            ...items[index].modulesItems[idx],
                            moduleEndDate: moment(newEndDate) || undefined,
                          };
                          feesDetailsForm.setFieldsValue({
                            items,
                          });

                          // const feeItems = courseDetailsForm.getFieldValue('items');
                          // feeItems[index] = {
                          //   ...feeItems[index],
                          //   endDate: moment(newEndDate) || undefined,
                          //   startDate: moment(val),
                          // };

                          // courseDetailsForm.setFieldsValue({
                          //   items: feeItems,
                          // });
                        } else {
                          // const items = courseDetailsForm.getFieldValue('items') || [];
                          // items[index] = {
                          //   ...items[index],
                          //   endDate: undefined,
                          // };
                          // courseDetailsForm.setFieldsValue({
                          //   items,
                          // });

                          const feeItems = feesDetailsForm.getFieldValue('items');
                          feeItems[index] = {
                            ...feeItems[index],
                            endDate: undefined,
                          };

                          feesDetailsForm.setFieldsValue({
                            items: feeItems,
                          });
                        }

                        // Giving notification messages
                        if (
                          feesDetailsForm.getFieldValue([
                            'items',
                            index,
                            'modulesItems',
                            idx,
                            'timeFreq',
                          ]) === undefined
                        ) {
                          const args = {
                            // message: 'Notification Title',
                            description: `Please fill no. of ${
                              frequencyOfTime?.find(
                                (values) =>
                                  values?.value ===
                                  feesDetailsForm.getFieldValue([
                                    'items',
                                    index,
                                    'modulesItems',
                                    idx,
                                    'moduleDurationUnitId',
                                  ]),
                              )?.name
                            }`,
                            duration: 2,
                          };
                          notification.error(args);
                        }
                      }

                      // if statement to check when deselect start date and resetting end date accordingly

                      if (val === null) {
                        const items = feesDetailsForm.getFieldValue('items');

                        items[index].modulesItems[idx] = {
                          ...items[index].modulesItems[idx],
                          moduleNoOfDays: undefined,
                          moduleEndDate: undefined,
                        };
                        feesDetailsForm.setFieldsValue({
                          items,
                        });
                      }

                      // if statement to check when entered start date and enabling end date accordingly

                      if (
                        feesDetailsForm.getFieldValue([
                          'items',
                          index,
                          'modulesItems',
                          idx,
                          'moduleEndDate',
                        ]) !== undefined
                      ) {
                        const a = moment(val);
                        const b = moment(
                          feesDetailsForm.getFieldValue([
                            'items',
                            index,
                            'modulesItems',
                            idx,
                            'moduleEndDate',
                          ]),
                        );

                        const items = feesDetailsForm.getFieldValue('items');

                        setValue((prev) => {
                          return { ...prev, ...a };
                        });

                        items[index].modulesItems[idx] = {
                          ...items[index].modulesItems[idx],
                          moduleNoOfDays: b.endOf('day').diff(a.startOf('day'), 'days') + 1,
                        };
                        feesDetailsForm.setFieldsValue({
                          items,
                        });
                      }
                    }}
                  />
                </Form.Item>
              </Col>
              <Col lg={4} xl={4} md={12} sm={24} xs={24}>
                <p className="font-medium text-gray-800">Module end date</p>
                <Form.Item
                  name={['items', index, 'modulesItems', idx, 'moduleEndDate']}
                  rules={[
                    {
                      required: true,
                      message: 'Please select module end date',
                    },
                  ]}
                >
                  <DatePicker
                    size="large"
                    style={{ width: '100%' }}
                    placeholder="Select module end date"
                    onChange={(val) => {
                      if (val) {
                        const items = feesDetailsForm.getFieldValue('items');
                        items[index].modulesItems[idx] = {
                          ...items[index].modulesItems[idx],
                          timeFreq: undefined,
                          moduleStartDate: undefined,
                        };
                        feesDetailsForm.setFieldsValue({
                          items,
                        });

                        // const feeItems = feesDetailsForm.getFieldValue('items');
                        // feeItems[index] = {
                        //   ...feeItems[index],
                        //   endDate: moment(val),
                        //   timeFreq: undefined,
                        //   startDate: undefined,
                        // };

                        // feesDetailsForm.setFieldsValue({
                        //   items: feeItems,
                        // });
                      }

                      // Giving notification messages
                      if (
                        feesDetailsForm.getFieldValue([
                          'items',
                          index,
                          'modulesItems',
                          idx,
                          'moduleStartDate',
                        ]) === undefined
                      ) {
                        const args = {
                          description: `Please fill start date first`,
                          duration: 2,
                        };
                        notification.error(args);
                      }

                      if (
                        feesDetailsForm.getFieldValue([
                          'items',
                          index,
                          'modulesItems',
                          idx,
                          'moduleStartDate',
                        ]) !== undefined
                      ) {
                        const a = moment(
                          feesDetailsForm
                            .getFieldValue(['items', index, 'modulesItems', idx, 'moduleStartDate'])
                            ?.toISOString(),
                        );
                        const b = moment(val?.toISOString());

                        const items = feesDetailsForm.getFieldValue('items');

                        setValue((prev) => {
                          return { ...prev, ...b };
                        });

                        items[index].modulesItems[idx] = {
                          ...items[index].modulesItems[idx],
                          moduleNoOfDays: b.endOf('day').diff(a.startOf('day'), 'days') + 1,
                        };
                        feesDetailsForm.setFieldsValue({
                          items,
                        });
                      }
                    }}
                  />
                </Form.Item>
              </Col>
              <Col lg={2} xl={2} md={12} sm={24} xs={24}>
                <p className="font-medium text-gray-800">No. of days</p>
                <Form.Item
                  name={['items', index, 'modulesItems', idx, 'moduleNoOfDays']}
                  rules={[
                    {
                      required: true,
                      message: 'Please enter module no. of days',
                    },
                  ]}
                >
                  <Input
                    autoComplete="off"
                    size="large"
                    // type="number"
                    min={0}
                    placeholder="Enter no. of days"
                    onChange={(e) => onChange(e.target.value, idx)}
                  />
                </Form.Item>
              </Col>
              <Col lg={4} xl={4} md={12} sm={24} xs={24}>
                <div>
                  <p className="font-medium text-gray-800">Amount</p>
                  <Form.Item
                    name={['items', index, 'modulesItems', idx, 'moduleBasicAmount']}
                    rules={[
                      {
                        required: true,
                        message: 'Please enter module amount',
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

                        items[index].modulesItems[idx] = {
                          ...items[index].modulesItems[idx],
                          moduleBasicAmount: currencyFormatter.format(currencyParser(mod)),
                        };

                        items[index] = {
                          ...items[index],
                          otherPurpose: '',
                          otherRemarks: '',
                          otherAmount: '',
                          adjustmentPurpose: '',
                          adjustmentRemarks: '',
                          adjustmentAmount: '',
                          feeTypeIdAdjustment: false,
                          feeTypeIdOtherCharges: false,
                        };

                        setIsAddOtherAddAdjustmentPresent({
                          addAdjustment: false,
                          addOther: false,
                        });

                        let fee = 0;

                        items?.forEach((item) => {
                          if (item?.modulesItems !== undefined) {
                            item?.modulesItems?.forEach((selectedAmt) => {
                              fee += Number(
                                decodeDollarsToDigits(selectedAmt?.moduleBasicAmount || 0),
                              );
                            });
                          } else {
                            fee += Number(decodeDollarsToDigits(item?.basicAmount || 0));
                          }

                          fee -= Number(decodeDollarsToDigits(item?.adjustmentAmount || 0));
                          fee += Number(decodeDollarsToDigits(item?.otherAmount || 0));
                        });

                        feesDetailsForm.setFieldsValue({
                          items,
                          feePayment: {
                            totalFees: currencyFormatter.format(fee),
                          },
                        });

                        // Resetting installments fields when modules amount changes
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
          ))}

        {!courseDetailsForm.getFieldValue(['items', index, 'addModulesCheckbox']) && (
          <Row gutter={[12]}>
            {/* Row for full course wise fees */}
            <Col lg={5} xl={5} md={12} sm={24} xs={24}>
              <div className="">
                <p className="font-medium text-gray-800">Frequency of time</p>
                <Form.Item
                  name={['items', index, 'durationUnitId']}
                  rules={[
                    {
                      required: true,
                      message: 'Please select fee frequency',
                    },
                  ]}
                >
                  <Select
                    disabled
                    showSearch
                    size="large"
                    getPopupContainer={(node) => node.parentNode}
                    placeholder="Select a frequency of time"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    onSelect={(val) => {
                      const items = feesDetailsForm.getFieldValue('items');

                      items[index] = {
                        ...items[index],
                        basicAmount: currencyFormatter.format(
                          feeArray?.find((item) => item?.feeDurationId === val)?.feeAmount,
                        ),
                      };

                      let fee = 0;

                      items?.forEach((item, idx) => {
                        if (item?.modulesItems !== undefined) {
                          item?.modulesItems?.forEach((selectedAmt) => {
                            fee += Number(
                              decodeDollarsToDigits(selectedAmt?.moduleBasicAmount || 0),
                            );
                          });
                        } else {
                          fee += Number(decodeDollarsToDigits(item?.basicAmount || 0));
                        }
                        if (index !== idx) {
                          fee -= Number(decodeDollarsToDigits(item?.adjustmentAmount || 0));
                          fee += Number(decodeDollarsToDigits(item?.otherAmount || 0));
                        }
                      });

                      feesDetailsForm.setFieldsValue({
                        items,
                        feePayment: { totalFees: currencyFormatter.format(fee) },
                      });
                    }}
                    onChange={(val) => {
                      if (val) {
                        const items = feesDetailsForm.getFieldValue('items');
                        items[index] = {
                          ...items[index],
                          otherPurpose: '',
                          otherRemarks: '',
                          otherAmount: '',
                          adjustmentPurpose: '',
                          adjustmentRemarks: '',
                          adjustmentAmount: '',
                          feeTypeIdAdjustment: false,
                          feeTypeIdOtherCharges: false,
                        };

                        feesDetailsForm.setFieldsValue({
                          items,
                        });
                        setIsAddOtherAddAdjustmentPresent({
                          addAdjustment: false,
                          addOther: false,
                        });
                        // Resetting installments fields when frequency of time changes
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
                      }
                    }}
                  >
                    {feeArray?.map((item) => (
                      <Select.Option value={item?.feeDurationId} key={item?.feeDurationId}>
                        {item?.feeDuration}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </Col>

            <Col lg={4} xl={4} md={12} sm={24} xs={24}>
              <p className="font-medium text-gray-800">
                No. of{' '}
                {
                  frequencyOfTime?.find(
                    (val) =>
                      val?.value ===
                      feesDetailsForm.getFieldValue(['items', index, 'durationUnitId']),
                  )?.name
                }
              </p>
              <Form.Item
                name={['items', index, 'timeFreq']}
                rules={[
                  {
                    required: true,
                    message: 'Please add frequency of time',
                  },
                ]}
              >
                <Input
                  disabled
                  autoComplete="off"
                  size="large"
                  min={0}
                  placeholder={`Enter no. of ${
                    frequencyOfTime?.find(
                      (val) =>
                        val?.value ===
                        feesDetailsForm.getFieldValue(['items', index, 'durationUnitId']),
                    )?.name
                  }`}
                  onChange={(val) => {
                    onFrequencyChange(val);

                    if (val) {
                      const items = feesDetailsForm.getFieldValue('items');
                      items[index] = {
                        ...items[index],
                        endDate: undefined,
                        startDate: undefined,
                      };

                      setValue(items);
                      feesDetailsForm.setFieldsValue({
                        items,
                      });
                    }
                  }}
                />
              </Form.Item>
            </Col>

            <Col lg={5} xl={5} md={12} sm={24} xs={24}>
              <p className="font-medium text-gray-800">Course start date</p>
              <Form.Item
                name={['items', index, 'startDate']}
                rules={[
                  {
                    required: true,
                    message: 'Please select course start date',
                  },
                ]}
              >
                <DatePicker
                  disabled
                  size="large"
                  style={{ width: '100%' }}
                  placeholder="Select course start date"
                  value={startDate}
                  onChange={(val) => {
                    if (val !== null) {
                      if (feesDetailsForm.getFieldValue(['items', index, 'timeFreq'])) {
                        const items = feesDetailsForm.getFieldValue('items') || [];

                        const newEndDate = moment(val).add(
                          feesDetailsForm.getFieldValue(['items', index, 'durationUnitId']) ===
                            'TF_sm'
                            ? 6 *
                                Number(feesDetailsForm.getFieldValue(['items', index, 'timeFreq']))
                            : Number(feesDetailsForm.getFieldValue(['items', index, 'timeFreq'])),
                          `${
                            frequencyOfTime?.find(
                              (item) =>
                                item?.value ===
                                feesDetailsForm.getFieldValue(['items', index, 'durationUnitId']),
                            )?.calculateUnit
                          }`,
                        );

                        setValue(newEndDate);
                        items[index] = {
                          ...items[index],
                          endDate: moment(newEndDate) || undefined,
                        };
                        feesDetailsForm.setFieldsValue({
                          items,
                        });
                      } else {
                        const items = feesDetailsForm.getFieldValue('items') || [];
                        items[index] = {
                          ...items[index],
                          endDate: undefined,
                        };
                        feesDetailsForm.setFieldsValue({
                          items,
                        });
                      }
                    }

                    // Giving notification messages
                    if (feesDetailsForm.getFieldValue(['items', index, 'timeFreq']) === undefined) {
                      const args = {
                        // message: 'Notification Title',
                        description: `Please fill no. of ${
                          frequencyOfTime?.find(
                            (values) =>
                              values?.value ===
                              feesDetailsForm.getFieldValue(['items', index, 'durationUnitId']),
                          )?.name
                        }`,
                        duration: 2,
                      };
                      notification.error(args);
                    }

                    if (val) {
                      setStartValue(val.valueOf());
                    }
                    setStartDate(val);
                  }}
                />
              </Form.Item>
            </Col>

            <Col lg={5} xl={5} md={12} sm={24} xs={24}>
              <p className="font-medium text-gray-800">Course end date</p>
              <Form.Item
                name={['items', index, 'endDate']}
                rules={[
                  {
                    required: true,
                    message: 'Please select course end date',
                  },
                ]}
              >
                <DatePicker
                  disabled
                  size="large"
                  style={{ width: '100%' }}
                  placeholder="Select course end date"
                  value={endDate}
                  onChange={(val) => {
                    setEndDate(val);

                    if (val) {
                      const items = feesDetailsForm.getFieldValue('items');
                      items[index] = {
                        ...items[index],
                        timeFreq: undefined,
                        startDate: undefined,
                      };
                      feesDetailsForm.setFieldsValue({
                        items,
                      });
                    }

                    // Giving notification messages
                    if (
                      feesDetailsForm.getFieldValue(['items', index, 'startDate']) === undefined
                    ) {
                      const args = {
                        description: `Please fill start date first`,
                        duration: 2,
                      };
                      notification.error(args);
                    }
                  }}
                  disabledDate={(current) => current && current.valueOf() < startValue}
                />
              </Form.Item>
            </Col>

            <Col lg={5} xl={5} md={12} sm={24} xs={24}>
              <div>
                <p className="font-medium text-gray-800">Amount</p>
                <Form.Item
                  name={['items', index, 'basicAmount']}
                  rules={[
                    {
                      required: true,
                      message: 'Please enter course amount',
                    },
                  ]}
                >
                  <Input
                    // disabled
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
                        basicAmount: currencyFormatter.format(currencyParser(mod)),
                        otherPurpose: '',
                        otherRemarks: '',
                        otherAmount: '',
                        adjustmentPurpose: '',
                        adjustmentRemarks: '',
                        adjustmentAmount: '',
                        feeTypeIdAdjustment: false,
                        feeTypeIdOtherCharges: false,
                      };

                      setIsAddOtherAddAdjustmentPresent({
                        addAdjustment: false,
                        addOther: false,
                      });

                      let fee = 0;

                      items?.forEach((item) => {
                        if (item?.modulesItems !== undefined) {
                          item?.modulesItems?.forEach((selectedAmt) => {
                            fee += Number(
                              decodeDollarsToDigits(selectedAmt?.moduleBasicAmount || 0),
                            );
                          });
                        } else {
                          fee += Number(decodeDollarsToDigits(item?.basicAmount || 0));
                        }

                        fee -= Number(decodeDollarsToDigits(item?.adjustmentAmount || 0));
                        fee += Number(decodeDollarsToDigits(item?.otherAmount || 0));
                      });

                      // Resetting installments fields when amount changes
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
                      feesDetailsForm.setFieldsValue({
                        items,
                        feePayment: {
                          totalFees: currencyFormatter.format(fee),
                        },
                      });
                    }}
                  />
                </Form.Item>
              </div>
            </Col>
          </Row>
        )}
      </div>
      <DiscountDetails
        feesDetailsForm={feesDetailsForm}
        courseDisplayName={courseDisplayName}
        index={index}
        isAddOtherAddAdjustmentPresent={isAddOtherAddAdjustmentPresent}
        setIsAddOtherAddAdjustmentPresent={setIsAddOtherAddAdjustmentPresent}
        modulesList={modulesList}
        setValue={setValue}
        setInstallmentsLevel={setInstallmentsLevel}
        setPaymentMode={setPaymentMode}
      />
    </Card>
  );
};

export default connect(({ student }) => ({
  courseFee: student?.courseFee,
}))(FeePaymentDetails);
