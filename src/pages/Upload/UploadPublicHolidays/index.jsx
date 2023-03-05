import React, { useState } from 'react';
import { connect } from 'umi';
import Page from '@/components/Page';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Button, notification, Space, Steps } from 'antd';
import styles from './index.less';
import Step1Upload from './Step1Upload';
import Step2UploadedList from './Step2UploadedList';
import Step3Done from './Step3Done';
import BreadCrumbs from '@/components/BreadCrumbs';

const UploadPublicHolidays = ({ dispatch, loading, uploadPublicHolidays }) => {
  const { Step } = Steps;
  const [step, setStep] = useState(0);
  const filterData = uploadPublicHolidays?.records?.filter((inventory) => !inventory?.isError);

  const finalBulkTemplateUpload = () => {
    if (uploadPublicHolidays?.records?.length !== 0 || filterData?.length !== 0) {
      dispatch({
        type: 'endUser/uploadCorrectPublicHolidays',
        payload: {
          body: [...filterData],
        },
      })
        .then((res) => {
          if (res) {
            setStep(2);
            notification.success({
              message: 'Great Job!',
              description: 'You have Successfully Bulk import enduser.',
            });
          }
        })
        .catch((err) => {
          notification.error({
            message: 'Oops some error occurred while uploading!',
            description: err?.data?.message,
          });
        });
    } else {
      dispatch({
        type: 'endUser/uploadPublicHolidays',
        payload: {
          body: {
            records: filterData,
            totalRecords: uploadPublicHolidays?.summary?.totalRecords,
            errorRecords: uploadPublicHolidays?.summary?.errorRecords,
          },
        },
      })
        .then((res) => {
          if (res) {
            setStep(2);
            notification.success({
              message: 'Great Job!',
              description: 'You have Successfully Bulk import enduser.',
            });
          }
        })
        .catch((err) => {
          notification.error({
            message: 'Oops some error occurred while uploading!',
            description: err?.data?.message,
          });
        });
    }
  };
  return (
    <Page
      title="Upload public holidays"
      PrevNextNeeded="N"
      breadcrumbs={
        <BreadCrumbs
          path={[
            {
              name: 'Dashboard',
              path: '/dashboard',
            },

            {
              name: 'Upload public holidays',
            },
          ]}
        />
      }
    >
      <div className="bg-white rounded-lg shadow-lg p-6 overflow-hidden">
        <div className="pt-6  w-full ">
          <div className={`flex justify-center items-center ${styles.stepStyle}`}>
            <Steps size="large" current={step} style={{ width: '700px' }}>
              <Step title="Upload Data" />
              <Step title="Review Records" />
              <Step title="Done" />
            </Steps>
          </div>
          <div className="my-12">
            <div className={step === 0 ? 'visible' : 'hidden'}>
              <Step1Upload step={step} setStep={setStep} />
            </div>
            <div className={step === 1 ? 'visible' : 'hidden'}>
              <Step2UploadedList setStep={setStep} />
            </div>
            <div className={step === 2 ? 'visible' : 'hidden'}>
              <Step3Done setStep={setStep} />
            </div>
            {step === 1 && (
              <div className="flex items-center justify-center">
                <Space size={'large'}>
                  <Button
                    onClick={() => {
                      setStep(0);
                    }}
                    icon={<ArrowLeftOutlined />}
                  >
                    Try Again
                  </Button>
                  <Button
                    disabled={
                      uploadPublicHolidays?.records?.length === 0 ||
                      uploadPublicHolidays === undefined ||
                      filterData?.length === 0 ||
                      filterData === undefined
                    }
                    loading={loading}
                    onClick={() => {
                      finalBulkTemplateUpload();
                    }}
                  >
                    {uploadPublicHolidays?.records?.length === 0 || filterData?.length === 0
                      ? 'Please fill the sheet to proceed...'
                      : 'Import only correct records'}
                    <ArrowRightOutlined />
                  </Button>
                </Space>
              </div>
            )}
          </div>
        </div>
      </div>
    </Page>
  );
};

export default connect(({ endUser, loading }) => ({
  uploadPublicHolidays: endUser.uploadPublicHolidays,
  loading: loading.effects['endUser/uploadPublicHolidays'],
}))(UploadPublicHolidays);
