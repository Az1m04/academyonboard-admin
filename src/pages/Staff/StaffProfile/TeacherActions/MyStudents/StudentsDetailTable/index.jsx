import React from 'react';
import { Avatar, Pagination, Row, Table, Tooltip } from 'antd';
import { history } from 'umi';
import { getInitials } from '@/utils/common';
import CheckValidation from '@/components/CheckValidation';
import emptyStateSvg from '@/assets/icons/space-empty.svg';
import EmptyState from '@/components/EmptyState';
import { CircleFill } from 'react-bootstrap-icons';
import { EnvelopeAction, TextIconAction, WhatsAppAction } from '@/utils/AppIcons';

const StudentsDetailTable = ({
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
  setRecordDetails,
  setVisibleWhatsApp,
  setVisibleEmail,
  setIsPhoneVisible,
  mode,
}) => {
  const columns = [
    {
      title: 'Sr.no. ',
      dataIndex: 'srno',
      align: 'center',
      width: '3.5rem',
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
      width: '10rem',
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
      title: 'Attendence',
      dataIndex: 'attendence',
      width: '7.5rem',
      align: 'center',
      key: 'attendence',
      render: (__, record) => (
        <div className="text-xs font-medium ">
          <p className="my-1 text-gray-500">Present:{record?.attendance?.present} </p>
          <p className="my-1 text-gray-500">Absent:{record?.attendance?.absent}</p>
          <p className="my-1 text-gray-500">Leaves:{record?.attendance?.onLeave}</p>
        </div>
      ),
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
      title: 'Fee Status',
      key: 'feeStatus',
      align: 'center',
      width: '6.5rem',
      render: (_, record) =>
        // eslint-disable-next-line no-nested-ternary
        record?.feeStatus === 'overdue' ? (
          <p className="text-xs text-red-500 font-medium mt-2.5 px-2">Overdue</p>
        ) : // eslint-disable-next-line no-nested-ternary
        record?.feeStatus === 'pending' ? (
          <p className="text-xs text-yellow-500 font-medium mt-2.5 px-2">Pending</p>
        ) : record?.feeStatus === 'paid' ? (
          <p className="text-xs text-green-500 font-medium mt-2.5 px-2">Paid</p>
        ) : (
          <p className="text-xs text-yellow-500 font-medium mt-2.5 px-2">Pending</p>
        ),
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      width: '6rem',
      render: (_, record) => (
        <div className="flex space-x-3 items-center px-2">
          <Tooltip title="Send whatsapp message" placement="top">
            <div
              className={`cursor-pointer icon`}
              onClick={() => {
                setVisibleWhatsApp(true);
                setRecordDetails([record]);
              }}
            >
              <WhatsAppAction />
            </div>
          </Tooltip>

          <Tooltip title="Send email message" placement="top">
            <div
              className="cursor-pointer"
              onClick={() => {
                setVisibleEmail(true);
                setRecordDetails([record]);
              }}
            >
              <EnvelopeAction />
            </div>
          </Tooltip>

          <Tooltip title="Send text message" placement="top">
            <div
              className="cursor-pointer"
              onClick={() => {
                setIsPhoneVisible(true);
                setRecordDetails([record]);
              }}
            >
              <TextIconAction />
            </div>
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
            emptyHeaderText={
              <span>
                {/* eslint-disable-next-line no-nested-ternary */}
                No {mode === 'ONLINE' ? 'online' : mode === 'OFFLINE' ? 'offline' : null} student
                assigned yet
              </span>
            }
          />
        }
      >
        <Table
          dataSource={getStudentsList?.records?.map((item) => ({
            ...item,
            key: item?.id,
          }))}
          pagination={false}
          scroll={{ x: 900 }}
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
              title={<h1 className="text-blue-700 mt-1.5 px-2 text-sm">{items?.title}</h1>}
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

export default StudentsDetailTable;
