import React from 'react';
import {
  // BellFilled,
  SearchOutlined,
  PlusCircleTwoTone,
  PlusSquareOutlined,
} from '@ant-design/icons';
import RightContent from '@/components/GlobalHeader/RightContent';
import { Dropdown, Input, Menu } from 'antd';
import { history } from 'umi';
import styles from './basicStyling.less';
import classNames from 'classnames';

const Topbar = () => {
  const onMenuClick = (event) => {
    const { key } = event;
    history.push(`${key}`);
  };

  const menu = (
    <Menu className="w-48" onClick={onMenuClick}>
      <Menu.Item key="/leads/students/new">
        <span className=" ">
          <PlusSquareOutlined /> Add lead
        </span>
      </Menu.Item>
      <Menu.Item key="/">
        <span>
          <PlusSquareOutlined /> Invite client
        </span>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="flex justify-between items-center">
      <div className="flex">
        <div
          style={{
            width: 600,
          }}
          className="bg-blue-300 rounded-full px-4 pb-1 text-center justify-center items-center"
        >
          <Input
            suffix={
              <SearchOutlined
                className="mt-2 text-center justify-center items-center"
                style={{ color: 'white' }}
              />
            }
            size="middle"
            bordered={false}
            className={classNames('text-gray-100', styles.placeholderStyling)}
            placeholder="Search by name here..."
          />
        </div>
        <Dropdown overlay={menu} trigger={['click']}>
          <div className=" items-center pl-4 flex justify-center">
            <PlusCircleTwoTone className="text-2xl cursor-pointer" />
          </div>
        </Dropdown>
      </div>
      <div className="relative flex  items-center">
        {/* <div className="px-2 relative cursor-pointer">
          <span className="border-2 border-white absolute right-2 top-0 flex items-center justify-center h-3 w-3 rounded-full bg-red-700 text-white text-xs font-medium -ml-6 mt-1 mr-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 -ml-0 -mt-0" />
            <span className="relative inline-flex rounded-full" />
          </span>
          <div className="flex px-2 pt-2 pb-1 text-white items-center mr-2 ">
            <BellFilled className="text-xl text-white" />
          </div>
        </div> */}
        <RightContent />
      </div>
    </div>
  );
};

export default Topbar;
