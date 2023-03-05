/* eslint-disable react/jsx-no-undef */
/* eslint-disable quotes */
/* eslint-disable arrow-body-style */

import React, { useState } from 'react';
import { Menu, Button, Timeline, Dropdown, Icon } from 'antd';
import { ChatFillIcon, EnvelopeFillIcon, BuildingIcon, TelephoneFillIcon } from '@/utils/AppIcons';
import ReactHtmlParser from 'react-html-parser';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const activities = {
  records: [
    {
      author: {
        displayName: 'Jagdeep Singh',
        enabled: false,
        id: '12218',
        me: false,
        photoUrl: '13088',
        requiresPasswordChange: false,
        description: 'added a note.',
        long_description:
          '<p><p>Lead status was changed from &#x27;New&#x27; to &#x27;Contacted&#x27;.</p></p>',
        start_time: '2021-06-23T12:18:29.000Z',
        type: 'note',
      },
      description: 'added a note.',
      long_description:
        '<p><p>Lead status was changed from &#x27;New&#x27; to &#x27;Contacted&#x27;.</p></p>',
      start_time: '2021-06-23T12:18:29.000Z',
      type: 'note',
    },
    {
      author: {
        displayName: 'Kajal  Malhotra',
        enabled: false,
        id: '10945',
        me: false,
        photoUrl: '11410',
        requiresPasswordChange: false,
      },
      description: 'set the employer for Mr Harjeet Dhillon   as ',
      long_description: '',
      start_time: '2021-06-23T11:44:21.000Z',
      type: 'employer',
    },
    {
      author: {
        displayName: 'kajal.malhotra@simbaquartz.com',
        enabled: false,
        id: 'kajal.malhotra@simbaquartz.com',
        me: false,
        requiresPasswordChange: false,
      },
      description: 'added phone +1 647-574-5335',
      long_description: '',
      start_time: '2021-06-23T11:44:21.000Z',
      type: 'phone',
    },
    {
      author: {
        displayName: 'kajal.malhotra@simbaquartz.com',
        enabled: false,
        id: 'kajal.malhotra@simbaquartz.com',
        me: false,
        requiresPasswordChange: false,
      },
      description: 'added email sukh@hawkstrans.com',
      long_description: '',
      start_time: '2021-06-23T11:44:20.000Z',
      type: 'email',
    },
  ],
  fetchSize: '10',
  startIndex: 0,
  totalCount: 5,
};

const PartyActivityTab = () => {
  // eslint-disable-next-line no-unused-vars
  const [typeText, setTypeText] = useState('All types');

  const getTimelineIcon = (iconType) => {
    switch (iconType) {
      case 'email':
        return (
          <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center">
            {EnvelopeFillIcon()}
          </div>
        );
      case 'phone':
        return (
          <div className="bg-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center">
            {TelephoneFillIcon()}
          </div>
        );
      case 'call log':
        return (
          <div className="bg-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center">
            {TelephoneFillIcon()}
          </div>
        );
      case 'personal':
        return (
          <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center">
            {ChatFillIcon()}
          </div>
        );
      case 'note':
        return (
          <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center">
            {ChatFillIcon()}
          </div>
        );
      case 'employer':
        return (
          <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center">
            {BuildingIcon()}
          </div>
        );
      default:
        return (
          <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center">
            {ChatFillIcon()}
          </div>
        );
    }
  };

  const activityTypeMenu = (
    <Menu
      //   onClick={e => {
      //      some code here
      //   }}
      style={{ width: 256 }}
    >
      <Menu.Item key="all type" className="text-black font-semibold hover:bg-gray-200 ">
        All types
        <div
          className="opacity-50"
          //   onClick={() => {
          //      some code here
          //   }}
        >
          All activities logged
        </div>
      </Menu.Item>
      <Menu.Item
        key="note"
        // onClick={() => {
        //    some code here
        // }}
        className="text-black font-semibold hover:bg-gray-200"
      >
        Notes
        <div className="opacity-50">Add and view notes</div>
      </Menu.Item>
      <Menu.Item
        key="email"
        // onClick={() => {
        //    some code here
        // }}
        className="text-black font-semibold hover:bg-gray-200"
      >
        Emails
        <div className="opacity-50">Incoming or outgoing emails</div>
      </Menu.Item>
      <Menu.Item
        key="call"
        // onClick={() => {
        //    some code here
        // }}
        className="text-black font-semibold hover:bg-gray-200"
      >
        Calls
        <div className="opacity-50">Incoming or outgoing calls</div>
      </Menu.Item>
    </Menu>
  );
  return (
    <div>
      <div className="flex justify-between  py-1 ">
        <span className="mr-4">
          Showing <span className="text-blue-600"> {activities?.records?.length} </span>
          of <span className="text-green-600"> {activities?.totalCount} </span>
        </span>
        <div className="mx-40" />
        <Dropdown
          overlay={activityTypeMenu}
          trigger={['click']}
          getPopupContainer={(trigger) => trigger.parentNode}
        >
          <Button
            type="link"
            className="font-semibold text-gray-800"
            onClick={(e) => e.preventDefault()}
          >
            <div className="capitalize flex item-center ml-4 ">
              {typeText} <Icon type="down" className="ml-2" />
            </div>
          </Button>
        </Dropdown>
      </div>

      <div className="mt-4">
        <Timeline className="w-full">
          {activities?.records?.map((activity, index) => (
            <Timeline.Item key={index} dot={getTimelineIcon(activity?.type)}>
              <div className="flex justify-between ml-3">
                <div className="flex-wrap w-full">
                  <div className="flex justify-between">
                    <div>
                      <span className="text-blue-600 font-semibold">
                        {activity?.author?.displayName}
                      </span>{' '}
                      <span>{ReactHtmlParser(activity?.description)}</span>
                    </div>
                    <div>
                      <div className="text-right text-gray-400">
                        <div className="text-xs italic text-gray-800">
                          {dayjs(activity?.start_time).fromNow()}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-gray-400 text-xs">
                    <div>
                      {dayjs(activity?.start_time).format('MMM D, YYYY')} at{' '}
                      {dayjs(activity?.start_time).format('h:mm A')}
                    </div>
                  </div>
                  {/* {getActivity(activity, index)} */}
                </div>
              </div>
            </Timeline.Item>
          ))}
        </Timeline>
      </div>
    </div>
  );
};

export default PartyActivityTab;
