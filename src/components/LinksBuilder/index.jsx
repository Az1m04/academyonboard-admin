import { Button, Input, message, Popover, Tooltip } from 'antd';
import React, { useState } from 'react';
import { Link45deg, Pencil, Trash } from 'react-bootstrap-icons';

import ClickToCopy from '@/components/ClickToCopy';

import styles from './index.less';

/**
 * Allows entry of multiple links, supports editing and removal of added links.
 */
const LinksBuilder = ({ savedLinks, setSavedLinks }) => {
  const [inputLinkValue, setInputLinkValue] = useState('');

  /**
   * Adds the link to the list, avoids duplicates.
   */
  const addLinkClickHandler = () => {
    // Empty string check
    if (inputLinkValue.trim().length === 0) {
      message.warn(
        'No link found, doing nothing. Please add a valid link to the input to save it.',
      );
      return;
    }

    const isExisting = savedLinks.indexOf(inputLinkValue) > -1;
    if (!isExisting) {
      const joined = savedLinks.concat(inputLinkValue);
      setSavedLinks(joined);
      setInputLinkValue('');
    } else {
      message.info('Link already added, skipping.');
      setInputLinkValue('');
    }
  };

  const deleteLinkClickHandler = (linkToRemove) => {
    const truncatedList = savedLinks.filter((existingLink) => existingLink !== linkToRemove);
    setSavedLinks(truncatedList);
  };
  /**
   * Removes the link and pushes it to the editor for changes.
   * @param {*} linkToEdit
   */
  const editLinkClickHandler = (linkToEdit) => {
    // remove the link first
    const truncatedList = savedLinks.filter((existingLink) => existingLink !== linkToEdit);
    setSavedLinks(truncatedList);
    setInputLinkValue(linkToEdit);
  };

  const renderLinksManagerForm = () => {
    return (
      <div className={styles.LinkDisplayWrapper}>
        {savedLinks?.map((link) => (
          <div
            key=""
            className={`flex items-center border-b p-4 hover:bg-gray-100  ${styles.LinkRecord}`}
          >
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              className="truncate flex-auto font-medium"
              title="Click to navigate to the link in a new window."
            >
              {link}
            </a>
            {/* Icons */}
            <div className={`space-x-1 items-center ${styles.LinkActions}`}>
              {/* Copy */}
              <div>
                <Tooltip title="Copy link">
                  <ClickToCopy iconOnly textToCopy={link} />
                </Tooltip>
              </div>
              {/* Edit */}
              <div>
                <Tooltip title="Edit link">
                  <Button
                    type="link"
                    size="small"
                    className="p-0 m-0"
                    icon={<Pencil />}
                    onClick={() => {
                      editLinkClickHandler(link);
                    }}
                  />
                </Tooltip>
              </div>
              {/* Delete */}
              <div>
                <Tooltip title="Remove link">
                  <Button
                    type="link"
                    size="small"
                    className="p-0 m-0"
                    icon={<Trash />}
                    onClick={() => {
                      deleteLinkClickHandler(link);
                    }}
                  />
                </Tooltip>
              </div>
            </div>
          </div>
        ))}
        <div className="p-4 ">
          <div className="w-full">
            <Input
              className="w-full"
              autoFocus
              value={inputLinkValue}
              onChange={(evt) => {
                setInputLinkValue(evt.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addLinkClickHandler();
                }
              }}
              type="url"
              prefix={<Link45deg className="text-xl text-gray-500" />}
              suffix={
                <Button type="primary" onClick={addLinkClickHandler}>
                  Add
                </Button>
              }
              placeholder="Add a link"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <Popover
        content={renderLinksManagerForm}
        trigger="click"
        placement="bottomLeft"
        overlayClassName="app-popup"
      >
        {/* Underlying button that shows the link (if length == 1), or the count of the links (if >1) */}
        <Button style={{ display: 'flex' }} icon={<Link45deg className="text-lg" />}>
          {savedLinks.length > 1 && (
            <span className="pl-2 text-color-primary">Links ({savedLinks.length})</span>
          )}
          {/* List of selected links, truncated to max 180px width */}
          {savedLinks.length === 1 && (
            <span className="pl-2 truncate text-color-primary" style={{ maxWidth: '180px' }}>
              {/* {savedLinks[0]} */}
              Links ({savedLinks.length})
            </span>
          )}
          {savedLinks.length === 0 && <span className="pl-2">Link</span>}
        </Button>
      </Popover>
    </div>
  );
};

export default LinksBuilder;
