import { Button, Divider, Form, Select, Table, Tag, Tooltip } from 'antd';
import { connect, useParams } from 'umi';
import React, { useEffect, useState } from 'react';
import StaffLeaveForm from './StaffLeaveForm';
import SearchNotFound from '@/assets/icons/empty-search-contact.png';
import moment from 'moment';
import { EyeOutlined } from '@ant-design/icons';
import { PlusCircle } from 'react-bootstrap-icons';

const StaffLeave = ({ dispatch, getAllStaffLeave }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [form] = Form.useForm();
  // const { TabPane } = Tabs;
  const { staffId } = useParams();
  const leaveType = [
    {
      description: 'Sick',
      typeId: 'SICK',
    },
    {
      description: 'Casual',
      typeId: 'CASUAL',
    },
    {
      description: 'Planned',
      typeId: 'PLANNED',
    },
    {
      description: 'Without Pay',
      typeId: 'WITHOUT_PAY',
    },
  ];
  const getLeaveStatus = (value) => {
    if (value === 'APPROVED') return 'success';
    if (value === 'REJECTED') {
      return 'error';
    }
    return 'warning';
  };
  const columns = [
    {
      title: <div className="text-center">Sr. no</div>,

      render: (_, __, index) => <div className="text-center text-gray-700">{index + 1}</div>,
    },
    {
      title: <div className="text-center">App. Number</div>,
      render: (_, record) => <div className="text-gray-700 text-center">{record?.leaveId}</div>,
    },

    {
      title: <div className="text-center">Leave Type</div>,
      dataIndex: 'leaveType',

      key: 'leaveType',
      render: (text) => <div className=" text-center text-gray-700">{text}</div>,
    },
    {
      title: <div className="text-center">From Date</div>,

      render: (data) => (
        <div className="text-center text-gray-700">
          {moment(data?.startsAt).format('DD MMM YYYY')}
        </div>
      ),
    },
    {
      title: <div className="text-center"> From To</div>,

      render: (data) => (
        <div className="text-center text-gray-700">
          {moment(data?.endsAt).format('DD MMM YYYY')}
        </div>
      ),
    },
    {
      title: <div className="text-center"> Total Days</div>,

      render: (_, record) => <div className="text-center text-gray-700">{record?.totalDays}</div>,
    },
    {
      title: <div className="text-center"> Applied On</div>,

      render: (data) => (
        <div className="text-center text-gray-700">
          {moment(data?.appliedAt).format('DD MMM YYYY')}
        </div>
      ),
    },
    {
      title: <div className="text-center"> Supporting Document</div>,
      width: '7rem',
      align: 'center',
      render: (data) => (
        <>
          {data?.content?.downloadUrl ? (
            <Tooltip title="View document">
              <div
                className="text-center text-gray-700 flex justify-center cursor-pointer"
                onClick={() => {
                  // setPreviewModal(true);
                  // setPreviewImage(data?.content?.downloadUrl);
                }}
              >
                {
                  <img
                    className="w-5 h-5"
                    src={
                      'https://img.icons8.com/external-flatart-icons-outline-flatarticons/24/000000/external-attachment-twitter-flatart-icons-outline-flatarticons.png'
                    }
                  />
                }
              </div>
            </Tooltip>
          ) : (
            '--'
          )}
        </>
      ),
    },
    {
      title: <div className="text-center"> Leave status</div>,

      render: (data) => (
        <div className="text-center text-gray-700 flex justify-center">
          <Tag color={getLeaveStatus(data?.leaveStatusId)}>{data?.leaveStatusId}</Tag>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="flex mx-7 justify-between ">
          <Tooltip title="View leave details">
            <a
              className="text-blue-500 "
              // onClick={() => {
              //   setViewModal(true);
              //   setViewData(record);
              //   getLeaveDetails(record?.appliedFor?.id, record?.id);
              // }}
            >
              <EyeOutlined className="text-lg" />
            </a>
          </Tooltip>
          {record?.leaveStatusId === 'PENDING' && (
            <Tooltip title="Mark leave status">
              <a
              // onClick={() => {
              //   setApproveModal(true);
              //   setViewData(record);
              //   setLeaveNo(record?.id);
              //   setAppiedFor(record?.appliedFor?.id);
              // }}
              >
                <PlusCircle className="text-lg mt-1.5" />
              </a>
            </Tooltip>
          )}
        </div>
      ),
    },
  ];
  const getAllLeave = () => {
    dispatch({
      type: 'staff/getAllStaffLeave',
      payload: {
        pathParams: { staffId },
      },
    });
  };

  useEffect(() => {
    getAllLeave();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="mt-4">
        <Form form={form} hideRequiredMark>
          <div className="flex justify-between">
            <div>
              <div className="text-blue-700 font-medium text-xl"> Staff leave</div>
            </div>
            <div className="flex justify-between gap-5">
              <div>
                <Button type="primary" onClick={() => setIsModalVisible(true)}>
                  Apply leave
                </Button>
              </div>
              <div className="mr-4">
                <Select placeholder="Select leave type" className="w-40">
                  {leaveType?.map((item) => (
                    <Select.Option key={item?.typeId} value={item?.typeId}>
                      {item?.description}
                    </Select.Option>
                  ))}
                </Select>
              </div>
            </div>
          </div>
          <Divider style={{ marginTop: '0.6rem' }} />

          <div className="mr-5 mt-5">
            {/* <Tabs
              //   defaultActiveKey={tabsPanes?.[0]?.key}
              //   onChange={(val) => setTab(val)}
              className="font-semibold text-blue-500"
            > */}
            {/* {tabsPanes?.map((item) => ( */}
            {/* <TabPane
                //   tab={item?.value}
                //   key={item?.key}
                style={{ height: '45rem', overflow: 'auto', padding: '11px' }}
              > */}
            {/* {item?.value === 'Wallet' ? ( */}
            <Table
              dataSource={getAllStaffLeave?.records}
              //   className={styles?.tableStyling}
              columns={columns}
              scroll={{ x: 500 }}
              bordered
              size="large"
              style={{ width: '100%', marginTop: '20px' }}
              locale={{
                emptyText: (
                  <div className="flex items-center justify-center text-center">
                    <div>
                      <p className="text-lg">No records yet!</p>
                      <img
                        className="ml-16 "
                        src={SearchNotFound}
                        alt="No records found!"
                        style={{ height: '100px' }}
                      />
                    </div>
                  </div>
                ),
              }}
            />
            {/* ) : ( */}
            {/* <Table
                //   dataSource={salaryData}
                  //   className={styles?.tableStyling}
                //   columns={columnsSalary}
                  scroll={{ x: 500 }}
                  bordered
                  size="large"
                  style={{ width: '100%', marginTop: '20px' }}
                  locale={{
                    emptyText: (
                      <div className="flex items-center justify-center text-center">
                        <div>
                          <p className="text-lg">No records yet!</p>
                          <img
                            className="ml-16 "
                            // src={SearchNotFound}
                            alt="No records found!"
                            style={{ height: '100px' }}
                          />
                        </div>
                      </div>
                    ),
                  }}
                /> */}
            {/* )} */}
            {/* </TabPane> */}
            {/* ))} */}
            {/* </Tabs> */}
          </div>
        </Form>
      </div>
      <StaffLeaveForm
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        getAllLeave={getAllLeave}
      />
    </div>
  );
};

export default connect(({ staff }) => ({
  getAllStaffLeave: staff?.getAllStaffLeave,
}))(StaffLeave);
