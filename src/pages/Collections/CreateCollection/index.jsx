import Breadcrumbs from '@/components/BreadCrumbs';
import CardSection from '@/components/CardSection';
import FixedFooter from '@/components/FixedFooter';
import Page from '@/components/Page';
import ProductMedia from '@/pages/Products/NewProduct/ProductMedia';
import { Button, Form, message, notification } from 'antd';
import React, { useState } from 'react';
import { connect } from 'umi';
import BasicDetails from './BasicDetails';

const CreateCollection = ({ dispatch, history }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);

  const attachDocuments = (id) =>
    Promise.all(
      fileList.map((info) => {
        const data = new FormData();
        data.append('file', info);
        return dispatch({
          type: 'collection/attachDocuments',
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
        title="New collection"
        breadcrumbs={
          <Breadcrumbs
            path={[
              {
                name: 'Collections',
                path: '/collections',
              },
              {
                name: 'New collection',
                path: '/collections/new',
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
              productCategoryTypeId: 'PRODUCT_COLLECTION',
            };

            if (fileList?.length > 0) {
              setLoading(true);

              dispatch({
                type: 'collection/createCollection',
                payload: {
                  body,
                },
              }).then((response) => {
                console.log(response, 'res');
                if (response?.res?.productCategoryId) {
                  attachDocuments(response?.res?.productCategoryId).then((resp) => {
                    if (resp) {
                      setLoading(false);
                      message.success('Collection created successfully');
                      history.push('/collections');
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
                <div className="text-blue-900 font-semibold text-xl">Basic Details</div>
                <div className="text-gray-600">
                  <p className="mt-2">Enter basic details of collections.</p>
                </div>
              </div>
            }
            rightContent={
              <div className="bg-white p-4 rounded-md shadow">
                <BasicDetails form={form} />
              </div>
            }
          />
          <CardSection
            className="mt-4"
            leftContent={
              <div className="pr-8 ">
                <div className="text-blue-900 font-semibold text-xl">Collection image</div>
                <div className="text-gray-600">
                  <p className="mt-2">Upload the collection image here.</p>
                </div>
              </div>
            }
            rightContent={<ProductMedia fileList={fileList} setFileList={setFileList} />}
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

export default connect(({ user }) => ({
  currentUser: user.currentUser,
}))(CreateCollection);
