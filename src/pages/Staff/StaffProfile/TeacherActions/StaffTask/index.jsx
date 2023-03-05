import EmptyState from '@/components/EmptyState';
import { getInitials } from '@/utils/common';
import {
  Avatar,
  DatePicker,
  Divider,
  Pagination,
  Popover,
  Row,
  Select,
  Table,
  Tooltip,
} from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import emptyStateSvg from '@/assets/icons/space-empty.svg';

import { history, connect, useParams } from 'umi';
import CheckValidation from '@/components/CheckValidation';

const StaffTask = ({ staffTasksList, dispatch, loadingForGetData }) => {
  const [selectedDate, setSelectedDate] = useState(undefined);
  const [ranges, setRanges] = useState([moment().subtract(7, 'day'), moment()]);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewSize, setViewSize] = useState(10);

  const { RangePicker } = DatePicker;

  const { staffId } = useParams();
  const activityTimeList = [
    {
      label: 'Today',
      id: 'TODAY',
      value: moment().format('YYYY-MM-DD HH:mm:ss'),
      startDate: moment().format('YYYY-MM-DD HH:mm:ss'),
      endDate: moment().format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      label: 'Yesterday',
      id: 'YESTERDAY',
      startDate: moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss'),
      endDate: moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss'),
      value: moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      label: 'Last 7 days',
      id: 'LAST_7_DAYS',
      value: moment().subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss'),
      startDate: moment().subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss'),
      endDate: moment().format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      label: 'Last 15 days',
      id: 'LAST_15_DAYS',
      value: moment().subtract(15, 'days').format('YYYY-MM-DD HH:mm:ss'),
      startDate: moment().subtract(15, 'days').format('YYYY-MM-DD HH:mm:ss'),
      endDate: moment().format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      label: 'Last 30 days',
      id: 'LAST_30_DAYS',
      value: moment().subtract(30, 'days').format('YYYY-MM-DD HH:mm:ss'),
      startDate: moment().subtract(30, 'days').format('YYYY-MM-DD HH:mm:ss'),
      endDate: moment().format('YYYY-MM-DD HH:mm:ss'),
    },

    {
      label: 'Last month',
      id: 'LAST_MONTH',
      value: moment().subtract(1, 'months').format('YYYY-MM-DD HH:mm:ss'),
      startDate: moment().subtract(1, 'months').format('YYYY-MM-DD HH:mm:ss'),
      endDate: moment().format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      label: 'Custom',
      id: 'CUSTOM',
      value: 'custom',
    },
  ];
  const getStafftaskDetails = (start, size) => {
    dispatch({
      type: 'staff/getStaffTasksList',
      payload: {
        query: {
          assignees: staffId,
          startIndex: start,
          viewSize: size,

          // action: actionType,
          dateRangeFrom:
            selectedDate === 'Custom' && ranges !== null
              ? ranges[0]?.format('YYYY-MM-DD HH:mm:ss')
              : activityTimeList?.filter((p) => p?.label === selectedDate)[0]?.startDate,
          dateRangeTo:
            selectedDate === 'Custom' && ranges !== null
              ? ranges[1]?.format('YYYY-MM-DD HH:mm:ss')
              : activityTimeList?.filter((p) => p?.label === selectedDate)[0]?.endDate,
        },
      },
    });
  };
  useEffect(() => {
    getStafftaskDetails('0', '10');
  }, [dispatch, staffId, selectedDate, ranges]);
  function handleChangePagination(current, size) {
    setCurrentPage(current);
    getStafftaskDetails(size * (current - 1), size);
  }

  const columns = [
    {
      title: 'Sr.no.',
      align: 'center',
      render: (_, __, index) => (
        <span className="text-gray-900 font-medium">
          {' '}
          {index + 1 + viewSize * (currentPage - 1)}
        </span>
      ),
    },

    {
      title: 'Description',
      key: 'work',
      align: 'left',
      width: '13rem',
      render: (_, record) => (
        <span className="flex gap-2 mt-2">
          <Tooltip title={record?.name}>
            <p
              className={` ${
                record?.students?.length > 0 ? 'w-10' : 'w-44'
              } font-medium text-gray-900 mt-1.5`}
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {record?.name}
            </p>
          </Tooltip>
          <span className="flex">
            <>
              <Avatar.Group
                maxCount={2}
                size="large"
                onClick={(e) => e.stopPropagation()}
                maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf', cursor: 'pointer' }}
              >
                {record?.students?.map((items) => (
                  <>
                    <Popover
                      key={items?.id}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      content={
                        <a
                          className="flex gap-2 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (items?.roleTypeId === 'LEAD_STUDENT') {
                              history.push('/leads/students/leads/all');
                            } else {
                              history.push(`/students/${items?.id}`);
                            }
                          }}
                        >
                          {items?.photoUrl !== undefined ? (
                            <Avatar src={items?.photoUrl} />
                          ) : (
                            <Avatar
                              className="uppercase font-medium"
                              style={{
                                backgroundColor: '#f56a00',
                              }}
                            >
                              {items?.displayName && getInitials(items?.displayName)}
                            </Avatar>
                          )}
                          <p className="mt-2 text-gray-900 font-medium">{items?.displayName}</p>
                        </a>
                      }
                    >
                      {items?.photoUrl !== undefined ? (
                        <Avatar
                          src={items?.photoUrl}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (items?.roleTypeId === 'LEAD_STUDENT') {
                              history.push('/leads/students/leads/all');
                            } else {
                              history.push(`/students/${items?.id}`);
                            }
                          }}
                          style={{ cursor: 'pointer' }}
                          size={35}
                        />
                      ) : (
                        <Avatar
                          className="uppercase font-medium"
                          style={{
                            backgroundColor: '#f56a00',
                            cursor: 'pointer',
                            fontSize: '11px',
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (items?.roleTypeId === 'LEAD_STUDENT') {
                              history.push('/leads/students/leads/all');
                            } else {
                              history.push(`/students/${items?.id}`);
                            }
                          }}
                          size={35}
                        >
                          {items?.displayName && getInitials(items?.displayName)}
                        </Avatar>
                      )}
                    </Popover>
                  </>
                ))}
              </Avatar.Group>
            </>
          </span>
        </span>
      ),
    },
    {
      title: 'Priority',
      key: 'Priority',
      align: 'left',
      render: (_, record) =>
        record?.priorityTypeId === 'LOW' ? (
          <span className="text-green-500 font-medium">Low</span>
        ) : (
          <span>
            {record?.priorityTypeId === 'MEDIUM' ? (
              <span className="text-yellow-500 font-medium">Medium</span>
            ) : (
              <span>
                {record?.priorityTypeId === 'HIGH' ? (
                  <span className="text-red-600 font-medium">High</span>
                ) : (
                  <span className="text-red-700 font-medium">Very high</span>
                )}
              </span>
            )}
          </span>
        ),
    },
    {
      title: 'Date',
      key: 'date',
      align: 'left',
      render: (_, record) => (
        <span className=" font-medium text-sm">{moment(record?.startDate).format('ll')}</span>
      ),
    },
    {
      title: 'Assigned By',
      key: 'assignedBy',
      align: 'center',
      width: 130,
      render: (_, record) => (
        <Popover
          content={<a className="text-black font-medium">{record?.assignedBy?.displayName}</a>}
        >
          <span className="flex gap-2 cursor-pointer mt-3 pl-5">
            {record?.assignedBy?.photoUrl !== undefined ? (
              <Avatar src={record?.assignedBy?.photoUrl} />
            ) : (
              <Avatar
                className="uppercase font-medium"
                style={{
                  backgroundColor: '#f56a00',
                  fontSize: '11px',
                }}
              >
                {record?.assignedBy?.displayName && getInitials(record?.assignedBy?.displayName)}
              </Avatar>
            )}
          </span>
        </Popover>
      ),
    },

    {
      title: 'Type of Work',
      key: 'taskTypeId',
      align: 'left',
      render: (_, record) => (
        <span className="text-gray-900 font-medium capitalize pt-3">
          {record?.repetitionType.toLowerCase()}
        </span>
      ),
    },

    {
      title: 'Due date',
      key: 'dueDate',
      align: 'center',
      render: (_, record) =>
        record?.dueDate === undefined ? (
          '--'
        ) : (
          <Popover
            content={
              record?.dueDate && (
                <span
                  className={`font-medium text-sm ${
                    moment(record?.dueDate).isBefore(moment()) ? 'text-red-500' : 'text-gray-900'
                  }`}
                >
                  Due {moment(record?.dueDate).fromNow()}
                </span>
              )
            }
          >
            <span
              className={`font-medium text-sm ${
                moment(record?.dueDate).isBefore(moment()) ? 'text-red-500' : 'text-gray-900'
              }`}
            >
              {record?.dueDate && moment(record?.dueDate).format('Do MMM h:mm a')}
            </span>
          </Popover>
        ),
    },
  ];
  return (
    <div>
      <div className="mt-5">
        <div className="flex justify-between">
          <div className="text-blue-700 font-medium text-xl">Task</div>
          <div className="mr-2 flex gap-3">
            <Select
              style={{ width: '12rem', color: '#3B82F6' }}
              value={selectedDate}
              allowClear
              onChange={(value) => {
                setSelectedDate(value);
                setRanges([moment().subtract(7, 'day'), moment()]);
              }}
              placeholder="Select time filter"
              listHeight={400}
              getPopupContainer={(node) => node.parentNode}
            >
              {activityTimeList?.map((item) => (
                <Select.Option
                  key={item?.id}
                  value={item?.label}
                  className="bg-gray-100 mx-2 rounded-lg mt-2"
                  style={{ color: '#3B82F6', overflow: 'hidden' }}
                >
                  {item?.label}
                </Select.Option>
              ))}
            </Select>
            <div>
              {selectedDate === 'Custom' && (
                <RangePicker
                  allowEmpty
                  value={ranges}
                  format="DD MMM, YYYY"
                  onChange={(val) => {
                    setRanges(val);
                  }}
                  placeholder={['Search by', 'date']}
                  style={{ width: '12rem' }}
                  disabledDate={(date) => date > moment().add(1, 'day')}
                />
              )}
            </div>
          </div>
        </div>
        <Divider style={{ marginTop: '0.6rem' }} />
        <div className="mr-5 ">
          <Table
            pagination={false}
            dataSource={staffTasksList?.records}
            loading={loadingForGetData}
            style={{ marginTop: '20px' }}
            bordered
            scroll={{ x: 500, y: 600 }}
            columns={columns}
            locale={{
              emptyText: (
                <>
                  <EmptyState
                    emptyState={emptyStateSvg}
                    emptyHeaderText={<span>No Data found yet!</span>}
                  />
                </>
              ),
            }}
            footer={() => (
              <CheckValidation show={staffTasksList?.totalCount > 5}>
                <Row className="mt-2" type="flex" justify="end">
                  <Pagination
                    key={`page-${currentPage}`}
                    showSizeChanger
                    pageSizeOptions={['10', '25', '50', '100']}
                    onShowSizeChange={(e, p) => {
                      setViewSize(p);
                      setCurrentPage(1);
                      getStafftaskDetails(0, p);
                    }}
                    defaultCurrent={1}
                    current={currentPage}
                    pageSize={viewSize}
                    total={staffTasksList?.totalCount}
                    showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                    onChange={handleChangePagination}
                  />
                </Row>
              </CheckValidation>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default connect(({ staff, loading }) => ({
  staffTasksList: staff?.staffTasksList,
  loadingForGetData: loading?.effects['staff/getStaffTasksList'],
}))(StaffTask);
