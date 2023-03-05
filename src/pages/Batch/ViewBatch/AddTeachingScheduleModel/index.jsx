import React, { useEffect, useState } from 'react';
import { Button, Modal, Select, message } from 'antd';
import { connect, useParams } from 'umi';
import { UserAddOutlined } from '@ant-design/icons';

const AddTeachingScheduleModel = ({
  isAddTeachingScheduleModel,
  setIsAddTeachingScheduleModel,
  getTeachingScheduleList,
  courseId,
  dispatch,
  getTeachingSchedule,
}) => {
  const { batchId } = useParams();
  const [timesheetId, setTimesheetId] = useState();
  const TeachingScheduleListGet = () => {
    dispatch({
      type: 'batch/getTeachingScheduleList',
      payload: {
        query: {
          batchId,
          courseId,
        },
      },
    });
  };
  const AddTeachingSchedule = () => {
    dispatch({
      type: 'batch/assignTeachingSchedule',
      payload: {
        pathParams: { batchId, timesheetId },
      },
    }).then((res) => {
      if (res?.responseMessage === 'success') {
        message.success('Teaching schedule created successfully');
        getTeachingSchedule();
        setIsAddTeachingScheduleModel(false);
      } else {
        message.error('Something went wrong');
      }
    });
  };
  useEffect(() => {
    if (isAddTeachingScheduleModel) {
      TeachingScheduleListGet();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAddTeachingScheduleModel]);

  return (
    <div>
      <Modal
        title={
          <div className="flex items-center gap-1.5" style={{ color: '#1B568F' }}>
            <UserAddOutlined className="text-xl" />
            <h1 style={{ color: '#1B568F' }} className="m-0">
              Add teaching schedule to batch
            </h1>
          </div>
        }
        visible={isAddTeachingScheduleModel}
        onCancel={() => {
          setIsAddTeachingScheduleModel(false);
        }}
        destroyOnClose
        bodyStyle={{ maxHeight: '60vh', overflow: 'auto' }}
        footer={
          <div className="flex justify-end ">
            <Button type="primary" onClick={() => AddTeachingSchedule()}>
              Add
            </Button>
          </div>
        }
        maskClosable={false}
      >
        <Select
          placeholder="select teaching schedule"
          className="w-full"
          size="large"
          showSearch
          optionFilterProp="filter"
          filterOption
          mode="multiple"
          onSelect={(e) => setTimesheetId(e)}
        >
          {getTeachingScheduleList?.records?.map((item) => (
            <Select.Option filter={item?.name} key={item?.timesheetId} value={item?.timesheetId}>
              {item?.name}
            </Select.Option>
          ))}
        </Select>
      </Modal>
    </div>
  );
};

export default connect(({ batch, loading }) => ({
  getTeachingScheduleList: batch?.getTeachingScheduleList,
  loading: loading?.effects['batch/addTeachersToBatch'],
}))(AddTeachingScheduleModel);
