import React from 'react';
import { Avatar, Dropdown, Tooltip, Tabs, Menu, Spin, message } from 'antd';
import AppIcons from '@/utils/AppIcons';
import { FileTextOutlined, MoreOutlined, UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import CheckValidation from '@/components/CheckValidation';
import EmptyState from '@/components/EmptyState';
import emptyStateSvg from '@/assets/icons/space-empty.svg';
import { connect } from 'umi';

const StaffRemarks = ({
  setRemarkTab,
  remarkTab,
  getSingleRemark,
  loadingForGetRemarks,
  getStaffAllRemark,
  tab,
  staffId,
  dispatch,
  getAllRemarks,
  loadingForRead,
}) => {
  const { TabPane } = Tabs;
  const remarksTabs = [
    {
      tab: <span className="font-semibold">{`All`}</span>,
      key: 'all',
    },
    {
      tab: (
        <span className="font-semibold">{
          `Posted`
          // (${
          //   getTeacherRemarksCounts?.notesStats?.allNotes
          //     ? getTeacherRemarksCounts?.notesStats?.allNotes
          //     : '0'
          // })`
        }</span>
      ),
      key: 'posted',
    },
    {
      tab: (
        <span className="font-semibold">{
          `Seen`
          // (${
          //   getTeacherRemarksCounts?.notesStats?.seen
          //     ? getTeacherRemarksCounts?.notesStats?.seen
          //     : '0'
          // })`
        }</span>
      ),
      key: 'seen',
    },
  ];

  const markRemarksRead = (val) => {
    dispatch({
      type: 'staff/markReadStaffNote',
      payload: {
        pathParams: {
          staffId,
          noteId: val,
        },
      },
    }).then((res) => {
      if (res?.message === 'Note status updated successfully.') {
        getAllRemarks();
        message.success('Remark marked as read');
      } else {
        message.error('Something went worng');
      }
    });
  };
  return (
    <div>
      <Tabs
        defaultActiveKey="all"
        activeKey={remarkTab}
        onChange={(value) => {
          setRemarkTab(value);
        }}
      >
        {remarksTabs?.map((item) => (
          <TabPane
            tab={item?.tab}
            key={item?.key}
            style={{ height: '32rem', overflow: 'auto', padding: '11px' }}
          >
            <Spin spinning={Boolean(loadingForGetRemarks || loadingForRead)}>
              <CheckValidation
                show={getStaffAllRemark?.records?.length > 0}
                fallback={
                  <EmptyState
                    emptyState={emptyStateSvg}
                    emptyHeaderText={<span>No Teacher remarks found yet!</span>}
                  />
                }
              />
              {getStaffAllRemark?.records?.map((remarks) => (
                <div key={remarks?.id}>
                  <div className={` flex  h-full shadow-md  my-4 mr-2 mt-5`} key={remarks?.id}>
                    <div className="bg-green-500 w-2 rounded-l-lg " />
                    {remarkTab === 'all' && (
                      <>
                        {' '}
                        <div className="border rounded-r-lg w-full">
                          <div className="flex items-center mx-2 my-2 justify-between ">
                            <div className={`flex`}>
                              <div className="flex justify-center items-center leading-3 h-9 w-9 bg-gray-300 rounded-full">
                                <FileTextOutlined style={{ color: '#3B82F6' }} />
                              </div>

                              <div className="flex text-lg  font-semibold text-gray-700 px-3 items-center ">
                                {remarks?.title}
                              </div>

                              <div className="flex  text-lg border-l  font-semibold text-gray-700 px-4 items-center ">
                                Files :{' '}
                                <span className="text-gray-500 text-lg ml-1">test file</span>
                              </div>
                            </div>

                            <div className="flex justify-end">
                              <div className="mt-1.5 mr-2">
                                {remarks?.statusId === 'unread' ? (
                                  <AppIcons.EnvelopeAction />
                                ) : (
                                  <AppIcons.EnvelopeOpen />
                                )}
                              </div>
                              <span>
                                {' '}
                                <Dropdown
                                  getPopupContainer={(node) => node.parentNode}
                                  placement="bottomLeft"
                                  arrow
                                  overlay={
                                    <Menu className="not-italic">
                                      <Menu.Item onClick={() => getSingleRemark(remarks?.id)}>
                                        Edit
                                      </Menu.Item>
                                      <Menu.Item
                                      //  onClick={() => DeleteRemark(val?.id)}
                                      >
                                        Delete
                                      </Menu.Item>
                                      <Menu.Item onClick={() => markRemarksRead(remarks?.id)}>
                                        Mark as read
                                      </Menu.Item>
                                      <Menu.Item
                                      //  onClick={() => markRemarksUnread(val?.id)}
                                      >
                                        Mark as Unread
                                      </Menu.Item>
                                    </Menu>
                                  }
                                >
                                  <MoreOutlined
                                    // onClick={() => setDropdownVisible(true)}
                                    className="text-lg cursor-pointer hover:text-yellow-600 "
                                  />
                                </Dropdown>
                              </span>
                            </div>
                          </div>
                          <div className="flex -mt-3 text-md">
                            <div className="border-r text-green-500 font-semibold ml-14 pr-4">
                              {dayjs(remarks?.createdAt).format('MM-DD-YYYY ')} 01-31-2022
                              <span className="border-l pl-2 ml-2">
                                {' '}
                                {dayjs(remarks?.createdAt).format('h:mm A')} 3:57 PM
                              </span>
                            </div>
                            <div className="text-gray-700 font-semibold pl-2">
                              Modules :
                              <span className="text-gray-500">
                                {remarks?.module ? ` ${remarks?.module?.name}` : 'Not assigned'}
                              </span>
                            </div>
                          </div>
                          <div className="flex justify-between mx-2 mt-8 mb-2">
                            <div className="text-yellow-500 text-md text-bold">
                              Remarks :
                              <span className="text-gray-500 text-semibold">
                                {remarks?.noteInfo}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <div className="border-r pr-2">
                                <Tooltip title="Language teacher | Teaching | BO-Kapurthala">
                                  <span>
                                    <Avatar
                                      size="small"
                                      style={{ backgroundColor: '#3162A5' }}
                                      icon={
                                        <div className="-mt-1">
                                          <UserOutlined />
                                        </div>
                                      }
                                    />
                                  </span>
                                  <span className="text-yellow-500 font-bold ml-2 text-md">
                                    Created by :
                                  </span>
                                  <span className="text-gray-500 text-md ml-2 text-semibold">
                                    {remarks?.createdByInfo?.displayName}OMG Store Manager
                                  </span>
                                </Tooltip>
                              </div>
                              <Tooltip title={remarks?.createdByInfo?.email}>
                                <div className="text-lg  ml-2 text-green-600">
                                  <AppIcons.EnvelopeFillIcon />
                                </div>
                              </Tooltip>
                              <div className="text-lg  ml-2 text-yellow-500">
                                <AppIcons.TelephoneFillIcon />
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                    {tab === 'posted' && (
                      <>
                        {' '}
                        <div className="border rounded-r-lg w-full">
                          <div className="flex items-center mx-2 my-2 justify-between ">
                            <div className={`flex`}>
                              <div className="flex justify-center items-center leading-3 h-9 w-9 bg-gray-300 rounded-full">
                                <FileTextOutlined style={{ color: '#3B82F6' }} />
                              </div>

                              <div className="flex text-lg  font-semibold text-gray-700 px-3 items-center ">
                                {remarks?.title}
                              </div>

                              <div className="flex  text-lg border-l  font-semibold text-gray-700 px-4 items-center ">
                                Files :{' '}
                                <span className="text-gray-500 text-lg ml-1">test file</span>
                              </div>
                            </div>

                            <div className="flex justify-end">
                              <div className="mt-1.5 mr-2">
                                {remarks?.statusId === 'unread' ? (
                                  <AppIcons.EnvelopeAction />
                                ) : (
                                  <AppIcons.EnvelopeOpen />
                                )}
                              </div>
                              <span>
                                {' '}
                                <Dropdown
                                  getPopupContainer={(node) => node.parentNode}
                                  placement="bottomLeft"
                                  arrow
                                  overlay={
                                    <Menu className="not-italic">
                                      <Menu.Item
                                      // onClick={() => getParticularRemark(val?.id)}
                                      >
                                        Edit
                                      </Menu.Item>
                                      <Menu.Item
                                      // onClick={() => DeleteRemark(val?.id)}
                                      >
                                        Delete
                                      </Menu.Item>
                                      {item?.statusId === 'unread' && (
                                        <Menu.Item
                                        // onClick={() => markRemarksRead(val?.id)}
                                        >
                                          Mark as read
                                        </Menu.Item>
                                      )}
                                      {item?.statusId === 'read' && (
                                        <Menu.Item
                                        // onClick={() => markRemarksUnread(val?.id)}
                                        >
                                          Mark as Unread
                                        </Menu.Item>
                                      )}
                                    </Menu>
                                  }
                                >
                                  <MoreOutlined
                                    // onClick={() => setDropdownVisible(true)}
                                    className="text-lg cursor-pointer hover:text-yellow-600 "
                                  />
                                </Dropdown>
                              </span>
                            </div>
                          </div>
                          <div className="flex -mt-3 text-md">
                            <div className="border-r text-green-500 font-semibold ml-14 pr-4">
                              {dayjs(remarks?.createdAt).format('MM-DD-YYYY ')}{' '}
                              <span className="border-l pl-2 ml-2">
                                {' '}
                                {dayjs(remarks?.createdAt).format('h:mm A')}{' '}
                              </span>
                            </div>
                            <div className="text-gray-700 font-semibold pl-2">
                              Modules :
                              <span className="text-gray-500">
                                {remarks?.module ? ` ${remarks?.module?.name}` : 'Not assigned'}
                              </span>
                            </div>
                          </div>
                          <div className="flex justify-between mx-2 mt-8 mb-2">
                            <div className="text-yellow-500 text-md text-bold">
                              Remarks :{' '}
                              <span className="text-gray-500 text-semibold">
                                {remarks?.noteInfo}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <div className="border-r pr-2">
                                <Tooltip title="Language teacher | Teaching | BO-Kapurthala">
                                  <span>
                                    <Avatar
                                      size="small"
                                      style={{ backgroundColor: '#3162A5' }}
                                      icon={
                                        <div className="-mt-1">
                                          <UserOutlined />
                                        </div>
                                      }
                                    />
                                  </span>
                                  <span className="text-yellow-500 font-bold ml-2 text-md">
                                    Created by :
                                  </span>
                                  <span className="text-gray-500 text-md ml-2 text-semibold">
                                    {remarks?.createdByInfo?.displayName}
                                  </span>
                                </Tooltip>
                              </div>
                              <Tooltip title={remarks?.createdByInfo?.email}>
                                <div className="text-lg  ml-2 text-green-600">
                                  <AppIcons.EnvelopeFillIcon />
                                </div>
                              </Tooltip>
                              <div className="text-lg  ml-2 text-yellow-500">
                                <AppIcons.TelephoneFillIcon />
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                    {tab === 'seen' && remarks?.statusId === 'read' && (
                      <>
                        {' '}
                        <div className="border rounded-r-lg w-full">
                          <div className="flex items-center mx-2 my-2 justify-between ">
                            <div className={`flex`}>
                              <div className="flex justify-center items-center leading-3 h-9 w-9 bg-gray-300 rounded-full">
                                <FileTextOutlined style={{ color: '#3B82F6' }} />
                              </div>

                              <div className="flex text-lg  font-semibold text-gray-700 px-3 items-center ">
                                {remarks?.title}
                              </div>

                              <div className="flex  text-lg border-l  font-semibold text-gray-700 px-4 items-center ">
                                Files :{' '}
                                <span className="text-gray-500 text-lg ml-1">test file</span>
                              </div>
                            </div>

                            <div className="flex justify-end">
                              <div className="mt-1.5 mr-2">
                                {remarks?.statusId === 'unread' ? (
                                  <AppIcons.EnvelopeAction />
                                ) : (
                                  <AppIcons.EnvelopeOpen />
                                )}
                              </div>
                              <span>
                                {' '}
                                <Dropdown
                                  getPopupContainer={(node) => node.parentNode}
                                  placement="bottomLeft"
                                  arrow
                                  overlay={
                                    <Menu className="not-italic">
                                      <Menu.Item
                                      //  onClick={() => getParticularRemark(val?.id)}
                                      >
                                        Edit
                                      </Menu.Item>
                                      <Menu.Item
                                      // onClick={() => DeleteRemark(val?.id)}
                                      >
                                        Delete
                                      </Menu.Item>
                                      <Menu.Item
                                      // onClick={() => markRemarksRead(val?.id)}
                                      >
                                        Mark as read
                                      </Menu.Item>
                                      <Menu.Item
                                      // onClick={() => markRemarksUnread(val?.id)}
                                      >
                                        Mark as Unread
                                      </Menu.Item>
                                    </Menu>
                                  }
                                >
                                  <MoreOutlined
                                    // onClick={() => setDropdownVisible(true)}
                                    className="text-lg cursor-pointer hover:text-yellow-600 "
                                  />
                                </Dropdown>
                              </span>
                            </div>
                          </div>
                          <div className="flex -mt-3 text-md">
                            <div className="border-r text-green-500 font-semibold ml-14 pr-4">
                              {dayjs(remarks?.createdAt).format('MM-DD-YYYY ')}{' '}
                              <span className="border-l pl-2 ml-2">
                                {' '}
                                {dayjs(remarks?.createdAt).format('h:mm A')}{' '}
                              </span>
                            </div>
                            <div className="text-gray-700 font-semibold pl-2">
                              Modules :
                              <span className="text-gray-500">
                                {remarks?.module ? ` ${remarks?.module?.name}` : 'Not assigned'}
                              </span>
                            </div>
                          </div>
                          <div className="flex justify-between mx-2 mt-8 mb-2">
                            <div className="text-yellow-500 text-md text-bold">
                              Remarks :{' '}
                              <span className="text-gray-500 text-semibold">
                                {remarks?.noteInfo}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <div className="border-r pr-2">
                                <Tooltip title="Language teacher | Teaching | BO-Kapurthala">
                                  <span>
                                    <Avatar
                                      size="small"
                                      style={{ backgroundColor: '#3162A5' }}
                                      icon={
                                        <div className="-mt-1">
                                          <UserOutlined />
                                        </div>
                                      }
                                    />
                                  </span>
                                  <span className="text-yellow-500 font-bold ml-2 text-md">
                                    Created by :
                                  </span>
                                  <span className="text-gray-500 text-md ml-2 text-semibold">
                                    {remarks?.createdByInfo?.displayName}
                                  </span>
                                </Tooltip>
                              </div>
                              <Tooltip title={remarks?.createdByInfo?.email}>
                                <div className="text-lg  ml-2 text-green-600">
                                  <AppIcons.EnvelopeFillIcon />
                                </div>
                              </Tooltip>
                              <div className="text-lg  ml-2 text-yellow-500">
                                <AppIcons.TelephoneFillIcon />
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </Spin>
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
};

export default connect(({ loading }) => ({
  loadingForRead: loading?.effects['staff/markReadStaffNote'],
}))(StaffRemarks);
