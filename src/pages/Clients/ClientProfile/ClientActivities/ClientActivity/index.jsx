import React, { useState } from 'react';
import { Menu, Button, Icon, Dropdown, Avatar, Timeline, Input, Divider } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { ChatRightText } from 'react-bootstrap-icons';

dayjs.extend(relativeTime);

const ClientActivity = () => {
  const [noteInfo, setNoteInfo] = useState('');
  const [typeText, setTypeText] = useState('All types');

  const { TextArea } = Input;

  const activityTypeMenu = (
    <Menu
      onClick={(e) => {
        setTypeText(`${e.key}s`);
      }}
      style={{ width: 256 }}
    >
      <Menu.Item key="all type" className="text-black font-semibold hover:bg-gray-200 ">
        All types
        <div
          className="opacity-50"
          onClick={() => {
            // changeQueryParams('');
          }}
        >
          All activities logged
        </div>
      </Menu.Item>
      <Menu.Item
        key="note"
        onClick={() => {
          // changeQueryParams('notes');
        }}
        className="text-black font-semibold hover:bg-gray-200"
      >
        Notes
        <div className="opacity-50">Add and view notes</div>
      </Menu.Item>
      <Menu.Item
        key="email"
        onClick={() => {
          // changeQueryParams('emails');
        }}
        className="text-black font-semibold hover:bg-gray-200"
      >
        Emails
        <div className="opacity-50">Incoming or outgoing emails</div>
      </Menu.Item>
      <Menu.Item
        key="call"
        onClick={() => {
          // changeQueryParams('calls');
        }}
        className="text-black font-semibold hover:bg-gray-200"
      >
        Calls
        <div className="opacity-50">Incoming or outgoing calls</div>
      </Menu.Item>
    </Menu>
  );

  const scrollParentRef = React.useRef(null);
  return (
    <div>
      <>
        <div className="p-4 w-full mb-2">
          <div aria-hidden="true" className="">
            <div className="flex items-center justify-between">
              <div>
                <Avatar className="bg-primary" size="large">
                  SA
                </Avatar>
              </div>
              <div className="flex-auto text-gray-500 font-medium pl-2">
                Post an update for Sandeep Singh
              </div>
              <div className="text-gray-500">
                <ChatRightText className="text-2xl" />
              </div>
            </div>
          </div>
          <div className="py-2 px-4">
            <div className="w-full">
              <React.Fragment>
                <div className="mt-4">
                  <TextArea
                    rows="3"
                    className="w-full"
                    placeholder=" Post an update..."
                    value={noteInfo}
                    onChange={(event) => setNoteInfo(event.target.value)}
                  />
                </div>

                <div className="flex justify-end mt-8">
                  <div className="ml-20">
                    <Button
                      onClick={() => {
                        setNoteInfo('');
                      }}
                      type="link"
                    >
                      Cancel
                    </Button>
                  </div>

                  <div>
                    <Button type="primary">Save</Button>
                  </div>
                </div>
              </React.Fragment>
            </div>
          </div>
        </div>
        <Divider>Activities</Divider>
        <div className="flex justify-between px-8 py-1 ">
          <span>
            Showing <span className="text-blue-600"> 3 </span>
            of <span className="text-green-600"> 3 </span>
          </span>
          <Dropdown
            overlay={activityTypeMenu}
            trigger={['click']}
            placement="bottomRight"
            getPopupContainer={(trigger) => trigger.parentNode}
          >
            <Button
              type="link"
              className="font-semibold text-gray-800"
              onClick={(e) => e.preventDefault()}
            >
              <div className="capitalize flex item-center">
                {typeText}
                <span className="pl-2 text-center item-center ">
                  <Icon type="down" />
                </span>
              </div>
            </Button>
          </Dropdown>
        </div>
      </>
      <div className="px-8 pt-4" ref={scrollParentRef}>
        <div className="mt-4">
          <Timeline className="w-full">
            <Timeline.Item
            // dot={getTimelineIcon(activity?.iconType)}
            >
              <div className="flex justify-between ml-3">
                <div className="flex-wrap w-full">
                  <div className="flex justify-between">
                    <div>
                      <span className="text-blue-600 font-semibold">Sandeep Singh</span>{' '}
                      <span>
                        {/* {ReactHtmlParser(activity?.description)} */}
                        added a note
                      </span>
                    </div>
                    <div>
                      <div className="text-right text-gray-400">
                        <div className="text-xs italic text-gray-800">{dayjs().fromNow()}</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-gray-400 text-xs">
                    <div>
                      {dayjs().format('MMM D, YYYY')} at {dayjs().format('h:mm A')}
                    </div>
                  </div>
                  Could you please update the status of the lead Mr john, you can add a note and
                  notify others about the same.
                </div>
              </div>
            </Timeline.Item>
            <Timeline.Item>
              <div className="flex justify-between ml-3">
                <div className="flex-wrap w-full">
                  <div className="flex justify-between">
                    <div>
                      <span className="text-blue-600 font-semibold">Sandeep Singh</span>{' '}
                      <span>set the employer for Mr Satinder Singh Manugwaal as</span>
                    </div>
                    <div>
                      <div className="text-right text-gray-400">
                        <div className="text-xs italic text-gray-800">{dayjs().fromNow()}</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-gray-400 text-xs">
                    <div>
                      {dayjs().format('MMM D, YYYY')} at {dayjs().format('h:mm A')}
                    </div>
                  </div>
                  Could you please update the status of the lead Mr john, you can add a note and
                  notify others about the same.
                </div>
              </div>
            </Timeline.Item>
          </Timeline>
        </div>
      </div>
    </div>
  );
};

export default ClientActivity;
