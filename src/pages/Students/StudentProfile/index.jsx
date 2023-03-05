import React, { useState, useEffect } from 'react';
import {
  BookOutlined,
  CheckOutlined,
  DollarOutlined,
  MailOutlined,
  PhoneOutlined,
  PlusOutlined,
  RightOutlined,
  UserOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';
import { Row, Select, Col, Avatar, Divider, Skeleton, Drawer } from 'antd';
import { connect, useParams } from 'umi';
import Steps from './Steps';
import AssignBatch from './AssignBatch';

import Edit from './Edit';

import Fees from './Fees';
import moment from 'moment';
import AssignedStudentOwner from './AssignedStudentOwner';

import AddService from './UpgradeCourse';
import { getInitials } from '@/utils/common';
import { currencyFormatter } from '@/utils/utils';
import LeadActionDetails from './LeadActionDetails';

const StudentProfile = ({
  dispatch,
  studentStages,
  studentDetails,
  emergencyContactDetails,
  studentStatus,
  walletStatus,
  studentOwnerName,
  loading,
  StudentStats,
}) => {
  const { Option } = Select;
  const { studentId, tabname } = useParams();
  const [option, setOption] = useState();
  const [showDrawer, setShowDrawer] = useState(false);

  const getStudentOwnerName = () => {
    dispatch({
      type: 'student/getStudentOwnerName',
      payload: {
        pathParams: {
          studentId,
        },
      },
    });
  };

  const getLatestRemarks = () => {
    dispatch({
      type: 'student/getNotes',
      payload: {
        pathParams: {
          studentId,
        },
      },
    });
  };

  const getPrimaryTeacherName = () => {
    dispatch({
      type: 'student/getPrimaryTeacherName',
      payload: {
        pathParams: {
          studentId,
        },
      },
    });
  };

  const getStudentCurrentStatus = () => {
    dispatch({
      type: 'student/getStudentCurrentStatus',
      payload: {
        pathParams: {
          studentId,
        },
      },
    });
  };

  const getStudentStages = () => {
    dispatch({
      type: 'student/getStudentStages',
      payload: {
        pathParams: {
          studentId,
        },
      },
    });
  };

  const getStudentStats = () => {
    dispatch({
      type: 'students/getStudentStats',
      payload: {
        pathParams: { studentId },
      },
    });
  };

  const getCommunicationList = () => {
    dispatch({
      type: 'student/getCommunicationalLogs',
      payload: {
        pathParams: { studentId },
      },
    });
  };

  const getWalletStatus = () => {
    dispatch({
      type: 'student/getWalletStatus',
      payload: {
        pathParams: {
          studentId,
        },
      },
    });
  };

  const getQualificationDetails = () => {
    dispatch({
      type: 'student/getQualificationDetails',
      payload: {
        pathParams: {
          studentId,
        },
      },
    });
  };

  const getEmergencyContact = () => {
    dispatch({
      type: 'student/getEmergencyContact',
      payload: {
        pathParams: {
          studentId,
        },
      },
    });
  };

  const getStudentDetails = () => {
    dispatch({
      type: 'student/getStudentDetails',
      payload: {
        pathParams: {
          studentId,
        },
      },
    });
  };

  const UI = () => {
    switch (option) {
      case 'Edit':
        return (
          <Edit
            id={studentId}
            studentDetails={studentDetails}
            setShowDrawer={setShowDrawer}
            showDrawer={showDrawer}
          />
        );

      case 'Add fee':
        return <Fees id={studentId} setShowDrawer={setShowDrawer} showDrawer={showDrawer} />;
      case 'Add service':
        return <AddService id={studentId} setShowDrawer={setShowDrawer} showDrawer={showDrawer} />;

      case 'Assigned student owner/change':
        return (
          <AssignedStudentOwner
            id={studentId}
            setShowDrawer={setShowDrawer}
            showDrawer={showDrawer}
          />
        );

      default:
        return <AssignBatch id={studentId} setShowDrawer={setShowDrawer} showDrawer={showDrawer} />;
    }
  };
  // console.log('studentDetails?.courses?.length', studentDetails);
  useEffect(() => {
    getStudentDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId]);

  useEffect(() => {
    getCommunicationList();
    getStudentStats();
    getStudentCurrentStatus();
    getStudentStages();
    getWalletStatus();
    getLatestRemarks();
    getQualificationDetails();
    getStudentOwnerName();
    getEmergencyContact();
    getPrimaryTeacherName();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, studentId, tabname]);
  const options = [
    { key: 'EDIT', value: 'Edit' },
    { key: 'ADD_SERVICE', value: 'Add service' },

    {
      key: 'ADD_FEES_&_FEES_INSTALLMENTS',
      value: 'Add fee',
    },

    { key: 'ASSIGNED_STUDENT_OWNER/CHANGE', value: 'Assigned student owner/change' },
  ];
  const setTitle = (value) => {
    switch (value) {
      case 'Edit':
        return (
          <div className="items-start flex">
            {' '}
            <div className="mr-2  pr-2">
              <UserOutlined style={{ color: 'rgb(30, 58, 138)', fontSize: '20px' }} />{' '}
            </div>{' '}
            <div>
              {' '}
              <span className="text-base font-semibold text-blue-900"> Edit</span>
              <div className="text-sm font-normal text-gray-500">Edit student profile here</div>
            </div>{' '}
          </div>
        );

      case 'Add service':
        return (
          <div className="items-start flex">
            {' '}
            <div className="mr-2  pr-2">
              <BookOutlined style={{ color: 'rgb(30, 58, 138)', fontSize: '20px' }} />{' '}
            </div>{' '}
            <div>
              {' '}
              <span className="text-base font-semibold text-blue-900">Add service</span>
              <div className="text-sm font-normal text-gray-500">Add service here</div>
            </div>{' '}
          </div>
        );

      case 'Add fee':
        return (
          <div className="items-start flex">
            {' '}
            <div className="mr-2  pr-2">
              <DollarOutlined style={{ color: 'rgb(30, 58, 138)', fontSize: '20px' }} />{' '}
            </div>{' '}
            <div>
              {' '}
              <span className="text-base font-semibold text-blue-900"> Add fee</span>
              <div className="text-sm font-normal text-gray-500">Add fee</div>
            </div>{' '}
          </div>
        );

      case 'Assigned student owner/change':
        return (
          <div className="items-start flex">
            {' '}
            <div className="mr-2  pr-2">
              <UserSwitchOutlined style={{ color: 'rgb(30, 58, 138)', fontSize: '20px' }} />{' '}
            </div>{' '}
            <div>
              {' '}
              <span className="text-base font-semibold text-blue-900">
                {' '}
                Assigned student owner/change
              </span>
              <div className="text-sm font-normal text-gray-500">Assigned student owner/change</div>
            </div>{' '}
          </div>
        );

      default:
        break;
    }
    return '';
  };
  return (
    <div className="bg-white">
      <div className="flex justify-between px-2 py-2">
        <div className="font-bold text-lg">Student profile</div>
        <div className="flex">
          <div
            className="bg-yellow-500 text-white text-xl font-bold flex items-center justify-center rounded-full h-8 w-8 mr-2 cursor-pointer "
            onClick={() => {
              setOption('Add service');
              setShowDrawer(true);
            }}
          >
            <PlusOutlined />
          </div>
          <Select
            placeholder="Quick action"
            style={{ width: '20rem' }}
            value={option}
            onChange={(value) => {
              setOption(value);
              setShowDrawer(true);
            }}
          >
            {options?.map((item) => (
              <Option key={item?.key} value={item?.value}>
                {item?.value}
              </Option>
            ))}
          </Select>

          <Drawer
            title={setTitle(option)}
            placement="right"
            width={600}
            destroyOnClose
            onClose={() => {
              setOption(null);
              setShowDrawer(false);
            }}
            visible={showDrawer}
          >
            {UI()}
          </Drawer>
        </div>
      </div>
      <Divider style={{ margin: '0' }} />

      <Skeleton loading={loading}>
        <Row className="border-b">
          <Col xs={24} sm={24} md={12} lg={7} xl={7} className="border-r">
            <div className="w-full h-1 bg-blue-700" />

            <div className="flex w-full  h-full ">
              <div className=" flex justify-center items-center mx-auto h-full  w-1/4 px-2">
                <Avatar
                  size={96}
                  style={{ backgroundColor: 'rgb(49 98 165)' }}
                  icon={
                    <svg
                      viewBox="64 64 896 896"
                      focusable="false"
                      data-icon="user"
                      width="1em"
                      height="1em"
                      fill="currentColor"
                      aria-hidden="true"
                      className="m-6"
                      style={{ color: 'white' }}
                    >
                      <path d="M858.5 763.6a374 374 0 00-80.6-119.5 375.63 375.63 0 00-119.5-80.6c-.4-.2-.8-.3-1.2-.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1-.4.2-.8.3-1.2.5-44.8 18.9-85 46-119.5 80.6a375.63 375.63 0 00-80.6 119.5A371.7 371.7 0 00136 901.8a8 8 0 008 8.2h60c4.4 0 7.9-3.5 8-7.8 2-77.2 33-149.5 87.8-204.3 56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9C779 752.7 810 825 812 902.2c.1 4.4 3.6 7.8 8 7.8h60a8 8 0 008-8.2c-1-47.8-10.9-94.3-29.5-138.2zM512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534z"></path>
                    </svg>
                  }
                  src={studentDetails?.photoUrl}
                  className="shadow-lg"
                >
                  {getInitials(studentDetails?.displayName)}
                </Avatar>
              </div>
              <div className="  text-base text-gray-700  font-bold  mt-1 w-full">
                <div className="flex mt-2 items-center h-5">
                  <div className="border-r  px-2">{studentDetails?.displayName}</div>
                  <div className="text-gray-500 ml-1  text-sm font-semibold pr-1 border-r">
                    {moment(studentDetails?.dob).format('MMM D, YYYY')}
                  </div>
                  <div className="text-yellow-500 text-sm font-semibold  px-1">
                    {studentDetails?.maritalStatus}
                  </div>
                </div>
                <div className="px-2">
                  <div className="text-green-500 text-sm  font-bold mt-2">
                    <span className="mr-2"> Registered</span>
                    <span className=" border-l  text-gray-700 pr-2 font-semibold border-r">
                      {` ${moment(studentDetails?.registeredOn).format('DD MMM YYYY')} - ${moment(
                        studentDetails?.registeredOn,
                      ).format('LT')}`}
                    </span>
                    <span className="text-sm text-gray-500 mx-2 font-semibold">
                      {moment(studentDetails?.registeredOn).fromNow()}
                    </span>
                  </div>
                  <div className="flex items-center text-sm font-bold -mt-1 text-gray-700 ">
                    <div className="mr-2 ">
                      <MailOutlined
                        style={{ fontSize: '14px', fontWeight: 'bold', color: 'black' }}
                      />
                    </div>
                    <div className="text-gray-500 mt-1 font-semibold">
                      {` ${
                        studentDetails?.emailAddresses?.length > 0 &&
                        studentDetails?.emailAddresses[0]?.email
                      }`}
                    </div>
                    <div className="text-red-500 mt-1 text-xs ml-2">
                      {studentStages?.registerStatus ? (
                        <CheckOutlined style={{ color: 'green' }} />
                      ) : (
                        `Verify`
                      )}
                    </div>
                  </div>
                  <div className="flex items-center text-sm font-bold text-gray-700 -mt-1">
                    <div className="mr-2">
                      <PhoneOutlined
                        style={{ fontSize: '14px', fontWeight: 'bold', color: 'black' }}
                      />
                    </div>
                    <div className="text-gray-500 mt-1 font-semibold">
                      {` ${studentDetails?.primaryPhone?.phoneFormatted || '--'}`}
                    </div>
                  </div>

                  {studentDetails?.phones?.length > 1 && (
                    <div className="flex items-center text-sm font-bold text-gray-700 -mt-1">
                      <div className="mr-2">
                        <PhoneOutlined
                          style={{ fontSize: '14px', fontWeight: 'bold', color: 'black' }}
                        />
                      </div>
                      <div className="text-gray-500 mt-1 font-semibold">
                        {` ${studentDetails?.phones[1]?.phoneFormatted} `}
                      </div>
                    </div>
                  )}

                  <div className="font-bold text-gray-700 text-sm  ">
                    Reg By :{' '}
                    <span className="text-gray-500 font-semibold">
                      {` ${studentDetails?.registeredBy?.id}`}
                    </span>
                  </div>
                  <div className="font-bold  text-gray-700 text-sm ">
                    Reference :
                    <span className="text-gray-500 font-semibold">
                      {` ${
                        studentDetails?.references?.length > 0 &&
                        studentDetails?.references?.map((p) => p?.firstName)?.join(',')
                      }`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={24} md={12} lg={6} xl={6} className="border-r">
            <div className="w-full h-1 bg-yellow-500" />
            <div className="my-1 mx-4">
              <div
                className="text-lg text-gray-700 font-bold flex justify-center"
                style={{
                  textDecoration: 'underline',
                  textUnderlineOffset: 4,
                }}
              >
                Other details
              </div>
              <div className="mt-2">
                <div className="font-bold text-gray-700">
                  Father/Mother name :{' '}
                  <span className="text-gray-500 font-semibold  ">
                    {studentDetails?.parents?.length > 0 &&
                      studentDetails?.parents?.map((p) => p?.firstName)?.join(',')}
                  </span>
                </div>
                <div className="font-bold text-gray-700">
                  Mobile :{' '}
                  <span className="text-gray-500 font-semibold  ">
                    {studentDetails?.parents?.length > 0 && (
                      <span>
                        <span> {studentDetails?.parents[0]?.primaryPhone?.countryCode}</span>
                        <span className="pl-2">
                          {studentDetails?.parents[0]?.primaryPhone?.areaCode}{' '}
                        </span>
                        <span className="">{studentDetails?.parents[0]?.primaryPhone?.phone} </span>
                      </span>
                    )}
                  </span>
                </div>
                <div className="font-bold text-gray-700">
                  Emergency mob :{' '}
                  <span className="text-gray-500 font-semibold">
                    {emergencyContactDetails?.emergencyPhone?.phoneFormatted}
                  </span>
                </div>
                <div className="font-bold text-gray-700">
                  Last qualification :{' '}
                  <span className="text-gray-500 font-semibold  ">
                    {studentDetails?.lastQualification?.description}
                  </span>
                </div>

                <div className="font-bold text-gray-700">
                  Address :
                  <span className="text-gray-500 font-semibold  ">
                    {` ${studentDetails?.address?.formattedAddress}`}
                  </span>
                </div>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={24} md={8} lg={4} xl={4} className="border-r">
            <div className="w-full h-1 bg-green-500" />
            <div className="my-1 mx-4">
              <div
                className="text-lg text-gray-700 font-bold flex justify-center"
                style={{
                  textDecoration: 'underline',
                  textUnderlineOffset: 4,
                }}
              >
                Current status
              </div>
              <div className="mt-2">
                <div className="font-bold text-gray-700 w-full flex">
                  <span className="w-2/4"> Student :</span>
                  <span
                    className={`  ${studentStatus?.activeStatus === 'Active' && 'text-green-500'} ${
                      studentStatus?.activeStatus === 'Inactive' && 'text-red-500 '
                    } ${
                      studentStatus?.activeStatus === 'Pending' && 'text-yellow-500'
                    } font-semibold w-2/4`}
                  >
                    {` ${studentStatus?.activeStatus}`}
                  </span>
                </div>
                <div className="font-bold text-gray-700 w-full flex ">
                  <span className="w-2/4">Course :</span>
                  <span
                    className={`font-semibold    ${
                      studentStatus?.courseStatus ? 'text-green-500 f' : 'text-yellow-500'
                    } w-2/4`}
                  >
                    {` ${studentStatus?.courseStatus ? studentStatus?.courseStatus : 'Pending'}`}
                  </span>
                </div>
                <div className="font-bold text-gray-700 flex w-full">
                  <span className="w-2/4">Attendance :</span>
                  <span
                    className={` w-2/4 font-semibold   ${
                      studentStatus?.attendance !== 'Absent' ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {` ${studentStatus?.attendance ? studentStatus?.attendance : 'Not available'}`}
                  </span>
                </div>
                <div className="font-bold text-gray-700 w-full flex">
                  <span className="w-2/4">Fees :</span>
                  <span
                    className={` font-semibold  w-2/4 ${
                      studentStatus?.Fees === 'Pending' ? 'text-yellow-500' : 'text-gray-500'
                    } `}
                  >
                    {' '}
                    {` ${
                      studentStatus?.Fees ? studentStatus?.Fees : currencyFormatter.format('0')
                    }`}
                  </span>
                </div>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={24} md={8} lg={3} xl={3} className="border-r">
            <div className="w-full h-1 bg-blue-700" />
            <div className="my-1 mx-4">
              <div
                className="text-lg text-gray-700 font-bold flex justify-center"
                style={{
                  textDecoration: 'underline',
                  textUnderlineOffset: 4,
                }}
              >
                Wallet status
              </div>
              <div className="mt-2">
                <div className="font-bold text-gray-700 flex w-full">
                  <span className="w-2/4"> Balance: </span>
                  <span className="w-2/4 text-gray-500 font-semibold">
                    {' '}
                    {currencyFormatter?.format(
                      walletStatus?.walletAmount ? walletStatus?.walletAmount : '0',
                    )}
                  </span>
                  <span className="text-yellow-400 font-semibold ml-4"></span>
                </div>
                <div className="font-bold text-gray-700 flex w-full ">
                  <span className="w-2/4"> Paid : </span>
                  <span className="w-2/4 text-gray-500 font-semibold ">
                    {` ${currencyFormatter?.format(
                      walletStatus?.paymentReceived ? walletStatus?.paymentReceived : '0',
                    )}`}
                  </span>
                  <span className="text-green-400 font-semibold ml-4"></span>
                </div>
                <div className="  font-bold text-gray-700 flex  w-full ">
                  <span className="w-2/4">Pending :</span>
                  <span className="w-2/4 text-gray-500 font-semibold">
                    {` ${currencyFormatter?.format(
                      walletStatus?.paymentDue ? walletStatus?.paymentDue : '0',
                    )}`}
                  </span>
                  <span className="text-red-400 font-semibold ml-4"></span>
                </div>
                <div className="font-bold text-gray-700 w-full flex ">
                  <span className="w-2/4"> Total fee :</span>
                  <span className="w-2/4 text-gray-500 font-semibold ">
                    {` ${currencyFormatter?.format(
                      walletStatus?.totalAmount ? walletStatus?.totalAmount : '0',
                    )}`}
                  </span>
                  <span className="text-red-400 font-semibold ml-4"></span>
                </div>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={24} md={8} lg={4} xl={4}>
            <div className="w-full h-1 bg-green-300" />
            <div className="mx-6 my-8 font-semibold ">
              <div className=" flex justify-between bg-green-500 shadow-md rounded-lg text-white px-2 my-2 h-8 text-lg  items-center">
                <div className="flex items-center">
                  <div className="mb-2 mr-2">
                    <RightOutlined />
                  </div>
                  <div>Courses</div>
                </div>
                <div className="bg-white text-green-500 rounded-xl px-2 text-sm">
                  {StudentStats?.stats?.courseCount}
                </div>
              </div>
              <div className=" flex justify-between bg-yellow-500 shadow-md rounded-lg text-white px-2 my-2 h-8 text-lg items-center">
                <div className="flex items-center">
                  <div className="mb-2 mr-2">
                    <RightOutlined />
                  </div>
                  <div>Visas</div>
                </div>
                <div className="bg-white text-yellow-500 rounded-xl px-2 text-sm">0</div>
              </div>
              <div className="flex justify-between bg-blue-500 shadow-md rounded-lg text-white px-2 my-2 h-8 text-lg items-center">
                <div className="flex items-center">
                  <div className="mb-2 mr-2">
                    <RightOutlined />
                  </div>
                  <div className="truncate">Other services</div>
                </div>
                <div className="bg-white text-blue-500 rounded-xl px-2 text-sm ">0</div>
              </div>
            </div>
          </Col>
        </Row>
      </Skeleton>
      <Divider style={{ margin: '0' }} />
      <div className="font-bold flex justify-between mx-4 h-8 items-center my-2">
        <div className=" ml-4 text-gray-700">
          Student owner :
          <span className="text-gray-500 font-semibold  ">
            {` `}
            {studentOwnerName?.displayName ? studentOwnerName?.displayName : ''}
          </span>
        </div>

        <div className="ml-4 text-gray-700">
          Latest remarks :
          <span className="text-gray-500 font-semibold  ">
            {` `}
            {studentDetails?.teacherRemarks?.noteInfo
              ? studentDetails?.teacherRemarks?.noteInfo
              : ''}
          </span>
        </div>

        <div></div>
      </div>
      <Steps />
      <LeadActionDetails tabname={tabname} studentId={studentId} />
    </div>
  );
};

export default connect(({ student, loading, students }) => ({
  qualificationDetails: student?.qualificationDetails,
  studentDetails: student?.studentDetails,
  emergencyContactDetails: student?.emergencyContactDetails,
  studentStatus: student?.studentStatus,
  walletStatus: student?.walletStatus,
  primaryTeacherName: student?.primaryTeacherName,
  studentOwnerName: student?.studentOwnerName,
  noteDetails: student?.noteDetails,
  studentStages: student.studentStages,
  StudentStats: students?.StudentStats,

  loading: loading.effects['student/getStudentDetails'],
}))(StudentProfile);
