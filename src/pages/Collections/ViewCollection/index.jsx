/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import Breadcrumbs from '@/components/BreadCrumbs';
import { Button, Col, Dropdown, Form, message, Row, Skeleton } from 'antd';
import { CaretDownOutlined, StopOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import Attachments from '@/components/Attachments';
import CheckValidation from '@/components/CheckValidation';
import BasicDetails from '../CreateCollection/BasicDetails';

const ViewCollection = ({
  match,
  dispatch,
  collectionDetails,
  loading,
  updateLoading,
  collectionAttachments,
}) => {
  const [form] = Form.useForm();
  // eslint-disable-next-line no-unused-vars
  const [valuesForm, setValuesForm] = useState();

  const getcollectionDetails = () => {
    dispatch({
      type: 'collection/getCollectionDetails',
      payload: {
        pathParams: {
          id: match.params.id,
        },
      },
    });
  };

  useEffect(() => {
    getcollectionDetails();
  }, []);

  const menu = (
    <div className="bg-white rounded-md shadow">
      <div className="p-2 text-red-600 hover:bg-gray-200 border-b cursor-pointer">
        <StopOutlined /> Archive
      </div>
    </div>
  );

  const updateCollection = (data) => {
    dispatch({
      type: 'collection/updateCollection',
      payload: {
        pathParams: {
          id: match.params.id,
        },
        body: {
          ...data,
          productCategoryTypeId: 'PRODUCT_COLLECTION',
        },
      },
    }).then((res) => {
      if (res) {
        message.success('Collection details updated successfully');
      }
    });
  };

  useEffect(() => {
    if (collectionDetails) {
      form.setFieldsValue({
        name: collectionDetails?.name,
        description: collectionDetails?.description,
      });
    }
  }, [collectionDetails]);

  const onSuccess = () => {
    dispatch({
      type: 'collection/getCollectionDetails',
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

  const removeAttachment = (data) => {
    dispatch({
      type: 'collection/removeAttachment',
      payload: {
        pathParams: {
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
                  name: 'Collections',
                  path: '/collections',
                },
                {
                  name: `${match.params.id}`,
                  path: `/collections/${match.params.id}`,
                },
              ]}
            />
          </div>
        </div>
        <div className="flex">
          <div title="Order id" className="text-2xl text-gray-800 font-semibold">
            <span>{collectionDetails?.name}</span>
          </div>
          <div title="Order date" className="text-sm ml-4 text-gray-600 font-semibold mt-3">
            <span>
              Created on {dayjs(collectionDetails?.createdAt).format('MMM D, YYYY h:mm A')}
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
              <CheckValidation show={collectionDetails}>
                <Form
                  onValuesChange={(values) => setValuesForm(values)}
                  form={form}
                  onFinish={(values) => {
                    updateCollection(values);
                  }}
                  layout="vertical"
                  colon={false}
                  hideRequiredMark
                >
                  <div className="bg-white p-4 rounded-md shadow">
                    <BasicDetails form={form} />
                    <div className="w-full flex justify-end">
                      <Button loading={updateLoading} htmlType="submit" type="primary">
                        Update
                      </Button>
                    </div>
                  </div>
                </Form>
              </CheckValidation>
            </Skeleton>

            <Attachments
              onSuccess={onSuccess}
              id={match.params.id}
              loadingAttachments={loading}
              attachments={collectionAttachments}
              type="products/categories"
              removeAttachment={removeAttachment}
            />
          </Col>
          <Col xl={8} lg={10} md={24} sm={24} xs={24}></Col>
        </Row>
      </div>

      <div className="h-32"></div>
    </div>
  );
};

export default connect(({ collection, loading }) => ({
  collectionDetails: collection.collectionDetails,
  collectionAttachments: collection.collectionAttachments,
  loading: loading.effects['collection/getCollectionDetails'],
  updateLoading: loading.effects['collection/updateCollection'],
}))(ViewCollection);
