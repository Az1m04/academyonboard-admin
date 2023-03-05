import { Select, Tooltip, Tag, Icon } from 'antd';
import React, { useState } from 'react';
import ZCPCheckValidation from '@/components/ZCPCheckValidation';
import { getTagColor } from '@/utils/formatUsaPhone';
import { getLeadStatusList } from '@/utils/utils';
import styles from './index.less';

const LeadDetailsSection = () => {
  const [editPriority, setEditPriority] = useState(false);
  const [editStatus, setEditStatus] = useState(false);
  const [editLookingFor, setEditLookingFor] = useState(false);
  const [editSource, setEditSource] = useState(false);

  const leadStatusList = getLeadStatusList();

  const priorities = [
    {
      key: 'PRIORITY_LOW',
      value: 'Low',
    },
    {
      key: 'PRIORITY_MEDIUM',
      value: 'Medium',
    },
    {
      key: 'PRIORITY_HIGH',
      value: 'High',
    },
  ];

  const status = [
    {
      key: 'new',
      value: 'New',
    },
    {
      key: 'won',
      value: 'Won',
    },
    {
      key: 'lost',
      value: 'Lost',
    },
    {
      key: 'cold',
      value: 'Cold',
    },
    {
      key: 'potential',
      value: 'Potential',
    },
    {
      key: 'contacted',
      value: 'Contacted',
    },
    {
      key: 'interested',
      value: 'Interested',
    },
  ];

  const leadDataSources = [
    {
      key: 'new',
      value: 'New',
    },
    {
      key: 'won',
      value: 'Won',
    },
    {
      key: 'lost',
      value: 'Lost',
    },
    {
      key: 'cold',
      value: 'Cold',
    },
    {
      key: 'potential',
      value: 'Potential',
    },
    {
      key: 'contacted',
      value: 'Contacted',
    },
    {
      key: 'interested',
      value: 'Interested',
    },
  ];

  const OnSelectInput = ({
    id,
    InitialValue,
    placeholder,
    onChange,
    onBlur,
    options,
    mode,
    optionFilterProp,
  }) => (
    <Select
      id={id}
      // getPopupContainer={(trigger) => trigger.parentNode}
      showSearch
      autoFocus
      mode={mode}
      style={{ width: '200px' }}
      defaultValue={InitialValue}
      placeholder={placeholder}
      optionFilterProp={optionFilterProp || 'children'}
      onChange={onChange}
      onBlur={onBlur}
    >
      {options}
    </Select>
  );

  return (
    <div className="rounded shadow bg-white text-sm mb-4">
      <div className="flex justify-between px-6 py-4 ">
        <div className="text-left">
          <div className="font-semibold text-lg text-black">Lead details</div>
        </div>
      </div>
      {/* Priority */}
      <div className="flex justify-between px-6 py-2 ">
        <div className="text-gray-700 mr-2">Priority</div>
        <div className={`flex justify-end ${styles.Wrapper}`}>
          <div className="font-semibold text-black">
            {editPriority && (
              <OnSelectInput
                id="select-priority"
                // InitialValue={details?.currencyUomId}
                placeholder="Select priority"
                onChange={() => {
                  setEditPriority(false);
                }}
                optionFilterProp="value"
                onBlur={() => setEditPriority(false)}
                options={priorities.map(priority => (
                  <Select.Option key={priority.key} value={priority.value}>
                    <div className="flex">
                      <div
                        style={{ background: getTagColor(priority.value) }}
                        className=" ml-4  mt-2 rounded-full w-4 h-4 "
                      />
                      <div>
                        <span className="ml-2">{priority.value}</span>
                      </div>
                    </div>
                  </Select.Option>
                ))}
              />
            )}
            {!editPriority && (
              <ZCPCheckValidation
                show
                fallback={<span className="text-gray-500 font-normal"> Not available </span>}
              >
                High
              </ZCPCheckValidation>
            )}
          </div>
          <div className="ml-2">
            <Tooltip placement="right" title="Edit">
              <Icon type="edit"
                id="edit-priority"
                className={`text-sm cursor-pointer text-blue-700 ${styles.EditContainer}`}
                onClick={() => {
                  setEditPriority(true);
                }}
              />
            </Tooltip>
          </div>
        </div>
      </div>
      {/* Status */}
      <div className="flex justify-between px-6 py-2 ">
        <div className="text-gray-700 mr-2">Status</div>
        <div className={`flex justify-end  ${styles.Wrapper}`}>
          <div className="font-semibold text-black">
            {editStatus && (
              <OnSelectInput
                id="select-status"
                InitialValue={leadStatusList?.value}
                placeholder="Select status"
                onChange={() => {
                  setEditStatus(false);
                }}
                onBlur={() => setEditStatus(false)}
                options={leadStatusList.map(item => (
                  <Select.Option value={item.value} key={item.value}>
                    {item.text}
                  </Select.Option>
                ))}
              />
            )}
            {!editStatus && (
              <ZCPCheckValidation
                show
                fallback={<span className="text-gray-500 font-normal"> Not available </span>}
              >
                <Tag className="w-full text-center"
                  color={getTagColor(leadStatusList.value)}
                >
                  Won
                </Tag>
              </ZCPCheckValidation>
            )}
          </div>
          <div className="ml-2">
            <Tooltip placement="right" title="Edit">
              <Icon type="edit"
                id="edit-status"
                className={`text-sm cursor-pointer text-blue-700 ${styles.EditContainer}`}
                onClick={() => {
                  setEditStatus(!editStatus);
                }}
              />
            </Tooltip>
          </div>
        </div>
      </div>
      {/* Looking for */}
      <div className="flex justify-between px-6 py-2 ">
        <div className="text-gray-700 mr-2">Looking for</div>
        <div className={`flex justify-end ${styles.Wrapper}`}>
          <div className="font-semibold text-black">
            {editLookingFor && (
              <OnSelectInput
                id="select-lookingfor"
                mode="tags"
                InitialValue="Web app"
                placeholder="Select requirement"
                onBlur={() => setEditLookingFor(false)}
                options={status?.map(item => (
                  <Select.Option value={item.value} key={item.key}>
                    {item.value}
                  </Select.Option>
                ))}
              />
            )}
            {!editLookingFor && (
              <ZCPCheckValidation
                show
                fallback={<span className="text-gray-500 font-normal"> Not available </span>}
              >
                <div className="text-right">Mobile Application</div>
              </ZCPCheckValidation>
            )}
          </div>
          <div className="ml-2">
            <Tooltip placement="right" title="Edit">
              <Icon type="edit"
                id="edit-lookingfor"
                className={`text-sm cursor-pointer text-blue-700 ${styles.EditContainer}`}
                onClick={() => {
                  setEditLookingFor(!editLookingFor);
                }}
              />
            </Tooltip>
          </div>
        </div>
      </div>
      {/* Source */}
      <div className="flex justify-between px-6 py-2 ">
        <div className="text-gray-700 ">Source</div>
        <div className={`flex justify-end ${styles.Wrapper}`}>
          <div className="font-semibold text-black">
            {editSource && (
              <OnSelectInput
                id="select-source"
                InitialValue="Cold call"
                placeholder="Select source"
                onChange={() => {
                  setEditSource(false);
                }}
                onBlur={() => setEditSource(false)}
                options={leadDataSources?.map(item => (
                  <Select.Option value={item.value} key={item.key}>
                    {item.value}
                  </Select.Option>
                ))}
              />
            )}
            {!editSource && (
              <ZCPCheckValidation
                show
                fallback={<span className="text-gray-500 font-normal"> Not available </span>}
              >
                Cold call
              </ZCPCheckValidation>
            )}
          </div>
          <div className="ml-2">
            <Tooltip placement="right" title="Edit">
              <Icon type="edit"
                id="edit-source"
                className={`text-sm cursor-pointer text-blue-700 ${styles.EditContainer}`}
                onClick={() => {
                  setEditSource(!editSource);
                }}
              />
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetailsSection;
