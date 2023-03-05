import React, { useState, useEffect } from 'react';

import { connect } from 'umi';
import { Modal, Button, Form, Input, AutoComplete, message } from 'antd';
import styles from './index.less';

/**
 *
 * @typedef AddProjectCategoryModal
 * @type {object}
 * @property {bool} isAddTaskCategoryModalVisible - is the visible state of the modal.
 * @property {func} setIsAddTaskCategoryModalVisible - is the func to set modal visible state.
 */

const AddTaskCategoryModal = ({
  isAddTaskCategoryModalVisible,
  setIsAddTaskCategoryModalVisible,
  dispatch,
  taskCategoryList,
  colors,
  mode,
  selectedCategory,
  // setSelectedCategory,
}) => {
  const [form] = Form.useForm();
  const [selectedColor, setSelectedColor] = useState('');

  useEffect(() => {
    if (isAddTaskCategoryModalVisible) {
      if (selectedCategory) {
        if (selectedCategory?.color?.id) {
          setSelectedColor(selectedCategory?.color?.id);
        } else {
          setSelectedColor('DEFAULT');
        }
        form.setFieldsValue({ category: selectedCategory?.name });
      }
    } else {
      // setSelectedCategory({});
      setSelectedColor('DEFAULT');
    }
  }, [isAddTaskCategoryModalVisible]);

  useEffect(() => {
    dispatch({
      type: 'common/getColors',
      payload: {},
    });
  }, []);

  const handleSubmit = () => {
    if (form.getFieldValue('category')) {
      const body = {
        name: form.getFieldValue('category'),
        color: {
          id: selectedColor,
        },
      };

      let api = '';
      if (mode === 'add') {
        api = 'tasks/addTaskCategory';
      } else {
        api = 'tasks/updateProjectCategory';
      }

      dispatch({
        type: api,
        payload: {
          body,
        },
      }).then(() => {
        form.resetFields();
        message.success('Category Added Successfully.');
        dispatch({
          type: 'tasks/getTaskCategoryList',
        });
        setSelectedColor('DEFAULT');
        // setSelectedCategory();
        setIsAddTaskCategoryModalVisible(false);
      });
    }
  };

  const options = taskCategoryList?.categories?.map((item) => ({
    value: item.categoryName,
  }));

  return (
    <Modal
      destroyOnClose
      className={styles.AddSourcePageModal}
      visible={isAddTaskCategoryModalVisible}
      footer={[
        <Button key="" onClick={() => handleSubmit()} type="primary">
          {mode === 'add' ? 'Add category' : 'Update category'}
        </Button>,
      ]}
      onCancel={() => {
        setIsAddTaskCategoryModalVisible(false);
      }}
    >
      {mode === 'add' ? (
        <div className={styles.ModalTitle}>Add category</div>
      ) : (
        <div className={styles.ModalTitle}>Update category</div>
      )}

      <div className="my-4">
        <Form form={form}>
          <div className={styles.formLabel}>Category</div>
          <div className="mt-2 w-full">
            <Form.Item name="category">
              {mode === 'add' ? (
                <AutoComplete
                  autoFocus
                  options={options}
                  placeholder="Search for category or create new"
                  filterOption={(inputValue, option) =>
                    option?.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                  }
                />
              ) : (
                <Input autoFocus />
              )}
            </Form.Item>
          </div>

          <div className="mb-2 border rounded hover:bg-gray-100">
            <div className="p-2">
              <div>
                <div className="text-black font-semibold">Color</div>
                <div className="text-gray-600">Select the color for the category</div>
              </div>

              <div className="flex flex-wrap">
                {colors?.map((color) => (
                  <div
                    aria-hidden="true"
                    key={color.id}
                    onClick={() => setSelectedColor(color.id)}
                    className={
                      selectedColor === color.id
                        ? 'border border-blue-100 shadow rounded p-2 w-10 h-10 tag'
                        : 'cursor-pointer rounded p-2 w-10 h-10'
                    }
                  >
                    <div style={{ backgroundColor: color.background }} className="w-6 h-6" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default connect(({ tasks, common }) => ({
  taskCategoryList: tasks.taskCategoryList,
  colors: common.colors,
}))(AddTaskCategoryModal);
