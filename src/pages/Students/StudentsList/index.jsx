import React, { useState, useEffect } from 'react';
import { Tabs, Button } from 'antd';
import { connect, Link } from 'umi';
import Page from '@/components/Page';
import Breadcrumbs from '@/components/BreadCrumbs';
import { PlusSquareOutlined } from '@ant-design/icons';
import StudentsListTable from './StudentsListTable';
import { Envelope, WhatsApp, ChatLeftIcon } from '@/utils/AppIcons';
import GenerateEmail from '@/components/GenerateEmail';
import GenerateWhatsAppMessage from '@/components/GenerateWhatsAppMessage';
import CheckValidation from '@/components/CheckValidation';

const { TabPane } = Tabs;
const AllStudentsList = (props) => {
  const { studentsList, dispatch, loading, match, location, history } = props;

  const [acceptedKeyword, setAcceptedKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [startIndex, setStartIndex] = useState(0);
  const [viewSize, setViewSize] = useState(10);
  const [selectedRows, setSelectedRows] = useState([]);

  const [visibleWhatsApp, setVisibleWhatsApp] = useState(false);
  const [visibleEmail, setVisibleEmail] = useState(false);
  const [recordDetails, setRecordDetails] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const tab = location.pathname.split('/')[location.pathname.split('/')?.length - 1];

  const getStudentList = () => {
    const query = { viewSize, startIndex, keyword: acceptedKeyword };

    switch (tab) {
      case 'active':
        query.enabled = tab === 'active';
        break;
      case 'inactive':
        query.enabled = tab === 'active';
        break;
      case 'enrolled':
        query.status = 'RUNNING';
        break;
      case 'course-completed':
        query.status = 'COMPLETED';
        break;
      case 'course-completing-in-week':
        query.status = 'EXPIRE';
        break;
      default:
      // query.enabled = tab === 'active';
    }
    dispatch({
      type: 'student/getAllStudentList',
      payload: {
        query,
      },
    });
  };

  useEffect(() => {
    getStudentList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, dispatch, viewSize, startIndex, acceptedKeyword]);

  const getTabKey = () => {
    switch (tab) {
      case 'all':
        return 'ALL';
      case 'active':
        return 'ACTIVE';
      case 'inactive':
        return 'INACTIVE';
      case 'enrolled':
        return 'ENROLLED';
      case 'course-completed':
        return 'COURSE_COMPLETED';
      case 'course-completing-in-week':
        return 'COURSE_COMPLETING';
      default:
        return 'ALL';
    }
  };

  const handleTabChange = (key) => {
    const url = match.url === '/' ? '' : match.url.replace(/[^/]+$/, '');
    switch (key) {
      case 'ALL':
        history.push(`${url}all`);
        break;
      case 'ACTIVE':
        history.push(`${url}active`);
        break;
      case 'INACTIVE':
        history.push(`${url}inactive`);
        break;
      case 'ENROLLED':
        history.push(`${url}enrolled`);
        break;
      case 'COURSE_COMPLETED':
        history.push(`${url}course-completed`);
        break;
      case 'COURSE_COMPLETING':
        history.push(`${url}course-completing-in-week`);
        break;
      default:
        break;
    }
  };

  return (
    <div className="container mx-auto">
      <Page
        title="Students"
        PrevNextNeeded="N"
        breadcrumbs={
          <Breadcrumbs
            path={[
              {
                name: 'Dashboard',
                path: '/dashboard',
              },
              {
                name: 'All Students',
                path: '/students/all',
              },
            ]}
          />
        }
        primaryAction={
          <Link
            to={{
              pathname: '/students/new',
            }}
          >
            <Button icon={<PlusSquareOutlined />} type="primary" id="open-invite-staff">
              Add Student
            </Button>
          </Link>
        }
      >
        <div className="flex justify-end mb-4">
          <div className="flex space-x-2 ">
            <Button
              disabled={selectedRows?.length === 0}
              onClick={() => setVisibleEmail(true)}
              type="primary"
            >
              <Envelope />
            </Button>
            <Button
              onClick={() => setVisibleWhatsApp(true)}
              disabled={selectedRows?.length === 0}
              type="primary"
            >
              <WhatsApp />
            </Button>
            <Button type="primary">
              <ChatLeftIcon />
            </Button>
          </div>
        </div>
        <div className="bg-white shadow rounded">
          <Tabs defaultActiveKey="ACTIVE" activeKey={getTabKey()} onChange={handleTabChange}>
            <TabPane tab={<span className="px-4">All</span>} key="ALL" />
            <TabPane tab={<span className="px-4">Active</span>} key="ACTIVE" />
            <TabPane tab={<span className="px-4">Course running</span>} key="ENROLLED" />
            <TabPane tab={<span className="px-4">Course completed </span>} key="COURSE_COMPLETED" />
            <TabPane
              tab={<span className="px-4">Course expiring in 5 days </span>}
              key="COURSE_COMPLETING"
            />
            <TabPane tab={<span className="px-4">Inactive</span>} key="INACTIVE" />
          </Tabs>
          <StudentsListTable
            viewSize={viewSize}
            totalRecords={studentsList?.totalCount}
            currentPage={currentPage}
            setViewSize={setViewSize}
            setCurrentPage={setCurrentPage}
            setStartIndex={setStartIndex}
            setKeyword={setAcceptedKeyword}
            clientList={studentsList?.records}
            loading={loading}
            startIndex={startIndex}
            acceptedKeyword={acceptedKeyword}
            newStudentList={getStudentList}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            selectedRowKeys={selectedRowKeys}
            setSelectedRowKeys={setSelectedRowKeys}
            getStudentList={getStudentList}
          />

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
        </div>
      </Page>
    </div>
  );
};
export default connect(({ student, loading }) => ({
  studentsList: student.studentsList,
  loading: loading.effects['student/getAllStudentList'],
}))(AllStudentsList);
