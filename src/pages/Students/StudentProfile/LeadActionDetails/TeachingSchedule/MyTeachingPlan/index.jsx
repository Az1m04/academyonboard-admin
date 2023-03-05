import React from 'react';
import CheckValidation from '@/components/CheckValidation';
import EmptyState from '@/components/EmptyState';
import { EditOutlined } from '@ant-design/icons';
import { Table, Tooltip, Avatar } from 'antd';
import { PlusCircle } from 'react-bootstrap-icons';
import emptyStateSvg from '@/assets/icons/space-empty.svg';
import { getInitials } from '@/utils/common';

const MyTeachingPlan = () => {
  const columns = [
    {
      title: 'Sr.no.',
      dataIndex: 'srno',
      align: 'center',
      width: '5rem',
      render: (_, __, index) => (
        <p className="text-gray-900 font-medium mt-2.5 text-xs">{index + 1}</p>
      ),
    },
    {
      title: 'From',
      dataIndex: 'startTime',
      key: 'timeFrom',
      align: 'center',
      width: '6.5rem',
      render: (text) => <p className="text-red-500 font-medium mt-2.5 text-xs">{text}</p>,
    },
    {
      title: 'To',
      dataIndex: 'endTime',
      key: 'to',
      align: 'center',
      width: '6.5rem',
      render: (text) => <p className="text-red-500 font-medium mt-2.5 text-xs">{text}</p>,
    },
    {
      title: 'Module',
      key: 'module',
      dataIndex: 'module',
      render: (text) => <p className="text-gary-900 px-2 font-medium mt-2.5 text-xs">{text}</p>,
    },
    {
      title: 'Lecture/Class',
      key: 'lectureClass',
      dataIndex: 'lectureClass',
      render: (text) => <p className="text-gary-900 px-2 font-medium mt-2.5 text-xs">{text}</p>,
    },
    {
      title: 'Class/Room No.',
      key: 'classAndRoomNo',
      align: 'center',
      dataIndex: 'classAndRoomNo',
      render: (text) => <p className="text-gary-900 px-2 font-medium mt-2.5 text-xs">{text}</p>,
    },
    {
      title: 'Assigned By',
      dataIndex: 'assignedBy',
      key: 'assignedBy',
      render: (_, record) => (
        <div className="flex gap-2 px-2 cursor-pointer mt-1.5 w-max">
          {record?.photoUrl !== undefined ? (
            <div>
              <img src={record?.photoUrl} alt="" className="rounded-full w-7 h-7" />
            </div>
          ) : (
            <Avatar className="uppercase text-gray-900 font-medium" size={25}>
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
      title: 'Status',
      key: 'Status',
      align: 'center',
      width: '10rem',
      render: () => (
        <p className="text-xs text-gray-900 font-medium mt-2.5 px-2 select-none">Scheduled</p>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'center',
      render: () => (
        <div className="flex gap-4 justify-center">
          <Tooltip title="Mark Attendance">
            <a>
              <PlusCircle className="text-xl mt-1" />
            </a>
          </Tooltip>

          <Tooltip title="Edit Attendance">
            <a>
              <EditOutlined className="text-xl" />
            </a>
          </Tooltip>
        </div>
      ),
    },
  ];
  const dataSource = [
    {
      id: 1,
      startTime: '09:00am',
      endTime: '10:00am',
      module: 'Reading',
      lectureClass: 'test',
      classAndRoomNo: 'floor-1/class-2',
      displayName: 'Harjinder Kaur',
      photoUrl: 'https://joeschmoe.io/api/v1/random',
    },
    {
      id: 2,
      startTime: '10:00am',
      endTime: '11:00am',
      module: 'speaking',
      lectureClass: 'test',
      classAndRoomNo: 'floor-1/class-2',
      displayName: 'Harjinder Kaur',
      photoUrl: 'https://joeschmoe.io/api/v1/random',
    },
  ];
  return (
    <div className="h-56">
      <h1 className="text-yellow-500 font-medium text-sm">My Teaching Plan</h1>
      <div>
        <CheckValidation
          show={dataSource?.length > 0}
          fallback={
            <EmptyState
              emptyState={emptyStateSvg}
              emptyHeaderText={<span>No batch assigned yet</span>}
            />
          }
        >
          <Table
            dataSource={dataSource?.map((item) => ({
              ...item,
              key: item?.id,
            }))}
            style={{ background: 'white' }}
            scroll={{ y: 500, x: 900 }}
            pagination={false}
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

export default MyTeachingPlan;
