import React from 'react';
import { Form, Row, Col, Select, Spin } from 'antd';
import { connect } from 'umi';
import LeadCoursesAndModules from './LeadCoursesAndModules';

const CourseDetails = ({
  dispatch,
  form,
  setCourseList,
  courseList,
  feePaymentLangSet,
  setFeePaymentLangSet,
  getCoursesCategory,
  isAddModule,
  coursesSubCategory,
  setCoursesSubCategory,
  coursesFromSubCategory,
  setCoursesFromSubCategory,
  loadingCategory,
  loadingSubCategory,
  loadingCourses,
}) => {
  return (
    <div className="mt-5">
      <div className="px-4">
        <Spin spinning={Boolean(loadingCategory || loadingSubCategory || loadingCourses)}>
          <Row gutter={12}>
            <Col lg={8} xl={8} md={12} sm={24} xs={24}>
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
                      form?.getFieldValue('language_course_category') || [];
                    let initialSubCat = form?.getFieldValue('subCourseCategory') || [];
                    let initialCourses = form?.getFieldValue('items') || [];
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

                      initialCoursesFromCategory = coursesFromSubCategory?.filter((data) =>
                        val?.includes(data?.categoryId),
                      );
                      setCoursesSubCategory(initialSubCat);

                      form.setFieldsValue({
                        language_course_category: initialCoursesFromCategory?.map(
                          (item) => item?.id,
                        ),
                      });

                      setCoursesFromSubCategory(initialCoursesFromCategory);

                      if (form?.getFieldValue('items')?.length > 0) {
                        initialCourses = initialCourses?.filter((data) =>
                          val?.includes(data?.categoryId),
                        );
                        form?.setFieldsValue({
                          items: initialCourses,
                        });

                        setCourseList(initialCourses);
                      }
                      form.setFieldsValue({
                        subCourseCategory: initialSubCat?.map((item) => item?.subCategoryId),
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
            {coursesSubCategory?.length > 0 && (
              <Col lg={8} xl={8} md={12} sm={24} xs={24}>
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
                        form?.getFieldValue('language_course_category') || [];
                      let initialCourses = form?.getFieldValue('items') || [];

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
                        form.setFieldsValue({
                          language_course_category: initialCoursesFromCategory?.map(
                            (item) => item?.id,
                          ),
                        });
                        setCoursesFromSubCategory(initialCoursesFromCategory);

                        if (form?.getFieldValue('items')?.length > 0) {
                          initialCourses = initialCourses?.filter((data) =>
                            val?.includes(data?.subCategoryId),
                          );
                          form?.setFieldsValue({
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
              <Col lg={8} xl={8} md={12} sm={24} xs={24}>
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

                      let initialCourses = form?.getFieldValue('items') || [];
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

                            form.setFieldsValue({
                              items: initialCourses,
                            });
                            setCourseList(initialCourses);
                          }
                        });
                      } else {
                        initialCourses = initialCourses?.filter((data) =>
                          value?.includes(data?.productId),
                        );

                        form?.setFieldsValue({
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
          </Row>
        </Spin>
      </div>

      {feePaymentLangSet && (
        <div>
          {courseList?.map((item, index) => (
            <div className="mt-5" key={item?.id}>
              <LeadCoursesAndModules
                courseList={courseList}
                key={item?.productId}
                id={item?.productId}
                index={index}
                courseDisplayName={item?.displayName}
                form={form}
                courseModulesArray={item?.courseModulesArray}
                checkBoxMargin={50}
                isAddModule={isAddModule}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default connect(({ courses, loading }) => ({
  allCourses: courses?.allCourses,
  getCoursesCategory: courses?.getCoursesCategory,
  getCoursesSubCategory: courses?.getCoursesSubCategory,
  getCoursesFromSubCategory: courses?.getCoursesFromSubCategory,
  loadingCategory: loading?.effects['courses/getCoursesSubCategory'],
  loadingSubCategory: loading?.effects['courses/getCoursesFromSubCategory'],
  loadingCourses: loading?.effects['courses/getCourseDetails'],
}))(CourseDetails);
