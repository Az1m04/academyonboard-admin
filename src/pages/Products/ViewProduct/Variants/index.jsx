/* eslint-disable func-names */
import CheckValidation from '@/components/CheckValidation';
import { decodeDollarsToDigits } from '@/utils/utils';
import { Button, Form, Skeleton } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import ProductVariants from '../../NewProduct/ProductVariants';

const Variants = ({ loading, productDetails, updateProduct }) => {
  const [form] = Form.useForm();
  // eslint-disable-next-line no-unused-vars
  const [variantValues, setVariantValues] = useState();
  const [checkedVariant, setCheckedVariant] = useState(false);

  useEffect(() => {
    if (productDetails) {
      if (productDetails?.productAttributes?.length > 0) {
        setCheckedVariant(true);
        form.setFieldsValue({
          variants: productDetails?.productAttributes,
        });
      }
    }
  }, [productDetails, form]);

  let mainList = [];

  const variantList = form.getFieldValue('variants');

  if (productDetails && variantList?.length > 0) {
    variantList?.forEach(function (variantItem) {
      const optionList = variantItem?.attrValue;
      if (optionList?.length > 0) {
        const tempList = mainList;
        if (tempList?.length > 0) {
          // eslint-disable-next-line no-param-reassign
          mainList = [];
          optionList?.forEach(function (listItem) {
            tempList?.forEach(function (tempItem) {
              mainList.push(`${tempItem}/${listItem}`);
            });
          });
        } else {
          optionList?.forEach(function (listItem) {
            mainList.push(listItem);
          });
        }
      }
    });
  }

  return (
    <Skeleton loading={loading}>
      <CheckValidation show={productDetails}>
        <Form
          form={form}
          onValuesChange={(values) => setVariantValues(values)}
          layout="vertical"
          onFinish={(values) => {
            const body = {
              productVariants: mainList?.map((item, index) => ({
                name: item,
                price: values.variantPrice[index]
                  ? parseFloat(decodeDollarsToDigits(values.variantPrice[index]))
                  : undefined,
                quantity: values.variantQuantity[index],
                sku: values.variantSku[index],
                barcode: values.variantBarcode[index],
              })),
              productAttributes: values.variants?.map((item) => ({
                attrName: item?.attrName,
                attrValue: item?.attrValue.join(','),
              })),
              updateVariant: true,
            };
            updateProduct(body);
          }}
          colon={false}
          hideRequiredMark
        >
          <div className="bg-white mt-4 rounded-md shadow">
            <ProductVariants
              form={form}
              mainList={mainList}
              checkedVariant={checkedVariant}
              setCheckedVariant={setCheckedVariant}
              viewScreen
            />
            <CheckValidation show={checkedVariant}>
              <div className="w-full flex pr-4 pb-4 justify-end">
                <Button htmlType="submit" type="primary">
                  Update
                </Button>
              </div>
            </CheckValidation>
          </div>
        </Form>
      </CheckValidation>
    </Skeleton>
  );
};

export default connect(({ product }) => ({
  productDetails: product.productDetails,
  variants: product.variants,
}))(Variants);
