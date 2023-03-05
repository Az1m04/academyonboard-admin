import { getMenuData, getPageTitle } from '@ant-design/pro-layout';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useIntl, connect, Link } from 'umi';
import { getMatchMenu } from '@umijs/route-utils';
import Authorized from '@/utils/Authorized';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Result } from 'antd';
import moment from 'moment';
import Topbar from './Topbar';
import Sidebar from './Sidebar';
import { LeftOutlined } from '@ant-design/icons';
import logo from '@/assets/logo/logo.png';

const noMatch = (
  <Result
    status={403}
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/user/login">Go Login</Link>
      </Button>
    }
  />
);

const CustomLayout = (props) => {
  const {
    settings,
    route = {
      routes: [],
    },
    collapsed,
    isBarExpand,
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const { formatMessage } = useIntl();
  const { breadcrumb } = getMenuData(routes);
  const title = getPageTitle({
    pathname: location.pathname,
    formatMessage,
    breadcrumb,
    ...props,
  });
  const [sideBarWidth, setSideBarWidth] = useState(collapsed ? 80 : 250);

  const menuDataRef = useRef([]);

  const authorized = useMemo(
    () =>
      getMatchMenu(location.pathname || '/', menuDataRef.current).pop() || {
        authority: undefined,
      },
    [location.pathname],
  );
  moment.locale('en');

  useEffect(() => {
    setSideBarWidth(collapsed ? 80 : 250);
  }, [collapsed]);
  const collapseSideBar = () => {
    props.dispatch({
      type: 'global/setStates',
      payload: !isBarExpand,
      key: 'isBarExpand',
    });
    props.dispatch({
      type: 'global/setStates',
      payload: !collapsed,
      key: 'collapsed',
    });
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>

      <div className=" relative">
        <div
          onClick={() => collapseSideBar()}
          style={{ transition: '0.2s' }}
          className={`flex justify-center items-center w-6 h-6 border bg-white text-gray-700 font-bold z-50 -mr-3 absolute ${
            collapsed ? 'left-16' : 'left-60'
          } shadow top-16 text-xs -mt-3 rounded-full cursor-pointer`}
        >
          <LeftOutlined rotate={collapsed ? 180 : 0} />
        </div>
      </div>
      <div className="flex">
        <div className=" px-2 pt-1">
          <div className="bg-white">
            <img
              src={logo}
              style={{
                height: 63,
              }}
              alt="Logo"
            />
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#1B568F',
            width: '100%',
          }}
          className=" px-4  py-3 bg-none"
        >
          <Topbar />
        </div>
      </div>
      <div className="flex">
        <div className="flex flex-none">
          <Sidebar {...props} {...settings} />
        </div>
        <div className="justify-center flex-auto">
          <div
            style={{
              height: 'calc(100vh - 68px)',
              width: `calc(100vw - ${sideBarWidth}px)`,
              // width: '100%',
              transition: '0.2s',
            }}
            className="bg-gray-100 pb-4 px-6 overflow-y-auto overflow-x-hidden"
          >
            <Authorized authority={authorized.authority} noMatch={noMatch}>
              {children}
            </Authorized>
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default connect(({ settings, global }) => ({
  ...settings,
  collapsed: global.collapsed,
  isBarExpand: global?.isBarExpand,
}))(CustomLayout);
