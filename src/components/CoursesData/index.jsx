import React, { useEffect, useState } from 'react';
import { Table, Input, Pagination, Row, Tooltip } from 'antd';
import { connect, history, Link } from 'umi';
import { currencyFormatter } from '@/utils/common';
import { debounce } from 'lodash';
import CheckValidation from '@/components/CheckValidation';
import { EditOutlined } from '@ant-design/icons';

const { Search } = Input;

const CoursesData = ({ dispatch, allCourses, loading }) => {
  const [courseSearch, setCourseSearch] = useState();
  const [currentPage, setCurrentPage] = useState(1);

  const [viewSize, setViewSize] = useState(10);
  const getCourses = (start, size, keyword) =>
    dispatch({
      type: 'courses/getCourses',
      payload: {
        query: { keyword, startIndex: start, viewSize: size },
      },
    }).catch(() => {});

  const action = (value) => {
    setCurrentPage(1);
    getCourses(0, viewSize, value);
    setCourseSearch(value);
  };

  const onSearchChange = debounce(action, 600);

  useEffect(() => {
    getCourses(0, 10, '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const searchTypeOfFee = (feeArr, typeOfFee) =>
    feeArr?.findIndex((feeItem) => feeItem?.feeDurationId === typeOfFee);

  const getFeeForCourse = (feeArr) => {
    const ifFeeMonthWisePresentInArrItsIndex = searchTypeOfFee(feeArr, 'TF_mon');
    if (ifFeeMonthWisePresentInArrItsIndex !== -1) {
      return `${currencyFormatter.format(
        feeArr[ifFeeMonthWisePresentInArrItsIndex]?.feeAmount,
      )}/month`;
    }
    const ifFeeWeekWisePresentInArrItsIndex = searchTypeOfFee(feeArr, 'TF_wk');
    if (ifFeeWeekWisePresentInArrItsIndex !== -1) {
      return `${currencyFormatter.format(
        feeArr[ifFeeWeekWisePresentInArrItsIndex]?.feeAmount,
      )}/week`;
    }
    const ifFeeDayWisePresentInArrItsIndex = searchTypeOfFee(feeArr, 'TF_day');
    if (ifFeeDayWisePresentInArrItsIndex !== -1) {
      return `${currencyFormatter.format(feeArr[ifFeeDayWisePresentInArrItsIndex]?.feeAmount)}/day`;
    }
    const ifFeeYearWisePresentInArrItsIndex = searchTypeOfFee(feeArr, 'TF_yr');
    if (ifFeeYearWisePresentInArrItsIndex !== -1) {
      return `${currencyFormatter.format(
        feeArr[ifFeeYearWisePresentInArrItsIndex]?.feeAmount,
      )}/year`;
    }
    const ifFeeQuterWisePresentInArrItsIndex = searchTypeOfFee(feeArr, 'TF_qr');
    if (ifFeeQuterWisePresentInArrItsIndex !== -1) {
      return `${currencyFormatter.format(
        feeArr[ifFeeQuterWisePresentInArrItsIndex]?.feeAmount,
      )}/quarter`;
    }
    return '';
  };

  const columns = [
    {
      title: 'Sr.no.',
      dataIndex: 'srno',
      align: 'center',
      width: '50PX',
      render: (_, __, index) => index + 1 + viewSize * (currentPage - 1),
    },
    {
      title: <div className="">Name</div>,
      dataIndex: 'displayName',
      width: '50px',
      key: 'displayName',
      render: (data) => <div className="font-normal w-28 Capitalize"> {data}</div>,
    },
    {
      title: <div className="">Categories</div>,
      dataIndex: 'categoryName',
      width: '50px',
      key: 'categoryName',
      render: (data) => <div className="font-normal w-28 Capitalize">{data || '--'}</div>,
    },
    {
      title: <div className="">Fees</div>,
      dataIndex: 'fees',
      width: '50px',
      key: 'fees',
      render: (data) => (
        <div className="font-normal w-28 Capitalize">{data && getFeeForCourse(data)}</div>
      ),
    },

    {
      title: <div className="">Action</div>,
      dataIndex: 'id',
      width: '50px',
      key: 'id',
      render: (data) => (
        <Tooltip title="Edit course">
          <Link to={`/courses/${data}`} onClick={(e) => e.stopPropagation()}>
            <EditOutlined className="text-yellow-700" />
          </Link>
        </Tooltip>
      ),
    },
  ];
  function handleChangePagination(current, size) {
    setCurrentPage(current);
    getCourses(size * (current - 1), size, courseSearch);
  }

  return (
    <>
      <div className="bg-white rounded shadow ">
        <div className="p-4">
          <Search
            size="large"
            placeholder="Enter keyword to search"
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <Table
          pagination={false}
          columns={columns}
          dataSource={allCourses?.records}
          loading={loading}
          scroll={{ x: 1200 }}
          rowClassName="cursor-pointer"
          onRow={(record) => ({
            onClick: (e) => {
              history.push(`/courses/view/${record.id}`);
              e.stopPropagation();
            },
          })}
          footer={() => (
            <CheckValidation show={allCourses?.totalCount > 5}>
              <Row className="mt-2" type="flex" justify="end">
                <Pagination
                  key={`page-${currentPage}`}
                  showSizeChanger
                  pageSizeOptions={['10', '25', '50', '100']}
                  onShowSizeChange={(e, p) => {
                    setViewSize(p);
                    setCurrentPage(1);

                    getCourses(0, p, courseSearch);
                  }}
                  defaultCurrent={1}
                  current={currentPage}
                  pageSize={viewSize}
                  total={allCourses?.totalCount}
                  showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                  onChange={handleChangePagination}
                />
              </Row>
            </CheckValidation>
          )}
        />
      </div>
    </>
  );
};

export default connect(({ courses, loading }) => ({
  allCourses: courses.allCourses,
  loading: loading.effects['courses/getCourses'],
}))(CoursesData);
