/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Select } from 'antd';
import React, { useEffect } from 'react';
import { connect } from 'umi';

const { Option } = Select;

const ProductCollections = ({ dispatch, collections, tags }) => {
  const getproductCategories = () => {
    dispatch({
      type: 'product/getCollections',
      payload: {
        query: {
          productCategoryTypeId: 'PRODUCT_COLLECTION',
        },
      },
    });
  };

  const getProductTags = () => {
    dispatch({
      type: 'product/getProductTags',
    });
  };

  useEffect(() => {
    getproductCategories();
    getProductTags();
  }, []);

  return (
    <div className="bg-white p-4 rounded-md shadow">
      <Form.Item
        className="mt-4"
        name="productCollections"
        label={<span className="formLabel">Collections</span>}
      >
        <Select
          getPopupContainer={(trigger) => trigger.parentNode}
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            option?.children?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0
          }
          size="large"
          mode="tags"
          tokenSeparators={[',']}
        >
          {collections?.productCategories?.map((item) => (
            <Option key={item?.id} value={item?.id} label={item?.name}>
              {item?.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        className="mt-4"
        name="productTags"
        label={<span className="formLabel">Tags</span>}
      >
        <Select
          getPopupContainer={(trigger) => trigger.parentNode}
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            option?.children?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0
          }
          size="large"
          mode="tags"
          tokenSeparators={[',']}
        >
          {tags?.map((item) => (
            <Option key={item?.tagId} value={item?.tagName} label={item?.tagName}>
              {item?.tagName}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </div>
  );
};

export default connect(({ product }) => ({
  collections: product.collections,
  tags: product.tags,
}))(ProductCollections);
