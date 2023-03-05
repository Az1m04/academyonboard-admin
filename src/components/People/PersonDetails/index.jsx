import React from 'react';
import { Avatar, Skeleton } from 'antd';
import PropTypes from 'prop-types';
import { getInitials } from '@/utils/common';

/**
 * @PersonDetails - Renders the details (photo, name, email etc.) for a person. See ./index.md for usage.
 */

const PersonDetails = ({
  displayName,
  photoUrl,
  secondaryText,
  extraContent,
  showInReverseOrder,
  showLoadingSkeleton,
  wrapperClassName,
  displayNameWrapperClass,
  isSelf,
}) => {
  return (
    <div
      className={`flex items-center space-x-3 ${
        showInReverseOrder ? 'space-x-reverse flex-row-reverse' : ''
      } ${wrapperClassName}`}
    >
      <div>
        {showLoadingSkeleton ? (
          <Skeleton.Avatar active size="small" shape="circle" />
        ) : (
          <Avatar src={photoUrl} className="bg-primary">
            {getInitials(displayName)}
          </Avatar>
        )}
      </div>
      <div className={showInReverseOrder ? 'text-right' : 'text-left'}>
        {showLoadingSkeleton ? (
          <Skeleton.Input style={{ width: 150 }} active size="small" shape="default" />
        ) : (
          <>
            <div className={`text-black font-medium text-sm ${displayNameWrapperClass}`}>
              {isSelf ? `${displayName} (You)` : displayName}
            </div>
            {secondaryText && <div className="text-sm text-gray-600">{secondaryText}</div>}
            {extraContent || null}
          </>
        )}
      </div>
    </div>
  );
};

PersonDetails.defaultProps = {
  showLoadingSkeleton: false,
  showInReverseOrder: false,
  photoUrl: null,
  secondaryText: null,
  extraContent: null,
  wrapperClassName: '',
  displayNameWrapperClass: '',
  isSelf: false,
};

PersonDetails.propTypes = {
  /**
   * @param {string} displayName : is the full name of the person.
   */
  displayName: PropTypes.string.isRequired,
  /**
   * @param {string} reverseOrder : if true shows the text first and avatar photo after, useful for rtl alignments. Defaults to false
   */
  showInReverseOrder: PropTypes.bool,
  /**
   * @param {string} showLoadingSkeleton : if true shows loading skeleton state
   */
  showLoadingSkeleton: PropTypes.bool,
  /**
   * @param {string} photoUrl : is the avatar based photo url of the person if exists (optional).
   */
  photoUrl: PropTypes.string,
  /**
   * @param {string} secondaryText : is the secondary text that can be used to render email, position title etc..
   */
  secondaryText: PropTypes.string,
  /**
   * @param {node} extraContent : is the extra content that can be shown, example 'owner' shown at the bottom of email. Defaults to null
   */
  extraContent: PropTypes.node,
  /**
   * @param {string} wrapperClassName : is the extra class to be applied to wrapper div, use for adding/remove padding.
   */
  wrapperClassName: PropTypes.string,
  /**
   * @param {string} displayNameWrapperClass : is the extra class to be applied to the div showing the name of person, example use would be to show clickable behavior (text-clickable).
   */
  displayNameWrapperClass: PropTypes.string,
  /**
   * @param {bool} isSelf : whether the profile is that of logged in user, if true displays (You) next to the display name. Defaults to false.
   */
  isSelf: PropTypes.bool,
};

export default PersonDetails;
