/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Select } from 'antd';
import React, { useEffect } from 'react';
import { connect } from 'umi';

const { Option } = Select;

const ProductStatus = ({ dispatch, categories, productCategoryTypeId }) => {
  const getproductCategories = () => {
    dispatch({
      type: 'product/getCategories',
      payload: {
        query: {
          productCategoryTypeId,
        },
      },
    });
  };

  useEffect(() => {
    getproductCategories();
  }, []);

  return (
    <div className="bg-white p-4 rounded-md shadow">
      <Form.Item
        className="mt-4"
        name="categoryId"
        label={<span className="formLabel">Category</span>}
      >
        <Select
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          size="large"
        >
          {categories?.productCategories?.map((item) => (
            <Option key={item?.id} value={item?.id} label={item?.name}>
              {item?.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        className="mt-4"
        initialValue="PROD_ACTIVE"
        name="statusId"
        label={<span className="formLabel">Status</span>}
      >
        <Select size="large">
          <Option value="PROD_ACTIVE">Active</Option>
          <Option value="PROD_DRAFT">Draft</Option>
        </Select>
      </Form.Item>
    </div>
  );
};

export default connect(({ product }) => ({
  categories: product.categories,
}))(ProductStatus);
