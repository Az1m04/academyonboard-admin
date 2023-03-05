/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Radio, Select, Row, Col, Timeline, message } from 'antd';
import { Envelope, PhoneIcon, WhatsApp } from '@/utils/AppIcons';
import { connect, history } from 'umi';
import { DownloadOutlined } from '@ant-design/icons';
import CheckValidation from '@/components/CheckValidation';
import GenerateLeadWhatsAppMessage from '@/components/GenerateWhatsAppMessage';
import GenerateLeadEmail from '@/components/GenerateEmail';
import GenerateLeadPhone from '@/components/GeneratePhone';
import { CardHeading } from 'react-bootstrap-icons';
import classes from './index.less';
import dayjs from 'dayjs';
import emptyStateSvg from '@/assets/icons/space-empty.svg';
import EmptyState from '@/components/EmptyState';
import AppIcons from '@/utils/AppIcons';
import ReactHtmlParser from 'react-html-parser';

const { Option } = Select;

const AssignAssessmentTest = ({
  dispatch,
  id,
  editLead,
  assessmentTest,
  setShowDrawer,
  showDrawer,
  loading,
  idx,
  studentActivity,
}) => {
  const [form] = Form.useForm();
  const [recordDetails, setRecordDetails] = useState([]);
  const [assignTestMode, setAssignTestMode] = useState(null);
  const [visibleWhatsApp, setVisibleWhatsApp] = useState(false);
  const [visibleEmail, setVisibleEmail] = useState(false);
  const [isPhoneVisible, setIsPhoneVisible] = useState(false);
  const [isLinkFieldTouched, setIsLinkFieldTouched] = useState(false);
  const [assesTestNotificationMode, setAssesTestNotificationMode] = useState('');
  const [disableStatus, setDisableStatus] = useState({
    assigned: false,
    running: false,
    completed: false,
    notAttended: false,
    notCompleted: false,
  });

  useEffect(() => {
    setRecordDetails([editLead?.record]);
  }, [editLead, visibleWhatsApp, visibleEmail, isPhoneVisible]);

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

  const onAssignAssesmentFinish = (values) => {
    // eslint-disable-next-line no-console

    const data = {
      ...values,
      notificationMode: assesTestNotificationMode,
      marks: +values?.marks,
      obtainedMarks: +values?.obtainedMarks,
      test: {
        ...values?.test,
        testTypeId: 'ASSESS_TST',
        statusId: values?.statusId,
      },
    };

    if (values?.mode === 'ONLINE') {
      delete data.marks;
      delete data.obtainedMarks;
      delete data.statusId;
      delete data.notificationMode;
    }

    dispatch({
      type: 'leads/addAssignAssessmentTest',
      payload: {
        body: data,
        pathParams: {
          leadId: id,
        },
      },
    }).then((res) => {
      if (res?.status === 'ok') {
        setShowDrawer(false);
        message.success('Test assigned successfully');

        history.push(`/students/${id}`);
      } else {
        message.error(res?.data?.message);
      }
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
      type: 'student/getStudentTestActivity',
      payload: {
        pathParams: { studentId: id },
        query: {
          activityType: 'student_test',
          viewSize: 1000,
        },
      },
    });
  };
  useEffect(() => {
    dispatch({
      type: 'leads/getAssessmentTest',
      payload: {
        query: {
          testTypeId: 'ASSESS_TST',
          courseId: idx,
        },
      },
    });
    getActivityRecord();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Form
        form={form}
        onFinish={onAssignAssesmentFinish}
        onValuesChange={(changedValues) =>
          changedValues?.mode ? setAssignTestMode(changedValues?.mode) : ''
        }
      >
        <div className="">
          <div>
            <span className="font-medium text-gray-800">Choose test</span>
            <Form.Item
              name={['test', 'id']}
              rules={[{ required: true, message: 'Please select test to proceed' }]}
            >
              <Select className="w-full" placeholder="Choose test" size="medium">
                {assessmentTest?.records?.map((val) => (
                  <Option key={val.id} value={val.id}>
                    <span>{val.name}</span>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>
          <div>
            <p className="font-medium text-gray-800">Select class mode</p>
            <Form.Item
              name="mode"
              rules={[
                {
                  required: true,
                  message: 'Please select test mode to proceed',
                },
              ]}
            >
              <Radio.Group size="small">
                <Radio value="ONLINE">Online</Radio>
                <Radio value="OFFLINE">Offline</Radio>
              </Radio.Group>
            </Form.Item>
          </div>
          <div>
            <p className="font-medium text-gray-800">Select assessment test status</p>
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
                    link: undefined,
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
          <CheckValidation show={assignTestMode === 'ONLINE'}>
            <p className="font-medium text-gray-800">Test link</p>
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

            <div className="remarks">
              <Row gutter={16}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  <span className="font-medium text-gray-800">Remarks</span>
                  <Form.Item name="remarks">
                    <Input placeholder="Please enter remarks marks" />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </CheckValidation>

          <CheckValidation show={assignTestMode === 'OFFLINE'}>
            <p className="font-medium text-gray-800 ">Download test</p>
            <div className="flex">
              <Form.Item noStyle name="link">
                <Input
                  onChange={(ev) => {
                    if (ev.target.value && !isLinkFieldTouched) {
                      setIsLinkFieldTouched(true);
                    } else if (!ev.target.value && isLinkFieldTouched) {
                      setIsLinkFieldTouched(false);
                    }
                  }}
                  placeholder="Test link "
                />
              </Form.Item>
              {/* <Input className="w-full" /> */}
              <Button
                style={{ width: '10%' }}
                disabled={!isLinkFieldTouched}
                type="primary"
                // onClick={() => downloadAttachment()}
                icon={<DownloadOutlined />}
              />
            </div>

            <div className="pt-4">
              {/* Will be displayed when test asssignee info is available */}

              <span className="font-medium text-gray-800">Result</span>
              <Row gutter={16} className="pt-2">
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <span className="font-medium text-gray-800">Total marks</span>
                  <Form.Item name="marks">
                    <Input placeholder="Please enter total marks" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <span className="font-medium text-gray-800">Obtained marks</span>
                  <Form.Item name="obtainedMarks">
                    <Input placeholder="Please enter obtained marks" />
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  <span className="font-medium text-gray-800">Remarks</span>
                  <Form.Item name="remarks">
                    <Input placeholder="Please enter remarks" />
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
                  setShowDrawer(!showDrawer);
                }}
                className="mr-4"
              >
                Cancel
              </Button>

              <Button type="primary" size="large" onClick={() => form.submit()}>
                Assign
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
            emptyHeaderText={<span>No owner have been set yet!</span>}
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
                    <div className="w-full richtext-container-div">
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
  );
};

export default connect(({ leads, student, user, loading }) => ({
  editLead: leads?.editLead,
  studentActivity: student?.getStudentTestActivity,
  assessmentTest: leads?.assessmentTest,
  loading: loading?.effects['student/getStudentTestActivity'],
}))(AssignAssessmentTest);
