import React, { useEffect } from 'react';
import { connect } from 'umi';
import { Col, Row } from 'antd';
import { HourglassOutlined } from '@ant-design/icons';
// import { LeadsIconPeople } from '@/utils/AppIcons';
import { MdLayersClear, MdHourglassDisabled, MdPendingActions } from 'react-icons/md';
import { VscLayersActive } from 'react-icons/vsc';
import { TiTick } from 'react-icons/ti';
import { HiOutlineStatusOnline, HiOutlineStatusOffline } from 'react-icons/hi';
import { FaLayerGroup } from 'react-icons/fa';
import { BsFileEarmarkBarGraph } from 'react-icons/bs';

const DashBoard = ({ dispatch, dashBoardAnalytical }) => {
  const getDashboard = () => {
    dispatch({
      type: 'dashboard/getDashBoardAnalytical',
    }).catch((err) => {
      console.error(err);
    });
  };
  useEffect(() => {
    getDashboard();
  }, []);

  return (
    <Row gutter={[24, 24]} className="py-5 ">
      <Col xs={24} sm={24} md={12} lg={8} xl={8}>
        <div className="rounded-xl  bg-white px-5 py-2 shadow-md">
          <div className="flex justify-between mt-2 items-center  ">
            <div className="font-semibold text-gray-800 text-lg">Lead</div>
          </div>
          <div className="site-card-wrapper mt-5 ">
            <Row gutter={[16, 16]} className="">
              <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                <div className="bg-white border  flex shadow-md rounded-xl pt-4 pb-4 py-20 px-4 sm:flex-row  md:flex lg:flex-col 2xl:flex-row  md:justify-start lg:justify-start 2xl:justify-start  lg:px-4 2xl:px-4  items-center">
                  <div className="flex items-center justify-center pt-1 bg-blue-500 rounded-xl md:rounded-md lg:rounded-xl xl:rounded-xl h-12   md:h-10 lg:h-12 xl:h-12 w-12 md:w-10 lg:w-12 xl:w-12">
                    <BsFileEarmarkBarGraph className="text-2xl text-white" />
                  </div>
                  <div className="px-4 md:flex-row lg:flex 2xl:flex-col md:items-center lg:items-center 2xl:items-start">
                    <div className="text-sm text-gray-500  ">Only Leads</div>
                    <div className="text-2xl text-gray-700  lg:ml-2 2xl:ml-0 font-bold">
                      {dashBoardAnalytical?.lead?.onlyLeads}
                    </div>
                  </div>
                </div>
              </Col>
              <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                <div className="bg-white border  flex shadow-md rounded-xl pt-4 pb-4 py-20 px-4 sm:flex-row  md:flex lg:flex-col 2xl:flex-row  md:justify-start lg:justify-start 2xl:justify-start  lg:px-4 2xl:px-4  items-center">
                  <div className="flex items-center justify-center pt-1 bg-blue-500  rounded-xl md:rounded-md lg:rounded-md xl:rounded-xl h-12   md:h-10 lg:h-10 xl:h-12 w-12 md:w-10 lg:w-10 xl:w-12">
                    <FaLayerGroup className="text-white text-2xl" />
                  </div>
                  <div className="px-4 md:flex-row lg:flex 2xl:flex-col md:items-center lg:items-center 2xl:items-start">
                    <div className="text-sm text-gray-500  lg:w-6 xl:w-auto">Total</div>
                    <div className="text-2xl text-gray-700  lg:ml-2 2xl:ml-0 font-bold">
                      {' '}
                      {dashBoardAnalytical?.lead?.total}
                    </div>
                  </div>
                </div>
              </Col>
              <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                <div className="bg-white border  flex shadow-md rounded-xl pt-4 pb-4 py-20 px-4 sm:flex-row  md:flex lg:flex-col 2xl:flex-row  md:justify-start lg:justify-start 2xl:justify-start  lg:px-4 2xl:px-4  items-center">
                  <div className="flex items-center justify-center pt-1 bg-blue-500  rounded-xl md:rounded-md lg:rounded-xl xl:rounded-xl h-12   md:h-10 lg:h-12 xl:h-12 w-12 md:w-10 lg:w-12 xl:w-12">
                    <HourglassOutlined
                      style={{ color: 'white' }}
                      className="text-2xl md:text-md lg:text-2xl xl:text-2xl "
                    />
                  </div>
                  <div className="px-4 md:flex-row lg:flex 2xl:flex-col md:items-center lg:items-center 2xl:items-start">
                    <div className="text-sm text-gray-500 lg:w-6 ">Enabled</div>
                    <div className="text-2xl text-gray-700  lg:ml-2 2xl:ml-0 font-bold">
                      {dashBoardAnalytical?.lead?.enabled}
                    </div>
                  </div>
                </div>
              </Col>
              <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                <div className="bg-white border  flex shadow-md rounded-xl pt-4 pb-4 py-20 px-4 sm:flex-row  md:flex lg:flex-col 2xl:flex-row  md:justify-start lg:justify-start 2xl:justify-start  lg:px-4 2xl:px-4  items-center">
                  <div className="flex items-center justify-center pt-1 bg-red-500 rounded-xl md:rounded-md lg:rounded-xl xl:rounded-xl h-12   md:h-10 lg:h-12 xl:h-12 w-12 md:w-10 lg:w-12 xl:w-12">
                    <MdHourglassDisabled className="text-white text-2xl" />
                  </div>
                  <div className="px-4 md:flex-row lg:flex 2xl:flex-col md:items-center lg:items-center 2xl:items-start">
                    <div className="text-sm text-gray-500  ">Disabled</div>
                    <div className="text-2xl text-gray-700 md:ml-2 lg:ml-2 2xl:ml-0 font-bold">
                      {dashBoardAnalytical?.lead?.disabled}
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </Col>

      <Col xl={8} lg={8} md={12} sm={24} xs={24}>
        <div className="rounded-xl  bg-white px-5 py-2 shadow-md ">
          <div className="flex justify-between mt-2 items-center  ">
            <div className="font-semibold text-gray-800 text-lg">Student</div>
          </div>
          <div className="site-card-wrapper mt-5">
            <Row gutter={[16, 16]}>
              <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                <div className="bg-white border  flex shadow-md rounded-xl pt-4 pb-4 py-20 px-4 sm:flex-row  md:flex lg:flex-col 2xl:flex-row  md:justify-start lg:justify-start 2xl:justify-start  lg:px-4 2xl:px-4  items-center">
                  <div className="flex items-center justify-center pt-1 bg-blue-500  rounded-xl  md:rounded-md lg:rounded-xl xl:rounded-xl h-12   md:h-10 lg:h-12 xl:h-12 w-12 md:w-10 lg:w-12 xl:w-12">
                    <FaLayerGroup className="text-white text-2xl" />
                  </div>
                  <div className="px-4 md:flex-row lg:flex 2xl:flex-col md:items-center lg:items-center 2xl:items-start">
                    <div className="text-sm text-gray-500  ">Total</div>
                    <div className="text-2xl text-gray-700 md:ml-2 lg:ml-2 2xl:ml-0 font-bold">
                      {dashBoardAnalytical?.student?.total}
                    </div>
                  </div>
                </div>
              </Col>

              <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                <div className="bg-white border  flex shadow-md rounded-xl pt-4 pb-4 py-20 px-4 sm:flex-row  md:flex lg:flex-col 2xl:flex-row  md:justify-start lg:justify-start 2xl:justify-start  lg:px-4 2xl:px-4  items-center">
                  <div className="flex items-center justify-center pt-1 bg-blue-500  rounded-xl  md:rounded-md lg:rounded-xl xl:rounded-xl h-12   md:h-10 lg:h-12 xl:h-12 w-12 md:w-10 lg:w-12 xl:w-12">
                    <HourglassOutlined
                      style={{ color: 'white' }}
                      className="text-2xl md:text-md lg:text-2xl xl:text-2xl "
                    />
                  </div>
                  <div className="px-4 md:flex-row lg:flex 2xl:flex-col md:items-center lg:items-center 2xl:items-start">
                    <div className="text-sm text-gray-500  ">Enabled</div>
                    <div className="text-2xl text-gray-700 md:ml-2 lg:ml-2 2xl:ml-0 font-bold">
                      {' '}
                      {dashBoardAnalytical?.student?.enabled}
                    </div>
                  </div>
                </div>
              </Col>
              <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                <div className="bg-white border  flex shadow-md rounded-xl pt-4 pb-4 py-20 px-4 sm:flex-row  md:flex lg:flex-col 2xl:flex-row  md:justify-start lg:justify-start 2xl:justify-start  lg:px-4 2xl:px-4  items-center">
                  <div className="flex items-center justify-center pt-1 bg-red-500   rounded-xl  md:rounded-md lg:rounded-xl xl:rounded-xl h-12   md:h-10 lg:h-12 xl:h-12 w-12 md:w-10 lg:w-12 xl:w-12 ">
                    <MdHourglassDisabled className="text-white text-2xl" />
                  </div>
                  <div className="px-4 md:flex-row lg:flex 2xl:flex-col md:items-center lg:items-center 2xl:items-start">
                    <div className="text-sm text-gray-500 ">Disabled</div>
                    <div className="text-2xl text-gray-700 md:ml-2 lg:ml-2 2xl:ml-0 font-bold">
                      {dashBoardAnalytical?.student?.disabled}
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </Col>

      <Col xl={8} lg={8} md={24} sm={24} xs={24}>
        <div className=" px-5 py-2 rounded-xl bg-white shadow-md ">
          <div className="flex justify-between mt-2 items-center  ">
            <div className="font-semibold text-gray-800 text-lg">Employees</div>
          </div>
          <div className="site-card-wrapper mt-5 ">
            <Row gutter={[16, 16]}>
              <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                <div className="bg-white border  flex shadow-md rounded-xl pt-4 pb-4 py-20 px-4 sm:flex-row  md:flex lg:flex-col 2xl:flex-row  md:justify-start lg:justify-start 2xl:justify-start  lg:px-4 2xl:px-4  items-center">
                  <div className="flex items-center justify-center pt-1 bg-blue-500  rounded-xl xl:rounded-xl h-12   md:h-10 lg:h-10 xl:h-12 w-12 md:w-10 lg:w-10 xl:w-12">
                    <FaLayerGroup className="text-white text-2xl" />
                  </div>
                  <div className="px-4 md:flex-row lg:flex 2xl:flex-col md:items-center lg:items-center 2xl:items-start">
                    <div className="text-sm text-gray-500  ">Total</div>
                    <div className="text-2xl text-gray-700 md:ml-2 lg:ml-2 2xl:ml-0 font-bold">
                      {dashBoardAnalytical?.employee?.total}
                    </div>
                  </div>
                </div>
              </Col>
              <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                <div className="bg-white border  flex shadow-md rounded-xl pt-4 pb-4 py-20 px-4 sm:flex-row  md:flex lg:flex-col 2xl:flex-row  md:justify-start lg:justify-start 2xl:justify-start  lg:px-4 2xl:px-4  items-center">
                  <div className="flex items-center justify-center pt-1 bg-blue-500  rounded-xl xl:rounded-xl h-12   md:h-10 lg:h-10 xl:h-12 w-12 md:w-10 lg:w-10 xl:w-12">
                    <MdPendingActions className="text-white text-2xl" />
                  </div>
                  <div className="px-4 md:flex-row lg:flex 2xl:flex-col md:items-center lg:items-center 2xl:items-start">
                    <div className="text-sm text-gray-500  ">Pending</div>
                    <div className="text-2xl text-gray-700 md:ml-2 lg:ml-2 2xl:ml-0 font-bold">
                      {dashBoardAnalytical?.employee?.pending}
                    </div>
                  </div>
                </div>
              </Col>
              <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                <div className="bg-white border  flex shadow-md rounded-xl pt-4 pb-4 py-20 px-4 sm:flex-row  md:flex lg:flex-col 2xl:flex-row  md:justify-start lg:justify-start 2xl:justify-start  lg:px-4 2xl:px-4  items-center">
                  <div className="flex items-center justify-center pt-1 bg-blue-500  rounded-xl xl:rounded-xl h-12   md:h-10 lg:h-10 xl:h-12 w-12 md:w-10 lg:w-10 xl:w-12">
                    <div className="border rounded-full">
                      <TiTick className="text-white text-2xl" />
                    </div>
                  </div>
                  <div className="px-4 md:flex-row lg:flex 2xl:flex-col md:items-center lg:items-center 2xl:items-start">
                    <div className="text-sm text-gray-500  ">Accepted</div>
                    <div className="text-2xl text-gray-700 md:ml-2 lg:ml-2 2xl:ml-0 font-bold">
                      {dashBoardAnalytical?.employee?.accepted}
                    </div>
                  </div>
                </div>
              </Col>
              <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                <div className="bg-white border  flex shadow-md rounded-xl pt-4 pb-4 py-20 px-4 sm:flex-row  md:flex lg:flex-col 2xl:flex-row  md:justify-start lg:justify-start 2xl:justify-start  lg:px-4 2xl:px-4  items-center">
                  <div className="flex items-center justify-center pt-1 bg-red-500  rounded-xl xl:rounded-xl h-12   md:h-10 lg:h-10 xl:h-12 w-12 md:w-10 lg:w-10 xl:w-12">
                    <MdHourglassDisabled className="text-white text-2xl" />
                  </div>
                  <div className="px-4 md:flex-row lg:flex 2xl:flex-col md:items-center lg:items-center 2xl:items-start">
                    <div className="text-sm text-gray-500  ">Disabled</div>
                    <div className="text-2xl text-gray-700 md:ml-2 lg:ml-2 2xl:ml-0 font-bold">
                      {dashBoardAnalytical?.employee?.disabled}
                    </div>
                  </div>
                </div>
              </Col>

              {/* <Col xl={12} lg={12} md={8} sm={24} xs={24}>
                  <div className="bg-white border  flex shadow-md rounded-xl pt-4 pb-4 py-20 px-4 sm:flex-row  md:flex lg:flex-col 2xl:flex-row  md:justify-start lg:justify-start 2xl:justify-start  lg:px-4 2xl:px-4  items-center">
                    <div className="flex items-center justify-center pt-1 bg-red-500  rounded-xl  md:rounded-md lg:rounded-xl xl:rounded-xl h-12   md:h-10 lg:h-12 xl:h-12 w-12 md:w-10 lg:w-12 xl:w-12">
                      <FileUnknownOutlined style={{ color: 'white' }} className="text-2xl" />
                    </div>
                    <div className="px-4 md:flex-row lg:flex 2xl:flex-col md:items-center lg:items-center 2xl:items-start">
                      <div className="text-sm text-gray-500  ">Draft</div>
                      <div className="text-2xl text-gray-700 md:ml-2 lg:ml-2 2xl:ml-0 font-bold">
                        {totalCountBranches?.stats?.draftProducts}
                      </div>
                    </div>
                  </div>
                </Col> */}
            </Row>
          </div>
        </div>
      </Col>
      <Col xl={12} lg={12} md={12} sm={24} xs={24}>
        <div className=" px-5 py-2 bg-white rounded-xl shadow-md">
          <div className="flex justify-between mt-2 items-center">
            <div className="font-semibold text-gray-800 text-lg">Batches</div>
          </div>
          <div className="site-card-wrapper mt-5 ">
            <Row gutter={[16, 16]}>
              <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                <div className="bg-white border  flex shadow-md rounded-xl pt-4 pb-4 py-20 px-4 sm:flex-row  md:flex lg:flex-col 2xl:flex-row  md:justify-start lg:justify-start 2xl:justify-start  lg:px-4 2xl:px-4  items-center">
                  <div className="flex items-center justify-center pt-1 bg-blue-500  rounded-xl xl:rounded-xl h-12   md:h-10 lg:h-10 xl:h-12 w-12 md:w-10 lg:w-10 xl:w-12">
                    <FaLayerGroup className="text-white text-2xl" />
                  </div>
                  <div className="px-4 md:flex-row lg:flex 2xl:flex-col md:items-center lg:items-center 2xl:items-start">
                    <div className="text-sm text-gray-500  ">Total</div>
                    <div className="text-2xl text-gray-700 md:ml-2 lg:ml-2 2xl:ml-0 font-bold">
                      {dashBoardAnalytical?.batch?.total}
                    </div>
                  </div>
                </div>
              </Col>
              <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                <div className="bg-white border  flex shadow-md rounded-xl pt-4 pb-4 py-20 px-4 sm:flex-row  md:flex lg:flex-col 2xl:flex-row  md:justify-start lg:justify-start 2xl:justify-start  lg:px-4 2xl:px-4  items-center">
                  <div className="flex items-center justify-center pt-1 bg-blue-500  rounded-xl xl:rounded-xl h-12   md:h-10 lg:h-10 xl:h-12 w-12 md:w-10 lg:w-10 xl:w-12">
                    <VscLayersActive className="text-white text-2xl" />
                  </div>
                  <div className="px-4 md:flex-row lg:flex 2xl:flex-col md:items-center lg:items-center 2xl:items-start">
                    <div className="text-sm text-gray-500  ">Active</div>
                    <div className="text-2xl text-gray-700 md:ml-2 lg:ml-2 2xl:ml-0 font-bold">
                      {dashBoardAnalytical?.batch?.active}
                    </div>
                  </div>
                </div>
              </Col>
              <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                <div className="bg-white border  flex shadow-md rounded-xl pt-4 pb-4 py-20 px-4 sm:flex-row  md:flex lg:flex-col 2xl:flex-row  md:justify-start lg:justify-start 2xl:justify-start  lg:px-4 2xl:px-4  items-center">
                  <div className="flex items-center justify-center pt-1 bg-blue-500  rounded-xl xl:rounded-xl h-12   md:h-10 lg:h-10 xl:h-12 w-12 md:w-10 lg:w-10 xl:w-12">
                    <MdLayersClear className="text-2xl text-white" />
                  </div>
                  <div className="px-4 md:flex-row lg:flex 2xl:flex-col md:items-center lg:items-center 2xl:items-start">
                    <div className="text-sm text-gray-500  ">InActive</div>
                    <div className="text-2xl text-gray-700 md:ml-2 lg:ml-2 2xl:ml-0 font-bold">
                      {dashBoardAnalytical?.batch?.inActive}
                    </div>
                  </div>
                </div>
              </Col>
              <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                <div className="bg-white border  flex shadow-md rounded-xl pt-4 pb-4 py-20 px-4 sm:flex-row  md:flex lg:flex-col 2xl:flex-row  md:justify-start lg:justify-start 2xl:justify-start  lg:px-4 2xl:px-4  items-center">
                  <div className="flex items-center justify-center pt-1 bg-blue-500  rounded-xl xl:rounded-xl h-12   md:h-10 lg:h-10 xl:h-12 w-12 md:w-10 lg:w-10 xl:w-12">
                    <HiOutlineStatusOnline className="text-white text-2xl" />
                  </div>
                  <div className="px-4 md:flex-row lg:flex 2xl:flex-col md:items-center lg:items-center 2xl:items-start">
                    <div className="text-sm text-gray-500  ">Online</div>
                    <div className="text-2xl text-gray-700 md:ml-2 lg:ml-2 2xl:ml-0 font-bold">
                      {dashBoardAnalytical?.batch?.online}
                    </div>
                  </div>
                </div>
              </Col>
              <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                <div className="bg-white border  flex shadow-md rounded-xl pt-4 pb-4 py-20 px-4 sm:flex-row  md:flex lg:flex-col 2xl:flex-row  md:justify-start lg:justify-start 2xl:justify-start  lg:px-4 2xl:px-4  items-center">
                  <div className="flex items-center justify-center pt-1 bg-red-500 rounded-xl h-12 w-12">
                    <HiOutlineStatusOffline className="text-white text-2xl" />
                  </div>
                  <div className="px-4 md:flex-row lg:flex 2xl:flex-col md:items-center lg:items-center 2xl:items-start">
                    <div className="text-sm text-gray-500  ">Offline</div>
                    <div className="text-2xl text-gray-700 md:ml-2 lg:ml-2 2xl:ml-0 font-bold">
                      {' '}
                      {dashBoardAnalytical?.batch?.offline}
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </Col>
      {/* <Col xl={12} lg={12} md={12} sm={24} xs={24}>
          <div className=" px-5 py-2 rounded-xl bg-white shadow-md ">
            <div className="flex justify-between mt-2 items-center  ">
              <div className="font-semibold text-gray-800 text-lg">Contacts</div>
            </div>
            <div className="site-card-wrapper mt-5">
              <Row gutter={[16, 16]}>
                <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                  <div className="bg-white border  flex shadow-md rounded-xl pt-4 pb-4 py-20 px-4 sm:flex-row  md:flex lg:flex-col 2xl:flex-row  md:justify-start lg:justify-start 2xl:justify-start  lg:px-4 2xl:px-4  items-center">
                    <div className="flex items-center justify-center pt-1 bg-blue-500  rounded-xl h-12 w-12">
                      <SlidersOutlined style={{ color: 'white' }} className="text-2xl" />
                    </div>
                    <div className="px-4 md:flex-row lg:flex 2xl:flex-col md:items-center lg:items-center 2xl:items-start">
                      <div className="text-sm text-gray-500  ">Primary</div>
                      <div className="text-2xl text-gray-700 md:ml-2 lg:ml-2 2xl:ml-0 font-bold">
                        {totalCountBranches?.stats?.contactsCount?.primaryContactCount}
                      </div>
                    </div>
                  </div>
                </Col>
                <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                  <div className="bg-white border  flex shadow-md rounded-xl pt-4 pb-4 py-20 px-4 sm:flex-row  md:flex lg:flex-col 2xl:flex-row  md:justify-start lg:justify-start 2xl:justify-start  lg:px-4 2xl:px-4  items-center">
                    <div className="flex items-center justify-center pt-1 bg-yellow-500 rounded-xl h-12 w-12">
                      <WarningOutlined style={{ color: 'white' }} className="text-2xl" />
                    </div>
                    <div className="px-4 md:flex-row lg:flex 2xl:flex-col md:items-center lg:items-center 2xl:items-start">
                      <div className="text-sm text-gray-500  ">Not Primary</div>
                      <div className="text-2xl text-gray-700 md:ml-2 lg:ml-2 2xl:ml-0 font-bold">
                        {' '}
                        {totalCountBranches?.stats?.contactsCount?.notPrimaryContactCount}
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </Col> */}
    </Row>
  );
};

