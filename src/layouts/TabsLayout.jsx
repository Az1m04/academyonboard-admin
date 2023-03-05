/* eslint-disable consistent-return */
/* eslint-disable no-lonely-if */
import React, { useState, useEffect } from 'react';
import { connect, history, Link, useLocation } from 'umi';
import { Tabs, Button } from 'antd';
import { getPageQuery } from '@/utils/utils';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';

const TabsLayout = ({ children }) => {
  const { TabPane } = Tabs;
  const [addProduct, displayAddProduct] = useState(true);
  const { pathname, query } = useLocation();
  const { task } = getPageQuery();

  useEffect(() => {
    if (pathname.includes('add') || query?.task || pathname.includes('drafts')) {
      displayAddProduct(false);
    } else {
      displayAddProduct(true);
    }
  }, [pathname]);

  const reqPath = () => {
    switch (pathname) {
      case '/hospital/equipments/all':
        return 'My Equipments';
      case '/hospital/contacts/all':
        return 'Hospital Contacts';
      case '/hospital/department':
        return 'Hospital Department';
      case '/hospital/profile':
        return 'Hospital Profile';
      case '/hospital/equipments/add':
        return 'Add Equipments';
      case '/hospital/contacts/add':
        return 'Add Contacts';
      case '/hospital/department/add':
        return 'Add Department';
      case '/hospital/profile/add':
        return 'Add Profile';
      default:
        if (pathname?.includes('drafts')) return 'My Drafts';
        break;
    }
  };
  return (
    <>
      <div className="text-xl font-semibold mb-4 mx-12" style={{ color: '#111642' }}>
        {reqPath()}
        {task && task === 'updateEquipments' && 'Product Name with detail'}
      </div>
      <div className="flex justify-between mb-4 border-b px-6 mx-6">
        <Tabs
          defaultActiveKey="equipments"
          className="w-full "
          onTabClick={(key) => {
            if (key === 'profile' && addProduct) {
              history.replace(`/hospital/profile`);
            } else if (key === 'department' && addProduct) {
              history.replace(`/hospital/department`);
            } else {
              if (addProduct) history.replace(`/hospital/${key}/all`);
              else history.replace(`/hospital/${key}/add`);
            }
          }}
          style={{ color: '#111642' }}
        >
          <TabPane
            tab={<span className="font-medium "> Hospital Equipments</span>}
            key="equipments"
          />
          <TabPane tab={<span className=" font-medium ">Hospital Contacts</span>} key="contacts" />

          <TabPane
            tab={<span className=" font-medium ">Hospital Department</span>}
            key="department"
          />

          <TabPane tab={<span className=" font-medium ">Hospital Profile</span>} key="profile" />
        </Tabs>
        {addProduct && (
          <div className="flex justify-end w-64">
            <Link to="/hospital/equipments/add">
              <Button type="primary" icon={<PlusOutlined style={{ fontSize: '12px' }} />}>
                Add Product
              </Button>
            </Link>
          </div>
        )}
        {pathname?.includes('drafts') && (
          <div className="flex justify-end w-64">
            <Link to={`/hospital/equipments/${pathname.split('drafts/')[1]}?task=updateEquipments`}>
              <Button type="primary" icon={<EditOutlined style={{ fontSize: '12px' }} />}>
                Update Product
              </Button>
            </Link>
          </div>
        )}
      </div>
      <div>{children}</div>
    </>
  );
};

export default connect(() => ({}))(TabsLayout);
