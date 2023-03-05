import React, { useState, useEffect } from 'react';
import { Form, Input, Row, Col, Button, DatePicker, Select, message, Timeline } from 'antd';
import { connect, useParams, history } from 'umi';
import moment from 'moment';
import classes from './index.less';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import CheckValidation from '@/components/CheckValidation';
import emptyStateSvg from '@/assets/icons/space-empty.svg';
import EmptyState from '@/components/EmptyState';
import AppIcons from '@/utils/AppIcons';
import ReactHtmlParser from 'react-html-parser';

dayjs.extend(relativeTime);

const AddAdditionalDays = ({ courseDetails, idx, dispatch, studentActivity }) => {
  const { studentId } = useParams();
  const { Option } = Select;
  const [form] = Form.useForm();
  const [courseId, getCourseId] = useState(idx || null);
  const button = (
    <Button
      onClick={() => {
        form.submit();
      }}
      type="primary"
      size="large"
      // loading={updateing}
    >
      {'Add'}
    </Button>
  );

  const courseDate = courseDetails?.records?.filter((val) => courseId?.includes(val?.id))[0];

  const getActivityRecord = () => {
    dispatch({
      type: 'student/getStudentOwnerActivity',
      payload: {
        pathParams: { studentId },
        query: {
          courseId,
          activityType: 'student_course_extended',
          viewSize: 1000,
        },
      },
    });
  };

  useEffect(() => {
    if (courseId) {
      form.setFieldsValue({
        startDate: moment(courseDate?.startDate),
        endDate: moment(courseDate?.endDate),
      });
    }
    if (idx) {
      form.setFieldsValue({
        course: courseDate?.id,
        startDate: moment(courseDate?.startDate),
        endDate: moment(courseDate?.endDate),
      });
    }
    getActivityRecord();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

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

  const onCommentFinish = (val) => {
    const data = {
      extendDays: val?.days,
    };

    dispatch({
      type: 'student/addExtraDays',
      payload: {
        body: data,
        pathParams: { studentId, courseId },
      },
    }).then((res) => {
      if (res?.status === 'ok') {
        message.success('Additional days added successfully');
        history.push(`/students/${studentId}`);
      } else {
        message.error('Something went wrong!');
      }
    });
  };
  return (
    <div className="-m-8 ">
      <div className="mb-5 bg-white ">
        <div className="pl-8 mt-3 pr-8">
          <Form form={form} onFinish={onCommentFinish} hideRequiredMark autoComplete="off">
            <Row gutter={16}>
              <Col lg={24} xl={24} md={24} sm={24} xs={24}>
                <span className="block mb-2 font-medium text-gray-800">Your course</span>
                <Form.Item
                  name="course"
                  rules={[
                    {
                      required: true,
                      message: 'Please select course!',
                    },
                  ]}
                >
                  {idx ? (
                    <Select
                      size="medium"
                      className="w-full"
                      placeholder="Select department here"
                      onChange={(val) => getCourseId(val)}
                    >
                      <Option key={courseDate?.id} defaultValue={courseDate?.id}>
                        {courseDate?.name}
                      </Option>
                    </Select>
                  ) : (
                    <Select
                      size="medium"
                      className="w-full"
                      placeholder="Select department here"
                      onChange={(val) => getCourseId(val)}
                    >
                      {courseDetails?.records?.map((val) => (
                        <Option key={val?.id} value={val?.id}>
                          {val?.name}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>

              <Col lg={8} xl={8} md={8} sm={24} xs={24}>
                <span className="block mb-2 font-medium text-gray-800">Start date</span>
                <Form.Item
                  name="startDate"
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: 'Please enter Parents name!',
                  //   },
                  // ]}
                >
                  <DatePicker />
                </Form.Item>
              </Col>
              <Col lg={8} xl={8} md={8} sm={24} xs={24}>
                <span className="block mb-2 font-medium text-gray-800">End date</span>
                <Form.Item
                  name="endDate"
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: 'Please enter Parents name!',
                  //   },
                  // ]}
                >
                  <DatePicker
                    onChange={(val) => {
                      if (form.getFieldValue('startDate') !== undefined) {
                        const a = moment(form.getFieldValue('startDate')?.toISOString());
                        const b = moment(val?.toISOString());
                        form.setFieldsValue({
                          days: b.endOf('day').diff(a.startOf('day'), 'days') + 1,
                        });
                      }
                    }}
                  />
                </Form.Item>
              </Col>
              <Col lg={8} xl={8} md={8} sm={24} xs={24}>
                <span className="block mb-2 font-medium text-gray-800">Enter number of days</span>
                <Form.Item
                  name="days"
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: 'Please enter Parents name!',
                  //   },
                  // ]}
                >
                  <Input type="number" size="medium" placeholder="No. of days" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <div className="border-t-2 mt-10 w-full flex justify-end ">
            <div className="mt-2 ">{button}</div>
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
                emptyHeaderText={<span>No owner have been assigned yet!</span>}
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
        </div>
      </div>
    </div>
  );
};
export default connect(({ student, loading }) => ({
  courseDetails: student?.courseDetails,
  studentActivity: student?.getStudentOwnerActivity,
  loadingCourses: loading?.effects['student/getCourseDetails'],
}))(AddAdditionalDays);
