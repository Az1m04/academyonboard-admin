import React, { useEffect } from 'react';
import {
  Form,
  Button,
  Modal,
  Row,
  Col,
  Select,
  Input,
  Avatar,
  Divider,
  Spin,
  message,
  Popconfirm,
} from 'antd';
import { connect, history } from 'umi';
import LeadCoursesAndModules from '../CourseDetails/LeadCoursesAndModules';
import styles from './index.less';
import classNames from 'classnames';
import { getInitials } from '@/utils/common';
import { CloseOutlined, PhoneFilled } from '@ant-design/icons';
import PhoneNumber from '@/components/PhoneNumber';

const ModalToRenderServices = ({
  modalOnClose,
  purposeList,
  setIsServicesModalVisible,
  purposeChangeHandler,
  Styles,
  setPurposeChange,
  purposeChange,
  form,
  courseList,
  setCourseList,
  feePaymentLangSet,
  setFeePaymentLangSet,
  getValues,
  visaCategory,
  setVisaCategory,
  displayOtherVisaDropBox,
  setDisplayOtherVisaDropBox,
  visaOption,
  setVisaOption,
  displayServicesDropBox,
  setDisplayServicesDropBox,
  selectedService,
  setSelectedService,
  referenceBy,
  isServicesModalVisible,
  dispatch,
  otherVisaSetting,
  setOtherVisaSetting,
  countries,
  otherServiceOn,
  setOtherServiceOn,
  getCoursesCategory,
  moduleFieldSize,
  setModuleFieldSize,
  setIsAddModule,
  isAddModule,
  coursesSubCategory,
  setCoursesSubCategory,
  coursesFromSubCategory,
  setCoursesFromSubCategory,
  loadingCategory,
  loadingSub,
  loadingCourse,
  modalForm,
}) => {
  useEffect(() => {
    getValues();
  }, [modalForm, getValues]);
  const [isPhoneNumberExit, setIsPhoneNumberExit] = React.useState(false);
  const [populateData, setPopulateData] = React.useState(null);
  const visaDetailsChange = (value) => {
    setVisaCategory(value);
    setDisplayOtherVisaDropBox(false);
    setVisaOption([]);
    modalForm.setFieldsValue({
      visa_category: undefined,
      category_other: undefined,
      country: undefined,
      otherVisaCategory: undefined,
    });
  };
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

  const otherVisaServices = (val) => {
    setVisaOption(val);
    modalForm.setFieldsValue({
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

  if (otherVisaSetting) {
    modalForm.setFieldsValue({
      otherVisaCategory: 'OTHER_VISA',
    });
  }

  useEffect(() => {
    if (visaCategory) {
      modalForm.setFieldsValue({
        visa: visaCategory,
      });
    }
    if (visaOption) {
      modalForm.setFieldsValue({
        visa_category: visaOption,
      });
    }
  }, [visaOption, modalForm, visaCategory]);

  const prefixCategorySelector = (
    <Form.Item name="otherVisaCategory" initialValue="OTHER_VISA" style={{ margin: '0' }}>
      <Select
        showSearch
        size="large"
        style={{ width: '110px' }}
        className={classNames(styles?.selectStyling)}
        placeholder="Enter other visa category"
        getPopupContainer={(node) => node.parentNode}
        onSelect={(val) => {
          if (val === 'OTHER_VISA') {
            setDisplayOtherVisaDropBox(true);
          } else {
            setDisplayOtherVisaDropBox(false);
            modalForm.setFieldsValue({
              category_other: '',
            });
          }
        }}
        onChange={(value) => setVisaOption(value)}
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

  const serviceSelection = (value) => {
    setSelectedService(value);
    modalForm.setFieldsValue({
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

  if (otherServiceOn) {
    modalForm.setFieldsValue({
      otherServices: 'OTHERS',
    });
  }

  useEffect(() => {
    modalForm.setFieldsValue({
      service_category: selectedService,
    });
  }, [selectedService, modalForm]);

  const prefixServiceSelector = (
    <Form.Item name="otherServices" initialValue="OTHERS" style={{ margin: '0' }}>
      <Select
        showSearch
        style={{ width: '110px', paddingLeft: 10 }}
        className={classNames(styles?.selectStyling)}
        placeholder="Enter other computer course"
        getPopupContainer={(node) => node.parentNode}
        onSelect={(val) => {
          if (val === 'OTHERS') {
            setDisplayServicesDropBox(true);
          } else {
            setDisplayServicesDropBox(false);
            modalForm?.setFieldsValue({
              service_Other: undefined,
            });
          }
        }}
        onChange={(value) => setSelectedService(value)}
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

  return (
    <div className={styles.modalOveride}>
      <Modal
        closeIcon={<CloseOutlined />}
        visible={isServicesModalVisible}
        onCancel={modalOnClose}
        width={isPhoneNumberExit ? 1000 : 500}
        maskClosable={false}
        footer={
          <div>
            <Button
              type="primary"
              htmlType="submit"
              onClick={() => {
                modalForm.submit();
              }}
            >
              Submit
            </Button>
          </div>
        }
        className={`rounded-lg ${Styles.modalHeaderStyle} ${styles.modalOveride}`}
        // mask={false}
        maskStyle={{
          backdropFilter: 'blur(3px)',
        }}
      >
        {isPhoneNumberExit ? (
          <div className="py-2  rounded-t-lg " style={{ borderRadius: '20px' }}>
            <div className="flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                fill="currentColor"
                className="bi bi-card-checklist text-blue-900 mt-1 mr-4 text-blue-900"
                viewBox="0 0 16 16"
              >
                <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z" />
                <path d="M7 5.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm-1.496-.854a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0zM7 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm-1.496-.854a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 0 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0z" />
              </svg>
              <div>
                <p className=" text-xl font-semibold text-blue-900 capitalize">Services</p>
                <p className="text-sm font-normal text-gray-800 my-2">
                  Select services to be taken by lead
                </p>
              </div>
            </div>
            <Divider style={{ margin: '0' }} />
          </div>
        ) : (
          <div className="py-2">
            <div className="flex py-2 ">
              <PhoneFilled className="mr-2 mt-1" />
              <p className="font-medium  ">Please enter valid mobile number</p>
            </div>
            <Divider style={{ margin: '0' }} />
          </div>
        )}
        <Form
          form={modalForm}
          onFinish={(value) => {
            const courses = courseList?.map((need) => {
              return {
                productId: need?.productId,
                courseCategory: need?.courseCategory,
                categoryId: need?.categoryId,
                subCategoryId: need?.subCategoryId,
                subCourseCategory: need?.subCourseCategory,
                addModulesCheckbox: value?.items?.find(
                  (item) => item?.productId === need?.productId,
                )?.addModulesCheckbox,
                displayName: need?.displayName,
                modulesList: value?.items?.find((item) => item?.productId === need?.productId)
                  ?.modulesList,
                courseModulesArray: need?.courseModulesArray?.map((val) => {
                  return { ...val, displayName: val?.displayName };
                }),
              };
            });

            form.setFieldsValue({
              ...value,
              items: courses,
            });
            setIsAddModule(
              value?.items?.map((item, i) => ({
                addModulesCheckbox: item?.addModulesCheckbox,
                id: i,
              })),
            );
            setIsServicesModalVisible(false);
          }}
        >
          <Spin spinning={Boolean(loadingCategory || loadingSub || loadingCourse)}>
            <Row gutter={12}>
              <Col
                xl={isPhoneNumberExit ? 12 : 24}
                lg={isPhoneNumberExit ? 12 : 24}
                md={isPhoneNumberExit ? 12 : 24}
                sm={24}
                xs={24}
              >
                <Popconfirm
                  title="Do you want to add this lead to the existing lead?"
                  onConfirm={() => {
                    history.push(`/leads/students/leads/${populateData}/profile/${'enquiry'}`);
                  }}
                  onCancel={() => {
                    history.push(`/leads/students/leads/all`);
                  }}
                  visible={populateData}
                  okText="Open"
                  cancelText="Cancel"
                >
                  <p className="font-medium text-gray-800 ">Phone</p>
                </Popconfirm>
                <PhoneNumber
                  countryCode={['phone', 'countryCode']}
                  rules={[
                    {
                      required: true,
                      message: "Phone number can't be blank",
                      min: 10,
                      len: 10,
                    },
                    () => ({
                      // eslint-disable-next-line consistent-return
                      validator(_, value) {
                        const reg = new RegExp('^[0-9]+$');
                        if (value) {
                          if (value.length < 10) {
                            setIsPhoneNumberExit(false);
                            setPopulateData(null);
                          }
                          if (reg.test(value) && value.length >= 10) {
                            const body = {};
                            body.areaCode = value?.split('')?.slice(0, 3)?.join('');
                            body.phone = value?.split('')?.slice(3)?.join('');
                            body.countryCode = `${modalForm.getFieldValue('phone')?.countryCode}`;
                            return (
                              dispatch({
                                type: 'leads/checkIsPhoneNumberExists',
                                payload: {
                                  body,
                                },
                              })
                                // eslint-disable-next-line consistent-return
                                .then((res) => {
                                  if (res?.alreadyExist) {
                                    setPopulateData(res?.party?.id);

                                    return Promise.reject(
                                      new Error(`${'phone number already exists'}`),
                                    );
                                  }
                                  if (!res?.alreadyExist) {
                                    setIsPhoneNumberExit(true);
                                    return Promise.resolve();
                                  }
                                })
                                .catch((err) => {
                                  if (err?.status === 404) {
                                    message.error('something went wrong with phone number');
                                  }
                                  return Promise.reject(new Error(`${err}`));
                                })
                            );
                          }
                        }
                      },
                    }),
                  ]}
                  form={modalForm}
                  name={['phone', 'phone']}
                  placeholder="#####-#####"
                />
              </Col>
              {isPhoneNumberExit && (
                <>
                  <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                    <p className="font-medium text-gray-800 ">Purpose</p>
                    <Form.Item
                      name="lookingFor"
                      rules={[{ required: true, message: 'Please enter purpose' }]}
                    >
                      <Select
                        size="large"
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

                  {purposeChange?.includes('Courses') && (
                    <>
                      <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                        <p className="font-medium text-gray-800">Course category</p>
                        <Form.Item
                          name={'courseCategory'}
                          rules={[
                            {
                              required: true,
                              message: 'Please select the course category',
                            },
                          ]}
                        >
                          <Select
                            size="large"
                            mode="tags"
                            placeholder={'Please list down the course category'}
                            style={{ width: '100%' }}
                            getPopupContainer={(node) => node.parentNode}
                            onChange={(val) => {
                              let initialCoursesFromCategory =
                                modalForm?.getFieldValue('language_course_category') || [];
                              let initialSubCat =
                                modalForm?.getFieldValue('subCourseCategory') || [];

                              let initialCourses = modalForm?.getFieldValue('items') || [];
                              if (initialSubCat?.length < val?.length) {
                                dispatch({
                                  type: 'courses/getCoursesSubCategory',
                                  payload: {
                                    query: { categoryId: val?.join(',') },
                                  },
                                }).then((res) => {
                                  if (res?.status === 'ok') {
                                    setCoursesSubCategory(res?.records);
                                  }
                                });
                              } else {
                                initialSubCat = coursesSubCategory?.filter((data) =>
                                  val?.includes(data?.categoryId),
                                );
                                initialCoursesFromCategory = coursesFromSubCategory?.filter(
                                  (data) => val?.includes(data?.categoryId),
                                );
                                const newCourses = modalForm.getFieldValue(
                                  'language_course_category',
                                );
                                const newCoursesForSetInForm = initialCoursesFromCategory?.filter(
                                  (item) => newCourses.includes(item?.id),
                                );
                                setCoursesSubCategory(initialSubCat);

                                modalForm.setFieldsValue({
                                  language_course_category: newCoursesForSetInForm?.map(
                                    (item) => item?.id,
                                  ),
                                });

                                setCoursesFromSubCategory(initialCoursesFromCategory);

                                if (modalForm?.getFieldValue('items')?.length > 0) {
                                  initialCourses = initialCourses?.filter((data) =>
                                    val?.includes(data?.categoryId),
                                  );
                                  modalForm?.setFieldsValue({
                                    items: initialCourses,
                                  });

                                  setCourseList(initialCourses);
                                }
                                const newSubCategory = modalForm.getFieldValue('subCourseCategory');

                                const subCategoryForMap = initialSubCat?.filter((vale) =>
                                  newSubCategory.includes(vale?.subCategoryId),
                                );
                                modalForm.setFieldsValue({
                                  subCourseCategory: subCategoryForMap?.map(
                                    (item) => item?.subCategoryId,
                                  ),
                                });
                              }
                            }}
                          >
                            {getCoursesCategory?.records?.map((cat) => (
                              <Select.Option value={cat?.categoryId} key={cat?.categoryId}>
                                {cat?.categoryName}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                    </>
                  )}

                  {coursesSubCategory?.length > 0 && (
                    <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                      <p className="font-medium text-gray-800">Course sub category</p>
                      <Form.Item
                        name={'subCourseCategory'}
                        rules={[
                          {
                            required: true,
                            message: 'Please select atleast one sub category',
                          },
                        ]}
                      >
                        <Select
                          size="large"
                          placeholder={'Please list down course sub categories'}
                          mode="tags"
                          style={{ width: '100%' }}
                          getPopupContainer={(node) => node.parentNode}
                          onChange={(val) => {
                            let initialCoursesFromCategory =
                              modalForm?.getFieldValue('language_course_category') || [];
                            let initialCourses = modalForm?.getFieldValue('items') || [];

                            if (initialCoursesFromCategory?.length < val?.length) {
                              dispatch({
                                type: 'courses/getCoursesFromSubCategory',
                                payload: {
                                  query: { categoryId: val.join(',') },
                                },
                              }).then((res) => {
                                if (res?.status === 'ok') {
                                  setCoursesFromSubCategory(res?.records);
                                }
                              });
                            } else {
                              initialCoursesFromCategory = coursesFromSubCategory?.filter((data) =>
                                val?.includes(data?.subCategoryId),
                              );

                              modalForm.setFieldsValue({
                                language_course_category: initialCoursesFromCategory?.map(
                                  (item) => item?.id,
                                ),
                              });
                              setCoursesFromSubCategory(initialCoursesFromCategory);

                              if (modalForm?.getFieldValue('items')?.length > 0) {
                                initialCourses = initialCourses?.filter((data) =>
                                  val?.includes(data?.subCategoryId),
                                );
                                modalForm?.setFieldsValue({
                                  items: initialCourses,
                                });

                                setCourseList(initialCourses);
                              }
                            }
                          }}
                        >
                          {coursesSubCategory?.map((item) => (
                            <Select.Option value={item?.subCategoryId} key={item?.subCategoryId}>
                              {item?.subCategoryName}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  )}
                  {coursesFromSubCategory?.length > 0 && (
                    <Col
                      lg={
                        purposeChange?.includes('Visa') || purposeChange?.includes('Others')
                          ? 8
                          : 12
                      }
                      xl={
                        purposeChange?.includes('Visa') || purposeChange?.includes('Others')
                          ? 8
                          : 12
                      }
                      md={12}
                      sm={24}
                      xs={24}
                    >
                      <p className="font-medium text-gray-800">Courses</p>
                      <Form.Item
                        name="language_course_category"
                        rules={[
                          {
                            required: true,
                            message: 'Please select atleast one course',
                          },
                        ]}
                      >
                        <Select
                          size="large"
                          mode="tags"
                          placeholder="Please list down the courses"
                          style={{ width: '100%' }}
                          getPopupContainer={(node) => node.parentNode}
                          onChange={(value) => {
                            setFeePaymentLangSet(true);

                            let initialCourses = modalForm?.getFieldValue('items') || [];

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
                                    courseCategory: res?.categoryName,
                                    categoryId: res?.categoryId,
                                    subCategoryId: res?.subCategoryId,
                                    subCourseCategory: res?.subCategoryName,
                                    displayName: res?.displayName,
                                    courseModulesArray: res?.courseModules,
                                  };

                                  initialCourses = [...initialCourses, newCourse];

                                  modalForm.setFieldsValue({
                                    items: initialCourses,
                                  });
                                  setCourseList(initialCourses);
                                }
                              });
                            } else {
                              initialCourses = initialCourses?.filter((data) =>
                                value?.includes(data?.productId),
                              );

                              modalForm?.setFieldsValue({
                                items: initialCourses,
                              });

                              setCourseList(initialCourses);
                            }
                          }}
                        >
                          {coursesFromSubCategory?.map((item) => (
                            <Select.Option value={item?.id} key={item?.id}>
                              {item?.displayName}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  )}
                  {purposeChange?.includes('Visa') && (
                    <Col lg={8} xl={8} md={12} sm={24} xs={24}>
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
                          size="large"
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
                    visaCategory?.includes('VISITOR_VISA') ||
                    visaOption?.includes('IMMIGRATION')) && (
                    <Col lg={8} xl={8} md={12} sm={24} xs={24}>
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
                            size="large"
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
                  {purposeChange?.includes('Visa') &&
                    visaCategory?.includes('OTHER_VISA_SERVICES') && (
                      <Col lg={8} xl={8} md={12} sm={24} xs={24}>
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
                                size="large"
                                placeholder="Please select the category"
                                style={{ width: '100%' }}
                                getPopupContainer={(node) => node.parentNode}
                                onChange={otherVisaServices}
                                onSelect={(val) => {
                                  if (val === 'OTHER_VISA') {
                                    setVisaOption([]);
                                    setOtherVisaSetting(true);
                                    setDisplayOtherVisaDropBox(true);
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
                                size="large"
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
                    <Col lg={12} xl={12} md={12} sm={24} xs={24}>
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
                              size="large"
                              placeholder="Please select the service category"
                              style={{ width: '100%' }}
                              getPopupContainer={(node) => node.parentNode}
                              onSelect={(val) => {
                                if (val === 'OTHERS') {
                                  setSelectedService('');
                                  setOtherServiceOn(true);
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
                              size="large"
                              className="w-full"
                              addonBefore={prefixServiceSelector}
                              placeholder="Please enter service category"
                            />
                          </Form.Item>
                        </>
                      )}
                    </Col>
                  )}

                  {selectedService?.includes('MEETING_WITH') && (
                    <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                      <>
                        <p className="font-medium text-gray-800">Select name of employee</p>
                        <Form.Item name="emp_name">
                          <Select
                            size="large"
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
            </Row>
            {feePaymentLangSet && (
              <div className={`${courseList?.length > 2 && 'overflow-auto h-80'}`}>
                {courseList?.map((item, index) => (
                  <div className="mt-5 " key={item?.id}>
                    <LeadCoursesAndModules
                      courseList={courseList}
                      key={item?.productId}
                      id={item?.productId}
                      index={index}
                      courseDisplayName={item?.displayName}
                      form={modalForm}
                      courseModulesArray={item?.courseModulesArray}
                      moduleFieldSize={moduleFieldSize}
                      setModuleFieldSize={setModuleFieldSize}
                      checkBoxMargin={20}
                      isAddModule={isAddModule}
                    />
                  </div>
                ))}
              </div>
            )}
          </Spin>
        </Form>
      </Modal>
    </div>
  );
};

export default connect(({ courses, common, loading }) => ({
  allCourses: courses?.allCourses,
  singleCourseDetail: courses?.singleCourseDetail,
  getCoursesCategory: courses?.getCoursesCategory,
  getCoursesSubCategory: courses?.getCoursesSubCategory,
  getCoursesFromSubCategory: courses?.getCoursesFromSubCategory,
  countries: common.countriesList,
  loadingCategory: loading?.effects['courses/getCoursesSubCategory'],
  loadingSub: loading?.effects['courses/getCoursesFromSubCategory'],
  loadingCourse: loading?.effects['courses/getCourseDetails'],
}))(ModalToRenderServices);
