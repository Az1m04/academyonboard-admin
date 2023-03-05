import Breadcrumbs from '@/components/BreadCrumbs';
import Page from '@/components/Page';
import React, { useEffect, useState } from 'react';
import { connect, Link } from 'umi';
import { PlusSquareOutlined } from '@ant-design/icons';
import { Avatar, Button, Input, Pagination, Row, Table } from 'antd';
import SearchNotFound from '@/assets/icons/empty-search-contact.png';
import { debounce } from 'lodash-es';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { getInitials } from '@/utils/common';
import NoImage from '@/assets/noImage.png';

const { Search } = Input;

dayjs.extend(relativeTime);

const AllCollections = ({ dispatch, collections, loading, history }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [startIndex, setStartIndex] = useState(0);
  const [viewSize, setViewSize] = useState(10);
  const [keyword, setKeyword] = useState('');

  const getproductCategories = () => {
    dispatch({
      type: 'product/getCollections',
      payload: {
        query: {
          productCategoryTypeId: ['PRODUCT_COLLECTION', 'SERVICE_COLLECTION'],
          keyword,
          viewSize,
          startIndex,
        },
      },
    });
  };

  useEffect(() => {
    getproductCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewSize, startIndex, keyword]);

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
              record?.categoryContent?.length > 0
                ? record?.categoryContent[0]?.downloadUrl
                : NoImage
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
      title: 'Description',
      dataIndex: 'description',
      align: 'center',
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
        title="Collections"
        PrevNextNeeded="N"
        breadcrumbs={
          <Breadcrumbs
            path={[
              {
                name: 'Dashboard',
                path: '/dashboard',
              },
              {
                name: 'Collections',
                path: '/collections',
              },
            ]}
          />
        }
        primaryAction={
          <Link
            to={{
              pathname: '/collections/new',
            }}
          >
            <Button icon={<PlusSquareOutlined />} type="primary" id="open-new-vendor">
              Create collection
            </Button>
          </Link>
        }
      >
        <div className="bg-white shadow rounded">
          <div className="w-full p-4">
            <Search
              bordered
              size="large"
              placeholder="Enter keyword here to search collections..."
              onInput={(value) => debounceSearch(value.target.value)}
            />
          </div>

          <div className="w-full">
            <Table
              className="no-shadow zcp-fixed-w-table"
              rowClassName="cursor-pointer"
              pagination={false}
              columns={columns}
              dataSource={collections?.productCategories}
              rowKey={(record) => record?.id}
              loading={loading}
              onRow={(record) => ({
                onClick: () => {
                  history.push(`/collections/${record?.id}`);
                },
              })}
              locale={{
                emptyText: (
                  <div className="text-center flex justify-center items-center">
                    <div>
                      <p className="text-lg">No collections found!</p>
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
                    total={collections?.totalCount}
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

export default connect(({ product, loading }) => ({
  collections: product.collections,
  loading: loading.effects['product/getCollections'],
}))(AllCollections);
