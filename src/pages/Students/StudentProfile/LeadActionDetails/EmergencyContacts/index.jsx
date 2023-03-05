import React, { useEffect } from 'react';
import { connect, useParams } from 'umi';
import { Row, Col, Avatar, Spin } from 'antd';
import CheckValidation from '@/components/CheckValidation';
import EmptyState from '@/components/EmptyState';
import emptyStateSvg from '@/assets/icons/space-empty.svg';

const EmergencyContacts = ({ dispatch, emergencyContactDetails, loadingEmergencyContacts }) => {
  const { studentId } = useParams();
  useEffect(() => {
    dispatch({
      type: 'student/getEmergencyContact',
      payload: {
        pathParams: { studentId },
      },
    });
  }, [studentId, dispatch]);

  return (
    <div>
      <Spin spinning={Boolean(studentId) && loadingEmergencyContacts}>
        <Row gutter={24}>
          <CheckValidation
            show={[emergencyContactDetails]?.length > 0}
            fallback={
              <EmptyState
                emptyState={emptyStateSvg}
                emptyHeaderText={<span>No EmergencyContact found yet!</span>}
              />
            }
          />
          <Col offset={6} xs={2} sm={2} md={12} lg={12} xl={12} xxl={12} key="">
            <div className="shadow hover:shadow-md bg-gray-50 border rounded-md p-2 mt-4 mb-4 w-full items-center mb-10">
              <div className="flex justify-center border-b">
                <svg
                  height="20"
                  width="20"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="exclamation"
                  className="svg-inline--fa fa-exclamation fa-w-6 mt-3 text-red-700"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 192 512"
                >
                  <path
                    fill="currentColor"
                    d="M176 432c0 44.112-35.888 80-80 80s-80-35.888-80-80 35.888-80 80-80 80 35.888 80 80zM25.26 25.199l13.6 272C39.499 309.972 50.041 320 62.83 320h66.34c12.789 0 23.331-10.028 23.97-22.801l13.6-272C167.425 11.49 156.496 0 142.77 0H49.23C35.504 0 24.575 11.49 25.26 25.199z"
                  ></path>
                </svg>

                <p className="text-lg text-center  pb-2 font-semibold text-gray-700 my-2">
                  Emergency contact details
                </p>
              </div>
              <div className="flex w-full border-b mt-2">
                <div className="py-2 pr-2">
                  <Avatar size={80}>VA</Avatar>
                </div>
                <div className="flex ml-2 justify-center items-center">
                  <div>
                    <div className=" font-medium ">
                      Name :
                      <span className=" text-base pl-3.5 text-gray-700">
                        {emergencyContactDetails?.displayName}
                      </span>
                    </div>
                    <div className=" font-medium">
                      Relation :
                      <span className="text-base pl-1 text-gray-700  ">
                        {emergencyContactDetails?.relation}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex  p-2  border-b py-4 text-lg ">
                <div className="mr-3 font-medium">Address: </div>
                <div>{emergencyContactDetails?.location}</div>
              </div>
              <div className="flex p-2 border-b py-4 text-lg">
                <div className="mr-8 font-medium ">Email: </div>
                <div> {emergencyContactDetails?.primaryEmail}</div>
              </div>
              <div className="flex p-2 py-4 text-lg  ">
                <div className="mr-5 font-medium ">Phone: </div>
                <div>{emergencyContactDetails?.emergencyPhone?.phoneFormatted}</div>
              </div>
            </div>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

export default connect(({ student, loading }) => ({
  emergencyContactDetails: student?.emergencyContactDetails,
  loadingEmergencyContacts: loading?.effects['student/getEmergencyContact'],
}))(EmergencyContacts);
