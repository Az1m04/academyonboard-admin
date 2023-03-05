import React, { useEffect, useState } from 'react';
import {
  Table,
  Input,
  Pagination,
  Row,
  Select,
  Form,
  Tooltip,
  Col,
  Popconfirm,
  message,
} from 'antd';
import { connect, history } from 'umi';
import { debounce } from 'lodash';
import CheckValidation from '@/components/CheckValidation';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

const { Search } = Input;
const { Option } = Select;

const CoursesData = ({
  dispatch,
  loading,
  getCoursesDetail,
  getCourseDetailSingle,
  getCoursesDetailForModule,
}) => {
  const [courseSearch, setCourseSearch] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [coursesId, setCoursesId] = useState();
  const [modulesId, setModulesId] = useState();
  const [form2] = Form.useForm();
  const difficuiltyLevel = [
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

  const [viewSize, setViewSize] = useState(10);
  const getMultiCourse = (start, size, keyword) =>
    dispatch({
      type: 'courses/getCourseDetailSingle',
      payload: {
        query: { keyword, startIndex: start, viewSize: size },
      },
    }).catch(() => {});

  const action = (value) => {
    setCurrentPage(1);
    getMultiCourse(0, viewSize, value);
    setCourseSearch(value);
  };

  const onSearchChange = debounce(action, 600);

  useEffect(() => {
    getMultiCourse(0, 10, '');
  }, []);
  useEffect(() => {
    dispatch({
      type: 'courses/getCoursesDetail',
      payload: {
        query: { viewSize: 1000, type: 'COURSE' },
      },
    });
  }, [dispatch]);

  const deleteInfo = () => {
    message.info(' Course has been deleted');
  };
  const confirmDelete = (record) => {
    dispatch({
      type: 'courses/deleteuploadCoursedetail',
      payload: {
        pathParams: { courseId: record?.courseId, moduleId: record?.moduleId },
      },
    }).then(() => {
      deleteInfo();
      getMultiCourse(0, 10, '');
    });
  };
  const getCourseDetailsForFilter = (value) => {
    let data = {};
    if (coursesId && modulesId) {
      data = { courseId: coursesId, moduleId: modulesId };
    } else {
      data = { courseId: coursesId };
    }
    dispatch({
      type: 'courses/getCourseDetailSingle',
      payload: {
        query: { diffLevel: value, courseId: data?.courseId, moduleId: data?.moduleId },
      },
    }).then(() => {
      setModulesId('');
    });
  };
  const columns = [
    {
      title: 'Sr.no.',
      dataIndex: 'srno',
      align: 'center',
      width: '10PX',
      render: (_, __, index) => index + 1 + viewSize * (currentPage - 1),
    },
    {
      title: <div className="">Course</div>,
      dataIndex: 'productName',
      width: '50px',
      key: 'displayName',
      render: (data) => <div className="font-normal text-sm w-40 Capitalize "> {data}</div>,
    },
    {
      title: <div className="">Modules</div>,
      dataIndex: 'moduleName',
      width: '50px',
      key: 'categoryName',
      render: (data) => <div className="font-normal text-sm w-36 Capitalize">{data || '--'}</div>,
    },
    {
      title: <div className="">Difficult level</div>,
      dataIndex: 'difficultyLevel',
      width: '50px',
      key: 'categoryName',
      render: (data) => <div className="font-normal text-sm w-28 Capitalize">{data || '--'}</div>,
    },

    {
      title: <div className="">Action</div>,
      dataIndex: 'id',
      width: '50px',
      key: 'id',
      render: (data, record) => (
        <div className="flex ">
          <Tooltip title="Edit Course">
            <p
              onClick={(e) => {
                e.stopPropagation();
                history.push(
                  `/upload/course-content/edit/${record?.courseId}/module/${record?.moduleId}/assoc/${record?.assocId}`,
                );
              }}
              className="font-normal Capitalize cursor-pointer text-blue-600"
            >
              <EditOutlined />
            </p>
          </Tooltip>
          {/* <Tooltip title="Delete Course"> */}
          <div onClick={(ev) => ev.stopPropagation()}>
            <Popconfirm
              title="Are you sure to delete this course?"
              onConfirm={(e) => {
                e.stopPropagation();
                if (record?.isCapsuleExist === true) {
                  message.warn(
                    'You cannot delete this course content Because its capsule has been created',
                  );
                } else {
                  confirmDelete(record);
                }
              }}
              okText="Yes"
              cancelText="No"
            >
              <p
                onClick={(e) => e.stopPropagation()}
                className="font-noraml Capitalize cursor-pointer text-red-700 ml-4"
              >
                <DeleteOutlined />
              </p>
            </Popconfirm>
          </div>
          {/* </Tooltip> */}
        </div>
      ),
    },
  ];
  function handleChangePagination(current, size) {
    setCurrentPage(current);
    getMultiCourse(size * (current - 1), size, courseSearch);
  }

  return (
    <>
      <Form form={form2}>
        <div className="bg-white rounded shadow ">
          <Row gutter={16}>
            <Col xl={6} lg={10} md={12} sm={24} xs={24}>
              <div className="px-4 pt-5">
                <Form.Item name="search">
                  <Search
                    style={{ borderRadius: '5px' }}
                    size="large"
                    placeholder="Enter keyword to search"
                    onChange={(e) => onSearchChange(e.target.value)}
                  />
                </Form.Item>
              </div>
            </Col>
            <Col span={4} xl={6} lg={10} md={12} sm={24} xs={24}>
              <div className="px-4 pt-5">
                <Form.Item name="course">
                  <Select
                    placeholder="Select course"
                    size="large"
                    style={{ borderRadius: '5px' }}
                    onSelect={(value) => {
                      setCoursesId(value);
                      dispatch({
                        type: 'courses/getCourseDetailSingle',
                        payload: {
                          query: { courseId: value },
                        },
                      }).then(() => {
                        dispatch({
                          type: 'courses/getCoursesDetailForModule',
                          payload: {
                            query: { courseId: value },
                          },
                        });
                      });
                      form2.setFieldsValue({
                        module: undefined,
                      });
                      form2.setFieldsValue({
                        difficuiltyLevel: undefined,
                      });
                    }}
                  >
                    {getCoursesDetail?.records?.map((items) => (
                      <Option value={items?.courseId} key={items?.courseId}>
                        {items?.productName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </Col>
            <Col span={4} xl={6} lg={10} md={12} sm={24} xs={24}>
              <div className="px-4 pt-5 ">
                <Form.Item name="module">
                  <Select
                    style={{ borderRadius: '5px' }}
                    className="rounded-md"
                    placeholder="Select module"
                    size="large"
                    onChange={(value) => {
                      setModulesId(value);
                      dispatch({
                        type: 'courses/getCourseDetailSingle',
                        payload: {
                          query: { moduleId: value },
                        },
                      });
                      form2.setFieldsValue({
                        difficuiltyLevel: undefined,
                      });
                    }}
                  >
                    {getCoursesDetailForModule?.records?.map((item) => (
                      <Option value={item?.moduleId} key={item?.moduleId}>
                        {item?.moduleName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </Col>
            <Col span={4} xl={6} lg={10} md={12} sm={24} xs={24}>
              <div className="px-4 pt-5">
                <Form.Item name="difficuiltyLevel">
                  <Select
                    size="large"
                    onChange={(value) => {
                      getCourseDetailsForFilter(value);
                    }}
                    placeholder="Select difficuilty level"
                  >
                    {difficuiltyLevel?.map((items) => (
                      <Option value={items?.value} key={items?.value}>
                        {items?.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </Col>
          </Row>

          <Form.Item>
            <Table
              style={{ borderRadius: '8px' }}
              pagination={false}
              columns={columns}
              dataSource={getCourseDetailSingle?.records}
              loading={loading}
              rowClassName="cursor-pointer"
              onRow={(record) => {
                return {
                  onClick: () => {
                    history.push(
                      `/upload/course-content/view/${record?.courseId}/module/${record?.moduleId}/assoc/${record?.assocId}`,
                    );
                  },
                };
              }}
              footer={() => (
                <CheckValidation show={getCourseDetailSingle?.totalCount > 5}>
                  <Row className="mt-2" type="flex" justify="end">
                    <Pagination
                      key={`page-${currentPage}`}
                      showSizeChanger
                      pageSizeOptions={['10', '25', '50', '100']}
                      onShowSizeChange={(e, p) => {
                        setViewSize(p);
                        setCurrentPage(1);

                        getMultiCourse(0, p, courseSearch);
                      }}
                      defaultCurrent={1}
                      current={currentPage}
                      pageSize={viewSize}
                      total={getCourseDetailSingle?.totalCount}
                      showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                      onChange={handleChangePagination}
                    />
                  </Row>
                </CheckValidation>
              )}
            />
          </Form.Item>
        </div>
      </Form>
    </>
  );
};

export default connect(({ courses, loading }) => ({
  getCourseDetailSingle: courses?.getCourseDetailSingle,
  getCoursesDetail: courses?.getCoursesDetail,
  getCoursesDetailForModule: courses?.getCoursesDetailForModule,
  loading: loading?.effects[('courses/getCoursesDetail', 'courses/getCourseDetailSingle')],
}))(CoursesData);
