import React from 'react';
import { Pagination, Row, Table, Tooltip } from 'antd';

import moment from 'moment';
import CheckValidation from '@/components/CheckValidation';
import emptyStateSvg from '@/assets/icons/space-empty.svg';
import EmptyState from '@/components/EmptyState';
import { CircleFill, PlusCircle } from 'react-bootstrap-icons';
import { EditOutlined } from '@ant-design/icons';

const BatchAttendanceTable = ({
  getStaffBatches,
  loading,
  currentPage,
  setCurrentPage,
  viewSize,
  setViewSize,
  setBatchAttendanceModel,
  getBatchesStudents,
  mode,
  dispatch,
}) => {
  const columns = [
    {
      title: 'Sr.no. ',
      dataIndex: 'srno',
      align: 'center',
      render: (_, __, index) => index + 1 + viewSize * (currentPage - 1),
    },
    {
      title: 'Batch Name',
      dataIndex: 'batchName',
      key: 'batchName',
      render: (_, record) => (
        <div className="flex mt-2.5">
          <p className="text-gray-900 font-medium text-xs px-2.5 py-2.5">{record?.batchName}</p>
          {record?.mode === 'online' ? <CircleFill className="text-green-500 mt-1 pl-1" /> : null}
        </div>
      ),
    },
    {
      title: 'Course & Modules',
      key: 'courses-modules',
      width: '14rem',
      render: (_, record) => (
        <Tooltip
          title={`Course: ${record?.product?.name} & Modules: ${record?.product?.modules?.map(
            (item) => ` ${item?.name}`,
          )}`}
        >
          <p
            className="text-gray-900 font-medium  w-48 capitalize mt-2.5 text-xs px-2.5"
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {record?.product?.name}
            <span>
              {record?.product?.modules?.map((item) => (
                <span
                  style={{ borderColor: '#eab308' }}
                  className="capitalize pl-2 border-l-4 ml-2 text-xs"
                  key={item?.id}
                >
                  {item?.name}
                </span>
              ))}
            </span>
          </p>
        </Tooltip>
      ),
    },
    {
      title: 'Time From',
      dataIndex: 'startTime',
      key: 'timeFrom',
      align: 'center',
      render: (text) => (
        <p className="text-gray-900 font-medium mt-2.5 text-xs">{moment(text).format('LT')}</p>
      ),
    },
    {
      title: 'To',
      dataIndex: 'endTime',
      key: 'to',
      align: 'center',
      render: (text) => (
        <p className="text-gray-900 font-medium mt-2.5 text-xs">{moment(text).format('LT')}</p>
      ),
    },
    {
      title: 'Total Students',
      dataIndex: 'assignedStudents',
      key: 'assignedStudents',
      align: 'center',
      render: (text) => <p className="text-gray-900 font-medium mt-2.5 text-xs">{text}</p>,
    },
    {
      title: 'Average',
      dataIndex: 'Average',
      key: 'Average',
      render: (__, record) => (
        <div className="text-gray-900 font-medium mt-2.5 text-xs text-center">
          {record?.avgAttendance?.toFixed(2) || 'N/A'}
        </div>
      ),
    },
    {
      title: 'Attendance Status',
      key: 'attendanceStatus',
      align: 'center',
      width: '10rem',
      render: (_, record) =>
        record?.attendanceStatus === 'Pending' ? (
          <p className="text-xs text-red-500 font-medium mt-2.5 px-2 select-none">Pending</p>
        ) : (
          <p className="text-xs text-green-500 font-medium mt-2.5 px-2select-none">Marked</p>
        ),
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <div className="flex gap-4 justify-center">
          {record?.attendanceStatus === 'Pending' ? (
            <Tooltip title="Mark Attendance">
              <a
                onClick={() => {
                  setBatchAttendanceModel(true);
                  dispatch({
                    type: 'staff/setStates',
                    payload: {
                      getStaffBatchesStudents: null,
                    },
                    key: 'getStaffBatchesStudents',
                  });
                  getBatchesStudents(record?.batchId);
                }}
              >
                <PlusCircle className="text-xl mt-1" />
              </a>
            </Tooltip>
          ) : (
            <Tooltip title="Edit Attendance">
              <a
                onClick={() => {
                  setBatchAttendanceModel(true);
                  getBatchesStudents(record?.batchId);
                  dispatch({
                    type: 'staff/setStates',
                    payload: {
                      getStaffBatchesStudents: null,
                    },
                    key: 'getStaffBatchesStudents',
                  });
                }}
              >
                <EditOutlined className="text-xl" />
              </a>
            </Tooltip>
          )}
        </div>
      ),
    },
  ];
  return (
    <div>
      <CheckValidation
        show={getStaffBatches?.records?.length > 0}
        fallback={
          <EmptyState
            emptyState={emptyStateSvg}
            emptyHeaderText={
              <span>
                {/* eslint-disable-next-line no-nested-ternary */}
                No {mode === 'ONLINE' ? 'online' : mode === 'OFFLINE' ? 'offline' : null} batch
                assigned yet
              </span>
            }
          />
        }
      >
        <Table
          dataSource={getStaffBatches?.records?.map((item) => ({
            ...item,
            key: item?.batchId,
          }))}
          scroll={{ x: 1000 }}
          loading={Boolean(loading)}
          footer={() => (
            <CheckValidation show={getStaffBatches?.records?.length > 5}>
              <Row className="mt-2" type="flex" justify="end">
                <Pagination
                  key={`page-${currentPage}`}
                  showSizeChanger
                  pageSizeOptions={['10', '25', '50', '100']}
                  onShowSizeChange={(e, p) => {
                    setViewSize(p);
                    setCurrentPage(1);
                    // getStudentsData(0, p, studentSearch, '');
                  }}
                  defaultCurrent={1}
                  current={currentPage}
                  pageSize={viewSize}
                  total={getStaffBatches?.records?.totalCount}
                  showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                  //   onChange={handleChangePagination}
                />
              </Row>
            </CheckValidation>
          )}
        >
          {columns?.map((items) => (
            <Table.Column
              key={items?.key}
              onHeaderCell={() => ({
                style: {
                  backgroundColor: 'white',
                  borderColor: 'white',
                  padding: '0px',
                },
              })}
              onCell={() => ({
                style: {
                  borderWidth: '1px',
                  padding: '0px',
                },
              })}
              width={items?.width}
              title={<h1 className="text-blue-700 px-2.5 py-2.5 mt-1.5 text-sm">{items?.title}</h1>}
              dataIndex={items?.dataIndex}
              align={items?.align}
              render={items?.render}
            />
          ))}
        </Table>
      </CheckValidation>
    </div>
  );
};

export default BatchAttendanceTable;
