import React from 'react';
import './index.less';

import { Link } from 'umi';
import { Checkbox, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import EditLead from './EditLead';

const Leads = ({ editLead, children }) => {
  return (
    <>
      <div
        className="flex h-full"
        style={{
          paddingLeft: 20,
        }}
      >
        <div
          // style={{
          //   marginTop: '1rem',
          //   width: editLead?.visible && editLead?.purposeFor === 'students' ? '70.4%' : '100%',
          // }}
          className="w-full"
        >
          <div className="pr-4 mb-5 link-wrap">
            <Checkbox />
            <div className="px-5 rounded cursor-pointer ant-btn-primary">Visas</div>
            <div className="px-5 rounded cursor-pointer ant-btn-primary">Others</div>
            <div className="px-5 rounded cursor-pointer ant-btn-primary">Courses</div>
          </div>
          <div className="mt-8">{children}</div>
          <Link to="/leads/students/new">
            <Button
              style={{
                backgroundColor: 'rgb(27, 86, 143)',
                position: 'absolute',
                bottom: '2rem',
                right: editLead?.visible && editLead?.purposeFor === 'students' ? '40rem' : '2rem',
                border: 'none',
                height: '60px',
                width: '60px',
              }}
              shape="circle"
              icon={<PlusOutlined style={{ fontSize: '2rem', color: '#fff' }} />}
            />
          </Link>
        </div>
        {editLead?.visible && editLead?.purposeFor === 'students' && <EditLead />}
      </div>
    </>
  );
};

export default connect(({ leads }) => ({
  selectedLead: leads?.selectedLead,
  editLead: leads?.editLead,
}))(Leads);
