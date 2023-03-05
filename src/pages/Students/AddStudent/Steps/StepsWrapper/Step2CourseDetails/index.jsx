import React, { useState } from 'react';
import { Form, Row, Col, Select, Divider, Spin } from 'antd';
import { connect } from 'umi';
import CourseModulesCard from '@/pages/Students/AddLead/CourseModulesCard';
import { currencyFormatter, decodeDollarsToDigits } from '@/utils/utils';
// import StudentVisaDetails from '../../../StudentVisaDetails';
// import StudentOtherServices from '../../../StudentOtherServices';
import Card from '@/components/Structure/Card';

const Step2CourseDetails = ({
  dispatch,
  onNextClick,
  courseDetailsForm,
  feesDetailsForm,
  currentStepForStudent,
  className,
  setPurposeChange,
  purposeChange,
  setCourseList,
  loadingForAddSubCategory,
  loadingForCourse,
  loadingForCourseDetails,
  // setVisaCategory,
  // setVisaOption,
  // setSelectedService,
  // setDisplayServicesDropBox,
  purpose,
  courseList,
  setInstallmentsLevel,
  setPaymentMode,
  feePaymentLangSet,
  setFeePaymentLangSet,
  // allCourses,
  resizePurposeDetails,
  setResizePurposeDetails,
  getCoursesCategory,
  setCoursesSubCategory,
  coursesSubCategory,
  coursesFromSubCategory,
  setCoursesFromSubCategory,

  // coursesSubCategory

  // Student visa details
  // getValues,
  // visaCategory,
  // displayOtherVisaDropBox,
  // setDisplayOtherVisaDropBox,
  // visaOption,
  // Student other services
  // displayServicesDropBox,

  // otherServicesChange,
  // setOtherServicesChange,
  // selectedService,
  // referenceBy,
}) => {
  const [changedFrequency, setChangedFrequency] = useState([]);
  const purposeChangeHandler = (e) => {
    if (e === 'Courses') {
      courseDetailsForm.setFieldsValue({
        courses: [],
        language_course_category: [],
      });
      courseDetailsForm.resetFields();
      feesDetailsForm.resetFields();
      setCourseList([]);
      setResizePurposeDetails([{ lg: 24 }, { xl: 24 }, { md: 24 }, { sm: 24 }, { xs: 24 }]);
    }
  };

  /* Needs confirmation from the client for the visa and other services */
  // if (e === 'Visa') {
  //   courseDetailsForm.setFieldsValue({
  //     visa: [],
  //     visa_category: [],
  //     category_other: [],
  //     country: [],
  //     other_country: [],
  //     otherCountryForAppliedVisa: [],
  //     otherVisaCategory: [],
  //   });
  //   setVisaCategory([]);
  //   setVisaOption([]);
  // }

  //   if (e === 'Others') {
  //     setSelectedService([]);
  //     setDisplayServicesDropBox(false);
  //     courseDetailsForm.setFieldsValue({
  //       service_category: [],
  //       service_Other: [],
  //       emp_name: [],
  //       otherServices: [],
  //     });
  //   }
  // };

  const onPurposeChange = (purposes) => {
    if (purposes.includes('Courses')) {
      setResizePurposeDetails([{ lg: 12 }, { xl: 12 }, { md: 12 }, { sm: 24 }, { xs: 24 }]);
    }
    setPurposeChange(purposes);
    setCoursesFromSubCategory([]);
    setCoursesSubCategory([]);
  };

  return (
    <div className={className} key={currentStepForStudent}>
      <Form
        hideRequiredMark
        size="large"
        form={courseDetailsForm}
        onFinish={() => {
          onNextClick();
        }}
        name="coursesForm"
      >
        <Spin
          spinning={Boolean(
            loadingForAddSubCategory || loadingForCourse || loadingForCourseDetails,
          )}
        >
          <div className="mt-5">
            <Card>
              <h2 className="p-5 text-base font-semibold text-gray-800">Course details</h2>
              <Divider style={{ margin: '0' }} />
              <div className="px-4 mt-4">
                <Row gutter={12}>
                  <Col
                    lg={resizePurposeDetails[0]?.lg}
                    xl={resizePurposeDetails[1]?.xl}
                    md={resizePurposeDetails[2]?.md}
                    sm={resizePurposeDetails[3].sm}
                    xs={resizePurposeDetails[4]?.xs}
                  >
                    <p className="font-medium text-gray-800">Select services</p>
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
                        onChange={onPurposeChange}
                      >
                        <Select.Option value="Courses" key="Courses">
                          Courses
                        </Select.Option>
                        <Select.Option value="Visa" key="Visa" disabled>
                          Visa
                        </Select.Option>
                        <Select.Option value="Others" key="Others" disabled>
                          Other Services
                        </Select.Option>
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
                                courseDetailsForm?.getFieldValue('language_course_category') || [];
                              let initialSubCat =
                                courseDetailsForm?.getFieldValue('subCourseCategory') || [];

                              let initialCourses = courseDetailsForm?.getFieldValue('items') || [];
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
                                const newCourses = courseDetailsForm.getFieldValue(
                                  'language_course_category',
                                );

                                initialCoursesFromCategory = coursesFromSubCategory?.filter(
                                  (data) => val?.includes(data?.categoryId),
                                );

                                const newCoursesForSetInForm = initialCoursesFromCategory?.filter(
                                  (item) => newCourses.includes(item?.id),
                                );
                                setCoursesSubCategory(initialSubCat);

                                courseDetailsForm.setFieldsValue({
                                  language_course_category: newCoursesForSetInForm?.map(
                                    (ite) => ite?.id,
                                  ),
                                });

                                setCoursesFromSubCategory(initialCoursesFromCategory);

                                if (courseDetailsForm?.getFieldValue('items')?.length > 0) {
                                  initialCourses = initialCourses?.filter((data) =>
                                    val?.includes(data?.categoryId),
                                  );
                                  courseDetailsForm?.setFieldsValue({
                                    items: initialCourses,
                                  });

                                  setCourseList(initialCourses);
                                }

                                const newSubCategory = courseDetailsForm.getFieldValue(
                                  'subCourseCategory',
                                );

                                const subCategoryForMap = initialSubCat?.filter((vale) =>
                                  newSubCategory.includes(vale?.subCategoryId),
                                );

                                courseDetailsForm.setFieldsValue({
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
                              courseDetailsForm?.getFieldValue('language_course_category') || [];
                            let initialCourses = courseDetailsForm?.getFieldValue('items') || [];

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
                              const newCourses = courseDetailsForm.getFieldValue(
                                'language_course_category',
                              );
                              const newCoursesForSetInForm = initialCoursesFromCategory?.filter(
                                (item) => newCourses.includes(item?.id),
                              );
                              courseDetailsForm.setFieldsValue({
                                // language_course_category: initialCoursesFromCategory?.map(
                                //   (item) => item?.id,
                                // ),
                                language_course_category: newCoursesForSetInForm?.map(
                                  (ite) => ite.id,
                                ),
                              });
                              setCoursesFromSubCategory(initialCoursesFromCategory);

                              if (courseDetailsForm?.getFieldValue('items')?.length > 0) {
                                initialCourses = initialCourses?.filter((data) =>
                                  val?.includes(data?.subCategoryId),
                                );
                                courseDetailsForm?.setFieldsValue({
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
                      lg={resizePurposeDetails[0]?.lg}
                      xl={resizePurposeDetails[1]?.xl}
                      md={resizePurposeDetails[2]?.md}
                      sm={resizePurposeDetails[3].sm}
                      xs={resizePurposeDetails[4]?.xs}
                    >
                      <p className="font-medium text-gray-800">Courses</p>
                      <Form.Item
                        name="language_course_category"
                        rules={[
                          {
                            required: true,
                            message: 'Please select any course',
                          },
                        ]}
                      >
                        <Select
                          size="large"
                          mode="tags"
                          placeholder="Please select the category"
                          style={{ width: '100%' }}
                          getPopupContainer={(node) => node.parentNode}
                          onChange={(value) => {
                            if (purpose === 'Add student') {
                              setFeePaymentLangSet(true);
                            }

                            let initialCourses = courseDetailsForm?.getFieldValue('items') || [];
                            let initialItems = feesDetailsForm.getFieldValue('items') || [];

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

                                  if (feesDetailsForm?.getFieldValue(['feePayment', 'totalFees'])) {
                                    totalFees = Number(
                                      decodeDollarsToDigits(
                                        feesDetailsForm?.getFieldValue(['feePayment', 'totalFees']),
                                      ),
                                    );
                                    totalFees += Number(
                                      decodeDollarsToDigits(newCourse?.basicAmount),
                                    );
                                  } else {
                                    totalFees = Number(
                                      decodeDollarsToDigits(newCourse?.basicAmount),
                                    );
                                  }

                                  initialCourses = [...initialCourses, newCourse];
                                  initialItems = [...initialItems, newCourse];
                                  courseDetailsForm.setFieldsValue({
                                    items: initialCourses,
                                  });

                                  feesDetailsForm.setFieldsValue({
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

                              courseDetailsForm?.setFieldsValue({
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
                                setTotal -= Number(
                                  decodeDollarsToDigits(val?.adjustmentAmount || 0),
                                );
                              });

                              feesDetailsForm?.setFieldsValue({
                                items: newItems,
                                feePayment: { totalFees: currencyFormatter.format(setTotal) },
                              });

                              setCourseList(initialCourses);
                            }
                          }}
                        >
                          {coursesFromSubCategory?.map((item) => (
                            <Select.Option value={item?.id} key={item?.id}>
                              {item?.displayName || item?.name}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  )}
                </Row>
              </div>
            </Card>
            {purpose === 'Add student' && feePaymentLangSet && (
              <div>
                {courseList?.map((item, index) => (
                  <div className="mt-5" key={item?.id}>
                    <CourseModulesCard
                      feeArray={item?.fees?.filter((fee) => fee?.feeAmount)}
                      courseList={courseList}
                      key={item?.productId}
                      id={item?.productId}
                      index={index}
                      courseDisplayName={item?.displayName}
                      courseCategoryName={item?.courseCategory}
                      categoryId={item?.categoryId}
                      courseSubCategoryName={item?.subCourseCategory}
                      subCategoryId={item?.subCategoryId}
                      courseDetailsForm={courseDetailsForm}
                      feesDetailsForm={feesDetailsForm}
                      courseModulesArray={item?.courseModulesArray}
                      setInstallmentsLevel={setInstallmentsLevel}
                      setPaymentMode={setPaymentMode}
                      changedFrequency={changedFrequency}
                      setChangedFrequency={setChangedFrequency}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Needs confirmation from the client for the visa and other services */}

            {/* {purposeChange?.includes('Visa') && (
            <div className="mt-5">
              <Card>
                <h2 className="p-5 text-base font-semibold text-gray-800">Visa details</h2>
                <Divider style={{ margin: '0' }} />
                <Card.Section>
                  <StudentVisaDetails
                    courseDetailsForm={courseDetailsForm}
                    purpose={purpose}
                    getValues={getValues}
                    visaCategory={visaCategory}
                    setVisaCategory={setVisaCategory}
                    displayOtherVisaDropBox={displayOtherVisaDropBox}
                    setDisplayOtherVisaDropBox={setDisplayOtherVisaDropBox}
                    visaOption={visaOption}
                    setVisaOption={setVisaOption}
                  />
                </Card.Section>
              </Card>
            </div>
          )} */}
            {/* {purposeChange?.includes('Others') && (
            <div className="mt-5">
              <Card>
                <h2 className="p-5 text-base font-semibold text-gray-800">Other services</h2>
                <Divider style={{ margin: '0' }} />
                <Card.Section>
                  <StudentOtherServices
                    courseDetailsForm={courseDetailsForm}
                    purpose={purpose}
                    displayServicesDropBox={displayServicesDropBox}
                    setDisplayServicesDropBox={setDisplayServicesDropBox}
                    otherServicesChange={otherServicesChange}
                    setOtherServicesChange={setOtherServicesChange}
                    selectedService={selectedService}
                    setSelectedService={setSelectedService}
                    referenceBy={referenceBy}
                  />
                </Card.Section>
              </Card>
            </div>
          )} */}
          </div>
        </Spin>
      </Form>
    </div>
  );
};

export default connect(({ courses, loading }) => ({
  allCourses: courses?.allCourses,
  loadingForAddSubCategory: loading?.effects['courses/getCoursesSubCategory'],
  loadingForCourse: loading?.effects['courses/getCoursesFromSubCategory'],
  loadingForCourseDetails: loading?.effects['courses/getCourseDetails'],
  // coursesSubCategory:courses?.coursesSubCategory,
}))(Step2CourseDetails);
