/* eslint-disable no-nested-ternary */
import React from 'react';
import Level1 from '@/assets/img/lvl1.png';
import Level2 from '@/assets/img/lvl2.png';
import Level3 from '@/assets/img/Lvl3.png';
import EmptyState from '@/components/EmptyState';
import { Table, Avatar, Tooltip } from 'antd';
import emptyStateSvg from '@/assets/icons/space-empty.svg';
import { getInitials } from '@/utils/common';
import { DownloadOutlined, EyeOutlined } from '@ant-design/icons';

const TeachingScheduleTable = ({ staffScheduled }) => {
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
      title: 'Module',
      key: 'module',
      dataIndex: 'module',
      render: (_, record) => (
        <div className="text-gary-900 px-2 font-medium mt-2.5 text-xs ">
          {record?.classTestModules?.map((item) => (
            <p
              key={item?.id}
              className={` flex gap-3${record?.classTestModules?.length > 0 && 'border-l border'}`}
            >
              {' '}
              {item?.name}
            </p>
          ))}
        </div>
      ),
    },
    {
      title: 'Lecture/Class',
      key: 'lectureClass',
      dataIndex: 'lectureClass',
      render: (_, record) => (
        <p className="text-gary-900 px-2 font-medium mt-2.5 text-xs">
          {record?.classTestModules?.map((item) => (
            <p
              key={item?.id}
              className={` flex gap-3${record?.classTestModules?.length > 0 && 'border-l border'}`}
            >
              {' '}
              {item?.activityId}
            </p>
          ))}
        </p>
      ),
    },
    {
      title: 'D-Level',
      dataIndex: 'd-level',
      align: 'center',
      width: '5rem',
      render: (_, record) =>
        record?.capsule?.difficultyLevel && (
          <div className="pl-2 w-max ">
            {
              <img
                className="text-red-700"
                style={{ color: 'red' }}
                src={
                  record?.capsule?.difficultyLevel === 'HARD'
                    ? Level3
                    : record?.capsule?.difficultyLevel === 'INTERMEDIATE'
                    ? Level2
                    : record?.capsule?.difficultyLevel === 'LOW' && Level1
                }
                height="40"
                width="40"
                alt=""
              />
            }
          </div>
        ),
    },
    {
      title: 'Test',
      key: 'test',
      align: 'center',
      dataIndex: 'test',
      render: (__, record) => (
        <div className="text-gary-900 px-2 font-medium mt-2.5 text-xs">
          <div className="flex justify-center gap-3 text-lg">
            <Tooltip title={'View test file '}>
              <div style={{ color: '#096dd9' }} className="cursor-pointer">
                <EyeOutlined />
              </div>
            </Tooltip>
            <Tooltip title="Downlaod Test file ">
              <div style={{ color: '#faad14' }} className="cursor-pointer">
                <DownloadOutlined />
              </div>
            </Tooltip>
          </div>

          {record?.classTestModules?.[0]?.topicDetails?.filter(
            (item) => item?.contentTypeId === 'TEST_FILE',
          )}
        </div>
      ),
    },
    {
      title: 'Lession',
      dataIndex: 'lession',
      key: 'lession',
      render: () => (
        <div className="text-gary-900 px-2 font-medium mt-2.5 text-xs">
          {' '}
          <div className="flex justify-center gap-3 text-lg">
            <Tooltip title={'View test file '}>
              <div style={{ color: '#096dd9' }} className="cursor-pointer">
                <EyeOutlined />
              </div>
            </Tooltip>
            <Tooltip title="Downlaod lession file ">
              <div style={{ color: '#faad14' }} className="cursor-pointer">
                <DownloadOutlined />
              </div>
            </Tooltip>
          </div>
        </div>
      ),
    },
    {
      title: 'Justification and Answer',
      dataIndex: 'otherFiles',
      key: 'otherFiles',
      render: () => (
        <div className="text-gary-900 px-2 font-medium mt-2.5 text-xs">
          {' '}
          <div className="flex justify-center gap-3 text-lg">
            <Tooltip title={'View answwer files '}>
              <div style={{ color: '#096dd9' }} className="cursor-pointer">
                <EyeOutlined />
              </div>
            </Tooltip>
            <Tooltip title="Downlaod answer  file ">
              <div style={{ color: '#faad14' }} className="cursor-pointer">
                <DownloadOutlined />
              </div>
            </Tooltip>
          </div>
        </div>
      ),
    },
    {
      title: 'Other Files',
      dataIndex: 'otherFiles',
      key: 'otherFiles',
      render: () => (
        <div className="text-gary-900 px-2 font-medium mt-2.5 text-xs">
          {' '}
          <div className="flex justify-center gap-3 text-lg">
            <Tooltip title={'View other files '}>
              <div style={{ color: '#096dd9' }} className="cursor-pointer">
                <EyeOutlined />
              </div>
            </Tooltip>
            <Tooltip title="Downlaod other  file ">
              <div style={{ color: '#faad14' }} className="cursor-pointer">
                <DownloadOutlined />
              </div>
            </Tooltip>
          </div>
        </div>
      ),
    },
    {
      title: 'Assigned By',
      dataIndex: 'assignedBy',
      key: 'assignedBy',
      width: '10rem',
      render: (_, record) => (
        <div className="flex gap-2 px-2 cursor-pointer mt-1.5 w-max">
          {record?.assignedBy?.photoUrl !== undefined ? (
            <div>
              <img src={record?.assignedBy?.photoUrl} alt="" className="rounded-full w-7 h-7" />
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
      <div>
        <Table
          dataSource={staffScheduled?.teachingSchedules}
          style={{ background: 'white' }}
          scroll={{ y: 500, x: 900 }}
          pagination={false}
          locale={{
            emptyText: (
              <EmptyState
                emptyState={emptyStateSvg}
                emptyHeaderText={<span>No teaching schedule assigned yet</span>}
              />
            ),
          }}
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
      </div>
    </div>
  );
};

export default TeachingScheduleTable;
