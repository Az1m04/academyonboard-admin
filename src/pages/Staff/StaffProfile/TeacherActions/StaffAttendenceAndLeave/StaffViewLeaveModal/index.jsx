import React from 'react';
import { Col, Modal, Row } from 'antd';
import moment from 'moment';

const StaffViewLeaveModal = ({ viewModal, setViewModal, leaveDetails }) => {
  const handleOk = () => {
    setViewModal(false);
  };

  const handleCancel = () => {
    setViewModal(false);
  };
  return (
    <div>
      <>
        <Modal
          width={800}
          bodyStyle={{ height: '540px' }}
          title="Leave Details"
          visible={viewModal}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <div className="p-2 mt-5 w-full ">
            <Row gutter={0}>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <div>
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <div className="border-2 border-gray-200 relative py-5 rounded-md ">
                      <div className="ml-5 -mt-10 absolute rounded-md bg-white text-green-700 text-base   shadow-md font-semibold px-2  border">
                        Leave Application Details
                      </div>
                      <div className="px-5 text-md font-semibold ">
                        <div className="w-full mt-2">
                          <div className="flex justify-between">
                            <div>
                              App. Number :
                              <span className="font-bold">{leaveDetails?.leaveId}</span>
                            </div>
                            <div>
                              Leave Type :
                              <span className="text-gray-500">{leaveDetails?.leaveType}</span>
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <div>
                              From Date :
                              <span className="text-gray-500">
                                {moment(leaveDetails?.startsAt).format('DD MMM YYYY')}
                              </span>
                            </div>
                            <div>
                              To Date :
                              <span className="text-gray-500">
                                {moment(leaveDetails?.endsAt).format('DD MMM YYYY')}
                              </span>
                            </div>
                          </div>
                          <div>
                            Reason :
                            <span className="text-gray-500">{leaveDetails?.reasonForLeave}</span>
                          </div>
                          <div>
                            Remarks :
                            <span className="text-gray-500">
                              Handwritten leave application attached
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                </div>
              </Col>
              <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mt-10">
                <div className="border-2 border-gray-200 relative py-5 rounded-md ">
                  <div className="ml-5 -mt-10 absolute rounded-md bg-white text-green-700 text-base   shadow-md font-semibold px-2  border">
                    Leave status
                  </div>
                  <div className="px-5 text-md font-semibold ">
                    <div className="w-full mt-2">
                      <div className="flex justify-between">
                        <div>
                          Status : <span className="font-bold">{leaveDetails?.leaveStatus}</span>
                        </div>
                        <div>
                          Action Date : <span className="text-gray-500">17-jan-2022</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <div>
                          Approve From : <span className="text-gray-500">12-jan-2022</span>
                        </div>
                        <div>
                          Approve To : <span className="text-gray-500">12-jan-2022</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <div>
                          Total Days : <span className="text-gray-500">1</span>
                        </div>
                        <div>
                          Action Taken : <span className="text-gray-500">joshan</span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <table className="table-fixed w-full ">
                          <thead
                            className="text-white font-semibold text-md "
                            style={{ backgroundColor: '#1B568F' }}
                          >
                            <tr>
                              <th className="border-r-2 border-white text-center ">
                                <span className="text-md font-semibold">Mark To</span>
                              </th>
                              <th className=" border-r-2 border-white pl-2 ">
                                <span className="text-md font-semibold">Remarks</span>
                              </th>
                              <th className="text-center">
                                <span className="text-md font-semibold">Action Date</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="border">
                            <tr>
                              <td className="border-r-2 border-r text-center ">joshan</td>
                              <td className="border-r-2 pl-2 border-r  ">Ok</td>
                              <td className="text-center">12-jan-2022</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mt-10">
                <div className="border-2 border-gray-200 relative py-5 rounded-md ">
                  <div className="ml-5 -mt-10 absolute rounded-md bg-white text-green-700 text-base   shadow-md font-semibold px-2  border">
                    Attachment Files
                  </div>
                  <div className="px-5 text-md font-semibold ">
                    <div className="w-full mt-2">
                      <div>
                        <table className="table-fixed w-full ">
                          <thead
                            className="text-white font-semibold text-md "
                            style={{ backgroundColor: '#1B568F' }}
                          >
                            <tr>
                              <th className="border-r-2 border-white text-center ">
                                <span className="text-md font-semibold">Sno</span>
                              </th>
                              <th className=" border-r-2 border-white pl-2 ">
                                <span className="text-md font-semibold">Document Type</span>
                              </th>
                              <th className="text-center">
                                <span className="text-md font-semibold">File Name</span>
                              </th>
                              <th className="text-center">
                                <span className="text-md font-semibold">Download</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="border">
                            <tr>
                              <td className="border-r-2 border-r text-center ">1</td>
                              <td className="border-r-2 pl-2 border-r  w-60">
                                Supporting Documents
                              </td>
                              <td className="text-center border-r-2 ">12-jan-2022</td>
                              <td className="text-center flex justify-center">
                                <img src="https://img.icons8.com/external-flatart-icons-outline-flatarticons/24/000000/external-attachment-twitter-flatart-icons-outline-flatarticons.png" />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Modal>
      </>
    </div>
  );
};
export default StaffViewLeaveModal;
