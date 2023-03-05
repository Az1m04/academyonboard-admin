import React, { useEffect, useState } from 'react';
import { Select, Button, Divider, Tabs, Form, Table, Row, Pagination, Tooltip } from 'antd';
import moment from 'moment';
import SearchNotFound from '@/assets/icons/empty-search-contact.png';
import { connect, useParams } from 'umi';
import CheckValidation from '@/components/CheckValidation';
import { useHistory } from 'react-router-dom';

const WalletAndSalary = ({
  walletStatusList,
  dispatch,
  loadingWallet,
  salaryStatusList,
  loadingSalary,
}) => {
  const { staffId } = useParams();
  const [viewSize, setViewSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [startIndex, setStartIndex] = useState(0);
  const [tab, setTab] = useState('WALLET');
  const [form] = Form.useForm();
  const { TabPane } = Tabs;
  const getWalletStatusList = () => {
    dispatch({
      type: 'staff/getWalletStatus',
      payload: {
        pathParams: { staffId },
        query: { startIndex, viewSize },
      },
    });
  };
  const getSalaryStatusList = () => {
    dispatch({
      type: 'staff/getSalaryStatus',
      payload: {
        pathParams: { staffId },
        query: { startIndex, viewSize },
      },
    });
  };
  useEffect(() => {
    if (tab === 'WALLET') {
      getWalletStatusList();
    } else {
      getSalaryStatusList();
    }
  }, [tab, startIndex, viewSize]);

  const columns = [
    {
      title: 'Date',
      dataIndex: 'transactionDate',
      key: 'date',
      align: 'center',
      width: 190,
      render: (text) => <p className="m-0 text-sm">{text && moment(text).format('lll')}</p>,
    },
    {
      title: 'Description',
      dataIndex: 'discription',
      key: 'description',
      align: 'center',
      width: 200,
    },
    {
      title: 'Trans Type',
      dataIndex: 'transType',
      key: 'transType',
      align: 'center',
      width: 150,
    },
    {
      title: 'Mode',
      dataIndex: 'mode',
      key: 'mode',
      align: 'center',
      width: 150,
    },
    {
      title: 'Credit',
      dataIndex: 'credit',
      key: 'credit',
      align: 'center',
    },
    {
      title: 'Debit',
      dataIndex: 'debitAmount',
      key: 'debit',
      align: 'center',
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
      align: 'center',
    },
    {
      title: 'Remarks',
      dataIndex: 'comments',
      key: 'remarks',
      align: 'center',
      width: 250,
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
      dataIndex: 'by',
      key: 'by',
      align: 'center',
      width: 200,
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      align: 'center',
    },
  ];
  const columnsSalary = [
    {
      title: 'Date',
      dataIndex: 'transactionDate',
      key: 'date',
      align: 'center',
      width: 190,
      render: (text) => <p className="m-0 text-sm">{text && moment(text).format('lll')}</p>,
    },
    {
      title: 'Month',
      dataIndex: 'month',
      key: 'month',
    },
    {
      title: 'Payout Id',
      dataIndex: 'payoutId',
      key: 'payoutId',
      align: 'center',
    },
    {
      title: 'Credit',
      dataIndex: 'creditAmount',
      key: 'credit',
      render: (text) => <>{text || '--'}</>,
    },
    {
      title: 'Debit',
      dataIndex: 'debitAmount',
      key: 'debit',
      render: (text) => <>{text || '--'}</>,
    },
    {
      title: 'Total Balance',
      dataIndex: 'balance',
      key: 'totalBalance',
      render: (text) => <>{text || '--'}</>,
    },
    {
      title: 'Remarks',
      dataIndex: 'comments',
      key: 'remarks',
      align: 'center',
      width: 250,
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
      title: 'Status ',
      dataIndex: 'statusId',
      key: 'status',
      align: 'center',
      render: (text) => (
        <>
          {text === 'SALARY_PREPARED' ? (
            <span className="text-red-500 text-center font-medium">Pending</span>
          ) : (
            <span className="text-green-500 text-center font-medium">Paid</span>
          )}
        </>
      ),
    },
  ];

  const monthFilter = [
    {
      monnth: 'Januaray',
    },
    {
      monnth: 'Feburary',
    },
    {
      monnth: 'Mar',
    },
    {
      monnth: 'April',
    },
    {
      monnth: 'May',
    },
    {
      monnth: 'June',
    },
    {
      monnth: 'July',
    },
    {
      monnth: 'August',
    },
  ];
  const tabsPanes = [
    {
      key: 'WALLET',
      value: 'Wallet',
    },
    {
      key: 'SALARY',
      value: 'Salary',
    },
  ];
  function handleChangePagination(current) {
    setStartIndex(viewSize * (current - 1));
    setCurrentPage(current);
  }
  const history = useHistory();
  return (
    <div>
      <div className="mt-4">
        <Form form={form} hideRequiredMark>
          <div className="flex justify-between">
            <div>
              <div className="text-blue-700 font-medium text-xl"> Salary and Wallet</div>
            </div>
            <div className="">
              <div className="mr-4">
                <Select style={{ width: '12rem' }} placeholder="Select month">
                  {monthFilter?.map((item) => (
                    <Select.Option key={item?.monnth} value={item?.monnth}>
                      {item?.monnth}
                    </Select.Option>
                  ))}
                </Select>
                <Button
                  onClick={() => history.push('./staff/addSalary')}
                  className="ml-5"
                  size="middle"
                  type="primary"
                >
                  Add Salary
                </Button>
              </div>
            </div>
          </div>

          <Divider style={{ marginTop: '0.6rem' }} />

          <div className="mr-5 mt-5">
            <Tabs
              onChange={(e) => setTab(e)}
              activeKey={tab}
              defaultActiveKey={'WALLET'}
              className="font-semibold text-blue-500"
            >
              {tabsPanes?.map((item) => (
                <TabPane
                  tab={item?.value}
                  key={item?.key}
                  style={{ height: '45rem', overflow: 'auto', padding: '11px' }}
                >
                  {item?.key === 'WALLET' ? (
                    <Table
                      dataSource={walletStatusList?.records}
                      columns={columns}
                      loading={Boolean(loadingWallet)}
                      pagination={false}
                      scroll={{ x: 1000 }}
                      bordered
                      size="large"
                      style={{ width: '100%', marginTop: '20px' }}
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
                        <CheckValidation show={walletStatusList?.totalCount > 5}>
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
                              total={walletStatusList?.totalCount}
                              showTotal={(total, range) =>
                                `${range[0]}-${range[1]} of ${total} items`
                              }
                              onChange={handleChangePagination}
                            />
                          </Row>
                        </CheckValidation>
                      )}
                    />
                  ) : (
                    <Table
                      dataSource={salaryStatusList?.records}
                      columns={columnsSalary}
                      scroll={{ x: 1000 }}
                      bordered
                      loading={Boolean(loadingSalary)}
                      size="large"
                      style={{ width: '100%', marginTop: '20px' }}
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
                        <CheckValidation show={salaryStatusList?.totalCount > 5}>
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
                              total={salaryStatusList?.totalCount}
                              showTotal={(total, range) =>
                                `${range[0]}-${range[1]} of ${total} items`
                              }
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
      </div>
    </div>
  );
};

export default connect(({ staff, loading }) => ({
  walletStatusList: staff?.walletStatusList,
  loadingWallet: loading?.effects['staff/getWalletStatus'],
  salaryStatusList: staff?.salaryStatusList,
  loadingSalary: loading?.effects['staff/getWalletStatus'],
}))(WalletAndSalary);
