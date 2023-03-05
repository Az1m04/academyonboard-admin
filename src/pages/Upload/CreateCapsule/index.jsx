import React, { useEffect, useState } from 'react';
import { Button, Input, message, Pagination, Popconfirm, Row, Select, Table, Form } from 'antd';
import { Link, connect, history } from 'umi';
import { debounce } from 'lodash';
import Page from '@/components/Page';
import Breadcrumbs from '@/components/BreadCrumbs';
import CheckValidation from '@/components/CheckValidation';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

const { Search } = Input;
const CreateCapsule = ({ dispatch, getCapsule, loading, getCourseContent, deleteLoading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [capsuleSearch, setCapsuleSearch] = useState();
  const [viewSize, setViewSize] = useState(10);

  const [courseIdForFilter, setcourseIdForFilter] = useState();
  const [form] = Form.useForm();

  const DifficuiltyLevel = [
    {
      name: 'Easy',
      value: 'EASY',
    },
    {
      name: 'Intermediate',
      value: 'INTERMEDIATE',
    },
    {
      name: 'Hard',
      value: 'HARD',
    },
  ];
  const getAllCapsules = (start, size, keyword) => {
    dispatch({
      type: 'courses/getCapsule',
      payload: { query: { keyword, startIndex: start, viewSize: size } },
    });
  };
  const action = (value) => {
    setCurrentPage(1);
    getAllCapsules(0, viewSize, value);
    setCapsuleSearch(value);
  };
  const onSearchChange = debounce(action, 600);
  useEffect(() => {
    getAllCapsules(0, 10, '');
    dispatch({
      type: 'courses/getCourseContent',
      payload: { query: { type: 'COURSE', viewSize: 1000 } },
    });
  }, []);
  function handleChangePagination(current, size) {
    setCurrentPage(current);
    getAllCapsules(size * (current - 1), size, capsuleSearch);
  }
  function confirm(e, record) {
    dispatch({
      type: 'courses/deleteCapsule',
      payload: {
        pathParams: { courseId: record?.courseId, capsuleId: record?.capsuleId },
      },
    }).then((res) => {
      if (res?.status === 'ok') {
        message.success('Capsule deleted successfully');
        getAllCapsules(0, 10, '');
      } else {
        message.error('Something went wrong');
      }
    });
  }
  const columns = [
    {
      title: 'Sr.no.',
      dataIndex: 'srno',
      align: 'center',
      render: (_, __, index) => index + 1 + viewSize * (currentPage - 1),
    },
    {
      title: 'Capsule name',
      dataIndex: 'capsuleName',
      key: 'capsuleName',
      align: 'left',
    },
    {
      title: 'Course',
      dataIndex: 'courseName',
      key: 'course',
      align: 'left',
    },
    {
      title: 'Difficulty level',
      dataIndex: 'difficultyLevel',
      key: 'difficultyLevel',
      align: 'left',
    },

    {
      title: 'No. of days',
      dataIndex: 'numOfDays',
      key: 'numOfDays',
      align: 'left',
    },
    {
      title: 'Actions',
      dataIndex: '',
      key: 'Actions',
      align: 'left',
      render: (text, record) => (
        <div className="flex gap-10">
          <a
            className="text-blue-700"
            onClick={(e) => {
              e.stopPropagation();
              history.push(
                `/upload/create-capsule/edit/${record?.courseId}/capsule/${record?.capsuleId}`,
              );
            }}
          >
            <EditOutlined />
          </a>
          {record?.isUsedInTeachingSchedule === false ? (
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Popconfirm
                title="Are you sure to delete this Capsule?"
                onConfirm={(e) => confirm(e, record)}
                okText="Yes"
                cancelText="No"
              >
                <a className="text-red-600" onClick={(e) => e.stopPropagation()}>
                  <DeleteOutlined />
                </a>
              </Popconfirm>
            </div>
          ) : (
            <a
              className="text-red-600"
              onClick={(e) => {
                e.stopPropagation();

                message.error('Can not remove capsule because it is present in teaching schedule');
              }}
            >
              <DeleteOutlined />
            </a>
          )}
        </div>
      ),
    },
  ];
  const getFilterCapsule = (value) => {
    dispatch({
      type: 'courses/getCapsule',
      payload: {
        query: { diffLevel: value, courseId: courseIdForFilter },
      },
    }).then(() => {});
  };

  return (
    <>
      <Page
        title="Create capsule"
        primaryAction={
          <Link to="/upload/create-capsule/new">
            <Button
              type="primary"
              onClick={() =>
                dispatch({
                  type: 'courses/setStates',
                  difficultyLevelsExistingList: null,
                  key: 'difficultyLevelsExistingList',
                })
              }
            >
              Create new Capsule
            </Button>
          </Link>
        }
        breadcrumbs={
          <Breadcrumbs
            path={[
              {
                name: 'Dashboard',
                path: '/dashboard',
              },
              {
                name: 'Capsules',
                path: '#',
              },
            ]}
          />
        }
      >
        <div className="bg-white rounded-md shadow-md mt-10">
          <Form form={form}>
            <div className="flex ">
              <div className="p-4 w-full">
                <Form.Item name="search">
                  <Search
                    size="large"
                    placeholder="Enter keyword to search"
                    onChange={(e) => onSearchChange(e.target.value)}
                  />
                </Form.Item>
              </div>
              <div className="p-4 w-1/2">
                <Form.Item name="course">
                  <Select
                    style={{ width: '100%' }}
                    allowClear
                    placeholder="Course type"
                    size="large"
                    onChange={(value) => {
                      dispatch({
                        type: 'courses/getCapsule',
                        payload: { query: { courseId: value } },
                      });

                      setcourseIdForFilter(value);
                      form.setFieldsValue({
                        diffLevel: undefined,
                      });
                    }}
                  >
                    {getCourseContent?.records?.map((content) => (
                      <Select.Option value={content?.courseId} key={content?.courseId}>
                        {content?.productName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              <div className="p-4 w-1/2">
                <Form.Item name="diffLevel">
                  <Select
                    style={{ width: '100%' }}
                    placeholder="Difficulty level"
                    size="large"
                    allowClear
                    onChange={(val) => {
                      getFilterCapsule(val);
                    }}
                  >
                    {DifficuiltyLevel?.map((item) => (
                      <Select.Option value={item?.value} key={item?.value}>
                        {item?.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </div>
            <Table
              columns={columns}
              dataSource={getCapsule?.records}
              pagination={false}
              scroll={{ x: 1000 }}
              loading={loading || deleteLoading}
              rowClassName="cursor-pointer"
              onRow={(record) => {
                return {
                  onClick: () => {
                    history.push(
                      `/upload/create-capsule/view/${record?.courseId}/capsule/${record?.capsuleId}`,
                    );
                  },
                };
              }}
              footer={() => (
                <CheckValidation show={getCapsule?.totalCount > 5}>
                  <Row className="mt-2" type="flex" justify="end">
                    <Pagination
                      key={`page-${currentPage}`}
                      showSizeChanger
                      pageSizeOptions={['10', '25', '50', '100']}
                      onShowSizeChange={(e, p) => {
                        setViewSize(p);
                        setCurrentPage(1);
                        getAllCapsules(0, p, capsuleSearch);
                      }}
                      defaultCurrent={1}
                      current={currentPage}
                      pageSize={viewSize}
                      total={getCapsule?.totalCount}
                      showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                      onChange={handleChangePagination}
                    />
                  </Row>
                </CheckValidation>
              )}
            />
          </Form>
        </div>
      </Page>
    </>
  );
};

export default connect(({ courses, loading }) => ({
  getCapsule: courses?.getCapsule,
  getCourseContent: courses?.getCourseContent,
  loading: loading?.effects['courses/getCapsule'],
  deleteLoading: loading?.effects['courses/deleteCapsule'],
}))(CreateCapsule);
