import React, { useState, useEffect } from 'react';
import Card from '@/components/Structure/Card';
import {
  Input,
  Select,
  Form,
  Row,
  Col,
  DatePicker,
  Checkbox,
  Button,
  Radio,
  Spin,
  message,
} from 'antd';
import { useDispatch, connect, useParams, history } from 'umi';
import Page from '@/components/Page';
import Breadcrumbs from '@/components/BreadCrumbs';
import moment from 'moment';

const { Option } = Select;
const UploadTeachingSchedule = ({
  getCoursesForTeachingSchedule,

  getTeachingCapsuleForClassTest,
  getTeachingCapsuleForMockTest,
  submitLoading,
  getCoursesLoading,
  getSingleTeachingSchedules,
  getSingleTeachingSchedulesLoading,
  UpdateLoading,
}) => {
  const [mockTestDay, setMockTestDay] = useState([]);
  const [isFileSubmit, setIsFileSubmit] = useState(false);
  const [singleCourses, setSingleCourses] = useState();
  const [singleTeachingSchedule, setSingleTeachingSchedule] = useState(null);
  const [publicHoliday, setPublicHoliday] = useState(false);
  const [IsMockTestInclude, setIsMockTestInclude] = useState(false);
  const [isClassCapsuleInclude, setIsClassCapsuleInclude] = useState(false);
  const [startDate, setStartDate] = useState();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { teachingScheduleId, teachingScheduleViewId } = useParams();

  const workingDays = [
    {
      id: 1,
      name: 'Sun',
      value: 'SUNDAY',
    },
    {
      id: 2,
      name: 'Mon',
      value: 'MONDAY',
    },
    {
      id: 3,
      name: 'Tue',
      value: 'TUESDAY',
    },
    {
      id: 4,
      name: 'Wed',
      value: 'WEDNESDAY',
    },
    {
      id: 5,
      name: 'Thurs',
      value: 'THURSDAY',
    },
    {
      id: 6,
      name: 'Fri',
      value: 'FRIDAY',
    },
    {
      id: 7,
      name: 'Sat',
      value: 'SATURDAY',
    },
  ];

  const onFinishValue = (values) => {
    if (teachingScheduleId) {
      const valuesForUpdate = {
        ...values,
        startDate: values?.startDate.toISOString(),
        endDate: values?.endDate.toISOString(),
      };
      const teachingScheduleUpdate = {
        timesheetId: singleTeachingSchedule?.scheduleDetail?.timesheetId,
        name: valuesForUpdate?.scheduleName,
        startDate: valuesForUpdate?.startDate,
        endDate: valuesForUpdate?.endDate,
        mockTestOn: valuesForUpdate?.mockTestOn,
        isMockAndClass: valuesForUpdate?.mockTestOrClass,
        workingDays: valuesForUpdate?.workingDays,
        isPublicHolidaysInculde: publicHoliday.toString(),
      };
      teachingScheduleUpdate.course = {
        id: valuesForUpdate?.course,
      };
      if (valuesForUpdate?.IsmockIncludes === true) {
        teachingScheduleUpdate.mockTestCapsule = {
          id: singleTeachingSchedule?.scheduleDetail?.mockTestCapsule?.id,
        };
      }
      if (valuesForUpdate?.isClassTestInclude === true) {
        teachingScheduleUpdate.capsule = {
          id: singleTeachingSchedule?.scheduleDetail?.capsule?.id,
        };
      }

      dispatch({
        type: 'courses/updateTeachingSchedule',
        payload: {
          pathParams: { teachingScheduleId },
          body: teachingScheduleUpdate,
        },
      }).then((response) => {
        if (response?.responseMessage === 'success') {
          setIsFileSubmit(true);
        }
      });
    } else {
      const valuesFor = {
        ...values,
        startDate: values?.startDate.toISOString(),
        endDate: values?.endDate.toISOString(),
      };

      const teaching = {
        name: valuesFor?.scheduleName,
        startDate: valuesFor?.startDate,
        endDate: valuesFor?.endDate,
        mockTestOn: valuesFor?.mockTestOn,
        isMockAndClass: valuesFor?.mockTestOrClass,
        workingDays: values?.workingDays,
        isPublicHolidaysInculde: publicHoliday.toString(),
      };
      teaching.course = {
        id: valuesFor?.course,
      };
      if (values?.classTest) {
        teaching.capsule = {
          id: singleCourses?.classTestCapsule?.id,
        };
      }
      if (values?.mockTest) {
        teaching.mockTestCapsule = {
          id: singleCourses?.mockTestCapsule?.id,
        };
      }

      dispatch({
        type: 'courses/uploadTeachingSchedule',
        payload: {
          body: teaching,
        },
      })
        .then((res) => {
          if (res?.responseMessage === 'success') {
            setIsFileSubmit(true);
            message.success('Your teaching schedule create succussfully');
            history.push(`/upload/teaching-schedule`);
          }
        })
        .catch(() => {
          message.info('something went wrong ');
        });
    }
    // }
  };
  useEffect(() => {
    dispatch({
      type: 'courses/getCoursesForTeachingSchedule',
      payload: { query: { viewSize: 1000, hasCapsule: true, status: 'SHOW_CAPSULES' } },
    });

    form.setFieldsValue({
      categoryName: undefined,
      subCategory: undefined,
      module: undefined,
    });
  }, [dispatch]);
  useEffect(() => {
    form.setFieldsValue({
      categoryName: singleCourses?.categoryName,
      subCategory: singleCourses?.subCategoryName,

      classTest: singleCourses?.classTestCapsule?.name,
      mockTest: singleCourses?.mockTestCapsule?.name,
    });
    if (singleCourses?.isMockTestCapsuleExist) {
      form.setFieldsValue({
        module: singleCourses?.mockTestModules?.map((item) => item?.name),
      });
    } else if (singleCourses?.isClassTestCapsuleExist === true) {
      form.setFieldsValue({
        module: singleCourses?.contentModules?.map((val) => val?.name),
      });
    } else {
      form.setFieldsValue({
        module: singleCourses?.mockTestModules?.map((item) => item?.name),
      });
    }
  }, [singleCourses, form]);
  const UpdateTeachingSchedule = () => {
    if (teachingScheduleId || teachingScheduleViewId) {
      dispatch({
        type: 'courses/getSingleTeachingSchedules',
        payload: {
          pathParams: {
            teachingScheduleId: teachingScheduleId || teachingScheduleViewId,
          },
        },
      }).then((res) => {
        setSingleTeachingSchedule(res);

        // eslint-disable-next-line no-unneeded-ternary
        setPublicHoliday(res?.scheduleDetail?.isPublicHolidaysInculde === true ? true : false);

        setMockTestDay(
          workingDays?.filter((item) => res?.scheduleDetail?.workingDays.includes(item?.value)),
        );
        form.setFieldsValue({
          scheduleName: res?.scheduleDetail?.name,
          course: res?.scheduleDetail?.course?.id,
          module: res?.scheduleDetail?.course?.modules?.map((items) => items?.name),
          categoryName: res?.scheduleDetail?.course?.categoryName,
          subCategory: res?.scheduleDetail?.course?.subCategoryName,
          startDate: moment(res?.scheduleDetail?.startDate),
          endDate: moment(res?.scheduleDetail?.endDate),
          // eslint-disable-next-line no-unneeded-ternary
          publicHoliday: res?.scheduleDetail?.isPublicHolidaysInculde === 'true' ? true : false,
          workingDays: res?.scheduleDetail?.workingDays?.map((item) => item),
          classTest: res?.scheduleDetail?.capsule?.name,
          mockTest: res?.scheduleDetail?.mockTestCapsule?.name,
          IsmockIncludes: res?.scheduleDetail?.mockTestOn ? true : null,
          isClassTestInclude: res?.scheduleDetail?.capsule ? true : null,
        });
        if (res?.scheduleDetail?.mockTestOn) {
          form.setFieldsValue({
            mockTestOn: res?.scheduleDetail?.mockTestOn.map((item) => item),
            mockTestOrClass: res?.scheduleDetail?.isMockAndClass,
          });
        }

        setIsMockTestInclude(res?.scheduleDetail?.mockTestCapsule ? true : null);
        setIsClassCapsuleInclude(res?.scheduleDetail?.capsule ? true : null);
      });
    }
  };

  useEffect(() => {
    UpdateTeachingSchedule();
  }, []);

  return (
    <>
      <Page
        title={
          (teachingScheduleId && 'Update  ') ||
          (teachingScheduleViewId && 'View  ') ||
          'teaching schedule'
        }
        breadcrumbs={
          <Breadcrumbs
            path={[
              {
                name: 'Dashboard',
                path: '/dashboard',
              },
              {
                name: 'teaching-schedule',
                path: '/upload/teaching-schedule',
              },
              {
                name:
                  (teachingScheduleId && 'Update Teaching schedule') ||
                  (teachingScheduleViewId && 'View teaching schedule') ||
                  'Upload teaching schedule',
                path: '#',
              },
            ]}
          />
        }
      >
        <div>
          <Form
            onFinish={(val) => {
              if (form.getFieldValue('IsmockIncludes') === true || isClassCapsuleInclude === true) {
                onFinishValue(val);
              } else {
                message.error('Please select atleast one  capsule');
              }
            }}
            form={form}
          >
            <div>
              <Card>
                <div className="py-6 px-4 flex ">
                  <div className="mr-2">
                    <Form.Item
                      name="isClassTestInclude"
                      valuePropName="checked"
                      initialValue={false}
                    >
                      <Checkbox
                        checked={isClassCapsuleInclude}
                        value={isClassCapsuleInclude}
                        disabled={teachingScheduleViewId}
                        onChange={(e) => {
                          if (form.getFieldValue('course') !== undefined) {
                            if (
                              singleCourses?.isClassTestCapsuleExist === true ||
                              singleTeachingSchedule?.scheduleDetail?.isClassTestCapsuleExist ===
                                true
                            ) {
                              form?.setFieldsValue({ isClassTestInclude: e.target.checked });
                              setIsClassCapsuleInclude(e.target.checked);
                              form.setFieldsValue({
                                module: singleCourses?.contentModules?.map((val) => val?.name),
                              });
                            } else {
                              message.error(
                                'There is no class capsule exist Please first create class capsule for this course',
                              );
                              form?.setFieldsValue({ isClassTestInclude: false });
                              setIsClassCapsuleInclude(false);
                            }
                          } else {
                            message.info('Please select course first');
                            form?.setFieldsValue({ isClassTestInclude: false });
                            setIsClassCapsuleInclude(false);
                          }
                          // setIsClassCapsuleInclude(e.target.checked);
                        }}
                      >
                        Class capsule include
                      </Checkbox>
                    </Form.Item>
                  </div>
                  <div className="mr-2">
                    <Form.Item name="IsmockIncludes" valuePropName="checked" initialValue={false}>
                      <Checkbox
                        disabled={teachingScheduleViewId ? true : null}
                        value={IsMockTestInclude}
                        onChange={(e) => {
                          if (form.getFieldValue('course') !== undefined) {
                            if (
                              singleCourses?.isMockTestCapsuleExist === true ||
                              singleTeachingSchedule?.scheduleDetail?.isMockTestCapsuleExist ===
                                true
                            ) {
                              form.setFieldsValue({
                                IsmockIncludes: e.target.checked,
                                module: singleCourses?.mockTestModules?.map((item) => item?.name),
                              });
                              setIsMockTestInclude(e.target.checked);
                            } else {
                              form.setFieldsValue({
                                IsmockIncludes: false,
                              });
                              setIsMockTestInclude(false);
                              message.error(
                                'There is no mock test capsule exist please first create mock test capsule for this course',
                              );
                            }
                          } else {
                            message.info('Please select course first');
                            form.setFieldsValue({
                              IsmockIncludes: false,
                            });
                          }
                          // setIsMockTestInclude(e.target.checked);
                        }}
                      >
                        Mock test include
                      </Checkbox>
                    </Form.Item>
                  </div>
                  <div>
                    <Form.Item name="publicHoliday" valuePropName="checked" initialValue={false}>
                      <Checkbox
                        disabled={teachingScheduleViewId ? true : null}
                        onChange={(e) => {
                          setPublicHoliday(e.target.checked);
                        }}
                      >
                        Include Public holiday
                      </Checkbox>
                    </Form.Item>
                  </div>
                </div>
              </Card>
            </div>
            <div className=" mt-10 ">
              <Card>
                <div className="border-b p-8">
                  <h1 className=" font-medium text-lg">Teaching Schedule</h1>
                </div>
                <div className="px-10">
                  <Spin
                    spinning={Boolean(
                      submitLoading ||
                        getCoursesLoading ||
                        getSingleTeachingSchedulesLoading ||
                        UpdateLoading,
                    )}
                  >
                    <div className="mt-10">
                      <Row gutter={24}>
                        <Col lg={6} xl={6} md={12} sm={24} xs={24}>
                          <div className="flex ">
                            <p className="pb-2 font-medium ">Schedule name</p>
                            <svg
                              width="5"
                              height="5"
                              aria-hidden="true"
                              focusable="false"
                              data-prefix="fas"
                              data-icon="asterisk"
                              className="svg-inline--fa fa-asterisk fa-w-16 text-red-500 ml-2 mt-1.5"
                              role="img"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 512 512"
                            >
                              <path
                                fill="currentColor"
                                d="M478.21 334.093L336 256l142.21-78.093c11.795-6.477 15.961-21.384 9.232-33.037l-19.48-33.741c-6.728-11.653-21.72-15.499-33.227-8.523L296 186.718l3.475-162.204C299.763 11.061 288.937 0 275.48 0h-38.96c-13.456 0-24.283 11.061-23.994 24.514L216 186.718 77.265 102.607c-11.506-6.976-26.499-3.13-33.227 8.523l-19.48 33.741c-6.728 11.653-2.562 26.56 9.233 33.037L176 256 33.79 334.093c-11.795 6.477-15.961 21.384-9.232 33.037l19.48 33.741c6.728 11.653 21.721 15.499 33.227 8.523L216 325.282l-3.475 162.204C212.237 500.939 223.064 512 236.52 512h38.961c13.456 0 24.283-11.061 23.995-24.514L296 325.282l138.735 84.111c11.506 6.976 26.499 3.13 33.227-8.523l19.48-33.741c6.728-11.653 2.563-26.559-9.232-33.036z"
                              ></path>
                            </svg>{' '}
                          </div>
                          <div className="">
                            <Form.Item
                              name="scheduleName"
                              rules={[
                                {
                                  required: true,
                                  message: 'Schedule Name is Require',
                                },
                              ]}
                            >
                              <Input
                                disabled={teachingScheduleViewId ? true : null}
                                placeholder="Schedule Name"
                                size="large"
                              />
                            </Form.Item>
                          </div>
                        </Col>
                        <Col lg={6} xl={6} md={12} sm={24} xs={24}>
                          <div className="flex">
                            <p className="mb-2 font-medium ">Course</p>
                            <svg
                              width="5"
                              height="5"
                              aria-hidden="true"
                              focusable="false"
                              data-prefix="fas"
                              data-icon="asterisk"
                              className="svg-inline--fa fa-asterisk fa-w-16 text-red-500 ml-2 mt-1.5"
                              role="img"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 512 512"
                            >
                              <path
                                fill="currentColor"
                                d="M478.21 334.093L336 256l142.21-78.093c11.795-6.477 15.961-21.384 9.232-33.037l-19.48-33.741c-6.728-11.653-21.72-15.499-33.227-8.523L296 186.718l3.475-162.204C299.763 11.061 288.937 0 275.48 0h-38.96c-13.456 0-24.283 11.061-23.994 24.514L216 186.718 77.265 102.607c-11.506-6.976-26.499-3.13-33.227 8.523l-19.48 33.741c-6.728 11.653-2.562 26.56 9.233 33.037L176 256 33.79 334.093c-11.795 6.477-15.961 21.384-9.232 33.037l19.48 33.741c6.728 11.653 21.721 15.499 33.227 8.523L216 325.282l-3.475 162.204C212.237 500.939 223.064 512 236.52 512h38.961c13.456 0 24.283-11.061 23.995-24.514L296 325.282l138.735 84.111c11.506 6.976 26.499 3.13 33.227-8.523l19.48-33.741c6.728-11.653 2.563-26.559-9.232-33.036z"
                              ></path>
                            </svg>
                          </div>
                          <div>
                            <Form.Item
                              name="course"
                              rules={[
                                {
                                  required: true,
                                  message: 'Course is Require',
                                },
                              ]}
                            >
                              <Select
                                placeholder="please select Course"
                                size="large"
                                disabled={teachingScheduleViewId ? true : null}
                                onChange={(value) => {
                                  setSingleCourses(
                                    getCoursesForTeachingSchedule?.records?.find(
                                      (item) => item?.courseId === value,
                                    ),
                                  );
                                  form.setFieldsValue({
                                    isClassTestInclude: false,
                                    IsmockIncludes: false,
                                  });
                                  setIsClassCapsuleInclude(false);
                                  setIsMockTestInclude(false);
                                }}
                              >
                                {getCoursesForTeachingSchedule?.records?.map((items) => (
                                  <Option key={items?.courseId} value={items?.courseId}>
                                    {items?.productName}
                                  </Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </div>
                        </Col>
                        {singleCourses?.categoryName ||
                        getSingleTeachingSchedules?.scheduleDetail ? (
                          <Col lg={6} xl={6} md={12} sm={24} xs={24}>
                            <p className="pb-2 font-medium ">Category</p>
                            <div>
                              <Form.Item name="categoryName">
                                <Input placeholder="Category " disabled={true} size="large" />
                              </Form.Item>
                            </div>
                          </Col>
                        ) : null}
                        {singleCourses?.subCategoryName ||
                        getSingleTeachingSchedules?.scheduleDetail ? (
                          <Col lg={6} xl={6} md={12} sm={24} xs={24}>
                            <p className="pb-2 font-medium ">Sub Category</p>
                            <div className="">
                              <Form.Item name="subCategory">
                                <Input placeholder="Sub Category" size="large" disabled={true} />
                              </Form.Item>
                            </div>
                          </Col>
                        ) : null}
                        {singleCourses?.mockTestModules ||
                        singleCourses?.contentModules ||
                        getSingleTeachingSchedules?.scheduleDetail?.course?.modules ? (
                          <Col style={{ minWidth: '325px' }}>
                            <p className="pb-2 font-medium ">Module</p>
                            <div>
                              <Form.Item name="module">
                                <Select
                                  placeholder="Module"
                                  disabled
                                  // disabled={teachingScheduleViewId ? true : null}
                                  size="large"
                                  mode="multiple"
                                >
                                  <Option></Option>
                                </Select>
                              </Form.Item>
                            </div>
                          </Col>
                        ) : null}

                        <Col lg={6} xl={6} md={8} sm={24} xs={24}>
                          <div className="flex">
                            <p className="font-medium mb-2">Start date </p>
                            <svg
                              width="5"
                              height="5"
                              aria-hidden="true"
                              focusable="false"
                              data-prefix="fas"
                              data-icon="asterisk"
                              className="svg-inline--fa fa-asterisk fa-w-16 text-red-500 ml-2 mt-1 "
                              role="img"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 512 512"
                            >
                              <path
                                fill="currentColor"
                                d="M478.21 334.093L336 256l142.21-78.093c11.795-6.477 15.961-21.384 9.232-33.037l-19.48-33.741c-6.728-11.653-21.72-15.499-33.227-8.523L296 186.718l3.475-162.204C299.763 11.061 288.937 0 275.48 0h-38.96c-13.456 0-24.283 11.061-23.994 24.514L216 186.718 77.265 102.607c-11.506-6.976-26.499-3.13-33.227 8.523l-19.48 33.741c-6.728 11.653-2.562 26.56 9.233 33.037L176 256 33.79 334.093c-11.795 6.477-15.961 21.384-9.232 33.037l19.48 33.741c6.728 11.653 21.721 15.499 33.227 8.523L216 325.282l-3.475 162.204C212.237 500.939 223.064 512 236.52 512h38.961c13.456 0 24.283-11.061 23.995-24.514L296 325.282l138.735 84.111c11.506 6.976 26.499 3.13 33.227-8.523l19.48-33.741c6.728-11.653 2.563-26.559-9.232-33.036z"
                              ></path>
                            </svg>{' '}
                          </div>
                          <div>
                            <Form.Item
                              name="startDate"
                              rules={[
                                {
                                  required: true,
                                  message: 'Dates are Required',
                                },
                              ]}
                            >
                              <DatePicker
                                onChange={(current) => {
                                  if (current !== null) {
                                    setStartDate(current.valueOf());
                                  }

                                  form.setFieldsValue({
                                    endDate: undefined,
                                  });
                                }}
                                disabled={teachingScheduleViewId ? true : null}
                                size="large"
                                style={{ width: '100%' }}
                              />
                            </Form.Item>
                          </div>
                        </Col>
                        <Col lg={6} xl={6} md={8} sm={24} xs={24}>
                          <div className="flex">
                            <p className="font-medium mb-2">End date</p>
                            <svg
                              width="5"
                              height="5"
                              aria-hidden="true"
                              focusable="false"
                              data-prefix="fas"
                              data-icon="asterisk"
                              className="svg-inline--fa fa-asterisk fa-w-16 text-red-500 ml-2 mt-1 "
                              role="img"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 512 512"
                            >
                              <path
                                fill="currentColor"
                                d="M478.21 334.093L336 256l142.21-78.093c11.795-6.477 15.961-21.384 9.232-33.037l-19.48-33.741c-6.728-11.653-21.72-15.499-33.227-8.523L296 186.718l3.475-162.204C299.763 11.061 288.937 0 275.48 0h-38.96c-13.456 0-24.283 11.061-23.994 24.514L216 186.718 77.265 102.607c-11.506-6.976-26.499-3.13-33.227 8.523l-19.48 33.741c-6.728 11.653-2.562 26.56 9.233 33.037L176 256 33.79 334.093c-11.795 6.477-15.961 21.384-9.232 33.037l19.48 33.741c6.728 11.653 21.721 15.499 33.227 8.523L216 325.282l-3.475 162.204C212.237 500.939 223.064 512 236.52 512h38.961c13.456 0 24.283-11.061 23.995-24.514L296 325.282l138.735 84.111c11.506 6.976 26.499 3.13 33.227-8.523l19.48-33.741c6.728-11.653 2.563-26.559-9.232-33.036z"
                              ></path>
                            </svg>{' '}
                          </div>
                          <div>
                            <Form.Item
                              name="endDate"
                              rules={[
                                {
                                  required: true,
                                  message: 'Dates are Required',
                                },
                              ]}
                            >
                              <DatePicker
                                disabledDate={(current) => current && current.valueOf() < startDate}
                                disabled={teachingScheduleViewId ? true : null}
                                size="large"
                                style={{ width: '100%' }}
                              />
                            </Form.Item>
                          </div>
                        </Col>
                      </Row>
                      <Row gutter={24}>
                        <Col style={{ minWidth: '325px' }}>
                          <div className="">
                            <div>
                              <p className="mb-2 font-medium">Working Days</p>
                              <Form.Item name="workingDays">
                                <Select
                                  style={{ minWidth: '300px' }}
                                  disabled={teachingScheduleViewId ? true : null}
                                  mode="multiple"
                                  size="large"
                                  placeholder="Working Days"
                                  onChange={(values) => {
                                    setMockTestDay(
                                      workingDays?.filter((items) => values.includes(items?.value)),
                                    );
                                  }}
                                >
                                  {workingDays?.map((item) => (
                                    <Option key={item?.value} value={item?.value}>
                                      {item?.name}
                                    </Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            </div>
                          </div>
                        </Col>

                        {IsMockTestInclude === true ? (
                          <Col style={{ minWidth: '325px' }}>
                            <div className="">
                              <p className="font-medium mb-2">Mock test(optional)</p>
                              <Form.Item name="mockTestOn">
                                <Select
                                  disabled={teachingScheduleViewId ? true : null}
                                  mode="multiple"
                                  size="large"
                                  placeholder="Mock test"
                                >
                                  {mockTestDay?.map((item) => (
                                    <Option key={item?.value} value={item?.value}>
                                      {item?.name}
                                    </Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            </div>
                          </Col>
                        ) : null}
                        {IsMockTestInclude === true ? (
                          <Col style={{ marginTop: '30px' }} lg={7} xl={7} md={12} sm={24} xs={24}>
                            <div className="mr-2">
                              <Form.Item name="mockTestOrClass">
                                <Radio.Group
                                  disabled={teachingScheduleViewId ? true : null}
                                  style={{ display: 'flex' }}
                                  size="large"
                                  buttonStyle="solid"
                                >
                                  <Radio.Button value="false">Mock test only</Radio.Button>
                                  <Radio.Button value="true">Mock test And Class</Radio.Button>
                                </Radio.Group>
                              </Form.Item>
                            </div>
                          </Col>
                        ) : null}
                      </Row>
                      <Row gutter={24}>
                        {isClassCapsuleInclude === true ? (
                          <Col lg={6} xl={6} md={12} sm={24} xs={24}>
                            <div className="flex">
                              <p className="font-medium mb-2 mt-4">Select class </p>
                            </div>
                            <Form.Item
                              name="classTest"
                              rules={[
                                {
                                  required: true,
                                  message: 'Please select class test ',
                                },
                              ]}
                            >
                              <Select disabled={true} size="large" placeholder="Class test">
                                {getTeachingCapsuleForClassTest?.records.map((ite) => (
                                  <Option value={ite?.capsuleId} key={ite?.capsuleId}>
                                    {ite?.name}
                                  </Option>
                                ))}
                              </Select>
                            </Form.Item>{' '}
                          </Col>
                        ) : null}
                        {IsMockTestInclude === true ? (
                          <Col lg={6} xl={6} md={12} sm={24} xs={24}>
                            <div>
                              <p className=" font-medium mb-2 mt-4">Select mock test</p>
                              <Form.Item
                                name="mockTest"
                                rules={[
                                  {
                                    required: true,
                                    message: 'Please select mock test',
                                  },
                                ]}
                              >
                                <Select disabled={true} size="large" placeholder="Mock test">
                                  {getTeachingCapsuleForMockTest?.records?.map((items) => (
                                    <Option key={items?.capsuleId} value={items?.capsuleId}>
                                      {items?.name}
                                    </Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            </div>
                          </Col>
                        ) : null}
                      </Row>

                      <Row style={{ display: 'flex', justifyContent: 'end' }}>
                        {teachingScheduleViewId ? (
                          <Col>
                            <div>
                              <Form.Item>
                                <Button
                                  type="primary"
                                  onClick={() => {
                                    history.push(`/upload/teaching-schedule`);
                                  }}
                                  style={{ height: '2.5rem', fontWeight: '500', fontSize: '15px' }}
                                >
                                  Return to table
                                </Button>
                              </Form.Item>
                            </div>
                          </Col>
                        ) : (
                          <div>
                            {teachingScheduleId === undefined ? (
                              <Col>
                                <div>
                                  <Form.Item>
                                    <Button
                                      type="primary"
                                      htmlType="submit"
                                      disabled={isFileSubmit === true}
                                      style={{
                                        height: '2.5rem',
                                        fontWeight: '500',
                                        fontSize: '15px',
                                      }}
                                    >
                                      Submit
                                    </Button>
                                  </Form.Item>
                                </div>
                              </Col>
                            ) : (
                              <Col>
                                <div>
                                  <Form.Item>
                                    <Button
                                      type="primary"
                                      disabled={isFileSubmit === true}
                                      style={{
                                        height: '2.5rem',
                                        fontWeight: '500',
                                        fontSize: '15px',
                                      }}
                                      htmlType="submit"
                                    >
                                      Update
                                    </Button>
                                  </Form.Item>
                                </div>
                              </Col>
                            )}
                          </div>
                        )}
                      </Row>
                    </div>
                  </Spin>
                </div>
              </Card>
            </div>
          </Form>
        </div>
      </Page>
    </>
  );
};
export default connect(({ courses, loading }) => ({
  getCoursesForTeachingSchedule: courses?.getCoursesForTeachingSchedule,
  getTeachingCapsuleForMockTest: courses?.getTeachingCapsuleForMockTest,
  getTeachingCapsuleForClassTest: courses?.getTeachingCapsuleForClassTest,
  getSingleTeachingSchedules: courses?.getSingleTeachingSchedules,
  submitLoading: loading?.effects['courses/uploadTeachingSchedule'],
  getCoursesLoading: loading?.effects['courses/getCourseDetails'],
  getSingleTeachingSchedulesLoading: loading?.effects['courses/getSingleTeachingSchedules'],
  UpdateLoading: loading?.effects['courses/updateTeachingSchedule'],
}))(UploadTeachingSchedule);
