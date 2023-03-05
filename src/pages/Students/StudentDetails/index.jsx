import { Col, Row, Tabs } from 'antd';
import React, { useEffect } from 'react';
import { connect } from 'dva';
import BasicStudentDetails from './BasicStudentDetails';
import styles from './index.less';

const { TabPane } = Tabs;

const StudentDetails = (props) => {
  const {
    children,
    history,
    location,
    dispatch,
    route: { type },
    match: {
      params: { studentId },
      path,
    },
  } = props;

  const onTabChange = (key) => {
    switch (key) {
      case 'DETAILS':
        history.push(`/${type}/${studentId}/details`);
        break;

      case 'TEST':
        history.push(`/${type}/${studentId}/test`);
        break;

      case 'VISA':
        history.push(`/${type}/${studentId}/visa`);
        break;

      case 'DOCUMENTS':
        history.push(`/${type}/${studentId}/documents`);
        break;

      case 'DEBIT_CREDIT':
        history.push(`/${type}/${studentId}/debitCredit`);
        break;
      case 'PAYMENTS':
        history.push(`/${type}/${studentId}/payments`);
        break;
      default:
        break;
    }
  };

  const getTabKey = () => {
    const url = path === '/' ? '' : path;
    const tabKey = location.pathname.replace(`${url}/`, '');
    if (tabKey && tabKey !== '/') {
      switch (tabKey) {
        case `/${type}/${studentId}/details`:
          return 'DETAILS';
        case `/${type}/${studentId}/test`:
          return 'TEST';
        case `/${type}/${studentId}/visa`:
          return 'VISA';
        case `/${type}/${studentId}/documents`:
          return 'DOCUMENTS';
        case `/${type}/${studentId}/debitCredit`:
          return 'DEBIT_CREDIT';
        case `/${type}/${studentId}/payments`:
          return 'PAYMENTS';
        default:
          return '';
      }
    }

    return 'DETAILS';
  };
  const getTabName = () => {
    switch (getTabKey()) {
      case 'DETAILS':
        return 'Course details';
      case 'TEST':
        return 'Test';
      case 'VISA':
        return 'Visa';
      case 'DOCUMENTS':
        return 'Documents';
      case 'DEBIT_CREDIT':
        return 'Debit/Credit';
      case 'PAYMENTS':
        return 'Payments';
      default:
        return '';
    }
  };
  useEffect(() => {
    dispatch({
      type: 'student/getStudent',
      payload: {
        pathParams: { studentId },
      },
    });
  }, [dispatch]);

  return (
    <div className="container mx-auto">
      <Row gutter={16} className="py-6">
        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
          <BasicStudentDetails {...props} />
        </Col>
        <Col xs={24} sm={24} md={16} lg={16} xl={16}>
          <div className="bg-white rounded shadow">
            <div className="flex justify-between px-6 py-4 border-b">
              <div className={`${styles.Name} `}>{getTabName()}</div>
            </div>
            <div className={styles.tabOverrirder}>
              <Tabs className="w-full" activeKey={getTabKey()} onChange={onTabChange}>
                <TabPane
                  tab={
                    <span style={{ paddingLeft: '10px' }}>
                      <span>Course details</span>
                    </span>
                  }
                  key="DETAILS"
                />
                <TabPane
                  tab={
                    <span style={{ paddingLeft: '10px' }}>
                      <span>Test</span>
                    </span>
                  }
                  key="TEST"
                />
                <TabPane
                  tab={
                    <span style={{ paddingLeft: '10px' }}>
                      <span>Visa</span>
                    </span>
                  }
                  key="VISA"
                />

                <TabPane
                  tab={
                    <span style={{ paddingLeft: '10px' }}>
                      {' '}
                      <span>Documents</span>
                    </span>
                  }
                  key="DOCUMENTS"
                />

                <TabPane
                  tab={
                    <span style={{ paddingLeft: '10px' }}>
                      {' '}
                      <span>Debit/Credit</span>
                    </span>
                  }
                  key="DEBIT_CREDIT"
                />
                <TabPane
                  tab={
                    <span style={{ paddingLeft: '10px' }}>
                      {' '}
                      <span>Payments</span>
                    </span>
                  }
                  key="PAYMENTS"
                />
              </Tabs>
              {children}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};
export default connect(() => ({}))(StudentDetails);
