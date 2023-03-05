import React, { useEffect } from 'react';
import {
  Button,
  Table,
  Input,
  Row,
  Pagination,
  Popconfirm,
  message,
  Tabs,
  Dropdown,
  Menu,
  Tooltip,
  notification,
} from 'antd';
import Breadcrumbs from '@/components/BreadCrumbs';
import { DeleteOutlined, EditOutlined, PlusSquareOutlined } from '@ant-design/icons';
import Page from '@/components/Page';
import { Link, connect, history } from 'umi';
import SearchNotFound from '@/assets/icons/empty-search-contact.png';
import { useState } from 'react';
import { debounce } from 'lodash';
import { CaretDownFill } from 'react-bootstrap-icons';

const { Search } = Input;

const ClassPage = ({
  dispatch,
  loading,
  classesRecord,
  primaryColor,
  match,
  location,
  deleteLoading,
}) => {
  const [keyword, setKeyword] = useState('');
  const [startIndex, setStartIndex] = useState(0);
  const [viewSize, setViewSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const { TabPane } = Tabs;
  const action = (value) => {
    setKeyword(value);
  };

  const getTabKey = () => {
    const url = match.path === '/' ? '' : match.path;

    const tabKey = location.pathname.replace(`${url}/`, '');

    if (tabKey && tabKey !== '/') {
      switch (tabKey) {
        case '/classes/all':
          return 'ALL';
        case '/classes/active':
          return 'ACTIVE';
        case '/classes/inactive':
          return 'INACTIVE';

        default:
          return 'ALL';
      }
    }
    return 'ALL';
  };

  const handleTabChange = (key) => {
    const url = match.url === '/' ? '' : match.url.replace(/[^/]+$/, '');
    switch (key) {
      case 'ALL':
        history.push(`${url}all`);
        break;
      case 'ACTIVE':
        history.push(`${url}active`);
        break;
      case 'INACTIVE':
        history.push(`${url}inactive`);
        break;

      default:
        break;
    }
  };

  const getIsActiveKey = () => {
    const key = getTabKey();

    if (key === 'ACTIVE') {
      return true;
    }
    if (key === 'INACTIVE') {
      return false;
    }
    return '';
  };
  const getModeId = () => {
    const key = getTabKey();

    if (key === 'ONLINE') {
      return 'ONLINE';
    }
    if (key === 'OFFLINE') {
      return 'OFFLINE';
    }
    return '';
  };
  const onChange = debounce(action, 600);
  const getClasses = () => {
    dispatch({
      type: 'classDetails/getClass',
      payload: {
        query: {
          isFetchAll: typeof getIsActiveKey() !== 'boolean' && getModeId()?.length === 0,
          statusId:
            getTabKey() === 'ALL'
              ? ''
              : (getTabKey() === 'ACTIVE' && 'CAL_PLANNED') ||
                (getTabKey() === 'INACTIVE' && 'CAL_CANCELLED'),
          viewSize,
          startIndex,
          keyword,
        },
      },
    });
  };
  useEffect(() => {
    getClasses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, keyword, startIndex, viewSize]);

  const deleteClass = (classId) => {
    dispatch({
      type: 'classDetails/deleteClass',
      payload: {
        pathParams: { classId },
      },
    })
      .then((res) => {
        if (res?.responseMessage === 'success') {
          message.success('Class deleted successfully');
          getClasses();
        } else {
          message.error('Something went wrong !');
        }
      })
      .catch((err) => {
        if (err.status === 400) {
          notification.error({
            message: 'Invalid request',
            description: "Class assignee to batch. Can't able to remove it",
          });
        }
      });
  };

  const columns = [
    {
      title: 'Sr.No.',
      dataIndex: 'srno',
      align: 'center',
      width: 50,
      render: (_, __, index) => index + 1 + viewSize * (currentPage - 1),
    },
    {
      title: <div className="">Name</div>,
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: <div className="">Type</div>,
      dataIndex: 'classType',
      key: 'classType',
    },
    {
      title: <div className="">Floor</div>,
      dataIndex: 'floor',
      key: 'floor',
      align: 'center',
    },

    {
      title: <div className="">Campus name</div>,
      dataIndex: 'campusName',
      key: 'campusName',
      align: 'center',
      render: (data) => data || '_',
    },
    {
      title: <div className="">Sitting capacity</div>,
      dataIndex: 'sittingCapacity',
      key: 'sittingCapacity',
      align: 'center',
    },
    {
      title: () => <p className="mb-0 pl-5">Status</p>,
      dataIndex: 'statusId',
      align: 'left',
      render: (data, record) => (
        <span
          onClick={(ev) => {
            ev.preventDefault();
            ev.stopPropagation();
          }}
        >
          <Dropdown
            trigger={['click']}
            overlay={
              <Menu>
                {[
                  { text: 'Active', value: 'CAL_PLANNED' },
                  { text: 'Inactive', value: 'CAL_CANCELLED' },
                ]?.map((item) => {
                  if (item?.value !== data)
                    return (
                      <Menu.Item
                        onClick={() => {
                          if (data === 'CAL_PLANNED') {
                            dispatch({
                              type: 'classDetails/changeActivityStatus',
                              payload: {
                                body: { statusId: 'CAL_CANCELLED' },
                                pathParams: { classId: record?.id },
                              },
                            }).then((res) => {
                              if (res?.message?.length !== 0) {
                                message.success('Class is inactivated successfully.');

                                getClasses();
                              } else {
                                message.error('Something went wrong !');
                              }
                            });
                          } else {
                            dispatch({
                              type: 'classDetails/changeActivityStatus',
                              payload: {
                                body: { statusId: 'CAL_PLANNED' },
                                pathParams: { classId: record?.id },
                              },
                            }).then((res) => {
                              if (res?.message?.length !== 0) {
                                message.success('Class is activated successfully.');

                                getClasses();
                              } else {
                                message.error('Something went wrong !');
                              }
                            });
                          }
                        }}
                        key={item?.value}
                      >
                        {item?.text}
                      </Menu.Item>
                    );
                  return null;
                })}
              </Menu>
            }
          >
            <Button type="text">
              <div className="flex items-center">
                {data === 'CAL_PLANNED' ? 'Active' : 'Inactive'}{' '}
                <div className="flex items-center">
                  <CaretDownFill className="ml-2" />
                </div>
              </div>
            </Button>
          </Dropdown>
        </span>
      ),
    },
    {
      title: <div className="">Action</div>,
      dataIndex: 'id',
      key: 'id',
      render: (data) => (
        <div className="flex gap-2">
          <div
            className="cursor-pointer"
            onClick={(ev) => {
              ev.preventDefault();
              ev.stopPropagation();
              history.push(`/classes/${data}`);
            }}
          >
            <Tooltip title="Edit class">
              <div style={{ color: primaryColor }} className="font-normal capitalize py-3">
                <EditOutlined className="text-yellow-700" />
              </div>
            </Tooltip>
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <Popconfirm
              title="Are you sure you want to delete this class?"
              okText="Delete"
              okType="danger"
              cancelText="No"
              onCancel={(e) => e.stopPropagation()}
              onConfirm={(ev) => {
                ev.preventDefault();
                ev.stopPropagation();
                deleteClass(data);
              }}
            >
              <div
                className={` py-3 cursor-pointer items-center flex`}
                onClick={(ev) => {
                  ev.preventDefault();
                  ev.stopPropagation();
                }}
              >
                <p className="px-3 mb-0 text-red-500">
                  <DeleteOutlined className=" text-red-600" />
                </p>
              </div>
            </Popconfirm>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto">
      <Page
        title="Classes"
        PrevNextNeeded="N"
        breadcrumbs={
          <Breadcrumbs
            path={[
              {
                name: 'Dashboard',
                path: '/dashboard',
              },
              {
                name: 'Classes',
                path: '/classes',
              },
            ]}
          />
        }
        primaryAction={
          <Link
            to={{
              pathname: '/classes/new',
            }}
          >
            <Button
              style={{ display: 'flex', alignItems: 'center' }}
              icon={<PlusSquareOutlined />}
              type="primary"
              id="open-invite-staff"
            >
              Add Class
            </Button>
          </Link>
        }
      >
        <div className="bg-white rounded shadow ">
          <Tabs defaultActiveKey="ACTIVE" activeKey={getTabKey()} onChange={handleTabChange}>
            <TabPane tab={<span className="px-4">All</span>} key="ALL" />
            <TabPane tab={<span className="px-4">Active</span>} key="ACTIVE" />
            <TabPane tab="Inactive" key="INACTIVE" />
          </Tabs>
          <div className="p-4">
            <Search
              size="large"
              placeholder="Enter keyword to search"
              onChange={(e) => onChange(e.target.value)}
              enterButton
            />
          </div>
          <Table
            loading={loading || deleteLoading}
            columns={columns}
            pagination={false}
            dataSource={classesRecord?.records}
            scroll={{ x: 1220 }}
            onRow={(record) => {
              return {
                onClick: () => {
                  history.push(`/classes/view/${record.id}`);
                },
              };
            }}
            locale={{
              emptyText: (
                <div className="flex items-center justify-center text-center">
                  <div>
                    <p className="text-lg">No classes added yet!</p>
                    <img
                      className="ml-16 "
                      src={SearchNotFound}
                      alt="No tests found!"
                      style={{ height: '100px' }}
                    />
                  </div>
                </div>
              ),
            }}
            footer={() => (
              <Row className="mt-2" type="flex" justify="end">
                <Pagination
                  showSizeChanger
                  pageSizeOptions={['10', '25', '50']}
                  onShowSizeChange={(e, p) => {
                    setViewSize(p);
                    setCurrentPage(1);
                    setStartIndex(0);
                  }}
                  current={currentPage}
                  total={classesRecord?.totalCount}
                  showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                  pageSize={viewSize}
                  onChange={(current) => {
                    setStartIndex(viewSize * (current - 1));
                    setCurrentPage(current);
                  }}
                />
              </Row>
            )}
          />
        </div>
      </Page>
    </div>
  );
};

const mapStateToProps = ({ classDetails, loading, settings }) => ({
  classesRecord: classDetails?.allClasses,
  loading: loading?.effects['classDetails/getClass'],
  deleteLoading: loading?.effects['classDetails/deleteClass'],
  primaryColor: settings.primaryColor,
});

export default connect(mapStateToProps)(ClassPage);
