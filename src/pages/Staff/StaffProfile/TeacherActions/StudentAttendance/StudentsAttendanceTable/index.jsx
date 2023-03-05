import React from 'react';
import { Avatar, Pagination, Row, Table, Tooltip } from 'antd';
import { history } from 'umi';
import { getInitials } from '@/utils/common';
import CheckValidation from '@/components/CheckValidation';
import emptyStateSvg from '@/assets/icons/space-empty.svg';
import EmptyState from '@/components/EmptyState';
import { CircleFill, Flag, PlusCircle } from 'react-bootstrap-icons';
import { EditOutlined } from '@ant-design/icons';

const StudentsAttendanceTable = ({
  getStudentsList,
  loading,
  rowSelection,
  currentPage,
  setCurrentPage,
  viewSize,
  setViewSize,
  handleChangePagination,
  getStudentsData,
  studentSearch,
  setStudentAttendanceModel,
  setSingleStudentAttendance,
}) => {
  const columns = [
    {
      title: 'Sr.no. ',
      dataIndex: 'srno',
      align: 'center',
      render: (_, __, index) => index + 1 + viewSize * (currentPage - 1),
    },
    {
      title: 'Name',
      dataIndex: 'displayName',
      key: 'displayName',
      width: '12rem',
      render: (_, record) => (
        <div
          className="flex gap-2 px-2 cursor-pointer mt-1.5 w-max"
          onClick={() => history.push(`/students/${record.id}`)}
        >
          {record?.photoUrl !== undefined ? (
            <div>
              <img src={record?.photoUrl} alt="" className="rounded-full w-8 h-8" />
            </div>
          ) : (
            <Avatar className="uppercase text-gray-900 font-medium" size={30}>
              <p className="text-gray-900 text-xs pt-2">
                {record?.displayName && getInitials(record?.displayName)}
              </p>
            </Avatar>
          )}

          <p className="text-gray-900 font-medium capitalize mt-1.5 text-xs">
            {record?.displayName}
          </p>
        </div>
      ),
    },
    {
      title: 'Course & Modules',
      key: 'courses-modules',
      width: '9rem',
      render: (_, record) => (
        <Tooltip
          title={`Course: ${record?.product?.name} & Modules: ${record?.product?.modules?.map(
            (item) => ` ${item?.name}`,
          )}`}
        >
          <p
            className="text-gray-900 font-medium  w-32 capitalize mt-2.5 text-xs px-2 select-none"
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
      title: 'Batch',
      key: 'batch',
      width: '9rem',
      render: (_, record) => (
        <div className="flex mt-2.5 px-2">
          <p className="text-gray-900 font-medium capitalize text-xs">{record?.batch?.name}</p>
          {record?.batch?.mode === 'ONLINE' ? (
            <CircleFill className="text-green-500 pl-1" style={{ marginTop: '0.15rem' }} />
          ) : null}
        </div>
      ),
    },
    {
      title: 'Average Score',
      dataIndex: 'averageScore',
      width: '7.5rem',
      align: 'center',
      key: 'averageScore',
    },
    {
      title: 'Performance',
      dataIndex: 'performance',
      align: 'center',
      width: '6.5rem',
      key: 'performance',
    },
    {
      title: 'Attendance',
      dataIndex: 'attendance',
      width: '7.5rem',
      align: 'center',
      key: 'attendance',
    },
    {
      title: 'Status',
      key: 'status',
      align: 'center',
      width: '6rem',
      render: (_, record) => (
        <div className="mt-2.5 px-2">
          {/* eslint-disable-next-line no-constant-condition */}
          {record?.status === 'Registered' || 'Active' ? (
            <p className="text-green-500 text-xs font-medium">Active</p>
          ) : (
            <p className="text-red-500 text-xs font-medium">In-active</p>
          )}
        </div>
      ),
    },
    {
      title: 'Attendance Status',
      dataIndex: 'attendance',
      key: 'attendance',
      render: () => <div></div>,
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <div className="flex gap-2 justify-center px-2">
          <Tooltip title="Mark Attendance">
            {' '}
            <a
              onClick={() => {
                setStudentAttendanceModel(true);
                setSingleStudentAttendance(record);
              }}
            >
              <PlusCircle className="text-lg" />
            </a>
          </Tooltip>
          <Tooltip title="Edit Attendance">
            <a
              className="-mt-1"
              onClick={() => {
                setStudentAttendanceModel(true);
                setSingleStudentAttendance(record);
              }}
            >
              <EditOutlined className="text-lg" />
            </a>
          </Tooltip>
          <Tooltip title="">
            <a href="">
              <Flag className="text-lg" />
            </a>
          </Tooltip>
        </div>
      ),
    },
  ];
  return (
    <div>
      <CheckValidation
        show={getStudentsList?.records?.length > 0}
        fallback={
          <EmptyState
            emptyState={emptyStateSvg}
            emptyHeaderText={<span>No student assigned yet</span>}
          />
        }
      >
        <Table
          dataSource={getStudentsList?.records?.map((item) => ({
            ...item,
            key: item?.id,
          }))}
          scroll={{ x: 1000 }}
          pagination={false}
          loading={Boolean(loading)}
          rowSelection={{
            type: 'checkbox',
            ...rowSelection,
          }}
          footer={() => (
            <CheckValidation show={getStudentsList?.records?.length > 5}>
              <Row className="mt-2" type="flex" justify="end">
                <Pagination
                  key={`page-${currentPage}`}
                  showSizeChanger
                  pageSizeOptions={['10', '25', '50', '100']}
                  onShowSizeChange={(e, p) => {
                    setViewSize(p);
                    setCurrentPage(1);
                    getStudentsData(0, p, studentSearch, '');
                  }}
                  defaultCurrent={1}
                  current={currentPage}
                  pageSize={viewSize}
                  total={getStudentsList?.records?.totalCount}
                  showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                  onChange={handleChangePagination}
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
              title={<h1 className="text-blue-700 px-2">{items?.title}</h1>}
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

export default StudentsAttendanceTable;
