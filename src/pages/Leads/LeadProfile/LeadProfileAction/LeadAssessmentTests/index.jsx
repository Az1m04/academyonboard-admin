import React, { useState, useEffect } from 'react';
import {
  Button,
  Divider,
  Dropdown,
  Form,
  InputNumber,
  Menu,
  message,
  Modal,
  Pagination,
  Popconfirm,
  Row,
  Spin,
  Table,
  Tooltip,
} from 'antd';
import AddLeadAssessmentTest from './AddLeadAssessmentTest';
import { connect, useParams } from 'umi';
import { DeleteOutlined, DownloadOutlined, EditOutlined, MoreOutlined } from '@ant-design/icons';
import CheckValidation from '@/components/CheckValidation';
import SearchNotFound from '@/assets/icons/empty-search-contact.png';

const LeadAssessmentTests = ({
  dispatch,
  assessmentTest,
  getLeadAssessmentTest,
  loadingGetLeadAssessmentTest,
  loadingForChangeStatus,
}) => {
  const [addAssessmentModal, setAddAssessmentModal] = useState(false);
  const [singleAssessmentTest, setSingleAssessmentTest] = useState();
  const [completeModal, setCompleteModal] = useState(false);
  const [completeForm] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [viewSize, setViewSize] = useState(10);
  const [startIndex, setStartIndex] = useState(0);

  const { leadId } = useParams();
  useEffect(() => {
    dispatch({
      type: 'leads/getAssessmentTest',
      payload: {
        query: {
          testTypeId: 'ASSESS_TST',
          leadId,
        },
      },
    });
  }, [singleAssessmentTest]);
  const getLeadAllAssessmentTest = () => {
    dispatch({
      type: 'leads/getLeadAssessmentTest',
      payload: { pathParams: { leadId } },
    });
  };
  useEffect(() => {
    getLeadAllAssessmentTest();
  }, [startIndex, viewSize, currentPage]);
  const testStatusChange = (data, record) => {
    if (data === 'TEST_COMPLETED') {
      setCompleteModal(true);
      setSingleAssessmentTest(record);
      completeForm.setFieldsValue({
        marks: record?.totalMarks,
      });
    } else {
      dispatch({
        type: 'leads/changeAssessmentTestStatus',
        payload: {
          pathParams: {
            leadId,
            testId: record?.testId,
          },
          body: { statusId: data },
        },
      }).then((res) => {
        if (res?.status === 'okk') {
          setSingleAssessmentTest('');
          getLeadAllAssessmentTest();
        }
      });
    }
  };
  function handleChangePagination(current, size) {
    setCurrentPage(current);
    setStartIndex(size * (current - 1), size);
  }
  const donwloadAssessmentTest = (attachment) => {
    const urll = attachment;
    fetch(`${urll}`).then((response) => {
      response.blob().then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `question paper pdf`;
        // setLoadingToDownload(false);
        a.click();
      });
    });
  };
  const menu = (record) => (
    <Menu>
      <Menu.Item
        onClick={() => {
          testStatusChange('TEST_ASSIGNED', record);
        }}
        className="pb-0"
      >
        <p className="pb-0 mb-0">Assigned</p>
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          testStatusChange('TEST_RUNNING', record);
        }}
        className="pb-0 mb-1"
      >
        <p className="pb-0 mb-0">Running </p>
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          testStatusChange('TEST_COMPLETED', record);
        }}
        className="mb-1"
      >
        <p className="pb-0 mb-1">Complete</p>
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          testStatusChange('TEST_NOT_COMPLETED', record);
        }}
      >
        <p className="pb-0 mb-1">Not Complete</p>
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          testStatusChange('TEST_NOT_ATTENDED', record);
        }}
      >
        <p className="pb-0 mb-0">Not Attented</p>
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: 'Sr No.',
      dataIndex: 'name',
      key: 'name',
      render: (_, __, index) => <p>{index + 1}</p>,
    },
    {
      title: 'Test name',
      dataIndex: 'testName',
      key: 'testName',
      render: (data) => <div>{data}</div>,
    },

    {
      title: 'Mode',
      key: 'mode',
      dataIndex: 'mode',
      render: (data) => <div>{data}</div>,
    },
    {
      title: 'Remarks',
      key: 'remarks',
      dataIndex: 'remarks',
      render: (data) => <div>{data}</div>,
    },
    {
      title: 'Grade',
      key: 'result',
      dataIndex: 'result',
      render: (data) => <div>{data || '--'}</div>,
    },
    {
      title: 'Status',
      dataIndex: 'testStatus',
      key: 'status',
      render: (data) => <div>{data}</div>,
    },
    {
      title: 'Action',
      key: 'action',
      render: (__, record) => (
        <div className="flex gap-3">
          <Tooltip title="Edit">
            <Button
              onClick={() => {
                setAddAssessmentModal(true);
                setSingleAssessmentTest(record);
              }}
              style={{ border: 'none', padding: '0' }}
            >
              <p className="text-blue-500">
                <EditOutlined />
              </p>
            </Button>
          </Tooltip>
          <Popconfirm
            title="Are you sure to delete assessment test?"
            onConfirm={() => {
              dispatch({
                type: 'leads/deleteLeadAssessmentTest',
                payload: {
                  pathParams: {
                    leadId,
                  },
                },
              }).then((res) => {
                if (res?.responseMessage === 'success') {
                  message.success('Your assessment test has been deleted');
                }
              });
            }}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete">
              <Button style={{ border: 'none', padding: '0' }}>
                <p className="text-red-500">
                  <DeleteOutlined />
                </p>
              </Button>
            </Tooltip>
          </Popconfirm>
          <Tooltip title="Download test link">
            <Button
              style={{ border: 'none', padding: '0' }}
              onClick={() => {
                donwloadAssessmentTest(record?.link);
              }}
            >
              <p className="text-gray-500">
                <DownloadOutlined />
              </p>
            </Button>
          </Tooltip>
          {record?.testStatusId !== 'TEST_COMPLETED' && record?.mode === 'OFFLINE' ? (
            <Tooltip title="Change status">
              {record?.testStatusId !== 'TEST_NOT_ATTENDED' ? (
                <Dropdown overlay={menu(record)}>
                  <p className="text-gray-500 ">
                    <MoreOutlined className="text-lg" />
                  </p>
                </Dropdown>
              ) : null}
            </Tooltip>
          ) : null}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div>
        <div>
          <div className="flex justify-between">
            <div>
              <div className="text-blue-700 font-medium text-xl">Lead assessment test</div>
            </div>
            {/* <div className="flex justify-between gap-5">
              <div className="mx-5">
                <Button
                  type="primary"
                  onClick={() => {
                    setSingleAssessmentTest('');
                    setAddAssessmentModal(true);
                  }}
                >
                  Assign assessment test
                </Button>
              </div>
            </div> */}
          </div>
          <Divider style={{ marginTop: '0.6rem' }} />
          <div className="mt-5">
            <Table
              scroll={{ x: 1200 }}
              columns={columns}
              loading={loadingGetLeadAssessmentTest}
              dataSource={getLeadAssessmentTest}
              bordered
              pagination={false}
              locale={{
                emptyText: (
                  <div className="text-center flex justify-center items-center">
                    <div>
                      <p className="text-lg">No assessment test assigned yet!</p>
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
                <CheckValidation show={getLeadAssessmentTest?.totalCount > 5}>
                  <Row className="mt-2" type="flex" justify="end">
                    <Pagination
                      key={`page-${currentPage}`}
                      showSizeChanger
                      pageSizeOptions={['10', '25', '50', '100']}
                      onShowSizeChange={(e, p) => {
                        setViewSize(p);
                        setCurrentPage(1);
                        setStartIndex(0);
                        // getDemoClass(0, p);
                      }}
                      defaultCurrent={1}
                      current={currentPage}
                      pageSize={viewSize}
                      total={getLeadAssessmentTest?.totalCount}
                      showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                      onChange={handleChangePagination}
                    />
                  </Row>
                </CheckValidation>
              )}
            />
          </div>
        </div>
      </div>
      <AddLeadAssessmentTest
        setAddAssessmentModal={setAddAssessmentModal}
        addAssessmentModal={addAssessmentModal}
        assessmentTest={assessmentTest}
        getLeadAllAssessmentTest={getLeadAllAssessmentTest}
        singleAssessmentTest={singleAssessmentTest}
        setSingleAssessmentTest={setSingleAssessmentTest}
      />
      <Modal
        title="Change complete status"
        visible={completeModal}
        onCancel={() => {
          setCompleteModal(false);
        }}
        width={400}
        footer={null}
      >
        <Spin spinning={Boolean(loadingForChangeStatus)}>
          <div className="w-full">
            <Form
              form={completeForm}
              onFinish={(value) => {
                const newValue = {
                  ...value,
                  statusId: 'TEST_COMPLETED',
                };
                dispatch({
                  type: 'leads/changeAssessmentTestStatus',
                  payload: {
                    pathParams: {
                      leadId,
                      testId: singleAssessmentTest?.testId,
                    },
                    body: newValue,
                  },
                }).then((res) => {
                  if (res?.status === 'okk') {
                    setCompleteModal(false);
                    completeForm.resetFields();
                    setSingleAssessmentTest('');
                    getLeadAllAssessmentTest();
                  }
                });
              }}
            >
              <div className="mt-4">
                <p className="mb-1 font-medium">Total Marks</p>
                <Form.Item rules={[{ required: true, message: 'Please enter marks' }]} name="marks">
                  <InputNumber style={{ width: '100%' }} placeholder="Enter total marks" />
                </Form.Item>
              </div>
              <div>
                <p className="mb-1 font-medium">Obtained Marks</p>
                <Form.Item
                  rules={[{ required: true, message: 'Please enter obtained marks' }]}
                  name="obtainedMarks"
                >
                  <InputNumber style={{ width: '100%' }} placeholder="Enter Obtained marks" />
                </Form.Item>
              </div>
            </Form>
            <div className="flex justify-end gap-3">
              <div>
                <Button
                  type="default"
                  onClick={() => {
                    setCompleteModal(false);
                    setSingleAssessmentTest('');
                    completeForm.resetFields();
                  }}
                  size="middle"
                >
                  Cancel
                </Button>
              </div>
              <div>
                <Button onClick={() => completeForm.submit()} type="primary" size="middle">
                  Update
                </Button>
              </div>
            </div>
          </div>
        </Spin>
      </Modal>
    </div>
  );
};

export default connect(({ leads, loading }) => ({
  assessmentTest: leads?.assessmentTest,
  getLeadAssessmentTest: leads?.getLeadAssessmentTest,
  loadingGetLeadAssessmentTest: loading?.effects['leads/getLeadAssessmentTest'],
  loadingForChangeStatus: loading?.effects['leads/changeAssessmentTestStatus'],
}))(LeadAssessmentTests);
