import React from 'react';
import {
  Table,
  Input,
  Pagination,
  Row,
  message,
  Popconfirm,
  Dropdown,
  Menu,
  Button,
  Tooltip,
} from 'antd';
import SearchNotFound from '@/assets/icons/empty-search-contact.png';
import { debounce } from 'lodash';
import dayjs from 'dayjs';
import { connect } from 'umi';
import { CaretDownFill } from 'react-bootstrap-icons';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const BatchListTable = ({
  currentPage,
  setViewSize,
  setCurrentPage,
  setStartIndex,
  viewSize,
  setKeyword,
  totalRecords,
  dispatch,
  getBatches,
  history,
  loading,
  primaryColor,
}) => {
  const { Search } = Input;

  const action = (value) => {
    setKeyword(value);
    setCurrentPage(1);
    setStartIndex(0);
  };
  const debounceSearch = debounce(action, 400);
  const deleteBatch = (batchId) => {
    dispatch({
      type: 'batch/changeActivityStatus',
      payload: {
        body: { statusId: 'CAL_REMOVED' },
        pathParams: { scheduleId: batchId },
      },
    }).then((res) => {
      if (res?.responseMessage === 'success') {
        message.success('Batch deleted successfully');
        getBatches();
      } else {
        message.error('Something went wrong !');
      }
    });
  };
  const columns = [
    {
      title: 'Sr.no.',
      dataIndex: 'srno',
      align: 'center',
      render: (_, __, index) => index + 1 + viewSize * (currentPage - 1),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      render: (name, record) => (
        <div className="w-48 ml-2">
          <div className="font-medium capitalize truncate" title={record?.name}>
            {record?.name}
          </div>
          {/* <div className="">Requested on {dayjs(record.created_at).fromNow()}</div> */}
        </div>
      ),
    },
    {
      title: 'Start time',
      dataIndex: 'startsAt',
      width: 100,
      render: (data) => <p>{dayjs(data)?.format('h:mm A') || '_'}</p>,
    },
    {
      title: 'End time',
      dataIndex: 'endsAt',
      width: 100,
      render: (data) => <p>{dayjs(data)?.format('h:mm A') || '_'}</p>,
    },
    {
      title: 'Course',
      dataIndex: '',
      render: (data) => <p>{data?.course?.name}</p>,
    },
    {
      title: 'Type',
      dataIndex: 'mode',
    },
    {
      title: 'Class',
      align: 'center',
      dataIndex: '',
      render: (data) => <p className="text-center">{data?.classRoom?.name || '--'}</p>,
    },
    {
      title: () => <p className="mb-0 pl-5">Status</p>,
      dataIndex: 'statusId',
      align: 'left',
      render: (data, record) => (
        <span
          onClick={(ev) => {
            ev.preventDefault();
            ev.stopPropagation();
          }}
        >
          <Dropdown
            trigger={['click']}
            overlay={
              <Menu>
                {[
                  { text: 'Active', value: 'CAL_PLANNED' },
                  { text: 'Inactive', value: 'CAL_CANCELLED' },
                ].map((item) => {
                  if (item.value !== data)
                    return (
                      <Menu.Item
                        onClick={() => {
                          if (data === 'CAL_PLANNED') {
                            dispatch({
                              type: 'batch/changeActivityStatus',
                              payload: {
                                body: { statusId: 'CAL_CANCELLED' },
                                pathParams: { scheduleId: record?.id },
                              },
                            }).then((res) => {
                              if (res?.message?.length !== 0) {
                                message.success('Batch is inactivated successfully.');

                                getBatches();
                              } else {
                                message.error('Something went wrong !');
                              }
                            });
                          } else {
                            dispatch({
                              type: 'batch/changeActivityStatus',
                              payload: {
                                body: { statusId: 'CAL_PLANNED' },
                                pathParams: { scheduleId: record?.id },
                              },
                            }).then((res) => {
                              if (res?.message?.length !== 0) {
                                message.success('Batch is activated successfully.');

                                getBatches();
                              } else {
                                message.error('Something went wrong !');
                              }
                            });
                          }
                        }}
                        key={item.value}
                      >
                        {item.text}
                      </Menu.Item>
                    );
                  return null;
                })}
              </Menu>
            }
          >
            <Button type="text">
              <div className="flex items-center">
                {data === 'CAL_PLANNED' ? 'Active' : 'Inactive'}{' '}
                <div className="flex items-center">
                  <CaretDownFill className="ml-2" />
                </div>
              </div>
            </Button>
          </Dropdown>
        </span>
      ),
    },
    {
      title: () => <p className="mb-0 pl-5">Action</p>,
      dataIndex: 'id',
      align: 'left',
      render: (id) => (
        <div className="flex">
          <div
            onClick={(ev) => {
              ev.preventDefault();
              ev.stopPropagation();
              history.push(`/batches/update/${id}`);
            }}
          >
            <Tooltip title="Edit batch">
              <div className={`py-3 cursor-pointer items-center flex`}>
                <p className="px-3 mb-0 " style={{ color: primaryColor }}>
                  <EditOutlined className="text-yellow-700" />
                </p>
              </div>
            </Tooltip>
          </div>
          <div
            className="text-red-600"
            onClick={(ev) => {
              ev.preventDefault();
              ev.stopPropagation();
            }}
          >
            <Popconfirm
              title="Are you sure you want to delete this batch?"
              okText="Delete"
              okType="danger"
              onConfirm={() => deleteBatch(id)}
            >
              <div className={` py-3 cursor-pointer items-center flex`}>
                <p className="px-3 mb-0 ">
                  <DeleteOutlined className=" text-red-600" />
                </p>
              </div>
            </Popconfirm>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex mx-4 mb-4">
        <div className="w-full mt-4">
          <Search
            size="large"
            placeholder="Enter keyword here to search batch..."
            onChange={(value) => debounceSearch(value?.target?.value)}
          />
        </div>
      </div>
      <div className="w-full">
        <Table
          loading={loading}
          className="no-shadow zcp-fixed-w-table "
          rowClassName="cursor-pointer"
          pagination={false}
          scroll={{ x: 1300 }}
          columns={columns}
          dataSource={totalRecords?.records}
          rowKey={(record) => record.id}
          onRow={(record) => ({
            onClick: () => {
              history.push(`/batches/${record?.id}`);
            },
          })}
          locale={{
            emptyText: (
              <div className="flex items-center justify-center text-center">
                <div>
                  <p className="text-lg">No batches yet!</p>
                  <img
                    className="ml-16 "
                    src={SearchNotFound}
                    alt="No batch found!"
                    style={{ height: '100px' }}
                  />
                </div>
              </div>
            ),
          }}
          footer={() => (
            <Row className="mt-2" type="flex" justify="end">
              <Pagination
                key={`page-${currentPage}`}
                showSizeChanger
                pageSizeOptions={['5', '10', '25', '50', '100']}
                onShowSizeChange={(current, size) => {
                  setViewSize(size);
                  setCurrentPage(current);
                  setStartIndex(0);
                }}
                defaultCurrent={1}
                current={currentPage}
                pageSize={viewSize}
                total={totalRecords?.totalCount}
                showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                onChange={(current) => {
                  setStartIndex(viewSize * (current - 1));
                  setCurrentPage(current);
                }}
              />
            </Row>
          )}
        />
      </div>
    </div>
  );
};

export default connect(({ settings, loading }) => ({
  primaryColor: settings.primaryColor,
  loading: loading.effects['batch/getBatches'],
}))(BatchListTable);
