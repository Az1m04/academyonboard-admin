import React, { useEffect, useState } from 'react';
import { Form, Modal, Select, Radio, Row, Input, Button, Col, message, Spin } from 'antd';
import { Envelope, WhatsApp } from '@/utils/AppIcons';
import CheckValidation from '@/components/CheckValidation';
import { CardHeading } from 'react-bootstrap-icons';
import { AppstoreAddOutlined, DownloadOutlined } from '@ant-design/icons';
import { connect, useParams } from 'umi';

const AddLeadAssessmentTest = ({
  addAssessmentModal,
  setAddAssessmentModal,
  assessmentTest,
  dispatch,
  getLeadAllAssessmentTest,
  singleAssessmentTest,
  setSingleAssessmentTest,
  loadingForAssessmentTest,
  loadingForUpdateAssessmentTest,
  loadingForGetAssessmentTest,
}) => {
  const [assignTestMode, setAssignTestMode] = useState(null);
  const [checktestStatus, setCheckTestStatus] = useState('');

  const [statusDisable, setStatusDisable] = useState({
    assigned: false,
    running: false,
    completed: false,
    notAttended: false,
    notCompleted: false,
  });

  const [assessmentForm] = Form.useForm();
  const { leadId } = useParams();
  const { Option } = Select;
  const handleCancel = () => {
    setAddAssessmentModal(false);
  };
  const testStatus = [
    {
      value: 'TEST_ASSIGNED',
      name: 'Assigned',
    },
    {
      value: 'TEST_RUNNING',
      name: 'Running',
    },
    {
      value: 'TEST_COMPLETED',
      name: 'Completed',
    },
    {
      value: 'TEST_NOT_ATTENDED',
      name: 'Not attended',
    },
    {
      value: 'TEST_NOT_COMPLETED',
      name: 'Not completed',
    },
  ];
  const getSingleAssessmentTest = (val) => {
    dispatch({
      type: 'leads/getParticularAssessmentTest',
      payload: {
        pathParams: { leadId },
        query: {
          testId: val,
        },
      },
    });
  };
  const onAssignAssesmentFinish = (values) => {
    const data = {
      ...values,
      //   notificationMode: assesTestNotificationMode,
      marks: +values?.marks,
      obtainedMarks: +values?.obtainedMarks,

      test: {
        ...values?.test,
        testTypeId: 'ASSESS_TST',
        statusId: values?.statusId,
      },
    };
    if (singleAssessmentTest) {
      dispatch({
        type: 'leads/updateLeadAssessmentTest',
        payload: {
          body: data,
          pathParams: {
            leadId,
            testId: values?.test?.id,
          },
        },
      }).then((res) => {
        if (res?.responseMessage === 'success') {
          message.success('You have updated assessment test successfully');
          assessmentForm.resetFields();
          setAddAssessmentModal(false);
          getLeadAllAssessmentTest();
          setSingleAssessmentTest('');
        } else {
          message.error(res?.data?.message);
          assessmentForm.resetFields();
        }
      });
    } else {
      dispatch({
        type: 'leads/addAssignAssessmentTest',
        payload: {
          body: data,
          pathParams: {
            leadId,
          },
        },
      }).then((res) => {
        if (res?.status === 'ok') {
          message.success('You have added assessment test successfully');
          assessmentForm.resetFields();
          setAddAssessmentModal(false);
          getLeadAllAssessmentTest();
          setSingleAssessmentTest('');
        } else {
          message.error(res?.data?.message);
          assessmentForm.resetFields();
        }
      });
    }
  };
  useEffect(() => {
    if (singleAssessmentTest?.testId && addAssessmentModal) {
      dispatch({
        type: 'leads/getSingleLeadAssessmentTest',
        payload: {
          pathParams: {
            leadId,
          },
          query: {
            testId: singleAssessmentTest?.testId,
          },
        },
      }).then((res) => {
        if (res?.[0]?.testStatusId) {
          setCheckTestStatus(res?.[0]?.testStatusId);
          getSingleAssessmentTest(res?.[0]?.testId);
        }
        if (res && res[0]?.mode === 'ONLINE') {
          setAssignTestMode(res[0]?.mode);
          assessmentForm.setFieldsValue({
            link: res?.[0]?.link ? res?.[0]?.link : undefined,
            remarks: res?.[0]?.remarks ? res?.[0]?.remarks : undefined,
          });
        }
        if (res && res[0]?.mode === 'OFFLINE') {
          setAssignTestMode(res?.[0]?.mode);
          assessmentForm.setFieldsValue({
            link: res?.[0]?.link ? res?.[0]?.link : undefined,
            remarks: res?.[0]?.remarks ? res?.[0]?.remarks : undefined,
            marks: res?.[0]?.marks ? res?.[0]?.marks : undefined,
            obtainedMarks: res?.[0]?.obtainedMarks ? res?.[0]?.obtainedMarks : undefined,
          });
        }
        assessmentForm.setFieldsValue({
          test: {
            id: res?.[0]?.testId,
          },
          diffLevel: res?.[0]?.difficultyLevelId,
          mode: res?.[0]?.mode,
          statusId: res?.[0]?.testStatusId,
        });
      });
    }
  }, [singleAssessmentTest]);

  return (
    <div>
      <Modal
        title={
          <div className="border-b pb-3">
            <span className="flex items-center gap-2">
              <span className="" style={{ color: 'rgba(30,58,138)' }}>
                <AppstoreAddOutlined className=" text-4xl" style={{ color: 'rgba(30,58,138)' }} />
              </span>
              <div className="flex flex-col">
                <span className="font-semibold " style={{ color: 'rgba(30,58,138)' }}>
                  {singleAssessmentTest ? 'Update' : 'Add'} assessment test
                </span>
                <span className="font-normal  text-sm" style={{ color: 'rgba(30,58,138)' }}>
                  {singleAssessmentTest ? 'Update' : 'Add'} assessment test for the lead here
                </span>
              </div>
            </span>
          </div>
        }
        visible={addAssessmentModal}
        footer={null}
        onCancel={handleCancel}
      >
        <div className="my-2">
          <Form form={assessmentForm} onFinish={onAssignAssesmentFinish}>
            <Spin
              spinning={Boolean(
                loadingForAssessmentTest ||
                  loadingForUpdateAssessmentTest ||
                  loadingForGetAssessmentTest,
              )}
            >
              <Row gutter={24}>
                <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                  <div>
                    <span className="text-xs font-semibold">Choose assessment test</span>

                    <Form.Item
                      name={['test', 'id']}
                      rules={[{ required: true, message: 'Please select test to proceed!' }]}
                    >
                      <Select
                        placeholder="Please choose assessment test"
                        onChange={(val) => {
                          getSingleAssessmentTest(val);
                        }}
                      >
                        {assessmentTest?.records?.map((item) => (
                          <Option key={item?.id} value={item?.id}>
                            {item?.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col xl={14} lg={14} md={14} sm={14} xs={14}>
                  <div>
                    <p className="text-xs font-medium mb-1">Select Diffuilty Level</p>
                    <Form.Item
                      name="diffLevel"
                      initialValue="EASY"
                      rules={[
                        {
                          required: true,
                          message: 'Please select diff level',
                        },
                      ]}
                    >
                      <Radio.Group buttonStyle="solid">
                        <Radio.Button value="EASY">Easy</Radio.Button>
                        <Radio.Button value="INTERMEDIATE">Intermediate</Radio.Button>
                        <Radio.Button value="HARD">Hard</Radio.Button>
                      </Radio.Group>
                    </Form.Item>
                  </div>
                </Col>
                <Col xl={10} lg={10} md={10} sm={10} xs={10}>
                  <div>
                    <p className="text-xs font-semibold">Select test mode</p>
                    <Form.Item
                      name="mode"
                      rules={[
                        {
                          required: true,
                          message: 'Please select test mode to proceed!',
                        },
                      ]}
                    >
                      <Radio.Group
                        size="small"
                        onChange={(values) => {
                          assessmentForm.setFieldsValue({
                            link: undefined,
                            remarks: undefined,
                            marks: undefined,
                            obtainedMarks: undefined,
                            statusId: undefined,
                          });
                          setStatusDisable({
                            assigned: false,
                            running: false,
                            completed: false,
                            notAttended: false,
                            notCompleted: false,
                          });
                          setCheckTestStatus('');
                          setAssignTestMode(values?.target?.value);
                        }}
                      >
                        <Radio value="ONLINE">Online</Radio>
                        <Radio value="OFFLINE">Offline</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </div>
                </Col>
              </Row>
              <CheckValidation show={assignTestMode === 'OFFLINE'}>
                <Col>
                  <div>
                    <p className="text-xs font-semibold">Select assessment test status</p>
                    <Form.Item
                      name="statusId"
                      rules={[
                        {
                          required: true,
                          message: 'Please select any test status',
                        },
                      ]}
                    >
                      <Radio.Group
                        size="small"
                        onChange={(value) => {
                          assessmentForm.setFieldsValue({
                            link: undefined,
                            remarks: undefined,
                            marks: undefined,
                            obtainedMarks: undefined,
                          });
                          setCheckTestStatus(value?.target?.value);
                        }}
                      >
                        {testStatus?.map((item) => (
                          <Radio
                            value={item?.value}
                            key={item?.value}
                            disabled={
                              (item?.value === 'TEST_ASSIGNED' && statusDisable?.assigned) ||
                              (item?.value === 'TEST_RUNNING' && statusDisable?.running) ||
                              (item?.value === 'TEST_COMPLETED' && statusDisable?.completed) ||
                              (item?.value === 'TEST_NOT_ATTENDED' && statusDisable?.notAttended) ||
                              (item?.value === 'TEST_NOT_COMPLETED' && statusDisable?.notCompleted)
                            }
                          >
                            {item?.name}
                          </Radio>
                        ))}
                      </Radio.Group>
                    </Form.Item>
                  </div>
                </Col>
              </CheckValidation>
              <CheckValidation show={assignTestMode === 'ONLINE'}>
                <Col>
                  {/* <CheckValidation show={checktestStatus === 'TEST_ASSIGNED'}> */}
                  <p className="text-xs font-semibold">Test link</p>
                  <div className="flex">
                    <Form.Item
                      name="link"
                      rules={[
                        {
                          required: true,
                          message: 'Please enter test link to proceed',
                        },
                      ]}
                    >
                      <Input placeholder="Test link " />
                    </Form.Item>

                    <Button
                      type="primary"
                      className="ml-2 cursor-pointer"
                      //   onClick={(event) => {
                      //     setVisibleWhatsApp(true);
                      //   }}
                    >
                      <WhatsApp />
                    </Button>
                    <Button
                      type="primary"
                      className="ml-2 cursor-pointer"
                      //   onClick={() => {
                      //     setVisibleEmail(true);
                      //   }}
                    >
                      <Envelope />
                    </Button>
                    <Button
                      type="primary"
                      className="ml-2 cursor-pointer"
                      //   onClick={() => {
                      //     setIsPhoneVisible(true);
                      //   }}
                    >
                      <CardHeading style={{ fontSize: '1rem' }} />
                    </Button>
                  </div>
                  {/* </CheckValidation> */}
                </Col>
                <div className="">
                  <Row>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                      <span className="text-xs font-semibold">Remarks</span>
                      <Form.Item
                        name="remarks"
                        rules={[{ required: true, message: 'Please enter some remarks !' }]}
                      >
                        <Input
                          placeholder="Please enter remarks"
                          getPopupContainer={(node) => node.parentNode}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              </CheckValidation>
              <CheckValidation show={assignTestMode === 'OFFLINE'}>
                <p className="text-xs font-semibold ">Download test</p>
                <div className="flex">
                  <Form.Item
                    // noStyle
                    name="link"
                    rules={[{ required: true, message: 'Please enter test link !' }]}
                    style={{ width: '100%' }}
                  >
                    <Input
                      getPopupContainer={(node) => node.parentNode}
                      // onChange={(ev) => {
                      //   if (ev.target.value && !isLinkFieldTouched) {
                      //     setIsLinkFieldTouched(true);
                      //   } else if (!ev.target.value && isLinkFieldTouched) {
                      //     setIsLinkFieldTouched(false);
                      //   }
                      // }}
                      placeholder="Test link "
                    />
                  </Form.Item>
                  <Button
                    style={{ width: '10%' }}
                    // disabled={!isLinkFieldTouched}
                    type="primary"
                    icon={<DownloadOutlined />}
                  />
                </div>

                <div className="">
                  <CheckValidation
                    show={assignTestMode === 'OFFLINE' && checktestStatus === 'TEST_COMPLETED'}
                  >
                    <span className="font-semibold text-md">Result</span>
                    <Row gutter={16} className="pt-2">
                      <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <span className="text-xs font-semibold">Total marks</span>
                        <Form.Item
                          name="marks"
                          rules={[{ required: true, message: 'Please enter total   marks!' }]}
                        >
                          <Input
                            type="number"
                            placeholder="Please enter total marks"
                            getPopupContainer={(node) => node.parentNode}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <span className="text-xs font-semibold">Obtained marks</span>
                        <Form.Item
                          name="obtainedMarks"
                          rules={[{ required: true, message: 'Please enter obtained marks !' }]}
                        >
                          <Input
                            type="number"
                            placeholder="Please enter obtained marks"
                            getPopupContainer={(node) => node.parentNode}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </CheckValidation>

                  <Row>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                      <span className="text-xs font-semibold">Remarks</span>
                      <Form.Item
                        name="remarks"
                        rules={[{ required: true, message: 'Please enter some remarks !' }]}
                      >
                        <Input
                          placeholder="Please enter remarks"
                          getPopupContainer={(node) => node.parentNode}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              </CheckValidation>

              <div className="flex justify-end ">
                <Button
                  onClick={() => {
                    setAddAssessmentModal(false);
                    assessmentForm.resetFields();
                  }}
                  size="middle"
                  className="mr-4"
                >
                  Cancel
                </Button>

                <Button type="primary" size="niddle" htmlType="submit">
                  {singleAssessmentTest ? 'Update' : 'Add'}
                </Button>
              </div>
            </Spin>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default connect(({ loading }) => ({
  loadingForAssessmentTest: loading?.effects['leads/addAssignAssessmentTest'],
  loadingForUpdateAssessmentTest: loading?.effects['leads/updateLeadAssessmentTest'],
  loadingForGetAssessmentTest: loading?.effects['leads/getLeadAssessmentTest'],
}))(AddLeadAssessmentTest);
