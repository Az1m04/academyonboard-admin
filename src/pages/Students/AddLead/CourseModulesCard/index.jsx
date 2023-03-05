import React, { useState, useEffect } from 'react';
import {
  Form,
  Row,
  Col,
  Input,
  Select,
  Radio,
  DatePicker,
  Divider,
  Checkbox,
  notification,
} from 'antd';
import moment from 'moment';
import Card from '@/components/Structure/Card';
import { currencyFormatter, decodeDollarsToDigits } from '@/utils/utils';
import { connect } from 'umi';

const CourseModulesCard = ({
  courseDetailsForm,
  feesDetailsForm,
  courseDisplayName,
  courseCategoryName,
  categoryId,
  courseSubCategoryName,
  subCategoryId,
  id,
  feeArray,
  index,
  courseModulesArray,
  setInstallmentsLevel,
  dispatch,
  setPaymentMode,
  changedFrequency,
  setChangedFrequency,
}) => {
  const [isModeGuaranteed, setIsModeGuaranteed] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [startValue, setStartValue] = useState(null);

  // eslint-disable-next-line no-unused-vars
  const [state, setValue] = useState();

  useEffect(() => {
    setIsModeGuaranteed(courseDetailsForm.getFieldValue(['items', index, 'courseType']));
  }, [courseDetailsForm, index]);

  const cleanInput = (inp) => {
    if (inp) {
      return inp.replace(/(?!-)[^0-9.]/g, '').replace('-', '');
    }
    return '';
  };
  const onChange = (e) => {
    const items = courseDetailsForm.getFieldValue('items');
    const value = cleanInput(e.target.value.toString());
    items[index] = {
      ...items[index],
      noOfDays: value,
    };
    courseDetailsForm.setFieldsValue({
      items,
    });
  };

  const onFrequencyChange = (e) => {
    const items = courseDetailsForm.getFieldValue('items');
    const value = cleanInput(e.target.value.toString());
    items[index] = {
      ...items[index],
      timeFreq: value,
    };
    courseDetailsForm.setFieldsValue({
      items,
    });

    const feeItems = feesDetailsForm.getFieldValue('items');
    feeItems[index] = {
      ...feeItems[index],
      endDate: undefined,
      timeFreq: value,
      startDate: undefined,
    };

    feesDetailsForm.setFieldsValue({
      items: feeItems,
    });
  };

  const changeFrequency = (idx, val) => {
    setChangedFrequency([...changedFrequency, val]);
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

  return (
    <div className="">
      <Card>
        <h2 className="p-5 text-base font-semibold text-gray-800 capitalize">
          {courseDisplayName} course details
        </h2>
        <Divider style={{ margin: '0' }} />
        <div className="px-4 mt-4">
          <Row gutter={[12]}>
            <Col lg={8} xl={8} md={12} sm={24} xs={24}>
              <p className="font-medium text-gray-800">Course name</p>
              <Form.Item
                name={['items', index, 'productId']}
                rules={[
                  {
                    required: true,
                    message: 'Please type name of the course',
                  },
                ]}
              >
                <Select
                  size="large"
                  placeholder="Please list down the course name"
                  style={{ width: '100%' }}
                  getPopupContainer={(node) => node.parentNode}
                >
                  <Select.Option value={id}>{courseDisplayName}</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col lg={8} xl={8} md={12} sm={24} xs={24}>
              <p className="font-medium text-gray-800">Course category</p>
              <Form.Item
                name={['items', index, 'courseCategory']}
                rules={[
                  {
                    required: courseCategoryName !== undefined,
                    message: 'Please select the course category',
                  },
                ]}
              >
                <Select
                  size="large"
                  placeholder={`${
                    courseCategoryName === undefined
                      ? 'There is no any course category'
                      : 'Please list down the course category'
                  }`}
                  style={{ width: '100%' }}
                  getPopupContainer={(node) => node.parentNode}
                  disabled={courseCategoryName === undefined}
                >
                  <Select.Option value={categoryId} key={categoryId}>
                    {courseCategoryName}
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col lg={8} xl={8} md={12} sm={24} xs={24}>
              <p className="font-medium text-gray-800">Course sub category</p>
              <Form.Item
                name={['items', index, 'subCourseCategory']}
                rules={[
                  {
                    required: courseSubCategoryName !== undefined,
                    message: 'Please select atleast one sub category',
                  },
                ]}
              >
                <Select
                  size="large"
                  placeholder={`${
                    courseSubCategoryName === undefined
                      ? 'There is no any course sub category'
                      : 'Please list down course sub categories'
                  } `}
                  style={{ width: '100%' }}
                  getPopupContainer={(node) => node.parentNode}
                  disabled={courseSubCategoryName === undefined}
                >
                  <Select.Option value={subCategoryId} key={subCategoryId}>
                    {courseSubCategoryName}
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[12]}>
            <Col lg={6} xl={6} md={12} sm={24} xs={24}>
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
                    allowClear
                    showSearch
                    size="large"
                    getPopupContainer={(node) => node.parentNode}
                    placeholder="Select a frequency of time"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    onSelect={(val) => {
                      changeFrequency(index, val);
                    }}
                    onChange={(val) => {
                      if (val) {
                        const items = courseDetailsForm.getFieldValue('items');
                        items[index] = {
                          ...items[index],
                          endDate: undefined,
                          timeFreq: undefined,
                          startDate: undefined,
                          noOfDays: '',
                        };
                        courseDetailsForm.setFieldsValue({
                          items,
                        });

                        const feeItems = feesDetailsForm.getFieldValue('items');
                        feeItems[index] = {
                          ...feeItems[index],
                          durationUnitId: val,
                          endDate: undefined,
                          timeFreq: undefined,
                          startDate: undefined,
                          basicAmount: currencyFormatter.format(
                            feeArray?.find((item) => item?.feeDurationId === val)?.feeAmount,
                          ),
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
                          items: feeItems,
                        });

                        let fee = 0;

                        feeItems?.forEach((item, idx) => {
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
                          items: feeItems,
                          feePayment: {
                            totalFees: currencyFormatter.format(fee),
                          },
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
            <Col lg={6} xl={6} md={12} sm={24} xs={24}>
              <p className="font-medium text-gray-800">
                No. of{' '}
                {
                  frequencyOfTime?.find(
                    (val) =>
                      val?.value ===
                      courseDetailsForm.getFieldValue(['items', index, 'durationUnitId']),
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
                  autoComplete="off"
                  size="large"
                  min={0}
                  placeholder={`Enter no. of ${
                    frequencyOfTime?.find(
                      (val) =>
                        val?.value ===
                        courseDetailsForm.getFieldValue(['items', index, 'durationUnitId']),
                    )?.name
                  }`}
                  onChange={(val) => {
                    onFrequencyChange(val);

                    if (val) {
                      const items = courseDetailsForm.getFieldValue('items');
                      items[index] = {
                        ...items[index],
                        endDate: undefined,
                        startDate: undefined,
                      };

                      setValue(items);
                      courseDetailsForm.setFieldsValue({
                        items,
                      });
                    }
                  }}
                  onBlur={(val) => {
                    if (
                      courseDetailsForm.getFieldValue(['items', index, 'durationUnitId']) !==
                      undefined
                    ) {
                      const items = feesDetailsForm.getFieldValue('items');

                      const fee1 =
                        feeArray?.find(
                          (item) =>
                            item?.feeDurationId ===
                            courseDetailsForm.getFieldValue(['items', index, 'durationUnitId']),
                        )?.feeAmount * val.target.value;

                      setValue(fee1);

                      items[index] = {
                        ...items[index],
                        basicAmount: currencyFormatter.format(fee1),
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
                            noOfDays: '',
                            feeTypeIdAdjustment: false,
                            feeTypeIdOtherCharges: false,
                          };

                          feesDetailsForm.setFieldsValue({
                            items,
                          });

                          // setIsAddOtherAddAdjustmentPresent({
                          //   addAdjustment: false,
                          //   addOther: false,
                          // });
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

            <Col lg={6} xl={6} md={12} sm={24} xs={24}>
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
                  size="large"
                  style={{ width: '100%' }}
                  placeholder="Select course start date"
                  value={startDate}
                  onChange={(val) => {
                    if (
                      courseDetailsForm.getFieldValue(['items', index, 'addModulesCheckbox']) ===
                      true
                    ) {
                      if (val !== null) {
                        if (courseDetailsForm.getFieldValue(['items', index, 'timeFreq'])) {
                          const allCourses = courseDetailsForm.getFieldValue(['items']);

                          // const items = feesDetailsForm.getFieldValue('items');
                          const course = allCourses[index];

                          let initialModules = course?.modulesItems || [];

                          const items = courseDetailsForm.getFieldValue('items') || [];

                          const newEndDate = moment(val).add(
                            courseDetailsForm.getFieldValue(['items', index, 'durationUnitId']) ===
                              'TF_sm'
                              ? 6 *
                                  Number(
                                    courseDetailsForm.getFieldValue(['items', index, 'timeFreq']),
                                  )
                              : Number(
                                  courseDetailsForm.getFieldValue(['items', index, 'timeFreq']),
                                ),
                            `${
                              frequencyOfTime?.find(
                                (item) =>
                                  item?.value ===
                                  courseDetailsForm.getFieldValue([
                                    'items',
                                    index,
                                    'durationUnitId',
                                  ]),
                              )?.calculateUnit
                            }`,
                          );
                          const NewValueName =
                            courseDetailsForm.getFieldValue(['items', index, 'modulesList']) || [];
                          const newModule = NewValueName?.map((ite) => {
                            return {
                              moduleId: ite,
                              moduleStartDate: val,
                              moduleEndDate: newEndDate,
                            };
                          });

                          setValue(newEndDate);
                          items[index] = {
                            ...items[index],
                            endDate: moment(newEndDate) || undefined,
                          };
                          courseDetailsForm.setFieldsValue({
                            items,
                          });

                          const feeItems = feesDetailsForm.getFieldValue('items');
                          feeItems[index] = {
                            ...feeItems[index],
                            moduleEndDate: moment(newEndDate) || undefined,
                            moduleStartDate: moment(val),
                          };
                          initialModules = newModule;

                          course.modulesItems = initialModules;
                          allCourses[index] = course;

                          feesDetailsForm.setFieldsValue({
                            items: allCourses,
                          });
                        } else {
                          const items = courseDetailsForm.getFieldValue('items') || [];
                          items[index] = {
                            ...items[index],
                            endDate: undefined,
                          };
                          courseDetailsForm.setFieldsValue({
                            items,
                          });

                          const feeItems = feesDetailsForm.getFieldValue('items');
                          feeItems[index] = {
                            ...feeItems[index],
                            moduleEndDate: undefined,
                          };

                          feesDetailsForm.setFieldsValue({
                            items: feeItems,
                          });
                        }
                      }
                    }
                    if (val !== null) {
                      if (courseDetailsForm.getFieldValue(['items', index, 'timeFreq'])) {
                        const items = courseDetailsForm.getFieldValue('items') || [];

                        const newEndDate = moment(val).add(
                          courseDetailsForm.getFieldValue(['items', index, 'durationUnitId']) ===
                            'TF_sm'
                            ? 6 *
                                Number(
                                  courseDetailsForm.getFieldValue(['items', index, 'timeFreq']),
                                )
                            : Number(courseDetailsForm.getFieldValue(['items', index, 'timeFreq'])),
                          `${
                            frequencyOfTime?.find(
                              (item) =>
                                item?.value ===
                                courseDetailsForm.getFieldValue(['items', index, 'durationUnitId']),
                            )?.calculateUnit
                          }`,
                        );

                        setValue(newEndDate);
                        items[index] = {
                          ...items[index],
                          endDate: moment(newEndDate) || undefined,
                        };
                        courseDetailsForm.setFieldsValue({
                          items,
                        });

                        const feeItems = feesDetailsForm.getFieldValue('items');
                        feeItems[index] = {
                          ...feeItems[index],
                          endDate: moment(newEndDate) || undefined,
                          startDate: moment(val),
                        };

                        feesDetailsForm.setFieldsValue({
                          items: feeItems,
                        });
                      } else {
                        const items = courseDetailsForm.getFieldValue('items') || [];
                        items[index] = {
                          ...items[index],
                          endDate: undefined,
                        };
                        courseDetailsForm.setFieldsValue({
                          items,
                        });

                        const feeItems = feesDetailsForm.getFieldValue('items');
                        feeItems[index] = {
                          ...feeItems[index],
                          endDate: undefined,
                        };

                        feesDetailsForm.setFieldsValue({
                          items: feeItems,
                        });
                      }
                    }

                    // Giving notification messages
                    if (
                      courseDetailsForm.getFieldValue(['items', index, 'timeFreq']) === undefined
                    ) {
                      const args = {
                        // message: 'Notification Title',
                        description: `Please fill no. of ${
                          frequencyOfTime?.find(
                            (values) =>
                              values?.value ===
                              courseDetailsForm.getFieldValue(['items', index, 'durationUnitId']),
                          )?.name
                        }`,
                        duration: 2,
                      };
                      notification.error(args);
                    }

                    // calculation of no.of days field for Regular mode deleted as client said

                    if (isModeGuaranteed === 'Regular') {
                      if (
                        courseDetailsForm.getFieldValue(['items', index, 'endDate']) !== undefined
                      ) {
                        const a = moment(val);
                        const b = moment(
                          courseDetailsForm.getFieldValue(['items', index, 'endDate']),
                        );

                        const items = courseDetailsForm.getFieldValue('items');
                        setValue(items);
                        items[index] = {
                          ...items[index],
                          noOfDays: b.endOf('day').diff(a.startOf('day'), 'days') + 1,
                        };
                        courseDetailsForm.setFieldsValue({
                          items,
                        });
                      }
                    }
                    if (val) {
                      setStartValue(val.valueOf());
                    }
                    setStartDate(val);
                  }}
                />
              </Form.Item>
            </Col>
            <Col lg={6} xl={6} md={12} sm={24} xs={24}>
              <p className="font-medium text-gray-800">Course end date</p>
              <Form.Item
                name={['items', index, 'endDate']}
                // rules={[
                //   {
                //     required: true,
                //     message: 'Please select course end date',
                //   },
                // ]}
              >
                <DatePicker
                  size="large"
                  style={{ width: '100%' }}
                  placeholder="Select course end date"
                  value={endDate}
                  onChange={(val) => {
                    setEndDate(val);

                    if (val || val === null) {
                      const items = courseDetailsForm.getFieldValue('items');
                      items[index] = {
                        ...items[index],
                        timeFreq: undefined,
                        startDate: undefined,
                      };
                      courseDetailsForm.setFieldsValue({
                        items,
                      });

                      const feeItems = feesDetailsForm.getFieldValue('items');
                      feeItems[index] = {
                        ...feeItems[index],
                        endDate: moment(val),
                        timeFreq: undefined,
                        startDate: undefined,
                      };

                      feesDetailsForm.setFieldsValue({
                        items: feeItems,
                      });
                    }

                    // Giving notification messages
                    if (
                      courseDetailsForm.getFieldValue(['items', index, 'startDate']) === undefined
                    ) {
                      const args = {
                        description: `Please fill start date first`,
                        duration: 2,
                      };
                      notification.error(args);
                    }

                    // calculation of no.of days field for Regular mode deleted as client said

                    if (isModeGuaranteed === 'Regular') {
                      if (
                        courseDetailsForm.getFieldValue(['items', index, 'startDate']) !== undefined
                      ) {
                        const a = moment(
                          courseDetailsForm
                            .getFieldValue(['items', index, 'startDate'])
                            ?.toISOString(),
                        );
                        const b = moment(val?.toISOString());

                        const items = courseDetailsForm.getFieldValue('items');

                        setValue(items);
                        items[index] = {
                          ...items[index],
                          noOfDays: b.endOf('day').diff(a.startOf('day'), 'days') + 1,
                        };
                        courseDetailsForm.setFieldsValue({
                          items,
                        });
                      }
                    }
                  }}
                  disabledDate={(current) => current && current.valueOf() < startValue}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[12]}>
            <Col lg={4} xl={4} md={12} sm={24} xs={24}>
              <p className="font-medium text-gray-800">Type</p>
              <Form.Item
                name={['items', index, 'courseType']}
                rules={[
                  {
                    required: true,
                    message: 'Please select type of course',
                  },
                ]}
              >
                <Radio.Group
                  options={['Regular', 'Guaranteed']}
                  onChange={(val) => {
                    if (val.target.value === 'Guaranteed') {
                      setIsModeGuaranteed('');
                      const items = courseDetailsForm.getFieldValue('items');

                      items[index] = {
                        ...items[index],
                        noOfDays: undefined,
                      };
                      courseDetailsForm.setFieldsValue({
                        items,
                      });
                    }

                    // calculation of no.of days field for Regular mode deleted as client said

                    if (val.target.value === 'Regular') {
                      setIsModeGuaranteed(val.target.value);

                      if (courseDetailsForm.getFieldValue(['items', index, 'endDate'])) {
                        const a = moment(
                          courseDetailsForm
                            .getFieldValue(['items', index, 'startDate'])
                            ?.toISOString(),
                        );
                        const b = moment(
                          courseDetailsForm
                            .getFieldValue(['items', index, 'endDate'])
                            ?.toISOString(),
                        );

                        const items = courseDetailsForm.getFieldValue('items');

                        items[index] = {
                          ...items[index],
                          noOfDays: b.endOf('day').diff(a.startOf('day'), 'days') + 1,
                        };
                        courseDetailsForm.setFieldsValue({
                          items,
                        });
                      }
                    }
                  }}
                />
              </Form.Item>
            </Col>
            {/* // calculation of no.of days field for regular mode deleted as client said */}

            {isModeGuaranteed === 'Regular' && (
              <Col lg={5} xl={5} md={12} sm={24} xs={24}>
                <p className="font-medium text-gray-800">No. of days</p>
                <Form.Item
                  name={['items', index, 'noOfDays']}
                  rules={[
                    {
                      required: true,
                      message: 'Please select course end date',
                    },
                  ]}
                >
                  <Input
                    autoComplete="off"
                    size="large"
                    min={0}
                    placeholder="Enter no. of days"
                    onChange={onChange}
                  />
                </Form.Item>
              </Col>
            )}
            <Col lg={3} xl={3} md={12} sm={24} xs={24}>
              <Form.Item
                name={['items', index, 'addModulesCheckbox']}
                valuePropName="checked"
                style={{ marginTop: 23, marginLeft: 23 }}
                // style={
                //   courseDetailsForm.getFieldValue(['items', index, 'addModulesCheckbox'])
                //     ? { marginTop: 23, marginLeft: 23 }
                //     : { marginTop: 23 }
                // }
                className="flex justify-center"
              >
                <Checkbox
                  disabled={courseModulesArray === undefined}
                  onChange={(val) => {
                    const courseItems = feesDetailsForm?.getFieldValue('items') || [];
                    courseItems[index] = {
                      ...courseItems[index],
                      addModulesCheckbox: val.target.checked,
                    };
                    feesDetailsForm.setFieldsValue({
                      items: courseItems,
                    });

                    dispatch({
                      type: 'student/setStates',
                      payload: {
                        isModulesSelected: val.target.checked,
                      },
                      key: 'courseFee',
                    });

                    if (!val.target.checked) {
                      // Selecting the course amount and adding it to the total fees when deselect add module checkbox
                      let totalFees = 0;
                      const items = feesDetailsForm.getFieldValue('items');
                      const courseItemsReset = courseDetailsForm.getFieldValue('items');

                      items[index] = {
                        ...items[index],
                        modulesList: undefined,
                        modulesItems: undefined,
                        basicAmount: currencyFormatter.format(
                          feeArray?.find((firstAmount) => firstAmount?.feeAmount)?.feeAmount,
                        ),
                        durationUnitId: feeArray?.find((firstAmount) => firstAmount?.feeAmount)
                          ?.feeDurationId,
                        adjustmentPurpose: '',
                        adjustmentRemarks: '',
                        adjustmentAmount: '',
                        otherPurpose: '',
                        otherRemarks: '',
                        otherAmount: '',
                        feeTypeIdOtherCharges: false,
                        feeTypeIdAdjustment: false,
                      };

                      courseItemsReset[index] = {
                        ...courseItemsReset[index],
                        modulesList: undefined,
                        modulesItems: undefined,
                      };

                      feesDetailsForm.setFieldsValue({
                        items,
                      });

                      courseDetailsForm.setFieldsValue({
                        items: courseItemsReset,
                      });

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
                      items?.forEach((item, idx) => {
                        if (index === idx) {
                          totalFees += Number(decodeDollarsToDigits(item?.basicAmount || 0));
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
                        }
                      });

                      feesDetailsForm.setFieldsValue({
                        feePayment: { totalFees: currencyFormatter.format(totalFees) },
                      });
                    } else {
                      // Deselecting the course amount from total when we select modules

                      const items = feesDetailsForm?.getFieldValue('items') || [];

                      items[index] = {
                        ...items[index],

                        adjustmentPurpose: '',
                        adjustmentRemarks: '',
                        adjustmentAmount: '',
                        otherPurpose: '',
                        otherRemarks: '',
                        otherAmount: '',
                        feeTypeIdOtherCharges: false,
                        feeTypeIdAdjustment: false,
                      };
                      let totalFees = 0;
                      items?.forEach((item, idx) => {
                        const checkModules = Object.keys(item);
                        if (index !== idx) {
                          // eslint-disable-next-line no-lonely-if

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
                        }
                        if (index !== idx) {
                          totalFees -= Number(decodeDollarsToDigits(item?.adjustmentAmount || 0));
                          totalFees += Number(decodeDollarsToDigits(item?.otherAmount || 0));
                        }
                      });
                      feesDetailsForm.setFieldsValue({
                        feePayment: { totalFees: currencyFormatter.format(totalFees) },
                        items,
                      });
                    }
                  }}
                >
                  Add modules
                </Checkbox>
              </Form.Item>
            </Col>

            {courseDetailsForm.getFieldValue(['items', index, 'addModulesCheckbox']) && (
              <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                <p className="font-medium text-gray-800">Modules</p>
                <Form.Item
                  name={['items', index, 'modulesList']}
                  rules={[
                    {
                      required: true,
                      message: 'Please select the course modules!',
                    },
                  ]}
                >
                  <Select
                    size="large"
                    mode="tags"
                    placeholder="Please select the course modules"
                    style={{ width: '100%' }}
                    getPopupContainer={(node) => node.parentNode}
                    onChange={(value) => {
                      // onChangeModuleAndDate(value);
                      // const allCourses = feesDetailsForm.getFieldValue(['items']);
                      const allCourses = courseDetailsForm.getFieldValue(['items']);

                      const items = feesDetailsForm.getFieldValue('items');
                      const course = allCourses[index];

                      let initialModules = course?.modulesItems || [];
                      const newModuleStartDate = courseDetailsForm.getFieldValue([
                        'items',
                        index,
                        'startDate',
                      ]);
                      const newModuleEndDate = courseDetailsForm.getFieldValue([
                        'items',
                        index,
                        'endDate',
                      ]);

                      if (initialModules?.length < value?.length) {
                        const newModule = {
                          moduleProductId: value[value?.length - 1],
                          moduleId: courseModulesArray?.find(
                            (data) => data?.id === value[value?.length - 1],
                          )?.displayName,

                          moduleStartDate: newModuleStartDate,
                          moduleEndDate: newModuleEndDate,

                          moduleBasicAmount: currencyFormatter.format(
                            courseModulesArray?.find(
                              (data) => data?.id === value[value?.length - 1],
                            )?.fees[0]?.feeAmount,
                          ),
                          moduleFeesArray: courseModulesArray?.find(
                            (item) => item?.id === value[value?.length - 1],
                          )?.fees,
                        };

                        let totalFees = 0;

                        if (feesDetailsForm?.getFieldValue(['feePayment', 'totalFees'])) {
                          totalFees = Number(
                            decodeDollarsToDigits(
                              feesDetailsForm?.getFieldValue(['feePayment', 'totalFees']) || 0,
                            ),
                          );
                        }

                        totalFees += Number(decodeDollarsToDigits(newModule?.moduleBasicAmount));

                        initialModules = [...initialModules, newModule];

                        course.modulesItems = initialModules;
                        allCourses[index] = course;

                        feesDetailsForm.setFieldsValue({
                          items: allCourses,
                          feePayment: { totalFees: currencyFormatter.format(totalFees) },
                        });
                      } else {
                        const setTotal =
                          decodeDollarsToDigits(
                            feesDetailsForm?.getFieldsValue().feePayment.totalFees,
                          ) -
                          decodeDollarsToDigits(
                            initialModules?.find((data) => !value?.includes(data?.moduleProductId))
                              ?.moduleBasicAmount,
                          ) -
                          Number(
                            decodeDollarsToDigits(
                              feesDetailsForm.getFieldValue(['items', index, 'otherAmount']) || 0,
                            ),
                          ) +
                          Number(
                            decodeDollarsToDigits(
                              feesDetailsForm.getFieldValue(['items', index, 'adjustmentAmount']) ||
                                0,
                            ),
                          );

                        initialModules = initialModules?.filter((data) =>
                          value?.includes(data?.moduleProductId),
                        );

                        initialModules = [...initialModules];
                        course.modulesItems = initialModules;
                        course.adjustmentAmount = undefined;
                        allCourses[index] = course;
                        feesDetailsForm.setFieldsValue({
                          items: allCourses,
                          feePayment: {
                            totalFees: currencyFormatter.format(setTotal),
                          },
                        });

                        items[index] = {
                          ...items[index],
                          otherPurpose: '',
                          otherRemarks: '',
                          otherAmount: '',
                          adjustmentPurpose: '',
                          adjustmentRemarks: '',
                          adjustmentAmount: '',
                        };
                        feesDetailsForm.setFieldsValue({
                          items,
                        });
                      }
                    }}
                  >
                    {courseModulesArray?.map((item) => (
                      <Select.Option value={item?.id} key={item?.id}>
                        {item?.displayName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            )}
          </Row>
        </div>
      </Card>
    </div>
  );
};

export default connect(({ student }) => ({
  courseFee: student?.courseFee,
}))(CourseModulesCard);
