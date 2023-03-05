/* eslint-disable func-names */
import Breadcrumbs from '@/components/BreadCrumbs';
import CardSection from '@/components/CardSection';
import FixedFooter from '@/components/FixedFooter';
import Page from '@/components/Page';
import { decodeDollarsToDigits } from '@/utils/utils';
import { Button, Form, message, notification } from 'antd';
import React, { useState } from 'react';
import { connect } from 'umi';
import BasicProductDetails from './BasicProductDetails';
import ProductCollections from './ProductCollections';
import ProductInventory from './ProductInventory';
import ProductMedia from './ProductMedia';
import ProductPricing from './ProductPricing';
import ProductShipping from './ProductShipping';
import ProductStatus from './ProductStatus';
import ProductVariants from './ProductVariants';

const NewProduct = ({ dispatch, history }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkedVariant, setCheckedVariant] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const [valuesForm, setValuesForm] = useState();

  let mainList = [];

  const variantList = form.getFieldValue('variants');
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

  const attachDocuments = (id) =>
    Promise.all(
      fileList.map((info) => {
        const data = new FormData();
        data.append('file', info);
        return dispatch({
          type: 'product/attachDocuments',
          payload: {
            id,
            data,
          },
        });
      }),
    );

  const openNotification = () => {
    notification.warn({
      message: 'No image added',
      description: 'Please add at least one image to proceed!',
    });
  };

  return (
    <div className="container mx-auto">
      <Page
        title="New product"
        breadcrumbs={
          <Breadcrumbs
            path={[
              {
                name: 'Products',
                path: '/products',
              },
              {
                name: 'New product',
                path: '/products/new',
              },
            ]}
          />
        }
      >
        <Form
          form={form}
          hideRequiredMark
          layout="vertical"
          onValuesChange={(values) => setValuesForm(values)}
          colon={false}
          onFinish={(values) => {
            const body = {
              name: values.name,
              description: values.description,
              price: values?.price ? parseFloat(decodeDollarsToDigits(values?.price)) : undefined,
              compareAtPrice: values?.compareAtPrice
                ? parseFloat(decodeDollarsToDigits(values?.compareAtPrice))
                : undefined,
              unitPrice: values?.unitPrice
                ? parseFloat(decodeDollarsToDigits(values?.unitPrice))
                : undefined,
              sku: values.sku,
              barcode: values.barcode,
              trackInventory: values.trackInventory,
              continueAfterStockOut: values.continueAfterStockOut,
              quantity: values.quantity,
              isPhysical: values.isPhysical,
              weight: values.weight,
              weightUnit: values.weightUnit,
              gst: values.gst,
              productCollections: values.productCollections,
              productTags: values.productTags,
              statusId: values.statusId,
              categoryId: values.categoryId,
              hsn: values.hsn,
              productType: 'FINISHED_GOOD',
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
            };

            if (fileList?.length > 0) {
              setLoading(true);

              dispatch({
                type: 'product/createProduct',
                payload: {
                  body,
                },
              }).then((response) => {
                if (response?.res?.productId) {
                  attachDocuments(response?.res?.productId).then((resp) => {
                    if (resp) {
                      setLoading(false);
                      message.success('Product created successfully');
                      history.push('/products');
                    } else {
                      setLoading(false);
                    }
                  });
                } else {
                  setLoading(false);
                }
              });
            } else {
              openNotification();
            }
          }}
        >
          <CardSection
            className="mt-4"
            leftContent={
              <div className="pr-8 ">
                <div className="text-blue-900 font-semibold text-xl">Basic details</div>
                <div className="text-gray-600">
                  <p className="mt-4">Fill the name and the description.</p>
                </div>
              </div>
            }
            rightContent={
              <div className="bg-white p-4 rounded-md shadow">
                <BasicProductDetails type="Product" placeholder="Short sleeve t-shirt" />
              </div>
            }
          />
          <CardSection
            className="mt-4"
            leftContent={
              <div className="pr-8 ">
                <div className="text-blue-900 font-semibold text-xl">Media</div>
                <div className="text-gray-600">
                  <p className="mt-4">Upload the media here.</p>
                </div>
              </div>
            }
            rightContent={<ProductMedia fileList={fileList} setFileList={setFileList} />}
          />
          <CardSection
            className="mt-4"
            leftContent={
              <div className="pr-8 ">
                <div className="text-blue-900 font-semibold text-xl">Pricing</div>
                <div className="text-gray-600">
                  <p className="mt-4">
                    Fill the product price, compare price and cost per item here.
                  </p>
                </div>
              </div>
            }
            rightContent={
              <div className="bg-white p-4 rounded-md shadow">
                <ProductPricing form={form} />
              </div>
            }
          />
          <CardSection
            className="mt-4"
            leftContent={
              <div className="pr-8 ">
                <div className="text-blue-900 font-semibold text-xl">Inventory</div>
                <div className="text-gray-600">
                  <p className="mt-4">
                    Fill the stock keeping unit,barcode and track quantity here.
                  </p>
                </div>
              </div>
            }
            rightContent={
              <div className="bg-white rounded-md shadow">
                <ProductInventory form={form} />
              </div>
            }
          />
          <CardSection
            className="mt-4"
            leftContent={
              <div className="pr-8 ">
                <div className="text-blue-900 font-semibold text-xl">Shipping</div>
                <div className="text-gray-600">
                  <p className="mt-4">FIll product weight here.</p>
                </div>
              </div>
            }
            rightContent={
              <div className="bg-white rounded-md shadow">
                <ProductShipping form={form} />
              </div>
            }
          />
          <CardSection
            className="mt-4"
            leftContent={
              <div className="pr-8 ">
                <div className="text-blue-900 font-semibold text-xl">Variants</div>
                <div className="text-gray-600">
                  <p className="mt-4">Select product variants here.</p>
                </div>
              </div>
            }
            rightContent={
              <div className="bg-white rounded-md shadow">
                <ProductVariants
                  form={form}
                  mainList={mainList}
                  checkedVariant={checkedVariant}
                  setCheckedVariant={setCheckedVariant}
                />
              </div>
            }
          />
          <CardSection
            className="mt-4"
            leftContent={
              <div className="pr-8 ">
                <div className="text-blue-900 font-semibold text-xl">Category</div>
                <div className="text-gray-600">
                  <p className="mt-4">Select product status and category here.</p>
                </div>
              </div>
            }
            rightContent={<ProductStatus productCategoryTypeId="PRODUCT_CATEGORY" />}
          />

          <CardSection
            className="mt-4"
            leftContent={
              <div className="pr-8 ">
                <div className="text-blue-900 font-semibold text-xl">Colections</div>
                <div className="text-gray-600">
                  <p className="mt-4">Select product collections and add tags here.</p>
                </div>
              </div>
            }
            rightContent={<ProductCollections />}
          />
          <FixedFooter classes="text-right">
            <div
              className="flex m-auto"
              style={{
                maxWidth: '68rem',
              }}
            >
              <div className="w-full">
                <Button
                  loading={loading}
                  type="primary"
                  htmlType="submit"
                  className="capitalize"
                  size="large"
                >
                  Save
                </Button>
              </div>
            </div>
          </FixedFooter>
        </Form>
      </Page>
    </div>
  );
};

export default connect(({ user, loading }) => ({
  currentUser: user.currentUser,
  loading: loading.effects['product/createProduct'],
}))(NewProduct);
