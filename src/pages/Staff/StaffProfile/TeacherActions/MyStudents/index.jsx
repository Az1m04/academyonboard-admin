import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { Button, DatePicker, Divider, Input, Spin, Tabs, Tooltip } from 'antd';
import { connect, useParams } from 'umi';
import StudentsDetailTable from './StudentsDetailTable';
import { Envelope, Whatsapp } from 'react-bootstrap-icons';
import { debounce } from 'lodash';
import { ChatLeftIcon } from '@/utils/AppIcons';
import GenerateWhatsAppMessage from '@/components/GenerateWhatsAppMessage';
import CheckValidation from '@/components/CheckValidation';
import GenerateEmail from '@/components/GenerateEmail';
import GeneratePhone from '@/components/GeneratePhone';

const MyStudents = ({ dispatch, loading, getStudentsList }) => {
  const { staffId } = useParams();
  const { TabPane } = Tabs;
  const { Search } = Input;
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [visibleWhatsApp, setVisibleWhatsApp] = useState(false);
  const [visibleEmail, setVisibleEmail] = useState(false);
  const [studentSearch, setStudentSearch] = useState();
  const [recordDetails, setRecordDetails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [keywords, setKeywords] = useState();
  const [viewSize, setViewSize] = useState(7);
  const [isPhoneVisible, setIsPhoneVisible] = useState(false);
  const [mode, setMode] = useState('');
  const tabs = [
    {
      title: 'All Students',
      key: '',
    },
    {
      title: 'Online',
      key: 'ONLINE',
    },
    {
      title: 'Offline',
      key: 'OFFLINE',
    },
  ];
  const getStudentsData = (start, size, keyword, modetype) => {
    dispatch({
      type: 'staff/getStudentsList',
      payload: {
        pathParams: {
          staffId,
        },
        query: { keyword, mode: modetype, startIndex: start, viewSize: size },
      },
    });
  };
  useEffect(() => {
    getStudentsData(0, 7, '', '');
  }, []);
  const action = (value) => {
    setCurrentPage(1);
    getStudentsData(0, viewSize, value, mode);
    setStudentSearch(value);
  };
  const onSearchChange = debounce(action, 600);
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKey, selectedTableRows) => {
      setSelectedRowKeys(selectedRowKey);
      setSelectedRows(selectedTableRows);
      setRecordDetails(selectedTableRows);
    },
  };
  function handleChangePagination(current, size) {
    setCurrentPage(current);
    getStudentsData(size * (current - 1), size, studentSearch, mode);
  }
  const onTabChange = (key) => {
    getStudentsData(0, 7, '', key);
    setMode(key);
    setKeywords('');
  };
  return (
    <div>
      <Spin spinning={Boolean(loading)}>
        <h1 className="text-blue-700 text-xl font-medium  mt-4">My Students</h1>

        <div className="flex justify-between mr-10">
          <Search
            style={{ width: '30rem', boxShadow: '0 2px 4px -1px rgb(0 0 0 / 0.1)' }}
            size="middle"
            placeholder="Enter keyword to search"
            value={keywords}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setKeywords(e.target.value);
            }}
            enterButton
          />

          <div className="space-x-2 flex">
            <div>
              <DatePicker />
            </div>
            <Tooltip title="Refresh table">
              <Button size="middle" type="primary" onClick={() => getStudentsData(0, 10, '', '')}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className={`bi bi-arrow-clockwise ${Boolean(loading) && 'animate-spin'}`}
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"
                  />
                  <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
                </svg>
              </Button>
            </Tooltip>
            <Tooltip title="Send mass email messages" placement="top">
              <Button
                size="middle"
                type="primary"
                className={styles?.buttonStyling}
                disabled={selectedRows?.length === 0}
                onClick={() => setVisibleEmail(true)}
              >
                <Envelope />
              </Button>
            </Tooltip>
            <Tooltip title="Send mass whatsapp messages">
              <Button
                size="middle"
                type="primary"
                className={styles?.buttonStyling}
                disabled={selectedRows?.length === 0}
                style={{}}
                onClick={() => setVisibleWhatsApp(true)}
              >
                <Whatsapp className="text-base" />
              </Button>
            </Tooltip>
            <Tooltip title="">
              <Button size="middle" type="primary">
                <ChatLeftIcon className="text-base" style={{ color: 'white' }} />
              </Button>
            </Tooltip>
          </div>
        </div>
        <div className="mr-10">
          <Divider />
        </div>
        <div className="mr-10">
          <Tabs defaultActiveKey="" onChange={onTabChange}>
            {tabs?.map(({ key, title }) => (
              <TabPane tab={title} key={key}></TabPane>
            ))}
          </Tabs>
          <div className="">
            <StudentsDetailTable
              loading={loading}
              rowSelection={rowSelection}
              setRecordDetails={setRecordDetails}
              setCurrentPage={setCurrentPage}
              viewSize={viewSize}
              currentPage={currentPage}
              setViewSize={setViewSize}
              mode={mode}
              studentSearch={studentSearch}
              setVisibleWhatsApp={setVisibleWhatsApp}
              setVisibleEmail={setVisibleEmail}
              setIsPhoneVisible={setIsPhoneVisible}
              handleChangePagination={handleChangePagination}
              getStudentsData={getStudentsData}
              getStudentsList={getStudentsList}
            />
          </div>
        </div>
      </Spin>
      <CheckValidation show={visibleWhatsApp}>
        <GenerateWhatsAppMessage
          type="student"
          purpose="general"
          visible={visibleWhatsApp}
          setVisible={setVisibleWhatsApp}
          recordDetails={recordDetails}
          setRecordDetails={setRecordDetails}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          setSelectedRowKeys={setSelectedRowKeys}
        />
      </CheckValidation>
      <CheckValidation show={visibleEmail}>
        <GenerateEmail
          type="student"
          purpose="general"
          visible={visibleEmail}
          setVisible={setVisibleEmail}
          recordDetails={recordDetails}
          setRecordDetails={setRecordDetails}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          setSelectedRowKeys={setSelectedRowKeys}
        />
      </CheckValidation>
      <CheckValidation show={isPhoneVisible}>
        <GeneratePhone
          isPhoneVisible={isPhoneVisible}
          setIsPhoneVisible={setIsPhoneVisible}
          recordDetails={recordDetails}
          setRecordDetails={setRecordDetails}
        />
      </CheckValidation>
    </div>
  );
};

export default connect(({ staff, loading }) => ({
  loading: loading.effects['staff/getStudentsList'],
  getStudentsList: staff?.getStudentsList,
}))(MyStudents);
