import { CheckValidationWithoutDiv } from '@/components/CheckValidation';
import { BlackBoard } from '@/utils/AppIcons';
import { Button, Col, DatePicker, Form, message, Modal, Radio, Row, Select, Spin } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect, useParams } from 'umi';

const LeadAddDemoClass = ({
  demoClassModal,
  setDemoClassModal,
  dispatch,
  allCourses,
  currentUser,
  getDemoClass,
  demoClassRecord,
  loadingForAddClass,
  loadingForUpdateClass,
  loadingForsingleClass,
}) => {
  const [batchRecord, setBatchRecord] = useState(null);
  const [classDetails, setClassDetails] = useState(null);
  const [isBatchShow, setIsBatchShow] = useState(false);
  const [assignDemoClass] = Form.useForm();

  const [startValue, setStartValue] = useState();

  const { leadId } = useParams();
  const { Option } = Select;

  useEffect(() => {
    dispatch({
      type: 'courses/getCourses',
      payload: {
        query: { viewSize: 10000 },
      },
    });
  }, []);
  const onCourseSelect = (_, option) => {
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
      setIsBatchShow(true);
    });
    assignDemoClass.setFieldsValue({
      id: undefined,
    });
    setClassDetails('');
  };
  const onBatchSelect = (_, option) => {
    const selctedBatch = batchRecord?.records?.filter((item) => item?.id === option?.value);
    const classRec = selctedBatch?.map((item) => item?.classRoom);
    setClassDetails(classRec.pop());
  };
  const onFinishAssignDemoClass = (value) => {
    const data = {
      ...value,
      estimatedCompletionDate: value?.estimatedCompletionDate?.toISOString(),
      estimatedStartDate: value?.estimatedStartDate?.toISOString(),
    };

    delete data.course;
    if (demoClassRecord) {
      data.id = demoClassRecord?.id;
      dispatch({
        type: 'leads/updateLeadDemoClass',
        payload: {
          body: data,
          pathParams: { leadId },
        },
      }).then((res) => {
        if (res?.status === 'okk') {
          message.success('Demo class has been updated successfully');
          assignDemoClass.resetFields();
          setDemoClassModal(false);
          getDemoClass(0);
          setIsBatchShow(false);
          setClassDetails(null);
        } else {
          message.error('Something went wrong');
        }
      });
    } else {
      dispatch({
        type: 'leads/assignLeadDemoClass',
        payload: {
          body: data,
          pathParams: { leadId },
        },
      }).then((res) => {
        if (res?.status === 'okk') {
          message.success('Demo class has been assigned successfully');
          assignDemoClass.resetFields();
          setDemoClassModal(false);
          getDemoClass(0);
          setIsBatchShow();
          setClassDetails(null);
        } else if (
          res?.data?.message ===
          'Batch has been already assigned to this lead, please assignee another batch'
        ) {
          message.error(
            'Batch has been already assigned to this lead, please assignee another batch',
          );
        } else {
          message.error('Something went wrong');
        }
      });
    }
  };

  useEffect(() => {
    if (demoClassRecord) {
      dispatch({
        type: 'leads/singleLeadDemoClass',
        payload: {
          pathParams: {
            leadId,
            classId: demoClassRecord?.id,
          },
        },
      }).then((res) => {
        if (res?.demoClassDetail?.productId) {
          setIsBatchShow(true);
          onCourseSelect();
        }
        assignDemoClass.setFieldsValue({
          partyGroupId: res?.demoClassDetail?.partyGroupId,
          course: res?.demoClassDetail?.productId,
          estimatedStartDate:
            res?.demoClassDetail?.estimatedStartDate &&
            moment(res?.demoClassDetail?.estimatedStartDate),
          estimatedCompletionDate:
            res?.demoClassDetail?.estimatedCompletionDate &&
            moment(res?.demoClassDetail?.estimatedCompletionDate),
          mode: res?.demoClassDetail?.mode,
          id: res?.demoClassDetail?.workEffortId,
        });
      });
    }
  }, [demoClassRecord]);

  return (
    <div>
      <Modal
        title={
          <div className="border-b pb-3">
            <span className="flex items-center gap-2">
              <span className="" style={{ color: 'rgba(30,58,138)' }}>
                <BlackBoard className=" text-4xl" style={{ color: 'rgba(30,58,138)' }} />
              </span>
              <div className="flex flex-col">
                <span className="font-semibold " style={{ color: 'rgba(30,58,138)' }}>
                  {demoClassRecord ? 'update' : 'Assign'} demo class
                </span>
                <span className="font-normal  text-sm" style={{ color: 'rgba(30,58,138)' }}>
                  {demoClassRecord ? 'update' : 'Assign'} demo clas for the lead here
                </span>
              </div>
            </span>
          </div>
        }
        visible={demoClassModal}
        footer={null}
        onCancel={() => {
          setDemoClassModal(false);
          assignDemoClass.resetFields();
          setIsBatchShow(false);
          setStartValue(null);
          setClassDetails(null);
        }}
      >
        <Spin
          spinning={Boolean(loadingForAddClass || loadingForUpdateClass || loadingForsingleClass)}
        >
          <div className="my-2">
            <Form
              form={assignDemoClass}
              onFinish={(val) => {
                onFinishAssignDemoClass(val);
              }}
            >
              <div className="px-4 mt-2">
                <div>
                  <p className="text-xs font-semibold">Assign demo class of</p>

                  <Form.Item
                    initialValue={
                      currentUser?.personalDetails?.organizationDetails?.orgPartyGroupId
                    }
                    name="partyGroupId"
                    rules={[{ required: true, message: 'Please select assignee of demo class !' }]}
                  >
                    <Radio.Group size="small" style={{ marginTop: '0.5rem' }}>
                      <Radio value="AOB">AOB</Radio>
                      <Radio
                        value={currentUser?.personalDetails?.organizationDetails?.orgPartyGroupId}
                      >
                        Branch
                      </Radio>
                    </Radio.Group>
                  </Form.Item>
                </div>
                <div>
                  <span className="text-xs font-semibold">Select course</span>
                  <Form.Item
                    name="course"
                    rules={[{ required: true, message: 'Please select course' }]}
                  >
                    <Select
                      className="w-full"
                      placeholder="Select course"
                      showSearch
                      onSelect={onCourseSelect}
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
                          onChange={(current) => {
                            setStartValue(current.valueOf());
                            assignDemoClass.setFieldsValue({
                              estimatedCompletionDate: undefined,
                            });
                          }}
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
                  <CheckValidationWithoutDiv show={isBatchShow}>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                      <span className="text-xs font-semibold">Assign batch</span>
                      <Form.Item
                        name="id"
                        rules={[{ required: true, message: 'Please select batch' }]}
                      >
                        <Select
                          style={{ marginTop: '0.3rem', borderRadius: '0.3rem' }}
                          className="w-full"
                          placeholder="Select batch"
                          size="middle"
                          showSearch
                          onSelect={onBatchSelect}
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
                        <span>
                          {classDetails?.sittingCapacity - classDetails?.occupiedCapacity}
                        </span>
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
                      assignDemoClass.resetFields();
                      setDemoClassModal(false);
                    }}
                    className="mr-4"
                  >
                    Cancel
                  </Button>

                  <Button type="primary" size="large" onClick={() => assignDemoClass.submit()}>
                    {demoClassRecord ? 'update' : 'Assign'}
                  </Button>
                </div>
              </div>
            </Form>
          </div>
        </Spin>
      </Modal>
    </div>
  );
};

export default connect(({ courses, user, batch, loading }) => ({
  allCourses: courses?.allCourses,
  currentUser: user?.currentUser,
  batchRecord: batch?.batchRecord,
  loadingForAddClass: loading?.effects['leads/assignLeadDemoClass'],
  loadingForUpdateClass: loading?.effects['leads/updateLeadDemoClass'],
  loadingForsingleClass: loading?.effects['leads/singleLeadDemoClass'],
}))(LeadAddDemoClass);
