import { Button, Form, Radio, Select, Row, Col, message, Timeline } from 'antd';
import { connect, history } from 'umi';
import React, { useEffect, useState } from 'react';
import CheckValidation, { CheckValidationWithoutDiv } from '@/components/CheckValidation';
import dayjs from 'dayjs';
import AppIcons from '@/utils/AppIcons';
import EmptyState from '@/components/EmptyState';
import emptyStateSvg from '@/assets/icons/space-empty.svg';
import ReactHtmlParser from 'react-html-parser';
import classes from './index.less';

const AssignBatch = ({
  dispatch,
  setShowDrawer,
  showDrawer,
  id,
  idx,
  type,
  studentDetails,
  courseDetails,
  studentActivity,
}) => {
  const [form] = Form.useForm();
  const { Option } = Select;
  const [batchRecord, setBatchRecord] = useState(null);
  const [classDetails, setClassDetails] = useState(null);
  const [courseId, setCourseId] = useState(idx || null);
  const courseDate = courseDetails?.records?.filter((val) => courseId?.includes(val?.id))[0];

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

  const getActivityRecord = () => {
    dispatch({
      type: 'student/getStudentOwnerActivity',
      payload: {
        pathParams: { studentId: id },
        query: {
          courseId,
          activityType: 'batch_assignee',
          viewSize: 1000,
        },
      },
    });
  };

  useEffect(() => {
    getActivityRecord();
    getStudentCourse();

    if (idx) {
      form?.setFieldsValue({
        course: courseDate?.id,
      });
      setCourseId(courseDate?.id);
    }

    dispatch({
      type: 'batch/getBatches',
      payload: {
        query: { isFetchAll: true, programId: courseDate?.id },
      },
    }).then((res) => {
      if (res?.totalCount > 0) setBatchRecord(res);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCommentFinish = (value) => {
    // eslint-disable-next-line no-console
    const data = {
      ...value,
      estimatedCompletionDate: value?.estimatedCompletionDate?.toISOString(),
      estimatedStartDate: value?.estimatedStartDate?.toISOString(),
    };

    delete data.course;

    dispatch({
      type: 'student/addDemoClass',
      payload: {
        body: data,
        pathParams: { studentId: id, batchId: data?.id },
      },
    }).then((res) => {
      if (res?.status === 'ok') {
        message.success('Batch assigned added successfully');
        history.push(`/students/${id}`);
      } else {
        message.error(res?.data?.message);
      }
    });
  };

  const onBatchSelectHandler = (_, option) => {
    const selctedBatch = batchRecord?.records?.filter((item) => item?.id === option?.value);
    const classRec = selctedBatch?.map((item) => item?.classRoom);
    setClassDetails(classRec.pop());
  };
  return (
    <div>
      <Form form={form} onFinish={onCommentFinish} hideRequiredMark autoComplete="off">
        <div className="">
          <div>
            <span className="text-xs font-semibold">{idx ? 'Course' : 'Select course'}</span>
            <Form.Item name="course" rules={[{ required: true, message: 'Please select course' }]}>
              {idx ? (
                <Select
                  size="medium"
                  className="w-full"
                  placeholder="Select department here"
                  onChange={(val) => {
                    setCourseId(val);

                    form.setFieldsValue({ id: undefined });
                    dispatch({
                      type: 'batch/getBatches',
                      payload: {
                        query: { isFetchAll: true, programId: val },
                      },
                    }).then((res) => {
                      if (res?.totalCount > 0) setBatchRecord(res);
                      else {
                        message.error('No batches found!');
                        setBatchRecord(null);
                      }
                    });
                  }}
                >
                  <Option key={courseDate?.id}>{courseDate?.name}</Option>
                </Select>
              ) : (
                <Select
                  size="medium"
                  className="w-full"
                  placeholder="Select department here"
                  onChange={(val) => {
                    setCourseId(val);
                    form.setFieldsValue({ id: undefined });
                    dispatch({
                      type: 'batch/getBatches',
                      payload: {
                        query: { isFetchAll: true, programId: val },
                      },
                    }).then((res) => {
                      if (res?.totalCount > 0) setBatchRecord(res);
                      else {
                        message.error('No batches found!');
                        setBatchRecord(null);
                      }
                    });
                  }}
                >
                  {courseDetails?.records?.map((val) => (
                    <Option key={val?.id} value={val?.id}>
                      {val?.name}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </div>
          {/* <div>
            <Row gutter={16}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <span className="text-xs font-semibold">Start date</span>
                <Form.Item
                  name="estimatedStartDate"
                  rules={[{ required: true, message: 'Please select start date' }]}
                >
                  <DatePicker
                    showTime
                    style={{
                      marginTop: '0.3rem',
                      borderRadius: '0.3rem',
                      width: '100%',
                    }}
                    size="middle"
                    placeholder="Select date"
                    use12Hours={true}
                    format="DD-MM-YYYY HH:mm"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <span className="text-xs font-semibold">End date</span>
                <Form.Item
                  name="estimatedCompletionDate"
                  rules={[{ required: true, message: 'Please select end date' }]}
                >
                  <DatePicker
                    showTime
                    style={{
                      marginTop: '0.3rem',
                      borderRadius: '0.3rem',
                      width: '100%',
                    }}
                    size="middle"
                    placeholder="Select date"
                    use12Hours={true}
                    format="DD-MM-YYYY HH:mm"
                  />
                </Form.Item>
              </Col>
            </Row>
          </div> */}
          <Row gutter={16}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <span className="text-xs font-semibold">Select class mode</span>
              <Form.Item initialValue="ONLINE" name="mode">
                <Radio.Group size="small" style={{ marginTop: '0.5rem' }}>
                  <Radio value="ONLINE">Online</Radio>
                  <Radio value="OFFLINE">Offline</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            {batchRecord && (
              <CheckValidationWithoutDiv show={courseId}>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <span className="text-xs font-semibold">Assign batch</span>
                  <Form.Item name="id" rules={[{ required: true, message: 'Please select batch' }]}>
                    <Select
                      style={{ marginTop: '0.3rem', borderRadius: '0.3rem' }}
                      className="w-full"
                      placeholder="Select batch"
                      size="middle"
                      showSearch
                      onSelect={onBatchSelectHandler}
                    >
                      {batchRecord?.records?.length > 0 &&
                        batchRecord?.records?.map((val) => (
                          <Option key={val?.id} value={val?.id}>
                            {val.name}
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>
                </Col>
              </CheckValidationWithoutDiv>
            )}
          </Row>

          <CheckValidationWithoutDiv show={classDetails}>
            <div>
              <div className="flex justify-between">
                <div className="text-xs">
                  <span className="text-xs font-bold">Class: </span>
                  <span>{classDetails?.name}</span>
                </div>
                <div className="text-xs">
                  <span className="text-xs font-bold">Sitting Capacity: </span>
                  <span>{classDetails?.sittingCapacity}</span>
                </div>
              </div>
              <div className="flex justify-between mt-4">
                <div className="text-xs">
                  <span className="text-xs font-bold">Occupied: </span>
                  <span>{classDetails?.occupiedCapacity}</span>
                </div>
                <div className="text-xs">
                  <span className="text-xs font-bold">Free Seats: </span>
                </div>
              </div>
            </div>
          </CheckValidationWithoutDiv>
        </div>

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

            <Button
              // disabled={!batchRecord || idx}
              type="primary"
              size="large"
              onClick={() => form.submit()}
            >
              Assign
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
              emptyHeaderText={<span>No batches have been assigned yet!</span>}
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

export default connect(({ leads, student, courses, user, batch }) => ({
  studentDetails: student?.studentDetails,
  currentUser: user.currentUser,
  courseDetails: student?.courseDetails,
  editLead: leads.editLead,
  allCourses: courses.allCourses,
  getStudentCourses: student?.getStudentCourses,
  batchRecord: batch?.batchRecord,
  studentActivity: student?.getStudentOwnerActivity,
}))(AssignBatch);
