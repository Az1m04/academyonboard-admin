import React from 'react';
import PropTypes from 'prop-types';
import { Badge, Avatar } from 'antd';
import { CloseCircleFilled } from '@ant-design/icons';
import { getInitials } from '@/utils/common';

import styles from './index.less';

/**
 * @typedef {BadgeAvatar} - The purpose of this component to display avatar with badge
 */
const BadgeAvatar = ({ showBadge, onDelete, imgUrl, name, avatarSize }) => (
  <Badge
    className={styles.avatarDeleteBody}
    count={
      // will show delete icon
      showBadge ? <CloseCircleFilled className="text-red-500 pr-2" onClick={onDelete} /> : null
    }
  >
    <Avatar src={imgUrl} size={avatarSize} className={styles.AvatarBg}>
      {/* display initials */}
      {getInitials(name)}
    </Avatar>
  </Badge>
);

BadgeAvatar.propTypes = {
  /**
   * @type {showBadge} - is the visible state of badge
   */
  showBadge: PropTypes.bool,
  /**
   * @type {onDelete} - is the func to delete the avatar
   */
  onDelete: PropTypes.func,
  /**
   * @type {imgUrl} - is the image avatar of user
   */
  imgUrl: PropTypes.string,
  /**
   * @type {name} - is the name of user
   */
  name: PropTypes.string,
};

export default BadgeAvatar;
