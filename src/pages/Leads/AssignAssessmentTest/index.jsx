/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Radio, Select, Row, Col, message } from 'antd';
import { Envelope, PhoneIcon, WhatsApp } from '@/utils/AppIcons';
import { connect } from 'umi';
import { DownloadOutlined } from '@ant-design/icons';
import CheckValidation from '@/components/CheckValidation';
import GenerateLeadWhatsAppMessage from '@/components/GenerateWhatsAppMessage';
import GenerateLeadEmail from '@/components/GenerateEmail';
import GenerateLeadPhone from '@/components/GeneratePhone';
import { CardHeading, SdCard } from 'react-bootstrap-icons';

const { Option } = Select;

const AssignAssessmentTest = ({
  dispatch,
  editLead,
  assessmentTest,
  loading,
  getParticularAssessmentTest,
  downloadAssessmentTest,
  courseId,
}) => {
  const [form] = Form.useForm();
  const [recordDetails, setRecordDetails] = useState([]);
  const [assignTestMode, setAssignTestMode] = useState(null);
  const [testStatusCheck, setTestStatusCheck] = useState('');
  const [visibleWhatsApp, setVisibleWhatsApp] = useState(false);
  const [visibleEmail, setVisibleEmail] = useState(false);
  const [isPhoneVisible, setIsPhoneVisible] = useState(false);
  const [isLinkFieldTouched, setIsLinkFieldTouched] = useState(false);
  const [assesTestNotificationMode, setAssesTestNotificationMode] = useState('');
  const [toggleAssignButton, setToggleAssignButton] = useState(false);
  const [disableStatus, setDisableStatus] = useState({
    assigned: false,
    running: false,
    completed: false,
    notAttended: false,
    notCompleted: false,
  });
  const [assessmentTestId, setAssessmentTestId] = useState();

  useEffect(() => {
    setRecordDetails([editLead?.record]);
  }, [editLead, visibleWhatsApp, visibleEmail, isPhoneVisible]);

  const onAssignAssesmentFinish = (values) => {
    const data = {
      ...values,
      notificationMode: assesTestNotificationMode,
      marks: +values?.marks,
      obtainedMarks: +values?.obtainedMarks,
      link: values?.downloadLink,

      test: {
        ...values?.test,
        testTypeId: 'ASSESS_TST',
        statusId: values?.statusId,
      },
    };

    if (
      toggleAssignButton ||
      (getParticularAssessmentTest?.length > 0 &&
        getParticularAssessmentTest[0]?.testStatusId !== 'TEST_COMPLETED')
    ) {
      dispatch({
        type: 'leads/updateAssignAssessmentTest',
        payload: {
          body: data,
          pathParams: {
            testId: values?.test?.id,
            leadId: editLead?.leadId,
          },
        },
      }).then((res) => {
        if (res?.status === 'ok') {
          message.success('You have added assessment test successfully');
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
          form.resetFields();
          setToggleAssignButton(false);
        }
      });
    } else {
      dispatch({
        type: 'leads/addAssignAssessmentTest',
        payload: {
          body: data,
          pathParams: {
            leadId: editLead?.leadId,
          },
        },
      }).then((res) => {
        if (res?.status === 'ok') {
          message.success('You have added assessment test successfully');
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
          form.resetFields();
        }
      });
    }
  };
  useEffect(() => {
    dispatch({
      type: 'leads/getAssessmentTest',
      payload: {
        query: {
          testTypeId: 'ASSESS_TST',
          leadId: editLead?.leadId,
          courseId,
          viewSize: 1000,
        },
      },
    });

    if (editLead?.record?.testDetail && editLead?.record?.testDetail[0].testId) {
      setToggleAssignButton(true);
    }
    if (
      editLead?.record?.testDetail &&
      editLead?.record?.testDetail?.[0]?.testStatusId === 'TEST_COMPLETED'
    ) {
      setDisableStatus({
        assigned: true,
        running: true,
        completed: false,
        notAttended: true,
        notCompleted: true,
      });
    }
    setTestStatusCheck(
      editLead?.record?.testDetail && editLead?.record?.testDetail?.[0]?.testStatusId,
    );
    if (editLead?.record?.testDetail && editLead?.record?.testDetail[0]?.mode === 'ONLINE') {
      setAssignTestMode(editLead?.record?.testDetail[0]?.mode);
      form.setFieldsValue({
        link: editLead?.record?.testDetail?.[0]?.link
          ? editLead?.record?.testDetail?.[0]?.link
          : undefined,
        remarks: editLead?.record?.testDetail?.[0]?.remarks
          ? editLead?.record?.testDetail?.[0]?.remarks
          : undefined,
      });
    }
    if (editLead?.record?.testDetail && editLead?.record?.testDetail[0]?.mode === 'OFFLINE') {
      setAssignTestMode(editLead?.record?.testDetail?.[0]?.mode);
      form.setFieldsValue({
        downloadLink: editLead?.record?.testDetail?.[0]?.link
          ? editLead?.record?.testDetail?.[0]?.link
          : undefined,
        remarks: editLead?.record?.testDetail?.[0]?.remarks
          ? editLead?.record?.testDetail?.[0]?.remarks
          : undefined,
        marks: editLead?.record?.testDetail?.[0]?.marks
          ? editLead?.record?.testDetail?.[0]?.marks
          : undefined,
        obtainedMarks: editLead?.record?.testDetail?.[0]?.obtainedMarks
          ? editLead?.record?.testDetail?.[0]?.obtainedMarks
          : undefined,
      });
    }
    form.setFieldsValue({
      test: { id: editLead?.record?.testDetail && editLead?.record?.testDetail[0]?.testId },
      mode: editLead?.record?.testDetail && editLead?.record?.testDetail[0]?.mode,
      statusId: editLead?.record?.testDetail && editLead?.record?.testDetail?.[0]?.testStatusId,
    });
  }, [dispatch]);

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
  const getSingleAssessmentTest = (testId, singlecourseId) => {
    dispatch({
      type: 'leads/downloadAssessmentTest',
      payload: {
        pathParams: {
          testId,
          courseId: singlecourseId,
        },
      },
    }).then((res) => {
      form.setFieldsValue({
        downloadLink: res?.applicationUrl,
      });
    });
  };

  const donwloadAssessmentTest = (attachment) => {
    const urll = attachment;
    fetch(
      `${urll}`,
      // , {
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     accessToken: localStorage.getItem('accessToken'),
      //   },
      // }
    ).then((response) => {
      response.blob().then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `question paper pdf`;
        // setLoadingToDownload(false);
        a.click();
      });
    });
  };

  return (
    <div>
      <Form
        form={form}
        onFinish={onAssignAssesmentFinish}
        onValuesChange={(changedValues) => {
          if (changedValues?.mode) {
            setAssignTestMode(changedValues?.mode);
          }

          if (changedValues?.statusId) {
            setTestStatusCheck(changedValues?.statusId);
          }
        }}
      >
        <div className="mx-4 my-4">
          <div>
            <span className="text-xs font-semibold">Choose assessment test</span>
            <Form.Item
              name={['test', 'id']}
              rules={[{ required: true, message: 'Please select test to proceed!' }]}
            >
              <Select
                className="w-full"
                placeholder="Choose test"
                getPopupContainer={(node) => node.parentNode}
                onChange={(testId, props) => {
                  setAssessmentTestId(testId);
                  dispatch({
                    type: 'leads/getParticularAssessmentTest',
                    payload: {
                      pathParams: { leadId: editLead?.leadId },
                      query: {
                        testId,
                      },
                    },
                  }).then((res) => {
                    if (res?.length > 0 && res[0]?.testId) {
                      if (res[0]?.mode === 'ONLINE') {
                        setAssignTestMode(res[0]?.mode);
                        form.setFieldsValue({
                          link: res?.[0]?.link ? res?.[0]?.link : undefined,
                          remarks: res?.[0]?.remarks ? res?.[0]?.remarks : undefined,
                        });
                      }
                      if (res[0]?.mode === 'OFFLINE') {
                        setAssignTestMode(res?.[0]?.mode);
                        form.setFieldsValue({
                          downloadLink: res?.[0]?.link ? res?.[0]?.link : undefined,
                          remarks: res?.[0]?.remarks ? res?.[0]?.remarks : undefined,
                          marks: res?.[0]?.marks ? res?.[0]?.marks : undefined,
                          obtainedMarks: res?.[0]?.obtainedMarks
                            ? res?.[0]?.obtainedMarks
                            : undefined,
                        });
                      }
                      if (res?.[0]?.testStatusId === 'TEST_COMPLETED') {
                        setDisableStatus({
                          assigned: true,
                          running: true,
                          completed: false,
                          notAttended: true,
                          notCompleted: true,
                        });
                      } else {
                        setDisableStatus({
                          assigned: false,
                          running: false,
                          completed: false,
                          notAttended: false,
                          notCompleted: false,
                        });
                      }
                      form.setFieldsValue({
                        test: { id: res[0]?.testId },
                        mode: res[0]?.mode,
                        statusId: res?.[0]?.testStatusId,
                      });
                      setTestStatusCheck(res?.[0]?.testStatusId);
                      setToggleAssignButton(true);
                    } else {
                      getSingleAssessmentTest(testId, props?.item?.course?.id);
                      message.error('This test is not assigned yet!');

                      form.setFieldsValue({
                        link: undefined,
                        remarks: undefined,
                        marks: undefined,
                        obtainedMarks: undefined,
                        mode: undefined,
                        statusId: undefined,
                      });
                      setAssignTestMode(null);

                      setTestStatusCheck('');
                      setToggleAssignButton(false);
                    }
                  });
                }}
              >
                {assessmentTest?.records?.map((val) => (
                  <Option key={val.id} item={val} value={val.id}>
                    <span>{val.name}</span>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>
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
                onChange={() => {
                  form.setFieldsValue({
                    // link: undefined,
                    remarks: undefined,
                    marks: undefined,
                    obtainedMarks: undefined,
                    statusId: undefined,
                  });
                  setDisableStatus({
                    assigned: false,
                    running: false,
                    completed: false,
                    notAttended: false,
                    notCompleted: false,
                  });
                  setTestStatusCheck('');
                }}
              >
                <Radio value="ONLINE">Online</Radio>
                <Radio value="OFFLINE">Offline</Radio>
              </Radio.Group>
            </Form.Item>
          </div>
          {assignTestMode === 'OFFLINE' && (
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
                  onChange={() =>
                    form.setFieldsValue({
                      // link: undefined,
                      remarks: undefined,
                      marks: undefined,
                      obtainedMarks: undefined,
                    })
                  }
                >
                  {testStatus?.map((item) => (
                    <Radio
                      value={item?.value}
                      key={item?.value}
                      disabled={
                        (item?.value === 'TEST_ASSIGNED' && disableStatus?.assigned) ||
                        (item?.value === 'TEST_RUNNING' && disableStatus?.running) ||
                        (item?.value === 'TEST_COMPLETED' && disableStatus?.completed) ||
                        (item?.value === 'TEST_NOT_ATTENDED' && disableStatus?.notAttended) ||
                        (item?.value === 'TEST_NOT_COMPLETED' && disableStatus?.notCompleted)
                      }
                    >
                      {item?.name}
                    </Radio>
                  ))}
                </Radio.Group>
              </Form.Item>
            </div>
          )}
          <CheckValidation show={assignTestMode === 'ONLINE'}>
            {/* <CheckValidation show={testStatusCheck === 'TEST_ASSIGNED'}> */}
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
                onClick={(event) => {
                  setVisibleWhatsApp(true);
                }}
              >
                <WhatsApp />
              </Button>
              <Button
                type="primary"
                className="ml-2 cursor-pointer"
                onClick={() => {
                  setVisibleEmail(true);
                }}
              >
                <Envelope />
              </Button>
              <Button
                type="primary"
                className="ml-2 cursor-pointer"
                onClick={() => {
                  setIsPhoneVisible(true);
                }}
              >
                <CardHeading style={{ fontSize: '1rem' }} />
              </Button>
            </div>
            {/* </CheckValidation> */}
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
                name="downloadLink"
                rules={[{ required: true, message: 'Please enter test link !' }]}
                style={{ width: '100%' }}
              >
                <Input
                  getPopupContainer={(node) => node.parentNode}
                  // disabled
                  onChange={(ev) => {
                    // if (ev.target.value && !isLinkFieldTouched) {
                    //   setIsLinkFieldTouched(true);
                    // } else if (!ev.target.value && isLinkFieldTouched) {
                    //   setIsLinkFieldTouched(false);
                    // }
                  }}
                  placeholder="Test link "
                />
              </Form.Item>
              <Button
                style={{ width: '10%' }}
                // disabled={!isLinkFieldTouched}
                onClick={() => {
                  donwloadAssessmentTest(downloadAssessmentTest?.applicationUrl);
                }}
                type="primary"
                icon={<DownloadOutlined />}
              />
            </div>

            <div className="pt-5">
              <CheckValidation
                show={assignTestMode === 'OFFLINE' && testStatusCheck === 'TEST_COMPLETED'}
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
            <div className="flex justify-end ">
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
                {toggleAssignButton ||
                (getParticularAssessmentTest?.length > 0 &&
                  getParticularAssessmentTest[0]?.testStatusId !== 'TEST_COMPLETED')
                  ? 'Update'
                  : 'Assign'}
              </Button>
            </div>
          </div>
        </div>
      </Form>
      <CheckValidation show={visibleWhatsApp}>
        <GenerateLeadWhatsAppMessage
          type={editLead?.purposeFor === 'students' ? 'student' : 'client'}
          purpose="lead"
          visible={visibleWhatsApp}
          setVisible={setVisibleWhatsApp}
          recordDetails={recordDetails}
          setRecordDetails={setRecordDetails}
          selectedRows={[]}
          setAssesTestNotificationMode={setAssesTestNotificationMode}
        />
      </CheckValidation>

      <CheckValidation show={visibleEmail}>
        <GenerateLeadEmail
          type={editLead?.purposeFor === 'students' ? 'student' : 'client'}
          purpose="lead"
          visible={visibleEmail}
          setVisible={setVisibleEmail}
          recordDetails={recordDetails}
          setRecordDetails={setRecordDetails}
          selectedRows={[]}
          setAssesTestNotificationMode={setAssesTestNotificationMode}
        />
      </CheckValidation>
      <CheckValidation show={isPhoneVisible}>
        <GenerateLeadPhone
          isPhoneVisible={isPhoneVisible}
          setIsPhoneVisible={setIsPhoneVisible}
          recordDetails={recordDetails}
          setRecordDetails={setRecordDetails}
          setAssesTestNotificationMode={setAssesTestNotificationMode}
        />
      </CheckValidation>
    </div>
  );
};

export default connect(({ leads, loading }) => ({
  editLead: leads?.editLead,
  assessmentTest: leads?.assessmentTest,
  loading: loading?.effects['leads/addAssignAssessmentTest'],
  getParticularAssessmentTest: leads?.getParticularAssessmentTest,
  downloadAssessmentTest: leads?.downloadAssessmentTest,
}))(AssignAssessmentTest);
