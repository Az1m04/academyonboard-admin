import React, { useEffect, useState } from 'react';
import { Avatar, Modal, Select, Button, Spin, Form } from 'antd';
import { connect, useParams } from 'umi';
import { getInitials } from '@/utils/common';
import { debounce } from 'lodash-es';
import style from './index.less';
import { UsergroupAddOutlined } from '@ant-design/icons';

function AddTeacherToBatchModal({
  visible,
  setVisible,
  dispatch,
  primaryColor,
  fetching,
  loading,
  trainersOfCurrentBatch,
}) {
  const [form] = Form.useForm();
  const [teachers, setTeachers] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const { batchId } = useParams();
  const getTeachers = (keyword) =>
    dispatch({
      type: 'staff/getStaffList',
      payload: {
        query: {
          statusId: 'PARTYINV_ACCEPTED',
          viewSize: 10000,
          batchId,
          keyword,
        },
        pathParams: { batchId },
      },
    }).then((res) => {
      const idsOfPrevTrainer = trainersOfCurrentBatch?.map((trainer) => trainer?.id);
      // remove  trainer already in the batch
      setStaffList({
        records: res?.records?.filter((trainer) => !idsOfPrevTrainer?.includes(trainer?.partyId)),
      });
    });
  const debounceSearch = debounce(getTeachers, 400);

  useEffect(() => {
    if (visible) getTeachers('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const handleAddTeachersToBatch = (values) => {
    const body = values?.teachers?.map((teacher) => ({ id: teacher }));
    dispatch({
      type: 'batch/addTeachersToBatch',
      payload: {
        body,
        pathParams: { batchId },
      },
    })
      .then(() => {
        form?.resetFields();
        dispatch({
          type: 'batch/getTrainerAssignToBatch',
          payload: { pathParams: { batchId } },
        }).catch(() => {});
        setVisible(false);
      })
      .catch(() => {});
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-1.5" style={{ color: '#1B568F' }}>
          <UsergroupAddOutlined className="text-xl" />
          <h1 style={{ color: '#1B568F' }} className="m-0">
            Add teachers to batch
          </h1>
        </div>
      }
      visible={visible}
      onCancel={() => {
        setVisible(false);
        form?.resetFields();
      }}
      maskClosable={false}
      destroyOnClose
      bodyStyle={{ maxHeight: '60vh', overflow: 'auto' }}
      afterClose={() => {
        setTeachers([]);
        form?.resetFields();
      }}
      footer={
        <div className="flex justify-between ">
          <div>{teachers?.length} Record(s)</div>
          <Button
            type="primary"
            loading={loading}
            onClick={() => {
              form?.submit();
            }}
          >
            Add
          </Button>
        </div>
      }
    >
      <Spin spinning={Boolean(fetching)}>
        <div className={` ${style.overRideSelect} w-full`}>
          <Form form={form} onFinish={(values) => handleAddTeachersToBatch(values)}>
            <p className="font-medium text-gray-900 mt-0 mb-1">Select staff</p>
            <Form.Item
              name="teachers"
              rules={[
                {
                  required: true,
                  message: 'Please select staff',
                },
                () => ({
                  validator(_, value) {
                    if (value?.length + trainersOfCurrentBatch?.length <= 15) {
                      return Promise.resolve();
                      // eslint-disable-next-line no-else-return
                    } else {
                      return Promise.reject(
                        value && new Error("You can't add more than 15 teacher in a batch"),
                      );
                    }
                  },
                }),
              ]}
            >
              <Select
                onChange={(ev) => setTeachers(ev)}
                placeholder="Search teachers"
                mode="multiple"
                showSearch
                filterOption={false}
                onSearch={debounceSearch}
                className="w-full"
                size="large"
              >
                {staffList?.records?.map((teacher) => (
                  <Select.Option key={teacher?.partyId}>
                    <div className="w-full flex">
                      <div>
                        <Avatar style={{ background: primaryColor }} src={teacher?.photoUrl}>
                          {getInitials(teacher?.displayName)}
                        </Avatar>
                      </div>
                      <div className="pl-4 pb-2">
                        <p className="mb-0 ">{teacher?.displayName}</p>
                        <p className="mb-0 text-gray-600">{teacher?.primaryEmail}</p>
                      </div>
                    </div>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </div>
      </Spin>
    </Modal>
  );
}
export default connect(({ batch, settings, loading }) => ({
  primaryColor: settings.primaryColor,
  trainersOfCurrentBatch: batch?.trainersOfCurrentBatch,
  fetching: loading?.effects['batch/getTrainers'],
  loading: loading?.effects['batch/addTeachersToBatch'],
}))(AddTeacherToBatchModal);
