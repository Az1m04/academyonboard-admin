import React from 'react';
import PropTypes from 'prop-types';
// import appConfig from '@/config/appConfig';

/**
 *
 *@CategoryPill - Renders the pill for a category using categories name and colors.
 */
const CategoryPill = (props) => {
  const { id, name, foregroundColor, backgroundColor, onClickHandler } = props;

  return (
    <button
      type="button"
      title={name}
      style={{
        backgroundColor: `${backgroundColor}`,
        color: `${foregroundColor}`,
        maxWidth: '100px',
        minWidth: '100px',
      }}
      onClick={() => {
        if (onClickHandler) {
          onClickHandler({ id, name, foregroundColor, backgroundColor });
        }
      }}
      className="flex-none truncate rounded-full px-2 py-1 text-xs text-center"
    >
      {name}
    </button>
  );
};

// TODO : PLease don't remove this code
// CategoryPill.defaultProps = {
//   id: 'undefined',
//   name: 'Personal',
//   foregroundColor: '#ffffff',
//   backgroundColor: appConfig.general.primaryColor,
// };

CategoryPill.propTypes = {
  /**
   * @categories paramType {string} - Id of the category
   */
  id: PropTypes.string,
  /**
   * @categories paramType {string} - Name of the category, example 'Personal'
   */
  name: PropTypes.string,
  /**
   * @type paramType {string} - Foreground color of the category, defaults to #ffffff
   */
  foregroundColor: PropTypes.string,
  /**
   * @category paramType {string} - Background color of the category, defaults to appConfig.general.primaryColor
   */
  backgroundColor: PropTypes.string,
  /**
   * @category paramType {func} - Callback invoked when the category pill is clicked.
   */
  onClickHandler: PropTypes.func,
};

export default CategoryPill;
