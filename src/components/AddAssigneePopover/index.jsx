import React, { useState } from 'react';
import { Popover, Input, Avatar } from 'antd';
import { getInitials } from '@/utils/common';
import emptySeatEmptyStateSvg from '@/assets/img/empty-states/SVG/empty-search-contact.svg';

const EmptyState = () => (
  <div className="flex content-center align-center h-full justify-center">
    <div className="text-center py-8">
      <div>
        <img
          className="mx-auto"
          src={emptySeatEmptyStateSvg}
          alt="No address"
          style={{ height: '80px' }}
        />
      </div>
      <div className="pt-8">
        <p className="font-bold text-blue-800 text-lg">No records found</p>
      </div>
    </div>
  </div>
);
const AddAssigneePopover = (props) => {
  const {
    children,
    assignees,
    searchAssignees,
    addAssignees,
    placement,
    placeholder,
    visibleChange,
  } = props;

  const [searchKeyword, setSearchKeyword] = useState('');

  return (
    <div>
      <Popover
        overlayInnerStyle={{ width: 300 }}
        trigger="click"
        overlayClassName="app-popup"
        onVisibleChange={visibleChange}
        placement={placement}
        onClick={() => setSearchKeyword('')}
        content={
          <>
            <div className="px-4 pt-4 pb-2">
              {/* Search Bar */}
              <Input
                value={searchKeyword}
                autoFocus
                placeholder={placeholder || 'Search by name, email...'}
                onChange={(e) => {
                  setSearchKeyword(e.target.value);
                  searchAssignees(e.target.value);
                }}
                onBlur={() => {
                  setSearchKeyword('');
                }}
                onFocus={(e) => e.stopPropagation()}
                allowClear
              />
            </div>
            <div style={{ maxHeight: 250, overflowY: 'auto' }} className="divide-y divide-gray-200">
              {Array.isArray(assignees) && assignees.length > 0
                ? assignees.map((party) => (
                    <div
                      aria-hidden="true"
                      className="hover:bg-gray-100"
                      key={party.partyId}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSearchKeyword('');
                        addAssignees(party);
                      }}
                    >
                      <div className="px-3 py-2 space-x-2 flex items-center cursor-pointer">
                        <Avatar
                          className="bg-blue-800"
                          src={party?.photoUrl || party?.publicResourceUrl}
                        >
                          {getInitials(party.partyName || party?.displayName)}
                        </Avatar>
                        <div className="flex-auto truncate">
                          <div className="text-black font-medium text-sm">
                            {party.partyName || party?.displayName}
                          </div>
                          <div className="text-gray-600text-sm truncate">{party.email}</div>
                        </div>
                      </div>
                    </div>
                  ))
                : EmptyState()}
            </div>
          </>
        }
      >
        {children}
      </Popover>
    </div>
  );
};

export default AddAssigneePopover;
