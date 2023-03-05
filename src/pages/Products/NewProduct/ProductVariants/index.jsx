import CheckValidation from '@/components/CheckValidation';
import { Button, Checkbox, Col, Form, Row, Select } from 'antd';
import React from 'react';
import VariantItem from './VariantItem';
import { connect } from 'umi';

const { Option } = Select;
const ProductVariants = ({
  form,
  mainList,
  checkedVariant,
  setCheckedVariant,
  productDetails,
  viewScreen,
}) => {
  const list = [
    {
      title: 'Size',
      value: 'Size',
    },
    {
      title: 'Color',
      value: 'Color',
    },
    {
      title: 'Material',
      value: 'Material',
    },
    {
      title: 'Style',
      value: 'Style',
    },
    {
      title: 'Title',
      value: 'Title',
    },
  ];

  return (
    <>
      <Form.List name="variants">
        {(fields, { add, remove }) => (
          <div className="">
            <div className="p-4 border-b">
              <div className="pt-2">
                <Checkbox
                  checked={checkedVariant}
                  onChange={() => {
                    setCheckedVariant(!checkedVariant);
                    if (!checkedVariant && fields?.length === 0) {
                      add();
                    }
                  }}
                >
                  This product has multiple options, like different sizes or colors
                </Checkbox>
              </div>
            </div>
            <CheckValidation show={checkedVariant}>
              <div className="p-4">
                <div className="text-black text-sm font-medium">OPTIONS</div>
                <div className="mt-4"></div>
                {fields?.map(({ key, name, fieldKey, ...restField }) => (
                  <div key={key}>
                    <CheckValidation show={fields?.length > 1}>
                      <div className="w-full flex justify-end pb-1 pr-2">
                        <span
                          className=" cursor-pointer text-blue-600 text-sm"
                          onClick={() => remove(name)}
                        >
                          Remove
                        </span>
                      </div>
                    </CheckValidation>
                    <Row key={key} gutter={24}>
                      <Col xl={6} lg={6} md={24} sm={24} xs={24}>
                        <Form.Item
                          {...restField}
                          name={[name, 'attrName']}
                          fieldKey={[fieldKey, 'attrName']}
                          rules={[{ required: true, message: "Option name can't be blank" }]}
                        >
                          <Select size="large" placeholder="Size">
                            {list?.map(({ value, title }) => (
                              <Option key={value} value={value}>
                                {title}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col xl={18} lg={18} md={24} sm={24} xs={24}>
                        <Form.Item
                          {...restField}
                          name={[name, 'attrValue']}
                          fieldKey={[fieldKey, 'attrValue']}
                          label=""
                          labelAlign="right"
                          rules={[{ required: true, message: "Option value can't be blank" }]}
                        >
                          <Select
                            placeholder="Separate options with a comma"
                            dropdownStyle={{
                              display: 'none',
                            }}
                            mode="tags"
                            size="large"
                            tokenSeparators={[',']}
                          ></Select>
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                ))}
                <CheckValidation show={fields?.length < 3}>
                  <Form.Item>
                    <Button size="large" onClick={() => add()}>
                      Add another option
                    </Button>
                  </Form.Item>
                </CheckValidation>
              </div>
            </CheckValidation>
          </div>
        )}
      </Form.List>
      <CheckValidation show={mainList?.length > 0 && checkedVariant}>
        <div className="bg-white mt-4 border-t">
          <div className="text-black text-sm font-medium p-4 border-b">PREVIEW</div>
          <div className="flex justify-between p-4 border-b">
            <div className="formLabel">Variant</div>
            <div className="formLabel">Price</div>
            <div className="formLabel">Quantity</div>
            <div className="formLabel">SKU</div>
            <div className="formLabel">Barcode</div>
          </div>
          {mainList?.map((item, index) => (
            <VariantItem
              key={item}
              name={item}
              details={viewScreen && productDetails?.productVariants[index]}
              index={index}
              form={form}
            />
          ))}
        </div>
      </CheckValidation>
    </>
  );
};

export default connect(({ product }) => ({
  productDetails: product.productDetails,
}))(ProductVariants);
