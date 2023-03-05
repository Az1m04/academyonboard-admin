import CheckValidation from '@/components/CheckValidation';

import { getInitials, getSingularPlural } from '@/utils/common';
import { Avatar, Button, Checkbox, Form, Input, Modal, Select, Tag } from 'antd';
import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';

import { PersonPlusFill, ArrowLeftCircleFill, XCircle } from '@/utils/AppIcons';
import PropTypes from 'prop-types';
import PersonDetails from '@/components/People/PersonDetails';
import styles from './styles.less';

/**
 * PeoplePicker component, use it to pick people or person from the list of account members.
 * To see more usage and examples see ./index.md file for documentation.
 *
 * @param {*} param0
 * @returns
 */
const PeoplePicker = ({
  visible,
  setVisible,
  savedValues,
  search,
  notes,
  onChange,
  accessList,
  title,
  subtitle,
  buttonName,
  loading,
  suggestedValues,
  suggestedValuesRoleName,
  actionButtonLabel,
  showActionInfo,
  role,
  allowMultipleSelection,
}) => {
  const [form] = Form.useForm();
  const [keyword, setKeyword] = useState('');
  const [notifyPeople, setNotifyPeople] = useState(false);
  const [dropdownList, setDropdownList] = useState([]);
  const [selectedList, setSelectedList] = useState([]); // for tracking the selected list of people

  const isAnyValueSelected = !!selectedList?.length;

  useEffect(() => {
    if (buttonName) {
      // eslint-disable-next-line no-param-reassign
      actionButtonLabel = buttonName;
    }

    if (role) {
      role({ value: 'MEMBER', name: 'Member' });
    }
  }, []);

  const action = (val) => {
    search(val)
      .then((res) => {
        if (res) {
          setDropdownList(
            res?.records?.filter((rec) => !savedValues?.map(({ id }) => id).includes(rec.id)),
          );
        }
      })
      .catch(() => {});
  };

  const searchMembers = React.useCallback(debounce(action, 400), []);

  useEffect(() => {
    if (keyword) searchMembers(keyword);
  }, [keyword]);

  const tagRender = ({ label, closable, onClose }) => {
    return (
      <Tag
        closable={closable}
        onClose={onClose}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 61,
          padding: '2px 12px 2px 6px',
          margin: 2,
        }}
      >
        {label}
      </Tag>
    );
  };
  const onFinish = (values) => {
    if (values.message && notes) {
      notes(values.message);
    }

    // extract the values
    const selectedPeopleDataRecordList = selectedList?.map(
      (personRecord) => personRecord?.dataRecord,
    );
    onChange(selectedPeopleDataRecordList);
    form.resetFields();
    setSelectedList([]);
    setKeyword('');
  };
  const onSearch = (val) => {
    setKeyword(val);
  };
  const AccessList = () => (
    <Form.Item name="access" className={`w-full ${styles.zeroMarginBottom}`}>
      <Select
        getPopupContainer={(trigger) => trigger.parentNode}
        onBlur={() => {
          setDropdownList([]);
        }}
        size="large"
        defaultValue="Member"
        className="font-medium"
        onChange={(val) => {
          role(accessList?.filter((list) => list?.value === val));
        }}
      >
        {accessList?.map((list) => (
          <Select.Option className="font-medium" value={list?.value} key={list.value}>
            {list?.name}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );

  /**
   * Adds a person record to the locally maintained list of people records, avoids duplicates.
   *
   * @param {*} personRecord in the format {value:id, label:ReactNode, key:id}
   * @param {*} dataRecord is the person record {displayName, email, id, photoUrl}
   */
  const addPersonToSelectedListOfPeople = (personRecord, dataRecord) => {
    // check for duplicates
    const isExisting = selectedList?.filter((existing) => existing?.value === personRecord.value)
      .length;
    if (!isExisting) {
      if (!allowMultipleSelection) {
        // single selection mode only, invoke the onChange and reset fields and close
        onChange(dataRecord);
        form.resetFields();
        setSelectedList([]);
        setKeyword('');
      } else {
        const updatedList = selectedList?.concat({ ...personRecord, dataRecord });
        setSelectedList(updatedList);
      }
    }
  };

  const removePersonFromSelectedListOfPeople = (personRecordId) => {
    // get the list minus the record with id to be removed.
    const truncatedList = selectedList?.filter((existing) => existing.value !== personRecordId);
    setSelectedList(truncatedList);
  };

  const selectedPersonTagRenderer = (personDetails) => (
    <div
      className="space-x-2 flex items-center text-sm"
      title={`${personDetails.displayName} (${personDetails.email})`}
    >
      <Avatar size="small" className="bg-primary" src={personDetails?.photoUrl}>
        {getInitials(personDetails?.displayName)}
      </Avatar>
      <div className="text-black font-medium text-sm truncate" style={{ maxWidth: 150 }}>
        {personDetails?.displayName}
      </div>
    </div>
  );

  return (
    <Modal
      centered
      wrapClassName="app-modal-flat"
      destroyOnClose
      maskClosable={false}
      keyboard={false}
      title={
        <span className="flex items-center">
          <span>
            <Button
              style={{ border: 'none' }}
              icon={
                <CheckValidation
                  show={isAnyValueSelected}
                  fallback={
                    <PersonPlusFill
                      style={{ border: 'none', fontSize: '24px', marginRight: 8, color: '#007aff' }}
                    />
                  }
                >
                  <ArrowLeftCircleFill
                    style={{ border: 'none', fontSize: '24px', marginRight: 8, color: '#007aff' }}
                  />
                </CheckValidation>
              }
              onClick={() => {
                setSelectedList([]);
                form.resetFields();
              }}
            />
          </span>

          <div className="flex flex-col">
            <span className="font-semibold">
              {allowMultipleSelection && title
                ? title(selectedList?.map((personRecord) => personRecord?.dataRecord))
                : 'Share with people'}
            </span>
            <CheckValidation show={subtitle}>
              <span className="font-normal text-sm">{subtitle}</span>
            </CheckValidation>
          </div>
        </span>
      }
      visible={visible}
      onCancel={() => {
        setVisible(false);
        setSelectedList([]);
        form.resetFields();
      }}
      footer={null}
    >
      <div className="mt-2">
        <Form form={form} onFinish={onFinish} colon={false}>
          <div className="flex items-center mb-6 space-x-3 px-3" gutter={24}>
            <div
              className="flex-grow"
              xxl={accessList ? 18 : 24}
              xl={accessList ? 18 : 24}
              lg={accessList ? 18 : 24}
              md={24}
              sm={24}
              xs={24}
            >
              <Form.Item className={styles.zeroMarginBottom}>
                <CheckValidation show={visible}>
                  <div className="">
                    <Select
                      showSearch
                      size="large"
                      style={{ width: '100%' }}
                      onSearch={onSearch}
                      autoFocus
                      defaultOpen
                      placeholder="Add people"
                      onFocus={() => !allowMultipleSelection && onSearch('')}
                      suffixIcon={<XCircle />}
                      onDeselect={(deselectedValue) => {
                        removePersonFromSelectedListOfPeople(deselectedValue.value);
                      }}
                      onSelect={(selectedValue) => {
                        const selectedOptionDataRecord = dropdownList?.filter(
                          (p) => p?.id === selectedValue.value,
                        )[0];
                        addPersonToSelectedListOfPeople(selectedValue, selectedOptionDataRecord);
                      }}
                      onChange={(selectedOption) => {
                        // remove the selected record from the dropdown list
                        setDropdownList(
                          dropdownList?.filter(
                            (rec) => !selectedOption?.map(({ value }) => value).includes(rec.id),
                          ),
                        );
                        setDropdownList([]);
                        setKeyword('');
                      }}
                      optionLabelProp="label"
                      onClose={() => form.resetFields()}
                      tagRender={tagRender}
                      // autoFocus
                      defaultActiveFirstOption={false}
                      value={selectedList}
                      mode="multiple"
                      labelInValue
                      notFoundContent={null}
                      filterOption={false}
                      onKeyDown={(event) => {
                        if (event.ctrlKey && event.keyCode === 13) {
                          // submit the form
                          event.preventDefault();
                          form.submit();
                        }
                      }}
                      onBlur={() => {
                        setKeyword('');
                        setDropdownList([]);
                      }}
                    >
                      {(keyword || !allowMultipleSelection ? dropdownList : suggestedValues)
                        ?.filter((rec) => !savedValues?.map(({ id }) => id).includes(rec.id))
                        .filter((rec) => !selectedList?.map(({ id }) => id).includes(rec.id))
                        ?.map((record) => (
                          <Select.Option
                            key={record?.id}
                            value={record?.id}
                            label={selectedPersonTagRenderer(record)}
                          >
                            <div className="flex justify-between items-center">
                              <div className="px-3 py-2 space-x-2 flex items-center cursor-pointer">
                                <Avatar className="bg-blue-800" src={record?.photoUrl}>
                                  {getInitials(record.displayName)}
                                </Avatar>
                                <div className="flex-auto truncate">
                                  <div className="text-black font-medium text-sm flex">
                                    <div>{record?.displayName}</div>
                                  </div>
                                  <div className="text-gray-600text-sm truncate">
                                    {record.email}
                                  </div>
                                </div>
                              </div>
                              <div className="flex justify-end font-normal text-gray-500 items-center">
                                {suggestedValues.filter((data) => data?.id === record?.id)[0]
                                  ?.id === record?.id
                                  ? record?.roleName
                                  : suggestedValuesRoleName}
                              </div>
                            </div>
                          </Select.Option>
                        ))}
                    </Select>
                  </div>
                  {/* Show suggested values first. */}
                  <div
                    style={{ maxHeight: '40vh', paddingTop: 1, paddingBottom: 1 }}
                    className="w-full overflow-y-auto"
                  >
                    {suggestedValues
                      ?.filter((rec) => !savedValues?.map(({ id }) => id).includes(rec.id))
                      .filter((rec) => !selectedList?.map(({ id }) => id).includes(rec.id))
                      ?.map((record) => (
                        <div
                          key={record.id + Math.random()}
                          aria-hidden="true"
                          className="flex justify-between items-center hover:bg-gray-100 rounded-lg px-2 py-1 cursor-pointer"
                          onClick={() => {
                            const selectedValue = {
                              value: record.id,
                              label: selectedPersonTagRenderer(record),
                              key: record.id,
                            };
                            addPersonToSelectedListOfPeople(selectedValue, record);
                            setDropdownList(
                              dropdownList?.filter(
                                (rec) =>
                                  !suggestedValues?.map(({ value }) => value).includes(rec.id),
                              ),
                            );
                            setDropdownList([]);
                            setKeyword('');
                          }}
                        >
                          <div>
                            <PersonDetails
                              wrapperClassName="px-3 py-2"
                              displayName={record?.displayName}
                              photoUrl={record?.photoUrl}
                              secondaryText={record?.email}
                            />
                          </div>
                          <div className="flex justify-end font-medium italic text-gray-500 items-center">
                            {suggestedValues.filter((data) => data?.id === record?.id)[0]?.id ===
                            record?.id
                              ? record?.roleName
                              : suggestedValuesRoleName}
                          </div>
                        </div>
                      ))}
                  </div>
                </CheckValidation>
              </Form.Item>
            </div>
            <div
              className="flex-none"
              xxl={accessList ? 6 : 0}
              xl={accessList ? 6 : 0}
              lg={accessList ? 6 : 0}
              md={accessList ? 24 : 0}
              sm={accessList ? 24 : 0}
              xs={accessList ? 24 : 0}
            >
              <Form.Item className={`items-center ${styles.zeroMarginBottom}`} name="memberRole">
                {accessList && <AccessList />}
              </Form.Item>
            </div>
          </div>

          {/* {isAnyValueSelected && ( */}
          <div style={{ maxHeight: '40vh', overflow: 'auto' }}>
            {savedValues?.map((member) => (
              <div
                key={member.id}
                className="px-3 py-2 space-x-2 flex items-center cursor-pointer"
                onClick={() => {
                  const selectedValue = {
                    value: member.id,
                    label: selectedPersonTagRenderer(member),
                    key: member.id,
                  };
                  addPersonToSelectedListOfPeople(selectedValue, {
                    id: member?.id,
                    email: member?.email,
                    displayName: member?.name,
                    photoUrl: member?.publicResourceUrl,
                  });
                  setDropdownList(
                    dropdownList?.filter(
                      (rec) => !suggestedValues?.map(({ value }) => value).includes(rec.id),
                    ),
                  );
                  setDropdownList([]);
                  setKeyword('');
                }}
              >
                <Avatar className="bg-blue-800" src={member?.photoUrl || member?.publicResourceUrl}>
                  {getInitials(member?.name || member?.partyName || member?.displayName)}
                </Avatar>
                <div className="flex-auto truncate">
                  <div className="text-black text-sm flex font-medium">
                    <span className=" capitalize">
                      {member.name || member.partyName || member?.displayName}
                    </span>
                    <div className="flex justify-end w-full">{member.email}</div>
                  </div>
                  <div style={{ color: '#007aff' }} className="text-xs flex items-center">
                    {member?.roles || suggestedValuesRoleName}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* )} */}
          <CheckValidation show={notes}>
            <div className="pb-2">
              <Checkbox
                checked={notifyPeople}
                onChange={() => {
                  if (!notifyPeople) {
                    form.setFieldsValue({ message: '' });
                  }
                  setNotifyPeople(!notifyPeople);
                }}
              >
                <span className="font-semibold">Notify people</span>
              </Checkbox>
            </div>
          </CheckValidation>
          {notifyPeople && (
            <Form.Item
              name="message"
              rules={[
                {
                  whitespace: true,
                  message: 'Please enter message!',
                },
              ]}
            >
              <Input.TextArea rows={4} placeholder="Not functional yet!" />
            </Form.Item>
          )}
          {/* Action buttons */}
          <div className="flex justify-end items-center border-t p-4 mt-2">
            <CheckValidation show={showActionInfo && selectedList.length > 0}>
              <div className="flex items-center font-medium italic pr-1 text-gray-600">{`${
                selectedList?.length
              } ${getSingularPlural('person', selectedList?.length)} will be notified`}</div>
            </CheckValidation>
            <div>
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                loading={loading}
                disabled={!isAnyValueSelected}
              >
                {actionButtonLabel || 'Submit'}
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

PeoplePicker.defaultProps = {
  suggestedValues: [],
  actionButtonLabel: 'Done',
  subtitle: 'Search and choose people by name or email.',
  showActionInfo: false,
  suggestedValuesRoleName: 'Member',
  allowMultipleSelection: true,
};

PeoplePicker.propTypes = {
  /**
   * @param {suggestedValues}- Default list of values shown for selection, defaults to empty list. Useful for showing preselected project members etc.
   */
  suggestedValues: PropTypes.array,
  /**
   * @param {actionButtonLabel}- Label shown on the button to complete the action (invokes on change). Defaults to 'Done'
   */
  actionButtonLabel: PropTypes.string,
  /**
   * @param {subtitle}- Sub title of the people selector, defaults to "Search and choose people by name or email."
   */
  subtitle: PropTypes.string,
  /**
   * @param {suggestedValuesRoleName} - Suggested values role name to display, defaults to 'Member'. Pass something like 'Project member' etc. to override. Also it can be overridden by setting suggestedValues.record.roleName value.
   */
  suggestedValuesRoleName: PropTypes.string,
  /**
   * @param {showActionInfo}- If true shows the action item info, example 2 people will be notified, defaults to false.
   */
  showActionInfo: PropTypes.bool,
  /**
   * @param {allowMultipleSelection}- If true allows multiple people selection and also returns the savedValues as an array.
   * If false only allows one selection and returns selectedPerson with the details of selected person, also onChange returns
   * the selectedValue and not the complete list when this flag is false. Defaults to true
   */
  allowMultipleSelection: PropTypes.bool,
};

export default PeoplePicker;
