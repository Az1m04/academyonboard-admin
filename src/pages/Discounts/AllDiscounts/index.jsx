import Breadcrumbs from '@/components/BreadCrumbs';
import Page from '@/components/Page';
import React, { useState } from 'react';
import { connect } from 'umi';
import { PlusSquareOutlined } from '@ant-design/icons';
import { Button, Input, Pagination, Row, Table } from 'antd';
import ChooseDiscountModal from '../CreateDiscount/ChooseDiscountModal';
import { debounce } from 'lodash-es';
import relativeTime from 'dayjs/plugin/relativeTime';
import SearchNotFound from '@/assets/icons/empty-search-contact.png';
import dayjs from 'dayjs';

const { Search } = Input;

dayjs.extend(relativeTime);

const AllDiscounts = () => {
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  // eslint-disable-next-line no-unused-vars
  const [startIndex, setStartIndex] = useState(0);
  const [viewSize, setViewSize] = useState(10);
  // eslint-disable-next-line no-unused-vars
  const [keyword, setKeyword] = useState('');

  const columns = [
    {
      title: '',
      dataIndex: 'srno',
      width: '20px',
      render: (_, __, index) => index + 1 + viewSize * (currentPage - 1),
    },
    {
      title: 'Discount code',
      dataIndex: 'name',
      render: (name, record) => (
        <div className="flex items-center">
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
      title: 'Type',
      dataIndex: 'description',
      render: (name) => <div>{name}</div>,
    },
    {
      title: 'Value',
      dataIndex: 'description',
      render: (name) => <div>{name}</div>,
    },
    {
      title: 'Eligibility',
      dataIndex: 'description',
      render: (name) => <div>{name}</div>,
    },
    {
      title: 'Applies to',
      dataIndex: 'description',
      render: (name) => <div>{name}</div>,
    },
  ];

  function handleChangePagination(current) {
    setStartIndex(viewSize * (current - 1));
    setCurrentPage(current);
  }

  const action = (value) => {
    setKeyword(value);
  };

  const debounceSearch = debounce(action, 400);

  return (
    <div className="container mx-auto mt-4">
      <Page
        title="Discounts"
        PrevNextNeeded="N"
        breadcrumbs={
          <Breadcrumbs
            path={[
              {
                name: 'Dashboard',
                path: '/dashboard',
              },
              {
                name: 'Discounts',
                path: '/discounts',
              },
            ]}
          />
        }
        primaryAction={
          <Button onClick={() => setShowModal(true)} icon={<PlusSquareOutlined />} type="primary">
            Create discount
          </Button>
        }
      >
        <div className="bg-white shadow rounded">
          <div className="w-full p-4">
            <Search
              bordered
              size="large"
              placeholder="Enter keyword here to search discounts..."
              onInput={(value) => debounceSearch(value.target.value)}
            />
          </div>

          <div className="w-full">
            <Table
              className="no-shadow zcp-fixed-w-table"
              rowClassName="cursor-pointer"
              pagination={false}
              columns={columns}
              dataSource={[]}
              rowKey={(record) => record?.productId}
              // loading={loading}
              // onRow={(record) => ({
              //   onClick: () => {
              //     history.push(`/collections/${record?.productId}`);
              //   },
              // })}
              locale={{
                emptyText: (
                  <div className="text-center flex justify-center items-center">
                    <div>
                      <p className="text-lg">No discounts found!</p>
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
                    total={0}
                    showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                    onChange={handleChangePagination}
                  />
                </Row>
              )}
            />
          </div>
        </div>
        <ChooseDiscountModal visible={showModal} setVisible={setShowModal} />
      </Page>
    </div>
  );
};

export default connect(({ staff }) => ({
  staffList: staff.staffList,
}))(AllDiscounts);
