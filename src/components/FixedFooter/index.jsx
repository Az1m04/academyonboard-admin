import React from 'react';
import { connect } from 'umi';
import { Row } from 'antd';

const FixedFooter = ({ children, collapsed, classes }) => (
  <>
    <div style={{ paddingTop: 80 }}></div>
    <div
      className="fixedFooter"
      style={{
        width: collapsed ? 'calc(100% - 80px)' : 'calc(100% - 250px)',
        zIndex: 1000,
      }}
    >
      <Row type="flex" justify="end">
        <div
          style={{
            padding: 10,
          }}
          className={`w-full ${classes}`}
        >
          {children}
        </div>
      </Row>
    </div>
  </>
);
export default connect(({ global }) => ({ collapsed: global.collapsed }))(FixedFooter);
