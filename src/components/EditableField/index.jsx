import React, { useEffect, useState } from 'react';
import { Input, Tooltip, Button, message } from 'antd';

const EditableField = ({
  onUpdateHandler,
  inputText,
  textStyles,
  inputStyles,
  type,
  editBeforeCreate,
}) => {
  const [updateMode, setUpdateMode] = useState(false);
  const [showMoreName, setShowMoreName] = useState(false);
  const [inputValue, setInputValue] = useState(inputText);

  const inputRef = React.useRef(null);

  useEffect(() => {
    setInputValue(inputText);
  }, [inputText]);

  useEffect(() => {
    if (updateMode === true) {
      inputRef?.current?.focus({
        cursor: 'all',
      });
    }
  }, [updateMode]);

  const renderInputField = () => {
    if (!updateMode)
      return (
        <div className="flex justify-start items-center cursor-pointer w-full">
          {editBeforeCreate && (
            <Tooltip title="Click to edit">
              <div
                onClick={() => {
                  setUpdateMode(true);
                }}
                className={`${textStyles} w-full`}
              >
                {inputText}
              </div>
            </Tooltip>
          )}
          {!editBeforeCreate && (
            <div>
              <Tooltip title="Click to edit">
                <span
                  onClick={() => {
                    setUpdateMode(true);
                  }}
                  className={textStyles}
                >
                  {inputText?.slice(0, showMoreName ? inputText?.length : 250)}
                  {inputText?.length > 250 && !showMoreName && '...'}
                </span>
              </Tooltip>
              {inputText?.length > 250 && (
                <span
                  aria-hidden="true"
                  onClick={() => setShowMoreName(!showMoreName)}
                  className="text-blue-600 pl-2 font-normal text-sm cursor-pointer"
                >
                  {showMoreName ? '... less' : 'See more'}
                </span>
              )}
            </div>
          )}
        </div>
      );
    return (
      <div>
        <Input.TextArea
          className={inputStyles}
          size={type === 'task' ? 'large' : null}
          ref={inputRef}
          value={inputValue}
          autoSize={{ minRows: 1, maxRows: 6 }}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
        />
        <div className="flex justify-end">
          <Button onClick={() => setUpdateMode(false)} size="small">
            Cancel
          </Button>{' '}
          <Button
            disabled={inputValue.length === 0 || inputValue.trim().length === 0}
            className={`ml-2 ${
              inputValue.length === 0 || inputValue.trim().length === 0 ? '' : 'bg-blue-800'
            }`}
            size="small"
            type="primary"
            onClick={() => {
              onUpdateHandler(inputValue, () => {
                setUpdateMode(false);
                if (editBeforeCreate) return;
                message.success('Name updated successfully!');
              });
            }}
          >
            Update
          </Button>
        </div>
      </div>
    );
  };
  return <div className={type === 'task' ? 'px-4 py-2 border-b' : null}>{renderInputField()}</div>;
};

export default EditableField;
