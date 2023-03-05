import React, { useState } from 'react';
import PropTypes from 'prop-types';
import AppIcons from '@/utils/AppIcons';
import { connect } from 'umi';
import Icon from '@ant-design/icons';
import { CaretDownFill, CaretUpFill, Plus, Search } from 'react-bootstrap-icons';
import { Tooltip, Avatar, Radio, Form } from 'antd';
import BadgeAvatar from '@/components/BadgeAvatar';
import styles from './index.less';
import SearchBar from '@/components/GlobalHeader/SearchBar';
import AvatarHoverView from '@/components/AvatarHoverView';
import AvatarHoverViewRest from '@/components/AvatarHoverViewRest';
import PeoplePicker from '@/components/People/PeoplePicker';

const TaskFiltersHeader = ({
  dispatch,
  location,
  history,
  form,
  status,
  setStatus,
  assigneeIds,
  setAssigneeIds,
  setSearchKeyword,
  currentUser,
}) => {
  const [addAssigneeLoading, setAddAssigneeLoading] = useState(false);
  const [showAddAssigneeModal, setShowAddAssigneeModal] = useState(false);
  const [filterTasks, setFiltertasks] = useState(false);

  return (
    <>
      <Form
        form={form}
        layout="horizontal"
        initialValues={{ filter: 'Active' }}
        // onValuesChange={onFormLayoutChange}
      >
        <div className="w-full flex items-center">
          <div className="p-4" style={{ minWidth: '15vw' }}>
            <div className="rounded-full border hover:bg-gray-100 px-2">
              <SearchBar
                location={location}
                history={history}
                setKeyword={(value) => {
                  setSearchKeyword(value);
                  //   onChangeFilter(value, 'search');
                }}
                placeholder="Search task by name, keyword..."
                suffix={<Search className="text-gray-500" />}
                size="middle"
                bordered={false}
              />
            </div>
          </div>
          <div className="p-4">
            <span
              aria-hidden="true"
              className="cursor-pointer flex items-center"
              onClick={() => {
                setFiltertasks(!filterTasks);
              }}
            >
              <span className="font-medium">{form.getFieldValue('filter')} Tasks </span>
              {!filterTasks ? (
                <CaretDownFill className="text-xs" />
              ) : (
                <CaretUpFill className="text-xs" />
              )}{' '}
              <span className="ml-2">
                <Tooltip title="Manage project tasks. Only visible to your company and project collaborators">
                  <Icon component={AppIcons.InfoCircleFilled} className="text-gray-400" />
                </Tooltip>
              </span>
            </span>
          </div>
          <div className="pl-2 pr-2 pt-4 pb-4">|</div>
          <div className="flex my-2 items-center mr-3">
            {assigneeIds &&
              assigneeIds.slice(0, 5).map((list) => (
                <AvatarHoverView profile={list} key={list.id + Math.random()}>
                  <div>
                    {/* Badge Avatar with delete button */}
                    <BadgeAvatar
                      name={list.name}
                      imgUrl={list.photoUrl}
                      onDelete={() => {
                        const newlist = assigneeIds.filter((l) => l.id !== list.id);
                        setAssigneeIds([...newlist]);
                      }}
                      showBadge
                    />
                  </div>
                </AvatarHoverView>
              ))}

            {assigneeIds && assigneeIds.length > 5 && (
              <AvatarHoverViewRest
                newFilter
                title={`Assignees (${assigneeIds.length - 5})`}
                assignees={assigneeIds && assigneeIds.slice(5, assigneeIds.length)}
                onDelete={(id) => {
                  const newlist = assigneeIds.filter((l) => l.id !== id);
                  setAssigneeIds([...newlist]);
                }}
              >
                <Avatar className={styles.PlustextAvatar}>+{assigneeIds.length - 5}</Avatar>
              </AvatarHoverViewRest>
            )}

            <Tooltip title="Notify additional people" className="flex items-center">
              {/* <Button
                type="dashed"
                shape="circle"
                onClick={() => {
                  setShowAddAssigneeModal(true);
                }}
                className="flex items-center justify-center"
              >
                <Plus />
              </Button> */}
              <span
                onClick={() => {
                  setShowAddAssigneeModal(true);
                }}
                className="cursor-pointer text-2xl border hover:text-blue-700 hover:shadow rounded-full text-yellow-500"
              >
                <Plus />
              </span>
              <span className="ml-2">Assignee</span>
            </Tooltip>
            <PeoplePicker
              setVisible={setShowAddAssigneeModal}
              visible={showAddAssigneeModal}
              savedValues={assigneeIds}
              title={() => 'Assign task to people'}
              buttonName="Assign"
              loading={addAssigneeLoading}
              // listLoading={listOrganizationMembersLoading}
              search={(searchValue) =>
                dispatch({
                  type: 'staff/getOrgMemberList',
                  payload: {
                    query: {
                      keyword: searchValue,
                      startIndex: '0',
                      fetchSize: '5',
                      sortBy: 'displayName',
                    },
                    pathParams: {
                      clientId: currentUser?.personalDetails?.organizationDetails?.orgPartyGroupId,
                    },
                  },
                })
              }
              onChange={(values) => {
                setAddAssigneeLoading(true);
                const peopleToBeAssigned = [
                  ...values.map((value) => ({
                    id: value.id,
                    name: value.displayName,
                    email: value.email,
                    photoUrl: value.photoUrl,
                  })),
                  ...assigneeIds,
                ];
                setAssigneeIds(peopleToBeAssigned);
                setAddAssigneeLoading(false);
                setShowAddAssigneeModal(false);
              }}
            />
          </div>
        </div>
        {filterTasks && (
          <div className="p-2">
            <div className="flex justify-between w-full">
              <div>
                <Form.Item noStyle name="filter" label={null}>
                  <Radio.Group
                    buttonStyle="solid"
                    defaultValue="Active"
                    value={status}
                    onChange={(event) => setStatus(event.target.value)}
                  >
                    <Radio.Button value="Active">Active</Radio.Button>
                    <Radio.Button value="Completed">Completed</Radio.Button>
                    {/* <Radio.Button disabled value="Archived">
                      Archived
                    </Radio.Button> */}
                  </Radio.Group>
                </Form.Item>
              </div>
            </div>
          </div>
        )}
      </Form>
    </>
  );
};

TaskFiltersHeader.defaultProps = {
  placeHolder: 'Post an update...',
  hideShowMoreFieldsToggle: true,
};

TaskFiltersHeader.propTypes = {
  /**
   * @param {String} placeHolder : is the placeholder text.
   */
  placeHolder: PropTypes.string,
  /**
   * @param {bool} hideShowMoreFieldsToggle : is the toggle to show/hide show more fields.
   */
  hideShowMoreFieldsToggle: PropTypes.bool,
};

const mapStateToProps = ({ user }) => ({
  currentUser: user.currentUser,
});

export default connect(mapStateToProps)(TaskFiltersHeader);
