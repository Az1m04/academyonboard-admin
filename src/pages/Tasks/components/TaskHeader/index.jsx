/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Form } from 'antd';
import { debounce } from 'lodash';
import { connect } from 'dva';
import { history } from 'umi';
import TaskFiltersHeader from '../TaskFiltersHeader';

// import TaskSearchBar from '../TaskSearchBar';

const TaskHeader = ({
  dispatch,
  loggedInUser,
  getMyBacklogTasks,
  getMyTasksDueToday,
  getMyTasksDueLatter,
  // getMyOverdueTasks,
  location,
}) => {
  // eslint-disable-next-line no-unused-vars
  const [sortMembersBy, setSortMembersBy] = useState(['-', 'createdDate']);

  // eslint-disable-next-line no-unused-vars
  const [todayTaskStartIndex, setTodayTaskStartIndex] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [latterTaskStartIndex, setLatterTaskStartIndex] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [overdueTaskStartIndex, setOverdueTaskStartIndex] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [backlogTaskStartIndex, setBacklogStartIndex] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [assigneeIds, setAssigneeIds] = useState([]);
  const [owner, setOwner] = useState([]);
  const [status, setStatus] = useState('Active');
  const [form] = Form.useForm();
  const fetchMembersService = ({ searchText, startingIndex, fetchSize, sortBy }) => {
    return dispatch({
      type: 'orgMembers/listOrganizationMembers',
      payload: {
        accountId: loggedInUser?.organization?.id,
        searchCriteria: { keyword: searchText, startIndex: startingIndex, fetchSize, sortBy },
      },
    });
  };

  const onChangeFilter = () => {
    setLatterTaskStartIndex(0);
    setTodayTaskStartIndex(0);
    setBacklogStartIndex(0);
    setOverdueTaskStartIndex(0);
    const query = {
      taskCategoryIds: selectedCategories.map((cat) => cat.id),
      assignees: assigneeIds?.map((item) => item?.id),
      ownerId: owner[0] && owner[0]?.id,
      showCompleted: status === 'Completed',
      showNotCompleted: status === 'Active',
      startIndex: 0,
      fetchSize: 5,
      isFilterChangedOrStartIndexZero: true,
      keyword,
    };
    getMyBacklogTasks(query);
    // getMyOverdueTasks(query);
    getMyTasksDueLatter(query);
    getMyTasksDueToday(query);
  };

  useEffect(() => {
    onChangeFilter();
  }, [status, keyword, assigneeIds, owner]);

  useEffect(() => {
    onChangeFilter();
  }, [selectedCategories]);

  const debouncedFetchMembersService = debounce(fetchMembersService, 500);
  useEffect(() => {
    if (loggedInUser?.organization?.id) {
      debouncedFetchMembersService({
        keyword: '',
        startingIndex: 0,
        fetchSize: 1000,
        sortBy: sortMembersBy.join(''),
      });
    }
    return () => {};
  }, [loggedInUser?.organization?.id]);
  return (
    <div className="rounded my-4 shadow bg-white">
      <TaskFiltersHeader
        location={location}
        history={history}
        form={form}
        onChangeFilter={onChangeFilter}
        status={status}
        setSearchKeyword={setKeyword}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        setStatus={setStatus}
        assigneeIds={assigneeIds}
        setAssigneeIds={setAssigneeIds}
        owner={owner}
        setOwner={setOwner}
      />
    </div>
  );
};
const mapStateToProps = (state) => ({
  loggedInUser: state.user.currentUser,
  members: state.orgMembers.members,
});

export default connect(mapStateToProps)(TaskHeader);
