/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import Breadcrumbs from '@/components/BreadCrumbs';
import { Button, Col, Dropdown, Form, message, Row, Select, Skeleton, Tooltip } from 'antd';
import { StarOutlined, CopyOutlined, CaretDownOutlined, StopOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { currencyFormatter, decodeDollarsToDigits } from '@/utils/utils';
import CheckValidation from '@/components/CheckValidation';
import BasicProductDetails from '@/pages/Products/NewProduct/BasicProductDetails';
import ServicePricing from '../NewService/ServicePricing';
import Attachments from '@/components/Attachments';

const { Option } = Select;

const ViewService = ({
  match,
  dispatch,
  productDetails,
  loading,
  categories,
  collections,
  tags,
  loadingAttachments,
  productAttachments,
}) => {
  const [basicForm] = Form.useForm();
  const [pricingForm] = Form.useForm();
  // eslint-disable-next-line no-unused-vars
  const [valuesForm, setValuesForm] = useState();
  // eslint-disable-next-line no-unused-vars
  const [inventoryValues, setInventoryValues] = useState();
  // eslint-disable-next-line no-unused-vars
  const [shippingValues, setShippingValues] = useState();

  const getProductDetails = () => {
    dispatch({
      type: 'product/getProductDetails',
      payload: {
        pathParams: {
          id: match.params.id,
        },
      },
    });
  };

  useEffect(() => {
    getProductDetails();
  }, []);

  const getproductCategories = () => {
    dispatch({
      type: 'product/getCategories',
      payload: {
        query: {
          productCategoryTypeId: 'SERVICE_CATEGORY',
        },
      },
    });
  };

  useEffect(() => {
    getproductCategories();
  }, []);

  const getproductCollections = () => {
    dispatch({
      type: 'product/getCollections',
      payload: {
        query: {
          productCategoryTypeId: 'SERVICE_COLLECTION',
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
    getproductCollections();
    getProductTags();
  }, []);

  const getAttachments = () => {
    dispatch({
      type: 'product/getProductAttachments',
      payload: {
        pathParams: {
          id: match.params.id,
        },
      },
    });
  };

  useEffect(() => {
    getAttachments();
  }, []);

  const renderBgColor = (name) => {
    if (name === 'Active') {
      return 'bg-green-200';
    }
    if (name === 'Draft') {
      return 'bg-pink-200';
    }
    return 'bg-red-200';
  };

  const removeAttachment = (data) => {
    dispatch({
      type: 'product/removeAttachment',
      payload: {
        pathParams: {
          type: 'products',
          id: match.params.id,
          contentId: data?.contentId,
        },
      },
    }).then((resp) => {
      if (resp?.res) {
        message.success('Attachment deleted successfully');
      }
    });
  };

  const onSuccess = () => {
    dispatch({
      type: 'product/getProductAttachments',
      payload: {
        pathParams: {
          id: match.params.id,
        },
      },
    }).then((res) => {
      if (res) {
        message.success('Attachment uploaded successfully');
      }
    });
  };

  const menu = (
    <div className="bg-white rounded-md shadow">
      <div className="p-2 text-gray-600 hover:bg-gray-200 border-b cursor-pointer">
        <CopyOutlined /> Duplicate
      </div>
      <div className="p-2 text-red-600 hover:bg-gray-200 border-b cursor-pointer">
        <StopOutlined /> Archive
      </div>
      <div className="p-2 text-yellow-500 hover:bg-gray-200 border-b cursor-pointer">
        <StarOutlined /> View reviews on this service
      </div>
    </div>
  );

  const updateProduct = (data) => {
    // body.productType = 'FINISHED_GOOD';
    dispatch({
      type: 'product/updateProduct',
      payload: {
        pathParams: {
          id: match.params.id,
        },
        body: {
          ...data,
          productType: 'SERVICE_PRODUCT',
        },
      },
    }).then((res) => {
      if (res) {
        message.success('Service details updated successfully');
      }
    });
  };

  useEffect(() => {
    if (productDetails) {
      pricingForm.setFieldsValue({
        price: productDetails?.price ? currencyFormatter.format(productDetails?.price) : '₹0.00',
        compareAtPrice: productDetails?.compareAtPrice
          ? currencyFormatter.format(productDetails?.compareAtPrice)
          : '₹0.00',
        unitPrice: productDetails?.unitPrice
          ? currencyFormatter.format(productDetails?.unitPrice)
          : '₹0.00',
        hsn: productDetails?.hsn,
        gst: productDetails?.gst,
        quantityUomId: productDetails?.quantityUomId,
        serviceModeId: productDetails?.serviceModeId,
      });
      basicForm.setFieldsValue({
        name: productDetails?.name,
        description: productDetails?.description,
      });
    }
  }, [productDetails]);
  return (
    <div
      style={{
        maxWidth: '70.8rem',
        marginTop: '1rem',
        marginRight: 'auto',
        marginLeft: 'auto',
      }}
      className="container mx-auto"
    >
      <div className="">
        <div className="flex justify-between mt-8">
          <div className="text-base text-gray-800 font-semibold">
            <Breadcrumbs
              path={[
                {
                  name: 'Services',
                  path: '/services',
                },
                {
                  name: `${match.params.id}`,
                  path: `/services/${match.params.id}`,
                },
              ]}
            />
          </div>
        </div>
        <div className="flex">
          <div title="Order id" className="text-2xl text-gray-800 font-semibold">
            <span>{productDetails?.name}</span>
          </div>
          <div title="Order date" className="text-sm ml-4 text-gray-600 font-semibold mt-3">
            <span>Created on {dayjs(productDetails?.createdAt).format('MMM D, YYYY h:mm A')}</span>
          </div>
          <div className="text-sm ml-4 text-gray-600 font-semibold mt-2">
            <span>
              <Tooltip title="Status">
                <span
                  className={`w-16 pl-3 pr-3 text-xs pt-1 pb-1 rounded-full ${renderBgColor(
                    productDetails?.status,
                  )}`}
                >
                  {productDetails?.status}
                </span>
              </Tooltip>
            </span>
          </div>
        </div>

        <div className="flex mt-3">
          <div className="text-sm font-semibold cursor-pointer">View</div>
          <Dropdown overlay={menu} trigger={['click']}>
            <div className="ml-6 text-sm font-semibold cursor-pointer">
              More actions <CaretDownOutlined />
            </div>
          </Dropdown>
        </div>
      </div>

      <div className="mt-10">
        <Row gutter={12}>
          <Col xl={16} lg={14} md={24} sm={24} xs={24}>
            <Skeleton loading={loading}>
              <CheckValidation show={productDetails}>
                <Form
                  form={basicForm}
                  onFinish={(values) => {
                    updateProduct(values);
                  }}
                  layout="vertical"
                  colon={false}
                  hideRequiredMark
                >
                  <div className="bg-white p-4 rounded-md shadow">
                    <BasicProductDetails type="Service" placeholder={productDetails?.name} />
                    <div className="w-full flex justify-end">
                      <Button htmlType="submit" type="primary">
                        Update
                      </Button>
                    </div>
                  </div>
                </Form>
              </CheckValidation>
            </Skeleton>

            <Attachments
              id={match.params.id}
              onSuccess={onSuccess}
              attachments={productAttachments}
              loadingAttachments={loadingAttachments}
              removeAttachment={removeAttachment}
              type="products"
            />
            <Skeleton loading={loading}>
              <CheckValidation show={productDetails}>
                <Form
                  form={pricingForm}
                  onValuesChange={(values) => setValuesForm(values)}
                  onFinish={(values) => {
                    const body = {
                      compareAtPrice: values?.compareAtPrice
                        ? parseFloat(decodeDollarsToDigits(values?.compareAtPrice))
                        : undefined,
                      gst: values.gst,
                      price: values?.price
                        ? parseFloat(decodeDollarsToDigits(values?.price))
                        : undefined,
                      quantityUomId: values.quantityUomId,
                      hsn: values.hsn,
                      serviceModeId: values.serviceModeId,
                    };
                    updateProduct(body);
                  }}
                  layout="vertical"
                  colon={false}
                  hideRequiredMark
                >
                  <div className="bg-white mt-4 rounded-md shadow">
                    <div className="text-base font-medium p-4 border-b"> Pricing</div>

                    <div className="p-4">
                      <ServicePricing form={pricingForm} />
                      <div className="w-full flex justify-end">
                        <Button htmlType="submit" type="primary">
                          Update
                        </Button>
                      </div>
                    </div>
                  </div>
                </Form>
              </CheckValidation>
            </Skeleton>
          </Col>
          <Col xl={8} lg={10} md={24} sm={24} xs={24}>
            <Skeleton loading={loading}>
              <div className="bg-white rounded-md shadow">
                <div className="p-4 border-b">
                  <div className="flex justify-between">
                    <div className="text-sm font-medium">Category</div>
                  </div>
                  <div className="mt-2">
                    <Select
                      defaultValue={productDetails?.categoryId}
                      showSearch
                      onChange={(value) => {
                        const body = {
                          categoryId: value,
                        };
                        updateProduct(body);
                      }}
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      size="large"
                      className="w-full"
                    >
                      {categories?.productCategories?.map((item) => (
                        <Option key={item?.id} value={item?.id} label={item?.name}>
                          {item?.name}
                        </Option>
                      ))}
                    </Select>
                  </div>
                </div>

                <div className="p-4 border-b">
                  <div className="flex justify-between">
                    <div className="text-sm font-medium">Collection</div>
                  </div>
                  <div className="mt-2">
                    <Select
                      getPopupContainer={(trigger) => trigger.parentNode}
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option?.children?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0
                      }
                      onChange={(value) => {
                        const body = {
                          productCollections: value,
                          updateCollection: true,
                        };
                        updateProduct(body);
                      }}
                      size="large"
                      mode="tags"
                      tokenSeparators={[',']}
                      className="w-full"
                    >
                      {collections?.productCategories?.map((item) => (
                        <Option key={item?.id} value={item?.id} label={item?.name}>
                          {item?.name}
                        </Option>
                      ))}
                    </Select>
                  </div>
                </div>
                <div className="p-4 border-b">
                  <div className="flex justify-between">
                    <div className="text-sm font-medium ">Status</div>
                  </div>
                  <div className="mt-2">
                    <Select
                      onChange={(value) => {
                        const body = {
                          statusId: value,
                        };
                        updateProduct(body);
                      }}
                      className="w-full"
                      defaultValue={productDetails?.statusId}
                      size="large"
                    >
                      <Option value="PROD_ACTIVE">Active</Option>
                      <Option value="PROD_DRAFT">Draft</Option>
                    </Select>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex justify-between">
                    <div className="text-sm font-medium ">Tags</div>
                  </div>
                  <div className="mt-2">
                    <Select
                      onChange={(value) => {
                        const body = {
                          productTags: value,
                          updateTag: true,
                        };
                        updateProduct(body);
                      }}
                      getPopupContainer={(trigger) => trigger.parentNode}
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option?.children?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0
                      }
                      defaultValue={productDetails?.productTags}
                      size="large"
                      mode="tags"
                      tokenSeparators={[',']}
                      className="w-full"
                    >
                      {tags?.map((item) => (
                        <Option key={item?.tagId} value={item?.tagName} label={item?.tagName}>
                          {item?.tagName}
                        </Option>
                      ))}
                    </Select>
                  </div>
                </div>
              </div>
            </Skeleton>
          </Col>
        </Row>
      </div>

      <div className="h-32"></div>
    </div>
  );
};

export default connect(({ product, loading }) => ({
  productDetails: product.productDetails,
  categories: product.categories,
  collections: product.collections,
  tags: product.tags,
  loading: loading.effects['product/getProductDetails'],
  productAttachments: product.productAttachments,
  loadingAttachments: loading.effects['product/getProductAttachments'],
}))(ViewService);
