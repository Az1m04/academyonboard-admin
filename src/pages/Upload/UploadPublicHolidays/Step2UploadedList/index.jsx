import React from 'react';
import EmptyStateContainer from '@/components/EmptyStateContainer';
import { CheckCircleFilled, CloseCircleFilled, InfoCircleFilled } from '@ant-design/icons';
import { Table, Popover } from 'antd';
import { connect } from 'umi';
import styles from './index.less';
import classNames from 'classnames';

const Step2UploadedList = ({ uploadPublicHolidays }) => {
  const getErrorInfo = (messages) => {
    return (
      <div>
        {messages?.map((message, index) => (
          <p className="text-red-500 text-md font-semibold" key={message}>
            {`${index + 1}.`} {message}
          </p>
        ))}
      </div>
    );
  };
  const Columns = [
    {
      title: 'Sr. no.',
      dataIndex: 'isError',
      width: 150,
      render: (val, record) => (
        <div className="cursor-pointer">
          {val ? (
            <Popover
              overlayClassName={styles.popoverStyle}
              content={getErrorInfo(record?.messages)}
              title="Errors"
            >
              <CloseCircleFilled
                style={{
                  color: '#d92323d9',
                  fontSize: '20px',
                  borderRadius: '50%',
                }}
              />
            </Popover>
          ) : (
            <CheckCircleFilled
              style={{
                color: 'rgb(27 200 56)',
                fontSize: '20px',
                borderRadius: '50%',
              }}
            />
          )}
        </div>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      width: 150,
      render: (val, record) => (
        <div
          className={`font-semibold capitalize truncate
      ${
        record?.messages?.find(
          (error) => error === 'Invalid device id, it should be hex code of 8 length.',
        ) && 'text-red-500 underline'
      }
      `}
        >
          {val || '--'}
        </div>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      width: 150,
      render: (val) => <div className="font-semibold capitalize truncate">{val || '--'}</div>,
    },
  ];

  return (
    <div>
      <span
        className={`flex items-center justify-between rounded-lg shadow bg-blue-100 p-2 cursor-pointer `}
        style={{ border: '1px solid #c4e8ff' }}
      >
        <div className="flex items-center">
          <InfoCircleFilled style={{ color: '#1890ff', marginRight: '10px' }} />
          <span className="md:truncate">
            Total of {uploadPublicHolidays?.summary?.validRecords || 0} records will be imported
            after confirmation. Please make sure everything looks good!
          </span>
        </div>
      </span>

      <div className="my-12">
        <span
          className={`flex items-center justify-between rounded-lg shadow bg-red-200 p-2 cursor-pointer ${
            uploadPublicHolidays?.summary?.errorRecords === 0 && 'hidden'
          }`}
          style={{ border: '1px solid #c53030', width: '200px' }}
        >
          <div className="flex items-center">
            <InfoCircleFilled style={{ color: '#faad14', marginRight: '10px' }} />
            <span className="md:truncate text-red-700">
              Total of {uploadPublicHolidays?.summary?.errorRecords || 0} error records.
            </span>
          </div>
        </span>
        <Table
          size="small"
          scroll={{ y: 500, x: 1600 }}
          className={classNames(styles.tableStyle)}
          columns={Columns}
          dataSource={uploadPublicHolidays?.records}
          pagination={false}
          locale={{
            emptyText: <EmptyStateContainer text="No any record to upload!" />,
          }}
        />
      </div>
    </div>
  );
};

export default connect(({ loading, endUser }) => ({
  // uploadedEnduserList: enduser.uploadedEnduserList,
  uploadPublicHolidays: endUser.uploadPublicHolidays,
  loading: loading.effects['product/getDeviceDetails'],
}))(Step2UploadedList);
