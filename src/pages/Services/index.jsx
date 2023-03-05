/* eslint-disable react-hooks/exhaustive-deps */
import Breadcrumbs from '@/components/BreadCrumbs';
import Page from '@/components/Page';
import React, { useEffect, useState } from 'react';
import { connect, Link } from 'umi';
import Icon, {
  PlusSquareOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Col, Dropdown, Input, Pagination, Row, Table, Tabs } from 'antd';
import SearchNotFound from '@/assets/icons/empty-search-contact.png';
import NoImage from '@/assets/noImage.png';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { getInitials } from '@/utils/common';
import { debounce } from 'lodash';
import AppIcons from '@/utils/AppIcons';

const { TabPane } = Tabs;
const { Search } = Input;
dayjs.extend(relativeTime);

const Services = ({ services, dispatch, match, history, location, loading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [startIndex, setStartIndex] = useState(0);
  const [viewSize, setViewSize] = useState(10);
  const [keyword, setKeyword] = useState('');
  const [sortBy, setSortBy] = useState({
    label: 'Sort By',
    id: '',
  });

  const getTabKey = () => {
    const url = match.path === '/' ? '' : match.path;
    const tabKey = location.pathname.replace(`${url}/`, '');
    if (tabKey && tabKey !== '/') {
      switch (tabKey) {
        case '/services/all':
          return 'ALL';
        case '/services/active':
          return 'ACTIVE';
        case '/services/draft':
          return 'DRAFT';
        case '/services/inactive':
          return 'INACTIVE';
        default:
          return 'ALL';
      }
    }
    return 'ALL';
  };

  const renderStatus = () => {
    switch (getTabKey()) {
      case 'ALL':
        return '';
      case 'ACTIVE':
        return 'PROD_ACTIVE';
      case 'DRAFT':
        return 'PROD_DRAFT';
      case 'INACTIVE':
        return 'PROD_INACTIVE';

      default:
        return '';
    }
  };

  const getServices = () => {
    dispatch({
      type: 'service/getServices',
      payload: {
        query: {
          productType: 'SERVICE_PRODUCT',
          productStatus: renderStatus(),
          keyword,
          viewSize,
          startIndex,
          sortBy: sortBy?.id,
        },
      },
    });
  };

  useEffect(() => {
    getServices();
  }, [keyword, viewSize, startIndex, sortBy]);

  const renderBgColor = (name) => {
    if (name === 'Active') {
      return 'bg-green-200';
    }
    if (name === 'Draft') {
      return 'bg-pink-200';
    }
    return 'bg-red-200';
  };

  const columns = [
    {
      title: '',
      dataIndex: 'srno',
      width: '20px',
      render: (_, __, index) => index + 1 + viewSize * (currentPage - 1),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      render: (name, record) => (
        <div className="flex items-center">
          <Avatar
            size={60}
            shape="square"
            src={
              record?.productContent?.length > 0 ? record?.productContent[0]?.downloadUrl : NoImage
            }
            className="bg-blue-900 w-8 uppercase"
          >
            {name && getInitials(name)}
          </Avatar>
          <div className="ml-2 w-48">
            <div className="font-medium truncate capitalize" title={record?.name}>
              {record?.name}
            </div>
            <div className="">Created {dayjs(record?.createdAt).fromNow()}</div>
          </div>
        </div>
      ),
    },

    {
      title: 'Status',
      dataIndex: 'status',
      align: 'center',
      render: (data) => (
        <div className=" text-center">
          <span className={`w-16 pl-3 pr-3 pt-1 pb-1 rounded-full ${renderBgColor(data)}`}>
            {' '}
            {data}
          </span>
        </div>
      ),
    },

    {
      title: 'Mode',
      dataIndex: 'serviceMode',
      align: 'center',
      render: (data) => <p>{data || '--'}</p>,
    },
    {
      title: 'Category',
      dataIndex: 'categoryName',
      align: 'center',
      render: (data) => <p>{data || '--'}</p>,
    },
  ];

  function handleChangePagination(current) {
    setStartIndex(viewSize * (current - 1));
    setCurrentPage(current);
  }

  const handleTabChange = (key) => {
    const url = match.url === '/' ? '' : match.url.replace(/[^/]+$/, '');
    switch (key) {
      case 'ALL':
        history.push(`${url}all`);
        break;
      case 'DRAFT':
        history.push(`${url}draft`);
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

  const action = (value) => {
    setKeyword(value);
  };

  const debounceSearch = debounce(action, 400);

  const sortByList = [
    {
      label: 'Product title (A-Z)',
      id: 'productName',
    },
    {
      label: 'Product title (Z-A)',
      id: '-productName',
    },
  ];

  const menu = (
    <div className="bg-white shadow">
      {sortByList?.map((item) => (
        <div
          key={item?.id}
          className={`p-2 border-b hover:bg-gray-100 cursor-pointer font-medium ${
            sortBy?.id === item?.id ? 'bg-gray-200' : ''
          }`}
          onClick={() => {
            setSortBy(item);
          }}
        >
          {item?.label}
        </div>
      ))}
      <div className="p-2">
        <span
          className="text-blue-600 cursor-pointer font-medium"
          onClick={() => {
            setSortBy({
              label: 'Sort By',
              id: '',
            });
          }}
        >
          Clear
        </span>
      </div>
    </div>
  );

  const renderIcon = () => {
    if (sortBy.id === 'productName') {
      return <SortAscendingOutlined />;
    }
    if (sortBy.id === '-productName') {
      return <SortDescendingOutlined />;
    }
    return <Icon component={AppIcons.SortDown} />;
  };

  return (
    <div className="container mx-auto mt-4">
      <Page
        title="Services"
        PrevNextNeeded="N"
        breadcrumbs={
          <Breadcrumbs
            path={[
              {
                name: 'Dashboard',
                path: '/dashboard',
              },
              {
                name: 'Services',
                path: '/services',
              },
            ]}
          />
        }
        primaryAction={
          <Link
            to={{
              pathname: '/services/new',
            }}
          >
            <Button icon={<PlusSquareOutlined />} type="primary" id="open-new-vendor">
              Add new service
            </Button>
          </Link>
        }
      >
        <div className="bg-white shadow rounded">
          <Tabs
            defaultActiveKey="ALL"
            className=""
            activeKey={getTabKey()}
            onChange={handleTabChange}
          >
            <TabPane tab={<span className="px-4">All</span>} key="ALL" />
            <TabPane tab={<span className="px-4">Active</span>} key="ACTIVE" />
            <TabPane tab={<span className="px-4">Draft</span>} key="DRAFT" />
            <TabPane tab={<span className="px-4">Inactive</span>} key="INACTIVE" />
          </Tabs>

          <div className="w-full p-4">
            <Row gutter={24}>
              <Col
                style={{
                  paddingRight: 0,
                }}
                xs={24}
                sm={24}
                md={18}
                lg={20}
                xl={20}
                xxl={20}
              >
                <Search
                  bordered
                  size="large"
                  placeholder="Enter keyword here to search products..."
                  onInput={(value) => debounceSearch(value.target.value)}
                />
              </Col>
              <Col
                style={{
                  padding: 0,
                }}
                xs={24}
                sm={24}
                md={6}
                lg={4}
                xl={4}
                xxl={4}
              >
                <Dropdown trigger={['click']} overlay={menu} placement="bottomCenter">
                  <div
                    style={{
                      padding: 7,
                    }}
                    className="text-center rounded-md cursor-pointer font-medium border "
                  >
                    {sortBy?.label} {renderIcon()}
                  </div>
                </Dropdown>
              </Col>
            </Row>
          </div>

          <div className="w-full">
            <Table
              className="no-shadow zcp-fixed-w-table"
              rowClassName="cursor-pointer"
              pagination={false}
              columns={columns}
              dataSource={services?.records}
              rowKey={(record) => record?.productId}
              loading={loading}
              onRow={(record) => ({
                onClick: () => {
                  history.push(`/services/${record?.productId}`);
                },
              })}
              locale={{
                emptyText: (
                  <div className="text-center flex justify-center items-center">
                    <div>
                      <p className="text-lg">No services found!</p>
                      <img
                        className=" ml-16"
                        src={SearchNotFound}
                        alt="No product found!"
                        style={{ height: '100px' }}
                      />
                    </div>
                  </div>
                ),
              }}
              footer={() => (
                <Row className="mt-2" type="flex" justify="end">
                  <Pagination
                    key={`page-${currentPage}`}
                    showSizeChanger
                    pageSizeOptions={['10', '25', '50', '100']}
                    onShowSizeChange={(e, p) => {
                      setViewSize(p);
                      setCurrentPage(1);
                      setStartIndex(0);
                    }}
                    defaultCurrent={1}
                    current={currentPage}
                    pageSize={viewSize}
                    total={services?.totalCount}
                    showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                    onChange={handleChangePagination}
                  />
                </Row>
              )}
            />
          </div>
        </div>
      </Page>
    </div>
  );
};

export default connect(({ service, loading }) => ({
  services: service.services,
  loading: loading.effects['service/getServices'],
}))(Services);
