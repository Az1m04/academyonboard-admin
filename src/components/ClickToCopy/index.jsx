import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Tooltip } from 'antd';
import { CheckCircleFill, Files } from 'react-bootstrap-icons';

/**
 * Let's you copy any text.
 * Example usage
 * <ClickToCopy
              title={task?.id}
              beforeCopiedTooltipTitle="Click to copy task id."
              afterCopiedTooltipTitle="Task id copied to clipboard."
              textToCopy={task?.id}
            />
 *
 * @param {*} param0
 */
const ClickToCopy = ({
  title,
  afterCopiedTooltipTitle,
  beforeCopiedTooltipTitle,
  textToCopy,
  iconOnly,
  showCopyIconWithTitle,
  buttonType,
}) => {
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const clickToCopyButtonHandler = () => {
    navigator.clipboard.writeText(textToCopy);
    setCopiedToClipboard(true);
  };

  return (
    <>
      <Tooltip
        title={
          copiedToClipboard ? (
            <div>
              <CheckCircleFill className="pr-1" /> {afterCopiedTooltipTitle}
            </div>
          ) : (
            beforeCopiedTooltipTitle
          )
        }
        afterVisibleChange={(isVisible) => {
          if (!isVisible) {
            // tooltip just got hidden, reset the text for next tooltip
            setCopiedToClipboard(false);
          }
        }}
      >
        {iconOnly ? (
          <Button
            onClick={clickToCopyButtonHandler}
            type={buttonType}
            size="small"
            className="p-0 m-0"
            icon={<Files />}
          />
        ) : (
          <Button
            onClick={clickToCopyButtonHandler}
            type={buttonType}
            size="small"
            className="p-0 m-0"
          >
            {title}
            {showCopyIconWithTitle ? <Files className="ml-1" /> : ''}
          </Button>
        )}
      </Tooltip>
    </>
  );
};

ClickToCopy.defaultProps = {
  title: 'Copy',
  beforeCopiedTooltipTitle: 'Click to copy',
  afterCopiedTooltipTitle: 'Copied to clipboard',
  iconOnly: false,
  showCopyIconWithTitle: true,
  textToCopy: 'Nothing to copy',
  buttonType: 'text',
};
ClickToCopy.propTypes = {
  /**
   * @type {title} is the title of the button in case iconOnly mode is false. Defaults to Copy
   */
  title: PropTypes.string,
  /**
   * @type {beforeCopiedTooltipTitle} Tooltip text to display when user hovers over the button before clicking on it.
   */
  beforeCopiedTooltipTitle: PropTypes.string,
  /**
   * @type {afterCopiedTooltipTitle} Tooltip text to display after user clicks on the button.
   */
  afterCopiedTooltipTitle: PropTypes.string,
  /**
   * @type {iconOnly} If true button is not rendered with a title, instead only a copy icon is rendered with no padding or margin. Defaults to false
   */
  iconOnly: PropTypes.bool,
  /**
   * @type {showCopyIconWithTitle} If false does not render the copy icon next to the button with title. Defaults to true.
   */
  showCopyIconWithTitle: PropTypes.string,
  /**
   * @type {textToCopy} Text to copy to the clipboard once user clicks on the button. Defaults to empty string.
   */
  textToCopy: PropTypes.string,
  /**
   * @type {buttonType} Button type to use one of ['text', 'link', 'primary'].
   */
  buttonType: PropTypes.string,
};
export default ClickToCopy;
