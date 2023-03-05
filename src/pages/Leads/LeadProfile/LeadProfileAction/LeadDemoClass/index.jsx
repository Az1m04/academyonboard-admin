import { DeleteOutlined, EditOutlined, MoreOutlined } from '@ant-design/icons';
import { Button, Divider, message, Pagination, Popconfirm, Row, Table, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { Dropdown, Menu } from 'antd';
import { useParams, connect } from 'umi';
import LeadAddDemoClass from './LeadAddDemoClass';
import dayjs from 'dayjs';
import CheckValidation from '@/components/CheckValidation';
import SearchNotFound from '@/assets/icons/empty-search-contact.png';

const LeadDemoClass = ({ dispatch, getLeadDemoClasses, loadingForGetDemoClass }) => {
  const [demoClassModal, setDemoClassModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewSize, setViewSize] = useState(10);
  const [demoClassRecord, setDemoClassRecord] = useState('');

  const { leadId } = useParams();
  const getDemoClass = (start) => {
    dispatch({
      type: 'leads/getLeadDemoClasses',
      payload: {
        query: {
          leadId,
          startIndex: start,
          viewSize,
        },
      },
    });
  };
  const statusDemoClass = (val, status) => {
    const payload = {
      id: val?.id,
      statusId: status,
    };
    dispatch({
      type: 'leads/leadStatusDemoClass',
      payload: {
        body: payload,
        pathParams: {
          leadId,
        },
      },
    });
  };
  useEffect(() => {
    getDemoClass(0);
  }, []);
  function handleChangePagination(current, size) {
    setCurrentPage(current);
    getDemoClass(size * (current - 1), size);
  }

  const menu = (record) => (
    <Menu>
      <Menu.Item onClick={statusDemoClass(record, 'PRTYASGN_COMPLETED')}>Attended</Menu.Item>
      <Menu.Item onClick={statusDemoClass(record, 'PRTYASGN_NOTATTENDED')}>Not Attended</Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: 'Sr No.',
      dataIndex: 'name',
      key: 'namde',
      align: 'center',
      render: (_, __, index) => <p>{index + 1}</p>,
    },
    {
      title: 'Course ',
      dataIndex: 'course',
      key: 'course',
      render: () => <div>course</div>, // TODO
    },
    {
      title: 'Start date',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (__, record) => <div>{dayjs(record?.estimatedStartDate).format('MMMM D, YYYY')}</div>,
    },
    {
      title: 'End date',
      key: 'endDate',
      dataIndex: 'endDate',
      render: (__, record) => (
        <div>{dayjs(record?.estimatedCompletionDate).format('MMMM D, YYYY')}</div>
      ),
    },
    {
      title: 'Batch',
      key: 'batch',
      dataIndex: 'batcg',
      render: (__, record) => <div>{record?.workEffortName}</div>,
    },
    {
      title: 'Mode',
      key: 'mode',
      dataIndex: 'mode',
      render: (data) => <div>{data}</div>,
    },
    {
      title: 'Status',
      key: 'Status',
      dataIndex: 'Status',
      render: () => <div></div>,
    },
    {
      title: 'Action',
      key: 'action',
      render: (__, record) => (
        <div className="flex gap-3">
          <Tooltip title="Edit">
            <Button
              onClick={() => {
                setDemoClassRecord(record);
                setDemoClassModal(true);
              }}
              style={{ border: 'none', padding: '0' }}
            >
              <p className="text-blue-500">
                <EditOutlined />
              </p>
            </Button>
          </Tooltip>
          <Popconfirm
            title="Are you sure to delete demo class?"
            onConfirm={() => {
              dispatch({
                type: 'leads/deleteLeadDemoClass',
                payload: {
                  pathParams: {
                    leadId,
                  },
                },
              }).then((res) => {
                if (res?.status === 'okk') {
                  message.success('Your demo class has been deleted');
                  getDemoClass(0);
                }
              });
            }}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete">
              <Button style={{ border: 'none', padding: '0' }}>
                <p className="text-red-500">
                  <DeleteOutlined />
                </p>
              </Button>
            </Tooltip>
          </Popconfirm>
          <div>
            <Dropdown overlay={menu(record)}>
              <MoreOutlined />
            </Dropdown>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div>
        <div className="flex justify-between">
          <div>
            <div className="text-blue-700 font-medium text-xl">Lead demo class</div>
          </div>
          <div className="flex justify-between gap-5">
            <div className="mx-5">
              <Button
                type="primary"
                onClick={() => {
                  setDemoClassRecord('');
                  setDemoClassModal(true);
                }}
              >
                Assign demo class
              </Button>
            </div>
          </div>
        </div>
        <Divider style={{ marginTop: '0.6rem' }} />
      </div>
      <div className="mt-5">
        <Table
          columns={columns}
          scroll={{ x: 1200 }}
          dataSource={getLeadDemoClasses?.records}
          bordered
          pagination={false}
          loading={loadingForGetDemoClass}
          locale={{
            emptyText: (
              <div className="text-center flex justify-center items-center">
                <div>
                  <p className="text-lg">No Demo class assigned yet!</p>
                  <img
                    className=" ml-16"
                    src={SearchNotFound}
                    alt="No Demo class assigned yet!"
                    style={{ height: '90px' }}
                  />
                </div>
              </div>
            ),
          }}
          footer={() => (
            <CheckValidation show={getLeadDemoClasses?.totalCount > 5}>
              <Row className="mt-2" type="flex" justify="end">
                <Pagination
                  key={`page-${currentPage}`}
                  showSizeChanger
                  pageSizeOptions={['10', '25', '50', '100']}
                  onShowSizeChange={(e, p) => {
                    setViewSize(p);
                    setCurrentPage(1);
                    getDemoClass(0, p);
                  }}
                  defaultCurrent={1}
                  current={currentPage}
                  pageSize={viewSize}
                  total={getLeadDemoClasses?.totalCount}
                  showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                  onChange={handleChangePagination}
                />
              </Row>
            </CheckValidation>
          )}
        />
      </div>
      <LeadAddDemoClass
        setDemoClassModal={setDemoClassModal}
        demoClassModal={demoClassModal}
        getDemoClass={getDemoClass}
        demoClassRecord={demoClassRecord}
      />
    </div>
  );
};

export default connect(({ leads, loading }) => ({
  getLeadDemoClasses: leads?.getLeadDemoClasses,
  loadingForGetDemoClass: loading?.effects['leads/getLeadDemoClasses'],
}))(LeadDemoClass);
