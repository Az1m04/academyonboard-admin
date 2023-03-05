/* eslint-disable func-names */
import Breadcrumbs from '@/components/BreadCrumbs';
import CardSection from '@/components/CardSection';
import FixedFooter from '@/components/FixedFooter';
import Page from '@/components/Page';
import BasicProductDetails from '@/pages/Products/NewProduct/BasicProductDetails';
import ProductCollections from '@/pages/Products/NewProduct/ProductCollections';
import ProductMedia from '@/pages/Products/NewProduct/ProductMedia';
import ProductStatus from '@/pages/Products/NewProduct/ProductStatus';
import { decodeDollarsToDigits } from '@/utils/utils';
import { Button, Form, message, notification } from 'antd';
import React, { useState } from 'react';
import { connect } from 'umi';
import ServicePricing from './ServicePricing';

const NewService = ({ dispatch, history }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);

  const attachDocuments = (id) =>
    Promise.all(
      fileList.map((info) => {
        const data = new FormData();
        data.append('file', info);
        return dispatch({
          type: 'service/attachServiceDocuments',
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
        title="New service"
        breadcrumbs={
          <Breadcrumbs
            path={[
              {
                name: 'Services',
                path: '/services',
              },
              {
                name: 'New service',
                path: '/services/new',
              },
            ]}
          />
        }
      >
        <Form
          form={form}
          hideRequiredMark
          layout="vertical"
          colon={false}
          onFinish={(values) => {
            const body = {
              name: values.name,
              description: values.description,
              price: values?.price ? parseFloat(decodeDollarsToDigits(values?.price)) : undefined,
              compareAtPrice: values?.compareAtPrice
                ? parseFloat(decodeDollarsToDigits(values?.compareAtPrice))
                : undefined,
              quantityUomId: values?.quantityUomId,
              gst: values.gst,
              productCollections: values.productCollections,
              productTags: values.productTags,
              hsn: values.hsn,
              statusId: values.statusId,
              categoryId: values.categoryId,
              serviceModeId: values.serviceModeId,
              productType: 'SERVICE_PRODUCT',
            };

            if (fileList?.length > 0) {
              setLoading(true);
              dispatch({
                type: 'service/createService',
                payload: {
                  body,
                },
              }).then((response) => {
                if (response?.res?.productId) {
                  attachDocuments(response?.res?.productId).then((resp) => {
                    if (resp) {
                      setLoading(false);
                      message.success('Service created successfully');
                      history.push('/services');
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
                <BasicProductDetails type="Service" placeholder="Service title" />
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
                    Fill the service price, compare price and cost per hour here.
                  </p>
                </div>
              </div>
            }
            rightContent={
              <div className="bg-white p-4 rounded-md shadow">
                <ServicePricing form={form} />
              </div>
            }
          />
          <CardSection
            className="mt-4"
            leftContent={
              <div className="pr-8 ">
                <div className="text-blue-900 font-semibold text-xl">Category</div>
                <div className="text-gray-600">
                  <p className="mt-4">Select service status and category here.</p>
                </div>
              </div>
            }
            rightContent={<ProductStatus productCategoryTypeId="SERVICE_CATEGORY" />}
          />
          <CardSection
            className="mt-4"
            leftContent={
              <div className="pr-8 ">
                <div className="text-blue-900 font-semibold text-xl">Colections</div>
                <div className="text-gray-600">
                  <p className="mt-4">Select service collections and add tags here.</p>
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
  loading: loading.effects['service/createService'],
}))(NewService);
