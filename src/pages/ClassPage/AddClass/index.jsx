import React, { useState, useEffect } from 'react';
import Page from '@/components/Page';

import { Form, Divider, Button, message, Spin } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import Card from '@/components/Structure/Card';
import ClassDetails from './ClassDetails';
import FixedFooter from '@/components/FixedFooter';
import { connect, history, useParams } from 'umi';
import Breadcrumbs from '@/components/BreadCrumbs';

const AddClass = ({ dispatch, loading, fetching, classRecordById }) => {
  const [allFormValues, setAllFormValues] = useState();
  const [enableCampus, setEnableCampus] = useState(null);
  const [form] = useForm();

  const { classId } = useParams();
  const { classViewId } = useParams();

  const onClassFinishHandler = (values) => {
    const data = {
      ...values,
      facilities: values?.facilities?.map((item) => {
        return item === 'OTHERS' ? { id: item, value: values?.value } : { id: item };
      }),
    };
    if (values?.noOfComputers) {
      data.numberOfEquipments = [
        { attrName: 'Computers', attrVal: values?.noOfComputers },
        ...(data?.numberOfEquipments || []),
      ];
      delete data.noOfComputers;
    }
    if (values?.noOfPrinters) {
      data.numberOfEquipments = [
        { attrName: 'Printers', attrVal: values?.noOfPrinters },
        ...(data?.numberOfEquipments || []),
      ];
      delete data.noOfPrinters;
    }
    if (values?.noOfLaptops) {
      data.numberOfEquipments = [
        { attrName: 'laptops', attrVal: values?.noOfLaptops },
        ...(data?.numberOfEquipments || []),
      ];
      delete data.noOfLaptop;
    }

    if (classId) {
      // updating class
      dispatch({
        type: 'classDetails/updateClass',
        payload: { body: data, pathParams: { classId } },
      })
        .then(() => {
          message.success('Class updated successfully');
          history.push('/classes');
        })
        .catch(() => {});
    } else {
      // Create class
      dispatch({
        type: 'classDetails/addClass',
        payload: { body: data },
      }).then((res) => {
        if (res.responseMessage === 'success') {
          message.success('Class added successfully');
          history.push('/classes');
        } else {
          message.error('Something went wrong');
        }
      });
    }
  };

  useEffect(() => {
    if (classId) {
      dispatch({
        type: 'classDetails/getClassById',
        payload: {
          pathParams: {
            classId,
          },
        },
      }).then((res) => {
        setEnableCampus(Boolean(res?.campusName));
        form.setFieldsValue({
          ...res,
          facilities: res?.facilities?.map((fac) => fac?.facilityTypeId),
        });
      });
    }
    if (classViewId) {
      dispatch({
        type: 'classDetails/getClassById',
        payload: {
          pathParams: {
            classId: classViewId,
          },
        },
      }).then((res) => {
        setEnableCampus(Boolean(res?.campusName));
        form.setFieldsValue({
          ...res,
          facilities: res?.facilities?.map((fac) => fac?.facilityTypeId),
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId, dispatch, classViewId]);

  return (
    <Spin spinning={!!fetching}>
      <div className="container mx-auto">
        <Page
          title={(classId && 'Edit class') || (classViewId && 'View class') || 'Add class'}
          breadcrumbs={
            <Breadcrumbs
              path={[
                {
                  name: 'Dashboard',
                  path: '/dashboard',
                },
                {
                  name: 'Classes',
                  path: '/classes',
                },
                {
                  name: (classId && classRecordById?.name) || (classViewId && 'View') || 'New',
                  path: '#',
                },
              ]}
            />
          }
        >
          <Form
            form={form}
            onFinish={onClassFinishHandler}
            onValuesChange={(_, allValues) => {
              setAllFormValues({ ...allValues });
            }}
          >
            <Card>
              <h2 className="p-5 text-xl font-semibold text-gray-800">Class details</h2>
              <Divider style={{ marginTop: '0' }} />
              <Card.Section>
                <ClassDetails
                  enableCampus={enableCampus}
                  setEnableCampus={setEnableCampus}
                  allFormValues={allFormValues}
                  form={form}
                  classViewId={classViewId}
                />
              </Card.Section>
            </Card>
            {!classViewId && (
              <FixedFooter classes="text-right">
                <div className="w-full ">
                  <Button
                    loading={loading}
                    type="primary"
                    htmlType="submit"
                    size="large"
                    disabled={classViewId && true}
                  >
                    {classId ? 'Update class' : 'Create class'}
                  </Button>
                </div>
              </FixedFooter>
            )}
          </Form>
        </Page>
      </div>
    </Spin>
  );
};

const mapStateToProps = ({ loading, classDetails }) => ({
  loading: loading?.effects['classDetails/addClass'],
  fetching: loading.effects['classDetails/getClassById'],
  classRecordById: classDetails.classRecordById,
});

export default connect(mapStateToProps)(AddClass);
