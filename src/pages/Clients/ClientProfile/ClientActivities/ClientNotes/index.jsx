/* eslint-disable react/no-danger */
import React, { useState } from 'react';
import { ChatRightText, ThreeDotsVertical } from 'react-bootstrap-icons';
import { Button, Popconfirm, Popover, Avatar, Divider, Input } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { TextArea } = Input;

const ClientNotes = () => {
  const [showthreedots, setShowthreedots] = useState(false);
  const [noteInfo, setNoteInfo] = useState('');

  return (
    <div>
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
      <div className="w-full">
        <Divider>Notes</Divider>
        <div className="py-4 hover:bg-gray-200">
          <div className="flex px-4 py-2">
            <div>
              <Avatar size="large">SA</Avatar>
            </div>
            <div className="pl-2 mr-auto">
              <div>
                <span className="text-gray-800 font-semibold "> sandeep singh </span>
                <span className="text-gray-700">
                  {dayjs().fromNow()} at {dayjs().format('h:mm a')}
                </span>
              </div>
              {/* Note details */}
              <div>
                Could you please update the status of the lead Mr john, you can add a note and
                notify others about the same.
              </div>
            </div>
            <Popover
              placement="bottomRight"
              overlayClassName="app-popup"
              visible={showthreedots}
              onVisibleChange={(isVisible) => setShowthreedots(isVisible)}
              getPopupContainer={(trigger) => trigger.parentNode}
              content={
                <div>
                  <div
                    aria-hidden="true"
                    style={{}}
                    className="px-6 py-3 hover:bg-gray-200 hover:text-blue-500 font-medium cursor-pointer"
                  >
                    Edit note
                  </div>
                  <Popconfirm
                    title={
                      <div>
                        <div className="text-lg font-semibold text-black">Delete note</div>
                        <div>Are you sure you want to delete the note?</div>
                      </div>
                    }
                    // getPopupContainer={trigger => trigger.parentNode}
                    // onConfirm={() => deleteDealNote(note.id)}
                    okText="Delete"
                    okType="danger"
                    cancelText="Cancel"
                  >
                    <p className="px-6 py-3 hover:bg-gray-200 font-medium cursor-pointer text-red-600">
                      Delete note
                    </p>
                  </Popconfirm>
                </div>
              }
              trigger="click"
            >
              <Button type="link" size="small" onClick={() => setShowthreedots(true)}>
                <ThreeDotsVertical className="text-lg text-black" />
              </Button>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientNotes;
