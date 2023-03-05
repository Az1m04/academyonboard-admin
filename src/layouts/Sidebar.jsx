import React, { useEffect, useState } from 'react';
// import logo from '@/assets/logo/logo.png';
// import smallLogo from '@/assets/logo/smallLogo.png';
import Icon, { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { Link, history } from 'umi';
import classNames from 'classnames';
import { routes } from './routes';
import CustomTooltip from '@/components/CustomTooltip';
import styles from './Sidebar.jsx';

const Sidebar = (props) => {
  const [displaySubRoutes, setDisplaySubRoutes] = useState({});
  const [displayNestedSubRoutes, setDisplayNestedSubRoutes] = useState({});

  const activeClass = 'bg-gray-200 pt-2 px-6 flex items-center cursor-pointer py-2';
  const inactiveClass = 'pt-2 px-6 flex items-center cursor-pointer py-2';
  const { secondaryColor, collapsed, location, isBarExpand } = props;
  const [sideBarWidth, setSideBarWidth] = useState(collapsed ? 80 : 250);

  useEffect(() => {
    setSideBarWidth(collapsed ? 80 : 250);
  }, [collapsed]);

  return (
    <div
      style={{
        backgroundColor: secondaryColor,
        borderRightWidth: '2px',
        borderColor: '#e8ebee',
        width: sideBarWidth,
        transition: '0.2s',
      }}
      className="h-screen overflow-y-auto overflow-x-hidden text-white "
    >
      {/* <div className="border-b px-2 pt-1 items-center justify-center">
        <div>
          <img
            src={collapsed ? smallLogo : logo}
            style={{
              height: 60,
            }}
            alt="Logo"
          />
        </div>
      </div> */}

      <div
        className="py-4"
        onMouseLeave={() => {
          if (!isBarExpand) {
            props.dispatch({
              type: 'global/setStates',
              payload: true,
              key: 'collapsed',
            });
          }
        }}
        onMouseEnter={() => {
          if (!isBarExpand) {
            props.dispatch({
              type: 'global/setStates',
              payload: false,
              key: 'collapsed',
            });
          }
        }}
      >
        {routes.map((route) => (
          <div
            key={route?.name}
            className={classNames('py-1 font-medium text-base delay-100', collapsed ? '' : '')}
          >
            <CustomTooltip show={collapsed} overlay={route?.name} placement="right">
              {route && route?.routes?.length > 0 ? (
                <>
                  <div
                    onClick={() => {
                      setDisplaySubRoutes({
                        [route.id]: !displaySubRoutes[route.id],
                      });
                      history.push(route.path);
                    }}
                    style={{
                      color: location.pathname.includes(route.id) ? '#000000' : '#000',
                    }}
                    className={classNames('flex justify-between', inactiveClass)}
                  >
                    <div className="flex">
                      <Icon component={route.icon} className="mt-1" />{' '}
                      <div className={classNames('delay-100 ml-3 pb-1', collapsed ? 'hidden' : '')}>
                        {route.name}
                      </div>
                    </div>
                    <div className=" flex items-center">
                      {displaySubRoutes[route.id] ? <CaretUpOutlined /> : <CaretDownOutlined />}
                    </div>
                  </div>
                  {displaySubRoutes[route.id] &&
                    route?.routes?.map((item) => (
                      <>
                        {item?.routes?.length > 0 ? (
                          <>
                            <div
                              onClick={() => {
                                setDisplayNestedSubRoutes({
                                  [item.id]: !displayNestedSubRoutes[item.id],
                                });
                                history.push(item.path);
                              }}
                              style={{
                                color: location.pathname.includes(item.id) ? '#000000' : '#000',
                              }}
                              className={classNames('flex justify-between ml-4', inactiveClass)}
                            >
                              <div className="flex">
                                <Icon component={item.icon} className="mt-1" />{' '}
                                <div
                                  className={classNames(
                                    'delay-100 ml-3 pb-1',
                                    collapsed ? 'hidden' : '',
                                  )}
                                >
                                  {item?.name}
                                </div>
                              </div>
                              <div className=" flex items-center">
                                {displayNestedSubRoutes[item?.id] ? (
                                  <CaretUpOutlined />
                                ) : (
                                  <CaretDownOutlined />
                                )}
                              </div>
                            </div>
                            {displayNestedSubRoutes[item?.id] &&
                              item?.routes?.map((nestedItem) => (
                                <div className="text-gray-900" key={nestedItem?.id}>
                                  <Link
                                    to={nestedItem?.path}
                                    style={{
                                      color: location.pathname.includes(nestedItem.id)
                                        ? '#000000'
                                        : '#000',
                                      transitionDuration: 'background-color 5s ease-out',
                                    }}
                                    className={classNames(
                                      location.pathname.includes(nestedItem.id)
                                        ? `${activeClass} ${styles.activecard}`
                                        : inactiveClass,
                                    )}
                                  >
                                    <div
                                      className={classNames(
                                        'delay-100  pb-1 pl-12',
                                        collapsed ? 'hidden' : '',
                                      )}
                                    >
                                      {nestedItem?.name}
                                    </div>
                                  </Link>
                                </div>
                              ))}
                          </>
                        ) : (
                          <div className="text-gray-900" key={item?.id}>
                            <Link
                              to={item?.path}
                              style={{
                                color: location.pathname.includes(item.id) ? '#000000' : '#000',
                                transitionDuration: 'background-color 5s ease-out',
                              }}
                              className={classNames(
                                location.pathname.includes(item.id)
                                  ? `${activeClass} ${styles.activecard}`
                                  : inactiveClass,
                              )}
                            >
                              <div className="flex pl-4">
                                <Icon component={item.icon} className="mt-1" />{' '}
                                <div
                                  className={classNames(
                                    'delay-100 ml-3 pb-1',
                                    collapsed ? 'hidden' : '',
                                  )}
                                >
                                  {item?.name}
                                </div>
                              </div>
                            </Link>
                          </div>
                        )}
                      </>
                    ))}
                </>
              ) : (
                <Link
                  to={route.path}
                  style={{
                    color: location.pathname.startsWith(route.id) ? '#000000' : '#000',
                    transitionDuration: 'background-color 5s ease-out',
                  }}
                  className={classNames(
                    location.pathname.startsWith(route.id)
                      ? `${activeClass} ${styles.activecard}`
                      : inactiveClass,
                  )}
                >
                  <div
                    className="flex items-center"
                    onClick={() => {
                      setDisplaySubRoutes({
                        [route.id]: !displaySubRoutes[route.id],
                      });
                    }}
                  >
                    <Icon component={route.icon} />{' '}
                    <div className={classNames('delay-100 pl-3 pb-1', collapsed ? 'hidden' : '')}>
                      {route.name}
                    </div>
                  </div>
                </Link>
              )}
            </CustomTooltip>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
