import React, { useEffect, useState } from 'react';
import Page from '@/components/Page';
import Breadcrumbs from '@/components/BreadCrumbs';
import { Table, Input, Pagination, Row, Tag, Popover } from 'antd';
import moment from 'moment';
import { connect } from 'umi';
import { ClockCircleOutlined } from '@ant-design/icons';
import CheckValidation from '@/components/CheckValidation';
import { debounce } from 'lodash';

const { Search } = Input;

const TeacherFreeTimeslot = ({ teacherFreeTimeslotList, dispatch, loading }) => {
  const [keyword, setKeyword] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [viewSize, setViewSize] = useState(10);
  const columns = [
    {
      title: 'Sr.no.',
      dataIndex: 'srno',
      align: 'center',
      width: '5rem',
      render: (_, __, index) => (
        <p className="text-gray-900 font-medium capitalize m-0">
          {index + 1 + viewSize * (currentPage - 1)}
        </p>
      ),
    },
    {
      title: 'Name',
      dataIndex: 'displayName',
      key: 'name',
      width: '10rem',
      render: (text) => <p className="m-0 text-gray-900 font-medium capitalize">{text || '--'}</p>,
    },
    {
      title: 'No. assigned batch',
      key: 'batch',
      width: '10rem',
      align: 'center',
      render: (_, record) =>
        record?.batches?.length > 0 && (
          <Popover
            content={
              <div
                className={`${record?.batches?.length > 3 && 'h-20'} overflow-y-auto    w-max  `}
              >
                <div
                  className=" grid grid-cols-1 place-items-center"
                  style={{ border: '0.5px solid #e5e7eb' }}
                >
                  {record?.batches?.map((batchRecord, index) => (
                    <div
                      style={{ height: '27px' }}
                      className={`flex ${
                        index + 1 === record?.batches?.length ? '' : 'border-b'
                      }  w-max items-center`}
                      key={batchRecord?.id}
                    >
                      <div className="border-r w-12 text-center text-xs font-medium text-gray-900">
                        {index + 1}
                      </div>
                      <div className="border-r w-full">
                        <p className="m-0 w-36 px-2 font-medium capitalize">{batchRecord?.name}</p>
                      </div>
                      <div className=" flex items-center justify-center gap-1 w-full">
                        <ClockCircleOutlined className="text-sm" />
                        <p className="text-gray-900 font-medium m-0 text-xs">
                          {(batchRecord?.startAt &&
                            moment(batchRecord?.startAt).format('hh:mma')) ||
                            '--'}
                          {` `} -{` `}
                          {(batchRecord?.endAt && moment(batchRecord?.endAt).format('hh:mma')) ||
                            '--'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            }
          >
            <div className="cursor-pointer font-medium">{record?.batches?.length}</div>
          </Popover>
        ),
    },
    {
      title: 'Available timeslots',
      key: 'Teacher free timeslot',
      render: (_, record) =>
        (record?.availableSlots?.length > 0 && (
          <div className="grid grid-cols-3 gap-8">
            {record?.availableSlots?.map((slot) => (
              <Tag
                key={slot?.id}
                style={{
                  padding: '4px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  width: 'max-content',
                  gap: '3px',
                }}
                color="default"
              >
                <ClockCircleOutlined className="text-sm" />
                <p className="text-gray-900 font-medium m-0 text-xs">
                  {(slot?.startTime && moment(slot?.startTime).format('hh:mma')) || '--'}
                  {` `} -{` `}
                  {(slot?.endTime && moment(slot?.endTime).format('hh:mma')) || '--'}
                </p>
              </Tag>
            ))}
          </div>
        )) ||
        '--',
    },
    {
      title: 'Occupied timeslots',
      key: 'Teacher occupied timeslot',
      render: (_, record) =>
        (record?.availableSlots?.length > 0 && (
          <div className="grid grid-cols-3 gap-8">
            {record?.occupiedSlots?.map((slot) => (
              <Tag
                key={slot?.id}
                style={{
                  padding: '4px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  width: 'max-content',
                  gap: '3px',
                }}
                color="orange"
              >
                <ClockCircleOutlined className="text-sm" />
                <p className="text-gray-900 font-medium m-0 text-xs">
                  {(slot?.startTime && moment(slot?.startTime).format('hh:mma')) || '--'}
                  {` `} -{` `}
                  {(slot?.endTime && moment(slot?.endTime).format('hh:mma')) || '--'}
                </p>
              </Tag>
            ))}
          </div>
        )) ||
        '--',
    },
  ];
  const getFreeTeacherSlots = (startIndex, size, keywordName) => {
    dispatch({
      type: 'timetable/getTeacherFreeTimeslot',
      payload: {
        query: {
          startIndex,
          viewSize: size,
          keyword: keywordName,
        },
      },
    });
  };
  useEffect(() => {
    getFreeTeacherSlots(0, viewSize, '');
  }, []);
  const action = (value) => {
    getFreeTeacherSlots(0, viewSize, value);
  };
  const onSearchChange = debounce(action, 600);
  function handleChangePagination(current, size) {
    setCurrentPage(current);
    getFreeTeacherSlots(size * (current - 1), size, '');
  }
  return (
    <Page
      title="Teacher free timeslot"
      PrevNextNeeded="N"
      breadcrumbs={
        <Breadcrumbs
          path={[
            {
              name: 'Dashboard',
              path: '/dashboard',
            },
            {
              name: 'Teacher free timeslot',
              path: '#',
            },
          ]}
        />
      }
    >
      <div className="bg-white">
        <div className="px-5 py-2.5">
          <Search
            size="large"
            placeholder="Enter keyword to search"
            enterButton
            suffix={<></>}
            value={keyword}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setKeyword(e.target.value);
            }}
          />
        </div>
        <Table
          columns={columns}
          dataSource={teacherFreeTimeslotList?.records}
          pagination={false}
          loading={loading}
          scroll={{ x: 1220 }}
          footer={() => (
            <CheckValidation show={teacherFreeTimeslotList?.totalCount > 5}>
              <Row className="mt-2" type="flex" justify="end">
                <Pagination
                  key={`page-${currentPage}`}
                  showSizeChanger
                  pageSizeOptions={['10', '25', '50', '100']}
                  onShowSizeChange={(e, p) => {
                    setViewSize(p);
                    setCurrentPage(1);
                    getFreeTeacherSlots(0, p, keyword);
                  }}
                  defaultCurrent={1}
                  current={currentPage}
                  pageSize={viewSize}
                  total={teacherFreeTimeslotList?.totalCount}
                  showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                  onChange={handleChangePagination}
                />
              </Row>
            </CheckValidation>
          )}
        />
      </div>
    </Page>
  );
};

export default connect(({ timetable, loading }) => ({
  teacherFreeTimeslotList: timetable?.teacherFreeTimeslotList,
  loading: loading?.effects['timetable/getTeacherFreeTimeslot'],
}))(TeacherFreeTimeslot);
