import { Button, Form, Select, Row, Col, message, Timeline, Input, Avatar } from 'antd';
import { connect, history } from 'umi';
import React, { useEffect, useState } from 'react';
import CheckValidation from '@/components/CheckValidation';
import dayjs from 'dayjs';
import AppIcons from '@/utils/AppIcons';
import classes from './index.less';
import CourseCard from './CourseCard';
import { currencyFormatter, decodeDollarsToDigits } from '@/utils/utils';
import PaymentMode from './PamentMode';
import moment from 'moment';
import EmptyState from '@/components/EmptyState';
import emptyStateSvg from '@/assets/icons/space-empty.svg';
import ReactHtmlParser from 'react-html-parser';
import { getInitials } from '@/utils/common';

const UpgradeCourse = ({
  dispatch,
  setShowDrawer,
  showDrawer,
  editLead,
  id,
  allCourses,
  studentDetails,
  idx,
  type,
  getStudentCourses,
  studentActivity,
  countries,
  courseDetails,
}) => {
  const [form] = Form.useForm();
  //   const { Option } = Select;
  const [
    courseSearch,
    // setCourseSearch
  ] = useState();

  const [courseList, setCourseList] = useState([]);
  const [installmentsLevel, setInstallmentsLevel] = useState([0]);
  const [paymentMode, setPaymentMode] = useState(false);
  const [types, setTypes] = useState('');
  const [addModule, setAddModule] = useState([]);
  const [checkIdx, setCheckIdx] = useState([]);
  const [, setCoursesSubCategory] = useState([]);
  const [, setCoursesFromSubCategory] = useState([]);
  const [visaCategory, setVisaCategory] = useState([]);
  const [displayOtherVisaDropBox, setDisplayOtherVisaDropBox] = useState(false);
  const [purposeChange, setPurposeChange] = useState([]);
  const [displayServicesDropBox, setDisplayServicesDropBox] = useState(false);
  const [selectedService, setSelectedService] = useState([]);
  const [, setOtherServiceOn] = useState(false);
  const [otherVisaSetting, setOtherVisaSetting] = useState(false);
  const [referenceBy, setReferenceBy] = useState([]);
  const [idxCourseModules, setIdxCourseModules] = useState([]);
  const [moduleId, setModuleId] = useState(null);
  const [isAddOtherAddAdjustmentPresent, setIsAddOtherAddAdjustmentPresent] = useState({
    addAdjustment: false,
    addOther: false,
  });

  const visaDetailsChange = (value) => {
    setVisaCategory(value);
    setDisplayOtherVisaDropBox(false);
    form.setFieldsValue({
      visa_category: undefined,
      category_other: undefined,
      country: undefined,
      otherVisaCategory: undefined,
    });
  };
  useEffect(() => {
    if (idx)
      dispatch({
        type: 'courses/getCourseDetails',
        payload: {
          pathParams: {
            courseId: idx,
          },
        },
      }).then((res) => {
        setIdxCourseModules(res?.courseModules);
        setModuleId(res?.courseModules?.map((item) => item?.id));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const visaDetails = [
    {
      id: 'STUDENT_VISA',
      label: 'Student Visa ',
    },
    {
      id: 'VISITOR_VISA',
      label: 'Visitor Visa ',
    },
    {
      id: 'OTHER_VISA_SERVICES',
      label: 'Other Visa Services ',
    },
  ];

  useEffect(() => {
    dispatch({
      type: 'common/getCountriesList',
    });
    dispatch({
      type: 'leads/getStaffMembers',
      payload: {
        query: {
          statusId: 'PARTYINV_ACCEPTED',
        },
      },
    }).then((res) => {
      setReferenceBy(res?.records?.filter((items) => items?.id || items?.name));
    });
  }, []);
  const otherVisaServices = () => {
    form.setFieldsValue({
      country: undefined,
    });
  };

  const categoryList = [
    {
      id: 'PR',
      label: 'PR',
    },
    {
      id: 'WORK',
      label: 'Work',
    },
    {
      id: 'IMMIGRATION',
      label: 'Immigration',
    },
    { id: 'OTHER_VISA', label: 'Others' },
  ];

  const serviceSelection = (value) => {
    setSelectedService(value);
    form.setFieldsValue({
      emp_name: undefined,
    });
  };

  const serviceCategory = [
    {
      id: 'IELTS_TEST_BOOKING',
      label: 'IELTS Test Booking ',
    },
    {
      id: 'PTE_TEST_BOOKING',
      label: 'PTE Test Booking ',
    },
    {
      id: 'AIR_TICKET_BOOKING',
      label: 'Air Ticket Booking ',
    },
    {
      id: 'PASSPORT_APPOINT',
      label: 'Passport Appoint ',
    },
    {
      id: 'PCC_APPOINT',
      label: 'PCC Appoint ',
    },
    {
      id: 'MEETING_WITH',
      label: 'Meeting with ',
    },
    {
      id: 'OTHERS',
      label: 'Others ',
    },
  ];

  const prefixServiceSelector = (
    <Form.Item name="otherServices" initialValue="OTHERS" style={{ margin: '0' }}>
      <Select
        showSearch
        style={{ width: '110px', paddingLeft: 10 }}
        placeholder="Enter other computer course"
        getPopupContainer={(node) => node.parentNode}
        onChange={(val) => {
          setSelectedService(val);
          if (val === 'OTHERS') {
            setDisplayServicesDropBox(true);
          } else {
            setDisplayServicesDropBox(false);
            form?.setFieldsValue({
              service_Other: undefined,
              service_category: val,
            });
          }
        }}
      >
        {serviceCategory &&
          serviceCategory?.map((element) => (
            <Select.Option key={element?.id} value={element?.id}>
              {element?.label}
            </Select.Option>
          ))}
      </Select>
    </Form.Item>
  );

  const prefixCategorySelector = (
    <Form.Item name="otherVisaCategory" initialValue="OTHER_VISA" style={{ margin: '0' }}>
      <Select
        showSearch
        size="large"
        style={{ width: '110px' }}
        placeholder="Enter other visa category"
        getPopupContainer={(node) => node.parentNode}
        onChange={(val) => {
          if (val === 'OTHER_VISA') {
            setDisplayOtherVisaDropBox(true);
          } else {
            setDisplayOtherVisaDropBox(false);
            form.setFieldsValue({
              category_other: '',
              visa_category: val,
            });
          }
        }}
      >
        {categoryList &&
          categoryList?.map((element) => (
            <Select.Option key={element?.id} value={element?.id}>
              {element?.label}
            </Select.Option>
          ))}
      </Select>
    </Form.Item>
  );

  if (otherVisaSetting) {
    form.setFieldsValue({
      otherVisaCategory: 'OTHER_VISA',
    });
  }

  const purposeList = [
    {
      id: 'Courses',
      label: 'Courses',
    },
    {
      id: 'Visa',
      label: 'Visa',
    },
    {
      id: 'Others',
      label: 'Other Service.',
    },
  ];

  const purposeChangeHandler = (e) => {
    if (e === 'Courses') {
      const items = form.getFieldValue('items') || [];
      const modalItems = form.getFieldValue('items') || [];

      items?.forEach((_, index) => {
        items[index] = {
          ...items[index],
          addModulesCheckbox: false,
          modulesItems: undefined,
          modulesList: undefined,
        };
      });
      form.setFieldsValue({
        items,
        courses: [],
        language_course_category: [],
        courseCategory: [],
        subCourseCategory: [],
      });

      modalItems?.forEach((_, index) => {
        modalItems[index] = {
          ...modalItems[index],
          addModulesCheckbox: false,
          modulesItems: undefined,
          modulesList: undefined,
        };
      });
      form.setFieldsValue({
        items: modalItems,
        courses: [],
        language_course_category: [],
        courseCategory: [],
        subCourseCategory: [],
      });

      setCourseList([]);
      setCoursesSubCategory([]);
      setCoursesFromSubCategory([]);
    }

    if (e === 'Visa') {
      form.setFieldsValue({
        visa: [],
        visa_category: [],
        category_other: [],
        country: [],
        other_country: [],
        otherCountryForAppliedVisa: [],
        otherVisaCategory: [],
      });
      setVisaCategory([]);
    }

    if (e === 'Others') {
      setSelectedService([]);
      setDisplayServicesDropBox(false);
      form.setFieldsValue({
        service_category: [],
        service_Other: [],
        emp_name: [],
        otherServices: [],
      });
    }
  };

  const getStudentCourse = () => {
    dispatch({
      type: 'student/getStudentCourses',
      payload: {
        pathParams: {
          studentId: studentDetails?.id,
        },
      },
    });
  };

  const getCategory = () => {
    dispatch({
      type: 'courses/getCoursesCategory',
      payload: {},
    });
  };

  const getActivityRecord = () => {
    dispatch({
      type: 'student/getStudentOwnerActivity',
      payload: {
        pathParams: { studentId: id },
        query: {
          activityType: 'add_student_course',
          viewSize: 1000,
        },
      },
    });
  };
  useEffect(() => {
    getActivityRecord();
    getStudentCourse();
    if (!idx) {
      getCategory();
      dispatch({
        type: 'courses/getCourses',
        payload: {
          query: { partyId: id },
        },
      });
    }
    // getActivity();
  }, [courseSearch, dispatch, editLead]);

  const getTimelineIcon = () => {
    return (
      <div
        className="flex items-center justify-center w-8 h-8 text-white rounded-full"
        style={{ backgroundColor: '#ffa500' }}
      >
        <AppIcons.PersonSquare />
      </div>
    );
  };

  const CourseID = [courseDetails?.records?.find((val) => val?.id === idx)];
  useEffect(() => {
    if (idx && getStudentCourses !== null) {
      const otherCharges = courseDetails?.records
        ?.find((val) => val?.id === idx)
        ?.partyFees?.find((val) => val?.feeTypeId === 'OTHER_CHARGES');
      const adjustments = courseDetails?.records
        ?.find((val) => val?.id === idx)
        ?.partyFees?.find((val) => val?.feeTypeId === 'ADJUSTMENTS');
      const items = CourseID?.map((val) => ({
        basicAmount: val?.amount,
        addModulesCheckbox: val?.modules?.length > 0,
        feeTypeIdOtherCharges: Boolean(otherCharges),
        feeTypeIdAdjustment: Boolean(adjustments),
        otherPurpose: otherCharges?.purpose,
        otherAmount: `₹${`${otherCharges?.amount}`}.00`,
        otherRemarks: otherCharges?.remarks,
        adjustmentPurpose: adjustments?.purpose,
        adjustmentAmount: `₹${`${adjustments?.amount}`}.00`,
        adjustmentRemarks: adjustments?.remarks,
        subCourseCategory: val?.subCategoryName,
        courseCategory: val?.categoryName,
        productId: val?.id,
        courseType: val?.courseType,
        startDate: moment(val?.startDate),
        endDate: moment(val?.endDate),
        noOfDays:
          moment(val?.endDate).endOf('day').diff(moment(val?.startDate).startOf('day'), 'days') + 1,
        modulesItems: val?.modules?.map((itm) => ({
          ...items,
          moduleBasicAmount: `₹${`${itm?.amount}`}.00`,
          moduleEndDate: moment(itm?.endDate),
          moduleStartDate: moment(itm?.startDate),
          moduleId: itm?.name,
          moduleNoOfDays:
            moment(itm?.endDate).endOf('day').diff(moment(itm?.startDate).startOf('day'), 'days') +
            1,
          moduleDurationUnitId: itm?.durationUnitId,
        })),
        modulesList: val?.modules?.map((itm) => itm?.id),
      }));
      if (otherCharges) {
        setIsAddOtherAddAdjustmentPresent((prev) => ({ ...prev, addOther: true }));
      }
      if (adjustments) {
        setIsAddOtherAddAdjustmentPresent((prev) => ({ ...prev, addAdjustment: true }));
      }
      form.setFieldsValue({
        language_course_category: CourseID?.map((val) => val?.name),
        items,
      });
    }
  }, [idx, getStudentCourses]);

  const mode = form.getFieldValue(['items', 0, 'courseType']);

  useEffect(() => {
    setTypes(mode);
  }, [mode]);

  const onCommentFinish = (value) => {
    const newValues = { ...value };
    const items = newValues?.items?.map((val) => ({
      product: {
        courseTypeId: val?.courseType,
        id: val?.productId,
        amount: Number(decodeDollarsToDigits(newValues?.feePayment?.totalFees)),
        durationUnitId: val?.durationUnitId,
        numOfDays: val?.noOfDays,
        startDate: val?.startDate?.toISOString(),
        endDate: val?.endDate?.toISOString(),
        courseModules: val?.addModulesCheckbox
          ? val?.modulesItems?.map((item) => ({
              id: item?.moduleId,
              startDate: item?.moduleStartDate?.toISOString(),
              endDate: item?.moduleEndDate?.toISOString(),
              numOfDays: item?.moduleNoOfDays,
              amount: Number(decodeDollarsToDigits(item?.moduleBasicAmount)),
              durationUnitId: item?.moduleDurationUnitId,
            }))
          : null,
        partyFees: [
          {
            amount: val?.feeTypeIdAdjustment
              ? Number(decodeDollarsToDigits(val?.adjustmentAmount))
              : 0,
            feeTypeId: val?.feeTypeIdAdjustment ? 'ADJUSTMENTS' : null,
            purpose: val?.feeTypeIdAdjustment ? val?.adjustmentPurpose : null,
            remarks: val?.feeTypeIdAdjustment ? val?.adjustmentRemarks : null,
          },
          {
            amount: val?.feeTypeIdOtherCharges
              ? Number(decodeDollarsToDigits(val?.otherAmount))
              : 0,
            feeTypeId: val?.feeTypeIdOtherCharges ? 'OTHER_CHARGES' : null,
            purpose: val?.feeTypeIdOtherCharges ? val?.otherPurpose : null,
            remarks: val?.feeTypeIdOtherCharges ? val?.otherRemarks : null,
          },
        ],
      },
    }));

    const feePayments = newValues?.feePayments?.map((val) => ({
      // totalFees: Number(decodeDollarsToDigits(newValues?.feePayment?.totalFees)),
      numOfInstallments: newValues?.feePayment?.numOfInstallments,
      dueDate: val?.dueDate?.toISOString(),
      amount: Number(decodeDollarsToDigits(val?.amount)),
    }));

    const needs = [];
    if (newValues?.service_category) {
      const obj = { id: newValues?.service_category };
      if (newValues?.emp_name) {
        obj.value = newValues?.emp_name;
      }
      needs.push(obj);
    }
    if (newValues?.otherServices) {
      const obj = { id: newValues?.otherServices };
      if (newValues?.service_Other) {
        obj.value = newValues?.service_Other;
      }
      needs.push(obj);
    }
    if (newValues?.visa) {
      const obj = {
        id:
          (newValues?.otherVisaCategory && newValues?.otherVisaCategory) ||
          (newValues?.visa_category && newValues?.visa_category) ||
          newValues?.visa,
      };
      if (newValues?.country || newValues?.category_other) {
        obj.value = (newValues?.category_other && newValues?.category_other) || newValues?.country;
      }
      needs.push(obj);
    }
    if (value?.language_course_category) {
      needs.push({ productId: value?.language_course_category[0] });
    }
    delete newValues?.language_course_category;
    delete newValues?.modulesList;

    const data = {
      items,
      lookingFor: value?.lookingFor,
      addNewInstallments: paymentMode === 'New',
      feePayments: newValues?.feePayments ? feePayments : '',
    };
    if (needs?.length > 0) {
      data.needs = [...needs];
    }
    if (paymentMode !== 'New') delete data.feePayments;
    if (idx) {
      dispatch({
        type: 'student/upgradeCourseDetails',
        payload: {
          body: data,
          pathParams: { studentId: id },
        },
      }).then((res) => {
        if (res) {
          message.success('Course  added successfully');
          history.push(`/students/${id}`);
        } else {
          message.error('Something went wrong!');
        }
      });
    } else {
      dispatch({
        type: 'student/updateCourseDetails',
        payload: {
          body: data,
          pathParams: { studentId: id },
        },
      }).then((res) => {
        if (res?.status === 'ok') {
          message.success('Course  added successfully');
          history.push(`/students/${id}`);
        } else {
          message.error('Something went wrong!');
        }
      });
    }
  };

  return (
    <div>
      <Form form={form} onFinish={onCommentFinish} hideRequiredMark autoComplete="off">
        <Row gutter={16}>
          {!idx && (
            <>
              <Col lg={24} xl={24} md={24} sm={24} xs={24}>
                <p className="font-medium text-gray-800 ">Purpose</p>
                <Form.Item
                  name="lookingFor"
                  rules={[{ required: true, message: 'Please enter purpose' }]}
                >
                  <Select
                    size="medium"
                    mode="tags"
                    placeholder="Please list down the purpose"
                    getPopupContainer={(node) => node.parentNode}
                    onDeselect={purposeChangeHandler}
                    style={{ width: '100%' }}
                    onChange={(purpose) => setPurposeChange(purpose)}
                  >
                    {purposeList?.map((item) => (
                      <Select.Option value={item?.id} key={item?.id}>
                        {item?.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              {purposeChange?.includes('Visa') && (
                <Col lg={24} xl={24} md={24} sm={24} xs={24}>
                  <p className="font-medium text-gray-800">Visa</p>
                  <Form.Item
                    name="visa"
                    rules={[
                      {
                        required: true,
                        message: 'Please select the visa',
                      },
                    ]}
                  >
                    <Select
                      size="medium"
                      placeholder="Please select the visa"
                      style={{ width: '100%' }}
                      getPopupContainer={(node) => node.parentNode}
                      onChange={visaDetailsChange}
                    >
                      {visaDetails?.map((item) => (
                        <Select.Option value={item?.id} label={item?.label} key={item?.id}>
                          {item?.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              )}
              {(visaCategory?.includes('STUDENT_VISA') ||
                visaCategory?.includes('VISITOR_VISA')) && (
                <Col lg={24} xl={24} md={24} sm={24} xs={24}>
                  <>
                    <p className="font-medium text-gray-800">Visa Country </p>
                    <Form.Item
                      name="country"
                      rules={[
                        {
                          required: true,
                          message: 'Please select the country',
                        },
                      ]}
                    >
                      <Select
                        getPopupContainer={(node) => node.parentNode}
                        size="medium"
                        showSearch
                        placeholder="Please select the country"
                        notFoundContent="No Countries Found"
                        style={{ width: '100%' }}
                        filterOption={(input, option) =>
                          option?.children?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0
                        }
                      >
                        {countries?.map((item) => (
                          <Select.Option value={item?.name} key={item?.name}>
                            {item?.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </>
                </Col>
              )}
              {purposeChange?.includes('Visa') && visaCategory?.includes('OTHER_VISA_SERVICES') && (
                <Col lg={24} xl={24} md={24} sm={24} xs={24}>
                  {!displayOtherVisaDropBox ? (
                    <>
                      <p className="font-medium text-gray-800">Choose other visa services </p>
                      <Form.Item
                        name="visa_category"
                        rules={[
                          {
                            required: true,
                            message: 'Please select the category',
                          },
                        ]}
                      >
                        <Select
                          size="medium"
                          placeholder="Please select the category"
                          style={{ width: '100%' }}
                          getPopupContainer={(node) => node.parentNode}
                          onChange={otherVisaServices}
                          onSelect={(val) => {
                            if (val === 'OTHER_VISA') {
                              setOtherVisaSetting(true);
                              setDisplayOtherVisaDropBox(true);
                              form.setFieldsValue({
                                category_other: '',
                                otherVisaCategory: val,
                              });
                            } else setDisplayOtherVisaDropBox(false);
                          }}
                        >
                          {categoryList?.map((item) => (
                            <Select.Option value={item?.id} key={item?.id}>
                              {item?.label}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </>
                  ) : (
                    <>
                      <p className="font-medium text-gray-800">Choose other visa category</p>
                      <Form.Item
                        name="category_other"
                        rules={[
                          {
                            required: true,
                            message: 'Please enter other visa',
                          },
                        ]}
                      >
                        <Input
                          type="text"
                          addonBefore={prefixCategorySelector}
                          placeholder="Enter other visa category"
                          autoComplete="off"
                        />
                      </Form.Item>
                    </>
                  )}
                </Col>
              )}
              {purposeChange?.includes('Others') && (
                <Col lg={24} xl={24} md={24} sm={24} xs={24}>
                  {!displayServicesDropBox ? (
                    <>
                      <p className="font-medium text-gray-800">Other service category</p>
                      <Form.Item
                        name="service_category"
                        rules={[
                          {
                            required: true,
                            message: 'Please select the service category',
                          },
                        ]}
                      >
                        <Select
                          size="medium"
                          placeholder="Please select the service category"
                          style={{ width: '100%' }}
                          getPopupContainer={(node) => node.parentNode}
                          onSelect={(val) => {
                            if (val === 'OTHERS') {
                              setSelectedService('');
                              setOtherServiceOn(true);
                              form?.setFieldsValue({
                                service_Other: undefined,
                                otherServices: val,
                              });
                              setDisplayServicesDropBox(true);
                            } else setDisplayServicesDropBox(false);
                          }}
                          onChange={serviceSelection}
                        >
                          {serviceCategory?.map((item) => (
                            <Select.Option value={item?.id} key={item?.id}>
                              {item?.label}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </>
                  ) : (
                    <>
                      <p className="font-medium text-gray-800">Other service category</p>
                      <Form.Item
                        name="service_Other"
                        rules={[
                          {
                            required: true,
                            message: 'Please enter service category',
                          },
                        ]}
                      >
                        <Input
                          autoComplete="off"
                          type="text"
                          size="medium"
                          addonBefore={prefixServiceSelector}
                          placeholder="Please enter service category"
                        />
                      </Form.Item>
                    </>
                  )}
                </Col>
              )}
              {selectedService?.includes('MEETING_WITH') && (
                <Col lg={24} xl={24} md={24} sm={24} xs={24}>
                  <>
                    <p className="font-medium text-gray-800">Select name of employee</p>
                    <Form.Item name="emp_name">
                      <Select
                        size="medium"
                        placeholder="Please select name of the employee"
                        optionLabelProp="label"
                        style={{ width: '100%' }}
                        getPopupContainer={(node) => node.parentNode}
                      >
                        {referenceBy?.map((item) => (
                          <Select.Option
                            value={item?.partyId}
                            label={item?.displayName}
                            key={item?.partyId}
                          >
                            <div className="flex space-x-2">
                              <div className="py-1">
                                <Avatar style={{ background: '#0d6efd' }}>
                                  {getInitials(item?.displayName)}
                                </Avatar>
                              </div>
                              <div className="py-2">{item?.displayName}</div>
                            </div>
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </>
                </Col>
              )}
            </>
          )}
          {!idx && purposeChange?.includes('Courses') && (
            <>
              <Col lg={24} xl={24} md={24} sm={24} xs={24}>
                <p className="font-medium text-gray-800">Courses</p>
                <Form.Item
                  name="language_course_category"
                  rules={[
                    {
                      required: true,
                      message: 'Please select the course category',
                    },
                  ]}
                >
                  <Select
                    className="w-full"
                    size="medium"
                    mode="tags"
                    placeholder={'Please list down the course category'}
                    style={{ width: '100%' }}
                    getPopupContainer={(node) => node.parentNode}
                    onChange={(value) => {
                      let initialCourses = form?.getFieldValue('items') || [];
                      let initialItems = form.getFieldValue('items') || [];

                      if (initialCourses?.length < value?.length) {
                        const courseId = value[value?.length - 1];
                        dispatch({
                          type: 'courses/getCourseDetails',
                          payload: {
                            pathParams: {
                              courseId,
                            },
                          },
                        }).then((res) => {
                          if (res?.id) {
                            const newCourse = {
                              productId: value[value?.length - 1],
                              fees: res?.fees,
                              courseCategory: res?.categoryName,
                              categoryId: res?.categoryId,
                              subCategoryId: res?.subCategoryId,
                              subCourseCategory: res?.subCategoryName,
                              durationUnitId: res?.fees[0]?.feeDurationId,
                              displayName: res?.displayName,
                              courseModulesArray: res?.courseModules,
                              basicAmount: currencyFormatter.format(res?.fees[0]?.feeAmount),
                            };

                            let totalFees = 0;

                            if (form?.getFieldValue(['feePayment', 'totalFees'])) {
                              totalFees = Number(
                                decodeDollarsToDigits(
                                  form?.getFieldValue(['feePayment', 'totalFees']),
                                ),
                              );
                              totalFees += Number(decodeDollarsToDigits(newCourse?.basicAmount));
                            } else {
                              totalFees = Number(decodeDollarsToDigits(newCourse?.basicAmount));
                            }

                            initialCourses = [...initialCourses, newCourse];
                            initialItems = [...initialItems, newCourse];
                            form.setFieldsValue({
                              items: initialCourses,
                            });

                            form.setFieldsValue({
                              items: initialItems,
                              feePayment: { totalFees: currencyFormatter.format(totalFees) },
                            });
                            setCourseList(initialCourses);
                          }
                        });
                      } else {
                        const index = initialCourses?.findIndex(
                          (data) => !value?.includes(data?.productId),
                        );
                        initialCourses = initialCourses?.filter((data) =>
                          value?.includes(data?.productId),
                        );

                        let setTotal = 0;
                        const newItems = [];

                        form?.setFieldsValue({
                          items: initialCourses,
                        });

                        for (let i = 0; i < initialItems.length; i++) {
                          if (i !== index) {
                            newItems.push(initialItems[i] || undefined);
                          }

                          // [2m,1,2,3]
                          // [2m,2,3]
                        }

                        newItems?.forEach((val) => {
                          const checkModules = Object.keys(val);
                          if (
                            checkModules?.includes('modulesItems') ||
                            val?.modulesItems !== undefined
                          ) {
                            val?.modulesItems?.forEach((selectedAmt) => {
                              setTotal += Number(
                                decodeDollarsToDigits(selectedAmt?.moduleBasicAmount),
                              );
                            });
                          } else {
                            setTotal += Number(decodeDollarsToDigits(val?.basicAmount || 0));
                          }

                          setTotal += Number(decodeDollarsToDigits(val?.otherAmount || 0));
                          setTotal -= Number(decodeDollarsToDigits(val?.adjustmentAmount || 0));
                        });

                        form?.setFieldsValue({
                          items: newItems,
                          feePayment: { totalFees: currencyFormatter.format(setTotal) },
                        });

                        setCourseList(initialCourses);
                      }
                    }}
                  >
                    {allCourses?.records?.map((item) => (
                      <Select.Option className="w-full" value={item?.id} key={item?.id}>
                        {item?.displayName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </>
          )}
          {!idx && (
            <Col lg={24} xl={24} md={24} sm={24} xs={24}>
              <div className="overflow-y-auto" style={{ maxHeight: '600px' }}>
                {courseList?.map((item, index) => (
                  <div className="mt-5" key={item?.id}>
                    <CourseCard
                      feeArray={item?.fees?.filter((fee) => fee?.feeAmount)}
                      courseList={courseList}
                      key={item?.productId}
                      id={item?.productId}
                      courseDisplayName={item?.displayName}
                      courseCategoryName={item?.courseCategory}
                      moduleId={moduleId}
                      setModuleId={setModuleId}
                      idxCourseModules={idxCourseModules}
                      setIdxCourseModules={setIdxCourseModules}
                      isAddOtherAddAdjustmentPresent={isAddOtherAddAdjustmentPresent}
                      setIsAddOtherAddAdjustmentPresent={setIsAddOtherAddAdjustmentPresent}
                      categoryId={item?.categoryId}
                      courseEdit={false}
                      courseSubCategoryName={item?.subCourseCategory}
                      subCategoryId={item?.subCategoryId}
                      courseModulesArray={item?.courseModulesArray}
                      index={index}
                      form={form}
                      setInstallmentsLevel={setInstallmentsLevel}
                      setPaymentMode={setPaymentMode}
                    />
                  </div>
                ))}
              </div>
              <Col lg={24} xl={24} md={24} sm={24} xs={24}>
                {courseList?.length > 0 && (
                  <div className="mt-5 bg-gray-100 border w-full">
                    <PaymentMode
                      form={form}
                      installmentsLevel={installmentsLevel}
                      setInstallmentsLevel={setInstallmentsLevel}
                      paymentMode={paymentMode}
                      setPaymentMode={setPaymentMode}
                    />
                  </div>
                )}
              </Col>
            </Col>
          )}

          {idx && (
            <Col lg={24} xl={24} md={24} sm={24} xs={24}>
              <div className="overflow-y-auto" style={{ maxHeight: '600px' }}>
                {CourseID?.map((item, index) => (
                  <div className="mt-5" key={item?.id}>
                    <CourseCard
                      feeArray={item?.fees?.filter((fee) => fee?.feeAmount)}
                      CourseID={[CourseID]}
                      key={item?.productId}
                      id={item?.productId}
                      moduleId={moduleId}
                      setModuleId={setModuleId}
                      idxCourseModules={idxCourseModules}
                      setIdxCourseModules={setIdxCourseModules}
                      isAddOtherAddAdjustmentPresent={isAddOtherAddAdjustmentPresent}
                      setIsAddOtherAddAdjustmentPresent={setIsAddOtherAddAdjustmentPresent}
                      type={idx}
                      types={types}
                      checkIdx={checkIdx}
                      setCheckIdx={setCheckIdx}
                      courseEdit
                      addModule={addModule}
                      setAddModule={setAddModule}
                      courseDisplayName={item?.name}
                      courseCategoryName={item?.categoryName}
                      categoryId={item?.categoryId}
                      courseSubCategoryName={item?.subCategoryName}
                      subCategoryId={item?.subCategoryId}
                      courseModulesArray={item?.modules}
                      index={index}
                      form={form}
                      paymentMode={paymentMode}
                      setInstallmentsLevel={setInstallmentsLevel}
                      setPaymentMode={setPaymentMode}
                    />
                  </div>
                ))}
              </div>

              <Col lg={24} xl={24} md={24} sm={24} xs={24}>
                {checkIdx?.length > 0 && (
                  <div className="mt-5 bg-gray-100 border w-full">
                    <PaymentMode
                      form={form}
                      installmentsLevel={installmentsLevel}
                      setInstallmentsLevel={setInstallmentsLevel}
                      paymentMode={paymentMode}
                      setPaymentMode={setPaymentMode}
                    />
                  </div>
                )}
              </Col>
            </Col>
          )}
        </Row>
        <div className="flex justify-end ">
          <div
            style={{
              bottom: 0,
              //   position: "absolute",
              marginTop: 25,
              marginRight: 20,
            }}
            className="flex justify-end "
          >
            <Button
              size="large"
              onClick={() => {
                setShowDrawer(!showDrawer);
                if (type !== 'edit') form.resetFields();
              }}
              className="mr-4"
            >
              Cancel
            </Button>

            <Button type="primary" size="large" onClick={() => form.submit()}>
              Update
            </Button>
          </div>
        </div>
        <div className="my-5 text-md font-semibold">Activity logs</div>
        <div className="flex justify-between ">
          <span>
            Showing{' '}
            <span className="text-blue-600 pr-1">{studentActivity?.records?.length || 0}</span>
            of <span className="text-green-600">{studentActivity?.totalCount || 0}</span>
          </span>
        </div>

        <CheckValidation
          show={studentActivity?.records?.length > 0}
          fallback={
            <EmptyState
              emptyState={emptyStateSvg}
              emptyHeaderText={<span>No course have been upgraded yet!</span>}
            />
          }
        />
        <div className={`px-5 ${classes.TimeLineIcon}`}>
          <Timeline className="w-full">
            {studentActivity?.records?.map((rec) => (
              <>
                <Timeline.Item dot={getTimelineIcon()} key={rec?.ownerId}>
                  <div className="flex justify-between pl-6">
                    <div className="flex-wrap w-full">
                      <div className="flex justify-between">
                        <div>
                          <span className="font-semibold text-blue-600">
                            {rec?.author?.displayName}
                          </span>{' '}
                          <span>{rec?.description}</span>
                        </div>
                        <div>
                          <div className="text-right text-gray-400">
                            <div className="text-xs italic text-gray-800">
                              {dayjs(rec?.startTime).fromNow()}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">
                        <p className="m-0">
                          {dayjs(rec?.startTime).format('MMM D, YYYY')} at{' '}
                          {dayjs(rec?.startTime).format('h:mm A')}
                        </p>
                      </div>
                      <div className="w-full rich text-container-div">
                        {ReactHtmlParser(rec?.dataDescription)}
                      </div>
                    </div>
                  </div>
                </Timeline.Item>
              </>
            ))}
          </Timeline>
        </div>
      </Form>
    </div>
  );
};

export default connect(({ leads, student, courses, common, user, batch }) => ({
  studentDetails: student?.studentDetails,
  getStudentCourses: student?.getStudentCourses,
  courseDetails: student?.courseDetails,
  currentUser: user.currentUser,
  editLead: leads.editLead,
  allCourses: courses.allCourses,
  getCoursesCategory: courses?.getCoursesCategory,
  getCoursesSubCategory: courses?.getCoursesSubCategory,
  getCoursesFromSubCategory: courses?.getCoursesFromSubCategory,
  batchRecord: batch?.batchRecord,
  studentActivity: student?.getStudentOwnerActivity,
  countries: common.countriesList,
}))(UpgradeCourse);
