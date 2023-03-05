import { Button, DatePicker, Form, Radio, Select, Row, Col, message, Timeline } from 'antd';

import { connect } from 'umi';
import React, { useEffect, useState } from 'react';
import { debounce } from 'lodash';
import CheckValidation, { CheckValidationWithoutDiv } from '@/components/CheckValidation';
import dayjs from 'dayjs';
import AppIcons from '@/utils/AppIcons';
import moment from 'moment';
import _ from '@umijs/deps/compiled/lodash';

const AddDemoClass = ({ dispatch, allCourses, currentUser, editLead, loading }) => {
  const [form] = Form.useForm();
  const { Option } = Select;
  const [courseSearch, setCourseSearch] = useState();
  const [batchRecord, setBatchRecord] = useState(null);
  const [classDetails, setClassDetails] = useState(null);
  const [startValue, setStartValue] = useState(null);
  const [activityRecord, setActivityRecord] = useState(null);

  const getActivity = () =>
    dispatch({
      type: 'leads/getActivity',
      payload: {
        pathParams: {
          leadId: editLead?.leadId,
        },
        query: {
          activityType: 'lead_demo_class',
        },
      },
    })
      .then((res) => {
        setActivityRecord(res);
      })
      .catch(() => {});

  // eslint-disable-next-line no-shadow
  const onCourseSelectHandler = (_, option) => {
    dispatch({
      type: 'batch/getBatches',
      payload: {
        query: { isFetchAll: 'true', programId: option?.value },
      },
    }).then((res) => {
      if (res?.records?.length === 0) {
        message.error('Add batch for this course first !');
      }
      setBatchRecord(res);
    });
    form.setFieldsValue({
      id: undefined,
    });
  };

  useEffect(() => {
    dispatch({
      type: 'courses/getCourses',
      payload: {
        query: { keyword: courseSearch, viewSize: 10000 },
      },
    });
    getActivity();
    if (editLead?.record?.demoClass?.course?.id) {
      onCourseSelectHandler(_, {
        ...editLead?.record?.demoClass,
        value: editLead?.record?.demoClass?.course?.id,
      });
    }

    form.setFieldsValue({
      partyGroupId: editLead?.record?.demoClass?.partyGroupId,
      course: editLead?.record?.demoClass?.course?.id,
      estimatedStartDate:
        editLead?.record?.demoClass?.fromDate && moment(editLead?.record?.demoClass?.fromDate),
      estimatedCompletionDate:
        editLead?.record?.demoClass?.thruDate && moment(editLead?.record?.demoClass?.thruDate),
      mode: editLead?.record?.demoClass?.mode,
      id: editLead?.record?.demoClass?.batch?.id,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseSearch, dispatch, editLead]);

  const action = (value) => {
    setCourseSearch(value);
  };

  const onSearchChange = debounce(action, 400);

  const onCommentFinish = (value) => {
    // eslint-disable-next-line no-console

    const data = {
      ...value,
      estimatedCompletionDate: value?.estimatedCompletionDate?.toISOString(),
      estimatedStartDate: value?.estimatedStartDate?.toISOString(),
    };

    delete data.course;

    dispatch({
      type: 'leads/addDemoClass',
      payload: {
        body: data,
        pathParams: { leadId: editLead?.leadId },
      },
    }).then((res) => {
      if (res?.status === 'ok') {
        message.success('Demo class is added successfully');
        getActivity();
        form.resetFields();
        dispatch({
          type: 'leads/setStates',
          payload: {
            visible: false,
            type: null,
            title: null,
            leadId: null,
          },
          key: 'editLead',
        });
      } else {
        message.error(res?.data?.message);
      }
    });
  };

  // eslint-disable-next-line no-shadow
  const onBatchSelectHandler = (_, option) => {
    const selctedBatch = batchRecord?.records?.filter((item) => item?.id === option?.value);
    const classRec = selctedBatch?.map((item) => item?.classRoom);
    setClassDetails(classRec.pop());
  };

  // const demoClassStatus = [
  //   {
  //     value: 'SCHEDULED',
  //     name: 'Scheduled',
  //   },
  //   {
  //     value: 'RUNNING',
  //     name: 'Running',
  //   },
  //   {
  //     value: 'COMPLETED',
  //     name: 'Completed',
  //   },
  //   {
  //     value: 'NOT_ATTENDED',
  //     name: 'Not attended',
  //   },
  //   {
  //     value: 'NOT_COMPLETED',
  //     name: 'Not completed',
  //   },
  // ];

  return (
    <div>
      <Form form={form} onFinish={onCommentFinish} hideRequiredMark autoComplete="off">
        <div className="px-4 mt-2">
          <div>
            <p className="text-xs font-semibold">Assign demo class of</p>

            <Form.Item
              initialValue={currentUser?.personalDetails?.organizationDetails?.orgPartyGroupId}
              name="partyGroupId"
              rules={[{ required: true, message: 'Please select assignee of demo class !' }]}
            >
              <Radio.Group size="small" style={{ marginTop: '0.5rem' }}>
                <Radio value="AOB">AOB</Radio>
                <Radio value={currentUser?.personalDetails?.organizationDetails?.orgPartyGroupId}>
                  Branch
                </Radio>
              </Radio.Group>
            </Form.Item>
          </div>
          <div>
            <span className="text-xs font-semibold">Select course</span>
            <Form.Item name="course" rules={[{ required: true, message: 'Please select course' }]}>
              <Select
                className="w-full"
                placeholder="Select course"
                showSearch
                onSelect={onCourseSelectHandler}
                onSearch={(val) => onSearchChange(val)}
                getPopupContainer={(node) => node.parentNode}
              >
                {allCourses?.records?.length > 0 &&
                  allCourses?.records?.map((val) => (
                    <Option key={val?.id} value={val?.id}>
                      {val.displayName}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </div>
          <div>
            <Row gutter={16}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <span className="text-xs font-semibold">Start date</span>
                <Form.Item
                  name="estimatedStartDate"
                  rules={[{ required: true, message: 'Please select start date' }]}
                >
                  <DatePicker
                    use12Hours={true}
                    showTime
                    format="DD-MM-YYYY HH:mm"
                    style={{
                      marginTop: '0.3rem',
                      borderRadius: '0.3rem',
                      width: '100%',
                    }}
                    size="middle"
                    placeholder="Select date"
                    onChange={(current) => current && setStartValue(current.valueOf())}
                    getPopupContainer={(node) => node.parentNode}
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
                    use12Hours={true}
                    showTime
                    format="DD-MM-YYYY HH:mm"
                    style={{
                      marginTop: '0.3rem',
                      borderRadius: '0.3rem',
                      width: '100%',
                    }}
                    size="middle"
                    placeholder="Select date"
                    disabledDate={(current) => current && current.valueOf() < startValue}
                    getPopupContainer={(node) => node.parentNode}
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>
          <Row gutter={16}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <span className="text-xs font-semibold">Select class mode</span>
              <Form.Item
                initialValue="ONLINE"
                name="mode"
                rules={[{ required: true, message: 'Please select mode of demo class !' }]}
              >
                <Radio.Group size="small" style={{ marginTop: '0.5rem' }}>
                  <Radio value="ONLINE">Online</Radio>
                  <Radio value="OFFLINE">Offline</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <CheckValidationWithoutDiv show={form.getFieldValue('course')}>
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
                    getPopupContainer={(node) => node.parentNode}
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
          </Row>
          {/* <Row gutter={16}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <span className="text-xs font-semibold">Select status of demo class</span>
              <Form.Item
                // initialValue="ONLINE"
                name="statusDemoClass"
                rules={[{ required: true, message: 'Please select mode of demo class !' }]}
              >
                <Radio.Group size="small" style={{ marginTop: '0.5rem' }}>
                  {demoClassStatus?.map((item) => (
                    <Radio value={item?.value} key={item?.value}>
                      {item?.name}
                    </Radio>
                  ))}
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row> */}

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
              marginTop: 25,
              marginRight: 20,
            }}
            className="flex justify-end "
          >
            <Button
              size="large"
              onClick={() => {
                dispatch({
                  type: 'leads/setStates',
                  payload: {
                    visible: false,
                    type: null,
                    title: null,
                    leadId: null,
                  },
                  key: 'editLead',
                });
              }}
              className="mr-4"
            >
              Cancel
            </Button>

            <Button type="primary" size="large" onClick={() => form.submit()} loading={loading}>
              Assign
            </Button>
          </div>
        </div>
        <div className="flex justify-between p-8 ">
          <span>
            Showing <span className="text-blue-600">{activityRecord?.records?.length}</span>
            {` `} of{` `}
            <span className="text-green-600">{activityRecord?.totalCount}</span>
          </span>
        </div>

        <CheckValidation show={activityRecord?.records?.length > 0} />
        <div className="px-4">
          <Timeline className="w-full">
            {activityRecord?.records?.map((rec, index) => (
              <>
                <Timeline.Item
                  dot={
                    <div
                      className="flex items-center justify-center w-8 h-8 text-white rounded-full"
                      style={{ backgroundColor: '#ffa500' }}
                    >
                      <AppIcons.CardText />
                    </div>
                  }
                  key={index}
                >
                  <div className="flex justify-between pl-6">
                    <div className="flex-wrap w-full">
                      <div className="flex justify-between">
                        <div>
                          <span className="font-semibold text-blue-600">Demo class Added</span>{' '}
                          <p>{rec?.description}</p>{' '}
                        </div>
                        <div>
                          <div className="text-right text-gray-400">
                            <div className="text-xs italic text-gray-800">
                              {dayjs(rec?.startTime).fromNow()}
                            </div>
                          </div>
                        </div>
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

export default connect(({ leads, courses, user, batch, loading }) => ({
  currentUser: user.currentUser,
  editLead: leads.editLead,
  allCourses: courses.allCourses,
  batchRecord: batch?.batchRecord,
  loading: loading?.effects['leads/addDemoClass'],
}))(AddDemoClass);
