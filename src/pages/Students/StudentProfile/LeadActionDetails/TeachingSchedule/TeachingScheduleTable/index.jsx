import React from 'react';
import CheckValidation from '@/components/CheckValidation';
import EmptyState from '@/components/EmptyState';
import { Table, Avatar } from 'antd';
import emptyStateSvg from '@/assets/icons/space-empty.svg';
import { getInitials } from '@/utils/common';
import { connect } from 'umi';
import dayjs from 'dayjs';

const TeachingScheduleTable = ({ teachingSchedule, loadingForTeachingSchedule }) => {
  const columns = [
    {
      title: 'Sr.no. ',
      dataIndex: 'srno',
      align: 'center',
      width: '5rem',
      render: (_, __, index) => (
        <p className="text-gray-900 font-medium mt-2.5 text-xs">{index + 1}</p>
      ),
    },
    {
      title: 'From',
      key: 'startDate',
      dataIndex: 'startDate',
      render: (_, record) => (
        <p className="text-gary-900 px-2 font-medium mt-2.5 text-xs">
          {record?.classTestModules?.map((item) => (
            <div key={item?.id}>{dayjs(item?.startTime).format('h:mm A')}</div>
          ))}
        </p>
      ),
    },
    {
      title: 'TO',
      key: 'endDate',
      dataIndex: 'endDate',
      render: (__, record) => (
        <p className="text-gary-900 px-2 font-medium mt-2.5 text-xs">
          {record?.classTestModules?.map((item) => (
            <div key={item?.id}>{dayjs(item?.endTime).format('h:mm A')}</div>
          ))}
        </p>
      ),
    },

    {
      title: 'Module',
      key: 'module',
      dataIndex: 'module',
      render: (__, record) => (
        <p className="text-gary-900 px-2 font-medium mt-2.5 text-xs">
          {record?.classTestModules?.map((item) => item?.name)}
        </p>
      ),
    },

    {
      title: 'Class Room',
      key: 'class',
      dataIndex: 'class',
      render: (__, record) => (
        <p className="text-gary-900 px-2 font-medium mt-2.5 text-xs">{record?.class?.name}</p>
      ),
    },
    {
      title: 'Sitting Capacity',
      key: 'class',
      dataIndex: 'class',
      render: (__, record) => (
        <p className="text-gary-900 px-2 font-medium mt-2.5 text-xs">
          {record?.class?.sittingCapacity}
        </p>
      ),
    },
    {
      title: 'D-Level',
      dataIndex: 'd-level',
      align: 'center',
      width: '5rem',
    },

    {
      title: 'Batch',
      key: 'batchName',
      dataIndex: 'batchName',
      render: (text) => <p className="text-gary-900 px-2 font-medium mt-2.5 text-xs">{text}</p>,
    },
    {
      title: 'Teacher',
      key: 'lectureClass',
      dataIndex: 'lectureClass',
      render: (__, record) => (
        <p className="text-gary-900 px-2 font-medium mt-2.5 text-xs">
          {record?.classTestModules?.[0]?.teacherDetails?.displayName}
        </p>
      ),
    },
    {
      title: 'Assigned By',
      dataIndex: 'assignedBy',
      key: 'assignedBy',
      width: '10rem',
      render: (_, record) => (
        <div className="flex gap-2 px-2 cursor-pointer mt-1.5 w-max">
          {record?.photoUrl !== undefined ? (
            <div>
              <img src={record?.photoUrl} alt="" className="rounded-full w-7 h-7" />
            </div>
          ) : (
            <Avatar className="uppercase text-gray-900 font-medium" size={25}>
              <p className="text-gray-900 text-xs pt-2">
                {record?.assignedBy?.displayName && getInitials(record?.assignedBy?.displayName)}
              </p>
            </Avatar>
          )}

          <p className="text-gray-900 font-medium capitalize mt-1.5 text-xs">
            {record?.assignedBy?.displayName}
          </p>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-yellow-500 font-medium text-sm">Teaching Schedule</h1>
      <div className="mb-10">
        <CheckValidation
          show={teachingSchedule?.teachingSchedules?.length > 0}
          fallback={
            <EmptyState
              emptyState={emptyStateSvg}
              emptyHeaderText={<span>No batch assigned yet</span>}
            />
          }
        >
          <Table
            dataSource={teachingSchedule?.teachingSchedules?.map((item) => ({
              ...item,
              key: item?.id,
            }))}
            style={{ background: 'white' }}
            scroll={{ y: 500, x: 900 }}
            pagination={false}
            loading={loadingForTeachingSchedule}
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
    </div>
  );
};

export default connect(({ student, loading }) => ({
  teachingSchedule: student?.teachingSchedule,
  loadingForTeachingSchedule: loading?.effects['student/getTeachingSchedule'],
}))(TeachingScheduleTable);