export default connect(({ dashboard, user, vendor }) => ({
  currentUser: user.currentUser,
  vendors: vendor.vendors,
  dashBoardAnalytical: dashboard?.dashBoardAnalytical,
}))(DashBoard);

/**
 *  const convertObjectToArray = (obj) => {
    return Object.keys(obj).map((key) => {
      console.log(obj[key], 'bishnu');
      return {
        key,
        value: obj[key],
      };
    });
  };

  const filteredData = convertObjectToArray(dashBoardAnalytical).filter(({ key }) => {
    return key === 'lead' || key === 'student' || key === 'employee' || key === 'batch';
  });

  // convert first letter of key to uppercase
  const convertKeyToUppercase = (key) => {
    return key.charAt(0).toUpperCase() + key.slice(1);
  };
  return (
    <Row gutter={[24, 24]} className="py-5 ">
      {filteredData.map(({ key, value }) => {
        return (
          <Col key={key} xl={8} lg={8} md={12} sm={24} xs={24}>
            <div className="rounded-xl  bg-white px-5 py-2 shadow-md ">
              <div className="flex justify-between mt-2 items-center  ">
                <div className="font-semibold text-gray-800 text-lg">
                  {convertKeyToUppercase(key)}
                </div>
              </div>
              <div className="site-card-wrapper mt-5">
                <Row gutter={[16, 16]}>
                  <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                    <div className="bg-white border  flex shadow-md rounded-xl pt-4 pb-4 py-20 px-4 sm:flex-row  md:flex lg:flex-col 2xl:flex-row  md:justify-start lg:justify-start 2xl:justify-start  lg:px-4 2xl:px-4  items-center">
                      <div className="flex items-center justify-center pt-1 bg-blue-500  rounded-xl  md:rounded-md lg:rounded-xl xl:rounded-xl h-12   md:h-10 lg:h-12 xl:h-12 w-12 md:w-10 lg:w-12 xl:w-12">
                        <FolderOutlined style={{ color: 'white' }} className="text-2xl" />
                      </div>
                      <div className="px-4 md:flex-row lg:flex 2xl:flex-col md:items-center lg:items-center 2xl:items-start">
                        <div className="text-sm text-gray-500  ">Total</div>
                        <div className="text-2xl text-gray-700 md:ml-2 lg:ml-2 2xl:ml-0 font-bold">
                          {value?.total}
                        </div>
                      </div>
                    </div>
                  </Col>

                  <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                    <div className="bg-white border  flex shadow-md rounded-xl pt-4 pb-4 py-20 px-4 sm:flex-row  md:flex lg:flex-col 2xl:flex-row  md:justify-start lg:justify-start 2xl:justify-start  lg:px-4 2xl:px-4  items-center">
                      <div className="flex items-center justify-center pt-1 bg-yellow-500  rounded-xl  md:rounded-md lg:rounded-xl xl:rounded-xl h-12   md:h-10 lg:h-12 xl:h-12 w-12 md:w-10 lg:w-12 xl:w-12">
                        <FileExclamationOutlined style={{ color: 'white' }} className="text-2xl" />
                      </div>
                      <div className="px-4 md:flex-row lg:flex 2xl:flex-col md:items-center lg:items-center 2xl:items-start">
                        <div className="text-sm text-gray-500  ">Enabled</div>
                        <div className="text-2xl text-gray-700 md:ml-2 lg:ml-2 2xl:ml-0 font-bold">
                          {' '}
                          {value?.enabled}
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                    <div className="bg-white border  flex shadow-md rounded-xl pt-4 pb-4 py-20 px-4 sm:flex-row  md:flex lg:flex-col 2xl:flex-row  md:justify-start lg:justify-start 2xl:justify-start  lg:px-4 2xl:px-4  items-center">
                      <div className="flex items-center justify-center pt-1 bg-red-500   rounded-xl  md:rounded-md lg:rounded-xl xl:rounded-xl h-12   md:h-10 lg:h-12 xl:h-12 w-12 md:w-10 lg:w-12 xl:w-12 ">
                        <CalendarOutlined style={{ color: 'white' }} className="text-2xl" />
                      </div>
                      <div className="px-4 md:flex-row lg:flex 2xl:flex-col md:items-center lg:items-center 2xl:items-start">
                        <div className="text-sm text-gray-500 ">Disabled</div>
                        <div className="text-2xl text-gray-700 md:ml-2 lg:ml-2 2xl:ml-0 font-bold">
                          {value?.disabled}
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </Col>
        );
      })}
    </Row>
  );
};

export default connect(({ dashboard, user, vendor }) => ({
  currentUser: user.currentUser,
  vendors: vendor.vendors,
  dashBoardAnalytical: dashboard?.dashBoardAnalytical,
}))(DashBoard);

 */
