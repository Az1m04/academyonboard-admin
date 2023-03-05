import { ClockCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import React from 'react';
import { CircleFill } from 'react-bootstrap-icons';
import { history } from 'umi';

function toTitleCase(str) {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}
function AllBatches({ allBatch }) {
  return (
    <div className="flex relative" style={{ width: 'max-content' }}>
      <div
        style={{ backgroundColor: '#faad14' }}
        className="m-0 flex gap-2 justify-center text-center py-2 flex-none w-28 border-r sticky top-0 left-0 border-b"
      >
        <ClockCircleOutlined className="mt-1" />
        <h1 className="m-0">Time</h1>
      </div>
      {allBatch?.map((item, index) => (
        <>
          <div
            key={item?.id}
            style={{ backgroundColor: '#1B568F' }}
            className={`m-0 w-48 flex-none py-2 font-medium text-white text-center cursor-pointer select-none border-b ${
              index !== allBatch?.length - 1 && 'border-r'
            } `}
            onClick={() => history?.push(`/timetable/batch/all/${item?.id}`)}
          >
            <Tooltip
              overlayInnerStyle={{
                color: '#1B568F',
                backgroundColor: 'white',
                fontWeight: '500',
                border: '0.5px solid #1B568F',
              }}
              title={`${(item?.name?.length > 20 && toTitleCase(item?.name)) || ''}`}
            >
              <div className="capitalize flex items-center justify-center">
                <p
                  className={`m-0 text-center text-white ${item?.name?.length > 20 && 'truncate'}`}
                  style={{ width: `${item?.name?.length > 20 && '150px'}` }}
                  key={item?.id}
                >
                  {toTitleCase(item?.name)}
                </p>
                <span>
                  {item?.modeId === 'ONLINE' && (
                    <CircleFill className="text-green-500 mt-0.5 pl-1" />
                  )}
                </span>
              </div>
            </Tooltip>
          </div>
        </>
      ))}
    </div>
  );
}

export default AllBatches;
