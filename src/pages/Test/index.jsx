import React, { useEffect, useState } from 'react';
import { Button, Input, Table, Row, Pagination, Popconfirm, message, Tooltip } from 'antd';
import { Link, connect, history } from 'umi';
import Page from '@/components/Page';
import Breadcrumbs from '@/components/BreadCrumbs';
import { DeleteFilled, EyeTwoTone, PlusSquareOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';
import SearchNotFound from '@/assets/icons/empty-search-contact.png';

const { Search } = Input;

const Test = ({ dispatch, allTests, loading, deleteTestLoading }) => {
  const [keyword, setKeyword] = useState('');
  const [startIndex, setStartIndex] = useState(0);
  const [viewSize, setViewSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const action = (value) => {
    setKeyword(value);
    setStartIndex(0);
    if (!value) {
      setCurrentPage(1);
    }
  };

  const onTestSearch = debounce(action, 600);

  useEffect(() => {
    dispatch({
      type: 'courses/getTests',
      payload: {
        query: { keyword, startIndex, viewSize },
      },
    });
  }, [keyword, startIndex, viewSize, dispatch]);

  const columns = [
    {
      title: 'Sr.no.',
      dataIndex: 'srno',
      align: 'center',
      width: 50,
      render: (_, __, index) => index + 1 + viewSize * (currentPage - 1),
    },
    {
      title: <div className="">Name</div>,
      dataIndex: 'name',
      key: 'name',
      render: (data) => <div className="font-normal Capitalize">{data}</div>,
    },
    {
      title: <div className="">Type</div>,
      dataIndex: 'testType',
      key: 'testType',
      render: (data) => <div className="font-normal Capitalize">{data}</div>,
    },
    {
      title: <div className="">Difficulty level</div>,
      dataIndex: 'difficultyLevel',
      key: 'difficultyLevel',
      render: (data) => <div className="font-normal Capitalize">{data}</div>,
    },
    {
      title: <div className="">Course</div>,
      dataIndex: 'course',
      key: 'course',
      render: (_, record) => (
        <div className="font-normal Capitalize">{record?.course?.name || '--'}</div>
      ),
    },
    {
      title: <div className="">Category</div>,
      dataIndex: 'course',
      key: 'category',
      render: (data) => <div className="font-normal Capitalize">{data?.categoryName || '--'}</div>,
    },
    {
      title: <div className="">Total marks</div>,
      dataIndex: 'totalMarks',
      key: 'totalMarks',
      render: (data) => <div className="font-normal Capitalize">{data}</div>,
    },
    {
      title: <div className="">Action</div>,
      dataIndex: '',
      key: '',
      render: (record) => (
        <div className=" flex gap-5 items-center">
          <Tooltip title="View test">
            <span
              className=" cursor-pointer"
              onClick={() => history.push(`/tests/${record.id}/details`)}
            >
              <EyeTwoTone twoToneColor="#005be7" />
            </span>
          </Tooltip>
          <Popconfirm
            title="Are you sure you want to delete this test?"
            onConfirm={() => {
              dispatch({
                type: 'courses/deleteTest',
                payload: {
                  pathParams: {
                    testId: record?.id,
                  },
                },
              }).then((res) => {
                if (res?.responseMessage === 'success') {
                  message.success('Test deleted successfully');
                  dispatch({
                    type: 'courses/getTests',
                    payload: {
                      query: { keyword, startIndex, viewSize },
                    },
                  });
                }
              });
            }}
            okText="Yes"
            cancelText="No"
          >
            <span className=" cursor-pointer text-red-500 hover:text-red-700">
              <DeleteFilled />
            </span>
          </Popconfirm>
        </div>
      ),
    },
  ];
  return (
    <div className="container mx-auto">
      <Page
        title="Tests"
        PrevNextNeeded="N"
        breadcrumbs={
          <Breadcrumbs
            path={[
              {
                name: 'Dashboard',
                path: '/dashboard',
              },
              {
                name: 'All tests',
                path: '/tests',
              },
            ]}
          />
        }
        primaryAction={
          <Link
            to={{
              pathname: '/tests/new',
            }}
          >
            <Button
              style={{ display: 'flex', alignItems: 'center' }}
              icon={<PlusSquareOutlined className="" />}
              type="primary"
              id="open-invite-staff"
              onClick={() =>
                dispatch({
                  type: 'courses/setStates',
                  payload: {
                    freeTeachersList: null,
                  },
                  key: 'singleCourseDetail',
                })
              }
            >
              Add Test
            </Button>
          </Link>
        }
      >
        <div className="bg-white rounded shadow ">
          <div className="p-4">
            <Search
              size="large"
              placeholder="Enter keyword to search"
              onChange={(e) => onTestSearch(e.target.value)}
              style={{ alignSelf: 'flex-end' }}
            />
          </div>

          <Table
            loading={Boolean(loading) || Boolean(deleteTestLoading)}
            columns={columns}
            dataSource={allTests?.records}
            pagination={false}
            scroll={{ x: 1200 }}
            // onRow={(record) => {
            //   return {
            //     onClick: () => {
            //       history.push(`/test/${record.id}/details`);
            //     },
            //   };
            // }}
            locale={{
              emptyText: (
                <div className="flex items-center justify-center text-center">
                  <div>
                    <p className="text-lg">No tests added yet!</p>
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
                  total={allTests?.totalCount}
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

const mapStateToProps = (state) => ({
  allTests: state?.courses?.allTests,
  loading: state?.loading?.effects['courses/getTests'],
  deleteTestLoading: state?.loading?.effects['courses/deleteTest'],
});

export default connect(mapStateToProps)(Test);
