import Breadcrumbs from '@/components/BreadCrumbs';
import FixedFooter from '@/components/FixedFooter';
import Page from '@/components/Page';
import { Button, Divider, Form, message, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import BankDetails from './BankDetails';
import PointOfContact from './PointOfContact';
import ServiceInformation from './ServiceInformation';
import SubBranchDetails from './SubBranchDetails';
import { connect, useParams, history } from 'umi';
import UploadDocuments from './UploadDocuments';

const AddSubBranch = ({ dispatch, loadData, loading, singleSubBranch, putLoading }) => {
  const [form] = Form.useForm();
  const { subBranchId } = useParams();
  const [onCountryChange, setOnCountryChange] = useState('IN');
  const [code, setCode] = useState('');
  const [contents, setContents] = useState([]);
  const [previewModal, setPreviewModal] = useState(false);
  const [documentUrl, setDocumentUrl] = useState({ url: null, name: null, typeId: null });

  const [lookingFor, setLookingFor] = useState();
  const onFinish = (values) => {
    const body = { parentPartyId: 'OMG' };
    const contentData = contents?.map((item) => {
      if (item?.encodedFile)
        return { typeId: item?.typeId, encodedFile: item?.encodedFile, name: item?.name };
      // eslint-disable-next-line no-else-return
      else {
        return { id: item?.id, typeId: item?.typeId };
      }
    });
    body.clientName = values?.clientName;
    body.address = {
      ...values?.primaryAddress,
      id: singleSubBranch?.address?.id,
    };
    body.primaryEmail = values?.primaryEmail;
    body.primaryPhone = {
      id: singleSubBranch?.primaryPhone?.id,
      phone: values?.primaryPhone?.phone?.split('').slice(3).join(''),
      areaCode: values?.primaryPhone?.phone?.split('').slice(0, 3).join(''),
      countryCode: values?.primaryPhone?.countryCode,
    };
    body.bankDetail = {
      contents: contentData,
      ...values?.bankDetail,
      id: singleSubBranch?.bankDetail?.id,
    };
    body.lookingFor = [values?.lookingFor];
    body.clientPoc = {
      ...values?.clientPoc,
      id: singleSubBranch?.clientPoc?.id,
      primaryPhone: {
        id: singleSubBranch?.clientPoc?.primaryPhone?.id,
        phone: values?.phone?.phone?.split('').slice(3).join(''),
        areaCode: values?.phone?.phone?.split('').slice(0, 3).join(''),
        countryCode: values?.phone?.countryCode,
      },
      alternatePhone: {
        id: singleSubBranch?.clientPoc?.alternatePhone?.id,
        phone: values?.alternatePhone?.phone?.split('').slice(3).join(''),
        areaCode: values?.alternatePhone?.phone?.split('').slice(0, 3).join(''),
        countryCode: values?.alternatePhone?.countryCode,
      },
    };
    body.purpose = 'SOFTWARE';
    if (body.lookingFor?.find((i) => i === 'Service And Software')) {
      body.lookingFor = [...values?.services];
      delete body?.services;
      body.purpose = 'SERVICES';
    }
    if (subBranchId) {
      dispatch({
        type: 'subBranch/putSubBranch',
        payload: { body, pathParams: { subBranchId } },
      })
        .then((res) => {
          if (res?.id) {
            history.push('/sub-branches/all');
            message.success('SubBranch updated successfully');
          } else {
            message.error('Something went wrong');
          }
        })
        .catch((err) => {
          if (err) {
            message.error('Something went wrong');
          }
        });
    } else {
      dispatch({ type: 'subBranch/postSubBranch', payload: { body } })
        .then((res) => {
          if (res?.id) {
            history.push('/sub-branches/all');
            message.success('SubBranch created successfully');
          } else {
            message.error('Something went wrong');
          }
        })
        .catch((err) => {
          if (err) {
            message.error('Something went wrong');
          }
        });
    }
  };
  const getSingleSubBranchDetail = () => {
    dispatch({
      type: 'subBranch/getSingleSubBranch',
      payload: { pathParams: { subBranchId } },
    })
      .then((res) => {
        if (res?.id) {
          setOnCountryChange(res?.address?.countryCode);
          if (res?.bankDetail?.contents) {
            setContents([...res?.bankDetail?.contents]);
          }
          const newObj = {};
          if (res?.lookingFor?.length > 1) {
            newObj.lookingFor = 'Service And Software';
            setLookingFor('Service And Software');
            newObj.services = res?.lookingFor?.map((purpose) => purpose);
          }
          form.setFieldsValue({
            ...newObj,
            clientName: res?.clientName,
            bankDetail: { ...res?.bankDetail },
            primaryEmail: res?.email?.email,
            clientPoc: {
              primaryEmail: res?.clientPoc?.email?.email,
              ...res?.clientPoc,
            },
            phone: {
              phone:
                res?.clientPoc?.primaryPhone &&
                `${res?.clientPoc?.primaryPhone?.areaCode}${res?.clientPoc?.primaryPhone?.phone}`,
              countryCode:
                res?.clientPoc?.primaryPhone && res?.clientPoc?.primaryPhone?.countryCode,
            },
            primaryAddress: {
              ...res?.address,
              addressLine1: res?.address?.addressLine1,
              stateCode: res?.address?.stateCode,
              countryCode: res?.address?.countryCode,
            },
            alternatePhone: {
              phone:
                res?.clientPoc?.alternatePhone &&
                `${res?.clientPoc?.alternatePhone?.areaCode}${res?.clientPoc?.alternatePhone?.phone}`,
              countryCode:
                res?.clientPoc?.alternatePhone && res?.clientPoc?.alternatePhone?.countryCode,
            },
            primaryPhone: {
              phone:
                res?.primaryPhone && `${res?.primaryPhone?.areaCode}${res?.primaryPhone?.phone}`,
              countryCode: res?.primaryPhone && res?.primaryPhone?.countryCode,
            },
          });
        } else {
          message.error('Something went wrong');
        }
      })
      .catch((err) => {
        if (err) message.error('Something went wrong');
      });
  };
  useEffect(() => {
    if (subBranchId) getSingleSubBranchDetail();
    else
      dispatch({
        type: 'subBranch/setStates',
        payload: {
          singleSubBranch: null,
        },
        key: 'singleSubBranch',
      });
  }, [subBranchId]);
  return (
    <div className="mt-8 ">
      <Page
        title={`${subBranchId ? 'Update sub branch' : 'Add sub branch'}`}
        PrevNextNeeded="N"
        breadcrumbs={
          <Breadcrumbs
            path={[
              {
                name: 'Dashboard',
                path: '/dashboard',
              },
              {
                name: 'Sub branch list',
                path: '/sub-branches/active',
              },
              {
                name: 'new',
                path: '#',
              },
            ]}
          />
        }
      >
        <Spin spinning={Boolean(loading)}>
          <Form
            form={form}
            onFinish={onFinish}
            hideRequiredMark
            autoComplete="off"
            name="AddClientLead"
          >
            <SubBranchDetails
              form={form}
              onCountryChange={onCountryChange}
              setOnCountryChange={setOnCountryChange}
            />
            <PointOfContact form={form} setCode={setCode} code={code} />
            <div className="bg-white rounded-lg mb-5 shadow">
              <p className="text-base text-gray-800 font-semibold px-5 pt-5">Bank details</p>
              <Divider />
              <div className="px-5 pb-3">
                <BankDetails form={form} setContents={setContents} contents={contents} />
              </div>
            </div>
            <div className="bg-white rounded-lg mb-5 shadow">
              <p className="text-base text-gray-800 font-semibold px-5 pt-5">Upload documents</p>
              <Divider />
              <div className="px-5 pb-3">
                <UploadDocuments
                  form={form}
                  setContents={setContents}
                  contents={contents}
                  previewModal={previewModal}
                  setPreviewModal={setPreviewModal}
                  documentUrl={documentUrl}
                  setDocumentUrl={setDocumentUrl}
                />
              </div>
            </div>
            <div className="bg-white rounded-lg mb-5 shadow">
              <p className="text-base text-gray-800 font-semibold px-5 pt-5">Service information</p>
              <Divider />
              <div className="px-5 pb-3">
                <ServiceInformation
                  form={form}
                  lookingFor={lookingFor}
                  setLookingFor={setLookingFor}
                />
              </div>
            </div>
            <FixedFooter classes="text-right">
              <div
                className="flex m-auto"
                style={{
                  maxWidth: '80rem',
                }}
              >
                <div className="w-full ">
                  <Button
                    type="primary"
                    onClick={() => form?.submit()}
                    size="large"
                    loading={loadData || putLoading}
                  >
                    {`${subBranchId ? 'Update sub branch' : 'Add sub branch'}`}
                  </Button>
                </div>
              </div>
            </FixedFooter>
          </Form>
        </Spin>
      </Page>
    </div>
  );
};

export default connect(({ loading, subBranch }) => ({
  loadData: loading?.effects['subBranch/postSubBranch'],
  loading: loading?.effects['subBranch/getSingleSubBranch'],
  singleSubBranch: subBranch?.singleSubBranch,
  putLoading: loading?.effects['subBranch/putSubBranch'],
}))(AddSubBranch);
