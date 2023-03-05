import React, { useEffect, useState } from 'react';
import SearchNotFound from '@/assets/icons/empty-search-contact.png';
import { connect } from 'umi';
import { debounce } from 'lodash';
import { Button, Input, Pagination, Row, Table } from 'antd';

const { Search } = Input;

const ActiveInactiveVendors = ({ dispatch, vendors, location }) => {
  const [keyword, setKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [startIndex, setStartIndex] = useState(0);
  const [viewSize, setViewSize] = useState(10);

  function handleChangePagination(current) {
    setStartIndex(viewSize * (current - 1));
    setCurrentPage(current);
  }

  useEffect(() => {
    dispatch({
      type: 'vendor/getVendors',
    });
  }, [keyword, startIndex, viewSize, dispatch]);

  const action = (val) => setKeyword(val);
  const debounceSearch = debounce(action, 400);

  const columns = [
    {
      title: 'Sr. No.',
      dataIndex: 'srno',
      render: (_, __, index) => index + 1 + viewSize * (currentPage - 1),
    },
    {
      title: 'Name',
      dataIndex: 'displayName',
      render: (name) => (
        <div className="flex items-center">
          <div className="ml-2 w-48">
            <div className="font-medium truncate capitalize" title={name}>
              {name}
            </div>
          </div>
        </div>
      ),
    },

    {
      title: ' Email',
      dataIndex: 'email',
      render: (data) => <p>{data}</p>,
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      render: (_, record) => (
        <div className="">
          <p>
            {record?.phone?.countryCode} {record?.phone?.areaCode} {record?.phone?.phone}
          </p>
        </div>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: () => (
        <div>
          <Button size="small" type="primary">
            {location?.pathname === '/vendors/active' ? 'Disable' : 'Enable'}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="w-full p-4">
        <Search
          size="large"
          placeholder="Enter keyword here to search vendors..."
          onInput={(value) => debounceSearch(value.target.value)}
        />
      </div>

      <div className="w-full">
        <Table
          className="no-shadow zcp-fixed-w-table"
          rowClassName="cursor-pointer"
          pagination={false}
          columns={columns}
          dataSource={location?.pathname === '/vendors/active' ? vendors?.suppliers : []}
          rowKey={(record) => record?.id}
          locale={{
            emptyText: (
              <div className="text-center flex justify-center items-center">
                <div>
                  <p className="text-lg">
                    {location?.pathname === '/vendors/active'
                      ? 'No active vendor found'
                      : 'No inactive vendor found'}
                  </p>
                  <img
                    className=" ml-16"
                    src={SearchNotFound}
                    alt="No vendor found!"
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
                total={location?.pathname === '/vendors/active' ? vendors?.totalCount : 0}
                showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                onChange={handleChangePagination}
              />
            </Row>
          )}
        />
      </div>
    </div>
  );
};

export default connect(({ vendor }) => ({
  vendors: vendor.vendors,
}))(ActiveInactiveVendors);
