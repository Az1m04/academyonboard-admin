import { Input, Pagination, Row, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import SearchNotFound from '@/assets/icons/empty-search-contact.png';
import { connect } from 'umi';
import { debounce } from 'lodash';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { Search } = Input;

const AwaitingVendors = ({ dispatch, pendingVendors }) => {
  const [keyword, setKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [startIndex, setStartIndex] = useState(0);
  const [viewSize, setViewSize] = useState(10);

  useEffect(() => {
    dispatch({
      type: 'vendor/awaitingVendors',
    });
  }, [keyword, startIndex, viewSize, dispatch]);

  const awaitingColumns = [
    {
      title: 'Sr. No.',
      dataIndex: 'srno',
      render: (_, __, index) => index + 1 + viewSize * (currentPage - 1),
    },
    {
      title: 'Name',
      dataIndex: 'toName',
      render: (name, record) => (
        <div className="flex items-center">
          <div className="">
            <div className="font-medium truncate capitalize" title={record?.toName}>
              {record?.toName}
            </div>
            <div className="">Requested on {dayjs(record?.createdStamp).fromNow()}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Invited on',
      dataIndex: 'lastInviteDate',
      render: (data) => <p>{dayjs(data).format('MMMM D, YYYY')}</p>,
    },
    {
      title: ' Email',
      dataIndex: 'emailAddress',
      render: (data) => <p>{data}</p>,
    },
    {
      title: ' Invited by',
      dataIndex: 'partyIdFrom',
      render: (_, record) => (
        <div className="">
          <p>
            {record?.partyIdFrom?.firstName} {record?.partyIdFrom?.lastName}
          </p>
        </div>
      ),
    },
  ];

  function handleChangePagination(current) {
    setStartIndex(viewSize * (current - 1));
    setCurrentPage(current);
  }

  const action = (val) => setKeyword(val);
  const debounceSearch = debounce(action, 400);

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
          columns={awaitingColumns}
          dataSource={pendingVendors?.searchResults}
          rowKey={(record) => record?.id}
          locale={{
            emptyText: (
              <div className="text-center flex justify-center items-center">
                <div>
                  <p className="text-lg">No staff member invited yet!</p>
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
  );
};

export default connect(({ vendor }) => ({
  pendingVendors: vendor.pendingVendors,
}))(AwaitingVendors);
