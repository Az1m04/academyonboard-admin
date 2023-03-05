import { getIntials } from '@/utils/utils';
import { CaretDownFilled, LogoutOutlined, UploadOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import React from 'react';
import { history, connect } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

class AvatarDropdown extends React.Component {
  onMenuClick = (event) => {
    const { key } = event;

    if (key === 'logout') {
      const { dispatch } = this.props;

      if (dispatch) {
        dispatch({
          type: 'login/logout',
        });
      }
      return;
    }

    history.push(`/${key}`);
  };

  render() {
    const { currentUser } = this.props;
    const menuHeaderDropdown = (
      <Menu
        className={styles.menu}
        selectedKeys={[]}
        onClick={(val) => {
          this.onMenuClick(val);
        }}
      >
        <Menu.Item key="profile">
          <div className="flex justify-center">
            <Avatar
              size={80}
              src={
                currentUser?.personalDetails?.avatarUrl || currentUser?.personalDetails?.photoUrl
              }
              className="text-center uppercase"
              style={{ background: '#2874be' }}
            >
              {currentUser?.personalDetails?.displayName &&
                getIntials(currentUser?.personalDetails?.displayName)}
            </Avatar>
          </div>

          <div className="mt-2 text-center">
            <div className="font-medium text-blue-900 text-lg capitalize">
              {currentUser?.personalDetails?.displayName}
            </div>
            <div className="text-xs text-gray-700">{currentUser?.personalDetails?.email}</div>
          </div>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="upload/UploadPublicHolidays">
          <UploadOutlined /> Upload public holidays
        </Menu.Item>
        <Menu.Item key="logout">
          <LogoutOutlined />
          Logout
        </Menu.Item>
      </Menu>
    );

    return currentUser && currentUser?.personalDetails?.displayName ? (
      <HeaderDropdown trigger="click" overlay={menuHeaderDropdown}>
        <div className="flex items-center cursor-pointer uppercase">
          <Avatar
            size="large"
            src={currentUser?.personalDetails?.avatarUrl || currentUser?.personalDetails?.photoUrl}
            style={{ background: '#ffffff' }}
          >
            <span className="text-black">
              {currentUser && getIntials(currentUser?.personalDetails?.displayName)}
            </span>
          </Avatar>
          <div className="ml-2 flex items-center text-white hiddenSmall">
            <div className="font-medium text-lg capitalize">
              {currentUser?.personalDetails?.displayName}
              <CaretDownFilled className="mx-2 text-white" />
            </div>
          </div>
        </div>
      </HeaderDropdown>
    ) : (
      <span className={`${styles.action} ${styles.account}`}>
        <Spin
          size="small"
          style={{
            marginLeft: 8,
            marginRight: 8,
          }}
        />
      </span>
    );
  }
}

export default connect(({ user }) => ({
  currentUser: user.currentUser,
}))(AvatarDropdown);
