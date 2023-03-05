/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable no-const-assign */
/* eslint-disable react-hooks/exhaustive-deps */
import FixedFooter from '@/components/FixedFooter';
import Page from '@/components/Page';
import {
  Form,
  Row,
  Col,
  Input,
  Switch,
  Button,
  Checkbox,
  InputNumber,
  Radio,
  notification,
  Spin,
} from 'antd';
import React, { useState, useEffect } from 'react';
import { connect, history, useParams } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import { currencyFormatter, currencyParser, decodeDollarsToDigits } from '@/utils/utils';
import styles from './index.less';
import Breadcrumbs from '@/components/BreadCrumbs';

const { TextArea } = Input;

const AddCourse = ({ dispatch, loadingCourse, addingCourse }) => {
  const [form] = Form.useForm();
  // eslint-disable-next-line no-unused-vars
  const [allValues, setAllValues] = useState(null);
  const { courseId, particularViewCourseId } = useParams();
  const feeList = [
    {
      name: 'Daywise fees',
      value: 'daywise',
      attrName: 'daywiseFees',
    },
    {
      name: 'Weekly fees',
      value: 'weekly',
      attrName: 'weeklyFees',
    },
    {
      name: 'Monthly fees',
      value: 'monthly',
      attrName: 'monthlyFees',
    },
    {
      name: 'Quarterly fees',
      value: 'quaterly',
      attrName: 'quaterlyFees',
    },
    {
      name: 'Semester fees',
      value: 'semester',
      attrName: 'semesterFees',
    },
    {
      name: 'Yearly fees',
      value: 'yearly',
      attrName: 'yearlyFees',
    },
  ];

  const courseDetails = [
    {
      id: 'LANGUAGE',
      value: 'Language',
    },
    {
      id: 'COMPUTER',
      value: 'Computer',
    },
    {
      id: 'OTHER_COURSE',
      value: 'Other',
    },
  ];
  const onFinish = (values) => {
    if (values?.isModule) {
      // check for fee in all modules
      if (
        values?.isFeeModuleWise === 'TRUE_' &&
        Object.values(values?.moduleWise)?.filter((val) => val)?.length === 0
      ) {
        notification.error({
          message: 'Fee not provided!',
          description: 'Please add at least one type of module fee',
        });
        return;
      }
      if (
        values?.isFeeModuleWise === 'FALSE_' &&
        values?.courseModules?.filter((module_) => {
          return (
            module_?.daywise ||
            module_?.weekly ||
            module_?.monthly ||
            module_?.quaterly ||
            module_?.semester?.yearly
          );
        })?.length === 0
      ) {
        notification.error({
          message: 'Fee not provided for all modules!',
          description: 'Please add at least one type of module fee for all modules',
        });
        return;
      }
    }
    const feeModules = values?.courseModules?.map((module_) => {
      let fees = [];
      if ((module_?.daywise || values?.moduleWise?.daywise) && module_?.daywiseFees) {
        fees = fees.concat({
          feeAmount: parseFloat(decodeDollarsToDigits(module_?.daywiseFees)),
          feeDurationId: 'TF_day',
        });
      }
      if ((module_?.weekly || values?.moduleWise?.weekly) && module_?.weeklyFees) {
        fees = fees.concat({
          feeAmount: parseFloat(decodeDollarsToDigits(module_?.weeklyFees)),
          feeDurationId: 'TF_wk',
        });
      }
      if ((module_?.monthly || values?.moduleWise?.monthly) && module_?.monthlyFees) {
        fees = fees.concat({
          feeAmount: parseFloat(decodeDollarsToDigits(module_?.monthlyFees)),
          feeDurationId: 'TF_mon',
        });
      }
      if ((module_?.quaterly || values?.moduleWise?.quaterly) && module_?.quaterlyFees) {
        fees = fees.concat({
          feeAmount: parseFloat(decodeDollarsToDigits(module_?.quaterlyFees)),
          feeDurationId: 'TF_qr',
        });
      }

      if ((module_?.semester || values?.moduleWise?.semester) && module_?.semesterFees) {
        fees = fees.concat({
          feeAmount: parseFloat(decodeDollarsToDigits(module_?.semesterFees)),
          feeDurationId: 'TF_sm',
        });
      }
      if ((module_?.yearly || values?.moduleWise?.yearly) && module_?.yearlyFees) {
        fees = fees.concat({
          feeAmount: parseFloat(decodeDollarsToDigits(module_?.yearlyFees)),
          feeDurationId: 'TF_yr',
        });
      }
      const item = {
        name: module_?.name,
        showModuleInReciept: module_?.showModulesInReceipt,
        fees,
        dailyTestMarks: module_?.dailyTestMarks,
        mockTestMarks: module_?.mockTestMarks,
        isAttendance: module_?.isAttendance,
      };
      if (values?.isMarkingTestDaily) {
        item.dailyTestMarksEnteredById = module_?.dailyTestMarksEnteredById;
        item.dailyTestMarks = module_.dailyTestMarks;
      }
      if (values?.isMarkingTestMock) {
        item.mockTestMarksEnteredById = module_?.mockTestMarksEnteredById;
        item.mockTestMarks = module_.mockTestMarks;
      }
      return item;
    });
    // feesModules.fees

    let courseFees = [];

    if (values?.courseFees?.daywiseFees) {
      courseFees = courseFees.concat({
        feeAmount: parseFloat(decodeDollarsToDigits(values.courseFees.daywiseFees)),
        feeDurationId: 'TF_day',
      });
    }
    if (values?.courseFees?.weeklyFees) {
      courseFees = courseFees.concat({
        feeAmount: parseFloat(decodeDollarsToDigits(values.courseFees.weeklyFees)),
        feeDurationId: 'TF_wk',
      });
    }
    if (values?.courseFees?.monthlyFees) {
      courseFees = courseFees.concat({
        feeAmount: parseFloat(decodeDollarsToDigits(values.courseFees.monthlyFees)),
        feeDurationId: 'TF_mon',
      });
    }
    if (values?.courseFees?.quaterlyFees) {
      courseFees = courseFees.concat({
        feeAmount: parseFloat(decodeDollarsToDigits(values.courseFees.quaterlyFees)),
        feeDurationId: 'TF_qr',
      });
    }
    if (values?.courseFees?.semesterFees) {
      courseFees = courseFees.concat({
        feeAmount: parseFloat(decodeDollarsToDigits(values.courseFees.semesterFees)),
        feeDurationId: 'TF_sm',
      });
    }
    if (values?.courseFees?.yearlyFees) {
      courseFees = courseFees.concat({
        feeAmount: parseFloat(decodeDollarsToDigits(values.courseFees.yearlyFees)),
        feeDurationId: 'TF_yr',
      });
    }
    if (courseFees?.length === 0) {
      notification.error({
        message: 'Course fee not provided!',
        description: 'Please add at least one type of course fee',
      });
      form.scrollToField(['daywise']);
      return;
    }
    console.log(`values`, values);
    const body = {
      name: values.name,
      categoryName: values.categoryName,
      subCategoryName: values.subCategoryName,
      isFeeModuleWise: values.isFeeModuleWise === 'TRUE_',
      courseModules: feeModules,
      taxInvoice: values.taxInvoice,
      isAttendance: values?.isAttendance,
      fees: courseFees,
      description: values.description,
      longDescription: values.longDescription,
      isPassportRequired: values?.isPassportRequired,
      assignAssessTest: values?.assignAssessTest,
    };
    if (!values?.isModule && values?.isMarkingTestDaily) {
      body.dailyTestMarksEnteredById = values?.dailyTestMarksEnteredById;
      body.dailyTestMarks = values.dailyTestMarks;
    }
    if (!values?.isModule && values?.isMarkingTestMock) {
      body.mockTestMarksEnteredById = values?.mockTestMarksEnteredById;
      body.mockTestMarks = values.mockTestMarks;
    }
    if (courseId) {
      dispatch({
        type: 'courses/editCourse',
        payload: {
          body,
          pathParams: { courseId },
        },
      })
        .then((res) => {
          if (res) {
            notification.success({
              message: 'Course updated successfully!',
              duration: 3,
            });
            history.push('/courses/all');
          }
        })
        .catch(() => {
          // log error silently
        });
    } else {
      dispatch({
        type: 'courses/addCourse',
        payload: {
          body,
        },
      })
        .then((res) => {
          if (res) {
            notification.success({
              message: 'Course added successfully!',
              duration: 3,
            });
            history.push('/courses/all');
          }
        })
        .catch(() => {
          // log error silently
        });
    }
  };
  const searchTypeOfFee = (feeArr, typeOfFee) =>
    feeArr?.findIndex((feeItem) => feeItem?.feeDurationId === typeOfFee);

  const checkIfAnyModuleFeetypeIsChcked = () => {
    return (
      form.getFieldValue('moduleWise') &&
      Object.values(form.getFieldValue('moduleWise'))?.filter((val) => val)?.length > 0
    );
  };

  const calculateFee = (module_, feeType) => {
    const daywise = Number(decodeDollarsToDigits(module_?.daywiseFees));
    const weekwise = Number(decodeDollarsToDigits(module_?.weeklyFees));
    const monthly = Number(decodeDollarsToDigits(module_?.monthlyFees));
    const quaterly = Number(decodeDollarsToDigits(module_?.quaterlyFees));
    const semster = Number(decodeDollarsToDigits(module_?.semesterFees));
    const yearly = Number(decodeDollarsToDigits(module_?.yearlyFees));
    switch (feeType.value) {
      case 'daywise':
        return (
          daywise ||
          (weekwise / 7).toFixed(2) ||
          (monthly / 30).toFixed(2) ||
          (quaterly / 90).toFixed(2) ||
          (semster / 180).toFixed(2) ||
          (yearly / 365).toFixed(2)
        );
      case 'weekly':
        return (
          weekwise ||
          daywise * 7 ||
          (monthly / 4).toFixed(2) ||
          (quaterly / 12).toFixed(2) ||
          (semster / 24).toFixed(2) ||
          (yearly / 54).toFixed(2)
        );
      case 'monthly':
        return (
          monthly ||
          daywise * 30 ||
          weekwise * 4.2 ||
          (quaterly / 3).toFixed(2) ||
          (semster / 6).toFixed(2) ||
          (yearly / 12).toFixed(2)
        );
      case 'quaterly':
        return (
          quaterly ||
          daywise * 90 ||
          weekwise * 12.8 ||
          monthly * 3 ||
          (semster / 2).toFixed(2) ||
          (yearly / 4).toFixed(2)
        );
      case 'semester':
        return (
          semster ||
          daywise * 180 ||
          weekwise * 25.5 ||
          6 * monthly ||
          quaterly * 2 ||
          (yearly / 2).toFixed(2)
        );
      case 'yearly':
        return (
          yearly || daywise * 365 || weekwise * 54 || monthly * 12 || quaterly * 4 || semster * 2
        );
      default:
        return 0;
    }
  };

  useEffect(() => {
    if (courseId || particularViewCourseId) {
      dispatch({
        type: 'courses/getCourseDetails',
        payload: {
          pathParams: {
            courseId: courseId || particularViewCourseId,
          },
        },
      })
        .then((res) => {
          const idxOfFeeByDayCourse = searchTypeOfFee(res?.fees, 'TF_day');
          const idxOfFeeByWeekCourse = searchTypeOfFee(res?.fees, 'TF_wk');
          const idxOfFeeByQuaterCourse = searchTypeOfFee(res?.fees, 'TF_qr');
          const idxOfFeeBySemesterCourse = searchTypeOfFee(res?.fees, 'TF_sm');
          const idxOfFeeByYearCourse = searchTypeOfFee(res.fees, 'TF_yr');
          const idxOfFeeByMonCourse = searchTypeOfFee(res.fees, 'TF_mon');
          let isMarkingTestDaily = '';
          let isMarkingTestMock = '';
          if (res?.courseModules?.length > 0) {
            // check for marks in modules;
            isMarkingTestDaily =
              res?.courseModules?.findIndex((module_) => module_?.dailyTestMarks) !== -1;
            isMarkingTestMock =
              res?.courseModules?.findIndex((module_) => module_?.mockTestMarks) !== -1;
          } else {
            // check for marks outside modules
            isMarkingTestDaily = res?.hasOwnProperty('dailyTestMarks');
            isMarkingTestMock = res?.hasOwnProperty('mockTestMarks');
          }

          form.setFieldsValue({
            ...res,
            name: res?.displayName,
            isMarkingTestDaily,
            isMarkingTestMock,
            daywise: idxOfFeeByDayCourse !== -1,
            weekly: idxOfFeeByWeekCourse !== -1,
            quaterly: idxOfFeeByQuaterCourse !== -1,
            semester: idxOfFeeBySemesterCourse !== -1,
            yearly: idxOfFeeByYearCourse !== -1,
            monthly: idxOfFeeByMonCourse !== -1,
            courseFees: {
              daywiseFees:
                idxOfFeeByDayCourse !== -1
                  ? currencyFormatter.format(res?.fees[idxOfFeeByDayCourse]?.feeAmount)
                  : undefined,
              weeklyFees:
                idxOfFeeByWeekCourse !== -1
                  ? currencyFormatter.format(res?.fees[idxOfFeeByWeekCourse]?.feeAmount)
                  : undefined,
              quaterlyFees:
                idxOfFeeByQuaterCourse !== -1
                  ? currencyFormatter.format(res?.fees[idxOfFeeByQuaterCourse]?.feeAmount)
                  : undefined,
              monthlyFees:
                idxOfFeeByMonCourse !== -1
                  ? currencyFormatter.format(res?.fees[idxOfFeeByMonCourse]?.feeAmount)
                  : undefined,
              semesterFees:
                idxOfFeeBySemesterCourse !== -1
                  ? currencyFormatter.format(res?.fees[idxOfFeeBySemesterCourse]?.feeAmount)
                  : undefined,
              yearlyFees:
                idxOfFeeByYearCourse !== -1
                  ? currencyFormatter.format(res?.fees[idxOfFeeByYearCourse]?.feeAmount)
                  : undefined,
            },
            needCategory: Boolean(res?.categoryName),
            needSubCategory: Boolean(res?.subCategoryName),
            isModule: res?.courseModules?.length > 0,
            isFeeModuleWise: res?.isFeeModuleWise ? 'TRUE_' : 'FALSE_',
            courseModules: res?.courseModules?.map((module_) => {
              const idxOfFeeByDay = searchTypeOfFee(module_?.fees, 'TF_day');
              const idxOfFeeByWeek = searchTypeOfFee(module_?.fees, 'TF_wk');
              const idxOfFeeByQuater = searchTypeOfFee(module_?.fees, 'TF_qr');
              const idxOfFeeBySemester = searchTypeOfFee(module_?.fees, 'TF_sm');
              const idxOfFeeByYear = searchTypeOfFee(module_?.fees, 'TF_yr');
              const idxOfFeeByMon = searchTypeOfFee(module_?.fees, 'TF_mon');
              return {
                name: module_?.displayName,
                dailyTestMarks: module_?.dailyTestMarks,
                isAttendance: module_?.isAttendance,
                mockTestMarks: module_?.mockTestMarks,
                showModuleInReciept: module_?.showModuleInReciept,
                daywise: !res?.isFeeModuleWise && idxOfFeeByDay !== -1,
                weekly: !res?.isFeeModuleWise && idxOfFeeByWeek !== -1,
                quaterly: !res?.isFeeModuleWise && idxOfFeeByQuater !== -1,
                semester: !res?.isFeeModuleWise && idxOfFeeBySemester !== -1,
                yearly: !res?.isFeeModuleWise && idxOfFeeByYear !== -1,
                monthly: !res?.isFeeModuleWise && idxOfFeeByMon !== -1,
                daywiseFees:
                  idxOfFeeByDay !== -1
                    ? currencyFormatter.format(module_?.fees[idxOfFeeByDay]?.feeAmount)
                    : undefined,
                monthlyFees:
                  idxOfFeeByMon !== -1
                    ? currencyFormatter.format(module_?.fees[idxOfFeeByMon]?.feeAmount)
                    : undefined,
                weeklyFees:
                  idxOfFeeByWeek !== -1
                    ? currencyFormatter.format(module_?.fees[idxOfFeeByWeek]?.feeAmount)
                    : undefined,
                quaterlyFees:
                  idxOfFeeByQuater !== -1
                    ? currencyFormatter.format(module_?.fees[idxOfFeeByQuater]?.feeAmount)
                    : undefined,
                semesterFees:
                  idxOfFeeBySemester !== -1
                    ? currencyFormatter.format(module_?.fees[idxOfFeeBySemester]?.feeAmount)
                    : undefined,
                yearlyFees:
                  idxOfFeeByYear !== -1
                    ? currencyFormatter.format(module_?.fees[idxOfFeeByYear]?.feeAmount)
                    : undefined,
                dailyTestMarksEnteredById: module_?.dailyTestMarksEnteredById,
                mockTestMarksEnteredById: module_?.mockTestMarksEnteredById,
              };
            }),
          });
          if (res?.courseModules?.length > 0 && res?.isFeeModuleWise) {
            form.setFieldsValue({
              moduleWise: {
                daywise: searchTypeOfFee(res?.courseModules[0]?.fees, 'TF_day') !== -1,
                weekly: searchTypeOfFee(res?.courseModules[0]?.fees, 'TF_wk') !== -1,
                quaterly: searchTypeOfFee(res?.courseModules[0]?.fees, 'TF_qr') !== -1,
                semester: searchTypeOfFee(res?.courseModules[0]?.fees, 'TF_sm') !== -1,
                yearly: searchTypeOfFee(res?.courseModules[0]?.fees, 'TF_yr') !== -1,
                monthly: searchTypeOfFee(res?.courseModules[0]?.fees, 'TF_mon') !== -1,
              },
            });
          }
          return res;
        })
        .then((res) => {
          // to re-render the form
          setAllValues(res);
        })
        .catch(() => {});
    }
  }, [courseId, form, particularViewCourseId]);

  return (
    <Page
      title={
        particularViewCourseId || courseId
          ? (courseId && 'Update course') || (particularViewCourseId && 'View course')
          : 'Add course'
      }
      breadcrumbs={
        <Breadcrumbs
          path={[
            {
              name: 'Dashboard',
              path: '/dashboard',
            },
            {
              name: 'All courses',
              path: '/courses/all',
            },
            {
              name: courseId || particularViewCourseId ? form.getFieldValue('name') : 'Add course',
              path: '#',
            },
          ]}
        />
      }
    >
      <Spin spinning={Boolean(courseId || particularViewCourseId) && loadingCourse}>
        <Form
          form={form}
          onFinish={onFinish}
          onValuesChange={(values) => {
            setAllValues(values);
          }}
          hideRequiredMark
          scrollToFirstError
        >
          <div className=" bg-white rounded-lg mb-5 shadow">
            <div className="text-base text-gray-800 font-semibold px-5 pt-5 border-b">
              <p>Select course options</p>
            </div>
            <div className="px-5 pb-3">
              <div className=" pt-4">
                <Row>
                  <Col lg={6} xl={3} md={8} sm={12} xs={12}>
                    <div className="flex justify-between items-center">
                      <div className="flex">
                        <div>
                          <Form.Item
                            valuePropName="checked"
                            name="needCategory"
                            rules={[{ required: true, message: 'Please select category' }]}
                          >
                            <Checkbox disabled={particularViewCourseId ? true : null}>
                              Course category
                            </Checkbox>
                          </Form.Item>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col lg={6} xl={3} md={8} sm={12} xs={12}>
                    <div className="flex justify-between items-center">
                      <div className="flex">
                        <div>
                          <Form.Item
                            valuePropName="checked"
                            name="needSubCategory"
                            shouldUpdate
                            rules={[{ required: true, message: 'Please select sub category' }]}
                          >
                            <Checkbox disabled={particularViewCourseId ? true : null}>
                              Course sub category
                            </Checkbox>
                          </Form.Item>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col lg={6} xl={3} md={8} sm={12} xs={12}>
                    <div className="flex justify-between items-center">
                      <div className="flex">
                        <div>
                          <Form.Item
                            name="isModule"
                            label="Add module"
                            shouldUpdate
                            valuePropName="checked"
                          >
                            <Switch
                              disabled={particularViewCourseId ? true : null}
                              checkedChildren="Yes"
                              unCheckedChildren="No"
                              onChange={(value) => {
                                form.setFieldsValue({
                                  courseModules: [undefined],
                                  dailyTestMarks: undefined,
                                  mockTestMarks: undefined,
                                  dailyTestMarksEnteredById: undefined,
                                  mockTestMarksEnteredById: undefined,
                                  isFeeModuleWise: undefined,
                                });
                              }}
                            />
                          </Form.Item>
                        </div>
                      </div>
                    </div>
                  </Col>
                  {form?.getFieldValue('isModule') && (
                    <Col lg={6} xl={4} md={8} sm={12} xs={12}>
                      <div className={`flex justify-between ${styles.overideRadioStyle} `}>
                        <Form.Item
                          name="isFeeModuleWise"
                          label={<span className="font-medium text-gray-800 block ">Fees</span>}
                          rules={[
                            { required: true, message: 'Please select type of fee for modules' },
                          ]}
                          shouldUpdate
                        >
                          <Radio.Group
                            disabled={particularViewCourseId ? true : null}
                            onChange={(ev) => {
                              form.setFieldsValue({
                                courseModules: [undefined],
                              });
                            }}
                            options={[
                              { label: 'Module wise', value: 'TRUE_' },
                              { label: 'Individually', value: 'FALSE_' },
                            ]}
                          />
                        </Form.Item>
                      </div>
                    </Col>
                  )}
                  <Col lg={6} xl={3} md={8} sm={12} xs={12}>
                    <div className="flex justify-between items-center">
                      <div className="flex">
                        <div>
                          <Form.Item valuePropName="checked" name="isMarkingTestDaily" shouldUpdate>
                            <Checkbox
                              disabled={particularViewCourseId ? true : null}
                              onChange={(ev) => {
                                form.setFieldsValue({
                                  dailyTestMarks: undefined,
                                  dailyTestMarksEnteredById: undefined,
                                });
                              }}
                            >
                              Daily test marks
                            </Checkbox>
                          </Form.Item>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col lg={6} xl={3} md={8} sm={12} xs={12}>
                    <div className="flex justify-between items-center">
                      <div className="flex">
                        <div>
                          <Form.Item valuePropName="checked" name="isMarkingTestMock" shouldUpdate>
                            <Checkbox
                              disabled={particularViewCourseId ? true : null}
                              onChange={(ev) => {
                                form.setFieldsValue({
                                  mockTestMarks: undefined,
                                  mockTestMarksEnteredById: undefined,
                                });
                              }}
                            >
                              Mock test marks
                            </Checkbox>
                          </Form.Item>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col lg={6} xl={3} md={8} sm={12} xs={12}>
                    <div className="flex justify-between items-center">
                      <div className="flex">
                        <div>
                          <Form.Item valuePropName="checked" name="isPassportRequired">
                            <Checkbox disabled={particularViewCourseId ? true : null}>
                              Passport details
                            </Checkbox>
                          </Form.Item>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col lg={6} xl={6} md={8} sm={12} xs={12}>
                    <div className="flex justify-between items-center">
                      <div className="flex">
                        <div>
                          <Form.Item valuePropName="checked" name="assignAssessTest">
                            <Checkbox disabled={particularViewCourseId ? true : null}>
                              Assign assessment test
                            </Checkbox>
                          </Form.Item>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </div>

          <div className=" bg-white rounded-lg mb-5 shadow">
            <div className="text-base text-gray-800 font-semibold px-5 pt-5 border-b">
              <p>Course details</p>
            </div>
            <div className="px-5 pb-3">
              <Row gutter={24} className="pt-4">
                <Col lg={8} xl={8} md={24} sm={24} xs={24}>
                  <span className="font-medium text-gray-800 block mb-2">Course name</span>
                  <Form.Item
                    shouldUpdate
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: 'Please enter course name!',
                      },
                    ]}
                  >
                    <Input
                      size="large"
                      placeholder="Enter course name here"
                      disabled={particularViewCourseId ? true : null}
                    />
                  </Form.Item>
                </Col>
                {form.getFieldsValue().needCategory && (
                  <Col lg={8} xl={8} md={24} sm={24} xs={24}>
                    <span className="font-medium text-gray-800 block mb-2">Course category</span>

                    <Form.Item
                      shouldUpdate
                      name="categoryName"
                      rules={[
                        {
                          required: true,
                          message: 'Please enter course category name!',
                        },
                      ]}
                    >
                      <Input
                        size="large"
                        placeholder="Enter course category name here"
                        disabled={particularViewCourseId ? true : null}
                      />
                    </Form.Item>
                  </Col>
                )}

                {form.getFieldsValue().needSubCategory && (
                  <Col lg={8} xl={8} md={24} sm={24} xs={24}>
                    <span className="font-medium text-gray-800 block mb-2">
                      Course sub category
                    </span>

                    <Form.Item
                      shouldUpdate
                      name="subCategoryName"
                      rules={[
                        {
                          required: true,
                          message: 'Please enter course sub category name!',
                        },
                      ]}
                    >
                      <Input
                        size="large"
                        placeholder="Enter course sub category name here"
                        disabled={particularViewCourseId ? true : null}
                      />
                    </Form.Item>
                  </Col>
                )}
              </Row>
            </div>
          </div>

          {form.getFieldsValue().isModule && (
            <div className=" bg-white rounded-lg mb-5 shadow">
              <div className="flex justify-between px-4 py-3 items-center border-b">
                <div className="text-base text-gray-800 font-semibold">Course modules</div>
              </div>
              {form.getFieldsValue().isModule && (
                <div className=" pb-3 ">
                  {/* to check if the user have selected the type of fees */}
                  {form.getFieldValue('isFeeModuleWise') === 'TRUE_' && (
                    <div className=" px-5">
                      <Row>
                        {feeList?.map((item) => (
                          <Col key={item.value} lg={6} xl={3} md={8} sm={12} xs={12}>
                            <div className="pr-4">
                              <Form.Item
                                shouldUpdate
                                name={['moduleWise', item?.value]}
                                fieldKey={[item?.value]}
                                valuePropName="checked"
                              >
                                <Checkbox disabled={particularViewCourseId ? true : null}>
                                  {item?.name}
                                </Checkbox>
                              </Form.Item>
                            </div>
                          </Col>
                        ))}
                      </Row>
                    </div>
                  )}
                  <Form.List name="courseModules">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map(({ key, name, fieldKey, ...restField }, index) => (
                          <div key={key} className="">
                            <div className="flex px-5 py-2 mb-2 border-b bg-gray-100 justify-between">
                              <div className="font-semibold">Module {index + 1}</div>

                              {fields?.length > 1 && (
                                <div>
                                  {particularViewCourseId ? null : (
                                    <span
                                      className="text-red-600 cursor-pointer"
                                      onClick={() => {
                                        remove(name);
                                      }}
                                    >
                                      Remove module
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>{' '}
                            <div className="px-5">
                              <Row>
                                {/* to check if the user have selected the fees */}
                                {form.getFieldValue('isFeeModuleWise') === 'FALSE_' && (
                                  <>
                                    {feeList?.map((item) => (
                                      <Col key={item.value} lg={6} xl={3} md={8} sm={12} xs={12}>
                                        <div key={item?.value} className="pr-4">
                                          <Form.Item
                                            shouldUpdate
                                            {...restField}
                                            name={[name, [item?.value]]}
                                            fieldKey={[fieldKey, [item?.value]]}
                                            valuePropName="checked"
                                          >
                                            <Checkbox
                                              disabled={particularViewCourseId ? true : null}
                                            >
                                              {item?.name}
                                            </Checkbox>
                                          </Form.Item>
                                        </div>
                                      </Col>
                                    ))}
                                  </>
                                )}
                                <Col lg={6} xl={4} md={8} sm={12} xs={12}>
                                  <div className="flex justify-between items-center">
                                    <div className="flex">
                                      <div>
                                        <Form.Item
                                          shouldUpdate
                                          {...restField}
                                          valuePropName="checked"
                                          name={[name, 'isAttendance']}
                                          fieldKey={[fieldKey, 'isAttendance']}
                                        >
                                          <Checkbox disabled={particularViewCourseId ? true : null}>
                                            Attendance
                                          </Checkbox>
                                        </Form.Item>
                                      </div>
                                    </div>
                                  </div>
                                </Col>
                              </Row>
                            </div>
                            <Row gutter={24} className="px-5">
                              <Col lg={6} xl={4} md={8} sm={12} xs={12}>
                                <div>
                                  <span className="font-medium text-gray-800 block mb-2">
                                    Module name
                                  </span>

                                  <Form.Item
                                    shouldUpdate
                                    {...restField}
                                    name={[name, 'name']}
                                    fieldKey={[fieldKey, 'name']}
                                    rules={[
                                      {
                                        required: true,
                                        message: 'Please enter module name!',
                                      },
                                    ]}
                                  >
                                    <Input
                                      placeholder="Enter module name here"
                                      size="large"
                                      disabled={particularViewCourseId ? true : null}
                                    />
                                  </Form.Item>
                                </div>
                              </Col>
                              {feeList?.map((fee) => (
                                <>
                                  {(form.getFieldValue('isFeeModuleWise') === 'FALSE_' &&
                                    form.getFieldValue(['courseModules', index, fee?.value])) ||
                                  (form.getFieldValue('isFeeModuleWise') === 'TRUE_' &&
                                    form.getFieldValue(['moduleWise', fee?.value])) ? (
                                    <Col lg={6} xl={3} md={8} sm={12} xs={12}>
                                      <div>
                                        <span className="font-medium text-gray-800 block mb-2">
                                          {fee?.name}
                                        </span>
                                        <Form.Item
                                          shouldUpdate
                                          {...restField}
                                          name={[name, [fee?.attrName]]}
                                          fieldKey={[fieldKey, [fee?.attrName]]}
                                          rules={[
                                            {
                                              required: true,
                                              message: `Please enter ${fee?.value} fees!`,
                                            },
                                          ]}
                                        >
                                          <Input
                                            size="large"
                                            onFocus={(e) => e.target.select()}
                                            placeholder="₹0.00"
                                            autoComplete="off"
                                            className="text-right"
                                            disabled={particularViewCourseId ? true : null}
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
                                                  res[0] === '₹'
                                                    ? res.substring(1, res.length).trim()
                                                    : res;
                                                mod = Number(res).toFixed(2);
                                              } else {
                                                mod = event.target.value;
                                              }
                                              const allData = form.getFieldsValue();
                                              const parent = 'courseModules';
                                              allData[parent][index] = {
                                                ...allData[parent][index],
                                                [fee.attrName]: currencyFormatter.format(
                                                  currencyParser(mod),
                                                ),
                                              };
                                              // filtering the modules
                                              // if the fee is modulewise every module wii have given type of fee

                                              if (allData.isFeeModuleWise === 'TRUE_') {
                                                const totalFeeForGivenAttrArray = allData[
                                                  parent
                                                ]?.map((module_) => module_[fee.attrName]);
                                                let totalFeeForGivenAttr = 0;
                                                totalFeeForGivenAttrArray.forEach((val) => {
                                                  totalFeeForGivenAttr += Number(
                                                    decodeDollarsToDigits(val),
                                                  );
                                                });
                                                allData.totalFee[
                                                  fee.value
                                                ] = currencyFormatter.format(totalFeeForGivenAttr);
                                              } else {
                                                const totalFeeForGivenAttrArray = allData.courseModules?.map(
                                                  (module_) => Number(calculateFee(module_, fee)),
                                                );

                                                let typeOfUniqueFeeUserHaveChecked = [];
                                                allData.courseModules.forEach((module_) => {
                                                  typeOfUniqueFeeUserHaveChecked = [
                                                    ...typeOfUniqueFeeUserHaveChecked,
                                                    ...feeList.filter(
                                                      (feeItem) =>
                                                        module_?.[feeItem.value] &&
                                                        typeOfUniqueFeeUserHaveChecked?.findIndex(
                                                          (data) => data?.value === feeItem?.value,
                                                        ) === -1,
                                                    ),
                                                  ];
                                                });
                                                typeOfUniqueFeeUserHaveChecked.forEach(
                                                  (feeItem) => {
                                                    const totalFeeForAttr = allData.courseModules?.map(
                                                      (module_) =>
                                                        Number(calculateFee(module_, feeItem)),
                                                    );

                                                    let totalFeeForGiven = 0;
                                                    totalFeeForAttr.forEach((val) => {
                                                      totalFeeForGiven += Number(val);
                                                    });
                                                    allData.totalFee[
                                                      feeItem.value
                                                    ] = currencyFormatter.format(totalFeeForGiven);
                                                  },
                                                );
                                              }
                                              form.setFieldsValue(allData);
                                            }}
                                          />
                                        </Form.Item>
                                      </div>
                                    </Col>
                                  ) : null}
                                </>
                              ))}
                            </Row>
                            <Row gutter={24} className="px-5">
                              {form?.getFieldValue('isMarkingTestDaily') && (
                                <>
                                  <Col lg={6} xl={3} md={8} sm={12} xs={12}>
                                    <div>
                                      <span className="font-medium text-gray-800 block mb-2">
                                        Daily test marks
                                      </span>

                                      <Form.Item
                                        shouldUpdate
                                        {...restField}
                                        name={[name, 'dailyTestMarks']}
                                        fieldKey={[fieldKey, 'dailyTestMarks']}
                                        rules={[
                                          {
                                            required: true,
                                            message: 'Please enter daily test marks',
                                          },
                                        ]}
                                      >
                                        <InputNumber
                                          size="large"
                                          style={{
                                            width: '100%',
                                          }}
                                          min={1}
                                          max={100}
                                          disabled={particularViewCourseId ? true : null}
                                        />
                                      </Form.Item>
                                    </div>
                                  </Col>{' '}
                                  <Col lg={6} xl={4} md={8} sm={12} xs={12}>
                                    <div className="pl-4">
                                      <span className="font-medium text-gray-800 block mb-2">
                                        Daily test marks entered by
                                      </span>

                                      <Form.Item
                                        shouldUpdate
                                        {...restField}
                                        name={[name, 'dailyTestMarksEnteredById']}
                                        fieldKey={[fieldKey, 'dailyTestMarksEnteredById']}
                                        rules={[
                                          {
                                            required: true,
                                            message: 'Please enter daily test marks entered by',
                                          },
                                        ]}
                                      >
                                        <Radio.Group
                                          disabled={particularViewCourseId ? true : null}
                                        >
                                          <Radio value="STUDENT">Student</Radio>
                                          <Radio value="TEACHER">Teacher</Radio>
                                        </Radio.Group>
                                      </Form.Item>
                                    </div>
                                  </Col>
                                </>
                              )}
                              {form?.getFieldValue('isMarkingTestMock') && (
                                <>
                                  {' '}
                                  <Col lg={6} xl={3} md={8} sm={12} xs={12}>
                                    <div className="pl-4">
                                      <span className="font-medium text-gray-800 block mb-2">
                                        Mock test marks
                                      </span>

                                      <Form.Item
                                        shouldUpdate
                                        {...restField}
                                        name={[name, 'mockTestMarks']}
                                        fieldKey={[fieldKey, 'mockTestMarks']}
                                        rules={[
                                          {
                                            required: true,
                                            message: 'Please enter mock test marks',
                                          },
                                        ]}
                                      >
                                        <InputNumber
                                          size="large"
                                          style={{
                                            width: '100%',
                                          }}
                                          min={1}
                                          max={100}
                                          disabled={particularViewCourseId ? true : null}
                                        />
                                      </Form.Item>
                                    </div>
                                  </Col>
                                  <Col lg={6} xl={4} md={8} sm={12} xs={12}>
                                    <div className="pl-4">
                                      <span className="font-medium text-gray-800 block mb-2">
                                        Mock test marks entered by
                                      </span>

                                      <Form.Item
                                        shouldUpdate
                                        {...restField}
                                        name={[name, 'mockTestMarksEnteredById']}
                                        fieldKey={[fieldKey, 'mockTestMarksEnteredById']}
                                        rules={[
                                          {
                                            required: true,
                                            message: 'Please enter mock test marks entered by',
                                          },
                                        ]}
                                      >
                                        <Radio.Group
                                          disabled={particularViewCourseId ? true : null}
                                        >
                                          <Radio value="STUDENT">Student</Radio>
                                          <Radio value="TEACHER">Teacher</Radio>
                                        </Radio.Group>
                                      </Form.Item>
                                    </div>
                                  </Col>
                                </>
                              )}
                            </Row>
                          </div>
                        ))}
                        <div className="pt-2 px-5">
                          <Form.Item shouldUpdate>
                            <Button
                              type="dashed"
                              onClick={() => add()}
                              block
                              icon={<PlusOutlined />}
                              disabled={particularViewCourseId ? true : null}
                            >
                              Add module
                            </Button>
                          </Form.Item>
                        </div>
                      </>
                    )}
                  </Form.List>
                  <div className="hidden">
                    {(checkIfAnyModuleFeetypeIsChcked() ||
                      form.getFieldValue('isFeeModuleWise') === 'FALSE_') && (
                      <>
                        <div className="flex px-5 py-2 mb-2 border-b bg-gray-100 justify-between">
                          <div className="font-semibold">Total fee</div>
                        </div>{' '}
                        <Row gutter={24} className="px-5">
                          {feeList?.map((fee) => (
                            <>
                              {form.getFieldValue('isFeeModuleWise') === 'FALSE_' ||
                              (form.getFieldValue('isFeeModuleWise') === 'TRUE_' &&
                                form.getFieldValue(['moduleWise', fee?.value])) ? (
                                <Col lg={6} xl={3} md={8} sm={12} xs={12}>
                                  <div>
                                    <span className="font-medium text-gray-800 block mb-2">
                                      Total {fee?.name.toLowerCase()}
                                    </span>
                                    <Form.Item
                                      shouldUpdate
                                      // {...restField}
                                      name={['totalFee', fee.value]}
                                      // fieldKey={[fieldKey, [fee?.attrName]]}
                                    >
                                      <Input
                                        size="large"
                                        disabled
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
                                              res[0] === '₹'
                                                ? res.substring(1, res.length).trim()
                                                : res;
                                            mod = Number(res).toFixed(2);
                                          } else {
                                            mod = event.target.value;
                                          }
                                          const allData = form.getFieldsValue();
                                          const parent = 'courseModules';
                                        }}
                                      />
                                    </Form.Item>
                                  </div>
                                </Col>
                              ) : null}
                            </>
                          ))}
                        </Row>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          <div className=" bg-white rounded-lg mb-5 shadow">
            <div className="flex justify-between px-4 py-4 items-center border-b">
              <div className="text-base text-gray-800 font-semibold">Course fees</div>
            </div>

            <div className="px-5 pb-3 pt-4">
              <div className="flex pt-4"></div>
              <div className="">
                <Row gutter={24}>
                  {!form.getFieldsValue().isModule && (
                    <Col lg={6} xl={3} md={8} sm={12} xs={12}>
                      <Form.Item valuePropName="checked" name="isAttendance">
                        <Checkbox disabled={particularViewCourseId ? true : null}>
                          Attendance
                        </Checkbox>
                      </Form.Item>
                    </Col>
                  )}
                  {feeList?.map((item) => (
                    <Col key={item.value} lg={6} xl={3} md={8} sm={12} xs={12}>
                      <div key={item?.value} className="pr-4">
                        <Form.Item name={item?.value} valuePropName="checked">
                          <Checkbox disabled={particularViewCourseId ? true : null}>
                            {item?.name}
                          </Checkbox>
                        </Form.Item>
                      </div>
                    </Col>
                  ))}
                </Row>
                <Row gutter={24}>
                  {feeList?.map((fee) => (
                    <>
                      {form.getFieldsValue()?.[fee?.value] && (
                        <Col lg={6} xl={3} md={24} sm={24} xs={24}>
                          <div>
                            <span className="font-medium text-gray-800 block mb-2">
                              {fee?.name}
                            </span>
                            <Form.Item
                              name={['courseFees', [fee?.attrName]]}
                              rules={[
                                {
                                  required: true,
                                  message: `Please enter ${fee?.value} fees!`,
                                },
                              ]}
                            >
                              <Input
                                size="large"
                                onFocus={(e) => e.target.select()}
                                placeholder="₹0.00"
                                autoComplete="off"
                                className="text-right"
                                disabled={particularViewCourseId ? true : null}
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

                                  const allData = form.getFieldsValue();
                                  const parent = 'courseFees';

                                  allData[parent] = {
                                    ...allData[parent].courseFees,
                                    [fee.attrName]: currencyFormatter.format(currencyParser(mod)),
                                  };
                                  form.setFieldsValue(allData);
                                }}
                              />
                            </Form.Item>
                          </div>
                        </Col>
                      )}
                    </>
                  ))}
                </Row>
                <Row>
                  {!form?.getFieldValue('isModule') && (
                    <>
                      {form?.getFieldValue('isMarkingTestDaily') && (
                        <>
                          <Col lg={6} xl={3} md={8} sm={12} xs={12}>
                            <div>
                              <span className="font-medium text-gray-800 block mb-2">
                                Daily test marks
                              </span>

                              <Form.Item
                                name={'dailyTestMarks'}
                                rules={[
                                  {
                                    required: true,
                                    message: 'Please enter daily test marks',
                                  },
                                ]}
                              >
                                <InputNumber
                                  size="large"
                                  style={{
                                    width: '100%',
                                  }}
                                  min={1}
                                  max={100}
                                  disabled={particularViewCourseId ? true : null}
                                />
                              </Form.Item>
                            </div>
                          </Col>{' '}
                          <Col lg={6} xl={4} md={8} sm={12} xs={12}>
                            <div className="pl-4">
                              <span className="font-medium text-gray-800 block mb-2">
                                Daily test marks entered by
                              </span>

                              <Form.Item
                                name={'dailyTestMarksEnteredById'}
                                rules={[
                                  {
                                    required: true,
                                    message: 'Please enter daily test marks entered by',
                                  },
                                ]}
                              >
                                <Radio.Group disabled={particularViewCourseId ? true : null}>
                                  <Radio value="STUDENT">Student</Radio>
                                  <Radio value="TEACHER">Teacher</Radio>
                                </Radio.Group>
                              </Form.Item>
                            </div>
                          </Col>
                        </>
                      )}
                      {form?.getFieldValue('isMarkingTestMock') && (
                        <>
                          <Col lg={6} xl={3} md={8} sm={12} xs={12}>
                            <div className="">
                              <span className="font-medium text-gray-800 block mb-2">
                                Mock test marks
                              </span>

                              <Form.Item
                                name={'mockTestMarks'}
                                rules={[
                                  { required: true, message: 'Please enter mock test marks' },
                                ]}
                              >
                                <InputNumber
                                  size="large"
                                  style={{
                                    width: '100%',
                                  }}
                                  min={1}
                                  max={100}
                                  disabled={particularViewCourseId ? true : null}
                                />
                              </Form.Item>
                            </div>
                          </Col>
                          <Col lg={6} xl={4} md={8} sm={12} xs={12}>
                            <div className="pl-4">
                              <span className="font-medium text-gray-800 block mb-2">
                                Mock test marks entered by
                              </span>

                              <Form.Item
                                name={'mockTestMarksEnteredById'}
                                rules={[
                                  {
                                    required: true,
                                    message: 'Please enter mock test marks entered by',
                                  },
                                ]}
                              >
                                <Radio.Group disabled={particularViewCourseId ? true : null}>
                                  <Radio value="STUDENT">Student</Radio>
                                  <Radio value="TEACHER">Teacher</Radio>
                                </Radio.Group>
                              </Form.Item>
                            </div>
                          </Col>
                        </>
                      )}
                    </>
                  )}
                </Row>
              </div>
            </div>
          </div>

          <div className=" bg-white rounded-lg mb-5 shadow">
            <div className="text-base text-gray-800 font-semibold px-5 pt-5 border-b">
              <p>Remarks</p>
            </div>
            <div className="px-5 pb-3 pt-4">
              <div>
                <span className="font-medium text-gray-800 block mb-2">
                  Terms and conditions (T&C)
                </span>
                <Form.Item name="description">
                  <TextArea
                    placeholder="Enter terms and conditions here"
                    autoSize={{ minRows: 3, maxRows: 5 }}
                    disabled={particularViewCourseId ? true : null}
                  />
                </Form.Item>
              </div>

              <div>
                <span className="font-medium text-gray-800 block mb-2">Remarks</span>
                <Form.Item name="longDescription">
                  <TextArea
                    placeholder="Enter remarks here"
                    autoSize={{ minRows: 3, maxRows: 5 }}
                    disabled={particularViewCourseId ? true : null}
                  />
                </Form.Item>
              </div>
            </div>
          </div>
          {particularViewCourseId ? null : (
            <FixedFooter classes="text-right">
              <div
                className="flex m-auto"
                style={{
                  maxWidth: '80rem',
                }}
              >
                <div className="w-full ">
                  <Button
                    type="primary"
                    onClick={() => {
                      form.submit();
                    }}
                    size="large"
                    loading={addingCourse}
                  >
                    {/* {courseId ? 'Update course' : ' Add course'} */}
                    {particularViewCourseId || courseId
                      ? (courseId && 'Update course') || (particularViewCourseId && 'View course')
                      : 'Add course'}
                  </Button>
                </div>
              </div>
            </FixedFooter>
          )}
        </Form>
      </Spin>
    </Page>
  );
};

export default connect(({ courses, loading }) => ({
  addCourse: courses?.addCourse,
  singleCourseDetail: courses.singleCourseDetail,
  loadingCourse: loading.effects['courses/getCourseDetails'],
  addingCourse: loading.effects['courses/addCourse'],
}))(AddCourse);
