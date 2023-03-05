import React from 'react';
import { Collapse } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import PartyBasicDetails from '@/components/PartyBasicDetails';

const { Panel } = Collapse;

const BasicStudentDetails = ({ match, studentRecord }) => {
  return (
    <>
      <div className="bg-white rounded shadow">
        <PartyBasicDetails
          partyId={match?.params?.studentId}
          typeText="Student"
          type="student"
          partyDetails={studentRecord}
        />
      </div>
      <div className="bg-white rounded shadow">
        <Collapse
          bordered={false}
          expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
          className="site-collapse-custom-collapse"
          defaultActiveKey="1"
        >
          <Panel
            header="Basic details"
            key="1"
            className="site-collapse-custom-panel"
            style={{ backgroundColor: '#fff' }}
          >
            <div className=" ">
              <p className="flex justify-between">
                <p className=" text-gray-500 text-sm uppercase font-medium mb-0">Phone</p>{' '}
                <p className="tracking-wide text-black font-semibold text-sm  mb-0">
                  {studentRecord?.phones.map((item) => `${item?.countryCode} ${item.phone}`)}
                </p>
              </p>
              <p className="flex justify-between ">
                <p className="text-sm uppercase font-medium text-gray-500 mb-0">Email</p>
                <p className="tracking-wide text-black font-semibold text-sm  mb-0">
                  {studentRecord?.emailAddresses.map((item) => item.email)}
                </p>
              </p>
            </div>
            <div>
              <p className="flex justify-between mb-0">
                <p className="flex-1 text-sm uppercase font-medium  text-gray-500 pr-1 mb-0">
                  Address
                </p>
                <p className="flex-1 text-right tracking-wide text-black font-semibold mb-0 text-sm  ">
                  {studentRecord?.addresses?.map((item) => item.formattedAddress)}
                </p>
              </p>
            </div>
          </Panel>
        </Collapse>
      </div>
      <div className="bg-white rounded shadow">
        <Collapse
          bordered={false}
          expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
          className="site-collapse-custom-collapse"
        >
          <Panel
            header="Course details"
            key="1"
            className="site-collapse-custom-panel"
            style={{ backgroundColor: '#fff' }}
          >
            <div className="flex gap-5 mb-2">
              <p>
                {/* Name:{' '}
                <span className="whitespace-nowrap">{studentRecord?.displayName.slice(3)}</span> */}
              </p>
              {/* <p>Phone: {studentRecord?.phones.map((item) => item.phone)}</p> */}
            </div>
            <div className="flex gap-5">
              {/* <p>Email: {studentRecord?.emailAddresses.map((item) => item.email)}</p>
              <p>Gender: {studentRecord?.gender}</p> */}
            </div>
            <div className="flex gap-5">
              {/* <p>Address: {studentRecord?.addresses?.map((item) => item.formattedAddress)}</p> */}
            </div>
          </Panel>
        </Collapse>
      </div>
      <div className="bg-white rounded shadow">
        <Collapse
          bordered={false}
          expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
          className="site-collapse-custom-collapse"
        >
          <Panel
            header="Fee details"
            key="1"
            className="site-collapse-custom-panel"
            style={{ backgroundColor: '#fff' }}
          >
            <div className="flex gap-5 mb-2">
              <p>
                {/* Name:{' '}
                <span className="whitespace-nowrap">{studentRecord?.displayName.slice(3)}</span> */}
              </p>
              {/* <p>Phone: {studentRecord?.phones.map((item) => item.phone)}</p> */}
            </div>
            <div className="flex gap-5">
              {/* <p>Email: {studentRecord?.emailAddresses.map((item) => item.email)}</p>
              <p>Gender: {studentRecord?.gender}</p> */}
            </div>
            <div className="flex gap-5">
              {/* <p>Address: {studentRecord?.addresses?.map((item) => item.formattedAddress)}</p> */}
            </div>
          </Panel>
        </Collapse>
      </div>
      <div className="bg-white rounded shadow">
        <Collapse
          bordered={false}
          expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
          className="site-collapse-custom-collapse"
        >
          <Panel
            header="Parent details"
            key="1"
            className="site-collapse-custom-panel"
            style={{ backgroundColor: '#fff' }}
          >
            <div className="flex gap-5 mb-2">
              <p>
                {/* Name:{' '}
                <span className="whitespace-nowrap">{studentRecord?.displayName.slice(3)}</span> */}
              </p>
              {/* <p>Phone: {studentRecord?.phones.map((item) => item.phone)}</p> */}
            </div>
            <div className="flex gap-5">
              {/* <p>Email: {studentRecord?.emailAddresses.map((item) => item.email)}</p>
              <p>Gender: {studentRecord?.gender}</p> */}
            </div>
            <div className="flex gap-5">
              {/* <p>Address: {studentRecord?.addresses?.map((item) => item.formattedAddress)}</p> */}
            </div>
          </Panel>
        </Collapse>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  studentRecord: state.student.studentRecord,
});

export default connect(mapStateToProps)(BasicStudentDetails);
