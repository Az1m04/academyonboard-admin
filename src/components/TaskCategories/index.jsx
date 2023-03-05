import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { PlusCircle } from '@/utils/AppIcons';
import { Input, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import AddTaskCategoryModal from '@/components/AddTaskModal/AddTaskCategoryModal';

/**
 *
 *@TaskCategories - The purpose of this component is to show task categories
 */

const TaskCategories = (props) => {
  const {
    category,
    setCategory,
    dispatch,
    projectId,
    taskId,
    type,
    setCategoryId,
    categories,
    setCategoryColor,
    setCategoryForegroundColor,
    setCategoryVisible,
    categoryVisible,
  } = props;
  const [keyword, setKeyword] = useState('');
  const [isAddTaskCategoryModalVisible, setIsAddTaskCategoryModalVisible] = useState(false);
  const [mode, setMode] = useState('');

  const renderBgColor = (name) => {
    if (name === category) {
      return 'bg-blue-400';
    }
    return '';
  };
  const addCategoryVisibleHandler = () => {
    setMode('add');
    setIsAddTaskCategoryModalVisible(!isAddTaskCategoryModalVisible);
  };
  useEffect(() => {
    if (!categoryVisible) setTimeout(() => setKeyword(''), 150);
  }, [categoryVisible]);

  return (
    <div>
      <div>
        <div className="flex justify-between space-x-2 items-center p-2">
          <div className="flex-auto">
            <Input
              bordered={false}
              placeholder="Search categories..."
              autoFocus
              value={keyword}
              onChange={({ target: { value } }) => setKeyword(value)}
            />
          </div>
          <div className="flex-none pr-2">
            <Tooltip title="Add category">
              <div
                onClick={() => {
                  addCategoryVisibleHandler();
                  setCategoryVisible(!categoryVisible);
                }}
                className="cursor-pointer text-yellow-500"
              >
                <PlusCircle />
              </div>
            </Tooltip>
          </div>
        </div>{' '}
        <AddTaskCategoryModal
          isAddTaskCategoryModalVisible={isAddTaskCategoryModalVisible}
          setIsAddTaskCategoryModalVisible={setIsAddTaskCategoryModalVisible}
          mode={mode}
        />
        <ul style={{ maxHeight: '25vh', overflowY: 'scroll' }}>
          {categories &&
            categories
              .filter(({ name }) => name.toLowerCase().includes(keyword.toLowerCase()))
              .map(({ id, name, color: { background, foreground } }) => (
                <li
                  key={id}
                  aria-hidden="true"
                  onClick={() => {
                    if (type !== 'inputTask') {
                      dispatch({
                        type: 'task/setCategory',
                        payload: {
                          projectId,
                          taskId,
                          categoryId: id,
                        },
                      });
                    }
                    if (type === 'inputTask') {
                      setCategoryId(id);
                    }
                    setCategory(name);
                    setCategoryColor(background);
                    setCategoryForegroundColor(foreground);
                    setCategoryVisible(false);
                  }}
                  className={`py-2 font-semibold border-solid border-gray-200 border border-0 border-b cursor-pointer
              hover:bg-gray-200 ${renderBgColor(name)}`}
                >
                  <div className="flex ">
                    <div style={{ background }} className=" ml-4  mt-1 rounded-full w-3 h-3 " />
                    <div>
                      <span className="ml-2">{name}</span>
                    </div>
                  </div>
                </li>
              ))}
        </ul>
      </div>
    </div>
  );
};

TaskCategories.propTypes = {
  /**
   * @categories paramType {array} - This is the list of the categories
   */
  categories: PropTypes.array.isRequired,
  /**
   * @type paramType {string} - This is the type of the component user is in.
   */
  type: PropTypes.string.isRequired,
  /**
   * @category paramType {string} - This is the category of the task
   */
  category: PropTypes.string.isRequired,
  /**
   * @setCategoryId paramType {func} - This is the function to set the category id
   */
  setCategoryId: PropTypes.func.isRequired,
  /**
   * @setCategory paramType {func} - This is the function to set the category of the task
   */
  setCategory: PropTypes.func.isRequired,
  /**
   * @setCategoryColor paramType {func} - This is the function to set the category color of the task
   */
  setCategoryColor: PropTypes.func.isRequired,
  /**
   * @setCategoryForegroundColor paramType {func} - This is the function to set the foreground color of the task category
   */
  setCategoryForegroundColor: PropTypes.func,
  /**
   * @setCategoryVisible paramType {func} - This is the function to toggle the state of the popover
   */
  setCategoryVisible: PropTypes.func.isRequired,
  /**
   * @taskId paramType {string} - This is the id of the task
   */
  taskId: PropTypes.string.isRequired,
  /**
   * @projectId paramType {string} - This is the id of the project
   */
  projectId: PropTypes.string.isRequired,
};

export default connect(({ tasks }) => ({
  categories: tasks.taskCategoryList,
}))(TaskCategories);
