import React from 'react';
import { EditOutlined } from '@ant-design/icons';
import { Table, Tooltip, Avatar } from 'antd';
import { PlusCircle } from 'react-bootstrap-icons';
import { getInitials } from '@/utils/common';
import moment from 'moment';

const MyTeachingPlan = ({ teachingPlanList, loading }) => {
  const columns = [
    {
      title: 'Sr.no.',
      dataIndex: 'srno',
      align: 'center',
      width: '5rem',
      render: (_, __, index) => (
        <p className="text-gray-900 font-medium m-0 text-xs">{index + 1}</p>
      ),
    },
    {
      title: 'From',
      dataIndex: 'startTime',
      key: 'timeFrom',
      align: 'center',
      width: '6.5rem',
      render: (text) => (
        <p className="text-red-500 font-medium m-0 text-xs">
          {text && moment(text)?.format('hh:mma')}
        </p>
      ),
    },
    {
      title: 'To',
      dataIndex: 'endTime',
      key: 'to',
      align: 'center',
      width: '6.5rem',
      render: (text) => (
        <p className="text-red-500 font-medium m-0 text-xs">
          {text && moment(text)?.format('hh:mma')}
        </p>
      ),
    },
    {
      title: 'Module',
      key: 'module',
      dataIndex: 'name',
      render: (text) => <p className="text-gary-900 px-2 font-medium m-0 text-xs">{text}</p>,
    },
    {
      title: 'Lecture/Class',
      key: 'lectureClass',
      dataIndex: 'activityType',
      render: (text) => <p className="text-gary-900 px-2 font-medium m-0 text-xs">{text}</p>,
    },
    {
      title: 'Class/Room No.',
      key: 'classAndRoomNo',
      align: 'center',
      dataIndex: 'classAndRoomNo',
      render: (text) => <p className="text-gary-900 px-2 font-medium m-0 text-xs">{text}</p>,
    },
    {
      title: 'Assigned By',
      key: 'assignedBy',
      width: '13rem',
      render: (_, record) => (
        <div className="flex gap-2 px-2 cursor-pointer" style={{ alignItems: 'center' }}>
          {record?.assignedBy?.photoUrl !== undefined ? (
            <img src={record?.assignedBy?.photoUrl} alt="" className="rounded-full w-7 h-7" />
          ) : (
            <Avatar className="uppercase text-gray-900 font-medium" size={25}>
              <p className="text-gray-900 text-xs pt-2">
                {record?.assignedBy?.displayName && getInitials(record?.assignedBy?.displayName)}
              </p>
            </Avatar>
          )}
          <p
            style={{ width: '150px' }}
            className="text-gray-900 font-medium capitalize m-0 text-xs"
          >
            {record?.assignedBy?.displayName}
          </p>
        </div>
      ),
    },
    {
      title: 'Status',
      key: 'Status',
      align: 'center',
      width: '7rem',
      render: () => (
        <p className="text-xs text-gray-900 font-medium m-0 px-2 select-none">Scheduled</p>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'center',
      render: () => (
        <div className="flex gap-4 justify-center">
          <Tooltip title="Mark Attendance">
            <PlusCircle style={{ color: '#fa8c16' }} className="" />
          </Tooltip>

          <Tooltip title="Edit Attendance">
            <EditOutlined style={{ color: '#fa8c16' }} className="" />
          </Tooltip>
        </div>
      ),
    },
  ];
  return (
    <div className="mb-10">
      <h1 className="text-yellow-500 font-medium text-sm">My Teaching Plan</h1>
      <Table
        dataSource={teachingPlanList?.batchList[0]?.moduleSlots}
        style={{ background: 'white' }}
        loading={loading}
        scroll={{ x: 1200, y: 200 }}
        pagination={false}
      >
        {columns?.map((items) => (
          <Table.Column
            key={items?.key}
            onHeaderCell={() => ({
              style: {
                backgroundColor: 'white',
                borderColor: 'white',
                padding: '5px',
              },
            })}
            onCell={() => ({
              style: {
                borderWidth: '1px',
                padding: '5px',
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
    </div>
  );
};

export default MyTeachingPlan;
