import React from 'react';
import styles from './index.less';
import { Tabs } from 'antd';
import { connect } from 'umi';
import Documents from './Documents';

const { TabPane } = Tabs;

const StudentActivity = ({
  history,
  match: {
    params: { studentId },
    path,
  },
  route: { type },
  location,
}) => {
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
      default:
        return '';
    }
  };
  return (
    <div className="bg-white rounded shadow">
      <div className="flex justify-between px-6 py-4 border-b">
        <div className={styles.Name}>{getTabName()}</div>
      </div>
      <div>
        <Tabs
          className="w-full"
          // defaultActiveKey="DETAILS"
          activeKey={getTabKey()}
          onChange={onTabChange}
        >
          <TabPane
            tab={
              <span style={{ paddingLeft: '10px' }}>
                <span>{/* <Icon component={AppIcons.ClockIcon} /> */}</span>{' '}
                <span>Course details</span>
              </span>
            }
            key="DETAILS"
          ></TabPane>
          <TabPane
            tab={
              <span style={{ paddingLeft: '10px' }}>
                <span>{/* <Icon component={AppIcons.ClockIcon} /> */}</span> <span>Test</span>
              </span>
            }
            key="TEST"
          ></TabPane>
          <TabPane
            tab={
              <span style={{ paddingLeft: '10px' }}>
                <span>{/* <Icon component={AppIcons.ClockIcon} /> */}</span> <span>Visa</span>
              </span>
            }
            key="VISA"
          ></TabPane>

          <TabPane
            tab={
              <span style={{ paddingLeft: '10px' }}>
                <span>{/* <Icon component={AppIcons.ClockIcon} /> */}</span> <span>Documents</span>
              </span>
            }
            key="DOCUMENTS"
          >
            <Documents />
          </TabPane>

          <TabPane
            tab={
              <span style={{ paddingLeft: '10px' }}>
                <span>{/* <Icon component={AppIcons.ClockIcon} /> */}</span>{' '}
                <span>Debit/Credit</span>
              </span>
            }
            key="DEBIT_CREDIT"
          ></TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default connect()(StudentActivity);
