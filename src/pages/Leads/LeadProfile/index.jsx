import React, { useEffect, useState } from 'react';
import {
  CheckOutlined,
  MailOutlined,
  PhoneOutlined,
  PlusOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { Row, Select, Col, Avatar, Divider, Skeleton, Tooltip } from 'antd';
import { connect, useParams } from 'umi';

import { InformationIcon, WalletIcon } from '@/utils/AppIcons';
import LeadProfileAction from './LeadProfileAction';
import { getInitials } from '@/utils/common';
import moment from 'moment';

const LeadProfile = ({ clientLeadRecord, loadingForGetSingleLead, dispatch, enquiryStats }) => {
  const [option, setOption] = useState();
  const { leadId } = useParams();

  const { Option } = Select;
  useEffect(() => {
    dispatch({
      type: 'leads/getEnquiryStats',
      payload: {
        query: {
          leadId,
        },
      },
    });
  }, []);

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

  return (
    <div className="bg-white">
      <div className="flex justify-between px-2 py-2">
        <div className="font-bold text-lg">Lead Details</div>
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
            }}
          >
            {options?.map((item) => (
              <Option key={item?.key} value={item?.value}>
                {item?.value}
              </Option>
            ))}
          </Select>
        </div>
      </div>
      <Divider style={{ margin: '0' }} />

      <Skeleton loading={loadingForGetSingleLead}>
        <Row className="border-b">
          <Col xs={24} sm={24} md={12} lg={7} xl={7} className="border-r">
            <div className="w-full h-1 bg-blue-700" />

            <div className="flex w-full  h-full">
              <div className=" flex justify-center items-center   w-1/4 px-2">
                <Avatar
                  className="uppercase text-gray-900 font-medium"
                  size={100}
                  src={clientLeadRecord?.photoUrl}
                >
                  <p className="text-gray-900">
                    {clientLeadRecord?.fullName && getInitials(clientLeadRecord?.fullName)}
                  </p>
                </Avatar>
              </div>
              <div className="  text-base text-gray-700  font-bold  mt-1 w-full">
                <div className="flex mt-2 items-center ">
                  <div className="border-r  px-2">{clientLeadRecord?.fullName}</div>
                  <div className="text-gray-500 ml-1  text-sm font-semibold pr-1 border-r">
                    {moment(clientLeadRecord?.dob).format('MMM D, YYYY')}
                  </div>
                  <div className="text-yellow-500 text-sm font-semibold  px-1">
                    {clientLeadRecord?.maritalStatus}
                  </div>
                </div>
                <div className="px-2">
                  <div className="text-green-500 text-sm  font-bold mt-2 mb-2">
                    <span className="mr-2 capitalize">{clientLeadRecord?.status?.description}</span>
                    <span className=" border-l  text-gray-700 pr-2 font-semibold border-r">
                      {` ${moment(clientLeadRecord?.registeredOn).format('DD MMM YYYY')} - ${moment(
                        clientLeadRecord?.registeredOn,
                      ).format('LT')}`}
                    </span>
                    <span className="text-sm text-gray-500 mx-1.5 font-semibold">
                      {moment(clientLeadRecord?.registeredOn).fromNow()}
                    </span>
                  </div>
                  <div className="flex items-center text-sm font-bold  text-gray-700 ">
                    <div className="mr-2 ">
                      <MailOutlined
                        style={{ fontSize: '14px', fontWeight: 'bold', color: 'black' }}
                      />
                    </div>
                    <div className="text-gray-500 mt-1 mb-2 font-semibold">
                      {` ${clientLeadRecord?.email}`}
                    </div>
                    <div className="text-red-500 text-xs ml-2">
                      <CheckOutlined style={{ color: 'green' }} />
                    </div>
                  </div>
                  <div className="flex items-center text-sm font-bold text-gray-700 ">
                    <div className="mr-2">
                      <PhoneOutlined
                        style={{ fontSize: '14px', fontWeight: 'bold', color: 'black' }}
                      />
                    </div>
                    <div className="text-gray-500 mt-1 font-semibold">
                      {` ${
                        clientLeadRecord?.personContactDetails?.partyTelecom
                          ?.formattedPhoneNumber || '--'
                      }`}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={24} md={12} lg={4} xl={4} className="border-r">
            <div className="w-full h-1 bg-yellow-500" />
            <div className="my-1 mx-4">
              <div className="flex">
                <InformationIcon />
                <div className="text-lg text-gray-400 font-medium ">Other Details:</div>
              </div>
              <div className="mt-2">
                {clientLeadRecord?.guardianName && (
                  <div className="font-bold ">
                    Father Name :
                    <span className="text-gray-500 font-semibold pl-2 ">
                      {clientLeadRecord?.guardianName || '--'}{' '}
                    </span>
                  </div>
                )}
                <div className="font-bold ">
                  Mobile :
                  <span className="text-gray-500 font-semibold pl-2 ">
                    {clientLeadRecord?.guardian?.phone?.formattedPhoneNumber || '--'}{' '}
                  </span>
                </div>
                <div className="font-bold ">
                  Emergency mob :
                  <span className="text-gray-500 font-semibold pl-2">
                    {clientLeadRecord?.personContactDetails?.alternatePhone?.formattedPhoneNumber ||
                      '--'}
                  </span>
                </div>
                <div className="font-bold ">
                  Qualification :
                  <span className="text-gray-500 font-semibold pl-2 ">
                    {clientLeadRecord?.qualifications?.map((item) => item?.qualificationTypeId) ||
                      '--'}
                  </span>
                </div>
                <div className="font-bold ">
                  Address :
                  <span className="text-gray-500 font-semibold  ">
                    {` ${clientLeadRecord?.personContactDetails?.partyAddress?.city}`}
                  </span>
                </div>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={24} md={8} lg={5} xl={5} className="border-r">
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
                  <span className="w-2/4"> Lead status :</span>
                  <span className="text-gray-500">{clientLeadRecord?.status?.description}</span>
                </div>
                <div className="font-bold text-gray-700 w-full flex ">
                  <span className="w-2/4">FollowUp status :</span>{' '}
                  <Tooltip title={clientLeadRecord?.lastFollowUpStatus}>
                    <span
                      className="px-0.5 m-0 text-gray-500 w-48 Capitalize"
                      style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {clientLeadRecord?.lastFollowUpStatus}
                    </span>
                  </Tooltip>
                </div>
              </div>
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
                  <div className="font-bold  "> Balance :</div>
                  <div className="text-yellow-500 font-bold pl-2 ">3000</div>
                </div>
                <div className="flex">
                  <div className="font-bold  "> Paid :</div>
                  <div className="text-green-500 font-bold pl-2 ">1500</div>
                </div>
                <div className="flex">
                  <div className="font-bold  "> Pending :</div>
                  <div className="text-red-500 font-bold pl-2 ">1500</div>
                </div>
              </div>
            </div>
          </Col>

          <Col xs={24} sm={24} md={8} lg={5} xl={5}>
            <div className="w-full h-1 bg-green-300" />
            <div className="mx-6 my-8 font-semibold ">
              <div className=" flex justify-between bg-green-500 shadow-md rounded-lg text-white px-2 my-2 h-8 text-lg  items-center">
                <div className="flex items-center">
                  <div className="mb-2 mr-2">
                    <RightOutlined />
                  </div>
                  <div>Courses Enquiry</div>
                </div>
                <div className="bg-white text-green-500 rounded-xl px-2 text-sm">
                  {enquiryStats?.enquiryStats?.courses || 0}
                </div>
              </div>
              <div className=" flex justify-between bg-yellow-500 shadow-md rounded-lg text-white px-2 my-2 h-8 text-lg items-center">
                <div className="flex items-center">
                  <div className="mb-2 mr-2">
                    <RightOutlined />
                  </div>
                  <div>Visa&lsquo;s Enquiry</div>
                </div>
                <div className="bg-white text-yellow-500 rounded-xl px-2 text-sm">
                  {enquiryStats?.enquiryStats?.visa || 0}
                </div>
              </div>
              <div className="flex justify-between bg-blue-500 shadow-md rounded-lg text-white px-2 my-2 h-8 text-lg items-center">
                <div className="flex items-center">
                  <div className="mb-2 mr-2">
                    <RightOutlined />
                  </div>
                  <div className="truncate">Other services Enquiry</div>
                </div>
                <div className="bg-white text-blue-500 rounded-xl px-2 text-sm ">
                  {enquiryStats?.enquiryStats?.other || 0}
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Skeleton>
      <Divider style={{ margin: '0' }} />

      <LeadProfileAction />
    </div>
  );
};

export default connect(({ leads }) => ({
  enquiryStats: leads?.enquiryStats,
}))(LeadProfile);
