import React from 'react';
import {
  ClockCircleOutlined,
  FileTextOutlined,
  GroupOutlined,
  RetweetOutlined,
} from '@ant-design/icons';
import {
  Modal,
  Form,
  Row,
  Col,
  Select,
  Input,
  Spin,
  Radio,
  DatePicker,
  TimePicker,
  Button,
  Avatar,
} from 'antd';
import { connect } from 'umi';
import moment from 'moment';
import { ArrowRightShort } from 'react-bootstrap-icons';
import { getInitials } from '@/utils/common';

const { RangePicker } = DatePicker;

function ModalToReplaceTeacher({
  setReplaceModalVisible,
  replaceModalVisible,
  replaceTeacherform,
  freeTeachersList,
  freeTeachersListLoading,
  singleBatchDetail,
  replaceModuleTeacher,
  idTimetable,
  changeTeacherFor,
  setChangeTeacherFor,
  getFreeTeachersList,
  singleSlotLoading,
  dateFilter,
}) {
  const { Option } = Select;
  const replaceFor = [
    { name: 'Today', value: 'TODAY' },
    { name: 'Date', value: 'DATE' },
    { name: 'From-To', value: 'FROM_TO' },
    { name: 'Permanent', value: 'PERMANENT' },
  ];
  return (
    <div>
      <Modal
        title={
          <>
            <span className="flex items-center gap-2">
              <span className="" style={{ color: '#1B568F' }}>
                <RetweetOutlined className=" text-4xl" style={{ color: '#1B568F' }} />
              </span>
              <div className="flex flex-col">
                <span className="font-semibold " style={{ color: '#1B568F' }}>
                  Replace teacher
                </span>
                <span className="font-normal  text-sm" style={{ color: '#1B568F' }}>
                  Replace teacher for permanent or temporary
                </span>
              </div>
            </span>
          </>
        }
        visible={replaceModalVisible}
        onCancel={() => {
          setReplaceModalVisible(false);
          replaceTeacherform?.resetFields();
          setChangeTeacherFor('TODAY');
        }}
        footer={
          <div>
            <Button
              onClick={() => {
                setReplaceModalVisible(false);
                replaceTeacherform?.resetFields();
              }}
            >
              Cancel
            </Button>
            <Button
              key="submit"
              type="primary"
              // loading={Boolean(createModuleSlotLoading)}
              onClick={() => replaceTeacherform.submit()}
            >
              Update Slot
            </Button>
          </div>
        }
      >
        <Spin spinning={Boolean(freeTeachersListLoading) || Boolean(singleSlotLoading)}>
          <Form
            form={replaceTeacherform}
            onFinish={(values) => replaceModuleTeacher(values, idTimetable)}
          >
            <div className="border px-4 py-2 rounded-md  mb-3">
              <div className="flex gap-2">
                <div className="flex gap-1">
                  <GroupOutlined className="mt-1" style={{ color: '#1B568F' }} />
                  <h1 style={{ color: '#1B568F' }} className="font-medium mb-0">
                    Batch:
                  </h1>
                </div>
                <p className="text-gray-500 font-medium m-0">{singleBatchDetail?.name || '--'}</p>
              </div>
              <div className="flex gap-2">
                <div className="flex gap-1">
                  <FileTextOutlined className="mt-1" style={{ color: '#1B568F' }} />
                  <h1 style={{ color: '#1B568F' }} className="font-medium mb-0">
                    Course:
                  </h1>
                </div>
                <p className="text-gray-500 font-medium m-0">
                  {singleBatchDetail?.course?.name || '--'}
                </p>
              </div>
              <div className="flex gap-2">
                <div className="flex gap-1">
                  <ClockCircleOutlined className="mt-1" style={{ color: '#1B568F' }} />
                  <h1 style={{ color: '#1B568F' }} className="font-medium mb-0">
                    Timing:
                  </h1>
                </div>
                <p className="text-gray-500 font-medium m-0">
                  {(singleBatchDetail?.startsAt &&
                    moment(singleBatchDetail?.startsAt).format('hh:mm a')) ||
                    '--'}{' '}
                  to{` `}
                  {(singleBatchDetail?.endsAt &&
                    moment(singleBatchDetail?.endsAt).format('hh:mm a')) ||
                    '--'}
                </p>
              </div>
            </div>
            <Row gutter={16}>
              <Col lg={12} xl={12} md={24} sm={24} xs={24}>
                <span className="block mb-2 font-medium text-gray-800">Module Name</span>
                <Form.Item
                  name="moduleId"
                  rules={[
                    {
                      required: true,
                      message: 'Please select module first',
                    },
                  ]}
                >
                  <Select
                    size="large"
                    disabled
                    placeholder="select module name"
                    getPopupContainer={(node) => node.parentNode}
                  >
                    {singleBatchDetail?.modules?.map((item) => (
                      <Option key={item?.id} value={item?.id}>
                        {item?.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col lg={12} xl={12} md={24} sm={24} xs={24}>
                <span className="block mb-2 font-medium text-gray-800">Module Activity</span>
                <Form.Item
                  name="activityId"
                  rules={[
                    {
                      required: true,
                      message: 'Please select module activity',
                    },
                  ]}
                >
                  <Select
                    size="large"
                    disabled
                    placeholder="select module activity"
                    getPopupContainer={(node) => node.parentNode}
                  >
                    <Option value="TEACHING">Teaching</Option>
                    <Option value="EXTRA_CURRICULUM">Extra Curriculum</Option>
                    <Option value="TEST">Test</Option>
                    <Option value="JUSTIFICATION">justification</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col lg={24} xl={24} md={24} sm={24} xs={24}>
                <div className="flex  cursor-pointer">
                  <div className="w-full">
                    <p className="m-1 font-medium">Start time</p>
                    <Form.Item
                      name={'startTime'}
                      rules={[
                        {
                          required: true,
                          message: 'Please select start time',
                        },
                      ]}
                    >
                      <TimePicker disabled size="large" format="h:mm a" allowClear={false} />
                    </Form.Item>
                  </div>
                  <div className="w-full flex justify-center mt-8">
                    <ArrowRightShort className="text-4xl text-gray-400" />
                  </div>
                  {/* End time */}
                  <div className="w-full">
                    <p className="m-1 font-medium">End time</p>
                    <Form.Item
                      name={'endTime'}
                      rules={[
                        {
                          required: true,
                          message: 'Please select end time',
                        },
                      ]}
                    >
                      <TimePicker size="large" disabled format="h:mm a" allowClear={false} />
                    </Form.Item>
                  </div>
                </div>
              </Col>
              <div className="">
                <p className="m-1 font-medium">Select type</p>
                <Col lg={24} xl={24} md={24} sm={24} xs={24}>
                  <Form.Item name="replaceTypeId" initialValue="TODAY">
                    <Radio.Group
                      onChange={(e) => {
                        replaceTeacherform?.setFieldsValue({ date: undefined, fromTo: undefined });
                        if (e.target.value === 'TODAY' || e.target.value === 'PERMANENT') {
                          setChangeTeacherFor({ type: e.target.value, callApi: true });
                          getFreeTeachersList({
                            filterByStartDate: moment()
                              .add(dateFilter, 'days')
                              .format('YYYY-MM-DD HH:mm:ss'),
                            replaceFor: e.target.value,
                          });
                        } else {
                          setChangeTeacherFor({ type: e.target.value, callApi: false });
                        }
                      }}
                    >
                      {replaceFor?.map((item) => (
                        <Radio key={item?.name} value={item?.value}>
                          {item?.name}
                        </Radio>
                      ))}
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </div>
              {changeTeacherFor?.type === 'DATE' && (
                <>
                  <Col lg={24} xl={24} md={24} sm={24} xs={24}>
                    <Form.Item
                      name="date"
                      rules={[{ required: true, message: 'Please select date' }]}
                    >
                      <DatePicker
                        disabledDate={(current) =>
                          (current && current.valueOf() < moment()) ||
                          current.valueOf() >= moment(singleBatchDetail?.endDate)
                        }
                        onSelect={(e) => getFreeTeachersList({ filterByStartDate: e })}
                        size="large"
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  </Col>
                </>
              )}
              {changeTeacherFor?.type === 'FROM_TO' && (
                <Col lg={24} xl={24} md={24} sm={24} xs={24}>
                  <Form.Item
                    name="fromTo"
                    rules={[{ required: true, message: 'Please select date' }]}
                  >
                    <RangePicker
                      size="large"
                      disabledDate={(current) =>
                        (current && current.valueOf() < moment().subtract(1, 'day')) ||
                        current.valueOf() >= moment(singleBatchDetail?.endDate)
                      }
                      onChange={(e) =>
                        getFreeTeachersList({ filterByStartDate: e[0], filterByEndDate: e[1] })
                      }
                      format="YYYY-MM-DD HH:mm"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
              )}
              {(changeTeacherFor?.type === 'TODAY' && changeTeacherFor?.callApi) ||
              (changeTeacherFor?.type === 'FROM_TO' && changeTeacherFor?.callApi) ||
              (changeTeacherFor?.type === 'DATE' && changeTeacherFor?.callApi) ||
              (changeTeacherFor?.type === 'PERMANENT' && changeTeacherFor?.callApi) ? (
                <>
                  <Col lg={12} xl={12} md={24} sm={24} xs={24}>
                    <span className="block mb-2 font-medium text-gray-800">From</span>
                    <Form.Item name="oldTeacher">
                      <Input
                        size="large"
                        disabled
                        style={{ backgroundColor: 'white', color: 'black' }}
                      />
                    </Form.Item>
                  </Col>
                  <Col lg={12} xl={12} md={24} sm={24} xs={24}>
                    <span className="block mb-2 font-medium text-gray-800">To</span>
                    <Form.Item
                      name={['teacher', 'id']}
                      rules={[
                        {
                          required: true,
                          message: 'Please select teacher',
                        },
                      ]}
                    >
                      <Select
                        size="large"
                        placeholder="select teacher"
                        getPopupContainer={(node) => node.parentNode}
                      >
                        {freeTeachersList?.teachers?.map((item) => (
                          <Option key={item?.id} value={item?.id} item={item}>
                            <div className="flex m-0">
                              <div className="">
                                <div className="m-0 p-0">
                                  <Avatar
                                    style={{ backgroundColor: '#f56a00', fontSize: '12px' }}
                                    size={30}
                                    src={item?.photoUrl}
                                  >
                                    {getInitials(item?.displayName)}
                                  </Avatar>
                                </div>
                              </div>
                              <div className="pl-2 pb-2">
                                <p className="mb-0 capitalize ">{item?.displayName}</p>
                                <p className="mb-0 text-gray-600">{item?.email}</p>
                              </div>
                            </div>
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </>
              ) : null}
            </Row>
          </Form>
        </Spin>
      </Modal>
    </div>
  );
}

export default connect(({ timetable, loading }) => ({
  freeTeachersList: timetable?.freeTeachersList,
  freeTeachersListLoading: loading?.effects['timetable/getFreeTeachers'],
  singleSlotLoading: loading?.effects['timetable/getBatchesModuleSlots'],
}))(ModalToReplaceTeacher);
