import React from 'react';
import { Icon, Popover } from 'antd';
import { EnvelopeFillIcon } from '@/utils/AppIcons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const ClientEmailLogs = () => (
  <div className="h-full overflow-y-scroll">
    <div className="py-4">
      <div>
        <div className="flex text-xs justify-between px-6 pb-2">
          <div>Associated Emails ({2})</div>
          <div
            className="text-blue-600 font-semibold cursor-pointer"
            // onClick={() => setSendEmailModalVisible(true)}
          >
            <Icon className="mr-1" type="plus-circle" />
            New Email
          </div>
        </div>
        <div className="hover:bg-gray-200">
          <div className="flex border-b py-4 text-sm items-center px-6 ">
            <div className="flex-none bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center">
              {EnvelopeFillIcon()}
            </div>
            <Popover
              title={null}
              content={
                <div style={{ width: 400 }}>Sent an email to client regarding follow up</div>
              }
              placement="top"
            >
              <div
                className="text-blue-600 ml-2 font-semibold w-3/4 truncate mr-auto cursor-pointer"
                data-tip
                // data-for={`title-${email.description}`}
              >
                Sent an email to client regarding follow up
                <div className="text-gray-500 font-semibold text-xs">
                  <Icon type="check-circle-o" className="mr-1" />
                  {dayjs().fromNow()} on {dayjs().format('h:mm a')}
                </div>
              </div>
            </Popover>
          </div>
          <div className="flex border-b py-4 text-sm items-center px-6 ">
            <div className="flex-none bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center">
              {EnvelopeFillIcon()}
            </div>
            <Popover
              title={null}
              content={
                <div style={{ width: 400 }}>Sent an email to client regarding follow up</div>
              }
              placement="top"
            >
              <div
                className="text-blue-600 ml-2 font-semibold w-3/4 truncate mr-auto cursor-pointer"
                data-tip
                // data-for={`title-${email.description}`}
              >
                Sent an email to client regarding follow up
                <div className="text-gray-500 font-semibold text-xs">
                  <Icon type="check-circle-o" className="mr-1" />
                  {dayjs().fromNow()} on {dayjs().format('h:mm a')}
                </div>
              </div>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ClientEmailLogs;
