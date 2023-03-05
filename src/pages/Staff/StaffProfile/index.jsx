import React, { useEffect, useState } from 'react';
import {
  CheckOutlined,
  MailOutlined,
  MessageOutlined,
  PhoneOutlined,
  PlusOutlined,
  StarFilled,
  UnorderedListOutlined,
  UploadOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Row, Select, Col, Avatar, Divider, Skeleton, Drawer } from 'antd';
import { connect, useParams } from 'umi';
import moment from 'moment';
import { getInitials } from '@/utils/common';
import {
  InformationIcon,
  StudentWithBag,
  TrophyIcon,
  UpArrowIcon,
  WalletIcon,
} from '@/utils/AppIcons';
import TeacherActions from './TeacherActions';
import StaffEdit from './StaffEdit';
import PromoteStaff from './PromoteStaff';
import UploadPhoto from './UploadPhoto';
import AssignTaskToStaff from './AssignTaskToStaff';
import StaffActivityLog from './StaffActivityLog';
import SendMessage from './SendMessage';

const StaffProfile = ({ dispatch, getTeacherDetails, getTeacherBatchDetails, loading }) => {
  const [visibleDrawer, setVisibleDrawer] = useState(false);

  const [option, setOption] = useState();

  const { Option } = Select;
  const { staffId } = useParams();
  const options = [
    { key: 'EDIT', value: 'Edit' },
    { key: 'Upload_profile', value: 'Upload profile' },
    { key: ' Assign_Authorities  ', value: ' Assign Authorities & Update Authorities  ' },
    { key: 'Promote_Employee', value: 'Promote Employee' },
    {
      key: 'Send_message',
      value: 'Send SMS/Emal/Whatsapp',
    },
    {
      key: 'Assign_Task',
      value: 'Assign task',
    },
    { key: 'Activity_log', value: 'Activity log' },
    {
      key: 'Add_And_Debit_Wallet',
      value: 'Add and debit wallet',
    },
  ];
  const GetTeacherBasicInformation = () => {
    dispatch({
      type: 'staff/getTeacherDetails',
      payload: {
        pathParams: {
          TeacherId: staffId,
        },
      },
    });
  };
  const GetBatchDetails = () => {
    dispatch({
      type: 'staff/getTeacherBatchDetails',
      payload: {
        pathParams: {
          TeacherId: staffId,
        },
      },
    });
  };
  useEffect(() => {
    GetTeacherBasicInformation();
    GetBatchDetails();
  }, []);
  const setDrawerTitle = (value) => {
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
              <div className="text-sm font-normal text-gray-500">Edit staff profile here</div>
            </div>{' '}
          </div>
        );
      case 'Promote Employee':
        return (
          <div className="items-start flex">
            {' '}
            <div className="mr-2  pr-2">
              <svg
                viewBox="0 0 64 64"
                height="30"
                className="text-blue-600"
                fill="rgb(30, 58, 138)"
                width="30"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs></defs>
                <g id="Promotion">
                  <path
                    className="cls-1 "
                    d="M15,34.4A35.84,35.84,0,0,0,15.88,41c.73,2.89,2.1,6.53,5.4,8.46a1.2,1.2,0,0,0,1,.08,1.23,1.23,0,0,0,.75-.73c.41-1,.94-2.33,1.3-3.26a1.57,1.57,0,0,0-.51-1.81,9,9,0,0,1-2.12-4.22c-.05-.18-.09-.36-.13-.54Z"
                  />
                  <polygon
                    className="cls-2"
                    points="24.05 19.34 13.64 24.25 13.64 35.5 24.05 40.41 24.05 19.34"
                  />
                  <path
                    className="cls-2"
                    d="M34.47,14.43l-7,3.29V42l7,3.29A2.56,2.56,0,0,0,37.74,43V16.76A2.56,2.56,0,0,0,34.47,14.43Z"
                  />
                  <path
                    className="cls-3"
                    d="M13.64,24.25H8.82A4.81,4.81,0,0,0,4,29.07v1.61A4.81,4.81,0,0,0,8.82,35.5h4.82Z"
                  />
                  <path className="cls-3" d="M37.74,26.77V33a3.11,3.11,0,1,0,0-6.21Z" />
                  <path
                    className="cls-3"
                    d="M45.5,21.7a2.19,2.19,0,0,0-1.57,3.73,6.45,6.45,0,0,1,2,4.44,6.47,6.47,0,0,1-2,4.45A2.18,2.18,0,0,0,47,37.41a10.76,10.76,0,0,0,3.25-7.54h0A10.73,10.73,0,0,0,47,22.34,2.23,2.23,0,0,0,45.5,21.7Z"
                  />
                  <path
                    className="cls-3"
                    d="M54.23,19a2.14,2.14,0,0,0-1.57.64,2.19,2.19,0,0,0,0,3.09,10,10,0,0,1,0,14.23,2.18,2.18,0,0,0,3.09,3.09A14.47,14.47,0,0,0,60,29.87h0a14.46,14.46,0,0,0-4.25-10.2A2.23,2.23,0,0,0,54.23,19Z"
                  />
                  <path
                    className="cls-4"
                    d="M21.23,29.87a2.41,2.41,0,0,0-2.41-2.41H13.64v4.82h5.18a2.4,2.4,0,0,0,2.41-2.41Z"
                  />
                  <polygon
                    className="cls-5"
                    points="27.48 17.72 27.48 42.03 24.05 40.41 24.05 19.34 27.48 17.72"
                  />
                  <path
                    className="cls-1"
                    d="M35.08,14.34a2.57,2.57,0,0,0-.61.09l-2.55,1.2a2.25,2.25,0,0,1,.31,1.13V43a2.28,2.28,0,0,1-.31,1.13l2.55,1.2A2.56,2.56,0,0,0,37.74,43V16.76A2.52,2.52,0,0,0,35.08,14.34Z"
                  />
                  <path className="cls-6" d="M7.34,33H8a1,1,0,0,0,0-2H7.34a1,1,0,1,0,0,2Z" />
                  <path className="cls-6" d="M7.34,28.8H8a1,1,0,1,0,0-2H7.34a1,1,0,0,0,0,2Z" />
                </g>
              </svg>
            </div>{' '}
            <div>
              {' '}
              <span className="text-base font-semibold text-blue-900">Promote Employee</span>
              <div className="text-sm font-normal text-gray-500">Promote Employee here</div>
            </div>{' '}
          </div>
        );

      case 'Upload profile':
        return (
          <div className="items-start flex">
            {' '}
            <div className="mr-2  pr-2">
              <UploadOutlined style={{ color: 'rgb(30, 58, 138)', fontSize: '20px' }} />{' '}
            </div>{' '}
            <div>
              {' '}
              <span className="text-base font-semibold text-blue-900">Upload photo</span>
              <div className="text-sm font-normal text-gray-500">Upload staff profile pic</div>
            </div>{' '}
          </div>
        );

      case 'Assign task':
        return (
          <div className="items-start flex">
            {' '}
            <div className="mr-2  pr-2">
              <UnorderedListOutlined style={{ color: 'rgb(30, 58, 138)', fontSize: '20px' }} />
            </div>{' '}
            <div>
              {' '}
              <span className="text-base font-semibold text-blue-900"> Assigned task</span>
              <div className="text-sm font-normal text-gray-500">Assigned task to staff </div>
            </div>{' '}
          </div>
        );
      case 'Activity log':
        return (
          <div className="items-start flex">
            {' '}
            <div className="mr-2  pr-2">
              <UnorderedListOutlined style={{ color: 'rgb(30, 58, 138)', fontSize: '20px' }} />
            </div>{' '}
            <div>
              {' '}
              <span className="text-base font-semibold text-blue-900"> Activity log</span>
              <div className="text-sm font-normal text-gray-500">Staff activity log</div>
            </div>{' '}
          </div>
        );

      case 'Send SMS/Emal/Whatsapp':
        return (
          <div className="items-start flex">
            {' '}
            <div className="mr-2  pr-2">
              <MessageOutlined style={{ color: 'rgb(30, 58, 138)', fontSize: '20px' }} />
            </div>{' '}
            <div>
              {' '}
              <span className="text-base font-semibold text-blue-900"> Send Message</span>
              <div className="text-sm font-normal text-gray-500">Send SMS/Emal/Whatsapp</div>
            </div>{' '}
          </div>
        );

      default:
        break;
    }
    return '';
  };
  const quickAction = () => {
    switch (option) {
      case 'Edit':
        return (
          <StaffEdit
            staffId={staffId}
            getTeacherDetails={getTeacherDetails}
            setVisibleDrawer={setVisibleDrawer}
            setOption={setOption}
          />
        );

      case 'Promote Employee':
        return (
          <PromoteStaff
            staffId={staffId}
            setVisibleDrawer={setVisibleDrawer}
            getTeacherDetails={getTeacherDetails}
            setOption={setOption}
          />
        );
      case 'Upload profile':
        return (
          <UploadPhoto
            staffId={staffId}
            setVisibleDrawer={setVisibleDrawer}
            getTeacherDetails={getTeacherDetails}
          />
        );

      case 'Assign task':
        return (
          <AssignTaskToStaff
            staffId={staffId}
            setVisibleDrawer={setVisibleDrawer}
            setOption={setOption}
          />
        );
      case 'Activity log':
        return <StaffActivityLog id={staffId} />;
      case 'Send SMS/Emal/Whatsapp':
        return (
          <SendMessage
            id={staffId}
            setVisibleDrawer={setVisibleDrawer}
            getTeacherDetails={getTeacherDetails}
          />
        );

      default:
        return <StaffEdit staffId={staffId} />;
    }
  };

  return (
    <div className="bg-white">
      <div className="flex justify-between px-2 py-2">
        <div className="font-bold text-lg">Teacher Details</div>
        <div className="flex">
          <div className="bg-yellow-500 text-white text-xl font-bold flex items-center justify-center rounded-full h-8 w-8 mr-2">
            <PlusOutlined />
          </div>
          <Select
            placeholder="Quick action"
            style={{ width: '20rem' }}
            value={option}
            onChange={(value) => {
              setOption(value);
              setVisibleDrawer(true);
            }}
          >
            {options?.map((item) => (
              <Option key={item?.key} value={item?.value}>
                {item?.value}
              </Option>
            ))}
          </Select>
          <Drawer
            title={setDrawerTitle(option)}
            placement="right"
            width={650}
            destroyOnClose
            onClose={() => {
              setOption();
              setVisibleDrawer(false);
            }}
            visible={visibleDrawer}
          >
            {quickAction()}
          </Drawer>
        </div>
      </div>
      <Divider style={{ margin: '0' }} />

      <Skeleton loading={loading}>
        <Row className="border-b">
          <Col xs={24} sm={24} md={12} lg={7} xl={7} className="border-r">
            <div className="w-full h-1 bg-blue-700" />

            <div className="flex w-full  h-full">
              <div className=" flex justify-center items-center  h-full  w-1/4 px-2">
                <Avatar
                  className="uppercase text-gray-900 font-medium"
                  size={100}
                  src={getTeacherDetails?.photoUrl}
                >
                  <p className="text-gray-900">
                    {getTeacherDetails?.displayName && getInitials(getTeacherDetails?.displayName)}
                  </p>
                </Avatar>
              </div>
              <div className="  text-base text-gray-700  font-bold  mt-1 w-full">
                <div className="flex mt-2 items-center h-5">
                  <div className="border-r  px-2">{getTeacherDetails?.displayName}</div>
                  <div className="text-gray-500 ml-1  text-sm font-semibold pr-1 border-r">
                    {moment(getTeacherDetails?.dob).format('MMM D, YYYY')}
                  </div>
                  <div className="text-yellow-500 text-sm font-semibold  px-1">
                    {getTeacherDetails?.maritalStatus}
                  </div>
                </div>
                <div className="px-2">
                  <div className="text-green-500 text-sm  font-bold mt-2">
                    <span className="mr-2 capitalize">{getTeacherDetails?.status}</span>
                    <span className=" border-l  text-gray-700 pr-2 font-semibold border-r">
                      {` ${moment(getTeacherDetails?.registeredOn).format(
                        'DD MMM YYYY',
                      )} - ${moment(getTeacherDetails?.registeredOn).format('LT')}`}
                    </span>
                    <span className="text-sm text-gray-500 mx-1.5 font-semibold">
                      {moment(getTeacherDetails?.registeredOn).fromNow()}
                    </span>
                  </div>
                  <div className="flex items-center text-sm font-bold -mt-1 text-gray-700 ">
                    <div className="mr-2 ">
                      <MailOutlined
                        style={{ fontSize: '14px', fontWeight: 'bold', color: 'black' }}
                      />
                    </div>
                    <div className="text-gray-500 mt-1 font-semibold">
                      {` ${getTeacherDetails?.primaryEmail}`}
                    </div>
                    <div className="text-red-500 text-xs ml-2">
                      <CheckOutlined style={{ color: 'green' }} />
                    </div>
                  </div>
                  <div className="flex items-center text-sm font-bold text-gray-700 -mt-1">
                    <div className="mr-2">
                      <PhoneOutlined
                        style={{ fontSize: '14px', fontWeight: 'bold', color: 'black' }}
                      />
                    </div>
                    <div className="text-gray-500 mt-1 font-semibold">
                      {` ${getTeacherDetails?.phone?.formattedPhoneNumber || '--'}`}
                    </div>
                  </div>

                  {getTeacherDetails?.phones?.length > 1 && (
                    <div className="flex items-center text-sm font-bold text-gray-700 -mt-1">
                      <div className="mr-2">
                        <PhoneOutlined
                          style={{ fontSize: '14px', fontWeight: 'bold', color: 'black' }}
                        />
                      </div>
                      <div className="text-gray-500 mt-1 font-semibold">
                        {` ${getTeacherDetails?.phones[1]?.phoneFormatted} `}
                      </div>
                    </div>
                  )}

                  <div className="font-bold text-blue-700 text-sm  ">
                    Branch {'&'} Dep :
                    <span className="text-gray-500 font-semibold">
                      {` ${getTeacherDetails?.jobInformation?.department}`}
                    </span>
                  </div>
                  <div className="font-medium  text-blue-700 text-sm ">
                    Desiganation :
                    <span className="text-gray-500 font-semibold">
                      {` ${getTeacherDetails?.jobInformation?.designation}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={24} md={12} lg={6} xl={6} className="border-r">
            <div className="w-full h-1 bg-yellow-500" />
            <div className="my-1 mx-4">
              <div className="flex">
                <InformationIcon />
                <div className="text-lg text-gray-400 font-medium ">Other Details:</div>
              </div>
              <div className="mt-2">
                <div className="font-bold text-blue-700">
                  Father/Mother name :
                  <span className="text-gray-500 font-semibold pl-2">
                    {`${getTeacherDetails?.guardian?.name} | ${getTeacherDetails?.guardian?.occupation}` ||
                      '--'}
                  </span>
                </div>
                <div className="font-bold text-blue-700">
                  Mobile :
                  <span className="text-gray-500 font-semibold pl-2 ">
                    {getTeacherDetails?.guardian?.phone?.formattedPhoneNumber || '--'}
                  </span>
                </div>
                <div className="font-bold text-blue-700">
                  Emergency mob :
                  <span className="text-gray-500 font-semibold pl-2">
                    {getTeacherDetails?.emergencyContact?.phone?.formattedPhoneNumber || '--'}
                  </span>
                </div>
                <div className="font-bold text-blue-700">
                  Qualification :
                  <span className="text-gray-500 font-semibold pl-2 ">
                    {getTeacherDetails?.qualifications[0]?.qualificationDesc || '--'}
                  </span>
                </div>
                <div className="font-bold text-blue-700">
                  Last Job :
                  <span className="text-gray-500 font-semibold pl-2  ">
                    {getTeacherDetails?.experiences[0]?.lastDesignation || '--'}
                  </span>
                </div>
                <div className="font-bold text-blue-700">
                  Address :
                  <span className="text-gray-500 font-semibold  ">
                    {` ${getTeacherDetails?.address?.city}`}
                  </span>
                </div>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={24} md={8} lg={4} xl={4} className="border-r">
            <div className="w-full h-1 bg-green-500" />
            <div className="my-1 mx-4">
              <div className="flex">
                <StudentWithBag fill="#9ca3af" style="-ml-2" />
                <div className="text-lg text-gray-400 font-medium ">Student & Batch Details:</div>
              </div>
              {getTeacherBatchDetails?.studentAndBatchDetails?.totalAssigned ? (
                <div className="mt-2">
                  <div className="flex">
                    <div className="font-bold text-blue-700 "> Total Assigned :</div>
                    <div className="text-green-500 font-bold pl-2 ">
                      {getTeacherBatchDetails?.studentAndBatchDetails?.totalAssigned}
                    </div>
                  </div>
                  <div>
                    {getTeacherBatchDetails?.studentAndBatchDetails?.batches?.map((batchNums) => (
                      <div className="flex" key={batchNums?.batchId}>
                        <div className="font-bold text-blue-700 ">
                          <span
                            className="font-bold text-blue-700 "
                            style={{
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {batchNums?.batchName}
                          </span>
                          :
                        </div>
                        <div className="text-yellow-500 font-bold pl-2">
                          {batchNums?.assignedStudents}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-2">
                  <p className="text-green-500 font-bold text-center pt-10 ">Not assigned yet</p>
                </div>
              )}
            </div>
          </Col>
          <Col xs={24} sm={24} md={8} lg={3} xl={3} className="border-r">
            <div className="w-full h-1 bg-blue-700" />
            <div className="my-1 mx-4">
              <div className="flex">
                <WalletIcon fill="#9ca3af" style="-ml-0.5" />
                <div className="text-lg text-gray-400 font-medium ml-2">Wallet Status:</div>
              </div>
              <div className="mt-2 space-y-2">
                <div className="flex">
                  <div className="font-bold text-blue-700 "> Balance :</div>
                  <div className="text-yellow-500 font-bold pl-2 ">3000</div>
                </div>
                <div className="flex">
                  <div className="font-bold text-blue-700 "> Paid :</div>
                  <div className="text-green-500 font-bold pl-2 ">1500</div>
                </div>
                <div className="flex">
                  <div className="font-bold text-blue-700 "> Pending :</div>
                  <div className="text-red-500 font-bold pl-2 ">1500</div>
                </div>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={24} md={8} lg={4} xl={4}>
            <div className="w-full h-1 bg-green-300" />
            <div className="my-1 mx-4">
              <div className="flex">
                <TrophyIcon fill="#9ca3af" />
                <div className="text-lg text-gray-400 font-medium ml-2">Performance:</div>
              </div>
              <div className="mt-2 space-y-2">
                <div className="flex">
                  <div className="font-bold text-blue-700 "> Rating :</div>
                  <div className="text-yellow-500 font-bold pl-2 flex mt-1">
                    <StarFilled />
                    <StarFilled />
                    <StarFilled />
                    <UpArrowIcon />
                  </div>
                </div>
                <div className="flex">
                  <div className="font-bold text-blue-700 "> FeedBack Score :</div>
                  <div className="text-yellow-500 font-bold pl-2">336</div>
                </div>
                <div className="flex">
                  <div className="font-bold text-blue-700 "> Thumbs :</div>
                  <div className="text-yellow-500 font-bold pl-2">150</div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Skeleton>
      <Divider style={{ margin: '0' }} />
      <div className="pb-2">
        <div className="font-bold flex justify-between px-40 h-8 items-center my-2.5">
          <div className=" ml-4 text-red-600">
            Direct Reporting to :
            <span className="text-gray-500 font-semibold  ml-1">Not assigned</span>
          </div>
          <div className=" ml-4 text-red-600">
            Attendance :<span className="text-gray-500 font-semibold  ml-1">Not Available</span>
          </div>

          <div className="ml-4 text-red-600">
            Salary Status :<span className="text-gray-500 font-semibold  ml-1">Not available</span>
          </div>
        </div>
        <div className="w-full border-b-4 shadow-md border-gray-400" />
      </div>
      <TeacherActions />
    </div>
  );
};

export default connect(({ staff, loading }) => ({
  getTeacherDetails: staff?.getTeacherDetails,
  getTeacherBatchDetails: staff?.getTeacherBatchDetails,
  loading: loading?.effects['staff/getTeacherDetails'],
}))(StaffProfile);
