import React, { useEffect, useState } from 'react';
import {
  Select,
  DatePicker,
  Input,
  Divider,
  Tabs,
  Form,
  Table,
  Row,
  Pagination,
  Tooltip,
} from 'antd';
import { debounce } from 'lodash';
import AppIcons from '@/utils/AppIcons';
import SearchNotFound from '@/assets/icons/empty-search-contact.png';

import { connect, useParams } from 'umi';
import moment from 'moment';
import CheckValidation from '@/components/CheckValidation';

const Wallet = ({ dispatch, studentWalletdata, loading }) => {
  const [form] = Form.useForm();
  const { Search } = Input;
  const { TabPane } = Tabs;
  const { studentId } = useParams();
  const [activityType, setActivityType] = useState();
  const [viewSize, setViewSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [startIndex, setStartIndex] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [tab, setTab] = useState('All');
  const { Option } = Select;
  const action = (value) => {
    setKeyword(value);
  };

  const debounceSearch = debounce(action, 400);

  const getWalletDetails = () => {
    dispatch({
      type: 'student/getStudentWalletdata',
      payload: {
        pathParams: {
          studentId,
        },
        query: { keyword, startIndex, viewSize },
      },
    }).catch(() => {});
  };

  useEffect(() => {
    getWalletDetails();
  }, [startIndex, viewSize]);

  const ActivityList = [
    {
      id: '0',
      label: 'Phone call',
      value: 'WEPT_TASK_PHONE_CALL',
    },
    {
      id: '1',
      label: 'Message',
      value: 'WEPT_TASK_TEXT_MSG',
    },

    {
      id: '2',
      label: 'Whatsapp',
      value: 'WEPT_TASK_WATSAP_MSG',
    },
    {
      id: '3',
      label: 'Visit',
      value: 'WEPT_TASK_VISIT',
    },
    {
      id: '4',
      label: 'Email',
      value: 'WEPT_TASK_EMAIL',
    },
    {
      id: '5',
      label: 'Others',
      value: 'WEPT_TASK_OTHERS',
    },
  ];

  const tabsPane = [
    {
      tab: `All transactions ${
        (studentWalletdata?.totalCount && studentWalletdata?.totalCount) || 0
      }`,
      key: 'All',
    },
    {
      tab: `Credit (2)`,
      key: 'Credit',
    },
    {
      tab: `Debit (3)`,
      key: 'Debit',
    },
  ];

  const columns = [
    {
      title: 'Date',
      dataIndex: 'transactionDate',
      key: 'date',
      align: 'center',
      width: 120,
      render: (data) => (data ? moment(data).format('ll') : '--'),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      align: 'center',
      width: 150,
      render: (data) =>
        data ? (
          <Tooltip title={data}>
            <p className="w-48 truncate m-0">{data}</p>
          </Tooltip>
        ) : (
          '--'
        ),
    },
    {
      title: 'Trans Type',
      dataIndex: 'transType',
      key: 'transType',
      align: 'center',
      width: 150,
      render: (data) => (data ? <>{data}</> : '--'),
    },
    {
      title: 'Mode',
      dataIndex: 'mode',
      key: 'mode',
      align: 'center',
      width: 150,
      render: (data) => (data ? <>{data}</> : '--'),
    },
    {
      title: 'Credit',
      dataIndex: 'creditAmount',
      key: 'credit',
      align: 'center',
      render: (data) => (data ? <>{data}</> : '--'),
    },
    {
      title: 'Debit',
      dataIndex: 'debitAmount',
      key: 'debit',
      align: 'center',
      render: (data) => (data ? <>{data}</> : '--'),
    },
    {
      title: 'Balance',
      dataIndex: 'outstandingBalance',
      key: 'balance',
      align: 'center',
      render: (data) => (data ? <>{data}</> : '--'),
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
      align: 'center',
      width: 200,
      render: (data) =>
        data ? (
          <Tooltip title={data}>
            <p className="w-48 truncate m-0">{data}</p>
          </Tooltip>
        ) : (
          '--'
        ),
    },
    {
      title: 'By',
      dataIndex: 'receivedBy',
      key: 'by',
      align: 'center',
      width: 170,
      render: (data) => (data ? <>{data}</> : '--'),
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      align: 'center',
      render: (data) => (data ? <>{data}</> : '--'),
    },
  ];
  function handleChangePagination(current) {
    setStartIndex(viewSize * (current - 1));
    setCurrentPage(current);
  }
  return (
    <Form form={form} hideRequiredMark>
      <div className="flex justify-between">
        <div className="text-blue-600 font-semibold text-lg">Wallet</div>
        <div className="rounded-2xl mx-2 flex">
          <div className="mr-4">
            <Select
              style={{ width: '12rem' }}
              value={activityType}
              placeholder="Select transaction type"
              onChange={(value) => setActivityType(value)}
            >
              {ActivityList?.map((item) => (
                <Option key={item?.id} value={item?.value}>
                  {item?.label}
                </Option>
              ))}
            </Select>
          </div>
          <div className>
            <Search
              style={{ width: '12rem' }}
              size="middle"
              placeholder="Enter keyword to search"
              onChange={(value) => debounceSearch(value?.target?.value)}
              enterButton
            />
          </div>
          <div className="flex justify-between">
            <div className="mx-4">
              <DatePicker placeholder="Select date" />
            </div>
            <div></div>
          </div>
        </div>
      </div>
      <Divider style={{ marginTop: '0.6rem' }} />
      <div className="mr-5 flex justify-end -mb-12">
        <div className="mt-1.5 mr-2 text-green-600">
          <AppIcons.SendFill />
        </div>
        <p className="text-yellow-500 font-extrabold text-md mt-1">Transfer Funds</p>
      </div>
      <div className="flex justify-between w-full">
        <Tabs
          defaultActiveKey={'All'}
          onChange={(val) => setTab(val)}
          className="font-semibold text-blue-500"
        >
          {tabsPane?.map((item) => (
            <TabPane
              tab={item?.tab}
              key={item?.key}
              style={{ marginBottom: '2.5rem', overflow: 'auto', padding: '11px' }}
            >
              {tab === item?.key && (
                <Table
                  dataSource={studentWalletdata?.records}
                  columns={columns}
                  scroll={{ x: 1100 }}
                  bordered
                  loading={Boolean(loading)}
                  pagination={false}
                  size="large"
                  style={{ width: '100%' }}
                  locale={{
                    emptyText: (
                      <div className="flex items-center justify-center text-center">
                        <div>
                          <p className="text-lg">No records yet!</p>
                          <img
                            className="ml-16 "
                            src={SearchNotFound}
                            alt="No records found!"
                            style={{ height: '100px' }}
                          />
                        </div>
                      </div>
                    ),
                  }}
                  footer={() => (
                    <CheckValidation show={studentWalletdata?.totalCount > 5}>
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
                          total={studentWalletdata?.totalCount}
                          showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                          onChange={handleChangePagination}
                        />
                      </Row>
                    </CheckValidation>
                  )}
                />
              )}
            </TabPane>
          ))}
        </Tabs>
      </div>
    </Form>
  );
};

export default connect(({ student, loading }) => ({
  studentWalletdata: student?.studentWalletdata,
  loading: loading?.effects['student/getStudentWalletdata'],
}))(Wallet);
