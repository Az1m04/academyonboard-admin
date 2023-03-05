import React, { useState, useEffect } from 'react';
import { Row, Col, Input, Select, Radio, DatePicker, Switch, Divider, Checkbox, Form } from 'antd';
import moment from 'moment';
import { currencyFormatter, currencyParser, decodeDollarsToDigits } from '@/utils/utils';
import { connect } from 'umi';

const CourseCard = ({
  courseDisplayName,
  courseCategoryName,
  categoryId,
  courseSubCategoryName,
  subCategoryId,
  id,
  feeArray,
  index,
  courseList,
  courseModulesArray,
  form,
  setInstallmentsLevel,
  setPaymentMode,
  dispatch,
  type,
  setCheckIdx,
  types,
  courseEdit,
  moduleId,
  setModuleId,
  idxCourseModules,
  isAddOtherAddAdjustmentPresent,
  setIsAddOtherAddAdjustmentPresent,
}) => {
  const [isModeGuaranteed, setIsModeGuaranteed] = useState();
  // eslint-disable-next-line no-unused-vars
  const [, setValue] = useState();
  const [courseDate, setCourseDate] = useState();
  useEffect(() => {
    if (types) {
      setIsModeGuaranteed(types);
    }
  }, [types, form]);

  useEffect(() => {
    setIsModeGuaranteed(form.getFieldValue(['items', index, 'courseType']));
  }, [form, index]);

  useEffect(() => {
    setIsAddOtherAddAdjustmentPresent({
      addAdjustment: form?.getFieldValue(['items', index, 'feeTypeIdAdjustment']),
      addOther: form.getFieldValue(['items', index, 'feeTypeIdOtherCharges']),
    });
  }, [form, index]);

  const prevModule = courseModulesArray?.map((val) => val?.id);
  const newId = moduleId?.filter((val) => prevModule?.includes(val));

  const modulesList = type
    ? idxCourseModules?.filter((mod) => newId?.includes(mod?.id))
    : courseList[index]?.courseModulesArray?.filter((mod) => moduleId?.includes(mod?.id));

  return (
    <div className=" border p-5 rounded-md bg-gray-100 h-full">
      <h2 className=" text-base font-semibold text-gray-800 capitalize">
        {courseDisplayName} course details
      </h2>
      <Divider style={{ margin: '0' }} />
      <div className=" mt-4">
        <Row gutter={[12]}>
          <div className="mb-5">
            <Row gutter={8} className="border rounded-md bg-white w-full p-3">
              <Col lg={0} xl={0} md={0} sm={0} xs={0}>
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
                    size="medium"
                    placeholder="Please list down the course name"
                    style={{ width: '100%' }}
                    getPopupContainer={(node) => node.parentNode}
                  >
                    <Select.Option disabled={type} value={id}>
                      {courseDisplayName}
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col lg={8} xl={8} md={8} sm={24} xs={24}>
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
                    size="medium"
                    placeholder={`${
                      courseCategoryName === undefined
                        ? 'There is no any course category'
                        : 'Please list down the course category'
                    }`}
                    style={{ width: '100%' }}
                    getPopupContainer={(node) => node.parentNode}
                    disabled={courseCategoryName === undefined || type}
                  >
                    <Select.Option disabled={type} value={categoryId} key={categoryId}>
                      {courseCategoryName}
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              {/* )} */}
              {/* {courseSubCategoryName !== undefined && ( */}
              <Col lg={8} xl={8} md={8} sm={24} xs={24}>
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
                    size="medium"
                    placeholder={`${
                      courseSubCategoryName === undefined
                        ? 'There is no any course sub category'
                        : 'Please list down course sub categories'
                    } `}
                    style={{ width: '100%' }}
                    getPopupContainer={(node) => node.parentNode}
                    disabled={courseSubCategoryName === undefined || type}
                  >
                    <Select.Option value={subCategoryId} key={subCategoryId}>
                      {courseSubCategoryName}
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              {/* )} */}
              <Col lg={8} xl={8} md={8} sm={24} xs={24}>
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
                    disabled={type}
                    size="medium"
                    style={{ width: '100%' }}
                    placeholder="Select course start date"
                    onChange={(val) => {
                      setCourseDate(val);
                      if (isModeGuaranteed === 'Guaranteed') {
                        if (form.getFieldValue(['items', index, 'endDate']) !== undefined) {
                          const a = moment(val);
                          const b = moment(form.getFieldValue(['items', index, 'endDate']));

                          const items = form.getFieldValue('items');
                          setValue(items);
                          items[index] = {
                            ...items[index],
                            noOfDays: b.endOf('day').diff(a.startOf('day'), 'days') + 1,
                          };
                          form.setFieldsValue({
                            items,
                          });
                        }
                      }
                    }}
                  />
                </Form.Item>
              </Col>
              <Col lg={8} xl={8} md={8} sm={24} xs={24}>
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
                    disabled={type}
                    size="medium"
                    disabledDate={(current) => current && current.valueOf() < courseDate}
                    style={{ width: '100%' }}
                    placeholder="Select course end date"
                    onChange={(val) => {
                      if (isModeGuaranteed === 'Guaranteed') {
                        if (form.getFieldValue(['items', index, 'startDate']) !== undefined) {
                          const a = moment(
                            form.getFieldValue(['items', index, 'startDate'])?.toISOString(),
                          );
                          const b = moment(val?.toISOString());

                          const items = form.getFieldValue('items');

                          setValue(items);
                          items[index] = {
                            ...items[index],
                            noOfDays: b.endOf('day').diff(a.startOf('day'), 'days') + 1,
                          };
                          form.setFieldsValue({
                            items,
                          });
                        }
                      }
                    }}
                  />
                </Form.Item>
              </Col>
              <Col lg={12} xl={12} md={12} sm={24} xs={24}>
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
                      if (val.target.value === 'Regular') {
                        setIsModeGuaranteed('');
                        const items = form.getFieldValue('items');

                        items[index] = {
                          ...items[index],
                          noOfDays: undefined,
                        };
                        form.setFieldsValue({
                          items,
                        });
                      }
                      if (val.target.value === 'Guaranteed') {
                        setIsModeGuaranteed(val.target.value);

                        if (form.getFieldValue(['items', index, 'endDate'])) {
                          const a = moment(
                            form.getFieldValue(['items', index, 'startDate'])?.toISOString(),
                          );
                          const b = moment(
                            form.getFieldValue(['items', index, 'endDate'])?.toISOString(),
                          );

                          const items = form.getFieldValue('items');

                          items[index] = {
                            ...items[index],
                            noOfDays: b.endOf('day').diff(a.startOf('day'), 'days') + 1,
                          };

                          form.setFieldsValue({
                            items,
                          });
                        }
                      }
                    }}
                  />
                </Form.Item>
              </Col>
              {isModeGuaranteed === 'Guaranteed' && (
                <Col lg={8} xl={8} md={8} sm={24} xs={24}>
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
                      size="medium"
                      type="number"
                      disabled={courseEdit}
                      min={0}
                      placeholder="Enter no. of days"
                    />
                  </Form.Item>
                </Col>
              )}
              <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                <Form.Item
                  name={['items', index, 'addModulesCheckbox']}
                  valuePropName="checked"
                  style={{ marginTop: 23 }}
                >
                  <Checkbox
                    disabled={courseModulesArray === undefined || type}
                    onChange={(val) => {
                      const courseItems = form?.getFieldValue('items') || [];
                      courseItems[index] = {
                        ...courseItems[index],
                        addModulesCheckbox: val.target.checked,
                      };
                      form.setFieldsValue({
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
                        const items = form.getFieldValue('items');
                        const courseItemsReset = form.getFieldValue('items');

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

                        form.setFieldsValue({
                          items,
                        });

                        form.setFieldsValue({
                          items: courseItemsReset,
                        });

                        // Resetting installments fields when discount amount's changes made
                        if (form?.getFieldValue(['feePayment', 'numOfInstallments']) > 0) {
                          setInstallmentsLevel([0]);
                          setPaymentMode(false);

                          form.setFieldsValue({
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

                        form.setFieldsValue({
                          feePayment: { totalFees: currencyFormatter.format(totalFees) },
                        });
                      } else {
                        // Deselecting the course amount from total when we select modules

                        const items = form?.getFieldValue('items') || [];

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
                        form.setFieldsValue({
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

              {form.getFieldValue(['items', index, 'addModulesCheckbox']) && (
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
                    {type ? (
                      <Select
                        size="medium"
                        mode="multiple"
                        placeholder="Please select the course modules"
                        style={{ width: '100%' }}
                        getPopupContainer={(node) => node.parentNode}
                        onChange={(value) => {
                          setModuleId(value);
                          setCheckIdx(value);
                        }}
                      >
                        {idxCourseModules?.map((item) => (
                          <Select.Option value={item?.id} key={item?.id}>
                            {item?.displayName}
                          </Select.Option>
                        ))}
                      </Select>
                    ) : (
                      <Select
                        size="medium"
                        mode="multiple"
                        placeholder="Please select the course modules"
                        style={{ width: '100%' }}
                        getPopupContainer={(node) => node.parentNode}
                        onChange={(value) => {
                          setModuleId(value);
                        }}
                      >
                        {courseModulesArray?.map((item) => (
                          <Select.Option value={item?.id} key={item?.id}>
                            {item?.displayName}
                          </Select.Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              )}
            </Row>
          </div>
          {!type &&
            form.getFieldValue(['items', index, 'modulesList']) !== undefined &&
            form.getFieldValue(['items', index, 'modulesList'])?.length !== 0 && (
              <div className="shadow border rounded-md  bg-white px-2 w-full">
                <h2
                  className="p-5 text-base font-semibold text-gray-800 "
                  style={{ borderBottom: '1px solid gray' }}
                >
                  {form.getFieldValue(['items', index, 'addModulesCheckbox'])
                    ? `${courseDisplayName} module wise fee details `
                    : `${courseDisplayName} full course fee details`}
                </h2>

                <div className="px-4 mt-4 ">
                  {form.getFieldValue(['items', index, 'addModulesCheckbox']) &&
                    modulesList?.map((moduleItem, idx) => (
                      <Row
                        gutter={[12]}
                        key={moduleItem?.id}
                        Form={form}
                        className="border-b w-full mt-4"
                      >
                        <Col lg={8} xl={8} md={8} sm={24} xs={24}>
                          <p className="font-medium text-gray-800">Module name</p>
                          <Form.Item
                            name={['items', index, 'modulesItems', idx, 'moduleId']}
                            rules={[
                              {
                                required: true,
                                message: 'Please type name of the module',
                              },
                            ]}
                          >
                            <Select
                              size="medium"
                              placeholder="Please list down the module name"
                              style={{ width: '100%' }}
                              getPopupContainer={(node) => node.parentNode}
                            >
                              <Select.Option value={moduleItem?.id}>
                                {moduleItem?.displayName}
                              </Select.Option>
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col lg={8} xl={8} md={8} sm={24} xs={24}>
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
                                showSearch
                                size="medium"
                                getPopupContainer={(node) => node.parentNode}
                                placeholder="Select a frequency of time"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                                onSelect={(val) => {
                                  const items = form.getFieldValue('items');

                                  const fee1 = moduleItem?.fees?.find(
                                    (amt) => amt?.feeDurationId === val,
                                  )?.feeAmount;
                                  setValue((prev) => {
                                    return { ...prev, ...fee1 };
                                  });
                                  items[index].modulesItems[idx] = {
                                    ...items[index].modulesItems[idx],
                                    moduleBasicAmount: currencyFormatter.format(fee1),
                                  };

                                  let fee = 0;

                                  items?.forEach((item, idxModules) => {
                                    if (item?.modulesItems !== undefined) {
                                      item?.modulesItems?.forEach((selectedAmt) => {
                                        fee += Number(
                                          decodeDollarsToDigits(
                                            selectedAmt?.moduleBasicAmount || 0,
                                          ),
                                        );
                                      });
                                    } else {
                                      fee += Number(decodeDollarsToDigits(item?.basicAmount || 0));
                                    }
                                    if (index !== idxModules) {
                                      fee -= Number(
                                        decodeDollarsToDigits(item?.adjustmentAmount || 0),
                                      );
                                      fee += Number(decodeDollarsToDigits(item?.otherAmount || 0));
                                    }
                                  });

                                  form.setFieldsValue({
                                    items,
                                    feePayment: { totalFees: currencyFormatter.format(fee) },
                                  });
                                }}
                                onChange={(val) => {
                                  if (val) {
                                    const items = form.getFieldValue('items');
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

                                    form.setFieldsValue({
                                      items,
                                    });
                                    setIsAddOtherAddAdjustmentPresent({
                                      addAdjustment: false,
                                      addOther: false,
                                    });
                                    // Resetting installments fields when frequency of time changes
                                    if (
                                      form?.getFieldValue(['feePayment', 'numOfInstallments']) > 0
                                    ) {
                                      setInstallmentsLevel([0]);
                                      setPaymentMode(false);

                                      form.setFieldsValue({
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
                                  <Select.Option
                                    value={item?.feeDurationId}
                                    key={item?.feeDurationId}
                                  >
                                    {item?.feeDuration}
                                  </Select.Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </div>
                        </Col>
                        <Col lg={8} xl={8} md={8} sm={24} xs={24}>
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
                              size="medium"
                              style={{ width: '100%' }}
                              placeholder="Select module start date"
                              on
                              onChange={(val) => {
                                // if statement to check when deselect start date and resetting end date accordingly

                                if (val === null) {
                                  const items = form.getFieldValue('items');

                                  items[index].modulesItems[idx] = {
                                    ...items[index].modulesItems[idx],
                                    moduleNoOfDays: undefined,
                                    moduleEndDate: undefined,
                                  };
                                  form.setFieldsValue({
                                    items,
                                  });
                                }

                                // if statement to check when entered start date and enabling end date accordingly

                                if (
                                  form.getFieldValue([
                                    'items',
                                    index,
                                    'modulesItems',
                                    idx,
                                    'moduleEndDate',
                                  ]) !== undefined
                                ) {
                                  const a = moment(val);
                                  const b = moment(
                                    form.getFieldValue([
                                      'items',
                                      index,
                                      'modulesItems',
                                      idx,
                                      'moduleEndDate',
                                    ]),
                                  );

                                  const items = form.getFieldValue('items');

                                  setValue((prev) => {
                                    return { ...prev, ...a };
                                  });

                                  items[index].modulesItems[idx] = {
                                    ...items[index].modulesItems[idx],
                                    moduleNoOfDays:
                                      b.endOf('day').diff(a.startOf('day'), 'days') + 1,
                                  };
                                  form.setFieldsValue({
                                    items,
                                  });
                                }
                              }}
                            />
                          </Form.Item>
                        </Col>
                        <Col lg={8} xl={8} md={8} sm={24} xs={24}>
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
                              size="medium"
                              style={{ width: '100%' }}
                              placeholder="Select module end date"
                              onChange={(val) => {
                                if (
                                  form.getFieldValue([
                                    'items',
                                    index,
                                    'modulesItems',
                                    idx,
                                    'moduleStartDate',
                                  ]) !== undefined
                                ) {
                                  const a = moment(
                                    form
                                      .getFieldValue([
                                        'items',
                                        index,
                                        'modulesItems',
                                        idx,
                                        'moduleStartDate',
                                      ])
                                      ?.toISOString(),
                                  );
                                  const b = moment(val?.toISOString());

                                  const items = form.getFieldValue('items');

                                  setValue((prev) => {
                                    return { ...prev, ...b };
                                  });

                                  items[index].modulesItems[idx] = {
                                    ...items[index].modulesItems[idx],
                                    moduleNoOfDays:
                                      b.endOf('day').diff(a.startOf('day'), 'days') + 1,
                                  };
                                  form.setFieldsValue({
                                    items,
                                  });
                                }
                              }}
                            />
                          </Form.Item>
                        </Col>
                        <Col lg={8} xl={8} md={8} sm={24} xs={24}>
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
                              size="medium"
                              type="number"
                              min={0}
                              placeholder="Enter no. of days"
                            />
                          </Form.Item>
                        </Col>
                        <Col lg={8} xl={8} md={8} sm={24} xs={24}>
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
                                    res =
                                      res[0] === '₹' ? res.substring(1, res.length).trim() : res;
                                    mod = Number(res).toFixed(2);
                                  } else {
                                    mod = event.target.value;
                                  }

                                  const items = form.getFieldValue('items');

                                  setValue((prev) => {
                                    return { ...prev, ...mod };
                                  });

                                  items[index].modulesItems[idx] = {
                                    ...items[index].modulesItems[idx],
                                    moduleBasicAmount: currencyFormatter.format(
                                      currencyParser(mod),
                                    ),
                                  };

                                  let fee = 0;

                                  items?.forEach((item) => {
                                    if (item?.modulesItems !== undefined) {
                                      item?.modulesItems?.forEach((selectedAmt) => {
                                        fee += Number(
                                          decodeDollarsToDigits(
                                            selectedAmt?.moduleBasicAmount || 0,
                                          ),
                                        );
                                      });
                                    } else {
                                      fee += Number(decodeDollarsToDigits(item?.basicAmount || 0));
                                    }

                                    fee -= Number(
                                      decodeDollarsToDigits(item?.adjustmentAmount || 0),
                                    );
                                    fee += Number(decodeDollarsToDigits(item?.otherAmount || 0));
                                  });

                                  form.setFieldsValue({
                                    items,
                                    feePayment: {
                                      totalFees: currencyFormatter.format(fee),
                                    },
                                  });

                                  // Resetting installments fields when modules amount changes
                                  if (
                                    form?.getFieldValue(['feePayment', 'numOfInstallments']) > 0
                                  ) {
                                    setInstallmentsLevel([0]);
                                    setPaymentMode(false);

                                    form.setFieldsValue({
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

                  {!form.getFieldValue(['items', index, 'addModulesCheckbox']) && (
                    <Row gutter={[12]}>
                      {/* Row for full course wise fees */}
                      <Col lg={12} xl={12} md={12} sm={24} xs={24}>
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
                              showSearch
                              size="medium"
                              getPopupContainer={(node) => node.parentNode}
                              placeholder="Select a frequency of time"
                              optionFilterProp="children"
                              filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                              }
                              onSelect={(val) => {
                                const items = form.getFieldValue('items');

                                items[index] = {
                                  ...items[index],
                                  basicAmount: currencyFormatter.format(
                                    feeArray?.find((item) => item?.feeDurationId === val)
                                      ?.feeAmount,
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
                                    fee -= Number(
                                      decodeDollarsToDigits(item?.adjustmentAmount || 0),
                                    );
                                    fee += Number(decodeDollarsToDigits(item?.otherAmount || 0));
                                  }
                                });

                                form.setFieldsValue({
                                  items,
                                  feePayment: { totalFees: currencyFormatter.format(fee) },
                                });
                              }}
                              onChange={(val) => {
                                if (val) {
                                  const items = form.getFieldValue('items');
                                  items[index] = {
                                    ...items[index],
                                    otherPurpose: '',
                                    otherRemarks: '',
                                    otherAmount: '',
                                    adjustmentPurpose: '',
                                    adjustmentRemarks: '',
                                    adjustmentAmount: '',
                                  };

                                  form.setFieldsValue({
                                    items,
                                  });
                                  setIsAddOtherAddAdjustmentPresent({
                                    addAdjustment: false,
                                    addOther: false,
                                  });
                                  // Resetting installments fields when frequency of time changes
                                  if (
                                    form?.getFieldValue(['feePayment', 'numOfInstallments']) > 0
                                  ) {
                                    setInstallmentsLevel([0]);
                                    setPaymentMode(false);

                                    form.setFieldsValue({
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
                                <Select.Option
                                  value={item?.feeDurationId}
                                  key={item?.feeDurationId}
                                >
                                  {item?.feeDuration}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </div>
                      </Col>

                      <Col lg={12} xl={12} md={12} sm={24} xs={24}>
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

                                const items = form.getFieldValue('items');

                                setValue((prev) => {
                                  return { ...prev, ...mod };
                                });
                                items[index] = {
                                  ...items[index],
                                  basicAmount: currencyFormatter?.format(
                                    currencyParser(mod || '0'),
                                  ),
                                };

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
                                if (form?.getFieldValue(['feePayment', 'numOfInstallments']) > 0) {
                                  setInstallmentsLevel([0]);
                                  setPaymentMode(false);

                                  form.setFieldsValue({
                                    feePayment: {
                                      mode: false,
                                      numOfInstallments: 1,
                                    },
                                    feePayments: [],
                                  });
                                }
                                form.setFieldsValue({
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
              </div>
            )}

          {type &&
            form.getFieldValue(['items', index, 'modulesList']) !== undefined &&
            form.getFieldValue(['items', index, 'modulesList'])?.length !== 0 &&
            moduleId && (
              <div className="shadow border rounded-md  bg-white px-2 w-full">
                <h2
                  className="p-5 text-base font-semibold text-gray-800 "
                  style={{ borderBottom: '1px solid gray' }}
                >
                  {form.getFieldValue(['items', index, 'addModulesCheckbox'])
                    ? `${courseDisplayName} module wise fee details `
                    : `${courseDisplayName} full course fee details`}
                </h2>

                <div className="px-4 mt-4 ">
                  {form.getFieldValue(['items', index, 'addModulesCheckbox']) &&
                    modulesList?.map((moduleItem, idx) => (
                      <Row
                        gutter={[12]}
                        key={moduleItem?.id}
                        Form={form}
                        className="border-b w-full mt-4"
                      >
                        <Col lg={8} xl={8} md={8} sm={24} xs={24}>
                          <p className="font-medium text-gray-800">Module name</p>
                          <Form.Item
                            name={['items', index, 'modulesItems', idx, 'moduleId']}
                            rules={[
                              {
                                required: true,
                                message: 'Please type name of the module',
                              },
                            ]}
                          >
                            <Select
                              size="medium"
                              placeholder="Please list down the module name"
                              style={{ width: '100%' }}
                              getPopupContainer={(node) => node.parentNode}
                            >
                              <Select.Option value={moduleItem?.id}>
                                {moduleItem?.displayName}
                              </Select.Option>
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col lg={8} xl={8} md={8} sm={24} xs={24}>
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
                                showSearch
                                size="medium"
                                getPopupContainer={(node) => node.parentNode}
                                placeholder="Select a frequency of time"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                                onSelect={(val) => {
                                  const items = form.getFieldValue('items');

                                  const fee1 = moduleItem?.fees?.find(
                                    (amt) => amt?.feeDurationId === val,
                                  )?.feeAmount;
                                  setValue((prev) => {
                                    return { ...prev, ...fee1 };
                                  });

                                  items[index].modulesItems[idx] = {
                                    ...items[index].modulesItems[idx],
                                    moduleBasicAmount: currencyFormatter?.format(fee1 || '0'),
                                  };

                                  let fee = 0;

                                  items?.forEach((item, idxModules) => {
                                    if (item?.modulesItems !== undefined) {
                                      item?.modulesItems?.forEach((selectedAmt) => {
                                        fee += Number(
                                          decodeDollarsToDigits(
                                            selectedAmt?.moduleBasicAmount || 0,
                                          ),
                                        );
                                      });
                                    } else {
                                      fee += Number(decodeDollarsToDigits(item?.basicAmount || 0));
                                    }
                                    if (index !== idxModules) {
                                      fee -= Number(
                                        decodeDollarsToDigits(item?.adjustmentAmount || 0),
                                      );
                                      fee += Number(decodeDollarsToDigits(item?.otherAmount || 0));
                                    }
                                  });

                                  form.setFieldsValue({
                                    items,
                                    feePayment: { totalFees: currencyFormatter.format(fee) },
                                  });
                                }}
                                onChange={(val) => {
                                  if (val) {
                                    const items = form.getFieldValue('items');
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

                                    form.setFieldsValue({
                                      items,
                                    });
                                    setIsAddOtherAddAdjustmentPresent({
                                      addAdjustment: false,
                                      addOther: false,
                                    });
                                    // Resetting installments fields when frequency of time changes
                                    if (
                                      form?.getFieldValue(['feePayment', 'numOfInstallments']) > 0
                                    ) {
                                      setInstallmentsLevel([0]);
                                      setPaymentMode(false);

                                      form.setFieldsValue({
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
                                  <Select.Option
                                    value={item?.feeDurationId}
                                    key={item?.feeDurationId}
                                  >
                                    {item?.feeDuration}
                                  </Select.Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </div>
                        </Col>
                        <Col lg={8} xl={8} md={8} sm={24} xs={24}>
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
                              size="medium"
                              style={{ width: '100%' }}
                              placeholder="Select module start date"
                              on
                              onChange={(val) => {
                                // if statement to check when deselect start date and resetting end date accordingly

                                if (val === null) {
                                  const items = form.getFieldValue('items');

                                  items[index].modulesItems[idx] = {
                                    ...items[index].modulesItems[idx],
                                    moduleNoOfDays: undefined,
                                    moduleEndDate: undefined,
                                  };
                                  form.setFieldsValue({
                                    items,
                                  });
                                }

                                // if statement to check when entered start date and enabling end date accordingly

                                if (
                                  form.getFieldValue([
                                    'items',
                                    index,
                                    'modulesItems',
                                    idx,
                                    'moduleEndDate',
                                  ]) !== undefined
                                ) {
                                  const a = moment(val);
                                  const b = moment(
                                    form.getFieldValue([
                                      'items',
                                      index,
                                      'modulesItems',
                                      idx,
                                      'moduleEndDate',
                                    ]),
                                  );

                                  const items = form.getFieldValue('items');

                                  setValue((prev) => {
                                    return { ...prev, ...a };
                                  });

                                  items[index].modulesItems[idx] = {
                                    ...items[index].modulesItems[idx],
                                    moduleNoOfDays:
                                      b.endOf('day').diff(a.startOf('day'), 'days') + 1,
                                  };
                                  form.setFieldsValue({
                                    items,
                                  });
                                }
                              }}
                            />
                          </Form.Item>
                        </Col>
                        <Col lg={8} xl={8} md={8} sm={24} xs={24}>
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
                              size="medium"
                              style={{ width: '100%' }}
                              placeholder="Select module end date"
                              onChange={(val) => {
                                if (
                                  form.getFieldValue([
                                    'items',
                                    index,
                                    'modulesItems',
                                    idx,
                                    'moduleStartDate',
                                  ]) !== undefined
                                ) {
                                  const a = moment(
                                    form
                                      .getFieldValue([
                                        'items',
                                        index,
                                        'modulesItems',
                                        idx,
                                        'moduleStartDate',
                                      ])
                                      ?.toISOString(),
                                  );
                                  const b = moment(val?.toISOString());

                                  const items = form.getFieldValue('items');

                                  setValue((prev) => {
                                    return { ...prev, ...b };
                                  });

                                  items[index].modulesItems[idx] = {
                                    ...items[index].modulesItems[idx],
                                    moduleNoOfDays:
                                      b.endOf('day').diff(a.startOf('day'), 'days') + 1,
                                  };
                                  form.setFieldsValue({
                                    items,
                                  });
                                }
                              }}
                            />
                          </Form.Item>
                        </Col>
                        <Col lg={8} xl={8} md={8} sm={24} xs={24}>
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
                              size="medium"
                              type="number"
                              min={0}
                              placeholder="Enter no. of days"
                            />
                          </Form.Item>
                        </Col>
                        <Col lg={8} xl={8} md={8} sm={24} xs={24}>
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
                                size="medium"
                                onFocus={(e) => e.target.select()}
                                placeholder="₹0.00"
                                autoComplete="off"
                                className="text-right"
                                onBlur={(event) => {
                                  if (event.target.value) {
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
                                      res =
                                        res[0] === '₹' ? res.substring(1, res.length).trim() : res;
                                      mod = Number(res).toFixed(2);
                                    } else {
                                      mod = event.target.value;
                                    }

                                    const items = form.getFieldValue('items');

                                    setValue((prev) => {
                                      return { ...prev, ...mod };
                                    });

                                    items[index].modulesItems[idx] = {
                                      ...items[index].modulesItems[idx],
                                      moduleBasicAmount: currencyFormatter.format(
                                        currencyParser(mod),
                                      ),
                                    };

                                    let fee = 0;

                                    items?.forEach((item) => {
                                      if (item?.modulesItems !== undefined) {
                                        item?.modulesItems?.forEach((selectedAmt) => {
                                          fee += Number(
                                            decodeDollarsToDigits(
                                              selectedAmt?.moduleBasicAmount || 0,
                                            ),
                                          );
                                        });
                                      } else {
                                        fee += Number(
                                          decodeDollarsToDigits(item?.basicAmount || 0),
                                        );
                                      }

                                      fee -= Number(
                                        decodeDollarsToDigits(item?.adjustmentAmount || 0),
                                      );
                                      fee += Number(decodeDollarsToDigits(item?.otherAmount || 0));
                                    });

                                    form.setFieldsValue({
                                      items,
                                      feePayment: {
                                        totalFees: currencyFormatter.format(fee),
                                      },
                                    });

                                    // Resetting installments fields when modules amount changes
                                    if (
                                      form?.getFieldValue(['feePayment', 'numOfInstallments']) > 0
                                    ) {
                                      setInstallmentsLevel([0]);
                                      setPaymentMode(false);

                                      form.setFieldsValue({
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
                        </Col>
                      </Row>
                    ))}

                  {!form.getFieldValue(['items', index, 'addModulesCheckbox']) && (
                    <Row gutter={[12]}>
                      {/* Row for full course wise fees */}
                      <Col lg={12} xl={12} md={12} sm={24} xs={24}>
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
                              showSearch
                              size="medium"
                              getPopupContainer={(node) => node.parentNode}
                              placeholder="Select a frequency of time"
                              optionFilterProp="children"
                              filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                              }
                              onSelect={(val) => {
                                const items = form.getFieldValue('items');

                                items[index] = {
                                  ...items[index],
                                  basicAmount: currencyFormatter.format(
                                    feeArray?.find((item) => item?.feeDurationId === val)
                                      ?.feeAmount,
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
                                    fee -= Number(
                                      decodeDollarsToDigits(item?.adjustmentAmount || 0),
                                    );
                                    fee += Number(decodeDollarsToDigits(item?.otherAmount || 0));
                                  }
                                });

                                form.setFieldsValue({
                                  items,
                                  feePayment: { totalFees: currencyFormatter.format(fee) },
                                });
                              }}
                              onChange={(val) => {
                                if (val) {
                                  const items = form.getFieldValue('items');
                                  items[index] = {
                                    ...items[index],
                                    otherPurpose: '',
                                    otherRemarks: '',
                                    otherAmount: '',
                                    adjustmentPurpose: '',
                                    adjustmentRemarks: '',
                                    adjustmentAmount: '',
                                  };

                                  form.setFieldsValue({
                                    items,
                                  });
                                  setIsAddOtherAddAdjustmentPresent({
                                    addAdjustment: false,
                                    addOther: false,
                                  });
                                  // Resetting installments fields when frequency of time changes
                                  if (
                                    form?.getFieldValue(['feePayment', 'numOfInstallments']) > 0
                                  ) {
                                    setInstallmentsLevel([0]);
                                    setPaymentMode(false);

                                    form.setFieldsValue({
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
                                <Select.Option
                                  value={item?.feeDurationId}
                                  key={item?.feeDurationId}
                                >
                                  {item?.feeDuration}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </div>
                      </Col>

                      <Col lg={12} xl={12} md={12} sm={24} xs={24}>
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

                                const items = form.getFieldValue('items');

                                setValue((prev) => {
                                  return { ...prev, ...mod };
                                });
                                items[index] = {
                                  ...items[index],
                                  basicAmount: currencyFormatter.format(currencyParser(mod)),
                                };

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
                                if (form?.getFieldValue(['feePayment', 'numOfInstallments']) > 0) {
                                  setInstallmentsLevel([0]);
                                  setPaymentMode(false);

                                  form.setFieldsValue({
                                    feePayment: {
                                      mode: false,
                                      numOfInstallments: 1,
                                    },
                                    feePayments: [],
                                  });
                                }
                                form.setFieldsValue({
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
              </div>
            )}

          {/* Discount and other charges */}

          {!type && (
            <div className="w-full mt-5 shadow border rounded-md bg-white">
              <div className=" ">
                <div className="bg-white px-4 mb-4 w-full  h-full">
                  <p className="font-medium text-sm text-gray-800 py-2.5 ">Payment adjustments</p>
                  <div className="flex flex-wrap  space-x-4">
                    <div className="flex space-x-4 ">
                      <p className="font-medium text-gray-800 text-sm py-2.5">Add other charges</p>
                      <Form.Item name={['items', index, 'feeTypeIdOtherCharges']}>
                        <Switch
                          size="default"
                          checked={isAddOtherAddAdjustmentPresent?.addOther}
                          onClick={(ev) => {
                            setIsAddOtherAddAdjustmentPresent((prev) => ({
                              ...prev,
                              addOther: ev,
                            }));

                            if (ev === false) {
                              const items = form.getFieldValue('items');

                              if (modulesList?.length > 0) {
                                let fee = 0;

                                if (form?.getFieldValue(['feePayment', 'totalFees'])) {
                                  fee =
                                    Number(
                                      decodeDollarsToDigits(
                                        form?.getFieldValue(['feePayment', 'totalFees']),
                                      ),
                                    ) -
                                    Number(
                                      decodeDollarsToDigits(
                                        form.getFieldValue(['items', index, 'otherAmount']),
                                      ),
                                    );
                                }
                                items[index] = {
                                  ...items[index],
                                  otherPurpose: '',
                                  otherRemarks: '',
                                  otherAmount: '',
                                };
                                form.setFieldsValue({
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
                                  if (form?.getFieldValue(['feePayment', 'totalFees'])) {
                                    fee =
                                      Number(
                                        decodeDollarsToDigits(
                                          form?.getFieldValue(['feePayment', 'totalFees']),
                                        ),
                                      ) -
                                      Number(
                                        decodeDollarsToDigits(
                                          form.getFieldValue(['items', index, 'otherAmount']),
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

                                form.setFieldsValue({
                                  items,
                                  feePayment: {
                                    totalFees: currencyFormatter.format(fee),
                                  },
                                });
                              }
                              // Resetting installments fields when discount amount's changes made
                              if (form?.getFieldValue(['feePayment', 'numOfInstallments']) > 0) {
                                setInstallmentsLevel([0]);
                                setPaymentMode(false);

                                form.setFieldsValue({
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
                      <p className="font-medium text-gray-800 text-sm py-2.5">
                        Discount adjustments
                      </p>
                      <Form.Item name={['items', index, 'feeTypeIdAdjustment']}>
                        <Switch
                          size="default"
                          checked={isAddOtherAddAdjustmentPresent?.addAdjustment}
                          onClick={(ev) => {
                            setIsAddOtherAddAdjustmentPresent((prev) => ({
                              ...prev,
                              addAdjustment: ev,
                            }));

                            if (ev === false) {
                              const items = form.getFieldValue('items');
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
                                    totalFees += Number(
                                      decodeDollarsToDigits(item?.basicAmount || 0),
                                    );
                                  }
                                }

                                if (index !== idx) {
                                  totalFees -= Number(
                                    decodeDollarsToDigits(item?.adjustmentAmount || 0),
                                  );
                                  totalFees += Number(
                                    decodeDollarsToDigits(item?.otherAmount || 0),
                                  );
                                } else {
                                  totalFees += Number(
                                    decodeDollarsToDigits(item?.adjustmentAmount || 0),
                                  );
                                  totalFees += Number(
                                    decodeDollarsToDigits(item?.otherAmount || 0),
                                  );
                                }
                              });

                              // Resetting installments fields when discount amount's switch off
                              if (form?.getFieldValue(['feePayment', 'numOfInstallments']) > 0) {
                                setInstallmentsLevel([0]);
                                setPaymentMode(false);
                              }
                              form.setFieldsValue({
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

                {isAddOtherAddAdjustmentPresent.addOther && (
                  <>
                    <p className="font-medium text-sm text-gray-800 mb-4 bg-gray-100 px-4 py-2">
                      Add other charges
                    </p>
                    <div className="px-4">
                      <Row gutter={[12]}>
                        <Col lg={8} xl={8} md={12} sm={24} xs={24}>
                          <div className="mt-4">
                            <p className="font-medium text-gray-800">Purpose</p>
                            <Form.Item
                              name={['items', index, 'otherPurpose']}
                              rules={[
                                {
                                  required: true,
                                  message: 'Please select Purpose',
                                },
                              ]}
                            >
                              <Input autoComplete="off" placeholder="Enter purpose" size="medium" />
                            </Form.Item>
                          </div>
                        </Col>
                        <Col lg={8} xl={8} md={12} sm={24} xs={24}>
                          <div className="mt-4">
                            <p className="font-medium text-gray-800">Amount</p>
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
                                    res =
                                      res[0] === '₹' ? res.substring(1, res.length).trim() : res;
                                    mod = Number(res).toFixed(2);
                                  } else {
                                    mod = event.target.value;
                                  }

                                  const items = form.getFieldValue('items');

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
                                            decodeDollarsToDigits(
                                              selectedAmt?.moduleBasicAmount || 0,
                                            ),
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
                                            decodeDollarsToDigits(
                                              selectedAmt?.moduleBasicAmount || 0,
                                            ),
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

                                  form.setFieldsValue({
                                    items,
                                    feePayment: {
                                      totalFees: currencyFormatter.format(otherChargesFee),
                                    },
                                  });

                                  // Resetting installments fields when other charges changes made

                                  if (
                                    form?.getFieldValue(['feePayment', 'numOfInstallments']) > 0
                                  ) {
                                    setInstallmentsLevel([0]);
                                    setPaymentMode(false);

                                    form.setFieldsValue({
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
                        <Col lg={8} xl={8} md={12} sm={24} xs={24}>
                          <div className="mt-4">
                            <p className="font-medium text-gray-800">Remarks</p>
                            <Form.Item
                              name={['items', index, 'otherRemarks']}
                              rules={[
                                {
                                  required: true,
                                  message: 'Please enter remarks first!',
                                },
                              ]}
                            >
                              <Input
                                autoComplete="off"
                                placeholder="Enter your remarks"
                                size="medium"
                              />
                            </Form.Item>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </>
                )}

                {isAddOtherAddAdjustmentPresent.addAdjustment && (
                  <>
                    <p className="font-medium text-sm text-gray-800 mb-4 bg-gray-100 px-4 py-2">
                      Add discount adjustment
                    </p>
                    <div className="px-4">
                      <Row gutter={[12]}>
                        <Col lg={8} xl={8} md={12} sm={24} xs={24}>
                          <div className="mt-4">
                            <p className="font-medium text-gray-800">Purpose</p>
                            <Form.Item
                              name={['items', index, 'adjustmentPurpose']}
                              rules={[
                                {
                                  required: true,
                                  message: 'Please select Purpose',
                                },
                              ]}
                            >
                              <Input autoComplete="off" placeholder="Enter purpose" size="medium" />
                            </Form.Item>
                          </div>
                        </Col>
                        <Col lg={8} xl={8} md={12} sm={24} xs={24}>
                          <div className="mt-4">
                            <p className="font-medium text-gray-800">Amount</p>
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
                                      const moduleItems = form?.getFieldValue([
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

                                      const itemData = form.getFieldValue('items')[index];
                                      const fees =
                                        totalModuleFees +
                                        Number(decodeDollarsToDigits(itemData?.otherAmount) || 0);

                                      const val = Number(value)
                                        ? value
                                        : decodeDollarsToDigits(value);
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
                                      const itemData = form.getFieldValue('items')[index];
                                      const fees =
                                        Number(decodeDollarsToDigits(itemData?.basicAmount) || 0) +
                                        Number(decodeDollarsToDigits(itemData?.otherAmount) || 0);

                                      const val = Number(value)
                                        ? value
                                        : decodeDollarsToDigits(value);
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
                                    res =
                                      res[0] === '₹' ? res.substring(1, res.length).trim() : res;
                                    mod = Number(res).toFixed(2);
                                  } else {
                                    mod = event.target.value;
                                  }

                                  const items = form.getFieldValue('items');

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
                                            decodeDollarsToDigits(
                                              selectedAmt?.moduleBasicAmount || 0,
                                            ),
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
                                            decodeDollarsToDigits(
                                              selectedAmt?.moduleBasicAmount || 0,
                                            ),
                                          );
                                        });
                                      } else {
                                        totalFees += Number(
                                          decodeDollarsToDigits(item?.basicAmount || 0),
                                        );
                                      }
                                    }
                                    totalFees -= Number(
                                      decodeDollarsToDigits(item?.adjustmentAmount || 0),
                                    );

                                    totalFees += Number(
                                      decodeDollarsToDigits(item?.otherAmount || 0),
                                    );

                                    if (index === idx) {
                                      if (
                                        checkModules?.includes('modulesItems') ||
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
                                    form?.getFieldValue(['feePayment', 'numOfInstallments']) > 0
                                  ) {
                                    setInstallmentsLevel([0]);
                                    setPaymentMode(false);

                                    form.setFieldsValue({
                                      feePayment: {
                                        mode: false,
                                        numOfInstallments: 1,
                                      },
                                      feePayments: [],
                                    });
                                  }
                                  form.setFieldsValue({
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
                        <Col lg={8} xl={8} md={12} sm={24} xs={24}>
                          <div className="mt-4">
                            <p className="font-medium text-gray-800">Remarks</p>
                            <Form.Item
                              name={['items', index, 'adjustmentRemarks']}
                              rules={[
                                {
                                  required: true,
                                  message: 'please enter remarks first',
                                },
                              ]}
                            >
                              <Input
                                autoComplete="off"
                                placeholder="Enter your remarks"
                                size="medium"
                              />
                            </Form.Item>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {type && form.getFieldValue(['items', index, 'modulesList'])?.length !== 0 && moduleId && (
            <div className="w-full mt-5 shadow border rounded-md bg-white">
              <div className=" ">
                <div className="bg-white px-4 mb-4 w-full  h-full">
                  <p className="font-medium text-sm text-gray-800 py-2.5 ">Payment adjustments</p>
                  <div className="flex flex-wrap  space-x-4">
                    <div className="flex space-x-4 ">
                      <p className="font-medium text-gray-800 text-sm py-2.5">Add other charges</p>
                      <Form.Item name={['items', index, 'feeTypeIdOtherCharges']}>
                        <Switch
                          size="default"
                          checked={isAddOtherAddAdjustmentPresent?.addOther}
                          onClick={(ev) => {
                            setIsAddOtherAddAdjustmentPresent((prev) => ({
                              ...prev,
                              addOther: ev,
                            }));

                            if (ev === false) {
                              const items = form.getFieldValue('items');

                              if (modulesList?.length > 0) {
                                let fee = 0;

                                if (form?.getFieldValue(['feePayment', 'totalFees'])) {
                                  fee =
                                    Number(
                                      decodeDollarsToDigits(
                                        form?.getFieldValue(['feePayment', 'totalFees']),
                                      ),
                                    ) -
                                    Number(
                                      decodeDollarsToDigits(
                                        form.getFieldValue(['items', index, 'otherAmount']),
                                      ),
                                    );
                                }
                                items[index] = {
                                  ...items[index],
                                  otherPurpose: '',
                                  otherRemarks: '',
                                  otherAmount: '',
                                };
                                form.setFieldsValue({
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
                                  if (form?.getFieldValue(['feePayment', 'totalFees'])) {
                                    fee =
                                      Number(
                                        decodeDollarsToDigits(
                                          form?.getFieldValue(['feePayment', 'totalFees']),
                                        ),
                                      ) -
                                      Number(
                                        decodeDollarsToDigits(
                                          form.getFieldValue(['items', index, 'otherAmount']),
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

                                form.setFieldsValue({
                                  items,
                                  feePayment: {
                                    totalFees: currencyFormatter.format(fee),
                                  },
                                });
                              }
                              // Resetting installments fields when discount amount's changes made
                              if (form?.getFieldValue(['feePayment', 'numOfInstallments']) > 0) {
                                setInstallmentsLevel([0]);
                                setPaymentMode(false);

                                form.setFieldsValue({
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
                      <p className="font-medium text-gray-800 text-sm py-2.5">
                        Discount adjustments
                      </p>
                      <Form.Item name={['items', index, 'feeTypeIdAdjustment']}>
                        <Switch
                          size="default"
                          checked={isAddOtherAddAdjustmentPresent?.addAdjustment}
                          onClick={(ev) => {
                            setIsAddOtherAddAdjustmentPresent((prev) => ({
                              ...prev,
                              addAdjustment: ev,
                            }));

                            if (ev === false) {
                              const items = form.getFieldValue('items');
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
                                    totalFees += Number(
                                      decodeDollarsToDigits(item?.basicAmount || 0),
                                    );
                                  }
                                }

                                if (index !== idx) {
                                  totalFees -= Number(
                                    decodeDollarsToDigits(item?.adjustmentAmount || 0),
                                  );
                                  totalFees += Number(
                                    decodeDollarsToDigits(item?.otherAmount || 0),
                                  );
                                } else {
                                  totalFees += Number(
                                    decodeDollarsToDigits(item?.adjustmentAmount || 0),
                                  );
                                  totalFees += Number(
                                    decodeDollarsToDigits(item?.otherAmount || 0),
                                  );
                                }
                              });

                              // Resetting installments fields when discount amount's switch off
                              if (form?.getFieldValue(['feePayment', 'numOfInstallments']) > 0) {
                                setInstallmentsLevel([0]);
                                setPaymentMode(false);
                              }
                              form.setFieldsValue({
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

                {isAddOtherAddAdjustmentPresent.addOther && (
                  <>
                    <p className="font-medium text-sm text-gray-800 mb-4 bg-gray-100 px-4 py-2">
                      Add other charges
                    </p>
                    <div className="px-4">
                      <Row gutter={[12]}>
                        <Col lg={8} xl={8} md={12} sm={24} xs={24}>
                          <div className="mt-4">
                            <p className="font-medium text-gray-800">Purpose</p>
                            <Form.Item
                              name={['items', index, 'otherPurpose']}
                              rules={[
                                {
                                  required: true,
                                  message: 'Please select Purpose',
                                },
                              ]}
                            >
                              <Input autoComplete="off" placeholder="Enter purpose" size="medium" />
                            </Form.Item>
                          </div>
                        </Col>
                        <Col lg={8} xl={8} md={12} sm={24} xs={24}>
                          <div className="mt-4">
                            <p className="font-medium text-gray-800">Amount</p>
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
                                    res =
                                      res[0] === '₹' ? res.substring(1, res.length).trim() : res;
                                    mod = Number(res).toFixed(2);
                                  } else {
                                    mod = event.target.value;
                                  }

                                  const items = form.getFieldValue('items');

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
                                            decodeDollarsToDigits(
                                              selectedAmt?.moduleBasicAmount || 0,
                                            ),
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
                                            decodeDollarsToDigits(
                                              selectedAmt?.moduleBasicAmount || 0,
                                            ),
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

                                  form.setFieldsValue({
                                    items,
                                    feePayment: {
                                      totalFees: currencyFormatter.format(otherChargesFee),
                                    },
                                  });

                                  // Resetting installments fields when other charges changes made

                                  if (
                                    form?.getFieldValue(['feePayment', 'numOfInstallments']) > 0
                                  ) {
                                    setInstallmentsLevel([0]);
                                    setPaymentMode(false);

                                    form.setFieldsValue({
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
                        <Col lg={8} xl={8} md={12} sm={24} xs={24}>
                          <div className="mt-4">
                            <p className="font-medium text-gray-800">Remarks</p>
                            <Form.Item
                              name={['items', index, 'otherRemarks']}
                              rules={[
                                {
                                  required: true,
                                  message: 'Please enter remarks first!',
                                },
                              ]}
                            >
                              <Input
                                autoComplete="off"
                                placeholder="Enter your remarks"
                                size="medium"
                              />
                            </Form.Item>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </>
                )}

                {isAddOtherAddAdjustmentPresent.addAdjustment && (
                  <>
                    <p className="font-medium text-sm text-gray-800 mb-4 bg-gray-100 px-4 py-2">
                      Add discount adjustment
                    </p>
                    <div className="px-4">
                      <Row gutter={[12]}>
                        <Col lg={8} xl={8} md={12} sm={24} xs={24}>
                          <div className="mt-4">
                            <p className="font-medium text-gray-800">Purpose</p>
                            <Form.Item
                              name={['items', index, 'adjustmentPurpose']}
                              rules={[
                                {
                                  required: true,
                                  message: 'Please select Purpose',
                                },
                              ]}
                            >
                              <Input autoComplete="off" placeholder="Enter purpose" size="medium" />
                            </Form.Item>
                          </div>
                        </Col>
                        <Col lg={8} xl={8} md={12} sm={24} xs={24}>
                          <div className="mt-4">
                            <p className="font-medium text-gray-800">Amount</p>
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
                                      const moduleItems = form?.getFieldValue([
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

                                      const itemData = form.getFieldValue('items')[index];
                                      const fees =
                                        totalModuleFees +
                                        Number(decodeDollarsToDigits(itemData?.otherAmount) || 0);

                                      const val = Number(value)
                                        ? value
                                        : decodeDollarsToDigits(value);
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
                                      const itemData = form.getFieldValue('items')[index];
                                      const fees =
                                        Number(decodeDollarsToDigits(itemData?.basicAmount) || 0) +
                                        Number(decodeDollarsToDigits(itemData?.otherAmount) || 0);

                                      const val = Number(value)
                                        ? value
                                        : decodeDollarsToDigits(value);
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
                                    res =
                                      res[0] === '₹' ? res.substring(1, res.length).trim() : res;
                                    mod = Number(res).toFixed(2);
                                  } else {
                                    mod = event.target.value;
                                  }

                                  const items = form.getFieldValue('items');

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
                                            decodeDollarsToDigits(
                                              selectedAmt?.moduleBasicAmount || 0,
                                            ),
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
                                            decodeDollarsToDigits(
                                              selectedAmt?.moduleBasicAmount || 0,
                                            ),
                                          );
                                        });
                                      } else {
                                        totalFees += Number(
                                          decodeDollarsToDigits(item?.basicAmount || 0),
                                        );
                                      }
                                    }
                                    totalFees -= Number(
                                      decodeDollarsToDigits(item?.adjustmentAmount || 0),
                                    );

                                    totalFees += Number(
                                      decodeDollarsToDigits(item?.otherAmount || 0),
                                    );

                                    if (index === idx) {
                                      if (
                                        checkModules?.includes('modulesItems') ||
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
                                    form?.getFieldValue(['feePayment', 'numOfInstallments']) > 0
                                  ) {
                                    setInstallmentsLevel([0]);
                                    setPaymentMode(false);

                                    form.setFieldsValue({
                                      feePayment: {
                                        mode: false,
                                        numOfInstallments: 1,
                                      },
                                      feePayments: [],
                                    });
                                  }
                                  form.setFieldsValue({
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
                        <Col lg={8} xl={8} md={12} sm={24} xs={24}>
                          <div className="mt-4">
                            <p className="font-medium text-gray-800">Remarks</p>
                            <Form.Item
                              name={['items', index, 'adjustmentRemarks']}
                              rules={[
                                {
                                  required: true,
                                  message: 'please enter remarks first',
                                },
                              ]}
                            >
                              <Input
                                autoComplete="off"
                                placeholder="Enter your remarks"
                                size="medium"
                              />
                            </Form.Item>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </Row>
      </div>
    </div>
  );
};

export default connect(({ student, courses }) => ({
  courseFee: student?.courseFee,
  getCoursesCategory: courses?.getCoursesCategory,
  getCoursesSubCategory: courses?.getCoursesSubCategory,
  getCoursesFromSubCategory: courses?.getCoursesFromSubCategory,
}))(CourseCard);
