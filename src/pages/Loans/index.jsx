import Breadcrumbs from '@/components/BreadCrumbs';
import Page from '@/components/Page';
import { getInitials } from '@/utils/common';
import { Avatar, Input, Pagination, Row, Table, Tabs } from 'antd';
import React, { useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import SearchNotFound from '@/assets/icons/empty-search-contact.png';

dayjs.extend(relativeTime);

const { TabPane } = Tabs;
const { Search } = Input;

const Loans = ({ history, match, location }) => {
  //   const [keyword, setKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  // eslint-disable-next-line no-unused-vars
  const [startIndex, setStartIndex] = useState(0);
  const [viewSize, setViewSize] = useState(10);

  //   const action = (value) => {
  //     setKeyword(value);
  //   };

  //   const debounceSearch = debounce(action, 400);

  function handleChangePagination(current) {
    setStartIndex(viewSize * (current - 1));
    setCurrentPage(current);
  }

  const columns = [
    {
      title: 'Sr. No.',
      dataIndex: 'srno',
      render: (_, __, index) => index + 1 + viewSize * (currentPage - 1),
    },

    {
      title: 'Loan id',
      dataIndex: 'loadid',
      render: (data) => <p>{data}</p>,
    },
    {
      title: 'Loan owner',
      dataIndex: 'to_name',
      render: (name, record) => (
        <div className="flex items-center">
          <Avatar className="bg-blue-800 w-8 uppercase" style={{ backgroundColor: '#1c9cff' }}>
            {name && getInitials(name)}
          </Avatar>
          <div className="ml-2 w-48">
            <div className="font-medium truncate capitalize" title={record?.to_name}>
              {record?.to_name}
            </div>
            <div className="">Requested on {dayjs(record.created_at).fromNow()}</div>
          </div>
        </div>
      ),
    },

    {
      title: 'Bank name',
      dataIndex: 'loadid',
      render: (data) => <p>{data}</p>,
    },

    {
      title: 'Status',
      dataIndex: 'status',
      render: (data) => (
        <div className="">
          <p>{data?.name}</p>
        </div>
      ),
    },
    {
      title: 'KYC status',
      dataIndex: 'last_invited_on',
      render: (data) => <p>{dayjs(data).format('MMMM D, YYYY')}</p>,
    },
  ];

  const handleTabChange = (key) => {
    const url = match.url === '/' ? '' : match.url.replace(/[^/]+$/, '');
    switch (key) {
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

  const getTabKey = () => {
    const url = match.path === '/' ? '' : match.path;
    const tabKey = location.pathname.replace(`${url}/`, '');
    if (tabKey && tabKey !== '/') {
      switch (tabKey) {
        case '/loans/active':
          return 'ACTIVE';
        case '/loans/inactive':
          return 'INACTIVE';
        default:
          return 'ACTIVE';
      }
    }
    return 'ACTIVE';
  };

  return (
    <div className="container mx-auto">
      <Page
        title="Loan applications"
        breadcrumbs={
          <Breadcrumbs
            path={[
              {
                name: 'Dashboard',
                path: '/dashboard',
              },
              {
                name: 'Loan applications',
                path: '/loans',
              },
            ]}
          />
        }
      >
        <div className="bg-white shadow rounded">
          <Tabs
            defaultActiveKey="ACTIVE"
            className=""
            activeKey={getTabKey()}
            onChange={handleTabChange}
          >
            <TabPane tab={<span className="px-4">Active</span>} key="ACTIVE" />
            <TabPane tab={<span className="px-4">Inactive</span>} key="INACTIVE" />
          </Tabs>

          <div className="w-full p-4">
            <Search
              size="large"
              placeholder="Enter keyword here to search loan applications..."
              //   onInput={(value) => debounceSearch(value.target.value)}
            />
          </div>

          <div className="w-full">
            <Table
              className="no-shadow zcp-fixed-w-table"
              rowClassName="cursor-pointer"
              pagination={false}
              columns={columns}
              dataSource={[]}
              rowKey={(record) => record?.id}
              //   loading={staffLoading}
              //   onRow={(record) => ({
              //     onClick: () => {
              //       history.push(`/loans/${record?.id}`);
              //     },
              //   })}
              locale={{
                emptyText: (
                  <div className="text-center flex justify-center items-center">
                    <div>
                      <p className="text-lg">No loan application received yet!</p>
                      <img
                        className=" ml-16"
                        src={SearchNotFound}
                        alt="No staff member found!"
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
                    total={0}
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

export default Loans;
